import { AssetManager } from "./asset-manager";
import namespace from "./namespace";
export default namespace;

if (!window.oc) {
    window.oc = {};
}

if (!window.oc.AjaxRequest) {
    window.oc.AssetManager = AssetManager;
    window.oc.AjaxRequest = namespace;
    window.oc.ajax = namespace.send;
    window.oc.request = namespace.sendElement;
}
