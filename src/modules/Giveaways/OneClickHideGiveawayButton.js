import Module from '../../class/Module';

class GiveawaysOneClickHideGiveawayButton extends Module {
info = ({
    description: `
      <ul>
        <li>When you click on the icon <i class="fa fa-eye-slash"></i> next to a giveaway's game name, the game will be hidden immediately, without any confirmation popup being shown.</li>
      </ul>
    `,
    features: {
      ochgb_f: {
        description: `
          <ul>
            <li>With this option enabled, when you hide a game, instead of all of the giveaways for the game being removed from the page, they are simply faded out.</li>
          </ul>
        `,
        name: `Fade hidden giveaways instead of removing them.`,
        sg: true
      }
    },
    id: `ochgb`,
    load: this.ochgb,
    name: `One-Click Hide Giveaway Button`,
    sg: true,
    type: `giveaways`
  });

  ochgb() {
    this.esgst.giveawayFeatures.push(ochgb_setButton);
  }

  ochgb_setButton(giveaways, main) {
    giveaways.forEach(giveaway => {
      let button = giveaway.innerWrap.querySelector(`.giveaway__hide, .featured__giveaway__hide`);
      if (!button) return;
      let unhide = button.classList.contains(`fa-eye`);
      if (this.esgst.giveawayPath && main) {
        button = button.parentElement;
      }
      giveaway.fade = this.ochgb_fadeGiveaway.bind(null, giveaway, main);
      giveaway.unfade = this.ochgb_unfadeGiveaway.bind(null, giveaway, main);
      giveaway.ochgbButton = new Button(button, `afterEnd`, {
        callbacks: [ochgb_hideGiveaway.bind(null, giveaway, main), null, this.ochgb_unhideGiveaway.bind(null, giveaway, main), null],
        className: `esgst-ochgb ${this.esgst.giveawayPath && main ? `` : `giveaway__icon`}`,
        icons: [`fa-eye-slash esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-eye esgst-clickable`, `fa-circle-o-notch fa-spin`],
        id: `ochgb`,
        index: unhide ? 2 : 0,
        titles: [`Hide all giveaways for this game`, `Hiding giveaways...`, `Unhide all giveaways for this game`, `Unhiding giveaways...`]
      });
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
    await this.esgst.modules.common.request({data: `xsrf_token=${this.esgst.xsrfToken}&do=hide_giveaways_by_game_id&game_id=${giveaway.gameId}`, method: `POST`, url: `/ajax.php`});
    this.ochgb_completeProcess(giveaway, `fade`, main);
    await this.esgst.modules.common.updateHiddenGames(giveaway.id, giveaway.type);
    return true;
  }

  async ochgb_unhideGiveaway(giveaway, main) {
    await this.esgst.modules.common.request({data: `xsrf_token=${this.esgst.xsrfToken}&do=remove_filter&game_id=${giveaway.gameId}`, method: `POST`, url: `/ajax.php`});
    this.ochgb_completeProcess(giveaway, `unfade`, main);
    await this.esgst.modules.common.updateHiddenGames(giveaway.id, giveaway.type, true);
    return true;
  }

  ochgb_completeProcess(giveaway, key, main) {
    if (main && this.esgst.giveawayPath) return;
    let source = main ? `mainGiveaways` : `popupGiveaways`;
    if (this.esgst.ochgb_f) {
      for (let i = 0, n = this.esgst[source].length; i < n; i++) {
        if (this.esgst[source][i].gameId === giveaway.gameId) {
          this.esgst[source][i][key]();
          if (this.esgst[source][i] !== giveaway && this.esgst[source][i].ochgbButton) {
            this.esgst[source][i].ochgbButton.index = key === `fade` ? 2 : 0;
            this.esgst[source][i].ochgbButton.change();
          }
        }
      }
    } else {
      for (let i = 0, n = this.esgst[source].length; i < n; i++) {
        if (this.esgst[source][i].gameId === giveaway.gameId) {
          this.esgst[source][i].outerWrap.remove();
        }
      }
    }
  }
}

export default GiveawaysOneClickHideGiveawayButton;