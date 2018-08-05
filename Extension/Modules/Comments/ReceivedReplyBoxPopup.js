_MODULES.push({
    description: `
      <ul>
        <li>Pops up a reply box when you mark a giveaway as received (in your <a href="https://www.steamgifts.com/giveaways/won">won</a> page) so that you can add a comment thanking the creator.</li>
      </ul>
    `,
    id: `rrbp`,
    load: rrbp,
    name: `Received Reply Box Popup`,
    sg: true,
    type: `comments`
  });

  function rrbp() {
    if (!esgst.wonPath) return;
    esgst.giveawayFeatures.push(rrbp_addEvent);
  }

  function rrbp_addEvent(giveaways) {
    giveaways.forEach(giveaway => {
      let feedback = giveaway.outerWrap.getElementsByClassName(`table__gift-feedback-awaiting-reply`)[0];
      if (feedback) {
        feedback.addEventListener(`click`, rrbp_openPopup.bind(null, giveaway));
      }
    });
  }

  function rrbp_openPopup(giveaway) {
    let popup, progress, textArea;
    popup = new Popup(`fa-comment`, `Add a comment:`);
    textArea = createElements(popup.scrollable, `beforeEnd`, [{
      type: `textarea`
    }]);
    if (esgst.cfh) {
      cfh_addPanel(textArea);
    }
    popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-check`, `fa-circle-o-notch fa-spin`, `Save`, `Saving...`, callback => {
      progress.innerHTML = ``;
      saveComment(``, ``, textArea.value, giveaway.url, progress, callback, () => {
        popup.close();
      });
    }).set);
    progress = createElements(popup.description, `beforeEnd`, [{ type: `div` }]);
    popup.open(() => {
      textArea.focus();
    });
  }

