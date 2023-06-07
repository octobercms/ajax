import { Dispatcher } from "./dispatcher";
import { Container } from "./container";

export class Application
{
    constructor() {
        this.started = false;
        this.element = document.documentElement;
        this.dispatcher = new Dispatcher(this);
        this.container = new Container(this);
    }

    startAsync() {
        domReady().then(() => {
            this.start();
        });
    }

    start() {
        if (!this.started) {
            this.started = true;
            this.dispatcher.start();
            this.container.start();
        }
    }

    stop() {
        if (this.started) {
            this.dispatcher.stop();
            this.container.stop();
            this.started = false;
        }
    }

    register(identifier, controlConstructor) {
        this.load({ identifier, controlConstructor });
    }

    import(identifier) {
        const module = this.container.getModuleForIdentifier(identifier);
        if (!module) {
            throw new Error('Control is not registered: ' + identifier);
        }

        return module.controlConstructor;
    }

    fetch(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        return element ? this.getControlForElementAndIdentifier(element, element.dataset.control) : null;
    }

    fetchAll(elements) {
        if (typeof elements === 'string') {
            elements = document.querySelectorAll(elements);
        }

        const result = [];
        elements.forEach((element) => {
            const control = this.fetch(element);
            if (control) {
                result.push(control);
            }
        });
        return result;
    }

    load(head, ...rest) {
        const definitions = Array.isArray(head) ? head : [head, ...rest];
        definitions.forEach((definition) => {
            if (definition.controlConstructor.shouldLoad) {
                this.container.loadDefinition(definition);
            }
        });
    }

    unload(head, ...rest) {
        const identifiers = Array.isArray(head) ? head : [head, ...rest];
        identifiers.forEach((identifier) => this.container.unloadIdentifier(identifier));
    }

    // Controllers
    get controllers() {
        return this.container.contexts.map((context) => context.controller);
    }

    getControlForElementAndIdentifier(element, identifier) {
        const context = this.container.getContextForElementAndIdentifier(element, identifier);
        return context ? context.controller : null;
    }

    // Error handling
    handleError(error, message, detail) {
        var _a;
        console.error(`%s\n\n%o\n\n%o`, message, error, detail);
        (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error);
    }
}

function domReady() {
    return new Promise((resolve) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => resolve());
        }
        else {
            resolve();
        }
    });
}
