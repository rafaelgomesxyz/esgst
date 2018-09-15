let utils = (function () {
    this.compareTypes = function (variable, type) {
        return Object.prototype.toString.call(variable) === `[object ${type}]`;
    };

    this.formatDate = (function () {
        const months = [
            `January`,
            `February`,
            `March`,
            `April`,
            `May`,
            `June`,
            `July`,
            `August`,
            `September`,
            `October`,
            `November`,
            `December`
        ];

        return function (template, date) {
            if (!isSet(template)) {
                template = `[MMMM] [D], [YYYY], [H12]:[HMM] [XX]`;
            }
            if (!isSet(date)) {
                date = new Date();
            }
            if (isNumber(date)) {
                date = new Date(date);
            }
            if (!isValidDate(date)) {
                throw (`Invalid date`);
            }

            return template
                .replace(/\[D\]/i, date.getDate())
                .replace(/\[DD\]/i, `0${date.getDate()}`.slice(-2))
                .replace(/\[M\]/i, date.getMonth() + 1)
                .replace(/\[MM\]/i, `0${date.getMonth() + 1}`.slice(-2))
                .replace(/\[MMM\]/i, months[date.getMonth()].slice(0, 3))
                .replace(/\[MMMM\]/i, months[date.getMonth()])
                .replace(/\[YYYY\]/i, date.getFullYear())
                .replace(/\[H\]/i, date.getHours())
                .replace(/\[HH\]/i, `0${date.getHours()}`.slice(-2))
                .replace(/\[H12\]/i, `${date.getHours() % 12}`.replace(/^0$/, `12`))
                .replace(/\[HH12\]/i, `0${date.getHours() % 12}`.slice(-2).replace(/^0$/, `12`))
                .replace(/\[HM\]/i, date.getMinutes())
                .replace(/\[HMM\]/i, `0${date.getMinutes()}`.slice(-2))
                .replace(/\[S\]/i, date.getSeconds())
                .replace(/\[SS\]/i, `0${date.getSeconds()}`.slice(-2))
                .replace(/\[XX\]/i, date.getHours() < 12 ? `am` : `pm`);
        };
    })();

    this.isNumber = function (number) {
        return isSet(number) && compareTypes(number, `Number`) && !isNaN(number);
    };

    this.isObject = function (object) {
        return isSet(object) && compareTypes(object, `Object`);
    };

    this.isSet = function (variable) {
        return typeof variable !== `undefined` && variable !== null;
    };

    this.isString = function (string) {
        return isSet(string) && compareTypes(string, `String`);
    };

    this.isValidDate = function (date) {
        return isSet(date) && compareTypes(date, `Date`) && !isNaN(date);
    };

    this.parseHtml = (function () {
        const parser = new DOMParser();

        return function (string) {
            return parser.parseFromString(string, `text/html`);
        };
    })();

    this.sortArray = function (array, desc, key) {
        if (!isSet(array) || !Array.isArray(array)) {
            throw (`The "array" argument is not an array`);
        }

        const modifier = desc ? -1 : 1;
        return array.sort(function (a, b) {
            if (isObject(a) && isObject(b)) {
                if (key && isString(key)) {
                    if (isNumber(a[key]) && isNumber(b[key])) {
                        if (a[key] < b[key]) {
                            return -1 * modifier;
                        }
                        if (a[key] > b[key]) {
                            return 1 * modifier;
                        }
                        return 0;
                    }
                    return a[key].localeCompare(b[key], {
                        sensitivity: `base`
                    }) * modifier;
                }
                return 0;
            }
            if (isNumber(a) && isNumber(b)) {
                if (a < b) {
                    return -1 * modifier;
                }
                if (a > b) {
                    return 1 * modifier;
                }
                return 0;
            }
            return a.localeCompare(b, {
                sensitivity: `base`
            }) * modifier;
        });
    };
})();

module.exports = {
  default: new utils
};
