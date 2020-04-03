import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';
import { DOM } from '../../class/DOM';

class CommentsReplyBoxOnTop extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				['ul', [
					['li', `Moves the reply box over the comments (in any page) so that you do not need to scroll down to the bottom of the page to add a comment.`]
				]]
			],
			id: 'rbot',
			name: 'Reply Box On Top',
			sg: true,
			st: true,
			type: 'comments'
		};
	}

	init() {
		let element = Shared.esgst.mainPageHeading;
		if (!Shared.esgst.replyBox) {
			if (Shared.esgst.st && Shared.esgst.userPath) {
				let review = document.getElementsByClassName('notification yellow')[0];
				if (!review) return;
				element.parentElement.insertBefore(review, element.nextElementSibling);
			}
			return;
		}
		let box = DOM.insert(element, 'afterEnd', (
			<div class="esgst-rbot"></div>
		));
		box.appendChild(Shared.esgst.replyBox);
		let button = box.getElementsByClassName(Shared.esgst.cancelButtonClass)[0];
		if (!button) return;
		button.addEventListener('click', () => window.setTimeout(box.appendChild.bind(box, Shared.esgst.replyBox), 0));
	}
}

const commentsReplyBoxOnTop = new CommentsReplyBoxOnTop();

export { commentsReplyBoxOnTop };