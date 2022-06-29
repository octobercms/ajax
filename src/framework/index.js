import { JsonParser } from "./json-parser";
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

    // Selector events
    window.oc.Events = Events;

    // JSON parser
    window.oc.parseJSON = JsonParser.parseJSON;
}

// Boot controller
if (!isAMD() && !isCommonJS()) {
    namespace.start();
}

function isAMD() {
    return typeof define == "function" && define.amd;
}

function isCommonJS() {
    return typeof exports == "object" && typeof module != "undefined";
}
