import { jsdom } from 'jsdom-jscore-rn';

class _DOM {
  parse(text) {
    return jsdom(text);
  }
}

const DOM = new _DOM();

export { DOM };