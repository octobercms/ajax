import Framework from "./framework/namespace";
import Request from "./request/namespace";
import Turbo from "./turbo/namespace";
import { JsonParser } from "./framework/json-parser";
import { AssetManager } from "./request/asset-manager";
import { Events } from "./util/events";

export default {
    AjaxFramework: Framework,
    AjaxRequest: Request,
    AjaxTurbo: Turbo,
    AssetManager,
    Events,

    ajax: Request.send,
    request: Request.sendElement,
    parseJSON: JsonParser.parseJSON,

    start() {
        Framework.start();
        Turbo.start();
    },

    stop() {
        Framework.stop();
        Turbo.stop();
    }
};
