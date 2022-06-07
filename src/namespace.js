import Turbo from "./turbo/namespace";
import Request from "./request/namespace";
import Framework from "./framework/namespace";
import { AssetManager } from "./request/asset-manager";

export default {
    Request,
    request: Request.send,
    requestEl: Request.sendEl,
    assetManager: AssetManager,

    Framework,
    Turbo,

    start() {
        Framework.start();
        Turbo.start();
    },

    stop() {
        Framework.stop();
        Turbo.stop();
    }
};
