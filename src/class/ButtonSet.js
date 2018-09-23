import {common} from '../modules/Common';

const
  {
    createElements
  } = common
;

export default class ButtonSet {
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
