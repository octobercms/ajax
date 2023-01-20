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
        // Halt here if beforeUpdate() or data-request-before-update returns false
        if (this.invoke('beforeUpdate', [data, responseCode, xhr]) === false) {
            return;
        }

        // Halt here if the error function returns false
        if (this.invokeFunc('beforeUpdateFunc', data) === false) {
            return;
        }

        // Trigger 'ajaxBeforeUpdate' on the form, halt if event.preventDefault() is called
        if (!this.delegate.applicationAllowsUpdate(data, responseCode, xhr)) {
            return;
        }

        if (this.delegate.options.download && data instanceof Blob) {
            if (this.invoke('handleFileDownload', [data, xhr])) {
                return;
            }
        }

        if (this.delegate.options.flash && data['X_OCTOBER_FLASH_MESSAGES']) {
            for (var type in data['X_OCTOBER_FLASH_MESSAGES']) {
                this.invoke('handleFlashMessage', [data['X_OCTOBER_FLASH_MESSAGES'][type], type]);
            }
        }

        // Proceed with the update process
        var self = this,
            updatePromise = this.invoke('handleUpdateResponse', [data, responseCode, xhr]);

        updatePromise.done(function() {
            self.delegate.notifyApplicationRequestSuccess(data, responseCode, xhr);
            self.invokeFunc('successFunc', data);
        });

        return updatePromise;
    }

    error(data, responseCode, xhr) {
        let errorMsg,
            updatePromise = new Deferred,
            self = this;

        if ((window.ocUnloading !== undefined && window.ocUnloading) || responseCode == SystemStatusCode.userAborted) {
            return;
        }

        // Disable redirects
        this.delegate.toggleRedirect(false);

        // Error 406 is a "smart error" that returns response object that is
        // processed in the same fashion as a successful response.
        if (responseCode == 406 && data) {
            errorMsg = data['X_OCTOBER_ERROR_MESSAGE'];
            updatePromise = this.invoke('handleUpdateResponse', [data, responseCode, xhr]);
        }
        // Standard error with standard response text
        else {
            errorMsg = data;
            updatePromise.resolve();
        }

        updatePromise.done(function() {
            // Capture the error message on the node
            if (self.el !== document) {
                self.el.setAttribute('data-error-message', errorMsg);
            }

            // Trigger 'ajaxError' on the form, halt if event.preventDefault() is called
            if (!self.delegate.applicationAllowsError(data, responseCode, xhr)) {
                return;
            }

            // Halt here if the error function returns false
            if (self.invokeFunc('errorFunc', data) === false) {
                return;
            }

            self.invoke('handleErrorMessage', [errorMsg]);
        });

        return updatePromise;
    }

    complete(data, responseCode, xhr) {
        this.delegate.notifyApplicationRequestComplete(data, responseCode, xhr);
        this.invokeFunc('completeFunc', data);
        this.invoke('markAsUpdating', [false]);
    }

    // Custom function, requests confirmation from the user
    handleConfirmMessage(message) {
        var self = this;
        const promise = new Deferred;
        promise.done(function() {
            self.delegate.sendInternal();
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
            var fieldNameRaw = fieldName.replace(/\.(\w+)/g, '[$1]'),
                fieldNameArr = ('.'+fieldName).replace(/\.(\w+)/g, '[$1]');

            var fieldNameOptions = [
                '[name="'+fieldNameRaw+'"]:not([disabled])',
                '[name="'+fieldNameRaw+'[]"]:not([disabled])',
                '[name$="'+fieldNameArr+'"]:not([disabled])',
                '[name$="'+fieldNameArr+'[]"]:not([disabled])'
            ];

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
    // Using a promisary object here in case injected assets need time to load
    handleUpdateResponse(data, responseCode, xhr) {
        var self = this,
            updateOptions = this.options.update || {},
            updatePromise = new Deferred;

        // Update partials and finish request
        updatePromise.done(function() {
            for (var partial in data) {
                // If a partial has been supplied on the client side that matches the server supplied key, look up
                // it's selector and use that. If not, we assume it is an explicit selector reference.
                let selector = updateOptions[partial] || partial;
                let selectedEl = [];

                // If the update options has a _self, values like true and '^' will resolve to the partial element,
                // these values are also used to make AJAX partial handlers available without performing an update
                if (updateOptions['_self'] && partial == self.options.partial && self.delegate.partialEl) {
                    selector = updateOptions['_self'];
                    selectedEl = [self.delegate.partialEl];
                }
                else {
                    selectedEl = resolveSelectorResponse(selector, '[data-ajax-partial="'+partial+'"]');
                }

                selectedEl.forEach(function(el) {
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
                        self.delegate.notifyApplicationBeforeReplace(el);
                        el.innerHTML = data[partial];
                        runScriptsOnElement(el);
                    }

                    self.delegate.notifyApplicationAjaxUpdate(el, data, responseCode, xhr);
                });
            }

            // Wait for update method to finish rendering from partial updates
            setTimeout(function() {
                self.delegate.notifyApplicationUpdateComplete(data, responseCode, xhr);
                self.invoke('afterUpdate', [data, responseCode, xhr]);
                self.invokeFunc('afterUpdateFunc', data);
            }, 0);
        })

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
        const searchParams = new URLSearchParams(window.location.search)
        for (const key of Object.keys(queryData)) {
            searchParams.set(key, queryData[key]);
        }

        const newUrl = window.location.pathname + '?' + searchParams.toString();
        if (oc.AjaxTurbo) {
            oc.visit(newUrl, { action: 'swap', scroll: false });
        }
        else {
            history.replaceState(null, '', newUrl);
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
