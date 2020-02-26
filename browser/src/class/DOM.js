import { Utils } from '../lib/jsUtils';

class _DOM {
  constructor() {
    /** @type {DOMParser} */
    this._parser = new DOMParser();
  }

  /**
   * @param {HTMLElement} context
   * @param {string} items
   */
  _build(context, items) {
    for (const item of items) {
      if (!item) {
        continue;
      }

      if (typeof item === 'string') {
        const node = document.createTextNode(item);

        context.appendChild(node);

        continue;
      } else if (!Array.isArray(item)) {
        context.appendChild(item);

        continue;
      }

      const element = document.createElement(item[0]);

      if (Utils.isSet(item[1])) {
        if (Array.isArray(item[1])) {
          this._build(element, item[1]);
        } else if (typeof item[1] === 'object') {
          for (const key in item[1]) {
            if (item[1].hasOwnProperty(key) && Utils.isSet(item[1][key])) {
              if (key === 'ref') {
                item[1].ref(element);
              } else if (key === 'extend') {
                item[1].extend = item[1].extend.bind(null, element);
              } else if (key.match(/^on/)) {
                element.addEventListener(key.replace(/^on/, ''), item[1][key]);
              } else if (key === 'dataset') {
                for (const datasetKey in item[1][key]) {
                  element.dataset[datasetKey] = item[1][key][datasetKey];
                }
              } else if (key === 'style' && typeof item[1][key] === 'object') {
                for (const styleKey in item[1][key]) {
                  element.style[styleKey] = item[1][key][styleKey];
                }
              } else {
                element.setAttribute(key, item[1][key]);
              }
            }
          }
        } else {
          element.textContent = item[1];
        }
      }

      if (Utils.isSet(item[2])) {
        if (Array.isArray(item[2])) {
          this._build(element, item[2]);
        } else {
          element.textContent = item[2];
        }
      }

      context.appendChild(element);
    }
  }

  _appendChildren(fragments, children) {
    for (const child of children) {
      if (typeof child === 'string') {
        const node = document.createTextNode(child);
        fragments.appendChild(node);
      } else if (child instanceof HTMLElement || child instanceof DocumentFragment) {
        fragments.appendChild(child);
      } else if (Array.isArray(child)) {
        this._appendChildren(fragments, child);
      }
    }
  }

  element(tag, attrs, ...children) {
    if (typeof tag === 'function') {
      const fragments = tag();
      this._appendChildren(fragments, children);
      return fragments;
    }
    if (typeof tag === 'string') {
      const fragments = document.createDocumentFragment();
      this._appendChildren(fragments, children);
      const element = document.createElement(tag);
      for (const key in attrs) {
        if (attrs.hasOwnProperty(key) && Utils.isSet(attrs[key])) {
          if (key === 'ref') {
            attrs.ref(element);
          } else if (key === 'extend') {
            attrs.extend = attrs.extend.bind(null, element);
          } else if (key.match(/^on/)) {
            element.addEventListener(key.replace(/^on/, ''), attrs[key]);
          } else if (key === 'dataset') {
            for (const datasetKey in attrs[key]) {
              element.dataset[datasetKey] = attrs[key][datasetKey];
            }
          } else if (key === 'style' && typeof attrs[key] === 'object') {
            for (const styleKey in attrs[key]) {
              element.style[styleKey] = attrs[key][styleKey];
            }
          } else {
            element.setAttribute(key, attrs[key]);
          }
        }
      }
      element.appendChild(fragments);
      return element;
    }
  }

  fragment() {
    return document.createDocumentFragment();
  }

  /**
   * @param {HTMLElement} context
   * @param {string} position
   * @param {*[]} items
   */
  build(context, position, items) {
    try {
      if (Array.isArray(context)) {
        items = context;
        context = null;
      }

      if (position && position === 'inner') {
        context.innerHTML = '';
      }

      if (!items || !items.length) {
        return;
      }

      const fragment = document.createDocumentFragment();

      this._build(fragment, items);

      if (!context) {
        return fragment;
      }

      let element = null;

      switch (position) {
        case 'beforeBegin': {
          context.parentElement.insertBefore(fragment, context);
          element = context.previousElementSibling;

          break;
        }
        case 'afterBegin': {
          context.insertBefore(fragment, context.firstElementChild);
          element = context.firstElementChild;

          break;
        }
        case 'beforeEnd': {
          context.appendChild(fragment);
          element = context.lastElementChild;

          break;
        }
        case 'afterEnd': {
          context.parentElement.insertBefore(fragment, context.nextElementSibling);
          element = context.nextElementSibling;

          break;
        }
        case 'inner': {
          context.appendChild(fragment);
          element = context.firstElementChild;

          break;
        }
        case 'outer': {
          context.parentElement.insertBefore(fragment, context);
          element = context.previousElementSibling;
          context.remove();

          break;
        }
      }

      return element;
    } catch (error) {
      window.console.log(error.message);
    }
  }

  insert(context, position, fragment) {
    try {
      if (position && position === 'inner') {
        context.innerHTML = '';
      }

      if (!context || !fragment) {
        return;
      }

      let element = null;

      switch (position) {
        case 'beforeBegin': {
          context.parentElement.insertBefore(fragment, context);
          element = context.previousElementSibling;

          break;
        }
        case 'afterBegin': {
          context.insertBefore(fragment, context.firstElementChild);
          element = context.firstElementChild;

          break;
        }
        case 'beforeEnd': {
          context.appendChild(fragment);
          element = context.lastElementChild;

          break;
        }
        case 'afterEnd': {
          context.parentElement.insertBefore(fragment, context.nextElementSibling);
          element = context.nextElementSibling;

          break;
        }
        case 'inner': {
          context.appendChild(fragment);
          element = context.firstElementChild;

          break;
        }
        case 'outer': {
          context.parentElement.insertBefore(fragment, context);
          element = context.previousElementSibling;
          context.remove();

          break;
        }
      }

      return element;
    } catch (error) {
      window.console.log(error.message);
    }
  }

  /**
   * @param {string} text
   * @returns Document
   */
  parse(text) {
    return this._parser.parseFromString(text, 'text/html');
  }
}

const DOM = new _DOM();

export { DOM };