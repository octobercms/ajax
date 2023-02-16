// FormSerializer serializes input elements to JSON
export class FormSerializer
{
    // Public
    static assignToObj(obj, name, value) {
        (new FormSerializer).assignObjectInternal(obj, name, value);
    }

    static serializeJSON(element) {
        return (new FormSerializer).parseContainer(element);
    }

    // Private
    parseContainer(element) {
        let jsonData = {};
        element.querySelectorAll('input, select').forEach((el) => {
            this.assignObjectInternal(jsonData, el.name, el.value);
        });
        return jsonData;
    }

    assignObjectInternal(obj, fieldName, fieldValue) {
        this.assignObjectNested(
            obj,
            this.nameToArray(fieldName),
            fieldValue
        );
    }

    assignObjectNested(obj, fieldArr, fieldValue) {
        var currentTarget = obj,
            lastIndex = fieldArr.length - 1;

        fieldArr.forEach(function(prop, index) {
            if (currentTarget[prop] === undefined) {
                currentTarget[prop] = {};
            }

            if (index === lastIndex) {
                currentTarget[prop] = fieldValue;
            }

            currentTarget = currentTarget[prop];
        });
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
}
