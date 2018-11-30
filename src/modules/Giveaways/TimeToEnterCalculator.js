import Module from '../../class/Module';
import { common } from '../Common';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
  ;

class GiveawaysTimeToEnterCalculator extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds an element (`,
            [`i`, { class: `fa fa-clock-o` }],
            ` [Time]) below the start time of a giveaway that you do not have enough points to enter(in any page) that shows how much time you have to wait until you have enough points to enter the giveaway.`
          ]],
          [`li`, `The time is calculated by rounding up the result (which is in milliseconds) of the following formula: next_refresh_in_milliseconds + (15 * ⌊(number_of_points_to_enter - number_of_points_you_have) / 6⌋), where next_refresh_in_milliseconds = the time that the next point refresh will happen (you get 6 points every 15 minutes of the hour on SteamGifts, so if it is currently 12:10pm, the next refresh will be at 12:15pm)`],
          [`li`, `You can move the element around by dragging and dropping it.`]
        ]]
      ],
      id: `ttec`,
      load: this.ttec,
      name: `Time To Enter Calculator`,
      sg: true,
      type: `giveaways`
    };
  }

  ttec() {
    this.esgst.giveawayFeatures.push(this.ttec_calculateTime.bind(this));
  }

  ttec_calculateTime(giveaways, main, source) {
    let nextRefresh;
    if (!main || (!this.esgst.createdPath && !this.esgst.enteredPath && !this.esgst.wonPath && !this.esgst.newGiveawayPath)) {
      nextRefresh = 60 - new Date().getMinutes();
      while (nextRefresh > 15) {
        nextRefresh -= 15;
      }
      giveaways.forEach(giveaway => {
        if (!giveaway.ended && !giveaway.entered && giveaway.points > this.esgst.points) {
          if (!giveaway.ttec) {
            giveaway.ttec = createElements(giveaway.panel, (this.esgst.gv && ((main && this.esgst.giveawaysPath) || (source === `gb` && this.esgst.gv_gb) || (source === `ged` && this.esgst.gv_ged) || (source === `ge` && this.esgst.gv_ge))) ? `beforeEnd` : `afterBegin`, [{
              attributes: {
                class: `${this.esgst.giveawayPath ? `featured__column` : ``} esgst-ttec`,
                [`data-draggable-id`]: `ttec`,
                title: getFeatureTooltip(`ttec`, `Time to wait until you have enough points to enter this giveaway`)
              },
              type: `div`
            }]);
          }
          giveaway.ttec.classList.remove(`esgst-hidden`);
          createElements(giveaway.ttec, `inner`, [{
            attributes: {
              class: `fa fa-clock-o`
            },
            type: `i`
          }, {
            text: ` ${this.ttec_getTime(Math.round((nextRefresh + (15 * Math.floor((giveaway.points - this.esgst.points) / 6))) * 100) / 100)}`,
            type: `node`
          }]);
        } else if (giveaway.ttec) {
          giveaway.ttec.classList.add(`esgst-hidden`);
        }
      });
    }
  }

  ttec_getTime(m) {
    let d, h, w;
    h = Math.round(m / 60 * 10) / 10;
    if (Math.floor(h) > 0) {
      d = Math.round(m / 60 / 24 * 10) / 10;
      if (Math.floor(d) > 0) {
        w = Math.round(d / 60 / 24 / 7 * 10) / 10;
        if (Math.floor(w) > 0) {
          return `${w}w`;
        } else {
          return `${d}d`;
        }
      } else {
        return `${h}h`;
      }
    } else {
      return `${m}m`;
    }
  }
}

export default GiveawaysTimeToEnterCalculator;