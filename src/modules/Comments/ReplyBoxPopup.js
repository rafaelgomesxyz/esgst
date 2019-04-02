import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { shared } from '../../class/Shared';

class CommentsReplyBoxPopup extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-comment` }],
            `) to the main page heading of any page that allows you to add comments to the page through a popup.`
          ]],
          [`li`, `This feature is useful if you have [id=fmph] enabled, which allows you to add comments to the page from any scrolling position.`]
        ]]
      ],
      id: `rbp`,
      name: `Reply Box Popup`,
      sg: true,
      st: true,
      type: `comments`
    };
  }

  init() {
    if (!this.esgst.replyBox) return;

    let button = shared.common.createHeadingButton({ id: `rbp`, icons: [`fa-comment`], title: `Add a comment` });
    let popup = new Popup({ addScrollable: true, icon: `fa-comment`, title: `Add a comment:` });
    popup.textArea = shared.common.createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        name: `description`
      },
      type: `textarea`
    }]);
    popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-check`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Save`,
      title2: `Saving...`,
      callback1: async () => {
        popup.progress.innerHTML = ``;
        await shared.common.saveComment(null, this.esgst.sg ? `` : document.querySelector(`[name="trade_code"]`).value, ``, popup.textArea.value, this.esgst.sg ? shared.esgst.locationHref.match(/(.+?)(#.+?)?$/)[1] : `/ajax.php`, popup.progress, true);

      }
    }).set);
    popup.progress = shared.common.createElements(popup.description, `beforeEnd`, [{ type: `div` }]);
    button.addEventListener(`click`, popup.open.bind(popup, popup.textArea.focus.bind(popup.textArea)));
  }
}

const commentsReplyBoxPopup = new CommentsReplyBoxPopup();

export { commentsReplyBoxPopup };