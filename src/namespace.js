import Request from "./request/namespace";
import Framework from "./framework/namespace";
import Turbo from "./turbo/namespace";

export default {
    Request,
    request: Request.send,
    requestEl: Request.sendEl,

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
