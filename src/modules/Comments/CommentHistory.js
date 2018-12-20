import Module from '../../class/Module';
import Process from '../../class/Process';
import { common } from '../Common';

const
  createElements = common.createElements.bind(common),
  createLock = common.createLock.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  getValue = common.getValue.bind(common),
  setValue = common.setValue.bind(common)
  ;

class CommentsCommentHistory extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Replaces SteamGifts' native comment button with a new one, so that ESGST can track your comments.`],
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-comments esgst-yellow` }],
            ` My Comment History) to the dropdown menu accessible by clicking on the arrow next to your avatar at the header of any page that allows you to view your comment history.`
          ]]
        ]]
      ],
      id: `ch`,
      load: this.ch,
      name: `Comment History`,
      sg: true,
      type: `comments`
    };
  }

  ch() {
    if (this.esgst.replyBox) {
      common.addReplyButton(this.esgst.replyBox);
    }
    new Process({
      button: createElements(this.esgst.accountDropdown.firstElementChild.lastElementChild, `beforeBegin`, [{
        attributes: {
          class: `esgst-header-menu-row`,
          [`data-link-id`]: `ch`,
          [`data-link-key`]: `account`,
          title: getFeatureTooltip(`ch`)
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa fa-fw fa-comments yellow`
          },
          type: `i`
        }, {
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-header-menu-name`
            },
            text: `My Comment History`,
            type: `p`
          }, {
            attributes: {
              class: `esgst-header-menu-description`
            },
            text: `View your comment history.`,
            type: `p`
          }]
        }]
      }]),
      popup: {
        icon: `fa-comments`,
        title: `Comment History`,
        addProgress: true,
        addScrollable: `left`
      },
      urls: {
        id: `ch`,
        init: this.ch_initUrls.bind(this),
        perLoad: 5,
        request: {
          request: this.ch_requestUrl.bind(this)
        }
      }
    });
  }

  async ch_initUrls(obj) {
    obj.ids = [];
    let comments = JSON.parse(await getValue(`${this.esgst.name}CommentHistory`, `[]`));
    for (let i = 0, n = comments.length; i < n; i++) {
      obj.ids.push(comments[i].id);
      obj.items.push(`https://${window.location.hostname}/go/comment/${comments[i].id}`);
    }
  }

  ch_requestUrl(obj, details, response, responseHtml) {
    let comment = responseHtml.getElementById(obj.ids[obj.index]);
    if (this.esgst.sg) {
      comment = comment.closest(`.comment`);
      comment.firstElementChild.classList.remove(`comment__parent`);
      comment.firstElementChild.classList.add(`comment__child`);
    }
    comment.lastElementChild.remove();
    let parent = comment.parentElement.closest(`.comment, .comment_outer`);
    const items = [{
      attributes: {
        class: `comment comments comment_outer`
      },
      type: `div`,
      children: []
    }];
    if (parent) {
      parent.lastElementChild.remove();
      createElements(parent, `beforeEnd`, [{
        attributes: {
          class: `comment__children comment_children`
        },
        type: `div`,
        children: [{
          context: comment
        }]
      }]);
      items[0].children.push({
        context: parent
      });
    } else {
      if (this.esgst.st) {
        createElements(comment.getElementsByClassName(`action_list`)[0].firstElementChild, `afterEnd`, [{
          attributes: {
            href: response.finalUrl
          },
          text: responseHtml.title,
          type: `a`
        }]);
      }
      if (this.esgst.sg) {
        items[0].children.push({
          attributes: {
            class: `comments__entity`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `comments__entity__name`
            },
            type: `p`,
            children: [{
              attributes: {
                href: response.finalUrl
              },
              text: responseHtml.title,
              type: `a`
            }]
          }]
        })
      }
      items[0].children.push({
        attributes: {
          class: `comment__children comment_children`
        },
        type: `div`,
        children: [{
          context: comment
        }]
      });
    }
    createElements(obj.context, `beforeEnd`, items);
  }

  async ch_saveComment(id, timestamp) {
    let deleteLock = await createLock(`${this.esgst.name}CommentHistoryLock`, 300);
    let key = `${this.esgst.name}CommentHistory`;
    let comments = JSON.parse(await getValue(key, `[]`));
    comments.unshift({
      id: id,
      timestamp: timestamp
    });
    await setValue(key, JSON.stringify(comments));
    deleteLock();
  }
}

export default CommentsCommentHistory;