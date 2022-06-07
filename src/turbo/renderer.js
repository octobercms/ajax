import { array } from "../util";

export class Renderer
{
    renderView(callback) {
        this.delegate.viewWillRender(this.newBody);
        callback();
        this.delegate.viewRendered(this.newBody);
    }

    invalidateView() {
        this.delegate.viewInvalidated();
    }

    createScriptElement(element) {
        if (element.getAttribute("data-turbo-eval") === "false") {
            return element;
        }
        else {
            const createdScriptElement = document.createElement("script");
            createdScriptElement.textContent = element.textContent;
            createdScriptElement.async = false;
            copyElementAttributes(createdScriptElement, element);
            return createdScriptElement;
        }
    }
}

function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of array(sourceElement.attributes)) {
        destinationElement.setAttribute(name, value);
    }
}
