export class Options
{
    constructor(handler, options, partialEl) {
        if (!handler) {
            throw new Error('The request handler name is not specified.')
        }

        if (!handler.match(/^(?:\w+\:{2})?on*/)) {
            throw new Error('Invalid handler name. The correct handler name format is: "onEvent".');
        }

        if (typeof FormData === 'undefined') {
            throw new Error('The browser does not support the FormData interface.');
        }

        this.options = options;
        this.handler = handler;
        this.partialEl = partialEl;
    }

    static fetch(handler, options, partialEl) {
        return (new this(handler, options, partialEl)).getRequestOptions();
    }

    // Public
    getRequestOptions() {
        return {
            method: 'POST',
            url: this.options.url ? this.options.url : window.location.href,
            headers: this.buildHeaders(),
            responseType: this.options.download === false ? '' : 'blob'
        };
    }

    // Private
    buildHeaders() {
        const { handler, options, partialEl } = this;
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-OCTOBER-REQUEST-HANDLER': handler
        };

        if (!options.files) {
            headers['Content-Type'] = options.bulk
                ? 'application/json'
                : 'application/x-www-form-urlencoded';
        }

        if (options.flash) {
            headers['X-OCTOBER-REQUEST-FLASH'] = 1;
        }

        if (options.partial) {
            headers['X-OCTOBER-REQUEST-PARTIAL'] = options.partial;
        }

        if (options.update) {
            headers['X-OCTOBER-REQUEST-PARTIALS'] = this.extractPartials(options.update, options.partial);
        }

        var xsrfToken = this.getXSRFToken();
        if (xsrfToken) {
            headers['X-XSRF-TOKEN'] = xsrfToken;
        }

        var csrfToken = this.getCSRFToken();
        if (csrfToken) {
            headers['X-CSRF-TOKEN'] = csrfToken;
        }

        if (options.headers && options.headers.constructor === {}.constructor) {
            Object.assign(headers, options.headers);
        }

        return headers;
    }

    extractPartials(update = {}, selfPartial) {
        if (typeof update !== 'object') {
            throw new Error('Invalid update value. The correct format is an object ({...})');
        }

        var result = [];
        for (var partial in update) {
            if (partial === '_self' && selfPartial) {
                result.push(selfPartial);
            }
            else {
                result.push(partial);
            }
        }
        return result.join('&');
    }

    getCSRFToken() {
        var tag = document.querySelector('meta[name="csrf-token"]');
        return tag ? tag.getAttribute('content') : null;
    }

    getXSRFToken() {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].replace(/^([\s]*)|([\s]*)$/g, '');
                if (cookie.substring(0, 11) == ('XSRF-TOKEN' + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(11));
                    break;
                }
            }
        }
        return cookieValue;
    }
}
