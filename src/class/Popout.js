import {container} from '../class/Container';

export default class Popout {
  constructor(className = ``, context = null, hoverSpeed = 1000, onClick = false, popout = null, onOpen = null) {
    this.onClose = null;
    this.onOpen = onOpen;
    this.context = context;
    this.popout = popout || container.common.createElements(document.body, `beforeEnd`, [{
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
        const element = /** @type {Node} */ event.target;
        if (this.context && !this.context.contains(element) && !this.popout.contains(element) && (className !== `esgst-qiv-popout` || !element.closest(`.esgst-popout`))) {
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
        const element = /** @type {Node} */ event.target;
        if (this.context && !this.context.contains(element) && !this.popout.contains(element)) {
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
    if (container.esgst.openPopups > 0) {
      const highestN = parseInt(container.esgst.popups[container.esgst.openPopups - 1].popup.style.zIndex || 0);
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
    if (container.esgst.qiv && container.esgst.qiv.popout === this && container.esgst.qiv.comments) {
      container.esgst.qiv.comments.style.maxHeight = `${newHeight - container.esgst.qiv.comments.offsetTop}px`;
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
      this.popout.style.top = `${(contextTop - popoutHeight + (this.isFixed || this.popup ? 0 : scrollY)) - (this.popup ? popupRect.top : 0)}px`;
    } else {
      this.popout.style.top = `${(contextTop + contextRect.height + (this.isFixed || this.popup ? 0 : scrollY)) - (this.popup ? popupRect.top : 0)}px`;
    }
  }
}
