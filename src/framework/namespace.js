import { Controller } from "./controller";
import { Migrate } from "./migrate";
import { RequestBuilder } from "./request-builder";
const controller = new Controller;

export default {
    controller,

    requestElement: RequestBuilder.fromElement,

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
