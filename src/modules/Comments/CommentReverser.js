import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';

class CommentsCommentReverser extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							[
								'Reverses the comments of any ',
								['a', { href: `https://www.steamgifts.com/discussion/e9zDo/` }, 'discussion'],
								' page so that they are ordered from newest to oldest.',
							],
						],
					],
				],
			],
			id: 'cr',
			name: 'Comment Reverser',
			sg: true,
			st: true,
			type: 'comments',
		};
	}

	init() {
		if (!Shared.esgst.discussionPath || !Shared.esgst.pagination) return;
		const context = Shared.esgst.pagination.previousElementSibling;
		if (context.classList.contains('comments')) {
			Shared.common.reverseComments(context);
		}
	}
}

const commentsCommentReverser = new CommentsCommentReverser();

export { commentsCommentReverser };
