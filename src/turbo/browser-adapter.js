import { SystemStatusCode } from "../util/http-request";
import { ProgressBar } from "../extras/progress-bar";
import { uuid } from "../util";

export class BrowserAdapter
{
    constructor(controller) {
        this.progressBar = new ProgressBar;
        this.showProgressBar = () => {
            this.progressBar.show();
        };
        this.controller = controller;
    }

    visitProposedToLocationWithAction(location, action) {
        const restorationIdentifier = uuid();
        this.controller.startVisitToLocationWithAction(location, action, restorationIdentifier);
    }

    visitStarted(visit) {
        visit.issueRequest();
        visit.changeHistory();
        visit.loadCachedSnapshot();
    }

    visitRequestStarted(visit) {
        this.progressBar.setValue(0);
        if (visit.hasCachedSnapshot() || visit.action != 'restore') {
            this.showProgressBarAfterDelay();
        }
        else {
            this.showProgressBar();
        }
    }

    visitRequestProgressed(visit) {
        this.progressBar.setValue(visit.progress);
    }

    visitRequestCompleted(visit) {
        visit.loadResponse();
    }

    visitRequestFailedWithStatusCode(visit, statusCode) {
        switch (statusCode) {
            case SystemStatusCode.networkFailure:
            case SystemStatusCode.timeoutFailure:
            case SystemStatusCode.contentTypeMismatch:
            case SystemStatusCode.userAborted:
                return this.reload();
            default:
                return visit.loadResponse();
        }
    }

    visitRequestFinished(visit) {
        this.hideProgressBar();
    }

    visitCompleted(visit) {
        visit.followRedirect();
    }

    pageInvalidated() {
        this.reload();
    }

    visitFailed(visit) {
    }

    visitRendered(visit) {
    }

    // Private
    showProgressBarAfterDelay() {
        this.progressBarTimeout = window.setTimeout(this.showProgressBar, this.controller.progressBarDelay);
    }

    hideProgressBar() {
        this.progressBar.hide();
        if (this.progressBarTimeout !== null) {
            window.clearTimeout(this.progressBarTimeout);
            delete this.progressBarTimeout;
        }
    }

    reload() {
        window.location.reload();
    }
}
