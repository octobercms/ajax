import { unindent } from "../util";

export class FlashMessage
{
    static stylesheetReady = false;
    static isHolding = false;

    constructor() {
        this.stylesheetElement = this.createStylesheetElement();
    }

    static get defaultCSS() {
        return unindent `
        .oc-flash-message {
            display: flex;
            position: fixed;
            z-index: 10300;
            width: 500px;
            left: 50%;
            top: 50px;
            margin-left: -250px;
            color: #fff;
            font-size: 1rem;
            padding: 10px 15px;
            border-radius: 5px;
            opacity: 0;
            transition: all 0.5s, width 0s;
            transform: scale(0.9);
        }
        @media (max-width: 768px) {
            .oc-flash-message {
                left: 1rem;
                right: 1rem;
                top: 1rem;
                margin-left: 0;
                width: auto;
            }
        }
        .oc-flash-message.flash-show {
            opacity: 1;
            transform: scale(1);
        }
        .oc-flash-message.loading {
            transition: opacity 0.2s;
            transform: scale(1);
        }
        .oc-flash-message.success {
            background: #86cb43;
        }
        .oc-flash-message.error {
            background: #cc3300;
        }
        .oc-flash-message.warning {
            background: #f0ad4e;
        }
        .oc-flash-message.info, .oc-flash-message.loading {
            background: #5fb6f5;
        }
        .oc-flash-message span.flash-message {
            flex-grow: 1;
        }
        .oc-flash-message a.flash-close {
            box-sizing: content-box;
            width: 1em;
            height: 1em;
            padding: .25em .25em;
            background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23FFF'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;
            border: 0;
            border-radius: .25rem;
            opacity: .5;
            text-decoration: none;
            cursor: pointer;
        }
        .oc-flash-message a.flash-close:hover,
        .oc-flash-message a.flash-close:focus {
            opacity: 1;
        }
        .oc-flash-message.loading a.flash-close {
            display: none;
        }
        .oc-flash-message span.flash-loader {
            margin-right: 1em;
        }
        .oc-flash-message span.flash-loader:after {
            position: relative;
            top: 2px;
            content: '';
            display: inline-block;
            height: 1.2em;
            width: 1.2em;
            animation: oc-flash-loader 0.8s infinite linear;
            border: .2em solid currentColor;
            border-right-color: transparent;
            border-radius: 50%;
            opacity: .5;
        }
        html[data-turbo-preview] .oc-flash-message {
            opacity: 0;
        }
        @keyframes oc-flash-loader {
            0% { transform: rotate(0deg); }
            100%  { transform: rotate(360deg); }
        }
    `;
    }

    static flashMsg(options) {
        return (new FlashMessage).show(options);
    }

    show(options = {}) {
        this.installStylesheetElement();

        // Wait for hold to be released
        if (FlashMessage.isHolding) {
            setTimeout(() => this.show({ ...options, holdInterval: null }), 500);
            return;
        }

        let {
            message = '',
            type = 'info',
            target = null,
            clear = null,
            interval = 3,
            holdInterval = 0
        } = options;

        // Legacy API
        if (options.text) message = options.text;
        if (options.class) type = options.class;

        // Error singles
        if (clear || type === 'error' || type === 'loading') {
            this.deleteFlashMessages(clear);
        }

        // Nothing to show
        if (!message) {
            return;
        }

        // Idempotence
        if (target) {
            target.removeAttribute('data-control');
        }

        // Inject element
        var flashElement = this.createFlashElement(message, type);
        this.createMessagesElement().appendChild(flashElement);
        setTimeout(function() { flashElement.classList.add('flash-show'); }, 100);

        // Events
        flashElement.addEventListener('click', pause);
        flashElement.addEventListener('extras:flash-remove', remove);
        flashElement.querySelector('.flash-close').addEventListener('click', remove);

        // Timeout
        var timer;
        if (interval && interval !== 0) {
            timer = setTimeout(remove, interval * 1000);
        }

        // Hold for a minimum interval
        var holdTimer;
        if (holdInterval) {
            FlashMessage.isHolding = true;
            flashElement.flashMessageHold = true;

            holdTimer = setTimeout(() => {
                FlashMessage.isHolding = false;
                flashElement.flashMessageHold = false;
            }, holdInterval * 1000);
        }

        // Remove logic
        function remove(event) {
            // Wait for hold to be released
            if (flashElement.flashMessageHold) {
                setTimeout(() => remove(event), 500);
                return;
            }

            clearInterval(timer);
            clearInterval(holdTimer);
            flashElement.removeEventListener('click', pause);
            flashElement.removeEventListener('extras:flash-remove', remove);
            flashElement.querySelector('.flash-close').removeEventListener('click', remove);
            flashElement.classList.remove('flash-show');

            if (event && event.detail.isReplace) {
                flashElement.remove();
            }
            else {
                setTimeout(function() {
                    flashElement.remove();
                }, 600);
            }
        }

        // Pause logic
        function pause() {
            clearInterval(timer);
        }
    }

    render() {
        var self = this;
        document.querySelectorAll('[data-control=flash-message]').forEach(function(el) {
            self.show({ ...el.dataset, target: el, message: el.innerHTML });
            el.remove();
        });
    }

    deleteFlashMessages(clear) {
        const flashSelector = typeof clear === 'string' ? '.oc-flash-message.' + clear : '.oc-flash-message';
        document.querySelectorAll(flashSelector).forEach(function(el) {
            el.dispatchEvent(new CustomEvent('extras:flash-remove', { detail: { isReplace: true }}));
        });
    }

    createFlashElement(message, type) {
        const element = document.createElement('div');
        const loadingHtml = type === 'loading' ? '<span class="flash-loader"></span>' : '';
        const closeHtml = '<a class="flash-close"></a>';
        element.className = 'oc-flash-message ' + type;
        element.innerHTML = loadingHtml + '<span class="flash-message">' + message + '</span>' + closeHtml;
        return element;
    }

    // Private
    installStylesheetElement() {
        if (!FlashMessage.stylesheetReady) {
            document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
            FlashMessage.stylesheetReady = true;
        }
    }

    createStylesheetElement() {
        const element = document.createElement('style');
        element.textContent = FlashMessage.defaultCSS;
        return element;
    }

    createMessagesElement() {
        const found = document.querySelector('.oc-flash-messages')
        if (found) {
            return found;
        }

        const element = document.createElement('div');
        element.className = 'oc-flash-messages';
        document.body.appendChild(element);
        return element;
    }
}
