export default class Utils {
  constructor() {
    this.parser = new DOMParser();
  }

  compareTypes(variable, type) {
    return Object.prototype.toString.call(variable).toLowerCase() === `[object ${type}]`;
  }

  isNumber(number) {
    return this.isSet(number) && this.compareTypes(number, `number`) && !isNaN(number);
  }

  isObject(object) {
    return this.isSet(object) && this.compareTypes(object, `object`);
  }

  isSet(variable) {
    return typeof variable !== `undefined` && variable !== null;
  }

  isString(string) {
    return this.isSet(string) && this.compareTypes(string, `string`);
  }

  isValidDate(date) {
    return this.isSet(date) && this.compareTypes(date, `date`) && !isNaN(date);
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

  createUuid(c) {
    let r, v;
    r = Math.random() * 16 | 0;
    v = c === `x` ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }
}

export let utils = new Utils;
