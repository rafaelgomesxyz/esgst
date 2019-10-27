import { Module } from '../../class/Module';
import { shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';

class CommentsCommentVariables extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', 'Replaces certain variables with values when submitting a comment.']
        ]]
      ],
      id: 'cv',
      name: 'Comment Variables',
      sg: true,
      st: true,
      type: 'comments',
      inputItems: [
        {
          id: 'cv_username',
          prefix: `Your username: `
        },
        {
          id: 'cv_steamId',
          prefix: `Your Steam id: `
        },
        {
          id: 'cv_creator',
          prefix: `The creator of the giveaway/thread: `
        },
        {
          id: 'cv_replyUser',
          prefix: `The user you are replying to: `
        }
      ],
    };
  }

  init() {
    if (shared.esgst.replyBox) {
      shared.common.addReplyButton(shared.esgst.replyBox);
    }

    shared.esgst.triggerFunctions.onBeforeCommentSubmit.push(this.replaceVariables.bind(this));
  }

  replaceVariables(obj) {
    obj.comment = obj.comment
      .replace(this.getRegExp('username'), Settings.username)
      .replace(this.getRegExp('steamId'), Settings.steamId);    
    const creatorElement = document.querySelector(`.featured__column--width-fill.text-right a, .comment__username, .author_name`);
    if (creatorElement) {
      const creator = creatorElement.textContent;
      obj.comment = obj.comment.replace(this.getRegExp('creator'), creator);
    }
    if (obj.context) {
      let replyUser = obj.context.closest(`.comment__children, .comment_children`);
      replyUser = (replyUser && replyUser.closest(`.comment, .comment_outer`).querySelector(`.comment__username, .author_name`)) || document.querySelector(`.featured__column--width-fill.text-right a, .comment__username, .author_name`);
      if (replyUser) {
        replyUser = replyUser.textContent;
        obj.comment = obj.comment.replace(this.getRegExp('replyUser'), replyUser);
      }
    }
  }

  getRegExp(key) {
    return new RegExp(Settings[`cv_${key}`], 'gi');
  }
}

const commentsCommentVariables = new CommentsCommentVariables();

export { commentsCommentVariables };