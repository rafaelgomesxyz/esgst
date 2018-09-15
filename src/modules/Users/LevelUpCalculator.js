import Module from '../../class/Module';

class UsersLevelUpCalculator extends Module {
info = ({
    description: `
      <ul>
        <li>Adds how much real CV a user needs to level up (calculated using the information from <a href="https://www.steamgifts.com/discussion/XaCbA/">this discussion</a>) to the "Contributor Level" row of their <a href="https://www.steamgifts.com/user/nobody">profile</a> page.</li>
      </ul>
    `,
    id: `luc`,
    load: this.luc,
    name: `Level Up Calculator`,
    sg: true,
    type: `users`
  });

  luc() {
    this.esgst.profileFeatures.push(luc_calculate);
  }

  luc_calculate(profile) {
    let base, lower, upper, value, values;
    base = parseInt(profile.level);
    if (base < 10) {
      values = [0, 0.01, 25.01, 50.01, 100.01, 250.01, 500.01, 1000.01, 2000.01, 3000.01, 5000.01];
      lower = values[base];
      upper = values[base + 1];
      value = Math.round((upper - (lower + ((upper - lower) * (profile.level - base)))) * 100) / 100;
      this.esgst.modules.common.createElements(profile.levelRowRight, `beforeEnd`, [{
        attributes: {
          class: `esgst-luc-value`,
          title: this.esgst.modules.common.getFeatureTooltip(`luc`)
        },
        text: `(~$${value} real CV to level ${base + 1})`,
        type: `span`
      }]);
    }
  }
}

export default UsersLevelUpCalculator;