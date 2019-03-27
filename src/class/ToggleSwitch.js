import { shared } from './Shared';

class ToggleSwitch {
  /**
   * @param context
   * @param id
   * @param inline
   * @param name
   * @param sg
   * @param st
   * @param tooltip
   * @param value
   * @property {HTMLElement} input
   */
  constructor(context, id, inline, name, sg, st, tooltip, value) {
    this.onChange = undefined;
    this.onEnabled = null;
    this.onDisabled = null;
    this.dependencies = [];
    this.exclusions = [];
    this.id = id;
    this.sg = sg;
    this.st = st;
    this.value = value;
    this.container = shared.common.createElements(context, `beforeEnd`, [{
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
    this.input = /** @type {HTMLElement} */ this.switch.firstElementChild;
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
      let setting = shared.esgst.settings[key];
      if (typeof setting === `undefined` || !setting.include) {
        setting = this.value;
      } else {
        setting.enabled = this.value ? 1 : 0;
      }
      shared.esgst.settings[key] = setting;
      shared.esgst[this.id] = this.value;
      if (!settings) {
        let message = shared.common.createElements(this.container, `beforeEnd`, [{
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
        await shared.common.setSetting(key, setting);
        message.classList.add(`esgst-green`);
        shared.common.createElements(message, `inner`, [{
          attributes: {
            class: `fa fa-check`,
            title: `Saved!`
          },
          type: `i`
        }]);
        window.setTimeout(() => message.remove(), 2500);
      }
    }
    if (settings) {
      return;
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
    if (this.onChange) {
      this.onChange(this.value);
    }
  }

  enable(settings) {
    this.input.checked = true;
    // noinspection JSIgnoredPromiseFromCall
    this.change(settings);
  }

  disable(settings) {
    this.input.checked = false;
    // noinspection JSIgnoredPromiseFromCall
    this.change(settings);
  }

  toggle(settings) {
    this.input.checked = !this.input.checked;
    // noinspection JSIgnoredPromiseFromCall
    this.change(settings);
  }
}

export { ToggleSwitch };

