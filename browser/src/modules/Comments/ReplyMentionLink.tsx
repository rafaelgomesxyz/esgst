import { Module } from '../../class/Module';
import { DOM } from '../../class/DOM';

class CommentsReplyMentionLink extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', `Adds a link (@user) next to a reply's "Permalink" (in any page) that mentions the user being replied to and links to their comment.`],
          ['li', `This feature is useful for conversations that have very deep nesting levels, which makes it impossible to know who replied to whom.`]
        ]]
      ],
      id: 'rml',
      name: 'Reply Mention Link',
      sg: true,
      st: true,
      type: 'comments',
      featureMap: {
        commentV2: this.addLinks.bind(this)
      }
    };
  }

  addLinks(comments: IComment[]) {
    for (const comment of comments) {
      this.addLink(comment);
      this.addLinks(comment.children);
    }
  }

  addLink(comment: IComment) {
    if (comment.parent && !comment.nodes.rmlLink) {
      comment.nodes.rmlLink = DOM.insert(comment.nodes.actions, 'beforeEnd', (
        <a href={`#${comment.parent.data.code}`} class="comment__actions__button esgst-rml-link">
          {`@${comment.data.isDeleted ? '[Deleted]' : comment.parent.author.data.username}`}
        </a>
      ));
    }
  }
}

const commentsReplyMentionLink = new CommentsReplyMentionLink();

export { commentsReplyMentionLink };