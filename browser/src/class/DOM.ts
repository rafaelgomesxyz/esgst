import { Utils } from '../lib/jsUtils';

type IDOMBuildPosition =
  'beforeBegin' |
  'afterBegin' |
  'beforeEnd' |
  'afterEnd' |
  'inner' |
  'outer';

type IDOMBuildItem =
  [string, IDOMBuildItemProperties, string | IDOMBuildItems] |
  [string, string | IDOMBuildItems] |
  [string, IDOMBuildItemProperties] |
  [string];

interface IDOMBuildItemProperties extends HTMLElement {
  [key: string]: any;

  href: string;

  ref(element: HTMLElement): void;
}

interface IDOMBuildItems extends Array<IDOMBuildItem> {}

class _DOM {
  private parser: DOMParser;

  constructor() {
    this.parser = new DOMParser();
  }

  private _build(context: HTMLElement, items: IDOMBuildItems) {
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
            if (item[1].hasOwnProperty(key)) {
              if (key === 'ref') {
                if (Utils.isSet(item[1].ref)) {
                  item[1].ref(element);
                }
              } else if (key === 'extend') {
                item[1].extend = item[1].extend.bind(null, element);
              } else if (key.match(/^on/)) {
                if (Utils.isSet(item[1][key])) {
                  element.addEventListener(key.replace(/^on/, ''), item[1][key]);
                }
              } else if (key === 'dataset') {
                for (const datasetKey in item[1][key]) {
                  element.dataset[datasetKey] = item[1][key][datasetKey];
                }
              } else if (key === 'style' && typeof item[1][key] === 'object') {
                for (const styleKey in item[1][key]) {
                  element.dataset[styleKey] = item[1][key][styleKey];
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

  build(context: HTMLElement, position: IDOMBuildPosition, items: IDOMBuildItems) {
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

      this._build(fragment as any as HTMLElement, items);

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
      window.console.log(error.stack);
    }
  }

  parse(text: string): Document {
    return this.parser.parseFromString(text, 'text/html');
  }
};

const DOM = new _DOM();

export { DOM, IDOMBuildItem, IDOMBuildItems };