import { unindent } from "../util";

export class ProgressBar
{
    static stylesheetReady = false;

    constructor() {
        this.stylesheetElement = this.createStylesheetElement();
        this.progressElement = this.createProgressElement();
        this.hiding = false;
        this.value = 0;
        this.visible = false;
        this.trickle = () => {
            this.setValue(this.value + Math.random() / 100);
        };
    }

    static get defaultCSS() {
        return unindent `
        .oc-progress-bar {
            position: fixed;
            display: block;
            top: 0;
            left: 0;
            height: 3px;
            background: #0076ff;
            z-index: 9999;
            transition:
                width ${ProgressBar.animationDuration}ms ease-out,
                opacity ${ProgressBar.animationDuration / 2}ms ${ProgressBar.animationDuration / 2}ms ease-in;
            transform: translate3d(0, 0, 0);
        }
    `;
    }

    show() {
        if (!this.visible) {
            this.visible = true;
            this.installStylesheetElement();
            this.installProgressElement();
            this.startTrickling();
        }
    }

    hide() {
        if (this.visible && !this.hiding) {
            this.hiding = true;
            this.fadeProgressElement(() => {
                this.uninstallProgressElement();
                this.stopTrickling();
                this.visible = false;
                this.hiding = false;
            });
        }
    }

    setValue(value) {
        this.value = value;
        this.refresh();
    }

    // Private
    installStylesheetElement() {
        if (!ProgressBar.stylesheetReady) {
            document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
            ProgressBar.stylesheetReady = true;
        }
    }

    installProgressElement() {
        this.progressElement.style.width = "0";
        this.progressElement.style.opacity = "1";
        document.documentElement.insertBefore(this.progressElement, document.body);
        this.refresh();
    }

    fadeProgressElement(callback) {
        this.progressElement.style.opacity = "0";
        setTimeout(callback, ProgressBar.animationDuration * 1.5);
    }

    uninstallProgressElement() {
        if (this.progressElement.parentNode) {
            document.documentElement.removeChild(this.progressElement);
        }
    }

    startTrickling() {
        if (!this.trickleInterval) {
            this.trickleInterval = window.setInterval(this.trickle, ProgressBar.animationDuration);
        }
    }

    stopTrickling() {
        window.clearInterval(this.trickleInterval);
        delete this.trickleInterval;
    }

    refresh() {
        requestAnimationFrame(() => {
            this.progressElement.style.width = `${10 + (this.value * 90)}%`;
        });
    }

    createStylesheetElement() {
        const element = document.createElement('style');
        element.textContent = ProgressBar.defaultCSS;
        return element;
    }

    createProgressElement() {
        const element = document.createElement('div');
        element.className = 'oc-progress-bar';
        return element;
    }
}

ProgressBar.animationDuration = 300; /*ms*/
