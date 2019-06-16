import { utils } from '../jsUtils';
import { logger } from '../../class/Logger';

const CLASS_NAMES = {
  sg: {
    pageHeading: `page__heading`,
    pageHeadingBreadcrumbs: `page__heading__breadcrumbs`,
    pageHeadingButton: `page__heading__button`
  },
  st: {
    pageHeading: `page_heading`,
    pageHeadingBreadcrumbs: `page_heading_breadcrumbs`,
    pageHeadingButton: `page_heading_btn`
  }
};

class ElementBuilder {
  constructor() {}
  
  createElements(context, position, items) {
    try {
      if (Array.isArray(context)) {
        items = context;
        context = null;
      }
      if (position && position === `inner`) {
        context.innerHTML = ``;
      }
      if (!items || !items.length) {
        return;
      }
      const fragment = document.createDocumentFragment();
      let element = null;
      this.buildElements(fragment, items);
      if (!context) {
        return fragment;
      }
      switch (position) {
        case `beforeBegin`:
          context.parentElement.insertBefore(fragment, context);
          element = context.previousElementSibling;
          break;
        case `afterBegin`:
          context.insertBefore(fragment, context.firstElementChild);
          element = context.firstElementChild;
          break;
        case `beforeEnd`:
          context.appendChild(fragment);
          element = context.lastElementChild;
          break;
        case `afterEnd`:
          context.parentElement.insertBefore(fragment, context.nextElementSibling);
          element = context.nextElementSibling;
          break;
        case `inner`:
          context.appendChild(fragment);
          element = context.firstElementChild;
          break;
        case `outer`:
          context.parentElement.insertBefore(fragment, context);
          element = context.previousElementSibling;
          context.remove();
          break;
      }
      return element;
    } catch (error) {
      logger.error(error.stack);
    }
  }

  buildElements(context, items) {
    for (const item of items) {
      if (!item) {
        continue;
      }
      if (typeof item === `string`) {
        const node = document.createTextNode(item);
        context.appendChild(node);
        continue;
      } else if (!Array.isArray(item)) {
        context.appendChild(item);
        continue;
      }
      const element = document.createElement(item[0]);
      if (utils.isSet(item[1])) {
        if (Array.isArray(item[1])) {
          this.buildElements(element, item[1]);
        } else if (typeof item[1] === `object`) {
          for (const key in item[1]) {
            if (item[1].hasOwnProperty(key)) {
              if (key === `ref`) {
                if (utils.isSet(item[1].ref)) {
                  item[1].ref(element);
                }
              } else if (key === `extend`) {
                item[1].extend = item[1].extend.bind(null, element);
              } else if (key.match(/^on/)) {
                if (utils.isSet(item[1][key])) {
                  element.addEventListener(key.replace(/^on/, ``), item[1][key]);
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
      if (utils.isSet(item[2])) {
        if (Array.isArray(item[2])) {
          this.buildElements(element, item[2]);
        } else {
          element.textContent = item[2];
        }
      }
      context.appendChild(element);
    }
  }
}

class SgNotification extends ElementBuilder {
  /**
   * @param {Object} [options]
   * @param {HTMLElement} [options.context]
   * @param {String} [options.position]
   * @param {"success"|"warning"} options.type
   * @param {String[]} options.icons
   * @param {String} options.message
   */
  constructor(options) {
    super();
    options = Object.assign({
      context: null,
      position: null,
      type: `warning`,
      icons: [],
      message: ``
    }, options);
    this.createElements(options.context, options.position, [
      [`div`, { ref: ref => this.notification = ref }, [
        [`i`, { ref: ref => this.icon = ref }],
        ` `,
        [`span`, { ref: ref => this.message = ref }]
      ]]
    ]);
    this.setType(options.type);
    this.setIcons(options.icons);
    this.setMessage(options.message);
  }

  setType(type) {
    this.notification.className = `notification notification--${type} notification--margin-top-small`;
  }

  setIcons(icons) {
    this.icon.className = `fa fa-fw ${icons.join(` `)}`;
  }

  setMessage(text) {
    this.message.textContent = text;
  }
}

class PageHeading extends ElementBuilder {
  /**
   * @param {Object} options 
   * @param {"sg"|"st"} namespace 
   */
  constructor(options, namespace) {
    super();
    this.namespace = namespace;
    options = Object.assign({
      context: null,
      position: null
    }, options);
    this.createElements(options.context, options.position, [
      [`div`, { class: CLASS_NAMES[this.namespace].pageHeading, ref: ref => this.pageHeading = ref }, [
        [`div`, { class: CLASS_NAMES[this.namespace].pageHeadingBreadcrumbs, ref: ref => this.breadcrumbs = ref }]
      ]]
    ]);
    if (options.breadcrumbs) {
      this.setBreadcrumbs(options.breadcrumbs);
    }
    if (options.buttons) {
      this.addButtons(options.buttons);
    }
  }

  setBreadcrumbs(breadcrumbs) {
    const items = [];
    for (const breadcrumb of breadcrumbs) {      
      items.push(
        [`a`, { href: breadcrumb.url }, breadcrumb.name],
        [`i`, { class: `fa fa-angle-right` }]
      );
    }
    this.createElements(this.breadcrumbs, `inner`, items.slice(0, -1));
  }

  addButtons(buttons) {
    for (const button of buttons) {
      this.addButton(button);
    }
  }

  addButton(options) {
    let icons = [];
    for (const icon of options.icons) {
      icons.push(
        [`i`, { class: `fa ${icon}`, style: `margin: 0` }],
        ` `
      );
    }
    return this.createElements(this.pageHeading, options.position, [
      [`a`, { class: `${CLASS_NAMES[this.namespace].pageHeadingButton} is-clickable`, title: options.title, onclick: options.onclick, ref: options.ref, style: `display: inline-block;` }, icons.slice(0, -1)]
    ]);
  }
}

class SgPageHeading extends PageHeading {
  constructor(options) {
    super(options, `sg`);
  }
};

class StPageHeading extends PageHeading {
  constructor(options) {
    super(options, `st`);
  }
};

const elementBuilder = {
  sg: {
    notification: SgNotification,
    pageHeading: SgPageHeading
  },
  st: {
    pageHeading: StPageHeading
  }
};

export { elementBuilder };