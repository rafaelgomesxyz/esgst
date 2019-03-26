import { Module } from '../../class/Module';
import { shared } from '../../class/Shared';

class CommentsReplyBoxOnTop extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Moves the reply box over the comments (in any page) so that you do not need to scroll down to the bottom of the page to add a comment.`]
        ]]
      ],
      id: `rbot`,
      load: this.rbot,
      name: `Reply Box On Top`,
      sg: true,
      st: true,
      type: `comments`
    };
  }

  rbot() {
    let element = this.esgst.mainPageHeading;
    if (!this.esgst.replyBox) {
      if (this.esgst.st && this.esgst.userPath) {
        let review = document.getElementsByClassName(`notification yellow`)[0];
        if (!review) return;
        element.parentElement.insertBefore(review, element.nextElementSibling);
      }
      return;
    }
    let box = shared.common.createElements(element, `afterEnd`, [{
      attributes: {
        class: `esgst-rbot`
      },
      type: `div`
    }]);
    box.appendChild(this.esgst.replyBox);
    let button = box.getElementsByClassName(this.esgst.cancelButtonClass)[0];
    if (!button) return;
    button.addEventListener(`click`, () => window.setTimeout(box.appendChild.bind(box, this.esgst.replyBox), 0));
  }
}

const commentsReplyBoxOnTop = new CommentsReplyBoxOnTop();

export { commentsReplyBoxOnTop };