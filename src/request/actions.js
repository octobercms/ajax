import { AssetManager } from "./asset-manager";
import { SystemStatusCode } from "../util/http-request";
import { Deferred } from "../util/deferred";

export var ActionsUpdateMode = {
    replaceWith: 'replace',
    prepend: 'prepend',
    append: 'append',
    update: 'update'
}

export class Actions
{
    constructor(delegate, context, options) {
        this.el = delegate.el;
        this.delegate = delegate;
        this.context = context;
        this.options = options;

        // Allow override to call parent logic
        this.context.start = this.start.bind(this);
        this.context.success = this.success.bind(this);
        this.context.error = this.error.bind(this);
        this.context.complete = this.complete.bind(this);
        this.context.cancel = this.cancel.bind(this);
    }

    // Options can override all public methods in this class
    invoke(method, args) {
        if (this.options[method]) {
            return this.options[method].apply(this.context, args);
        }

        // beforeUpdate and afterUpdate are not part of context
        // since they have no base logic and won't exist here
        if (this[method]) {
            return this[method](...args);
        }
    }

    // Options can also specify a non-interference "func" method, typically
    // used by eval-based data attributes that takes minimal arguments
    invokeFunc(method, data) {
        if (this.options[method]) {
            return this.options[method](this.el, data);
        }
    }

    // Public
    start(xhr) {
        this.invoke('markAsUpdating', [true]);
    }

    success(data, responseCode, xhr) {
        let updatePromise = new Deferred;

        // Halt here if beforeUpdate() or data-request-before-update returns false
        if (this.invoke('beforeUpdate', [data, responseCode, xhr]) === false) {
            return updatePromise;
        }

        // Halt here if the error function returns false
        if (this.invokeFunc('beforeUpdateFunc', data) === false) {
            return updatePromise;
        }

        // Trigger 'ajaxBeforeUpdate' on the form, halt if event.preventDefault() is called
        if (!this.delegate.applicationAllowsUpdate(data, responseCode, xhr)) {
            return updatePromise;
        }

        if (this.delegate.options.download && data instanceof Blob) {
            if (this.invoke('handleFileDownload', [data, xhr])) {
                return updatePromise;
            }
        }

        if (this.delegate.options.flash && data['X_OCTOBER_FLASH_MESSAGES']) {
            for (var type in data['X_OCTOBER_FLASH_MESSAGES']) {
                this.invoke('handleFlashMessage', [data['X_OCTOBER_FLASH_MESSAGES'][type], type]);
            }
        }

        // Browser event has halted the process
        if (data['X_OCTOBER_DISPATCHES'] && this.invoke('handleBrowserEvents', [data['X_OCTOBER_DISPATCHES']])) {
            return updatePromise;
        }

        // Proceed with the update process
        updatePromise = this.invoke('handleUpdateResponse', [data, responseCode, xhr]);

        updatePromise.done(() => {
            this.delegate.notifyApplicationRequestSuccess(data, responseCode, xhr);
            this.invokeFunc('successFunc', data);
        });

        return updatePromise;
    }

    error(data, responseCode, xhr) {
        let errorMsg,
            updatePromise = new Deferred;

        if ((window.ocUnloading !== undefined && window.ocUnloading) || responseCode == SystemStatusCode.userAborted) {
            return updatePromise;
        }

        // Disable redirects
        this.delegate.toggleRedirect(false);

        // Error 406 is a "smart error" that returns response object that is
        // processed in the same fashion as a successful response. The response
        // may also dispatch events which can halt the process
        if (responseCode == 406 && data) {
            if (data['X_OCTOBER_DISPATCHES'] && this.invoke('handleBrowserEvents', [data['X_OCTOBER_DISPATCHES']])) {
                return updatePromise;
            }

            errorMsg = data['X_OCTOBER_ERROR_MESSAGE'];
            updatePromise = this.invoke('handleUpdateResponse', [data, responseCode, xhr]);
        }
        // Standard error with standard response text
        else {
            errorMsg = data;
            updatePromise.resolve();
        }

        updatePromise.done(() => {
            // Capture the error message on the node
            if (this.el !== document) {
                this.el.setAttribute('data-error-message', errorMsg);
            }

            // Trigger 'ajaxError' on the form, halt if event.preventDefault() is called
            if (!this.delegate.applicationAllowsError(data, responseCode, xhr)) {
                return;
            }

            // Halt here if the error function returns false
            if (this.invokeFunc('errorFunc', data) === false) {
                return;
            }

            this.invoke('handleErrorMessage', [errorMsg]);
        });

        return updatePromise;
    }

    complete(data, responseCode, xhr) {
        this.delegate.notifyApplicationRequestComplete(data, responseCode, xhr);
        this.invokeFunc('completeFunc', data);
        this.invoke('markAsUpdating', [false]);
    }

    cancel() {
        this.invokeFunc('cancelFunc');
    }

    // Custom function, requests confirmation from the user
    handleConfirmMessage(message) {
        const promise = new Deferred;
        promise.done(() => {
            this.delegate.sendInternal();
        }).fail(() => {
            this.invoke('cancel');
        });

        const event = this.delegate.notifyApplicationConfirmMessage(message, promise);
        if (event.defaultPrevented) {
            return false;
        }

        if (message) {
            return confirm(message);
        }
    }

    // Custom function, display a flash message to the user
    handleFlashMessage(message, type) {}

    // Custom function, display an error message to the user
    handleErrorMessage(message) {
        const event = this.delegate.notifyApplicationErrorMessage(message);
        if (event.defaultPrevented) {
            return;
        }

        if (message) {
            alert(message);
        }
    }

    // Custom function, focus fields with errors
    handleValidationMessage(message, fields) {
        this.delegate.notifyApplicationBeforeValidate(message, fields);
        if (!this.delegate.formEl) {
            return;
        }

        var isFirstInvalidField = true;
        for (var fieldName in fields) {
            var fieldCheck,
                fieldNameOptions = [];

            // field1[field2][field3]
            fieldCheck = fieldName.replace(/\.(\w+)/g, '[$1]');
            fieldNameOptions.push('[name="'+fieldCheck+'"]:not([disabled])');
            fieldNameOptions.push('[name="'+fieldCheck+'[]"]:not([disabled])');

            // [field1][field2][field3]
            fieldCheck = ('.'+fieldName).replace(/\.(\w+)/g, '[$1]');
            fieldNameOptions.push('[name$="'+fieldCheck+'"]:not([disabled])');
            fieldNameOptions.push('[name$="'+fieldCheck+'[]"]:not([disabled])');

            // field.0 → field[]
            var fieldEmpty = fieldName.replace(/\.[0-9]+$/g, '');
            if (fieldName !== fieldEmpty) {
                fieldCheck = fieldEmpty.replace(/\.(\w+)/g, '[$1]');
                fieldNameOptions.push('[name="'+fieldCheck+'[]"]:not([disabled])');

                fieldCheck = ('.'+fieldEmpty).replace(/\.(\w+)/g, '[$1]');
                fieldNameOptions.push('[name$="'+fieldCheck+'[]"]:not([disabled])');
            }

            var fieldElement = this.delegate.formEl.querySelector(fieldNameOptions.join(', '));
            if (fieldElement) {
                let event = this.delegate.notifyApplicationFieldInvalid(fieldElement, fieldName, fields[fieldName], isFirstInvalidField);
                if (isFirstInvalidField) {
                    if (!event.defaultPrevented) {
                        fieldElement.focus();
                    }
                    isFirstInvalidField = false;
                }
            }
        }
    }

    // Custom function, handle a browser event coming from the server
    handleBrowserEvents(events) {
        if (!events || !events.length) {
            return false;
        }

        let defaultPrevented = false;

        events.forEach(dispatched => {
            const event = this.delegate.notifyApplicationCustomEvent(dispatched.event, {
                ...(dispatched.data || {}),
                context: this.context
            });

            if (event.defaultPrevented) {
                defaultPrevented = true;
            }
        });

        return defaultPrevented;
    }

    // Custom function, redirect the browser to another location
    handleRedirectResponse(href) {
        const event = this.delegate.notifyApplicationBeforeRedirect();
        if (event.defaultPrevented) {
            return;
        }

        if (oc.useTurbo && oc.useTurbo()) {
            oc.visit(href);
        }
        else {
            location.assign(href);
        }
    }

    // Mark known elements as being updated
    markAsUpdating(isUpdating) {
        var updateOptions = this.options.update || {};

        for (var partial in updateOptions) {
            let selector = updateOptions[partial];
            let selectedEl = [];

            if (updateOptions['_self'] && partial == this.options.partial && this.delegate.partialEl) {
                selector = updateOptions['_self'];
                selectedEl = [this.delegate.partialEl];
            }
            else {
                selectedEl = resolveSelectorResponse(selector, '[data-ajax-partial="'+partial+'"]');
            }

            selectedEl.forEach(function(el) {
                if (isUpdating) {
                    el.setAttribute('data-ajax-updating', '');
                }
                else {
                    el.removeAttribute('data-ajax-updating');
                }
            });
        }
    }

    // Custom function, handle any application specific response values
    // Using a promissory object here in case injected assets need time to load
    handleUpdateResponse(data, responseCode, xhr) {
        var updateOptions = this.options.update || {},
            updatePromise = new Deferred;

        // Update partials and finish request
        updatePromise.done(() => {
            for (var partial in data) {
                // If a partial has been supplied on the client side that matches the server supplied key, look up
                // it's selector and use that. If not, we assume it is an explicit selector reference.
                let selector = updateOptions[partial] || partial;
                let selectedEl = [];

                // If the update options has a _self, values like true and '^' will resolve to the partial element,
                // these values are also used to make AJAX partial handlers available without performing an update
                if (updateOptions['_self'] && partial == this.options.partial && this.delegate.partialEl) {
                    selector = updateOptions['_self'];
                    selectedEl = [this.delegate.partialEl];
                }
                else {
                    selectedEl = resolveSelectorResponse(selector, '[data-ajax-partial="'+partial+'"]');
                }

                selectedEl.forEach((el) => {
                    const updateMode = getSelectorUpdateMode(selector, el);

                    // Replace With
                    if (updateMode === ActionsUpdateMode.replaceWith) {
                        const parentNode = el.parentNode;
                        el.insertAdjacentHTML('afterEnd', data[partial]);
                        parentNode.removeChild(el);
                        runScriptsOnFragment(parentNode, data[partial]);
                    }
                    // Append
                    else if (updateMode === ActionsUpdateMode.append) {
                        el.insertAdjacentHTML('beforeEnd', data[partial]);
                        runScriptsOnFragment(el, data[partial]);
                    }
                    // Prepend
                    else if (updateMode === ActionsUpdateMode.prepend) {
                        el.insertAdjacentHTML('afterBegin', data[partial]);
                        runScriptsOnFragment(el, data[partial]);
                    }
                    // Insert
                    else {
                        this.delegate.notifyApplicationBeforeReplace(el);
                        el.innerHTML = data[partial];
                        runScriptsOnElement(el);
                    }

                    this.delegate.notifyApplicationAjaxUpdate(el, data, responseCode, xhr);
                });
            }

            // Wait for update method to finish rendering from partial updates
            setTimeout(() => {
                this.delegate.notifyApplicationUpdateComplete(data, responseCode, xhr);
                this.invoke('afterUpdate', [data, responseCode, xhr]);
                this.invokeFunc('afterUpdateFunc', data);
            }, 0);
        });

        // Handle redirect
        if (data['X_OCTOBER_REDIRECT']) {
            this.delegate.toggleRedirect(data['X_OCTOBER_REDIRECT']);
        }

        if (this.delegate.isRedirect) {
            this.invoke('handleRedirectResponse', [this.delegate.options.redirect]);
        }

        // Handle validation
        if (data['X_OCTOBER_ERROR_FIELDS']) {
            this.invoke('handleValidationMessage', [data['X_OCTOBER_ERROR_MESSAGE'], data['X_OCTOBER_ERROR_FIELDS']]);
        }

        // Handle asset injection
        if (data['X_OCTOBER_ASSETS']) {
            AssetManager.load(data['X_OCTOBER_ASSETS'], function() {
                return updatePromise.resolve();
            });
        }
        else {
            updatePromise.resolve();
        }

        return updatePromise;
    }

    // Custom function, download a file response from the server
    handleFileDownload(data, xhr) {
        if (this.options.browserTarget) {
            window.open(window.URL.createObjectURL(data), this.options.browserTarget);
            return true;
        }

        const fileName = typeof this.options.download === 'string'
            ? this.options.download
            : getFilenameFromHttpResponse(xhr);

        if (fileName) {
            const anchor = document.createElement('a');
            anchor.href = window.URL.createObjectURL(data);
            anchor.download = fileName;
            anchor.target = '_blank';
            anchor.click();
            window.URL.revokeObjectURL(anchor.href);
            return true;
        }
    }

    // Custom function, adds query data to the current URL
    applyQueryToUrl(queryData) {
        const searchParams = new URLSearchParams(window.location.search);
        for (const key of Object.keys(queryData)) {
            const value = queryData[key];
            if (Array.isArray(value)) {
                searchParams.delete(key);
                searchParams.delete(`${key}[]`);
                value.forEach(val => searchParams.append(`${key}[]`, val));
            }
            else if (value === null) {
                searchParams.delete(key);
                searchParams.delete(`${key}[]`);
            }
            else {
                searchParams.set(key, value);
            }
        }

        var newUrl = window.location.pathname,
            queryStr = searchParams.toString();

        if (queryStr) {
            newUrl += '?' + searchParams.toString().replaceAll('%5B%5D=', '[]=')
        }

        if (oc.useTurbo && oc.useTurbo()) {
            oc.visit(newUrl, { action: 'swap', scroll: false });
        }
        else {
            history.replaceState(null, '', newUrl);

            // Tracking referrer since document.referrer will not update
            localStorage.setItem('ocPushStateReferrer', newUrl);
        }
    }
}

function resolveSelectorResponse(selector, partialSelector) {
    // Look for AJAX partial selectors
    if (selector === true) {
        return document.querySelectorAll(partialSelector);
    }

    // Selector is DOM element
    if (typeof selector !== 'string') {
        return [selector];
    }

    // Invalid selector
    if (['#', '.', '@', '^', '!', '='].indexOf(selector.charAt(0)) === -1) {
        return [];
    }

    // Append, prepend, replace with or custom selector
    if (['@', '^', '!', '='].indexOf(selector.charAt(0)) !== -1) {
        selector = selector.substring(1);
    }

    // Empty selector remains
    if (!selector) {
        selector = partialSelector;
    }

    return document.querySelectorAll(selector);
}

function getSelectorUpdateMode(selector, el) {
    // Look at selector prefix
    if (typeof selector === 'string') {
        if (selector.charAt(0) === '!') {
            return ActionsUpdateMode.replaceWith;
        }
        if (selector.charAt(0) === '@') {
            return ActionsUpdateMode.append;
        }
        if (selector.charAt(0) === '^') {
            return ActionsUpdateMode.prepend;
        }
    }

    // Look at element dataset
    if (el.dataset.ajaxUpdateMode !== undefined) {
        return el.dataset.ajaxUpdateMode;
    }

    // Default mode
    return ActionsUpdateMode.update;
}

// Replaces blocked scripts with fresh nodes
function runScriptsOnElement(el) {
    Array.from(el.querySelectorAll('script')).forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes)
            .forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

// Runs scripts on a fragment inside a container
function runScriptsOnFragment(container, html) {
    const div = document.createElement('div');
    div.innerHTML = html;

    Array.from(div.querySelectorAll('script')).forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes)
            .forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        container.appendChild(newScript);
        container.removeChild(newScript);
    });
}

function getFilenameFromHttpResponse(xhr) {
    const contentDisposition = xhr.getResponseHeader('Content-Disposition');
    if (!contentDisposition) {
        return null;
    }

    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/g;
    let match = null;
    let tmpMatch = null;

    while ((tmpMatch = filenameRegex.exec(contentDisposition)) !== null) {
        match = tmpMatch;
    }

    if (match !== null && match[1]) {
        // Decide ASCII or UTF-8 file name
        return (/filename[^;*=\n]*\*=[^']*''/.exec(match[0]) === null)
            ? match[1].replace(/['"]/g, '')
            : decodeURIComponent(match[1].substring(match[1].indexOf("''") + 2));
    }

    return null;
}
