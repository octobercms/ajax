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

    getAsQueryString() {
        return this.convertFormDataToQuery(
            this.getAsFormData()
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
        // Has a form, or no target element
        if (this.formEl || !this.targetEl) {
            return;
        }

        // Not single or input
        if (['INPUT', 'SELECT'].indexOf(this.targetEl.tagName) === -1) {
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
        var self = this;
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
                value.forEach(function(v, i) {
                    if (
                        v.constructor === {}.constructor ||
                        v.constructor === [].constructor
                    ) {
                        self.appendJsonToFormData(formData, v, fieldKey + '[' + i + ']');
                    }
                    else {
                        formData.append(fieldKey + '[]', self.castJsonToFormData(v));
                    }
                });
            }
            // Mixed
            else {
                formData.append(fieldKey, this.castJsonToFormData(value));
            }
        }

        return formData;
    }

    convertFormDataToQuery(formData) {
        // Process to a flat object with array values
        let flatData = this.formDataToArray(formData);

        // Process HTML names to a query string
        return Object.keys(flatData)
            .map(function(key) { return key + '=' + encodeURIComponent(flatData[key]); })
            .join('&');
    }

    convertFormDataToJson(formData) {
        // Process to a flat object with array values
        let flatData = this.formDataToArray(formData);

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

    formDataToArray(formData) {
        return Object.fromEntries(
            Array.from(formData.keys()).map(key => [
                key,
                key.endsWith('[]')
                    ? formData.getAll(key)
                    : formData.getAll(key).pop()
            ])
        );
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
                currentTarget[prop] = {};
            }

            if (index === lastIndex) {
                currentTarget[prop] = value;
            }

            currentTarget = currentTarget[prop];
        });
    }

    castJsonToFormData(val) {
        if (val === null) {
            return '';
        }

        if (val === true) {
            return '1';
        }

        if (val === false) {
            return '0';
        }

        return val;
    }
}
