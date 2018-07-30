_MODULES.push({
    description: `
      <ul>
        <li>Adds an icon (<i class="fa fa-star"></i>) next to a game's name (in any page) to indicate that you have entered giveaways for the game in the past. Clicking on the icon unhighlights the game.</li>
        <li>A game is only highlighted if you entered a giveaway for it after this feature was enabled.</li>
      </ul>
    `,
    id: `egh`,
    name: `Entered Game Highlighter`,
    sg: true,
    type: `games`
  });

  async function egh_saveGame(id, type) {
    let games;
    if (id && type) {
      games = JSON.parse(await getValue(`games`));
      if (!games[type][id] || !games[type][id].entered) {
        let deleteLock = await createLock(`gameLock`, 300);
        games = JSON.parse(await getValue(`games`));
        if (!games[type][id]) {
          games[type][id] = {};
        }
        games[type][id].entered = true;
        await setValue(`games`, JSON.stringify(games));
        deleteLock();
      }
    }
  }

  async function egh_unhighlightGame(id, type, event) {
    let icon = event.currentTarget;
    if (icon.classList.contains(`fa-spin`)) return;
    createElements(icon, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    let deleteLock = await createLock(`gameLock`, 300);
    let games = JSON.parse(await getValue(`games`));
    delete games[type][id].entered;
    await setValue(`games`, JSON.stringify(games));
    icon.remove();
    deleteLock();
  }

