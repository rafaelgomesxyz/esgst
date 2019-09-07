import { ButtonSet } from './ButtonSet';
import { shared } from './Shared';
import { gSettings } from './Globals';

class Popup {
  constructor(details) {
    this.custom = {};
    this.results = undefined;
    this.Options = undefined;
    this.Results = undefined;
    this.textArea = undefined;
    this.temp = details.isTemp;
    this.layer = shared.common.createElements_v2(document.body, 'beforeEnd', [
      ['div', { class: 'esgst-hidden esgst-popup-layer' }, [
        ...(details.popup ? [
          details.popup
        ]  : [
          ['div', { class: 'esgst-popup' }, [
            ['div', { class: 'esgst-popup-heading' }, [
              ['i', { class: `fa ${details.icon} esgst-popup-icon${details.icon ? '' : ' esgst-hidden'}` }],
              ['div', { class: `esgst-popup-title${details.title ? '' : ' esgst-hidden'}` }, details.title]
            ]],
            ['div', { class: 'esgst-popup-description' }],
            ['div', { class: `esgst-popup-scrollable ${details.addScrollable === 'left' ? 'esgst-text-left' : ''}` }, details.scrollableContent],
            ['div', { class: 'esgst-popup-actions' }, [
              ['a', { class: 'esgst-hidden', href: shared.esgst.settingsUrl }, 'Settings'],
              ['a', { class: 'esgst-popup-close' }, 'Close']
            ]]
          ]],
          ['div', { class: 'esgst-popup-modal', title: 'Click to close the modal' }]
        ])
      ]]
    ]);
    this.onCloseByUser = details.onCloseByUser;
    this.onClose = details.onClose;
    this.popup = this.layer.firstElementChild;
    this.modal = this.layer.lastElementChild;
    if (details.popup) {
      this.popup.classList.add('esgst-popup');
      this.popup.style.display = 'block';
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
        settings.classList.remove('esgst-hidden');
        settings.addEventListener('click', event => {
          if (!gSettings.openSettingsInTab) {
            event.preventDefault();
            shared.esgst.modules.settingsModule.loadMenu(true);
          }
        });
      }
    }
    let closeButton = this.popup.querySelector(`.esgst-popup-close, .b-close`);
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close(true));
    }
    this.modal.addEventListener('click', () => this.close(true));
    if (details.textInputs) {
      this.textInputs = [];
      details.textInputs.forEach(textInput => {
        const items = [];
        if (textInput.title) {
          items.push({
            text: textInput.title,
            type: 'node'
          });
        }
        items.push({
          attributes: {
            placeholder: textInput.placeholder || '',
            type: 'text'
          },
          type: 'input'
        });
        let input = shared.common.createElements(this.description, 'beforeEnd', items);
        input.addEventListener('keydown', this.triggerButton.bind(this, 0));
        this.textInputs.push(input);
      });
    }
    if (details.options) {
      this.description.appendChild(shared.common.createOptions(details.options));
      let inputs = this.description.lastElementChild.getElementsByTagName('input');
      for (let input of inputs) {
        switch (input.getAttribute('type')) {
          case 'number':
            shared.common.observeNumChange(input, input.getAttribute('name'), true);
            break;
          case 'text':
            shared.common.observeChange(input, input.getAttribute('name'), true);
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
      this.progress = shared.common.createElements(this.description, 'beforeEnd', [{
        type: 'div'
      }]);
      this.overallProgress = shared.common.createElements(this.description, 'beforeEnd', [{
        type: 'div'
      }]);
    }
    this.id = shared.common.addScope(details.name, this.popup);
  }

  open(callback) {
    shared.common.setCurrentScope(this.id);
    this.isOpen = true;
    let n = 9999 + document.querySelectorAll(`.esgst-popup-layer:not(.esgst-hidden), .esgst-popout:not(.esgst-hidden)`).length;
    if (shared.esgst.openPopups > 0) {
      const highestN = parseInt(shared.esgst.popups[shared.esgst.openPopups - 1].popup.style.zIndex || 0);
      if (n <= highestN) {
        n = highestN + 1;
      }
    }
    shared.esgst.openPopups += 1;
    shared.esgst.popups.push(this);
    this.layer.classList.remove('esgst-hidden');
    this.layer.style.zIndex = n;
    if (this.textInputs) {
      this.textInputs[0].focus();
    }
    if (callback) {
      callback();
    }
  }

  close(byUser) {
    shared.common.resetCurrentScope();
    if (this.temp) {
      shared.common.removeScope(this.id);
      this.layer.remove();
    } else {
      this.layer.classList.add('esgst-hidden');
      if (gSettings.minimizePanel) {
        shared.common.minimizePanel_addItem(this);
      }
    }
    if (byUser && this.onCloseByUser) {
      this.onCloseByUser();
    }
    if (this.onClose) {
      this.onClose();
    }
    shared.esgst.openPopups -= 1;
    shared.esgst.popups.pop();
    this.isOpen = false;
  }

  getTextInputValue(index) {
    return this.textInputs[index].value;
  }

  triggerButton(index, event) {
    if (event && (event.key !== 'Enter' || this.buttons[index].busy)) return;
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
    shared.common.createElements(this.scrollable, 'beforeEnd', [{
      type: 'div',
      children: html
    }]);
  }

  getScrollable(html) {
    return shared.common.createElements_v2(this.scrollable, 'beforeEnd', [
      ['div', html]
    ]);
  }

  setError(message) {
    shared.common.createElements(this.progress, 'inner', [{
      attributes: {
        class: 'fa fa-times-circle'
      },
      type: 'i'
    }, {
      text: `${message}`,
      type: 'span'
    }]);
  }

  setProgress(message) {
    if (this.progressMessage) {
      this.progressMessage.textContent = message;
    } else {
      shared.common.createElements(this.progress, 'inner', [{
        attributes: {
          class: 'fa fa-circle-o-notch fa-spin'
        },
        type: 'i'
      }, {
        text: `${message}`,
        type: 'span'
      }]);
      this.progressMessage = this.progress.lastElementChild;
    }
  }

  clearProgress() {
    this.progress.innerHTML = '';
    this.progressMessage = null;
  }

  setOverallProgress(message) {
    this.overallProgress.textContent = message;
  }

  clear() {
    this.progress.innerHTML = '';
    this.progressMessage = null;
    this.overallProgress.textContent = '';
    this.scrollable.innerHTML = '';
  }

  setIcon(icon) {
    this.icon.className = `fa ${icon}`;
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
    if (gSettings.minimizePanel && !this.isOpen) {
      shared.common.minimizePanel_alert(this);
    }
  }

  reposition() {}
}

export { Popup };

