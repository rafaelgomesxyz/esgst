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
      load: this.cr,
      name: `Comment Reverser`,
      sg: true,
      st: true,
      type: `comments`
    };
  }

  cr() {
    if (!this.esgst.discussionPath || !this.esgst.pagination) return;
    const context = this.esgst.pagination.previousElementSibling;
    if (context.classList.contains(`comments`)) {
      shared.common.reverseComments(context);
    }
  }
}

const commentsCommentReverser = new CommentsCommentReverser();

export { commentsCommentReverser };