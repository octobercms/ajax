/**
 * getReferrerUrl returns the last visited URL
 */
export function getReferrerUrl() {
    if (oc.useTurbo && oc.useTurbo()) {
        return oc.AjaxTurbo.controller.getLastVisitUrl();
    }

    return getReferrerFromSameOrigin();
}

function getReferrerFromSameOrigin() {
    if (!document.referrer) {
        return null;
    }

    // Fallback when turbo router is not activated
    try {
        const referrer = new URL(document.referrer);
        if (referrer.origin !== location.origin) {
            return null;
        }

        const pushReferrer = localStorage.getItem('ocPushStateReferrer');
        if (pushReferrer && pushReferrer.indexOf(referrer.pathname) === 0) {
            return pushReferrer;
        }

        return document.referrer;
    }
    catch (e) {
    }
}
