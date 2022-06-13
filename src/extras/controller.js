import { AttachLoader } from "./attach-loader";
import { Events } from "../util/events";

export class Controller
{
    constructor() {
        this.started = false;
    }

    start() {
        if (!this.started) {
            this.started = true;
        }

        // Progress bar
        addEventListener('ajax:setup', this.enableProgressBar);

        // Attach loader
        this.attachLoader = new AttachLoader;
        Events.on(document, 'ajax:promise', '[data-request]', this.showAttachLoader.bind(this));
        Events.on(document, 'ajax:fail', '[data-request]', this.hideAttachLoader.bind(this));
        Events.on(document, 'ajax:done', '[data-request]', this.hideAttachLoader.bind(this));
    }

    stop() {
        if (this.started) {
            this.started = false;
        }

        // Progress bar
        removeEventListener('ajax:setup', this.enableProgressBar);

        // Attach loader
        this.attachLoader = null;
        Events.off(document, 'ajax:promise', '[data-request]', this.showAttachLoader.bind(this));
        Events.off(document, 'ajax:fail', '[data-request]', this.hideAttachLoader.bind(this));
        Events.off(document, 'ajax:done', '[data-request]', this.hideAttachLoader.bind(this));
    }

    // Progress bar
    enableProgressBar(event) {
        const { options } = event.detail.context;
        options.progressBar = true;
    }

    // Attach loader
    showAttachLoader(event) {
        this.attachLoader.show(event.target);
    }

    hideAttachLoader(event) {
        this.attachLoader.hide(event.target);
    }
}
