import { unindent } from "../util";

export class AttachLoader
{
    static stylesheetReady = false;

    constructor() {
        this.stylesheetElement = this.createStylesheetElement();
    }

    static get defaultCSS() {
        return unindent `
        a.oc-loading, button.oc-loading, span.oc-loading {
            &:after {
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
        }

        @keyframes oc-rotate-loader {
            0%    { transform: rotate(0deg); }
            100%  { transform: rotate(360deg); }
        }
    `;
    }

    // Public
    show(el) {
        this.installStylesheetElement();

        if (el.dataset.attachLoading !== undefined) {
            el.classList.add('oc-loading');
            el.disabled = true;
        }

        if (el.matches('form')) {
            el.querySelectorAll('[data-attach-loading]').forEach(function(otherEl) {
                otherEl.classList.add('oc-loading');
                otherEl.disabled = true;
            });
        }
    }

    hide(el) {
        if (el.dataset.attachLoading !== undefined) {
            el.classList.remove('oc-loading');
            el.disabled = false;
        }

        if (el.matches('form')) {
            el.querySelectorAll('[data-attach-loading]').forEach(function(otherEl) {
                otherEl.classList.remove('oc-loading');
                otherEl.disabled = false;
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
