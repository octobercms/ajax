import { unindent } from "../util";

export class FlashMessage
{
    static stylesheetReady = false;

    constructor() {
        this.stylesheetElement = this.createStylesheetElement();
    }

    static get defaultCSS() {
        return unindent `
        .oc-flash-message {
            position: fixed;
            z-index: 10300;
            width: 500px;
            left: 50%;
            top: 50px;
            margin-left: -250px;
            color: #fff;
            font-size: 1rem;
            padding: 10px 30px 10px 15px;
            border-radius: 5px;

            opacity: 0;
            transition: all 0.5s, width 0s;
            transform: scale(0.9);
        }
        .oc-flash-message.flash-show {
            opacity: 1;
            transform: scale(1);
        }
        .oc-flash-message.success {
            background: #86cB43;
        }
        .oc-flash-message.error {
            background: #cc3300;
        }
        .oc-flash-message.warning {
            background: #f0ad4e;
        }
        .oc-flash-message.info {
            background: #5fb6f5;
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
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
        }
        .oc-flash-message a.flash-close:hover,
        .oc-flash-message a.flash-close:focus {
            opacity: 1;
        }
        html[data-turbo-preview] .oc-flash-message {
            opacity: 0;
        }
        @media (max-width: 768px) {
            .oc-flash-message {
                left: 10px;
                right: 10px;
                top: 10px;
                margin-left: 0;
                width: auto;
            }
        }
    `;
    }

    static flashMsg(options) {
        return (new FlashMessage).show(options);
    }

    show(options = {}) {
        this.installStylesheetElement();

        let {
            message = '',
            type = 'info',
            target = null,
            interval = 5
        } = options;

        // Legacy API
        if (options.text) message = options.text;
        if (options.class) type = options.class;

        // Idempotence
        if (target) {
            target.removeAttribute('data-control');
        }

        // Error singles
        if (type === 'error') {
            this.deleteFlashMessages();
        }

        // Inject element
        var flashElement = this.createFlashElement(message, type);
        document.body.appendChild(flashElement);
        setTimeout(function() { flashElement.classList.add('flash-show'); }, 100);

        // Events
        flashElement.querySelector('.flash-close').addEventListener('click', remove);
        flashElement.addEventListener('extras:flash-remove', remove);

        // Timeout
        var timer;
        if (type !== 'error') {
            timer = window.setTimeout(remove, interval * 1000);
        }

        // Remove logic
        function remove() {
            window.clearInterval(timer);
            flashElement.removeEventListener('click', remove);
            flashElement.removeEventListener('extras:flash-remove', remove);
            flashElement.classList.remove('flash-show');

            setTimeout(function() {
                flashElement.remove();
            }, 1000);
        }
    }

    render() {
        var self = this;
        document.querySelectorAll('[data-control=flash-message]').forEach(function(el) {
            self.show({ ...el.dataset, target: el, message: el.innerHTML });
            el.remove();
        });
    }

    deleteFlashMessages() {
        document.querySelectorAll('.oc-flash-message').forEach(function(el) {
            el.dispatchEvent(new Event('extras:flash-remove'));
        });
    }

    createFlashElement(message, type) {
        const element = document.createElement('div');
        element.className = 'oc-flash-message ' + type;
        element.innerHTML = '<span>' + message + '</span><a class="flash-close"></a>';
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
}
