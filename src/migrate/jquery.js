import { RequestBuilder } from '../framework/request-builder';

export class Migrate
{
    bind() {
        this.bindRequestFunc();
        this.bindRenderFunc();
        this.bindJqueryEvents();
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

    bindJqueryEvents() {
        $(document).on('ajax:setup', function(ev) {
            $(ev.target).trigger('ajaxSetup', [ev.detail.context]);
        });

        $(document).on('ajax:before-request', function(ev) {
            $(ev.target).trigger('oc.beforeRequest', [ev.detail.context]);
        });

        $(document).on('ajax:before-send', function(ev) {
            $(ev.target).trigger('ajaxBeforeSend', [ev.detail.context]);
        });

        $(document).on('ajax:promise', function(ev) {
            $(ev.target).trigger('ajaxPromise', [ev.detail.context]);
        });

        $(document).on('ajax:before-update', function(ev) {
            $(ev.target).trigger('ajaxBeforeUpdate', [ev.detail.context, ev.detail.data, ev.detail.responseCode, ev.detail.xhr]);
        });

        $(document).on('ajax:request-success', function(ev) {
            $(ev.target).trigger('ajaxSuccess', [ev.detail.context, ev.detail.data, ev.detail.responseCode, ev.detail.xhr]);
        });

        $(document).on('ajax:request-complete', function(ev) {
            $(ev.target).trigger('ajaxComplete', [ev.detail.context, ev.detail.data, ev.detail.responseCode, ev.detail.xhr]);
        });

        $(document).on('ajax:after-render', function(ev) {
            $(ev.target).trigger('ajaxUpdate', [ev.detail.context, ev.detail.data, ev.detail.responseCode, ev.detail.xhr]);
        });

        $(document).on('ajax:update-complete', function(ev) {
            $(ev.target).trigger('ajaxUpdateComplete', [ev.detail.context, ev.detail.data, ev.detail.responseCode, ev.detail.xhr]);
        });

        $(document).on('ajax:fail', function(ev) {
            $(ev.target).trigger('ajaxFail', [ev.detail.context, ev.detail.data, ev.detail.responseCode, ev.detail.xhr]);
        });

        $(document).on('ajax:done', function(ev) {
            $(ev.target).trigger('ajaxDone', [ev.detail.context, ev.detail.data, ev.detail.responseCode, ev.detail.xhr]);
        });

        $(document).on('ajax:always', function(ev) {
            $(ev.target).trigger('ajaxAlways', [ev.detail.context, ev.detail.data, ev.detail.responseCode, ev.detail.xhr]);
        });

        $(document).on('ajax:request-error', function(ev) {
            $(ev.target).trigger('ajaxError', [ev.detail.context, ev.detail.message, ev.detail.responseCode, ev.detail.xhr]);
        });

        $(document).on('ajax:confirm-message', function(ev) {
            $(ev.target).trigger('ajaxConfirmMessage', [ev.detail.message, ev.detail.promise]);
        });

        $(document).on('ajax:error-message', function(ev) {
            $(ev.target).trigger('ajaxErrorMessage', [ev.detail.message]);
        });

        $(document).on('ajax:before-validate', function(ev) {
            $(ev.target).trigger('ajaxValidation', [ev.detail.context, ev.detail.message, ev.detail.fields]);
        });

        $(document).on('ajax:field-invalid', function(ev) {
            $(ev.target).trigger('ajaxInvalidField', [ev.detail.element, ev.detail.fieldName, ev.detail.fieldMessages, ev.detail.isFirst]);
        });

        $(document).on('ajax:before-redirect', function(ev) {
            $(ev.target).trigger('ajaxRedirect');
        });

        $(document).on('ajax:before-replace', function(ev) {
            $(ev.target).trigger('ajaxRedirect');
        });
    }
}
