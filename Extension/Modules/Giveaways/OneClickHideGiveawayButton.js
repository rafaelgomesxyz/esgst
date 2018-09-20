_MODULES.push({
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
    load: ochgb,
    name: `One-Click Hide Giveaway Button`,
    sg: true,
    type: `giveaways`
  });

  function ochgb() {
    esgst.giveawayFeatures.push(ochgb_setButton);
  }

  function ochgb_setButton(giveaways, main) {
    giveaways.forEach(giveaway => {
      let button = giveaway.innerWrap.querySelector(`.giveaway__hide, .featured__giveaway__hide`);
      if (!button) return;
      let unhide = button.classList.contains(`fa-eye`);
      if (esgst.giveawayPath && main) {
        button = button.parentElement;
      }
      giveaway.fade = ochgb_fadeGiveaway.bind(null, giveaway, main);
      giveaway.unfade = ochgb_unfadeGiveaway.bind(null, giveaway, main);
      giveaway.ochgbButton = new Button(button, `afterEnd`, {
        callbacks: [ochgb_hideGiveaway.bind(null, giveaway, main), null, ochgb_unhideGiveaway.bind(null, giveaway, main), null],
        className: `esgst-ochgb ${esgst.giveawayPath && main ? `` : `giveaway__icon`}`,
        icons: [`fa-eye-slash esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-eye esgst-clickable`, `fa-circle-o-notch fa-spin`],
        id: `ochgb`,
        index: unhide ? 2 : 0,
        titles: [`Hide all giveaways for this game`, `Hiding giveaways...`, `Unhide all giveaways for this game`, `Unhiding giveaways...`]
      });
      giveaway.ochgbButton.button.setAttribute(`data-draggable-id`, `hideGame`);
      button.remove();
    });
  }

  function ochgb_fadeGiveaway(giveaway, main) {
    if ((esgst.giveawayPath && !main) || !esgst.giveawayPath) {
      giveaway.innerWrap.classList.add(`esgst-faded`);
    }
  }

  function ochgb_unfadeGiveaway(giveaway, main) {
    if ((esgst.giveawayPath && !main) || !esgst.giveawayPath) {
      giveaway.innerWrap.classList.remove(`esgst-faded`);
    }
  }

  async function ochgb_hideGiveaway(giveaway, main) {
    await request({data: `xsrf_token=${esgst.xsrfToken}&do=hide_giveaways_by_game_id&game_id=${giveaway.gameId}`, method: `POST`, url: `/ajax.php`});
    ochgb_completeProcess(giveaway, `fade`, main);
    await updateHiddenGames(giveaway.id, giveaway.type);
    return true;
  }

  async function ochgb_unhideGiveaway(giveaway, main) {
    await request({data: `xsrf_token=${esgst.xsrfToken}&do=remove_filter&game_id=${giveaway.gameId}`, method: `POST`, url: `/ajax.php`});
    ochgb_completeProcess(giveaway, `unfade`, main);
    await updateHiddenGames(giveaway.id, giveaway.type, true);
    return true;
  }

  function ochgb_completeProcess(giveaway, key, main) {
    if (main && esgst.giveawayPath) return;
    let source = main ? `mainGiveaways` : `popupGiveaways`;
    if (esgst.ochgb_f) {
      for (let i = 0, n = esgst[source].length; i < n; i++) {
        if (esgst[source][i].gameId === giveaway.gameId) {
          esgst[source][i][key]();
          if (esgst[source][i] !== giveaway && esgst[source][i].ochgbButton) {
            esgst[source][i].ochgbButton.index = key === `fade` ? 2 : 0;
            esgst[source][i].ochgbButton.change();
          }
        }
      }
    } else {
      for (let i = 0, n = esgst[source].length; i < n; i++) {
        if (esgst[source][i].gameId === giveaway.gameId) {
          esgst[source][i].outerWrap.remove();
        }
      }
    }
  }
  
