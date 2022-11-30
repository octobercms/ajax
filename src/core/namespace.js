import { Controller } from "./controller";
import { Migrate } from "./migrate";
import { RequestBuilder } from "./request-builder";
import { JsonParser } from "./json-parser";
const controller = new Controller;

export default {
    controller,

    parseJSON: JsonParser.parseJSON,

    requestElement: RequestBuilder.fromElement,

    start() {
        controller.start();

        if (window.jQuery) {
            (new Migrate).bind();
        }
    },

    stop() {
        controller.stop();
    }
};
