import { Module } from '../../class/Module';
import { common } from '../Common';

const
  createElements = common.createElements.bind(common)
  ;

class GeneralLastPageLink extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Adds a "Last Page" link to the pagination navigation of some pages that do not have it. For example: discussion pages with 100+ pages, user pages, group pages with 100+ pages, etc...`]
        ]]
      ],
      id: `lpl`,
      name: `Last Page Link`,
      sg: true,
      type: `general`
    };
  }

  init() {
    if (!this.esgst.paginationNavigation) return;
    if (this.esgst.discussionPath) {
      this.lpl_addDiscussionLink();
    } else if (this.esgst.userPath) {
      this.lpl_addUserLink();
    } else if (this.esgst.groupPath) {
      this.lpl_addGroupLink();
    }
  }

  lpl_getLastPage(context, main, discussion, user, userWon, group, groupUsers, groupWishlist) {
    let element, first, lastPage, pagination, paginationNavigation, paginationResults, second, third;
    pagination = context.getElementsByClassName(`pagination`)[0];
    paginationResults = context.getElementsByClassName(`pagination__results`)[0];
    paginationNavigation = context.getElementsByClassName(`pagination__navigation`)[0];
    if (paginationNavigation) {
      element = paginationNavigation.lastElementChild;
      if (element.classList.contains(`is-selected`) || element.classList.contains(`is_selected`) || element.querySelector(`.fa-angle-double-right`)) {
        lastPage = parseInt(element.getAttribute(`data-page-number`));
      } else if ((main && this.esgst.discussionPath) || discussion) {
        if (pagination) {
          lastPage = Math.ceil(parseInt(pagination.firstElementChild.lastElementChild.textContent.replace(/,/g, ``)) / 25);
        } else {
          lastPage = 999999999;
        }
      } else if ((main && this.esgst.userPath) || user) {
        if ((main && window.location.pathname.match(/\/giveaways\/won/)) || userWon) {
          lastPage = Math.ceil(parseInt(context.querySelector(`.featured__table__row__right a[href*="/giveaways/won"]`).textContent.replace(/,/g, ``)) / 25);
        } else {
          lastPage = Math.ceil(parseInt(context.getElementsByClassName(`sidebar__navigation__item__count`)[0].textContent.replace(/,/g, ``)) / 25);
        }
      } else if ((main && this.esgst.groupPath) || group) {
        if ((main && window.location.pathname.match(/\/users/)) || groupUsers) {
          lastPage = Math.ceil(parseInt(context.getElementsByClassName(`sidebar__navigation__item__count`)[1].textContent.replace(/,/g, ``)) / 25);
        } else if ((main && this.esgst.groupWishlistPath) || groupWishlist) {
          lastPage = 999999999;
        } else {
          lastPage = Math.ceil(parseInt(context.getElementsByClassName(`sidebar__navigation__item__count`)[0].textContent.replace(/,/g, ``)) / 25);
        }
      } else {
        lastPage = 999999999;
      }
    } else {
      lastPage = 999999999;
    }
    if (lastPage === 999999999 && paginationResults) {
      first = paginationResults.firstElementChild;
      if (first) {
        second = first.nextElementSibling;
        if (second) {
          third = second.nextElementSibling;
          if (third && !third.textContent.match(/Giveaway\sFilters/)) {
            lastPage = Math.ceil(parseInt(third.textContent.replace(/,/g, ``)) / ((main && this.esgst.itemsPerPage) || (parseInt(second.textContent.replace(/,/g, ``)) - parseInt(first.textContent.replace(/,/g, ``)) + 1)));
          }
        }
      }
    }
    return lastPage;
  }

  lpl_addDiscussionLink() {
    let lastLink, url;
    url = `${window.location.pathname.replace(`/search`, ``)}/search?page=${this.esgst.lastPage}`;
    this.esgst.lastPageLink = [{
      attributes: {
        [`data-page-number`]: this.esgst.lastPage,
        href: url
      },
      type: `a`,
      children: [{
        text: `Last`,
        type: `span`
      }, {
        attributes: {
          class: `fa fa-angle-double-right`
        },
        type: `i`
      }]
    }];
    lastLink = this.esgst.paginationNavigation.lastElementChild;
    if (!lastLink.classList.contains(`is-selected`) && !lastLink.querySelector(`.fa-angle-double-right`)) {
      createElements(this.esgst.paginationNavigation, `beforeEnd`, this.esgst.lastPageLink);
    }
  }

  lpl_addUserLink() {
    let lastLink, url, username;
    username = window.location.pathname.match(/^\/user\/(.+?)(\/.*?)?$/)[1];
    if (window.location.pathname.match(/\/giveaways\/won/)) {
      url = `/user/${username}/giveaways/won/search?page=${this.esgst.lastPage}`;
    } else {
      url = `/user/${username}/search?page=${this.esgst.lastPage}`;
    }
    this.esgst.lastPageLink = [{
      attributes: {
        [`data-page-number`]: this.esgst.lastPage,
        href: url
      },
      type: `a`,
      children: [{
        text: `Last`,
        type: `span`
      }, {
        attributes: {
          class: `fa fa-angle-double-right`
        },
        type: `i`
      }]
    }];
    lastLink = this.esgst.paginationNavigation.lastElementChild;
    if (this.esgst.currentPage !== this.esgst.lastPage && !lastLink.classList.contains(`is-selected`) && !lastLink.querySelector(`.fa-angle-double-right`)) {
      createElements(this.esgst.paginationNavigation, `beforeEnd`, this.esgst.lastPageLink);
    }
  }

  lpl_addGroupLink() {
    let group, lastLink, url;
    group = window.location.pathname.match(/^\/group\/(.+?\/.+?)(\/.*?)?$/)[1];
    if (window.location.pathname.match(/\/users/)) {
      url = `/group/${group}/users/search?page=${this.esgst.lastPage}`;
    } else if (this.esgst.groupWishlistPath) {
      url = `/group/${group}/wishlist/search?page=${this.esgst.lastPage}`;
    } else {
      url = `/group/${group}/search?page=${this.esgst.lastPage}`;
    }
    this.esgst.lastPageLink = [{
      attributes: {
        [`data-page-number`]: this.esgst.lastPage,
        href: url
      },
      type: `a`,
      children: [{
        text: `Last`,
        type: `span`
      }, {
        attributes: {
          class: `fa fa-angle-double-right`
        },
        type: `i`
      }]
    }];
    lastLink = this.esgst.paginationNavigation.lastElementChild;
    if (this.esgst.currentPage !== this.esgst.lastPage && !lastLink.classList.contains(`is-selected`) && !lastLink.querySelector(`.fa-angle-double-right`)) {
      createElements(this.esgst.paginationNavigation, `beforeEnd`, this.esgst.lastPageLink);
    }
  }
}

const generalLastPageLink = new GeneralLastPageLink();

export { generalLastPageLink };