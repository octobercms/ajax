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

        this.assignAsEval('beforeUpdate', 'request-before-update');
        this.assignAsEval('afterUpdate', 'request-after-update');
        this.assignAsEval('success', 'request-success');
        this.assignAsEval('error', 'request-error');
        this.assignAsEval('complete', 'request-complete');

        this.assignAsData('confirm', 'request-confirm');
        this.assignAsData('redirect', 'request-redirect');
        this.assignAsData('loading', 'request-loading');
        this.assignAsData('flash', 'request-flash');
        this.assignAsData('files', 'request-files');
        this.assignAsData('browserValidate', 'browser-validate');
        this.assignAsData('form', 'request-form');
        this.assignAsData('url', 'request-url');
        this.assignAsData('update', 'request-update', true);

        this.assignRequestData();

        if (!handler) {
            handler = element.getAttribute('data-request');
        }

        return Request.sendElement(this.element, handler, this.options);
    }

    static fromElement(element, handler, options) {
        return new RequestBuilder(element, handler, options);
    }

    assignAsEval(optionName, name) {
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

    assignAsData(optionName, name, parseJson = false) {
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
