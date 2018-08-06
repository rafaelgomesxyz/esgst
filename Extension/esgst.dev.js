// ==UserScript==
// @name ESGST
// @namespace ESGST
// @description Enhances SteamGifts and SteamTrades by adding some cool features to them.
// @icon https://dl.dropboxusercontent.com/s/lr3t3bxrxfxylqe/esgstIcon.ico?raw=1
// @version 7.26.0
// @author revilheart
// @contributor Royalgamer06
// @downloadURL https://github.com/revilheart/ESGST/raw/master/ESGST.user.js
// @updateURL https://github.com/revilheart/ESGST/raw/master/ESGST.meta.js
// @match https://www.steamgifts.com/*
// @match https://www.steamtrades.com/*
// @connect raw.githubusercontent.com
// @connect api.steampowered.com
// @connect store.steampowered.com
// @connect script.google.com
// @connect script.googleusercontent.com
// @connect sgtools.info
// @connect steamcommunity.com
// @connect steamgifts.com
// @connect steamtrades.com
// @connect isthereanydeal.com
// @connect api.dropboxapi.com
// @connect content.dropboxapi.com
// @connect api.imgur.com
// @connect googleapis.com
// @connect graph.microsoft.com
// @connect userstyles.org
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_xmlhttpRequest
// @grant GM_getResourceURL
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.deleteValue
// @grant GM.listValues
// @grant GM.xmlHttpRequest
// @grant GM.getResourceUrl
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/js/jquery-3.3.1.min.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/js/jquery-ui-1.12.1.min.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/js/bootstrap-3.3.7.min.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/js/interact-1.3.4.min.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/js/jszip-3.1.5.min.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/js/parsedown-0.0.1.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/js/query-builder-2.5.2.min.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/js/intersection-observer.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/js/encoding.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/js/jsUtils-0.0.1.js
// @resource bs https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/css/bootstrap-3.3.7.min.css
// @resource abc https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/css/awesome-bootstrap-checkbox-0.3.7.min.css
// @resource qb https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/css/query-builder-2.5.2.min.css
// @resource sg https://raw.githubusercontent.com/revilheart/ESGST/7.26.0/Extension/css/steamgifts-v34.min.css
// @run-at document-start
// @noframes
// ==/UserScript==

(function () {
  `use strict`;
  
  const _MODULES = [];
  let esgst;

  if (!NodeList.prototype[Symbol.iterator]) {
    NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
  }
  if (!HTMLCollection.prototype[Symbol.iterator]) {
    HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
  }

  const theme = getLocalValue(`theme`);
  if (theme) {
    const style = document.createElement(`style`);
    style.id = `esgst-theme`;
    style.textContent = theme;
    document.documentElement.appendChild(style);
  }
  const customTheme = getLocalValue(`customTheme`);
  if (customTheme) {
    const style = document.createElement(`style`);
    style.id = `esgst-custom-theme`;
    style.textContent = customTheme;
    document.documentElement.appendChild(style);
  }

  let _USER_INFO = {},
    browser = null,
    gm = null;
  if (typeof GM === `undefined` && typeof GM_setValue === `undefined`) {
    [_USER_INFO.extension, browser] = this.chrome && this.chrome.runtime ?
      [this.browser ? `firefox` : `chrome`, this.chrome] : [`edge`, this.browser];
  } else if (typeof GM === `undefined`) {
    // polyfill for userscript managers that do not support the gm-dot api
    gm = {
      deleteValue: GM_deleteValue,
      getValue: GM_getValue,
      listValues: GM_listValues,
      getResourceUrl: GM_getResourceURL,
      setValue: GM_setValue,
      xmlHttpRequest: GM_xmlhttpRequest
    };
    for (const key in gm) {
      const old = gm[key];
      gm[key] = (...args) => {
        return new Promise((resolve, reject) => {
          try {
            resolve(old.apply(this, args));
          } catch (e) {
            reject(e);
          }
        });
      };
    }
  } else {
    gm = GM;
  }
  if (gm) {
    (async () => {
      createElements(document.head, `beforeEnd`, [{
        attributes: {
          href: await gm.getResourceUrl(`bs`),
          rel: `stylesheet`
        },
        type: `link`
      }, {
        attributes: {
          href: await gm.getResourceUrl(`bss`),
          rel: `stylesheet`
        },
        type: `link`
      }, {
        attributes: {
          href: await gm.getResourceUrl(`abc`),
          rel: `stylesheet`
        },
        type: `link`
      }, {
        attributes: {
          href: await gm.getResourceUrl(`qb`),
          rel: `stylesheet`
        },
        type: `link`
      }]);
    })();
  }

  class Button {
    constructor(context, position, details) {
      this.callbacks = details.callbacks;
      this.states = this.callbacks.length;
      this.icons = details.icons;
      this.id = details.id;
      this.index = details.index;
      this.titles = details.titles;
      this.button = createElements(context, position, [{
        attributes: {
          class: details.className
        },
        type: `div`
      }]);
      this.change();
      return this;
    }
    async change(mainCallback, index = this.index, event) {
      if (index >= this.states) {
        index = 0;
      }
      this.index = index + 1;
      this.button.title = getFeatureTooltip(this.id, this.titles[index]);
      createElements(this.button, `inner`, [{
        attributes: {
          class: `fa ${this.icons[index]}`
        },
        type: `i`
      }]);
      if (mainCallback) {
        if (await mainCallback(event)) {
          this.change();
        } else {
          createElements(this.button, `inner`, [{
            attributes: {
              class: `fa fa-times esgst-red`,
              title: `Unable to perform action`
            },
            type: `i`
          }]);
        }
      } else if (this.callbacks[index]) {
        this.button.firstElementChild.addEventListener(`click`, this.change.bind(this, this.callbacks[index], undefined));
      }
    }
  }

  class ButtonSet {
    constructor(color1, color2, icon1, icon2, title1, title2, callback1, callback2) {
      this.busy = false;
      this.dependencies = [];
      const classes = {
        green: `form__submit-button`,
        grey: `form__saving-button`,
        red: `sidebar__error`,
        yellow: `sidebar__entry-delete`
      };
      this.set = document.createElement(`div`);
      this.set.className = `esgst-button-set`;
      createElements(this.set, `inner`, [{
        attributes: {
          class: `${classes[color1]} btn_action ${color1}`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa ${icon1}`
          },
          type: `i`
        }, {
          text: title1,
          type: `span`
        }]
      },{
        attributes: {
          class: `${classes[color2]} btn_action ${color2} is-disabled is_disabled esgst-hidden`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa ${icon2}`
          },
          type: `i`
        }, {
          text: title2,
          type: `span`
        }]
      }]);
      this.button1 = this.set.firstElementChild;
      this.button2 = this.set.lastElementChild;
      this.callback1 = callback1;
      this.callback2 = callback2;
      this.button1.addEventListener(`click`, () => this.toggle(this.callback1));
      if (this.callback2) {
        this.button2.classList.remove(`is-disabled`, `is_disabled`);
        this.button2.addEventListener(`click`, () => this.toggle(this.callback2));
      }
    }
    toggle(callback) {
      this.dependencies.forEach(dependency => dependency.classList.toggle(`esgst-hidden`));
      this.busy = !this.busy;
      this.button1.classList.toggle(`esgst-hidden`);
      this.button2.classList.toggle(`esgst-hidden`);
      if (callback) {
        callback(this.toggle.bind(this));
      }
    }
    trigger() {
      this.toggle(this.callback1);
    }
  }

  class ButtonSet_v2 {
    constructor(details) {
      this.busy = false;
      this.dependencies = [];
      let classes = {
        green: `form__submit-button`,
        grey: `form__saving-button`,
        red: `sidebar__error`,
        yellow: `sidebar__entry-delete`
      };
      if (details.set) {
        this.set = details.set;
      } else {
        this.set = document.createElement(`div`);
        this.set.className = `esgst-button-set`;
      }
      createElements(this.set, `inner`, [{
        attributes: {
          class: `${classes[details.color1]} btn_action ${details.color1}`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa ${details.icon1}`
          },
          type: `i`
        }, {
          text: details.title1,
          type: `span`
        }]
      },{
        attributes: {
          class: `${classes[details.color2]} btn_action ${details.color2} is-disabled is_disabled esgst-hidden`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa ${details.icon2}`
          },
          type: `i`
        }, {
          text: details.title2,
          type: `span`
        }]
      }]);
      this.button1 = this.set.firstElementChild;
      this.button2 = this.set.lastElementChild;
      this.callback1 = details.callback1;
      this.callback2 = details.callback2;
      if (this.callback1) {
        this.button1.addEventListener(`click`, async () => {
          this.isCanceled = false;
          this.toggle();
          await this.callback1();
          if (!this.isCanceled) {
            this.toggle();
          }
        });
      }
      if (this.callback2) {
        this.button2.classList.remove(`is-disabled`, `is_disabled`);
        this.button2.addEventListener(`click`, async () => {
          this.isCanceled = true;
          this.toggle();
          await this.callback2();
        });
      }
      if (details.input) {
        details.input.addEventListener(`keydown`, event => {
          if (event.key === `Enter`) {
            this.trigger();
          }
        });
      }
    }
    toggle() {
      this.dependencies.forEach(dependency => dependency.classList.toggle(`esgst-hidden`));
      this.busy = !this.busy;
      this.button1.classList.toggle(`esgst-hidden`);
      this.button2.classList.toggle(`esgst-hidden`);
    }
    trigger() {
      this.button1.dispatchEvent(new Event(`click`));
    }
    changeButton(i) {
      return {
        setIcon: this.setIcon.bind(this, this[`button${i}`]),
        setTitle: this.setTitle.bind(this, this[`button${i}`])
      };
    }
    setIcon(button, icon) {
      button.firstElementChild.className = `fa ${icon}`;
    }
    setTitle(button, title) {
      button.lastElementChild.textContent = title;
    }
  }

  class Checkbox {
    constructor (context, defaultValue, threeState, messages = {}) {
      this.value = defaultValue;
      this.isThreeState = threeState;
      this.checkbox = createElements(context, `afterBegin`, [{
        attributes: {
          class: `esgst-checkbox`
        },
        type: `span`,
        children: [{
          attributes: {
            class: `esgst-hidden`,
            type: `checkbox`
          },
          type: `input`
        }, {
          attributes: {
            class: `fa fa-square-o`
          },
          type: `i`
        }, {
          attributes: {
            class: `fa fa-square`,
            title: messages.select || ``
          },
          type: `i`
        }, {
          attributes: {
            class: `fa fa-check-square`,
            title: messages.unselect || ``
          },
          type: `i`
        }]
      }]);
      this.input = this.checkbox.firstElementChild;
      this.disabled = this.input.nextElementSibling;
      this.none = this.disabled.nextElementSibling;
      this.enabled = this.none.nextElementSibling;
      if (this.isThreeState) {
        if (this.value === `disabled`) {
          this.none.classList.add(`esgst-hidden`);
          this.enabled.classList.add(`esgst-hidden`);
        } else if (this.value === `none`) {
          this.disabled.classList.add(`esgst-hidden`);
          this.enabled.classList.add(`esgst-hidden`);
        } else {
          this.disabled.classList.add(`esgst-hidden`);
          this.none.classList.add(`esgst-hidden`);
        }
        this.checkbox.addEventListener(`click`, event => this.change(false, null, null, event));
      } else {
        this.input.checked = this.value;
        if (this.value) {
          this.disabled.classList.add(`esgst-hidden`);
          this.none.classList.add(`esgst-hidden`);
        } else {
          this.none.classList.add(`esgst-hidden`);
          this.disabled.classList.add(`esgst-hidden`);
        }
        this.checkbox.addEventListener(`click`, event => this.change(true, null, null, event));
        this.checkbox.addEventListener(`mouseenter`, () => this.showNone());
        this.checkbox.addEventListener(`mouseleave`, () => this.hideNone());
        this.change();
      }
    }
    change(toggle, value, callback, event) {
      if (event) {
        event.stopPropagation();
      }
      if (this.isThreeState) {
        if ((this.value === `disabled` && !value) || (value === `none`)) {
          this.enabled.classList.add(`esgst-hidden`);
          this.disabled.classList.add(`esgst-hidden`);
          this.none.classList.remove(`esgst-hidden`);
          this.value = `none`;
        } else if ((this.value === `none` && !value) || (value === `enabled`)) {
          this.none.classList.add(`esgst-hidden`);
          this.disabled.classList.add(`esgst-hidden`);
          this.enabled.classList.remove(`esgst-hidden`);
          this.value = `enabled`;
        } else if (!value || value === `disabled`) {
          this.enabled.classList.add(`esgst-hidden`);
          this.none.classList.add(`esgst-hidden`);
          this.disabled.classList.remove(`esgst-hidden`);
          this.value = `disabled`;
        }
      } else {
        if (toggle) {
          this.preValue = this.input.checked = !this.input.checked;
        } else {
          this.preValue = this.input.checked;
        }
        if (this.preValue) {
          if (this.onPreEnabled && !this.isBlocked) {
            this.onPreEnabled(event);
          }
          this.value = this.preValue;
          this.disabled.classList.add(`esgst-hidden`);
          this.none.classList.add(`esgst-hidden`);
          this.enabled.classList.remove(`esgst-hidden`);
          if (this.onEnabled && !this.isBlocked) {
            this.onEnabled(event);
          }
        } else {
          if (this.onPreDisabled && !this.isBlocked) {
            this.onPreDisabled(event);
          }
          this.value = this.preValue;
          this.enabled.classList.add(`esgst-hidden`);
          this.none.classList.add(`esgst-hidden`);
          this.disabled.classList.remove(`esgst-hidden`);
          if (this.onDisabled && !this.isBlocked) {
            this.onDisabled(event);
          }
        }
      }
      if (event && this.onChange) {
        this.onChange();
      }
    }
    showNone() {
      if (!this.value) {
        this.disabled.classList.add(`esgst-hidden`);
        this.none.classList.remove(`esgst-hidden`);
      }
    }
    hideNone() {
      if (!this.value) {
        this.disabled.classList.remove(`esgst-hidden`);
        this.none.classList.add(`esgst-hidden`);
      }
    }
    check(callback) {
      this.preValue = this.input.checked = true;
      this.change(false, null, callback);
    }
    uncheck(callback) {
      this.preValue = this.input.checked = false;
      this.change(false, null, callback);
    }
    toggle(callback) {
      this.change(true, null, callback);
    }
  }

  class CompletionCheck {
    constructor(total, callback, onCheck) {
      this.callback = callback;
      this.onCheck = onCheck;
      this.counter = {
        count: 0,
        total: total
      };
      setTimeout(() => this.check(), 500);
      return this.counter;
    }
    check() {
      if (this.onCheck) {
        this.onCheck();
      }
      if (this.counter.count < this.counter.total) {
        setTimeout(() => this.check(), 500);
      } else {
        this.callback();
      }
    }
  }

  class Popout {
    constructor(className = ``, context = null, hoverSpeed = 1000, onClick = false, popout = null, onOpen = null) {
      this.onOpen = onOpen;
      this.context = context;
      this.popout = popout || createElements(document.body, `beforeEnd`, [{
        attributes: {
          class: className
        },
        type: `div`
      }]);
      this.popout.classList.add(`esgst-popout`, `esgst-hidden`);
      this.popup = this.popout.closest(`.esgst-popup`);
      this.hoverSpeed = hoverSpeed;
      if (!onClick) {
        if (this.context) {
          let timeout = null;
          this.context.addEventListener(`mouseenter`, () => {
            timeout = setTimeout(() => {
              this.open();
            }, this.hoverSpeed);
          });
          this.context.addEventListener(`mouseleave`, event => {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }
            if (!this.popout.contains(event.relatedTarget)) {
              this.close();
            }
          });
        }
        let timeout = null;
        this.popout.addEventListener(`mouseenter`, () => {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
        });
        this.popout.addEventListener(`mouseleave`, event => {
          timeout = setTimeout(() => {
            if (event.relatedTarget && !this.context.contains(event.relatedTarget) && (className !== `esgst-qiv-popout` || !event.relatedTarget.closest(`.esgst-popout`))) {
              this.context.classList.remove(`esgst-qgs-container-expanded`);
              this.close();
            }
          }, this.hoverSpeed);
        });
        document.addEventListener(`click`, event => {
          if (this.context && !this.context.contains(event.target) && !this.popout.contains(event.target) && (className !== `esgst-qiv-popout` || !event.target.closest(`.esgst-popout`))) {
            this.close();
          }
        }, true);
      } else {
        if (this.context) {
          this.context.addEventListener(`click`, () => {
            if (this.isOpen) {
              this.close();
            } else {
              this.open();
            }
          });
        }
        document.addEventListener(`click`, event => {
          if (this.context && !this.context.contains(event.target) && !this.popout.contains(event.target)) {
            this.close();
          }
        });
      }
      this.isOpen = false;
    }
    open(context = null, isFixed = false) {
      this.context = context || this.context;
      this.isFixed = isFixed;
      this.popout.classList.remove(`esgst-hidden`);
      let n = 9999 + document.querySelectorAll(`.esgst-popup:not(.esgst-hidden), .esgst-popout:not(.esgst-hidden)`).length;
      if (esgst.openPopups > 0) {
        const highestN = parseInt(esgst.popups[esgst.openPopups - 1].popup.style.zIndex || 0);
        if (n <= highestN) {
          n = highestN + 1;
        }
      }
      this.popout.style.zIndex = n;
      if (this.isFixed) {
        this.popout.classList.add(`esgst-fixed`);
      }
      this.reposition();
      this.isOpen = true;
      if (this.onOpen) {
        this.onOpen(this.popout);
      }
    }
    close() {
      this.popout.classList.add(`esgst-hidden`);
      if (this.isOpen && this.onClose) {
        this.onClose();
      }
      this.isOpen = false;
    }
    reposition(context = null) {
      let contextLeft, contextRect, contextTop, popoutHeight, popoutWidth, popupRect;
      this.popout.style.height = ``;
      this.popout.style.left = `0`;
      this.popout.style.top = `0`;
      this.context = context || this.context;
      contextRect = this.context.getBoundingClientRect();
      contextLeft = contextRect.left;
      contextTop = contextRect.top;
      if (contextTop > (innerHeight - (contextTop + contextRect.height))) {
        this.popout.style.maxHeight = `${contextTop}px`;
      } else {
        this.popout.style.maxHeight = `${innerHeight - (contextTop + contextRect.height)}px`;
      }
      const oldHeight = parseFloat(getComputedStyle(this.popout).getPropertyValue(`height`));
      const oldRealHeight = this.popout.offsetHeight;
      const difference = (oldRealHeight - oldHeight) + 10;
      const newHeight = Math.max(
        Math.min(oldHeight, document.documentElement.clientHeight - (contextTop + contextRect.height + difference)),
        Math.min(oldHeight, contextTop - difference)
      );
      this.popout.style.height = `${newHeight}px`;
      if (esgst.qiv && esgst.qiv.popout === this && esgst.qiv.comments) {
        esgst.qiv.comments.style.maxHeight = `${newHeight - esgst.qiv.comments.offsetTop}px`;
      }
      popoutHeight = this.popout.offsetHeight;
      popoutWidth = this.popout.offsetWidth;
      popupRect = this.popup && this.popup.getBoundingClientRect();
      if (contextLeft + popoutWidth > document.documentElement.clientWidth) {
        this.popout.style.left = `${(contextLeft - popoutWidth + contextRect.width) - (this.popup ? popupRect.left : 0) + scrollX}px`;
      } else {
        this.popout.style.left = `${contextLeft - (this.popup ? popupRect.left : 0) + scrollX}px`;
      }
      if (contextTop + contextRect.height + popoutHeight > document.documentElement.clientHeight) {
        this.popout.style.top = `${(contextTop - popoutHeight + (this.isFixed || this.popup ? 0 :  scrollY)) - (this.popup ? popupRect.top : 0)}px`;
      } else {
        this.popout.style.top = `${(contextTop + contextRect.height + (this.isFixed || this.popup ? 0 :  scrollY)) - (this.popup ? popupRect.top : 0)}px`;
      }
    }
  }

  class Popup {
    constructor(icon, title, temp, settings, popup = null) {
      this.isCreated = popup ? false : true;
      this.temp = temp;
      this.popup = popup || createElements(document.body, `beforeEnd`, [{
        attributes: {
          class: `esgst-hidden esgst-popup`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-popup-heading`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa ${icon} esgst-popup-icon${icon ? `` : ` esgst-hidden`}`
            },
            type: `i`
          }, {
            attributes: {
              class: `esgst-popup-title${title ? `` : ` esgst-hidden`}`
            },
            text: typeof title === `string` ? title : ``,
            type: `div`,
            children: typeof title === `string` ? null : title
          }]
        }, {
          attributes: {
            class: `esgst-popup-description`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-popup-scrollable`
            },
            type: `div`
          }]
        }, {
          attributes: {
            class: `esgst-popup-actions`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-hidden`
            },
            text: `Settings`,
            type: `span`
          }, {
            attributes: {
              class: `esgst-popup-close`
            },
            text: `Close`,
            type: `span`
          }]
        }]
      }]);
      if (this.isCreated) {
        this.icon = this.popup.firstElementChild.firstElementChild;
        this.title = this.icon.nextElementSibling;
        this.description = this.popup.firstElementChild.nextElementSibling;
        this.scrollable = this.description.firstElementChild;
        this.actions = this.description.nextElementSibling;
        if (!settings) {
          settings = this.actions.firstElementChild;
          settings.classList.remove(`esgst-hidden`);
          settings.addEventListener(`mousedown`, event => {
            if (event.button === 2) return;
            event.preventDefault();
            if (esgst.openSettingsInTab || event.button === 1) {
              open(`/esgst/settings`);
            } else {
              loadMenu();
            }
          });
        }
        this.description.nextElementSibling.lastElementChild.addEventListener(`click`, () => this.close());
      } else {
        this.popup.classList.add(`esgst-popup`);
        let closeButton = this.popup.getElementsByClassName(`b-close`)[0];
        if (closeButton) {
          closeButton.addEventListener(`click`, () => this.close());
        }
      }
    }
    open(callback) {
      this.isOpen = true;
      let n = 9999 + document.querySelectorAll(`.esgst-popup:not(.esgst-hidden), .esgst-popout:not(.esgst-hidden)`).length;
      if (esgst.openPopups > 0) {
        const highestN = parseInt(esgst.popups[esgst.openPopups - 1].popup.style.zIndex || 0);
        if (n <= highestN) {
          n = highestN + 1;
        }
      }
      esgst.openPopups += 1;
      esgst.popups.push(this);
      this.modal = createElements(document.body, `beforeEnd`, [{
        attributes: {
          class: `esgst-popup-modal`
        },
        type: `div`
      }]);
      if (this.isCreated) {
        this.popup.classList.remove(`esgst-hidden`);
      } else {
        this.popup.style.display = `block`;
      }
      this.modal.style.zIndex = n;
      this.popup.style.zIndex = n + 1;
      this.modal.addEventListener(`click`, () => this.close());
      this.reposition();
      if (!esgst.isRepositioning && !esgst.staticPopups) {
        setTimeout(() => repositionPopups(), 2000);
      }
      if (callback) {
        callback();
      }
    }
    close() {
      this.modal.remove();
      if (this.isCreated) {
        if (this.temp) {
          this.popup.remove();
        } else {
          this.popup.classList.add(`esgst-hidden`);
          if (esgst.minimizePanel) {
            minimizePanel_addItem(this);
          }
        }
      } else {
        this.popup.style = ``;
      }
      if (this.onClose) {
        this.onClose();
      }
      esgst.openPopups -= 1;
      esgst.popups.pop();
      this.isOpen = false;
    }
    reposition() {
      if (this.isCreated) {
        if (esgst.staticPopups) {
          this.scrollable.style.maxHeight = `${ innerHeight - (this.popup.offsetHeight - this.scrollable.offsetHeight) - 100}px`;
        } else {
          this.scrollable.style.maxHeight = `${ innerHeight * 0.9 - (this.popup.offsetHeight - this.scrollable.offsetHeight)}px`;
        }
      }
      if (!esgst.staticPopups) {
        let newLeft, newTop;
        newLeft = (innerWidth - this.popup.offsetWidth) / 2;
        newTop = (innerHeight - this.popup.offsetHeight) / 2;
        if (Math.abs(newLeft - this.popup.offsetLeft) > 5 || Math.abs(newTop - this.popup.offsetTop) > 5) {
          this.popup.style.left = `${newLeft}px`;
          this.popup.style.top = `${newTop}px`;
        }
      }
    }
    setTitle(title) {
      this.title.textContent = title;
      if (this.minimizeLink) {
        this.minimizeLink.textContent = title;
      }
    }
    setDone(temp) {
      this.temp = temp;
      if (esgst.minimizePanel && !this.isOpen) {
        minimizePanel_alert(this);
      }
    }
  }

  class Popup_v2 {
    constructor(details) {
      this.isCreated = details.popup ? false : true;
      this.temp = details.isTemp;
      this.popup = details.popup || createElements(document.body, `beforeEnd`, [{
        attributes: {
          class: `esgst-hidden esgst-popup`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-popup-heading`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa ${details.icon} esgst-popup-icon${details.icon ? `` : ` esgst-hidden`}`
            },
            type: `i`
          }, {
            attributes: {
              class: `esgst-popup-title${details.title ? `` : ` esgst-hidden`}`
            },
            text: typeof details.title === `string` ? details.title : ``,
            type: `div`,
            children: typeof details.title === `string` ? null : details.title
          }]
        }, {
          attributes: {
            class: `esgst-popup-description`
          },
          type: `div`
        }, {
          attributes: {
            class: `esgst-popup-actions`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-hidden`
            },
            text: `Settings`,
            type: `span`
          }, {
            attributes: {
              class: `esgst-popup-close`
            },
            text: `Close`,
            type: `span`
          }]
        }]
      }]);
      this.onClose = details.onClose;
      if (this.isCreated) {
        this.icon = this.popup.firstElementChild.firstElementChild;
        this.title = this.icon.nextElementSibling;
        this.description = this.popup.firstElementChild.nextElementSibling;
        this.actions = this.description.nextElementSibling;
        if (!details.settings) {
          let settings = this.actions.firstElementChild;
          settings.classList.remove(`esgst-hidden`);
          settings.addEventListener(`mousedown`, event => {
            if (event.button === 2) return;
            event.preventDefault();
            if (esgst.openSettingsInTab || event.button === 1) {
              open(`/esgst/settings`);
            } else {
              loadMenu();
            }
          });
        }
        this.description.nextElementSibling.lastElementChild.addEventListener(`click`, () => this.close());
      } else {
        this.popup.classList.add(`esgst-popup`);
        let closeButton = this.popup.getElementsByClassName(`b-close`)[0];
        if (closeButton) {
          closeButton.addEventListener(`click`, () => this.close());
        }
      }
      if (details.textInputs) {
        this.textInputs = [];
        details.textInputs.forEach(textInput => {
          const items = [];
          if (textInput.title) {
            items.push({
              text: textInput.title,
              type: `node`
            });
          }
          items.push({
            attributes: {
              placeholder: textInput.placeholder || ``,
              type: `text`
            },
            type: `input`
          });
          let input = createElements(this.description, `beforeEnd`, items);
          input.addEventListener(`keydown`, this.triggerButton.bind(this, 0));
          this.textInputs.push(input);
        });
      }
      if (details.options) {
        this.description.appendChild(createOptions(details.options));
        let inputs = this.description.lastElementChild.getElementsByTagName(`input`);
        for (let input of inputs) {
          switch (input.getAttribute(`type`)) {
            case `number`:
              observeNumChange(input, input.getAttribute(`name`));
              break;
            case `text`:
              observeChange(input, input.getAttribute(`name`));
              break;
            default:
              break;
          }
        }
      }
      if (details.buttons) {
        this.buttons = [];
        details.buttons.forEach(button => {
          let set = new ButtonSet_v2(button);
          this.buttons.push(set);
          this.description.appendChild(set.set);
        });
      }
      if (details.addProgress) {
        this.progress = createElements(this.description, `beforeEnd`, [{
          type: `div`
        }]);
        this.overallProgress = createElements(this.description, `beforeEnd`, [{
          type: `div`
        }]);
      }
      if (details.addScrollable) {
        this.scrollable = createElements(this.description, `beforeEnd`, [{
          attributes: {
            class: `esgst-popup-scrollable`
          },
          type: `div`,
          children: details.scrollableContent || null
        }]);
        if (details.addScrollable === `left`) {
          this.scrollable.classList.add(`esgst-text-left`);
        }
      }
    }
    open(callback) {
      this.isOpen = true;
      let n = 9999 + document.querySelectorAll(`.esgst-popup:not(.esgst-hidden), .esgst-popout:not(.esgst-hidden)`).length;
      if (esgst.openPopups > 0) {
        const highestN = parseInt(esgst.popups[esgst.openPopups - 1].popup.style.zIndex || 0);
        if (n <= highestN) {
          n = highestN + 1;
        }
      }
      esgst.openPopups += 1;
      esgst.popups.push(this);
      this.modal = createElements(document.body, `beforeEnd`, [{
        attributes: {
          class: `esgst-popup-modal`
        },
        type: `div`
      }]);
      if (this.isCreated) {
        this.popup.classList.remove(`esgst-hidden`);
      } else {
        this.popup.style.display = `block`;
      }
      this.modal.style.zIndex = n;
      this.popup.style.zIndex = n + 1;
      this.modal.addEventListener(`click`, () => this.close());
      this.reposition();
      if (!esgst.isRepositioning && !esgst.staticPopups) {
        setTimeout(() => repositionPopups(), 2000);
      }
      if (this.textInputs) {
        this.textInputs[0].focus();
      }
      if (callback) {
        callback();
      }
    }
    close() {
      this.modal.remove();
      if (this.isCreated) {
        if (this.temp) {
          this.popup.remove();
        } else {
          this.popup.classList.add(`esgst-hidden`);
          if (esgst.minimizePanel) {
            minimizePanel_addItem(this);
          }
        }
      } else {
        this.popup.style = ``;
      }
      if (this.onClose) {
        this.onClose();
      }
      esgst.openPopups -= 1;
      esgst.popups.pop();
      this.isOpen = false;
    }
    reposition() {
      if (this.isCreated && this.scrollable) {
        if (esgst.staticPopups) {
          this.scrollable.style.maxHeight = `${ innerHeight - (this.popup.offsetHeight - this.scrollable.offsetHeight) - 100}px`;
        } else {
          this.scrollable.style.maxHeight = `${ innerHeight * 0.9 - (this.popup.offsetHeight - this.scrollable.offsetHeight)}px`;
        }
      }
      if (!esgst.staticPopups) {
        let newLeft, newTop;
        newLeft = (innerWidth - this.popup.offsetWidth) / 2;
        newTop = (innerHeight - this.popup.offsetHeight) / 2;
        if (Math.abs(newLeft - this.popup.offsetLeft) > 5 || Math.abs(newTop - this.popup.offsetTop) > 5) {
          this.popup.style.left = `${newLeft}px`;
          this.popup.style.top = `${newTop}px`;
        }
      }
    }
    getTextInputValue(index) {
      return this.textInputs[index].value;
    }
    triggerButton(index, event) {
      if (event && (event.key !== `Enter` || this.buttons[index].busy)) return;
      this.buttons[index].trigger();
    }
    isButtonBusy(index) {
      return (!this.buttons[index] || this.buttons[index].busy);
    }
    removeButton(index) {
      let button = this.buttons.splice(index, 1)[0];
      button.set.remove();
    }
    setScrollable(html) {
      createElements(this.scrollable, `beforeEnd`, [{
        type: `div`,
        children: html
      }]);
    }
    getScrollable(html) {
      return createElements(this.scrollable, `beforeEnd`, [{
        type: `div`,
        children: html
      }]);
    }
    setError(message) {
      createElements(this.progress, `inner`, [{
        attributes: {
          class: `fa fa-times-circle`
        },
        type: `i`
      }, {
        text: `${message}`,
        type: `span`
      }]);
    }
    setProgress(message) {
      if (this.progressMessage) {
        this.progressMessage.textContent = message;
      } else {
        createElements(this.progress, `inner`, [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }, {
          text: `${message}`,
          type: `span`
        }]);
        this.progressMessage = this.progress.lastElementChild;
      }
    }
    clearProgress() {
      this.progress.innerHTML = ``;
      this.progressMessage = null;
    }
    setOverallProgress(message) {
      this.overallProgress.textContent = message;
    }
    clear() {
      this.progress.innerHTML = ``;
      this.progressMessage = null;
      this.overallProgress.textContent = ``;
      this.scrollable.innerHTML = ``;
    }
    setDone(temp) {
      this.temp = temp;
      if (esgst.minimizePanel && !this.isOpen) {
        minimizePanel_alert(this);
      }
    }
  }

  class Process {
    constructor(details) {
      this.mainPopup = details.mainPopup;
      this.popupDetails = details.popup;
      this.contextHtml = details.contextHtml;
      this.init = details.init;
      this.requests = details.requests;
      this.urls = details.urls;
      if (!details.mainPopup) {
        if (details.button) {
          this.button = details.button;
        } else {
          this.button = createHeadingButton(details.headingButton);
        }
        this.button.addEventListener(`click`, this.openPopup.bind(this));
      }
    }
    async openPopup() {
      if (this.popup) {
        this.popup.open();
        return;
      }
      this.popupDetails.buttons = [
        {
          color1: `green`,
          color2: `red`,
          icon1: `fa-arrow-circle-right`,
          icon2: `fa-times-circle`,
          title1: `Start`,
          title2: `Stop`,
          callback1: this.start.bind(this),
          callback2: this.stop.bind(this)
        }
      ];
      this.popup = new Popup_v2(this.popupDetails);
      this.popup.open();
      if (this.urls) {
        this.index = 0;
        this.perLoad = this.urls.perLoad;
        this.items = [];
        await this.urls.init(this, ...this.urls.arguments || []);
        this.total = this.items.length;
        if (!this.urls.doNotTrigger) {
          this.popup.triggerButton(0);
        }
        if (esgst[`es_${this.urls.id}`]) {
          this.popup.scrollable.addEventListener(`scroll`, () => {
            if (this.popup.scrollable.scrollTop + this.popup.scrollable.offsetHeight >= this.popup.scrollable.scrollHeight && !this.popup.isButtonBusy(0)) {
              this.popup.triggerButton(0);
            }
          });
        }
      }
    }
    async start() {
      if (this.button) {
        this.button.classList.add(`esgst-busy`);
      }
      this.isCanceled = false;

      if (this.popup && (!this.urls || this.urls.doNotTrigger)) {
        this.popup.clear();
      }

      if (this.init && (await this.init(this))) {
        if (this.button) {
          this.button.classList.remove(`esgst-busy`);
        }
        return;
      }

      if (this.urls) {
        await this.requestNextUrl(this.urls.request);
      } else {
        for (let i = 0; !this.isCanceled && i < this.requests.length; i++) {
          const request = this.requests[i];
          if (typeof request === `object`) {
            await this.request(request);
            if (request.onDone) {
              await request.onDone(this, request);
            }
          } else {
            await request(this);
          }
        }
      }

      if (this.button) {
        this.button.classList.remove(`esgst-busy`);
      }
      if (this.popup) {
        this.popup.clearProgress();
      }
    }
    stop() {
      this.isCanceled = true;
    }
    async requestNextUrl(details) {
      if (!this.urls.doNotTrigger && this.index >= this.total) {
        this.popup.removeButton(0);
        return;
      }
      this.popup.setProgress(`Loading more...`);
      this.popup.setOverallProgress(`${this.index} of ${this.total} loaded.`);
      this.context = this.mainContext ? createElements(this.mainContext, `beforeEnd`, this.contextHtml) : this.popup.getScrollable(this.contextHtml);
      let i = 0;
      while (!this.isCanceled && (i < this.perLoad || (esgst[`es_${this.urls.id}`] && this.popup.scrollable.scrollHeight <= this.popup.scrollable.offsetHeight))) {
        let url = this.items[this.index];
        if (!url) break;
        url = url.url || url;
        let response = await request({method: `GET`, queue: details.queue, url: url});
        let responseHtml = parseHtml(response.responseText);
        await details.request(this, details, response, responseHtml);
        i += 1;
        this.index += 1;
        this.popup.setOverallProgress(`${this.index} of ${this.total} loaded.`);
      }
      if (!this.urls.doNotTrigger && this.index >= this.total) {
        this.popup.removeButton(0);
      }
      if (this.urls.restart) {
        this.index = 0;
      }
      await endless_load(this.context);
    }
    async request(details) {
      if (!details.nextPage) {
        details.nextPage = 1;
      }
      let backup = details.nextPage;
      details.lastPage = ``;
      let pagination = null;
      let stop = false;
      do {
        let response = await request({method: `GET`, queue: details.queue, url: `${details.url}${details.nextPage}`});
        let responseHtml = parseHtml(response.responseText);
        if (details.source && details.nextPage === backup) {
          details.lastPage = lpl_getLastPage(responseHtml, false, details.source);
          details.lastPage = details.lastPage === 999999999 ? `` : ` of ${details.lastPage}`;
        }
        stop = await details.request(this, details, response, responseHtml);
        details.nextPage += 1;
        pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
      } while (!stop && !this.isCanceled && (!details.maxPage || details.nextPage <= details.maxPage) && pagination && !pagination.lastElementChild.classList.contains(esgst.selectedClass));
      details.nextPage = backup;
    }
  }

  class Table {
    /**
     * @param {Array[]} [values] A matrix containing the values of the table.
     */
    constructor(values) {
      this.table = document.createElement(`div`);
      this.table.className = `table esgst-ugd-table`;
      createElements(this.table, `inner`, [{
        attributes: {
          class: `table__heading`
        },
        type: `div`
      }, {
        attributes: {
          class: `table__rows`
        },
        type: `div`
      }]);
      this.heading = this.table.firstElementChild;
      this.rows = this.heading.nextElementSibling;
      this.rowGroups = {};
      this.hiddenColumns = [];
      this.numRows = 0;
      this.numColumns = 0;

      if (!values) {
        return this;
      }

      for (const column of values[0]) {
        this.addColumn(column);
      }
      const n = values.length;
      for (let i = 1; i < n; i++) {
        this.addRow(values[i]);
      }
    }
    addRow(columns, name, isCollapsibleGroup, isCollapsible, collapseMessage, expandMessage) {
      const row = createElements(this.rows, `beforeEnd`, [{
        attributes: {
          class: `table__row-outer-wrap ${name && isCollapsible ? `esgst-hidden` : ``}`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__row-inner-wrap`
          },
          type: `div`,
          children: name && isCollapsible ? [{
            attributes: {
              class: `fa fa-chevron-right`
            },
            type: `i`
          }] : null
        }]
      }]).firstElementChild;
      let group = null;
      if (name) {
        if (isCollapsibleGroup) {
          group = this.rowGroups[name] = {
            collapsibles: [],
            columns: [],
            isCollapsible: true,
            row: row
          };
          const expand = createElements(row, `afterBegin`, [{
            attributes: {
              class: `fa fa-plus-square esgst-clickable`,
              title: expandMessage
            },
            type: `i`
          }, {
            attributes: {
              class: `fa fa-minus-square esgst-clickable esgst-hidden`,
              title: collapseMessage
            },
            type: `i`
          }]);
          const collapse = expand.nextElementSibling;
          collapse.addEventListener(`click`, this.collapseRows.bind(this, collapse, expand, name));
          expand.addEventListener(`click`, this.expandRows.bind(this, collapse, expand, name));
        } else if (isCollapsible) {
          this.rowGroups[name].collapsibles.push(row);
        }
      }
      let isBold = false;
      for (let i = 0; i < this.numColumns; i++) {
        let cell = columns ? columns[i] : ``;
        let additionalClasses = [];
        let alignment = `center`;
        let size = `small`;
        if (cell && typeof cell === `object` && !Array.isArray(cell)) {
          additionalClasses = additionalClasses.concat(cell.additionalClasses);
          alignment = cell.alignment || alignment;
          size = cell.size || size;
          cell = cell.value;
        }
        if (this.hiddenColumns.indexOf(i) > -1) {
          additionalClasses.push(`esgst-hidden`);
        }
        if (i === 0 && cell && cell === `Total`) {
          isBold = true;
        }
        if (!cell || cell === `0 (0%)`) {
          additionalClasses.push(`is-faded`);
        }
        if (isBold) {
          additionalClasses.push(`esgst-bold`);
        }
        const attributes = {
          class: `table__column--width-${size} text-${alignment} ${additionalClasses.join(` `)}`
        };
        if (cell.attributes) {
          for (const attribute of cell.attribute) {
            const parts = attribute.match(/(.+?)="(.+?)"/);
            attributes[parts[1]] = attributes[parts[2]];
          }
        }
        const column = createElements(row, `beforeEnd`, [{
          attributes,
          text: Array.isArray(cell) ? `` : cell,
          type: `div`,
          children: Array.isArray(cell) ? cell : null
        }]);
        if (group) {
          group.columns.push(column);
        }
      }
      this.numRows += 1;
    }
    addColumn(column) {
      const cell = typeof column === `string` ? column : column.value;
      const additionalClasses = [].concat(column.additionalClasses);
      const alignment = column.alignment || `center`;
      const size = column.size || `small`;
      const attributes = {
        class: `table__column--width-${size} text-${alignment} ${additionalClasses.join(` `)}`
      };
      if (column.attributes) {
        for (const attribute of column.attribute) {
          const parts = attribute.match(/(.+?)="(.+?)"/);
          attributes[parts[1]] = attributes[parts[2]];
        }
      }
      createElements(this.heading, `beforeEnd`, [{
        attributes,
        text: cell,
        type: `div`
      }]);
      if (cell === `Total`) {
        attributes.class += ` esgst-bold`;
      }
      for (let i = 0; i < this.numRows; i++) {
        const row = this.rows.children[i];
        createElements(row, `beforeEnd`, [{
          attributes,
          type: `div`
        }]);
      }
      this.numColumns += 1;
    }
    hideColumns() {
      for (const column of arguments) {
        this.hiddenColumns.push(column - 1);
        this.heading.children[column - 1].classList.add(`esgst-hidden`);
        for (let i = this.numRows.length - 1; i > -1; i--) {
          this.rows.children[i].firstElementChild.chilren[column - 1].classList.add(`esgst-hidden`);
        }
      }
    }
    getRowGroup(name) {
      return this.rowGroups[name];
    }
    collapseRows(collapse, expand, name) {
      collapse.classList.add(`esgst-hidden`);
      expand.classList.remove(`esgst-hidden`);
      for (const row of this.rowGroups[name].collapsibles) {
        row.parentElement.classList.add(`esgst-hidden`);
      }
    }
    expandRows(collapse, expand, name) {
      expand.classList.add(`esgst-hidden`);
      collapse.classList.remove(`esgst-hidden`);
      for (const row of this.rowGroups[name].collapsibles) {
        row.parentElement.classList.remove(`esgst-hidden`);
      }
    }
  }

  class ToggleSwitch {
    constructor(context, id, inline, name, sg, st, tooltip, value) {
      this.dependencies = [];
      this.exclusions = [];
      this.id = id;
      this.sg = sg;
      this.st = st;
      this.value = value;
      this.container = createElements(context, `beforeEnd`, [{
        attributes: {
          class: `esgst-toggle-switch-container ${inline ? `inline` : ``}`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-toggle-switch`
          },
          type: `label`,
          children: [{
            attributes: {
              type: `checkbox`
            },
            type: `input`
          }, {
            attributes: {
              class: `esgst-toggle-switch-slider`
            },
            type: `div`
          }]
        }, {
          text: typeof name === `string` ? name : ``,
          type: `span`,
          children: typeof name === `string` ? null : name
        }, tooltip ? {
          attributes: {
            class: `fa fa-question-circle`,
            title: tooltip
          },
          type: `i`
        } : null]
      }]);
      this.switch = this.container.firstElementChild;
      this.input = this.switch.firstElementChild;
      this.name = this.switch.nextElementSibling;
      this.input.checked = this.value;
      this.input.addEventListener(`change`, () => this.change());
    }
    async change(settings) {
      this.value = this.input.checked;
      if (this.id) {
        let key = this.id;
        if (this.sg) {
          key += `_sg`;
        } else if (this.st) {
          key += `_st`;
        }
        let setting = esgst.settings[key];
        if (typeof setting === `undefined` || !setting.include) {
          setting = this.value;
        } else {
          setting.enabled = this.value ? 1 : 0;
        }
        esgst.settings[key] = setting;
        esgst[this.id] = this.value;
        if (!settings) {
          let message = createElements(this.container, `beforeEnd`, [{
            attributes: {
              class: `esgst-description esgst-bold`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `fa fa-circle-o-notch fa-spin`,
                title: `Saving...`
              },
              type: `i`
            }]
          }]);
          await setSetting(key, setting);
          message.classList.add(`esgst-green`);
          createElements(message, `inner`, [{
            attributes: {
              class: `fa fa-check`,
              title: `Saved!`
            },
            type: `i`
          }]);
          setTimeout(() => message.remove(), 2500);
        }
      }
      if (this.value) {
        this.dependencies.forEach(dependency => dependency.classList.remove(`esgst-hidden`));
        this.exclusions.forEach(exclusion => exclusion.classList.add(`esgst-hidden`));
        if (this.onEnabled) {
          this.onEnabled();
        }
      } else {
        this.dependencies.forEach(dependency => dependency.classList.add(`esgst-hidden`));
        this.exclusions.forEach(exclusion => exclusion.classList.remove(`esgst-hidden`));
        if (this.onDisabled) {
          this.onDisabled();
        }
      }
    }
    enable(settings) {
      this.input.checked = true;
      this.change(settings);
    }
    disable(settings) {
      this.input.checked = false;
      this.change(settings);
    }
    toggle(settings) {
      this.input.checked = !this.input.checked;
      this.change(settings);
    }
  }

  async function init() {
    if (document.getElementById(`esgst`)) {
      // esgst is already running
      return;
    }

    // initialize the global variable
    esgst = {
      documentEvents: {
        click: [],
        keydown: []
      },
      windowEvents: {},
      parameters: getParameters(),
      defaultValues: {
        backupZip_sg: false,
        backupZip_st: false,
        gc_hltb_index_0: 0,
        gc_hltb_index_1: 0,
        gc_hltb_index_2: 0,
        gc_lr_sg: true,
        gc_rt_sg: true,
        ugd_playtime: 0,
        ugd_achievements: 0,
        ct_o_sg: true,
        ct_o_st: true,
        ct_f_sg: true,
        ct_f_st: true,
        gf_m_b_sg: false,
        gf_m_a_sg: false,
        df_m_b_sg: false,
        df_m_a_sg: false,
        cf_m_b_sg: false,
        cf_m_a_sg: false,
        gf_presets: [],
        df_presets: [],
        cf_presets: [],
        chfl_key: `ctrlKey + e`,
        getSyncGameNames_sg: false,
        getSyncGameNames_st: false,
        sgDarkGrey_startTime: `00:00`,
        sgDarkGrey_endTime: `23:59`,
        sgv2Dark_startTime: `00:00`,
        sgv2Dark_endTime: `23:59`,
        steamGiftiesBlack_startTime: `00:00`,
        steamGiftiesBlack_endTime: `23:59`,
        steamGiftiesBlue_startTime: `00:00`,
        steamGiftiesBlue_endTime: `23:59`,
        steamTradiesBlackBlue_startTime: `00:00`,
        steamTradiesBlackBlue_endTime: `23:59`,
        customTheme_startTime: `00:00`,
        customTheme_endTime: `23:59`,
        mm_useRegExp: false,
        mm_enableGiveaways: false,
        mm_enableDiscussions: false,
        mm_enableUsers: false,
        mm_enableGames: false,
        cs_limitPages: false,
        cs_minPage: ``,
        cs_maxPage: ``,
        ge_sgt_limit: 1,
        filter_os: 0,
        filter_giveaways_exist_in_account: 0,
        filter_giveaways_missing_base_game: 0,
        filter_giveaways_level: 0,
        filter_giveaways_additional_games: 0,
        dismissedOptions: [],
        hr_g_format: `🏆`,
        hr_w_format: `(#❤)`,
        hr_p_format: `(#P)`,
        ef_filters: ``,
        gwc_h_width: `3px`,
        gwr_h_width: `3px`,
        chfl_giveaways_sg: [
          `new`,
          `wishlist`,
          `created`,
          `entered`,
          `won`,
          {color: `grey`, description: `View your hidden games.`, icon: `fa-eye`, id: `filters`, name: `Hidden Games`, url: `/account/settings/giveaways/filters`},
          {color: `grey`, description: `Check if a game receives reduced CV.`, icon: `fa-calendar-minus-o`, id: `bundle-games`, name: `Reduced CV Games`, url: `/bundle-games`},
          {id: `type=wishlist`, name: `Browse Wishlist Giveaways`, url: `/giveaways/search?type=wishlist`},
          {id: `type=recommended`, name: `Browse Recommended Giveaways`, url: `/giveaways/search?type=recommended`},
          {id: `type=group`, name: `Browse Group Giveaways`, url: `/giveaways/search?type=group`},
          {id: `type=new`, name: `Browse New Giveaways`, url: `/giveaways/search?type=new`}
        ],
        chfl_discussions_sg: [
          `new`,
          `created`,
          `dh`,
          {color: `grey`, description: `Help the community.`, icon: `fa-question-circle `, id: `categorize-discussions`, name: `Categorize Discussions`, url: `/tools/categorize-discussions`},
          {id: `announcements`, name: `Browse Announcements`, url: `/discussions/announcements`},
          {id: `bugs-suggestions`, name: `Browse Bugs / Suggestions`, url: `/discussions/bugs-suggestions`},
          {id: `deals`, name: `Browse Deals`, url: `/discussions/deals`},
          {id: `general`, name: `Browse General`, url: `/discussions/general`},
          {id: `group-recruitment`, name: `Browse Group Recruitment`, url: `/discussions/group-recruitment`},
          {id: `lets-play-together`, name: `Browse Let's Play Together`, url: `/discussions/lets-play-together`},
          {id: `off-topic`, name: `Browse Off-Topic`, url: `/discussions/off-topic`},
          {id: `puzzles`, name: `Browse Puzzles`, url: `/discussions/puzzles`},
          {id: `uncategorized`, name: `Browse Uncategorized`, url: `/discussions/uncategorized`}
        ],
        chfl_support_sg: [
          `new`,
          {color: `grey`, description: `Check a user's real CV.`, icon: `fa-dollar`, id: `real-cv`, name: `Real CV`, url: `https://www.sgtools.info/real-cv`},
          {color: `red`, description: `Check if a user has not activated wins.`, icon: `fa-exchange`, id: `activation`, name: `Not Activated Wins`, url: `https://www.sgtools.info/activation`},
          {color: `red`, description: `Check if a user has multiple wins.`, icon: `fa-clone`, id: `multiple-wins`, name: `Multiple Wins`, url: `https://www.sgtools.info/multiple-wins`},
          {color: `grey`, description: `Check the last bundled games.`, icon: `fa-percent`, id: `lastbundled`, name: `Last Bundled`, url: `https://www.sgtools.info/lastbundled`}
        ],
        chfl_help_sg: [
          `comment-formatting`,
          `faq`,
          `guidelines`,
          {color: `grey`, description: `View SteamGifts' change log.`, icon: `fa-file-text-o`, id: `e9zDo`, name: `Change Log`, url: `/discussion/e9zDo/`}
        ],
        chfl_account_sg: [
          `profile`,
          `stats`,
          `et`,
          `ch`,
          {color: `blue`, icon: `fa-heart`, id: `whitelist`, name: `Whitelist`, url: `/account/manage/whitelist`},
          {color: `red`, icon: `fa-ban`, id: `blacklist`, name: `Blacklist`, url: `/account/manage/blacklist`},
          {color: `grey`, icon: `fa-folder`, id: `games`, name: `Games`, url: `/account/steam/games`},
          {color: `grey`, icon: `fa-user`, id: `groups`, name: `Groups`, url: `/account/steam/groups`},
          {color: `grey`, icon: `fa-star`, id: `wishlist`, name: `Wishlist`, url: `/account/steam/wishlist`},
        ],
        chfl_footer_sg: [
          `archive`,
          `stats`,
          `roles`,
          `users`,
          `steamgifts`,
          `103582791432125620`,
          `privacy-policy`,
          `terms-of-service`
        ],
        chfl_trades_st: [
          `new`,
          `user=[steamId]`
        ],
        chfl_account_st: [
          `user=[steamId]`
        ],
        chfl_footer_st: [
          `guidelines`,
          `comment-formatting`,
          `privacy-policy`,
          `terms-of-service`
        ],
        cdr_days: 7,
        addNoCvGames_sg: false,
        lockGiveawayColumns_sg: false,
        staticPopups_width: `900px`,
        hgr_removeOwned: true,
        giveawayColumns: [`ged`, `endTime`, `winners`, `startTime`, `touhou`, `inviteOnly`, `whitelist`, `group`, `regionRestricted`, `level`],
        giveawayPanel: [`ttec`, `gwc`, `gwr`, `gptw`, `gp`, `elgb`, `sgTools`],
        giveawayColumns_gv: [`sgTools`, `ged`, `time`, `touhou`, `inviteOnly`, `whitelist`, `group`, `regionRestricted`, `level`],
        giveawayPanel_gv: [`ttec`, `gwc`, `gwr`, `gptw`, `gp`, `elgb`],
        enableByDefault_sg: false,
        enableByDefault_st: false,
        cf_m_sg: true,
        checkVersion_sg: true,
        checkVersionMain_sg: true,
        collapseSections_sg: false,
        collapseSections_st: false,
        df_m_sg: true,
        elgb_d_sg: true,
        gb_ue_sg: true,
        gc_g_s_sg: false,
        ge_o_sg: false,
        gf_m_sg: true,
        gwc_a_b_sg: false,
        gwr_a_b_sg: false,
        hpg_sg: false,
        pm_a: false,
        radb_sg: true,
        showChangelog_sg: true,
        showChangelog_st: true,
        staticPopups_sg: false,
        staticPopups_st: false,
        vai_i_sg: false,
        avatar: ``,
        steamId: ``,
        steamApiKey: ``,
        username: ``,
        adots_index: 0,
        ags_type: ``,
        ags_maxDate: ``,
        ags_minDate: ``,
        ags_maxScore: ``,
        ags_minScore: ``,
        ags_maxLevel: ``,
        ags_minLevel: ``,
        ags_maxEntries: ``,
        ags_minEntries: ``,
        ags_maxCopies: ``,
        ags_minCopies: ``,
        ags_maxPoints: ``,
        ags_minPoints: ``,
        ags_regionRestricted: false,
        ags_dlc: false,
        ags_app: false,
        ags_sub: false,
        ap_index: 0,
        as_searchAppId: false,
        autoBackup_days: 1,
        autoBackup_index: 0,
        autoSyncGroups: 0,
        autoSyncWhitelist: 0,
        autoSyncBlacklist: 0,
        autoSyncHiddenGames: 0,
        autoSyncGames: 0,
        autoSyncWonGames: 0,
        autoSyncReducedCvGames: 0,
        autoSyncNoCvGames: 0,
        autoSyncHltbTimes: 0,
        autoSyncGiveaways: 0,
        calculateDelete: true,
        calculateExport: true,
        calculateImport: true,
        cf_enable: true,
        cf_preset: null,
        cfh_pasteFormatting: true,
        cfh_img_choice: 1,
        cfh_img_remember: false,
        cleanDiscussions: true,
        cleanEntries: true,
        cleanGiveaways: true,
        cleanSgCommentHistory: true,
        cleanStCommentHistory: true,
        cleanTickets: true,
        cleanTrades: true,
        cleanDuplicates: true,
        cleanDiscussions_days: 30,
        cleanEntries_days: 30,
        cleanGiveaways_days: 30,
        cleanSgCommentHistory_days: 30,
        cleanStCommentHistory_days: 30,
        cleanTickets_days: 30,
        cleanTrades_days: 30,
        df_enable: true,
        df_enableCreated: false,
        df_preset: null,
        df_presetCreated: null,
        ds_auto: false,
        ds_option: `sortIndex_asc`,
        elgb_filters: `.|(bestof|(g(ood)?)?)(l(uck)?)?(h(ave)?)?(f(un)?)?|enjoy|(h(umble)?)?(b(undle)?)?(g(ift)?)?(l(ink)?)?`,
        exportBackup: true,
        exportBackupIndex: 0,
        gas_auto: false,
        gas_option: `sortIndex_asc`,
        gas_autoWishlist: false,
        gas_optionWishlist: `sortIndex_asc`,
        gas_autoRecommended: false,
        gas_optionRecommended: `sortIndex_asc`,
        gas_autoGroup: false,
        gas_optionGroup: `sortIndex_asc`,
        gas_autoNew: false,
        gas_optionNew: `sortIndex_asc`,
        gas_autoEntered: false,
        gas_optionEntered: `sortIndex_asc`,
        gas_autoUser: false,
        gas_optionUser: `sortIndex_asc`,
        gas_autoGroups: false,
        gas_optionGroups: `sortIndex_asc`,
        gas_autoPopup: false,
        gas_optionPopup: `sortIndex_asc`,
        gb_hours: 1,
        gc_categories: [`gc_gi`, `gc_r`, `gc_hltb`, `gc_fcv`, `gc_rcv`, `gc_ncv`, `gc_h`, `gc_i`, `gc_o`, `gc_w`, `gc_pw`, `gc_a`, `gc_sp`, `gc_mp`, `gc_sc`, `gc_tc`, `gc_l`, `gc_m`, `gc_ea`, `gc_lg`, `gc_rm`, `gc_dlc`, `gc_p`, `gc_rd`, `gc_g`],
        gc_indexes: {},
        gc_categories_gv: [`gc_gi`, `gc_r`, `gc_hltb`, `gc_fcv`, `gc_rcv`, `gc_ncv`, `gc_h`, `gc_i`, `gc_o`, `gc_w`, `gc_pw`, `gc_a`, `gc_sp`, `gc_mp`, `gc_sc`, `gc_tc`, `gc_l`, `gc_m`, `gc_ea`, `gc_lg`, `gc_rm`, `gc_dlc`, `gc_p`, `gc_rd`, `gc_g`],
        gc_indexes_gv: {},
        gc_o_altAccounts: [],
        gc_g_colors: [],
        gc_g_filters: ``,
        gc_r_colors: [
          {bgColor: `#a34c25`, color: `#ffffff`, icon: `thumbs-down`, lower: 0, upper: 39},
          {bgColor: `#b9a074`, color: `#ffffff`, icon: `minus-circle`, lower: 40, upper: 69},
          {bgColor: `#66c0f4`, color: `#ffffff`, icon: `thumbs-up`, lower: 70, upper: 100}
        ],
        gc_fcvIcon: `calendar`,
        gc_rcvIcon: `calendar-minus-o`,
        gc_ncvIcon: `calendar-times-o`,
        gc_hIcon: `eye-slash`,
        gc_iIcon: `ban`,
        gc_oIcon: `folder`,
        gc_wIcon: `heart`,
        gc_pwIcon: `gift`,
        gc_aIcon: `trophy`,
        gc_spIcon: `user`,
        gc_mpIcon: `users`,
        gc_scIcon: `cloud`,
        gc_tcIcon: `clone`,
        gc_lIcon: `linux`,
        gc_mIcon: `apple`,
        gc_eaIcon: `unlock`,
        gc_lgIcon: `spinner`,
        gc_rmIcon: `trash`,
        gc_dlcIcon: `download`,
        gc_pIcon: `suitcase`,
        gc_rdIcon: `clock-o`,
        gc_fcvLabel: `Full CV`,
        gc_rcvLabel: `Reduced CV`,
        gc_ncvLabel: `No CV`,
        gc_hLabel: `Hidden`,
        gc_iLabel: `Ignored`,
        gc_oLabel: `Owned`,
        gc_wLabel: `Wishlisted`,
        gc_pwLabel: `Previously Won`,
        gc_aLabel: `Achievements`,
        gc_spLabel: `Singleplayer`,
        gc_mpLabel: `Multiplayer`,
        gc_scLabel: `Steam Cloud`,
        gc_tcLabel: `Trading Cards`,
        gc_lLabel: `Linux`,
        gc_mLabel: `Mac`,
        gc_eaLabel: `Early Access`,
        gc_lgLabel: `Learning`,
        gc_rmLabel: `Removed`,
        gc_dlcLabel: `DLC`,
        gc_pLabel: `Package`,
        gc_rdLabel: `Mon DD, YYYY`,
        gc_h_color: `#ffffff`,
        gc_hltb_color: `#ffffff`,
        gc_gi_color: `#ffffff`,
        gc_fcv_color: `#ffffff`,
        gc_rcv_color: `#ffffff`,
        gc_ncv_color: `#ffffff`,
        gc_w_color: `#ffffff`,
        gc_o_color: `#ffffff`,
        gc_pw_color: `#ffffff`,
        gc_i_color: `#ffffff`,
        gc_lg_color: `#ffffff`,
        gc_rm_color: `#ffffff`,
        gc_ea_color: `#ffffff`,
        gc_tc_color: `#ffffff`,
        gc_a_color: `#ffffff`,
        gc_sp_color: `#ffffff`,
        gc_mp_color: `#ffffff`,
        gc_sc_color: `#ffffff`,
        gc_l_color: `#ffffff`,
        gc_m_color: `#ffffff`,
        gc_dlc_color: `#ffffff`,
        gc_p_color: `#ffffff`,
        gc_rd_color: `#ffffff`,
        gc_g_color: `#ffffff`,
        gc_h_bgColor: `#e74c3c`,
        gc_hltb_bgColor: `#328ed6`,
        gc_gi_bgColor: `#555555`,
        gc_fcv_bgColor: `#641e16`,
        gc_rcv_bgColor: `#641e16`,
        gc_ncv_bgColor: `#641e16`,
        gc_o_bgColor: `#16a085`,
        gc_w_bgColor: `#3498db`,
        gc_pw_bgColor: `#16a085`,
        gc_i_bgColor: `#e74c3c`,
        gc_lg_bgColor: `#555555`,
        gc_rm_bgColor: `#e74c3c`,
        gc_ea_bgColor: `#3498db`,
        gc_tc_bgColor: `#2ecc71`,
        gc_a_bgColor: `#145a32`,
        gc_sp_bgColor: `#5eb2a1`,
        gc_mp_bgColor: `#0e6251`,
        gc_sc_bgColor: `#154360`,
        gc_l_bgColor: `#f39c12`,
        gc_m_bgColor: `#d35400`,
        gc_dlc_bgColor: `#8e44ad`,
        gc_p_bgColor: `#8e44ad`,
        gc_rd_bgColor: `#7f8c8d`,
        gc_g_bgColor: `#7f8c8d`,
        gcl_index: 0,
        ge_b_bgColor: `#ddcccc`,
        ge_g_bgColor: `#ccddcc`,
        ge_p_bgColor: `#ccccdd`,
        ged: true,
        gf_enable: true,
        gf_enableWishlist: true,
        gf_enableRecommended: true,
        gf_enableNew: true,
        gf_enableGroup: true,
        gf_enableCreated: true,
        gf_enableEntered: true,
        gf_enableWon: true,
        gf_enableGroups: true,
        gf_enableUser: true,
        gf_enableGb: true,
        gf_enableGe: true,
        gf_enableGed: true,
        gf_preset: null,
        gf_presetWishlist: null,
        gf_presetRecommended: null,
        gf_presetNew: null,
        gf_presetGroup: null,
        gf_presetCreated: null,
        gf_presetEntered: null,
        gf_presetWon: null,
        gf_presetGroups: null,
        gf_presetUser: null,
        gf_presetGb: null,
        gf_presetGe: null,
        gf_presetGed: null,
        ggl_index: 0,
        gpt_colors: {},
        gt_colors: {},
        gts_preciseStart: false,
        gts_preciseEnd: false,
        gts_preciseStartDate: false,
        gts_preciseEndDate: false,
        gv_spacing: 0,
        gch_colors: [],
        gwc_colors: [],
        gwr_colors: [],
        gptw_colors: [],
        geth_colors: [],
        hr_minutes: 1,
        hr_w_hours: 24,
        lastBackup: 0,
        lastSyncGroups: 0,
        lastSyncWhitelist: 0,
        lastSyncBlacklist: 0,
        lastSyncHiddenGames: 0,
        lastSyncGames: 0,
        lastSyncWonGames: 0,
        lastSyncReducedCvGames: 0,
        lastSyncNoCvGames: 0,
        lastSyncHltbTimes: 0,
        lastSyncGiveaways: 0,
        leftButtonIds: [`wbsDesc`, `wbsAsc`, `wbc`, `ugs`, `tb`, `sks`, `rbp`, `namwc`, `mpp`, `mm`, `hgr`, `gv`, `gts`, `gf`, `ge`, `gas`, `ds`, `df`, `ctUnread`, `ctRead`, `ctGo`, `cs`, `cf`, `as`, `aic`],
        mgc_createTrain: true,
        mgc_bumpLast: true,
        mgc_groupKeys: false,
        mgc_groupAllKeys: false,
        mgc_reversePosition: false,
        mgc_removeLinks: true,
        namwc_checkNotActivated: false,
        namwc_checkMultiple: false,
        npth_previousKey: `ArrowLeft`,
        npth_nextKey: `ArrowRight`,
        nrf_searchMultiple: false,
        rightButtonIds: [`esResume`, `esPause`, `esRefresh`, `esRefreshAll`, `stbb`, `sttb`],
        sal_index: 2,
        sk_closePopups: `escape`,
        sk_searchBox: `ctrlKey + q`,
        sk_firstPage: `ctrlKey + arrowup`,
        sk_previousPage: `ctrlKey + arrowleft`,
        sk_nextPage: `ctrlKey + arrowright`,
        sk_lastPage: `ctrlKey + arrowdown`,
        sk_toggleFilters: `altKey + q`,
        sk_hideGame: `altKey + g`,
        sk_hideGiveaway: `altKey + h`,
        sk_giveawayEntry: `ctrlKey + enter`,
        sk_creator: `altKey + c`,
        sk_replyBox: `ctrlKey +  `,
        sk_replyUser: `altKey + u`,
        sk_submitReply: `ctrlKey + enter`,
        sks_exportKeys: false,
        sks_searchCurrent: false,
        sks_limitDate: false,
        sks_limitPages: false,
        sks_minDate: ``,
        sks_maxDate: ``,
        sks_minPage: ``,
        sks_maxPage: ``,
        stbb_index: 0,
        sttb_index: 0,
        syncGroups: true,
        syncWhitelist: true,
        syncBlacklist: true,
        syncHiddenGames: true,
        syncGames: true,
        syncWonGames: true,
        syncReducedCvGames: true,
        syncNoCvGames: true,
        syncHltbTimes: false,
        syncGiveaways: true,
        ugd_getPlaytime: true,
        ugd_getAchievements: false,
        ugd_clearCache: false,
        ugs_checkRules: false,
        ugs_checkWhitelist: false,
        ugs_checkBlacklist: false,
        ugs_checkMember: false,
        ugs_checkDifference: false,
        ugs_difference: 0,
        ut_colors: {},
        wbc_hb_sg: false,
        wbc_checkSingle: false,
        wbc_checkBlacklist: false,
        wbc_checkAll: false,
        wbc_checkPages: false,
        wbc_minPage: ``,
        wbc_maxPage: ``,
        wbc_returnWhitelists: false,
        wbc_returnBlacklists: false,
        wbc_checkSelected: false,
        wbc_pages: 0,
        wbc_skipUsers: false,
        wbm_clearTags: false,
        wbm_useCache: false,
        wbm_tags: [],
        wbc_checkNew: false,
        wbc_clearCache: false,
        wbh_w_color: `#ffffff`,
        wbh_w_bgColor: `#228b22`,
        wbh_b_color: `#ffffff`,
        wbh_b_bgColor: `#ff4500`
      },
      oldValues: {
        mm_useRegExp: `gm_useRegExp`,
        mm_enableGiveaways: `gm_enable`,
        mm_enableDiscussions: `gm_enable`,
        mm_enableUsers: `gm_enable`,
        mm_enableGames: `gm_enable`,
        pl_sg: `wbl_sg`,
        pl_w_sg: `wbl_sg`,
        pl_b_sg: `wbl_sg`,
        gdttt_vg_sg: `gdttt_v_sg`,
        gdttt_vd_sg: `gdttt_v_sg`,
        gdttt_vt_sg: `gdttt_v_sg`,
        gdttt_vts_st: `gdttt_v_st`,
        wbc_hb_sg: `wbc_b_sg`,
        wbc_checkBlacklist: `wbc_checkWhitelist`
      },
      markdownParser: new Parsedown(),
      sg: location.hostname.match(/www.steamgifts.com/),
      st: location.hostname.match(/www.steamtrades.com/),
      currentVersion: `7.26.0`,
      devVersion: `7.26.0`,
      icon: `data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqv8DCbP/Hgeq+CQIrf8iCK3/Igit/yIIrf8iB6//Iwit9x8Aqv8DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKr0GAa2/c0DvfzfA7f83QO3/N0Dt/zdA7f83QO+/d4Gs/3OAKP1GQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACm/xQFs/n2Bcf//wW///8FwP//BcD//wW///8Fx///BbP69gC2/xUAAAAAAAAAAAAAAAAA/1UDFptOFxSZMxkLpJktAq720QW1+ugEsfvjA7b92wO2/dsEsfvjBbX66Aau/dEoiO4tUlLWGU5k3hdVVf8DEJxKHxWqT8cVrU7uE6VN0guqny0Apv8XAJfQGwBAVywAQFcsAJfQGwCx/xcogugtS2Lk0lBl6u5Qae7ISmPeHxagSSMVr07jF7lV/xOiSu0brgATAAAAAAAAAA8AAAC/AAAAwAAAABAAAAAAYznjEkth4OxWb/3/T2jv40lf4iMXnksiEq1O3RayUv8UpEnkEo0+HQAAABkAAABBAAAA8QAAAPEAAABBAAAAGUBSvxxOYeDjU2v0/05m7d1LYuEiF55LIhKtTt0Ws1L/FahN2gU1FTAAAADAAAAA7AAAAP0AAAD9AAAA7AAAAMAVG0owUGPm2lNr9P9OZu3dS2LhIheeSyISrU7dFrNS/xWoTdoFNRswAAAAvwAAAOsAAAD9AAAA/QAAAOsAAADAFRtKMFBj6NpTa/T/Tmbt3Uti4SIXnksiEq1O3RayUv8UpEnkEo0+HQAAABgAAABAAAAA8QAAAPEAAABBAAAAGT5PuR1OYeDjU2v0/05m7d1LYuEiFqBJIxWuT+QXuVX/E6JL7QC8XhMAAAAAAAAADwAAAL8AAAC/AAAAEAAAAAAOR/8SSWLh7FZv/f9PaO/jSV/iIxCUSh8Vrk7HFqxN7ROlS9JskzMt1XULGK12EhxGLgYsRy8GK612EhzVgAsYgmxxLU1i39JNZ+vtT2fwx0pj1h8AqlUDF65GFgqZUhlsiC0txH0T0s5/EujJgBPkz4QR28+EEdvJgBPkzn8Q6Md+E9KLdHosM1LWGUZo6BZVVf8DAAAAAAAAAAAAAAAA/2YAFMl9EvbgjRb/14gV/9eIFf/XiBX/14gV/9+NFv/KgBD254YAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL91FRjKgRHN1IgU3s+EEt3PhBLdz4QS3c+EEt3UiBTezYMRzcJ6FBkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqgADxIARHr18FiO8eA8ivHgPIrx4DyK8eA8ivXwPI8SAER7/VQADAAAAAAAAAAAAAAAA78cAAPA3AAD4FwAABCAAADGOAAAE+AAAkBEAAJ55AACYOQAAlgEAAER4AAAXaAAATnoAAPgXAAD0JwAA69cAAA==`,
      sgIcon: `data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIUAAAD5AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAPoAAACFAAAAAAAAAAAAAAD8AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA+QAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAPwAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD5AAAAAAAAAAAAAACFAAAA+QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD5AAAAhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AADAAwAAwAMAAMfjAADP8wAAz/MAAM/zAADP8wAAz/MAAM/zAADH4wAAwAMAAMADAAD//wAA//8AAA==`,
      stIcon: `data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbD6SgWw+ucFsPrkBbD6SgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWw+uYFsPr/BbD6/wWw+ucAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFsPrmBbD6/wWw+v8FsPrmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbD6SQWw+uYFsPrmBbD6SQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFKRLShSkS+cUpEvkFKRLSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExi4EpMYuDnTGLg5Exi4EoAAAAAAAAAABSkS+YUpEv/FKRL/xSkS+cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMYuDmTGLg/0xi4P9MYuDnAAAAAAAAAAAUpEvmFKRL/xSkS/8UpEvmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATGLg5kxi4P9MYuD/TGLg5gAAAAAAAAAAFKRLSRSkS+YUpEvmFKRLSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExi4ElMYuDmTGLg5kxi4EkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMZ9E0rGfRPnxn0T5MZ9E0oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADGfRPmxn0T/8Z9E//GfRPnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxn0T5sZ9E//GfRP/xn0T5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMZ9E0nGfRPmxn0T5sZ9E0kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAPw/AAD8PwAA/D8AAPw/AAD//wAAh+EAAIfhAACH4QAAh+EAAP//AAD8PwAA/D8AAPw/AAD8PwAA//8AAA==`,
      attachedImages: [],
      mainComments: [],
      popupComments: [],
      popups: [],
      openPopups: 0,
      ustCheckboxes: {},
      ustTickets: {},
      numUstTickets: 0,
      elgbCache: JSON.parse(getLocalValue(`elgbCache`, `{"descriptions": {}, "timestamp": ${Date.now()}}`)),
      menuPath: location.pathname.match(/^\/esgst\//),
      settingsPath: location.pathname.match(/^\/esgst\/settings/),
      importMenuPath: location.pathname.match(/^\/esgst\/(import|restore)/),
      exportMenuPath: location.pathname.match(/^\/esgst\/(backup|export)/),
      deleteMenuPath: location.pathname.match(/^\/esgst\/delete/),
      gbPath: location.pathname.match(/^\/esgst\/bookmarked-giveaways/),
      gedPath: location.pathname.match(/^\/esgst\/decrypted-giveaways/),
      gePath: location.pathname.match(/^\/esgst\/extracted-giveaways/),
      glwcPath: location.pathname.match(/^\/esgst\/glwc/),
      userPath: location.pathname.match(/^\/user\//),
      groupPath: location.pathname.match(/^\/group\//),
      regionsPath: location.pathname.match(/^\/regions\//),
      groupWishlistPath: location.pathname.match(/^\/group\/(.*?)\/wishlist/),
      mainPath: location.pathname.match(/^\/$/),
      winnersPath: location.pathname.match(/^\/giveaway\/.+\/winners/),
      giveawaysPath: location.href.match(/steamgifts.com($|\/$|\/giveaways(?!.*\/(new|wishlist|created|entered|won)))/),
      giveawayCommentsPath: location.pathname.match(/^\/giveaway\/(?!.+\/(entries|winners|groups))/),
      discussionsTicketsPath: location.pathname.match(/^\/(discussions|support\/tickets)/),
      ticketsPath: location.pathname.match(/^\/support\/tickets/),
      tradesPath: location.href.match(/steamtrades.com($|\/$|\/trades)/),
      discussionsTicketsTradesPath: location.href.match(/steamtrades.com($|\/$)/) || location.pathname.match(/^\/(discussions|support\/tickets|trades)/),
      originalHash: location.hash,
      discussionTicketTradeCommentsPath: location.pathname.match(/^\/(discussion|support\/ticket|trade)\//),
      archivePath: location.pathname.match(/^\/archive/),
      profilePath: location.pathname.match(/^\/account\/settings\/profile/),
      giveawayPath: location.pathname.match(/^\/giveaway\//),
      discussionPath: location.pathname.match(/^\/discussion\//),
      ticketPath: location.pathname.match(/^\/support\/ticket\//),
      tradePath: location.pathname.match(/^\/trade\//),
      discussionsPath: location.pathname.match(/^\/discussions(?!\/(new|edit))/),
      newDiscussionPath: location.pathname.match(/^\/discussions\/new/),
      editDiscussionPath: location.pathname.match(/^\/discussions\/edit/),
      createdDiscussionsPath: location.pathname.match(/^\/discussions\/created/),
      newGiveawayPath: location.pathname.match(/^\/giveaways\/new/),
      newTicketPath: location.pathname.match(/^\/support\/tickets\/new/),
      wishlistPath: location.pathname.match(/^\/giveaways\/wishlist/),
      createdPath: location.pathname.match(/^\/giveaways\/created/),
      wonPath: location.pathname.match(/^\/giveaways\/won/),
      enteredPath: location.pathname.match(/^\/giveaways\/entered/),
      commentsPath: location.pathname.match(/^\/(giveaway\/(?!.*\/(entries|winners|groups))|discussion\/|support\/ticket\/|trade\/)/),
      accountPath: location.pathname.match(/^\/account/),
      aboutPath: location.pathname.match(/^\/(about|legal)/),
      whitelistPath: location.pathname.match(/^\/account\/manage\/whitelist/),
      blacklistPath: location.pathname.match(/^\/account\/manage\/blacklist/),
      inboxPath: location.pathname.match(/^\/messages/),
      groupsPath: location.pathname.match(/^\/account\/steam\/groups/),
      pageTop: 0,
      commentsTop: 0,
      apPopouts: {},
      tsTables: [],
      currentUsers: {},
      currentGroups: {},
      mainGiveaways: [],
      mainDiscussions: [],
      mainUsers: [],
      mainGames: [],
      mainGroups: [],
      popupGiveaways: [],
      popupDiscussions: [],
      popupUsers: [],
      popupGames: [],
      popupGroups: [],
      mmWbcUsers: [],
      gameFeatures: [],
      groupFeatures: [],
      giveawayFeatures: [],
      discussionFeatures: [],
      profileFeatures: [],
      userFeatures: [],
      endlessFeatures: [],
      edited: {}
    };
    if (document.body && document.body.getAttribute(`data-esgst-action`)) {
      esgst.menuPath = true;
      esgst.settingsPath = true;
      esgst.sg = true;
      esgst.actionPage = true;
    }
    esgst.markdownParser.setBreaksEnabled(true);
    esgst.markdownParser.setMarkupEscaped(true);
    esgst.name = esgst.sg ? `sg` : `st`;

    if (_USER_INFO.extension) {
      // esgst is running as an extension
      setValue = (key, value) => {
        return setValues({[key]: value});
      };
      setValues = values => {
        let key;
        return new Promise(resolve => {
          browser.runtime.sendMessage({
            action: `setValues`,
            values: JSON.stringify(values)
          }, () => {
            for (key in values) {
              esgst.storage[key] = values[key];
            }
            resolve();
          });
        });
      };
      getValue = async (key, value) => {
        return isSet(esgst.storage[key]) ? esgst.storage[key] : value;
      };
      getValues = values => {
        return new Promise(resolve => {
          let output = {};
          for (let key in values) {
            output[key] = isSet(esgst.storage[key]) ? esgst.storage[key] : values[key];
          }
          resolve(output);
        });
      };
      delValue = key => {
        return delValues([key]);
      };
      delValues = keys => {
        return new Promise(resolve => {
          browser.runtime.sendMessage({
            action: `delValues`,
            keys: JSON.stringify(keys)
          }, () => {
            keys.forEach(key => {
              delete esgst.storage[key];
            });
            resolve();
          });
        });
      };
      getStorage = () => {
        return new Promise(resolve => {
          browser.runtime.sendMessage({
            action: `getStorage`
          }, storage => {
            resolve(JSON.parse(storage));
          });
        });
      };
      notifyNewVersion = version => {
        let message;
        if (esgst.isNotifying) return;
        esgst.isNotifying = true;
        if (esgst.discussionPath) {
          message = `You are not using the latest ESGST version. Please update before reporting bugs and make sure the bugs still exist in the latest version.`;
        } else {
          message = `A new ESGST version is available.`;
        }
        let details = {
          icon: `fa-exclamation`,
          title: message,
          isTemp: true,
          onClose: () => {
            esgst.isNotifying = false;
            setValue(`dismissedVersion`, version);
          }
        };
        if (_USER_INFO.extension !== `firefox`) {
          details.buttons = [
            {color1: `green`, color2: `` , icon1: `fa-download`, icon2: ``, title1: `Download .zip`, title2: ``, callback1: open.bind(null, `https://github.com/revilheart/ESGST/releases/download/${version}/extension.zip`)},
            {color1: `green`, color2: `` , icon1: `fa-refresh`, icon2: ``, title1: `Reload Extension`, title2: ``, callback1: browser.runtime.sendMessage.bind(browser.runtime, {action: `reload`}, location.reload.bind(location))}
          ];
        }
        new Popup_v2(details).open();
      };
      continueRequest = details => {
        return new Promise(async resolve => {
          let isLocal = details.url.match(/^\//) || details.url.match(new RegExp(location.hostname));
          details.url = details.url.replace(/^\//, `https://${location.hostname}/`).replace(/^https?:/, location.href.match(/^http:/) ? `http:` : `https:`);
          if (isLocal) {
            let response = await fetch(details.url, {
              body: details.data,
              credentials: details.anon ? `omit` : `include`,
              headers: new Headers(details.headers),
              method: details.method,
              redirect: `follow`
            });
            let responseText = await response.text();
            response = {
              finalUrl: response.url,
              redirected: response.redirected,
              responseText: responseText
            };
            resolve(response);
            if (response.finalUrl.match(/www.steamgifts.com/)) {
              lookForPopups(response);
            }
          } else {
            browser.runtime.sendMessage({
              action: `fetch`,
              blob: details.blob,
              fileName: details.fileName,
              manipulateCookies: _USER_INFO.extension === `firefox` && esgst.manipulateCookies,
              parameters: JSON.stringify({
                body: details.data,
                credentials: details.anon ? `omit` : `include`,
                headers: details.headers,
                method: details.method,
                redirect: `follow`
              }),
              url: details.url
            }, response => {
              response = JSON.parse(response);
              resolve(response);
              if (response.finalUrl.match(/www.steamgifts.com/)) {
                lookForPopups(response);
              }
            });
          }
        });
      };
      addHeaderMenu = () => {
        if (!esgst.header) {
          return;
        }
        let arrow, button, className, context, dropdown, menu, position;
        if (esgst.sg) {
          className = `nav__left-container`;
          position = `beforeEnd`;
        } else {
          className = `nav_logo`;
          position = `afterEnd`;
        }
        context = document.getElementsByClassName(className)[0];
        menu = createElements(context, position, [{
          attributes: {
            class: `esgst-header-menu`,
            id: `esgst`,
            title: getFeatureTooltip()
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-header-menu-relative-dropdown esgst-hidden`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `esgst-header-menu-absolute-dropdown`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `esgst-header-menu-row`,
                  href: `https://github.com/revilheart/ESGST`,
                  target: `_blank`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-github grey`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `GitHub`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Visit the GitHub page.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  href: `https://github.com/revilheart/ESGST/issues`,
                  target: `_blank`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-bug red`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Bugs/Suggestions`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Report bugs and/or make suggestions.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  href: `https://github.com/revilheart/ESGST/milestones`,
                  target: `_blank`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-map-signs blue`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Milestones`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Check out what's coming in the next version.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  href: `https://www.steamgifts.com/discussion/TDyzv/`,
                  target: `_blank`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-commenting green`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Discussion`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Visit the discussion page.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  href: `http://steamcommunity.com/groups/esgst`,
                  target: `_blank`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-steam green`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Steam Group`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Visit/join the Steam group.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  id: `esgst-changelog`
                },
                type: `div`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-file-text-o yellow`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Changelog`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Check out the changelog.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  href: `https://www.patreon.com/revilheart`,
                  target: `_blank`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-dollar grey`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Patreon`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Become a patron to support ESGST!`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row esgst-version-row`
                },
                type: `div`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-paypal grey`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Paypal (rafaelxgs@gmail.com)`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Donate to support ESGST. Thank you!`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row esgst-version-row`
                },
                type: `div`,
                children: [{
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Current Version: ${esgst.devVersion}`,
                    type: `p`
                  }]
                }]
              }]
            }]
          }, {
            attributes: {
              class: `esgst-header-menu-button`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `fa`
              },
              type: `i`,
              children: [{
                attributes: {
                  src: esgst.icon
                },
                type: `img`
              }]
            }, {
              text: `ESGST`,
              type: `node`
            }]
          }, {
            attributes: {
              class: `esgst-header-menu-button arrow`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `fa fa-angle-down`
              },
              type: `i`
            }]
          }]
        }]);
        dropdown = menu.firstElementChild;
        button = dropdown.nextElementSibling;
        arrow = button.nextElementSibling;
        button.addEventListener(`mousedown`, event => {
          if (event.button === 2) return;
          event.preventDefault();
          if (esgst.openSettingsInTab || event.button === 1) {
            open(`/esgst/settings`);
          } else {
            loadMenu();
          }
        });
        arrow.addEventListener(`click`, toggleHeaderMenu.bind(null, arrow, dropdown));
        document.addEventListener(`click`, closeHeaderMenu.bind(null, arrow, dropdown, menu), true);
        document.getElementById(`esgst-changelog`).addEventListener(`click`, loadChangelog);
      };
      browser.runtime.onMessage.addListener(message => {
        let key;
        message = JSON.parse(message);
        switch (message.action) {
          case `delValues`:
            message.values.forEach(value => {
              delete esgst.storage[value];
            });
            break;
          case `setValues`:
            for (key in message.values) {
              esgst.storage[key] = message.values[key];
            }
            break;
        }
      });
    } else {
      // esgst is running as a script
      setValue = gm.setValue;
      setValues = async values => {
        let promises = [];
        for (let key in values) {
          promises.push(gm.setValue(key, values[key]));
        }
        await Promise.all(promises);
      };
      getValue = gm.getValue;
      getValues = async values => {
        let output = {};
        let promises = [];
        for (let key in values) {
          let promise = gm.getValue(key, values[key]);
          promise.then(value => {
            output[key] = value;
          });
          promises.push(promise);
        }
        await Promise.all(promises);
        return output;
      };
      delValue = gm.deleteValue;
      delValues = async keys => {
        let promises = [];
        for (let i = keys.length - 1; i > -1; i--) {
          promises.push(gm.deleteValue(keys[i]));
        }
        await Promise.all(promises);
      };
      getStorage = async () => {
        let keys = await gm.listValues();
        let promises = [];
        let storage = {};
        for (let i = keys.length - 1; i > -1; i--) {
          let promise = gm.getValue(keys[i]);
          promise.then(value => {
            storage[keys[i]] = value;
          });
          promises.push(promise);
        }
        await Promise.all(promises);
        return storage;
      };
      notifyNewVersion = version => {
        let message, popup;
        if (esgst.isNotifying) return;
        esgst.isNotifying = true;
        if (esgst.discussionPath) {
          message = `You are not using the latest ESGST version. Please update before reporting bugs and make sure the bugs still exist in the latest version.`;
        } else {
          message = `A new ESGST version is available.`;
        }
        popup = new Popup(`fa-exclamation`, message, true);
        createElements(popup.actions, `afterBegin`, [{
          text: `Update`,
          type: `span`
        }]).addEventListener(`click`, checkUpdate);
        popup.onClose = () => {
          esgst.isNotifying = false;
          setValue(`dismissedVersion`, version);
        };
        popup.open();
      };
      continueRequest = details => {
        return new Promise(async resolve => {
          let isLocal = details.url.match(/^\//) || details.url.match(new RegExp(location.hostname));
          details.url = details.url.replace(/^\//, `https://${location.hostname}/`).replace(/^https?:/, location.href.match(/^http:/) ? `http:` : `https:`);
          if (isLocal) {
            let response = await fetch(details.url, {
              body: details.data,
              credentials: details.anon ? `omit` : `include`,
              headers: details.headers,
              method: details.method,
              redirect: `follow`
            });
            let responseText = await response.text();
            response = {
              finalUrl: response.url,
              redirected: response.redirected,
              responseText: responseText
            };
            resolve(response);
            if (response.finalUrl.match(/www.steamgifts.com/)) {
              lookForPopups(response);
            }
          } else {
            gm.xmlHttpRequest({
              binary: details.fileName ? true : false,
              data: details.fileName
                ? await getZip(details.data, details.fileName, `binarystring`)
                : details.data,
              headers: details.headers,
              method: details.method,
              overrideMimeType: details.blob ? `text/plain; charset=x-user-defined` : ``,
              url: details.url,
              onload: async response => {
                if (details.blob) {
                  response.responseText = (await readZip(response.responseText))[0].value;
                }
                resolve(response);
                if (response.finalUrl.match(/www.steamgifts.com/)) {
                  lookForPopups(response);
                }
              }
            });
          }
        });
      };
      addHeaderMenu = () => {
        if (!esgst.header) {
          return;
        }
        let arrow, button, className, context, dropdown, menu, position;
        if (esgst.sg) {
          className = `nav__left-container`;
          position = `beforeEnd`;
        } else {
          className = `nav_logo`;
          position = `afterEnd`;
        }
        context = document.getElementsByClassName(className)[0];
        menu = createElements(context, position, [{
          attributes: {
            class: `esgst-header-menu`,
            id: `esgst`,
            title: getFeatureTooltip()
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-header-menu-relative-dropdown esgst-hidden`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `esgst-header-menu-absolute-dropdown`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `esgst-header-menu-row`,
                  id: `esgst-update`
                },
                type: `div`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-refresh blue`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Update`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Check for updates.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  href: `https://github.com/revilheart/ESGST`,
                  target: `_blank`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-github grey`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `GitHub`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Visit the GitHub page.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  href: `https://github.com/revilheart/ESGST/issues`,
                  target: `_blank`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-bug red`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Bugs/Suggestions`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Report bugs and/or make suggestions.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  href: `https://github.com/revilheart/ESGST/milestones`,
                  target: `_blank`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-map-signs blue`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Milestones`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Check out what's coming in the next version.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  href: `https://www.steamgifts.com/discussion/TDyzv/`,
                  target: `_blank`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-commenting green`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Discussion`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Visit the discussion page.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  href: `http://steamcommunity.com/groups/esgst`,
                  target: `_blank`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-steam green`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Steam Group`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Visit/join the Steam group.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  id: `esgst-changelog`
                },
                type: `div`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-file-text-o yellow`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Changelog`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Check out the changelog.`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row`,
                  href: `https://www.patreon.com/revilheart`,
                  target: `_blank`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-dollar grey`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Patreon`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Become a patron to support ESGST!`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row esgst-version-row`
                },
                type: `div`,
                children: [{
                  attributes: {
                    class: `fa fa-fw fa-paypal grey`
                  },
                  type: `i`
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-name`
                    },
                    text: `Paypal (rafaelxgs@gmail.com)`,
                    type: `p`
                  }, {
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Donate to support ESGST. Thank you!`,
                    type: `p`
                  }]
                }]
              }, {
                attributes: {
                  class: `esgst-header-menu-row esgst-version-row`
                },
                type: `div`,
                children: [{
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-header-menu-description`
                    },
                    text: `Current Version: ${esgst.devVersion}`,
                    type: `p`
                  }]
                }]
              }]
            }]
          }, {
            attributes: {
              class: `esgst-header-menu-button`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `fa`
              },
              type: `i`,
              children: [{
                attributes: {
                  src: esgst.icon
                },
                type: `img`
              }]
            }, {
              text: `ESGST`,
              type: `node`
            }]
          }, {
            attributes: {
              class: `esgst-header-menu-button arrow`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `fa fa-angle-down`
              },
              type: `i`
            }]
          }]
        }])
        dropdown = menu.firstElementChild;
        button = dropdown.nextElementSibling;
        arrow = button.nextElementSibling;
        button.addEventListener(`mousedown`, event => {
          if (event.button === 2) return;
          event.preventDefault();
          if (esgst.openSettingsInTab || event.button === 1) {
            open(`/esgst/settings`);
          } else {
            loadMenu();
          }
        });
        arrow.addEventListener(`click`, toggleHeaderMenu.bind(null, arrow, dropdown));
        document.addEventListener(`click`, closeHeaderMenu.bind(null, arrow, dropdown, menu), true);
        document.getElementById(`esgst-update`).addEventListener(`click`, checkUpdate);
        document.getElementById(`esgst-changelog`).addEventListener(`click`, loadChangelog);
      };
    }

    let toDelete, toSet;

    // set default values or correct values
    esgst.storage = await getStorage();
    toDelete = [];
    toSet = {};
    if (isSet(esgst.storage.users)) {
      esgst.users = JSON.parse(esgst.storage.users);
      let changed = false;
      for (let key in esgst.users.users) {
        let wbc = esgst.users.users[key].wbc;
        if (wbc && wbc.result && wbc.result !== `whitelisted` && wbc.result !== `blacklisted`) {
          delete esgst.users.users[key].wbc;
          changed = true;
        }
      }
      if (changed) {
        toSet.users = JSON.stringify(esgst.users);
      }
    } else {
      esgst.users = {
        steamIds: {},
        users: {}
      };
      toSet.users = JSON.stringify(esgst.users);
    }
    if (!isSet(esgst.storage[`${esgst.name}RfiCache`])) {
      toSet[`${esgst.name}RfiCache`] = getLocalValue(`replies`, `{}`);
      delLocalValue(`replies`);
    }
    if (isSet(esgst.storage.emojis)) {
      const fixed = fixEmojis(esgst.storage.emojis);
      if (esgst.storage.emojis !== fixed) {
        toSet.emojis = fixed;
      } else if (!esgst.storage.emojis) {
        toSet.emojis = `[]`;
      }
    } else {
      toSet.emojis = isSet(esgst.storage.Emojis) ? fixEmojis(esgst.storage.Emojis) : `[]`;
      toDelete.push(`Emojis`);
    }
    if (esgst.sg) {
      if (!isSet(esgst.storage.templates)) {
        toSet.templates = getLocalValue(`templates`, `[]`);
        delLocalValue(`templates`);
      }
      if (!isSet(esgst.storage.stickiedCountries)) {
        toSet.stickiedCountries = getLocalValue(`stickiedCountries`, `[]`);
        delLocalValue(`stickiedCountries`);
      }
      if (isSet(esgst.storage.giveaways)) {
        esgst.giveaways = JSON.parse(esgst.storage.giveaways);
      } else {
        toSet.giveaways = getLocalValue(`giveaways`, `{}`);
        esgst.giveaways = JSON.parse(toSet.giveaways);
        delLocalValue(`giveaways`);
      }
      if (isSet(esgst.storage.decryptedGiveaways)) {
        esgst.decryptedGiveaways = esgst.storage.decryptedGiveaways;
        if (typeof esgst.decryptedGiveaways === `string`) {
          esgst.decryptedGiveaways = JSON.parse(esgst.decryptedGiveaways);
        } else {
          toSet.decryptedGiveaways = JSON.stringify(esgst.decryptedGiveaways);
        }
      } else {
        toSet.decryptedGiveaways = `{}`;
        esgst.decryptedGiveaways = {};
      }
      if (isSet(esgst.storage.discussions)) {
        esgst.discussions = JSON.parse(esgst.storage.discussions);
      } else {
        toSet.discussions = getLocalValue(`discussions`, `{}`);
        esgst.discussions = JSON.parse(toSet.discussions);
        delLocalValue(`discussions`);
      }
      if (isSet(esgst.storage.tickets)) {
        esgst.tickets = JSON.parse(esgst.storage.tickets);
      } else {
        toSet.tickets = getLocalValue(`tickets`, `{}`);
        esgst.tickets = JSON.parse(toSet.tickets);
        delLocalValue(`tickets`);
      }
      delLocalValue(`gFix`);
      delLocalValue(`dFix`);
      delLocalValue(`tFix`);
      if (isSet(esgst.storage.groups)) {
        esgst.groups = JSON.parse(esgst.storage.groups);
      } else {
        toSet.groups = getLocalValue(`groups`, `[]`);
        esgst.groups = JSON.parse(toSet.groups);
        delLocalValue(`groups`);
      }
      if (!isSet(esgst.storage.entries)) {
        toSet.entries = getLocalValue(`entries`, `[]`);
        delLocalValue(`entries`);
      }
      if (isSet(esgst.storage.rerolls)) {
        esgst.rerolls = JSON.parse(esgst.storage.rerolls);
      } else {
        toSet.rerolls = getLocalValue(`rerolls`, `[]`);
        esgst.rerolls = JSON.parse(toSet.rerolls);
        delLocalValue(`rerolls`);
      }
      if (isSet(esgst.storage.winners)) {
        esgst.winners = JSON.parse(esgst.storage.winners);
      } else {
        toSet.winners = getLocalValue(`winners`, `{}`);
        esgst.winners = JSON.parse(toSet.winners);
        delLocalValue(`winners`);
      }
    } else {
      if (isSet(esgst.storage.trades)) {
        esgst.trades = JSON.parse(esgst.storage.trades);
      } else {
        toSet.trades = getLocalValue(`trades`, `{}`);
        esgst.trades = JSON.parse(toSet.trades);
        delLocalValue(`trades`);
      }
      delLocalValue(`tFix`);
    }
    let cache = JSON.parse(getLocalValue(`gdtttCache`, `{"giveaways":[],"discussions":[],"tickets":[],"trades":[]}`));
    for (let type in cache) {
      let doSet = false;
      cache[type].forEach(code => {
        if (!esgst[type][code]) {
          esgst[type][code] = {
            readComments: {}
          };
        }
        if (!esgst[type][code].visited) {
          doSet = true;
          esgst[type][code].visited = true;
        }
      });
      if (doSet) {
        toSet[type] = JSON.stringify(esgst[type]);
      }
    }
    setLocalValue(`gdtttCache`, `{"giveaways":[],"discussions":[],"tickets":[],"trades":[]}`);
    if (isSet(esgst.storage.games)) {
      esgst.games = JSON.parse(esgst.storage.games);
    } else {
      esgst.games = {
        apps: {},
        subs: {}
      };
      toSet.games = JSON.stringify(esgst.games);
    }
    if (isSet(esgst.storage.settings)) {
      esgst.settings = JSON.parse(esgst.storage.settings);
    } else {
      esgst.settings = {};
    }
    esgst.version = esgst.storage.version;
    for (let key in esgst.settings) {
      let match = key.match(new RegExp(`(.+?)_${esgst.name}$`));
      if (match) {
        esgst[match[1]] = esgst.settings[key];
      }
    }
    for (let key in esgst.oldValues) {
      let localKey = key.replace(new RegExp(`(.+?)_${esgst.name}$`), `$1`);
      if (typeof esgst[localKey] === `undefined`) {
        esgst[localKey] = getSetting(key, key.match(/^(wbc_checkBlacklist|wbc_hb_sg)$/));
      }
    }
    for (let key in esgst.defaultValues) {
      let localKey = key.replace(new RegExp(`(.+?)_${esgst.name}$`), `$1`);
      if (typeof esgst[localKey] === `undefined`) {
        esgst[localKey] = getSetting(key, key.match(/^(wbc_checkBlacklist|wbc_hb_sg)$/));
      }
    }
    if (isSet(esgst.storage.filterPresets)) {
      esgst.gf_presets = esgst.gf_presets.concat(
        filters_convert(JSON.parse(esgst.storage.filterPresets))
      );
      esgst.settings.gf_presets = esgst.gf_presets;
      esgst.settingsChanged = true;
      toSet.old_gf_presets = esgst.storage.filterPresets;
      toDelete.push(`filterPresets`);
    }
    if (isSet(esgst.storage.dfPresets)) {
      esgst.df_presets = esgst.df_presets.concat(
        filters_convert(JSON.parse(esgst.storage.dfPresets))
      );
      esgst.settings.df_presets = esgst.df_presets;
      esgst.settingsChanged = true;
      toSet.old_df_presets = esgst.storage.dfPresets;
      toDelete.push(`dfPresets`);
    }

    esgst.features = getFeatures();
    for (let type in esgst.features) {
      for (let id in esgst.features[type].features) {
        getFeatureSetting(esgst.features[type].features[id], id);
      }
    }

    [
      {id: `cec`, side: `left`},
      {id: `esContinuous`, side: `right`},
      {id: `esNext`, side: `right`},
      {id: `glwc`, side: `left`},
      {id: `mm`, side: `right`},
      {id: `stbb`, side: `right`},
      {id: `sttb`, side: `right`},
      {id: `ust`, side: `left`},
      {id: `wbm`, side: `left`}
    ].forEach(item => {
      if (esgst.leftButtonIds.indexOf(item.id) < 0 && esgst.rightButtonIds.indexOf(item.id) < 0) {
        esgst[`${item.side}ButtonIds`].push(item.id);
        esgst.settings.leftButtonIds = esgst.leftButtonIds;
        esgst.settings.rightButtonIds = esgst.rightButtonIds;
        esgst.settingsChanged = true;
      }
    });
    if (esgst.settings.users) {
      delete esgst.settings.users;
      esgst.settingsChanged = true;
    }
    if (esgst.settings.comments) {
      delete esgst.settings.comments;
      esgst.settingsChanged = true;
    }
    if (esgst.settings.giveaways) {
      delete esgst.settings.giveaways;
      esgst.settingsChanged = true;
    }
    if (esgst.settings.groups) {
      delete esgst.settings.groups;
      esgst.settingsChanged = true;
    }
    if (esgst.gc_categories.indexOf(`gc_rd`) < 0) {
      esgst.gc_categories.push(`gc_rd`);
      esgst.settings.gc_categories = esgst.gc_categories;
      esgst.settingsChanged = true;
    }
    if (esgst.gc_categories.indexOf(`gc_pw`) < 0) {
      esgst.gc_categories.push(`gc_pw`);
      esgst.settings.gc_categories = esgst.gc_categories;
      esgst.settingsChanged = true;
    }
    if (esgst.gc_categories_gv.indexOf(`gc_pw`) < 0) {
      esgst.gc_categories_gv.push(`gc_pw`);
      esgst.settings.gc_categories_gv = esgst.gc_categories_gv;
      esgst.settingsChanged = true;
    }
    if (esgst.gc_categories.indexOf(`gc_hltb`) < 0) {
      esgst.gc_categories.push(`gc_hltb`);
      esgst.settings.gc_categories = esgst.gc_categories;
      esgst.settingsChanged = true;
    }
    if (esgst.gc_categories_gv.indexOf(`gc_hltb`) < 0) {
      esgst.gc_categories_gv.push(`gc_hltb`);
      esgst.settings.gc_categories_gv = esgst.gc_categories_gv;
      esgst.settingsChanged = true;
    }
    if (esgst.gc_categories.indexOf(`gc_sp`) < 0) {
      esgst.gc_categories.push(`gc_sp`);
      esgst.settings.gc_categories = esgst.gc_categories;
      esgst.settingsChanged = true;
    }
    if (esgst.gc_categories_gv.indexOf(`gc_sp`) < 0) {
      esgst.gc_categories_gv.push(`gc_sp`);
      esgst.settings.gc_categories_gv = esgst.gc_categories_gv;
      esgst.settingsChanged = true;
    }
    if (esgst.gc_categories.indexOf(`gc_lg`) < 0) {
      esgst.gc_categories.push(`gc_lg`);
      esgst.settings.gc_categories = esgst.gc_categories;
      esgst.settingsChanged = true;
    }
    if (esgst.gc_categories_gv.indexOf(`gc_lg`) < 0) {
      esgst.gc_categories_gv.push(`gc_lg`);
      esgst.settings.gc_categories_gv = esgst.gc_categories_gv;
      esgst.settingsChanged = true;
    }
    [`gc_categories`, `gc_categories_gv`].forEach(key => {
      let bkpLength = esgst[key].length;
      esgst[key] = Array.from(new Set(esgst[key]));
      if (bkpLength !== esgst[key].length) {
        esgst.settings[key] = esgst[key];
        esgst.settingsChanged = true;
      }
    });
    [``, `_gv`].forEach(key => {
      if (esgst[`giveawayColumns${key}`].indexOf(`sgTools`) < 0 && esgst[`giveawayPanel${key}`].indexOf(`sgTools`) < 0) {
        if (key === ``) {
          esgst[`giveawayPanel${key}`].push(`sgTools`);
          esgst.settings[`giveawayPanel${key}`] = esgst[`giveawayPanel${key}`];
        } else {
          esgst[`giveawayColumns${key}`].unshift(`sgTools`);
          esgst.settings[`giveawayColumns${key}`] = esgst[`giveawayColumns${key}`];
        }
        esgst.settingsChanged = true;
      }
      if (esgst[`giveawayColumns${key}`].indexOf(`ged`) < 0 && esgst[`giveawayPanel${key}`].indexOf(`ged`) < 0) {
        esgst[`giveawayColumns${key}`].unshift(`ged`);
        esgst.settings[`giveawayColumns${key}`] = esgst[`giveawayColumns${key}`];
        esgst.settingsChanged = true;
      }
      if (esgst[`giveawayColumns${key}`].indexOf(`touhou`) < 0 && esgst[`giveawayPanel${key}`].indexOf(`touhou`) < 0) {
        esgst[`giveawayColumns${key}`].push(`touhou`);
        esgst.settings[`giveawayColumns${key}`] = esgst[`giveawayColumns${key}`];
        esgst.settingsChanged = true;
      }
      if (esgst[`giveawayColumns${key}`].indexOf(`gptw`) < 0 && esgst[`giveawayPanel${key}`].indexOf(`gptw`) < 0) {
        esgst[`giveawayPanel${key}`].push(`gptw`);
        esgst.settings[`giveawayPanel${key}`] = esgst[`giveawayPanel${key}`];
        esgst.settingsChanged = true;
      }
      for (let i = esgst[`giveawayColumns${key}`].length - 1; i > -1; i--) {
        let id = esgst[`giveawayColumns${key}`][i];
        if (esgst[`giveawayPanel${key}`].indexOf(id) > -1) {
          esgst[`giveawayColumns${key}`].splice(i, 1);
          esgst.settings[`giveawayColumns${key}`] = esgst[`giveawayColumns${key}`];
          esgst.settingsChanged = true;
        }
      }
      for (let i = esgst[`giveawayPanel${key}`].length - 1; i > -1; i--) {
        let id = esgst[`giveawayPanel${key}`][i];
        if (esgst[`giveawayColumns${key}`].indexOf(id) > -1) {
          esgst[`giveawayPanel${key}`].splice(i, 1);
          esgst.settings[`giveawayPanel${key}`] = esgst[`giveawayPanel${key}`];
          esgst.settingsChanged = true;
        }
      }
    });
    if (document.readyState === `loading`) {
      document.addEventListener(`DOMContentLoaded`, load.bind(null, toDelete, toSet));
    } else {
      load(toDelete, toSet);
    }
  }

  async function load(toDelete, toSet) {
    if (esgst.menuPath) {
      createElements(document.head, `beforeEnd`, [{
        attributes :{
          href: `https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css`,
          rel: `stylesheet`
        },
        type: `link`
      }, {
        attributes: {
          href: _USER_INFO.extension ? browser.runtime.getURL(`css/steamgifts-v34.min.css`) : await gm.getResourceUrl(`sg`),
          rel: `stylesheet`
        },
        type: `link`
      }]);
      const element = document.querySelector(`[href*="https://cdn.steamgifts.com/css/static.css"]`);
      if (element) {
        element.remove();
      }
      document.body.innerHTML = ``;
    }
    addStyle();
    if (esgst.sg) {
      try {
        let avatar = document.getElementsByClassName(`nav__avatar-inner-wrap`)[0].style.backgroundImage.match(/\("(.+)"\)/)[1];
        if (esgst.settings.avatar !== avatar) {
          esgst.avatar = esgst.settings.avatar = avatar;
          esgst.settingsChanged = true;
        }
        let username = document.getElementsByClassName(`nav__avatar-outer-wrap`)[0].href.match(/\/user\/(.+)/)[1];
        if (esgst.settings.username_sg !== username) {
          esgst.username = esgst.settings.username_sg = username;
          esgst.settingsChanged = true;
        }
        if (!esgst.settings.registrationDate_sg || !esgst.settings.steamId) {
          let responseHtml = parseHtml((await request({method: `GET`, url: `https://www.steamgifts.com/user/${esgst.settings.username_sg}`})).responseText);
          let elements = responseHtml.getElementsByClassName(`featured__table__row__left`);
          for (let i = 0, n = elements.length; i < n; i++) {
            let element = elements[i];
            if (element.textContent === `Registered`) {
              esgst.registrationDate = esgst.settings.registrationDate_sg = parseInt(element.nextElementSibling.firstElementChild.getAttribute(`data-timestamp`));
              break;
            }
          }
          esgst.steamId = esgst.settings.steamId = responseHtml.querySelector(`a[href*="/profiles/"]`).getAttribute(`href`).match(/\d+/)[0];
          esgst.settingsChanged = true;
        }
      } catch (e) { /**/ }
    } else {
      try {
        let avatar = document.getElementsByClassName(`nav_avatar`)[0].style.backgroundImage.match(/\("(.+)"\)/)[1];
        if (esgst.settings.avatar !== avatar) {
          esgst.avatar = esgst.settings.avatar = avatar;
          esgst.settingsChanged = true;
        }
        let username = document.querySelector(`.author_name[href*="/user/${esgst.settings.steamId}"], .underline[href*="/user/${esgst.settings.steamId}"]`).textContent;
        if (esgst.settings.username_st !== username) {
          esgst.username = esgst.settings.username_st = username;
          esgst.settingsChanged = true;
        }
      } catch (e) { /**/ }
    }
    if (esgst.settingsChanged) {
      toSet.settings = JSON.stringify(esgst.settings);
    }
    if (Object.keys(toSet).length) {
      await setValues(toSet);
    }
    if (Object.keys(toDelete).length) {
      await delValues(toDelete);
    }

    // now that all values are set esgst can begin to load

    /* [URLR] URL Redirector */
    if (esgst.urlr && location.pathname.match(/^\/(giveaway|discussion|support\/ticket|trade)\/.{5}$/)) {
      location.href = `${location.href}/`;
    }

    if (location.pathname.match(/esgst-settings/)) {
      location.href = `/esgst/settings`;
    } else if (location.pathname.match(/esgst-sync/)) {
      location.href = `/esgst/sync`;
    } else if (location.pathname.match(/^\/esgst\/dropbox/)) {
      await setValue(`dropboxToken`, location.hash.match(/access_token=(.+?)&/)[1]);
      close();
    } else if (location.pathname.match(/^\/esgst\/google-drive/)) {
      await setValue(`googleDriveToken`, location.hash.match(/access_token=(.+?)&/)[1]);
      close();
    } else if (location.pathname.match(/^\/esgst\/onedrive/)) {
      await setValue(`oneDriveToken`, location.hash.match(/access_token=(.+?)&/)[1]);
      close();
    } else if (location.pathname.match(/^\/esgst\/imgur/)) {
      await setValue(`imgurToken`, location.hash.match(/access_token=(.+?)&/)[1]);
      close();
    } else {
      esgst.logoutButton = document.querySelector(`.js__logout, .js_logout`);
      console.log(esgst.logoutButton);
      if (!esgst.logoutButton && !esgst.menuPath) {
        // user is not logged in
        return;
      }
      if (esgst.st && !esgst.settings.esgst_st) {
        // esgst is not enabled for steamtrades
        return;
      }
      esgst.lastPage = lpl_getLastPage(document, true);
      await getElements();
      if (esgst.sg && !esgst.menuPath) {
        checkSync();
      }
      if (esgst.autoBackup) {
        checkBackup();
      }
      if (esgst.profilePath && esgst.autoSync) {
        document.getElementsByClassName(`form__sync-default`)[0].addEventListener(`click`, setSync.bind(null, true, null, null));
      }
      if (esgst.menuPath) {
        esgst.favicon.href = esgst.icon;
        if (esgst.actionPage) {
          createElements(document.body, `inner`, [{
            attributes: {
              class: `page__outer-wrap`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `page__inner-wrap`
              },
              type: `div`
            }]
          }]);
          esgst.pageOuterWrap = document.body.firstElementChild;
          esgst.pageOuterWrap.style.width = `calc(100% - ${innerWidth-document.documentElement.offsetWidth}px)`;
          esgst.mainContext = esgst.pageOuterWrap.lastElementChild;
        } else {
          let response = await request({method: `GET`, url: esgst.sg ? `https://www.steamgifts.com/` : `https://www.steamtrades.com`});
          let responseHtml = parseHtml(response.responseText);
          createElements(document.body, `inner`, [{
            context: responseHtml.getElementsByTagName(`header`)[0]
          }, {
            attributes: {
              class: `page__outer-wrap`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `page__inner-wrap`
              },
              type: `div`
            }]
          }, {
            context: responseHtml.getElementsByClassName(`footer__outer-wrap`)[0]
          }]);
          esgst.header = document.body.firstElementChild;
          esgst.footer = document.body.lastElementChild;
          esgst.headerNavigationLeft = document.getElementsByClassName(`nav__left-container`)[0];
          esgst.pageOuterWrap = esgst.header.nextElementSibling;
          esgst.mainContext = esgst.pageOuterWrap.lastElementChild;
          esgst.logoutButton = responseHtml.getElementsByClassName(esgst.sg ? `js__logout` : `js_logout`)[0];
          if (esgst.logoutButton) {
            esgst.xsrfToken = esgst.logoutButton.getAttribute(`data-form`).match(/xsrf_token=(.+)/)[1];
          }
          await hr_refreshHeaderElements(document);
        }
        
        if (esgst.settingsPath) {
          document.title = `ESGST - Settings`;
          loadMenu(true);
        } else if (esgst.importMenuPath) {
          document.title = `ESGST - Restore`;
          loadDataManagement(true, `import`);
        } else if (esgst.exportMenuPath) {
          document.title = `ESGST - Backup`;
          loadDataManagement(true, `export`);
        } else if (esgst.deleteMenuPath) {
          document.title = `ESGST - Delete`;
          loadDataManagement(true, `delete`);
        } else if (esgst.gbPath) {
          document.title = `ESGST - Giveaway Bookmarks`;
          esgst.originalTitle = `ESGST - Giveaway Bookmarks`;
        } else if (esgst.gedPath) {
          document.title = `ESGST - Decrypted Giveaways`;
          esgst.originalTitle = `ESGST - Decrypted Giveaways`;
        } else if (esgst.gePath) {
          document.title = `ESGST - Extracted Giveaways`;
          esgst.originalTitle = `ESGST - Extracted Giveaways`;
        } else if (esgst.glwcPath) {
          document.title = `ESGST - Group Library/Wishlist Checker`;
          esgst.originalTitle = `ESGST - Group Library/Wishlist Checker`;
        } else  if (location.pathname.match(/esgst\/sync/)) {
          await setSync();
        }

        // make the header dropdown menus work
        let elements = document.querySelectorAll(`nav .nav__button--is-dropdown-arrow`);
        for (let element of elements) {
          element.addEventListener(`click`, event => {
            let isSelected = element.classList.contains(`is-selected`);
            let buttons = document.querySelectorAll(`nav .nav__button`);
            for (let button of buttons) {
              button.classList.remove(`is-selected`);
            }
            let dropdowns = document.querySelectorAll(`nav .nav__relative-dropdown`);
            for (let dropdown of dropdowns) {
              dropdown.classList.add(`is-hidden`);
            }
            if (!isSelected) {
              element.classList.add(`is-selected`);
              (element.previousElementSibling.previousElementSibling || element.nextElementSibling).classList.remove(`is-hidden`);
            }
            event.stopPropagation();
          });
        }
        document.addEventListener(`click`, () => {
          let buttons = document.querySelectorAll(`nav .nav__button, .page__heading__button--is-dropdown`);
          for (let button of buttons) {
            button.classList.remove(`is-selected`);
          }
          let dropdowns = document.querySelectorAll(`nav .nav__relative-dropdown`);
          for (let dropdown of dropdowns) {
            dropdown.classList.add(`is-hidden`);
          }
        });
      }

      addHeaderMenu();
      showPatreonNotice();
      checkNewVersion();
      loadFeatures();
    }
  }

  function minimizePanel_add() {
    if (!esgst.pageOuterWrap) {
      return;
    }

    esgst.minimizePanel = createElements(esgst.pageOuterWrap, `beforeEnd`, [{
      attributes: {
        class: `esgst-minimize-panel`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-minimize-container markdown`
        },
        type: `div`,
        children: [{
          text: `Minimized Popups:`,
          type: `h3`
        }, {
          type: `hr`
        }, {
          attributes: {
            class: `esgst-minimize-list`
          },
          type: `ul`
        }]
      }]
    }]);
    esgst.minimizeList = esgst.minimizePanel.firstElementChild.lastElementChild;
  }

  function minimizePanel_addItem(popup) {
    if (!esgst.minimizeList) {
      return;
    }

    popup.minimizeItem = createElements(esgst.minimizeList, `beforeEnd`, [{
      attributes: {
        class: `esgst-minimize-item`
      },
      type: `li`,
      children: [{
        attributes: {
          href: `javascript:void(0);`
        },
        text: popup.title.textContent.replace(/:$/, ``),
        type: `a`
      }]
    }]);
    popup.minimizeLink = popup.minimizeItem.firstElementChild;
    popup.minimizeItem.addEventListener(`click`, minimizePanel_openItem.bind(null, popup));
  }

  function minimizePanel_openItem(popup) {
    popup.open();
    popup.minimizeItem.remove();
    popup.minimizeItem = null;
    if (!esgst.minimizePanel.getElementsByClassName(`alert`).length) {
      esgst.minimizePanel.classList.remove(`alert`);
    }
  }

  function minimizePanel_alert(popup) {
    if (popup.minimizeItem) {
      popup.minimizeItem.classList.add(`alert`);
    }
    if (esgst.minimizePanel) {
      esgst.minimizePanel.classList.add(`alert`);
    }
  }

  async function loadFeatures() {
    if (esgst.minimizePanel) {
      minimizePanel_add();
    }

    let hiddenButtonsBefore, hiddenButtonsAfter;
    if (esgst.hideButtons) {
      hiddenButtonsBefore = document.createElement(`div`);
      hiddenButtonsBefore.className = `esgst-heading-button`;
      hiddenButtonsBefore.title = getFeatureTooltip(`hideButtons`);
      createElements(hiddenButtonsBefore, `inner`, [{
        attributes: {
          class: `fa fa-ellipsis-v`
        },
        type: `i`
      }]);
      esgst.leftButtons = createElements(new Popout(`esgst-hidden-buttons`, hiddenButtonsBefore, 0, true).popout, `beforeEnd`, [{
        attributes: {
          class: `esgst-page-heading`
        },
        type: `div`
      }]);
      hiddenButtonsAfter = document.createElement(`div`);
      hiddenButtonsAfter.className = `esgst-heading-button`;
      hiddenButtonsAfter.title = getFeatureTooltip(`hideButtons`);
      createElements(hiddenButtonsAfter, `inner`, [{
        attributes: {
          class: `fa fa-ellipsis-v`
        },
        type: `i`
      }]);
      esgst.rightButtons = createElements(new Popout(`esgst-hidden-buttons`, hiddenButtonsAfter, 0, true).popout, `beforeEnd`, [{
        attributes: {
          class: `esgst-page-heading`
        },
        type: `div`
      }]);
    }

    for (const modd of _MODULES) {
      if ((!modd.endless && !esgst[modd.id]) || !modd.load) {
        continue;
      }
      try {
        await modd.load();
      } catch (e) {
        console.log(e);
      }
    }

    if (esgst.updateHiddenGames) {
      const hideButton = document.getElementsByClassName(`js__submit-hide-games`)[0];
      if (hideButton) {
        hideButton.addEventListener(`click`, () => updateHiddenGames(esgst.hidingGame.id, esgst.hidingGame.type, false));
      }
    }
  
    observeStickyChanges(document.body);

    if (esgst.newGiveawayPath) {
      // when the user searches for a game in the new giveaway page, wait until the results appear and load the game features for them
      let rows = document.getElementsByClassName(`form__rows`)[0];
      if (rows) {
        setTimeout(() => checkNewGiveawayInput(document.getElementsByClassName(`js__autocomplete-data`)[0]), 1000);
      }
    }

    if (esgst.hideButtons && esgst.mainPageHeading) {
      if (!esgst.leftButtons.querySelector(`.esgst-heading-button:not(.esgst-hidden)`)) {
        hiddenButtonsBefore.classList.add(`esgst-hidden`);
      }
      if (!esgst.rightButtons.querySelector(`.esgst-heading-button:not(.esgst-hidden)`)) {
        hiddenButtonsAfter.classList.add(`esgst-hidden`);
      }
      esgst.mainPageHeading.insertBefore(hiddenButtonsBefore, esgst.mainPageHeading.firstElementChild);
      esgst.mainPageHeading.appendChild(hiddenButtonsAfter);
    }
    reorderButtons(hiddenButtonsBefore, esgst.leftButtons, hiddenButtonsAfter, esgst.rightButtons);
    if (document.readyState === `complete`) {
      goToComment(esgst.originalHash);
    } else {
      document.addEventListener(`readystatechange`, goToComment.bind(null, esgst.originalHash, null, false));
    }
    addEventListener(`beforeunload`, checkBusy);
    addEventListener(`hashchange`, goToComment.bind(null, null, null, false));
    if (!esgst.staticPopups) {
      setTimeout(() => repositionPopups(), 2000);
    }

    for (const key in esgst.documentEvents) {
      document.addEventListener(key, processEvent.bind(null, esgst.documentEvents[key]), true);
    }
  }

  function processEvent(functions, event) {
    for (const fun of functions) {
      fun(event);
    }
  }

  async function getElements() {
    if (esgst.sg) {
      esgst.pageOuterWrapClass = `page__outer-wrap`;
      esgst.pageHeadingClass = `page__heading`;
      esgst.pageHeadingBreadcrumbsClass = `page__heading__breadcrumbs`;
      esgst.footer = document.getElementsByClassName(`footer__outer-wrap`)[0];
      esgst.replyBox = document.getElementsByClassName(`comment--submit`)[0];
      esgst.cancelButtonClass = `comment__cancel-button`;
      esgst.paginationNavigationClass = `pagination__navigation`;
      esgst.hiddenClass = `is-hidden`;
      esgst.selectedClass = `is-selected`;
    } else {
      esgst.pageOuterWrapClass = `page_outer_wrap`;
      esgst.pageHeadingClass = `page_heading`;
      esgst.pageHeadingBreadcrumbsClass = `page_heading_breadcrumbs`;
      esgst.footer = document.getElementsByTagName(`footer`)[0];
      esgst.replyBox = document.getElementsByClassName(`reply_form`)[0];
      esgst.cancelButtonClass = `btn_cancel`;
      esgst.paginationNavigationClass = `pagination_navigation`;
      esgst.hiddenClass = `is_hidden`;
      esgst.selectedClass = `is_selected`;
    }
    esgst.currentPage = location.href.match(/page=(\d+)/);
    if (esgst.currentPage) {
      esgst.currentPage = parseInt(esgst.currentPage[1]);
    } else {
      esgst.currentPage = 1;
    }
    let url = location.href.replace(location.search, ``).replace(location.hash, ``).replace(`/search`, ``);
    esgst.originalUrl = url;
    esgst.favicon = document.querySelector(`[rel="shortcut icon"]`);
    esgst.originalTitle = document.title;
    if (esgst.mainPath) {
      url += esgst.sg ? `giveaways` : `trades`;
    }
    url += `/search?`;
    let parameters = location.search.replace(/^\?/, ``).split(/&/);
    for (let i = 0, n = parameters.length; i < n; ++i) {
      if (parameters[i] && !parameters[i].match(/page/)) {
        url += parameters[i] + `&`;
      }
    }
    if (location.search) {
      esgst.originalUrl = url.replace(/&$/, ``);
      if (esgst.currentPage > 1) {
        esgst.originalUrl += `&page=${esgst.currentPage}`;
      }
    }
    url += `page=`;
    esgst.searchUrl = url;
    if (!esgst.menuPath) {
      await hr_refreshHeaderElements(document);
    }
    esgst.header = document.getElementsByTagName(`header`)[0];
    esgst.headerNavigationLeft = document.getElementsByClassName(`nav__left-container`)[0];
    esgst.pagination = document.getElementsByClassName(`pagination`)[0];
    esgst.featuredContainer = document.getElementsByClassName(`featured__container`)[0];
    esgst.pageOuterWrap = document.getElementsByClassName(esgst.pageOuterWrapClass)[0];
    esgst.paginationNavigation = document.getElementsByClassName(esgst.paginationNavigationClass)[0];
    esgst.sidebar = document.getElementsByClassName(`sidebar`)[0];
    if (esgst.sidebar) {
      esgst.enterGiveawayButton = esgst.sidebar.getElementsByClassName(`sidebar__entry-insert`)[0];
      esgst.leaveGiveawayButton = esgst.sidebar.getElementsByClassName(`sidebar__entry-delete`)[0];
    }
    esgst.activeDiscussions = document.querySelector(`.widget-container--margin-top:last-of-type`);
    esgst.pinnedGiveaways = document.getElementsByClassName(`pinned-giveaways__outer-wrap`)[0];
    let mainPageHeadingIndex;
    if (esgst.commentsPath) {
      mainPageHeadingIndex = 1;
    } else {
      mainPageHeadingIndex = 0;
    }
    esgst.mainPageHeading = document.getElementsByClassName(esgst.pageHeadingClass)[mainPageHeadingIndex];
    if (!esgst.mainPageHeading && mainPageHeadingIndex === 1) {
      esgst.mainPageHeading = document.getElementsByClassName(esgst.pageHeadingClass)[0];
    }
    if (esgst.logoutButton) {
      esgst.xsrfToken = esgst.logoutButton.getAttribute(`data-form`).match(/xsrf_token=(.+)/)[1];
      console.log(esgst.xsrfToken);
    }
  }

  // [MODULES]

  async function checkNewGiveawayInput(context) {
    if (context.style.opacity === `1`) {
      if (!context.getAttribute(`data-esgst`)) {
        context.setAttribute(`data-esgst`, true);
        await loadNewGiveawayFeatures(context);
      }
    } else {
      context.removeAttribute(`data-esgst`);
    }
    setTimeout(() => checkNewGiveawayInput(context), 1000);
  }

  async function loadNewGiveawayFeatures(context) {
    // check if there are no cv games in the results and if they are already in the database
    let found = false;
    let games = {
      apps: {},
      subs: {}
    };
    let elements = context.getElementsByClassName(`table__row-outer-wrap`);
    for (let i = 0, n = elements.length; i < n; i++) {
      let element = elements[i];
      let date = element.querySelector(`[data-ui-tooltip*="Zero contributor value since..."]`);
      if (!date) continue;
      let info = games_getInfo(element);
      if (!info || (esgst.games[info.type][info.id] && esgst.games[info.type][info.id].noCV)) continue;
      date = JSON.parse(date.getAttribute(`data-ui-tooltip`)).rows;
      games[info.type][info.id] = {
        name: element.getElementsByClassName(`table__column__heading`)[0].firstChild.textContent.trim(),
        noCV: date[date.length - 1].columns[1].name
      };
      found = true;
    }
    if (esgst.noCvButton) {
      esgst.noCvButton.remove();
    }
    if (found) {
      esgst.noCvButton = createElements(context.closest(`.form__row__indent`).previousElementSibling, `beforeEnd`, [{
        attributes: {
          class: `esgst-no-cv-button`
        },
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-calendar-times-o esgst-blinking esgst-bold esgst-clickable esgst-red`,
            title: getFeatureTooltip(null, `Add no CV games to the database`)
          },
          type: `i`
        }]
      }]);
      if (esgst.addNoCvGames) {
        addNoCvGames(games);
      } else {
        esgst.noCvButton.firstElementChild.addEventListener(`click`, addNoCvGames.bind(null, games));
      }
    }

    await games_load(document, true);
  }

  async function addNoCvGames(games) {
    let button = esgst.noCvButton;
    esgst.noCvButton = null;
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`,
        title: `Adding no CV games to the database...`
      },
      type: `i`
    }]);
    await request({data: JSON.stringify(games), method: `POST`, url: `https://script.google.com/macros/s/AKfycbym0nzeyr3_b93ViuiZRivkBMl9PBI2dTHQxNC0rtgeQSlCTI-P/exec`});
    for (let id in games.apps) {
      delete games.apps[id].name;
    }
    for (let id in games.subs) {
      delete games.subs[id].name;
    }
    await lockAndSaveGames(games);
    button.remove();
  }

  async function endless_load(context, main, source, endless, mainEndless) {
    if (!mainEndless) {
      esgst.edited = {};
      let values = await getValues({
        discussions: `{}`,
        games: `{"apps":{},"subs":{}}`,
        giveaways: `{}`,
        tickets: `{}`,
        trades: `{}`,
        users: `{"steamIds":{},"users":{}}`
      });
      esgst.discussions = JSON.parse(values.discussions);
      esgst.games = JSON.parse(values.games);
      esgst.giveaways = JSON.parse(values.giveaways);
      esgst.tickets = JSON.parse(values.tickets);
      esgst.trades = JSON.parse(values.trades);
      esgst.users = JSON.parse(values.users);
    }

    for (let feature of esgst.endlessFeatures) {
      try {
        await feature(context, main, source, endless, mainEndless);
      } catch(e) {
        console.log(e);
      }
    }

    if (!mainEndless) {
      const newValues = {};
      for (const key in esgst.edited) {
        newValues[key] = JSON.stringify(esgst[key]);
      }
      if (Object.keys(newValues).length) {
        setValues(newValues);
      }
    }
  }

  // Helper

  async function saveComment(tradeCode, parentId, description, url, status, callback, mainCallback) {
    let data = `xsrf_token=${esgst.xsrfToken}&do=${esgst.sg ? `comment_new` : `comment_insert`}&trade_code=${tradeCode}&parent_id=${parentId}&description=${encodeURIComponent(description)}`;
    let response = await request({data: data, method: `POST`, url: url});
    if (esgst.sg) {
      if (response.redirected && url === response.finalUrl) {
        let id;
        let responseHtml = parseHtml(response.responseText);
        if (parentId) {
          id = responseHtml.querySelector(`[data-comment-id="${parentId}"]`).getElementsByClassName(`comment__children`)[0].lastElementChild.getElementsByClassName(`comment__summary`)[0].id;
        } else {
          let elements = responseHtml.getElementsByClassName(`comments`);
          id = elements[elements.length - 1].lastElementChild.getElementsByClassName(`comment__summary`)[0].id;
        }
        if (esgst.ch) {
          ch_saveComment(id, Date.now());
        }
        if (mainCallback) {
          if (callback) {
            callback();
          }
          mainCallback(id, response, status);
        } else {
          await ged_saveGiveaways(responseHtml.getElementById(id).closest(`.comment`), id);
          if (callback) {
            callback();
          }
          location.href = `/go/comment/${id}`;
        }
      } else if (url !== response.finalUrl) {
        response = await request({data: data, method: `POST`, url: response.finalUrl});
        let id;
        let responseHtml = parseHtml(response.responseText);
        if (parentId) {
          id = responseHtml.querySelector(`[data-comment-id="${parentId}"]`).getElementsByClassName(`comment__children`)[0].lastElementChild.getElementsByClassName(`comment__summary`)[0].id;
        } else {
          let elements = responseHtml.getElementsByClassName(`comments`);
          id = elements[elements.length - 1].lastElementChild.getElementsByClassName(`comment__summary`)[0].id;
        }
        if (esgst.ch) {
          ch_saveComment(id, Date.now());
        }
        if (mainCallback) {
          if (callback) {
            callback();
          }
          mainCallback(id, response, status);
        } else {
          await ged_saveGiveaways(responseHtml.getElementById(id).closest(`.comment`), id);
          if (callback) {
            callback();
          }
          location.href = `/go/comment/${id}`;
        }
      } else {
        if (callback) {
          callback();
        }
        if (mainCallback) {
          mainCallback(null, null, status);
        } else {
          createElements(status, `inner`, [{
            attributes: {
              class: `fa fa-times-circle`
            },
            type: `i`
          }, {
            text: `Failed!`,
            type: `span`
          }]);
        }
      }
    } else {
      let responseJson = JSON.parse(response.responseText);
      if (responseJson.success) {
        let responseHtml = parseHtml(responseJson.html);
        let id = responseHtml.getElementsByClassName(`comment_outer`)[0].id;
        if (esgst.ch) {
          ch_saveComment(id, Date.now());
        }
        if (mainCallback) {
          if (callback) {
            callback();
          }
          mainCallback(id, response, status);
        } else {
          await ged_saveGiveaways(responseHtml.getElementById(id), id);
          if (callback) {
            callback();
          }
          location.href = `/go/comment/${id}`;
        }
      } else {
        if (callback) {
          callback();
        }
        if (mainCallback) {
          mainCallback(null, null, status);
        } else {
          createElements(status, `inner`, [{
            attributes: {
              class: `fa fa-times-circle`
            },
            type: `i`
          }, {
            text: `Failed!`,
            type: `span`
          }]);
        }
      }
    }
  }

  function getFeatures() {
    const features = {
      general: {
        features: {}
      },
      giveaways: {
        features: {}
      },
      discussions: {
        features: {}
      },
      trades: {
        features: {}
      },
      comments: {
        features: {}
      },
      users: {
        features: {}
      },
      groups: {
        features: {}
      },
      games: {
        features: {}
      },
      others: {
        features: {
          manipulateCookies: {
            description: `
              <ul>
                <li>You should enable this option if you use a single Firefox container for the common sites requested by ESGST that require you to be logged in (SteamGifts, SteamTrades, Steam, SGTools, etc...). With it enabled, ESGST will manipulate your cookies to make sure that requests are sent using the cookies from the current container you are on.</li>
                <li>For example: you are only logged in on SteamGifts and Steam in the personal container. With this option disabled, when you try to sync your owned games on ESGST it will fail because it will use the default cookies (where you are not logged in). With this option enabled, the sync will succeed because the container cookies will be used instead (where you are logged in).</li>
                <li>If you are concerned about what exactly is done, you can check out the source code of the eventPage.js file, where the manipulation occurs. Basically what happens is: the default cookies are backed up and replaced by the container cookies while the request is being made, and after the request is done the default cookies are restored. This is not a pretty solution, but it does the job until a better and more permanent solution comes along.</li>
              </ul>
            `,
            extensionOnly: true,
            name: `Allow ESGST to manipulate your cookies when using Firefox containers.`,
            sg: true,
            st: true
          },
          addNoCvGames: {
            name: `Automatically add no CV games to the database when searching for games in the new giveaway page.`,
            sg: true
          },
          askFileName: {
            name: `Ask for file name when backing up data.`,
            sg: true,
            st: true
          },
          autoBackup: {
            inputItems: [
              {
                id: `autoBackup_days`,
                prefix: `Days: `
              }
            ],
            name: `Automatically backup your data every specified number of days.`,
            options: {
              title: `Backup to:`,
              values: [`Computer`, `Dropbox`, `Google Drive`, `OneDrive`]
            },
            sg: true,
            st: true
          },
          autoSync: {
            name: `Automatically sync games/groups when syncing through SteamGifts.`,
            sg: true
          },
          updateHiddenGames: {
            description: `
              <ul>
                <li>With this enabled, you no longer have to sync your hidden games every time you add/remove a game to/from the list.</li>
              </ul>
            `,
            name: `Automatically update hidden games when adding/removing a game to/from the list.`,
            sg: true
          },
          updateWhitelistBlacklist: {
            description: `
              <ul>
                <li>With this enabled, you no longer have to sync your whitelist/blacklist every time you add/remove a user to/from those lists.</li>
              </ul>
            `,
            name: `Automatically update whitelist/blacklist when adding/removing a user to/from those lists.`,
            sg: true
          },
          calculateDelete: {
            name: `Calculate and show data sizes when opening the delete menu.`,
            sg: true,
            st: true
          },
          backupZip: {
            name: `Backup data as a .zip file (smaller, but slower) instead of a .json file (larger, but faster).`,
            sg: true,
            st: true
          },
          calculateExport: {
            name: `Calculate and show data sizes when opening the backup menu.`,
            sg: true,
            st: true
          },
          calculateImport: {
            name: `Calculate and show data sizes when opening the restore menu.`,
            sg: true,
            st: true
          },
          checkVersion: {
            name: `Check whether or not you are on the current version when visiting the ESGST discussion.`,
            sg: true
          },
          checkVersionMain: {
            name: `Check whether or not you are on the current version when visiting the main discussions page if the ESGST discussion is in the current page.`,
            sg: true
          },
          collapseSections: {
            name: `Collapse sections in the settings menu by default.`,
            sg: true,
            st: true
          },
          esgst: {
            name: `Enable ESGST for SteamTrades.`,
            st: true
          },
          enableByDefault: {
            name: `Enable new features and functionalities by default.`,
            sg: true,
            st: true
          },
          hideButtons: {
            description: `
              <ul>
                <li>Adds 2 buttons (<i class="fa fa-ellipsis-h"></i>) to left/right sides of the main page heading of any page that when clicked open a popout where you can hide other buttons from the main page heading to reduce the used space of the buttons.</li>
              </ul>
            `,
            features: {
              hideButtons_as: {
                name: `Archive Searcher Button`,
                sg: true
              },
              hideButtons_aic: {
                name: `Attached Image Carousel Button`,
                sg: true
              },
              hideButtons_cf: {
                name: `Comment Filters Button`,
                sg: true
              },
              hideButtons_cs: {
                name: `Comment Searcher`,
                sg: true,
                st: true
              },
              hideButtons_ctGo: {
                name: `Comment Tracker Button - Go to first unread.`,
                sg: true,
                st: true
              },
              hideButtons_ctRead: {
                name: `Comment Tracker Button - Read all.`,
                sg: true,
                st: true
              },
              hideButtons_ctUnread: {
                name: `Comment Tracker Button - Unread all.`,
                sg: true,
                st: true
              },
              hideButtons_cec: {
                name: `Comment/Entry Checker Button`,
                sg: true
              },
              hideButtons_df: {
                name: `Discussion Filters Button`,
                sg: true
              },
              hideButtons_ds: {
                name: `Discussions Sorter Button`,
                sg: true
              },
              hideButtons_esContinuous: {
                name: `Endless Scrolling Button - Continuously Load`,
                sg: true,
                st: true
              },
              hideButtons_esNext: {
                name: `Endless Scrolling Button - Load Next Page`,
                sg: true,
                st: true
              },
              hideButtons_esPause: {
                name: `Endless Scrolling Button - Pause/Resume`,
                sg: true,
                st: true
              },
              hideButtons_esRefresh: {
                name: `Endless Scrolling Button - Refresh`,
                sg: true,
                st: true
              },
              hideButtons_esRefreshAll: {
                name: `Endless Scrolling Button - Refresh All`,
                sg: true,
                st: true
              },
              hideButtons_ge: {
                name: `Giveaway Extractor Button`,
                sg: true
              },
              hideButtons_gf: {
                name: `Giveaway Filters Button`,
                sg: true
              },
              hideButtons_gts: {
                name: `Giveaway Templates Button`,
                sg: true
              },
              hideButtons_gas: {
                name: `Giveaways Sorter Button`,
                sg: true
              },
              hideButtons_gv: {
                name: `Grid View Button`,
                sg: true
              },
              hideButtons_glwc: {
                name: `Group Library/Wishlist Checker Button`,
                sg: true,
              },
              hideButtons_hgr: {
                name: `Hidden Game Remover Button`,
                sg: true
              },
              hideButtons_mpp: {
                name: `Main Post Popup Button`,
                sg: true,
                st: true
              },
              hideButtons_mm: {
                name: `Multi-Manager`,
                sg: true
              },
              hideButtons_namwc: {
                name: `Not Activated/Multiple Win Checker Button`,
                sg: true
              },
              hideButtons_rbp: {
                name: `Reply Box Popup Button`,
                sg: true,
                st: true
              },
              hideButtons_stbb: {
                name: `Scroll To Bottom  Button`,
                sg: true
              },
              hideButtons_sttb: {
                name: `Scroll To Top Button`,
                sg: true
              },
              hideButtons_sks: {
                name: `Sent Key Searcher Button`,
                sg: true
              },
              hideButtons_tb: {
                name: `Trade Bumper Button`,
                st: true
              },
              hideButtons_ugs: {
                name: `Unsent Gift Sender Button`,
                sg: true
              },
              hideButtons_wbc: {
                name: `Whitelist/Blacklist Checker Button`,
                sg: true
              },
              hideButtons_wbm: {
                name: `Whitelist/Blacklist Manager Button`,
                sg: true
              },
              hideButtons_wbsAsc: {
                name: `Whitelist/Blacklist Sorter Button - Ascending`,
                sg: true
              },
              hideButtons_wbsDesc: {
                name: `Whitelist/Blacklist Sorter Button - Descending`,
                sg: true
              }
            },
            name: `Hide buttons at the left/right sides of the main page heading to reduce the used space.`,
            sg: true,
            st: true
          },
          lockGiveawayColumns: {
            name: `Lock giveaway columns so that they are not draggable (they will remain in the set order).`,
            sg: true
          },
          staticPopups: {
            features: {
              staticPopups_f: {
                inputItems: [
                  {
                    id: `staticPopups_width`,
                    prefix: `Width: `
                  }
                ],
                name: `Define a fixed width for popups, so that they are centered horizontally.`,
                sg: true,
                st: true
              }
            },
            name: `Make popups static (they are fixed at the top left corner of the page instead of being automatically centered).`,
            sg: true,
            st: true
          },
          minimizePanel: {
            description: `
              <ul>
                <li>When you close a non-temporary popup, it will be minimized to a panel that can be accessed by moving your mouse to the left corner of the window in any page. There you can quickly find and re-open all of the popups that you minimized.</li>
                <li>A non-temporary popup is a popup that does not get destroyed when you close it. For example, the settings popup is a temporary popup - when you close it, the popup is destroyed, and when you click on the button to open the settings again, a new popup is created. The Whitelist/Blacklist Checker popup is an example of a non-temporary popup - if you close it and re-open it, it will be the exact same popup.</li>
                <li>With this option enabled, the sync/backup popups become non-temporary, which allows you to close them and keep navigating through the page while ESGST is performing the sync/backup, without having to wait for it to finish.</li>
                <li>Some popups will notify you when they are done. When this happens, a red bar will flash at the left side of the screen that only disappears when you open the minimize panel and re-open the popup that is requiring your attention.</li>
              </ul>
            `,
            name: `Minimize non-temporary popups to a panel when closing them.`,
            sg: true,
            st: true
          },
          getSyncGameNames: {
            description: `
              <ul>
                <li>With this disabled, only the app/sub ids of the games will appear.</li>
                <li>This can lead to lots of requests to the Steam store, so only enable it if you truly need to see the names of the games that were added/removed.</li>
              </ul>
            `,
            name: `Retrieve game names when syncing.`,
            sg: true,
            st: true
          },
          openSettingsInTab: {
            name: `Open settings menu in a separate tab.`,
            sg: true,
            st: true
          },
          openSyncInTab: {
            name: `Open the automatic sync in a new tab.`,
            sg: true,
            st: true
          },
          showChangelog: {
            name: `Show changelog from the new version when updating.`,
            sg: true,
            st: true
          },
          showFeatureNumber: {
            name: `Show the feature number in the tooltips of elements added by ESGST.`,
            sg: true,
            st: true
          }
        }
      },
      themes: {
        features: {
          sgDarkGrey: {
            name: [{
              attributes: {
                class: `esgst-bold`,
                href: `https://www.steamgifts.com/discussion/3rINT/`
              },
              text: `SG Dark Grey`,
              type: `a`
            }, {
              text: ` by SquishedPotatoe (Very high compatibility with ESGST elements - recommended)`,
              type: `node`
            }],
            sg: true,
            st: true,
            theme: `https://userstyles.org/styles/141670.css`
          },
          sgv2Dark: {
            name: [{
              attributes: {
                class: `esgst-bold`,
                href: `https://www.steamgifts.com/discussion/iO230/`
              },
              text: `SGv2 Dark`,
              type: `a`
            }, {
              text: ` by SquishedPotatoe (Very high compatibility with ESGST elements - recommended)`,
              type: `node`
            }],
            sg: true,
            st: true,
            theme: `https://userstyles.org/styles/109810.css`
          },
          steamGiftiesBlack: {
            name: [{
              attributes: {
                class: `esgst-bold`,
                href: `https://www.steamgifts.com/discussion/62TRf/`
              },
              text: `SteamGifties Black`,
              type: `a`
            }, {
              text: ` by Mully (Medium compatibility with ESGST elements)`,
              type: `node`
            }],
            sg: true,
            theme: `https://userstyles.org/styles/110675.css`
          },
          steamGiftiesBlue: {
            name: [{
              attributes: {
                class: `esgst-bold`,
                href: `https://www.steamgifts.com/discussion/62TRf/`
              },
              text: `SteamGifties Blue`,
              type: `a`
            }, {
              text: ` by Mully (Medium compatibility with ESGST elements)`,
              type: `node`
            }],
            sg: true,
            theme: `https://userstyles.org/styles/110491.css`
          },
          steamTradiesBlackBlue: {
            name: [{
              attributes: {
                class: `esgst-bold`,
                href: `https://www.steamgifts.com/discussion/FIdCm/`
              },
              text: `SteamTradies Black/Blue`,
              type: `a`
            }, {
              text: ` by Mully (No compatibility with ESGST elements)`,
              type: `node`
            }],
            st: true,
            theme: `https://userstyles.org/styles/134348.css`
          },
          customTheme: {
            name: `Custom Theme (Add your own CSS rules)`,
            sg: true,
            st: true,
            theme: true
          }
        }
      },
    };
    for (const type in features) {
      if (type.match(/^(others|themes)$/)) {
        continue;
      }
      const modules = _MODULES.filter(x => x.type == type).sort((x, y) => {
        return x.id.localeCompare(y.id, {sensitivity: `base`});
      });
      for (const modd of modules) {
        features[type].features[modd.id] = modd;
      }
    }
    return features;
  }

  function checkBusy(event) {
    if (document.getElementsByClassName(`esgst-busy`)[0] || esgst.busy) {
      event.returnValue = true;
      return true;
    }
  }

  async function checkVersion(discussion) {
    if (discussion.code === `TDyzv` && ((esgst.checkVersion && esgst.discussionPath) || (esgst.checkVersionMain && !esgst.discussionPath))) {
      let version = discussion.title.match(/v(.+?)\s/)[1];
      if (version !== esgst.version && version !== await getValue(`dismissedVersion`)) {
        notifyNewVersion(version);
      }
    }
  }

  function setMouseEvent(element, id, url, callback) {
    let isDragging = -1;
    let startingPos = [0, 0];
    element.addEventListener(`mousedown`, event => {
      if (event.button === 2) return; // right click, do nothing
      if (event.button === 1) { // middle click
        event.preventDefault();
      }
      isDragging = event.button;
      startingPos = [event.pageX, event.pageY];
    });
    element.addEventListener(`mousemove`, event => {
      if (isDragging === -1 || (event.pageX === startingPos[0] && event.pageY === startingPos[1])) return;
      isDragging = -1;
    });
    element.addEventListener(`mouseup`, () => {
      if (isDragging === -1) return;
      if (esgst[id] || isDragging === 1) {
        open(url);
      } else {
        callback();
      }
      isDragging = -1;
      startingPos = [0, 0];
    });
  }

  function createHeadingButton(details) {
    const [key, position] = esgst.leftButtonIds.indexOf(details.orderId || details.id) > -1 ? [`leftButtons`, `afterBegin`] : [`rightButtons`, `beforeEnd`];
    const children = [];
    if (details.isSwitch) {
      children.push({
        type: `span`
      });
    }
    for (const icon of details.icons) {
      children.push({
        attributes: {
          class: `fa ${icon}`
        },
        type: `i`
      });
    }
    return createElements(details.context || (esgst.hideButtons && esgst[`hideButtons_${details.orderId || details.id}`] ? esgst[key] : esgst.mainPageHeading), position, [{
      attributes: {
        class: `esgst-heading-button`,
        id: `esgst-${details.id}`,
        title: getFeatureTooltip(details.featureId || details.id, details.title)
      },
      type: `div`,
      children
    }]);
  }

  function showPatreonNotice() {
    if (!esgst.storage.patreonNotice) {
      const popup = new Popup(`fa-dollar`, [{
        text: `Hi! ESGST now has a Patreon page. If you want to support ESGST, please check it out: `,
        type: `node`
      }, {
        attributes: {
          href: `https://www.patreon.com/revilheart`
        },
        text: `https://www.patreon.com/revilheart`,
        type: `a`
      }], true);
      popup.onClose = setValue.bind(null, `patreonNotice`, true);
      popup.open();
    }
  }

  async function checkNewVersion() {
    if (esgst.version !== esgst.currentVersion) {
      if (typeof esgst.version === `undefined`) {
        esgst.firstInstall = true;
        let popup = new Popup(`fa-smile-o`, [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }, {
          text: ` Hi! ESGST is getting things ready for you. This will not take long...`,
          type: `node`
        }], true);
        popup.open();
        await checkSync(true, true);
        createElements(popup.title, `inner`, [{
          attributes: {
            class: `fa fa-check`
          },
          type: `i`
        }, {
          text: ` Thanks for installing ESGST, `,
          type: `node`
        }, {
          text: esgst.username,
          type: `span`
        }, {
          text: `. You are ready to go! Click on the `,
          type: `node`
        }, {
          text : `Settings`,
          type: `span`
        }, {
          text: ` link below to choose which features you want to use.`,
          type: `node`
        }]);
      } else {
        if (esgst.showChangelog) {
          loadChangelog(esgst.version);
        }
      }
      esgst.version = esgst.currentVersion;
      setValue(`version`, esgst.version);
    }
    if (!esgst.settings.groupPopupDismissed) {
      let i;
      for (i = esgst.groups.length - 1; i > -1 && esgst.groups[i].steamId !== `103582791461018688`; i--);
      if (i < 0 || !esgst.groups[i] || !esgst.groups[i].member) {
        let popup = new Popup(`fa-steam`, [{
          text: `Hello! In case you were not aware ESGST now has a Steam group. If you want to join it, you must first send a request from the `,
          type: `node`
        }, {
          attributes: {
            class: `esgst-bold`,
            href: `http://steamcommunity.com/groups/esgst`
          },
          text: `Steam group`,
          type: `a`
        }, {
          text: ` page, then another request from the settings menu (last button in the heading). Have a good day. :)`,
          type: `node`
        }]);
        createElements(popup.description, `beforeEnd`, [{
          attributes: {
            class: `esgst-description`
          },
          text: `This popup will never show up again after you close it`,
          type: `div`
        }]);
        popup.open();
        popup.onClose = setSetting.bind(null, `groupPopupDismissed`, true);
      }
    }
  }

  function parseMarkdown(string) {
    return [{
      type: `div`,
      children: [...Array.from(parseHtml(esgst.markdownParser.text(string)).body.children)].map(x => {
        return {
          context: x
        };
      })
    }];
  }

  async function addGiveawayToStorage() {
    let giveaway, ggiveaways, i, key, n, popup, ugd, user;
    popup = new Popup(`fa-circle-o-notch fa-spin`, `Please wait... ESGST is adding this giveaway to the storage...`, true);
    popup.open();
    let giveaways = await giveaways_get(document, true, location.href);
    if (giveaways.length) {
      giveaway = giveaways[0];
      ggiveaways = {};
      ggiveaways[giveaway.code] = giveaway;
      user = {
        steamId: esgst.steamId,
        username: esgst.username
      };
      const savedUser = await getUser(null, user);
      giveaways = null;
      if (savedUser) {
        giveaways = savedUser.giveaways;
      }
      if (!giveaways) {
        giveaways = {
          sent: {
            apps: {},
            subs: {}
          },
          won: {
            apps: {},
            subs: {}
          },
          sentTimestamp: 0,
          wonTimestamp: 0
        };
        if (savedUser) {
          ugd = savedUser.ugd;
          if (ugd) {
            if (ugd.sent) {
              for (key in ugd.sent.apps) {
                giveaways.sent.apps[key] = [];
                for (i = 0, n = ugd.sent.apps[key].length; i < n; ++i) {
                  ggiveaways[ugd.sent.apps[key][i].code] = ugd.sent.apps[key][i];
                  giveaways.sent.apps[key].push(ugd.sent.apps[key][i].code);
                }
              }
              for (key in ugd.sent.subs) {
                giveaways.sent.subs[key] = [];
                for (i = 0, n = ugd.sent.subs[key].length; i < n; ++i) {
                  ggiveaways[ugd.sent.subs[key][i].code] = ugd.sent.subs[key][i];
                  giveaways.sent.subs[key].push(ugd.sent.subs[key][i].code);
                }
              }
              giveaways.sentTimestamp = ugd.sentTimestamp;
            }
            if (ugd.won) {
              for (key in ugd.won.apps) {
                giveaways.won.apps[key] = [];
                for (i = 0, n = ugd.won.apps[key].length; i < n; ++i) {
                  ggiveaways[ugd.won.apps[key][i].code] = ugd.won.apps[key][i];
                  giveaways.won.apps[key].push(ugd.won.apps[key][i].code);
                }
              }
              for (key in ugd.won.subs) {
                giveaways.won.subs[key] = [];
                for (i = 0, n = ugd.won.subs[key].length; i < n; ++i) {
                  ggiveaways[ugd.won.subs[key][i].code] = ugd.won.subs[key][i];
                  giveaways.won.subs[key].push(ugd.won.subs[key][i].code);
                }
              }
              giveaways.wonTimestamp = ugd.wonTimestamp;
            }
          }
        }
      }
      if (!giveaways.sent[giveaway.gameType][giveaway.gameSteamId]) {
        giveaways.sent[giveaway.gameType][giveaway.gameSteamId] = [];
      }
      if (giveaways.sent[giveaway.gameType][giveaway.gameSteamId].indexOf(giveaway.code) < 0) {
        giveaways.sent[giveaway.gameType][giveaway.gameSteamId].push(giveaway.code);
      }
      user.values = {
        giveaways: giveaways
      };
      await lockAndSaveGiveaways(ggiveaways);
      await saveUser(null, null, user);
      popup.close();
    }
  }

  function generateHeaderMenuItem(details, key) {
    if (details.icon) {
      let icon = details.icon;
      if (details.color) {
        icon += ` icon-${details.color}`;
      }
      if (details.url) {
        return [{
          attributes: {
            class: `esgst-header-menu-row${details.className || ``}`,
            [`data-link-id`]: details.id,
            [`data-link-key`]: key,
            href: details.url,
            title: details.title || ``
          },
          type: `a`,
          children: [{
            attributes: {
              class: `fa fa-fw ${icon}`
            },
            type: `i`
          }, {
            type: `div`,
            children: [{
              attributes: {
                class: `esgst-header-menu-name`
              },
              text: details.name,
              type: `p`
            }, details.description ? {
              attributes: {
                class: `esgst-header-menu-description`
              },
              text: details.description,
              type: `p`
            } : null]
          }]
        }];
      }
      return [{
        attributes: {
          class: `esgst-header-menu-row${details.className || ``}`,
          [`data-link-id`]: details.id,
          [`data-link-key`]: key,
          title: details.title || ``
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa fa-fw ${icon}`
          },
          type: `i`
        }, {
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-header-menu-name`
            },
            text: details.name,
            type: `p`
          }, details.description ? {
            attributes: {
              class: `esgst-header-menu-description`
            },
            text: details.description,
            type: `p`
          } : null]
        }]
      }];
    }
    if (esgst.sg) {
      return [{
        attributes: {
          class: `nav__row${details.className || ``}`,
          [`data-link-id`]: details.id,
          [`data-link-key`]: key,
          href: details.url,
          title: details.title || ``
        },
        type: `a`,
        children: [{
          attributes: {
            class: `nav__row__summary`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `nav__row__summary__name`
            },
            text: details.name,
            type: `p`
          }, details.description ? {
            attributes: {
              class: `esgst-header-menu-description`
            },
            text: details.description,
            type: `p`
          } : null]
        }]
      }];
    } else {
      return [{
        attributes: {
          class: `dropdown_btn${details.className || ``}`,
          [`data-link-id`]: details.id,
          [`data-link-key`]: key,
          href: details.url,
          title: details.title || ``
        },
        type: `a`,
        children: [{
          text: details.name,
          type: `span`
        }]
      }];
    }
  }

  function reorderButtons(leftButton, leftButtons, rightButton, rightButtons) {
    let leftHidden, rightHidden, source;
    leftHidden = leftButton && leftButton.classList.contains(`esgst-hidden`);
    rightHidden = rightButton && rightButton.classList.contains(`esgst-hidden`);
    esgst.leftButtonIds.forEach(id => {
      let button = document.getElementById(`esgst-${id}`);
      if (button) {
        let key = id === `esResume` ? `hideButtons_esPause` : `hideButtons_${id}`;
        button.parentElement.insertBefore(button, leftHidden || !esgst.hideButtons || esgst[key] ? button.parentElement.firstElementChild : button.parentElement.firstElementChild.nextElementSibling);
        button.setAttribute(`draggable`, true);
        button.addEventListener(`dragstart`, event => {
          event.dataTransfer.setData(`text/plain`, ``);
          source = button;
        });
        button.addEventListener(`dragenter`, () => {
          let current;
          current = source;
          do {
            current = current.previousElementSibling;
            if (current && current === button) {
              current.parentElement.insertBefore(source, current);
              return;
            }
          } while (current);
          button.parentElement.insertBefore(source, button.nextElementSibling);
        });
        button.addEventListener(`dragend`, async () => {
          let i, nextSiblingId, previousSiblingId, siblingId;
          if (esgst.hideButtons) {
            if (leftButtons.contains(button) || rightButtons.contains(button)) {
              if (!esgst[key]) {
                await setSetting(key, true, esgst.sg, esgst.st);
              }
            } else if (esgst[key]) {
              await setSetting(key, false, esgst.sg, esgst.st);
            }
          }
          previousSiblingId = button.previousElementSibling && !button.previousElementSibling.classList.contains(`esgst-hidden`) && button.previousElementSibling.id;
          nextSiblingId = button.nextElementSibling && !button.nextElementSibling.classList.contains(`esgst-hidden`) && button.nextElementSibling.id;
          siblingId = previousSiblingId || nextSiblingId;
          if (siblingId) {
            i = esgst.rightButtonIds.indexOf(siblingId.split(`esgst-`)[1]);
            esgst.leftButtonIds.splice(esgst.leftButtonIds.indexOf(id), 1);
            if (i > -1) {
              esgst.rightButtonIds.splice(i, 0, id);
            } else if (previousSiblingId) {
              esgst.leftButtonIds.splice(esgst.leftButtonIds.indexOf(previousSiblingId.split(`esgst-`)[1]), 0, id);
            } else {
              esgst.leftButtonIds.splice(esgst.leftButtonIds.indexOf(nextSiblingId.split(`esgst-`)[1]) + 1, 0, id);
            }
            await setSetting(`leftButtonIds`, esgst.leftButtonIds);
            await setSetting(`rightButtonIds`, esgst.rightButtonIds);
          }
        });
      }
    });
    esgst.rightButtonIds.forEach(id => {
      let button = document.getElementById(`esgst-${id}`);
      if (button) {
        let key = id === `esResume` ? `hideButtons_esPause` : `hideButtons_${id}`;
        if (rightHidden || !esgst.hideButtons || esgst[key]) {
          button.parentElement.appendChild(button);
        } else {
          button.parentElement.insertBefore(button, button.parentElement.lastElementChild);
        }
        button.setAttribute(`draggable`, true);
        button.addEventListener(`dragstart`, event => {
          event.dataTransfer.setData(`text/plain`, ``);
          source = button;
        });
        button.addEventListener(`dragenter`, () => {
          let current;
          current = source;
          do {
            current = current.previousElementSibling;
            if (current && current === button) {
              current.parentElement.insertBefore(source, current);
              return;
            }
          } while (current);
          button.parentElement.insertBefore(source, button.nextElementSibling);
        });
        button.addEventListener(`dragend`, async () => {
          let i, nextSiblingId, previousSiblingId, siblingId;
          if (esgst.hideButtons) {
            if (leftButtons.contains(button) || rightButtons.contains(button)) {
              if (!esgst[key]) {
                await setSetting(key, true, esgst.sg, esgst.st);
              }
            } else if (esgst[key]) {
              await setSetting(key, false, esgst.sg, esgst.st);
            }
          }
          previousSiblingId = button.previousElementSibling && !button.previousElementSibling.classList.contains(`esgst-hidden`) && button.previousElementSibling.id;
          nextSiblingId = button.nextElementSibling && !button.nextElementSibling.classList.contains(`esgst-hidden`) && button.nextElementSibling.id;
          siblingId = previousSiblingId || nextSiblingId;
          if (siblingId) {
            i = esgst.leftButtonIds.indexOf(siblingId.split(`esgst-`)[1]);
            esgst.rightButtonIds.splice(esgst.rightButtonIds.indexOf(id), 1);
            if (i > -1) {
              esgst.leftButtonIds.splice(i, 0, id);
            } else if (previousSiblingId) {
              esgst.rightButtonIds.splice(esgst.rightButtonIds.indexOf(previousSiblingId.split(`esgst-`)[1]) + 1, 0, id);
            } else {
              esgst.rightButtonIds.splice(esgst.rightButtonIds.indexOf(nextSiblingId.split(`esgst-`)[1]), 0, id);
            }
            await setSetting(`leftButtonIds`, esgst.leftButtonIds);
            await setSetting(`rightButtonIds`, esgst.rightButtonIds);
          }
        });
      }
    });
  }

  function repositionPopups() {
    if (esgst.openPopups > 0) {
      esgst.popups.forEach(popup => popup.reposition());
      esgst.isRepositioning = true;
      setTimeout(() => repositionPopups(), 2000);
    } else {
      esgst.isRepositioning = false;
    }
  }

  async function setSetting() {
    const deleteLock = await createLock(`settingsLock`, 100);
    const settings = JSON.parse(await getValue(`settings`, `{}`));
    const values = Array.isArray(arguments[0])
      ? arguments[0]
      : [
        {
          id: arguments[0],
          value: arguments[1],
          sg: arguments[2],
          st: arguments[3]
        }
      ];
    for (const value of values) {
      if (value.sg) {
        value.id = `${value.id}_sg`;
      } else if (value.st) {
        value.id = `${value.id}_st`;
      }
      settings[value.id] = value.value;
      esgst.settings[value.id] = value.value;
    }
    await setValue(`settings`, JSON.stringify(settings));
    deleteLock();
  }

  function getSetting(key, inverse) {
    let value = esgst.settings[key];
    if (typeof value === `undefined`) {
      let defaultValue = esgst.defaultValues[key];
      if (typeof defaultValue === `undefined`) {
        defaultValue = esgst[`enableByDefault_${esgst.name}`] || false;
      }
      let oldKey = esgst.oldValues[key];
      if (typeof oldKey !== `undefined`) {
        value = inverse ? !esgst.settings[oldKey] : esgst.settings[oldKey];
      }
      if (typeof value === `undefined`) {
        value = defaultValue;
      }
    }
    return value;
  }

  function getOldValues(id, name, setting) {
    switch (id) {
      case `at`:
        if (name !== `sg`) return;
        setting.exclude = [
          {enabled: validateValue(esgst.settings.at_g_sg) ? 0 : 1, pattern: `^/($|giveaways(?!/(new|wishlist|created|entered|won)))`}
        ];
        return;
      case `egh`:
        if (name !== `sg`) return;
        setting.exclude = [
          {enabled: validateValue(esgst.settings.egh_t_sg) ? 0 : 1, pattern: `^/discussion/`}
        ];
        return;
      case `es_pd`:
        setting.enabled = name === `sg` ? esgst.settings.es_l_d_sg || esgst.settings.es_c_d_sg || esgst.settings.es_d_d_sg || esgst.settings.es_g_d_sg : esgst.settings.es_l_d_st || esgst.settings.es_c_d_st || esgst.settings.es_t_d_st;
        setting.enabled = setting.enabled ? 1 : 0;
      case `es`:
        if (name === `sg`) {
          if (validateValue(esgst.settings[id === `es` ? `es_l_sg` : `es_l_d_sg`])) {
            setting.exclude = [
              {enabled: validateValue(esgst.settings[id === `es` ? `es_c_sg` : `es_c_d_sg`]) ? 0 : 1, pattern: `^/(giveaway/(?!.*/(entries|winners|groups|region-restrictions))|discussion/|support/ticket/)`},
              {enabled: validateValue(esgst.settings[id === `es` ? `es_d_sg` : `es_d_d_sg`]) ? 0 : 1, pattern: `^/(discussions|support/tickets)`},
              {enabled: validateValue(esgst.settings[id === `es` ? `es_g_sg` : `es_g_d_sg`]) ? 0 : 1, pattern: `^/($|giveaways(?!/(new|wishlist|created|entered|won)))`}
            ];
          } else {
            setting.include = [
              {enabled: validateValue(esgst.settings[id === `es` ? `es_c_sg` : `es_c_d_sg`]) ? 1 : 0, pattern: `^/(giveaway/(?!.*/(entries|winners|groups|region-restrictions))|discussion/|support/ticket/)`},
              {enabled: validateValue(esgst.settings[id === `es` ? `es_d_sg` : `es_d_d_sg`]) ? 1 : 0, pattern: `^/(discussions|support/tickets)`},
              {enabled: validateValue(esgst.settings[id === `es` ? `es_g_sg` : `es_g_d_sg`]) ? 1 : 0, pattern: `^/($|giveaways(?!/(new|wishlist|created|entered|won)))`}
            ];
          }
        } else {
          if (validateValue(esgst.settings[id === `es` ? `es_l_st` : `es_l_d_st`])) {
            setting.exclude = [
              {enabled: validateValue(esgst.settings[id === `es` ? `es_c_st` : `es_c_d_st`]) ? 0 : 1, pattern: `^/trade/`},
              {enabled: validateValue(esgst.settings[id === `es` ? `es_t_st` : `es_t_d_st`]) ? 0 : 1, pattern: `^/($|trades)`}
            ];
          } else {
            setting.include = [
              {enabled: validateValue(esgst.settings[id === `es` ? `es_c_st` : `es_c_d_st`]) ? 1 : 0, pattern: `^/trade/`},
              {enabled: validateValue(esgst.settings[id === `es` ? `es_t_st` : `es_t_d_st`]) ? 1 : 0, pattern: `^/($|trades)`}
            ];
          }
        }
        return;
      case `gc`:
        if (name !== `sg`) return;
        setting.exclude = [
          {enabled: validateValue(esgst.settings.gc_t_sg) ? 0 : 1, pattern: `^/discussion/`}
        ];
        return;
      case `gc_gi`:
        if (name !== `sg`) return;
        if (validateValue(esgst.settings.gc_gi_t_sg)) {
          setting.include = [
            {enabled: 1, pattern: `^/discussion`}
          ];
        } else if (validateValue(esgst.settings.gc_gi_cew_sg)) {
          setting.include = [
            {enabled: 1, pattern: `^/giveaways/(created|entered|won)/`}
          ];
        }
        return;
      case `gc_o_a`:
        if (name !== `sg`) return;
        setting.enabled = esgst.settings.gc_o_altAccounts && esgst.settings.gc_o_altAccounts.length > 0 ? 1 : 0;
        if (validateValue(esgst.settings.gc_o_t_sg)) {
          setting.include = [
            {enabled: 1, pattern: `^/discussion`}
          ];
        }
        return;
      case `gt`:
        if (name !== `sg`) return;
        setting.exclude = [
          {enabled: validateValue(esgst.settings.gt_t_sg) ? 0 : 1, pattern: `^/discussion/`}
        ];
        return;
      case `vai`:
        setting.exclude = [
          {enabled: validateValue(esgst.settings[`vai_i_${name}`]) ? 1 : 0, pattern: `^/messages`}
        ];
        return;
      default:
        return;
    }
  }

  function getFeaturePath(feature, id, name) {
    let key = `${id}_${name}`;
    let setting = esgst.settings[key];
    if (typeof setting === `undefined` || !setting.include || !Array.isArray(setting.include)) {
      setting = {
        enabled: getSetting(key, key.match(/^(wbc_checkBlacklist|wbc_hb_sg)$/)) ? 1 : 0,
        include: [],
        exclude: [],
        new: typeof setting === `undefined`
      };
      if (feature[name].include) {
        setting.include = feature[name].include;
        if (feature[name].exclude) {
          setting.exclude = feature[name].exclude;
        }
      } else {
        setting.include = [{enabled: setting.enabled, pattern: `.*`}];
      }
      if (setting.new) {
        getOldValues(id, name, setting);
      }
    }
    return setting;
  }

  function getFeatureSetting(feature, id) {
    esgst[id] = false;
    if (feature[esgst.name]) {
      let setting = getFeaturePath(feature, id, esgst.name);
      if (!setting.enabled) return;
      let check = false;
      let path = `${location.pathname}${location.search}`;
      let i = setting.include.length - 1;
      while (i > -1 && (!setting.include[i].enabled || !path.match(new RegExp(setting.include[i].pattern)))) i--;
      if (i > -1) {
        check = true;
      }
      i = setting.exclude.length - 1;
      while (i > -1 && (!setting.exclude[i].enabled || !path.match(new RegExp(setting.exclude[i].pattern)))) i--;
      if (i > -1) {
        check = false;
      }
      esgst[id] = check;
    }
    if (!esgst[id]) return;
    if (feature.features) {
      for (id in feature.features) {
        getFeatureSetting(feature.features[id], id);
      }
    }
  }

  function toggleHeaderMenu(arrow, dropdown) {
    if (esgst.sg) {
      let buttons = document.querySelectorAll(`nav .nav__button`);
      for (let button of buttons) {
        button.classList.remove(`is-selected`);
      }
      let dropdowns = document.querySelectorAll(`nav .nav__relative-dropdown`);
      for (let dropdown of dropdowns) {
        dropdown.classList.add(`is-hidden`);
      }
    } else {
      let buttons = document.querySelectorAll(`.nav_btn_dropdown, .page_heading_btn_dropdown`);
      for (let button of buttons) {
        button.classList.remove(`is_selected`);
      }
      let dropdowns = document.querySelectorAll(`.dropdown`);
      for (let dropdown of dropdowns) {
        dropdown.classList.add(`is_hidden`);
      }
    }
    arrow.classList.toggle(`selected`);
    dropdown.classList.toggle(`esgst-hidden`);
  }

  function getFeatureTooltip(id, title = ``) {
    if (esgst.showFeatureNumber) {
      if (title) {
        return `${title}\n\nThis element was added by ESGST${id ? ` (${getFeatureNumber(id).number})` : ``}`;
      }
      return `This element was added by ESGST${id ? ` (${getFeatureNumber(id).number})` : ``}`;
    }
    return title;
  }

  function getFeatureName(fullMatch, match) {
    let feature = getFeatureNumber(match);
    return `${feature.number} "${feature.name}"`;
  }

  function getFeatureNumber(queryId) {
    let n = 1;
    for (let type in esgst.features) {
      let i = 1;
      for (let id in esgst.features[type].features) {
        let feature = esgst.features[type].features[id];
        let result = getFeatureNumber_2(feature, id, i, n, queryId);
        if (result) {
          return result;
        }
        if (feature.sg || esgst.settings.esgst_st) {
          i += 1;
        }
      }
      if (type !== `trades` || esgst.settings.esgst_st) {
        n += 1;
      }
    }
    return {
      name: ``,
      number: ``
    };
  }

  function getFeatureNumber_2(feature, id, i, n, queryId) {
    if (id === queryId) {
      return {
        name: feature.name,
        number: `${n}.${i}`
      };
    }
    if (feature.features) {
      let j = 1;
      for (let id in feature.features) {
        let subFeature = feature.features[id];
        let result = getFeatureNumber_2(subFeature, id, j, `${n}.${i}`, queryId);
        if (result) {
          return result;
        }
        if (subFeature.sg || esgst.settings.esgst_st) {
          j += 1;
        }
      }
    }
    return null;
  }

  async function getUser(savedUsers, user) {
    let savedUser = null;
    if (!savedUsers) {
      savedUsers = JSON.parse(await getValue(`users`));
    }
    if (user.steamId) {
      savedUser = savedUsers.users[user.steamId];
      if (savedUser) {
        if (!user.id) {
          user.id = savedUser.id;
        }
        if (!user.username) {
          user.username = savedUser.username;
        }
      }
    } else if (user.username) {
      let steamId = savedUsers.steamIds[user.username];
      if (steamId) {
        user.steamId = steamId;
        savedUser = savedUsers.users[steamId];
      }
    }
    return savedUser;
  }

  async function saveUser(list, savedUsers, user) {
    if (!savedUsers) {
      savedUsers = JSON.parse(await getValue(`users`));
    }
    let savedUser = await getUser(savedUsers, user);
    if (savedUser) {
      if (list) {
        if (!user.steamId) {
          user.steamId = savedUsers.steamIds[user.username];
        }
        list.existing.push(user);
      } else {
        let deleteLock = await createLock(`userLock`, 300);
        checkUsernameChange(savedUsers, user);
        for (let key in user.values) {
          if (key !== `tags`) {
            if (user.values[key] === null) {
              delete savedUsers.users[user.steamId][key];
            } else {
              savedUsers.users[user.steamId][key] = user.values[key];
            }
          }
        }
        await setValue(`users`, JSON.stringify(savedUsers));
        deleteLock();
      }
    } else {
      if (user.steamId && user.username) {
        if (list) {
          list.new.push(user);
        } else {
          await addUser(user);
        }
      } else if (user.steamId) {
        await getUsername(list, true, user);
      } else {
        await getSteamId(list, true, null, user);
      }
    }
  }

  function checkUsernameChange(savedUsers, user) {
    let i, n;
    if (typeof savedUsers.users[user.steamId].username !== `undefined` && savedUsers.users[user.steamId].username !== user.username) {
      delete savedUsers.steamIds[savedUsers.users[user.steamId].username];
      savedUsers.users[user.steamId].username = user.username;
      savedUsers.steamIds[user.username] = user.steamId;
      if (user.values.tags) {
        if (!savedUsers.users[user.steamId].tags) {
          savedUsers.users[user.steamId].tags = [];
        }
        for (i = 0, n = user.values.tags.length; i < n; ++i) {
          if (savedUsers.users[user.steamId].tags.indexOf(user.values.tags[i]) < 0) {
            savedUsers.users[user.steamId].tags.push(user.values.tags[i]);
          }
        }
      }
      return true;
    } else if (typeof user.values.tags !== `undefined`) {
      savedUsers.users[user.steamId].tags = user.values.tags;
    }
    if (!savedUsers.users[user.steamId].tags) {
      delete savedUsers.users[user.steamId].tags;
    }
  }

  async function addUser(user) {
    let deleteLock, savedUser, savedUsers;
    deleteLock = await createLock(`userLock`, 300);
    savedUsers = JSON.parse(await getValue(`users`));
    savedUser = await getUser(savedUsers, user);
    if (!savedUser) {
      savedUsers.users[user.steamId] = {};
    }
    if (user.id) {
      savedUsers.users[user.steamId].id = user.id;
    }
    checkUsernameChange(savedUsers, user);
    if (user.username) {
      savedUsers.users[user.steamId].username = user.username;
      savedUsers.steamIds[user.username] = user.steamId;
    }
    for (let key in user.values) {
      if (key !== `tags`) {
        if (user.values[key] === null) {
          delete savedUsers.users[user.steamId][key];
        } else {
          savedUsers.users[user.steamId][key] = user.values[key];
        }
      }
    }
    await setValue(`users`, JSON.stringify(savedUsers));
    deleteLock();
  }

  async function getUsername(list, save, user) {
    let match, response, responseHtml;
    response = await request({method: `GET`, url: `https://www.steamgifts.com/go/user/${user.steamId}`});
    match = response.finalUrl.match(/\/user\/(.+)/);
    responseHtml = parseHtml(response.responseText);
    if (match) {
      user.username = match[1];
      let input = responseHtml.querySelector(`[name="child_user_id"]`);
      if (input) {
        user.id = input.value;
      }
    }
    if (save) {
      if (list) {
        list.new.push(user);
      } else {
        await addUser(user);
      }
    }
  }

  async function getSteamId(list, save, savedUsers, user) {
    let input, responseHtml;
    if (!save) {
      if (!savedUsers) {
        savedUsers = JSON.parse(await getValue(`users`));
      }
      let steamId = savedUsers.steamIds[user.username];
      if (steamId) {
        user.steamId = steamId;
        user.id = savedUsers.users[steamId].id;
        return;
      }
    }
    responseHtml = parseHtml((await request({method: `GET`, url: `https://www.steamgifts.com/user/${user.username}`})).responseText);
    user.steamId = responseHtml.querySelector(`[href*="/profiles/"]`).getAttribute(`href`).match(/\d+/)[0];
    input = responseHtml.querySelector(`[name="child_user_id"]`);
    if (input) {
      user.id = input.value;
    }
    if (save) {
      if (list) {
        list.new.push(user);
      } else {
        await addUser(user);
      }
    }
  }

  async function saveUsers(users) {
    let list, promises, savedUsers;
    list = {
      existing: [],
      new: []
    };
    promises = [];
    savedUsers = JSON.parse(await getValue(`users`));
    for (let i = 0, n = users.length; i < n; i++) {
      promises.push(saveUser(list, savedUsers, users[i]));
    }
    await Promise.all(promises);
    let deleteLock = await createLock(`userLock`, 300);
    savedUsers = JSON.parse(await getValue(`users`));
    for (let i = 0, n = list.new.length; i < n; ++i) {
      let savedUser, user;
      user = list.new[i];
      savedUser = await getUser(savedUsers, user);
      if (!savedUser) {
        savedUsers.users[user.steamId] = {};
      }
      if (user.id) {
        savedUsers.users[user.steamId].id = user.id;
      }
      checkUsernameChange(savedUsers, user);
      if (user.username) {
        savedUsers.users[user.steamId].username = user.username;
        savedUsers.steamIds[user.username] = user.steamId;
      }
      for (let key in user.values) {
        if (key !== `tags`) {
          if (user.values[key] === null) {
            delete savedUsers.users[user.steamId][key];
          } else {
            savedUsers.users[user.steamId][key] = user.values[key];
          }
        }
      }
    }
    for (let i = 0, n = list.existing.length; i < n; ++i) {
      let user = list.existing[i];
      checkUsernameChange(savedUsers, user);
      for (let key in user.values) {
        if (key !== `tags`) {
          if (user.values[key] === null) {
            delete savedUsers.users[user.steamId][key];
          } else {
            savedUsers.users[user.steamId][key] = user.values[key];
          }
        }
      }
    }
    await setValue(`users`, JSON.stringify(savedUsers));
    deleteLock();
  }

  async function deleteUserValues(values) {
    let deleteLock, savedUsers;
    deleteLock = await createLock(`userLock`, 300);
    savedUsers = JSON.parse(await getValue(`users`));
    for (let key in savedUsers.users) {
      for (let i = 0, n = values.length; i < n; ++i) {
        delete savedUsers.users[key][values[i]];
      }
    }
    await setValue(`users`, JSON.stringify(savedUsers));
    deleteLock();
  }

  async function getUserId(user) {
    if (user.username) {
      await getSteamId(null, false, null, user);
    } else {
      await getUsername(null, false, user);
    }
  }

  async function checkSync(menu, callback) {
    let currentDate = Date.now();
    let isSyncing = getLocalValue(`isSyncing`);
    if (menu) {
      await setSync(false, callback);
    } else if (!isSyncing || currentDate - isSyncing > 1800000) {
      if (esgst.openSyncInTab) {
        let parameters = ``;
        setLocalValue(`isSyncing`, currentDate);
        [`Groups`, `Whitelist`, `Blacklist`, `HiddenGames`, `Games`, `WonGames`, `ReducedCvGames`, `NoCvGames`, `HltbTimes`, `Giveaways`].forEach(key => {
          if (esgst[`autoSync${key}`] && currentDate - esgst[`lastSync${key}`] > esgst[`autoSync${key}`] * 86400000) {
            parameters += `${key}=1&`;
          }
        });
        if (parameters) {
          if (esgst.sg) {
            open(`/esgst/sync?${parameters.replace(/&$/, ``)}`);
          } else {
            open(`/esgst/sync?${parameters.replace(/&$/, ``)}`);
          }
        } else {
          delLocalValue(`isSyncing`);
        }
      } else {
        let parameters = {};
        setLocalValue(`isSyncing`, currentDate);
        [`Groups`, `Whitelist`, `Blacklist`, `HiddenGames`, `Games`, `WonGames`, `ReducedCvGames`, `NoCvGames`, `HltbTimes`, `Giveaways`].forEach(key => {
          if (esgst[`autoSync${key}`] && currentDate - esgst[`lastSync${key}`] > esgst[`autoSync${key}`] * 86400000) {
            parameters[key] = 1;
          }
        });
        if (Object.keys(parameters).length > 0) {
          await setSync(false, null, parameters);
        } else {
          delLocalValue(`isSyncing`);
        }
      }
    }
  }

  async function setSync(autoSync, mainCallback, parameters) {
    let syncer = {
      autoSync: autoSync,
      canceled: false
    };
    if (esgst.firstInstall) {
      await sync(syncer);
    } else if (syncer.autoSync || mainCallback || parameters) {
      syncer.popup = new Popup(parameters ? `fa-circle-o-notch fa-spin` : `fa-refresh`, parameters ? `ESGST is syncing your data... ${esgst.minimizePanel ? `You can close this popup, ESGST will notify you when it is done through the minimize panel.` : `Please do not close this popup until it is done.`}` : `Sync`, !esgst.minimizePanel);
      if (!syncer.autoSync && !parameters) {
        createElements(syncer.popup.description, `afterBegin`, [{
          attributes: {
            class: `esgst-description`
          },
          text: `By selecting a number X in the dropdown menu next to each data other than 0, you are enabling automatic sync for that data (which means the data will be synced every X days).`,
          type: `div`
        }]);
        syncer.switches = {
          syncGroups: new ToggleSwitch(syncer.popup.scrollable, `syncGroups`, false, `Steam Groups`, false, false, null, esgst.syncGroups),
          syncWhitelist: new ToggleSwitch(syncer.popup.scrollable, `syncWhitelist`, false, `Whitelist`, false, false, null, esgst.syncWhitelist),
          syncBlacklist: new ToggleSwitch(syncer.popup.scrollable, `syncBlacklist`, false, `Blacklist`, false, false, null, esgst.syncBlacklist),
          syncHiddenGames: new ToggleSwitch(syncer.popup.scrollable, `syncHiddenGames`, false, `Hidden Games`, false, false, null, esgst.syncHiddenGames),
          syncGames: new ToggleSwitch(syncer.popup.scrollable, `syncGames`, false, `Owned/Wishlisted/Ignored Games`, false, false, null, esgst.syncGames),
          syncWonGames: new ToggleSwitch(syncer.popup.scrollable, `syncWonGames`, false, `Won Games`, false, false, null, esgst.syncWonGames),
          syncReducedCvGames: new ToggleSwitch(syncer.popup.scrollable, `syncReducedCvGames`, false, `Reduced CV Games`, false, false, null, esgst.syncReducedCvGames),
          syncNoCvGames: new ToggleSwitch(syncer.popup.scrollable, `syncNoCvGames`, false, `No CV Games`, false, false, null, esgst.syncNoCvGames),
          syncHltbTimes: new ToggleSwitch(syncer.popup.scrollable, `syncHltbTimes`, false, `HLTB Times`, false, false, null, esgst.syncHltbTimes),
          syncGiveaways: new ToggleSwitch(syncer.popup.scrollable, `syncGiveaways`, false, `Giveaways`, false, false, null, esgst.syncGiveaways)
        };
        for (let id in syncer.switches) {
          setAutoSync(id, syncer.switches);
        }
        let group = createElements(syncer.popup.description, `beforeEnd`, [{
          attributes: {
            class: `esgst-button-group`
          },
          type: `div`,
          children: [{
            text: `Select:`,
            type: `span`
          }]
        }]);
        group.appendChild(new ButtonSet(`grey`, `grey`, `fa-square`, `fa-circle-o-notch fa-spin`, `All`, ``, selectSwitches.bind(null, syncer.switches, `enable`, group)).set);
        group.appendChild(new ButtonSet(`grey`, `grey`, `fa-square-o`, `fa-circle-o-notch fa-spin`, `None`, ``, selectSwitches.bind(null, syncer.switches, `disable`, group)).set);
        group.appendChild(new ButtonSet(`grey`, `grey`, `fa-plus-square-o`, `fa-circle-o-notch fa-spin`, `Inverse`, ``, selectSwitches.bind(null, syncer.switches, `toggle`, group)).set);
      }
      syncer.progress = createElements(syncer.popup.description, `beforeEnd`, [{
        attributes: {
          class: `esgst-hidden esgst-popup-progress`
        },
        type: `div`
      }]);
      syncer.results = createElements(syncer.popup.scrollable, `afterBegin`, [{
        type: `div`
      }]);
      if (!parameters) {
        syncer.set = new ButtonSet_v2({color1: `green`, color2: `grey`, icon1: `fa-refresh`, icon2: `fa-times`, title1: `Sync`, title2: `Cancel`, callback1: sync.bind(null, syncer), callback2: cancelSync.bind(null, syncer)});
        syncer.popup.description.appendChild(syncer.set.set);
      }
      syncer.popup.open();
      if (syncer.autoSync) {
        syncer.set.trigger();
      } else if (parameters) {
        syncer.parameters = parameters;
        await sync(syncer);
      }
    } else {
      esgst.mainContext.innerHTML = ``;
      let description = createElements(esgst.mainContext, `beforeEnd`, [{
        attributes: {
          class: `description`
        },
        type: `div`,
        children: [{
          type: `div`
        }, {
          attributes: {
            class: `esgst-hidden esgst-popup-progress`
          },
          type: `div`
        }]
      }]);
      syncer.results = description.firstElementChild;
      syncer.progress = description.lastElementChild;
      syncer.parameters = getParameters();
      await sync(syncer);
    }
  }

  function setAutoSync(id, switches) {
    let html, i, key, select, toggleSwitch;
    key = id.replace(/^sync/, ``);
    toggleSwitch = switches[id];
    html = [{
      attributes: {
        class: `esgst-auto-sync`
      },
      type: `select`,
      children: []
    }];
    for (i = 0; i < 31; ++i) {
      html[0].children.push({
        text: i,
        type: `option`
      });
    }
    select = createElements(toggleSwitch.name, `beforeEnd`, html);
    select.selectedIndex = esgst[`autoSync${key}`];
    observeNumChange(select, `autoSync${key}`);
    if (esgst[`lastSync${key}`]) {
      toggleSwitch.date = createElements(toggleSwitch.name, `beforeEnd`, [{
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-check-circle`
          },
          type: `i`
        }, {
          text: ` Last synced ${new Date(esgst[`lastSync${key}`]).toLocaleString()}`,
          type: `node`
        }]
      }]);
    } else {
      toggleSwitch.date = createElements(toggleSwitch.name, `beforeEnd`, [{
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-times`
          },
          type: `i`
        }, {
          text: ` Never synced.`,
          type: `node`
        }]
      }]);
    }
  }

  function cancelSync(syncer) {
    if (syncer.process) {
      syncer.process.stop();
    }
    syncer.canceled = true;
  }

  async function sync(syncer) {
    if (!esgst.firstInstall) {
      await setSetting(`lastSync`, Date.now());
      syncer.results.innerHTML = ``;
      syncer.progress.classList.remove(`esgst-hidden`);
      createElements(syncer.progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        type: `span`
      }]);
    }

    // if this is the user's fist time using the script, only sync steam id and stop
    if (esgst.firstInstall) {
      return;
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync groups
    if (esgst.sg && ((syncer.parameters && syncer.parameters.Groups) || (!syncer.parameters && (esgst.settings.syncGroups || syncer.autoSync)))) {
      syncer.progress.lastElementChild.textContent = `Syncing your Steam groups...`;
      syncer.groups = {};
      let savedGroups = JSON.parse(await getValue(`groups`));
      if (!Array.isArray(savedGroups)) {
        let newGroups, savedGiveaways;
        newGroups = [];
        for (let key in savedGroups) {
          newGroups.push(savedGroups[key]);
        }
        savedGroups = newGroups;
        await setValue(`groups`, JSON.stringify(savedGroups));
        savedGiveaways = JSON.parse(await getValue(`giveaways`));
        for (let key in savedGiveaways) {
          delete savedGiveaways[key].groups;
        }
        await setValue(`giveaways`, JSON.stringify(savedGiveaways));
      }
      syncer.currentGroups = {};
      for (let i = 0, n = savedGroups.length; i < n; ++i) {
        if (savedGroups[i] && savedGroups[i].member && savedGroups[i].steamId) {
          syncer.currentGroups[savedGroups[i].steamId] = savedGroups[i].name;
        }
      }
      syncer.newGroups = {};
      syncer.savedGroups = savedGroups;
      let nextPage = 1;
      let pagination = null;
      do {
        let elements, responseHtml;
        responseHtml = parseHtml((await request({method: `GET`, url: `https://www.steamgifts.com/account/steam/groups/search?page=${nextPage}`})).responseText);
        elements = responseHtml.getElementsByClassName(`table__row-outer-wrap`);
        for (let i = 0, n = elements.length; !syncer.canceled && i < n; i++) {
          let code, element, heading, name;
          element = elements[i];
          heading = element.getElementsByClassName(`table__column__heading`)[0];
          code = heading.getAttribute(`href`).match(/\/group\/(.+?)\/(.+)/)[1];
          name = heading.textContent;
          let j;
          for (j = syncer.savedGroups.length - 1; j >= 0 && syncer.savedGroups[j].code !== code; --j);
          if (j >= 0 && syncer.savedGroups[j].steamId) {
            syncer.groups[code] = {
              member: true
            };
            syncer.newGroups[syncer.savedGroups[j].steamId] = name;
          } else {
            let avatar, steamId;
            avatar = element.getElementsByClassName(`table_image_avatar`)[0].style.backgroundImage.match(/\/avatars\/(.+)_medium/)[1];
            steamId = parseHtml((await request({method: `GET`, url: `/group/${code}/`})).responseText).getElementsByClassName(`sidebar__shortcut-inner-wrap`)[0].firstElementChild.getAttribute(`href`).match(/\d+/)[0];
            syncer.groups[code] = {
              avatar: avatar,
              code: code,
              member: true,
              name: name,
              steamId: steamId
            };
            syncer.newGroups[steamId] = name;
          }
        }
        pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
        nextPage += 1;
      } while (!syncer.canceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
      await lockAndSaveGroups(syncer.groups, true);
      let missing, neww;
      missing = [];
      neww = [];
      for (let id in syncer.currentGroups) {
        if (!syncer.newGroups[id]) {
          missing.push({
            attributes: {
              href: `http://steamcommunity.com/gid/${id}`
            },
            text: syncer.currentGroups[id],
            type: `a`
          }, {
            text: `, `,
            type: `node`
          });
        }
      }
      for (let id in syncer.newGroups) {
        if (!syncer.currentGroups[id]) {
          neww.push({
            attributes: {
              href: `http://steamcommunity.com/gid/${id}`
            },
            text: syncer.newGroups[id],
            type: `a`
          }, {
            text: `, `,
            type: `node`
          });
        }
      }
      missing.pop();
      neww.pop();
      syncer.html = [];
      if (missing.length) {
        syncer.html.push({
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-bold`
            },
            text: `Missing groups:`,
            type: `span`
          }, ...missing]
        });
      }
      if (neww.length) {
        syncer.html.push({
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-bold`
            },
            text: `New groups:`,
            type: `span`
          }, ...neww]
        });
      }
      createElements(syncer.results, `afterBegin`, syncer.html);
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync whitelist and blacklist
    if (!syncer.autoSync && ((syncer.parameters && (syncer.parameters.Whitelist || syncer.parameters.Blacklist)) || (!syncer.parameters && (esgst.settings.syncWhitelist || esgst.settings.syncBlacklist)))) {
      if ((syncer.parameters && syncer.parameters.Whitelist && syncer.parameters.Blacklist) || (!syncer.parameters && esgst.settings.syncWhitelist && esgst.settings.syncBlacklist)) {
        await deleteUserValues([`whitelisted`, `whitelistedDate`, `blacklisted`, `blacklistedDate`]);
        syncer.users = [];
        syncer.progress.lastElementChild.textContent = `Syncing your whitelist...`;
        await syncWhitelistBlacklist(`whitelisted`, syncer, `https://www.steamgifts.com/account/manage/whitelist/search?page=`);
        syncer.progress.lastElementChild.textContent = `Syncing your blacklist...`;
        await syncWhitelistBlacklist(`blacklisted`, syncer, `https://www.steamgifts.com/account/manage/blacklist/search?page=`);
      } else if ((syncer.parameters && syncer.parameters.Whitelist) || (!syncer.parameters && esgst.settings.syncWhitelist)) {
        await deleteUserValues([`whitelisted`, `whitelistedDate`]);
        syncer.users = [];
        syncer.progress.lastElementChild.textContent = `Syncing your whitelist...`;
        await syncWhitelistBlacklist(`whitelisted`, syncer, `https://www.steamgifts.com/account/manage/whitelist/search?page=`);
      } else {
        await deleteUserValues([`blacklisted`, `blacklistedDate`]);
        syncer.users = [];
        syncer.progress.lastElementChild.textContent = `Syncing your blacklist...`;
        await syncWhitelistBlacklist(`blacklisted`, syncer, `https://www.steamgifts.com/account/manage/blacklist/search?page=`);
      }
      syncer.progress.lastElementChild.textContent = `Saving your whitelist/blacklist (this may take a while)...`;
      await saveUsers(syncer.users);
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync hidden games
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.HiddenGames) || (!syncer.parameters && esgst.settings.syncHiddenGames))) {
      syncer.progress.lastElementChild.textContent = `Syncing your hidden games...`;
      syncer.hiddenGames = {
        apps: [],
        subs: []
      };
      let nextPage = 1;
      let pagination = null;
      do {
        let elements, responseHtml;
        responseHtml = parseHtml((await request({method: `GET`, url: `https://www.steamgifts.com/account/settings/giveaways/filters/search?page=${nextPage}`})).responseText);
        elements = responseHtml.querySelectorAll(`.table__column__secondary-link[href*="store.steampowered.com"]`);
        for (let i = 0, n = elements.length; i < n; ++i) {
          let match = elements[i].getAttribute(`href`).match(/(app|sub)\/(\d+)/);
          if (match) {
            syncer.hiddenGames[`${match[1]}s`].push(match[2]);
          }
        }
        pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
        nextPage += 1;
      } while (!syncer.canceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
      let deleteLock = await createLock(`gameLock`, 300);
      let savedGames = JSON.parse(await getValue(`games`));
      for (let key in savedGames.apps) {
        delete savedGames.apps[key].hidden;
      }
      for (let key in savedGames.subs) {
        delete savedGames.subs[key].hidden;
      }
      for (let i = 0, n = syncer.hiddenGames.apps.length; i < n; ++i) {
        if (!savedGames.apps[syncer.hiddenGames.apps[i]]) {
          savedGames.apps[syncer.hiddenGames.apps[i]] = {};
        }
        savedGames.apps[syncer.hiddenGames.apps[i]].hidden = true;
      }
      for (let i = 0, n = syncer.hiddenGames.subs.length; i < n; ++i) {
        if (!savedGames.subs[syncer.hiddenGames.subs[i]]) {
          savedGames.subs[syncer.hiddenGames.subs[i]] = {};
        }
        savedGames.subs[syncer.hiddenGames.subs[i]].hidden = true;
      }
      await setValue(`games`, JSON.stringify(savedGames));
      deleteLock();
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync wishlisted/owned/ignored games
    if ((syncer.parameters && syncer.parameters.Games) || (!syncer.parameters && (syncer.autoSync || esgst.settings.syncGames))) {
      syncer.progress.lastElementChild.textContent = `Syncing your wishlisted/owned/ignored games...`;
      syncer.html = [];
      let apiResponse = null;
      if (esgst.steamApiKey) {
        apiResponse = await request({method: `GET`, url: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${esgst.steamApiKey}&steamid=${esgst.steamId}&format=json`});
      }
      let storeResponse = await request({method: `GET`, url: `http://store.steampowered.com/dynamicstore/userdata?${Math.random().toString().split(`.`)[1]}`});
      let deleteLock = await createLock(`gameLock`, 300);
      await syncGames(null, syncer, apiResponse, storeResponse);
      deleteLock();
      if (esgst.settings.gc_o_altAccounts) {
        for (let i = 0, n = esgst.settings.gc_o_altAccounts.length; !syncer.canceled && i < n; i++) {
          let altAccount = esgst.settings.gc_o_altAccounts[i];
          apiResponse = await request({method: `GET`, url: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${esgst.steamApiKey}&steamid=${altAccount.steamId}&format=json`});
          await syncGames(altAccount, syncer, apiResponse);
        }
        await setSetting(`gc_o_altAccounts`, esgst.settings.gc_o_altAccounts);
      }
      if (syncer.html.length) {
        createElements(syncer.results, `afterBegin`, syncer.html);
        if (esgst.getSyncGameNames) {
          getGameNames(syncer);
        }
      }
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync won games
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.WonGames) || (!syncer.parameters && esgst.settings.syncWonGames))) {
      syncer.progress.lastElementChild.textContent = `Syncing your won games...`;
      await getWonGames(`0`, syncer);
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync reduced cv games
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.ReducedCvGames) || (!syncer.parameters && esgst.settings.syncReducedCvGames))) {
      syncer.progress.lastElementChild.textContent = `Syncing reduced CV games...`;
      for (const id in esgst.games.apps) {
        esgst.games.apps[id].reducedCV = null;
      }
      for (const id in esgst.games.subs) {
        esgst.games.subs[id].reducedCV = null;
      }
      const result = JSON.parse((await request({method: `GET`, url: `https://script.google.com/macros/s/AKfycbwJK-7RBh5ghaKprEsmx4DQ6CyXc_3_9eYiOCu3yhI6W4B3W4YN/exec`})).responseText).success;
      for (const id in result.apps) {
        if (!esgst.games.apps[id]) {
          esgst.games.apps[id] = {};
        }
        esgst.games.apps[id].reducedCV = result.apps[id].reducedCV;
      }
      for (const id in result.subs) {
        if (!esgst.games.subs[id]) {
          esgst.games.subs[id] = {};
        }
        esgst.games.subs[id].reducedCV = result.subs[id].reducedCV;
      }
      await lockAndSaveGames(esgst.games);
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync no cv games
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.NoCvGames) || (!syncer.parameters && esgst.settings.syncNoCvGames))) {
      syncer.progress.lastElementChild.textContent = `Syncing no CV games...`;
      await lockAndSaveGames(JSON.parse((await request({method: `GET`, url: `https://script.google.com/macros/s/AKfycbym0nzeyr3_b93ViuiZRivkBMl9PBI2dTHQxNC0rtgeQSlCTI-P/exec`})).responseText).success);
    }

    // sync hltb times
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.HltbTimes) || (!syncer.parameters && esgst.settings.syncHltbTimes))) {
      syncer.progress.lastElementChild.textContent = `Syncing HLTB times...`;
      try {
        const responseText = (await request({
          method: `GET`,
          url: `https://script.google.com/macros/s/AKfycbysBF72c0VNylStaslLlOL7X4M0KQIgY0VVv6Q0x2vh72iGAtE/exec`
        })).responseText;
        const games = JSON.parse(responseText);
        const hltb = {};
        for (const game of games) {
          if (game.steamId) {
            hltb[game.steamId] = game;
          }
        }
        let cache = JSON.parse(getLocalValue(`gcCache`, `{ "apps": {}, "subs": {}, "hltb": {}, "timestamp": 0, "version": 6 }`));
        if (cache.version !== 6) {
          cache = {
            apps: {},
            subs: {},
            hltb: cache.hltb,
            timestamp: 0,
            version: 6
          };
        }
        cache.hltb = hltb;
        setLocalValue(`gcCache`, JSON.stringify(cache));
      } catch (e) {
        console.log(e);
      }
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync giveaways
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.Giveaways) || (!syncer.parameters && esgst.settings.syncGiveaways)) && esgst.sg) {
      syncer.progress.lastElementChild.textContent = `Syncing your giveaways...`;
      const key = `sent`;
      const user = {
        steamId: esgst.steamId,
        username: esgst.username
      };
      syncer.process = await ugd_add(null, key, user, syncer);
      await syncer.process.start();
    }

    // finish sync
    if (!esgst.firstInstall) {
      syncer.progress.lastElementChild.textContent = `Updating last sync date...`;
      let currentDate = new Date();
      const currentTime = currentDate.getTime();
      if (syncer.autoSync) {
        await setSetting(`lastSyncGroups`, currentTime);
        await setSetting(`lastSyncGames`, currentTime);
        esgst.lastSyncGroups = currentTime;
        esgst.lastSyncGames = currentTime;
      } else {
        let string = currentDate.toLocaleString();
        let keys = [`Groups`, `Whitelist`, `Blacklist`, `HiddenGames`, `Games`, `WonGames`, `ReducedCvGames`, `NoCvGames`, `HltbTimes`, `Giveaways`];
        for (let i = keys.length - 1; i > -1; i--) {
          let key = keys[i];
          let id = `sync${key}`;
          if ((syncer.parameters && syncer.parameters[key]) || (!syncer.parameters && esgst.settings[id])) {
            await setSetting(`lastSync${key}`, currentTime);
            esgst[`lastSync${key}`] = currentTime;
            if (syncer.switches && syncer.switches[id]) {
              createElements(syncer.switches[id].date, `inner`, [{
                attributes: {
                  class: `fa fa-check-circle`
                },
                type: `i`
              }, {
                text: ` Last synced ${string}`,
                type: `node`
              }]);
            }
          }
        }
      }
      createElements(syncer.progress, `inner`, [{
        text: `Synced!`,
        type: `node`
      }]);
      delLocalValue(`isSyncing`);
    }
    if (syncer.set && syncer.autoSync) {
      syncer.set.set.remove();
    }
    if (syncer.parameters && syncer.popup) {
      syncer.popup.icon.classList.remove(`fa-circle-o-notch`, `fa-spin`);
      syncer.popup.icon.classList.add(`fa-check`);
      syncer.popup.setTitle(`Sync done! You can close this popup now.`);
      syncer.popup.setDone(true);
    }
  }

  async function syncWhitelistBlacklist(key, syncer, url) {
    let nextPage = 1;
    let pagination = null;
    do {
      let elements, responseHtml;
      responseHtml = parseHtml((await request({method: `GET`, url: `${url}${nextPage}`})).responseText);
      elements = responseHtml.getElementsByClassName(`table__row-outer-wrap`);
      for (let i = 0, n = elements.length; i < n; ++i) {
        let element, user;
        element = elements[i];
        user = {
          id: element.querySelector(`[name="child_user_id"]`).value,
          username: element.getElementsByClassName(`table__column__heading`)[0].textContent,
          values: {}
        };
        user.values[key] = true;
        user.values[`${key}Date`] = parseInt(element.querySelector(`[data-timestamp]`).getAttribute(`data-timestamp`)) * 1e3;
        syncer.users.push(user);
      }
      pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
      nextPage += 1;
    } while (!syncer.canceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
  }

  async function syncGames(altAccount, syncer, apiResponse, storeResponse) {
    let apiJson = null,
      storeJson = null;
    try {
      apiJson = JSON.parse(apiResponse.responseText);
    } catch (e) { /**/ }
    try {
      storeJson = JSON.parse(storeResponse.responseText);
    } catch (e) { /**/ }
    const hasApi = apiJson && apiJson.response && apiJson.response.games &&
          apiJson.response.games.length,
        hasStore = storeJson && storeJson.rgOwnedApps && storeJson.rgOwnedApps.length;
    if (((altAccount && !esgst.steamApiKey) || (!altAccount && esgst.steamApiKey)) && !hasApi) {
      const items = {
        type: `div`,
        children: []
      };
      if (altAccount) {
        items.children.push({
          attributes: {
            class: `esgst-bold`
          },
          text: `${altAccount.name}: `,
          type: `span`
        });
      }
      items.children.push({
        text: `Unable to sync through the Steam API. Check if you have a valid Steam API key set in the settings menu.`,
        type: `node`
      });
      if (altAccount) {
        items.children.push({
          text: ` Also check the privacy settings of your alt account.`,
          type: `node`
        });
      }
      syncer.html.push(items);
    }
    if (!altAccount && !hasStore) {
      syncer.html.push({
        text: `Unable to sync through the Steam store. Check if you are logged in to Steam on your current browser session. If you are, try again later. Some games may not be available through the Steam API (if you have a Steam API key set).`,
        type: `text`
      });
    }
    console.log(hasApi, hasStore);
    if (!hasApi && !hasStore) return;

    // delete old data
    const savedGames = (altAccount && altAccount.games) || JSON.parse(await getValue(`games`)),
        oldOwned = {
      apps: [],
      subs: []
    };
    for (const id in savedGames.apps) {
      if (savedGames.apps[id].owned) {
        oldOwned.apps.push(id);
        delete savedGames.apps[id].owned;
      }
      if (hasStore) {
        delete savedGames.apps[id].wishlisted;
        delete savedGames.apps[id].ignored;
      }
      if (Object.keys(savedGames.apps[id]).length === 0) {
        delete savedGames.apps[id];
      }
    }
    if (hasStore) {
      for (const id in savedGames.subs) {
        if (savedGames.subs[id].owned) {
          oldOwned.subs.push(id);
          delete savedGames.subs[id].owned;
        }
        delete savedGames.subs[id].wishlisted;
        delete savedGames.subs[id].ignored;
        if (Object.keys(savedGames.subs[id]).length === 0) {
          delete savedGames.subs[id];
        }
      }
    }

    // add new data
    let newOwned = {
        apps: [],
        subs: []
      },
      numOwned = 0;
    if (hasApi) {
      apiJson.response.games.forEach(game => {
        const id = game.appid;
        if (!savedGames.apps[id]) {
          savedGames.apps[id] = {};
        }
        savedGames.apps[id].owned = true;
        newOwned.apps.push(id.toString());
        numOwned += 1;
      });
    }
    if (!altAccount) {
      if (hasStore) {
        [
          {
            jsonKey: `rgWishlist`,
            key: `wishlisted`,
            type: `apps`
          },
          {
            jsonKey: `rgOwnedApps`,
            key: `owned`,
            type: `apps`
          },
          {
            jsonKey: `rgOwnedPackages`,
            key: `owned`,
            type: `subs`
          },
          {
            jsonKey: `rgIgnoredApps`,
            key: `ignored`,
            type: `apps`
          },
          {
            jsonKey: `rgIgnoredPackages`,
            key: `ignored`,
            type: `subs`
          }
        ].forEach(item => {
          const key = item.key,
              type = item.type;
          storeJson[item.jsonKey].forEach(id => {
            if (!savedGames[type][id]) {
              savedGames[type][id] = {};
            }
            const value = savedGames[type][id][key];
            savedGames[type][id][key] = true;
            if (key === `owned` && !value) {
              newOwned[type].push(id.toString());
              numOwned += 1;
            }
          });
        });
      }

      if (numOwned !== (await getValue(`ownedGames`, 0))) {
        await setValue(`ownedGames`, numOwned);
      }

      // get the wishlisted dates
      try {
        const responseText = (await request({method: `GET`, url: `http://store.steampowered.com/wishlist/profiles/${esgst.steamId}?l=en`})).responseText,
            match = responseText.match(/g_rgWishlistData\s=\s(\[(.+?)\]);/);
        if (match) {
          JSON.parse(match[1]).forEach(item => {
            const id = item.appid;
            if (!savedGames.apps[id]) {
              savedGames.apps[id] = {};
            }
            savedGames.apps[id].wishlisted = item.added;
          });
        }
      } catch (e) { /**/ }

      await setValue(`games`, JSON.stringify(savedGames));
    }

    const removedOwned = {
      apps: [],
      subs: []
    };
    const addedOwned = {
      apps: [],
      subs: []
    };
    oldOwned.apps.forEach(id => {
      if (newOwned.apps.indexOf(id) < 0) {
        removedOwned.apps.push({
          attributes: {
            href: `http://store.steampowered.com/app/${id}`
          },
          text: id,
          type: `a`
        }, {
          text: `, `,
          type: `node`
        });
      }
    });
    oldOwned.subs.forEach(id => {
      if (newOwned.subs.indexOf(id) < 0) {
        removedOwned.subs.push({
          attributes: {
            href: `http://store.steampowered.com/sub/${id}`
          },
          text: id,
          type: `a`
        }, {
          text: `, `,
          type: `node`
        });
      }
    });
    newOwned.apps.forEach(id => {
      if (oldOwned.apps.indexOf(id) < 0) {
        addedOwned.apps.push({
          attributes: {
            href: `http://store.steampowered.com/app/${id}`
          },
          text: id,
          type: `a`
        }, {
          text: `, `,
          type: `node`
        });
      }
    });
    newOwned.subs.forEach(id => {
      if (oldOwned.subs.indexOf(id) < 0) {
        addedOwned.subs.push({
          attributes: {
            href: `http://store.steampowered.com/sub/${id}`
          },
          text: id,
          type: `a`
        }, {
          text: `, `,
          type: `node`
        });
      }
    });
    if (altAccount && (removedOwned.apps.length > 0 || removedOwned.subs.length > 0 || addedOwned.apps.length > 0 || addedOwned.subs.length > 0)) {
      syncer.html.push({
        type: `br`,
      }, {
        attributes: {
          class: `esgst-bold`
        },
        text: `Alt Account - ${altAccount.name}`,
        type: `div`
      }, {
        type: `br`
      });
    }
    removedOwned.apps.pop();
    removedOwned.subs.pop();
    addedOwned.apps.pop();
    addedOwned.subs.pop();
    if (removedOwned.apps.length > 0) {
      syncer.html.push({
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Removed apps:`,
          type: `span`
        }, ...removedOwned.apps]
      });
    }
    if (removedOwned.subs.length > 0) {
      syncer.html.push({
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Removed packages:`,
          type: `span`
        }, ...removedOwned.subs]
      });
    }
    if (addedOwned.apps.length > 0) {
      syncer.html.push({
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Added apps:`,
          type: `span`
        }, ...addedOwned.apps]
      });
    }
    if (addedOwned.subs.length > 0) {
      syncer.html.push({
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Added packages:`,
          type: `span`
        }, ...addedOwned.subs]
      });
    }
  }

  async function getGameNames(syncer) {
    const elements = syncer.results.getElementsByTagName(`a`);
    for (let i = elements.length - 1; i > -1; --i) {
      const element = elements[i],
          match = element.getAttribute(`href`).match(/\/(app|sub)\/(.+)/);
      if (!match) continue;
      const id = match[2],
          response = await request({method: `GET`, url: `http://store.steampowered.com/api/${match[1] === `app` ? `appdetails?appids` : `packagedetails?packageids`}=${id}&filters=basic`});
      try {
        element.textContent = JSON.parse(response.responseText)[id].data.name;
      } catch (e) {
        element.classList.add(`esgst-red`);
        element.title = `Unable to retrieve name for this game`;
      }
      await timeout(1000);
    }
  }

  async function lockAndSaveGiveaways(giveaways, firstRun) {
    if (!Object.keys(giveaways).length) return;

    let deleteLock;
    let savedGiveaways;
    if (firstRun) {
      savedGiveaways = esgst.giveaways;
    } else {
      deleteLock = await createLock(`giveawayLock`, 300),
      savedGiveaways = JSON.parse(await getValue(`giveaways`, `{}`));
    }
    for (let key in giveaways) {
      if (savedGiveaways[key]) {
        for (let subKey in giveaways[key]) {
          savedGiveaways[key][subKey] = giveaways[key][subKey];
          esgst.edited.giveaways = true;
        }
      } else {
        savedGiveaways[key] = giveaways[key];
        esgst.edited.giveaways = true;
      }
    }
    if (!firstRun) {
      await setValue(`giveaways`, JSON.stringify(savedGiveaways));
      deleteLock();
    }
  }

  async function lockAndSaveDiscussions(discussions) {
    let deleteLock = await createLock(`discussionLock`, 300),
      savedDiscussions = JSON.parse(await getValue(`discussions`, `{}`));
    for (let key in discussions) {
      if (savedDiscussions[key]) {
        for (let subKey in discussions[key]) {
          savedDiscussions[key][subKey] = discussions[key][subKey];
        }
      } else {
        savedDiscussions[key] = discussions[key];
      }
      if (!savedDiscussions[key].readComments) {
        savedDiscussions[key].readComments = {};
      }
    }
    await setValue(`discussions`, JSON.stringify(savedDiscussions));
    deleteLock();
  }

  async function lockAndSaveGroups(groups, sync) {
    const deleteLock = await createLock(`groupLock`, 300);
    let savedGroups = JSON.parse(await getValue(`groups`, `[]`));
    if (!Array.isArray(savedGroups)) {
      const newGroups = [];
      for (const key in savedGroups) {
        newGroups.push(savedGroups[key]);
      }
      savedGroups = newGroups;
    }
    if (sync) {
      for (const group of savedGroups) {
        if (group) {
          delete group.member;
        }
      }
    }
    for (const code in groups) {
      const group = groups[code];
      const savedGroup = savedGroups.filter(item => item.code === code)[0];
      if (savedGroup) {
        for (const key in group) {
          savedGroup[key] = group[key];
        }
      } else {
        savedGroup = group;
        savedGroups.push(savedGroup);
      }
      if (!savedGroup.avatar || !savedGroup.steamId) {
        const html = parseHtml((await request({method: `GET`, url: `/group/${code}/`})).responseText);
        savedGroup.avatar = html.getElementsByClassName(`global__image-inner-wrap`)[0].style.backgroundImage.match(/\/avatars\/(.+)_full/)[1];
        savedGroup.steamId = html.getElementsByClassName(`sidebar__shortcut-inner-wrap`)[0].firstElementChild.getAttribute(`href`).match(/\d+/)[0];
      }
    }
    await setValue(`groups`, JSON.stringify(savedGroups));
    deleteLock();
  }

  function lookForPopups(response) {
    const popup = parseHtml(response.responseText).querySelector(`.popup--gift-sent, .popup--gift-received`);
    if (!popup) {
      return;
    }
    document.body.appendChild(popup);
    new Popup(null, null, true, false, popup).open();
    if (!esgst.st) {
      return;
    }
    const links = popup.querySelectorAll(`a`);
    for (const link of links) {
      const url = link.getAttribute(`href`);
      if (!url) {
        continue;
      }
      link.setAttribute(`href`, url.replace(/^\//, `https://www.steamgifts.com/`));
    }
  }

  async function getWonGames(count, syncer) {
    const savedGames = JSON.parse(await getValue(`games`));
    if (syncer) {
      for (const id in savedGames.apps) {
        if (savedGames.apps[id].won) {
          savedGames.apps[id].won = null;
        }
      }
      for (const id in savedGames.subs) {
        if (savedGames.subs[id].won) {
          savedGames.subs[id].won = null;
        }
      }
    }
    let lastPage = null,
      nextPage = 1,
      pagination = null;
    do {
      if (syncer) {
        syncer.progress.lastElementChild.textContent = `Syncing your won games (page ${nextPage}${lastPage ? ` of ${lastPage}` : ``})...`;
      }
      const responseHtml = parseHtml((await request({
            method: `GET`,
            url: `/giveaways/won/search?page=${nextPage}`
          })).responseText),
          elements = responseHtml.getElementsByClassName(`table__row-outer-wrap`);
      if (!lastPage) {
        lastPage = lpl_getLastPage(responseHtml);
      }
      for (const element of elements) {
        if (element.querySelector(`.table__gift-feedback-not-received:not(.is-hidden), .table__column--gift-feedback .trigger-popup .icon-red`)) continue;
        const info = games_getInfo(element);
        if (!info) continue;
        if (!savedGames[info.type][info.id]) {
          savedGames[info.type][info.id] = {};
        }
        savedGames[info.type][info.id].won = 1;
      }
      nextPage += 1;
      pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
    } while (syncer && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
    await lockAndSaveGames(savedGames);
    setLocalValue(`wonCount`, count);
  }

  function saveAndSortContent(key, mainKey, options, callback) {
    if (callback) {
      callback();
    }
    sortContent(esgst[mainKey], mainKey, options.value);
    setSetting(key, options.value);
  }

  function observeChange(context, id, key = `value`, event = `change`) {
    context.addEventListener(event, () => {
      let value = context[key];
      setSetting(id, value);
      esgst[id] = value;
    });
  }

  function observeNumChange(context, id, key = `value`) {
    esgst[id] = parseFloat(esgst[id]);
    context.addEventListener(`change`, () => {
      let value = parseFloat(context[key]);
      setSetting(id, value);
      esgst[id] = value;
    });
  }

  async function checkMissingDiscussions(refresh, callback) {
    let savedDiscussions = JSON.parse(await getValue(`discussions`, `{}`));
    let rows = document.getElementsByClassName(`table__rows`);
    let numDiscussions = 0;
    let numDeals = 0;
    let filteredDiscussions = 0;
    let filteredDeals = 0;
    if (refresh) {
      rows[0].innerHTML = ``;
      rows[1].innerHTML = ``;
    } else {
      let preset = null;
      if (esgst.df && esgst.df_m && esgst.df_enable) {
        let name = esgst.df_preset;
        if (name) {
          let i;
          for (i = esgst.df_presets.length - 1; i > -1 && esgst.df_presets[i].name !== name; i--);
          if (i > -1) {
            preset = esgst.df_presets[i];
          }
        }
      }
      if (preset) {
        const filters = df_getFilters();
        (await discussions_get(rows[0], true)).forEach(discussion => {
          if (!filters_filterItem(`df`, filters, discussion, preset.rules)) {
            discussion.outerWrap.remove();
            filteredDiscussions += 1;
          } else {
            numDiscussions += 1;
          }
        });
        (await discussions_get(rows[1], true)).forEach(deal => {
          if (!filters_filterItem(`df`, filters, deal, preset.rules)) {
            deal.outerWrap.remove();
            filteredDeals += 1;
          } else {
            numDeals += 1;
          }
        });
      } else {
        numDiscussions = (await discussions_get(rows[0], true)).length;
        numDeals = (await discussions_get(rows[1], true)).length;
      }
    }
    if (numDiscussions < 5 || numDeals < 5) {
      let [response1, response2] = await Promise.all([request({method: `GET`, url: `/discussions`}), request({method: `GET`, url: `/discussions/deals`})]);
      let response1Html = parseHtml(response1.responseText);
      let response2Html = parseHtml(response2.responseText);
      let revisedElements = [];
      let preset = null;
      if (esgst.df && esgst.df_m && esgst.df_enable) {
        let name = esgst.df_preset;
        if (name) {
          let i;
          for (i = esgst.df_presets.length - 1; i > -1 && esgst.df_presets[i].name !== name; i--);
          if (i > -1) {
            preset = esgst.df_presets[i];
          }
        }
      }
      (await discussions_get(response1Html, true)).forEach(element => {
        if (element.category !== `Deals`) {
          revisedElements.push(element);
        }
      });
      const filters = df_getFilters();
      let i = revisedElements.length - (numDiscussions + filteredDiscussions + 1);
      while (numDiscussions < 5 && i > -1) {
        if (!preset || filters_filterItem(`df`, filters, revisedElements[i], preset.rules)) {
          setMissingDiscussion(revisedElements[i]);
          rows[0].appendChild(revisedElements[i].outerWrap);
          numDiscussions += 1;
        }
        i -= 1;
      }
      let elements = await discussions_get(response2Html, true);
      i = elements.length - (numDeals + filteredDeals + 1);
      while (numDeals < 5 && i > -1) {
        if (!preset || filters_filterItem(`df`, filters, elements[i], preset.rules)) {
          setMissingDiscussion(elements[i]);
          rows[1].appendChild(elements[i].outerWrap);
          numDeals += 1;
        }
        i -= 1;
      }
      if (esgst.adots) {
        adots_load(refresh);
      } else if (esgst.radb && !refresh) {
        radb_addButtons();
      }
      if (refresh) {
        await endless_load(esgst.activeDiscussions);
      }
      if (callback) {
        callback();
      }
    } else {
      if (esgst.adots) {
        adots_load();
      } else if (esgst.radb && !refresh) {
        radb_addButtons();
      }
      if (callback) {
        callback();
      }
    }
  }

  function loadMenu(tab) {
    let Container, SMManageFilteredUsers, SMAPIKey, popup, fixed;
    if (tab) {
      createElements(esgst.mainContext, `inner`, [{
        type: `div`
      }, {
        attributes: {
          class: `esgst-popup-scrollable`
        },
        type: `div`
      }]);
      fixed = esgst.mainContext.firstElementChild;
      Container = fixed.nextElementSibling;
    } else {
      popup = new Popup(`fa-gear`, `Settings`, true, true);
      popup.description.classList.add(`esgst-text-left`);
      fixed = popup.description;
      Container = popup.scrollable;
    }
    createElements(fixed, `afterBegin`, [{
      attributes: {
        class: `esgst-page-heading`
      },
      type: `div`
    }, {
      attributes: {
        class: `esgst-clear-container`
      },
      type: `div`,
      children: [{
        attributes: {
          placeholder: `Filter features...`,
          type: `text`
        },
        type: `input`
      }, {
        attributes: {
          class: `esgst-clear-button esgst-hidden`,
          title: `Clear`
        },
        text: `X`,
        type: `span`
      }]
    }]);
    createElements(Container, `inner`, [{
      attributes: {
        class: `esgst-settings-menu`
      },
      type: `div`
    }]);
    const input = fixed.firstElementChild.nextElementSibling.firstElementChild;
    input.addEventListener(`input`, filterSm);
    input.addEventListener(`change`, filterSm);
    setClearButton(input);
    let heading = fixed.getElementsByClassName(`esgst-page-heading`)[0];
    createSMButtons(heading, [{
      Check: true,
      Icons: [`fa-refresh`],
      Name: `esgst-heading-button`,
      Title: `Sync data`
    }, {
      Check: true,
      Icons: [`fa-sign-in esgst-rotate-90`],
      Name: `esgst-heading-button`,
      Title: `Restore data`
    }, {
      Check: true,
      Icons: [`fa-sign-out esgst-rotate-270`],
      Name: `esgst-heading-button`,
      Title: `Backup data`
    }, {
      Check: true,
      Icons: [`fa-trash`],
      Name: `esgst-heading-button`,
      Title: `Delete data`
    }, {
      Check: true,
      Icons: [`fa-gear`, `fa-arrow-circle-down`],
      Name: `esgst-heading-button`,
      Title: `Download settings (downloads your settings to your computer without your personal data so you can easily share them with other users)`
    }, {
      Check: true,
      Icons: [`fa-paint-brush`],
      Name: `esgst-heading-button`,
      Title: `Clean old data`
    }, {
      Check: true,
      Icons: [`fa-user`, `fa-history`],
      Name: `SMViewUsernameChanges esgst-heading-button`,
      Title: `View recent username changes`
    }, {
      Check: esgst.uf,
      Icons: [`fa-user`, `fa-eye-slash`],
      Name: `SMManageFilteredUsers esgst-heading-button`,
      Title: `See list of filtered users`
    }, {
      Check: esgst.sg && esgst.gf && esgst.gf_s,
      Icons: [`fa-gift`, `fa-eye-slash`],
      Name: `SMManageFilteredGiveaways esgst-heading-button`,
      Title: `Manage hidden giveaways`
    }, {
      Check: esgst.sg && esgst.df && esgst.df_s,
      Icons: [`fa-comments`, `fa-eye-slash`],
      Name: `SMManageFilteredDiscussions esgst-heading-button`,
      Title: `Manage hidden discussions`
    }, {
      Check: esgst.sg && esgst.ut,
      Icons: [`fa-user`, `fa-tags`],
      Name: `SMManageUserTags esgst-heading-button`,
      Title: `Manage user tags`
    }, {
      Check: esgst.gt,
      Icons: [`fa-gamepad`, `fa-tags`],
      Name: `SMManageGameTags esgst-heading-button`,
      Title: `Manage game tags`
    }, {
      Check: esgst.gpt,
      Icons: [`fa-users`, `fa-tags`],
      Name: `SMManageGroupTags esgst-heading-button`,
      Title: `Manage group tags`
    }, {
      Check: esgst.wbc,
      Icons: [`fa-heart`, `fa-ban`, `fa-cog`],
      Name: `esgst-wbc-button esgst-heading-button`,
      Title: `Manage Whitelist / Blacklist Checker caches`
    }, {
      Check: esgst.namwc,
      Icons: [`fa-trophy`, `fa-cog`],
      Name: `esgst-namwc-button esgst-heading-button`,
      Title: `Manage Not Activated / Multiple Wins Checker caches`
    }, {
      Check: true,
      Icons: [`fa-steam`],
      Name: `esgst-heading-button`,
      Title: `Request access to the Steam group`
    }]);
    Container.style.maxHeight = `${innerHeight - (Container.offsetTop + 69)}px`;
    let SMMenu = Container.getElementsByClassName(`esgst-settings-menu`)[0];
    let i, type;
    i = 1;
    for (type in esgst.features) {
      if (type !== `trades` || esgst.settings.esgst_st) {
        let id, j, section, title, isNew = false;
        title = type.replace(/^./, m => { return m.toUpperCase() });
        section = createMenuSection(SMMenu, null, i, title, type);
        j = 1;
        for (id in esgst.features[type].features) {
          let feature, ft;
          feature = esgst.features[type].features[id];
          if (!feature.extensionOnly || _USER_INFO.extension) {
            ft = getSMFeature(feature, id, j);
            if (ft) {
              if (ft.isNew) {
                isNew = true;
              }
              section.lastElementChild.appendChild(ft.menu);
              j += 1;
            }
          }
        }
        if (isNew) {
          createElements(section.firstElementChild.lastElementChild, `afterBegin`, [{
            attributes: {
              class: `esgst-bold esgst-red`,
              title: `There is a new feature/option in this section`
            },
            type: `span`,
            children: [{
              attributes: {
                class: `fa fa-star`
              },
              type: `i`
            }]
          }]);
        }
        i += 1;
      }
    }
    createMenuSection(SMMenu, [{
      attributes: {
        class: `esgst-steam-api-key`,
        type: `text`
      },
      type: `input`
    }, {
      attributes: {
        class: `esgst-description`
      },
      type: `div`,
      children: [{
        text: `This is optional for syncing owned games faster and required for syncing alt accounts. Get a Steam API Key `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-bold`,
          href: `https://steamcommunity.com/dev/apikey`,
          target: `_blank`
        },
        text: `here`,
        type: `a`
      }, {
        text: `. You can enter any domain in there, it is irrelevant, for example, "https://www.steamgifts.com".`,
        type: `node`
      }]
    }], i, `Steam API Key`);
    SMManageFilteredUsers = fixed.getElementsByClassName(`SMManageFilteredUsers`)[0];
    let SMManageFilteredGiveaways = fixed.getElementsByClassName(`SMManageFilteredGiveaways`)[0];
    let SMManageFilteredDiscussions = fixed.getElementsByClassName(`SMManageFilteredDiscussions`)[0];
    let SMManageUserTags = fixed.getElementsByClassName(`SMManageUserTags`)[0];
    let SMManageGameTags = fixed.getElementsByClassName(`SMManageGameTags`)[0];
    let SMManageGroupTags = fixed.getElementsByClassName(`SMManageGroupTags`)[0];
    let SMViewUsernameChanges = fixed.getElementsByClassName(`SMViewUsernameChanges`)[0];
    if (esgst.wbc) {
      wbc_addButton(null, fixed.getElementsByClassName(`esgst-wbc-button`)[0]);
    }
    if (esgst.namwc) {
      namwc_setPopup({
        button: fixed.getElementsByClassName(`esgst-namwc-button`)[0],
        isMenu: true
      });
    }
    SMAPIKey = Container.getElementsByClassName(`esgst-steam-api-key`)[0];
    let key = esgst.steamApiKey;
    if (key) {
      SMAPIKey.value = key;
    }
    heading.firstElementChild.addEventListener(`click`, async () => {
      heading.firstElementChild.classList.add(`esgst-busy`);
      await checkSync(true, true);
      heading.firstElementChild.classList.remove(`esgst-busy`);
    });
    heading.firstElementChild.nextElementSibling.addEventListener(`click`, loadDataManagement.bind(null, false, `import`, null));
    heading.firstElementChild.nextElementSibling.nextElementSibling.addEventListener(`click`, loadDataManagement.bind(null, false, `export`, null));
    heading.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.addEventListener(`click`, loadDataManagement.bind(null, false, `delete`, null));
    heading.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.addEventListener(`click`, exportSettings);
    heading.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.addEventListener(`click`, loadDataCleaner);
    if (esgst.groups) {
      for (i = esgst.groups.length - 1; i > -1 && esgst.groups[i].steamId !== `103582791461018688`; i--);
      if (i < 0 || !esgst.groups[i] || !esgst.groups[i].member) {
        heading.lastElementChild.addEventListener(`click`, requestGroupInvite);
      } else {
        heading.lastElementChild.classList.add(`esgst-hidden`);
      }
    } else {
      heading.lastElementChild.classList.add(`esgst-hidden`);
    }
    if (SMManageUserTags) {
      SMManageUserTags.addEventListener(`click`, openManageUserTagsPopup);
    }
    if (SMManageGameTags) {
      SMManageGameTags.addEventListener(`click`, openManageGameTagsPopup);
    }
    if (SMManageGroupTags) {
      SMManageGroupTags.addEventListener(`click`, openManageGroupTagsPopup);
    }
    if (SMManageFilteredUsers) {
      setSMManageFilteredUsers(SMManageFilteredUsers);
    }
    if (SMManageFilteredGiveaways) {
      setSMManageFilteredGiveaways(SMManageFilteredGiveaways);
    }
    if (SMManageFilteredDiscussions) {
      SMManageFilteredDiscussions.addEventListener(`click`, df_menu.bind(null, {}));
    }
    if (SMViewUsernameChanges) {
      setSMRecentUsernameChanges(SMViewUsernameChanges);
    }
    SMAPIKey.addEventListener(`input`, () => {
      setSetting(`steamApiKey`, SMAPIKey.value);
    });
    if (!tab) {
      popup.open();
      if (esgst.firstInstall) {
        let pp = new Popup(`fa-check`, `Getting Started`, true);
        createElements(pp.scrollable, `inner`, [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Here are some things you should know to help you get started:`,
          type: `div`
        }, {
          type: `br`
        }, {
          attributes: {
            class: `markdown`
          },
          type: `div`,
          children: [{
            type: `ul`,
            children: [{
              type: `li`,
              children: [{
                text: `Bugs and suggestions should be reported on the `,
                type: `node`
              }, {
                attributes: {
                  href: `https://github.com/revilheart/ESGST/issues`
                },
                text: `GitHub page`,
                type: `a`
              }, {
                text: `.`,
                type: `node`
              }]
            }, {
              type: `Make sure you backup your data using the backup button at the top of the menu every once in a while to prevent any data loss that might occur. It's also probably a good idea to disable automatic updates, since ESGST is in constant development.`,
              type: `node`
            }, {
              type: `li`,
              children: [{
                text: `Hover over the `,
                type: `node`
              }, {
                attributes: {
                  class: `fa fa-question-circle`
                },
                type: `i`
              }, {
                text: ` icon next to each option that has it to learn more about it and how to use it. Some options are currently missing documentation, so feel free to ask about them in the official ESGST thread.`,
                type: `node`
              }]
            }, {
              type: `li`,
              children: [{
                text: `Some features rely on sync to work properly. These features have a `,
                type: `node`
              }, {
                attributes: {
                  class: `fa fa-refresh esgst-negative`
                },
                type: `i`
              }, {
                text: ` icon next to their names, and when you hover over the icon you can see what type of data you have to sync. You should sync often to keep your data up-to-date. ESGST offers an option to automatically sync your data for you every amount of days so you don't have to do it manually. To enable the automatic sync, simply go to the sync section of the menu (section 1) and select the number of days in the dropdown.`,
                type: `node`
              }]
            }, {
              type: `li`,
              children: [{
                text: `ESGST uses 2 terms to define a window opened in the same page: `,
                type: `node`
              }, {
                text: `popout`,
                type: `strong`
              }, {
                text: ` is when the window opens up, down, left or right from the element you clicked/hovered over (like the one you get with the description of the features) and `,
                type: `node`
              }, {
                text: `popup`,
                type: `strong`
              }, {
                text: ` is when the window opens in the center of the screen with a modal background behind it (like this one).`,
                type: `node`
              }]
            }, {
              text: `That's all for now, you can close this.`,
              type: `li`
            }]
          }]
        }]);
        pp.open();
        esgst.firstInstall = false;
      }
    }
  }

  function openPathsPopup(feature, id, name) {
    let obj = {
      excludeItems: [],
      includeItems: [],
      name: name,
      popup: new Popup(`fa-gear`, `[${name.toUpperCase()}] ${feature.name}`)
    };
    obj.popup.description.classList.add(`esgst-text-left`);
    obj.include = createElements(obj.popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-bold`
      },
      type: `div`,
      children: [{
        text: `Include: `,
        type: `node`
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `Enter the paths where you want the feature to run here. You need to use regular expressions, so if you are not familiar with them, just to go to the page where you want the feature to run and click 'Add Current'. '.*' means that the feature runs everywhere possible.`
        },
        type: `i`
      }]
    }, {
      type: `div`
    }]);
    let group = createElements(obj.popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-button-group`
      },
      type: `div`
    }]);
    group.appendChild(new ButtonSet_v2({color1: `grey`, color2: ``, icon1: `fa-plus-circle`, icon2: ``, title1: `Add New`, title2: ``, callback1: addPath.bind(null, `include`, obj, {enabled: 1, pattern: ``})}).set);
    group.appendChild(new ButtonSet_v2({color1: `grey`, color2: ``, icon1: `fa-plus-circle`, icon2: ``, title1: `Add Current`, title2: ``, callback1: addPath.bind(null, `include`, obj, {enabled: 1, pattern: `^${escapeRegExp(location.href.match(/\/($|giveaways(?!.*(new|wishlist|created|entered|won)))/) ? `/($|giveaways(?!.*(new|wishlist|created|entered|won)))` : location.pathname)}${escapeRegExp(location.search)}`})}).set);
    obj.exclude = createElements(obj.popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-bold`
      },
      type: `div`,
      children: [{
        text: `Exclude: `,
        type: `node`
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `Enter the paths where you do not want the feature to run here. This acts as an exception to the included paths, as in, the feature will run in every included path, except for the excluded paths. You need to use regular expressions, so if you are not familiar with them, just to go to the page where you do not want the feature to run and click 'Add Current'.`
        },
        type: `i`
      }]
    }, {
      type: `div`
    }]);
    group = createElements(obj.popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-button-group`
      },
      type: `div`
    }]);
    group.appendChild(new ButtonSet_v2({color1: `grey`, color2: ``, icon1: `fa-plus-circle`, icon2: ``, title1: `Add New`, title2: ``, callback1: addPath.bind(null, `exclude`, obj, {enabled: 1, pattern: ``})}).set);
    group.appendChild(new ButtonSet_v2({color1: `grey`, color2: ``, icon1: `fa-plus-circle`, icon2: ``, title1: `Add Current`, title2: ``, callback1: addPath.bind(null, `exclude`, obj, {enabled: 1, pattern: `^${escapeRegExp(location.pathname)}${escapeRegExp(location.search)}`})}).set);
    obj.popup.description.appendChild(new ButtonSet_v2({color1: `green`, color2: `grey`, icon1: `fa-check-circle`, icon2: `fa-circle-o-notch fa-spin`, title1: `Save`, title2: `Saving...`, callback1: savePaths.bind(null, id, obj)}).set);
    obj.setting = getFeaturePath(feature, id, obj.name);
    obj.setting.include.forEach(path => addPath(`include`, obj, path));
    obj.setting.exclude.forEach(path => addPath(`exclude`, obj, path));
    obj.popup.open();
  }

  function addPath(key, obj, path) {
    let item = {};
    item.container = createElements(obj[key], `beforeEnd`, [{
      type: `div`
    }]);
    item.switch = new ToggleSwitch(item.container, null, true, ``, false, false, null, path.enabled);
    item.input = createElements(item.container, `beforeEnd`, [{
      attributes: {
        class: `esgst-switch-input esgst-switch-input-large`,
        type: `text`
      },
      type: `input`
    }]);
    item.input.value = path.pattern;
    item.input.addEventListener(`input`, validatePathRegex.bind(null, item));
    createElements(item.container, `beforeEnd`, [{
      attributes: {
        class: `fa fa-times-circle esgst-clickable`,
        title: `Remove`
      },
      type: `i`
    }]).addEventListener(`click`, removePath.bind(null, item, key, obj));
    item.invalid = createElements(item.container, `beforeEnd`, [{
      attributes: {
        class: `fa fa-exclamation esgst-hidden esgst-red`,
        title: `Invalid Regular Expression`
      },
      type: `i`
    }]);
    obj[`${key}Items`].push(item);
    item.input.focus();
  }

  function removePath(item, key, obj) {
    let i = obj[`${key}Items`].length - 1;
    if (i === 0 && key === `include`) {
        alert(`At least 1 include path is required!`);
      return;
    }
    while (i > -1 && obj[`${key}Items`][i].input.value !== item.input.value) i--;
    if (i > -1) {
      obj[`${key}Items`].splice(i, 1);
    }
    item.container.remove();
  }

  function validatePathRegex(item) {
    item.invalid.classList.add(`esgst-hidden`);
    try {
      new RegExp(item.input.value);
    } catch (error) {
      console.log(error);
      item.invalid.classList.remove(`esgst-hidden`);
    }
  }

  function savePaths(id, obj) {
    obj.setting.include = [];
    obj.setting.exclude = [];
    for (let i = 0, n = obj.includeItems.length; i < n; i++) {
      obj.setting.include.push({enabled: obj.includeItems[i].switch.value ? 1 : 0, pattern: obj.includeItems[i].input.value});
    }
    for (let i = 0, n = obj.excludeItems.length; i < n; i++) {
      obj.setting.exclude.push({enabled: obj.excludeItems[i].switch.value ? 1 : 0, pattern: obj.excludeItems[i].input.value});
    }
    obj.popup.close();
    setSetting(`${id}_${obj.name}`, obj.setting);
  }

  function dismissNewOption(id, event) {
    event.currentTarget.remove();
    if (esgst.dismissedOptions.indexOf(id) < 0) {
      esgst.dismissedOptions.push(id);
      setSetting(`dismissedOptions`, esgst.dismissedOptions);
    }
  }

  function getSMFeature(Feature, ID, aaa) {
    let Menu, SMFeatures, isMainNew = false;
    Menu = document.createElement(`div`);
    Menu.id = `esgst_${ID}`;
    createElements(Menu, `beforeEnd`, [{
      attributes: {
        class: `esgst-sm-small-number esgst-form-heading-number`
      },
      text: `${aaa}.`,
      type: `div`
    }]);
    let val, val1, val2;
    let siwtchSg, siwtchSt, set1, set2;
    if (Feature.sg) {
      set1 = getFeaturePath(Feature, ID, `sg`);
      val1 = set1.enabled;
      siwtchSg = new ToggleSwitch(Menu, ID, true, esgst.settings.esgst_st ? `[SG]` : ``, true, false, null, val1);
      createElements(Menu, `beforeEnd`, [{
        attributes: {
          class: `fa fa-gear esgst-clickable`,
          title: `Customize where the feature runs`
        },
        type: `i`
      }]).addEventListener(`click`, openPathsPopup.bind(null, Feature, ID, `sg`));
      if (Feature.conflicts) {
        siwtchSg.onEnabled = () => {
          for (let ci = 0, cn = Feature.conflicts.length; ci < cn; ++ci) {
            let setting = esgst.settings[`${Feature.conflicts[ci].id}_sg`];
            if ((setting.include && setting.enabled) || (!setting.include && setting)) {
              siwtchSg.disable();
              new Popup(`fa-exclamation`, `This feature conflicts with ${Feature.conflicts[ci].name}. While that feature is enabled, this feature cannot be enabled.`, true).open();
              ci = cn;
            }
          }
          if (Feature.theme && SMFeatures) {
            if (ID === `customTheme`) {
              setTheme();
            } else {
              SMFeatures.firstElementChild.lastElementChild.previousElementSibling.click();
            }
          }
        }
      } else if (Feature.theme) {
        siwtchSg.onEnabled = () => {
          if (SMFeatures) {
            if (ID === `customTheme`) {
              setTheme();
            } else {
              SMFeatures.firstElementChild.lastElementChild.previousElementSibling.click();
            }
          }
        }
      }
      if (Feature.theme) {
        siwtchSg.onDisabled = () => {
          if (ID === `customTheme`) {
            delLocalValue(`customTheme`);
          } else {
            delLocalValue(`theme`);
            delValue(ID);
          }
          setTheme();
        };
      }
    }
    if (Feature.st && (esgst.settings.esgst_st || ID === `esgst`)) {
      set2 = getFeaturePath(Feature, ID, `st`);
      val2 = set2.enabled;
      siwtchSt = new ToggleSwitch(Menu, ID, true, `[ST]`, false, true, null, val2);
      createElements(Menu, `beforeEnd`, [{
        attributes: {
          class: `fa fa-gear esgst-clickable`,
          title: `Customize where the feature runs`
        },
        type: `i`
      }]).addEventListener(`click`, openPathsPopup.bind(null, Feature, ID, `st`));
      if (Feature.conflicts) {
        siwtchSt.onEnabled = () => {
          for (let ci = 0, cn = Feature.conflicts.length; ci < cn; ++ci) {
            let setting = esgst.settings[`${Feature.conflicts[ci].id}_st`];
            if ((setting.include && setting.enabled) || (!setting.include && setting)) {
              siwtchSt.disable();
              new Popup(`fa-exclamation`, `This feature conflicts with ${Feature.conflicts[ci].name}. While that feature is enabled, this feature cannot be enabled.`, true).open();
              ci = cn;
            }
          }
          if (Feature.theme && SMFeatures) {
            if (ID === `customTheme`) {
              setTheme();
            } else {
              SMFeatures.firstElementChild.lastElementChild.previousElementSibling.click();
            }
          }
        }
      } else if (Feature.theme) {
        siwtchSt.onEnabled = () => {
          if (SMFeatures) {
            if (ID === `customTheme`) {
              setTheme();
            } else {
              SMFeatures.firstElementChild.lastElementChild.previousElementSibling.click();
            }
          }
        }
      }
      if (Feature.theme) {
        siwtchSt.onDisabled = () => {
          if (ID !== `customTheme`) {
            delValue(ID);
          }
          setTheme();
        };
      }
    }
    if (!siwtchSg && !siwtchSt) {
      Menu.lastElementChild.remove();
      return null;
    }
    isMainNew = esgst.dismissedOptions.indexOf(ID) < 0 && (!set1 || set1.new) && (!set2 || set2.new);
    if (isMainNew) {
      createElements(Menu.firstElementChild, `afterEnd`, [{
        attributes: {
          class: `esgst-bold esgst-red esgst-clickable`,
          title: `This is a new feature/option. Click to dismiss.`
        },
        text: `[NEW]`,
        type: `span`
      }]).addEventListener(`click`, dismissNewOption.bind(null, ID));
    }
    val = val1 || val2;
    createElements(Menu, `beforeEnd`, [{
      text: typeof Feature.name === `string` ? `${esgst.settings.esgst_st ? `- ` : ``}${Feature.name} ` : ``,
      type: `span`,
      children: typeof Feature.name === `string` ? null : [esgst.settings.esgst_st ? {
        text: `- `,
        type: `node`
      } : null,
        ...Feature.name
      ]
    }, ...(Feature.features ? [{
      attributes: {
        class: `fa fa-ellipsis-h`,
        title: `This option has sub-options`
      },
      type: `i`
    }] : [null]), ...(Feature.sync ? [{
      attributes: {
        class: `esgst-negative fa fa-refresh`,
        title: `This feature requires ${Feature.sync} data to be synced (section 1 of this menu)`
      },
      type: `i`
    }] : [null]), ...(Feature.description ? [{
      attributes: {
        class: `fa fa-question-circle esgst-clickable`
      },
      type: `i`
    }] : [null]), {
      attributes: {
        class: `esgst-form-row-indent SMFeatures esgst-hidden`
      },
      type: `div`
    }]);
    SMFeatures = Menu.lastElementChild;
    if (Feature.description) {
      let popout = null;
      let tooltip = SMFeatures.previousElementSibling;
      tooltip.addEventListener(`mouseenter`, () => {
        if (popout) {
          popout.open(tooltip);
        } else {
          popout = new Popout(`esgst-feature-description markdown`, tooltip, 100);
          popout.popout.style.maxHeight = `300px`;
          popout.popout.style.overflow = `auto`;
          createElements(popout.popout, `inner`, [...(Array.from(parseHtml(Feature.description.replace(/\[id=(.+?)\]/g, getFeatureName)).body.childNodes).map(x => {
            return {
              context: x
            };
          }))]);
          popout.open(tooltip);
        }
      });
    }
    if (Feature.features) {
      let ft, i, id, isNew = false;
      i = 1;
      for (id in Feature.features) {
        if (!Feature.features[id].extensionOnly || _USER_INFO.extension) {
          ft = getSMFeature(Feature.features[id], id, i);
          if (ft) {
            if (ft.isNew) {
              isNew = true;
            }
            SMFeatures.appendChild(ft.menu);
            i += 1;
          }
        }
      }
      if (siwtchSg) {
        siwtchSg.dependencies.push(SMFeatures);
      }
      if (siwtchSt) {
        siwtchSt.dependencies.push(SMFeatures);
      }
      if (val) {
        SMFeatures.classList.remove(`esgst-hidden`);
      }
      isMainNew = isMainNew || isNew;
      if (isNew) {
        createElements(Menu.firstElementChild, `afterEnd`, [{
          attributes: {
            class: `esgst-bold esgst-red`,
            title: `There is a new feature/option in this section`
          },
          type: `span`,
          children: [{
            attributes: {
              class: `fa fa-star`
            },
            type: `i`
          }]
        }]);
      }
    }
    if (ID === `gc`) {
      addGcCategoryPanel(SMFeatures, `gc_categories`);
      if (esgst.gv) {
        addGcCategoryPanel(SMFeatures, `gc_categories_gv`);
      }
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `gch`) {
      addGwcrMenuPanel(SMFeatures, `gch_colors`, `copies`, true);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `gwc`) {
      addGwcrMenuPanel(SMFeatures, `gwc_colors`, `chance`);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `gwr`) {
      addGwcrMenuPanel(SMFeatures, `gwr_colors`, `ratio`);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `gptw`) {
      addGwcrMenuPanel(SMFeatures, `gptw_colors`, `points to win`);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `geth`) {
      addGwcrMenuPanel(SMFeatures, `geth_colors`, `hours`);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `gc_r`) {
      addGcRatingPanel(SMFeatures);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `gc_o_a`) {
      addGcAltMenuPanel(SMFeatures);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `lockGiveawayColumns`) {
      let select = createElements(SMFeatures, `beforeEnd`, [{
        attributes: {
          class: `esgst-sm-colors`,
        },
        type: `div`,
        children: [{
          text: `Select an option below and click on the button to reset the order:`,
          type: `node`
        }, {
          type: `br`
        }, {
          type: `select`,
          children: [{
            attributes: {
              value: `giveawayColumns`
            },
            text: `Giveaway Columns [${esgst.giveawayColumns.join(`, `)}]`,
            type: `option`
          }, {
            attributes: {
              value: `giveawayPanel`
            },
            text: `Giveaway Panel [${esgst.giveawayPanel.join(`, `)}]`,
            type: `option`
          }, {
            attributes: {
              value: `giveawayColumns_gv`
            },
            text: `Giveaway Columns (Grid View) [${esgst.giveawayColumns_gv.join(`, `)}]`,
            type: `option`
          }, {
            attributes: {
              value: `giveawayPanel_gv`
            },
            text: `Giveaway Panel (Grid View) [${esgst.giveawayPanel_gv.join(`, `)}]`,
            type: `option`
          }]
        }, {
          type: `br`
        }, {
          attributes: {
            class: `form__saving-button esgst-sm-colors-default`
          },
          text: `Reset Order`,
          type: `div`
        }]
      }]).firstElementChild.nextElementSibling;
      select.nextElementSibling.nextElementSibling.addEventListener(`click`, resetOrder.bind(null, select));
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (Feature.colors || Feature.background) {
      let color = esgst[`${ID}_color`];
      let bgColor = esgst[`${ID}_bgColor`];
      createElements(SMFeatures, `beforeEnd`, [{
        attributes: {
          class: `esgst-sm-colors`
        },
        type: `div`,
        children: [...(Feature.background ? [null] : [{
          text: `Text: `,
          type: `node`
        }, {
          attributes: {
            type: `color`,
            value: color
          },
          type: `input`
        }]), {
          text: `Background: `,
          type: `node`
        }, {
          attributes: {
            type: `color`,
            value: bgColor
          },
          type: `input`
        }, {
          attributes: {
            class: `form__saving-button esgst-sm-colors-default`
          },
          text: `Use Default`,
          type: `div`
        }]
      }]);
      let colorContext = SMFeatures.lastElementChild.firstElementChild;
      let bgColorContext = Feature.background ? colorContext : colorContext.nextElementSibling;
      if (!Feature.background) {
        addColorObserver(colorContext, ID, `color`);
      }
      addColorObserver(bgColorContext, ID, `bgColor`);
      bgColorContext.nextElementSibling.addEventListener(`click`, resetColor.bind(null, bgColorContext, Feature.background ? null : colorContext, ID));
      if (ID === `gc_g`) {
        let input = createElements(SMFeatures, `beforeEnd`, [{
          attributes: {
            class: `esgst-sm-colors`
          },
          type: `div`,
          children: [{
            text: `Only show the following genres: `,
            type: `node`
          }, {
            attributes: {
              type: `text`,
              value: esgst.gc_g_filters
            },
            type: `input`
          }, {
            attributes: {
              class: `fa fa-question-circle`,
              title: `If you enter genres here, a genre category will only appear if the game has the listed genre. Separate genres with a comma, for example: Genre1, Genre2`
            },
            type: `i`
          }]
        }]);
        observeChange(input.firstElementChild, `gc_g_filters`);
        addGcMenuPanel(SMFeatures);
      }
      if (Feature.input) {
        let input = createElements(SMFeatures, `beforeEnd`, [{
          attributes: {
            class: `esgst-sm-colors`
          },
          type: `div`,
          children: [{
            text: `Icon: `,
            type: `node`
          }, {
            attributes: {
              type: `text`,
              value: esgst[`${ID}Icon`]
            },
            type: `input`
          }, {
            attributes: {
              class: `esgst-clickable fa fa-question-circle`
            },
            type: `i`
          }, {
            type: `br`
          }, {
            text: `Label: `,
            type: `node`
          }, {
            attributes: {
              type: `text`,
              value: esgst[`${ID}Label`]
            },
            type: `input`
          }]
        }]);
        createTooltip(input.firstElementChild.nextElementSibling, `The name of the icon must be any name in this page: <a href="https://fontawesome.com/v4.7.0/icons/">https://fontawesome.com/v4.7.0/icons/</a>`);
        let icon = input.firstElementChild;
        let label = input.lastElementChild;
        observeChange(icon, `${ID}Icon`);
        observeChange(label, `${ID}Label`);
        if (ID === `gc_rd`) {
          createElements(input, `beforeEnd`, [{
            attributes: {
              class: `fa fa-question-circle`,
              title: `Enter the date format here, using the following keywords:\n\nDD - Day\nMM - Month in numbers (i.e. 1)\nMon - Month in short name (i.e. Jan)\nMonth - Month in full name (i.e. January)\nYYYY - Year`
            },
            type: `i`
          }]);
        }
      }
      if (siwtchSg) {
        siwtchSg.dependencies.push(SMFeatures);
      }
      if (siwtchSt) {
        siwtchSt.dependencies.push(SMFeatures);
      }
      if (val) {
        SMFeatures.classList.remove(`esgst-hidden`);
      }
    } else if (Feature.inputItems) {
      let container = createElements(SMFeatures, `beforeEnd`, [{
        attributes: {
          class: `esgst-sm-colors`
        },
        type: `div`
      }]);
      if (ID.match(/^(chfl|sk_)/)) {
        Feature.inputItems = [
          {
            event: `keydown`,
            id: Feature.inputItems,
            shortcutKey: true,
            prefix: `Enter the key combo you want to use for this task: `
          }
        ]
      } else if (ID.match(/^hr_.+_s$/)) {
        Feature.inputItems = [
          {
            id: `${ID}_sound`,
            play: true
          }
        ];
      }
      Feature.inputItems.forEach(item => {
        const children = [];
        if (item.play) {
          children.push({
            attributes: {
              style: `width: 200px`,
              type: `file`
            },
            type: `input`
          }, {
            attributes: {
              class: `fa fa-play-circle esgst-clickable`
            },
            type: `i`
          });
        } else {
          children.push({
            text: item.prefix || ``,
            type: `node`
          }, {
            attributes: {
              class: `esgst-switch-input esgst-switch-input-large`,
              type: `text`,
              value: esgst[item.id]
            },
            type: `input`
          }, {
            text: item.suffix || ``,
            type: `node`
          });
          if (item.tooltip) {
            children.push({
              attributes: {
                class: `fa fa-question-circle`,
                title: item.tooltip
              },
              type: `i`
            });
          }
        }
        let input,
          value = ``,
          context = createElements(container, `beforeEnd`, [{
            type: `div`,
            children
          }]);
        input = context.firstElementChild;
        if (item.play) {
          input.nextElementSibling.addEventListener(`click`, async () => (await hr_createPlayer(esgst.settings[item.id] || hr_getDefaultSound())).play());
        }
        if (typeof esgst.settings[item.id] === `undefined` && esgst.dismissedOptions.indexOf(item.id) < 0) {
          isMainNew = true;
          createElements(context, `afterBegin`, [{
            attributes: {
              class: `esgst-bold esgst-red esgst-clickable`,
              title: `This is a new feature/option. Click to dismiss.`
            },
            text: `[NEW]`,
            type: `span`
          }]).addEventListener(`click`, dismissNewOption.bind(null, item.id));
        }
        input.addEventListener(item.event || `change`, event => {
          if (item.shortcutKey) {
            event.preventDefault();
            event.stopPropagation();
            if (!event.repeat) {
              value = ``;
              if (event.ctrlKey) {
                value += `ctrlKey + `;
              } else if (event.shiftKey) {
                value += `shiftKey + `;
              } else if (event.altKey) {
                value += `altKey + `;
              }
              value += event.key.toLowerCase();
            }
          } else if (item.play) {
            readHrAudioFile(ID, event);
          } else if (item.event === `keydown`) {
            event.preventDefault();
            setSetting(item.id, event.key);
            esgst[item.id] = event.key;
            input.value = event.key;
          } else {
            setSetting(item.id, input.value);
            esgst[item.id] = input.value;
          }
        }, item.shortcutKey || false);
        if (item.shortcutKey) {
          input.addEventListener(`keyup`, () => {
            setSetting(item.id, value);
            esgst[item.id] = value;
            input.value = value;
          });
        }
      });
      if (siwtchSg) {
        siwtchSg.dependencies.push(SMFeatures);
      }
      if (siwtchSt) {
        siwtchSt.dependencies.push(SMFeatures);
      }
      if (val) {
        SMFeatures.classList.remove(`esgst-hidden`);
      }
    } else if (Feature.theme) {
      const children = [{
        text: `Enabled from `,
        type: `node`
      }, {
        attributes: {
          type: `text`,
          value: esgst[`${ID}_startTime`]
        },
        type: `input`
      }, {
        text: ` to `,
        type: `node`
      }, {
        attributes: {
          type: `text`,
          value: esgst[`${ID}_endTime`]
        },
        type: `input`
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `You can specify here what time of the day you want the theme to be enabled. Use the HH:MM format.`
        },
        type: `i`
      }, {
        type: `br`
      }];
      if (ID === `customTheme`) {
        children.push({
          type: `textarea`
        });
      } else {
        children.push({
          attributes: {
            class: `form__saving-button esgst-sm-colors-default`
          },
          text: `Update`,
          type: `div`
        }, {
          type: `span`
        });
      }
      let container = createElements(SMFeatures, `beforeEnd`, [{
          attributes: {
            class: `esgst-sm-colors`
          },
          type: `div`,
          children
        }]),
        startTime = container.firstElementChild,
        endTime = startTime.nextElementSibling;
      observeChange(startTime, `${ID}_startTime`);
      observeChange(endTime, `${ID}_endTime`);
      if (ID === `customTheme`) {
        let textArea = container.lastElementChild;
        getValue(ID).then(value => {
          if (!value) return;
          textArea.value = JSON.parse(value);
        });
        textArea.addEventListener(`change`, async () => {
          await setValue(ID, JSON.stringify(textArea.value));
          setTheme();
        });
      } else {
        let version = container.lastElementChild,
          button = version.previousElementSibling;
        setThemeVersion(ID, version);
        button.addEventListener(`click`, async () => {
          let url = await getThemeUrl(ID, Feature.theme);
          createElements(button, `inner`, [{
            attributes: {
              class: `fa fa-circle-o-notch fa-spin`
            },
            type: `i`
          }, {
            text: ` Updating...`,
            type: `node`
          }]);
          let theme = JSON.stringify((await request({method: `GET`, url})).responseText);
          await setValue(ID, theme);
          createElements(button, `inner`, [{
            text: `Update`,
            type: `node`
          }]);
          setThemeVersion(ID, version, theme);
          setTheme();
        });
      }
      if (siwtchSg) {
        siwtchSg.dependencies.push(SMFeatures);
      }
      if (siwtchSt) {
        siwtchSt.dependencies.push(SMFeatures);
      }
      if (val) {
        SMFeatures.classList.remove(`esgst-hidden`);
      }
    }
    if (Feature.options) {
      const [key, options] = Array.isArray(Feature.options) ? [`_index_*`, Feature.options] : [`_index`, [Feature.options]];
      for (const [index, option] of options.entries()) {
        const currentKey = key.replace(/\*/, index);
        const selectedIndex = esgst[`${ID}${currentKey}`];
        const children = [];
        for (const value of option.values) {
          children.push({
            text: value,
            type: `option`
          });
        }
        const select = createElements(SMFeatures, `beforeEnd`, [{
          attributes: {
            class: `esgst-sm-colors`
          },
          type: `div`,
          children: [{
            text: option.title,
            type: `node`
          }, {
            type: `select`,
            children
          }]
        }]);
        select.firstElementChild.selectedIndex = selectedIndex;
        observeNumChange(select.firstElementChild, `${ID}${currentKey}`, `selectedIndex`);
      }
      if (siwtchSg) {
        siwtchSg.dependencies.push(SMFeatures);
      }
      if (siwtchSt) {
        siwtchSt.dependencies.push(SMFeatures);
      }
      if (val) {
        SMFeatures.classList.remove(`esgst-hidden`);
      }
    }
    return {
      isNew: isMainNew,
      menu: Menu
    };
  }

  function addGcCategoryPanel(context, categoryKey) {
    let elements = [];
    for (let i = 0, n = esgst[categoryKey].length; i < n; i++) {
      switch (esgst[categoryKey][i]) {
        case `gc_fcv`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-fullCV ${esgst.gc_fcv ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_fcv`,
              title: `Full CV`
            },
            text: esgst.gc_fcv_s ? (esgst.gc_fcv_s_i ? `` : `FCV`) : esgst.gc_fcvLabel,
            type: `div`,
            children: esgst.gc_fcv_s && esgst.gc_fcv_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_fcvIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_rcv`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-reducedCV ${esgst.gc_rcv ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_rcv`,
              title: `Reduced CV`
            },
            text: esgst.gc_rcv_s ? (esgst.gc_rcv_s_i ? `` : `RCV`) : esgst.gc_rcvLabel,
            type: `div`,
            children: esgst.gc_rcv_s && esgst.gc_rcv_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_rcvIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_ncv`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-noCV ${esgst.gc_ncv ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_ncv`,
              title: `No CV`
            },
            text: esgst.gc_ncv_s ? (esgst.gc_ncv_s_i ? `` : `NCV`) : esgst.gc_ncvLabel,
            type: `div`,
            children: esgst.gc_ncv_s && esgst.gc_ncv_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_ncvIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_hltb`:        
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-hltb ${esgst.gc_hltb ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_hltb`,
              title: `HLTB`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `fa fa-gamepad`
              },
              type: `i`
            }, {
              text: `0h`,
              type: `node`
            }]
          });
          break;
        case `gc_h`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-hidden ${esgst.gc_h ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_h`,
              title: `Hidden`
            },
            text: esgst.gc_h_s ? (esgst.gc_h_s_i ? `` : `H`) : esgst.gc_hLabel,
            type: `div`,
            children: esgst.gc_h_s && esgst.gc_h_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_hIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_i`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-ignored ${esgst.gc_i ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_i`,
              title: `Ignored`
            },
            text: esgst.gc_i_s ? (esgst.gc_i_s_i ? `` : `I`) : esgst.gc_iLabel,
            type: `div`,
            children: esgst.gc_i_s && esgst.gc_i_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_iIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_o`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-owned ${esgst.gc_o ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_o`,
              title: `Owned`
            },
            text: esgst.gc_o_s ? (esgst.gc_o_s_i ? `` : `O`) : esgst.gc_oLabel,
            type: `div`,
            children: esgst.gc_o_s && esgst.gc_o_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_oIcon}`
              },
              type: `i`
            }] : null
          });
          esgst.gc_o_altAccounts.forEach(account => {
            elements.push({
              attributes: {
                class: `esgst-clickable esgst-gc esgst-gc-owned ${esgst.gc_o_a ? `` : `esgst-hidden`}`,
                draggable: true,
                id: `gc_o`,
                style: `background-color: ${account.bgColor}; color: ${account.color};`,
                title: `Owned by ${account.name}`
              },
              text: esgst.gc_o_s ? (esgst.gc_o_s_i ? `` : `O`) : account.label,
              type: `div`,
              children: esgst.gc_o_s && esgst.gc_o_s_i ? [{
                attributes: {
                  class: `fa fa-${account.icon}`
                },
                type: `i`
              }] : null
            });
          });
          break;
        case `gc_w`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-wishlisted ${esgst.gc_w ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_w`,
              title: `Wishlisted`
            },
            text: esgst.gc_w_s ? (esgst.gc_w_s_i ? `` : `W`) : esgst.gc_wLabel,
            type: `div`,
            children: esgst.gc_w_s && esgst.gc_w_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_wIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_pw`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-won ${esgst.gc_pw ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_pw`,
              title: `Previously Won`
            },
            text: esgst.gc_pw_s ? (esgst.gc_pw_s_i ? `` : `PW`) : esgst.gc_pwLabel,
            type: `div`,
            children: esgst.gc_pw_s && esgst.gc_pw_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_pwIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_gi`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-giveawayInfo ${esgst.gc_gi ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_gi`,
              title: `Giveaway Info`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `fa fa-info`
              },
              type: `i`
            }, {
              text: ` 0 `,
              type: `node`
            }, {
              attributes: {
                class: `fa fa-dollar`
              },
              type: `i`
            }, {
              text: ` 0`,
              type: `node`
            }]
          });
          break;
        case `gc_r`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-rating esgst-gc-rating-positive ${esgst.gc_r ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_r`,
              title: `Rating`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `fa fa-thumbs-up`
              },
              type: `i`
            }, {
              text: ` 0% (0)`,
              type: `node`
            }]
          });
          break;
        case `gc_a`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-achievements ${esgst.gc_a ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_a`,
              title: `Achievements`
            },
            text: esgst.gc_a_s ? (esgst.gc_a_s_i ? `` : `A`) : esgst.gc_aLabel,
            type: `div`,
            children: esgst.gc_a_s && esgst.gc_a_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_aIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_sp`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-singleplayer ${esgst.gc_sp ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_sp`,
              title: `Singleplayer`
            },
            text: esgst.gc_sp_s ? (esgst.gc_sp_s_i ? `` : `SP`) : esgst.gc_spLabel,
            type: `div`,
            children: esgst.gc_sp_s && esgst.gc_sp_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_spIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_mp`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-multiplayer ${esgst.gc_mp ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_mp`,
              title: `Multiplayer`
            },
            text: esgst.gc_mp_s ? (esgst.gc_mp_s_i ? `` : `MP`) : esgst.gc_mpLabel,
            type: `div`,
            children: esgst.gc_mp_s && esgst.gc_mp_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_mpIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_sc`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-steamCloud ${esgst.gc_sc ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_sc`,
              title: `Steam Cloud`
            },
            text: esgst.gc_sc_s ? (esgst.gc_sc_s_i ? `` : `SC`) : esgst.gc_scLabel,
            type: `div`,
            children: esgst.gc_sc_s && esgst.gc_sc_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_scIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_tc`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-tradingCards ${esgst.gc_tc ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_tc`,
              title: `Trading Cards`
            },
            text: esgst.gc_tc_s ? (esgst.gc_tc_s_i ? `` : `TC`) : esgst.gc_tcLabel,
            type: `div`,
            children: esgst.gc_tc_s && esgst.gc_tc_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_tcIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_l`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-linux ${esgst.gc_l ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_l`,
              title: `Linux`
            },
            text: esgst.gc_l_s ? (esgst.gc_l_s_i ? `` : `L`) : esgst.gc_lLabel,
            type: `div`,
            children: esgst.gc_l_s && esgst.gc_l_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_lIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_m`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-mac ${esgst.gc_m ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_m`,
              title: `Mac`
            },
            text: esgst.gc_m_s ? (esgst.gc_m_s_i ? `` : `M`) : esgst.gc_mLabel,
            type: `div`,
            children: esgst.gc_m_s && esgst.gc_m_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_mIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_dlc`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-dlc ${esgst.gc_dlc ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_dlc`,
              title: `DLC`
            },
            text: esgst.gc_dlc_s ? (esgst.gc_dlc_s_i ? `` : `DLC`) : esgst.gc_dlcLabel,
            type: `div`,
            children: esgst.gc_dlc_s && esgst.gc_dlc_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_dlcIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_p`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-package ${esgst.gc_p ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_p`,
              title: `Package`
            },
            text: esgst.gc_p_s ? (esgst.gc_p_s_i ? `` : `P`) : esgst.gc_pLabel,
            type: `div`,
            children: esgst.gc_p_s && esgst.gc_p_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_pIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_ea`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-earlyAccess ${esgst.gc_ea ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_ea`,
              title: `Early Access`
            },
            text: esgst.gc_ea_s ? (esgst.gc_ea_s_i ? `` : `EA`) : esgst.gc_eaLabel,
            type: `div`,
            children: esgst.gc_ea_s && esgst.gc_ea_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_eaIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_lg`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-learning ${esgst.gc_lg ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_lg`,
              title: `Learning`
            },
            text: esgst.gc_lg_s ? (esgst.gc_lg_s_i ? `` : `LG`) : esgst.gc_lgLabel,
            type: `div`,
            children: esgst.gc_lg_s && esgst.gc_lg_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_lgIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_rm`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-removed ${esgst.gc_rm ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_rm`,
              title: `Removed`
            },
            text: esgst.gc_rm_s ? (esgst.gc_rm_s_i ? `` : `RM`) : esgst.gc_rmLabel,
            type: `div`,
            children: esgst.gc_rm_s && esgst.gc_rm_s_i ? [{
              attributes: {
                class: `fa fa-${esgst.gc_rmIcon}`
              },
              type: `i`
            }] : null
          });
          break;
        case `gc_rd`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-releaseDate ${esgst.gc_rd ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_rd`,
              title: `Release Date`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `fa fa-${esgst.gc_rdIcon}`
              },
              type: `i`
            }, {
              text: ` ${gc_formatDate(Date.now())}`,
              type: `node`
            }]
          });
          break;
        case `gc_g`:
          elements.push({
            attributes: {
              class: `esgst-clickable esgst-gc esgst-gc-genres ${esgst.gc_g ? `` : `esgst-hidden`}`,
              draggable: true,
              id: `gc_g`,
              title: `Genres`
            },
            text: `Genres`,
            type: `div`
          });
          break;
      }
    }
    const items = [];
    if (categoryKey === `gc_categories_gv`) {
      items.push({
        attributes: {
          class: `esgst-description esgst-bold`
        },
        text: `Grid View`,
        type: `div`
      });
    }
    items.push({
      attributes: {
        class: `esgst-description`
      },
      text: `Drag the categories to sort them.`,
      type: `div`
    }, {
      attributes: {
        class: `esgst-gc-panel`
      },
      type: `div`,
      children: elements
    });
    let sm = {
      categoryKey,
      panel: createElements(context, `beforeEnd`, items)
    };
    for (let i = 0, n = sm.panel.children.length; i < n; i++) {
      let child = sm.panel.children[i];
      child.addEventListener(`dragstart`, setSmSource.bind(null, child, sm));
      child.addEventListener(`dragenter`, getSmSource.bind(null, child, sm));
      child.addEventListener(`dragend`, saveSmSource.bind(null, sm));
    }
  }

  function readHrAudioFile(id, event) {
    let popup = new Popup(`fa-circle-o-notch fa-spin`, `Uploading...`);
    popup.open();
    try {
      let reader = new FileReader();
      reader.onload = saveHrFile.bind(null, id, popup, reader);
      reader.readAsArrayBuffer(event.currentTarget.files[0]);
    } catch (e) {
      console.log(e);
      popup.icon.classList.remove(`fa-circle-o-notch`);
      popup.icon.classList.remove(`fa-spin`);
      popup.icon.classList.add(`fa-times`);
      popup.title.textContent = `An error happened.`;
    }
  }

  async function saveHrFile(id, popup, reader) {
    try {
      let bytes = new Uint8Array(reader.result);
      let binary = ``;
      for (let i = 0, n = reader.result.byteLength; i < n; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let string = btoa(binary);
      (await hr_createPlayer(string)).play();
      setSetting(`${id}_sound`, string);
      popup.close();
    } catch (e) {
      console.log(e);
      popup.icon.classList.remove(`fa-circle-o-notch`);
      popup.icon.classList.remove(`fa-spin`);
      popup.icon.classList.add(`fa-times`);
      popup.title.textContent = `An error happened.`;
    }
  }

  function setSmSource(child, sm, event) {
    event.dataTransfer.setData(`text/plain`, ``);
    sm.source = child;
  }

  function getSmSource(child, sm) {
    let current = sm.source;
    if (!current) return;
    do {
      current = current.previousElementSibling;
      if (current && current === child) {
        sm.panel.insertBefore(sm.source, child);
        return;
      }
    } while (current);
    sm.panel.insertBefore(sm.source, child.nextElementSibling);
  }

  function saveSmSource(sm) {
    sm.source = null;
    esgst[sm.categoryKey] = [];
    for (let i = 0, n = sm.panel.children.length; i < n; i++) {
      esgst[sm.categoryKey].push(sm.panel.children[i].id);
    }
    setSetting(sm.categoryKey, esgst[sm.categoryKey]);
  }

  function addGwcrMenuPanel(context, id, key, background) {
    let button, colors, i, n, panel;
    panel = createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-sm-colors`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `form__saving-button esgst-sm-colors-default`
        },
        type: `div`,
        children: [{
          text: `Add Color Setting`,
          type: `span`
        }]
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `Allows you to set different colors for different ${key} ranges.`
        },
        type: `i`
      }]
    }]);
    button = panel.firstElementChild;
    for (i = 0, n = esgst[id].length; i < n; ++i) {
      addGwcColorSetting(esgst[id][i], id, key, panel, background);
    }
    button.addEventListener(`click`, () => {
      colors = {
        color: `#ffffff`,
        lower: `0`,
        upper: `100`
      };
      if (background) {
        colors.bgColor = ``;
      }
      esgst[id].push(colors);
      addGwcColorSetting(colors, id, key, panel, background);
    });
  }

  function addGwcColorSetting(colors, id, key, panel, background) {
    let bgColor, color, i, lower, n, remove, setting, upper;
    setting = createElements(panel, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `From: `,
        type: `node`
      }, {
        attributes: {
          step: `0.01`,
          type: `number`,
          value: colors.lower
        },
        type: `input`
      }, {
        text: ` to `,
        type: `node`
      }, {
        attributes: {
          step: `0.01`,
          type: `number`,
          value: colors.upper
        },
        type: `input`
      }, {
        text: ` ${key}, color it as `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colors.color
        },
        type: `input`
      }, ...(background ? [{
        text: ` with the background `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colors.bgColor
        },
        type: `input`
      }] : []), {
        attributes: {
          class: `esgst-clickable fa fa-times`,
          title: `Delete this setting`
        },
        type: `i`
      }]
    }]);
    lower = setting.firstElementChild;
    upper = lower.nextElementSibling;
    color = upper.nextElementSibling;
    if (background) {
      bgColor = color.nextElementSibling;
      remove = bgColor.nextElementSibling;
    } else {
      remove = color.nextElementSibling;
    }
    lower.addEventListener(`change`, () => {
      colors.lower = lower.value;
      setSetting(id, esgst[id]);
    });
    upper.addEventListener(`change`, () => {
      colors.upper = upper.value;
      setSetting(id, esgst[id]);
    });
    color.addEventListener(`change`, () => {
      colors.color = color.value;
      setSetting(id, esgst[id]);
    });
    if (bgColor) {
        bgColor.addEventListener(`change`, () => {
        colors.bgColor = bgColor.value;
        setSetting(id, esgst[id]);
      });
    }
    remove.addEventListener(`click`, () => {
      if (confirm(`Are you sure you want to delete this setting?`)) {
        for (i = 0, n = esgst[id].length; i < n && esgst[id][i] !== colors; ++i);
        if (i < n) {
          esgst[id].splice(i, 1);
          setSetting(id, esgst[id]);
          setting.remove();
        }
      }
    });
  }

  function addGcRatingPanel(context) {
    let panel = createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-sm-colors`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `form__saving-button esgst-sm-colors-default`
        },
        type: `div`,
        children: [{
          text: `Add Rating Setting`,
          type: `span`
        }]
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `Allows you to set different colors/icons for different rating ranges.`
        },
        type: `i`
      }]
    }]);
    let button = panel.firstElementChild;
    for (let i = 0, n = esgst.gc_r_colors.length; i < n; ++i) {
      addGcRatingColorSetting(esgst.gc_r_colors[i], panel);
    }
    button.addEventListener(`click`, () => {
      let colors = {
        color: ``,
        bgColor: ``,
        icon: ``,
        lower: ``,
        upper: ``
      };
      esgst.gc_r_colors.push(colors);
      addGcRatingColorSetting(colors, panel);
    });
  }

  function addGcRatingColorSetting(colors, panel) {
    let setting = createElements(panel, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `From: `,
        type: `node`
      }, {
        attributes: {
          type: `number`,
          value: colors.lower
        },
        type: `input`
      }, {
        text: `% to `,
        type: `node`
      }, {
        attributes: {
          type: `number`,
          value: colors.upper
        },
        type: `input`
      }, {
        text: `% rating, color it as `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colors.color
        },
        type: `input`
      }, {
        text: ` with the background `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colors.bgColor
        },
        type: `input`
      }, {
        text: ` and the icon `,
        type: `node`
      }, {
        attributes: {
          type: `text`,
          value: colors.icon
        },
        type: `input`
      }, {
        attributes: {
          class: `fa fa-question-circle`
        },
        type: `i`
      }, {
        text: `.`,
        type: `node`
      }, {
        attributes: {
          class: `esgst-clickable fa fa-times`,
          title: `Delete this setting`
        },
        type: `i`
      }]
    }]);
    let lower = setting.firstElementChild;
    let upper = lower.nextElementSibling;
    let color = upper.nextElementSibling;
    let bgColor = color.nextElementSibling
    let icon = bgColor.nextElementSibling;
    let tooltip = icon.nextElementSibling;
    createTooltip(tooltip, `The name of the icon can be any name from <a href="https://fontawesome.com/v4.7.0/icons/">FontAwesome</a> or any text. For example, if you want to use alt symbols like ▲ (Alt + 3 + 0) and ▼ (Alt + 3 + 1), you can.`);
    let remove = tooltip.nextElementSibling;
    lower.addEventListener(`change`, () => {
      colors.lower = lower.value;
      setSetting(`gc_r_colors`, esgst.gc_r_colors);
    });
    upper.addEventListener(`change`, () => {
      colors.upper = upper.value;
      setSetting(`gc_r_colors`, esgst.gc_r_colors);
    });
    color.addEventListener(`change`, () => {
      colors.color = color.value;
      setSetting(`gc_r_colors`, esgst.gc_r_colors);
    });
    bgColor.addEventListener(`change`, () => {
      colors.bgColor = bgColor.value;
      setSetting(`gc_r_colors`, esgst.gc_r_colors);
    });
    icon.addEventListener(`change`, () => {
      colors.icon = icon.value;
      setSetting(`gc_r_colors`, esgst.gc_r_colors);
    });
    remove.addEventListener(`click`, () => {
      if (confirm(`Are you sure you want to delete this setting?`)) {
        let i, n;
        for (i = 0, n = esgst.gc_r_colors.length; i < n && esgst.gc_r_colors[i] !== colors; ++i);
        if (i < n) {
          esgst.gc_r_colors.splice(i, 1);
          setSetting(`gc_r_colors`, esgst.gc_r_colors);
          setting.remove();
        }
      }
    });
  }

  function addGcMenuPanel(context) {
    let button, colorSetting, i, n, panel;
    panel = createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-sm-colors`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `form__saving-button esgst-sm-colors-default`
        },
        type: `div`,
        children: [{
          text: `Add Custom Genre Setting`,
          type: `span`
        }]
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `Allows you to color genres (colored genres will appear at the beginning of the list).`
        },
        type: `i`
      }]
    }]);
    button = panel.firstElementChild;
    for (i = 0, n = esgst.gc_g_colors.length; i < n; ++i) {
      addGcColorSetting(esgst.gc_g_colors[i], panel);
    }
    button.addEventListener(`click`, () => {
      colorSetting = {
        bgColor: `#7f8c8d`,
        color: `#ffffff`,
        genre: ``
      };
      esgst.gc_g_colors.push(colorSetting);
      addGcColorSetting(colorSetting, panel);
    });
  }

  function addGcColorSetting(colorSetting, panel) {
    let bgColor, color, genre, i, n, remove, setting;
    setting = createElements(panel, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `For genre `,
        type: `node`
      }, {
        attributes: {
          type: `text`,
          value: colorSetting.genre
        },
        type: `input`
      }, {
        text: `, color it as `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colorSetting.color
        },
        type: `input`
      }, {
        text: ` with the background `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colorSetting.bgColor
        },
        type: `input`
      }, {
        text: `.`,
        type: `node`
      }, {
        attributes: {
          class: `esgst-clickable fa fa-times`,
          title: `Delete this setting`
        },
        type: `i`
      }]
    }]);
    genre = setting.firstElementChild;
    color = genre.nextElementSibling;
    bgColor = color.nextElementSibling;
    remove = bgColor.nextElementSibling;
    genre.addEventListener(`change`, () => {
      colorSetting.genre = genre.value;
      setSetting(`gc_g_colors`, esgst.gc_g_colors);
    });
    color.addEventListener(`change`, () => {
      colorSetting.color = color.value;
      setSetting(`gc_g_colors`, esgst.gc_g_colors);
    });
    bgColor.addEventListener(`change`, () => {
      colorSetting.bgColor = bgColor.value;
      setSetting(`gc_g_colors`, esgst.gc_g_colors);
    });
    remove.addEventListener(`click`, () => {
      if (confirm(`Are you sure you want to delete this setting?`)) {
        for (i = 0, n = esgst.gc_g_colors.length; i < n && esgst.gc_g_colors[i] !== colorSetting; ++i);
        if (i < n) {
          esgst.gc_g_colors.splice(i, 1);
          setSetting(`gc_g_colors`, esgst.gc_g_colors);
          setting.remove();
        }
      }
    });
  }

  function addGcAltMenuPanel(context) {
    let altSetting, button, i, n, panel;
    panel = createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-sm-colors`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `form__saving-button esgst-sm-colors-default`
        },
        type: `div`,
        children: [{
          text: `Add Alt Account`,
          type: `span`
        }]
      }]
    }]);
    button = panel.firstElementChild;
    createTooltip(createElements(panel, `beforeEnd`, [{
      attributes: {
        class: `fa fa-question-circle`
      },
      type: `i`
    }]), `
      <div>You must sync your owned games normally for the script to pick up the games owned by your alt accounts. Syncing with alt accounts only works with a Steam API Key though, so make sure one is set at the last section of this menu.</div>
      <br/>
      <div>Steam ID is the number that comes after "steamcommunity.com/profiles/" in your alt account's URL. If your alt account has a URL in the format "steamcommunity.com/id/" though, you can get your Steam ID <a href="https://steamid.io/">here</a> by entering your URL in the input (you want the steamID64 one).</div>
      <br/>
      <div>You must fill the fields relative to your settings. For example, if you have simplified version enabled with icons, you must fill the "icon" field. If you don't have simplified version enabled, you must fill the "label" field. The current text in the fields are simply placeholders.</div>
    `);
    for (i = 0, n = esgst.gc_o_altAccounts.length; i < n; ++i) {
      addGcAltSetting(esgst.gc_o_altAccounts[i], panel);
    }
    button.addEventListener(`click`, () => {
      altSetting = {
        bgColor: `#000000`,
        color: `#ffffff`,
        games: {
          apps: {},
          subs: {}
        },
        icon: ``,
        label: ``,
        name: ``,
        steamId: ``
      };
      esgst.gc_o_altAccounts.push(altSetting);
      addGcAltSetting(altSetting, panel);
    });
  }

  function addGcAltSetting(altSetting, panel) {
    let color, bgColor, i, icon, label, n, name, remove, setting, steamId;
    setting = createElements(panel, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `For account with Steam ID `,
        type: `node`
      }, {
        attributes: {
          placeholder: `0000000000000000`,
          type: `text`,
          value: altSetting.steamId
        },
        type: `input`
      }, {
        text: `, using the nickname `,
        type: `node`
      }, {
        attributes: {
          placeholder: `alt1`,
          type: `text`,
          value: altSetting.name
        },
        type: `input`
      }, {
        text: `, `,
        type: `node`
      }, {
        type: `br`
      }, {
        text: `color it as `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: altSetting.color
        },
        type: `input`
      }, {
        text: ` with the background `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: altSetting.bgColor
        },
        type: `input`
      }, {
        text: `, icon `,
        type: `node`
      }, {
        attributes: {
          placeholder: `folder`,
          type: `text`,
          value: altSetting.icon
        },
        type: `input`
      }, {
        text: ` and label `,
        type: `node`
      }, {
        attributes: {
          placeholder: `Owned by alt1`,
          type: `text`,
          value: altSetting.label
        },
        type: `input`
      }, {
        text: `.`,
        type: `node`
      }, {
        attributes: {
          class: `esgst-clickable fa fa-times`,
          title: `Delete this setting`
        },
        type: `i`
      }]
    }]);
    steamId = setting.firstElementChild;
    name = steamId.nextElementSibling;
    color = name.nextElementSibling.nextElementSibling;
    bgColor = color.nextElementSibling;
    icon = bgColor.nextElementSibling;
    label = icon.nextElementSibling;
    remove = label.nextElementSibling;
    steamId.addEventListener(`change`, () => {
      altSetting.steamId = steamId.value;
      setSetting(`gc_o_altAccounts`, esgst.gc_o_altAccounts);
    });
    name.addEventListener(`change`, () => {
      altSetting.name = name.value;
      setSetting(`gc_o_altAccounts`, esgst.gc_o_altAccounts);
    });
    color.addEventListener(`change`, () => {
      altSetting.color = color.value;
      setSetting(`gc_o_altAccounts`, esgst.gc_o_altAccounts);
    });
    bgColor.addEventListener(`change`, () => {
      altSetting.bgColor = bgColor.value;
      setSetting(`gc_o_altAccounts`, esgst.gc_o_altAccounts);
    });
    icon.addEventListener(`change`, () => {
      altSetting.icon = icon.value;
      setSetting(`gc_o_altAccounts`, esgst.gc_o_altAccounts);
    });
    label.addEventListener(`change`, () => {
      altSetting.label = label.value;
      setSetting(`gc_o_altAccounts`, esgst.gc_o_altAccounts);
    });
    remove.addEventListener(`click`, () => {
      if (confirm(`Are you sure you want to delete this setting?`)) {
        for (i = 0, n = esgst.gc_o_altAccounts.length; i < n && esgst.gc_o_altAccounts[i] !== altSetting; ++i);
        if (i < n) {
          esgst.gc_o_altAccounts.splice(i, 1);
          setSetting(`gc_o_altAccounts`, esgst.gc_o_altAccounts);
          setting.remove();
        }
      }
    });
  }

  function addColorObserver(context, id, key) {
    context.addEventListener(`change`, () => {
      setSetting(`${id}_${key}`, context.value);
    });
  }

  function setSMManageFilteredGiveaways(SMManageFilteredGiveaways) {
    let gfGiveaways, giveaway, hidden, i, key, n, popup, set;
    SMManageFilteredGiveaways.addEventListener(`click`, () => {
      popup = new Popup(`fa-gift`, `Hidden Giveaways`, true);
      hidden = [];
      for (key in esgst.giveaways) {
        giveaway = esgst.giveaways[key];
        if (giveaway.hidden && giveaway.code && giveaway.endTime) {
          if (Date.now() >= giveaway.endTime) {
            delete giveaway.hidden;
          } else {
            hidden.push(giveaway);
          }
        } else {
          delete giveaway.hidden;
        }
      }
      hidden = hidden.sort((a, b) => {
        if (a.hidden > b.hidden) {
          return -1;
        } else if (a.hidden < b.hidden) {
          return 1;
        } else {
          return 0;
        }
      });
      setValue(`giveaways`, JSON.stringify(esgst.giveaways));
      i = 0;
      n = hidden.length;
      gfGiveaways = createElements(popup.scrollable, `beforeEnd`, [{
        attributes: {
          class: `esgst-text-left`
        },
        type: `div`
      }]);
      if (n > 0) {
        set = new ButtonSet(`green`, `grey`, `fa-plus`, `fa-circle-o-notch fa-spin`, `Load more...`, `Loading more...`, callback => {
          loadGfGiveaways(i, i + 5, hidden, gfGiveaways, popup, value => {
            i = value;
            if (i > n) {
              set.set.remove();
            } else if (esgst.es_gf && popup.scrollable.scrollHeight <= popup.scrollable.offsetHeight) {
              set.trigger();
            }
            callback();
          });
        });
        popup.description.appendChild(set.set);
        popup.open();
        set.trigger();
        if (esgst.es_gf) {
          popup.scrollable.addEventListener(`scroll`, () => {
            if ((popup.scrollable.scrollTop + popup.scrollable.offsetHeight) >= popup.scrollable.scrollHeight && !set.busy) {
              set.trigger();
            }
          });
        }
      } else {
        gfGiveaways.textContent = `No hidden giveaways found.`;
        popup.open();
      }
    });
  }

  async function loadGfGiveaways(i, n, hidden, gfGiveaways, popup, callback) {
    let giveaway;
    if (i < n) {
      if (hidden[i]) {
        let response = await request({method: `GET`, queue: true, url: `https://www.steamgifts.com/giveaway/${hidden[i].code}/`});
        giveaway = buildGiveaway(parseHtml(response.responseText), response.finalUrl);
        if (giveaway) {
          createElements(gfGiveaways, `beforeEnd`, giveaway.html);
          await endless_load(gfGiveaways.lastElementChild, false, `gf`);
          setTimeout(() => loadGfGiveaways(++i, n, hidden, gfGiveaways, popup, callback), 0);
        } else {
          setTimeout(() => loadGfGiveaways(++i, n, hidden, gfGiveaways, popup, callback), 0);
        }
      } else {
        callback(i + 1);
      }
    } else {
      callback(i);
    }
  }

  async function openManageUserTagsPopup() {
    let context, input, popup, savedUser, savedUsers, users;
    popup = new Popup(`fa-tags`, `Manage user tags:`, true);
    input = createElements(popup.description, `afterBegin`, [{
      attributes: {
        type: `text`
      },
      type: `input`
    }]);
    createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `Type tags below to filter the users by.`,
      type: `div`
    }]);
    let heading = createElements(popup.description, `beforeBegin`, [{
      attributes: {
        class: `page__heading`
      },
      type: `div`
    }]);
    if (esgst.mm) {
      mm(heading);
    }
    savedUsers = JSON.parse(await getValue(`users`));
    users = {};
    for (const steamId in savedUsers.users) {
      savedUser = savedUsers.users[steamId];
      if (savedUser.tags && (savedUser.tags.length > 1 || (savedUser.tags[0] && savedUser.tags[0].trim()))) {
        const attributes = {};
        if (savedUser.username) {
          attributes[`data-sg`] = true;
          attributes.href = `https://www.steamgifts.com/user/${savedUser.username}`;
        } else {
          attributes[`data-st`] = true;
          attributes.href = `https://www.steamtrades.com/user/${steamId}`;
        }
        context = createElements(popup.scrollable, `beforeEnd`, [{
          type: `div`,
          children: [{
            attributes,
            text: savedUser.username || steamId,
            type: `a`
          }]
        }]);
        users[savedUser.username || steamId] = {
          context: context
        };
      }
    }
    await endless_load(popup.scrollable);
    input.addEventListener(`input`, filterUserTags.bind(null, users));
    popup.open();
  }

  function filterUserTags(users, event) {
    let i, tags, username, userTags;
    if (event.currentTarget.value) {
      tags = event.currentTarget.value.replace(/,\s+/g, ``).split(/,\s/);
      for (username in users) {
        userTags = users[username].context.getElementsByClassName(`esgst-tags`)[0];
        for (i = tags.length - 1; i >= 0 && !userTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i);
        if (i < 0) {
          users[username].context.classList.add(`esgst-hidden`);
        } else {
          users[username].context.classList.remove(`esgst-hidden`);
        }
      }
    } else {
      for (username in users) {
        users[username].context.classList.remove(`esgst-hidden`);
      }
    }
  }

  async function openManageGameTagsPopup() {
    let context, games, input, popup, savedGame, savedGames;
    popup = new Popup(`fa-tags`, `Manage game tags:`, true);
    input = createElements(popup.description, `afterBegin`, [{
      attributes: {
        type: `text`
      },
      type: `input`
    }]);
    createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `Type tags below to filter the games by.`,
      type: `div`
    }]);
    let heading = createElements(popup.description, `beforeBegin`, [{
      attributes: {
        class: `page__heading`
      },
      type: `div`
    }]);
    if (esgst.mm) {
      mm(heading);
    }
    savedGames = JSON.parse(await getValue(`games`));
    games = {
      apps: {},
      subs: {}
    };
    for (const id in savedGames.apps) {
      savedGame = savedGames.apps[id];
      if (savedGame.tags && (savedGame.tags.length > 1 || savedGame.tags[0].trim())) {
        context = createElements(popup.scrollable, `beforeEnd`, [{
          attributes: {
            class: `table__row-outer-wrap`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__column__heading`,
              href: `http://store.steampowered.com/app/${id}`
            },
            text: `App - ${id}`,
            type: `a`
          }]
        }]);
        games.apps[id] = {
          context: context
        };
      }
    }
    for (const id in savedGames.subs) {
      savedGame = savedGames.subs[id];
      if (savedGame.tags && (savedGame.tags.length > 1 || savedGame.tags[0].trim())) {
        context = createElements(popup.scrollable, `beforeEnd`, [{
          attributes: {
            class: `table__row-outer-wrap`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__column__heading`,
              href: `http://store.steampowered.com/sub/${id}`
            },
            text: `Sub - ${id}`,
            type: `a`
          }]
        }]);
        games.subs[id] = {
          context: context
        };
      }
    }
    await endless_load(popup.scrollable);
    input.addEventListener(`input`, filterGameTags.bind(null, games));
    popup.open();
  }

  function filterGameTags(games, event) {
    let gameTags, i, id, tags;
    if (event.currentTarget.value) {
      tags = event.currentTarget.value.replace(/,\s+/g, ``).split(/,\s/);
      for (id in games.apps) {
        gameTags = games.apps[id].context.getElementsByClassName(`esgst-tags`)[0];
        for (i = tags.length - 1; i >= 0 && !gameTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i);
        if (i < 0) {
          games.apps[id].context.classList.add(`esgst-hidden`);
        } else {
          games.apps[id].context.classList.remove(`esgst-hidden`);
        }
      }
      for (id in games.subs) {
        gameTags = games.subs[id].context.getElementsByClassName(`esgst-tags`)[0];
        for (i = tags.length - 1; i >= 0 && !gameTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i);
        if (i < 0) {
          games.subs[id].context.classList.add(`esgst-hidden`);
        } else {
          games.subs[id].context.classList.remove(`esgst-hidden`);
        }
      }
    } else {
      for (id in games.apps) {
        games.apps[id].context.classList.remove(`esgst-hidden`);
      }
      for (id in games.subs) {
        games.subs[id].context.classList.remove(`esgst-hidden`);
      }
    }
  }

  async function openManageGroupTagsPopup() {
    let context, input, popup, savedGroups, groups;
    popup = new Popup(`fa-tags`, `Manage group tags:`, true);
    input = createElements(popup.description, `afterBegin`, [{
      attributes: {
        type: `text`
      },
      type: `input`
    }]);
    createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `Type tags below to filter the groups by.`,
      type: `div`
    }]);
    let heading = createElements(popup.description, `beforeBegin`, [{
      attributes: {
        class: `page__heading`
      },
      type: `div`
    }]);
    if (esgst.mm) {
      mm(heading);
    }
    savedGroups = JSON.parse(await getValue(`groups`));
    groups = {};
    for (const savedGroup of savedGroups) {
      if (!savedGroup || !savedGroup.tags || (savedGroup.tags.length < 2 && (!savedGroup.tags[0] || !savedGroup.tags[0].trim()))) {
        continue;
      }
      context = createElements(popup.scrollable, `beforeEnd`, [{
        type: `div`,
        children: [{
          attributes: {
            href: `https://www.steamgifts.com/group/${savedGroup.code}/`
          },
          text: savedGroup.name,
          type: `a`
        }]
      }]);
      groups[savedGroup.code] = {
        context: context
      };
    }
    await endless_load(popup.scrollable);
    input.addEventListener(`input`, filterGroupTags.bind(null, groups));
    popup.open();
  }

  function filterGroupTags(groups, event) {
    let i, tags, code, groupTags;
    if (event.currentTarget.value) {
      tags = event.currentTarget.value.replace(/,\s+/g, ``).split(/,\s/);
      for (code in groups) {
        groupTags = groups[code].context.getElementsByClassName(`esgst-tags`)[0];
        for (i = tags.length - 1; i >= 0 && !groupTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i);
        if (i < 0) {
          groups[code].context.classList.add(`esgst-hidden`);
        } else {
          groups[code].context.classList.remove(`esgst-hidden`);
        }
      }
    } else {
      for (code in groups) {
        groups[code].context.classList.remove(`esgst-hidden`);
      }
    }
  }

  function setSMRecentUsernameChanges(SMRecentUsernameChanges) {
    SMRecentUsernameChanges.addEventListener(`click`, async () => {
      const popup = new Popup(`fa-comments`, `Recent Username Changes`);
      popup.progress = createElements(popup.description, `beforeEnd`, [{
        type: `div`,
        children: [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }, {
          text: `Loading recent username changes...`,
          type: `span`
        }]
      }]);
      popup.results = createElements(popup.scrollable, `beforeEnd`, [{
        attributes: {
          class: `esgst-uh-popup`
        },
        type: `div`
      }]);
      popup.open();
      const recentChanges = JSON.parse((await request({
        method: `GET`,
        url: `https://script.google.com/macros/s/AKfycbzvOuHG913mRIXOsqHIeAuQUkLYyxTHOZim5n8iP-k80iza6g0/exec?Action=2`
      })).responseText).RecentChanges;
      popup.progress.innerHTML = ``;
      const items = [];
      for (const change of recentChanges) {
        items.push({
          type: `div`,
          children: [{
            text: `${change[0]} changed to `,
            type: `node`
          }, {
            attributes: {
              class: `esgst-bold`,
              href: `/user/${change[1]}`
            },
            text: change[1],
            type: `a`
          }]
        });
      }
      createElements(popup.results, `inner`, items);
      if (esgst.sg) {
        endless_load(popup.results);
      }
    });
  }

  function updateWhitelistBlacklist(key, profile, event) {
    let user;
    user = {
      steamId: profile.steamId,
      id: profile.id,
      username: profile.username,
      values: {}
    };
    if (event.currentTarget.classList.contains(`is-selected`)) {
      user.values[key] = false;
    } else {
      user.values[key] = true;
      user.values[`${key}Date`] = Date.now();
    }
    saveUser(null, null, user);
  }  

  async function updateHiddenGames(id, type, unhide) {
    if (!esgst.updateHiddenGames) {
      return;
    }
    const games = {
      apps: {},
      subs: {}
    };
    games[type][id] = {
      hidden: unhide ? null : true
    };
    await lockAndSaveGames(games);
  }

  function checkBackup() {
    let currentDate = Date.now();
    let isBackingUp = getLocalValue(`isBackingUp`);
    if ((!isBackingUp || currentDate - isBackingUp > 1800000) && currentDate - esgst.lastBackup > esgst.autoBackup_days * 86400000) {
      setLocalValue(`isBackingUp`, currentDate);
      loadDataManagement(false, `export`, true);
    }
  }

  function loadDataManagement(openInTab, type, autoBackup) {
    let container, context, group1, group2, i, icon, n, onClick, option, prep, popup, section, title1, title2;
    let dm = {
      autoBackup: autoBackup,
      type: type
    };
    dm[type] = true;
    switch (type) {
      case `import`:
        icon = `fa-sign-in esgst-rotate-90`;
        onClick = loadImportFile;
        prep = `from`;
        title1 = `Restore`;
        title2 = `Restoring`;
        dm.pastTense = `restored`;
        break;
      case `export`:
        icon = `fa-sign-out esgst-rotate-270`;
        onClick = manageData;
        prep = `to`;
        title1 = `Backup`;
        title2 = `Backing up`;
        dm.pastTense = `backed up`;
        break;
      case `delete`:
        icon = `fa-trash`;
        onClick = confirmDataDeletion;
        prep = `from`;
        title1 = `Delete`;
        title2 = `Deleting`;
        dm.pastTense = `deleted`;
        break;
    }
    if (openInTab) {
      context = container = esgst.mainContext;
      context.innerHTML = ``;
    } else {
      if (dm.autoBackup) {
        popup = new Popup(`fa-circle-o-notch fa-spin`, `ESGST is backing up your data... ${esgst.minimizePanel ? `You can close this popup, ESGST will notify you when it is done through the minimize panel.` : `Please do not close this popup until it is done.`}`, !esgst.minimizePanel, true);
      } else {
        popup = new Popup(icon, title1, true, true);
      }
      popup.description.classList.add(`esgst-text-left`);
      context = popup.scrollable;
      container = popup.description;
    }
    if (!dm.autoBackup) {
      dm.computerSpace = createElements(container, `afterBegin`, [{
        type: `div`,
        children: [{
          text: `Total: `,
          type: `node`
        }, {
          attributes: {
            class: `esgst-bold`
          },
          type: `span`
        }, {
          attributes: {
            class: `esgst-clickable fa fa-refresh`,
            title: `Calculate/refresh data sizes`
          },
          type: `i`
        }]
      }]);
      dm.computerSpaceCount = dm.computerSpace.firstElementChild;
      dm.computerSpaceCount.nextElementSibling.addEventListener(`click`, getDataSizes.bind(null, dm));
      section = createMenuSection(context, null, 1, title1);
    }
    dm.switches = {};
    dm.options = [
      {
        check: true,
        key: `decryptedGiveaways`,
        name: `Decrypted Giveaways`
      },
      {
        check: esgst.sg,
        key: `discussions`,
        name: `Discussions`,
        options: [
          {
            key: `discussions_main`,
            name: `Main`
          },
          {
            key: `discussions_ct`,
            name: `Comment Tracker`
          },
          {
            key: `discussions_df`,
            name: `Discussion Filters`
          },
          {
            key: `discussions_dh`,
            name: `Discussion Highlighter`
          },
          {
            key: `discussions_gdttt`,
            name: `Giveaway/Discussion/Ticket/Trade Tracker`
          },
          {
            key: `discussions_pm`,
            name: `Puzzle Marker`
          }
        ]
      },
      {
        check: true,
        key: `emojis`,
        name: `Emojis`
      },
      {
        check: esgst.sg,
        key: `entries`,
        name: `Entries`
      },
      {
        check: true,
        key: `games`,
        name: `Games`,
        options: [
          {
            key: `games_main`,
            name: `Main`
          },
          {
            key: `games_egh`,
            name: `Entered Game Highlighter`
          },
          {
            key: `games_gt`,
            name: `Game Tags`
          },
          {
            key: `games_itadi`,
            name: `IsThereAnyDeal Info`
          }
        ]
      },
      {
        check: esgst.sg,
        key: `giveaways`,
        name: `Giveaways`,
        options: [
          {
            key: `giveaways_main`,
            name: `Main`
          },
          {
            key: `giveaways_ct`,
            name: `Comment Tracker`
          },
          {
            key: `giveaways_gb`,
            name: `Giveaway Bookmarks`
          },
          {
            key: `giveaways_gdttt`,
            name: `Giveaway/Discussion/Ticket/Trade Tracker`
          },
          {
            key: `giveaways_gf`,
            name: `Giveaway Filters`
          },
          {
            key: `giveaways_ggl`,
            name: `Giveaway Group Loader`
          }
        ]
      },
      {
        check: esgst.sg,
        key: `groups`,
        name: `Groups`,
        options: [
          {
            key: `groups_main`,
            name: `Main`
          },
          {
            key: `groups_gpt`,
            name: `Group Tags`
          },
          {
            key: `groups_sgg`,
            name: `Stickied Giveaway Groups`
          }
        ]
      },
      {
        check: esgst.sg,
        key: `rerolls`,
        name: `Rerolls`
      },
      {
        check: true,
        key: `savedReplies`,
        name: `Saved Replies`
      },
      {
        check: true,
        key: `settings`,
        name: `Settings`
      },
      {
        check: true,
        key: `sgCommentHistory`,
        name: `SG Comment History`
      },
      {
        check: esgst.sg,
        key: `stickiedCountries`,
        name: `Stickied Giveaway Countries`
      },
      {
        check: esgst.sg,
        key: `templates`,
        name: `Templates`
      },
      {
        check: esgst.sg,
        key: `tickets`,
        name: `Tickets`,
        options: [
          {
            key: `tickets_main`,
            name: `Main`
          },
          {
            key: `tickets_ct`,
            name: `Comment Tracker`
          },
          {
            key: `tickets_gdttt`,
            name: `Giveaway/Discussion/Ticket/Trade Tracker`
          },
          {
            key: `tickets_ust`,
            name: `User Suspension Tracker`
          }
        ]
      },
      {
        check: esgst.st,
        key: `trades`,
        name: `Trades`,
        options: [
          {
            key: `trades_main`,
            name: `Main`
          },
          {
            key: `trades_ct`,
            name: `Comment Tracker`
          },
          {
            key: `trades_gdttt`,
            name: `Giveaway/Discussion/Ticket/Trade Tracker`
          }
        ]
      },
      {
        check: true,
        key: `users`,
        name: `Users`,
        options: [
          {
            key: `users_main`,
            name: `Main`
          },
          {
            key: `users_namwc`,
            name: `Not Activated/Multiple Win  Checker`
          },
          {
            key: `users_nrf`,
            name: `Not Received Finder`
          },
          {
            key: `users_uf`,
            name: `User Filters`
          },
          {
            key: `users_giveaways`,
            name: `Giveaways Data`
          },
          {
            key: `users_notes`,
            name: `User Notes`
          },
          {
            key: `users_tags`,
            name: `User Tags`
          },
          {
            key: `users_wbc`,
            name: `Whitelist/Blacklist Checker`
          }
        ]
      },
      {
        check: esgst.sg,
        key: `winners`,
        name: `Winners`
      }
    ];
    if (dm.autoBackup) {
      let dropbox, googleDrive, oneDrive;
      switch (esgst.autoBackup_index) {
        case 0:
          break;
        case 1:
          dropbox = true;
          break;
        case 2:
          googleDrive = true;
          break;
        case 3:
          oneDrive = true;
          break;
      }
      popup.open();
      manageData(dm, dropbox, googleDrive, oneDrive, false, async () => {
        delLocalValue(`isBackingUp`);
        await setSetting(`lastBackup`, Date.now());
        popup.icon.classList.remove(`fa-circle-o-notch`, `fa-spin`);
        popup.icon.classList.add(`fa-check`);
        popup.setTitle(`Backup done! You can close this popup now.`);
        popup.setDone(true);
      });
    } else {
      for (i = 0, n = dm.options.length; i < n; ++i) {
        option = dm.options[i];
        if (option.check) {
          section.lastElementChild.appendChild(getDataMenu(option, dm.switches, type));
        }
      }
      if (type === `import` || type === `delete`) {
        if (type === `import`) {
          dm.input = createElements(container, `beforeEnd`, [{
            attributes: {
              type: `file`
            },
            type: `input`
          }]);
          new ToggleSwitch(container, `importAndMerge`, false, `Merge`, false, false, `Merges the current data with the backup instead of replacing it.`, esgst.settings.importAndMerge);
        }
        let select = new ToggleSwitch(container, `exportBackup`, false, [{
          text: `Backup to `,
          type: `node`
        }, {
          type: `select`,
          children: [{
            text: `Computer`,
            type: `node`
          }, {
            text: `Dropbox`,
            type: `node`
          }, {
            text: `Google Drive`,
            type: `node`
          }, {
            text: `OneDrive`,
            type: `node`
          }]
        }], false, false, `Backs up the current data to one of the selected places before restoring another backup.`, esgst.settings.exportBackup).name.firstElementChild;
        select.selectedIndex = esgst.settings.exportBackupIndex;
        select.addEventListener(`change`, () => {
          setSetting(`exportBackupIndex`, select.selectedIndex);
        });
      }
      dm.message = createElements(container, `beforeEnd`, [{
        attributes: {
          class: `esgst-description`
        },
        type: `div`
      }]);
      dm.warning = createElements(container, `beforeEnd`, [{
        attributes: {
          class: `esgst-description esgst-warning`
        },
        type: `div`
      }]);
      group1 = createElements(container, `beforeEnd`, [{
        attributes: {
          class: `esgst-button-group`
        },
        type: `div`,
        children: [{
          text: `Select:`,
          type: `span`
        }]
      }]);
      group1.appendChild(new ButtonSet(`grey`, `grey`, `fa-square`, `fa-circle-o-notch fa-spin`, `All`, ``, selectSwitches.bind(null, dm.switches, `enable`, group1)).set);
      group1.appendChild(new ButtonSet(`grey`, `grey`, `fa-square-o`, `fa-circle-o-notch fa-spin`, `None`, ``, selectSwitches.bind(null, dm.switches, `disable`, group1)).set);
      group1.appendChild(new ButtonSet(`grey`, `grey`, `fa-plus-square-o`, `fa-circle-o-notch fa-spin`, `Inverse`, ``, selectSwitches.bind(null, dm.switches, `toggle`, group1)).set);
      group2 = createElements(container, `beforeEnd`, [{
        attributes: {
          class: `esgst-button-group`
        },
        type: `div`,
        children: [{
          text: `${title1} ${prep}:`,
          type: `span`
        }]
      }]);
      group2.appendChild(new ButtonSet(`green`, `grey`, `fa-desktop`, `fa-circle-o-notch fa-spin`, `Computer`, title2, callback => {
        onClick(dm, false, false, false, false, () => {
          manageData(dm, false, false, false, true);
          callback();
        });
      }).set);
      if (type !== `delete`) {
        group2.appendChild(new ButtonSet(`green`, `grey`, `fa-dropbox`, `fa-circle-o-notch fa-spin`, `Dropbox`, title2, callback => {
          onClick(dm, true, false, false, false, () => {
            manageData(dm, false, false, false, true);
            callback();
          });
        }).set);
        group2.appendChild(new ButtonSet(`green`, `grey`, `fa-google`, `fa-circle-o-notch fa-spin`, `Google Drive`, title2, callback => {
          onClick(dm, false, true, false, false, () => {
            manageData(dm, false, false, false, true);
            callback();
          });
        }).set);
        group2.appendChild(new ButtonSet(`green`, `grey`, `fa-windows`, `fa-circle-o-notch fa-spin`, `OneDrive`, title2, callback => {
          onClick(dm, false, false, true, false, () => {
            manageData(dm, false, false, false, true);
            callback();
          });
        }).set);
      }
      if (!openInTab) {
        popup.open();
      }
      if (esgst[`calculate${capitalizeFirstLetter(type)}`]) {
        getDataSizes(dm);
      }
    }
  }

  function loadDataCleaner() {
    let popup = new Popup(`fa-paint-brush`, `Clean old data:`);
    createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-bold esgst-description esgst-red`
      },
      text: `Make sure to backup your data before using the cleaner.`,
      type: `div`
    }]);
    observeNumChange(new ToggleSwitch(popup.description, `cleanDiscussions`, false, [{
      text: `Discussions data older than `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-switch-input`,
        type: `text`,
        value: esgst.cleanDiscussions_days
      },
      type: `input`
    }, {
      text: ` days.`,
      type: `node`
    }], false, false, `Discussions data only started being date-tracked since v7.11.0, so not all old data may be cleaned.`, esgst.cleanDiscussions).name.firstElementChild, `cleanDiscussions_days`);
    observeNumChange(new ToggleSwitch(popup.description, `cleanEntries`, false, [{
      text: `Entries data older than `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-switch-input`,
        type: `text`,
        value: esgst.cleanEntries_days
      },
      type: `input`
    }, {
      text: ` days.`,
      type: `node`
    }], false, false, ``, esgst.cleanEntries).name.firstElementChild, `cleanEntries_days`);
    observeNumChange(new ToggleSwitch(popup.description, `cleanGiveaways`, false, [{
      text: `Giveaways data older than `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-switch-input`,
        type: `text`,
        value: esgst.cleanGiveaways_days
      },
      type: `input`
    }, {
      text: ` days.`,
      type: `node`
    }], false, false, `Some giveaways data only started being date-tracked since v7.11.0, so not all old data may be cleaned.`, esgst.cleanGiveaways).name.firstElementChild, `cleanGiveaways_days`);
    observeNumChange(new ToggleSwitch(popup.description, `cleanSgCommentHistory`, false, [{
      text: `SteamGifts comment history data older than `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-switch-input`,
        type: `text`,
        value: esgst.cleanSgCommentHistory_days
      },
      type: `input`
    }, {
      text: ` days.`,
      type: `node`
    }], false, false, ``, esgst.cleanSgCommentHistory).name.firstElementChild, `cleanSgCommentHistory_days`);
    observeNumChange(new ToggleSwitch(popup.description, `cleanTickets`, false, [{
      text: `Tickets data older than `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-switch-input`,
        type: `text`,
        value: esgst.cleanTickets_days
      },
      type: `input`
    }, {
      text: ` days.`,
      type: `node`
    }], false, false, `Tickets data only started being date-tracked since v7.11.0, so not all old data may be cleaned.`, esgst.cleanTickets).name.firstElementChild, `cleanTickets_days`);
    observeNumChange(new ToggleSwitch(popup.description, `cleanTrades`, false, [{
      text: `Trades data older than `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-switch-input`,
        type: `text`,
        value: esgst.cleanTrades_days
      },
      type: `input`
    }, {
      text: ` days.`,
      type: `node`
    }], false, false, `Trades data only started being date-tracked since v7.11.0, so not all old data may be cleaned.`, esgst.cleanTrades).name.firstElementChild, `cleanTrades_days`);
    new ToggleSwitch(popup.description, `cleanDuplicates`, false, `Duplicate data.`, false, false, `Cleans up any duplicate data it finds.`, esgst.cleanDuplicates);
    popup.description.appendChild(new ButtonSet_v2({color1: `green`, color2: `grey`, icon1: `fa-check`, icon2: `fa-circle-o-notch fa-spin`, title1: `Clean`, title2: `Cleaning...`, callback1: async () => {
      const dm = {};
      dm.options = [
        {
          check: true,
          key: `decryptedGiveaways`,
          name: `Decrypted Giveaways`
        },
        {
          check: esgst.sg,
          key: `discussions`,
          name: `Discussions`,
          options: [
            {
              key: `discussions_main`,
              name: `Main`
            },
            {
              key: `discussions_ct`,
              name: `Comment Tracker`
            },
            {
              key: `discussions_df`,
              name: `Discussion Filters`
            },
            {
              key: `discussions_dh`,
              name: `Discussion Highlighter`
            },
            {
              key: `discussions_gdttt`,
              name: `Giveaway/Discussion/Ticket/Trade Tracker`
            },
            {
              key: `discussions_pm`,
              name: `Puzzle Marker`
            }
          ]
        },
        {
          check: true,
          key: `emojis`,
          name: `Emojis`
        },
        {
          check: esgst.sg,
          key: `entries`,
          name: `Entries`
        },
        {
          check: true,
          key: `games`,
          name: `Games`,
          options: [
            {
              key: `games_main`,
              name: `Main`
            },
            {
              key: `games_egh`,
              name: `Entered Game Highlighter`
            },
            {
              key: `games_gt`,
              name: `Game Tags`
            },
            {
              key: `games_itadi`,
              name: `IsThereAnyDeal Info`
            }
          ]
        },
        {
          check: esgst.sg,
          key: `giveaways`,
          name: `Giveaways`,
          options: [
            {
              key: `giveaways_main`,
              name: `Main`
            },
            {
              key: `giveaways_ct`,
              name: `Comment Tracker`
            },
            {
              key: `giveaways_gb`,
              name: `Giveaway Bookmarks`
            },
            {
              key: `giveaways_gdttt`,
              name: `Giveaway/Discussion/Ticket/Trade Tracker`
            },
            {
              key: `giveaways_gf`,
              name: `Giveaway Filters`
            },
            {
              key: `giveaways_ggl`,
              name: `Giveaway Group Loader`
            }
          ]
        },
        {
          check: esgst.sg,
          key: `groups`,
          name: `Groups`,
          options: [
            {
              key: `groups_main`,
              name: `Main`
            },
            {
              key: `groups_gpt`,
              name: `Group Tags`
            },
            {
              key: `groups_sgg`,
              name: `Stickied Giveaway Groups`
            }
          ]
        },
        {
          check: esgst.sg,
          key: `rerolls`,
          name: `Rerolls`
        },
        {
          check: true,
          key: `savedReplies`,
          name: `Saved Replies`
        },
        {
          check: true,
          key: `settings`,
          name: `Settings`
        },
        {
          check: true,
          key: `sgCommentHistory`,
          name: `SG Comment History`
        },
        {
          check: esgst.sg,
          key: `stickiedCountries`,
          name: `Stickied Giveaway Countries`
        },
        {
          check: esgst.sg,
          key: `templates`,
          name: `Templates`
        },
        {
          check: esgst.sg,
          key: `tickets`,
          name: `Tickets`,
          options: [
            {
              key: `tickets_main`,
              name: `Main`
            },
            {
              key: `tickets_ct`,
              name: `Comment Tracker`
            },
            {
              key: `tickets_gdttt`,
              name: `Giveaway/Discussion/Ticket/Trade Tracker`
            },
            {
              key: `tickets_ust`,
              name: `User Suspension Tracker`
            }
          ]
        },
        {
          check: esgst.st,
          key: `trades`,
          name: `Trades`,
          options: [
            {
              key: `trades_main`,
              name: `Main`
            },
            {
              key: `trades_ct`,
              name: `Comment Tracker`
            },
            {
              key: `trades_gdttt`,
              name: `Giveaway/Discussion/Ticket/Trade Tracker`
            }
          ]
        },
        {
          check: true,
          key: `users`,
          name: `Users`,
          options: [
            {
              key: `users_main`,
              name: `Main`
            },
            {
              key: `users_namwc`,
              name: `Not Activated/Multiple Win  Checker`
            },
            {
              key: `users_nrf`,
              name: `Not Received Finder`
            },
            {
              key: `users_uf`,
              name: `User Filters`
            },
            {
              key: `users_giveaways`,
              name: `Giveaways Data`
            },
            {
              key: `users_notes`,
              name: `User Notes`
            },
            {
              key: `users_tags`,
              name: `User Tags`
            },
            {
              key: `users_wbc`,
              name: `Whitelist/Blacklist Checker`
            }
          ]
        },
        {
          check: esgst.sg,
          key: `winners`,
          name: `Winners`
        }
      ];
      const oldSize = await manageData(dm, false, false, false, true);
      let currentTime = Date.now();
      let toSave = {};
      if (esgst.cleanDiscussions) {
        let days = esgst.cleanDiscussions_days * 86400000;
        toSave.discussions = JSON.parse(await getValue(`discussions`, `{}`));
        for (let code in toSave.discussions) {
          let item = toSave.discussions[code];
          if (item.author !== esgst.username && item.lastUsed && currentTime - item.lastUsed > days) {
            delete toSave.discussions[code];
          }
        }
      }
      if (esgst.cleanEntries) {
        let days = esgst.cleanEntries_days * 86400000;
        let items = JSON.parse(await getValue(`entries`, `[]`));
        toSave.entries = [];
        items.forEach(item => {
          if (currentTime - item.timestamp <= days) {
            toSave.entries.push(item);
          }
        });
      }
      if (esgst.cleanGiveaways) {
        let days = esgst.cleanGiveaways_days * 86400000;
        toSave.giveaways = JSON.parse(await getValue(`giveaways`, `{}`));
        for (let code in toSave.giveaways) {
          let item = toSave.giveaways[code];
          if (item.creator !== esgst.username && ((item.endTime && currentTime - item.endTime > days) || (item.lastUsed && currentTime - item.lastUsed > days))) {
            delete toSave.giveaways[code];
          }
        }
      }
      if (esgst.cleanSgCommentHistory) {
        let days = esgst.cleanSgCommentHistory_days * 86400000;
        let items = JSON.parse(await getValue(`sgCommentHistory`, `[]`));
        toSave.sgCommentHistory = [];
        items.forEach(item => {
          if (currentTime - item.timestamp <= days) {
            toSave.sgCommentHistory.push(item);
          }
        });
      }
      if (esgst.cleanTickets) {
        let days = esgst.cleanTickets_days * 86400000;
        toSave.tickets = JSON.parse(await getValue(`tickets`, `{}`));
        for (let code in toSave.tickets) {
          let item = toSave.tickets[code];
          if (item.author !== esgst.username && item.lastUsed && currentTime - item.lastUsed > days) {
            delete toSave.tickets[code];
          }
        }
      }
      if (esgst.cleanTrades) {
        let days = esgst.cleanTrades_days * 86400000;
        toSave.trades = JSON.parse(await getValue(`trades`, `{}`));
        for (let code in toSave.trades) {
          let item = toSave.trades[code];
          if (item.author !== esgst.username && item.lastUsed && currentTime - item.lastUsed > days) {
            delete toSave.trades[code];
          }
        }
      }
      if (esgst.cleanDuplicates) {
        toSave.users = JSON.parse(await getValue(`users`, `{"steamIds":{},"users":{}}`));
        for (let id in toSave.users.users) {
          let giveaways = toSave.users.users[id].giveaways;
          if (giveaways) {
            [`sent`, `won`].forEach(mainType => {
              [`apps`, `subs`].forEach(type => {
                for (let code in giveaways[mainType][type]) {
                  giveaways[mainType][type][code] = Array.from(new Set(giveaways[mainType][type][code]));
                }
              });
            });
          }
        }
      }
      for (let key in toSave) {
        toSave[key] = JSON.stringify(toSave[key]);
      }
      await setValues(toSave);
      const newSize = await manageData(dm, false, false, false, true);
      const successPopup = new Popup_v2({
        icon: `fa-check`,
        title: [{
          text: `Success! The selected data was cleaned.`,
          type: `node`
        }, {
          type: `<br>`
        }, {
          type: `<br>`
        }, {
          text: `Size before cleaning: `,
          type: `node`
        }, {
          attributes: {
            class: `esgst-bold`
          },
          text: convertBytes(oldSize),
          type: `span`
        }, {
          type: `br`
        }, {
          text: `Size after cleaning: `,
          type: `node`
        }, {
          attributes: {
            class: `esgst-bold`
          },
          text: convertBytes(newSize),
          type: `span`
        }, {
          type: `br`
        }, {
          type: `br`
        }, {
          text: `${Math.round((100 - (newSize / oldSize * 100)) * 100) / 100}% reduction`,
          type: `node`
        }]
      });
      successPopup.open();
    }}).set);
    popup.open();
  }

  async function manageData(dm, dropbox, googleDrive, oneDrive, space, callback) {
    let data = {};
    let totalSize = 0;
    let mainUsernameFound;
    for (let i = 0, n = dm.options.length; i < n; i++) {
      let option = dm.options[i];
      let optionKey = option.key;
      if (!option.check || (!dm.autoBackup && !space && !esgst.settings[`${dm.type}_${optionKey}`])) {
        continue;
      }
      let values = null;
      let mainFound, mergedData, sizes;
      switch (optionKey) {
        case `decryptedGiveaways`:
        case `settings`:
          data[optionKey] = JSON.parse(await getValue(optionKey, `{}`));
          if (!space) {
            if (dm.import) {
              let newData = dm.data[optionKey];
              if (newData) {
                if (esgst.settings.importAndMerge) {
                  mergedData = data[optionKey];
                  for (let newDataKey in newData) {
                    mergedData[newDataKey] = newData[newDataKey];
                  }
                  await setValue(optionKey, JSON.stringify(mergedData));
                } else {
                  await setValue(optionKey, JSON.stringify(newData));
                }
              }
            } else if (dm.delete) {
              await delValue(optionKey);
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder(`utf-8`).encode(`{"${optionKey}":${await getValue(optionKey, `{}`)}}`)).length;
            totalSize += size;
            if (dm.switches) {
              dm.switches[optionKey].size.textContent = convertBytes(size);
            }
          }
          break;
        case `discussions`:
          if (!values) {
            values = {
              main: [`lastUsed`],
              ct: [`count`, `readComments`],
              df: [`hidden`],
              dh: [`highlighted`],
              gdttt: [`visited`],
              pm: [`status`]
            };
          }
        case `giveaways`:
          if (!values) {
            values = {
              main: [`code`, `comments`, `copies`, `creator`, `endTime`, `entries`, `gameId`, `gameName`, `gameSteamId`, `gameType`, `group`, `inviteOnly`, `lastUsed`, `level`, `points`, `regionRestricted`, `started`, `startTime`, `whitelist`, `winners`],
              ct: [`count`, `readComments`],
              gb: [`bookmarked`],
              gdttt: [`visited`],
              gf: [`hidden`],
              ggl: [`groups`]
            };
          }
        case `tickets`:
          if (!values) {
            values = {
              main: [`lastUsed`],
              ct: [`count`, `readComments`],
              gdttt: [`visited`],
              ust: [`sent`]
            };
          }
        case `trades`:
          if (!values) {
            values = {
              main: [`lastUsed`],
              ct: [`count`, `readComments`],
              gdttt: [`visited`]
            };
          }
          data[optionKey] = {};
          mergedData = JSON.parse(await getValue(optionKey, `{}`));
          sizes = {
            ct: 0,
            df: 0,
            dh: 0,
            gb: 0,
            gdttt: 0,
            gf: 0,
            ggl: 0,
            main: 0,
            pm: 0,
            total: 0,
            ust: 0
          };
          mainFound = false;
          for (let mergedDataKey in mergedData) {
            let newData = {};
            let toDelete = 0;
            let foundSub = 0;
            let deletedSub = 0;
            let found = null;
            let toExport = false;
            for (let value in values) {
              if (esgst.settings[`${dm.type}_${optionKey}_${value}`]) {
                toDelete += 1;
              }
              for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                let valueKey = values[value][j];
                let mergedDataValue = mergedData[mergedDataKey][valueKey];
                if (typeof mergedDataValue !== `undefined`) {
                  if (value !== `main`) {
                    foundSub += 1;
                  }
                  if (dm.autoBackup || esgst.settings[`${dm.type}_${optionKey}_${value}`] || value === `main`) {
                    newData[valueKey] = mergedDataValue;
                    if (value !== `main`) {
                      toExport = true;
                    }
                  }
                  let size = (new TextEncoder(`utf-8`).encode(`"${valueKey}":${JSON.stringify(mergedDataValue)},`)).length;
                  sizes[value] += size;
                  sizes.total += size;
                  found = value;
                  if (!space && dm.delete && esgst.settings[`${dm.type}_${optionKey}_${value}`] && value !== `main`) {
                    deletedSub += 1;
                    delete mergedData[mergedDataKey][valueKey];
                  }
                }
              }
            }
            if (found) {
              sizes[found] -= 1;
              sizes.total -= 1;
            }
            if (dm.autoBackup || toExport || esgst.settings[`${dm.type}_${optionKey}_main`]) {
              data[optionKey][mergedDataKey] = newData;
              mainFound = true;
            }
            let size = (new TextEncoder(`utf-8`).encode(`"${mergedDataKey}":{},`)).length;
            sizes.main += size;
            sizes.total += size;
            if (!space && dm.delete && ((esgst.settings[`${dm.type}_${optionKey}_main`] && foundSub === deletedSub) || toDelete === Object.keys(values).length)) {
              delete mergedData[mergedDataKey];
            }
          }
          if (!space) {
            if (dm.import) {
              let newData = dm.data[optionKey];
              if (newData) {
                for (let newDataKey in newData) {
                  if (!mergedData[newDataKey]) {
                    mergedData[newDataKey] = {};
                  }
                  for (let value in values) {
                    if (esgst.settings[`${dm.type}_${optionKey}_${value}`]) {
                      if (esgst.settings.importAndMerge) {
                        for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                          let valueKey = values[value][j];
                          if (valueKey === `readComments`) {
                            if (mergedData[newDataKey].readComments) {
                              for (let id in mergedData[newDataKey].readComments) {
                                if (newData[newDataKey].readComments[id] > mergedData[newDataKey].readComments[id]) {
                                  mergedData[newDataKey].readComments[id] = newData[newDataKey].readComments[id];
                                }
                              }
                            } else {
                              mergedData[newDataKey].readComments = newData[newDataKey].readComments;
                            }
                          } else {
                            mergedData[newDataKey][valueKey] = newData[newDataKey][valueKey];
                          }
                        }
                      } else {
                        for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                          let valueKey = values[value][j];
                          mergedData[newDataKey][valueKey] = newData[newDataKey][valueKey];
                        }
                      }
                    }
                  }
                }
                await setValue(optionKey, JSON.stringify(mergedData));
              }
            } else if (dm.delete) {
              await setValue(optionKey, JSON.stringify(mergedData));
            }
          }
          if (mainFound) {
            sizes.main -= 1;
            sizes.total -= 1;
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder(`utf-8`).encode(`{"${optionKey}":{}}`)).length;
            sizes.main += size;
            sizes.total += size;
            if (dm.switches) {
              for (let value in values) {
                if (dm.switches[`${optionKey}_${value}`]) {
                  dm.switches[`${optionKey}_${value}`].size.textContent = convertBytes(sizes[value]);
                }
              }
              dm.switches[optionKey].size.textContent = convertBytes(sizes.total);
            }
            totalSize += sizes.total;
          }
          break;
        case `emojis`:
          data.emojis = JSON.parse(await getValue(`emojis`, `[]`));
          if (!space) {
            if (dm.import) {
              let newData = JSON.stringify(dm.data.emojis);
              if (newData) {
                if (esgst.settings.importAndMerge) {
                  await setValue(`emojis`, JSON.stringify(
                    Array.from(
                      new Set(
                        data.emojis.concat(
                          JSON.parse(fixEmojis(newData))
                        )
                      )
                    )
                  ));
                } else {
                  await setValue(`emojis`, fixEmojis(newData));
                }
              }
            } else if (dm.delete) {
              await delValue(`emojis`);
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder(`utf-8`).encode(`{"${optionKey}":${await getValue(optionKey, `"[]"`)}}`)).length;
            totalSize += size;
            if (dm.switches) {
              dm.switches[optionKey].size.textContent = convertBytes(size);
            }
          }
          break;
        case `entries`:
        case `templates`:
        case `savedReplies`:
          data[optionKey] = JSON.parse(await getValue(optionKey, `[]`));
          if (!space) {
            if (dm.import) {
              let newData = dm.data[optionKey];
              if (newData) {
                if (esgst.settings.importAndMerge) {
                  let dataKey = optionKey === `entries` ? `timestamp` : `name`;
                  mergedData = data[optionKey];
                  for (let j = 0, numNew = newData.length; j < numNew; ++j) {
                    let newDataValue = newData[j];
                    let k, numMerged;
                    for (k = 0, numMerged = mergedData.length; k < numMerged && mergedData[k][dataKey] !== newDataValue[dataKey]; ++k);
                    if (k < numMerged) {
                      mergedData[k] = newDataValue;
                    } else {
                      mergedData.push(newDataValue);
                    }
                  }
                  if (optionKey === `entries`) {
                    mergedData = sortArray(mergedData, false, `timestamp`);
                  }
                  await setValue(optionKey, JSON.stringify(mergedData));
                } else {
                  await setValue(optionKey, JSON.stringify(newData));
                }
              }
            } else if (dm.delete) {
              await delValue(optionKey);
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder(`utf-8`).encode(`{"${optionKey}":${await getValue(optionKey, `[]`)}}`)).length;
            totalSize += size;
            if (dm.switches) {
              dm.switches[optionKey].size.textContent = convertBytes(size);
            }
          }
          break;
        case `games`:
          values = {
            main: [`apps`, `packages`, `reducedCV`, `noCV`, `hidden`, `ignored`, `owned`, `wishlisted`],
            gt: [`tags`],
            egh: [`entered`],
            itadi: [`itadi`]
          };
          data.games = {
            apps: {},
            subs: {}
          };
          mergedData = JSON.parse(await getValue(`games`, `{"apps":{},"subs":{}}`));
          sizes = {
            egh: 0,
            gt: 0,
            itadi: 0,
            main: 0,
            total: 0
          };
          mainFound = false;
          for (let mergedDataKey in mergedData.apps) {
            let mergedDataValue = mergedData.apps[mergedDataKey];
            let newData = {};
            let toDelete = 0;
            let foundSub = 0;
            let deletedSub = 0;
            let found = null;
            let toExport = false;
            for (let value in values) {
              if (esgst.settings[`${dm.type}_games_${value}`]) {
                toDelete += 1;
              }
              for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                let valueKey = values[value][j];
                let newDataValue = mergedDataValue[valueKey];
                if (typeof newDataValue !== `undefined`) {
                  if (value !== `main`) {
                    foundSub += 1;
                  }
                  if (dm.autoBackup || esgst.settings[`${dm.type}_games_${value}`] || value === `main`) {
                    newData[valueKey] = newDataValue;
                    if (value !== `main`) {
                      toExport = true;
                    }
                  }
                  let size = (new TextEncoder(`utf-8`).encode(`"${valueKey}":${JSON.stringify(newDataValue)},`)).length;
                  sizes[value] += size;
                  sizes.total += size;
                  found = value;
                  if (!space && dm.delete && esgst.settings[`${dm.type}_games_${value}`] && value !== `main`) {
                    deletedSub += 1;
                    delete mergedDataValue[valueKey];
                  }
                }
              }
            }
            if (found) {
              sizes[found] -= 1;
              sizes.total -= 1;
            }
            if (dm.autoBackup || toExport || esgst.settings[`${dm.type}_${optionKey}_main`]) {
              data.games.apps[mergedDataKey] = newData;
              mainFound = true;
            }
            let size = (new TextEncoder(`utf-8`).encode(`"${mergedDataKey}":{},`)).length;
            sizes.main += size;
            sizes.total += size;
            if (!space && dm.delete && ((esgst.settings[`${dm.type}_${optionKey}_main`] && foundSub === deletedSub) || toDelete === Object.keys(values).length)) {
              delete mergedData.apps[mergedDataKey];
            }
          }
          if (mainFound) {
            sizes.main -= 1;
            sizes.total -= 1;
          }
          mainFound = false;
          for (let mergedDataKey in mergedData.subs) {
            let mergedDataValue = mergedData.subs[mergedDataKey];
            let newData = {};
            let toDelete = 0;
            let foundSub = 0;
            let deletedSub = 0;
            let found = null;
            let toExport = false;
            for (let value in values) {
              if (esgst.settings[`${dm.type}_games_${value}`]) {
                toDelete += 1;
              }
              for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                let valueKey = values[value][j];
                let newDataValue = mergedDataValue[valueKey];
                if (typeof newDataValue !== `undefined`) {
                  if (value !== `main`) {
                    foundSub += 1;
                  }
                  if (dm.autoBackup || esgst.settings[`${dm.type}_games_${value}`] || value === `main`) {
                    newData[valueKey] = newDataValue;
                    if (value !== `main`) {
                      toExport = true;
                    }
                  }
                  let size = (new TextEncoder(`utf-8`).encode(`"${valueKey}":${JSON.stringify(newDataValue)},`)).length;
                  sizes[value] += size;
                  sizes.total += size;
                  found = value;
                  if (!space && dm.delete && esgst.settings[`${dm.type}_games_${value}`] && value !== `main`) {
                    deletedSub += 1;
                    delete mergedDataValue[valueKey];
                  }
                }
              }
            }
            if (found) {
              sizes[found] -= 1;
              sizes.total -= 1;
            }
            if (dm.autoBackup || toExport || esgst.settings[`${dm.type}_${optionKey}_main`]) {
              data.games.subs[mergedDataKey] = newData;
              mainFound = true;
            }
            let size = (new TextEncoder(`utf-8`).encode(`"${mergedDataKey}":{},`)).length;
            sizes.main += size;
            sizes.total += size;
            if (!space && dm.delete && ((esgst.settings[`${dm.type}_${optionKey}_main`] && foundSub === deletedSub) || toDelete === Object.keys(values).length)) {
              delete mergedData.subs[mergedDataKey];
            }
          }
          if (mainFound) {
            sizes.main -= 1;
            sizes.total -= 1;
          }
          if (!space) {
            if (dm.import) {
              let newData = dm.data.games;
              if (newData) {
                for (let newDataKey in newData.apps) {
                  let newDataValue = newData.apps[newDataKey];
                  if (!mergedData.apps[newDataKey]) {
                    mergedData.apps[newDataKey] = {};
                  }
                  let mergedDataValue = mergedData.apps[newDataKey];
                  for (let value in values) {
                    if (esgst.settings[`${dm.type}_games_${value}`]) {
                      for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                        let valueKey = values[value][j];
                        if (typeof newDataValue[valueKey] !== `undefined`) {
                          if (esgst.settings.importAndMerge) {
                            switch (valueKey) {
                              case `entered`:
                                mergedDataValue.entered = true;
                                break;
                              case `itadi`:
                                if (mergedDataValue.itadi) {
                                  if (newDataValue.itadi.lastCheck > mergedDataValue.itadi.lastCheck) {
                                    mergedDataValue.itadi = newDataValue.itadi;
                                  }
                                } else {
                                  mergedDataValue.itadi = newDataValue.itadi;
                                }
                                break;
                              case `tags`:
                                if (mergedDataValue.tags) {
                                  let tags = newDataValue.tags;
                                  for (let k = 0, numTags = tags.length; k < numTags; ++k) {
                                    let tag = tags[k];
                                    if (mergedDataValue.tags.indexOf(tag) < 0) {
                                      mergedDataValue.tags.push(tag);
                                    }
                                  }
                                } else {
                                  mergedDataValue.tags = newDataValue.tags;
                                }
                                break;
                              default:
                                mergedDataValue[valueKey] = newDataValue[valueKey];
                                break;
                            }
                          } else {
                            mergedDataValue[valueKey] = newDataValue[valueKey];
                          }
                        }
                      }
                    }
                  }
                }
                for (let newDataKey in newData.subs) {
                  let newDataValue = newData.subs[newDataKey];
                  if (!mergedData.subs[newDataKey]) {
                    mergedData.subs[newDataKey] = {};
                  }
                  let mergedDataValue = mergedData.subs[newDataKey];
                  for (let value in values) {
                    if (esgst.settings[`${dm.type}_games_${value}`]) {
                      for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                        let valueKey = values[value][j];
                        if (typeof newDataValue[valueKey] !== `undefined`) {
                          if (esgst.settings.importAndMerge) {
                            switch (valueKey) {
                              case `entered`:
                                mergedDataValue.entered = true;
                                break;
                              case `itadi`:
                                if (mergedDataValue.itadi) {
                                  if (newDataValue.itadi.lastCheck > mergedDataValue.itadi.lastCheck) {
                                    mergedDataValue.itadi = newDataValue.itadi;
                                  }
                                } else {
                                  mergedDataValue.itadi = newDataValue.itadi;
                                }
                                break;
                              case `tags`:
                                if (mergedDataValue.tags) {
                                  let tags = newDataValue.tags;
                                  for (let k = 0, numTags = tags.length; k < numTags; ++k) {
                                    let tag = tags[k];
                                    if (mergedDataValue.tags.indexOf(tag) < 0) {
                                      mergedDataValue.tags.push(tag);
                                    }
                                  }
                                } else {
                                  mergedDataValue.tags = newDataValue.tags;
                                }
                                break;
                              default:
                                mergedDataValue[valueKey] = newDataValue[valueKey];
                                break;
                            }
                          } else {
                            mergedDataValue[valueKey] = newDataValue[valueKey];
                          }
                        }
                      }
                    }
                  }
                }
                await setValue(`games`, JSON.stringify(mergedData));
              }
            } else if (dm.delete) {
              await setValue(`games`, JSON.stringify(mergedData));
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder(`utf-8`).encode(`{"${optionKey}":{"apps":{},"subs":{}}}`)).length;
            sizes.main += size;
            sizes.total += size;
            if (dm.switches) {
              for (let value in values) {
                if (dm.switches[`${optionKey}_${value}`]) {
                  dm.switches[`${optionKey}_${value}`].size.textContent = convertBytes(sizes[value]);
                }
              }
              dm.switches[optionKey].size.textContent = convertBytes(sizes.total);
            }
            totalSize += sizes.total;
          }
          break;
        case `groups`:
          values = {
            main: [`avatar`, `code`, `member`, `name`, `steamId`],
            gpt: [`tags`],
            sgg: [`stickied`]
          };
          mergedData = JSON.parse(await getValue(optionKey, `[]`));
          if (!Array.isArray(mergedData)) {
            let temp = [];
            for (let key in mergedData) {
              temp.push(mergedData[key]);
            }
            mergedData = temp;
          }
          data[optionKey] = [];
          sizes = {
            main: 0,
            gpt: 0,
            sgg: 0,
            total: 0
          };
          mainFound = false;
          for (let j = mergedData.length - 1; j > -1; --j) {
            let newData = {};
            let toDelete = 0;
            let foundSub = 0;
            let deletedSub = 0;
            let found = null;
            let toExport = false;
            for (let value in values) {
              if (esgst.settings[`${dm.type}_${optionKey}_${value}`]) {
                toDelete += 1;
              }
              for (let k = 0, numValues = values[value].length; k < numValues; ++k) {
                let valueKey = values[value][k];
                if (mergedData[j]) {
                  let mergedDataValue = mergedData[j][valueKey];
                  if (typeof mergedDataValue !== `undefined`) {
                    if (value !== `main`) {
                      foundSub += 1;
                    }
                    if (dm.autoBackup || esgst.settings[`${dm.type}_${optionKey}_${value}`] || value === `main`) {
                      newData[valueKey] = mergedDataValue;
                      if (value !== `main`) {
                        toExport = true;
                      }
                    }
                    let size = (new TextEncoder(`utf-8`).encode(`"${valueKey}":${JSON.stringify(mergedDataValue)},`)).length;
                    sizes[value] += size;
                    sizes.total += size;
                    found = value;
                    if (!space && dm.delete && esgst.settings[`${dm.type}_${optionKey}_${value}`] && value !== `main`) {
                      deletedSub += 1;
                      delete mergedData[j][valueKey];
                    }
                  }
                }
              }
            }
            if (found) {
              sizes[found] -= 1;
              sizes.total -= 1;
            }
            if (dm.autoBackup || toExport || esgst.settings[`${dm.type}_${optionKey}_main`]) {
              data[optionKey].push(newData);
              mainFound = true;
            }
            let size = (new TextEncoder(`utf-8`).encode(`{},`)).length;
            sizes.main += size;
            sizes.total += size;
            if (!space && dm.delete && ((esgst.settings[`${dm.type}_${optionKey}_main`] && foundSub === deletedSub) || toDelete === Object.keys(values).length)) {
              mergedData.pop();
            }
          }
          if (mainFound) {
            sizes.main -= 1;
            sizes.total -= 1;
          }
          if (!space) {
            if (dm.import) {
              let newData = dm.data[optionKey];
              if (!Array.isArray(newData)) {
                let temp = [];
                for (let key in newData) {
                  temp.push(newData[key]);
                }
                newData = temp;
              }
              if (newData) {
                for (let j = newData.length - 1; j > -1; --j) {
                  let code = newData[j].code;
                  let k, mergedDataValue;
                  for (k = mergedData.length - 1; k > -1 && mergedData[k].code !== code; --k);
                  if (k > -1) {
                    mergedDataValue = mergedData[k];
                  } else {
                    mergedDataValue = {};
                    mergedData.push(mergedDataValue);
                  }
                  for (let value in values) {
                    if (esgst.settings[`${dm.type}_${optionKey}_${value}`]) {
                      for (let k = 0, numValues = values[value].length; k < numValues; ++k) {
                        let valueKey = values[value][k];
                        switch (valueKey) {
                          case `tags`:
                            if (mergedDataValue.tags) {
                              let tags = newData[j].tags;
                              for (let k = 0, numTags = tags.length; k < numTags; ++k) {
                                let tag = tags[k];
                                if (mergedDataValue.tags.indexOf(tag) < 0) {
                                  mergedDataValue.tags.push(tag);
                                }
                              }
                            } else {
                              mergedDataValue.tags = newData[j].tags;
                            }
                            break;
                          default:
                            mergedDataValue[valueKey] = newData[j][valueKey];
                            break;
                        }
                      }
                    }
                  }
                }
                await setValue(optionKey, JSON.stringify(mergedData));
              }
            } else if (dm.delete) {
              await setValue(optionKey, JSON.stringify(mergedData));
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder(`utf-8`).encode(`{"${optionKey}":[]}`)).length;
            sizes.main += size;
            sizes.total += size;
            if (dm.switches) {
              for (let value in values) {
                if (dm.switches[`${optionKey}_${value}`]) {
                  dm.switches[`${optionKey}_${value}`].size.textContent = convertBytes(sizes[value]);
                }
              }
              dm.switches[optionKey].size.textContent = convertBytes(sizes.total);
            }
            totalSize += sizes.total;
          }
          break;
        case `rerolls`:
        case `stickiedCountries`:
          data[optionKey] = JSON.parse(await getValue(optionKey, `[]`));
          if (!space) {
            if (dm.import) {
              let newData = dm.data[optionKey];
              if (newData) {
                if (esgst.settings.importAndMerge) {
                  mergedData = data[optionKey];
                  for (let j = 0, numNew = newData.length; j < numNew; ++j) {
                    let newDataValue = newData[j];
                    if (mergedData.indexOf(newDataValue) < 0) {
                      mergedData.push(newDataValue);
                    }
                  }
                  await setValue(optionKey, JSON.stringify(mergedData));
                } else {
                  await setValue(optionKey, JSON.stringify(newData));
                }
              }
            } else if (dm.delete) {
              await delValue(optionKey);
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder(`utf-8`).encode(`{"${optionKey}":${await getValue(optionKey, `[]`)}}`)).length;
            totalSize += size;
            if (dm.switches) {
              dm.switches[optionKey].size.textContent = convertBytes(size);
            }
          }
          break;
        case `sgCommentHistory`:
          data[optionKey] = JSON.parse(await getValue(optionKey, `[]`));
          if (!space) {
            if (dm.import) {
              let newData = dm.data[optionKey];
              if (newData) {
                if (esgst.settings.importAndMerge) {
                  mergedData = [];
                  let oldData = data[optionKey];
                  let j = 0;
                  let k = 0;
                  let numNew = newData.length;
                  let numOld = oldData.length;
                  while (j < numOld && k < numNew) {
                    let oldDataValue = oldData[j];
                    let newDataValue = newData[k];
                    if (oldDataValue.timestamp > newDataValue.timestamp) {
                      mergedData.push(oldDataValue);
                      j += 1;
                    } else {
                      let l, numOld;
                      for (l = 0; l < numOld && oldData[l].id !== newDataValue.id; ++l);
                      if (l >= numOld) {
                        mergedData.push(newDataValue);
                      }
                      k += 1;
                    }
                  }
                  while (j < numOld) {
                    mergedData.push(oldData[j]);
                    j += 1;
                  }
                  while (k < numNew) {
                    let newDataValue = newData[k];
                    let l, numOld;
                    for (l = 0; l < numOld && oldData[l].id !== newDataValue.id; ++l);
                    if (l >= numOld) {
                      mergedData.push(newDataValue);
                    }
                    k += 1;
                  }
                  await setValue(optionKey, JSON.stringify(mergedData));
                } else {
                  await setValue(optionKey, JSON.stringify(newData));
                }
              }
            } else if (dm.delete) {
              await delValue(optionKey);
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder(`utf-8`).encode(`{"${optionKey}":${await getValue(optionKey, `[]`)}}`)).length;
            totalSize += size;
            if (dm.switches) {
              dm.switches[optionKey].size.textContent = convertBytes(size);
            }
          }
          break;
        case `users`:
          values = {
            main: [`whitelisted`, `whitelistedDate`, `blacklisted`, `blacklistedDate`],
            giveaways: [`giveaways`],
            namwc: [`namwc`],
            notes: [`notes`],
            nrf: [`nrf`],
            tags: [`tags`],
            uf: [`uf`],
            wbc: [`wbc`]
          };
          data.users = {
            steamIds: {},
            users: {}
          };
          mergedData = JSON.parse(await getValue(`users`, `{"steamIds":{},"users":{}}`));
          sizes = {
            giveaways: 0,
            namwc: 0,
            notes: 0,
            nrf: 0,
            main: 0,
            tags: 0,
            total: 0,
            uf: 0,
            wbc: 0
          };
          mainFound = false;
          mainUsernameFound = false;
          for (let mergedDataKey in mergedData.users) {
            let mergedDataValue = mergedData.users[mergedDataKey];
            let newData = {};
            let toDelete = 0;
            let foundSub = 0;
            let deletedSub = 0;
            let found = null;
            let toExport = false;
            for (let value in values) {
              if (esgst.settings[`${dm.type}_users_${value}`]) {
                toDelete += 1;
              }
              for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                let valueKey = values[value][j];
                if (typeof mergedDataValue[valueKey] !== `undefined`) {
                  if (value !== `main`) {
                    foundSub += 1;
                  }
                  if (dm.autoBackup || esgst.settings[`${dm.type}_users_${value}`] || value === `main`) {
                    newData[valueKey] = mergedDataValue[valueKey];
                    if (value !== `main`) {
                      toExport = true;
                    }
                  }
                  let size = (new TextEncoder(`utf-8`).encode(`"${valueKey}":${JSON.stringify(mergedDataValue[valueKey])},`)).length;
                  sizes[value] += size;
                  sizes.total += size;
                  found = value;
                  if (!space && dm.delete && esgst.settings[`${dm.type}_users_${value}`] && value !== `main`) {
                    deletedSub += 1;
                    delete mergedDataValue[valueKey];
                  }
                }
              }
            }
            if (found) {
              sizes[found] -= 1;
              sizes.total -= 1;
            }
            let id = mergedDataValue.id;
            let username = mergedDataValue.username;
            let size = 0;
            if (id) {
              size += (new TextEncoder(`utf-8`).encode(`"id":"${id}",`)).length;
            }
            if (username) {
              size += (new TextEncoder(`utf-8`).encode(`"username":"${username}","${username}":"${mergedDataKey}",`)).length;
            }
            if (dm.autoBackup || toExport || esgst.settings[`${dm.type}_${optionKey}_main`]) {
              if (id) {
                newData.id = id;
              }
              if (username) {
                newData.username = username;
                data.users.steamIds[username] = mergedDataKey;
                mainUsernameFound = true;
              }
              data.users.users[mergedDataKey] = newData;
              mainFound = true;
            }
            size += (new TextEncoder(`utf-8`).encode(`"${mergedDataKey}":{},`)).length;
            sizes.main += size;
            sizes.total += size;
            if (!space && dm.delete && ((esgst.settings[`${dm.type}_${optionKey}_main`] && foundSub === deletedSub) || toDelete === Object.keys(values).length)) {
              delete mergedData.steamIds[mergedDataValue.username];
              delete mergedData.users[mergedDataKey];
            }
          }
          if (mainFound) {
            sizes.main -= 1;
            sizes.total -= 1;
          }
          if (mainUsernameFound) {
            sizes.main -= 1;
            sizes.total -= 1;
          }
          if (!space) {
            if (dm.import) {
              let newData = dm.data.users;
              if (newData) {
                for (let newDataKey in newData.users) {
                  let newDataValue = newData.users[newDataKey];
                  if (!mergedData.users[newDataKey]) {
                    mergedData.users[newDataKey] = {
                      id: newDataValue.id,
                      username: newDataValue.username
                    };
                    mergedData.steamIds[newDataValue.username] = newDataKey;
                  }
                  let mergedDataValue = mergedData.users[newDataKey];
                  for (let value in values) {
                    if (esgst.settings[`${dm.type}_users_${value}`]) {
                      for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                        let valueKey = values[value][j];
                        if (newDataValue[valueKey]) {
                          if (esgst.settings.importAndMerge) {
                            switch (valueKey) {
                              case `whitelisted`:
                              case `whitelistedDate`:
                              case `blacklisted`:
                              case `blacklistedDate`:
                                mergedDataValue[valueKey] = newDataValue[valueKey];
                                break;
                              case `notes`:
                                mergedDataValue.notes = removeDuplicateNotes(mergedDataValue.notes ? `${mergedDataValue.notes}\n\n${newDataValue.notes}` : newDataValue.notes);
                                break;
                              case `tags`:
                                if (mergedDataValue.tags) {
                                  let tags = newDataValue.tags;
                                  for (let k = 0, numTags = tags.length; k < numTags; ++k) {
                                    let tag = tags[k];
                                    if (mergedDataValue.tags.indexOf(tag) < 0) {
                                      mergedDataValue.tags.push(tag);
                                    }
                                  }
                                } else {
                                  mergedDataValue.tags = newDataValue.tags;
                                }
                                break;
                              case `giveaways`:
                                if (mergedDataValue.giveaways) {
                                  if (newDataValue.giveaways.wonTimestamp > mergedDataValue.giveaways.wonTimestamp) {
                                    mergedDataValue.giveaways.won = newDataValue.giveaways.won;
                                    mergedDataValue.giveaways.wonTimestamp = newDataValue.giveaways.wonTimestamp;
                                  }
                                  if (newDataValue.giveaways.sentTimestamp > mergedDataValue.giveaways.sentTimestamp) {
                                    mergedDataValue.giveaways.sent = newDataValue.giveaways.sent;
                                    mergedDataValue.giveaways.sentTimestamp = newDataValue.giveaways.sentTimestamp;
                                  }
                                } else {
                                  mergedDataValue.giveaways = newDataValue.giveaways;
                                }
                                break;
                              default:
                                if (mergedDataValue[valueKey]) {
                                  if (newDataValue[valueKey].lastCheck > mergedDataValue[valueKey].lastCheck) {
                                    mergedDataValue[valueKey] = newDataValue[valueKey];
                                  }
                                } else {
                                  mergedDataValue[valueKey] = newDataValue[valueKey];
                                }
                                break;
                            }
                          } else {
                            mergedDataValue[valueKey] = newDataValue[valueKey];
                          }
                        }
                      }
                    }
                  }
                }
                await setValue(`users`, JSON.stringify(mergedData));
              }
            } else if (dm.delete) {
              await setValue(`users`, JSON.stringify(mergedData));
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder(`utf-8`).encode(`{"${optionKey}":{"steamIds":{},"users":{}}}`)).length;
            sizes.main += size;
            sizes.total += size;
            if (dm.switches) {
              for (const value in values) {
                if (dm.switches[`${optionKey}_${value}`]) {
                  dm.switches[`${optionKey}_${value}`].size.textContent = convertBytes(sizes[value]);
                }
              }
              dm.switches[optionKey].size.textContent = convertBytes(sizes.total);
            }
            totalSize += sizes.total;
          }
          break;
        case `winners`:
          data.winners = JSON.parse(await getValue(`winners`, `{}`));
          if (!space) {
            if (dm.import) {
              let newData = dm.data.winners;
              if (newData) {
                if (esgst.settings.importAndMerge) {
                  mergedData = data.winners;
                  for (let newDataKey in newData) {
                    if (!mergedData[newDataKey]) {
                      mergedData[newDataKey] = [];
                    }
                    for (let j = 0, numNew = newData[newDataKey].length; j < numNew; ++j) {
                      let newDataValue = newData[newDataKey][j];
                      if (mergedData[newDataKey].indexOf(newDataValue) < 0) {
                        mergedData[newDataKey].push(newDataValue);
                      }
                    }
                  }
                  await setValue(`winners`, JSON.stringify(mergedData));
                } else {
                  await setValue(`winners`, JSON.stringify(newData));
                }
              }
            } else if (dm.delete) {
              await delValue(`winners`);
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder(`utf-8`).encode(`{"${optionKey}":${await getValue(optionKey, `{}`)}}`)).length;
            totalSize += size;
            if (dm.switches) {
              dm.switches[optionKey].size.textContent = convertBytes(size);
            }
          }
          break;
        default:
          break;
      }
    }
    if (!dm.autoBackup && dm.computerSpaceCount) {
      dm.computerSpaceCount.textContent = convertBytes(totalSize);
    }
    if (space) {
      if (space.close) {
        space.close();
      }
      return totalSize;
    } else {
      if (dm.type === `export` || esgst.settings.exportBackup) {
        if (dropbox || (dm.type !== `export` && esgst.settings.exportBackupIndex === 1)) {
          await delValue(`dropboxToken`);
          openSmallWindow(`https://www.dropbox.com/oauth2/authorize?redirect_uri=https://www.steamgifts.com/esgst/dropbox&response_type=token&client_id=nix7kvchwa8wdvj`);
          checkDropboxComplete(data, dm, callback);
        } else if (googleDrive || (dm.type !== `export` && esgst.settings.exportBackupIndex === 2)) {
          await delValue(`googleDriveToken`);
          openSmallWindow(`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https://www.steamgifts.com/esgst/google-drive&response_type=token&client_id=102804278399-95kit5e09mdskdta7eq97ra7tuj20qps.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/drive.appdata`);
          checkGoogleDriveComplete(data, dm, callback);
        } else if (oneDrive || (dm.type !== `export` && esgst.settings.exportBackupIndex === 3)) {
          await delValue(`oneDriveToken`);
          openSmallWindow(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?redirect_uri=https://www.steamgifts.com/esgst/onedrive&response_type=token&client_id=1781429b-289b-4e6e-877a-e50015c0af21&scope=files.readwrite`);
          checkOneDriveComplete(data, dm, callback);
        } else {
          const name = `${esgst.askFileName ?  prompt(`Enter the name of the file:`, `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`) : `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`}`;
          if (name === `null`) {
            callback();
            return;
          }
          if (esgst.backupZip) {
            await downloadZip(data, `${name}.json`, `${name}.zip`);
          } else {
            downloadFile(JSON.stringify(data), `${name}.json`);
          }
          if (!dm.autoBackup) {
            createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
          }
          callback();
        }
      } else {
        createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
        callback();
      }
    }
  }

  async function downloadZip(data, fileName, zipName) {
    downloadFile(null, zipName, await getZip(JSON.stringify(data), fileName));
  }

  async function getZip(data, fileName, type = `blob`) {
    const zip = new JSZip();
    zip.file(fileName, data);
    return (await zip.generateAsync({
      compression: `DEFLATE`,
      compressionOptions: {
        level: 9
      },
      type: type
    }));
  }

  async function readZip(data) {
    const zip = new JSZip(),
        contents = await zip.loadAsync(data),
        keys = Object.keys(contents.files),
        output = [];
    for (const key of keys) {
      output.push({
        name: key,
        value: await zip.file(key).async(`string`)
      });
    }
    return output;
  }

  function downloadFile(data, fileName, blob) {
    const url = URL.createObjectURL(blob || new Blob([data])),
        file = document.createElement(`a`);
    file.download = fileName;
    file.href = url;
    document.body.appendChild(file);
    file.click();
    file.remove();
    URL.revokeObjectURL(url);
  }

  function getDataSizes(dm) {
    let spacePopup = new Popup(`fa-circle-o-notch fa-spin`, `Calculating data sizes...`);
    spacePopup.open(manageData.bind(null, dm, false, false, false, spacePopup));
  }

  async function loadImportFile(dm, dropbox, googleDrive, oneDrive, space, callback) {
    let file;
    if (dropbox) {
      await delValue(`dropboxToken`);
      openSmallWindow(`https://www.dropbox.com/oauth2/authorize?redirect_uri=https://www.steamgifts.com/esgst/dropbox&response_type=token&client_id=nix7kvchwa8wdvj`);
      checkDropboxComplete(null, dm, callback);
    } else if (googleDrive) {
      await delValue(`googleDriveToken`);
      openSmallWindow(`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https://www.steamgifts.com/esgst/google-drive&response_type=token&client_id=102804278399-95kit5e09mdskdta7eq97ra7tuj20qps.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/drive.appdata`);
      checkGoogleDriveComplete(null, dm, callback);
    } else if (oneDrive) {
      await delValue(`oneDriveToken`);
      openSmallWindow(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?redirect_uri=https://www.steamgifts.com/esgst/onedrive&response_type=token&client_id=1781429b-289b-4e6e-877a-e50015c0af21&scope=files.readwrite`);
      checkOneDriveComplete(null, dm, callback);
    } else {
      file = dm.input.files[0];
      if (file) {
        dm.reader = new FileReader();
        const blob = file.name.match(/\.zip$/) && file;
        if (blob) {
          readImportFile(dm, dropbox, googleDrive, oneDrive, space, blob, callback);
        } else {
          dm.reader.readAsText(file);
          dm.reader.onload = readImportFile.bind(null, dm, dropbox, googleDrive, oneDrive, space, null, callback);
        }
      } else {
        createFadeMessage(dm.warning, `No file was loaded!`);
        callback();
      }
    }
  }

  async function readImportFile(dm, dropbox, googleDrive, oneDrive, space, blob, callback) {
    try {
      if (dm.reader) {
        dm.data = JSON.parse(blob
          ? (await readZip(blob))[0].value
          : dm.reader.result
        );
      }
      createConfirmation(`Are you sure you want to restore the selected data?`, manageData.bind(null, dm, dropbox, googleDrive, oneDrive, space, callback), callback);
    } catch (error) {
      createFadeMessage(dm.warning, `Cannot parse file!`);
      callback();
    }
  }

  function confirmDataDeletion(dm, dropbox, googleDrive, oneDrive, space, callback) {
    createConfirmation(`Are you sure you want to delete the selected data?`, manageData.bind(null, dm, dropbox, googleDrive, oneDrive, space, callback), callback);
  }

  async function checkDropboxComplete(data, dm, callback) {
    let value = await getValue(`dropboxToken`);
    if (value) {
      if (dm.type === `export` || (data && esgst.settings.exportBackup)) {
        const name = esgst.askFileName ?  prompt(`Enter the name of the file:`, `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`) : `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`;
        if (name === null) {
          callback();
          return;
        }
        let responseText = ``;
        try {
          const response = await request({
            data: JSON.stringify(data),
            fileName: esgst.backupZip ? `${name}.json` : null,
            headers: {
              authorization: `Bearer ${value}`,
              [`Dropbox-API-Arg`]: esgst.backupZip ? `{"path": "/${name}.zip"}` : `{"path": "/${name}.json"}`,
              [`Content-Type`]: esgst.backupZip ? `application/octet-stream` : `text/plain; charset=dropbox-cors-hack`
            },
            method: `POST`,
            url: `https://content.dropboxapi.com/2/files/upload`
          });
          responseText = response.responseText;
          const responseJson = JSON.parse(responseText);
          if (!responseJson.id) {
            throw ``;
          }
          if (!dm.autoBackup) {
            createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
          }
          callback();
        } catch (e) {
          callback();
          alert(`An error ocurred when uploading the file.\n\n${e}\n\n${responseText}`);
        }
      } else {
        let canceled = true;
        let popup = new Popup(`fa-dropbox`, `Select a file to restore:`, true);
        popup.onClose = () => {
          if (canceled) {
            callback();
          }
        };
        popup.open();
        let entries = createElements(popup.scrollable, `beforeEnd`, [{
          attributes: {
            class: `popup__keys__list`
          },
          type: `div`
        }]);
        JSON.parse((await request({
          data: `{"path": ""}`,
          headers: {
            authorization: `Bearer ${value}`,
            [`Content-Type`]: `application/json`
          },
          method: `POST`,
          url: `https://api.dropboxapi.com/2/files/list_folder`
        })).responseText).entries.forEach(entry => {
          let item = createElements(entries, `beforeEnd`, [{
            attributes: {
              class: `esgst-clickable`
            },
            text: `${entry.name} - ${convertBytes(entry.size)}`,
            type: `div`
          }]);
          item.addEventListener(`click`, () => {
            createConfirmation(`Are you sure you want to restore the selected data?`, async () => {
              canceled = false;
              popup.close();
              dm.data = JSON.parse((await request({
                blob: entry.name.match(/\.zip$/),
                headers: {
                  authorization: `Bearer ${value}`,
                  [`Dropbox-API-Arg`]: `{"path": "/${entry.name}"}`,
                  [`Content-Type`]: `text/plain`
                },
                method: `GET`,
                url: `https://content.dropboxapi.com/2/files/download`
              })).responseText);
              manageData(dm, false, false, false, false, callback);
            });
          });
        });
      }
    } else {
      setTimeout(() => checkDropboxComplete(data, dm, callback), 250);
    }
  }

  async function checkGoogleDriveComplete(data, dm, callback) {
    let value = await getValue(`googleDriveToken`);
    if (value) {
      if (dm.type === `export` || (data && esgst.settings.exportBackup)) {
        const name = esgst.askFileName ?  prompt(`Enter the name of the file:`, `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`) : `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`;
        if (name === null) {
          callback();
          return;
        }
        let responseText = ``;
        try {
          const resourceResponse = await request({
            data: esgst.backupZip ? `{"name": "${name}.zip", "parents": ["appDataFolder"]}` : `{"name": "${name}.json", "parents": ["appDataFolder"]}`,
            headers: {
              authorization: `Bearer ${value}`,
              [`Content-Type`]: `application/json`
            },
            method: `POST`,
            url: `https://www.googleapis.com/drive/v3/files`
          });
          const response = await request({
            data: JSON.stringify(data),
            fileName: esgst.backupZip ? `${name}.json` : null,
            headers: {
              authorization: `Bearer ${value}`,
              [`Content-Type`]: esgst.backupZip ? `application/zip` : `text/plain`
            },
            method: `PATCH`,
            url: `https://www.googleapis.com/upload/drive/v3/files/${JSON.parse(resourceResponse.responseText).id}?uploadType=media`
          });
          responseText = response.responseText;
          const responseJson = JSON.parse(responseText);
          if (!responseJson.id) {
            throw ``;
          }
          if (!dm.autoBackup) {
            createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
          }
          callback();
        } catch (e) {
          callback();
          alert(`An error ocurred when uploading the file.\n\n${e}\n\n${responseText}`);
        }
      } else {
        let canceled = true;
        let popup = new Popup(`fa-google`, `Select a file to restore:`, true);
        popup.onClose = () => {
          if (canceled) {
            callback();
          }
        };
        popup.open();
        let entries = createElements(popup.scrollable, `beforeEnd`, [{
          attributes: {
            class: `popup__keys__list`
          },
          type: `div`
        }]);
        JSON.parse((await request({
          headers: {
            authorization: `Bearer ${value}`
          },
          method: `GET`,
          url: `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder`
        })).responseText).files.forEach(file => {
          let item = createElements(entries, `beforeEnd`, [{
            attributes: {
              class: `esgst-clickable`
            },
            text: `${file.name}`,
            type: `div`
          }]);
          item.addEventListener(`click`, () => {
            createConfirmation(`Are you sure you want to restore the selected data?`, async () => {
              canceled = false;
              popup.close();
              dm.data = JSON.parse((await request({
                blob: file.name.match(/\.zip$/),
                headers: {
                  authorization: `Bearer ${value}`
                },
                method: `GET`,
                url: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`
              })).responseText);
              manageData(dm, false, false, false, false, callback);
            });
          });
        });
      }
    } else {
      setTimeout(() => checkGoogleDriveComplete(data, dm, callback), 250);
    }
  }

  async function checkOneDriveComplete(data, dm, callback) {
    let value = await getValue(`oneDriveToken`);
    if (value) {
      if (dm.type === `export` || (data && esgst.settings.exportBackup)) {
        const name = esgst.askFileName ?  prompt(`Enter the name of the file:`, `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`) : `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`;
        if (name === null) {
          callback();
          return;
        }
        let responseText = ``;
        try {
          const response = await request({
            anon: true,
            data: JSON.stringify(data),
            fileName: esgst.backupZip ? `${name}.json` : null,
            headers: {
              Authorization: `bearer ${value}`,
              [`Content-Type`]: esgst.backupZip ? `application/zip` : `text/plain`
            },
            method: `PUT`,
            url: esgst.backupZip ? `https://graph.microsoft.com/v1.0/me/drive/special/approot:/${name}.zip:/content` : `https://graph.microsoft.com/v1.0/me/drive/special/approot:/${name}.json:/content`
          });
          responseText = response.responseText;
          const responseJson = JSON.parse(responseText);
          if (!responseJson.id) {
            throw ``;
          }
          if (!dm.autoBackup) {
            createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
          }
          callback();
        } catch (e) {
          callback();
          alert(`An error ocurred when uploading the file.\n\n${e}\n\n${responseText}`);
        }
      } else {
        let canceled = true;
        let popup = new Popup(`fa-windows`, `Select a file to restore:`, true);
        let entries = createElements(popup.scrollable, `beforeEnd`, [{
          attributes: {
            class: `popup__keys__list`
          },
          type: `div`
        }]);
        JSON.parse((await request({
          anon: true,
          headers: {
            Authorization: `bearer ${value}`
          },
          method: `GET`,
          url: `https://graph.microsoft.com/v1.0/me/drive/special/approot/children`
        })).responseText).value.forEach(file => {
          let item = createElements(entries, `beforeEnd`, [{
            attributes: {
              class: `esgst-clickable`
            },
            text: `${file.name} - ${convertBytes(file.size)}`,
            type: `div`
          }]);
          item.addEventListener(`click`, () => {
            createConfirmation(`Are you sure you want to restore the selected data?`, async () => {
              canceled = false;
              popup.close();
              dm.data = JSON.parse((await request({
                anon: true,
                blob: file.name.match(/\.zip$/),
                headers: {
                  authorization: `Bearer ${value}`
                },
                method: `GET`,
                url: `https://graph.microsoft.com/v1.0/me/drive/items/${file.id}/content`
              })).responseText);
              manageData(dm, false, false, false, false, callback);
            });
          });
        });
        popup.onClose = () => {
          if (canceled) {
            callback();
          }
        };
        popup.open();
      }
    } else {
      setTimeout(() => checkOneDriveComplete(data, dm, callback), 250);
    }
  }

  async function createLock(key, threshold) {
    let lock = {
      key: key,
      threshold: threshold,
      uuid: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, createUuid)
    };
    await checkLock(lock);
    return setValue.bind(null, key, `{}`);
  }

  async function checkLock(lock) {
    let locked = JSON.parse(await getValue(lock.key, `{}`));
    if (!locked || !locked.uuid || locked.timestamp < Date.now() - (lock.threshold + 1000)) {
      await setValue(lock.key, JSON.stringify({
        timestamp: Date.now(),
        uuid: lock.uuid
      }));
      await timeout(lock.threshold / 2);
      locked = JSON.parse(await getValue(lock.key, `{}`));
      if (!locked || locked.uuid !== lock.uuid) {
        return checkLock(lock);
      }
    } else {
      await timeout(lock.threshold / 3);
      return checkLock(lock);
    }
  }

  async function lockAndSaveGames(games) {
    let deleteLock = await createLock(`gameLock`, 300);
    let saved = JSON.parse(await getValue(`games`));
    for (let key in games.apps) {
      if (saved.apps[key]) {
        for (let subKey in games.apps[key]) {
          if (games.apps[key][subKey] === null) {
            delete saved.apps[key][subKey];
          } else {
            saved.apps[key][subKey] = games.apps[key][subKey];
          }
        }
      } else {
        saved.apps[key] = games.apps[key];
      }
      if (!saved.apps[key].tags) {
        delete saved.apps[key].tags;
      }
    }
    for (let key in games.subs) {
      if (saved.subs[key]) {
        for (let subKey in games.subs[key]) {
          if (games.subs[key][subKey] === null) {
            delete saved.subs[key][subKey];
          } else {
            saved.subs[key][subKey] = games.subs[key][subKey];
          }
        }
      } else {
        saved.subs[key] = games.subs[key];
      }
      if (!saved.subs[key].tags) {
        delete saved.subs[key].tags;
      }
    }
    await setValue(`games`, JSON.stringify(saved));
    deleteLock();
  }

  async function setThemeVersion(id, version, theme) {
    if (!theme) {
      theme = await getValue(id);
    }
    let match = (theme || ``).match(/(v|black\s|blue\s|steamtrades\s)([.\d]+?)\*/);
    version.textContent = `v${(match && match[2]) || `Unknown`}`;
  }

  function resetColor(bgColorContext, colorContext, id) {
    if (colorContext) {
      colorContext.value = esgst.defaultValues[`${id}_color`];
      esgst.settings[`${id}_color`] = colorContext.value;
    }
    bgColorContext.value = esgst.defaultValues[`${id}_bgColor`];
    esgst.settings[`${id}_bgColor`] = bgColorContext.value;
    setValue(`settings`, JSON.stringify(esgst.settings));
  }

  async function resetOrder(select, event) {
    let message = createElements(event.currentTarget, `afterEnd`, [{
      attributes: {
        class: `esgst-description esgst-bold`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: ` Saving...`,
        type: `node`
      }]
    }]);
    let key = select.value;
    esgst.settings[key] = esgst.defaultValues[key];
    await setValue(`settings`, JSON.stringify(esgst.settings));
    message.classList.add(`esgst-green`);
    createElements(message, `inner`, [{
      attributes: {
        class: `fa fa-check`
      },
      type: `i`
    }, {
      text: ` Saved!`,
      type: `node`
    }]);
    setTimeout(() => message.remove(), 2500);
  }

  function setSMManageFilteredUsers(SMManageFilteredUsers) {
    let popup;
    SMManageFilteredUsers.addEventListener(`click`, async () => {
      if (popup) {
        popup.open();
      } else {
        popup = new Popup(`fa-eye-slash`, `Filtered Users`);
        let users = JSON.parse(await getValue(`users`));
        let filtered = [];
        for (let key in users.users) {
          if (users.users[key].uf && (users.users[key].uf.posts || users.users[key].uf.giveaways || users.users[key].uf.discussions)) {
            filtered.push(users.users[key]);
          }
        }
        filtered.sort((a, b) => {
          if (a.username > b.username) {
            return -1;
          } else {
            return 1;
          }
        });
        let table = createElements(popup.scrollable, `beforeEnd`, [{
          attributes: {
            class: `table`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__heading`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__column--width-fill`
              },
              text: `Username`,
              type: `div`
            }, {
              attributes: {
                class: `table__column--width-small`
              },
              text: `Posts Hidden`,
              type: `div`
            }, {
              attributes: {
                class: `table__column--width-small`
              },
              text: `Discussions Hidden`,
              type: `div`
            }, {
              attributes: {
                class: `table__column--width-small`
              },
              text: `Giveaways Hidden`,
              type: `div`
            }]
          }, {
            attributes: {
              class: `table__rows`
            },
            type: `div`
          }]
        }]);
        for (let i = 0, n = filtered.length; i < n; ++i) {
          const postsIcon = filtered[i].uf.posts ? `fa fa-check` : ``;
          const discussionsIcon = filtered[i].uf.discussions ? `fa fa-check` : ``;
          const giveawaysIcon = filtered[i].uf.giveaways ? `fa fa-check` : ``;
          createElements(table.lastElementChild, `beforeEnd`, [{
            attributes: {
              class: `table__row-outer-wrap`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__row-inner-wrap`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `table__column--width-fill`
                },
                type: `div`,
                children: [{
                  attributes: {
                    href: `/user/${filtered[i].username}`
                  },
                  text: filtered[i].username,
                  type: `a`
                }]
              }, {
                attributes: {
                  class: `table__column--width-small`
                },
                type: `div`,
                children: postsIcon ? [{
                  attributes: {
                    class: postsIcon
                  },
                  type: `i`
                }] : null
              }, {
                attributes: {
                  class: `table__column--width-small`
                },
                type: `div`,
                children: discussionsIcon ? [{
                  attributes: {
                    class: discussionsIcon
                  },
                  type: `i`
                }] : null
              }, {
                attributes: {
                  class: `table__column--width-small`
                },
                type: `div`,
                children: giveawaysIcon ? [{
                  attributes: {
                    class: giveawaysIcon
                  },
                  type: `i`
                }] : null
              }]
            }]
          }]);
        }
        popup.open();
      }
    });
  }

  function multiChoice(choice1Color, choice1Icon, choice1Title, choice2Color, choice2Icon, choice2Title, title, onChoice1, onChoice2) {
    if (esgst.settings.cfh_img_remember) {
      if (esgst.cfh_img_choice === 1) {
        onChoice1();
      } else {
        onChoice2();
      }
    } else {
      let popup = new Popup(`fa-list`, title, true);
      new ToggleSwitch(popup.description, `cfh_img_remember`, false, `Never ask again.`, false, false, `Remembers which option you choose forever.`, esgst.settings.cfh_img_remember);
      popup.description.appendChild(new ButtonSet(choice1Color, ``, choice1Icon, ``, choice1Title, ``, callback => {
        if (esgst.settings.cfh_img_remember) {
          setValue(`cfh_img_choice`, 1);
          esgst.cfh_img_choice = 1;
        }
        callback();
        popup.close();
        onChoice1();
      }).set);
      popup.description.appendChild(new ButtonSet(choice2Color, ``, choice2Icon, ``, choice2Title, ``, callback => {
        if (esgst.settings.cfh_img_remember) {
          setValue(`cfh_img_choice`, 2);
          esgst.cfh_img_choice = 2;
        }
        callback();
        popup.close();
        onChoice2();
      }).set);
      popup.open();
    }
  }

  async function exportSettings() {
    let data = {
      settings: JSON.parse(await getValue(`settings`, `{}`))
    };
    delete data.settings.avatar;
    delete data.settings.lastSync;
    delete data.settings.steamApiKey;
    delete data.settings.steamId;
    delete data.settings.syncFrequency;
    delete data.settings.username;
    const name = `${esgst.askFileName ?  prompt(`Enter the name of the file:`, `esgst_settings_${new Date().toISOString().replace(/:/g, `_`)}`) : `esgst_settings_${new Date().toISOString().replace(/:/g, `_`)}`}.json`;
    if (name === `null.json`) return;
    downloadFile(JSON.stringify(data), name);
  }

  async function selectSwitches(switches, type, settings, callback) {
    for (let key in switches) {
      let toggleSwitch = switches[key];
      if (Array.isArray(toggleSwitch)) {
        toggleSwitch[0][type](settings);
      } else if (!toggleSwitch.checkbox || toggleSwitch.checkbox.offsetParent) {
        toggleSwitch[type](settings);
      }
    }
    if (settings) {
      let message = createElements(settings, `beforeEnd`, [{
        attributes: {
          class: `esgst-description esgst-bold`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`,
            title: `Saving...`
          },
          type: `i`
        }]
      }]);
      await setValue(`settings`, JSON.stringify(esgst.settings));
      message.classList.add(`esgst-green`);
      createElements(message, `inner`, [{
        attributes: {
          class: `fa fa-check`,
          title: `Saved!`
        },
        type: `i`
      }]);
      setTimeout(() => message.remove(), 2500);
    }
    if (callback) {
      callback();
    }
  }

  function addStyle() {
    let backgroundColor, color, colors, i, n, style;
    style = `
      :root {
        --esgst-gwc-highlight-width: ${esgst.gwc_h_width};
        --esgst-gwr-highlight-width: ${esgst.gwr_h_width};
      }
    `;
    colors = [
      {
        id: `gc_h`,
        key: `hidden`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_gi`,
        key: `giveawayInfo`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_fcv`,
        key: `fullCV`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_rcv`,
        key: `reducedCV`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_ncv`,
        key: `noCV`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_hltb`,
        key: `hltb`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_w`,
        key: `wishlisted`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_o`,
        key: `owned`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_pw`,
        key: `won`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_i`,
        key: `ignored`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_lg`,
        key: `learning`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_rm`,
        key: `removed`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_ea`,
        key: `earlyAccess`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_tc`,
        key: `tradingCards`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_a`,
        key: `achievements`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_sp`,
        key: `singleplayer`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_mp`,
        key: `multiplayer`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_sc`,
        key: `steamCloud`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_l`,
        key: `linux`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_m`,
        key: `mac`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_dlc`,
        key: `dlc`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_p`,
        key: `package`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_rd`,
        key: `releaseDate`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_g`,
        key: `genres`,
        mainKey: `esgst-gc`
      }
    ];
    for (i = 0, n = colors.length; i < n; ++i) {
      color = esgst[`${colors[i].id}_color`];
      backgroundColor = esgst[`${colors[i].id}_bgColor`];
      style += `
        ${colors[i].key === `genres` ? `a` : ``}.${colors[i].mainKey}-${colors[i].key}:not(.giveaway__column):not(.featured__column) {
          background-color: ${backgroundColor};
          ${color ? `color: ${color};` : ``}
        }
        .${colors[i].mainKey}-${colors[i].key}.giveaway__column, .${colors[i].mainKey}-${colors[i].key}.featured__column {
          color: ${backgroundColor};
        }
      `;
    }
    colors = [
      {
        id: `wbh_w`,
        key: `whitelisted`,
        mainKey: `esgst-wbh-highlight`
      },
      {
        id: `wbh_b`,
        key: `blacklisted`,
        mainKey: `esgst-wbh-highlight`
      },
      {
        id: `ge_p`,
        key: `public`,
        mainKey: `esgst-ge`
      },
      {
        id: `ge_g`,
        key: `group`,
        mainKey: `esgst-ge`
      },
      {
        id: `ge_b`,
        key: `blacklist`,
        mainKey: `esgst-ge`
      }
    ];
    for (i = 0, n = colors.length; i < n; ++i) {
      color = esgst[`${colors[i].id}_color`];
      backgroundColor = esgst[`${colors[i].id}_bgColor`];
      style += `
        .${colors[i].mainKey}-${colors[i].key} {
          background-color: ${backgroundColor} !important;
          ${color ? `color: ${color} !important;` : ``}
        }
      `;
    }
    style += `
      .esgst-inline-list >*:not(:last-child) {
        margin-right: 15px;
      }

      .form_list_item_summary_name {
        display: inline-block;
      }

      .esgst-tag-suggestions {
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 5px;
        max-height: 200px;
        overflow: auto;
        position: absolute;
        width: 300px;
      }

      .esgst-tag-suggestion {
        cursor: pointer;
        font-weight: bold;
        padding: 5px;
        text-shadow: none;
      }

      .esgst-tag-suggestion:not(:last-child) {
        border-bottom: 1px solid #ccc;
      }  

      .esgst-tag-suggestion.esgst-selected {
        background-color: #465670;
        color: #fff;
      }

      .table__row-inner-wrap .esgst-heading-button, .table__row-inner-wrap .esgst-ct-count, .table__row-inner-wrap .esgst-gdttt-button {
        margin-left: 3px !important;
      }

      .esgst-gc-panel >*, .esgst-toggle-switch {
        margin-right: 3px !important;
      }

      .esgst-ugd-input {
        background-color: inherit !important;
        border-color: inherit !important;
        color: inherit;
        display: inline-block;
        margin: 0 5px;
        padding: 0 2px !important;
        width: 50px;
      }

      .esgst-hwlc-panel {
        display: flex;
        justify-items: space-between;
      }

      .esgst-hwlc-section {
        margin: 25px;
        width: 300px;
      }

      .esgst-hwlc-section textarea {
        min-height: 200px;
      }

      @keyframes border-blink {
        50% {
          border-color: transparent;
        }
      }

      .esgst-minimize-panel {
        left: -198px;
        position: fixed;
        top: 0;
        width: 200px;
        z-index: 999999999;
      }

      .esgst-minimize-panel:hover {
        padding-left: 198px;
      }

      .esgst-minimize-container {
        background-color: #fff;
        height: 100vh;
        overflow-y: auto;
        padding: 5px;
        width: 188px;
      }

      .esgst-minimize-panel.alert {
        animation: border-blink 1s ease-in-out infinite;
        border-right: 10px solid #ff0000;
        left: -200px;
      }

      .esgst-minimize-panel.alert:hover {
        border: none;
        left: -198px;
      }

      .esgst-minimize-item.alert {
        animation: border-blink 1s ease-in-out infinite;
        border: 2px solid #ff0000;
      }

      :root {
        --esgst-body-bg-color: #f0f2f5;
      }

      .sticky_sentinel {
        left: 0;
        position: absolute;
        right: 0;
        visibility: hidden;
      }

      .esgst-gf-basic-filters {
        display: flex;
        justify-content: space-between;
      }

      .esgst-gf-basic-filters input {
        display: inline-block;
        padding: 2px;
        width: 100px;
      }

      .esgst-gf-basic-filters >* {
        margin: 5px;
      }

      .esgst-gf-number-filters {
        flex: 1;
      }

      .esgst-gf-number-filters >*, .esgst-gf-string-filters >* {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      .esgst-gf-boolean-filters {
        column-count: 2;
        flex: 1;
      }

      .esgst-gf-basic-filters + div {
        font-size: 14px;
        font-weight: bold;
      }

      .esgst-gf-legend-panel {
        display: block;
        float: right;
        text-align: right;
        margin-top: 50px;
      }

      .esgst-ns * {
        max-width: 206px;
      }

      .esgst-clear-container {
        display: flex;
      }

      .esgst-clear-button {
        align-self: center;
        cursor: pointer;
        padding: 5px 10px;
      }

      .esgst-draggable-trash {
        background-color: #C11B17;
        border-radius: 5px;
        color: #E77471;
        position: absolute;
        text-align: center;
        text-shadow: none;
      }

      .esgst-draggable-trash i {
        font-size: 25px;
        margin: 5px;
      }

      .esgst-qiv-new {
        float: right;
        font-weight: bold;
        margin-right: 10px;
      }

      .esgst-mm-checkbox {
        display: inline-block;
        margin-right: 5px;
      }

      .esgst-mm-checkbox i {
        margin: 0;
      }

      .esgst-mm-popout {
        width: 550px;
      }

      .esgst-mm-popout textarea {
        height: 150px !important;
        overflow-y: auto !important;
      }

      .esgst-mm-popout .esgst-button-set >* {
        line-height: 25px;
        margin: 2px;
        padding-bottom: 0;
        padding-top: 0;
        width: 100px;
      }

      .esgst-mm-headings {
        display: flex;
        font-size: 0;
      }

      .esgst-mm-headings >* {
        background-color: #eee;
        border: 1px solid #ccc;
        cursor: pointer;
        flex: 1;
        font-size: 12px;
        font-weight: bold;
        padding: 5px;
        width: 150px;
      }

      .esgst-mm-headings .esgst-selected {
        background-color: #fff;
        border-bottom: 0;
      }

      .esgst-mm-sections {
        border-bottom: 1px solid #ccc;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        padding: 5px;
      }

      .esgst-mm-sections >* {
        display: none;
      }

      .esgst-mm-sections .esgst-selected {
        display: block;
      }

      .esgst-rotate-90 {
        transform: rotate(90deg);
      }

      .esgst-rotate-270 {
        transform: rotate(270deg);
      }

      .esgst-chfl-compact {
        padding: 8px 15px !important;
      }

      .footer__outer-wrap .esgst-chfl-panel, footer .esgst-chfl-panel {
        position: static !important;
      }

      .esgst-chfl-panel {
        position: absolute;
        right: 10px;
      }

      .esgst-chfl-panel i {
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 5px;
        color: #555 !important;
        cursor: pointer;
        font-size: 18px !important;
        margin: 0 !important;
        padding: 5px;
        width: auto !important;
      }

      .esgst-chfl-small i {
        font-size: 18px !important;
        width: 36px;
      }

      .esgst-mgc-table * {
        text-align: left;
      }

      .esgst-ochgb {
        display: inline-block;
      }

      .featured__heading .esgst-ochgb i, .featured__heading .esgst-gf-hide-button i, .featured__heading .esgst-gf-unhide-button i, .featured__heading .esgst-gb-button i {
        opacity: .6;
        transition: opacity .2s;
      }

      .featured__heading .esgst-ochgb i:hover, .featured__heading .esgst-gf-hide-button i:hover, .featured__heading .esgst-gf-unhide-button i:hover, .featured__heading .esgst-gb-button i:hover {
        opacity: 1;
      }

      @keyframes esgst-blinker {
        50% { opacity: 0; }
      }

      .esgst-blinking {
        animation: esgst-blinker 1s linear infinite;
      }

      .esgst-qiv-popout {
        max-height: 600px !important;
        overflow: hidden !important;
        width: 600px;
      }

      .esgst-qiv-comments {
        overflow-y: auto;
      }

      .esgst-giveaway-column-button {
        border: 0;
        padding: 0;
      }

      .esgst-giveaway-column-button >* {
        line-height: inherit;
      }

      .esgst-elgb-button .sidebar__error {
        margin-bottom: 0;
      }

      .esgst-mgc-preview {
        border: 1px solid #ccc;
        padding: 25px;
        width: 600px;
      }

      .esgst-mgc-input {
        display: inline-block;
        text-align: center;
        width: 75px;
      }

      .esgst-relative {
        position: relative;
      }

      .esgst-nm-icon {
        color: #ff0000 !important;
      }

      .esgst-disabled {
        cursor: default !important;
        opacity: 0.5;
      }

      .esgst-changelog img {
        max-width: 98%;
      }

      .esgst-radb-button {
        cursor: pointer;
        display: inline-block;
      }

      .esgst-radb-button.homepage_heading {
        margin-right: 5px;
      }

      :not(.page__heading) > .esgst-radb-button:not(.homepage_heading) {
        margin-left: 5px;
      }

      .esgst-radb-button + .homepage_heading {
        display: inline-block;
        width: calc(100% - 80px);
      }

      .esgst-cfh-preview {
        margin: 5px 0;
        text-align: left;
      }

      .esgst-qgs-container i {
        color: #AAB5C6;
      }

      .esgst-qgs-container {
        align-items: center;
        background-color: #fff;
        border-color: #c5cad7 #dee0e8 #dee0e8 #d2d4e0;
        border-radius: 4px;
        border-style: solid;
        border-width: 1px;
        display: flex;
        margin-right: 5px;
        padding: 5px 10px;
      }

      .esgst-qgs-container-expanded {
        position: absolute;
      }

      .esgst-qgs-container-expanded .esgst-qgs-input {
        width: 300px;
      }

      .esgst-qgs-container-expanded + .nav__button-container {
        margin-left: 40px;
      }

      .esgst-qgs-input {
        border: 0 !important;
        height: 100%;
        line-height: normal !important;
        padding: 0 !important;
        width: 0;
      }

      .esgst-sgc-results .table__row-outer-wrap {
        padding: 10px 5px;
      }

      .esgst-glwc-results {
        display: flex;
      }

      .esgst-glwc-results >* {
        flex: 1;
        margin: 10px;
      }

      .esgst-glwc-heading {
        font-family: "Open Sans";
        font-size: 25px;
        margin: 5px;
        text-align: center;
      }

      .esgst-stbb-button, .esgst-sttb-button {
        cursor: pointer;
      }

      .esgst-stbb-button-fixed, .esgst-sttb-button-fixed {
        bottom: ${esgst.ff ? 49 : 5}px;
        background-color: #fff;
        border: 1px solid #d2d6e0;
        border-radius: 4px;
        color: #4B72D4;
        padding: 5px 15px;
        position: fixed;
        right: 5px;
      }

      .esgst-stbb-button:not(.esgst-hidden) + .esgst-sttb-button {
        bottom: 79px;
      }

      .esgst-bold {
        font-weight: bold;
      }

      .esgst-italic {
        font-style: italic;
      }

      .esgst-es-page-divisor {
        margin: 5px 0;
      }

      .comment__parent .esgst-cerb-reply-button {
        margin-top: 54px;
        position: absolute;
        text-align: center;
        width: 44px;
      }

      .comment_inner .esgst-cerb-reply-button {
        margin-left: 21px;
        margin-top: 34px;
        position: absolute;
        text-align: center;
        width: 24px;
      }

      .esgst-page-heading {
        display: flex;
        align-items: flex-start;
        word-wrap: break-word;
      }

      .esgst-page-heading >* {
        background-image: linear-gradient(#fff 0%, rgba(255,255,255,0.4) 100%);
        display: flex;
        padding: 5px 10px;
        border: 1px solid #d2d6e0;
        border-radius: 4px;
        color: #4B72D4;
        font: 700 14px/22px "Open Sans", sans-serif;
      }

      .esgst-page-heading i {
        line-height: 22px;
      }

      .esgst-page-heading >*:not(.page__heading__breadcrumbs) {
        align-items: center;
      }

      .esgst-page-heading >*:not(:last-child) {
        margin-right: 5px;
      }

      .esgst-form-row {
        margin-bottom: 20px;
      }

      .esgst-form-row:first-of-type {
        margin-top: 14px;
      }

      .esgst-form-heading {
        align-items: center;
        display: flex;
        margin-bottom: 5px;
      }

      .esgst-form-heading > div:not(:last-child) {
        margin-right: 10px;
      }

      .esgst-form-heading-number {
        font: 300 14px "Open Sans", sans-serif;
        color:#6b7a8c;
      }

      .esgst-form-heading-text {
        font: 700 14px "Open Sans", sans-serif;
        color: #4B72D4;
      }

      .esgst-form-row-indent {
        padding: 3px 0 3px 20px;
        margin-left: 5px;
        border-left: 1px solid #d2d6e0;
        box-shadow: 1px 0 0 rgba(255,255,255,0.3) inset;
      }

      .esgst-form-sync {
        display: flex;
      }

      .esgst-form-sync-data {
        flex: 1;
      }

      .esgst-notification {
        border: 1px solid;
        border-radius: 4px;
        padding: 0 15px;
        font-size: 11px;
        line-height: 32px;
        overflow: hidden;
      }

      .esgst-notification a {
        text-decoration: underline;
      }

      .esgst-notification-success {
        background-image: linear-gradient(#f7fcf2 0%, #e7f6da 100%);
        border-color: #C5E9A5;
        color:#8fa47b;
      }

      .esgst-notification-warning {
        background-image: linear-gradient(#F6F6E6 0px, #F5F5DF 20px);
        border-color: #EDE5B2;
        color: #a59d7c;
      }

      .esgst-user-icon {
        display: inline-block;
        line-height: normal;
        margin: 0 5px 0 0;
      }

      .esgst-user-icon i {
        border: 0;
        line-height: normal;
        margin: 0;
        text-shadow: none !important;
      }

      .esgst-whitelist {
        color: #556da9 !important;
      }

      .esgst-blacklist {
        color: #a95570 !important;
      }

      .esgst-positive {
        color: #96c468 !important;
      }

      .esgst-negative {
        color: #ec8583 !important;
      }

      .esgst-unknown {
        color: #77899a !important;
      }

      .esgst-ugd-table .table__rows .table__row-outer-wrap:hover {
        background-color: rgba(119, 137, 154, 0.1);
      }

      .esgst-ugd-table .table__column--width-small {
        min-width: 0;
        width: 12%;
      }

      .esgst-ugd-lists {
        display: flex;
        justify-content: center;
      }

      .markdown {
        word-break: break-word;
      }

      .esgst-busy >* {
        opacity: 0.2;
      }

      .comment__actions .esgst-rml-link {
        margin: 0 0 0 10px;
      }

      .esgst-settings-menu .form__sync-default {
        margin: 0 5px;
      }

      .esgst-uh-popup a {
        border-bottom: 1px dotted;
      }

      .esgst-auto-sync {
        display: inline-block;
        margin: -5px 5px 0;
        padding: 2px;
        width: 50px;
      }

      .esgst-ap-popout .featured__table__row__left:not(.esgst-uh-title), .esgst-mr-reply, .esgst-mr-edit, .esgst-mr-delete, .esgst-mr-undelete {
        margin: 0 10px 0 0;
      }

      .esgst-ugd-button {
        cursor: pointer;
        display: inline-block;
      }

      .esgst-cfh-popout {
        font: 700 12px "Open Sans", sans-serif;
      }

      .esgst-cfh-panel span >:first-child >* {
        margin: 0 !important;
      }

      .esgst-cfh-popout input {
        width: auto;
      }

      .esgst-namwc-highlight {
        font-weight: bold;
      }

      .esgst-iwh-icon {
        margin: 0 0 0 5px;
      }

      .esgst-ap-suspended >* {
        color: #e9202a;
      }

      .esgst-ap-popout {
        border: none !important;
        border-radius: 5px;
        box-shadow: 0 0 10px 2px hsla(0, 0%, 0%, 0.8);
        min-width: 400px;
        padding: 0 !important;
        text-shadow: none;
      }

      .ui-tooltip {
        z-index: 99999;
      }

      .esgst-ap-popout .featured__outer-wrap:not(.esgst-uh-box) {
        border-radius: 5px;
        padding: 5px;
        width: auto;
        white-space: normal;
      }

      .esgst-ap-popout .featured__inner-wrap {
        align-items: flex-start;
        padding: 0 5px 0 0;
      }

      .esgst-ap-popout .featured__heading {
        margin: 0;
      }

      .esgst-ap-popout .featured__heading__medium {
        font-size: 18px;
      }

      .esgst-ap-link {
        width: 100px;
      }

      .esgst-ap-link .global__image-outer-wrap--avatar-large {
        box-sizing: content-box !important;
        height: 64px !important;
        margin: 5px;
        width: 64px !important;
      }

      .esgst-ap-popout .global__image-outer-wrap--avatar-large:hover {
        background-color: hsla(0, 0%, 25%, 0.2) !important;
      }

      .esgst-ap-link .global__image-inner-wrap {
        background-size: cover !important;
      }

      .esgst-ap-popout .sidebar__shortcut-outer-wrap {
        margin: 10px 0;
      }

      .esgst-ap-popout .sidebar__shortcut-inner-wrap i {
        height: 18px;
        font-size: 12px;
      }

      .esgst-ap-popout .sidebar__shortcut-inner-wrap * {
        line-height: 18px;
        vertical-align: middle;
      }

      .esgst-ap-popout .sidebar__shortcut-inner-wrap img {
        height: 16px;
        vertical-align: baseline !important;
        width: 16px;
      }

      .esgst-ap-popout .featured__table {
        display: inline-block;
        width: 100%;
      }

      .esgst-ap-popout .featured__table__row {
        padding: 2px;
      }

      .esgst-ap-popout .featured__table__row:nth-child(n + 3) {
        margin-left: -95px;
      }

      .esgst-ap-popout .featured__table__row:last-of-type .featured__table__row__right * {
        font-size: 11px;
      }

      .esgst-ct-comment-button {
        cursor: pointer;
      }

      .popup__keys__list .esgst-ggl-member, .esgst-dh-highlighted, .esgst-dh-highlighted.table__row-outer-wrap {
        background-color: rgba(150, 196, 104, 0.2) !important;
        padding: 5px !important;
      }

      .esgst-gb-highlighted.ending, .esgst-error-button, .esgst-error-button >*:hover {
        background-color: rgba(236, 133, 131, 0.8) !important;
        background-image: none !important;
      }

      .esgst-gb-highlighted.started {
        background-color: rgba(150, 196, 104, 0.8) !important;
        background-image: none !important;
      }

      .esgst-gb-highlighted.ending.started {
        background-color: rgba(193, 165, 118, 0.8) !important;
        background-image: none !important;
      }

      .esgst-ct-comment-read:hover, .esgst-ct-visited:hover {
        background-color: rgba(119, 137, 154, 0.1) !important;
      }

      .esgst-gf-hide-button, .esgst-gf-unhide-button, .esgst-gb-button, .esgst-gdttt-button {
        cursor: pointer; display: inline-block;
        margin: 0 5px 0 0;
      }

      .esgst-codb-button, .esgst-dh-button, .esgst-df-button {
        display: inline-block;
        margin: 0 5px 0 0;
        padding: 0;
      }

      .page__heading .esgst-codb-button >*, .page__heading .esgst-dh-button >*, .page__heading .esgst-df-button >* {
        padding: 5px 10px;
      }

      .esgst-ust-checkbox {
        cursor: pointer;
        margin-left: -17px;
        position: absolute;
        top: calc(50% - 7px);
      }

      .esgst-pm-button {
        margin-left: -17px;
        position: absolute;
        top: calc(50% - 7px);
      }

      .esgst-dh-highlighted .esgst-pm-button {
        margin-left: -22px;
      }

      .page__heading .esgst-pm-button {
        display: inline-block;
        margin: 0 5px 0 0;
        padding: 0;
        position: static;
      }

      .page__heading .esgst-pm-button >* {
        padding: 5px 10px;
      }

      .esgst-adots .esgst-pm-button {
        margin-left: -58px;
      }

      .comment__actions .esgst-ct-comment-button {
        margin: 0 0 0 10px;
      }

      .comment__actions >:first-child + .esgst-ct-comment-button {
        margin: 0;
      }

      .esgst-ct-comment-button >:not(:last-child) {
        margin: 0 10px 0 0;
      }

      .esgst-cfh-panel {
        margin: 0 0 2px;
        position: sticky;
        text-align: left;
      }

      .esgst-cfh-panel >* {
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        display: inline-block;
        margin: 1px;
        opacity: 0.5;
        padding: 5px;
      }

      .esgst-cfh-panel >*:hover {
        opacity: 1;
      }

      .esgst-cfh-panel span >:not(:first-child), .esgst-ded-status {
        display: block;
      }

      .esgst-cfh-panel span i {
        line-height: 22px;
      }

      .esgst-cfh-panel .form__saving-button {
        display: inline-block;
        margin: 5px;
        min-width:0;
      }

      .esgst-cfh-panel table {
        display: block;
        max-height: 200px;
        max-width: 375px;
        overflow: auto;
      }

      .esgst-cfh-panel table td:first-child {
        min-width: 25px;
        text-align: center;
      }

      .esgst-cfh-panel table td:not(:first-child) {
        min-width: 75px;
        text-align: center;
      }

      .esgst-cfh-emojis {
        display: block !important;
        font-size: 18px;
        max-height: 200px;
        min-height: 30px;
        overflow: auto;
        text-align: center;
      }

      .esgst-cfh-emojis >* {
        cursor: pointer;
        display: inline-block;
        margin: 2px;
      }

      .esgst-cfh-popout {
        white-space: normal;
        width: 300px;
      }

      .esgst-mpp-popup {
        position: fixed !important;
      }

      .esgst-mpp-visible {
        padding: 0;
      }

      .esgst-mpp-hidden {
        display: none;
        max-height: 75%;
        overflow: auto;
        padding: 15px;
        position: absolute;
        width: 75%;
      }

      .esgst-ueg {
        opacity: 1 !important;
      }

      .esgst-fh {
        height: auto !important;
        position: sticky;
        top: 0;
        z-index: 999 !important;
      }

      .esgst-fs {
        overflow-y: hidden;
        position: sticky;
      }

      .esgst-fs.stuck {
        overflow-y: auto;
      }

      .esgst-fs.stuck .sidebar__mpu {
        display: none !important;
      }

      .esgst-fmph {
        background-color: var(--esgst-body-bg-color);
        margin-top: -5px;
        padding: 5px 0;
        position: sticky;
        z-index: 998;
      }

      .esgst-fmph + * {
        margin-top: -5px;
      }

      .esgst-ff {
        background-color: inherit;
        bottom: 0;
        padding: 0;
        position: sticky;
        z-index: 999;
      }

      .esgst-ff >* {
        padding: 15px 25px;
      }

      .esgst-sgac-button, .esgst-sgg-button {
        margin: 0 5px 0 0;
      }

      .esgst-ct-count {
        color: #e9202a;
        font-weight: bold;
      }

      .esgst-uh-box {
        background: linear-gradient(to bottom, #555, #222);
        border: 1px solid #888;
        margin: 5px 0 0;
        padding: 15px;
        position: absolute;
        text-align: center;
      }

      .esgst-uh-title {
        color: rgba(255, 255, 255, 0.6);
        font-weight: bold;
        margin: 0 0 15px;
      }

      .esgst-uh-list {
        color: rgba(255, 255, 255, 0.4);
      }

      .esgst-ugd-button, .esgst-wbc-button, .esgst-namwc-button, .esgst-nrf-button {
        cursor: pointer;
        margin: 0 0 0 5px;
      }

      .esgst-luc-value {
        margin: 0 0 0 5px;
      }

      .esgst-sgpb-container {
        display: flex;
      }

      .esgst-sgpb-container >* {
        flex: 1;
      }

      .esgst-sgpb-button {
        background-image: linear-gradient(rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 100%);
        border-color: #dde2ea #cdd4df #cbd1dc #d6dbe7;
        color: #6e7585;
        text-shadow: 1px 1px 1px #fff;
        transition: opacity 0.5s;
        border-radius: 3px;
        font: 700 13px 'Open Sans', sans-serif;
        margin: 0 0 0 5px;
        padding: 7px 15px;
        display: flex;
        align-items: center;
        border-width: 1px;
        border-style: solid;
        text-decoration: none;
      }

      .esgst-sgpb-button:active {
        background-image: linear-gradient(#e1e7eb 0%, #e6ebf0 50%, #ebeff2 100%) !important;
        box-shadow: 2px 2px 5px #ccd4db inset;
        text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.6);
        margin: 2px 0 0 7px !important;
        border: 0;
      }

      .esgst-sgpb-button:hover {
        background-image: linear-gradient(rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.3) 100%);
      }

      .esgst-sgpb-button i {
        height: 14px;
        margin: 0 10px 0;
        width: 14px;
      }

      .esgst-sgpb-button img {
        height: 14px;
        vertical-align: baseline;
        width: 14px;
      }

      .esgst-stpb-button img {
        vertical-align: top;
      }

      .esgst-gh-highlight, .esgst-green-highlight {
        background-color: rgba(150, 196, 104, 0.2);
      }

      .esgst-pgb-button, .esgst-gf-button {
        border: 1px solid #d2d6e0;
        border-top: none;
        background-color: #e1e6ef;
        background-image: linear-gradient(rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);color: #6b7a8c;
        cursor: pointer;
        margin-bottom: 15px;
        padding: 3px;
        text-align: center;
        border-radius: 0 0 4px 4px;
      }

      .esgst-gf-button {
        margin-bottom: 0 !important;
      }

      .esgst-pgb-button:hover, .esgst-gf-button:hover {
        background-image:linear-gradient(rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%);
      }

      .esgst-gm-giveaway {
        background-color: #fff;
        border: 1px solid;
        border-radius: 4px;
        cursor: pointer;
        display: inline-block;
        margin: 5px 2px;
        padding: 2px 5px;
      }

      .esgst-feature-description {
        background-color: #fff;
        color: #465670;
        padding: 10px;
        width: 420px;
        border-radius: 4px;
      }

      .esgst-feature-description img {
        max-width: 400px;
      }

      .esgst-gm-giveaway.error {
        background-color: rgba(236, 133, 131, 0.5);
      }

      .esgst-gm-giveaway.success {
        background-color: rgba(150, 196, 104, 0.5);
      }

      .esgst-gm-giveaway.connected {
        text-decoration: line-through;
      }

      .esgst-gts-section >*, .esgst-gm-section >* {
        margin: 5px 0;
      }

      .esgst-gm-section .esgst-button-set {
        display: inline-block;
        margin: 5px;
      }

      .sidebar .esgst-button-set >* {
        margin-bottom: 5px;
        width: 304px;
      }

      .esgst-button-set .sidebar__entry-delete, .esgst-button-set .sidebar__error {
        display: inline-block;
      }

      .esgst-button-group {
        display: block;
      }

      .esgst-button-group >* {
        display: inline-block;
      }

      .esgst-button-group >*:not(:first-child) {
        margin-left: 5px;
      }

      .esgst-ggl-panel {
        color: #6b7a8c;
        font-size: 12px;
        padding: 5px;
      }

      .esgst-ggl-panel >* {
        display: inline-block;
      }

      .esgst-ggl-panel >*:not(:last-child) {
        margin-right: 10px;
      }

      .esgst-ggl-panel a:last-child {
        border-bottom: 1px dotted;
      }

      .esgst-ggl-panel .table_image_avatar {
        cursor: pointer;
        display: inline-block;
        height: 12px;
        width: 12px;
        vertical-align: middle;
      }

      .esgst-ggl-member {
        font-weight: bold;
      }

      .esgst-ggl-heading {
        font-weight: bold;
        line-weight: 22px;
        margin: 10px;
      }

      .esgst-gcl-popout, .esgst-ggl-popout {
        padding: 0 !important;
      }

      .esgst-gcl-popout .table__row-outer-wrap, .esgst-ggl-popout .table__row-outer-wrap {
        padding: 10px 5px;
      }

      .esgst-hidden-buttons {
        padding: 2px !important;
      }

      .esgst-popout {
        background-color: #fff;
        border: 1px solid #d2d6e0;
        border-radius: 4px;
        color: #465670;
        left: 0;
        overflow: auto;
        padding: 10px;
        position: absolute;
        top: 0;
        z-index: 99999;
      }

      .esgst-aic-carousel {
        align-items: center;
        cursor: default !important;
        display: flex;
        justify-content: center;
      }

      .esgst-aic-carousel >:last-child {
        border: 5px solid #fff;
        border-radius: 5px;
        max-width: 90%;
      }

      .esgst-aic-carousel img {
        display: block;
      }

      .esgst-aic-panel {
        color: #fff;
        position: absolute;
        text-align: center;
        top: 25px;
      }

      .esgst-aic-left-button, .esgst-aic-right-button {
        cursor: pointer;
        display: inline-block;
        margin: 10px;
        text-align: center;
        width: 25px;
      }

      .esgst-aic-left-button i, .esgst-aic-right-button i {
        font-size: 25px;
      }

      .esgst-aic-source {
        font-weight: bold;
        margin-top: 10px;
        text-decoration: underline;
      }

      .esgst-popup-modal {
        background-color: rgba(60, 66, 77, 0.7);
        bottom: 0;
        cursor: pointer;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
      }

      .esgst-popup-large {
        width: 75%;
      }

      .esgst-popup {
        background-color: var(--esgst-body-bg-color);
        border-radius: 4px;
        color: #465670;
        padding: 25px;
        position: fixed;
        text-align: center;
        text-shadow: 1px 1px rgba(255,255,255,0.94);
        transition: 500ms ease;
        ${esgst.staticPopups ? `
          max-width: calc(100% - 150px);
          top: 50px;
          ${esgst.staticPopups_f ? `
            left: 0;
            margin: 0 auto;
            right: 0;
            width: ${esgst.staticPopups_width};
          ` : `
            left: 50px;
          `}
        ` : `
          max-width: calc(90% - 50px);
        `}
      }

      .esgst-popout li:before, .esgst-popup li:before {
        margin-left: 0;
        padding-right: 10px;
        position: static;
        width: auto;
        text-align: left;
      }

      .esgst-popup-description >*:not(.esgst-tag-suggestions), .esgst-popup-scrollable >* {
        margin: 10px 0 0 !important;
      }

      .esgst-popup-actions {
        color: #4b72d4;
        margin-top: 15px;
      }

      .esgst-popup-actions >* {
        border-bottom: 1px dotted;
        box-shadow: 0 1px 0 #fff;
        cursor: pointer;
        display: inline-block;
      }

      .esgst-popup-actions >*:not(:last-child) {
        margin-right: 15px;
      }

      .esgst-popup-scrollable {
        overflow: auto;
      }

      .esgst-popup .popup__keys__list {
        max-height: none;
      }

      .esgst-heading-button {
        display: inline-block;
        cursor: pointer;
      }

      .esgst-popup-heading {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
      }

      .esgst-popup-icon {
        font-size: 25px;
        margin-right: 10px;
      }

      .esgst-popup-title {
        font: 300 18px 'Open Sans', sans-serif;
      }

      .esgst-popup-title span {
        font-weight: bold;
      }

      .esgst-text-left {
        text-align: left;
      }

      .esgst-text-center {
        text-align: center;
      }

      .esgst-hidden {
        display: none !important;
      }

      .esgst-clickable {
        cursor: pointer;
      }

      .fa img {
        height: 14px;
        width: 14px;
        vertical-align: middle;
      }

      .nav__left-container .fa img {
        vertical-align: baseline;
      }

      .esgst-checkbox, .esgst-hb-update, .esgst-hb-changelog, .esgst-dh-view-button {
        cursor: pointer;
      }

      .esgst-sm-small-number {
        font-size: 12px;
        display: inline-block;
      }

      .esgst-toggle-switch-container {
        margin: 2px;
      }

      .esgst-toggle-switch-container.inline {
        display: inline-block;
      }

      .page__heading .esgst-toggle-switch-container.inline, .page_heading .esgst-toggle-switch-container.inline, .esgst-page-heading .esgst-toggle-switch-container.inline {
        height: 16px;
        margin: 0 2px;
        line-height: normal;
        vertical-align: middle;
      }

      .esgst-toggle-switch {
        position: relative;
        display: inline-block;
        width: 26px;
        height: 14px;
        vertical-align: top;
      }

      .esgst-toggle-switch input {
        display: none !important;
      }

      .esgst-toggle-switch-slider {
        border-radius: 20px;
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
      }

      .esgst-toggle-switch-slider:before {
        border-radius: 50%;
        position: absolute;
        content: "";
        height: 12px;
        width: 12px;
        left: 1px;
        bottom: 1px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
      }

      input:checked + .esgst-toggle-switch-slider {
        background-color: #4B72D4;
      }

      input:focus + .esgst-toggle-switch-slider {
        box-shadow: 0 0 1px #4B72D4;
      }

      input:checked + .esgst-toggle-switch-slider:before {
        -webkit-transform: translateX(12px);
        -ms-transform: translateX(12px);
        transform: translateX(12px);
      }

      .esgst-adots, .esgst-rbot {
        margin-bottom: 25px;
      }

      .esgst-float-left {
        float: left;
      }

      .esgst-float-right {
        float: right;
      }

      .esgst-clear {
        clear: both;
      }

      .esgst-rbot .reply_form .btn_cancel {
        display: none;
      }

      .esgst-aas-button {
        cursor: pointer;
        display: inline-block;
      }

      .esgst-es-page-heading {
        margin-top: 25px;
      }

      .esgst-gc-border {
        display: flex;
        height: 5px;
        margin-left: 5px;
        width: ${esgst.ib ? `186px` : `174px`};
      }

      .esgst-gc-border >* {
        flex: 1;
      }

      .esgst-gc-panel {
        text-align: left;
      }

      .esgst-gc-panel a {
        text-decoration: none;
      }

      .esgst-gc-panel-inline {
        display: inline-block;
        margin: 0 0 0 5px;
      }

      .esgst-gch-highlight, .esgst-gc:not(.giveaway__column):not(.featured__column) {
        border-radius: 4px;
        display: inline-block;
        font-size: 10px;
        line-height: 10px;
        margin: 5px 0;
        padding: 2px 3px;
        text-shadow: none;
      }

      .esgst-gch-highlight {
        font-size: 14px;
        line-height: 14px;
        margin: 0 5px;
      }

      a.esgst-gc-genres {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        white-space: nowrap;
      }

      .esgst-gf-container {
        position: sticky;
        text-align: left;
        z-index: 998;
      }

      .esgst-gf-container:not(.esgst-popup-scrollable) {
        background-color: #E8EAEF;
        border-radius: 4px;
      }

      .esgst-gf-container.esgst-popup-scrollable {
        min-width: 650px;
      }

      .esgst-gf-filters {
        display: flex;
        justify-content: space-between;
        overflow: auto;
        position: relative;
      }

      .esgst-gf-left-panel {
        flex: 1;
        max-height: 500px;
        overflow-y: auto;
      }

      .esgst-gf-right-panel .form__input-small {
        width: 100px !important;
      }

      .esgst-gf-filters >* {
        margin: 5px;
      }

      .esgst-gf-preset-panel {
        margin: 5px;
        text-align: right;
      }

      .esgst-gf-preset-panel >* {
        margin: 5px;
      }

      .esgst-gf-filter-count {
        background-color: #ddd;
        border-radius: 5px;
        font-size: 10px;
        padding: 2px;
        vertical-align: middle;
      }

      .esgst-gf-button {
        border-top: 1px;
      }

      .esgst-wbh-highlight {
        border: none !important;
        border-radius: 4px;
        padding: 2px 5px;
        text-shadow: none;
      }

      .page__heading__breadcrumbs .esgst-wbh-highlight {
        padding: 0 2px;
      }

      .esgst-sm-colors input {
        display: inline-block;
        padding: 0;
        width: 100px;
      }

      .esgst-sm-colors input[type=color] {
        width: 25px;
      }

      .esgst-sm-colors select {
        display: inline-block;
        padding: 0;
        width: 100px;
      }

      .esgst-sm-colors-default {
        line-height: normal;
        padding: 5px 15px;
      }

      .esgst-ged-icon {
        margin: 0 0 0 10px;
      }

      .esgst-pgb-container {
        border-radius: 0 !important;
        margin: 0! important;
      }

      .esgst-gf-box {
        background-color: #E8EAEF;
        border: 1px solid #d2d6e0;
        border-radius: 0 !important;
        margin: 0! important;
        padding: 0 15px;
      }

      .esgst-gr-button {
        cursor: pointer;
        display: inline-block;
      }

      .esgst-egh-icon {
        cursor: pointer;
      }

      .giveaway__row-outer-wrap .esgst-egh-button, .giveaway__row-outer-wrap .esgst-gr-button, .table__row-outer-wrap .esgst-egh-button, .table__row-outer-wrap .esgst-egh-button, .table__row-outer-wrap .esgst-gr-button {
        margin-right: 5px;
      }

      p.table__column__heading {
        display: inline-block;
      }

      .esgst-giveaway-links {
        float: left;
        margin: 2px;
      }

      .esgst-gv-box .esgst-giveaway-panel:empty {
        height: 0;
        width: 0;
      }

      .esgst-giveaway-panel:empty {
        height: 25px;
        width: 250px;
      }

      .esgst-giveaway-panel.giveaway__columns {
        float: right;
        margin: 2px;
      }

      .esgst-giveaway-panel .esgst-button-set {
        border: 0;
        padding: 0;
      }

      .esgst-giveaway-panel .esgst-button-set >* {
        line-height: inherit;
        margin:0;
      }

      .esgst-giveaway-panel >:first-child {
        margin: 0;
      }

      .esgst-giveaway-panel >*:not(:first-child) {
        margin: 0 0 0 5px;
      }

      .esgst-gv-popout .esgst-gwc, .esgst-gv-popout .esgst-gwr, .esgst-gv-popout .esgst-gptw, .esgst-gv-popout .esgst-ttec {
        display: inline-block;
        margin: 0 !important;
        padding: 0 5px !important;
        width: 67px !important;
        vertical-align: top;
      }

      .esgst-gv-popout .esgst-gp-button {
        display: inline-block;
        margin: 0 !important;
        width: auto !important;
        vertical-align: top;
      }

      .esgst-gv-popout .esgst-gp-button >* {
        padding: 0 5px !important;
        width: 67px !important;
      }

      .esgst-giveaway-panel .form__submit-button, .esgst-giveaway-panel .form__saving-button {
        margin-bottom: 0;
        min-width: 0;
      }

      .esgst-ged-source {
        font-weight: bold;
        margin: 5px 0;
      }

      .table__column--width-small {
        width: 8%;
      }

      .sidebar .table__row-outer-wrap {
        padding: 5px 0;
      }

      .esgst-adots-tab-heading {
        background-color: #2f3540;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        color: #fff;
        cursor: pointer;
        display: inline-block;
        opacity: 0.5;
        padding: 5px 10px;
        text-shadow: none;
      }

      .esgst-adots-tab-heading.esgst-selected {
        opacity: 1;
      }

      .sidebar .esgst-adots {
        margin: 0;
        max-height: 300px;
        max-width: 336px;
        overflow: auto;
      }

      .sidebar .esgst-adots .esgst-dh-highlighted {
        padding: 0 !important;
        padding-bottom: 5px !important;
      }

      .sidebar .esgst-adots .table__column__heading, .esgst-adots .homepage_table_column_heading {
        display: inline-block;
        max-width: 225px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        white-space: nowrap;
      }

      .esgst-ns .esgst-adots .table__column__heading, .esgst-ns .esgst-adots .homepage_table_column_heading {
        max-width: 100px;
      }

      .sidebar .esgst-adots .table__row-outer-wrap {
        padding: 0 !important;
        padding-bottom: 5px !important;
        border: 0;
        box-shadow: none;
      }

      .sidebar .esgst-adots .table__row-inner-wrap {
        display: block;
      }

      .sidebar .esgst-adots .table__row-inner-wrap >*:not(:last-child) {
        display: inline-block;
      }

      .esgst-faded {
        opacity: 0.5;
      }

      .esgst-sm-faded >*:not(.SMFeatures), .esgst-sm-faded > .SMFeatures > .esgst-sm-colors {
        opacity: 0.5;
      }

      .esgst-green {
        color: #96c468 !important;
      }

      .esgst-grey {
        color: #77899a !important;
      }

      .esgst-orange {
        color: #c1a576 !important;
      }

      .esgst-red {
        color: #ec8583 !important;
      }

      .esgst-yellow {
        color: #fecc66 !important;
      }

      .esgst-warning {
        color: #e9202a !important;
        font-weight: bold;
      }

      .esgst-toggle-switch-container .esgst-description, .esgst-button-group .esgst-description {
        display: inline-block;
        margin: 0;
      }

      .esgst-description {
        color: #6b7a8c;
        font-size: 11px;
        font-style: italic;
        margin-top: 10px;
      }

      .esgst-progress-bar {
        height: 10px;
        overflow: hidden;
        text-align: left;
      }

      .esgst-progress-bar .ui-progressbar-value {
        background-color: #96c468;
        height: 100%;
        margin: -1px;
      }

      .esgst-ib-user {
        background-color: #fff;
        background-position: 5px 5px;
        background-size: 32px;
        border: 1px solid #d2d6e0;
        border-radius: 4px;
        height: 44px;
        padding: 5px;
        width: 44px;
      }

      .featured__outer-wrap .esgst-ib-user {
        background-color: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .esgst-ib-game {
        background-color: #fff;
        background-position: 5px 5px;
        border: 1px solid #d2d6e0;
        border-radius: 4px;
        padding: 5px;
      }

      .giveaway__row-outer-wrap .esgst-ib-game {
        background-size: 184px 69px;
        height: 81px;
        width: 196px;
      }

      .table__row-outer-wrap .esgst-ib-game {
        background-size: 85px 32px;
        height: 44px;
        width: 97px;
      }

      .esgst-oadd >* {
        padding-left: 0 !important;
        margin-left: 0 !important;
        border-left: none !important;
        box-shadow: none !important;
      }

      .esgst-gv-spacing {
        font-weight: bold;
        padding: 10px;
        text-align: center;
        width: 100px;
      }

      .esgst-gv-view {
        font-size: 0;
        padding: 5px 0;
        text-align: center;
      }

      .esgst-gv-view.pinned-giveaways__inner-wrap--minimized .giveaway__row-outer-wrap:nth-child(-n + 10) {
        display: inline-block;
      }

      .esgst-gv-container {
        border: 0 !important;
        box-shadow: none !important;
        display: inline-block;
        font-size: 12px;
        padding: 0;
        text-align: center;
        vertical-align: top;
        width: ${esgst.ib ? `196px` : `184px`};
      }

      .esgst-gv-box {
        display: block;
      }

      .esgst-gv-box >*:not(.giveaway__summary):not(.esgst-gv-icons) {
        margin: 0 !important;
      }

      .esgst-gv-box.is-faded:hover, .esgst-gv-box.esgst-faded:hover {
        opacity: 1;
      }

      .esgst-gv-icons {
        float: right;
        height: 18px;
        margin: -18px 0 0 !important;
      }

      .esgst-gv-icons .esgst-gc, .esgst-gv-icons .esgst-gwc, .esgst-gv-icons .esgst-gwr, .esgst-gv-icons .esgst-gptw, .esgst-gv-icons .esgst-ttec, .esgst-gv-time, .esgst-gv-icons .esgst-ged-source {
        background-color: #fff;
        padding: 2px !important;
      }

      .esgst-gv-icons .esgst-gp-button {
        background-color: #fff;
      }

      .esgst-ged-source {
        font-weight: bold;
      }

      .esgst-gv-time i {
        font-size: 12px;
        vertical-align: baseline;
      }

      .esgst-gv-icons >* {
        line-height: normal;
        margin: 0 !important;
      }

      .esgst-gv-icons >*:not(.esgst-giveaway-column-button) {
        padding: 1px 3px;
      }

      .esgst-gv-icons .giveaway__column--contributor-level {
        padding: 2px 5px !important;
      }

      .esgst-gv-popout {
        font-size: 11px;
        max-width: ${esgst.ib ? `174px` : `162px`};
        position: absolute;
        width: ${esgst.ib ? `174px` : `162px`};
        z-index: 1;
      }

      .esgst-gv-popout .giveaway__heading {
        display: block;
        height: auto;
      }

      .esgst-gv-popout .giveaway__heading__name {
        display: inline-block;
        font-size: 12px;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
      }

      .esgst-gv-popout .giveaway__heading__thin {
        font-size: 11px;
      }

      .esgst-gv-popout .esgst-gc-panel {
        font-size: 11px;
        text-align: center;
      }

      .esgst-gv-popout .esgst-gc-panel i, .esgst-gv-popout .giveaway__links i, .esgst-gv-popout .esgst-gwc i, .esgst-gv-popout .esgst-gwr i, .esgst-gv-popout .esgst-gptw i, .esgst-gv-popout .esgst-ggl-panel, .esgst-gv-popout .esgst-ggl-panel i {
        font-size: 11px;
      }

      .esgst-gv-popout .giveaway__columns:not(.esgst-giveaway-panel):not(.esgst-gv-icons) {
        display: block;
        float: left;
        width: calc(100% - 37px);
      }

      .esgst-gv-popout .giveaway__columns:not(.esgst-giveaway-panel):not(.esgst-gv-icons) >* {
        margin: 0;
        text-align: left;
      }

      .esgst-gv-popout .esgst-giveaway-panel {
        display: block;
        font-size: 11px;
      }

      .esgst-gv-popout .esgst-giveaway-panel >* {
        margin: 0;
      }

      .esgst-gv-popout .esgst-button-set {
        width: 100%;
      }

      .esgst-gv-popout .esgst-button-set >* {
        padding: 0;
        width: 100%;
      }
      .esgst-gv-popout .giveaway__links a:last-child {
        margin: 0 !important;
      }

      .esgst-gv-popout .giveaway_image_avatar, .esgst-gv-popout .featured_giveaway_image_avatar {
        margin: 5px;
        position: absolute;
        right: 5px;
      }

      .esgst-gv-popout .esgst-giveaway-links, .esgst-gv-popout .esgst-giveaway-panel {
        float: none;
      }

      .esgst-ags-panel {
        margin: 0 0 15px 0;
        max-width: 316px;
        text-align: center;
      }

      .esgst-ags-panel >* {
        display: inline-block;
      }

      .esgst-ags-filter {
        display: block;
        margin: 5px;
      }

      .esgst-ags-filter >* {
        padding: 0 5px !important;
        width: 125px;
      }

      .esgst-ags-checkbox-filter {
        margin: 5px;
      }

      .esgst-ugs-difference, .esgst-switch-input {
        display: inline-block;
        padding: 0 !important;
        width: 50px;
      }

      .esgst-switch-input-large {
        width: 150px;
      }

      .esgst-gas-popout {
        background-color: #fff;
        border: 1px solid #d2d6e0;
        border-radius: 4px;
        color: #465670;
        padding: 10px;
      }

      .esgst-ds-popout {
        background-color: #fff;
        border: 1px solid #d2d6e0;
        border-radius: 4px;
        color: #465670;
        padding: 10px;
      }

      .esgst-cfh-sr-container {
        max-height: 234px;
        overflow-y: auto;
      }

      .esgst-cfh-sr-box {
        position: relative;
      }

      .esgst-cfh-sr-summary {
        border-radius: 5px;
        cursor: pointer;
        padding: 5px;
        width: 200px;
      }

      .esgst-cfh-sr-box:not(:first-child) {
        border-top: 1px solid #ccc;
      }

      .esgst-cfh-sr-box:last-child) {
        border-bottom: 1px solid #ccc;
      }

      .esgst-cfh-sr-summary:hover {
        background-color: #465670;
        color: #fff;
      }

      .esgst-cfh-sr-name {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 200px;
        white-space: nowrap;
      }

      .esgst-cfh-sr-description {
        opacity: 0.75;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 200px;
        white-space: nowrap;
      }

      .esgst-cfh-sr-controls {
        position: absolute;
        right: 5px;
        top: 10px;
      }

      .esgst-cfh-sr-controls >* {
        margin: 2px;
      }

      .giveaway__row-outer-wrap .esgst-tag-button, .table__row-outer-wrap .esgst-tag-button {
        margin-left: 5px;
      }

      .esgst-tag-list-button {
        padding: 8px;
        right: 25px;
        position: absolute;
      }

      .esgst-tag-list {
        font-weight: bold;
        text-align: left;
        text-shadow: none;
      }

      .esgst-tag-preview .esgst-tags {
        display: inline-block;
      }

      .esgst-tag-preview input[type=text] {
        display: inline-block;
        width: 100px;
        height: 15px;
      }

      .esgst-tag-preview input[type=color] {
        box-sizing: unset;
        height: 13px;
        line-height: normal;
        margin: 0;
        padding: 0;
        vertical-align: top;
        width: 15px;
      }

      .esgst-tag-button {
        border: 0! important;
        cursor: pointer;
        display: inline-block;
        line-height: normal;
        margin: 0 0 0 5px;
        text-decoration: none !important;
        transition: opacity 0.2s;
      }

      .esgst-tag-button:hover {
        opacity: 1;
      }

      .author_name + .esgst-tag-button {
        margin: 0 5px 0 0;
      }

      .esgst-tag-button i {
        margin: 0 !important;
      }

      .esgst-tags {
        font-size: 10px;
        font-weight: bold;
      }

      .esgst-tag {
        display: inline-block !important;
        height: auto;
        margin: 0;
        padding: 1px 2px;
        text-shadow: none;
        width: auto;
      }

      .esgst-tag:not(:first-child) {
        margin: 0 0 0 5px;
      }

      .esgst-gv-popout .esgst-tags, .esgst-adots .esgst-tags {
        display: none;
      }
    `;
    if (esgst.sg) {
      style += `
        .esgst-header-menu {
          box-shadow: 1px 1px 1px rgba(255, 255, 255, 0.07) inset, 1px 1px 0 rgba(255, 255, 255, 0.02) inset;
          background-image: linear-gradient(#8a92a1 0px, #757e8f 8px, #4e5666 100%);
          border-radius: 4px;
          display: flex;
          margin-right: 5px;
        }

        .esgst-header-menu-relative-dropdown {
          position: relative;
        }

        .esgst-header-menu-absolute-dropdown {
          top: 34px;
          position: absolute;
          width: 275px;
          border-radius: 4px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.02), 2px 2px 5px rgba(0, 0, 0, 0.05), 1px 1px 2px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          z-index: 1;
        }

        .esgst-header-menu-row {
          cursor: pointer;
          background-image: linear-gradient(#fff 0%, #f6f7f9 100%);
          display: flex;
          padding: 12px 15px;
          text-shadow: 1px 1px #fff;
          align-items: center;
        }

        .esgst-version-row {
          cursor: default;
        }

        .esgst-header-menu-row:not(:first-child) {
          border-top: 1px dotted #d2d6e0;
        }

        .esgst-header-menu-row:not(.esgst-version-row):hover, .esgst.header-menu-button:hover + .esgst-header-menu-button {
          border-top-color: transparent;
        }

        .esgst-header-menu-row i {
          font-size: 28px;
          margin-right: 15px;
        }

        .esgst-header-menu-row:not(.esgst-version-row):hover i:not(.esgst-chfl-edit-button):not(.esgst-chfl-remove-button) {
          color: #fff !important;
        }

        .esgst-header-menu-row:not(.esgst-version-row):hover {
          background-image: linear-gradient(#63a0f4 0%, #63a0f4 100%);
          text-shadow: none;
        }

        .esgst-header-menu-row i.blue {
          color: #9dd9e1;
        }

        .esgst-header-menu-row i.green {
          color: #96c468;
        }

        .esgst-header-menu-row i.red {
          color: #ec8583;
        }

        .esgst-header-menu-row i.grey{
          color: #77899A;
        }

        .esgst-header-menu-row i.yellow{
          color: #FECC66;
        }

        .esgst-header-menu-name {
          color: #4B72D4;
          font: bold 11px/15px Arial, sans-serif;
        }

        .esgst-header-menu-description {
          color: #6b7a8c;
          font: 11px/13px Arial, sans-serif
        }

        .esgst-header-menu-row:not(.esgst-version-row):hover .esgst-header-menu-name {
          color: #fff;
        }

        .esgst-header-menu-row:not(.esgst-version-row):hover .esgst-header-menu-description {
          color: rgba(255, 255, 255, 0.7);
        }

        .esgst-header-menu-button {
          white-space: nowrap;
          color: #21262f;
          font: bold 11px/29px Arial, sans-serif;
          padding: 0 15px;
          cursor: pointer;
          text-shadow: 1px 1px rgba(255, 255, 255, 0.08);
          border-radius: 4px 0 0 4px;
        }

        .esgst-header-menu-button.arrow {
          border-radius: 0 4px 4px 0;
          padding: 0 10px;
        }

        .esgst-header-menu-button:hover {
          background-image: linear-gradient(#9ba2b0 0px, #8c94a3 8px, #596070 100%);
        }

        .esgst-header-menu-button.selected {
          background-image: linear-gradient(#4e525f 0px, #434857 5px, #2b2e3a 100%);
          box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3) inset;
          color: #aec5f3;
          text-shadow: 1px 1px rgba(0, 0, 0, 0.2);
        }

        .esgst-header-menu.selected .esgst-header-menu-button {
          background-image: linear-gradient(#d0d5de 0px, #c9cdd7 5px, #9097a6 100%);
          color: #3c465c;
          text-shadow: 1px 1px rgba(255, 255, 255, 0.2);
        }

        .esgst-header-menu.selected .esgst-header-menu-button:hover:not(.selected) {
          background-image: linear-gradient(#f0f1f5 0px, #d1d4de 100%);
        }
      `;
    } else {
      style += `
        .esgst-header-menu {
          display: flex;
          margin: 0 5px 0 0;
          box-shadow: 0 0 15px rgba(6, 52, 84, 0.07), 2px 2px 5px rgba(6, 52, 84, 0.07), 1px 1px 2px rgba(6, 52, 84, 0.07);
        }

        .esgst-header-menu-relative-dropdown > div {
          overflow: hidden;
          border-radius: 3px;
          background-color: #fff;
          position: absolute;
          margin-top: 39px;
          box-shadow: 0 0 15px rgba(59, 74, 84, 0.07), 2px 2px 5px rgba(59, 74, 84, 0.07), 1px 1px 2px rgba(59, 74, 84, 0.07);
          z-index: 10;
          width: 190px;
        }

        .esgst-header-menu-row {
          padding: 15px 20px;
          color: #557a93;
          display: flex;
          align-items: center;
          font: 700 12px 'Open Sans', sans-serif;
          transition: background-color 0.15s;
          cursor: pointer;
        }

        .esgst-version-row {
          cursor: default;
        }

        .esgst-header-menu-row:not(:last-child) {
          border-bottom: 1px solid #e1ebf2;
        }

        .esgst-header-menu-row.disabled {
          cursor: default
        }

        .esgst-header-menu-row > * {
          transition: opacity 0.15s;
        }

        .esgst-header-menu-row i {
          margin-right: 20px;
          font-size: 24px;
          transition: color 0.15s;
        }

        .esgst-header-menu-row:hover {
          background-color: #f0f3f5;
        }

        .esgst-header-menu-relative-dropdown:hover .esgst-header-menu-row:not(:hover) > * {
          opacity: 0.5;
        }

        .esgst-header-menu-relative-dropdown:hover .esgst-header-menu-row:not(:hover) i {
          color: #bdcbd5;
        }

        .esgst-header-menu-row i.blue {
          color: #9dd9e1;
        }

        .esgst-header-menu-row i.green {
          color: #96c468;
        }

        .esgst-header-menu-row i.red {
          color: #ec8583;
        }

        .esgst-header-menu-row i.grey{
          color: #77899a;
        }

        .esgst-header-menu-row i.yellow{
          color: #FECC66;
        }

        .esgst-header-menu-row:not(.esgst-version-row) .esgst-header-menu-description {
          display: none;
        }

        .esgst-header-menu-button {
          cursor: pointer;
          border-radius: 3px;
          display: flex;
          align-items: center;
          border: 1px solid;
          font: 700 11px 'Open Sans', sans-serif;
          padding: 8px 10px;
          white-space: nowrap;
          background-image: linear-gradient(#fff 0%, #dfe5f0 50%, #a5b2cc 100%);
          border-color: #fff #adb6c7 #909bb0 #cdd3df;
          color: #354a73;
          text-shadow: 1px 1px rgba(255, 255, 255, 0.3);
          transition: opacity 0.1s;
          opacity: 0.8;
          border-radius: 3px 0 0 3px;
          border-right: 0;
        }

        .esgst-header-menu-button:hover:not(.selected) {
          opacity: 1;
        }

        .esgst-header-menu-button.selected {
          opacity: 0.6;
        }

        .esgst-header-menu-button.arrow {
          border-radius: 0 3px 3px 0;
          border-left: 0;
        }

        .esgst-header-menu-button:not(.arrow) > i {
          margin-right: 10px;
        }

        .esgst-un-button, .page_heading .esgst-heading-button {
          background-image: linear-gradient(#fff 0%, rgba(255, 255, 255, 0.4) 100%);
          border: 1px solid #d2d6e0;
          border-radius: 3px;
          color: #4b72d4;
          cursor: pointer;
          display: inline-block;
          font: 700 14px/22px "Open Sans", sans-serif;
          padding: 5px 15px;
        }
      `;
    }
    esgst.style = createElements(document.head, `beforeEnd`, [{
      attributes: {
        id: `esgst-style`
      },
      text: style,
      type: `style`
    }]);
    esgst.theme = document.getElementById(`esgst-theme`);
    esgst.customThemeElement = document.getElementById(`esgst-custom-theme`);
    setTheme();
  }

  async function setTheme() {
    if (esgst.theme) {
      esgst.theme.remove();
      esgst.theme = null;
    }
    if (esgst.customThemeElement) {
      esgst.customThemeElement.remove();
      esgst.customThemeElement = null;
    }
    let keys = Object.keys(esgst.features.themes.features);
    for (let i = 0, n = keys.length; i < n; i++) {
      let key = keys[i];
      if (key === `customTheme`) continue;
      if (esgst[key] && checkThemeTime(key)) {
        const theme = await getValue(key, ``);
        if (!theme) continue;
        const css = getThemeCss(JSON.parse(theme));
        esgst.theme = createElements(document.head, `beforeEnd`, [{
          attributes: {
            id: `esgst-theme`
          },
          text: css,
          type: `style`
        }]);
        const revisedCss = css.replace(/!important;/g, `;`).replace(/;/g, `!important;`);
        if (revisedCss !== getLocalValue(`theme`)) {
          setLocalValue(`theme`, revisedCss);
        }
        break;
      }
    }
    if (esgst.customTheme && checkThemeTime(`customTheme`)) {
      const css = JSON.parse(await getValue(`customTheme`, ``));
      esgst.customThemeElement = createElements(document.head, `beforeEnd`, [{
        attributes: {
          id: `esgst-custom-theme`
        },
        text: css,
        type: `style`
      }]);
      const revisedCss = css.replace(/!important;/g, `;`).replace(/;/g, `!important;`);
      if (revisedCss !== getLocalValue(`customTheme`)) {
        setLocalValue(`customTheme`, revisedCss);
      }
    }
  }

  function checkThemeTime(id) {
    let startParts = esgst[`${id}_startTime`].split(`:`),
      endParts = esgst[`${id}_endTime`].split(`:`),
      startDate = new Date(),
      startHours = parseInt(startParts[0]),
      startMinutes = parseInt(startParts[1]),
      endDate = new Date(),
      endHours = parseInt(endParts[0]),
      endMinutes = parseInt(endParts[1]),
      currentDate = new Date();
    startDate.setHours(startHours);
    startDate.setMinutes(startMinutes);
    startDate.setSeconds(0);
    endDate.setHours(endHours);
    endDate.setMinutes(endMinutes);
    endDate.setSeconds(0);
    currentDate.setSeconds(0);
    if (endDate < startDate) {
      if (currentDate < startDate) {
        startDate.setDate(startDate.getDate() - 1);
      } else {
        endDate.setDate(endDate.getDate() + 1);
      }
    }
    if (currentDate >= startDate && currentDate <= endDate) {
      setTimeout(() => setTheme(), endDate - currentDate);
      return true;
    }
  }

  async function request(details) {
    if (!details.headers) {
      details.headers = {};
    }
    if (!details.headers[`Content-Type`]) {
      details.headers[`Content-Type`] = `application/x-www-form-urlencoded`;
    }
    if (details.queue) {
      let deleteLock = await createLock(`requestLock`, 1000);
      let response = await continueRequest(details);
      deleteLock();
      return response;
    } else {
      return await continueRequest(details);
    }
  }

  function hideGame(button, id, name, steamId, steamType) {
    let elements, i, popup;
    popup = new Popup(`fa-eye-slash`, [{
      text: `Would you like to hide all giveaways for `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-bold`
      },
      text: name,
      type: `span`
    }, {
      text: `?`,
      type: `node`
    }], true);
    popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-check-circle`, `fa-refresh fa-spin`, `Yes`, `Please wait...`, async callback => {
      await request({data: `xsrf_token=${esgst.xsrfToken}&do=hide_giveaways_by_game_id&game_id=${id}`, method: `POST`, url: `/ajax.php`});
      await updateHiddenGames(steamId, steamType);
      elements = document.querySelectorAll(`.giveaway__row-outer-wrap[data-game-id="${id}"]`);
      for (i = elements.length - 1; i > -1; --i) {
        elements[i].remove();
      }
      button.remove();
      callback();
      popup.close();
    }).set);
    createElements(popup.actions.firstElementChild, `outer`, [{
      attributes: {
        href: `/account/settings/giveaways/filters`
      },
      text: `View Hidden Games`,
      type: `a`
    }]);
    popup.open();
  }

  function unhideGame(button, id, name, steamId, steamType) {
    let popup;
    popup = new Popup(`fa-eye-slash`, [{
      text: `Would you like to unhide all giveaways for `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-bold`
      },
      text: name,
      type: `span`
    }, {
      text: `?`,
      type: `node`
    }], true);
    popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-check-circle`, `fa-refresh fa-spin`, `Yes`, `Please wait...`, async callback => {
      await request({data: `xsrf_token=${esgst.xsrfToken}&do=remove_filter&game_id=${id}`, method: `POST`, url: `/ajax.php`});
      await updateHiddenGames(steamId, steamType, true);
      button.remove();
      callback();
      popup.close();
    }).set);
    createElements(popup.actions.firstElementChild, `outer`, [{
      attributes: {
        href: `/account/settings/giveaways/filters`
      },
      text: `View Hidden Games`,
      type: `a`
    }]);
    popup.open();
  }

  async function requestGroupInvite() {
    let popup = new Popup(`fa-circle-o-notch fa-spin`, `Sending request...`, true);
    popup.open();
    if (esgst.username) {
      await request({data: `username=${esgst.username}`, method: `POST`, url: `https://script.google.com/macros/s/AKfycbw0odO9iXZBJmK54M_MUQ_IEv5l4RNzj7cEx_FWCZbrtNBNmQ/exec`});
      popup.icon.className = `fa fa-check`;
      createElements(popup.title, `inner`, [{
        text: `Request sent! If you have not done so already, you also need to send a request from the `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-bold`,
          href: `http://steamcommunity.com/groups/esgst`
        },
        text: `Steam group`,
        type: `a`
      }, {
        text: ` page. After that you should be accepted in 24 hours at most.`,
        type: `node`
      }]);
    } else {
      popup.icon.className = `fa-times-circle`;
      popup.title.textContent = `Something went wrong, please try again later. If it continues to happen, please report the issue.`;
    }
  }

  async function checkUpdate() {
    let version = (await request({method: `GET`,url: `https://raw.githubusercontent.com/revilheart/ESGST/master/ESGST.meta.js`})).responseText.match(/@version (.+)/);
    if (version && version[1] != esgst.version) {
      location.href = `https://raw.githubusercontent.com/revilheart/ESGST/master/ESGST.user.js`;
    } else {
        alert(`No ESGST updates found!`);
    }
  }

  function draggable_set(obj) {
    obj.context.setAttribute(`data-dragid`, obj.id);
    for (const element of obj.context.children) {
      if (element.getAttribute(`draggable`)) continue;
      element.setAttribute(`draggable`, true);
      element.addEventListener(`dragstart`, draggable_start.bind(null, obj, element));
      element.addEventListener(`dragenter`, draggable_enter.bind(null, obj, element));
      element.addEventListener(`dragend`, draggable_end.bind(null, obj));
    }
  }

  function draggable_start(obj, element, event) {
    event.dataTransfer.setData(`text/plain`, ``);
    obj.dragging = element;
    draggable_setTrash(obj);
  }

  function draggable_enter(obj, element) {
    if (obj.context !== element.parentElement) return;
    let current = obj.dragging;
    if (!current) return;
    do {
      current = current.previousElementSibling;
      if (current && current === element) {
        obj.context.insertBefore(obj.dragging, element);
        return;
      }
    } while (current);
    obj.context.insertBefore(obj.dragging, element.nextElementSibling);
  }

  async function draggable_end(obj) {
    if (obj.trash) {
      obj.trash.remove();
      obj.trash = null;
    }
    const array = [];
    for (const element of obj.context.children) {
      array.push(decodeURIComponent(element.getAttribute(`data-id`)));
    }
    setValue(obj.id, JSON.stringify(array));
  }

  function draggable_setTrash(obj) {
    obj.trash = createElements(obj.context, `afterEnd`, [{
      attributes: {
        class: `esgst-draggable-trash`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-trash`
        },
        type: `i`
      }]
    }]);
    obj.trash.style.width = `${obj.context.offsetWidth}px`;
    obj.trash.addEventListener(`dragenter`, () => {
      if (!obj.dragging) return;
      if (!confirm(`Are you sure you want to delete this item?`)) return;

      obj.dragging.remove();
      obj.dragging = null;
      const array = [];
      for (const element of obj.context.children) {
        array.push(decodeURIComponent(element.getAttribute(`data-id`)));
      }
      setValue(obj.id, JSON.stringify(array));
    });
  }

  function setCountdown(context, totalSeconds, callback, initialDate = Date.now()) {
    const seconds = totalSeconds - Math.floor((Date.now() - initialDate) / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    context.textContent = `${`0${m}`.slice(-2)}:${`0${s}`.slice(-2)}`;
    if (seconds > -1) {
      setTimeout(setCountdown, 1000, context, totalSeconds, callback, initialDate);
    } else if (callback) {
      callback();
    }
  }

  function round(number, decimals = 2) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(number * multiplier) / multiplier;
  }

  function getTextNodesIn(elem, opt_fnFilter) {
    var textNodes = [];
    if (elem) {
    for (var nodes = elem.childNodes, i = 0, n = nodes.length; i < n; i++) {
      var node = nodes[i], nodeType = node.nodeType;
      if (nodeType == 3) {
      if (!opt_fnFilter || opt_fnFilter(node, elem)) {
        textNodes.push(node);
      }
      }
      else if (nodeType == 1 || nodeType == 9 || nodeType == 11) {
      textNodes = textNodes.concat(getTextNodesIn(node, opt_fnFilter));
      }
    }
    }
    return textNodes;
  }

  function observeStickyChanges() {
    observeHeaders();
  }

  /**
  * Sets up an intersection observer to notify when elements with the class
  * `.sticky_sentinel--top` become visible/invisible at the top of the container.
  * @param {Element} container
  */
  function observeHeaders() {
    const observer = new IntersectionObserver(records => {
      for (const record of records) {
        const targetInfo = record.boundingClientRect;
        const stickyTarget = record.target.parentElement.querySelector(`.sticky`);
        const rootBoundsInfo = record.rootBounds;

        // Started sticking.
        if (targetInfo.bottom < rootBoundsInfo.top) {
          stickyTarget.classList.add(`stuck`);
        }

        // Stopped sticking.
        if (
          targetInfo.bottom >= rootBoundsInfo.top &&
          targetInfo.bottom < rootBoundsInfo.bottom
        ) {
          stickyTarget.classList.remove(`stuck`);
        }
      }
    }, {threshold: 0});

    // Add the top sentinels to each section and attach an observer.
    const sentinels = addSentinels(`sticky_sentinel--top`);
    sentinels.forEach(el => observer.observe(el));
  }

  function addSentinels(className) {
    return Array.from(document.querySelectorAll(`.sticky`)).map(el => {
      const sentinel = document.createElement(`div`);
      sentinel.classList.add(`sticky_sentinel`, className);
      return el.parentElement.appendChild(sentinel);
    });
  }

  function setClearButton(input) {
    const button = input.nextElementSibling;
    input.addEventListener(`input`, toggleClearButton.bind(null, button, input));
    input.addEventListener(`change`, toggleClearButton.bind(null, button, input));
    input.nextElementSibling.addEventListener(`click`, clearInput.bind(null, input));
  }

  function toggleClearButton(button, input) {
    if (input.value) {
      if (button.classList.contains(`esgst-hidden`)) {
        button.classList.remove(`esgst-hidden`);
      }
    } else if (!button.classList.contains(`esgst-hidden`)) {
      button.classList.add(`esgst-hidden`);
    }
  }

  function clearInput(input) {
    input.value = ``;
    input.dispatchEvent(new Event(`change`));
  }

  function fixEmojis(emojis) {
    const matches = emojis.split(/<\/span>/);
    if (matches.length < 2) return emojis;
    matches.pop();
    return JSON.stringify(matches.map(fixEmoji));
  }

  function fixEmoji(emoji) {
    const match = emoji.match(/title="(.+?)"/);
    emoji = emoji.replace(/<span.+?>/, ``);
    if (match) {
      return getEmojiHtml(emoji);
    }
    let fixed = ``;
    for (let i = 0, n = emoji.length; i < n; i++) {
      fixed += getEmojiHtml(emoji[i]);
    }
    return fixed;
  }

  function getEmojiHtml(emoji) {
    return `&#x${getEmojiUnicode(emoji).toString(`16`).toUpperCase()}`;
  }

  function getEmojiUnicode(emoji) {
    if (emoji.length === 1) {
      return emoji.charCodeAt(0);
    }
    const code = (emoji.charCodeAt(0) - 0xD800) * 0x400 + (emoji.charCodeAt(1) - 0xDC00) + 0x10000;
    if (code < 0) {
      return emoji.charCodeAt(0);
    }
    return code;
  }

  function triggerOnEnter(callback, event) {
    if (event.key === `Enter`) {
      event.preventDefault();
      callback();
    }
  }

  function getChildByClassName(element, className) {
    let i;
    if (!element) return;
    for (i = element.children.length - 1; i > -1 && !element.children[i].classList.contains(className); i--);
    if (i > -1) return element.children[i];
  }

  function escapeMarkdown(string) {
    return string.replace(/(\[|\]|\(|\)|\*|~|!|\.|`|-|>|#|\|)/g, `\\$1`);
  }
  
  function escapeHtml(string) {
    return string
      .replace(/&/g, `&amp;`)
      .replace(/</g, `&lt;`)
      .replace(/>/g, `&gt;`)
      .replace(/"/g, `&quot;`)
      .replace(/'/g, `&#39;`)
      .replace(/\//g, `\u{2F};`)
      .replace(/`/g, `\u{60};`)
      .replace(/=/g, `\u{3D};`);
  }

  function removeDuplicateNotes(notes) {
    let output = [];
    notes.split(/\n/).forEach(part => {
      if (output.indexOf(part) < 0) {
        output.push(part);
      }
      output.push(`\n`);
    });
    return output.join(``).trim().replace(/\n\n+/g, `\n\n`);
  }

  function capitalizeFirstLetter(string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
  }

  function getTimestamp(seconds, is24Clock, isShowSeconds) {
    if (is24Clock) {
      if (isShowSeconds) {
        return formatDate(`[MMM] [D], [YYYY], [H]:[HMM]:[SS]`, seconds);
      }
      return formatDate(`[MMM] [D], [YYYY], [H]:[HMM]`, seconds);
    }
    if (isShowSeconds) {
      return formatDate(`[MMM] [D], [YYYY], [H12]:[HMM]:[SS][XX]`, seconds);
    }
    return formatDate(`[MMM] [D], [YYYY], [H12]:[HMM][XX]`, seconds);
  }

  function getRemainingTime(time) {
    let d, dif, h, m, s, w;
    dif = time - Date.now();
    if (dif < 0) {
      dif *= -1;
    }
    w = Math.floor(dif / 604800000);
    if (w > 0) {
      return `${w}w`;
    } else {
      d = Math.floor(dif / 86400000);
      if (d > 0) {
        return `${d}d`;
      } else {
        h = Math.floor(dif / 3600000);
        if (h > 0) {
          return `${h}h`;
        } else {
          m = Math.floor(dif / 60000);
          if (m > 0) {
            return `${m}m`;
          } else {
            s = Math.floor(dif / 1000);
            return `${s}s`;
          }
        }
      }
    }
  }

  function getTimeSince(timestamp, until) {
    let n, s;
    s = Math.floor((until ? (timestamp - Date.now()) : (Date.now() - timestamp)) / 1000);
    n = Math.floor(s / 31104000);
    if (n >= 1) {
      return `${n} year${n === 1 ? `` : `s`}`;
    }
    n = Math.floor(s / 2592000);
    if (n >= 1) {
      return `${n} month${n === 1 ? `` : `s`}`;
    }
    n = Math.floor(s / 86400);
    if (n >= 1) {
      return `${n} day${n === 1 ? `` : `s`}`;
    }
    n = Math.floor(s / 3600);
    if (n >= 1) {
      return `${n} hour${n === 1 ? `` : `s`}`;
    }
    n = Math.floor(s / 60);
    if (n >= 1) {
      return `${n} minute${n === 1 ? `` : `s`}`;
    }
    n = Math.floor(s);
    return `${n} second${n === 1 ? `` : `s`}`;
  }

  function setLocalValue(key, value) {
    localStorage.setItem(`esgst_${key}`, value);
  }

  function getLocalValue(key, value = undefined) {
    return localStorage.getItem(`esgst_${key}`) || value;
  }

  function delLocalValue(key) {
    localStorage.removeItem(`esgst_${key}`);
  }

  function validateValue(value) {
    return typeof value === `undefined` || value;
  }

  function closeHeaderMenu(arrow, dropdown, menu, event) {
    if (!menu.contains(event.target) && arrow.classList.contains(`selected`)) {
      arrow.classList.remove(`selected`);
      dropdown.classList.add(`esgst-hidden`);
    }
  }

  function setSiblingsOpacity(element, Opacity) {
    let Siblings, I, N;
    Siblings = element.parentElement.children;
    for (I = 0, N = Siblings.length; I < N; ++I) {
      if (Siblings[I] != element) {
        Siblings[I].style.opacity = Opacity;
      }
    }
  }

  function setHoverOpacity(element, EnterOpacity, LeaveOpacity) {
    element.addEventListener(`mouseenter`, () => {
      element.style.opacity = EnterOpacity;
    });
    element.addEventListener(`mouseleave`, () => {
      element.style.opacity = LeaveOpacity;
    });
  }

  function createUuid(c) {
    let r, v;
    r = Math.random() * 16 | 0;
    v = c === `x` ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function createTooltip(context, message) {
    let popout;
    popout = new Popout(`esgst-feature-description markdown`, context, 100);
    popout.popout.style.maxHeight = `300px`;
    popout.popout.style.overflow = `auto`;
    createElements(popout.popout, `inner`, [...(Array.from(parseHtml(message).body.childNodes).map(x => {
      return {
        context: x
      };
    }))]);
  }

  function createOptions(options) {
    let context, elements, id, switches;
    context = document.createElement(`div`);
    elements = {};
    switches = {};
    options.forEach(option => {
      if (option.check) {
        id = option.id;
        elements[id] = createElements(context, `beforeEnd`, [{
          type: `div`
        }]);
        switches[id] = new ToggleSwitch(elements[id], id, false, option.description, false, false, option.tooltip, esgst[id]);
      }
    });
    options.forEach(option => {
      let enabled = esgst[option.id];
      if (switches[option.id]) {
        if (option.dependencies) {
          option.dependencies.forEach(dependency => {
            if (elements[dependency]) {
              switches[option.id].dependencies.push(elements[dependency]);
              if (!enabled) {
                elements[dependency].classList.add(`esgst-hidden`);
              }
            }
          });
        }
        if (option.exclusions) {
          option.exclusions.forEach(exclusion => {
            if (elements[exclusion]) {
              switches[option.id].exclusions.push(elements[exclusion]);
              if (enabled) {
                elements[exclusion].classList.add(`esgst-hidden`);
              }
            }
          });
        }
      }
    });
    return context;
  }

  function createResults(context, element, results) {
    for (const result of results) {
      const key = result.Key;
      element[key] = createElements(context, `beforeEnd`, [{
        attributes: {
          class: `esgst-hidden`
        },
        type: `div`,
        children: [{
          attributes: {
            class: result.Icon
          },
          type: `i`
        }, {
          attributes: {
            class: `esgst-bold`
          },
          type: `span`,
          children: [{
            text: `${result.Description} (`,
            type: `node`
          }, {
            text: `0`,
            type: `span`
          }, {
            text: `):`,
            type: `node`
          }]
        }, {
          attributes: {
            class: `esgst-popup-actions`
          },
          type: `span`
        }]
      }]);
      element[`${key}Count`] = element[key].firstElementChild.nextElementSibling.firstElementChild;
      element[`${key}Users`] = element[key].lastElementChild;
    }
  }

  function goToComment(hash, element, noPermalink) {
    if (!hash) {
      hash = location.hash;
    }
    let id = hash.replace(/#/, ``);
    if ((!id && !element) || location.pathname.match(/^\/account/)) return;
    if (id && !element) {
      element = document.getElementById(id);
    }
    if (!element) return;
    scrollTo(0, element.offsetTop);
    scrollBy(0, -esgst.commentsTop);
    if (noPermalink) return;
    let permalink = document.querySelector(`.is_permalink, .author_permalink`);
    if (permalink) {
      permalink.remove();
    }
    element = element.querySelector(`.comment__username, .author_avatar`);
    if (!element) return;
    createElements(element, esgst.sg ? `beforeBegin` : `afterEnd`, [{
      attributes: {
        class: `fa fa-share is_permalink author_permalink`
      },
      type: `i`
    }]);
  }

  function sortContent(array, mainKey, option) {
    let after, before, divisor, divisors, i, key, n, name;
    name = option.split(/_/);
    key = name[0];
    if (name[1] === `asc`) {
      before = -1;
      after = 1;
    } else {
      before = 1;
      after = -1;
    }
    array.sort((a, b) => {
      if (typeof a[key] === `string` && typeof b[key] === `string`) {
        return (a[key].toLowerCase().localeCompare(b[key].toLowerCase()) * after);
      } else {
        if (a[key] < b[key]) {
          return before;
        } else if (a[key] > b[key]) {
          return after;
        } else {
          return 0;
        }
      }
    });
    let context = null;
    if (mainKey === `popupGiveaways`) {
      context = array[0].outerWrap.closest(`.esgst-popup`).getElementsByClassName(`esgst-gv-view`)[0] || array[0].outerWrap.parentElement.parentElement;
    }
    for (i = 0, n = array.length; i < n; ++i) {
      if (!array[i].outerWrap.parentElement) continue;

      if (context) {
        context.appendChild(array[i].outerWrap.parentElement);
      } else {
        array[i].outerWrap.parentElement.appendChild(array[i].outerWrap);
      }
    }
    for (i = array.length - 1; i > -1; i--) {
      if (array[i].isPinned) {
        array[i].outerWrap.parentElement.insertBefore(array[i].outerWrap, array[i].outerWrap.parentElement.firstElementChild);
      }
    }
    if (key === `sortIndex`) {
      divisors = document.getElementsByClassName(`esgst-es-page-divisor`);
      for (i = divisors.length - 1; i > -1; --i) {
        divisor = divisors[i];
        divisor.classList.remove(`esgst-hidden`);
        divisor.parentElement.insertBefore(divisor, document.getElementsByClassName(`esgst-es-page-${i + 2}`)[0]);
      }
    } else {
      divisors = document.querySelectorAll(`.esgst-es-page-divisor:not(.esgst-hidden)`);
      for (i = divisors.length - 1; i > -1; --i) {
        divisors[i].classList.add(`esgst-hidden`);
      }
    }
  }

  function rot(string, n) {
    return string.replace(/[a-zA-Z]/g, char => {
      return String.fromCharCode(((char <= `Z`) ? 90 : 122) >= ((char = char.charCodeAt(0) + n)) ? char : (char - 26));
    });
  }

  function buildGiveaway(context, url, errorMessage, blacklist) {
    let ended, avatar, code, column, columns, comments, counts, endTime, endTimeColumn, entered, entries, giveaway, heading, headingName, i, id, icons, image, n, removeEntryButton, started, startTimeColumn, thinHeadings;
    giveaway = context.getElementsByClassName(`featured__outer-wrap--giveaway`)[0];
    if (giveaway) {
      let match = url.match(/giveaway\/(.+?)\//),
        sgTools = false;
      if (match) {
        code = match[1];
      } else {
        match = url.match(/giveaways\/(.+)/);
        if (match) {
          code = match[1];
          sgTools = true;
        }
      }
      id = giveaway.getAttribute(`data-game-id`);
      heading = giveaway.getElementsByClassName(`featured__heading`)[0];
      icons = heading.getElementsByTagName(`a`);
      for (i = 0, n = icons.length; i < n; ++i) {
        icons[i].classList.add(`giveaway__icon`);
      }
      headingName = heading.firstElementChild;
      createElements(headingName, `outer`, [{
        attributes: {
          class: `giveaway__heading__name`,
          href: url
        },
        type: `a`,
        children: [...(Array.from(headingName.childNodes).map(x => {
          return {
            context: x
          };
        }))]
      }]);
      thinHeadings = heading.getElementsByClassName(`featured__heading__small`);
      for (i = 0, n = thinHeadings.length; i < n; ++i) {
        createElements(thinHeadings[0], `outer`, [{
          attributes: {
            class: `giveaway__heading__thin`
          },
          type: `span`,
          children: [...(Array.from(thinHeadings[0].childNodes).map(x => {
            return {
              context: x
            };
          }))]
        }]);
      }
      columns = heading.nextElementSibling;
      endTimeColumn = columns.firstElementChild;
      endTimeColumn.classList.remove(`featured__column`);
      if (sgTools) {
        let info = games_getInfo(giveaway);
        if (info) {
          createElements(heading, `beforeEnd`, [{
            attributes: {
              class: `giveaway__icon`,
              href: `https://store.steampowered.com/${info.type.slice(0, -1)}/${info.id}/`,
              rel: `nofollow`,
              target: `_blank`
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa fa-steam`
              },
              type: `i`
            }]
          }, {
            attributes: {
              class: `giveaway__icon`,
              href: `/giveaways/search?${info.type.slice(0, -1)}=${info.id}`
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa fa-search`
              },
              type: `i`
            }]
          }]);
        }
        let date = new Date(`${endTimeColumn.lastElementChild.textContent}Z`).getTime();
        ended = Date.now() > date;
        const items = [];
        if (ended) {
          items.push({
            text: `Ended`,
            type: `node`
          });
        }
        items.push({
          attributes: {
            [`data-timestamp`]: date / 1e3
          },
          text: ended ? getTimeSince(date) : getTimeSince(date, true),
          type: `span`
        }, {
          text: ended ? ` ago ` : ` remaining `,
          type: `node`
        });
        createElements(endTimeColumn.lastElementChild, `outer`, items);
      }
      endTime = parseInt(endTimeColumn.lastElementChild.getAttribute(`data-timestamp`)) * 1000;
      startTimeColumn = endTimeColumn.nextElementSibling;
      startTimeColumn.classList.remove(`featured__column`, `featured__column--width-fill`);
      startTimeColumn.classList.add(`giveaway__column--width-fill`);
      if (sgTools) {
        let date = new Date(`${startTimeColumn.firstElementChild.textContent}Z`).getTime();
        const items = [];
        if (ended) {
          items.push({
            text: `Ended`,
            type: `node`
          });
        }
        items.push();
        createElements(startTimeColumn.firstElementChild, `outer`, [{
          attributes: {
            [`data-timestamp`]: date / 1e3
          },
          text: getTimeSince(date),
          type: `span`
        }, {
          text: ` ago `,
          type: `node`
        }]);
      }
      avatar = columns.lastElementChild;
      if (sgTools) {
        avatar.className = `giveaway_image_avatar`;
      }
      avatar.remove();
      startTimeColumn.querySelector(`[style]`).removeAttribute(`style`);
      column = startTimeColumn.nextElementSibling;
      while (column) {
        column.classList.remove(`featured__column`);
        column.className = column.className.replace(/featured/g, `giveaway`);
        column = column.nextElementSibling;
      }
      removeEntryButton = context.getElementsByClassName(`sidebar__entry-delete`)[0];
      if (removeEntryButton && !removeEntryButton.classList.contains(`is-hidden`)) {
        entered = `is-faded`;
      } else {
        entered = ``;
      }
      counts = context.getElementsByClassName(`sidebar__navigation__item__count`);
      if (counts.length > 1) {
        entries = counts[1].textContent;
        comments = counts[0].textContent;
        started = true;
      } else if (counts.length > 0) {
        entries = 0;
        comments = counts[0].textContent;
        started = false;
      } else {
        entries = 0;
        comments = 0;
      }
      image = giveaway.getElementsByClassName(`global__image-outer-wrap--game-large`)[0].firstElementChild.getAttribute(`src`);
      const attributes = {
        class: `giveaway__row-outer-wrap`,
        [`data-game-id`]: id
      };
      if (errorMessage) {
        attributes[`data-error`] = errorMessage;
      }
      if (blacklist) {
        attributes[`data-blacklist`] = true;
      }
      if (context.getElementsByClassName(`sidebar__entry-insert`)[0]) {
        attributes[`data-enterable`] = true;
      }
      heading.className = `giveaway__heading`;
      columns.className = `giveaway__columns`;
      return {
        code: code,
        html: [{
          type: `div`,
          children: [{
            attributes,
            type: `div`,
            children: [{
              attributes: {
                class: `giveaway__row-inner-wrap ${entered}`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `giveaway__summary`
                },
                children: [{
                  context: heading
                }, {
                  context: columns
                }, {
                  attributes: {
                    class: `giveaway__links`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      href: `${url}/entries`
                    },
                    type: `a`,
                    children: [{
                      attributes: {
                        class: `fa fa-tag`
                      },
                      type: `i`
                    }, {
                      text: `${entries} entries`,
                      type: `span`
                    }]
                  }, {
                    attributes: {
                      href: `${url}/comment`
                    },
                    type: `a`,
                    children: [{
                      attributes: {
                        class: `fa fa-comment`
                      },
                      type: `i`
                    }, {
                      text: `${comments} comments`,
                      type: `span`
                    }]
                  }]
                }]
              }, {
                context: avatar,
              }, {
                attributes: {
                  class: `giveaway_image_thumbnail`,
                  href: url,
                  style: `background-image: url(${image})`
                },
                type: `a`
              }]
            }]
          }]
        }],
        points: parseInt(heading.textContent.match(/\((\d+)P\)/)[1]),
        started: started,
        timestamp: endTime
      };
    } else {
      return null;
    }
  }

  function copyValue(icon, value) {
    let textArea = createElements(document.body, `beforeEnd`, [{
      type: `textarea`
    }]);
    textArea.value = value;
    textArea.select();
    document.execCommand(`copy`);
    textArea.remove();
    if (icon) {
      icon.classList.add(`esgst-green`);
      setTimeout(() => icon.classList.remove(`esgst-green`), 2000);
    }
  }

  function getParameters() {
    let parameters = {};
    location.search.replace(/^\?/, ``).split(/&/).forEach(item => {
      item = item.split(/=/);
      parameters[item[0]] = item[1];
    });
    return parameters;
  }

  function setMissingDiscussion(context) {
    if (context) {
      createElements(context.outerWrap, `inner`, [{
        attributes: {
          class: `table__row-outer-wrap`,
          style: `padding: 15px 0;`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__row-inner-wrap`
          },
          type: `div`,
          children: [{
            type: `div`,
            children: [{
              attributes: {
                class: `table_image_avatar`,
                href: `/user/${context.author}`,
                style: `background-image:${context.avatar.style.backgroundImage.replace(/"/g, `'`)};`
              },
              type: `a`
            }]
          }, {
            attributes: {
              class: `table__column--width-fill`
            },
            type: `div`,
            children: [{
              attributes: {
                style: `margin-bottom: 2px;`
              },
              type: `h3`,
              children: [{
                attributes: {
                  class: `homepage_table_column_heading`,
                  href: context.url
                },
                text: context.title,
                type: `a`
              }]
            }, {
              type: `p`,
              children: context.lastPostTime ? [{
                attributes: {
                  class: `table__column__secondary-link`,
                  href: context.url
                },
                text: `${context.comments} Comments`,
                type: `a`
              }, {
                text: ` - Last post `,
                type: `node`
              }, {
                attributes: {
                  [`data-timestamp`]: context.lastPostTimestamp
                },
                text: context.lastPostTime,
                type: `span`
              }, {
                text: ` ago by `,
                type: `node`
              }, {
                attributes: {
                  class: `table__column__secondary-link`,
                  href: `/user/${context.lastPostAuthor}`
                },
                text: context.lastPostAuthor,
                type: `a`
              }, {
                attributes: {
                  class: `icon-green table__last-comment-icon`,
                  href: `/go/comment/${context.lastPostCode}`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-chevron-circle-right`
                  },
                  type: `i`
                }]
              }] : [{
                attributes: {
                  class: `table__column__secondary-link`,
                  href: context.url
                },
                text: `${context.comments} Comments`,
                type: `a`
              }, {
                text: ` - Created `,
                type: `node`
              }, {
                attributes: {
                  [`data-timestamp`]: context.createdTimestamp
                },
                text: context.createdTime,
                type: `span`
              }, {
                text: ` ago by `,
                type: `node`
              }, {
                attributes: {
                  class: `table__column__secondary-link`,
                  href: `/user/${context.author}`
                },
                text: context.author,
                type: `a`
              }]
            }]
          }]
        }]
      }]);
      context.outerWrap = context.outerWrap.firstElementChild;
    }
  }

  function filterSm(event) {
    let collapse, element, expand, found, id, type, typeFound, value;
    value = event.currentTarget.value.toLowerCase().trim();
    for (type in esgst.features) {
      found = false;
      typeFound = false;
      for (id in esgst.features[type].features) {
        unfadeSmFeatures(esgst.features[type].features[id], id);
        found = filterSmFeature(esgst.features[type].features[id], id, value);
        if (found) {
          typeFound = true;
          unhideSmFeature(esgst.features[type].features[id], id);
        }
      }
      element = document.getElementById(`esgst_${type}`);
      if (element) {
        if (typeFound) {
          element.classList.remove(`esgst-hidden`);
        } else {
          element.classList.add(`esgst-hidden`);
        }
        if (value) {
          expand = element.getElementsByClassName(`fa-plus-square`)[0];
          if (expand) {
            expand.click();
          }
        } else {
          collapse = element.getElementsByClassName(`fa-minus-square`)[0];
          if (collapse) {
            collapse.click();
          }
        }
      }
    }
  }

  function unfadeSmFeatures(feature, id) {
    let element = document.getElementById(`esgst_${id}`);
    if (element) {
      element.classList.remove(`esgst-sm-faded`);
    }
    if (feature.features) {
      for (id in feature.features) {
        unfadeSmFeatures(feature.features[id], id);
      }
    }
  }

  function filterSmFeature(feature, id, value) {
    let element, found, subId;
    found = false;
    let exactFound = (typeof feature.name === `string` ? feature.name : JSON.stringify(feature.name)).toLowerCase().match(value);
    if (feature.features) {
      for (subId in feature.features) {
        let result = filterSmFeature(feature.features[subId], subId, value);
        found = found || result;
      }
      found = found || (feature.description && feature.description.toLowerCase().match(value)) || exactFound;
    } else {
      found = (feature.description && feature.description.toLowerCase().match(value)) || exactFound;
    }
    element = document.getElementById(`esgst_${id}`);
    if (element) {
      if (found) {
        element.classList.remove(`esgst-hidden`);
      } else {
        element.classList.add(`esgst-hidden`);
      }
      if (!exactFound) {
        element.classList.add(`esgst-sm-faded`);
      }
    }
    return found;
  }

  function unhideSmFeature(feature, id) {
    let element = document.getElementById(`esgst_${id}`);
    if (element) {
      element.classList.remove(`esgst-hidden`);
    }
    if (feature.features) {
      for (id in feature.features) {
        unhideSmFeature(feature.features[id], id);
      }
    }
  }

  function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  }

  function getThemeUrl(id, url) {
    return new Promise(openThemePopup.bind(null, id, url));
  }

  function openThemePopup(id, url, resolve) {
    let obj = {
      resolve,
      url
    };
    obj.options = {
      sgv2Dark: [
        {
          default: 0,
          id: `ik-page width`,
          name: `Page width`,
          options: [
            {
              id: `ik-def page width`,
              name: `100%`
            },
            {
              id: `ik-fixed sg page width`,
              name: `Fixed (1440px)`
            }
          ]
        }
      ],
      steamGifties: [
        {
          default: 1,
          id: `ik-spoilertags`,
          name: `Remove spoiler tags`
        },
        {
          default: 1,
          id: `ik-hiddenlinks`,
          name: `Reveal hidden links`
        },
        {
          default: 0,
          id: `ik-sgppsupport`,
          name: `SG++ support`
        },
        {
          default: 0,
          id: `ik-whiteblacklist`,
          name: `Blacklist/Whitelist Indicator support`
        },
        {
          default: 0,
          id: `ik-easysteamgifts`,
          name: `Easy SteamGifts support`
        },
        {
          default: 0,
          id: `ik-visited-link`,
          name: `Highlight visited links`,
          options: [
            {
              id: `ik-1`,
              name: `Mark visited links`
            },
            {
              id: `ik-3`,
              name: `Mark visited links + threads in forum`
            },
            {
              id: `ik-2`,
              name: `No`
            }
          ]
        },
        {
          default: 0,
          id: `ik-touhou-style`,
          name: `TouHou Giveaways Helper support`
        },
        {
          default: 0,
          id: `ik-sg2os`,
          name: `SG2O support`
        },
        {
          default: 0,
          id: `ik-avatarsize`,
          name: `Avatar size`,
          options: [
            {
              id: `ik-1`,
              name: `Big (52px)`
            },
            {
              id: `ik-2`,
              name: `Normal`
            }
          ]
        },
        {
          default: 0,
          id: `ik-extendedsg`,
          name: `Extended SteamGifts support`
        },
        {
          default: 0,
          id: `ik-navbarbutton`,
          name: `Navigation bar button color`,
          options: [
            {
              id: `ik-1`,
              name: `Default`
            },
            {
              id: `ik-2`,
              name: `White`
            }
          ]
        },
        {
          default: 0,
          id: `ik-ESGST`,
          name: `ESGST support`
        },
        {
          default: 1,
          id: `ik-featurega`,
          name: `Featured giveaway`,
          options: [
            {
              id: `ik-1`,
              name: `No`
            },
            {
              id: `ik-2`,
              name: `Smaller banner`
            },
            {
              id: `ik-2`,
              name: `Hide banner`
            }
          ]
        },
        {
          default: 0,
          id: `ik-removepoll`,
          name: `Homepage poll`,
          options: [
            {
              id: `ik-1`,
              name: `Default`
            },
            {
              id: `ik-2`,
              name: `Remove poll`
            }
          ]
        }
      ],
      steamTradies: [
        {
          default: 0,
          id: `ik-color-sc`,
          name: `Color`,
          options: [
            {
              id: `ik-1`,
              name: `Dark blue`
            },
            {
              id: `ik-2`,
              name: `Black`
            }
          ]
        }
      ]
    };
    let binaryOptions = [
      {
        id: `ik-1`,
        name: `Yes`
      },
      {
        id: `ik-2`,
        name: `No`
      }
    ];
    let key =  id.replace(/Black|Blue/g, ``);
    if (!obj.options[key]) {
      resolve(url);
      return;
    }
    obj.popup = new Popup_v2({
      icon: `fa-gear`,
      title: `Select the options that you want:`,
      buttons: [
        {
          color1: `green`, color2: `grey`,
          icon1: `fa-gear`, icon2: `fa-circle-o-notch fa-spin`,
          title1: `Generate`, title2: `Generating...`,
          callback1: generateThemeUrl.bind(null, obj, key)
        }
      ],
      addScrollable: true
    });
    obj.popup.onClose = resolve.bind(null, url);
    let context = obj.popup.getScrollable([{
      attributes: {
        class: `esgst-sm-colors`
      },
      type: `div`
    }]).firstElementChild;
    obj.options[key].forEach(option => {
      option.select = createElemens(context, `beforeEnd`, [{
        type: `div`,
        children: [{
          text: `${option.name} `,
          type: `node`
        }, {
          type: `select`
        }]
      }]).lastElementChild;
      (option.options || binaryOptions).forEach(subOption => {
        createElements(option.select, `beforeEnd`, [{
          attributes: {
            value: subOption.id
          },
          text: subOption.name,
          type: `option`
        }]);
      });
      option.select.selectedIndex = option.default;
    });
    obj.popup.open();
  }

  function generateThemeUrl(obj, key) {
    obj.url += `?`;
    obj.options[key].forEach(option => {
      obj.url += `${option.id}=${option.select.value}&`;
    });
    obj.url = obj.url.slice(0, -1);
    obj.popup.onClose = null;
    obj.popup.close();
    obj.resolve(obj.url);
  }

  function createMenuSection(context, html, number, title, type) {
    let section = createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-form-row`,
        id: `esgst_${type}`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-form-heading`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-form-heading-number`
          },
          text: `${number}.`,
          type: `div`
        }, {
          attributes: {
            class: `esgst-form-heading-text`
          },
          type: `div`,
          children: [{
            text: title,
            type: `span`
          }]
        }]
      }, {
        attributes: {
          class: `esgst-form-row-indent`
        },
        type: `div`,
        children: html
      }]
    }]);
    if (esgst.collapseSections && !title.match(/Backup|Restore|Delete/)) {
      let button, container, isExpanded;
      button = createElements(section.firstElementChild, `afterBegin`, [{
        attributes: {
          class: `esgst-clickable`,
          style: `margin-right: 5px;`
        },
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-plus-square`,
            title: `Expand section`
          },
          type: `i`
        }]
      }]);
      container = section.lastElementChild;
      container.classList.add(`esgst-hidden`);
      isExpanded = false;
      button.addEventListener(`click`, () => {
        if (isExpanded) {
          container.classList.add(`esgst-hidden`);
          createElements(button, `inner`, [{
            attributes: {
              class: `fa fa-plus-square`,
              title: `Expand section`
            },
            type: `i`
          }]);
          isExpanded = false;
        } else {
          container.classList.remove(`esgst-hidden`);
          createElements(button, `inner`, [{
            attributes: {
              class: `fa fa-minus-square`,
              title: `Collapse section`
            },
            type: `i`
          }]);
          isExpanded = true;
        }
      });
    }
    return section;
  }

  function createSMButtons(heading, items) {
    for (const item of items) {
      if (!item.Check) {
        continue;
      }
      const icons = [];
      for (const icon of item.Icons) {
        icons.push({
          attributes: {
            class: `fa ${icon}`
          },
          type: `i`
        });
      }
      createElements(heading, `beforeEnd`, [{
        attributes: {
          class: item.Name,
          title: item.Title
        },
        type: `a`,
        children: icons
      }]);
    }
  }

  function triggerSetOnEnter(set, event) {
    if (event.key === `Enter`) {
      set.trigger();
      return true;
    }
  }

  function formatTags(fullMatch, match1, offset, string) {
    return (((offset === 0) || (offset === (string.length - fullMatch.length))) ? `` : `, `);
  }

  function animateScroll(y, callback) {
    // From https://stackoverflow.com/a/26808520/8115112

    let currentTime, time;
    currentTime = 0;
    if (y > 0) {
      y -= esgst.commentsTop;
    }
    time = Math.max(0.1, Math.min(Math.abs(scrollY - y) / 2000, 0.8));

    function tick() {
      let p;
      currentTime += 1 / 60;
      p = currentTime / time;
      if (p < 1) {
        requestAnimationFrame(tick);
        scrollTo(0,  scrollY + ((y -  scrollY) * ((p /= 0.5) < 1 ? 0.5 * Math.pow(p, 5) : 0.5 * (Math.pow((p - 2), 5) + 2))));
      } else {
        scrollTo(0, y);
        if (callback) {
          callback();
        }
      }
    }

    tick();
  }

  function reverseComments(context) {
    let i, n;
    let frag = document.createDocumentFragment();
    for (i = 0, n = context.children.length; i < n; ++i) {
      frag.appendChild(context.lastElementChild);
    }
    context.appendChild(frag);
  }

  function createAlert(message) {
    let popup;
    popup = new Popup(`fa-exclamation`, message, true);
    popup.open();
  }

  function createConfirmation(message, onYes, onNo, event) {
    let callback, popup;
    callback = onNo;
    popup = new Popup(`fa-question`, message, true);
    popup.description.appendChild(new ButtonSet(`green`, ``, `fa-check`, ``, `Yes`, ``, () => {
      callback = onYes;
      popup.close();
    }).set);
    popup.description.appendChild(new ButtonSet(`red`, ``, `fa-times`, ``, `No`, ``, () => {
      callback = onNo;
      popup.close();
    }).set);
    popup.onClose = () => {
      if (callback) {
        callback(event);
      }
    };
    popup.open();
  }

  function createFadeMessage(context, message) {
    context.textContent = message;
    setTimeout(() => {
      context.textContent = ``;
    }, 10000);
  }

  function getDataMenu(option, switches, type) {
    let i, m, menu, n, options, toggleSwitch;
    menu = document.createElement(`div`);
    switches[option.key] = toggleSwitch = new ToggleSwitch(menu, `${type}_${option.key}`, false, option.name, false, false, null, esgst.settings[`${type}_${option.key}`]);
    switches[option.key].size = createElements(switches[option.key].name, `beforeEnd`, [{
      attributes: {
        class: `esgst-bold`
      },
      type: `span`
    }]);
    if (option.name === `Main`) {
      createElements(switches[option.key].name, `beforeEnd`, [{
        attributes: {
          class: `fa fa-question-circle`,
          title: `Main data is the data that is needed by other sub-options. Because of that dependency, when deleting main data not all data may be deleted, but if you delete another sub-option first and then delete main data, all data that was required exclusively by that sub-option will be deleted.`
        },
        type: `i`
      }]);
    }
    if (option.options) {
      options = createElements(menu, `beforeEnd`, [{
        attributes: {
          class: `esgst-form-row-indent SMFeatures esgst-hidden`
        },
        type: `div`
      }]);
      for (i = 0, n = option.options.length; i < n; ++i) {
        m = getDataMenu(option.options[i], switches, type);
        options.appendChild(m);
        toggleSwitch.dependencies.push(m);
      }
      if (esgst.settings[`${type}_${option.key}`]) {
        options.classList.remove(`esgst-hidden`);
      }
    }
    toggleSwitch.onEnabled = () => {
      if (options) {
        options.classList.remove(`esgst-hidden`);
      }
    };
    toggleSwitch.onDisabled = () => {
      if (options) {
        options.classList.add(`esgst-hidden`);
      }
    }
    return menu;
  }

  function openSmallWindow(url) {
    open(url, `esgst`, `height=600,left=${(screen.width - 600) / 2},top=${(screen.height - 600) / 2},width=600`);
  }

  function convertBytes(bytes) {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else {
      bytes /= 1024;
      if (bytes < 1024) {
        return `${Math.round(bytes * 100) / 100} KB`;
      } else {
        return `${Math.round(bytes / 1024 * 100) / 100} MB`;
      }
    }
  }

  function getThemeCss(theme) {
    let separators = theme.match(/@-moz-document(.+?){/g);
    if (!separators) {
      return theme;
    }
    let css = [];
    separators.forEach(separator => {
      let check = false;
      (separator.match(/domain\(.+?\)/g) || []).forEach(domain => {
        if (location.hostname.match(domain.match(/\("(.+?)"\)/)[1])) {
          check = true;
          return;
        }
      });
      (separator.match(/url(-prefix)?\(.+?\)/g) || []).forEach(url => {
        if (location.href.match(url.match(/\("(.+?)"\)/)[1])) {
          check = true;
          return;
        }
      });
      if (!check) return;
      let index = theme.indexOf(separator) + separator.length,
        open = 1;
      do {
        let character = theme[index];
        if (character === `{`) {
          open++;
        } else if (character === `}`) {
          open--;
        }
        css.push(character);
        index++;
      } while (open > 0);
      css.pop();
    });
    return css.join(``);
  }

  function loadChangelog(version) {
    const changelog = [
      {
        date: `August 6, 2018`,
        version: `7.26.0`,
        changelog: {
          870: `Add Learning game category`,
          869: `Add Singleplayer game category`,
          868: `Include online multiplayer, co-op and online co-op in the Multiplayer game category`,
          867: `Link to SGTools pages in the Unsent Gifts Sender results`,
          866: `Add Enterable filter to Giveaway Extractor`,
          864: `Add a feature: Group Tags`,
          862: `Add autocomplete feature to User Tags and Game Tags`
        }
      },
      {
        date: `August 2, 2018`,
        version: `7.25.4`,
        changelog: {

        }
      },
      {
        date: `August 2, 2018`,
        version: `7.25.3`,
        changelog: {

        }
      },
      {
        date: `August 2, 2018`,
        version: `7.25.2`,
        changelog: {
          857: `Add option to backup as .zip or .json`,
          854: `Move each module into a separate file`,
          853: `Move some generic functions to a separate file`
        }
      },
      {
        date: `August 2, 2018`,
        version: `7.25.2`,
        changelog: {
          857: `Add option to backup as .zip or .json`,
          854: `Move each module into a separate file`,
          853: `Move some generic functions to a separate file`
        }
      },
      {
        date: `July 27, 2018`,
        version: `7.25.1`,
        changelog: {
          848: `Fix bugs introduced by v7.25.0`,
          850: `Fix the extension's toolbar popup`,
          852: `Add a new game category: HLTB`
        }
      },
      {
        date: `July 27, 2018`,
        version: `7.25.0`,
        changelog: {
          845: `Fix the extension to comply with Mozilla requirements`
        }
      },
      {
        date: `July 24, 2018`,
        version: `7.24.1`,
        changelog: {
          844: `Show error message in the giveaway if game categories failed to load`,
          843: `Fix a bug that re-retrieves categories for games that were already recently retrieved`,
          842: `Fix Is There Any Deal? Info`,
          841: `Extend "Most sent to" list to other users in User Giveaway Data`,
          840: `Prevent User Giveaway Data from making useless requests if a giveaway has less than or equal to 3 winners`,
          839: `Fix a bug that happens sometimes when hovering over the input field in Quick Giveaway Search`,
          838: `Fix a bug that colors ended giveaways as green the first time they are found in Giveaway Encrypter/Decrypter`,
          836: `Open links from the header menu in a new tab`,
          834: `Enhance cookie manipulation in the extension to bypass age checks in requests to the Steam store`,
          833: `Fix a bug that happens when showing game categories in real time`,
          832: `Fix changelog link in the header menu`,
          828: `Add option to show the Giveaway Encrypter/Decrypter header button even if there are only ended giveaways in the page`,
          803: `Fix a bug that doesn't show groups containing HTML entities in Multiple Giveaway Creator`
        }
      },
      {
        date: `July 22, 2018`,
        version: `7.24.0`,
        changelog: {
          829: `Add options to limit requests to the Steam store and show categories in real time to Game Categories`,
          831: `Fix a bug that does not calculate average entries correctly in Entry Tracker`,
          830: `Fix a bug that identifies non-owned games as owned in Game Categories`,
          827: `Add a feature: Giveaway Points To Win`,
          826: `Add "Projected Chance", "Projected Chance Per Point" and "Projected Ratio" to Giveaways Sorter`,
          805: `Add "Projected Chance", "Projected Chance Per Point" and "Projected Ratio" giveaway filters`,
          808: `Fix a bug that does not remember the position of the winners column in group pages when dragging`,
          825: `Fix a style issue that shows two scrollbars in the settings menu`
        }
      },
      {
        date: `July 20, 2018`,
        version: `7.23.0`,
        changelog: {
          824: `Add enhancements to User Giveaway Data`,
          823: `Fix a bug that does not change SteamGifts filters through Giveaway Filters correctly`,
          822: `Fix a bug that does not pin highlighted discussions after sorting`,
          821: `Make SGTools filter ignore the Chance, Chance Per Point, Comments, Entries and Ratio filters`,
          820: `Fix the "Add Current" button for includes/excludes in the main page`,
          819: `Possible fix for endless spawning issue with Steam Activation Links`,
          818: `Use the featured heading of a user's profile page instead of the page heading`,
          817: `Add option to choose custom colors for Giveaway Copy Highlighter`,
          816: `Add option to automatically mark a user's own comments as read`,
          815: `Add option to enable tracking controls for a user's own comments`,
          814: `Add option to fade out read comments in Comment Tracker`,
          813: `Fix a bug that happens when refreshing active discussions on the sidebar`,
          812: `Fix a bug that happens when retrieving categories of discussions in the sidebar`,
          790: `Add option to automatically update hidden games adding/removing a game to/from the list`,
          811: `Show success message when cleaning data`,
          795: `Fix a bug that happens when cleaning data for features that the user hasn't used yet`,
          810: `Automatically detect username changes when visiting a user's profile page`,
          804: `Change resource references to the current version in the userscript version`,
          802: `Make the settings search bar stay always visible when scrolling`,
          797: `Add Public giveaway filter`,
          801: `Add a feature: Comment Filters`,
          147: `Add extension support for Microsoft Edge`,
          796: `Add countdown to the duplicate giveaway waiting period in Multiple Giveaway Creator`,
          794: `Add Patreon as an additional form of donation`,
          785: `Detect packages that contain owned/wishlisted games through Game Categories`,
          792: `Fix a bug that does not update the list of reduced CV games if a game was removed`,
          784: `Load themes faster`,
          646: `Extend header/footer to ESGST-generated pages`,
          672: `Add option to clean discussion (remove deleted comments from the database) to Comment Tracker`,
          783: `Open SGTools links in new tabs on Giveaway Extractor`
        }
      },
      {
        date: `June 24, 2018`,
        version: `7.22.0`,
        changelog: {
          545: `Add a feature: Have/Want List Checker`,
          572: `Fix a bug that does not predict the level in Level Progress Visualizer correctly`,
          690: `Fix a bug where Giveaway Group Loader fails in some pages`,
          702: `Extend Attached Image Carousel to Quick Inbox View`,
          722: `Improve performance when applying filter presets (removes live-search select box and invert rule)`,
          732: `Bring back filter counters`,
          768: `Save state of "create train" and "remove links" switches from Multiple Giveaway Creator with Giveaway Templates`,
          769: `Add polyfill for IntersectionObserver`,
          771: `Fix a bug that does not filter games without images after data being retrieved with Created/Entered/Won Giveaway Details`,
          772: `Fix domain for SteamGifts popups on SteamTrades`,
          773: `Fix Shared Group Checker for new Steam group page design`,
          775: `Save game name when it doesn't have an image for future use`,
          776: `Fix a bug that does not save an advanced filter preset after deleting the rules`,
          777: `Fix a bug that does not filter by Achievements or Linux`,
          778: `Add small manual for advanced filters`,
          779: `Fix conflict with Touhou script`,
          780: `Fix a bug that blinks the minimize popups panel if the popup was open when it ended`,
          781: `Fix a bug that does not allow restoring .zip files in Firefox`,
          782: `Fix a bug that skips the Quick Inbox View popout to the top when scrolling down`
        }
      },
      {
        date: `June 10, 2018`,
        version: `7.21.1`,
        changelog: {
          0: `Hotfix for v7.21.0.`
        }
      },
      {
        date: `June 10, 2018`,
        version: `7.21.0`,
        changelog: {
          765: `Fix a bug that does not allow restoring .zip files`,
          764: `Fix a bug that does not save filter settings if only basic filters are enabled`,
          763: `Fix a bug that does not retrieve all pages correctly in Whitelist/Blacklist Checker`,
          762: `Fix a bug that adds duplicate "Sticky group" buttons`,
          760: `Add SteamGifts' CSS file to the repository to prevent ESGST pages from being messed up if cg updates the CSS`,
          759: `Fix a bug that shows wrong list of users in Group Library/Wishlist Checker when searching by app ID`,
          758: `Fix a bug that only previews comments on user input`,
          757: `Fix a bug that does not load encrypted giveaways`,
          756: `Open settings menu when clicking on the extension icon`,
          755: `Add option to minimize non-temporary popups`,
          753: `Fix a bug that adds duplicate "Skip User" buttons to Whitelist/Blacklist Checker`,
          752: `Fix active discussions on narrow sidebar`,
          750: `Fix a bug that positions large popouts incorrectly in screens below 1440x900`,
          749: `Fix a bug that does not allow applying empty presets`,
          748: `Improve the scrolling`,
          747: `Fix a bug that applies discussion filter on the main page even when disabled`,
          746: `Add a feature: Points Visualizer`,
          745: `Fix a style issue in the filters`,
          744: `Add a new game category: DLC (Base Owned)`,
          743: `Bring back option to select which filters to appear`,
          742: `Fix a bug that does not load Multi-Manager in the regular pages`,
          711: `Fix a bug in Quick Inbox View`,
          671: `Add a feature: Giveaway End Time Highlighter`,
          573: `Completely revamp User Giveaway Data`
        }
      },
      {
        date: `May 28, 2018`,
        version: `7.20.5`,
        changelog: {
          0: `Hotfix for v7.20.4.`
        }
      },
      {
        date: `May 28, 2018`,
        version: `7.20.4`,
        changelog: {
          737: `Save paused state of filters to allow them to remain paused when refreshing the page`,
          736: `Fix a bug that deletes settings if saving a preset with some filters paused`,
          735: `Convert old presets to the new system`,
          734: `Fix a bug in Endless Scrolling`,
          731: `Fix a bug that does not apply presets`
        }
      },
      {
        date: `May 27, 2018`,
        version: `7.20.3`,
        changelog: {
          730: `Possible fix to massive CPU usage spikes`,
          728: `Increase max-height of filters area`,
          727: `Fix a bug that happens when backing up to Google Drive`,
          726: `Fix a bug in the filters`,
          723: `Change color of AND/OR filter buttons`,
          721: `Fix a bug that happens in Giveaway Encrypter/Decrypter because of filters`,
          720: `Bring back the core of the basic filters as an opt-out option`,
          718: `Add button to pause filter rules/groups to advanced filters`
        }
      },
      {
        date: `May 27, 2018`,
        version: `7.20.2`,
        changelog: {
          0: `Hotfix for v7.20.1.`
        }
      },
      {
        date: `May 26, 2018`,
        version: `7.20.1`,
        changelog: {
          0: `Hotfix for v7.20.0.`
        }
      },
      {
        date: `May 26, 2018`,
        version: `7.20.0`,
        changelog: {
          709: `Use jQuery QueryBuilder to configure filters`,
          715: `Add a feature: Narrow Sidebar`,
          708: `Fix a bug that does not load features correctly in new tabs`,
          667: `Fix a bug that does not load endless features correctly in some pages`,
          678: `Display ? instead of negative CV in Game Categories - Giveaway Info and get the price from the giveaway points when available`,
          707: `Do not go to comment in Quick Inbox View`,
          665: `Add other found replies to the comment instead of showing them in a popup in Reply From Inbox`,
          703: `Improve description variables explanation in Multiple Giveaway Creator`,
          706: `Fix a bug that reverses the pages of a discussion when there is a hash in the URL`,
          705: `Fix a bug that does not manage items inside of Grid View popouts in Multi-Manager`,
          704: `Add option to hide games to Multi-Manager`
        }
      },
      {
        date: `May 20, 2018`,
        version: `7.19.0`,
        changelog: {
          701: `Remove min-height requirement from Fixed Sidebar`,
          700: `Fix a bug that does not fix the sidebar after scrolling down a second time from the top`,
          699: `Fix a bug that does not display the sync page`,
          698: `Add option to choose the key combination to trigger the Custom Header/Footer Links editor`,
          695: `Fix a bug where sorting fails after hiding a single giveaway`,
          694: `Fix a style issue that does not position popouts above/below correctly`,
          693: `Fix a style issue that does not position popouts correctly if the window is scrolled horizontally`,
          692: `Remove min-height requirement from Fixed Main Page Heading`,
          691: `Change Giveaway Popup button to red if giveaway cannot be accessed`,
          689: `Add a button to clear the current query to the search field in the settings menu`,
          688: `Extend giveaway features to the archive page`,
          686: `Changes to how emojis are stored`,
          685: `Compress data when backing up`,
          684: `Add &quot;Last Bundled&quot; default link to Custom Header/Footer Links`,
          683: `Allow selected emojis to be re-ordered`,
          682: `Add option to retrieve game names when syncing`,
          681: `Fix a bug where filtering is applied when changing any filter options despite filtering being disabled`,
          680: `Add a feature: Visible Real CV`,
          679: `Add &quot;Previously Won&quot; game category`,
          677: `Fix a bug that does not persist some settings`,
          676: `Fix a bug that auto-backups to computer on every page load`,
          674: `Change how the NEW indicator works on Quick Inbox View`
        }
      },
      {
        date: `May 11, 2018`,
        version: `7.18.3`,
        changelog: {
          675: `Remove Comment History from SteamTrades`,
          673: `Fix a bug that happens when creating giveaways through either Giveaway Templates or Multiple Giveaway Creator`,
          670: `Fix a bug that does not return Endless Scrolling to a paused state after continuously loading pages`,
          667: `Fix a bug that does not load endless features correctly in some pages`
        }
      },
      {
        date: `May 07, 2018`,
        version: `7.18.2`,
        changelog: {
          668: `Hotfix for v7.18.1`
        }
      },
      {
        date: `May 07, 2018`,
        version: `7.18.1`,
        changelog: {
          666: `Hotfix for v7.18.0`
        }
      },
      {
        date: `May 07, 2018`,
        version: `7.18.0`,
        changelog: {
          664: `Fix a bug that does not decrypt giveaways containing the word bot in their name`,
          663: `Fix a bug that happens when importing giveaways with a description template for a train in Multiple Giveaway Creator`,
          662: `Fixate the Comment Formatting Helper panel without limiting the height of the text area`,
          661: `Fix a bug in Comment Formatting Helper that does not add a scrolling bar to the text area in the edit discussion page`,
          660: `Fix a bug that removes all games when syncing if both the store and the API methods failed`,
          659: `Fix a style issue that sometimes does not overlap popups/popouts correctly`,
          658: `Fix a bug that does not refresh Quick Inbox View correctly`,
          657: `Add infinite max filters to Giveaway/Discussion Filters`,
          655: `Fix a bug that does not load endless features correctly`,
          654: `Make SGTools link draggable in Giveaway Extractor`,
          653: `Add missing Steam and search links to SGTools giveaways in Giveaway Extractor`,
          651: `Update FontAwesome links`,
          650: `Limit requests to the Steam store when syncing to 1 per second`,
          647: `Changes to the structure of the code`,
          645: `Add a SGTools filter to Giveaway Filters`,
          644: `Fix a bug that does not delete table rows in Comment Formatting Helper`,
          642: `Add option to group all keys for the same game in Multiple Giveaway Creator`,
          641: `Add a new section to the settings menu: Themes`,
          640: `Fix tooltip in Multiple Giveaway Creator`,
          639: `Convert checkboxes from circles to squares`,
          638: `Fix some bugs that happen when marking comments as unread`,
          608: `Add a feature: Multi-Manager (remove Giveaway Manager and Multi-Tag)`,
          332: `Fix a bug that fails to create multiple giveaways for the same game in Multiple Giveaway Creator`
        }
      },
      {
        date: `April 19, 2018`,
        version: `7.17.8`,
        changelog: {
          637: `Fix a style issue in pages generated by ESGST open in a new tab`,
          636: `Fix a bug that calculates the wrong chance per point if a giveaway has 0 points`,
          635: `Bypass bot protections when extracting giveaways`,
          634: `Fix a bug that does not switch the colors of game category icons for alt accounts when moving them`,
          633: `Fix a bug that does not turn the decrypted giveaways icon to green when new giveaways are found`,
          628: `Add option to only search for comments in a specific page range to Comment Searcher`,
          599: `Extend Giveaways Sorter to popups`,
          567: `Add description variables to Multiple Giveaway Creator`
        }
      },
      {
        date: `April 14, 2018`,
        version: `7.17.7`,
        changelog: {
          632: `Add option to limit how many SGTools giveaways are opened when extracting`,
          631: `Add option to allow manipulation of cookies for Firefox containers`,
          630: `Add more details to error messages during alt accounts sync`,
          629: `Cancel backup when canceling file name input`,
          627: `Implement a method to make the process of adding new filters easier`,
          626: `Fix a bug that does not sync games if the user does not have alt accounts set`,
          625: `Integrate SGTools giveaways into Giveaway Extractor`,
          624: `Fix a bug that opens duplicate SGTools links when extracting giveaways`,
          623: `Add option to save backups without asking for a file name`,
          593: `Add Groups and Creators giveaway filters and Authors discussion filter`,
          592: `Fix a bug that does not load more pages in Endless Scrolling if there are deleted giveaways in the current page with the ended filter set to hide all`
        }
      },
      {
        date: `April 11, 2018`,
        version: `7.17.6`,
        changelog: {
          620: `Add more reliable methods of syncing and backing up`,
          619: `Fix a bug that does not add an Enter button when extracting giveaways with few points`,
          618: `Add option to open SGTools links when extracting giveaways`,
          617: `Fix a bug that does not sync owned games in alt accounts`,
          616: `Allow users to sync their games through the Steam API alone if the store method is unavailable`,
          615: `Fix a bug that does not reverse a discussion if endless scrolling is paused`,
          614: `Add option to reverse comments in a discussion by indicating it through a hash in the URL`,
          613: `Make blacklist checks an opt-out instead of an opt-in by default in Whitelist/Blacklist Checker`,
          611: `Add option to specify non-region restricted giveaways when importing in Multiple Giveaway Creator`,
          610: `Fix a bug that duplicates the permalink icon`,
          609: `Fix a bug that does not retrieve game names when syncing`,
          607: `Fix a bug that does not include the .zip download when notifying a new version in non-Firefox browsers`,
          604: `Fix a bug that prevents the script from loading`,
          603: `Fix a bug that can prevent some elements in the giveaway columns/panel from being moved`,
          600: `Fix a bug that does not show SG popups found when requesting data if static popups are enabled`
        }
      },
      {
        date: `April 05, 2018`,
        version: `7.17.5`,
        changelog: {
          605: `Fix a bug that does not set the correct default values for some settings`,
          602: `Add option to clean duplicate data to the data cleaner menu`,
          598: `Implement a method to automatically detect and highlight new features/options in the settings menu with the [NEW] tag`,
          597: `Fix a bug that shows Inifity% chance per point on the entered page`,
          596: `Replace the terms &quot;Import&quot; and &quot;Export&quot; with &quot;Restore&quot; and &quot;Backup&quot; and change the icons to avoid any confusion`,
          584: `Fix a bug that does not reload the extension in Chrome when updating`,
          555: `Add SteamGifts filters to Giveaway Filters`,
          538: `Add options to allow users to specify the format of the tab indicators in Header Refresher`,
          524: `Fix a but that shows the new version popup twice`,
          299: `Implement a method to better handle marking discussions as visited across multiple tabs`
        }
      },
      {
        date: `March 25, 2018`,
        version: `7.17.4`,
        changelog: {
          590: `Speed up retrieval of Game Categories for users that do not have ratings, removed and user-defined tags enabled`,
          588: `Fix a conflict between whitelist/blacklist/rule checks and Quick Inbox View`,
          587: `Prevent main page heading from being fixed if the page is too small`,
          586: `Add option to filter giveaways by chance per point`,
          585: `Fix a bug that duplicates user notes when importing and merging`,
          582: `Fix a couple bugs that prevent Game Categories from being retrieved correctly`
        }
      },
      {
        date: `March 20, 2018`,
        version: `7.17.3`,
        changelog: {
          583: `Revert #565`,
          580: `Fix a bug in Tables Sorter that does not sort sent/received group columns correctly`,
          579: `Rename Whitelist/Blacklist Links to Profile Links and add more options`
        }
      },
      {
        date: `March 15, 2018`,
        version: `7.17.2`,
        changelog: {
          0: `Split jQuery, jQuery UI and Parsedown into separate files`
        }
      },
      {
        date: `March 14, 2018`,
        version: `7.17.1`,
        changelog: {
          0: `Add extension to the Mozilla store`
        }
      },
      {
        date: `March 14, 2018`,
        version: `7.17.0`,
        changelog: {
          562: `Add descriptions to the precise options in Giveaway Templates`,
          563: `Add an option to specify the game when importing with Multiple Giveaway Creator`,
          564: `Fix a bug that does not extract the giveaway from the current page`,
          565: `Add minified version and set it as default`,
          566: `Add option to specify separate details for each imported giveaway in Multiple Giveaway Creator`,
          568: `Add an option to enable Giveaway Recreator for all created giveaways`,
          570: `Fix a bug in Chrome that does not open the giveaway extractor on first click`,
          571: `Include whether the giveaway is for a gift or a key in the template when using Giveaway Templates`,
          574: `Add a feature: Element Filters (remove Hidden Feature Container and Hidden Pinned Giveaways)`,
          575: `Move "Click here to see your review for this user" to the top of the page in Reply Box On Top on SteamTrades`,
          576: `Fix a bug that does not load features correctly in discussions that contain polls`,
          578: `Optimize the extension performance (Ongoing)`,
          353: `Convert all callback functions into promises and use async/await to deal with them (Ongoing)`
        }
      },
      {
        date: `March 4, 2018`,
        version: `7.16.5`,
        changelog: {
          353: `Convert all callback functions into promises and use async/await to deal with them (ongoing)`,
          552: `Fix a bug that does not allow the Giveaway Extractor button to be moved`,
          556: `Only load Attached Images Carouself for images that are actually in the page`,
          558: `Fix a bug that does not extract giveaways in a new tab`,
          560: `Fix a bug that does not load ESGST sometimes`,
          561: `Fix a bug that happens when performing requests in the userscript version`
        }
      },
      {
        date: `March 2, 2018`,
        version: `7.16.4`,
        changelog: {
          0: `Hotfix for v7.16.3 (Userscript version was still not working)`
        }
      },
      {
        date: `March 2, 2018`,
        version: `7.16.3`,
        changelog: {
          0: `Hotfix for v7.16.2 (Userscript version was not working)`
        }
      },
      {
        date: `March 2, 2018`,
        version: `7.16.2`,
        changelog: {
          0: `Hotfix for v7.16.1 (Forgot to change the version)`
        }
      },
      {
        date: `March 2, 2018`,
        version: `7.16.1`,
        changelog: {
          527: `Fix a bug that happens when loading highlighted discussions`,
          537: `Add option to delete days from Entry Tracker history`,
          539: `Fix a bug that happens when sending unsent gifts with the options to check if the winner is whitelisted/blacklisted`,
          540: `Fix some bugs with the reordering of heading buttons`,
          541: `Extend Inbox Winner Highlighter to Quick Inbox View`,
          542: `Add options to specify image border width when highlighting a giveaway with Giveaway Winning Chance/Ratio`,
          543: `Fix a bug that does not load some features correctly`,
          544: `Change the order of the elements in the Giveaway Bookmarks popup`,
          548: `Fix a bug that decrypts giveaway links from the Quick Inbox View popout`,
          549: `Add domain instructions to adding a Steam API key`,
          550: `Optimize storage usage in the script version`
        }
      }
    ];
    let index = 0;
    if (version) {
      let i, n;
      for (i = 0, n = changelog.length; i < n && changelog[i].version !== version; i++);
      index = i < n ? i - 1 : n - 1;
    }
    const html = [];
    while (index > -1) {
      const items = [];
      for (const key in changelog[index].changelog) {
        const item = {
          type: `li`,
          children: []
        };
        if (key == 0) {
          item.children.push({
            text: changelog[index].changelog[key],
            type: `node`
          });
        } else {
          item.children.push({
            attributes: {
              href: `https://github.com/revilheart/ESGST/issues/${key}`
            },
            text: `#${key}`,
            type: `a`
          }, {
            text: ` ${changelog[index].changelog[key]}`,
            type: `node`
          });
        }        
        items.push(item);
      }
      html.unshift({
        attributes: {
          class: `esgst-bold`
        },
        text: `v${changelog[index].version} (${changelog[index].date})`,
        type: `p`
      }, {
        type: `ul`,
        children: items
      });
      index -= 1;
    }
    const popup = new Popup(`fa-file-text-o`, `Changelog`, true);
    createElements(popup.scrollable, `afterBegin`, [{
      attributes: {
        class: `esgst-text-left markdown`
      },
      type: `div`,
      children: html
    }]);
    popup.open();
  }

  function createElements(context, position, items) {
    if (!items || !items.length) {
      return;
    }
    const fragment = document.createDocumentFragment();
    let element = null;
    buildElements(fragment, items);
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
        context.innerHTML = ``;
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
  }

  function buildElements(context, items) {
    for (const item of items) {
      if (!item) {
        continue;
      }
      if (isSet(item.context)) {
        context.appendChild(item.context);
        continue;
      }
      if (item.type === `node`) {
        const node = document.createTextNode(item.text);
        context.appendChild(node);
        continue;
      }
      const element = document.createElement(item.type);
      if (isSet(item.attributes)) {
        for (const key in item.attributes) {
          element.setAttribute(key, item.attributes[key]);
        }
      }
      if (isSet(item.text)) {
        element.textContent = item.text;
      }
      if (isSet(item.children)) {
        buildElements(element, item.children);
      }
      if (isSet(item.events)) {
        for (const key in item.events) {
          element.addEventListener(key, item.events[key]);
        }
      }
      if (item.type === `i`) {
        const node = document.createTextNode(` `);
        context.appendChild(node);
      }
      context.appendChild(element);
      if (item.type === `i`) {
        const node = document.createTextNode(` `);
        context.appendChild(node);
      }
    }
  }
  
  // initialize esgst
  init();
})();
