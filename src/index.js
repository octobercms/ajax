/**
 * --------------------------------------------------------------------------
 * October CMS: Frontend JavaScript Framework
 * https://octobercms.com
 * --------------------------------------------------------------------------
 * Copyright 2013-2022 Alexey Bobkov, Samuel Georges
 * --------------------------------------------------------------------------
 */

import AjaxFramework from "./core/namespace";
import AjaxRequest from "./request/namespace";
import AjaxExtras from "./extras/namespace";
import AjaxTurbo from "./turbo/namespace";
import { AssetManager } from "./request/asset-manager";
import { Events } from "./util/events";

export {
    AjaxFramework,
    AjaxRequest,
    AjaxExtras,
    AjaxTurbo,
    AssetManager,
    Events
}

export const
    ajax = (handler, options) => AjaxRequest.send(handler, options),
    request = (element, handler, options) => AjaxFramework.requestElement(element, handler, options),
    parseJSON = (json) => AjaxFramework.parseJSON(json),
    flashMsg = (options) => AjaxExtras.flashMsg(options),
    progressBar = () => AjaxExtras.progressBar(),
    attachLoader = () => AjaxExtras.attachLoader(),
    useTurbo = () => AjaxTurbo.isEnabled(),
    visit = (location, options) => AjaxTurbo.visit(location, options)
;

export default {
    AjaxFramework,
    AjaxRequest,
    AjaxExtras,
    AjaxTurbo,
    AssetManager,
    Events,
    ajax,
    request,
    parseJSON,
    flashMsg,
    progressBar,
    attachLoader,
    useTurbo,
    visit
};
