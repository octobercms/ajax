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
            this.validator.validate(
                event.target,
                event.detail.fields,
                event.detail.message,
                shouldShowFlashMessage(event.detail.context.options.flash, 'validate')
            );
        }).bind(this);

        // Flash message
        this.flashMessageBind = (function(event) {
            const { options } = event.detail.context;
            const self = this;
            if (options.flash) {
                options.handleErrorMessage = function(message) {
                    if (
                        shouldShowFlashMessage(options.flash, 'error') ||
                        shouldShowFlashMessage(options.flash, 'validate')
                    ) {
                        self.flashMessage.show({ message, type: 'error' });
                    }
                }

                options.handleFlashMessage = function(message, type) {
                    if (shouldShowFlashMessage(options.flash, type)) {
                        self.flashMessage.show({ message, type });
                    }
                }
            }
        }).bind(this);

        this.flashMessageRender = (function(event) {
            this.flashMessage.render();
        }).bind(this);

        // Browser redirect
        this.handleBrowserRedirect = function(event) {
            if (event.defaultPrevented) {
                return;
            }

            const href = getReferrerFromSameOrigin();
            if (href) {
                event.preventDefault();

                if (oc.useTurbo()) {
                    oc.visit(href);
                }
                else {
                    location.assign(href);
                }
            }
        };
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

            // Browser redirect
            Events.on(document, 'click', '[data-browser-redirect-back]', this.handleBrowserRedirect);
            Events.on(document, 'ajax:before-redirect', '[data-browser-redirect-back]', this.handleBrowserRedirect);

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

            // Browser redirect
            Events.off(document, 'click', '[data-browser-redirect-back]', this.handleBrowserRedirect);
            Events.off(document, 'ajax:before-redirect', '[data-browser-redirect-back]', this.handleBrowserRedirect);

            this.started = false;
        }
    }
}

function shouldShowFlashMessage(value, type) {
    // Valdiation messages are not included by default
    if (value === true && type !== 'validate') {
        return true;
    }

    if (typeof value !== 'string') {
        return false;
    }

    if (value === '*') {
        return true;
    }

    let result = false;
    value.split(',').forEach(function(validType) {
        if (validType.trim() === type) {
            result = true;
        }
    });

    return result;
}

function getReferrerFromSameOrigin() {
    // Turbo router will only supply same origin
    const href = oc.AjaxTurbo.controller.getLastVisitUrl();
    if (href) {
        return href;
    }

    // Fallback when turbo router isnt activated
    const lastHref = document.referrer;
    if (referrer) {
        try {
            const referrer = new URL(lastHref);
            if (referrer.origin === location.origin) {
                return lastHref;
            }
        }
        catch (e) {
        }
    }
}
