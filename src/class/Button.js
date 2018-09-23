import {common} from '../modules/Common';

const
  {
    createElements,
    getFeatureTooltip
  } = common
;

export default class Button {
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
    // noinspection JSIgnoredPromiseFromCall
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
        // noinspection JSIgnoredPromiseFromCall
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
