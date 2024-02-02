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
        this.showAttachLoader = (event) => {
            this.attachLoader.showForm(event.target);
        };

        this.hideAttachLoader = (event) => {
            this.attachLoader.hideForm(event.target);
        };

        this.hideAllAttachLoaders = (event) => {
            this.attachLoader.hideAll();
        };

        // Validator
        this.validatorSubmit = (event) => {
            this.validator.submit(event.target);
        };

        this.validatorValidate = (event) => {
            this.validator.validate(
                event.target,
                event.detail.fields,
                event.detail.message,
                shouldShowFlashMessage(event.detail.context.options.flash, 'validate')
            );
        };

        // Flash message
        this.flashMessageBind = (event) => {
            const { options } = event.detail.context;
            if (options.flash) {
                options.handleErrorMessage = (message) => {
                    if (
                        message &&
                        shouldShowFlashMessage(options.flash, 'error') ||
                        shouldShowFlashMessage(options.flash, 'validate')
                    ) {
                        this.flashMessage.show({ message, type: 'error' });
                    }
                }

                options.handleFlashMessage = (message, type) => {
                    if (message && shouldShowFlashMessage(options.flash, type)) {
                        this.flashMessage.show({ message, type });
                    }
                }
            }

            options.handleProgressMessage = (message, isDone) => {
                if (!isDone) {
                    this.flashMessage.show({ message, type: 'loading', interval: 0, holdInterval: .5 });
                }
                else {
                    this.flashMessage.show({ clear: 'loading' });
                }
            }
        };

        this.flashMessageRender = (event) => {
            this.flashMessage.render();
        };

        // Browser redirect
        this.handleBrowserRedirect = function(event) {
            if (event.defaultPrevented) {
                return;
            }

            if (oc.useTurbo && oc.useTurbo()) {
                const href = oc.AjaxTurbo.controller.getLastVisitUrl();
                if (href) {
                    event.preventDefault();
                    oc.visit(href);
                }
            }
            else {
                const href = getReferrerFromSameOrigin();
                if (href) {
                    event.preventDefault();
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
            addEventListener('page:before-cache', this.hideAllAttachLoaders);

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
            removeEventListener('page:before-cache', this.hideAllAttachLoaders);

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
    // Validation messages are not included by default
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
    if (!document.referrer) {
        return null;
    }

    // Fallback when turbo router is not activated
    try {
        const referrer = new URL(document.referrer);
        if (referrer.origin !== location.origin) {
            return null;
        }

        const pushReferrer = localStorage.getItem('ocPushStateReferrer');
        if (pushReferrer && pushReferrer.indexOf(referrer.pathname) === 0) {
            return pushReferrer;
        }

        return document.referrer;
    }
    catch (e) {
    }
}
