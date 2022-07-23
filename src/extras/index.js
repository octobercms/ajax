import { FlashMessage } from "./flash-message";
import { ProgressBar } from "./progress-bar";
import namespace from "./namespace";
export default namespace;

if (!window.oc) {
    window.oc = {};
}

if (!window.oc.AjaxExtras) {
    // Namespace
    window.oc.AjaxExtras = namespace;

    // Flash messages
    window.oc.flashMsg = FlashMessage.flashMsg;

    // Progress bar
    window.oc.progressBar = ProgressBar.progressBar();

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
