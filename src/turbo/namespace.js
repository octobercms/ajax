import { Controller } from "./controller";
const controller = new Controller;

export default {
    get supported() {
        return Controller.supported;
    },

    controller,

    visit(location, options) {
        controller.visit(location, options);
    },

    clearCache() {
        controller.clearCache();
    },

    setProgressBarDelay(delay) {
        controller.setProgressBarDelay(delay);
    },

    start() {
        controller.start();
    }
};
