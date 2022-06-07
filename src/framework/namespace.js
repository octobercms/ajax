import { Controller } from "./controller";
import { Migrate } from "./migrate";
const controller = new Controller;

export default {
    controller,

    start() {
        controller.start();

        if (window.jQuery) {
            (new Migrate).bind();
        }
    },

    stop() {
        controller.stop();
    }
};
