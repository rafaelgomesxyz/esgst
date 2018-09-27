import Module from '../../class/Module';
import ButtonSet_v2 from '../../class/ButtonSet_v2';
import {utils} from '../../lib/jsUtils';
import {common} from '../Common';

const
  parseHtml = utils.parseHtml.bind(utils),
  createElements = common.createElements.bind(common),
  endless_load = common.endless_load.bind(common),
  request = common.request.bind(common),
  saveComment = common.saveComment.bind(common)
;

class DiscussionsDiscussionEditDetector extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Replaces SteamGifts' native comment box (in any page) with a comment box that ensures that any comment you submit is actually submitted.</li>
        <li>This fixes a (unfortunately) very well-known bug on SteamGifts that does not submit a comment to a discussion if during the timeframe between the moment when you started to write it and the moment when you submitted it the title of the discussion title was edited.</li>
      </ul>
    `,
      id: `ded`,
      load: this.ded.bind(this),
      name: `Discussion Edit Detector`,
      sg: true,
      st: true,
      type: `discussions`
    };
  }

  ded() {
    if (this.esgst.replyBox && !this.esgst.userPath) {
      this.ded_addButton(this.esgst.replyBox);
    }
  }

  /**
   * @param context
   * @param [commentUrl]
   * @param [callback]
   */
  ded_addButton(context, commentUrl, callback) {
    const obj = {
      callback,
      checked: false,
      commentUrl,
      context: context.parentElement,
      description: context.querySelector(`[name="description"]`),
      parentId: context.querySelector(`[name="parent_id"]`),
      tradeCode: (context.querySelector(`[name="trade_code"]`) || {value: ``}).value,
      url: this.esgst.sg ? location.href.match(/(.+?)(#.+?)?$/)[1] : `/ajax.php`
    };
    const container = context.getElementsByClassName(this.esgst.sg
      ? `align-button-container`
      : `btn_actions`
    )[0];
    container.firstElementChild.remove();
    obj.button = createElements(container, `afterBegin`, [{
      attributes: {
        class: `esgst-ded-button`
      },
      type: `div`
    }]);
    obj.status = createElements(container, `beforeEnd`, [{
      attributes: {
        class: `comment__actions action_list esgst-ded-status`
      },
      type: `div`
    }]);
    obj.set = new ButtonSet_v2({
      color1: `grey`,
      color2: `grey`,
      icon1: `fa-send`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Submit`,
      title2: `Saving...`,
      callback1: this.ded_submitComment.bind(null, obj)
    });
    obj.button.appendChild(obj.set.set);
  }

  async ded_submitComment(obj) {
    obj.status.innerHTML = ``;

    if (!obj.commentUrl) {
      saveComment(
        obj.tradeCode,
        obj.parentId.value,
        obj.description.value,
        obj.url,
        obj.status,
        null,
        obj.callback
      );
      return;
    }

    const response = await request({
        method: `GET`,
        url: obj.commentUrl
      }),
      responseHtml = parseHtml(response.responseText),
      comment = responseHtml.getElementById(obj.commentUrl.match(/\/comment\/(.+)/)[1]);
    obj.parentId = this.esgst.sg
      ? comment.closest(`.comment`).getAttribute(`data-comment-id`)
      : comment.getAttribute(`data-id`);
    obj.tradeCode = this.esgst.sg
      ? ``
      : response.finalUrl.match(/\/trade\/(.+?)\//)[1];
    obj.url = this.esgst.sg
      ? response.finalUrl.match(/(.+?)(#.+?)?$/)[1]
      : `/ajax.php`;

    if (obj.checked || !this.esgst.rfi_c) {
      saveComment(
        obj.tradeCode,
        obj.parentId,
        obj.description.value,
        obj.url,
        obj.status,
        null,
        obj.callback
      );
      return;
    }

    const comments = this.esgst.sg
      ? comment.closest(`.comment`).getElementsByClassName(`comment__children`)[0]
      : comment.getElementsByClassName(`comment_children`)[0];
    for (let i = comments.children.length - 1; i > -1; i--) {
      const comment = comments.children[i],
        id = comment.querySelector(`[href*="/go/comment/"]`)
          .getAttribute(`href`)
          .match(/\/go\/comment\/(.+)/)[1];
      if (obj.context.querySelector(`[href*="/go/comment/${id}"`)) {
        comment.remove();
      }
    }
    if (comments.children.length) {
      obj.context.appendChild(comments);
      await endless_load(comments);
      for (let i = comments.children.length - 1; i > -1; i--) {
        obj.context.appendChild(comments.children[i]);
      }
      comments.remove();
      obj.set.changeButton(1).setTitle(`Confirm`);
      createElements(obj.status, `inner`, [{
        attributes: {
          class: `esgst-bold esgst-warning`
        },
        type: `span`,
        children: [{
          text: `Somebody beat you to it!`,
          type: `node`
        }, {
          type: `br`
        }, {
          text: `There are other replies to this comment.`,
          type: `node`
        }, {
          type: `br`
        }, {
          text: `You can review them below before confirming your reply.`,
          type: `node`
        }]
      }]);
      obj.checked = true;
    } else {
      saveComment(
        obj.tradeCode,
        obj.parentId,
        obj.description.value,
        obj.url,
        obj.status,
        null,
        obj.callback
      );
    }
  }
}

export default DiscussionsDiscussionEditDetector;