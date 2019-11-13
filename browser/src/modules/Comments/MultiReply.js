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
        ['ul', [
          ['li', `Replaces SteamGifts' native comment box (in any page) with a comment box that allows you to reply to multiple comments at the same time and does not reload the page after submitting a reply (submitting a comment that is not a reply to another comment still reloads the page).`]
        ]]
      ],
      id: 'mr',
      name: 'Multi-Reply',
      sg: true,
      st: true,
      type: 'comments',
      featureMap: {
        endless: this.mr_getButtons.bind(this)
      }
    };
  }

  mr_getButtons(context, main, source, endless) {
    if ((!Settings.get('mr') || Shared.common.isCurrentPath('Messages')) && (!Settings.get('rfi') || (!Shared.common.isCurrentPath('Messages') && main))) return;
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .comment__actions, .esgst-es-page-${endless}.comment__actions` : '.comment__actions'}, ${endless ? `.esgst-es-page-${endless} .action_list, .esgst-es-page-${endless}.action_list` : '.action_list'}`);
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
      MR.Container = /** @type {HTMLElement} */ MR.Comment.getElementsByClassName(Shared.esgst.sg ? 'comment__summary' : 'comment_inner')[0];
      MR.Timestamp = /** @type {HTMLElement} */ MR.Context.firstElementChild;
      ReplyButton = MR.Context.getElementsByClassName(Shared.esgst.sg ? 'js__comment-reply' : 'js_comment_reply')[0];
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
          Shared.common.createElements(MR.Comment, 'beforeEnd', [{
            attributes: {
              class: 'comment__children comment_children'
            },
            type: 'div'
          }]);
        }
        if (Shared.esgst.sg) {
          MR.TradeCode = '';
        } else {
          if (main && !Shared.common.isCurrentPath('Messages')) {
            MR.TradeCode = window.location.pathname.match(/^\/trade\/(.+?)\//)[1];
          }
          MR.Username = MR.Comment.getElementsByClassName('author_name')[0].textContent;
        }
        Shared.common.createElements(MR.Timestamp, 'afterEnd', [{
          attributes: {
            class: 'comment__actions__button esgst-mr-reply'
          },
          text: 'Reply',
          type: 'a'
        }]);
        MR.Timestamp.nextElementSibling.addEventListener('click', () => {
          if (!MR.Box) {
            this.mr_addBox(MR);
          } else {
            MR.Description.focus();
          }
        });
      }
      MR.Children = /** @type {HTMLElement} */ MR.Comment.getElementsByClassName(Shared.esgst.sg ? 'comment__children' : 'comment_children')[0];
      this.mr_setEdit(MR);
      this.mr_setDelete(MR);
      this.mr_setUndelete(MR);
    }
  }

  mr_addBox(MR) {
    let Username;
    Username = Settings.get('username');
    const items = [{
      attributes: {
        class: 'comment reply_form MRBox'
      },
      type: 'div'
    }];
    const basicItems = [{
      attributes: {
        name: 'trade_code',
        type: 'hidden',
        value: MR.TradeCode
      },
      type: 'input'
    }, {
      attributes: {
        name: 'parent_id',
        type: 'hidden',
        value: MR.ParentID
      },
      type: 'input'
    }, {
      attributes: {
        class: 'esgst-mr-description',
        name: 'description'
      },
      type: 'textarea'
    }, {
      attributes: {
        class: 'align-button-container btn_actions'
      },
      type: 'div',
      children: [{
        type: 'div'
      }, {
        attributes: {
          class: 'comment__cancel-button btn_cancel esgst-mr-cancel'
        },
        type: 'div',
        children: [{
          text: 'Cancel',
          type: 'span'
        }]
      }]
    }];
    if (Shared.esgst.sg) {
      items[0].children = [{
        attributes: {
          class: 'comment__child'
        },
        type: 'div',
        children: [{
          attributes: {
            class: 'global__image-outer-wrap global__image-outer-wrap--avatar-small',
            href: `/user/${Username}`
          },
          type: 'a',
          children: [{
            attributes: {
              class: 'global__image-inner-wrap',
              style: `background-image: url(${Settings.get('avatar')});`
            },
            type: 'div'
          }]
        }, {
          attributes: {
            class: 'comment__summary'
          },
          type: 'div',
          children: [{
            attributes: {
              class: 'comment__author'
            },
            type: 'div',
            children: [{
              attributes: {
                class: 'comment__username'
              },
              type: 'div',
              children: [{
                attributes: {
                  href: `/user/${Username}`
                },
                text: Username,
                type: 'a'
              }]
            }]
          }, {
            attributes: {
              class: 'comment__display-state'
            },
            type: 'div',
            children: [{
              attributes: {
                class: 'comment__description'
              },
              type: 'div',
              children: basicItems
            }]
          }]
        }]
      }];
    } else {
      basicItems[2].attributes.placeholder = `Write a reply to ${MR.Username}...`;
      items[0].children = basicItems;
    }
    Shared.common.createElements(MR.Children, 'afterBegin', items);
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
            await Shared.esgst.modules.commentsReplyFromInbox.rfi_saveReply(id, Reply.outerHTML, MR.url);
          }
          Shared.esgst.modules.commentsReplyMentionLink.rml_addLink(MR.Container, [Reply]);
          await Shared.common.endless_load(Reply);
          MR.Box.remove();
          MR.Box = null;
          MR.Children.appendChild(Reply);
          if (Settings.get('qiv') && (!Shared.esgst.qiv.comments || !Shared.esgst.qiv.comments.contains(Reply))) {
            window.location.hash = id;
          }
        } else {
          Shared.common.createElements(DEDStatus, 'inner', [{
            attributes: {
              class: 'fa fa-times'
            },
            type: 'i'
          }, {
            text: 'Failed!',
            type: 'span'
          }]);
        }
      } else {
        if (id) {
          Reply = DOM.parse(JSON.parse(Response.responseText).html).getElementById(id);
          if (Settings.get('rfi') && Settings.get('rfi_s')) {
            await Shared.esgst.modules.commentsReplyFromInbox.rfi_saveReply(id, Reply.outerHTML, MR.url);
          }
          Shared.esgst.modules.commentsReplyMentionLink.rml_addLink(MR.Container, [Reply]);
          await Shared.common.endless_load(Reply);
          MR.Box.remove();
          MR.Box = null;
          MR.Children.appendChild(Reply);
          if (Settings.get('qiv') && (!Shared.esgst.qiv.comments || !Shared.esgst.qiv.comments.contains(Reply))) {
            window.location.hash = id;
          }
        } else {
          Shared.common.createElements(DEDStatus, 'inner', [{
            attributes: {
              class: 'fa fa-times'
            },
            type: 'i'
          }, {
            text: 'Failed!',
            type: 'span'
          }]);
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
    MR.Edit = MR.Context.getElementsByClassName(Shared.esgst.sg ? 'js__comment-edit' : 'js_comment_edit')[0];
    if (MR.Edit) {
      Shared.common.createElements(MR.Edit, 'afterEnd', [{
        attributes: {
          class: 'comment__actions__button esgst-mr-edit'
        },
        text: 'Edit',
        type: 'a'
      }]);
      MR.Edit = MR.Edit.nextElementSibling;
      MR.Edit.previousElementSibling.remove();
      DisplayState = MR.Comment.getElementsByClassName(Shared.esgst.sg ? 'comment__display-state' : 'comment_body_default')[0];
      EditState = MR.Comment.getElementsByClassName(Shared.esgst.sg ? 'comment__edit-state' : 'edit_form')[0];
      EditSave = EditState.querySelector(`.js__comment-edit-save, .js_submit, .EditSave`);
      Shared.common.createElements(EditSave, 'afterEnd', [{
        attributes: {
          class: 'comment__submit-button btn_action white EditSave'
        },
        type: 'a',
        children: [{
          attributes: {
            class: 'fa fa-edit'
          },
          type: 'i'
        }, {
          text: 'Edit',
          type: 'span'
        }]
      }]);
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
        ResponseJSON = JSON.parse((await Shared.common.request({
          data: `xsrf_token=${Session.xsrfToken}&do=comment_edit&comment_id=${ID}&allow_replies=${AllowReplies}&description=${encodeURIComponent(Description.value)}`,
          method: 'POST',
          url: '/ajax.php'
        })).responseText);
        if (ResponseJSON.type === 'success' || ResponseJSON.success) {
          ResponseHTML = DOM.parse(ResponseJSON[Shared.esgst.sg ? 'comment' : 'html']);
          if (Settings.get('rfi') && Settings.get('rfi_s')) {
            let reply = MR.Comment.cloneNode(true);
            if (Shared.esgst.sg) {
              Shared.common.createElements(reply, 'inner', [{
                attributes: {
                  class: 'ajax comment__child'
                },
                type: 'div',
                children: [...(Array.from(ResponseHTML.body.childNodes).map(x => {
                  return {
                    context: x.cloneNode(true)
                  };
                }))]
              }, {
                attributes: {
                  class: 'comment__children'
                },
                type: 'div'
              }]);
            } else {
              Shared.common.createElements(reply, 'inner', [...(Array.from(ResponseHTML.body.childNodes).map(x => {
                return {
                  context: x.cloneNode(true)
                };
              })), {
                attributes: {
                  class: 'comment__children'
                },
                type: 'div'
              }]);
            }
            await Shared.esgst.modules.commentsReplyFromInbox.rfi_saveReply(MR.url.match(/\/comment\/(.+)/)[1], reply.outerHTML, null, true);
          }
          Shared.common.createElements(DisplayState, 'inner', [...(Array.from(ResponseHTML.getElementsByClassName(Shared.esgst.sg ? 'comment__display-state' : 'comment_body_default')[0].childNodes).map(x => {
            return {
              context: x
            };
          }))]);
          EditState.classList.add(Shared.esgst.sg ? 'is-hidden' : 'is_hidden');
          Shared.common.createElements(MR.Timestamp, 'inner', [...(Array.from(ResponseHTML.getElementsByClassName(Shared.esgst.sg ? 'comment__actions' : 'action_list')[0].firstElementChild.childNodes).map(x => {
            return {
              context: x
            };
          }))]);
          if (Settings.get('at')) {
            Shared.esgst.modules.generalAccurateTimestamp.at_getTimestamps(MR.Timestamp);
          }
          if (Settings.get('ged')) {
            await Shared.esgst.ged_addIcons([{
              actions: MR.Container.getElementsByClassName(Shared.esgst.sg ? 'comment__actions' : 'action_list')[0],
              displayState: DisplayState,
              comment: MR.Container,
              id: MR.url.match(/\/comment\/(.+)/)[1]
            }]);
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
    mr.delete = mr.Context.getElementsByClassName(Shared.esgst.sg ? 'js__comment-delete' : 'js_comment_delete')[0];
    if (mr.delete) {
      if (Shared.esgst.sg) {
        allowReplies = mr.delete.parentElement.querySelector(`[name="allow_replies"]`).value;
        id = mr.delete.parentElement.querySelector(`[name="comment_id"]`).value;
        data = `xsrf_token=${Session.xsrfToken}&do=comment_delete&allow_replies=${allowReplies}&comment_id=${id}`;
      } else {
        data = mr.delete.getAttribute('data-form');
      }
      Shared.common.createElements(mr.delete, 'afterEnd', [{
        attributes: {
          class: 'comment__actions__button esgst-mr-delete'
        },
        text: 'Delete',
        type: 'a'
      }]);
      mr.delete = mr.delete.nextElementSibling;
      mr.delete.previousElementSibling.remove();
      mr.delete.addEventListener('click', async () => {
        // noinspection JSIgnoredPromiseFromCall
        this.mr_editReply(mr, await Shared.common.request({ data, method: 'POST', url: '/ajax.php' }));
      });
    }
  }

  mr_setUndelete(mr) {
    let allowReplies, data, id;
    mr.undelete = mr.Context.getElementsByClassName(Shared.esgst.sg ? 'js__comment-undelete' : 'js_comment_undelete')[0];
    if (mr.undelete) {
      if (Shared.esgst.sg) {
        allowReplies = mr.undelete.parentElement.querySelector(`[name="allow_replies"]`).value;
        id = mr.undelete.parentElement.querySelector(`[name="comment_id"]`).value;
        data = `xsrf_token=${Session.xsrfToken}&do=comment_undelete&allow_replies=${allowReplies}&comment_id=${id}`;
      } else {
        data = mr.undelete.getAttribute('data-form');
      }
      Shared.common.createElements(mr.undelete, 'afterEnd', [{
        attributes: {
          class: 'comment__actions__button esgst-mr-undelete'
        },
        text: 'Undelete',
        type: 'a'
      }]);
      mr.undelete = mr.undelete.nextElementSibling;
      mr.undelete.previousElementSibling.remove();
      mr.undelete.addEventListener('click', async () => {
        // noinspection JSIgnoredPromiseFromCall
        this.mr_editReply(mr, await Shared.common.request({ data, method: 'POST', url: '/ajax.php' }));
      });
    }
  }

  async mr_editReply(mr, response) {
    let responseHtml, responseJson;
    responseJson = JSON.parse(response.responseText);
    if (responseJson.type === 'success' || responseJson.success) {
      responseHtml = DOM.parse(responseJson[Shared.esgst.sg ? 'comment' : 'html']);
      if (Shared.esgst.sg) {
        Shared.common.createElements(mr.Container, 'inner', [...(Array.from(responseHtml.getElementsByClassName('comment__summary')[0].childNodes).map(x => {
          return {
            context: x
          };
        }))]);
      } else {
        Shared.common.createElements(mr.Container, 'inner', [...(Array.from(responseHtml.getElementsByClassName('comment_inner')[0].childNodes).map(x => {
          return {
            context: x
          };
        }))]);
      }
      if (Settings.get('rfi') && Settings.get('rfi_s')) {
        let reply = mr.Comment.cloneNode(true);
        if (Shared.esgst.sg) {
          Shared.common.createElements(reply, 'inner', [{
            attributes: {
              class: 'ajax comment__child'
            },
            type: 'div',
            children: [...(Array.from(responseHtml.body.childNodes).map(x => {
              return {
                context: x
              };
            }))]
          }, {
            attributes: {
              class: 'comment__children'
            },
            type: 'div'
          }]);
        } else {
          Shared.common.createElements(reply, 'inner', [...(Array.from(responseHtml.body.childNodes).map(x => {
            return {
              context: x
            };
          })), {
            attributes: {
              class: 'comment__children'
            },
            type: 'div'
          }]);
        }
        await Shared.esgst.modules.commentsReplyFromInbox.rfi_saveReply(mr.url.match(/\/comment\/(.+)/)[1], reply.outerHTML, null, true);
      }
      await Shared.common.endless_load(mr.Container);
    }
  }
}

const commentsMultiReply = new CommentsMultiReply();

export { commentsMultiReply };