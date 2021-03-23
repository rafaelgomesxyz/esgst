import { DOM } from '../../class/DOM';
import { EventDispatcher } from '../../class/EventDispatcher';
import { FetchRequest } from '../../class/FetchRequest';
import { Module } from '../../class/Module';
import { Session } from '../../class/Session';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { Events } from '../../constants/Events';

class CommentsMultiReply extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Replaces SteamGifts' native comment box (in any page) with a comment box that allows you
						to reply to multiple comments at the same time and does not reload the page after
						submitting a reply (submitting a comment that is not a reply to another comment still
						reloads the page).
					</li>
				</ul>
			),
			id: 'mr',
			name: 'Multi-Reply',
			sg: true,
			st: true,
			type: 'comments',
			featureMap: {
				endless: this.mr_getButtons.bind(this),
			},
		};
	}

	mr_getButtons(context, main, source, endless) {
		if (
			(!Settings.get('mr') || Shared.common.isCurrentPath('Messages')) &&
			(!Settings.get('rfi') || (!Shared.common.isCurrentPath('Messages') && main))
		)
			return;
		const elements = context.querySelectorAll(
			`${
				endless
					? `.esgst-es-page-${endless} .comment__actions, .esgst-es-page-${endless}.comment__actions`
					: '.comment__actions'
			}, ${
				endless
					? `.esgst-es-page-${endless} .action_list, .esgst-es-page-${endless}.action_list`
					: '.action_list'
			}`
		);
		for (let i = 0, n = elements.length; i < n; ++i) {
			this.mr_addButton(elements[i], main);
		}
	}

	mr_addButton(Context, main) {
		let MR = {};
		MR.Context = Context;
		MR.Comment = Context.closest(Shared.esgst.sg ? '.comment' : '.comment_outer');
		let Parent, ReplyButton, Permalink;
		if (MR.Comment) {
			Parent = MR.Comment.closest(Shared.esgst.sg ? '.comment' : '.comment_outer');
			MR.Container = /** @type {HTMLElement} */ MR.Comment.getElementsByClassName(
				Shared.esgst.sg ? 'comment__summary' : 'comment_inner'
			)[0];
			MR.Timestamp = /** @type {HTMLElement} */ MR.Context.firstElementChild;
			ReplyButton = MR.Context.getElementsByClassName(
				Shared.esgst.sg ? 'js__comment-reply' : 'js_comment_reply'
			)[0];
			Permalink = MR.Context.querySelectorAll(`[href*="/go/comment/"]`);
			Permalink = Permalink[Permalink.length - 1];
			if (ReplyButton || !main || Shared.common.isCurrentPath('Messages')) {
				if (ReplyButton) {
					ReplyButton.remove();
					MR.ParentID = Parent.getAttribute(Shared.esgst.sg ? 'data-comment-id' : 'data-id');
					if (!main || Shared.common.isCurrentPath('Messages')) {
						MR.URL = Permalink.getAttribute('href');
					}
					MR.url = Permalink.getAttribute('href');
				} else {
					MR.url = MR.URL = Permalink.getAttribute('href');
					DOM.insert(
						MR.Comment,
						'beforeend',
						<div className="comment__children comment_children"></div>
					);
				}
				if (Shared.esgst.sg) {
					MR.TradeCode = '';
					MR.Username = MR.Comment.getElementsByClassName('comment__username')[0].textContent;
				} else {
					if (main && !Shared.common.isCurrentPath('Messages')) {
						MR.TradeCode = window.location.pathname.match(/^\/trade\/(.+?)\//)[1];
					}
					MR.Username = MR.Comment.getElementsByClassName('author_name')[0].textContent;
				}
				DOM.insert(
					MR.Timestamp,
					'afterend',
					<a className="comment__actions__button esgst-mr-reply">Reply</a>
				);
				MR.Timestamp.nextElementSibling.addEventListener('click', () => {
					if (!MR.Box) {
						this.mr_addBox(MR);
					} else {
						MR.Description.focus();
					}
				});
			}
			MR.Children = /** @type {HTMLElement} */ MR.Comment.getElementsByClassName(
				Shared.esgst.sg ? 'comment__children' : 'comment_children'
			)[0];
			this.mr_setEdit(MR);
			this.mr_setDelete(MR);
			this.mr_setUndelete(MR);
		}
	}

	mr_addBox(MR) {
		let Username;
		Username = Settings.get('username');
		const basicFragments = (
			<fragment>
				<input name="trade_code" type="hidden" value={MR.TradeCode} />
				<input name="parent_id" type="hidden" value={MR.ParentID} />
				<textarea
					className="esgst-mr-description"
					name="description"
					placeholder={`Write a reply to ${MR.Username}...`}
				></textarea>
				<div className="align-button-container btn_actions">
					<div />
					<div className="comment__cancel-button btn_cancel esgst-mr-cancel">
						<span>Cancel</span>
					</div>
				</div>
			</fragment>
		);
		const fragmentChildren = [];
		if (Shared.esgst.sg) {
			fragmentChildren.push(
				<div className="comment__child">
					<a
						className="global__image-outer-wrap global__image-outer-wrap--avatar-small"
						href={`/user/${Username}`}
					>
						<div
							className="global__image-inner-wrap"
							style={`background-image: url(${Settings.get('avatar')});`}
						></div>
					</a>
					<div className="comment__summary">
						<div className="comment__author">
							<div className="comment__username">
								<a href={`/user/${Username}`}>{Username}</a>
							</div>
						</div>
						<div className="comment__display-state">
							<div className="comment__description">{basicFragments}</div>
						</div>
					</div>
				</div>
			);
		} else {
			fragmentChildren.push(basicFragments);
		}
		DOM.insert(
			MR.Children,
			'afterbegin',
			<div className="comment reply_form MRBox">{fragmentChildren}</div>
		);
		MR.Box = MR.Children.firstElementChild;
		MR.Description = MR.Box.getElementsByClassName('esgst-mr-description')[0];
		MR.Cancel = MR.Box.getElementsByClassName('esgst-mr-cancel')[0];
		if (Settings.get('cfh')) {
			Shared.esgst.modules.commentsCommentFormattingHelper.cfh_addPanel(MR.Description);
		}
		MR.Description.focus();
		Shared.common.addReplyButton(MR.Box, MR.URL, async (id, Response, DEDStatus) => {
			let Reply;
			if (Shared.esgst.sg) {
				if (id) {
					Reply = Response.html.getElementById(id).closest('.comment');
					if (Settings.get('rfi') && Settings.get('rfi_s')) {
						await Shared.esgst.modules.commentsReplyFromInbox.rfi_saveReply(
							id,
							Reply.outerHTML,
							MR.url
						);
					}
					Shared.esgst.modules.commentsReplyMentionLink.rml_addLink(MR.Container, [Reply]);
					await Shared.common.endless_load(Reply);
					MR.Box.remove();
					MR.Box = null;
					MR.Children.appendChild(Reply);
					if (
						Settings.get('qiv') &&
						(!Shared.esgst.qiv.comments || !Shared.esgst.qiv.comments.contains(Reply))
					) {
						window.location.hash = id;
					}
				} else {
					DOM.insert(
						DEDStatus,
						'atinner',
						<fragment>
							<i className="fa fa-times"></i>
							<span>Failed!</span>
						</fragment>
					);
				}
			} else {
				if (id) {
					Reply = DOM.parse(Response.json.html).getElementById(id);
					if (Settings.get('rfi') && Settings.get('rfi_s')) {
						await Shared.esgst.modules.commentsReplyFromInbox.rfi_saveReply(
							id,
							Reply.outerHTML,
							MR.url
						);
					}
					Shared.esgst.modules.commentsReplyMentionLink.rml_addLink(MR.Container, [Reply]);
					await Shared.common.endless_load(Reply);
					MR.Box.remove();
					MR.Box = null;
					MR.Children.appendChild(Reply);
					if (
						Settings.get('qiv') &&
						(!Shared.esgst.qiv.comments || !Shared.esgst.qiv.comments.contains(Reply))
					) {
						window.location.hash = id;
					}
				} else {
					DOM.insert(
						DEDStatus,
						'atinner',
						<fragment>
							<i className="fa fa-times"></i>
							<span>Failed!</span>
						</fragment>
					);
				}
			}
		});
		MR.Cancel.addEventListener('click', () => {
			MR.Box.remove();
			MR.Box = null;
		});
	}

	mr_setEdit(MR) {
		let DisplayState, EditState, EditSave, ID, AllowReplies, Description;
		MR.Edit = MR.Context.getElementsByClassName(
			Shared.esgst.sg ? 'js__comment-edit' : 'js_comment_edit'
		)[0];
		if (MR.Edit) {
			DOM.insert(
				MR.Edit,
				'afterend',
				<a className="comment__actions__button esgst-mr-edit">Edit</a>
			);
			MR.Edit = MR.Edit.nextElementSibling;
			MR.Edit.previousElementSibling.remove();
			DisplayState = MR.Comment.getElementsByClassName(
				Shared.esgst.sg ? 'comment__display-state' : 'comment_body_default'
			)[0];
			EditState = MR.Comment.getElementsByClassName(
				Shared.esgst.sg ? 'comment__edit-state' : 'edit_form'
			)[0];
			EditSave = EditState.querySelector(`.js__comment-edit-save, .js_submit, .EditSave`);
			DOM.insert(
				EditSave,
				'afterend',
				<a className="comment__submit-button btn_action white EditSave">
					<i className="fa fa-edit"></i>
					<span>Edit</span>
				</a>
			);
			EditSave = EditSave.nextElementSibling;
			EditSave.previousElementSibling.remove();
			ID = EditState.querySelector(`[name="comment_id"]`).value;
			AllowReplies = Shared.esgst.sg ? EditState.querySelector(`[name="allow_replies"]`).value : '';
			Description = EditState.querySelector(`[name="description"]`);
			MR.Edit.addEventListener('click', () => {
				let Temp;
				if (Shared.esgst.sg) {
					DisplayState.classList.add('is-hidden');
					MR.Context.classList.add('is-hidden');
				} else {
					MR.Container.classList.add('is_hidden');
				}
				EditState.classList.remove(Shared.esgst.sg ? 'is-hidden' : 'is_hidden');
				Temp = Description.value;
				Description.focus();
				Description.value = '';
				Description.value = Temp;
			});
			EditSave.addEventListener('click', async () => {
				let ResponseJSON, ResponseHTML;
				const obj = { comment: Description.value };
				await EventDispatcher.dispatch(Events.BEFORE_COMMENT_SUBMIT, obj);
				ResponseJSON = (
					await FetchRequest.post('/ajax.php', {
						data: `xsrf_token=${
							Session.xsrfToken
						}&do=comment_edit&comment_id=${ID}&allow_replies=${AllowReplies}&description=${encodeURIComponent(
							obj.comment
						)}`,
					})
				).json;
				if (ResponseJSON.type === 'success' || ResponseJSON.success) {
					ResponseHTML = DOM.parse(ResponseJSON[Shared.esgst.sg ? 'comment' : 'html']);
					if (Settings.get('rfi') && Settings.get('rfi_s')) {
						let reply = MR.Comment.cloneNode(true);
						if (Shared.esgst.sg) {
							DOM.insert(
								reply,
								'atinner',
								<fragment>
									<div className="ajax comment__child">
										{Array.from(ResponseHTML.body.childNodes).map((x) => x.cloneNode(true))}
									</div>
									<div className="comment__children"></div>
								</fragment>
							);
						} else {
							DOM.insert(
								reply,
								'atinner',
								<fragment>
									{Array.from(ResponseHTML.body.childNodes).map((x) => x.cloneNode(true))}
									<div className="comment__children"></div>
								</fragment>
							);
						}
						await Shared.esgst.modules.commentsReplyFromInbox.rfi_saveReply(
							MR.url.match(/\/comment\/(.+)/)[1],
							reply.outerHTML,
							null,
							true
						);
					}
					DOM.insert(
						DisplayState,
						'atinner',
						<fragment>
							{Array.from(
								ResponseHTML.getElementsByClassName(
									Shared.esgst.sg ? 'comment__display-state' : 'comment_body_default'
								)[0].childNodes
							)}
						</fragment>
					);
					EditState.classList.add(Shared.esgst.sg ? 'is-hidden' : 'is_hidden');
					DOM.insert(
						MR.Timestamp,
						'atinner',
						<fragment>
							{Array.from(
								ResponseHTML.getElementsByClassName(
									Shared.esgst.sg ? 'comment__actions' : 'action_list'
								)[0].firstElementChild.childNodes
							)}
						</fragment>
					);
					if (Settings.get('at')) {
						Shared.esgst.modules.generalAccurateTimestamp.at_getTimestamps(MR.Timestamp);
					}
					if (Settings.get('ged')) {
						await Shared.esgst.ged_addIcons([
							{
								actions: MR.Container.getElementsByClassName(
									Shared.esgst.sg ? 'comment__actions' : 'action_list'
								)[0],
								displayState: DisplayState,
								comment: MR.Container,
								id: MR.url.match(/\/comment\/(.+)/)[1],
							},
						]);
					}
					if (Shared.esgst.sg) {
						DisplayState.classList.remove('is-hidden');
						MR.Context.classList.remove('is-hidden');
					} else {
						MR.Container.classList.remove('is_hidden');
					}
				}
			});
		}
	}

	mr_setDelete(mr) {
		let allowReplies, data, id;
		mr.delete = mr.Context.getElementsByClassName(
			Shared.esgst.sg ? 'js__comment-delete' : 'js_comment_delete'
		)[0];
		if (mr.delete) {
			if (Shared.esgst.sg) {
				allowReplies = mr.delete.parentElement.querySelector(`[name="allow_replies"]`).value;
				id = mr.delete.parentElement.querySelector(`[name="comment_id"]`).value;
				data = `xsrf_token=${Session.xsrfToken}&do=comment_delete&allow_replies=${allowReplies}&comment_id=${id}`;
			} else {
				data = mr.delete.getAttribute('data-form');
			}
			DOM.insert(
				mr.delete,
				'afterend',
				<a className="comment__actions__button esgst-mr-delete">Delete</a>
			);
			mr.delete = mr.delete.nextElementSibling;
			mr.delete.previousElementSibling.remove();
			mr.delete.addEventListener('click', async () => {
				// noinspection JSIgnoredPromiseFromCall
				this.mr_editReply(mr, await FetchRequest.post('/ajax.php', { data }));
			});
		}
	}

	mr_setUndelete(mr) {
		let allowReplies, data, id;
		mr.undelete = mr.Context.getElementsByClassName(
			Shared.esgst.sg ? 'js__comment-undelete' : 'js_comment_undelete'
		)[0];
		if (mr.undelete) {
			if (Shared.esgst.sg) {
				allowReplies = mr.undelete.parentElement.querySelector(`[name="allow_replies"]`).value;
				id = mr.undelete.parentElement.querySelector(`[name="comment_id"]`).value;
				data = `xsrf_token=${Session.xsrfToken}&do=comment_undelete&allow_replies=${allowReplies}&comment_id=${id}`;
			} else {
				data = mr.undelete.getAttribute('data-form');
			}
			DOM.insert(
				mr.undelete,
				'afterend',
				<a className="comment__actions__button esgst-mr-undelete">Undelete</a>
			);
			mr.undelete = mr.undelete.nextElementSibling;
			mr.undelete.previousElementSibling.remove();
			mr.undelete.addEventListener('click', async () => {
				// noinspection JSIgnoredPromiseFromCall
				this.mr_editReply(mr, await FetchRequest.post('/ajax.php', { data }));
			});
		}
	}

	async mr_editReply(mr, response) {
		let responseHtml, responseJson;
		responseJson = response.json;
		if (responseJson.type === 'success' || responseJson.success) {
			responseHtml = DOM.parse(responseJson[Shared.esgst.sg ? 'comment' : 'html']);
			if (Shared.esgst.sg) {
				DOM.insert(
					mr.Container,
					'atinner',
					<fragment>
						{Array.from(responseHtml.getElementsByClassName('comment__summary')[0].childNodes)}
					</fragment>
				);
			} else {
				DOM.insert(
					mr.Container,
					'atinner',
					<fragment>
						{Array.from(responseHtml.getElementsByClassName('comment_inner')[0].childNodes)}
					</fragment>
				);
			}
			if (Settings.get('rfi') && Settings.get('rfi_s')) {
				let reply = mr.Comment.cloneNode(true);
				if (Shared.esgst.sg) {
					DOM.insert(
						reply,
						'atinner',
						<fragment>
							<div className="ajax comment__child">{Array.from(responseHtml.body.childNodes)}</div>
							<div className="comment__children"></div>
						</fragment>
					);
				} else {
					DOM.insert(
						reply,
						'atinner',
						<fragment>
							{Array.from(responseHtml.body.childNodes)}
							<div className="comment__children"></div>
						</fragment>
					);
				}
				await Shared.esgst.modules.commentsReplyFromInbox.rfi_saveReply(
					mr.url.match(/\/comment\/(.+)/)[1],
					reply.outerHTML,
					null,
					true
				);
			}
			await Shared.common.endless_load(mr.Container);
		}
	}
}

const commentsMultiReply = new CommentsMultiReply();

export { commentsMultiReply };
