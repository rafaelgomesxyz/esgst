import { Module } from '../../class/Module';
import { common } from '../Common';
import { shared } from '../../class/Shared';
import { utils } from '../../lib/jsUtils';
import { gSettings } from '../../class/Globals';

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
      description: [
        [`ul`, [
          [`li`, `Displays a green bar in the account button at the header of any page that represents your level progress.`],
          [`li`, `Also displays a lighter green bar, if you have any giveaways open, to estimate what your level will be when the giveaways are marked as received. If you hover over the account button, it shows the number of the estimated level.`]
        ]]
      ],
      id: `lpv`,
      name: `Level Progress Visualizer`,
      sg: true,
      sync: `Giveaways, No CV Games, Reduced CV Games`,
      syncKeys: [`Giveaways`, `NoCvGames`, `ReducedCvGames`],
      type: `general`
    };
  }

  async init() {
    if (gSettings.hr) {
      return;
    }
    await this.lpv_setStyle();
    this.joinStyles();
  }

  async getCache() {
    const cache = JSON.parse(shared.common.getLocalValue(`lpvCache_v2`, `{ "cv": 0, "difference": 0, "level": 0 }`));
    const currentLevel = parseFloat(shared.esgst.levelContainer.getAttribute(`title`));
    if (currentLevel !== cache.level) {
      cache.level = currentLevel;
      const response = await shared.common.request({ method: `GET`, url: `/user/${gSettings.username}` });
      const dom = utils.parseHtml(response.responseText);
      const element = dom.querySelectorAll(`.featured__table__row__right`)[6];
      const oldCv = cache.cv;
      cache.cv = shared.common.round(parseFloat(JSON.parse(element.firstElementChild.lastElementChild.getAttribute(`data-ui-tooltip`)).rows[0].columns[1].name.replace(/[$,]/g, ``)));
      if (oldCv > 0) {
        const difference = shared.common.round(cache.cv - oldCv);
        if (difference > 0) {
          cache.difference += difference;
        }
      }
      shared.common.setLocalValue(`lpvCache_v2`, JSON.stringify(cache));
    }
    return cache;
  }

  async lpv_setStyle() {
    if (shared.esgst.level === 10) {
      return;
    }
    const mainButtonWidth = this.esgst.mainButton.offsetWidth;
    const fullButtonWidth = this.esgst.mainButton.parentElement.offsetWidth;
    const currentPercentage = Math.trunc(round(shared.esgst.fullLevel - shared.esgst.level) * 100);
    const currentProgress = Math.trunc(currentPercentage * (fullButtonWidth / 100));
    const firstBar = `${currentProgress}px`;
    const secondBar = `${Math.max(0, currentProgress - mainButtonWidth)}px`;
    let projectedFirstBar = `0`;
    let projectedSecondBar = `0`;
    const cache = await this.getCache();
    const cv = this.lpv_getCv();
    if (cv > 0) {
      const predictedFullLevel = shared.common.getLevelFromCv((cache.cv + cv) - cache.difference);
      window.console.log(`Current CV: ${cache.cv}`);
      window.console.log(`Final CV calculated: ${cv}`);
      window.console.log(`CV difference: ${cache.difference}`);
      window.console.log(`Predicted level: ${predictedFullLevel}`);
      const predictedLevel = Math.trunc(predictedFullLevel);
      const predictedPercentage = Math.trunc(round(predictedFullLevel - predictedLevel) * 100);
      const predictedProgress = Math.trunc(Math.min(100, predictedPercentage) * (fullButtonWidth / 100));
      projectedFirstBar = `${predictedProgress}px`;
      projectedSecondBar = `${Math.max(0, predictedProgress - mainButtonWidth)}px`;
      this.esgst.levelContainer.title = getFeatureTooltip(`lpv`, `${this.esgst.levelContainer.getAttribute(`title`)} (${predictedFullLevel})`);
    }
    const barColor = gSettings.lpv_barColor;
    const projectedBarColor = gSettings.lpv_projectedBarColor;
    const barColorHover = gSettings.lpv_barColorHover;
    const projectedBarColorHover = gSettings.lpv_projectedBarColorHover;
    const barColorSelected = gSettings.lpv_barColorSelected;
    const projectedBarColorSelected = gSettings.lpv_projectedBarColorSelected;
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
    }];
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
    window.console.log(`Beginning CV calculation...`);
    let cv = 0;
    const user = this.esgst.users.users[gSettings.steamId];
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
              window.console.log(`Could not find giveaway ${code}...`);
              continue;
            }
            value = giveaway.points;
            if (currentTime < giveaway.endTime || !giveaway.started) {
              // giveaway is open or has not started yet
              open += giveaway.copies;
            } else {
              // giveaway is closed
              if (Array.isArray(giveaway.winners)) {
                // user is using the new database, which is more accurate
                if (giveaway.winners.length > 0) {
                  for (const winner of giveaway.winners) {
                    if (winner.status === `Received`) {                      
                      if (giveaway.entries >= 5 || (!giveaway.inviteOnly && !giveaway.group && !giveaway.whitelist)) {
                        // giveaway counts for cv
                        sent += 1;
                      }
                    } else if (winner.status === `Awaiting Feedback`) {
                      open += 1;
                    }
                  }
                } else if (giveaway.entries > 0) {
                  open += giveaway.copies;
                }
              } else if (giveaway.winners > 0) {
                // user is using the old database, not very accurate
                window.console.log(`Old database no longer supported, contact the developer.`);
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
          if (sent > 5 || (sent + open) > 5) {
            // after 5 copies each next copy is worth only 90% of the previous value
            for (let i = sent - 5; i > 0; i--) {
              value *= 0.90;
            }
            let realValue = 0;
            for (let i = open; i > 0; i--) {
              value *= 0.90;
              realValue += value;
            }
            if (realValue > 0) {
              cv += realValue;
              window.console.log(`Adding ${realValue} CV from :http://store.steampowered.com/${type.slice(0, -1)}/${id}${game && game.name ? ` (${game.name})` : ``}`);
              window.console.log(`Total CV: ${cv}`);
            }
          } else if (open > 0) {
            value *= open;
            if (value > 0) {
              cv += value;
              window.console.log(`Adding ${value} CV from :http://store.steampowered.com/${type.slice(0, -1)}/${id}${game && game.name ? ` (${game.name})` : ``}`);
              window.console.log(`Total CV: ${cv}`);
            }
          }
        }
      }
    }
    window.console.log(`CV calculation ended...`);
    return cv;
  }
}

const generalLevelProgressVisualizer = new GeneralLevelProgressVisualizer();

export { generalLevelProgressVisualizer };