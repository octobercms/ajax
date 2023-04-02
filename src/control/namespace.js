import { Application } from "./application";
const application = new Application;

export default {
    application,

    registerControl(id, controller) {
        return application.register(id, controller);
    },

    start() {
        application.start();
    },

    stop() {
        application.stop();
    }
};
