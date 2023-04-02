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

    register(identifier, controllerConstructor) {
        this.load({ identifier, controllerConstructor });
    }

    load(head, ...rest) {
        const definitions = Array.isArray(head) ? head : [head, ...rest];
        definitions.forEach((definition) => {
            if (definition.controllerConstructor.shouldLoad) {
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

    getControllerForElementAndIdentifier(element, identifier) {
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
