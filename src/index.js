/**
 * --------------------------------------------------------------------------
 * October CMS: Frontend JavaScript Framework
 * https://octobercms.com
 * --------------------------------------------------------------------------
 * Copyright 2013-2023 Alexey Bobkov, Samuel Georges
 * --------------------------------------------------------------------------
 */

import AjaxFramework from "./core/namespace";
import AjaxRequest from "./request/namespace";
import AjaxExtras from "./extras/namespace";
import AjaxObserve from "./observe/namespace";
import AjaxTurbo from "./turbo/namespace";
import { ControlBase } from "./observe/control-base";
import { AssetManager } from "./request/asset-manager";
import { Events } from "./util/events";

export default {
    AjaxFramework,
    AjaxRequest,
    AjaxExtras,
    AjaxObserve,
    AjaxTurbo,
    ControlBase,
    AssetManager,
    Events,
    ajax: AjaxRequest.send,
    request: AjaxFramework.requestElement,
    parseJSON: AjaxFramework.parseJSON,
    serializeJSON: AjaxFramework.serializeJSON,
    flashMsg: AjaxExtras.flashMsg,
    progressBar: AjaxExtras.progressBar,
    attachLoader: AjaxExtras.attachLoader,
    useTurbo: AjaxTurbo.isEnabled,
    pageReady: AjaxTurbo.pageReady,
    visit: AjaxTurbo.visit,
    registerControl: AjaxObserve.registerControl,
    importControl: AjaxObserve.importControl,
    fetchControl: AjaxObserve.fetchControl,
    fetchControls: AjaxObserve.fetchControls
};
