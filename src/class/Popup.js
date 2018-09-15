export default class Popup {
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
