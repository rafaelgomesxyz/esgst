import ButtonSet from './ButtonSet';
import {container} from './Container';

export default class Popup {
  constructor(details) {
    this.isCreated = !details.popup;
    this.temp = details.isTemp;
    this.popup = details.popup || container.common.createElements(document.body, `beforeEnd`, [{
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
            class: `esgst-hidden`,
            href: `https://www.steamgifts.com/account/settings/profile?esgst=settings`
          },
          text: `Settings`,
          type: `a`
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
            container.common.observeNumChange(input, input.getAttribute(`name`));
            break;
          case `text`:
            container.common.observeChange(input, input.getAttribute(`name`));
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
    if (details.addScrollable && !details.popup) {
      this.scrollable = container.common.createElements(this.description, `beforeEnd`, [{
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
    if (container.esgst.openPopups > 0) {
      const highestN = parseInt(container.esgst.popups[container.esgst.openPopups - 1].popup.style.zIndex || 0);
      if (n <= highestN) {
        n = highestN + 1;
      }
    }
    container.esgst.openPopups += 1;
    container.esgst.popups.push(this);
    this.modal = container.common.createElements(document.body, `beforeEnd`, [{
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
    if (!container.esgst.isRepositioning && !container.esgst.staticPopups) {
      setTimeout(() => container.common.repositionPopups(), 2000);
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
        if (container.esgst.minimizePanel) {
          container.common.minimizePanel_addItem(this);
        }
      }
    } else {
      this.popup.style = ``;
    }
    if (this.onClose) {
      this.onClose();
    }
    container.esgst.openPopups -= 1;
    container.esgst.popups.pop();
    this.isOpen = false;
  }

  reposition() {
    if (this.isCreated && this.scrollable) {
      if (container.esgst.staticPopups) {
        this.scrollable.style.maxHeight = `${ innerHeight - (this.popup.offsetHeight - this.scrollable.offsetHeight) - 100}px`;
      } else {
        this.scrollable.style.maxHeight = `${ innerHeight * 0.9 - (this.popup.offsetHeight - this.scrollable.offsetHeight)}px`;
      }
    }
    if (!container.esgst.staticPopups) {
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
