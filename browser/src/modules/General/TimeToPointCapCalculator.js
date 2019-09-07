import { Module } from '../../class/Module';
import { common } from '../Common';
import { gSettings } from '../../class/Globals';

class GeneralTimeToPointCapCalculator extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', `If you have less than 400P and you hover over the number of points at the header of any page, it shows how much time you have to wait until you have 400P.`]
        ]]
      ],
      features: {
        ttpcc_a: {
          name: `Show time alongside points.`,
          sg: true
        }
      },
      id: 'ttpcc',
      name: `Time To Point Cap Calculator`,
      sg: true,
      type: 'general'
    };
  }

  init() {
    this.update();
    this.esgst.triggerFunctions.onLevelContainerUpdated.push(this.update.bind(this));
  }

  update() {
    if (!this.esgst.pointsContainer || this.esgst.points >= 400) {
      return;
    }
    let nextRefresh = 60 - new Date().getMinutes();
    while (nextRefresh > 15) {
      nextRefresh -= 15;
    }
    const time = this.esgst.modules.giveawaysTimeToEnterCalculator.ttec_getTime(Math.round((nextRefresh + (15 * Math.floor((400 - this.esgst.points) / 6))) * 100) / 100);
    this.esgst.pointsContainer.title = common.getFeatureTooltip('ttpcc', `${time} to 400P`);
    if (gSettings.ttpcc_a) {
      this.esgst.pointsContainer.textContent = `${this.esgst.points}P / ${time} to 400`;
    }
  }
}

const generalTimeToPointCapCalculator = new GeneralTimeToPointCapCalculator();

export { generalTimeToPointCapCalculator };