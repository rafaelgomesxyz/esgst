import Module from '../../class/Module';
import ButtonSet from '../../class/ButtonSet';
import Popup from '../../class/Popup';

class CommentsReplyBoxPopup extends Module {
  info = ({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-comment"></i>) to the main page heading of any page that allows you to add comments to the page through a popup.</li>
        <li>This feature is useful if you have [id=fmph] enabled, which allows you to add comments to the page from any scrolling position.</li>
        <li>Has [id=ded] built-in.</li>
      </ul>
    `,
    id: `rbp`,
    load: this.rbp,
    name: `Reply Box Popup`,
    sg: true,
    st: true,
    type: `comments`
  });

  rbp() {
    if (!this.esgst.replyBox) return;

    let button = this.esgst.modules.common.createHeadingButton({id: `rbp`, icons: [`fa-comment`], title: `Add a comment`});
    let popup = new Popup(`fa-comment`, `Add a comment:`);
    popup.textArea = this.esgst.modules.common.createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        name: `description`
      },
      type: `textarea`
    }]);
    popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-check`, `fa-circle-o-notch fa-spin`, `Save`, `Saving...`, Callback => {
      popup.progress.innerHTML = ``;
      this.esgst.modules.common.saveComment(this.esgst.sg ? `` : document.querySelector(`[name="trade_code"]`).value, ``, popup.textArea.value, this.esgst.sg ? location.href.match(/(.+?)(#.+?)?$/)[1] : `/ajax.php`, popup.progress,
        Callback);
    }).set);
    popup.progress = this.esgst.modules.common.createElements(popup.description, `beforeEnd`, [{ type: `div` }]);
    button.addEventListener(`click`, popup.open.bind(popup, popup.textArea.focus.bind(popup.textArea)));
  }
}

export default CommentsReplyBoxPopup;