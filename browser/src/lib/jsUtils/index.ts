class _Utils {
  private compareTypes(obj: any, type: string): boolean {
    return Object.prototype.toString.call(obj).toLowerCase() === `[object ${type}]`;
  }

  private getPath(pathString: string): string[] {
    return pathString.split(/\.|\[|]/).filter(x => x);
  }

  createUuid(c: string): string {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);

    return v.toString(16);
  }

  getProperty(obj: any, path: string | string[]) {
    if (!Array.isArray(path)) {
      path = this.getPath(path);
    }

    return path.reduce((obj, key) => (obj && obj[key]) ? obj[key] : null, obj);
  }

  hex2Rgba(hex: string, alpha: string): string {
    const alphaNumber = parseFloat(alpha);

    if (alphaNumber === 1.0) {
      return hex;
    }

    const match = hex.match(/[\dA-Fa-f]{2}/g);

    if (!match) {
      return '';
    }

    const red = parseInt(match[0], 16);
    const green = parseInt(match[1], 16);
    const blue = parseInt(match[2], 16);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  is(obj: any, type: string): boolean {
    if (!this.isSet(obj)) {
      return false;
    }

    switch (type) {
      case 'number': {
        return this.compareTypes(obj, 'number') && !isNaN(obj);
      }
      case 'object': {
        return this.compareTypes(obj, 'object');
      }
      case 'string': {
        return this.compareTypes(obj, 'string');
      }
    }
  }

  isSet(obj: any) : boolean {
    return typeof obj !== 'undefined' && obj !== null;
  }

  rgba2Hex(string: string): Object {
    const match = string.match(/rgba?\((\d+?),\s*(\d+?),\s*(\d+?)(,\s*(.+?))?\)/);

    if (!match) {
      return {
        hex: string,
        alpha: 1.0
      };
    }

    const red = `0${parseInt(match[1]).toString(16)}`.slice(-2);
    const green = `0${parseInt(match[2]).toString(16)}`.slice(-2);
    const blue = `0${parseInt(match[3]).toString(16)}`.slice(-2);
    const alpha = (match[5] && parseFloat(match[5])) || 1.0;

    return {
      hex: `#${red}${green}${blue}`,
      alpha
    };
  }

  setProperty(obj: any, path: string | string[], value: any) {
    if (!Array.isArray(path)) {
      path = this.getPath(path);
    }

    const key = path.pop();
    const property = this.getProperty(obj, path);

    property[key] = value;
  }

  sortArray(array: any[], desc: boolean, key: string): any[] {
    if (!this.isSet(array) || !Array.isArray(array)) {
      throw 'The "array" argument is not an array';
    }

    const modifier = desc ? -1 : 1;

    return array.sort((a, b) => {
      if (this.is(a, 'object') && this.is(b, 'object')) {
        if (this.is(key, 'string')) {
          if (this.is(a[key], 'number') && this.is(b[key], 'number')) {
            if (a[key] < b[key]) {
              return -1 * modifier;
            }

            if (a[key] > b[key]) {
              return modifier;
            }
            return 0;
          }

          return a[key].localeCompare(b[key], {
            sensitivity: 'base'
          }) * modifier;
        }

        return 0;
      }

      if (this.is(a, 'number') && this.is(b, 'number')) {
        if (a < b) {
          return -1 * modifier;
        }

        if (a > b) {
          return modifier;
        }

        return 0;
      }

      return a.localeCompare(b, {
        sensitivity: 'base'
      }) * modifier;
    });
  }
}

const Utils = new _Utils();

export { Utils };