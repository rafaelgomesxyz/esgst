import { Button } from '../../class/Button';
import { Module } from '../../class/Module';
import { common } from '../Common';

const
  request = common.request.bind(common),
  updateHiddenGames = common.updateHiddenGames.bind(common)
  ;

class GiveawaysOneClickHideGiveawayButton extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `When you click on the icon `,
            [`i`, { class: `fa fa-eye-slash` }],
            `  next to a giveaway's game name, the game will be hidden immediately, without any confirmation popup being shown.`
          ]],
        ]]
      ],
      features: {
        ochgb_f: {
          description: [
            [`ul`, [
              [`li`, `With this option enabled, when you hide a game, instead of all of the giveaways for the game being removed from the page, they are simply faded out.`]
            ]]
          ],
          name: `Fade hidden giveaways instead of removing them.`,
          sg: true
        }
      },
      id: `ochgb`,
      load: this.ochgb,
      name: `One-Click Hide Giveaway Button`,
      sg: true,
      type: `giveaways`
    };
  }

  ochgb() {
    this.esgst.giveawayFeatures.push(this.ochgb_setButton.bind(this));
  }

  ochgb_setButton(giveaways, main) {
    giveaways.forEach(giveaway => {
      let button = giveaway.innerWrap.querySelector(`.giveaway__hide, .featured__giveaway__hide`);
      if (!button) return;
      let unhide = button.classList.contains(`fa-eye`);
      if (this.esgst.giveawayPath && main) {
        button = button.parentElement;
      }
      giveaway.fade = this.ochgb_fadeGiveaway.bind(this, giveaway, main);
      giveaway.unfade = this.ochgb_unfadeGiveaway.bind(this, giveaway, main);
      giveaway.ochgbButton = new Button(button, `afterEnd`, {
        callbacks: [this.ochgb_hideGiveaway.bind(this, giveaway, main), null, this.ochgb_unhideGiveaway.bind(this, giveaway, main), null],
        className: `esgst-ochgb ${this.esgst.giveawayPath && main ? `` : `giveaway__icon`}`,
        icons: [`fa-eye-slash esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-eye esgst-clickable`, `fa-circle-o-notch fa-spin`],
        id: `ochgb`,
        index: unhide ? 2 : 0,
        titles: [`Hide all giveaways for this game`, `Hiding giveaways...`, `Unhide all giveaways for this game`, `Unhiding giveaways...`]
      });
      giveaway.ochgbButton.button.setAttribute(`data-draggable-id`, `hideGame`);
      button.remove();
    });
  }

  ochgb_fadeGiveaway(giveaway, main) {
    if ((this.esgst.giveawayPath && !main) || !this.esgst.giveawayPath) {
      giveaway.innerWrap.classList.add(`esgst-faded`);
    }
  }

  ochgb_unfadeGiveaway(giveaway, main) {
    if ((this.esgst.giveawayPath && !main) || !this.esgst.giveawayPath) {
      giveaway.innerWrap.classList.remove(`esgst-faded`);
    }
  }

  async ochgb_hideGiveaway(giveaway, main) {
    await request({
      data: `xsrf_token=${this.esgst.xsrfToken}&do=hide_giveaways_by_game_id&game_id=${giveaway.gameId}`,
      method: `POST`,
      url: `/ajax.php`
    });
    this.ochgb_completeProcess(giveaway, `fade`, main);
    await updateHiddenGames(giveaway.id, giveaway.type);
    return true;
  }

  async ochgb_unhideGiveaway(giveaway, main) {
    await request({
      data: `xsrf_token=${this.esgst.xsrfToken}&do=remove_filter&game_id=${giveaway.gameId}`,
      method: `POST`,
      url: `/ajax.php`
    });
    this.ochgb_completeProcess(giveaway, `unfade`, main);
    await updateHiddenGames(giveaway.id, giveaway.type, true);
    return true;
  }

  ochgb_completeProcess(giveaway, key, main) {
    if (main && this.esgst.giveawayPath) return;
    if (this.esgst.ochgb_f) {
      for (let i = 0, n = this.esgst.currentScope.giveaways.length; i < n; i++) {
        if (this.esgst.currentScope.giveaways[i].gameId === giveaway.gameId) {
          this.esgst.currentScope.giveaways[i][key]();
          if (this.esgst.currentScope.giveaways[i] !== giveaway && this.esgst.currentScope.giveaways[i].ochgbButton) {
            this.esgst.currentScope.giveaways[i].ochgbButton.index = key === `fade` ? 2 : 0;
            // noinspection JSIgnoredPromiseFromCall
            this.esgst.currentScope.giveaways[i].ochgbButton.change();
          }
        }
      }
    } else {
      for (let i = 0, n = this.esgst.currentScope.giveaways.length; i < n; i++) {
        if (this.esgst.currentScope.giveaways[i].gameId === giveaway.gameId) {
          this.esgst.currentScope.giveaways[i].outerWrap.remove();
        }
      }
    }
  }
}

const giveawaysOneClickHideGiveawayButton = new GiveawaysOneClickHideGiveawayButton();

export { giveawaysOneClickHideGiveawayButton };