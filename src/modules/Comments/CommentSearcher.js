import { Module } from '../../class/Module';
import { Process } from '../../class/Process';
import { shared } from '../../class/Shared';
import { gSettings } from '../../class/Globals';

class CommentsCommentSearcher extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-comments` }],
            ` `,
            [`i`, { class: `fa fa-search` }],
            `) to the main page heading of any page that allows you to search for comments made by specific users in the page.`
          ]]
        ]]
      ],
      id: `cs`,
      name: `Comment Searcher`,
      sg: true,
      st: true,
      type: `comments`
    };
  }

  init() {
    if (!shared.esgst.commentsPath || (shared.esgst.giveawayPath && document.getElementsByClassName(`table--summary`)[0])) return;
    new Process({
      headingButton: {
        id: `cs`,
        icons: [`fa-comments`, `fa-search`],
        title: `Search comments from specific users`
      },
      popup: {
        icon: `fa-comments`,
        title: `Search comments from specific users:`,
        textInputs: [
          {
            placeholder: `username1, username2, ...`
          }
        ],
        options: [
          {
            check: true,
            description: [{
              text: `Limit search by pages, from `,
              type: `node`
            }, {
              attributes: {
                class: `esgst-switch-input`,
                min: `i`,
                name: `cs_minPage`,
                type: `number`,
                value: gSettings.cs_minPage
              },
              type: `input`
            }, {
              text: ` to `,
              type: `node`
            }, {
              attributes: {
                class: `esgst-switch-input`,
                min: `i`,
                name: `cs_maxPage`,
                type: `number`,
                value: gSettings.cs_maxPage
              },
              type: `input`
            }, {
              text: `.`,
              type: `node`
            }],
            id: `cs_limitPages`,
            tooltip: `If unchecked, all pages will be searched.`
          }
        ],
        addProgress: true,
        addScrollable: `left`
      },
      init: this.cs_init.bind(this),
      requests: [
        {
          source: shared.esgst.discussionPath,
          url: shared.esgst.searchUrl,
          request: this.cs_request.bind(this)
        }
      ]
    });
  }

  cs_init(obj) {
    obj.usernames = obj.popup.getTextInputValue(0)
      .toLowerCase()
      .replace(/(,\s*)+/g, this.cs_format.bind(this))
      .split(`, `);
    let match = window.location.pathname.match(/^\/(giveaway|discussion|support\/ticket|trade)\/(.+?)\//);
    obj.code = match[2];
    obj.type = match[1];
    obj.title = shared.esgst.originalTitle.replace(/\s-\sPage\s\d+/, ``);
    obj.results = 0;
    if (gSettings.cs_limitPages) {
      obj.requests[0].nextPage = gSettings.cs_minPage;
      obj.requests[0].maxPage = gSettings.cs_maxPage;
    }
  }

  cs_format(match, p1, offset, string) {
    return (((offset === 0) || (offset === (string.length - match.length))) ? `` : `, `);
  }

  async cs_request(obj, details, response, responseHtml) {
    obj.popup.setProgress(`Searching comments (page ${details.nextPage}${details.maxPage ? ` of ${details.maxPage}` : details.lastPage})..`);
    obj.popup.setOverallProgress(`${obj.results} results found.`);
    let comments = responseHtml.getElementsByClassName(`comments`);
    let elements = (comments[1] || comments[0]).querySelectorAll(`.comment:not(.comment--submit), .comment_outer`);
    let context = obj.popup.getScrollable();
    for (let i = 0, n = elements.length; i < n; i++) {
      let element = elements[i];
      if (shared.esgst.sg) {
        element.firstElementChild.classList.remove(`comment__parent`);
        element.firstElementChild.classList.add(`comment__child`);
      }
      let parent = element.parentElement.closest(`.comment, .comment_outer`);
      element = element.cloneNode(true);
      element.lastElementChild.innerHTML = ``;
      const items = [{
        attributes: {
          class: `comment comments comment_outer`
        },
        type: `div`,
        children: []
      }];
      if (parent) {
        parent = parent.cloneNode(true);
        parent.lastElementChild.remove();
        shared.common.createElements(parent, `beforeEnd`, [{
          attributes: {
            class: `comment__children comment_children`
          },
          type: `div`,
          children: [{
            context: element
          }]
        }]);
        items[0].children.push({
          context: parent
        });
      } else {
        if (shared.esgst.st) {
          shared.common.createElements(element.getElementsByClassName(`action_list`)[0].firstElementChild, `afterEnd`, [{
            attributes: {
              href: `/${obj.type}/${obj.code}/`
            },
            text: `${obj.title} - Page ${details.nextPage}`,
            type: `a`
          }]);
        }
        if (shared.esgst.sg) {
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
                  href: `/${obj.type}/${obj.code}/`
                },
                text: `${obj.title} - Page ${details.nextPage}`,
                type: `a`
              }]
            }]
          });
        }
        items[0].children.push({
          attributes: {
            class: `comment__children comment_children`
          },
          type: `div`,
          children: [{
            context: element
          }]
        });
      }
      if (obj.usernames.indexOf(element.querySelector(`.comment__username, .author_name`).textContent.trim().toLowerCase()) > -1) {
        shared.common.createElements(context, `beforeEnd`, items);
        obj.results += 1;
      }
    }
    obj.popup.setOverallProgress(`${obj.results} results found.`);
    await shared.common.endless_load(context);
  }
}

const commentsCommentSearcher = new CommentsCommentSearcher();

export { commentsCommentSearcher };