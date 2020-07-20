import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';
import { Session } from '../../class/Session';

class CommentsMultiReply extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							`Replaces SteamGifts' native comment box (in any page) with a comment box that allows you to reply to multiple comments at the same time and does not reload the page after submitting a reply (submitting a comment that is not a reply to another comment still reloads the page).`,
						],
					],
				],
			],
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
						'beforeEnd',
						<div class="comment__children comment_children"></div>
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
					'afterEnd',
					<a class="comment__actions__button esgst-mr-reply">Reply</a>
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
			<>
				<input name="trade_code" type="hidden" value={MR.TradeCode} />
				<input name="parent_id" type="hidden" value={MR.ParentID} />
				<textarea
					class="esgst-mr-description"
					name="description"
					placeholder={`Write a reply to ${MR.Username}...`}
				></textarea>
				<div class="align-button-container btn_actions">
					<div />
					<div class="comment__cancel-button btn_cancel esgst-mr-cancel">
						<span>Cancel</span>
					</div>
				</div>
			</>
		);
		const fragmentChildren = [];
		if (Shared.esgst.sg) {
			fragmentChildren.push(
				<div class="comment__child">
					<a
						class="global__image-outer-wrap global__image-outer-wrap--avatar-small"
						href={`/user/${Username}`}
					>
						<div
							class="global__image-inner-wrap"
							style={`background-image: url(${Settings.get('avatar')});`}
						></div>
					</a>
					<div class="comment__summary">
						<div class="comment__author">
							<div class="comment__username">
								<a href={`/user/${Username}`}>{Username}</a>
							</div>
						</div>
						<div class="comment__display-state">
							<div class="comment__description">{basicFragments}</div>
						</div>
					</div>
				</div>
			);
		} else {
			fragmentChildren.push(basicFragments);
		}
		DOM.insert(
			MR.Children,
			'afterBegin',
			<div class="comment reply_form MRBox">{fragmentChildren}</div>
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
					Reply = DOM.parse(Response.responseText).getElementById(id).closest('.comment');
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
						'inner',
						<>
							<i class="fa fa-times"></i>
							<span>Failed!</span>
						</>
					);
				}
			} else {
				if (id) {
					Reply = DOM.parse(JSON.parse(Response.responseText).html).getElementById(id);
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
						'inner',
						<>
							<i class="fa fa-times"></i>
							<span>Failed!</span>
						</>
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
			DOM.insert(MR.Edit, 'afterEnd', <a class="comment__actions__button esgst-mr-edit">Edit</a>);
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
				'afterEnd',
				<a class="comment__submit-button btn_action white EditSave">
					<i class="fa fa-edit"></i>
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
				ResponseJSON = JSON.parse(
					(
						await Shared.common.request({
							data: `xsrf_token=${
								Session.xsrfToken
							}&do=comment_edit&comment_id=${ID}&allow_replies=${AllowReplies}&description=${encodeURIComponent(
								Description.value
							)}`,
							method: 'POST',
							url: '/ajax.php',
						})
					).responseText
				);
				if (ResponseJSON.type === 'success' || ResponseJSON.success) {
					ResponseHTML = DOM.parse(ResponseJSON[Shared.esgst.sg ? 'comment' : 'html']);
					if (Settings.get('rfi') && Settings.get('rfi_s')) {
						let reply = MR.Comment.cloneNode(true);
						if (Shared.esgst.sg) {
							DOM.insert(
								reply,
								'inner',
								<>
									<div class="ajax comment__child">
										{Array.from(ResponseHTML.body.childNodes).map((x) => x.cloneNode(true))}
									</div>
									<div class="comment__children"></div>
								</>
							);
						} else {
							DOM.insert(
								reply,
								'inner',
								<>
									{Array.from(ResponseHTML.body.childNodes).map((x) => x.cloneNode(true))}
									<div class="comment__children"></div>
								</>
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
						'inner',
						<>
							{Array.from(
								ResponseHTML.getElementsByClassName(
									Shared.esgst.sg ? 'comment__display-state' : 'comment_body_default'
								)[0].childNodes
							)}
						</>
					);
					EditState.classList.add(Shared.esgst.sg ? 'is-hidden' : 'is_hidden');
					DOM.insert(
						MR.Timestamp,
						'inner',
						<>
							{Array.from(
								ResponseHTML.getElementsByClassName(
									Shared.esgst.sg ? 'comment__actions' : 'action_list'
								)[0].firstElementChild.childNodes
							)}
						</>
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
				'afterEnd',
				<a class="comment__actions__button esgst-mr-delete">Delete</a>
			);
			mr.delete = mr.delete.nextElementSibling;
			mr.delete.previousElementSibling.remove();
			mr.delete.addEventListener('click', async () => {
				// noinspection JSIgnoredPromiseFromCall
				this.mr_editReply(
					mr,
					await Shared.common.request({ data, method: 'POST', url: '/ajax.php' })
				);
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
				'afterEnd',
				<a class="comment__actions__button esgst-mr-undelete">Undelete</a>
			);
			mr.undelete = mr.undelete.nextElementSibling;
			mr.undelete.previousElementSibling.remove();
			mr.undelete.addEventListener('click', async () => {
				// noinspection JSIgnoredPromiseFromCall
				this.mr_editReply(
					mr,
					await Shared.common.request({ data, method: 'POST', url: '/ajax.php' })
				);
			});
		}
	}

	async mr_editReply(mr, response) {
		let responseHtml, responseJson;
		responseJson = JSON.parse(response.responseText);
		if (responseJson.type === 'success' || responseJson.success) {
			responseHtml = DOM.parse(responseJson[Shared.esgst.sg ? 'comment' : 'html']);
			if (Shared.esgst.sg) {
				DOM.insert(
					mr.Container,
					'inner',
					<>{Array.from(responseHtml.getElementsByClassName('comment__summary')[0].childNodes)}</>
				);
			} else {
				DOM.insert(
					mr.Container,
					'inner',
					<>{Array.from(responseHtml.getElementsByClassName('comment_inner')[0].childNodes)}</>
				);
			}
			if (Settings.get('rfi') && Settings.get('rfi_s')) {
				let reply = mr.Comment.cloneNode(true);
				if (Shared.esgst.sg) {
					DOM.insert(
						reply,
						'inner',
						<>
							<div class="ajax comment__child">{Array.from(responseHtml.body.childNodes)}</div>
							<div class="comment__children"></div>
						</>
					);
				} else {
					DOM.insert(
						reply,
						'inner',
						<>
							{Array.from(responseHtml.body.childNodes)}
							<div class="comment__children"></div>
						</>
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
