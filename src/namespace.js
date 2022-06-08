import Framework from "./framework/namespace";
import Request from "./request/namespace";
import Turbo from "./turbo/namespace";
import { AssetManager } from "./request/asset-manager";

export default {
    AjaxFramework: Framework,
    AjaxRequest: Request,
    AjaxTurbo: Turbo,

    ajax: Request.send,
    request: Request.sendElement,
    assetManager: AssetManager,

    start() {
        Framework.start();
        Turbo.start();
    },

    stop() {
        Framework.stop();
        Turbo.stop();
    }
};
