import { AssetManager } from "./asset-manager";
import { SystemStatusCode } from "../util/http-request";
import { Deferred } from "../util/deferred";

export class Actions
{
    constructor(delegate, context, options) {
        this.delegate = delegate;
        this.context = context;
        this.options = options;

        // Allow override to call parent logic
        this.context.success = this.success.bind(this);
        this.context.error = this.error.bind(this);
        this.context.complete = this.complete.bind(this);
    }

    // Options can override all public methods in this class
    invoke(method, args) {
        if (this.options[method]) {
            return this.options[method].apply(this.context, args);
        }

        return this[method](...args);
    }

    // Public
    success(data, responseCode, xhr) {
        // Halt here if beforeUpdate() or data-request-before-update returns false
        if (this.invoke('beforeUpdate', [data, responseCode, xhr]) === false) {
            return;
        }

        // Trigger 'ajaxBeforeUpdate' on the form, halt if event.preventDefault() is called
        if (!this.delegate.applicationAllowsUpdate()) {
            return;
        }

        if (this.delegate.options.useFlash && data['X_OCTOBER_FLASH_MESSAGES']) {
            data['X_OCTOBER_FLASH_MESSAGES'].forEach(function(message, type) {
                this.invoke('handleFlashMessage', [message, type]);
            });
        }

        // Proceed with the update process
        var self = this,
            updatePromise = this.invoke('handleUpdateResponse', [data, responseCode, xhr]);

        updatePromise.done(function() {
            self.delegate.notifyApplicationRequestSuccess(data, responseCode, xhr);
            self.invoke('afterUpdate', [data, responseCode, xhr]);
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
            self.delegate.el !== document && self.delegate.el.setAttribute('data-error-message', errorMsg);

            // Trigger 'ajaxError' on the form, halt if event.preventDefault() is called
            if (!self.delegate.applicationAllowsError()) {
                return;
            }

            self.invoke('handleErrorMessage', [errorMsg]);
        });

        return updatePromise;
    }

    complete(data, responseCode, xhr) {
        this.delegate.notifyApplicationRequestComplete(data, responseCode, xhr);
    }

    beforeUpdate(data, responseCode, xhr) {
    }

    afterUpdate(data, responseCode, xhr) {
    }

    // Custom function, requests confirmation from the user
    handleConfirmMessage(message) {
        var self = this;
        const promise = new Deferred;
        promise.done(function() {
            self.delegate.options.confirm = null;
            self.delegate.request.send();
        });

        const event = this.delegate.notifyApplicationConfirmMessage(message, promise);
        if (event.defaultPrevented) {
            return false;
        }

        if (message) {
            return confirm(message);
        }
    }

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

    // Custom function, display a flash message to the user
    handleFlashMessage(message, type) {}

    // Custom function, redirect the browser to another location
    handleRedirectResponse(url) {
        this.delegate.notifyApplicationBeforeRedirect();
        window.location.assign(url);
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
                const selector = updateOptions[partial] ? updateOptions[partial] : partial;
                const isString = typeof selector === 'string';
                let selectedEl = isString ? document.querySelectorAll(resolveSelectorResponse(selector)) : [selector];

                selectedEl.forEach(function(el) {
                    // Replace With
                    if (isString && selector.charAt(0) === '!') {
                        el.insertAdjacentHTML('afterEnd', data[partial]);
                        el.parentNode.removeChild(el);
                    }
                    // Append
                    else if (isString && selector.charAt(0) === '@') {
                        el.insertAdjacentHTML('beforeEnd', data[partial]);
                    }
                    // Prepend
                    else if (isString && selector.charAt(0) === '^') {
                        el.insertAdjacentHTML('afterBegin', data[partial]);
                    }
                    // Insert
                    else {
                        self.delegate.notifyApplicationBeforeReplace(el);
                        el.innerHTML = data[partial];
                    }

                    self.delegate.notifyApplicationAfterRender(el, data, responseCode, xhr);
                });
            }

            // Wait for update method to finish rendering from partial updates
            setTimeout(function() {
                self.delegate.notifyApplicationUpdateComplete(data, responseCode, xhr);
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
}

function resolveSelectorResponse(selector) {
    if (['!', '@', '^'].indexOf(selector.charAt(0)) !== -1) {
        return selector.substring(1);
    }

    return selector;
}
