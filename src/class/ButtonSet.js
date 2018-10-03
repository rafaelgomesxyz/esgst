import {container} from '../class/Container';

export default class ButtonSet {
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
    container.common.createElements(this.set, `inner`, [{
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
    }, {
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
        await this.callback1(this.toggle.bind(this));
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
        await this.callback2(this.toggle.bind(this));
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
