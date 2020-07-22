import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

class CommentsReplyFromInbox extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a "Reply" link next to a comment's "Permalink" (in your{' '}
						<a href="https://www.steamgifts.com/messages">inbox</a> page) that allows you to reply
						to the comment directly from your inbox.
					</li>
					<li>
						It is essentially <span data-esgst-feature-id="mr"></span> for the inbox page.
					</li>
				</ul>
			),
			features: {
				rfi_s: {
					description: () => (
						<ul>
							<li>
								Caches any replies you submit for 1 week so that they are still in your inbox page
								when you refresh it.
							</li>
							<li>
								If you edit/delete/undelete a saved reply its cache is updated and lasts 1 week
								longer.
							</li>
						</ul>
					),
					name: 'Cache replies.',
					sg: true,
					st: true,
				},
				rfi_c: {
					description: () => (
						<ul>
							<li>
								Whenever you try to submit a reply to a comment, the feature will check if there are
								other replies to that comment and show them to you so that you can review your reply
								before sending it.
							</li>
							<li>
								This option is useful if you want to avoid repeating something that another user
								already said or discard your reply if someone else already said everything that you
								were going to say.
							</li>
						</ul>
					),
					name: 'Check if there are other replies to a comment before submitting a reply.',
					sg: true,
					st: true,
				},
			},
			id: 'rfi',
			name: 'Reply From Inbox',
			sg: true,
			st: true,
			type: 'comments',
		};
	}

	init() {
		if (Settings.get('mr')) return;
		Shared.esgst.endlessFeatures.push(
			Shared.esgst.modules.commentsMultiReply.mr_getButtons.bind(
				Shared.esgst.modules.commentsMultiReply
			)
		);
	}

	async rfi_saveReply(id, reply, url, edit) {
		//Logger.info(id, reply, url, edit);
		let i, n, source, saved;
		if (url) {
			source = url.match(/\/comment\/(.+)/)[1];
		}
		saved = JSON.parse(Shared.common.getValue(`${Shared.esgst.name}RfiCache`, '{}'));
		if (edit) {
			for (const key in saved) {
				if (saved.hasOwnProperty(key)) {
					for (i = 0, n = saved[key].length; i < n && saved[key][i].id !== id; ++i) {}
					if (i < n) {
						saved[key][i].reply = reply;
						saved[key][i].timestamp = Date.now();
					}
				}
			}
		} else {
			if (!saved[source]) {
				saved[source] = [];
			}
			saved[source].push({
				id: id,
				reply: reply,
				timestamp: Date.now(),
			});
		}
		await Shared.common.setValue(`${Shared.esgst.name}RfiCache`, JSON.stringify(saved));
	}

	async rfi_getReplies(comments, endless) {
		let children,
			comment,
			i,
			id,
			j,
			key,
			n,
			numReplies,
			saved,
			edited = false;
		saved = JSON.parse(Shared.common.getValue(`${Shared.esgst.name}RfiCache`, '{}'));
		for (i = 0, n = comments.length; i < n; ++i) {
			comment = comments[i];
			id = comment.id;
			if (id && saved[id]) {
				children = comment.comment
					.closest(`.comment, .comment_outer`)
					.querySelector(`.comment__children, .comment_children`);
				for (j = 0, numReplies = saved[id].length; j < numReplies; ++j) {
					let dateElementContainer = DOM.parse(saved[id][j].reply).body.firstElementChild;
					DOM.insert(children, 'beforeend', dateElementContainer);
					const dateElement = dateElementContainer.querySelector(`[data-timestamp]`);
					if (dateElement) {
						dateElement.textContent = Shared.common.getTimeSince(saved[id][j].timestamp);
					}
				}
				children.setAttribute('data-rfi', true);
				await Shared.common.endless_load(children, false, null, false, endless);
				children.removeAttribute('data-rfi');
			}
		}
		for (key in saved) {
			if (saved.hasOwnProperty(key)) {
				for (i = 0, n = saved[key].length; i < n; ++i) {
					if (Date.now() - saved[key][i].timestamp > 604800000) {
						edited = true;
						saved[key].splice(i, 1);
						i -= 1;
						n -= 1;
					}
				}
				if (!saved[key].length) {
					edited = true;
					delete saved[key];
				}
			}
		}
		if (edited) {
			await Shared.common.setValue(`${Shared.esgst.name}RfiCache`, JSON.stringify(saved));
		}
	}
}

const commentsReplyFromInbox = new CommentsReplyFromInbox();

export { commentsReplyFromInbox };
