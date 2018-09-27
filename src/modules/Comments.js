import Module from '../class/Module';
import {common} from './Common';

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
      load: this.comments
    };
  }

  comments() {
    this.esgst.endlessFeatures.push(this.comments_load);
  }

  async comments_load(context, main, source, endless, mainEndless) {
    let count, comments, i, n;
    comments = await this.comments_get(context, document, main, endless);
    if (!comments.length) return;
    if (main) {
      for (i = 0, n = comments.length; i < n; ++i) {
        comments[i].index = i;
        this.esgst.mainComments.push(comments[i]);
      }
    }
    if (!main || this.esgst.commentsPath || this.esgst.inboxPath) {
      if (this.esgst.cf && this.esgst.cf.filteredCount && this.esgst[`cf_enable${this.esgst.cf.type}`]) {
        this.esgst.modules.giveawaysGiveawayFilters.filters_filter(this.esgst.cf, false, endless);
      }
    }
    if (this.esgst.ct) {
      if (!main || this.esgst.inboxPath) {
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
    if (this.esgst.rfi) {
      if (this.esgst.rfi_s && (!main || this.esgst.inboxPath) && (!context.getAttribute || !context.getAttribute(`data-rfi`))) {
        await this.esgst.modules.commentsReplyFromInbox.rfi_getReplies(comments, main || endless || mainEndless);
      }
    }
    if (this.esgst.ged) {
      this.esgst.ged_addIcons(comments);
    }
  }

  async comments_get(context, mainContext, main, endless) {
    let comment, comments, i, matches, sourceLink;
    comments = [];
    matches = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} :not(.comment--submit) > .comment__parent, .esgst-es-page-${endless}:not(.comment--submit) > .comment__parent` : `:not(.comment--submit) > .comment__parent`}, ${endless ? `.esgst-es-page-${endless} .comment__child, .esgst-es-page-${endless}.comment__child` : `.comment__child`}, ${endless ? `.esgst-es-page-${endless} .comment_inner, .esgst-es-page-${endless}.comment_inner` : `.comment_inner`}`);
    sourceLink = mainContext.querySelector(`.page__heading__breadcrumbs a[href*="/giveaway/"], .page__heading__breadcrumbs a[href*="/discussion/"], .page__heading__breadcrumbs a[href*="/ticket/"], .page_heading_breadcrumbs a[href*="/trade/"]`);
    for (i = matches.length - 1; i >= 0; --i) {
      comment = await this.comments_getInfo(matches[i], sourceLink, endless ? this.esgst.users : JSON.parse(await getValue(`users`)), main);
      if (comment) {
        comments.push(comment);
      }
    }
    return comments;
  }

  async comments_getInfo(context, sourceLink, savedUsers, main) {
    let comment, matches, n, source;
    comment = {};
    comment.comment = context;
    comment.outerWrap = comment.comment;
    comment.author = comment.comment.querySelector(`.comment__author, .author_name`).textContent.trim();
    if (this.esgst.uf && savedUsers) {
      let savedUser = await getUser(savedUsers, {
        username: comment.author
      });
      if (savedUser) {
        let uf = savedUser.uf, comments, extraCount;
        if (this.esgst.uf_p && savedUser.blacklisted && !uf) {
          comments = comment.comment.closest(`.comments`);
          if (!main || this.esgst.inboxPath) {
            this.esgst.modules.usersUserFilters.uf_updateCount(comments.parentElement.nextElementSibling);
            comment.comment.parentElement.remove();
            if (!comments.children.length) {
              comments.previousElementSibling.remove();
              comments.remove();
            }
          } else {
            if (comment.comment.nextElementSibling) {
              extraCount = comment.comment.nextElementSibling.children.length;
            } else {
              extraCount = 0;
            }
            this.esgst.modules.usersUserFilters.uf_updateCount(comments.nextElementSibling, extraCount);
            comment.comment.parentElement.remove();
          }
          return;
        } else if (uf && uf.posts) {
          comments = comment.comment.closest(`.comments`);
          this.esgst.modules.usersUserFilters.uf_updateCount(comment.comment.closest(`.comments`).nextElementSibling);
          if (!main || this.esgst.inboxPath) {
            this.esgst.modules.usersUserFilters.uf_updateCount(comments.parentElement.nextElementSibling);
            comment.comment.parentElement.remove();
            if (!comments.children.length) {
              comments.previousElementSibling.remove();
              comments.remove();
            }
          } else {
            if (comment.comment.nextElementSibling) {
              extraCount = comment.comment.nextElementSibling.children.length;
            } else {
              extraCount = 0;
            }
            this.esgst.modules.usersUserFilters.uf_updateCount(comments.nextElementSibling, extraCount);
            comment.comment.parentElement.remove();
          }
          return;
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
    if (!main || this.esgst.inboxPath) {
      if (this.esgst.sg) {
        try {
          source = comment.comment.closest(`.comments`).previousElementSibling.firstElementChild.firstElementChild.getAttribute(`href`);
        } catch (e) { /**/
        }
      } else {
        source = comment.actions.querySelector(`[href*="/trade/"]`).getAttribute(`href`);
      }
    } else if (sourceLink) {
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

export default Comments;