import { Options } from "./options";
import { Actions } from "./actions";
import { Data } from "./data";
import { HttpRequest } from "../util/http-request";
import { Deferred } from "../util/deferred";
import { ProgressBar } from "../extras/progress-bar";
import { dispatch } from "../util";

export class Request
{
    constructor(element, handler, options) {
        this.el = element;
        this.handler = handler;
        this.options = { ...this.constructor.DEFAULTS, ...(options || {}) };
        this.context = { el: element, handler: handler, options: this.options };
        this.actions = new Actions(this, this.context, options || {});

        this.progressBar = new ProgressBar;
        this.showProgressBar = () => {
            this.progressBar.show();
        };
    }

    static get DEFAULTS() {
        return {
            handler: null,
            update: {},
            files: false,
            bulk: false,
            progressBarDelay: 500,
            progressBar: null
        }
    }

    start() {
        this.notifyApplicationAjaxSetup();
        this.initOtherElements();

        if (!this.validateClientSideForm() || !this.applicationAllowsRequest()) {
            return;
        }

        // Prepare data
        const dataObj = new Data(this.options.data, this.el, this.formEl);
        let data;
        if (this.options.files) {
            data = dataObj.getAsFormData();
        }
        else if (this.options.bulk) {
            data = dataObj.getAsJsonData();
        }
        else {
            data = dataObj.getAsQueryString();
        }

        // Prepare request
        const { url, headers, method } = Options.fetch(this.handler, this.options);
        this.request = new HttpRequest(this, url, { method, headers, data, trackAbort: true });
        this.promise = new Deferred({ delegate: this.request });
        this.isRedirect = this.options.redirect && this.options.redirect.length > 0;

        // Confirm before sending
        if (this.options.confirm && !this.actions.invoke('handleConfirmMessage', [this.options.confirm])) {
            return;
        }

        // Send request
        var self = this;
        this.notifyApplicationBeforeSend();
        this.notifyApplicationAjaxPromise();
        this.promise
            .fail(function(data, responseCode, xhr) {
                if (!self.isRedirect) {
                    self.notifyApplicationAjaxFail(data, responseCode, xhr);
                }
            })
            .done(function(data, responseCode, xhr) {
                if (!self.isRedirect) {
                    self.notifyApplicationAjaxDone(data, responseCode, xhr);
                }
            })
            .always(function(data, responseCode, xhr) {
                self.notifyApplicationAjaxAlways(data, responseCode, xhr);
            });

        this.request.send();
        return this.promise;
    }

    static send(handler, options) {
        return (new Request(document, handler, options)).start();
    }

    static sendElement(element, handler, options) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        return (new Request(element, handler, options)).start();
    }

    toggleRedirect(redirectUrl) {
        if (!redirectUrl) {
            this.options.redirect = null;
            this.isRedirect = false;
        }
        else {
            this.options.redirect = redirectUrl;
            this.isRedirect = true;
        }
    }

    applicationAllowsRequest() {
        const event = this.notifyApplicationBeforeRequest();
        return !event.defaultPrevented;
    }

    applicationAllowsUpdate(data, responseCode, xhr) {
        const event = this.notifyApplicationBeforeUpdate(data, responseCode, xhr);
        return !event.defaultPrevented;
    }

    applicationAllowsError(message, responseCode, xhr) {
        const event = this.notifyApplicationRequestError(message, responseCode, xhr);
        return !event.defaultPrevented;
    }

    // Application events
    notifyApplicationAjaxSetup() {
        return dispatch('ajax:setup', { target: this.el, detail: { context: this.context } });
    }

    notifyApplicationAjaxPromise() {
        return dispatch('ajax:promise', { target: this.el, detail: { context: this.context } });
    }

    notifyApplicationAjaxFail(data, responseCode, xhr) {
        return dispatch('ajax:fail', { target: this.el, detail: { context: this.context, data, responseCode, xhr } });
    }

    notifyApplicationAjaxDone(data, responseCode, xhr) {
        return dispatch('ajax:done', { target: this.el, detail: { context: this.context, data, responseCode, xhr } });
    }

    notifyApplicationAjaxAlways(data, responseCode, xhr) {
        return dispatch('ajax:always', { target: this.el, detail: { context: this.context, data, responseCode, xhr } });
    }

    notifyApplicationAjaxUpdate(target, data, responseCode, xhr) {
        return dispatch('ajax:update', { target, detail: { context: this.context, data, responseCode, xhr } });
    }

    notifyApplicationBeforeRedirect() {
        return dispatch('ajax:before-redirect', { target: this.el });
    }

    notifyApplicationBeforeRequest() {
        return dispatch('ajax:before-request', { target: this.triggerEl, detail: { context: this.context } });
    }

    notifyApplicationBeforeUpdate(data, responseCode, xhr) {
        return dispatch('ajax:before-update', { target: this.triggerEl, detail: { context: this.context, data, responseCode, xhr } });
    }

    notifyApplicationRequestSuccess(data, responseCode, xhr) {
        return dispatch('ajax:request-success', { target: this.triggerEl, detail: { context: this.context, data, responseCode, xhr } });
    }

    notifyApplicationRequestError(message, responseCode, xhr) {
        return dispatch('ajax:request-error', { target: this.triggerEl, detail: { context: this.context, message, responseCode, xhr } });
    }

    notifyApplicationRequestComplete(data, responseCode, xhr) {
        return dispatch('ajax:request-complete', { target: this.triggerEl, detail: { context: this.context, data, responseCode, xhr } });
    }

    notifyApplicationBeforeValidate(message, fields) {
        return dispatch('ajax:before-validate', { target: this.triggerEl, detail: { context: this.context, message, fields } });
    }

    notifyApplicationBeforeReplace(target) {
        return dispatch('ajax:before-replace', { target });
    }

    // Window-based events
    notifyApplicationBeforeSend() {
        return dispatch('ajax:before-send', { target: window, detail: { context: this.context } });
    }

    notifyApplicationUpdateComplete(data, responseCode, xhr) {
        return dispatch('ajax:update-complete', { target: window, detail: { context: this.context, data, responseCode, xhr } });
    }

    notifyApplicationFieldInvalid(element, fieldName, fieldMessages, isFirst) {
        return dispatch('ajax:invalid-field', { target: window, detail: { element, fieldName, fieldMessages, isFirst } });
    }

    notifyApplicationConfirmMessage(message, promise) {
        return dispatch('ajax:confirm-message', { target: window, detail: { message, promise } });
    }

    notifyApplicationErrorMessage(message) {
        return dispatch('ajax:error-message', { target: window, detail: { message } });
    }

    // HTTP request delegate
    requestStarted() {
        this.toggleLoaderState(true);

        if (this.options.progressBar) {
            this.showProgressBarAfterDelay();
        }
    }

    requestProgressed(progress) {
        this.promise.notify(progress);
    }

    requestCompletedWithResponse(response, statusCode) {
        this.actions.invoke('success', [response, statusCode, this.request.xhr]);
        this.actions.invoke('complete', [response, statusCode, this.request.xhr]);
        this.promise.resolve(response, statusCode, this.request.xhr);
    }

    requestFailedWithStatusCode(statusCode, response) {
        this.actions.invoke('error', [response, statusCode, this.request.xhr]);
        this.actions.invoke('complete', [response, statusCode, this.request.xhr]);
        this.promise.reject(response, statusCode, this.request.xhr);
    }

    requestFinished() {
        this.toggleLoaderState(false);

        if (this.options.progressBar) {
            this.hideProgressBar();
        }
    }

    // Private
    initOtherElements() {
        if (typeof this.options.form === 'string') {
            this.formEl = document.querySelector(this.options.form);
        }
        else if (this.options.form) {
            this.formEl = this.options.form;
        }
        else {
            this.formEl = this.el && this.el !== document ? this.el.closest('form') : null;
        }

        this.triggerEl = this.formEl ? this.formEl : this.el;

        this.loadingEl = typeof this.options.loading === 'string'
            ? document.querySelector(this.options.loading)
            : this.options.loading;
    }

    validateClientSideForm() {
        if (
            this.options.browserValidate &&
            typeof document.createElement('input').reportValidity === 'function' &&
            this.formEl &&
            !this.formEl.checkValidity()
        ) {
            this.formEl.reportValidity();
            return false;
        }

        return true;
    }

    toggleLoaderState(isLoading) {
        if (!this.loadingEl) {
            return;
        }

        if (
            typeof this.loadingEl.show !== 'function' ||
            typeof this.loadingEl.hide !== 'function'
        ) {
            this.loadingEl.style.display = isLoading ? 'block' : 'none';
            return;
        }

        if (isLoading) {
            this.loadingEl.show();
        }
        else {
            this.loadingEl.hide();
        }
    }

    showProgressBarAfterDelay() {
        this.progressBar.setValue(0);
        this.progressBarTimeout = window.setTimeout(this.showProgressBar, this.options.progressBarDelay);
    }

    hideProgressBar() {
        this.progressBar.setValue(100);
        this.progressBar.hide();
        if (this.progressBarTimeout != null) {
            window.clearTimeout(this.progressBarTimeout);
            delete this.progressBarTimeout;
        }
    }
}
