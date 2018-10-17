export default class Utils {
  constructor() {
    this.months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    this.parser = new DOMParser();
  }

  compareTypes(variable, type) {
    return Object.prototype.toString.call(variable) === `[object ${type}]`;
  }

  formatDate(template, date) {
    if (!this.isSet(template)) {
      template = `[MMMM] [D], [YYYY], [H12]:[HMM] [XX]`;
    }
    if (!this.isSet(date)) {
      date = new Date();
    }
    if (this.isNumber(date)) {
      date = new Date(date);
    }
    if (!this.isValidDate(date)) {
      throw `Invalid date`;
    }

    return template
      .replace(/\[D]/i, date.getDate())
      .replace(/\[DD]/i, `0${date.getDate()}`.slice(-2))
      .replace(/\[M]/i, (date.getMonth() + 1).toString())
      .replace(/\[MM]/i, `0${date.getMonth() + 1}`.slice(-2))
      .replace(/\[MMM]/i, this.months[date.getMonth()].slice(0, 3))
      .replace(/\[MMMM]/i, this.months[date.getMonth()])
      .replace(/\[YYYY]/i, date.getFullYear().toString())
      .replace(/\[H]/i, date.getHours().toString())
      .replace(/\[HH]/i, `0${date.getHours()}`.slice(-2))
      .replace(/\[H12]/i, `${date.getHours() % 12}`.replace(/^0$/, `12`))
      .replace(/\[HH12]/i, `0${date.getHours() % 12}`.slice(-2).replace(/^0$/, `12`))
      .replace(/\[HM]/i, date.getMinutes().toString())
      .replace(/\[HMM]/i, `0${date.getMinutes()}`.slice(-2))
      .replace(/\[S]/i, date.getSeconds().toString())
      .replace(/\[SS]/i, `0${date.getSeconds()}`.slice(-2))
      .replace(/\[XX]/i, date.getHours() < 12 ? `am` : `pm`);
  }

  isNumber(number) {
    return this.isSet(number) && this.compareTypes(number, `Number`) && !isNaN(number);
  }

  isObject(object) {
    return this.isSet(object) && this.compareTypes(object, `Object`);
  }

  isSet(variable) {
    return typeof variable !== `undefined` && variable !== null;
  }

  isString(string) {
    return this.isSet(string) && this.compareTypes(string, `String`);
  }

  isValidDate(date) {
    return this.isSet(date) && this.compareTypes(date, `Date`) && !isNaN(date);
  }

  parseHtml(string) {
    return this.parser.parseFromString(string, `text/html`);
  }

  sortArray(array, desc, key) {
    if (!this.isSet(array) || !Array.isArray(array)) {
      throw `The "array" argument is not an array`;
    }

    const modifier = desc ? -1 : 1;
    return array.sort((a, b) => {
      if (this.isObject(a) && this.isObject(b)) {
        if (key && this.isString(key)) {
          if (this.isNumber(a[key]) && this.isNumber(b[key])) {
            if (a[key] < b[key]) {
              return -1 * modifier;
            }
            if (a[key] > b[key]) {
              return modifier;
            }
            return 0;
          }
          return a[key].localeCompare(b[key], {
            sensitivity: `base`
          }) * modifier;
        }
        return 0;
      }
      if (this.isNumber(a) && this.isNumber(b)) {
        if (a < b) {
          return -1 * modifier;
        }
        if (a > b) {
          return modifier;
        }
        return 0;
      }
      return a.localeCompare(b, {
        sensitivity: `base`
      }) * modifier;
    });
  }

  rgba2Hex(string) {
    const match = string.match(/rgba?\((\d+?),\s*(\d+?),\s*(\d+?)(,\s*(.+?))?\)/);
    if (!match) {
      return {
        hex: string,
        alpha: 1.0
      };
    }
    const red = parseInt(match[1]);
    const green = parseInt(match[2]);
    const blue = parseInt(match[3]);
    const alpha = (match[5] && parseFloat(match[5])) || 1.0;
    return {
      hex: `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`,
      alpha
    };
  }

  hex2Rgba(hex, alpha) {
    alpha = parseFloat(alpha);
    if (alpha === 1.0) {
      return hex;
    }
    const match = hex.match(/[\dA-Fa-f]{2}/g);
    if (!match) {
      return ``;
    }
    const red = parseInt(match[0], 16);
    const green = parseInt(match[1], 16);
    const blue = parseInt(match[2], 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
}

export let utils = new Utils;
