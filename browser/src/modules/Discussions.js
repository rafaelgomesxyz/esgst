import { Module } from '../class/Module';
import {common} from './Common';
import { gSettings } from '../class/Globals';
import { shared } from '../class/Shared';

const
  getUser = common.getUser.bind(common),
  sortContent = common.sortContent.bind(common)
;

class Discussions extends Module {
  constructor() {
    super();
    this.info = {
      endless: true,
      id: 'discussions',
      featureMap: {
        endless: this.discussions_load.bind(this)
      }
    };
  }

  async discussions_load(context, main, source, endless) {
    let discussions = await this.discussions_get(context, main, endless);
    if (!discussions.length) return;
    for (let i = discussions.length - 1; i > -1; --i) {
      discussions[i].sortIndex = this.esgst.currentScope.discussions.length;
      switch (discussions[i].type) {
        case 'discussion':
          this.esgst.currentScope.discussions.push(discussions[i]);
          break;
        case 'trade':
          this.esgst.currentScope.trades.push(discussions[i]);
          break;
      }
    }
    if (!main || this.esgst.discussionsPath) {
      if (main && shared.esgst.df && this.esgst.df.filteredCount && gSettings[`df_enable${this.esgst.df.type}`]) {
        this.esgst.modules.discussionsDiscussionFilters.filters_filter(this.esgst.df, false, endless);
      }
      if (gSettings.ds && gSettings.ds_auto) {
        sortContent(this.esgst.scopes.main.discussions, gSettings.ds_option);
      }
    }
    if (!main || this.esgst.tradesPath) {
      if (main && shared.esgst.tf && this.esgst.tf.filteredCount && gSettings[`tf_enable${this.esgst.tf.type}`]) {
        this.esgst.modules.tradesTradeFilters.filters_filter(this.esgst.tf, false, endless);
      }
    }
    if (gSettings.mm_enableDiscussions && this.esgst.mm_enable) {
      this.esgst.mm_enable(this.esgst.currentScope.discussions, 'Discussions');
    }
    for (const feature of this.esgst.discussionFeatures) {
      await feature(discussions.filter(x => !x.menu && x.type === 'discussion'), main);
    }
    for (const feature of this.esgst.tradeFeatures) {
      await feature(discussions.filter(x => !x.menu && x.type === 'trade'), main);
    }
  }

  async discussions_get(context, main, endless) {
    let discussions = [];
    let elements = context.querySelectorAll('.esgst-dt-menu');
    for (const element of elements) {
      const id = element.getAttribute('href').match(/\/discussion\/(.+?)\//)[1];
      discussions.push({
        code: id,
        container: element.parentElement,
        context: element,
        id,
        menu: true,
        name: element.textContent.trim(),
        saved: this.esgst.discussions[id],
        tagContext: element,
        tagPosition: 'afterEnd',
        sortIndex: 0,
        type: ``
      });
    }
    elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .table__row-outer-wrap, .esgst-es-page-${endless} .row_outer_wrap, .esgst-es-page-${endless}.table__row-outer-wrap, .esgst-es-page-${endless}.row_outer_wrap` : `.table__row-outer-wrap, .row_outer_wrap`}`);
    for (let i = elements.length - 1; i > -1; --i) {
      let discussion = await this.discussions_getInfo(elements[i], main);
      if (!discussion) continue;
      discussions.push(discussion);
    }
    if (context === document && main && this.esgst.discussionPath) {
      let discussion = {
        code: window.location.pathname.match(/^\/discussion\/(.+?)\//)[1],
        heading: document.getElementsByClassName('page__heading__breadcrumbs')[0],
        headingContainer: document.getElementsByClassName('page__heading')[0],
        menu: false,
        sortIndex: 0,
        type: ``
      };
      discussion.id = discussion.code;
      discussion.container = discussion.headingContainer;
      discussion.tagContext = discussion.container.querySelector(`[href*="/discussion/"]`);
      discussion.name = discussion.tagContext.textContent.trim();
      discussion.tagPosition = 'afterEnd';
      discussion.saved = this.esgst.discussions[discussion.code];
      discussion.title = discussion.heading.getElementsByTagName('H1')[0].textContent.trim();
      discussion.category = discussion.heading.firstElementChild.nextElementSibling.nextElementSibling.textContent;
      discussion.type = 'discussion';
      discussions.push(discussion);
    }
    return discussions;
  }

  async discussions_getInfo(context, main) {
    let match;
    if (context.closest('.poll')) {
      return;
    }
    const discussion = {};
    discussion.menu = false;
    discussion.sortIndex = 0;
    discussion.outerWrap = context;
    discussion.innerWrap = discussion.outerWrap.querySelector(`.table__row-inner-wrap, .row_inner_wrap`);
    if (!discussion.innerWrap) {
      return;
    }
    discussion.avatarColumn = discussion.innerWrap.firstElementChild;
    if (!discussion.avatarColumn) {
      return;
    }
    discussion.avatar = discussion.avatarColumn.firstElementChild;
    if (!discussion.avatar) {
      return;
    }
    discussion.headingColumn = discussion.avatarColumn.nextElementSibling;
    discussion.headingContainer = discussion.headingColumn.firstElementChild;
    if (!discussion.headingContainer) {
      return;
    }
    discussion.bookmarkNode = discussion.headingColumn.querySelector('.icon-heading.fa.fa-bookmark, .icon-heading.fa.fa-bookmark-o');
    discussion.closed = discussion.headingContainer.querySelector('.fa-lock');
    discussion.heading = discussion.headingContainer.lastElementChild;
    discussion.info = discussion.headingContainer.nextElementSibling;
    if (!discussion.heading) {
      return;
    }
    discussion.title = discussion.heading.textContent;
    discussion.url = discussion.heading.getAttribute('href');
    if (!discussion.url) {
      return;
    }
    match = discussion.url.match(/(discussion|trade)\/(.+?)\//);
    if (!match) {
      return;
    }
    discussion.type = match[1];
    discussion.code = match[2];
    switch (discussion.type) {
      case 'discussion':
        discussion.saved = this.esgst.discussions[discussion.code];
        if (main && gSettings.df && gSettings.df_s && discussion.saved && discussion.saved.hidden) {
          discussion.outerWrap.classList.add('esgst-hidden');
          discussion.outerWrap.setAttribute('data-esgst-not-filterable', 'df');
          if (gSettings.df_s_s) {
            shared.esgst.modules.discussionsDiscussionFilters.updateSingleCounter();
          }
          return;
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
        break;
      case 'trade':
        discussion.saved = this.esgst.trades[discussion.code];
        if (main && gSettings.tf && gSettings.tf_s && discussion.saved && discussion.saved.hidden) {
          discussion.outerWrap.classList.add('esgst-hidden');
          discussion.outerWrap.setAttribute('data-esgst-not-filterable', 'df');
          if (gSettings.tf_s_s) {
            shared.esgst.modules.tradesTradeFilters.updateSingleCounter();
          }
          return;
        }
        discussion.createdContainer = discussion.info.firstElementChild;
        discussion.reputationElement = discussion.info.querySelector('.reputation');
        discussion.positiveReputationElement = discussion.reputationElement.querySelector('.is_positive');
        discussion.negativeReputationElement = discussion.reputationElement.querySelector('.is_negative');
        discussion.positiveReputation = parseInt(discussion.positiveReputationElement.textContent.replace(/[^\d]/g, ``));
        discussion.negativeReputation = parseInt(discussion.negativeReputationElement.textContent.replace(/[^\d]/g, ``));
        break;
    }
    discussion.bookmarked = !!discussion.bookmarkNode;
    if (discussion.saved) {
      discussion.visited = discussion.saved.visited;
      discussion.subscribed = typeof discussion.saved.subscribed !== 'undefined';
    }
    if (discussion.createdContainer) {
      discussion.createdTime = discussion.createdContainer.textContent;
      discussion.createdTimestamp = parseInt(discussion.createdContainer.getAttribute('data-timestamp')) * 1e3;
      if (this.esgst.giveawaysPath) {
        discussion.author = discussion.avatar.getAttribute('href').match(/\/user\/(.+)/)[1];
      } else {
        discussion.author = discussion.createdContainer.nextElementSibling.textContent;
      }
    }
    if (!discussion.author) {
      return;
    }
    discussion.authors = [discussion.author.toLowerCase()];
    discussion.created = discussion.author === gSettings.username;
    discussion.poll = discussion.outerWrap.querySelector('.fa-align-left');
    discussion.commentsColumn = discussion.headingColumn.nextElementSibling || discussion.headingColumn.children[1];
    if (discussion.commentsColumn) {
      discussion.comments = parseInt(discussion.commentsColumn.firstElementChild.textContent.replace(/,/g, ``));
      if (this.esgst.giveawaysPath && gSettings.adots && gSettings.adots_index === 1 && gSettings.ns) {
        discussion.commentsColumn.firstElementChild.textContent = discussion.commentsColumn.firstElementChild.textContent.replace(/\sComments/, ``);
      }
    }
    discussion.lastPost = discussion.outerWrap.querySelector(`.table__column--last-comment, .column_last_update`);
    if (discussion.lastPost && discussion.lastPost.firstElementChild) {
      discussion.lastPostTime = discussion.lastPost.firstElementChild.firstElementChild;
      discussion.lastPostAuthor = discussion.lastPostTime.nextElementSibling;
      discussion.lastPostCode = discussion.lastPostAuthor.lastElementChild.getAttribute('href').match(/\/comment\/(.+)/);
      if (discussion.lastPostCode) {
        discussion.lastPostCode = discussion.lastPostCode[1];
        discussion.wasLastPostBump = false;
      } else {
        discussion.lastPostCode = null;
        discussion.wasLastPostBump = true;
      }
      discussion.lastPostAuthor = discussion.lastPostAuthor.firstElementChild.textContent;
      discussion.lastPostTime = discussion.lastPostTime.firstElementChild;
      discussion.lastPostTimestamp = discussion.lastPostTime.getAttribute('data-timestamp');
      discussion.lastPostTime = discussion.lastPostTime.textContent;
    }
    discussion.id = discussion.code;
    discussion.name = discussion.title;
    discussion.container = discussion.headingContainer;
    discussion.tagContext = discussion.headingContainer;
    discussion.tagPosition = 'beforeEnd';
    return discussion;
  }
}

const discussionsModule = new Discussions();

export { discussionsModule };