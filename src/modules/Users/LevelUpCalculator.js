import { Module } from '../../class/Module';
import { common } from '../Common';
import { shared } from '../../class/Shared';

class UsersLevelUpCalculator extends Module {
  constructor() {
    super();
    this.info = {
      description: `Show how much real CV a user needs to level up.`,
      features: {
        luc_c: {
          name: `Display current user level.`,
          sg: true
        }
      },
      guideSteps: [
        [`.esgst-luc-value`, `Here is how much this user needs to send (in real CV) to reach the next level. This value is calculated using the values mentioned <a class="table__column__secondary-link" href="https://www.steamgifts.com/discussion/XaCbA/">this discussion</a>.`],
        [``, `And that's it!`]
      ],
      guideUrl: `https://www.steamgifts.com/user/nobody`,
      id: `luc`,
      name: `Level Up Calculator`,
      sg: true,
      type: `users`,
      featureMap: {
        profile: this.luc_calculate.bind(this)
      }
    };
  }

  luc_calculate(profile) {
    for (const [index, value] of shared.esgst.cvLevels.entries()) {
      if (profile.realSentCV < value) {
        shared.common.createElements_v2(profile.levelRowRight, `beforeEnd`, [
          [`span`, { class: `esgst-luc-value`, title: shared.common.getFeatureTooltip(`luc`) }, `(${this.esgst.luc_c ? `${profile.level} / ` : ``}~$${shared.common.round(value - profile.realSentCV)} real CV to level ${index})`]
        ]);
        break;
      }
    }
  }
}

const usersLevelUpCalculator = new UsersLevelUpCalculator();

export { usersLevelUpCalculator };