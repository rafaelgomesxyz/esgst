import Module from '../../class/Module';
import {common} from '../Common';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  getLocalValue = common.getLocalValue.bind(common),
  round = common.round.bind(common),
  setLocalValue = common.setLocalValue.bind(common)
;

class GeneralLevelProgressVisualizer extends Module {
  constructor() {
    super();
    this.info = {
      conflicts: [
        {id: `pv`, name: `Points Visualizer`}
      ],
      description: `
      <ul>
        <li>Displays a green bar in the account button at the header of any page that represents your level progress.</li>
        <li>Also displays a lighter green bar, if you have any giveaways open, to estimate what your level will be when the giveaways are marked as received. If you hover over the account button, it shows the number of the estimated level.</li>
      </ul>
    `,
      id: `lpv`,
      load: this.lpv,
      name: `Level Progress Visualizer`,
      sg: true,
      sync: `Giveaways, Reduced CV Games and No CV Games`,
      type: `general`
    };
  }

  lpv() {
    if (this.esgst.hr) return;
    this.lpv_setStyle();
  }

  lpv_setStyle() {
    const currentLevel = parseFloat(this.esgst.levelContainer.getAttribute(`title`));
    const currentBase = Math.trunc(currentLevel);
    if (currentBase === 10) {
      return;
    }
    let cache = JSON.parse(getLocalValue(`lpvCache`, `{}`));
    if (!cache.level) {
      cache = {
        difference: 0,
        level: currentLevel
      };
    }
    cache.difference += round(currentLevel - cache.level);
    cache.difference = round(cache.difference);
    cache.level = currentLevel;
    setLocalValue(`lpvCache`, JSON.stringify(cache));
    const currentPercentage = parseInt(round(currentLevel - currentBase) * 100);
    const currentProgress = parseInt(currentPercentage * 1.86); // 186px is the width of the button
    const firstBar = `${currentProgress}px`;
    const secondBar = `${Math.max(0, currentProgress - 157)}px`; // 157px is the width of the button without the arrow
    let projectedFirstBar = `0`;
    let projectedSecondBar = `0`;
    const cv = this.lpv_getCv();
    if (cv > 0) {
      // the formula is: current_percentage + (real_cv_to_gain / real_cv_difference),
      // where real_cv_difference is the real CV difference between the next level and the current one
      const prediction = round(currentPercentage + (round(cv) / [0.01, 25, 50, 100, 150, 250, 500, 1000, 1000, 2000][currentBase] * 100));
      const newLevel = round(Math.min(10, round(currentBase + (prediction / 100))) - cache.difference);
      const newBase = parseInt(newLevel);
      const newPercentage = parseInt(round(newLevel - newBase) * 100);
      const newProgress = parseInt(Math.min(100, newPercentage) * 1.86);
      projectedFirstBar = `${newProgress}px`;
      projectedSecondBar = `${Math.max(0, newProgress - 157)}px`;
      this.esgst.levelContainer.title = getFeatureTooltip(`lpv`, `${this.esgst.levelContainer.getAttribute(`title`)} (${newLevel})`);
    }
    if (!this.esgst.lpvStyle) {
      this.esgst.lpvStyle = createElements(this.esgst.style, `afterEnd`, [{
        attributes: {
          id: `esgst-lpv-style`
        },
        type: `style`
      }]);
    }
    this.esgst.lpvStyle.textContent = `
      .esgst-lpv-container {
        background-image: linear-gradient(to right, var(--esgst-lpv-bar, #609f60) ${firstBar}, var(--esgst-lpv-bar-projected, rgba(96, 159, 96, 0.5)) ${firstBar}, var(--esgst-lpv-bar-projected, rgba(96, 159, 96, 0.5)) ${projectedFirstBar}, transparent ${firstBar}), var(--esgst-lpv-button, linear-gradient(#8a92a1 0px, #757e8f 8px, #4e5666 100%)) !important;
      }
      .esgst-lpv-container .nav__button--is-dropdown:hover {
        background-image: linear-gradient(to right, var(--esgst-lpv-bar-hover, #6dac6d) ${firstBar}, var(--esgst-lpv-bar-hover-projected, rgba(122, 185, 122, 0.5)) ${firstBar}, var(--esgst-lpv-bar-hover-projected, rgba(122, 185, 122, 0.5)) ${projectedFirstBar}, transparent ${firstBar}), var(--esgst-lpv-button-hover, linear-gradient(#9ba2b0 0px, #8c94a3 8px, #596070 100%)) !important;
      }
      .esgst-lpv-container .nav__button--is-dropdown-arrow:hover {
        background-image: linear-gradient(to right, var(--esgst-lpv-bar-hover, #6dac6d) ${secondBar}, var(--esgst-lpv-bar-hover-projected, rgba(122, 185, 122, 0.5)) ${secondBar}, var(--esgst-lpv-bar-hover-projected, rgba(122, 185, 122, 0.5)) ${projectedSecondBar}, transparent ${secondBar}), var(--esgst-lpv-button-hover, linear-gradient(#9ba2b0 0px, #8c94a3 8px, #596070 100%)) !important;
      }
      .esgst-lpv-container .nav__button--is-dropdown-arrow.is-selected {
        background-image: linear-gradient(to right, var(--esgst-lpv-bar, #609f60) ${secondBar}, var(--esgst-lpv-bar-projected, rgba(96, 159, 96, 0.5)) ${secondBar}, var(--esgst-lpv-bar-projected, rgba(96, 159, 96, 0.5)) ${projectedSecondBar}, transparent ${secondBar}), var(--esgst-lpv-arrow, linear-gradient(#4e525f 0px, #434857 5px, #2b2e3a 100%)) !important;
      }
      .esgst-lpv-container.is-selected .nav__button--is-dropdown {
        background-image: linear-gradient(to right, var(--esgst-lpv-bar-hover, #6dac6d) ${firstBar}, var(--esgst-lpv-bar-hover-projected, rgba(122, 185, 122, 0.5)) ${firstBar}, var(--esgst-lpv-bar-hover-projected, rgba(122, 185, 122, 0.5)) ${projectedFirstBar}, transparent ${firstBar}), var(--esgst-lpv-button-selected, linear-gradient(#d0d5de 0px, #c9cdd7 5px, #9097a6 100%)) !important;
      }
      .esgst-lpv-container.is-selected .nav__button--is-dropdown-arrow {
        background-image: linear-gradient(to right, var(--esgst-lpv-bar-hover, #6dac6d) ${secondBar}, var(--esgst-lpv-bar-hover-projected, rgba(122, 185, 122, 0.5)) ${secondBar}, var(--esgst-lpv-bar-hover-projected, rgba(122, 185, 122, 0.5)) ${projectedSecondBar}, transparent ${secondBar}), var(--esgst-lpv-button-selected, linear-gradient(#d0d5de 0px, #c9cdd7 5px, #9097a6 100%)) !important;
      }
      .esgst-lpv-container.is-selected .nav__button--is-dropdown:hover {
        background-image: linear-gradient(to right, var(--esgst-lpv-bar-selected, #7ab97a) ${firstBar}, var(--esgst-lpv-bar-selected-projected, rgba(147, 210, 147, 0.5)) ${firstBar}, var(--esgst-lpv-bar-selected-projected, rgba(147, 210, 147, 0.5)) ${projectedFirstBar}, transparent ${firstBar}), var(--esgst-lpv-button-selected-hover, linear-gradient(#f0f1f5 0px, #d1d4de 100%)) !important;
      }
      .esgst-lpv-container.is-selected .nav__button--is-dropdown-arrow:hover:not(.is-selected) {
        background-image: linear-gradient(to right, var(--esgst-lpv-bar-selected, #7ab97a) ${secondBar}, var(--esgst-lpv-bar-selected-projected, rgba(147, 210, 147, 0.5)) ${secondBar}, var(--esgst-lpv-bar-selected-projected, rgba(147, 210, 147, 0.5)) ${projectedSecondBar}, transparent ${secondBar}), var(--esgst-lpv-button-selected-hover, linear-gradient(#f0f1f5 0px, #d1d4de 100%)) !important;
      }
      .esgst-lpv-container.is-selected .nav__button--is-dropdown-arrow.is-selected {
        background-image: linear-gradient(to right, var(--esgst-lpv-bar-selected, #7ab97a) ${secondBar}, var(--esgst-lpv-bar-selected-projected, rgba(147, 210, 147, 0.5)) ${secondBar}, var(--esgst-lpv-bar-selected-projected, rgba(147, 210, 147, 0.5)) ${projectedSecondBar}, transparent ${secondBar}), var(--esgst-lpv-arrow-selected, linear-gradient(#4e525f 0px, #434857 5px, #2b2e3a 100%)) !important;
      }
    `;
    this.esgst.mainButton.parentElement.classList.add(`esgst-lpv-container`);
  }

  lpv_getCv() {
    let cv = 0;
    const user = this.esgst.users.users[this.esgst.steamId];
    if (!user) {
      return cv;
    }
    const giveaways = user.giveaways;
    if (!giveaways) {
      return cv;
    }
    const currentTime = Date.now();
    for (const type of [`apps`, `subs`]) {
      const items = giveaways.sent[type];
      for (const id in items) {
        if (items.hasOwnProperty(id)) {
          let open = 0;
          let sent = 0;
          let value = 0;
          for (const code of items[id]) {
            const giveaway = this.esgst.giveaways[code];
            if (!giveaway) {
              continue;
            }
            value = giveaway.points;
            if (currentTime < giveaway.endTime || !giveaway.started) {
              // giveaway is open or has not started yet
              open += giveaway.copies;
            } else {
              // giveaway is closed
              if (giveaway.entries >= 5 || (!giveaway.inviteOnly && !giveaway.group && !giveaway.whitelist)) {
                // giveaway counts for cv
                if (Array.isArray(giveaway.winners)) {
                  // user is using the new database, which is more accurate
                  for (const winner of giveaway.winners) {
                    if (winner.status === `Received`) {
                      sent += 1;
                    }
                  }
                } else if (giveaway.winners > 0) {
                  // user is using the old database, not very accurate
                  sent += Math.min(giveaway.entries, giveaway.winners);
                }
              }
            }
          }
          const game = this.esgst.games[type][id];
          if (game) {
            if (game.noCV) {
              // game gives no cv
              value = 0;
            } else if (game.reducedCV) {
              // game gives reduced cv (15% of the value)
              value *= 0.15;
            }
          }
          if (sent > 5 || sent + open > 5) {
            // after 5 copies each next copy is worth only 90% of the previous value
            for (let i = sent - 5; i > 0; i--) {
              value *= 0.90;
            }
            for (let i = open; i > 0; i--) {
              value *= 0.90;
              cv += value;
            }
          } else {
            cv += (value * open);
          }
        }
      }
    }
    return cv;
  }
}

export default GeneralLevelProgressVisualizer;