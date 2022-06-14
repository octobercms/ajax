import { Events } from "../util/events";
import { RequestBuilder } from "./request-builder";

export class Controller
{
    constructor() {
        this.started = false;
    }

    start() {
        if (!this.started) {
            this.started = true;
        }

        // Track unload event for request lib
        window.onbeforeunload = this.documentOnBeforeUnload;

        // Render event
        addEventListener('DOMContentLoaded', this.render, false);
        addEventListener('page:after-load', this.render, false);
        addEventListener('ajax:update-complete', this.render, false);

        // Submit form
        Events.on(document, 'submit', '[data-request]', this.documentOnSubmit);

        // Track input
        Events.on(document, 'input', 'input[data-request][data-track-input]', this.documentOnKeyup);

        // Change select, checkbox, radio, file input
        Events.on(document, 'change', 'select[data-request], input[type=radio][data-request], input[type=checkbox][data-request], input[type=file][data-request]', this.documentOnChange);

        // Press enter on orphan input
        Events.on(document, 'keydown', 'input[type=text][data-request], input[type=submit][data-request], input[type=password][data-request]', this.documentOnKeydown);

        // Click submit button or link
        Events.on(document, 'click', 'a[data-request], button[data-request], input[type=button][data-request], input[type=submit][data-request]', this.documentOnClick);
    }

    stop() {
        if (this.started) {
            this.started = false;
        }
    }

    render(event) {
        Events.dispatch('render');
        window.dispatchEvent(new Event('resize'));
    }

    documentOnSubmit(event) {
        event.preventDefault();

        RequestBuilder.fromElement(event.target);
    }

    documentOnClick(event) {
        event.preventDefault();

        var el = event.target;
        RequestBuilder.fromElement(el);
    }

    documentOnChange(event) {
        RequestBuilder.fromElement(event.target);
    }

    documentOnKeyup(event) {
        var el = event.target,
            lastValue = el.dataset.ocLastValue;

        if (['email', 'number', 'password', 'search', 'text'].indexOf(el.type) === -1) {
            return;
        }

        if (lastValue !== undefined && lastValue == el.value) {
            return;
        }

        el.dataset.ocLastValue = el.value;

        if (this.dataTrackInputTimer !== undefined) {
            window.clearTimeout(this.dataTrackInputTimer);
        }

        var interval = el.getAttribute('data-track-input');
        if (!interval) {
            interval = 300;
        }

        var self = this;
        this.dataTrackInputTimer = window.setTimeout(function() {
            if (self.lastDataTrackInputRequest) {
                self.lastDataTrackInputRequest.abort();
            }

            self.lastDataTrackInputRequest = RequestBuilder.fromElement(el);
        }, interval);
    }

    documentOnKeydown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (this.dataTrackInputTimer !== undefined) {
                window.clearTimeout(this.dataTrackInputTimer);
            }

            RequestBuilder.fromElement(event.target);
        }
    }

    documentOnBeforeUnload(event) {
        window.ocUnloading = true;
    }
}
