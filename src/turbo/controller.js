import { BrowserAdapter } from "./browser-adapter";
import { History } from "./history";
import { Location } from "./location";
import { ScrollManager } from "./scroll-manager";
import { SnapshotCache } from "./snapshot-cache";
import { dispatch, defer, uuid } from "../util";
import { View } from "./view";
import { Visit } from "./visit";

export class Controller
{
    constructor() {
        this.adapter = new BrowserAdapter(this);
        this.history = new History(this);
        this.restorationData = {};
        this.scrollManager = new ScrollManager(this);
        this.view = new View(this);
        this.cache = new SnapshotCache(10);
        this.enabled = true;
        this.pendingAssets = 0;
        this.progressBarDelay = 500;
        this.started = false;

        // Event handlers
        this.pageLoaded = () => {
            this.lastRenderedLocation = this.location;
            this.notifyApplicationAfterPageLoad();
        };

        this.clickCaptured = () => {
            removeEventListener('click', this.clickBubbled, false);
            addEventListener('click', this.clickBubbled, false);
        };

        this.clickBubbled = (event) => {
            if (this.enabled && this.clickEventIsSignificant(event)) {
                const link = this.getVisitableLinkForTarget(event.target);
                if (link) {
                    const location = this.getVisitableLocationForLink(link);
                    if (location && this.applicationAllowsFollowingLinkToLocation(link, location)) {
                        event.preventDefault();
                        const action = this.getActionForLink(link);
                        this.visit(location, { action });
                    }
                }
            }
        };
    }

    start() {
        if (Controller.supported && !this.started && this.documentIsEnabled()) {
            addEventListener('click', this.clickCaptured, true);
            addEventListener('DOMContentLoaded', this.pageLoaded, false);
            this.scrollManager.start();
            this.startHistory();
            this.started = true;
            this.enabled = true;
        }
    }

    disable() {
        this.enabled = false;
    }

    stop() {
        if (this.started) {
            removeEventListener('click', this.clickCaptured, true);
            removeEventListener('DOMContentLoaded', this.pageLoaded, false);
            this.scrollManager.stop();
            this.stopHistory();
            this.started = false;
        }
    }

    isEnabled() {
        return this.started && this.enabled;
    }

    clearCache() {
        this.cache = new SnapshotCache(10);
    }

    visit(location, options = {}) {
        location = Location.wrap(location);
        if (this.applicationAllowsVisitingLocation(location)) {
            if (this.locationIsVisitable(location)) {
                const action = options.action || 'advance';
                this.adapter.visitProposedToLocationWithAction(location, action);
            }
            else {
                window.location.href = location.toString();
            }
        }
    }

    startVisitToLocationWithAction(location, action, restorationIdentifier) {
        if (Controller.supported) {
            const restorationData = this.getRestorationDataForIdentifier(restorationIdentifier);
            this.startVisit(Location.wrap(location), action, { restorationData });
        }
        else {
            window.location.href = location.toString();
        }
    }

    setProgressBarDelay(delay) {
        this.progressBarDelay = delay;
    }

    // History
    startHistory() {
        this.location = Location.currentLocation;
        this.restorationIdentifier = uuid();
        this.history.start();
        this.history.replace(this.location, this.restorationIdentifier);
    }

    stopHistory() {
        this.history.stop();
    }

    pushHistoryWithLocationAndRestorationIdentifier(locatable, restorationIdentifier) {
        this.location = Location.wrap(locatable);
        this.restorationIdentifier = restorationIdentifier;
        this.history.push(this.location, this.restorationIdentifier);
    }

    replaceHistoryWithLocationAndRestorationIdentifier(locatable, restorationIdentifier) {
        this.location = Location.wrap(locatable);
        this.restorationIdentifier = restorationIdentifier;
        this.history.replace(this.location, this.restorationIdentifier);
    }

    // History delegate
    historyPoppedToLocationWithRestorationIdentifier(location, restorationIdentifier) {
        if (this.enabled) {
            this.location = location;
            this.restorationIdentifier = restorationIdentifier;
            const restorationData = this.getRestorationDataForIdentifier(restorationIdentifier);
            this.startVisit(location, "restore", { restorationIdentifier, restorationData, historyChanged: true });
        }
        else {
            this.adapter.pageInvalidated();
        }
    }

    // Snapshot cache
    getCachedSnapshotForLocation(location) {
        const snapshot = this.cache.get(location);
        return snapshot ? snapshot.clone() : snapshot;
    }

    shouldCacheSnapshot() {
        return this.view.getSnapshot().isCacheable();
    }

    cacheSnapshot() {
        if (this.shouldCacheSnapshot()) {
            this.notifyApplicationBeforeCachingSnapshot();
            const snapshot = this.view.getSnapshot();
            const location = this.lastRenderedLocation || Location.currentLocation;
            defer(() => this.cache.put(location, snapshot.clone()));
        }
    }

    // Scrolling
    scrollToAnchor(anchor) {
        const element = this.view.getElementForAnchor(anchor);
        if (element) {
            this.scrollToElement(element);
        }
        else {
            this.scrollToPosition({ x: 0, y: 0 });
        }
    }

    scrollToElement(element) {
        this.scrollManager.scrollToElement(element);
    }

    scrollToPosition(position) {
        this.scrollManager.scrollToPosition(position);
    }

    // Scroll manager delegate
    scrollPositionChanged(position) {
        const restorationData = this.getCurrentRestorationData();
        restorationData.scrollPosition = position;
    }

    // Pending asset management
    incrementPendingAsset() {
        this.pendingAssets++;
    }

    decrementPendingAsset() {
        this.pendingAssets--;
        if (this.pendingAssets === 0) {
            this.notifyApplicationAfterLoadScripts();
        }
    }

    // View
    render(options, callback) {
        this.view.render(options, callback);
    }

    viewInvalidated() {
        this.adapter.pageInvalidated();
    }

    viewWillRender(newBody) {
        this.notifyApplicationBeforeRender(newBody);
    }

    viewRendered() {
        this.lastRenderedLocation = this.currentVisit.location;
        this.notifyApplicationAfterRender();
    }

    // Application events
    applicationAllowsFollowingLinkToLocation(link, location) {
        const event = this.notifyApplicationAfterClickingLinkToLocation(link, location);
        return !event.defaultPrevented;
    }

    applicationAllowsVisitingLocation(location) {
        const event = this.notifyApplicationBeforeVisitingLocation(location);
        return !event.defaultPrevented;
    }

    notifyApplicationAfterClickingLinkToLocation(link, location) {
        return dispatch('page:click', { target: link, detail: { url: location.absoluteURL } });
    }

    notifyApplicationBeforeVisitingLocation(location) {
        return dispatch('page:before-visit', { detail: { url: location.absoluteURL } });
    }

    notifyApplicationAfterVisitingLocation(location) {
        return dispatch('page:visit', { detail: { url: location.absoluteURL }, cancelable: false });
    }

    notifyApplicationBeforeCachingSnapshot() {
        return dispatch('page:before-cache', { cancelable: false });
    }

    notifyApplicationBeforeRender(newBody) {
        return dispatch('page:before-render', { detail: { newBody }, cancelable: false });
    }

    notifyApplicationAfterRender() {
        return dispatch('page:render', { cancelable: false });
    }

    notifyApplicationAfterPageLoad(timing = {}) {
        return dispatch('page:load', { detail: { url: this.location.absoluteURL, timing }, cancelable: false });
    }

    notifyApplicationAfterLoadScripts() {
        return dispatch('page:after-load', { cancelable: false });
    }

    // Private
    startVisit(location, action, properties) {
        if (this.currentVisit) {
            this.currentVisit.cancel();
        }
        this.currentVisit = this.createVisit(location, action, properties);
        this.currentVisit.start();
        this.notifyApplicationAfterVisitingLocation(location);
    }

    createVisit(location, action, properties) {
        const visit = new Visit(this, location, action, properties.restorationIdentifier);
        visit.restorationData = Object.assign({}, (properties.restorationData || {}));
        visit.historyChanged = !!properties.historyChanged;
        visit.referrer = this.location;
        return visit;
    }

    visitCompleted(visit) {
        this.notifyApplicationAfterPageLoad(visit.getTimingMetrics());

        if (this.pendingAssets === 0) {
            this.notifyApplicationAfterLoadScripts();
        }
    }

    clickEventIsSignificant(event) {
        return !((event.target && event.target.isContentEditable)
            || event.defaultPrevented
            || event.which > 1
            || event.altKey
            || event.ctrlKey
            || event.metaKey
            || event.shiftKey);
    }

    getVisitableLinkForTarget(target) {
        if (target instanceof Element && this.elementIsVisitable(target)) {
            return target.closest('a[href]:not([target]):not([download])');
        }
    }

    getVisitableLocationForLink(link) {
        const location = new Location(link.getAttribute("href") || "");
        if (this.locationIsVisitable(location)) {
            return location;
        }
    }

    getActionForLink(link) {
        const action = link.getAttribute('data-turbo-action');
        return this.isAction(action) ? action : "advance";
    }

    isAction(action) {
        return action == "advance" || action == "replace" || action == "restore";
    }

    documentIsEnabled() {
        const meta = document.documentElement.querySelector('head meta[name="turbo-visit-control"]');
        if (meta) {
            return meta.getAttribute('content') != 'disable';
        }
        else {
            return true;
        }
    }

    elementIsVisitable(element) {
        const container = element.closest('[data-turbo]');
        if (container) {
            return container.getAttribute('data-turbo') != 'false';
        }
        else {
            return true;
        }
    }

    locationIsVisitable(location) {
        return location.isPrefixedBy(this.view.getRootLocation()) && location.isHTML();
    }

    locationIsSamePageAnchor(location) {
        return typeof location.anchor != 'undefined' && location.requestURL == this.location.requestURL;
    }

    getCurrentRestorationData() {
        return this.getRestorationDataForIdentifier(this.restorationIdentifier);
    }

    getRestorationDataForIdentifier(identifier) {
        if (!(identifier in this.restorationData)) {
            this.restorationData[identifier] = {};
        }
        return this.restorationData[identifier];
    }
}

Controller.supported = !!(window.history.pushState &&
    window.requestAnimationFrame &&
    window.addEventListener);
