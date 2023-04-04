
class ControlBase
{
    static proxyCounter = 0;

    static get shouldLoad() {
        return true;
    }

    static afterLoad(_identifier, _application) {
        return;
    }

    constructor(context) {
        this.context = context;
    }

    get application() {
        return this.context.application;
    }

    get scope() {
        return this.context.scope;
    }

    get element() {
        return this.scope.element;
    }

    get identifier() {
        return this.scope.identifier;
    }

    init() {
        // Set up initial control state
    }

    connect() {
        // Control is connected to the DOM
    }

    disconnect() {
        // Control is disconnected from the DOM
    }

    // Internal events avoid the need to call parent logic
    initInternal() {
        this.proxiedEvents = {};
        this.proxiedMethods = {};
        this.config = this.element.dataset;
    }

    connectInternal() {
    }

    disconnectInternal() {
        for (const key in this.proxiedEvents) {
            this.forget(...this.proxiedEvents[key])
        }

        for (const key in this.proxiedMethods) {
            this.proxiedMethods[key] = null;
        }

        for (const propertyName of Object.getOwnPropertyNames(this)) {
            this[propertyName] = null;
        }
    }

    // Events
    listen(eventName, targetOrHandler, handler) {
        if (typeof targetOrHandler === 'string') {
            oc.Events.on(this.element, eventName, targetOrHandler, this.proxy(handler));
        }
        else {
            oc.Events.on(this.element, eventName, this.proxy(targetOrHandler));
        }

        ControlBase.proxyCounter++;
        this.proxiedEvents[ControlBase.proxyCounter] = arguments;
    }

    forget(eventName, targetOrHandler, handler) {
        if (typeof targetOrHandler === 'string') {
            oc.Events.off(this.element, eventName, targetOrHandler, this.proxy(handler));
        }
        else {
            oc.Events.off(this.element, eventName, this.proxy(targetOrHandler));
        }
    }

    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true, } = {}) {
        const type = prefix ? `${prefix}:${eventName}` : eventName;
        const event = new CustomEvent(type, { detail, bubbles, cancelable });
        target.dispatchEvent(event);
        return event;
    }

    proxy(method) {
        if (method.ocProxyId === undefined) {
            ControlBase.proxyCounter++;
            method.ocProxyId = ControlBase.proxyCounter;
        }

        if (this.proxiedMethods[method.ocProxyId] !== undefined) {
            return this.proxiedMethods[method.ocProxyId];
        }

        this.proxiedMethods[method.ocProxyId] = method.bind(this);

        return this.proxiedMethods[method.ocProxyId];
    }
}

export { ControlBase };
