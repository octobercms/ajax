import { Events } from "./events";

export var SystemStatusCode = {
    networkFailure: 0,
    timeoutFailure: -1,
    contentTypeMismatch: -2,
    userAborted: -3
}

export class HttpRequest
{
    static timeout = 240;

    constructor(delegate, url, options) {
        this.failed = false;
        this.progress = 0;
        this.sent = false;

        this.delegate = delegate;
        this.url = url;
        this.options = options;

        this.headers = options.headers || {};
        this.method = options.method || 'GET';
        this.data = options.data;

        // XMLHttpRequest events
        this.requestProgressed = (event) => {
            if (event.lengthComputable) {
                this.setProgress(event.loaded / event.total);
            }
        };

        this.requestLoaded = () => {
            this.endRequest(xhr => {
                const contentType = xhr.getResponseHeader('Content-Type');
                const responseData = contentTypeIsJSON(contentType) ? JSON.parse(xhr.responseText) : xhr.responseText;

                if (this.options.htmlOnly && !contentTypeIsHTML(contentType)) {
                    this.failed = true;
                    this.delegate.requestFailedWithStatusCode(SystemStatusCode.contentTypeMismatch);
                    return;
                }

                if (xhr.status >= 200 && xhr.status < 300) {
                    this.delegate.requestCompletedWithResponse(responseData, xhr.status, contentResponseIsRedirect(xhr, this.url));
                }
                else {
                    this.failed = true;
                    this.delegate.requestFailedWithStatusCode(xhr.status, responseData);
                }
            });
        };

        this.requestFailed = () => {
            this.endRequest(() => {
                this.failed = true;
                this.delegate.requestFailedWithStatusCode(SystemStatusCode.networkFailure);
            });
        };

        this.requestTimedOut = () => {
            this.endRequest(() => {
                this.failed = true;
                this.delegate.requestFailedWithStatusCode(SystemStatusCode.timeoutFailure);
            });
        };

        this.requestCanceled = () => {
            if (this.options.trackAbort) {
                this.endRequest(() => {
                    this.failed = true;
                    this.delegate.requestFailedWithStatusCode(SystemStatusCode.userAborted);
                });
            }
            else {
                this.endRequest();
            }
        };

        this.createXHR();
    }

    send() {
        if (this.xhr && !this.sent) {
            this.notifyApplicationBeforeRequestStart();
            this.setProgress(0);
            this.xhr.send(this.data || null);
            this.sent = true;
            this.delegate.requestStarted();
        }
    }

    abort() {
        if (this.xhr && this.sent) {
            this.xhr.abort();
        }
    }

    // Application events
    notifyApplicationBeforeRequestStart() {
        Events.dispatch('ajax:request-start', { detail: { url: this.url, xhr: this.xhr }, cancelable: false });
    }

    notifyApplicationAfterRequestEnd() {
        Events.dispatch('ajax:request-end', { detail: { url: this.url, xhr: this.xhr }, cancelable: false });
    }

    // Private
    createXHR() {
        const xhr = this.xhr = new XMLHttpRequest;
        const timeout = HttpRequest.timeout * 1000;

        xhr.open(this.method, this.url, true);
        xhr.timeout = timeout;

        xhr.onprogress = this.requestProgressed;
        xhr.onload = this.requestLoaded;
        xhr.onerror = this.requestFailed;
        xhr.ontimeout = this.requestTimedOut;
        xhr.onabort = this.requestCanceled;

        for (var i in this.headers) {
            xhr.setRequestHeader(i, this.headers[i]);
        }

        return xhr;
    }

    endRequest(callback = () => { }) {
        if (this.xhr) {
            this.notifyApplicationAfterRequestEnd();
            callback(this.xhr);
            this.destroy();
        }
    }

    setProgress(progress) {
        this.progress = progress;
        this.delegate.requestProgressed(progress);
    }

    destroy() {
        this.setProgress(1);
        this.delegate.requestFinished();
    }
}

function contentResponseIsRedirect(xhr, url) {
    if (xhr.getResponseHeader('X-OCTOBER-LOCATION')) {
        return xhr.getResponseHeader('X-OCTOBER-LOCATION');
    }

    var anchorMatch = url.match(/^(.*)#/),
        wantUrl = anchorMatch ? anchorMatch[1] : url;

    return wantUrl !== xhr.responseURL ? xhr.responseURL : null;
}

function contentTypeIsHTML(contentType) {
    return (contentType || '').match(/^text\/html|^application\/xhtml\+xml/);
}

function contentTypeIsJSON(contentType) {
    return (contentType || '').includes('application/json');
}
