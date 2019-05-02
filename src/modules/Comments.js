import { Module } from '../class/Module';
import {common} from './Common';
import { shared } from '../class/Shared';
import { gSettings } from '../class/Globals';

const
  getUser = common.getUser.bind(common),
  getValue = common.getValue.bind(common)
;

class Comments extends Module {
  constructor() {
    super();
    this.info = {
      endless: true,
      id: `comments`,
      featureMap: {
        endless: this.comments_load.bind(this)
      }
    };
  }

  async comments_load(context, main, source, endless, mainEndless) {
    let count, comments, i, n;
    comments = await this.comments_get(context, document, main, endless);
    if (!comments.length) return;
    for (i = 0, n = comments.length; i < n; ++i) {
      comments[i].index = i;
      this.esgst.currentScope.comments.push(comments[i]);
    }
    if (!main || this.esgst.commentsPath || shared.common.isCurrentPath(`Messages`)) {
      if (shared.esgst.cf && this.esgst.cf.filteredCount && gSettings[`cf_enable${this.esgst.cf.type}`]) {
        this.esgst.modules.commentsCommentFilters.filters_filter(this.esgst.cf, false, endless);
      }
      if (this.esgst.cfPopup && this.esgst.cfPopup.filteredCount && gSettings[`cf_enable${this.esgst.cfPopup.type}`]) {
        this.esgst.modules.commentsCommentFilters.filters_filter(this.esgst.cfPopup, false, endless);
      }
    }
    if (gSettings.ct) {
      if (!main || shared.common.isCurrentPath(`Messages`)) {
        count = 0;
      } else {
        count = context.getElementsByClassName(`page__heading__breadcrumbs`)[1];
        if (count) {
          count = parseInt(count.firstElementChild.textContent.replace(/,/g, ``).match(/\d+/)[0]);
        } else {
          count = 0;
        }
      }
      // noinspection JSIgnoredPromiseFromCall
      this.esgst.modules.commentsCommentTracker.ct_getComments(count, comments, null, false, false, false, main || endless || mainEndless);
    }
    if (gSettings.rfi) {
      if (gSettings.rfi_s && (!main || shared.common.isCurrentPath(`Messages`)) && (!context.getAttribute || !context.getAttribute(`data-rfi`))) {
        await this.esgst.modules.commentsReplyFromInbox.rfi_getReplies(comments, main || endless || mainEndless);
      }
    }
    if (gSettings.ged) {
      this.esgst.ged_addIcons(comments);
    }
  }

  async comments_get(context, mainContext, main, endless) {
    let comment, comments, i, matches, sourceLink;
    comments = [];
    matches = context.querySelectorAll(common.getSelectors(endless, [
      `X:not(.comment--submit) > .comment__parent`,
      `X.comment__child`,
      `X.comment_inner`
    ]));
    sourceLink = mainContext.querySelector(`.page__heading__breadcrumbs a[href*="/giveaway/"], .page__heading__breadcrumbs a[href*="/discussion/"], .page__heading__breadcrumbs a[href*="/ticket/"], .page_heading_breadcrumbs a[href*="/trade/"]`);
    for (i = matches.length - 1; i >= 0; --i) {
      comment = await this.comments_getInfo(matches[i], shared.esgst.currentScope.sourceLink || sourceLink, endless ? this.esgst.users : JSON.parse(getValue(`users`)), main);
      if (comment) {
        comments.push(comment);
      }
    }
    return comments;
  }

  async comments_getInfo(context, sourceLink, savedUsers, main) {
    let matches, n, source;
    const comment = {};
    comment.comment = context;
    comment.outerWrap = comment.comment;
    const author = comment.comment.querySelector(`.comment__author, .author_name`);
    if (!author) {
      return;
    }
    comment.author = author.textContent.trim();
    if (gSettings.uf && savedUsers) {
      let savedUser = await getUser(savedUsers, {
        username: comment.author
      });
      if (savedUser) {
        let uf = savedUser.uf, comments;
        if ((gSettings.uf_p && savedUser.blacklisted && !uf) || (uf && uf.posts)) {
          let numDescendants;
          if (comment.comment.nextElementSibling) {
            numDescendants = comment.comment.nextElementSibling.querySelectorAll(`:not(.comment--submit) > .comment__parent, .comment__child, .comment_inner`).length;
          } else {
            numDescendants = 0;
          }
          comment.comment.parentElement.classList.add(`esgst-hidden`);
          comment.comment.parentElement.setAttribute(`data-esgst-not-filterable`, `true`);
          shared.common.filteredCount.textContent = parseInt(shared.common.filteredCount.textContent) + 1 + numDescendants;
          shared.common.filteredButton.classList.remove(`esgst-hidden`);
          if (!main || shared.common.isCurrentPath(`Messages`)) {
            comments = comment.comment.closest(`.comments`);
            if (!comments.querySelectorAll(`.comment:not([data-esgst-not-filterable])`).length) {
              comments.previousElementSibling.classList.add(`esgst-hidden`);
              comments.previousElementSibling.setAttribute(`data-esgst-not-filterable`, `true`);
              comments.classList.add(`esgst-hidden`);
              comments.setAttribute(`data-esgst-not-filterable`, `true`);
            }
          }
        }
      }
    }
    comment.summary = comment.comment.querySelector(`.comment__summary`, `.comment_inner`);
    comment.displayState = comment.comment.querySelector(`.comment__display-state, .comment_body_default`);
    comment.text = comment.displayState ? comment.displayState.textContent.trim().replace(/View\sattached\simage\./, ``) : ``;
    comment.bump = comment.text.replace(/[^A-Za-z]/g, ``).match(/^(havea|takea|thanksand|thankyou)?bump(ing|ity|o)?$/i);
    comment.length = comment.text.length;
    comment.words = Array.from(new Set(comment.text.split(/\s/)));
    comment.actions = comment.comment.querySelector(`.comment__actions, .action_list`);
    matches = comment.actions.querySelectorAll(`[href*="/comment/"]`);
    n = matches.length;
    if (n > 0) {
      comment.permalink = matches[n - 1];
    }
    comment.id = comment.permalink ? comment.permalink.getAttribute(`href`).match(/\/comment\/(.+)/)[1] : ``;
    comment.timestamp = parseInt(comment.actions.firstElementChild.lastElementChild.getAttribute(`data-timestamp`));
    if (!main || shared.common.isCurrentPath(`Messages`)) {
      if (this.esgst.sg) {
        try {
          source = comment.comment.closest(`.comments`).previousElementSibling.firstElementChild.firstElementChild.getAttribute(`href`);
        } catch (e) { /**/
        }
      } else {
        source = comment.actions.querySelector(`[href*="/trade/"]`).getAttribute(`href`);
      }
    }
    if (!source && sourceLink) {
      source = sourceLink.getAttribute(`href`);
    }
    if (source) {
      source = source.match(/(giveaway|discussion|ticket|trade)\/(.+?)(\/.*)?$/);
      comment.type = `${source[1]}s`;
      comment.code = source[2];
      return comment;
    }
  }
}

const commentsModule = new Comments();

export { commentsModule };