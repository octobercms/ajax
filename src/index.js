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
    ajax = () => AjaxRequest.send(...arguments),
    request = () => AjaxFramework.requestElement(...arguments),
    parseJSON = () => AjaxFramework.parseJSON(...arguments),
    flashMsg = () => AjaxExtras.flashMsg(...arguments),
    progressBar = () => AjaxExtras.progressBar(...arguments),
    attachLoader = () => AjaxExtras.attachLoader(...arguments),
    useTurbo = () => AjaxTurbo.isEnabled(...arguments),
    visit = () => AjaxTurbo.visit(...arguments);
