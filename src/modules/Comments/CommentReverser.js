import { Module } from '../../class/Module';
import { shared } from '../../class/Shared';

class CommentsCommentReverser extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Reverses the comments of any `,
            [`a`, { href: `https://www.steamgifts.com/discussion/e9zDo/` }, `discussion`],
            ` page so that they are ordered from newest to oldest.`
          ]]
        ]]
      ],
      id: `cr`,
      name: `Comment Reverser`,
      sg: true,
      st: true,
      type: `comments`
    };
  }

  init() {
    if (!shared.esgst.discussionPath || !shared.esgst.pagination) return;
    const context = shared.esgst.pagination.previousElementSibling;
    if (context.classList.contains(`comments`)) {
      shared.common.reverseComments(context);
    }
  }
}

const commentsCommentReverser = new CommentsCommentReverser();

export { commentsCommentReverser };