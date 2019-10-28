import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';

class CommentsReceivedReplyBoxPopup extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            `Pops up a reply box when you mark a giveaway as received (in your `,
            ['a', { href: `https://www.steamgifts.com/giveaways/won` }, 'won'],
            ` page) so that you can add a comment thanking the creator.`
          ]]
        ]]
      ],
      id: 'rrbp',
      name: 'Received Reply Box Popup',
      sg: true,
      type: 'comments'
    };
  }

  init() {
    if (!Shared.esgst.wonPath) return;
    Shared.esgst.giveawayFeatures.push(this.rrbp_addEvent.bind(this));
  }

  rrbp_addEvent(giveaways) {
    giveaways.forEach(giveaway => {
      let feedback = giveaway.outerWrap.getElementsByClassName('table__gift-feedback-awaiting-reply')[0];
      if (feedback) {
        feedback.addEventListener('click', this.rrbp_openPopup.bind(this, giveaway));
      }
    });
  }

  rrbp_openPopup(giveaway) {
    let popup, progress, textArea;
    popup = new Popup({ addScrollable: true, icon: 'fa-comment', title: `Add a comment:` });
    textArea = Shared.common.createElements(popup.scrollable, 'beforeEnd', [{
      type: 'textarea'
    }]);
    if (Settings.cfh) {
      Shared.esgst.modules.commentsCommentFormattingHelper.cfh_addPanel(textArea);
    }
    popup.description.appendChild(new ButtonSet({
      color1: 'green',
      color2: 'grey',
      icon1: 'fa-check',
      icon2: 'fa-circle-o-notch fa-spin',
      title1: 'Save',
      title2: 'Saving...',
      callback1: async () => {
        progress.innerHTML = '';
        await Shared.common.saveComment(null, '', '', textArea.value, giveaway.url, progress);
        popup.close();
      }
    }).set);
    progress = Shared.common.createElements(popup.description, 'beforeEnd', [{ type: 'div' }]);
    popup.open(() => {
      textArea.focus();
    });
  }
}

const commentsReceivedReplyBoxPopup = new CommentsReceivedReplyBoxPopup();

export { commentsReceivedReplyBoxPopup };