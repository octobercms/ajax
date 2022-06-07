import { RequestBuilder } from '../framework/request-builder';

export class Migrate
{
    bind() {
        this.bindRequestFunc();
        this.bindRenderFunc();
        this.bindjQueryEvents();
    }

    bindRequestFunc() {
        var old = $.fn.request;

        $.fn.request = function(handler, option) {
            var options = typeof option === 'object' ? option : {};
            return new RequestBuilder(this.get(0), handler, options);
        }

        $.fn.request.Constructor = RequestBuilder;

        // Basic function
        $.request = function(handler, option) {
            return $(document).request(handler, option);
        }

        // No conflict
        $.fn.request.noConflict = function() {
            $.fn.request = old;
            return this;
        }
    }

    bindRenderFunc() {
        $.fn.render = function(callback) {
            $(document).on('render', callback);
        };
    }

    bindjQueryEvents() {
        this.listenjQueryEvent(document, 'ajax:setup', 'ajaxSetup', ['context']);
        this.listenjQueryEvent(document, 'ajax:before-request', 'oc.beforeRequest', ['context']);
        this.listenjQueryEvent(document, 'ajax:promise', 'ajaxPromise', ['context']);
        this.listenjQueryEvent(document, 'ajax:before-update', 'ajaxBeforeUpdate', ['context', 'data', 'responseCode', 'xhr']);
        this.listenjQueryEvent(document, 'ajax:request-success', 'ajaxSuccess', ['context', 'data', 'responseCode', 'xhr']);
        this.listenjQueryEvent(document, 'ajax:request-complete', 'ajaxComplete', ['context', 'data', 'responseCode', 'xhr']);
        this.listenjQueryEvent(document, 'ajax:after-render', 'ajaxUpdate', ['context', 'data', 'responseCode', 'xhr']);
        this.listenjQueryEvent(document, 'ajax:fail', 'ajaxFail', ['context', 'data', 'responseCode', 'xhr']);
        this.listenjQueryEvent(document, 'ajax:done', 'ajaxDone', ['context', 'data', 'responseCode', 'xhr']);
        this.listenjQueryEvent(document, 'ajax:always', 'ajaxAlways', ['context', 'data', 'responseCode', 'xhr']);
        this.listenjQueryEvent(document, 'ajax:request-error', 'ajaxError', ['context', 'message', 'responseCode', 'xhr']);
        this.listenjQueryEvent(document, 'ajax:before-validate', 'ajaxValidation', ['context', 'message', 'fields']);
        this.listenjQueryEvent(document, 'ajax:before-redirect', 'ajaxRedirect');
        this.listenjQueryEvent(document, 'ajax:before-replace', 'ajaxRedirect');

        this.listenjQueryEvent(window, 'ajax:before-send', 'ajaxBeforeSend', ['context']);
        this.listenjQueryEvent(window, 'ajax:update-complete', 'ajaxUpdateComplete', ['context', 'data', 'responseCode', 'xhr']);
        this.listenjQueryEvent(window, 'ajax:invalid-field', 'ajaxInvalidField', ['element', 'fieldName', 'fieldMessages', 'isFirst']);
        this.listenjQueryEvent(window, 'ajax:confirm-message', 'ajaxConfirmMessage', ['message', 'promise']);
        this.listenjQueryEvent(window, 'ajax:error-message', 'ajaxErrorMessage', ['message']);
    }

    // Private
    listenjQueryEvent(target, jsName, jqName, detailNames = []) {
        var self = this;
        $(target).on(jsName, function(ev) {
            self.triggerjQueryEvent(ev.originalEvent, jqName, detailNames);
        });
    }

    triggerjQueryEvent(ev, eventName, detailNames = []) {
        var jQueryEvent = $.Event(eventName),
            args = this.buildDetailArgs(ev, detailNames);

        $(ev.target).trigger(jQueryEvent, args);

        if (jQueryEvent.isDefaultPrevented()) {
            ev.preventDefault();
        }
    }

    buildDetailArgs(ev, detailNames) {
        var args = [];

        detailNames.forEach(function(name) {
            args.push(ev.detail[name]);
        });

        return args;
    }
}
