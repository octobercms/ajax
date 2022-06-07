import Request from "../request/namespace";
import { JsonParser } from "./json-parser";

export class RequestBuilder
{
    constructor(element, handler, options) {
        this.options = options || {};
        this.element = element;

        if (!this.element || this.element === document) {
            return Request.send(handler, this.options);
        }

        this.assignOptionEval('beforeUpdate', 'request-before-update');
        this.assignOptionEval('afterUpdate', 'request-after-update');
        this.assignOptionEval('success', 'request-success');
        this.assignOptionEval('error', 'request-error');
        this.assignOptionEval('complete', 'request-complete');

        this.assignOptionData('ajaxGlobal', 'data-ajax-global');
        this.assignOptionData('confirm', 'request-confirm');
        this.assignOptionData('redirect', 'request-redirect');
        this.assignOptionData('loading', 'request-loading');
        this.assignOptionData('flash', 'request-flash');
        this.assignOptionData('files', 'request-files');
        this.assignOptionData('browserValidate', 'browser-validate');
        this.assignOptionData('form', 'request-form');
        this.assignOptionData('url', 'request-url');
        this.assignOptionData('update', 'request-update', true);

        this.assignRequestData();

        if (!handler) {
            handler = element.getAttribute('data-request');
        }

        return Request.sendEl(this.element, handler, this.options);
    }

    static fromElement(element, handler, options) {
        return new RequestBuilder(element, handler, options);
    }

    assignOptionEval(optionName, name) {
        const attrFunc = this.element.getAttribute('data-' + name);
        if (!attrFunc) {
            return;
        }

        const otherFunc = this.options[optionName];

        this.options[optionName] = function(data, responseCode, xhr) {
            // Call eval code, with halting
            var result = (new Function('data', attrFunc)).apply(this.el, [data]);
            if (result === false) {
                return;
            }

            // Call other function from options, if supplied
            if (otherFunc) {
                return otherFunc(data, responseCode, xhr);
            }

            // The other function wasn't supplied, keep logic going
            return this[optionName](data, responseCode, xhr);
        }
    }

    assignOptionData(optionName, name, parseJson = false) {
        const attr = this.element.getAttribute('data-' + name);
        if (!attr) {
            return;
        }

        if (parseJson) {
            this.options[optionName] = JsonParser.paramToObj('data-' + name, attr);
        }
        else {
            this.options[optionName] = attr;
        }
    }

    assignRequestData() {
        var data = this.options.data || {};
        const attr = this.element.getAttribute('data-request-data');
        if (attr) {
            Object.assign(data, JsonParser.paramToObj('data-request-data', attr));
        }

        elementParents(this.element, '[data-request-data]').reverse().forEach(function(el) {
            Object.assign(data, JsonParser.paramToObj('data-request-data', el.getAttribute('data-request-data')));
        });

        this.options.data = data;
    }
}

function elementParents(element, selector) {
    const parents = [];
    if (!element.parentNode) {
        return parents;
    }

    let ancestor = element.parentNode.closest(selector);
    while (ancestor) {
        parents.push(ancestor);
        ancestor = ancestor.parentNode.closest(selector);
    }

    return parents;
}
