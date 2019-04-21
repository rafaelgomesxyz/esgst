import { Module } from '../../class/Module';
import { shared } from '../../class/Shared';

class GamesEnteredGameHighlighter extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds an icon (`,
            [`i`, { class: `fa fa-star` }],
            `) next to a game's name (in any page) to indicate that you have entered giveaways for the game in the past. Clicking on the icon unhighlights the game.`
          ]],
          [`li`, `A game is only highlighted if you entered a giveaway for it after this feature was enabled.`]
        ]]
      ],
      id: `egh`,
      name: `Entered Game Highlighter`,
      sg: true,
      type: `games`,
      featureMap: {
        game: this.egh_getGames.bind(this)
      }
    };
  }

  egh_getGames(games) {
    for (const game of games.all) {
      if (shared.esgst.giveawayPath) {
        const button = document.querySelector(`.sidebar__entry-insert`);
        if (button) {
          button.addEventListener(`click`, this.egh_saveGame.bind(this, game.id, game.type));
        }
      }
      const savedGame = shared.esgst.games[game.type][game.id];
      if (savedGame && savedGame.entered && !game.container.querySelector(`.esgst-egh-button`)) {
        const count = Number(savedGame.entered);
        shared.common.createElements_v2((game.container.closest(`.poll`) && game.container.querySelector(`.table__column__heading`)) || game.headingName, `beforeBegin`, [
          [`a`, { 'data-draggable-id': `egh`, class: `esgst-egh-button esgst-clickable`, title: shared.common.getFeatureTooltip(`egh`, `You have entered ${count} giveaways for this game before. Click to unhighlight it (will restart the counter to 0).`), onclick: this.egh_unhighlightGame.bind(this, game.id, game.type) }, [
            [`i`, { class: `fa fa-star esgst-egh-icon` }, ],
            ` ${count}`
          ]]
        ]);
      }
    }
  }

  async egh_saveGame(id, type) {
    if (!id || !type) {
      return;
    }
    let game = shared.esgst.games[type][id];
    if (!game) {
      game = {};
    }
    if (!game.entered) {
      game.entered = 0;
    }
    game.entered += 1;
    await shared.common.lockAndSaveGames({ [type]: { [id]: game } });
  }

  async egh_unhighlightGame(id, type, event) {
    const icon = event.currentTarget;
    if (icon.classList.contains(`fa-spin`)) {
      return;
    }
    shared.common.createElements_v2(icon, `inner`, [
      [`i`, { class: `fa fa-circle-o-notch fa-spin` }]
    ]);
    let game = shared.esgst.games[type][id];
    if (game && game.entered) {
      game.entered = null;
      await shared.common.lockAndSaveGames({ [type]: { [id]: game } });
    }
    icon.remove();
  }
}

const gamesEnteredGameHighlighter = new GamesEnteredGameHighlighter();

export { gamesEnteredGameHighlighter };