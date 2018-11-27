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
      colors: {
        barColor: `Bar Color`,
        projectedBarColor: `Projected Bar Color`,
        barColorHover: `Bar Color (Hover / Account Page)`,
        projectedBarColorHover: `Projected Bar Color (Hover / Account Page)`,
        barColorSelected: `Bar Color (Account Page Hover)`,
        projectedBarColorSelected: `Projected Bar Color (Account Page Hover)`
      },
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
      sync: `Giveaways, No CV Games, Reduced CV Games`,
      syncKeys: [`Giveaways`, `NoCvGames`, `ReducedCvGames`],
      type: `general`
    };
  }

  lpv() {
    if (this.esgst.hr) {
      return;
    }
    this.lpv_setStyle();
    this.joinStyles();
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
    const mainButtonWidth = this.esgst.mainButton.offsetWidth;
    const fullButtonWidth = this.esgst.mainButton.parentElement.offsetWidth;
    const currentProgress = parseInt(currentPercentage * (fullButtonWidth / 100)); // 186px is the width of the button
    const firstBar = `${currentProgress}px`;
    const secondBar = `${Math.max(0, currentProgress - mainButtonWidth)}px`; // 157px is the width of the button without the arrow
    let projectedFirstBar = `0`;
    let projectedSecondBar = `0`;
    const cv = this.lpv_getCv();
    if (cv > 0) {
      // the formula is: current_percentage + (real_cv_to_gain / real_cv_difference),
      // where real_cv_difference is the real CV difference between the next level and the current one
      const prediction = round(currentPercentage + (round(cv) / [0.01, 25, 50, 100, 150, 250, 500, 1000, 1000, 2000][currentBase] * 100));
      const predictedLevel = Math.min(10, round(currentBase + (prediction / 100)));
      console.log(`Final CV calculated: ${cv}`);
      console.log(`Predicted level without difference: ${predictedLevel}`);
      console.log(`Difference: ${cache.difference}`);
      const newLevel = round(predictedLevel - cache.difference);
      console.log(`Final predicted level: ${newLevel}`);
      const newBase = parseInt(newLevel);
      const newPercentage = parseInt(round(newLevel - newBase) * 100);
      const newProgress = parseInt(Math.min(100, newPercentage) * (fullButtonWidth / 100));
      projectedFirstBar = `${newProgress}px`;
      projectedSecondBar = `${Math.max(0, newProgress - mainButtonWidth)}px`;
      this.esgst.levelContainer.title = getFeatureTooltip(`lpv`, `${this.esgst.levelContainer.getAttribute(`title`)} (${newLevel})`);
    }
    const barColor = this.esgst.lpv_barColor;
    const projectedBarColor = this.esgst.lpv_projectedBarColor;
    const barColorHover = this.esgst.lpv_barColorHover;
    const projectedBarColorHover = this.esgst.lpv_projectedBarColorHover;
    const barColorSelected = this.esgst.lpv_barColorSelected;
    const projectedBarColorSelected = this.esgst.lpv_projectedBarColorSelected;
    this.esgst.lpvStyleArray = [{
      selector: `.esgst-lpv-container`,
      rules: [{
        name: `background-image`,
        values: [
          `linear-gradient(to right, ${barColor} ${firstBar}, ${projectedBarColor} ${firstBar}, ${projectedBarColor} ${projectedFirstBar}, transparent ${firstBar})`,
          `var(--esgst-lpv-button, linear-gradient(#8a92a1 0px, #757e8f 8px, #4e5666 100%))`
        ]
      }]
    }, {
      selector: `.esgst-lpv-container .nav__button--is-dropdown:hover`,
      rules: [{
        name: `background-image`,
        values: [
          `linear-gradient(to right, ${barColorHover} ${firstBar}, ${projectedBarColorHover} ${firstBar}, ${projectedBarColorHover} ${projectedFirstBar}, transparent ${firstBar})`,
          `var(--esgst-lpv-button-hover, linear-gradient(#9ba2b0 0px, #8c94a3 8px, #596070 100%))`
        ]
      }]
    }, {
      selector: `.esgst-lpv-container .nav__button--is-dropdown-arrow:hover`,
      rules: [{
        name: `background-image`,
        values: [
          `linear-gradient(to right, ${barColorHover} ${secondBar}, ${projectedBarColorHover} ${secondBar}, ${projectedBarColorHover} ${projectedSecondBar}, transparent ${secondBar})`,
          `var(--esgst-lpv-button-hover, linear-gradient(#9ba2b0 0px, #8c94a3 8px, #596070 100%))`
        ]
      }]
    }, {
      selector: `.esgst-lpv-container .nav__button--is-dropdown-arrow.is-selected`,
      rules: [{
        name: `background-image`,
        values: [
          `linear-gradient(to right, ${barColor} ${secondBar}, ${projectedBarColor} ${secondBar}, ${projectedBarColor} ${projectedSecondBar}, transparent ${secondBar})`,
          `var(--esgst-lpv-arrow, linear-gradient(#4e525f 0px, #434857 5px, #2b2e3a 100%))`
        ]
      }]
    }, {
      selector: `.esgst-lpv-container.is-selected .nav__button--is-dropdown`,
      rules: [{
        name: `background-image`,
        values: [
          `linear-gradient(to right, ${barColorHover} ${firstBar}, ${projectedBarColorHover} ${firstBar}, ${projectedBarColorHover} ${projectedFirstBar}, transparent ${firstBar})`,
          `var(--esgst-lpv-button-selected, linear-gradient(#d0d5de 0px, #c9cdd7 5px, #9097a6 100%))`
        ]
      }]
    }, {
      selector: `.esgst-lpv-container.is-selected .nav__button--is-dropdown-arrow `,
      rules: [{
        name: `background-image`,
        values: [
          `linear-gradient(to right, ${barColorHover} ${secondBar}, ${projectedBarColorHover} ${secondBar}, ${projectedBarColorHover} ${projectedSecondBar}, transparent ${secondBar})`,
          `var(--esgst-lpv-button-selected, linear-gradient(#d0d5de 0px, #c9cdd7 5px, #9097a6 100%)) `
        ]
      }]
    }, {
      selector: `.esgst-lpv-container.is-selected .nav__button--is-dropdown:hover`,
      rules: [{
        name: `background-image`,
        values: [
          `linear-gradient(to right, ${barColorSelected} ${firstBar}, ${projectedBarColorSelected} ${firstBar}, ${projectedBarColorSelected} ${projectedFirstBar}, transparent ${firstBar})`,
          `var(--esgst-lpv-button-selected-hover, linear-gradient(#f0f1f5 0px, #d1d4de 100%)) `
        ]
      }]
    }, {
      selector: `.esgst-lpv-container.is-selected .nav__button--is-dropdown-arrow:hover:not(.is-selected)`,
      rules: [{
        name: `background-image`,
        values: [
          `linear-gradient(to right, ${barColorSelected} ${secondBar}, ${projectedBarColorSelected} ${secondBar}, ${projectedBarColorSelected} ${projectedSecondBar}, transparent ${secondBar})`,
          `var(--esgst-lpv-button-selected-hover, linear-gradient(#f0f1f5 0px, #d1d4de 100%))`
        ]
      }]
    }, {
      selector: `.esgst-lpv-container.is-selected .nav__button--is-dropdown-arrow.is-selected `,
      rules: [{
        name: `background-image`,
        values: [
          `linear-gradient(to right, ${barColorSelected} ${secondBar}, ${projectedBarColorSelected} ${secondBar}, ${projectedBarColorSelected} ${projectedSecondBar}, transparent ${secondBar})`,
          `var(--esgst-lpv-arrow-selected, linear-gradient(#4e525f 0px, #434857 5px, #2b2e3a 100%)) `
        ]
      }]
    }] ;
  }

  joinStyles() {
    let style;
    if (this.esgst.lpvStyleArray) {
      style = JSON.parse(JSON.stringify(this.esgst.lpvStyleArray));
      if (this.esgst.pvStyleArray) {
        for (const [i, item] of style.entries()) {
          for (const [j, rule] of item.rules.entries()) {
            rule.values = rule.values.concat(JSON.parse(JSON.stringify(this.esgst.pvStyleArray[i].rules[j].values)));
          }
          item.rules.push({
            name: `background-position`,
            values: [
              `left top`,
              `left top`,
              `left bottom`,
              `left bottom`
            ]
          }, {
            name: `background-repeat`,
            values: new Array(4).fill(`no-repeat`)
          }, {
            name: `background-size`,
            values: [
              `auto 50%`,
              `0`,
              `auto 50%`,
              `auto`
            ]
          });
        }
      }
    } else if (this.esgst.pvStyleArray) {
      style = JSON.parse(JSON.stringify(this.esgst.pvStyleArray));
    }
    if (!style || !Array.isArray(style)) {
      return;
    }
    let styleString = ``;
    for (const item of style) {
      styleString += `${item.selector} {\n`;
      for (const rule of item.rules) {
        styleString += `  ${rule.name}: ${rule.values.join(`, `)} !important;\n`;
      }
      styleString += `}\n\n`;
    }
    if (!this.esgst.lpvStyle) {
      this.esgst.lpvStyle = createElements(this.esgst.style, `afterEnd`, [{
        attributes: {
          id: `esgst-lpv-style`
        },
        type: `style`
      }]);
    }
    this.esgst.lpvStyle.textContent = styleString;
    this.esgst.mainButton.parentElement.classList.add(`esgst-lpv-container`);
  }

  lpv_getCv() {
    console.log(`Beginning CV calculation...`);
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
              if (cv > 0) {
                console.log(`Adding ${value} CV from :http://store.steampowered.com/${type.slice(0, -1)}/${id}${game && game.name ? ` (${game.name})` : ``}`);
                console.log(`Total CV: ${cv}`);
              }
            }
          } else {
            cv += (value * open);
            if (cv > 0) {
              console.log(`Adding ${value * open} CV from :http://store.steampowered.com/${type.slice(0, -1)}/${id}${game && game.name ? ` (${game.name})` : ``}`);
              console.log(`Total CV: ${cv}`);
            }
          }
        }
      }
    }
    console.log(`CV calculation ended...`);
    return cv;
  }
}

export default GeneralLevelProgressVisualizer;