export class Options
{
    constructor(handler, options) {
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
    }

    static fetch(handler, options) {
        return (new this(handler, options)).getRequestOptions();
    }

    // Public
    getRequestOptions() {
        return {
            method: 'POST',
            url: this.options.url ? this.options.url : window.location.href,
            headers: this.buildHeaders(this.handler, this.options),
        };
    }

    // Private
    buildHeaders(handler, options) {
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-OCTOBER-REQUEST-HANDLER': handler,
            'X-OCTOBER-REQUEST-PARTIALS': this.extractPartials(options.update)
        };

        if (!options.files) {
            headers['Content-Type'] = options.bulk
                ? 'application/json'
                : 'application/x-www-form-urlencoded';
        }

        if (options.flash) {
            headers['X-OCTOBER-REQUEST-FLASH'] = 1;
        }

        var xsrfToken = this.getXSRFToken();
        if (xsrfToken) {
            headers['X-XSRF-TOKEN'] = xsrfToken;
        }

        var csrfToken = this.getCSRFToken();
        if (csrfToken) {
            headers['X-CSRF-TOKEN'] = csrfToken;
        }

        return headers;
    }

    extractPartials(update = {}) {
        if (typeof update !== 'object') {
            throw new Error('Invalid update value. The correct format is an object ({...})');
        }

        var result = [];
        for (var partial in update) {
            result.push(partial);
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
