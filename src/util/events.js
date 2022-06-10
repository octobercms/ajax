import { getjQuery } from './index'

/**
 * Constants
 */
const namespaceRegex = /[^.]*(?=\..*)\.|.*/
const stripNameRegex = /\..*/
const stripUidRegex = /::\d+$/
const eventRegistry = {} // Events storage

let uidEvent = 1;

const customEvents = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
}

const nativeEvents = new Set([
    'click',
    'dblclick',
    'mouseup',
    'mousedown',
    'contextmenu',
    'mousewheel',
    'DOMMouseScroll',
    'mouseover',
    'mouseout',
    'mousemove',
    'selectstart',
    'selectend',
    'keydown',
    'keypress',
    'keyup',
    'orientationchange',
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel',
    'pointerdown',
    'pointermove',
    'pointerup',
    'pointerleave',
    'pointercancel',
    'gesturestart',
    'gesturechange',
    'gestureend',
    'focus',
    'blur',
    'change',
    'reset',
    'select',
    'submit',
    'focusin',
    'focusout',
    'load',
    'unload',
    'beforeunload',
    'resize',
    'move',
    'DOMContentLoaded',
    'readystatechange',
    'error',
    'abort',
    'scroll'
]);

export class Events
{
    static on(element, event, handler, delegationFunction) {
        addHandler(element, event, handler, delegationFunction, false);
    }

    static one(element, event, handler, delegationFunction) {
        addHandler(element, event, handler, delegationFunction, true);
    }

    static off(element, originalTypeEvent, handler, delegationFunction) {
        if (typeof originalTypeEvent !== 'string' || !element) {
            return;
        }

        const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
        const inNamespace = typeEvent !== originalTypeEvent;
        const events = getElementEvents(element);
        const storeElementEvent = events[typeEvent] || {};
        const isNamespace = originalTypeEvent.startsWith('.');

        if (typeof callable !== 'undefined') {
            // Simplest case: handler is passed, remove that listener ONLY.
            if (!storeElementEvent) {
                return;
            }

            removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
            return;
        }

        if (isNamespace) {
            for (const elementEvent of Object.keys(events)) {
                removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
            }
        }

        for (const keyHandlers of Object.keys(storeElementEvent)) {
            const handlerKey = keyHandlers.replace(stripUidRegex, '');

            if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
                const event = storeElementEvent[keyHandlers];
                removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
            }
        }
    }

    static dispatch(eventName, { target, detail, cancelable = true } = {}) {
        const event = new CustomEvent(eventName, {
            bubbles: true,
            cancelable: cancelable === true,
            detail: detail || {}
        });

        (target || document).dispatchEvent(event);
        return event;
    }

    static trigger(element, eventName, args) {
        if (typeof eventName !== 'string' || !element) {
            return null;
        }

        const {
            cancelable = true,
            detail = {}
        } = args;

        const $ = getjQuery();
        const typeEvent = getTypeEvent(eventName);
        const inNamespace = eventName !== typeEvent;

        let jQueryEvent = null;
        let nativeDispatch = true;
        let defaultPrevented = false;

        if (inNamespace && $) {
            jQueryEvent = $.Event(eventName, args);

            $(element).trigger(jQueryEvent);
            bubbles = !jQueryEvent.isPropagationStopped();
            nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
            defaultPrevented = jQueryEvent.isDefaultPrevented();
        }

        let evt = new CustomEvent(eventName, {
            bubbles: true,
            cancelable: cancelable === true,
            detail
        });

        evt = hydrateObj(evt, args);

        if (defaultPrevented) {
            evt.preventDefault();
        }

        if (nativeDispatch) {
            element.dispatchEvent(evt);
        }

        if (evt.defaultPrevented && jQueryEvent) {
            jQueryEvent.preventDefault();
        }

        return evt;
    }
}

/**
 * Private methods
 */
function makeEventUid(element, uid) {
    return (uid && `${uid}::${uidEvent++}`) || element.uidEvent || uidEvent++;
}

function getElementEvents(element) {
    const uid = makeEventUid(element);

    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};

    return eventRegistry[uid];
}

function internalHandler(element, fn) {
    return function handler(event) {
        event.delegateTarget = element;

        if (handler.oneOff) {
            EventHandler.off(element, event.type, fn);
        }

        return fn.apply(element, [event]);
    }
}

function internalDelegationHandler(element, selector, fn) {
    return function handler(event) {
        const domElements = element.querySelectorAll(selector);

        for (let { target } = event; target && target !== this; target = target.parentNode) {
            for (const domElement of domElements) {
                if (domElement !== target) {
                    continue;
                }

                event.delegateTarget = target;

                if (handler.oneOff) {
                    EventHandler.off(element, event.type, selector, fn);
                }

                return fn.apply(target, [event]);
            }
        }
    }
}

function findHandler(events, callable, delegationSelector = null) {
    return Object.values(events)
        .find(event => event.callable === callable && event.delegationSelector === delegationSelector);
}

function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
    const isDelegated = typeof handler === 'string';
    const callable = isDelegated ? delegationFunction : handler;
    let typeEvent = getTypeEvent(originalTypeEvent);

    if (!nativeEvents.has(typeEvent)) {
        typeEvent = originalTypeEvent;
    }

    return [isDelegated, callable, typeEvent];
}

function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
    if (typeof originalTypeEvent !== 'string' || !element) {
        return;
    }

    let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);

    // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
    // this prevents the handler from being dispatched the same way as mouseover or mouseout does
    if (originalTypeEvent in customEvents) {
        const wrapFunction = fn => {
            return function (event) {
                if (!event.relatedTarget || (event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget))) {
                    return fn.call(this, event);
                }
            }
        }

        callable = wrapFunction(callable);
    }

    const events = getElementEvents(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);

    if (previousFunction) {
        previousFunction.oneOff = previousFunction.oneOff && oneOff;
        return;
    }

    const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
    const fn = isDelegated
        ? internalDelegationHandler(element, handler, callable)
        : internalHandler(element, callable);

    fn.delegationSelector = isDelegated ? handler : null;
    fn.callable = callable;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;

    element.addEventListener(typeEvent, fn, isDelegated);
}

function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);

    if (!fn) {
        return;
    }

    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};

    for (const handlerKey of Object.keys(storeElementEvent)) {
        if (handlerKey.includes(namespace)) {
            const event = storeElementEvent[handlerKey];
            removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
        }
    }
}

// Allow to get the native events from namespaced events ('click.bs.button' --> 'click')
function getTypeEvent(event) {
    event = event.replace(stripNameRegex, '');
    return customEvents[event] || event;
}

function hydrateObj(obj, meta) {
    for (const [key, value] of Object.entries(meta || {})) {
        Object.defineProperty(obj, key, {
            get() {
                return value;
            }
        });
    }

    return obj;
}