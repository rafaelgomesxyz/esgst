import Module from '../../class/Module';
import ButtonSet from '../../class/ButtonSet';
import Popup from '../../class/Popup';
import {common} from '../Common';

const
  createElements = common.createElements.bind(common),
  saveComment = common.saveComment.bind(common)
;

class CommentsReceivedReplyBoxPopup extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Pops up a reply box when you mark a giveaway as received (in your <a href="https://www.steamgifts.com/giveaways/won">won</a> page) so that you can add a comment thanking the creator.</li>
      </ul>
    `,
      id: `rrbp`,
      load: this.rrbp.bind(this),
      name: `Received Reply Box Popup`,
      sg: true,
      type: `comments`
    };
  }

  rrbp() {
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
    popup = new Popup(`fa-comment`, `Add a comment:`);
    textArea = createElements(popup.scrollable, `beforeEnd`, [{
      type: `textarea`
    }]);
    if (this.esgst.cfh) {
      this.esgst.modules.commentsCommentFormattingHelper.cfh_addPanel(textArea);
    }
    popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-check`, `fa-circle-o-notch fa-spin`, `Save`, `Saving...`, callback => {
      progress.innerHTML = ``;
      saveComment(``, ``, textArea.value, giveaway.url, progress, callback, () => {
        popup.close();
      });
    }).set);
    progress = createElements(popup.description, `beforeEnd`, [{type: `div`}]);
    popup.open(() => {
      textArea.focus();
    });
  }
}

export default CommentsReceivedReplyBoxPopup;