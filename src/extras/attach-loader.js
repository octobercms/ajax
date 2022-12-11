import { unindent } from "../util";

export class AttachLoader
{
    static stylesheetReady = false;

    constructor() {
        this.stylesheetElement = this.createStylesheetElement();
    }

    static get defaultCSS() {
        return unindent `
        .oc-attach-loader:after {
            content: '';
            display: inline-block;
            vertical-align: middle;
            margin-left: .4em;
            height: 1em;
            width: 1em;
            animation: oc-rotate-loader 0.8s infinite linear;
            border: .2em solid currentColor;
            border-right-color: transparent;
            border-radius: 50%;
            opacity: .5;
        }

        @keyframes oc-rotate-loader {
            0%    { transform: rotate(0deg); }
            100%  { transform: rotate(360deg); }
        }
    `;
    }

    static attachLoader() {
        return {
            show: function(el) {
                (new AttachLoader).show(resolveElement(el));
            },
            hide: function(el) {
                (new AttachLoader).hide(resolveElement(el));
            }
        };
    }

    // Public
    show(el) {
        this.installStylesheetElement();

        el.classList.add('oc-attach-loader');
        el.disabled = true;
    }

    hide(el) {
        el.classList.remove('oc-attach-loader');
        el.disabled = false;
    }

    showForm(el) {
        if (el.dataset.attachLoading !== undefined) {
            this.show(el);
        }

        if (el.matches('form')) {
            var self = this;
            el.querySelectorAll('[data-attach-loading]').forEach(function(otherEl) {
                self.show(otherEl);
            });
        }
    }

    hideForm(el) {
        if (el.dataset.attachLoading !== undefined) {
            this.hide(el);
        }

        if (el.matches('form')) {
            var self = this;
            el.querySelectorAll('[data-attach-loading]').forEach(function(otherEl) {
                self.hide(otherEl);
            });
        }
    }

    // Private
    installStylesheetElement() {
        if (!AttachLoader.stylesheetReady) {
            document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
            AttachLoader.stylesheetReady = true;
        }
    }

    createStylesheetElement() {
        const element = document.createElement('style');
        element.textContent = AttachLoader.defaultCSS;
        return element;
    }
}

function resolveElement(el) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }

    if (!el) {
        throw new Error("Invalid element for attach loader.");
    }

    return el;
}
