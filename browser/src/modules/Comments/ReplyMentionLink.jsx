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
        commentV2: this.rml_addLinks.bind(this)
      }
    };
  }

  rml_addLinks(comments) {
    for (const comment of comments) {
      if (comment.parent) {
        comment.nodes.rmlLink = DOM.insert(comment.nodes.actions, 'beforeEnd', (
          <a class="comment__actions__button esgst-rml-link" href={`#${comment.parent.data.code}`}>
            {`@${comment.parent.author.data.username || '[Deleted]'}`}
          </a>
        ));
      }
      this.rml_addLinks(comment.children);
    }
  }
}

const commentsReplyMentionLink = new CommentsReplyMentionLink();

export { commentsReplyMentionLink };