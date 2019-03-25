import { Module } from '../../class/Module';
import { common } from '../Common';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
  ;

class UsersLevelUpCalculator extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds how much real CV a user needs to level up (calculated using the information from `,
            [`a`, { href: `https://www.steamgifts.com/discussion/XaCbA/` }, `this discussion`],
            `) to the "Contributor Level" row of their `,
            [`a`, { href: `https://www.steamgifts.com/user/nobody` }, `profile`],
            ` page.`
          ]]
        ]]
      ],
      features: {
        luc_c: {
          name: `Display current user level.`,
          sg: true
        }
      },
      id: `luc`,
      load: this.luc,
      name: `Level Up Calculator`,
      sg: true,
      type: `users`
    };
  }

  luc() {
    this.esgst.profileFeatures.push(this.luc_calculate.bind(this));
  }

  luc_calculate(profile) {
    let base, lower, upper, value, values;
    base = parseInt(profile.level);
    if (base < 10) {
      values = [0, 0.01, 25.01, 50.01, 100.01, 250.01, 500.01, 1000.01, 2000.01, 3000.01, 5000.01];
      lower = values[base];
      upper = values[base + 1];
      value = Math.round((upper - (lower + ((upper - lower) * (profile.level - base)))) * 100) / 100;
      createElements(profile.levelRowRight, `beforeEnd`, [{
        attributes: {
          class: `esgst-luc-value`,
          title: getFeatureTooltip(`luc`)
        },
        text: `(${this.esgst.luc_c ? `${profile.level} / ` : ``}~$${value} real CV to level ${base + 1})`,
        type: `span`
      }]);
    }
  }
}

const usersLevelUpCalculator = new UsersLevelUpCalculator();

export { usersLevelUpCalculator };