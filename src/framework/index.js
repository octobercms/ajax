import { Events } from "../util/events";
import namespace from "./namespace";
export default namespace;

if (!window.oc) {
    window.oc = {};
}

if (!window.oc.AjaxFramework) {
    // Namespace
    window.oc.AjaxFramework = namespace;

    // Request on element with builder
    window.oc.request = namespace.requestElement;

    // JSON parser
    window.oc.parseJSON = namespace.parseJSON;

    // Selector events
    window.oc.Events = Events;

    // Boot controller
    if (!isAMD() && !isCommonJS()) {
        namespace.start();
    }
}

function isAMD() {
    return typeof define == "function" && define.amd;
}

function isCommonJS() {
    return typeof exports == "object" && typeof module != "undefined";
}
