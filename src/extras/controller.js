import { Validator } from "./validator";
import { AttachLoader } from "./attach-loader";
import { FlashMessage } from "./flash-message";
import { Events } from "../util/events";

export class Controller
{
    constructor() {
        this.started = false;

        // Progress bar default value
        this.enableProgressBar = function(event) {
            const { options } = event.detail.context;

            if (options.progressBar === null) {
                options.progressBar = true;
            }
        }

        // Attach loader
        this.showAttachLoader = (function(event) {
            this.attachLoader.showForm(event.target);
        }).bind(this);

        this.hideAttachLoader = (function(event) {
            this.attachLoader.hideForm(event.target);
        }).bind(this);

        // Validator
        this.validatorSubmit = (function(event) {
            this.validator.submit(event.target);
        }).bind(this);

        this.validatorValidate = (function(event) {
            this.validator.validate(event.target, event.detail.fields, event.detail.message);
        }).bind(this);

        // Flash message
        this.flashMessageBind = (function(event) {
            const { options } = event.detail.context;
            if (!options.flash) {
                return;
            }

            var self = this;
            options.handleErrorMessage = function(message) {
                self.flashMessage.show({ message, type: 'error' });
            }

            options.handleFlashMessage = function(message, type) {
                self.flashMessage.show({ message, type });
            }
        }).bind(this);

        this.flashMessageRender = (function(event) {
            this.flashMessage.render();
        }).bind(this);
    }

    start() {
        if (!this.started) {
            // Progress bar
            addEventListener('ajax:setup', this.enableProgressBar);

            // Attach loader
            this.attachLoader = new AttachLoader;
            Events.on(document, 'ajax:promise', 'form, [data-attach-loading]', this.showAttachLoader);
            Events.on(document, 'ajax:fail', 'form, [data-attach-loading]', this.hideAttachLoader);
            Events.on(document, 'ajax:done', 'form, [data-attach-loading]', this.hideAttachLoader);

            // Validator
            this.validator = new Validator;
            Events.on(document, 'ajax:before-validate', '[data-request-validate]', this.validatorValidate);
            Events.on(document, 'ajax:promise', '[data-request-validate]', this.validatorSubmit);

            // Flash message
            this.flashMessage = new FlashMessage;
            addEventListener('render', this.flashMessageRender);
            addEventListener('ajax:setup', this.flashMessageBind);

            this.started = true;
        }
    }

    stop() {
        if (this.started) {
            // Progress bar
            removeEventListener('ajax:setup', this.enableProgressBar);

            // Attach loader
            this.attachLoader = null;
            Events.off(document, 'ajax:promise', 'form, [data-attach-loading]', this.showAttachLoader);
            Events.off(document, 'ajax:fail', 'form, [data-attach-loading]', this.hideAttachLoader);
            Events.off(document, 'ajax:done', 'form, [data-attach-loading]', this.hideAttachLoader);

            // Validator
            this.validator = null;
            Events.off(document, 'ajax:before-validate', '[data-request-validate]', this.validatorValidate);
            Events.off(document, 'ajax:promise', '[data-request-validate]', this.validatorSubmit);

            // Flash message
            this.flashMessage = null;
            removeEventListener('render', this.flashMessageRender);
            removeEventListener('ajax:setup', this.flashMessageBind);

            this.started = false;
        }
    }
}
