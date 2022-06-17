import { Validator } from "./validator";
import { AttachLoader } from "./attach-loader";
import { FlashMessage } from "./flash-message";
import { Events } from "../util/events";

export class Controller
{
    constructor() {
        this.started = false;
    }

    start() {
        if (this.started) {
            return;
        }
        this.started = true;

        // Progress bar
        addEventListener('ajax:setup', this.enableProgressBar);

        // Attach loader
        this.attachLoader = new AttachLoader;
        Events.on(document, 'ajax:promise', '[data-request]', this.showAttachLoader.bind(this));
        Events.on(document, 'ajax:fail', '[data-request]', this.hideAttachLoader.bind(this));
        Events.on(document, 'ajax:done', '[data-request]', this.hideAttachLoader.bind(this));

        // Validator
        this.validator = new Validator;
        Events.on(document, 'ajax:before-validate', '[data-request][data-request-validate]', this.validatorValidate.bind(this));
        Events.on(document, 'ajax:promise', '[data-request][data-request-validate]', this.validatorSubmit.bind(this));

        // Flash message
        this.flashMessage = new FlashMessage;
        addEventListener('render', this.flashMessageRender.bind(this));
        Events.on(document, 'ajax:setup', '[data-request][data-request-flash]', this.flashMessageBind.bind(this));
    }

    stop() {
        if (!this.started) {
            return;
        }
        this.started = false;

        // Progress bar
        removeEventListener('ajax:setup', this.enableProgressBar);

        // Attach loader
        this.attachLoader = null;
        Events.off(document, 'ajax:promise', '[data-request]', this.showAttachLoader.bind(this));
        Events.off(document, 'ajax:fail', '[data-request]', this.hideAttachLoader.bind(this));
        Events.off(document, 'ajax:done', '[data-request]', this.hideAttachLoader.bind(this));

        // Validator
        this.validator = null;
        Events.off(document, 'ajax:promise', '[data-request][data-request-validate]', this.validatorSubmit.bind(this));
        Events.off(document, 'ajax:before-validate', '[data-request][data-request-validate]', this.validatorValidate.bind(this));

        // Flash message
        this.flashMessage = null;
        removeEventListener('render', this.flashMessageRender.bind(this));
        Events.off(document, 'ajax:setup', '[data-request][data-request-flash]', this.flashMessageBind.bind(this));
    }

    // Progress bar default value
    enableProgressBar(event) {
        const { options } = event.detail.context;

        if (options.progressBar === null) {
            options.progressBar = true;
        }
    }

    // Attach loader
    showAttachLoader(event) {
        this.attachLoader.show(event.target);
    }

    hideAttachLoader(event) {
        this.attachLoader.hide(event.target);
    }

    // Validator
    validatorSubmit(event) {
        this.validator.submit(event.target);
    }

    validatorValidate(event) {
        this.validator.validate(event.target, event.detail.fields);
    }

    // Flash message
    flashMessageBind(event) {
        var self = this;
        const { options } = event.detail.context;

        options.handleErrorMessage = function(message) {
            self.flashMessage.show({ message, type: 'error' });
        }

        options.handleFlashMessage = function(message, type) {
            self.flashMessage.show({ message, type });
        }
    }

    flashMessageRender(event) {
        this.flashMessage.render();
    }
}
