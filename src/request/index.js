import Request from "./request";
export default Request;

if (!window.oc) {
    window.oc = {};
}

if (!window.oc.Request) {
    window.oc.Request = Request;
    window.oc.request = Request.send;
    window.oc.requestEl = Request.sendEl;
}
