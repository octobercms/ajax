import Request from "../request/namespace";
import { JsonParser } from "./json-parser";

export class RequestBuilder
{
    constructor(element, handler, options) {
        this.options = options || {};
        this.ogElement = element;
        this.element = this.findElement(element);

        if (!this.element) {
            return Request.send(handler, this.options);
        }

        this.assignAsEval('beforeUpdate', 'requestBeforeUpdate');
        this.assignAsEval('afterUpdate', 'requestAfterUpdate');
        this.assignAsEval('success', 'requestSuccess');
        this.assignAsEval('error', 'requestError');
        this.assignAsEval('complete', 'requestComplete');

        this.assignAsData('progressBar', 'requestProgressBar');
        this.assignAsData('confirm', 'requestConfirm');
        this.assignAsData('redirect', 'requestRedirect');
        this.assignAsData('loading', 'requestLoading');
        this.assignAsData('form', 'requestForm');
        this.assignAsData('url', 'requestUrl');
        this.assignAsData('update', 'requestUpdate', { parseJson: true });
        this.assignAsData('bulk', 'requestBulk', { emptyAsTrue: true });
        this.assignAsData('files', 'requestFiles', { emptyAsTrue: true });
        this.assignAsData('flash', 'requestFlash', { emptyAsTrue: true });
        this.assignAsData('browserValidate', 'browserValidate', { emptyAsTrue: true });

        this.assignRequestData();

        if (!handler) {
            handler = this.getHandlerName();
        }

        return Request.sendElement(this.element, handler, this.options);
    }

    static fromElement(element, handler, options) {
        return new RequestBuilder(element, handler, options);
    }

    // Event target may some random node inside the data-request container
    // so it should bubble up but also capture the ogElement in case it is
    // a button that contains data-request-data.
    findElement(element) {
        if (!element || element === document) {
            return null;
        }

        if (element.matches('[data-request]')) {
            return element;
        }

        var parentEl = element.closest('[data-request]');
        if (parentEl) {
            return parentEl;
        }

        return element;
    }

    getHandlerName() {
        if (this.element.dataset.dataRequest) {
            return this.element.dataset.dataRequest;
        }

        return this.element.getAttribute('data-request');
    }

    assignAsEval(optionName, name) {
        var attrVal;
        if (this.element.dataset[name]) {
            attrVal = this.element.dataset[name];
        }
        else {
            attrVal = this.element.getAttribute('data-' + normalizeDataKey(name));
        }

        if (!attrVal) {
            return;
        }

        const otherFunc = this.options[optionName];
        this.options[optionName] = function(data, responseCode, xhr) {
            // Call eval code, with halting
            var result = (new Function('data', attrVal)).apply(this.el, [data]);
            if (result === false) {
                return;
            }

            // Call other function from options, if supplied
            if (otherFunc) {
                return otherFunc(data, responseCode, xhr);
            }

            // The other function wasn't supplied, keep logic going.
            // beforeUpdate and afterUpdate are not part of context
            // since they have no base logic and won't exist here
            if (this[optionName]) {
                return this[optionName](data, responseCode, xhr);
            }
        }
    }

    assignAsData(optionName, name, { parseJson = false, emptyAsTrue = false } = {}) {
        var attrVal;
        if (this.element.dataset[name]) {
            attrVal = this.element.dataset[name];
        }
        else {
            attrVal = this.element.getAttribute('data-' + normalizeDataKey(name));
        }

        if (attrVal === null) {
            return;
        }

        if (parseJson) {
            this.options[optionName] = JsonParser.paramToObj(
                'data-' + normalizeDataKey(name),
                attrVal
            );
        }
        else {
            this.options[optionName] = this.castAttrToOption(attrVal, emptyAsTrue);
        }
    }

    castAttrToOption(val, emptyAsTrue) {
        if (emptyAsTrue && val === '') {
            return true;
        }

        if (val === 'true' || val === '1') {
            return true;
        }

        if (val === 'false' || val === '0') {
            return false;
        }

        return val;
    }

    assignRequestData() {
        var data = this.options.data || {};

        const attr = this.ogElement.getAttribute('data-request-data');
        if (attr) {
            Object.assign(data, JsonParser.paramToObj('data-request-data', attr));
        }

        elementParents(this.ogElement, '[data-request-data]').reverse().forEach(function(el) {
            Object.assign(data, JsonParser.paramToObj(
                'data-request-data',
                el.getAttribute('data-request-data')
            ));
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

function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`)
}
