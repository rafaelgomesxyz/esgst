_MODULES.push({
    description: `
      <ul>
        <li>Disables the enter button of any giveaway if you have hidden the game on SteamGifts so that you do not accidentaly enter it.</li>
      </ul>
    `,
    id: `hgebd`,
    load: hgebd,
    name: `Hidden Game's Enter Button Disabler`,
    sg: true,
    sync: `Hidden Games`,
    type: `giveaways`
  });

  function hgebd() {
    if (!esgst.giveawayPath || document.getElementsByClassName(`table--summary`)[0]) return;
    let hideButton;
    hideButton = document.getElementsByClassName(`featured__giveaway__hide`)[0];
    if (esgst.enterGiveawayButton && !hideButton) {
      let parent = esgst.enterGiveawayButton.parentElement;
      if (esgst.enterGiveawayButton) {
        esgst.enterGiveawayButton.remove();
      }
      createElements(parent, `afterBegin`, [{
        attributes: {
          class: `sidebar__error is-disabled`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa fa-exclamation-circle`
          },
          type: `i`
        }, {
          text: ` Hidden Game`,
          type: `node`
        }]
      }]);
    }
  }

