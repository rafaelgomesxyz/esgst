import Module from '../class/Module';
import Button from '../class/Button';
import {common} from './Common';

const
  checkVersion = common.checkVersion.bind(common),
  getUser = common.getUser.bind(common),
  sortContent = common.sortContent.bind(common)
;

class Discussions extends Module {
  constructor() {
    super();
    this.info = {
      endless: true,
      id: `discussions`,
      load: this.discussions.bind(this)
    };
  }

  discussions() {
    this.esgst.endlessFeatures.push(this.discussions_load.bind(this));
  }

  async discussions_load(context, main, source, endless) {
    let discussions = await this.discussions_get(context, main, endless);
    if (!discussions.length) return;
    if (main) {
      for (let i = discussions.length - 1; i > -1; --i) {
        discussions[i].sortIndex = this.esgst.mainDiscussions.length;
        this.esgst.mainDiscussions.push(discussions[i]);
      }
    } else {
      for (let i = discussions.length - 1; i > -1; --i) {
        discussions[i].sortIndex = this.esgst.popupDiscussions.length;
        this.esgst.popupDiscussions.push(discussions[i]);
      }
    }
    if (!main || this.esgst.discussionsPath) {
      if (this.esgst.df && this.esgst.df.filteredCount && this.esgst[`df_enable${this.esgst.df.type}`]) {
        this.esgst.modules.giveawaysGiveawayFilters.filters_filter(this.esgst.df, false, endless);
      }
      if (this.esgst.ds && this.esgst.ds_auto) {
        sortContent(this.esgst.mainDiscussions, null, this.esgst.ds_option);
      }
    }
    if (this.esgst.mm_enableDiscussions && this.esgst.mm_enable) {
      this.esgst.mm_enable(this.esgst[main ? `mainDiscussions` : `popupDiscussions`], `Discussions`);
    }
    for (const feature of this.esgst.discussionFeatures) {
      await feature(discussions);
    }
  }

  async discussions_get(context, main, endless) {
    let discussions = [];
    let elements = context.querySelectorAll(`.esgst-dt-menu`);
    for (const element of elements) {
      const id = element.getAttribute(`href`).match(/\/discussion\/(.+?)\//)[1];
      discussions.push({
        code: id,
        container: element.parentElement,
        context: element,
        id,
        menu: true,
        name: element.textContent.trim(),
        saved: this.esgst.discussions[id],
        tagContext: element,
        tagPosition: `afterEnd`
      });
    }
    elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .table__row-outer-wrap, .esgst-es-page-${endless}.table__row-outer-wrap` : `.table__row-outer-wrap`}`);
    for (let i = elements.length - 1; i > -1; --i) {
      let discussion = await this.discussions_getInfo(elements[i], main);
      if (!discussion) continue;
      discussions.push(discussion);
    }
    if (context === document && main && this.esgst.discussionPath) {
      let discussion = {
        code: location.pathname.match(/^\/discussion\/(.+?)\//)[1],
        heading: document.getElementsByClassName(`page__heading__breadcrumbs`)[0],
        headingContainer: document.getElementsByClassName(`page__heading`)[0]
      };
      discussion.id = discussion.code;
      discussion.container = discussion.headingContainer;
      discussion.tagContext = discussion.container.querySelector(`[href*="/discussion/"]`);
      discussion.name = discussion.tagContext.textContent.trim();
      discussion.tagPosition = `afterEnd`;
      discussion.saved = this.esgst.discussions[discussion.code];
      discussion.title = discussion.heading.getElementsByTagName(`H1`)[0].textContent.trim();
      checkVersion(discussion);
      discussion.category = discussion.heading.firstElementChild.nextElementSibling.nextElementSibling.textContent;
      discussions.push(discussion);
    }
    discussions.forEach(discussion => {
      if (discussion.menu) {
        return;
      }
      let savedDiscussion = this.esgst.discussions[discussion.code];
      if (this.esgst.codb && discussion.author === this.esgst.username && !discussion.heading.parentElement.getElementsByClassName(`esgst-codb-button`)[0]) {
        if (discussion.closed) {
          discussion.closed.remove();
          discussion.closed = true;
        }
        new Button(discussion.headingContainer.firstElementChild, `beforeBegin`, {
          callbacks: [this.esgst.modules.discussionsCloseOpenDiscussionButton.codb_close.bind(null, discussion), null, this.esgst.modules.discussionsCloseOpenDiscussionButton.codb_open.bind(null, discussion), null],
          className: `esgst-codb-button`,
          icons: [`fa-lock esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-lock esgst-clickable esgst-red`, `fa-circle-o-notch fa-spin`],
          id: `codb`,
          index: discussion.closed ? 2 : 0,
          titles: [`Close discussion`, `Closing discussion...`, `Open discussion`, `Opening discussion...`]
        });
      }
      if (this.esgst.df && this.esgst.df_s && !discussion.heading.parentElement.getElementsByClassName(`esgst-df-button`)[0]) {
        new Button(discussion.headingContainer.firstElementChild, `beforeBegin`, {
          callbacks: [this.esgst.modules.discussionsDiscussionFilters.df_hideDiscussion.bind(null, discussion, main), null, this.esgst.modules.discussionsDiscussionFilters.df_unhideDiscussion.bind(null, discussion, main), null],
          className: `esgst-df-button`,
          icons: [`fa-eye-slash esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-eye esgst-clickable`, `fa-circle-o-notch fa-spin`],
          id: `df_s`,
          index: savedDiscussion && savedDiscussion.hidden ? 2 : 0,
          titles: [`Hide discussion`, `Hiding discussion...`, `Unhide discussion`, `Unhiding discussion...`]
        });
      }
      if (this.esgst.dh && !discussion.heading.parentElement.getElementsByClassName(`esgst-dh-button`)[0]) {
        let context = main && this.esgst.discussionPath ? discussion.heading : discussion.outerWrap;
        let index = 0;
        if (savedDiscussion && savedDiscussion.highlighted) {
          // noinspection JSIgnoredPromiseFromCall
          this.esgst.modules.discussionsDiscussionHighlighter.dh_highlightDiscussion(discussion.code, context);
          if (this.esgst.dh_t && main && this.esgst.discussionsPath) {
            discussion.outerWrap.parentElement.insertBefore(discussion.outerWrap, discussion.outerWrap.parentElement.firstElementChild);
            discussion.isPinned = true;
          }
          index = 2;
        }
        discussion.dhButton = new Button(discussion.heading.parentElement, `afterBegin`, {
          callbacks: [this.esgst.modules.discussionsDiscussionHighlighter.dh_highlightDiscussion.bind(null, discussion.code, context, true), null, this.esgst.modules.discussionsDiscussionHighlighter.dh_unhighlightDiscussion.bind(null, discussion.code, context, true), null],
          className: `esgst-dh-button`,
          icons: [`fa-star-o esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-star esgst-clickable`, `fa-circle-o-notch fa-spin`],
          id: `dh`,
          index: index,
          titles: [`Click to highlight this discussion`, `Highlighting discussion...`, `Click to unhighlight this discussion`, `Unhighlighting discussion...`]
        });
      }
      if (this.esgst.pm && (this.esgst.pm_a || discussion.category === `Puzzles`)) {
        let context = main && this.esgst.discussionPath ? discussion.headingContainer : discussion.outerWrap;
        if (!context.getElementsByClassName(`esgst-pm-button`)[0]) {
          context.classList.add(`esgst-relative`);
          new Button(context, `afterBegin`, {
            callbacks: [this.esgst.modules.discussionsPuzzleMarker.pm_change.bind(null, discussion.code, `unsolved`), null, this.esgst.modules.discussionsPuzzleMarker.pm_change.bind(null, discussion.code, `in progress`), null, this.esgst.modules.discussionsPuzzleMarker.pm_change.bind(null, discussion.code, `solved`), null, this.esgst.modules.discussionsPuzzleMarker.pm_change.bind(null, discussion.code, `off`), null],
            className: `esgst-pm-button`,
            icons: [`fa-circle-o esgst-clickable esgst-grey`, `fa-circle-o-notch fa-spin`, `fa-times-circle esgst-clickable esgst-red`, `fa-circle-o-notch fa-spin`, `fa-exclamation-circle esgst-clickable esgst-orange`, `fa-circle-o-notch fa-spin`, `fa-check-circle esgst-clickable esgst-green`, `fa-circle-o-notch fa-spin`],
            id: `pm`,
            index: [`off`, ``, `unsolved`, ``, `in progress`, ``, `solved`].indexOf((savedDiscussion && savedDiscussion.status) || `off`),
            titles: [`Current status is 'off', click to change to 'unsolved'`, `Changing status...`, `Current status is 'unsolved', click to change to 'in progress'`, `Changing status...`, `Current status is 'in progress', click to change to 'solved'`, `Changing status...`, `Current status is 'solved', click to change to 'off'`, `Changing status...`]
          });
        }
      }
    });
    return discussions;
  }

  async discussions_getInfo(context, main) {
    let match, discussion, savedUser, uf;
    if (context.closest(`.poll`)) return;
    discussion = {};
    discussion.outerWrap = context;
    discussion.innerWrap = discussion.outerWrap.getElementsByClassName(`table__row-inner-wrap`)[0];
    if (!discussion.innerWrap) return;
    discussion.avatarColumn = discussion.innerWrap.firstElementChild;
    if (!discussion.avatarColumn) return;
    discussion.avatar = discussion.avatarColumn.firstElementChild;
    if (!discussion.avatar) return;
    discussion.headingColumn = discussion.avatarColumn.nextElementSibling;
    discussion.headingContainer = discussion.headingColumn.firstElementChild;
    if (!discussion.headingContainer) return;
    discussion.closed = discussion.headingContainer.getElementsByClassName(`fa-lock`)[0];
    discussion.heading = discussion.headingContainer.lastElementChild;
    discussion.info = discussion.headingContainer.nextElementSibling;
    if (!discussion.heading) {
      return;
    }
    discussion.title = discussion.heading.textContent;
    discussion.url = discussion.heading.getAttribute(`href`);
    if (!discussion.url) {
      return;
    }
    match = discussion.url.match(/discussion\/(.+?)\//);
    if (!match) {
      return;
    }
    discussion.code = match[1];
    checkVersion(discussion);
    if (main && this.esgst.df && this.esgst.df_s && this.esgst.discussions[discussion.code] && this.esgst.discussions[discussion.code].hidden) {
      discussion.outerWrap.remove();
      return;
    }
    if (this.esgst.discussions[discussion.code]) {
      discussion.highlighted = this.esgst.discussions[discussion.code].highlighted;
      discussion.visited = this.esgst.discussions[discussion.code].visited;
    }
    discussion.categoryContainer = discussion.info.firstElementChild;
    if (discussion.headingColumn.nextElementSibling) {
      discussion.category = discussion.categoryContainer.textContent;
      discussion[discussion.category.replace(/\W/g, ``).replace(/^(.)/, (m, p1) => {
        return p1.toLowerCase();
      })] = true;
    } else {
      discussion.category = ``;
    }
    discussion.createdContainer = discussion.categoryContainer.nextElementSibling;
    if (discussion.createdContainer) {
      discussion.createdTime = discussion.createdContainer.textContent;
      discussion.createdTimestamp = parseInt(discussion.createdContainer.getAttribute(`data-timestamp`)) * 1e3;
      if (this.esgst.giveawaysPath) {
        discussion.author = discussion.avatar.getAttribute(`href`).match(/\/user\/(.+)/)[1];
      } else {
        discussion.author = discussion.createdContainer.nextElementSibling.textContent;
      }
    }
    if (!discussion.author) return;
    discussion.authors = [discussion.author.toLowerCase()];
    discussion.created = discussion.author === this.esgst.username;
    discussion.poll = discussion.outerWrap.getElementsByClassName(`fa-align-left`)[0];
    discussion.commentsColumn = discussion.headingColumn.nextElementSibling || discussion.headingColumn.children[1];
    if (discussion.commentsColumn) {
      discussion.comments = parseInt(discussion.commentsColumn.firstElementChild.textContent.replace(/,/g, ``));
      if (this.esgst.giveawaysPath && this.esgst.adots && this.esgst.adots_index === 1 && this.esgst.ns) {
        discussion.commentsColumn.firstElementChild.textContent = discussion.commentsColumn.firstElementChild.textContent.replace(/\sComments/, ``);
      }
    }
    discussion.lastPost = discussion.outerWrap.getElementsByClassName(`table__column--last-comment`)[0];
    if (discussion.lastPost && discussion.lastPost.firstElementChild) {
      discussion.lastPostTime = discussion.lastPost.firstElementChild.firstElementChild;
      discussion.lastPostAuthor = discussion.lastPostTime.nextElementSibling;
      discussion.lastPostCode = discussion.lastPostAuthor.lastElementChild.getAttribute(`href`).match(/\/comment\/(.+)/)[1];
      discussion.lastPostAuthor = discussion.lastPostAuthor.firstElementChild.textContent;
      discussion.lastPostTime = discussion.lastPostTime.firstElementChild;
      discussion.lastPostTimestamp = discussion.lastPostTime.getAttribute(`data-timestamp`);
      discussion.lastPostTime = discussion.lastPostTime.textContent;
    }
    discussion.id = discussion.code;
    discussion.name = discussion.title;
    discussion.container = discussion.headingContainer;
    discussion.tagContext = discussion.headingContainer;
    discussion.tagPosition = `beforeEnd`;
    discussion.saved = this.esgst.discussions[discussion.code];
    if (this.esgst.uf) {
      savedUser = await getUser(this.esgst.users, {
        username: discussion.author
      });
      if (savedUser) {
        uf = savedUser.uf;
        if (this.esgst.uf_d && savedUser.blacklisted && !uf) {
          if (!this.esgst.giveawaysPath) {
            this.esgst.modules.usersUserFilters.uf_updateCount(discussion.outerWrap.parentElement.parentElement.nextElementSibling);
          }
          discussion.outerWrap.remove();
          return;
        } else if (uf && uf.discussions) {
          if (!this.esgst.giveawaysPath) {
            this.esgst.modules.usersUserFilters.uf_updateCount(discussion.outerWrap.parentElement.parentElement.nextElementSibling);
          }
          discussion.outerWrap.remove();
          return;
        }
      }
    }
    return discussion;
  }
}

export default Discussions;