import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';
import { DOM } from '../../class/DOM';

class CommentsReplyBoxOnTop extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Moves the reply box over the comments (in any page) so that you do not need to scroll
						down to the bottom of the page to add a comment.
					</li>
				</ul>
			),
			id: 'rbot',
			name: 'Reply Box On Top',
			sg: true,
			st: true,
			type: 'comments',
		};
	}

	init() {
		let element = Shared.esgst.mainPageHeading;
		const box = Shared.esgst.replyBox || Shared.esgst.reviewBox;
		if (!box) {
			return;
		}
		let boxContainer;
		DOM.insert(
			element,
			'afterend',
			<div className="esgst-rbot" ref={(ref) => (boxContainer = ref)} />
		);
		boxContainer.appendChild(box);
		let button = boxContainer.getElementsByClassName(Shared.esgst.cancelButtonClass)[0];
		if (!button) return;
		button.addEventListener('click', () =>
			window.setTimeout(() => boxContainer.appendChild(box), 0)
		);
	}
}

const commentsReplyBoxOnTop = new CommentsReplyBoxOnTop();

export { commentsReplyBoxOnTop };
