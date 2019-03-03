import Module from '../../class/Module';
import Button from '../../class/Button';
import Process from '../../class/Process';
import { common } from '../Common';

const
  createElements = common.createElements.bind(common),
  createLock = common.createLock.bind(common),
  generateHeaderMenuItem = common.generateHeaderMenuItem.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  getValue = common.getValue.bind(common),
  setValue = common.setValue.bind(common)
  ;

class DiscussionsDiscussionHighlighter extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-star` }],
            ` if the discussion is highlighted and `,
            [`i`, { class: `fa fa-star-o` }],
            ` if it is not) next to a discussion's title (in any page) that allows you to highlight the discussion.`
          ]],
          [`li`, `Highlighted discussions have a green background.`],
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-star esgst-yellow` }],
            ` View Highlighted) to the dropdown menu accessible by clicking on the arrow in the "Discussions" box at the header of any page that allows you to view all of the discussions that have been highlighted.`
          ]]
        ]]
      ],
      features: {
        dh_t: {
          name: `Pin any highlighted discussions in the page.`,
          sg: true
        }
      },
      id: `dh`,
      load: this.dh,
      name: `Discussion Highlighter`,
      sg: true,
      type: `discussions`
    };
  }

  dh() {
    new Process({
      button: createElements(this.esgst.discussionsDropdown.firstElementChild, `beforeEnd`, generateHeaderMenuItem({
        description: `View your highlighted discussions.`,
        icon: `fa-star yellow`,
        id: `dh`,
        name: `View Highlighted`,
        title: getFeatureTooltip(`dh`)
      })),
      popup: {
        icon: `fa-star`,
        title: `Highlighted Discussions`,
        addProgress: true,
        addScrollable: `left`
      },
      urls: {
        id: `dh`,
        init: this.dh_initUrls.bind(this),
        perLoad: 5,
        request: {
          request: this.dh_requestUrl.bind(this)
        }
      }
    });
    this.esgst.discussionFeatures.push(this.dh_addButtons.bind(this));
  }

  async dh_initUrls(obj) {
    let discussions = JSON.parse(getValue(`discussions`));
    obj.keys = [];
    for (let key in discussions) {
      if (discussions.hasOwnProperty(key)) {
        let discussion = discussions[key];
        if (!discussion.highlighted) continue;
        obj.keys.push(key);
        obj.items.push(`/discussion/${key}/`);
      }
    }
    obj.mainContext = obj.popup.getScrollable([{
      attributes: {
        class: `table esgst-text-left`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `table__heading`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__column--width-fill`
          },
          text: `Summary`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small text-center`
          },
          text: `Comments`,
          type: `div`
        }]
      }]
    }]).lastElementChild;
    obj.contextHtml = [{
      attributes: {
        class: `table__rows`
      },
      type: `div`
    }];
  }

  dh_requestUrl(obj, details, response, responseHtml) {
    let key = obj.keys[obj.index];
    let breadcrumbs = responseHtml.getElementsByClassName(`page__heading__breadcrumbs`);
    let categoryLink = breadcrumbs[0].firstElementChild.nextElementSibling.nextElementSibling;
    let usernameLink = responseHtml.getElementsByClassName(`comment__username`)[0].firstElementChild;
    createElements(obj.context, `beforeEnd`, [{
      type: `div`,
      children: [{
        attributes: {
          class: `table__row-outer-wrap`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__row-inner-wrap`
          },
          type: `div`,
          children: [{
            type: `div`,
            children: [{
              context: responseHtml.getElementsByClassName(`global__image-outer-wrap`)[0]
            }]
          }, {
            attributes: {
              class: `table__column--width-fill`
            },
            type: `div`,
            children: [{
              type: `h3`,
              children: [{
                attributes: {
                  class: `table__column__heading`,
                  href: `/discussion/${key}/`
                },
                text: categoryLink.nextElementSibling.nextElementSibling.firstElementChild.textContent,
                type: `a`
              }]
            }, {
              type: `p`,
              children: [{
                attributes: {
                  class: `table__column__secondary-link`,
                  href: categoryLink.getAttribute(`href`)
                },
                text: categoryLink.textContent,
                type: `a`
              }, {
                text: ` - `,
                type: `node`
              }, {
                context: responseHtml.querySelector(`.comment [data-timestamp]`)
              }, {
                text: ` ago by `,
                type: `node`
              }, {
                attributes: {
                  class: `table__column__secondary-link`,
                  href: usernameLink.getAttribute(`href`)
                },
                text: usernameLink.textContent,
                type: `a`
              }]
            }]
          }, {
            attributes: {
              class: `table__column--width-small text-center`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__column__secondary-link`,
                href: `/discussion/${key}/`
              },
              text: breadcrumbs[1].textContent.match(/(.+) Comments?/)[1],
              type: `a`
            }]
          }]
        }]
      }]
    }]);
  }

  dh_addButtons(discussions, main) {
    for (const discussion of discussions) {
      if (!discussion.heading.parentElement.getElementsByClassName(`esgst-dh-button`)[0]) {
        let context = main && this.esgst.discussionPath ? discussion.heading : discussion.outerWrap;
        let index = 0;
        if (discussion.saved && discussion.saved.highlighted) {
          // noinspection JSIgnoredPromiseFromCall
          this.dh_highlightDiscussion(discussion.code, context);
          if (this.esgst.dh_t && main && this.esgst.discussionsPath) {
            discussion.outerWrap.parentElement.insertBefore(discussion.outerWrap, discussion.outerWrap.parentElement.firstElementChild);
            discussion.isPinned = true;
          }
          index = 2;
        }
        discussion.dhButton = new Button(discussion.heading.parentElement, `afterBegin`, {
          callbacks: [this.dh_highlightDiscussion.bind(this, discussion.code, context, true), null, this.dh_unhighlightDiscussion.bind(this, discussion.code, context, true), null],
          className: `esgst-dh-button`,
          icons: [`fa-star-o esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-star esgst-clickable`, `fa-circle-o-notch fa-spin`],
          id: `dh`,
          index: index,
          titles: [`Click to highlight this discussion`, `Highlighting discussion...`, `Click to unhighlight this discussion`, `Unhighlighting discussion...`]
        });
      }
    }
  }

  async dh_highlightDiscussion(code, context, save) {
    if (save) {
      let deleteLock = await createLock(`commentLock`, 300);
      const comments = JSON.parse(getValue(`discussions`));
      if (!comments[code]) {
        comments[code] = {
          readComments: {}
        };
      }
      comments[code].highlighted = true;
      comments[code].lastUsed = Date.now();
      await setValue(`discussions`, JSON.stringify(comments));
      context.classList.add(`esgst-dh-highlighted`);
      deleteLock();
    } else {
      context.classList.add(`esgst-dh-highlighted`);
    }
    return true;
  }

  async dh_unhighlightDiscussion(code, context, save) {
    if (save) {
      let deleteLock = await createLock(`commentLock`, 300);
      const comments = JSON.parse(getValue(`discussions`));
      delete comments[code].highlighted;
      comments[code].lastUsed = Date.now();
      await setValue(`discussions`, JSON.stringify(comments));
      context.classList.remove(`esgst-dh-highlighted`);
      deleteLock();
    } else {
      context.classList.remove(`esgst-dh-highlighted`);
    }
    return true;
  }
}

export default DiscussionsDiscussionHighlighter;