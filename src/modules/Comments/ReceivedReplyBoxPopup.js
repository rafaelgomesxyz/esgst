import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { shared } from '../../class/Shared';

class CommentsReceivedReplyBoxPopup extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Pops up a reply box when you mark a giveaway as received (in your `,
            [`a`, { href: `https://www.steamgifts.com/giveaways/won` }, `won`],
            ` page) so that you can add a comment thanking the creator.`
          ]]
        ]]
      ],
      id: `rrbp`,
      name: `Received Reply Box Popup`,
      sg: true,
      type: `comments`
    };
  }

  init() {
    if (!this.esgst.wonPath) return;
    this.esgst.giveawayFeatures.push(this.rrbp_addEvent.bind(this));
  }

  rrbp_addEvent(giveaways) {
    giveaways.forEach(giveaway => {
      let feedback = giveaway.outerWrap.getElementsByClassName(`table__gift-feedback-awaiting-reply`)[0];
      if (feedback) {
        feedback.addEventListener(`click`, this.rrbp_openPopup.bind(this, giveaway));
      }
    });
  }

  rrbp_openPopup(giveaway) {
    let popup, progress, textArea;
    popup = new Popup({ addScrollable: true, icon: `fa-comment`, title: `Add a comment:` });
    textArea = shared.common.createElements(popup.scrollable, `beforeEnd`, [{
      type: `textarea`
    }]);
    if (this.esgst.cfh) {
      this.esgst.modules.commentsCommentFormattingHelper.cfh_addPanel(textArea);
    }
    popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-check`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Save`,
      title2: `Saving...`,
      callback1: async () => {
        progress.innerHTML = ``;
        await shared.common.saveComment(null, ``, ``, textArea.value, giveaway.url, progress);
        popup.close();
      }
    }).set);
    progress = shared.common.createElements(popup.description, `beforeEnd`, [{ type: `div` }]);
    popup.open(() => {
      textArea.focus();
    });
  }
}

const commentsReceivedReplyBoxPopup = new CommentsReceivedReplyBoxPopup();

export { commentsReceivedReplyBoxPopup };