import {utils} from '../../lib/jsUtils'
import Module from '../../class/Module';

class GeneralEndlessScrolling extends Module {
info = ({
    description: `
      <ul>
        <li>Loads the next page when you scroll down to the end of any page, allowing you to endlessly scroll through pages.</li>
        <li>Adds multiple buttons to the main page heading of the page:</li>
        <ul>
          <li><i class="fa fa-play"></i> if the endless scrolling is paused and <i class="fa fa-pause"></i> if it is not, which allows you to pause/resume the endless scrolling.</li>
          <li><i class="fa fa-step-forward"></i>, which allows you to load the next page without having to scroll down.</li>
          <li><i class="fa fa-fast-forward"></i>, which allows you continously load the next pages until either the last page is reached or you pause the endless scrolling.</li>
          <li><i class="fa fa-refresh"></i> <i class="fa fa-map-marker"></i>, which allows you to refresh the page currently visible in the window.</li>
          <li><i class="fa fa-refresh"></i>, which allows you to refresh all of the pages that have been loaded.</li>
        </ul>
        <li>You can choose whether or not to show page divisors (page headings separating each loaded page).</li>
        <li>As you scroll through the page, the pagination navigation of the page changes according to the page currently visible in the window.</li>
        <li>If you use the pagination navigation of the page to try to go to a page that has been loaded, it scrolls to the page instead of opening it.</li>
        <li>There is a reverse scrolling option for discussions that loads the pages in descending order and loads the last page instead of the first one when visiting a discussion from the main/inbox page.</li>
      </ul>
    `,
    features: {
      es_ch: {
        name: `Enable for Comment History.`,
        sg: true
      },
      es_df: {
        name: `Enable for Discussion Filters.`,
        sg: true
      },
      es_dh: {
        name: `Enable for Discussion Highlighter.`,
        sg: true
      },
      es_gb: {
        name: `Enable for Giveaway Bookmarks.`,
        sg: true
      },
      es_ged: {
        name: `Enable for Giveaway Encrypter/Decrypter.`,
        sg: true
      },
      es_ge: {
        name: `Enable for Giveaway Extractor.`,
        sg: true
      },
      es_gf: {
        name: `Enable for Giveaway Filters.`,
        sg: true
      },
      es_cl: {
        inputItems: [
          {
            attributes: {
              max: 10,
              min: 0,
              type: `number`
            },
            id: `es_pages`,
            prefix: `Pages (Max 10): `
          }
        ],
        name: `Continuously load X more pages automatically when visiting any page.`,
        sg: true
      },
      es_r: {
        description: `
          <ul>
            <li>Loads the pages of a discussion in descending order.</li>
            <li>Loads the last page instead of the first one when visiting a discussion from the main/inbox page.</li>
          </ul>
        `,
        name: `Enable reverse scrolling.`,
        sg: true
      },
      es_rd: {
        name: `Refresh active discussions/deals when refreshing the main page.`,
        sg: true
      },
      es_pd: {
        description: `
          <ul>
            <li>With this option enabled, each loaded page is separated by a page heading, which makes it very clear where a page ends and another begins. With it disabled, there is no such distinction, so it looks like the entire page is a single page, giving a true endless feeling.</li>
          </ul>
        `,
        name: `Show page divisors.`,
        sg: true,
        st: true
      }
    },
    id: `es`,
    load: this.es,
    name: `Endless Scrolling`,
    sg: true,
    st: true,
    type: `general`
  });

  es() {
    if (!this.esgst.mainPageHeading || !this.esgst.pagination) return;
    let es = {};
    this.esgst.es = this.es;
    this.es.divisors = this.esgst.es_pd;
    this.es.mainContext = this.esgst.pagination.previousElementSibling;
    let rows = this.es.mainContext.getElementsByClassName(`table__rows`)[0];
    if (rows) {
      this.es.mainContext = rows;
    }
    this.es.paginations = [this.esgst.paginationNavigation ? this.esgst.paginationNavigation.innerHTML : ``];
    this.es.reverseScrolling = this.esgst.es_r && this.esgst.discussionPath;
    if (es.reverseScrolling) {
      if (this.esgst.currentPage === 1 && this.esgst.paginationNavigation && ((document.referrer.match(/www.steamgifts.com\/($|discussions|messages)/) && !location.hash) || location.hash === `#esgst_reverse`)) {
        for (let i = 0, n = this.es.mainContext.children.length; i < n; ++i) {
          this.es.mainContext.children[0].remove();
        }
        this.esgst.mainComments = [];
        this.esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent = 0;
        if (this.esgst.paginationNavigation) {
          let lastLink = this.esgst.paginationNavigation.lastElementChild;
          if (lastLink.classList.contains(`is-selected`) && lastLink.textContent.match(/Last/) && !this.esgst.lastPageLink) {
            this.es.currentPage = parseInt(lastLink.getAttribute(`data-page-number`));
          } else {
            this.es.currentPage = 999999999;
          }
        } else {
          this.es.currentPage = 999999999;
        }
        this.es.nextPage = this.es.currentPage;
        this.es.reversePages = true;
        this.es.ended = false;
      } else {
        this.es.currentPage = this.esgst.currentPage;
        this.es.nextPage = this.es.currentPage - 1;
        this.es.pageBase = this.es.currentPage + 1;
        this.es.ended = this.es.nextPage === 0;
      }
    } else {
      this.es.currentPage = this.esgst.currentPage;
      this.es.nextPage = this.es.currentPage + 1;
      this.es.pageBase = this.es.currentPage - 1;
      this.es.ended = (!this.esgst.paginationNavigation || this.esgst.paginationNavigation.lastElementChild.classList.contains(this.esgst.selectedClass));
    }
    const options = {
      rootMargin: `-${this.esgst.commentsTop + 1}px 0px 0px 0px`
    };
    this.es.observer = new IntersectionObserver(es_observe.bind(null, this.es), options);
    this.es_activate(es);
  }

  es_observe(es, entries) {
    for (const entry of entries) {
      if (!entry.target.getAttribute(`data-esgst-intersection`)) {
        // So it doesn't get fired when starting to observe an element.
        entry.target.setAttribute(`data-esgst-intersection`, true);
        if (!entry.isIntersecting) {
          continue;
        }
      }

      if (entry.target.classList.contains(`pagination`)) {
        if (entry.isIntersecting) {
          this.esgst.pagination.setAttribute(`data-esgst-intersecting`, true);
          this.esgst.es_loadNext(null, true);
        } else {
          this.esgst.pagination.removeAttribute(`data-esgst-intersecting`);
        }
      } else {
        const index = parseInt(entry.target.className.match(/es-page-(\d+)/)[1]);
        if (entry.isIntersecting) {
          this.es_changePagination(es, index);
        } else if (entry.boundingClientRect.y <= entry.rootBounds.y) {
          // The intersection element is no longer visible, but was scrolled upwards,
          // so we can now change the pagination.
          this.es_changePagination(es, this.es.reverseScrolling ? index - 1 : index + 1);
        }
      }
    }
  }

  async es_activate(es) {
    for (let i = 0, n = this.es.mainContext.children.length; i < n; ++i) {
      if (i === n - 1) {
        this.es.observer.observe(es.mainContext.children[i]);
      }
      this.es.mainContext.children[i].classList.add(`esgst-es-page-${es.currentPage}`);
    }
    this.es.nextButton = this.esgst.modules.common.createHeadingButton({featureId: `es`, id: `esNext`, icons: [`fa-step-forward`], title: `Load next page`});
    this.es.continuousButton = this.esgst.modules.common.createHeadingButton({featureId: `es`, id: `esContinuous`, icons: [`fa-fast-forward`], title: `Continuously load pages`});
    if (es.ended) {
      this.es.continuousButton.classList.add(`esgst-hidden`);
    }
    this.es.pauseButton = this.esgst.modules.common.createHeadingButton({featureId: `es`, id: `esPause`, icons: [`fa-pause`], title: `Pause the endless scrolling`});
    this.es.resumeButton = this.esgst.modules.common.createHeadingButton({featureId: `es`, id: `esResume`, orderId: `esPause`, icons: [`fa-play`], title: `Resume the endless scrolling`});
    this.es.refreshButton = this.esgst.modules.common.createHeadingButton({featureId: `es`, id: `esRefresh`, icons: [`fa-refresh`, `fa-map-marker`], title: `Refresh current page`});
    this.es.refreshAllButton = this.esgst.modules.common.createHeadingButton({featureId: `es`, id: `esRefreshAll`, icons: [`fa-refresh`], title: `Refresh all pages`});
    this.esgst.es_refresh = this.es_refresh.bind(null, this.es);
    this.es.refreshButton.addEventListener(`click`, this.esgst.es_refresh);
    this.esgst.es_refreshAll = this.es_refreshAll.bind(null, this.es);
    this.es.refreshAllButton.addEventListener(`click`, this.esgst.es_refreshAll);
    this.es.continuousButton.addEventListener(`click`, this.es_continuouslyLoad.bind(null, this.es));
    this.es.nextButton.addEventListener(`click`, this.es_stepNext.bind(null, this.es));
    this.es.pauseButton.addEventListener(`click`, this.es_pause.bind(null, this.es, false));
    this.es.resumeButton.addEventListener(`click`, this.es_resume.bind(null, this.es, false));
    if (this.esgst.paginationNavigation) {
      let lastLink = this.esgst.paginationNavigation.lastElementChild;
      if (this.esgst.lastPageLink && this.esgst.lastPage !== this.es.pageIndex && !lastLink.classList.contains(`is-selected`) && !lastLink.textContent.match(/Last/)) {
        this.esgst.modules.common.createElements(this.esgst.paginationNavigation, `beforeEnd`, this.esgst.lastPageLink);
      }
      this.es_setPagination(es);
    }
    this.es.isLimited = false;
    this.es.limitCount = 0;
    this.es.busy = false;
    this.es.paused = await getValue(`esPause`, false);
    this.esgst.es_loadNext = this.es_loadNext.bind(null, this.es);
    if (es.paused) {
      this.es_pause(es, true);
    } else {
      this.es_resume(es, true);
    }
    this.es.pageIndex = this.es.currentPage;
    const options = {
      rootMargin: `0px 0px ${innerHeight}px 0px`
    };
    const observer = new IntersectionObserver(es_observe.bind(null, this.es), options);
    observer.observe(this.esgst.pagination);
    if (es.paused && this.es.reversePages) {
      this.esgst.es_loadNext();
    } else if (this.esgst.es_cl) {
      this.es_continuouslyLoad(es);
    }
  }

  async es_loadNext(es, callback, force) {
    if (!this.esgst.stopEs && !es.busy && (!es.paused || this.es.reversePages) && !es.ended && ((force && !es.continuous && !es.step) || (!force && (es.continuous || this.es.step))) && (!es.isLimited || this.es.limitCount > 0)) {
      this.es.limitCount -= 1;
      this.es.busy = true;
      this.es.progress = this.esgst.modules.common.createElements(this.esgst.pagination.firstElementChild, `beforeEnd`, [{
        attributes: {
          class: `esgst-bold`
        },
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }, {
          text: ` Loading next page...`,
          type: `node`
        }]
      }]);
      this.es_getNext(es, false, false, callback, await this.esgst.modules.common.request({method: `GET`, url: `${this.esgst.searchUrl}${es.nextPage}`}));
    } else if (callback && typeof callback === `function`) {
      callback();
    }
  }

  async es_getNext(es, refresh, refreshAll, callback, response) {
    let pagination = utils.parseHtml(response.responseText).getElementsByClassName(`pagination`)[0],
      context = pagination.previousElementSibling,
      rows = context.getElementsByClassName(`table__rows`)[0];
    if (rows) {
      context = rows;
    }
    let paginationNavigation = pagination.getElementsByClassName(this.esgst.paginationNavigationClass)[0];
    if (es.reversePages) {
      this.es.paginations[0] = paginationNavigation.innerHTML;
      this.esgst.modules.common.createElements(this.esgst.paginationNavigation, `inner`, [...(Array.from(parseHtml(es.paginations[0]).body.childNodes).map(x => {
        return {
          context: x
        };
      }))]);
      if (this.esgst.paginationNavigation) {
        let lastLink = this.esgst.paginationNavigation.lastElementChild;
        if (this.esgst.lastPageLink && this.esgst.lastPage !== this.es.pageIndex && !lastLink.classList.contains(`is-selected`) && !lastLink.textContent.match(/Last/)) {
          this.esgst.modules.common.createElements(this.esgst.paginationNavigation, `beforeEnd`, this.esgst.lastPageLink);
        }
        this.es_setPagination(es);
      }
      this.es.reversePages = false;
      if (es.currentPage === 999999999) {
        this.es.currentPage = parseInt(paginationNavigation.lastElementChild.getAttribute(`data-page-number`));
        this.es.nextPage = this.es.currentPage;
        this.es.pageBase = this.es.currentPage + 1;
        this.es.pageIndex = this.es.currentPage;
      }
    } else if (refresh) {
      pagination = this.es.paginations[(es.reverseScrolling ? this.es.pageBase - (refreshAll || this.es.pageIndex) : (refreshAll || this.es.pageIndex) - this.es.pageBase) - 1];
      if (paginationNavigation && pagination !== paginationNavigation.innerHTML) {
        this.es.paginations[(es.reverseScrolling ? this.es.pageBase - (refreshAll || this.es.pageIndex) : (refreshAll || this.es.pageIndex) - this.es.pageBase) - 1] = paginationNavigation.innerHTML;
        this.es.ended = false;
      }
    } else {
      this.es.paginations.push(paginationNavigation.innerHTML);
    }
    let fragment = document.createDocumentFragment();
    if (this.esgst.cr && this.esgst.discussionPath) {
      this.esgst.modules.common.reverseComments(context);
    }
    let n = context.children.length;
    const currentPage = refresh ? refreshAll || this.es.pageIndex : this.es.nextPage;
    for (let i = 0; i < n; ++i) {
      let child = context.children[0];
      child.classList.add(`esgst-es-page-${currentPage}`);
      fragment.appendChild(child);
    }
    if (refresh) {
      let elements = document.getElementsByClassName(`esgst-es-page-${currentPage}`),
        oldN = elements.length;
      for (let i = 1; i < oldN; ++i) {
        elements[0].remove();
      }
      let element = elements[0];
      this.es.mainContext.insertBefore(fragment, element);
      this.es.observer.observe(element.previousElementSibling);
      element.remove();
      if (!refreshAll) {
        this.es_purgeRemovedElements();
        await this.esgst.modules.common.endless_load(es.mainContext, true, null, currentPage);
        this.es_setRemoveEntry(es.mainContext);
        if (this.esgst.gf && this.esgst.gf.filteredCount) {
          this.esgst.modules.giveawaysGiveawayFilters.filters_updateCount(this.esgst.gf);
        }
        if (this.esgst.df && this.esgst.df.filteredCount) {
          this.esgst.modules.giveawaysGiveawayFilters.filters_updateCount(this.esgst.df);
        }
        if (this.esgst.cf && this.esgst.cf.filteredCount) {
          this.esgst.modules.giveawaysGiveawayFilters.filters_updateCount(this.esgst.cf);
        }
        if (this.esgst.ts && !this.esgst.us) {
          this.esgst.modules.generalTableSorter.ts_sortTables();
        }
      }
      this.esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent = (parseInt(this.esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent.replace(/,/g, ``)) - oldN + n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
      if (refreshAll) {
        this.es.check.count += 1;
      } else {
        this.es.refreshButton.addEventListener(`click`, this.esgst.es_refresh);
        this.esgst.modules.common.createElements(es.refreshButton, `inner`, [{
          attributes: {
            class: `fa fa-refresh`
          },
          type: `i`
        }, {
          attributes: {
            class: `fa fa-map-marker`
          },
          type: `i`
        }]);
      }
    } else {
      if (es.divisors) {
        this.esgst.modules.common.createElements(es.mainContext, `beforeEnd`, [{
          attributes: {
            class: `esgst-page-heading esgst-es-page-divisor`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `page__heading__breadcrumbs page_heading_breadcrumbs`
            },
            type: `div`,
            children: [{
              attributes: {
                href: `${this.esgst.searchUrl}${es.nextPage}`
              },
              text: `Page ${es.nextPage}`,
              type: `a`
            }]
          }]
        }]);
      }
      this.es.mainContext.appendChild(fragment);
      this.es.observer.observe(es.mainContext.lastElementChild);
      await this.esgst.modules.common.endless_load(es.mainContext, true, null, currentPage);
      this.es_setRemoveEntry(es.mainContext);
      if (this.esgst.ts && !this.esgst.us) {
        this.esgst.modules.generalTableSorter.ts_sortTables();
      }
      this.esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent = (parseInt(this.esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent.replace(/,/g, ``)) + n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
      this.es.progress.remove();
      if (es.reverseScrolling) {
        --es.nextPage;
        this.es.busy = false;
        if (es.nextPage <= 0) {
          this.es.ended = true;
          if (callback && typeof callback === `function`) {
            callback();
          }
        } else if (!es.paused && !es.step) {
          if (es.continuous) {
            this.esgst.es_loadNext(callback);
          } else if (callback && typeof callback === `function`) {
            callback();
          } else if (this.esgst.pagination.getAttribute(`data-esgst-intersecting`)) {
            this.esgst.es_loadNext(null, true);
          }
        } else if (callback && typeof callback === `function`) {
          callback();
        }
      } else {
        ++es.nextPage;
        this.es.busy = false;
        if (paginationNavigation.lastElementChild.classList.contains(this.esgst.selectedClass)) {
          this.es.ended = true;
          if (callback && typeof callback === `function`) {
            callback();
          }
        } else if (!es.paused && !es.step) {
          if (es.continuous) {
            this.esgst.es_loadNext(callback);
          } else if (callback && typeof callback === `function`) {
            callback();
          } else if (this.esgst.pagination.getAttribute(`data-esgst-intersecting`)) {
            this.esgst.es_loadNext(null, true);
          }
        } else if (callback && typeof callback === `function`) {
          callback();
        }
      }
    }
  }

  es_purgeRemovedElements() {
    // there are more elements that need to be purged,
    // but for now these are the most critical ones
    const keys = [`attachedImages`, `mainComments`, `tsTables`, `mainGiveaways`, `mainDiscussions`, `mainUsers`, `mainGames`, `popupGiveaways`, `popupDiscussions`, `popupUsers`, `popupGames`];
    for (const key of keys) {
      for (let i = this.esgst[key].length - 1; i > -1; i--) {
        if (document.contains(this.esgst[key][i].outerWrap)) continue;
        this.esgst[key].splice(i, 1);
      }
    }
    for (const key in this.esgst.apPopouts) {
      if (document.contains(this.esgst.apPopouts[key].popout)) continue;
      delete this.esgst.apPopouts[key];
    }
    for (const key in this.esgst.currentUsers) {
      const elements = this.esgst.currentUsers[key].elements;
      for (let i = elements.length - 1; i > -1; i--) {
        if (document.contains(elements[i])) continue;
        elements.splice(i, 1);
      }
      if (elements.length) continue;
      delete this.esgst.currentUsers[key];
    }
  }

  es_changePagination(es, index) {
    const pagination = this.es.paginations[index - 1];
    if (pagination && this.esgst.paginationNavigation.innerHTML !== pagination) {
      this.esgst.modules.common.createElements(this.esgst.paginationNavigation, `inner`, [...(Array.from(parseHtml(pagination).body.childNodes).map(x => {
        return {
          context: x
        };
      }))]);
      let lastLink = this.esgst.paginationNavigation.lastElementChild;
      if (this.esgst.lastPageLink && this.esgst.lastPage !== this.es.pageIndex && !lastLink.classList.contains(`is-selected`) && !lastLink.textContent.match(/Last/)) {
        this.esgst.modules.common.createElements(this.esgst.paginationNavigation, `beforeEnd`, this.esgst.lastPageLink);
      }
      this.es_setPagination(es);
    }
  }

  async es_stepNext(es) {
    if (es.step) return;
    this.esgst.modules.common.createElements(es.nextButton, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    this.es.step = true;
    const wasPaused = this.es.paused;
    await this.es_resume(es);
    this.esgst.es_loadNext(async () => {
      this.es.step = false;
      if (wasPaused) {
        await this.es_pause(es);
      } else {
        await this.es_resume(es);
      }
      this.esgst.modules.common.createElements(es.nextButton, `inner`, [{
        attributes: {
          class: `fa fa-step-forward`
        },
        type: `i`
      }]);
    });
  }

  async es_continuouslyLoad(es) {
    if (es.continuous) return;
    this.esgst.modules.common.createElements(es.continuousButton, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    this.es.continuous = true;
    const wasPaused = this.es.paused;
    await this.es_resume(es);
    if (this.esgst.es_cl) {
      this.es.isLimited = true;
      this.es.limitCount = Math.min(10, parseInt(this.esgst.es_pages));
    }
    this.esgst.es_loadNext(async () => {
      this.es.isLimited = false;
      this.es.limitCount = 0;
      this.es.continuous = false;
      if (wasPaused) {
        await this.es_pause(es);
      } else {
        await this.es_resume(es);
      }
      this.esgst.modules.common.createElements(es.continuousButton, `inner`, [{
        attributes: {
          class: `fa fa-fast-forward`
        },
        type: `i`
      }]);
    });
  }

  async es_pause(es, firstRun) {
    this.es.paused = true;
    this.es.pauseButton.classList.add(`esgst-hidden`);
    this.es.resumeButton.classList.remove(`esgst-hidden`);
    if (!firstRun) {
      await setValue(`esPause`, this.es.paused);
    }
    this.es.continuous = false;
    this.esgst.modules.common.createElements(es.continuousButton, `inner`, [{
      attributes: {
        class: `fa fa-fast-forward`
      },
      type: `i`
    }]);
  }

  async es_resume(es, firstRun) {
    this.es.paused = false;
    this.es.resumeButton.classList.add(`esgst-hidden`);
    this.es.pauseButton.classList.remove(`esgst-hidden`);
    if (!firstRun) {
      await setValue(`esPause`, this.es.paused);
    }
    if (this.esgst.pagination.getAttribute(`data-esgst-intersecting`)) {
      this.esgst.es_loadNext(null, true);
    }
  }

  async es_refresh(es) {
    this.es.refreshButton.removeEventListener(`click`, this.esgst.es_refresh);
    this.esgst.modules.common.createElements(es.refreshButton, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    let response = await this.esgst.modules.common.request({method: `GET`, url: `${this.esgst.searchUrl}${es.pageIndex}`});
    this.es_getNext(es, true, false, null, response);
    if (this.esgst.giveawaysPath && this.esgst.es_rd) {
      if (this.esgst.oadd) {
        this.esgst.modules.discussionsOldActiveDiscussionsDesign.oadd_load(true);
      } else {
        this.esgst.modules.common.checkMissingDiscussions(true);
      }
    }
    if (this.esgst.pinnedGiveaways) {
      this.esgst.modules.common.createElements(this.esgst.pinnedGiveaways, `inner`, [...(Array.from(parseHtml(response.responseText).getElementsByClassName(`pinned-giveaways__outer-wrap`)[0].childNodes).map(x => {
        return {
          context: x
        };
      }))]);
      await this.esgst.modules.common.endless_load(this.esgst.pinnedGiveaways, true);
      this.esgst.modules.giveawaysPinnedGiveawaysButton.pgb();
    }
    if (!this.esgst.hr) {
      await this.esgst.modules.generalHeaderRefresher.hr_refreshHeaderElements(parseHtml((await this.esgst.modules.common.request({method: `GET`, url: this.esgst.sg ? `/giveaways/search?type=wishlist` : `/`})).responseText));
      this.esgst.modules.generalHeaderRefresher.hr_refreshHeader(hr_getCache());
    }
  }

  async es_refreshAll(es) {
    this.es.refreshAllButton.removeEventListener(`click`, this.esgst.es_refreshAll);
    this.esgst.modules.common.createElements(es.refreshAllButton, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    this.es.check = new CompletionCheck(es.paginations.length, async () => {
      this.es_purgeRemovedElements();
      await this.esgst.modules.common.endless_load(es.mainContext, true);
      this.es_setRemoveEntry(es.mainContext);
      this.es.refreshAllButton.addEventListener(`click`, this.esgst.es_refreshAll);
      this.esgst.modules.common.createElements(es.refreshAllButton, `inner`, [{
        attributes: {
          class: `fa fa-refresh`
        },
        type: `i`
      }]);
      if (this.esgst.gf && this.esgst.gf.filteredCount) {
        this.esgst.modules.giveawaysGiveawayFilters.filters_updateCount(this.esgst.gf);
      }
      if (this.esgst.df && this.esgst.df.filteredCount) {
        this.esgst.modules.giveawaysGiveawayFilters.filters_updateCount(this.esgst.df);
      }
      if (this.esgst.cf && this.esgst.cf.filteredCount) {
        this.esgst.modules.giveawaysGiveawayFilters.filters_updateCount(this.esgst.cf);
      }
      if (this.esgst.ts && !this.esgst.us) {
        this.esgst.modules.generalTableSorter.ts_sortTables();
      }
      if (this.esgst.giveawaysPath && this.esgst.es_rd) {
        if (this.esgst.oadd) {
          this.esgst.modules.discussionsOldActiveDiscussionsDesign.oadd_load(true);
        } else {
          this.esgst.modules.common.checkMissingDiscussions(true);
        }
      }
      if (this.esgst.pinnedGiveaways) {
        this.esgst.modules.common.createElements(this.esgst.pinnedGiveaways, `inner`, [...(Array.from(parseHtml(response.responseText).getElementsByClassName(`pinned-giveaways__outer-wrap`)[0].childNodes).map(x => {
          return {
            context: x
          };
        }))]);
        await this.esgst.modules.common.endless_load(this.esgst.pinnedGiveaways, true);
        this.esgst.modules.giveawaysPinnedGiveawaysButton.pgb();
      }
    });
    let page = this.es.reverseScrolling ? this.es.pageBase - 1 : this.es.pageBase + 1,
      response = await this.esgst.modules.common.request({method: `GET`, url: `${this.esgst.searchUrl}${page}`});
    this.es_getNext(es, true, page, null, response);
    for (let i = 1; i < this.es.check.total; ++i) {
      page = this.es.reverseScrolling ? this.es.pageBase - (i + 1) : this.es.pageBase + (i + 1);
      this.es_getNext(es, true, page, null, await this.esgst.modules.common.request({method: `GET`, url: `${this.esgst.searchUrl}${page}`}));
    }
    if (!this.esgst.hr) {
      await this.esgst.modules.generalHeaderRefresher.hr_refreshHeaderElements(parseHtml((await this.esgst.modules.common.request({method: `GET`, url: this.esgst.sg ? `/giveaways/search?type=wishlist` : `/`})).responseText));
      this.esgst.modules.generalHeaderRefresher.hr_refreshHeader(hr_getCache());
    }
  }

  es_setPagination(es) {
    let matches = this.esgst.paginationNavigation.children;
    for (let i = 0, n = matches.length; i < n; ++i) {
      matches[i].addEventListener(`click`, this.es_setPaginationItem.bind(null, this.es));
    }
  }

  es_setPaginationItem(es, event) {
    event.preventDefault();
    let page = parseInt(event.currentTarget.getAttribute(`data-page-number`)),
      element = document.querySelector(`.esgst-es-page-${page}:not(.esgst-hidden)`);
    if (element) {
      this.esgst.modules.common.animateScroll(element.offsetTop, () => {
        this.es_changePagination(es, page);
      });
    } else {
      location.href = event.currentTarget.getAttribute(`href`);
    }
  }

  es_setRemoveEntry(Context) {
    let Matches = Context.getElementsByClassName(`table__row-inner-wrap`);
    for (let I = 0, N = Matches.length; I < N; ++I) {
      this.es_removeEntry(Matches[I]);
    }
  }

  es_removeEntry(Context) {
    let Default, Loading, Complete, Data;
    Default = Context.getElementsByClassName(`table__remove-default`)[0];
    if (Default) {
      Loading = Default.nextElementSibling;
      Complete = Loading.nextElementSibling;
      Default.addEventListener(`click`, async () => {
        let Values, I, N;
        Default.classList.toggle(`is-hidden`);
        Loading.classList.toggle(`is-hidden`);
        Values = Context.getElementsByTagName(`input`);
        Data = ``;
        for (I = 0, N = Values.length; I < N; ++I) {
          Data += `${Values[I].getAttribute(`name`)}=${Values[I].value}${I < (N - 1) ? `&` : ``}`;
        }
        Loading.classList.toggle(`is-hidden`);
        let responseJson = JSON.parse((await this.esgst.modules.common.request({data: Data, method: `POST`, url: `/ajax.php`})).responseText);
        if (responseJson.type === `success`) {
          Context.classList.add(`is-faded`);
          Complete.classList.toggle(`is-hidden`);
          this.esgst.pointsContainer.textContent = responseJson.points;
          this.esgst.points = parseInt(this.esgst.pointsContainer.textContent.replace(/,/g, ``).match(/\d+/)[0]);
        } else {
          Default.classList.toggle(`is-hidden`);
        }
      });
    }
  }
}

export default GeneralEndlessScrolling;