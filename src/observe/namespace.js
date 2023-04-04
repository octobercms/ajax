import { Application } from "./application";
const application = new Application;

export default {
    application,

    registerControl(id, controller) {
        return application.register(id, controller);
    },

    fetchControl(element) {
        return application.fetch(element);
    },

    fetchControls(elements) {
        return application.fetchAll(elements);
    },

    start() {
        application.startAsync();
    },

    stop() {
        application.stop();
    }
};
