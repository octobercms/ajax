export class Data
{
    constructor(userData, targetEl, formEl) {
        this.userData = userData || {};
        this.targetEl = targetEl;
        this.formEl = formEl;
    }

    static fetch(userData, targetEl, formEl) {
        return (new this(userData, targetEl, formEl)).getRequestData();
    }

    // Public
    getRequestData() {
        let requestData;

        // Serialize form
        if (this.formEl) {
            requestData = new FormData(this.formEl);
        }
        else {
            requestData = new FormData;
        }

        // Encode JSON to form data
        this.appendJsonToFormData(requestData, this.userData);

        // Add single input data
        this.appendSingleInputElement(requestData);

        return requestData;
    }

    // Private
    appendSingleInputElement(requestData) {
        // Not single or input
        if (this.formEl || ['INPUT', 'SELECT'].indexOf(this.targetEl.tagName) === -1) {
            return;
        }

        // No name or supplied by user data already
        const inputName = this.targetEl.name;
        if (!inputName || this.userData[inputName] !== undefined) {
            return;
        }

        // Include files, if they are any
        if (this.targetEl.type === 'file') {
            this.targetEl.files.forEach(function(value) {
                requestData.append(inputName, value);
            });
        }
        else {
            requestData.append(inputName, this.targetEl.value);
        }
    }

    appendJsonToFormData(formData, useJson, parentKey) {
        for (var key in useJson) {
            var fieldKey = key;
            if (parentKey) {
                fieldKey = parentKey + '[' + key + ']';
            }

            var value = useJson[key];

            // Object
            if (value && value.constructor === {}.constructor) {
                this.appendJsonToFormData(formData, value, fieldKey);
            }
            // Array
            else if (value && value.constructor === [].constructor) {
                value.forEach(function(v) {
                    formData.append(fieldKey + '[]', v);
                });
            }
            // Mixed
            else {
                formData.append(fieldKey, value);
            }
        }
    }
}

