export class Context
{
    constructor(module, scope) {
        this.module = module;
        this.scope = scope;
        this.controller = new module.controlConstructor(this);

        try {
            this.controller.initInternal();
            this.controller.init();
        }
        catch (error) {
            this.handleError(error, 'initializing controller');
        }
    }

    connect() {
        try {
            this.controller.connectInternal();
            this.controller.connect();
        }
        catch (error) {
            this.handleError(error, 'connecting controller');
        }
    }

    refresh() {
    }

    disconnect() {
        try {
            this.controller.disconnect();
            this.controller.disconnectInternal();
        }
        catch (error) {
            this.handleError(error, 'disconnecting controller');
        }
    }

    get application() {
        return this.module.application;
    }

    get identifier() {
        return this.module.identifier;
    }

    get dispatcher() {
        return this.application.dispatcher;
    }

    get element() {
        return this.scope.element;
    }

    get parentElement() {
        return this.element.parentElement;
    }

    // Error handling
    handleError(error, message, detail = {}) {
        const { identifier, controller, element } = this;
        detail = Object.assign({ identifier, controller, element }, detail);
        this.application.handleError(error, `Error ${message}`, detail);
    }
}
