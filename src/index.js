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
    ajax = AjaxRequest.send,
    request = AjaxFramework.requestElement,
    parseJSON = AjaxFramework.parseJSON,
    flashMsg = AjaxExtras.flashMsg,
    progressBar = AjaxExtras.progressBar,
    attachLoader = AjaxExtras.attachLoader,
    useTurbo = AjaxTurbo.isEnabled,
    visit = AjaxTurbo.visit
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
