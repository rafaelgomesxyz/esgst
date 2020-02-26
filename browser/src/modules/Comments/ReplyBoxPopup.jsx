import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { Shared } from '../../class/Shared';
import { DOM } from '../../class/DOM';

class CommentsReplyBoxPopup extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            `Adds a button (`,
            ['i', { class: 'fa fa-comment' }],
            `) to the main page heading of any page that allows you to add comments to the page through a popup.`
          ]],
          ['li', `This feature is useful if you have [id=fmph] enabled, which allows you to add comments to the page from any scrolling position.`]
        ]]
      ],
      id: 'rbp',
      name: 'Reply Box Popup',
      sg: true,
      st: true,
      type: 'comments'
    };
  }

  init() {
    if (!Shared.esgst.replyBox) return;

    let button = Shared.common.createHeadingButton({ id: 'rbp', icons: ['fa-comment'], title: 'Add a comment' });
    let popup = new Popup({ addScrollable: true, icon: 'fa-comment', title: `Add a comment:` });
    popup.textArea = DOM.insert(popup.scrollable, 'beforeEnd', (
      <textarea name="description"></textarea>
    ));
    popup.description.appendChild(new ButtonSet({
      color1: 'green',
      color2: 'grey',
      icon1: 'fa-check',
      icon2: 'fa-circle-o-notch fa-spin',
      title1: 'Save',
      title2: 'Saving...',
      callback1: async () => {
        popup.progress.innerHTML = '';
        await Shared.common.saveComment(null, Shared.esgst.sg ? '' : document.querySelector(`[name="trade_code"]`).value, '', popup.textArea.value, Shared.esgst.sg ? Shared.esgst.locationHref.match(/(.+?)(#.+?)?$/)[1] : '/ajax.php', popup.progress, true);

      }
    }).set);
    popup.progress = DOM.insert(popup.description, 'beforeEnd', <div/>);
    button.addEventListener('click', popup.open.bind(popup, popup.textArea.focus.bind(popup.textArea)));
  }
}

const commentsReplyBoxPopup = new CommentsReplyBoxPopup();

export { commentsReplyBoxPopup };