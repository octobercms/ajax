import namespace from "./namespace";
export default namespace;

if (!window.oc) {
    window.oc = {};
}

if (!window.oc.Framework) {
    window.oc.Framework = namespace;
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
