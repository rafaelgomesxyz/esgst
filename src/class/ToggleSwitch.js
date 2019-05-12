import { shared } from './Shared';
import { gSettings } from './Globals';

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
    this.container = shared.common.createElements_v2(context, `beforeEnd`, [
      [`div`, { class: `esgst-toggle-switch-container ${inline ? `inline` : ``}` }, [
        [`label`, { class: `esgst-toggle-switch` }, [
          [`input`, { type: `checkbox` }],
          [`div`, { class: `esgst-toggle-switch-slider` }]
        ]],
        [`span`, name],
        tooltip 
          ? [`i`, { class: `fa fa-question-circle`, title: tooltip }]
          : null
      ]]
    ]);
    this.switch = context ? this.container.firstElementChild : this.container.firstElementChild.firstElementChild;
    this.input = /** @type {HTMLElement} */ this.switch.firstElementChild;
    this.name = this.switch.nextElementSibling;
    this.input.checked = this.value;
    this.input.addEventListener(`change`, () => this.change());
  }

  async change(settings) {
    let setting;
    this.value = this.input.checked;
    if (this.id) {
      let key = this.id;
      if (this.sg) {
        key += `_sg`;
      } else if (this.st) {
        key += `_st`;
      }
      setting = gSettings[key];
      if (typeof setting === `undefined` || !setting.include) {
        setting = this.value;
      } else {
        setting.enabled = this.value ? 1 : 0;
      }
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
    if (this.value) {
      this.dependencies.forEach(dependency => dependency.classList.remove(`esgst-hidden`));
      this.exclusions.forEach(exclusion => exclusion.classList.add(`esgst-hidden`));
      if (!settings && this.onEnabled) {
        this.onEnabled();
      }
    } else {
      this.dependencies.forEach(dependency => dependency.classList.add(`esgst-hidden`));
      this.exclusions.forEach(exclusion => exclusion.classList.remove(`esgst-hidden`));
      if (!settings && this.onDisabled) {
        this.onDisabled();
      }
    }
    if (settings) {
      return setting;
    }
    if (this.onChange) {
      this.onChange(this.value);
    }
  }

  enable(settings) {
    this.input.checked = true;
    // noinspection JSIgnoredPromiseFromCall
    return this.change(settings);
  }

  disable(settings) {
    this.input.checked = false;
    // noinspection JSIgnoredPromiseFromCall
    return this.change(settings);
  }

  toggle(settings) {
    this.input.checked = !this.input.checked;
    // noinspection JSIgnoredPromiseFromCall
    return this.change(settings);
  }
}

export { ToggleSwitch };

