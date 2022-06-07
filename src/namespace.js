import Request from "./request/namespace";
import Framework from "./framework/namespace";

export default {
    Request,
    request: Request.send,
    requestEl: Request.sendEl,

    Framework,

    start() {
        Framework.start();
    },

    stop() {
        Framework.stop();
    }
};
