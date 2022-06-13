import { Controller } from "./controller";
const controller = new Controller;

export default {
    controller,

    start() {
        controller.start();
    },

    stop() {
        controller.stop();
    }
};
