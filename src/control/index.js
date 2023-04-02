import { Controller } from "./controller";
import namespace from "./namespace";
export default namespace;

if (!window.oc) {
    window.oc = {};
}

if (!window.oc.AjaxControl) {
    // Namespace
    window.oc.AjaxControl = namespace;

    // Control registration
    window.oc.registerControl = namespace.registerControl;

    // Control base class
    window.oc.ControlBase = Controller;

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
