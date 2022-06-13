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

        addEventListener('ajax:setup', this.enableProgressBar);
    }

    stop() {
        if (this.started) {
            this.started = false;
        }
    }

    enableProgressBar(event) {
        const { options } = event.detail.context;
        options.progressBar = true;
    }
}
