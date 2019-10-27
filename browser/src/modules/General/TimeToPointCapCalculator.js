import { Module } from '../../class/Module';
import { common } from '../Common';
import { Settings } from '../../class/Settings';
import { EventDispatcher } from '../../class/EventDispatcher';
import { Events } from '../../constants/Events';
import { Session } from '../../class/Session';
import { Shared } from '../../class/Shared';

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
          name: 'Show time alongside points.',
          sg: true
        }
      },
      id: 'ttpcc',
      name: 'Time To Point Cap Calculator',
      sg: true,
      type: 'general'
    };
  }

  init() {
    EventDispatcher.subscribe(Events.POINTS_UPDATED, this.update.bind(this));

    this.update(null, Session.counters.points);
  }

  update(oldPoints, newPoints) {
    if (newPoints >= 400) {
      return;
    }

    let nextRefresh = 60 - new Date().getMinutes();

    while (nextRefresh > 15) {
      nextRefresh -= 15;
    }

    const time = this.esgst.modules.giveawaysTimeToEnterCalculator.ttec_getTime(Math.round((nextRefresh + (15 * Math.floor((400 - newPoints) / 6))) * 100) / 100);

    const pointsNode = Shared.header.buttonContainers['account'].nodes.points;
    pointsNode.textContent = `${newPoints.toLocaleString('en-US')}${Settings.ttpcc_a ? `P / ${time} to 400` : ''}`;
    pointsNode.title = common.getFeatureTooltip('ttpcc', `${time} to 400P`);
  }
}

const generalTimeToPointCapCalculator = new GeneralTimeToPointCapCalculator();

export { generalTimeToPointCapCalculator };