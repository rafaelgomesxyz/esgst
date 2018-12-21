import ButtonSet from './ButtonSet';
import {container} from './Container';
import { loadMenu } from '../modules/Settings';

export default class Popup {
  constructor(details) {
    this.temp = details.isTemp;
    this.layer = container.common.createElements(document.body, `beforeEnd`, [{
      attributes: {
        class: `esgst-hidden esgst-popup-layer`
      },
      type: `div`,
      children: [details.popup ? {
        context: details.popup
      } : {
        attributes: {
          class: `esgst-popup`
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
            class: `esgst-popup-scrollable ${details.addScrollable === `left` ? `esgst-text-left` : ``}`
          },
          type: `div`,
          children: details.scrollableContent || null
        }, {
          attributes: {
            class: `esgst-popup-actions`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-hidden`,
              href: container.esgst.settingsUrl
            },
            text: `Settings`,
            type: `a`
          }, {
            attributes: {
              class: `esgst-popup-close`
            },
            text: `Close`,
            type: `a`
          }]
        }]
      }, {
        attributes: {
          class: `esgst-popup-modal`,
          title: `Click to close the modal`
        },
        type: `div`
      }]
    }]);
    this.onClose = details.onClose;
    this.popup = this.layer.firstElementChild;
    this.modal = this.layer.lastElementChild;
    if (details.popup) {
      this.popup.classList.add(`esgst-popup`);
      this.popup.style.display = `block`;
      this.popup.style.maxHeight = `calc(100% - 150px)`;
      this.popup.style.maxWidth = `calc(100% - 150px)`;
    } else {
      this.popup.style.maxHeight = `calc(100% - 50px)`;
      this.popup.style.maxWidth = `calc(100% - 50px)`;
      this.icon = this.popup.firstElementChild.firstElementChild;
      this.title = this.icon.nextElementSibling;
      this.description = this.popup.firstElementChild.nextElementSibling;
      this.scrollable = this.description.nextElementSibling;
      this.actions = this.scrollable.nextElementSibling;
      let settings = this.actions.firstElementChild;
      if (!details.settings) {
        settings.classList.remove(`esgst-hidden`);
        settings.addEventListener(`click`, event => {
          if (!container.esgst.openSettingsInTab) {
            event.preventDefault();
            loadMenu(true);
          }
        });
      }
    }
    let closeButton = this.popup.querySelector(`.esgst-popup-close, .b-close`);
    if (closeButton) {
      closeButton.addEventListener(`click`, () => this.close());
    }
    this.modal.addEventListener(`click`, () => this.close());
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
        let input = container.common.createElements(this.description, `beforeEnd`, items);
        input.addEventListener(`keydown`, this.triggerButton.bind(this, 0));
        this.textInputs.push(input);
      });
    }
    if (details.options) {
      this.description.appendChild(container.common.createOptions(details.options));
      let inputs = this.description.lastElementChild.getElementsByTagName(`input`);
      for (let input of inputs) {
        switch (input.getAttribute(`type`)) {
          case `number`:
            container.common.observeNumChange(input, input.getAttribute(`name`), true);
            break;
          case `text`:
            container.common.observeChange(input, input.getAttribute(`name`), true);
            break;
          default:
            break;
        }
      }
    }
    if (details.buttons) {
      this.buttons = [];
      details.buttons.forEach(button => {
        let set = new ButtonSet(button);
        this.buttons.push(set);
        this.description.appendChild(set.set);
      });
    }
    if (details.addProgress) {
      this.progress = container.common.createElements(this.description, `beforeEnd`, [{
        type: `div`
      }]);
      this.overallProgress = container.common.createElements(this.description, `beforeEnd`, [{
        type: `div`
      }]);
    }
  }

  open(callback) {
    this.isOpen = true;
    let n = 9999 + document.querySelectorAll(`.esgst-popup-layer:not(.esgst-hidden), .esgst-popout:not(.esgst-hidden)`).length;
    if (container.esgst.openPopups > 0) {
      const highestN = parseInt(container.esgst.popups[container.esgst.openPopups - 1].popup.style.zIndex || 0);
      if (n <= highestN) {
        n = highestN + 1;
      }
    }
    container.esgst.openPopups += 1;
    container.esgst.popups.push(this);
    this.layer.classList.remove(`esgst-hidden`);
    this.layer.style.zIndex = n;
    if (this.textInputs) {
      this.textInputs[0].focus();
    }
    if (callback) {
      callback();
    }
  }

  close() {
    this.layer.remove();
    if (this.temp) {
      this.layer.remove();
    } else {
      this.layer.classList.add(`esgst-hidden`);
      if (container.esgst.minimizePanel) {
        container.common.minimizePanel_addItem(this);
      }
    }
    if (this.onClose) {
      this.onClose();
    }
    container.esgst.openPopups -= 1;
    container.esgst.popups.pop();
    this.isOpen = false;
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
    container.common.createElements(this.scrollable, `beforeEnd`, [{
      type: `div`,
      children: html
    }]);
  }

  getScrollable(html) {
    return container.common.createElements(this.scrollable, `beforeEnd`, [{
      type: `div`,
      children: html
    }]);
  }

  setError(message) {
    container.common.createElements(this.progress, `inner`, [{
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
      container.common.createElements(this.progress, `inner`, [{
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

  setTitle(title) {
    this.title.textContent = title;
  }

  /**
   *
   * @param [temp]
   */
  setDone(temp) {
    this.temp = temp;
    if (container.esgst.minimizePanel && !this.isOpen) {
      container.common.minimizePanel_alert(this);
    }
  }
}
