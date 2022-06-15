export class Data
{
    constructor(userData, targetEl, formEl) {
        this.userData = userData || {};
        this.targetEl = targetEl;
        this.formEl = formEl;
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

        // Add single input data
        this.appendSingleInputElement(requestData);

        return requestData;
    }

    getAsFormData() {
        return this.appendJsonToFormData(
            this.getRequestData(),
            this.userData
        );
    }

    getAsJsonData() {
        return JSON.stringify(
            this.convertFormDataToJson(
                this.getAsFormData()
            )
        );
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

        return formData;
    }

    convertFormDataToJson(formData) {
        // Process to a flat object with array values
        let flatData = Object.fromEntries(
            Array.from(formData.keys()).map(key => [
                key,
                key.endsWith('[]')
                    ? formData.getAll(key)
                    : formData.getAll(key).pop()
            ])
        );

        // Process HTML names to a nested object
        let jsonData = {};
        for (var key in flatData) {
            this.assignObjectNested(
                jsonData,
                this.nameToArray(key),
                flatData[key]
            );
        }

        return jsonData;
    }

    nameToArray(fieldName) {
        var expression = /([^\]\[]+)/g,
            elements = [],
            searchResult;

        while ((searchResult = expression.exec(fieldName))) {
            elements.push(searchResult[0]);
        }

        return elements;
    }

    assignObjectNested(obj, fieldArr, value)  {
        var currentTarget = obj,
            lastIndex = fieldArr.length - 1;

        fieldArr.forEach(function(prop, index) {
            if (currentTarget[prop] === undefined) {
                currentTarget[prop] = index === lastIndex
                    ? value
                    : {};
            }

            currentTarget = currentTarget[prop];
        });
    }
}
