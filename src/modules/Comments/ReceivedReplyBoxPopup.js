import Module from '../../class/Module';

class CommentsReceivedReplyBoxPopup extends Module {
info = ({
    description: `
      <ul>
        <li>Pops up a reply box when you mark a giveaway as received (in your <a href="https://www.steamgifts.com/giveaways/won">won</a> page) so that you can add a comment thanking the creator.</li>
      </ul>
    `,
    id: `rrbp`,
    load: this.rrbp,
    name: `Received Reply Box Popup`,
    sg: true,
    type: `comments`
  });

  rrbp() {
    if (!this.esgst.wonPath) return;
    this.esgst.giveawayFeatures.push(rrbp_addEvent);
  }

  rrbp_addEvent(giveaways) {
    giveaways.forEach(giveaway => {
      let feedback = giveaway.outerWrap.getElementsByClassName(`table__gift-feedback-awaiting-reply`)[0];
      if (feedback) {
        feedback.addEventListener(`click`, this.rrbp_openPopup.bind(null, giveaway));
      }
    });
  }

  rrbp_openPopup(giveaway) {
    let popup, progress, textArea;
    popup = new Popup(`fa-comment`, `Add a comment:`);
    textArea = this.esgst.modules.common.createElements(popup.scrollable, `beforeEnd`, [{
      type: `textarea`
    }]);
    if (this.esgst.cfh) {
      this.esgst.modules.commentsCommentFormattingHelper.cfh_addPanel(textArea);
    }
    popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-check`, `fa-circle-o-notch fa-spin`, `Save`, `Saving...`, callback => {
      progress.innerHTML = ``;
      this.esgst.modules.common.saveComment(``, ``, textArea.value, giveaway.url, progress, callback, () => {
        popup.close();
      });
    }).set);
    progress = this.esgst.modules.common.createElements(popup.description, `beforeEnd`, [{ type: `div` }]);
    popup.open(() => {
      textArea.focus();
    });
  }
}

export default CommentsReceivedReplyBoxPopup;