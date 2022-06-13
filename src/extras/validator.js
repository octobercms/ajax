import { unindent } from "../util";
import { Events } from "../util/events";

export class Validator
{
    static stylesheetReady = false;

    constructor() {
        this.stylesheetElement = this.createStylesheetElement();
    }

    static get defaultCSS() {
        return unindent `
        [data-request][data-request-validate] [data-validate-for],
        [data-request][data-request-validate] [data-validate-error] {
            &:not(.oc-visible) {
                display: none;
            }
        }
    `;
    }

    submit(el) {
        this.installStylesheetElement();

        var form = el.closest('form');
        if (!form) {
            return;
        }

        form.querySelectorAll('[data-validate-for]').forEach(function(el) {
            el.classList.remove('oc-visible');
        });

        form.querySelectorAll('[data-validate-error]').forEach(function(el) {
            el.classList.remove('oc-visible');
        });
    }

    validate(el, fields) {
        var form = el.closest('form'),
            messages = [];

        if (!form) {
            return;
        }

        for (var fieldName in fields) {
            // Build messages
            var fieldMessages = fields[fieldName];
            messages = [...messages, ...fieldMessages];

            // Display message next to field
            var field = form.querySelector('[data-validate-for="'+fieldName+'"]');
            if (field) {
                if (field.innerHTML || field.dataset.emptyMode === true) {
                    field.dataset.emptyMode = true;
                    field.innerHTML = fieldMessages.join(', ');
                }
                field.classList.add('oc-visible');
            }
        }

        var container = form.querySelector('[data-validate-error]');
        if (container) {
            container.classList.add('oc-visible');

            // Messages found inside the container
            var oldMessages = container.querySelectorAll('[data-message]');
            if (oldMessages.length > 0) {
                var clone = oldMessages[0];
                messages.forEach(function(message) {
                    var newNode = clone.cloneNode(true);
                    newNode.innerHTML = message;
                    // Insert after
                    clone.parentNode.insertBefore(newNode, clone.nextSibling);
                });

                oldMessages.forEach(function(el) {
                    el.remove();
                });
            }
            // Just use the container to set the value
            else {
                container.innerHTML = errorMsg;
            }
        }

        // Prevent default error behavior
        Events.one(form, 'ajax:error', function(event) {
            event.preventDefault();
        });
    }

    // Private
    installStylesheetElement() {
        if (!Validator.stylesheetReady) {
            document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
            Validator.stylesheetReady = true;
        }
    }

    createStylesheetElement() {
        const element = document.createElement('style');
        element.textContent = Validator.defaultCSS;
        return element;
    }
}
