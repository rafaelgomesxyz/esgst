import { Module } from '../../class/Module';
import { DOM } from '../../class/DOM';

class CommentsReplyMentionLink extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a link (@user) next to a reply's "Permalink" (in any page) that mentions the user
						being replied to and links to their comment.
					</li>
					<li>
						This feature is useful for conversations that have very deep nesting levels, which makes
						it impossible to know who replied to whom.
					</li>
				</ul>
			),
			id: 'rml',
			name: 'Reply Mention Link',
			sg: true,
			st: true,
			type: 'comments',
			featureMap: {
				commentV2: this.addLinks.bind(this),
			},
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
			DOM.insert(
				comment.nodes.actions,
				'beforeend',
				<a
					href={`#${comment.parent.data.code}`}
					className="comment__actions__button esgst-rml-link"
					ref={(ref) => (comment.nodes.rmlLink = ref)}
				>
					{`@${comment.data.isDeleted ? '[Deleted]' : comment.parent.author.data.username}`}
				</a>
			);
		}
	}

	rml_addLink(parent: HTMLElement, children: HTMLElement[]) {
		const authorUsername = parent
			.querySelector('.comment__username, .author_name')
			.textContent.trim();
		const commentCode = parent.id;
		for (const child of children) {
			const actions = child.querySelector('.comment__actions, .action_list');
			const rmlLink = actions.querySelector('.esgst-rml-link');
			if (rmlLink) {
				rmlLink.textContent = `@${authorUsername}`;
			} else {
				DOM.insert(
					actions,
					'beforeend',
					<a href={`#${commentCode}`} className="comment__actions__button esgst-rml-link">
						{`@${authorUsername}`}
					</a>
				);
			}
		}
	}
}

const commentsReplyMentionLink = new CommentsReplyMentionLink();

export { commentsReplyMentionLink };
