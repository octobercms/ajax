
class Controller
{
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
        // Controller is connected to the DOM
    }

    disconnect() {
        // Controller is disconnected from the DOM
    }

    listen(element, event, action) {
        // @todo event listener within context of element
    }

    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true, } = {}) {
        const type = prefix ? `${prefix}:${eventName}` : eventName;
        const event = new CustomEvent(type, { detail, bubbles, cancelable });
        target.dispatchEvent(event);
        return event;
    }
}

export { Controller };
