import { Module } from '../../class/Module';
import { common } from '../Common';
import IntersectionObserver from 'intersection-observer-polyfill';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { DOM } from '../../class/DOM';
import { EventDispatcher } from '../../class/EventDispatcher';
import { Events } from '../../constants/Events';
import { FetchRequest } from '../../class/FetchRequest';

const
  animateScroll = common.animateScroll.bind(common),
  checkMissingDiscussions = common.checkMissingDiscussions.bind(common),
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  endless_load = common.endless_load.bind(common),
  request = common.request.bind(common),
  reverseComments = common.reverseComments.bind(common),
  setSetting = common.setSetting.bind(common)
  ;

class GeneralEndlessScrolling extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', `Loads the next page when you scroll down to the end of any page, allowing you to endlessly scroll through pages.`],
          ['li', `Adds multiple buttons to the main page heading of the page:`],
          ['ul', [
            ['li', [
              ['i', { class: 'fa fa-play' }],
              ' if the endless scrolling is paused and ',
              ['i', { class: 'fa fa-pause' }],
              ` if it is not, which allows you to pause/resume the endless scrolling.`
            ]],
            ['li', [
              ['i', { class: 'fa fa-step-forward' }],
              `, which allows you to load the next page without having to scroll down.`
            ]],
            ['li', [
              ['i', { class: 'fa fa-fast-forward' }],
              `, which allows you continuously load the next pages until either the last page is reached or you pause the endless scrolling.`
            ]],
            ['li', [
              ['i', { class: 'fa fa-refresh' }],
              ' ',
              ['i', { class: 'fa fa-map-marker' }],
              `, which allows you to refresh the page currently visible in the window.`
            ]],
            ['li', [
              ['i', { class: 'fa fa-refresh' }],
              `, which allows you to refresh all of the pages that have been loaded.`
            ]]
          ]],
          ['li', `You can choose whether or not to show page divisors (page headings separating each loaded page).`],
          ['li', `As you scroll through the page, the pagination navigation of the page changes according to the page currently visible in the window.`],
          ['li', `If you use the pagination navigation of the page to try to go to a page that has been loaded, it scrolls to the page instead of opening it.`],
          ['li', 'There is a reverse scrolling option for discussions that loads the pages in descending order and loads the last page instead of the first one when visiting a discussion from the main/inbox page.']
        ]]
      ],
      features: {
        es_g: {
          name: 'Enable for giveaways.',
          sg: true,
        },
        es_d: {
          name: 'Enable for discussions.',
          sg: true,
        },
        es_c: {
          name: 'Enable for comments.',
          sg: true,
          st: true,
        },
        es_l: {
          name: 'Enable for lists.',
          sg: true,
          sg: true,
        },
        es_t: {
          name: 'Enable for trades.',
          sg: true,
        },
        es_ch: {
          name: 'Enable for Comment History.',
          sg: true
        },
        es_df: {
          name: 'Enable for Discussion Filters.',
          sg: true
        },
        es_tf: {
          name: 'Enable for Trade Filters.',
          st: true
        },
        es_gb: {
          name: 'Enable for Giveaway Bookmarks.',
          sg: true
        },
        es_ged: {
          name: 'Enable for Giveaway Encrypter/Decrypter.',
          sg: true
        },
        es_ge: {
          name: 'Enable for Giveaway Extractor.',
          sg: true
        },
        es_gf: {
          name: 'Enable for Giveaway Filters.',
          sg: true
        },
        es_cl: {
          inputItems: [
            {
              attributes: {
                max: 10,
                min: 0,
                type: 'number'
              },
              id: 'es_pages',
              prefix: `Pages (Max 10): `
            }
          ],
          name: 'Continuously load X more pages automatically when visiting any page.',
          sg: true
        },
        es_r: {
          description: [
            ['ul', [
              ['li', 'Loads the pages of a discussion in descending order.'],
              ['li', 'Loads the last page instead of the first one when visiting a discussion from the main/inbox page.']
            ]]
          ],
          name: 'Enable reverse scrolling.',
          sg: true
        },
        es_rd: {
          name: 'Refresh active discussions/deals when refreshing the main page.',
          sg: true
        },
        es_pd: {
          description: [
            ['ul', [
              ['li', `With this option enabled, each loaded page is separated by a page heading, which makes it very clear where a page ends and another begins. With it disabled, there is no such distinction, so it looks like the entire page is a single page, giving a true endless feeling.`]
            ]]
          ],
          name: 'Show page divisors.',
          sg: true,
          st: true
        }
      },
      id: 'es',
      name: 'Endless Scrolling',
      sg: true,
      st: true,
      includeOptions: [{
        id: 'pause',
        name: 'Paused'
      }],
      type: 'general'
    };
  }

  init() {
    let es = {};

    if (Shared.esgst.giveawaysPath && Settings.get('es_g')) {
      es.id = 'g';
    } else if (Shared.esgst.discussionsPath && Settings.get('es_d')) {
      es.id = 'd';
    } else if (Shared.esgst.commentsPath && Settings.get('es_c')) {
      es.id = 'c';
    } else if (Shared.esgst.tradesPath && Settings.get('es_t')) {
      es.id = 't';
    } else if (!Shared.esgst.giveawaysPath && !Shared.esgst.discussionsPath && !Shared.esgst.commentsPath && !Shared.esgst.tradesPath && Settings.get('es_l')) {
      es.id = 'l';
    } else {
      return;
    }

    if (!this.esgst.mainPageHeading || !this.esgst.pagination) return;
    if (this.esgst.pagination.classList.contains('pagination--no-results')) {
      this.esgst.itemsPerPage = 50;
    } else {
      this.esgst.itemsPerPage = parseInt(this.esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent.replace(/,/g, '')) - parseInt(this.esgst.pagination.firstElementChild.firstElementChild.textContent.replace(/,/g, '')) + 1;
    }
    this.esgst.es = es;
    es.divisors = Settings.get('es_pd');
    es.mainContext = this.esgst.pagination.previousElementSibling;
    if (this.esgst.commentsPath && !es.mainContext.classList.contains('comments')) {
      es.mainContext = DOM.build(es.mainContext, 'afterEnd', [
        ['div', { class: 'comments' }]
      ]);
    }
    let rows = es.mainContext.getElementsByClassName('table__rows')[0];
    if (rows) {
      es.mainContext = rows;
    }
    es.paginations = [this.esgst.paginationNavigation ? this.esgst.paginationNavigation.innerHTML : ''];
    es.reverseScrolling = Settings.get('es_r') && this.esgst.discussionPath;
    if (es.reverseScrolling) {
      if (this.esgst.currentPage === 1 && this.esgst.paginationNavigation && !this.esgst.parameters.page) {
        for (let i = 0, n = es.mainContext.children.length; i < n; ++i) {
          es.mainContext.children[0].remove();
        }
        this.esgst.scopes.main.reset('comments');
        this.esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent = '0';
        if (this.esgst.paginationNavigation) {
          let lastLink = this.esgst.paginationNavigation.lastElementChild;
          if (lastLink.classList.contains('is-selected') && lastLink.querySelector('.fa-angle-double-right') && !this.esgst.lastPageLink) {
            es.currentPage = parseInt(lastLink.getAttribute('data-page-number'));
          } else {
            es.currentPage = 999999999;
          }
        } else {
          es.currentPage = 999999999;
        }
        es.nextPage = es.currentPage;
        es.reversePages = true;
        es.ended = false;
      } else {
        es.currentPage = this.esgst.currentPage;
        es.nextPage = es.currentPage - 1;
        es.pageBase = es.currentPage + 1;
        es.ended = es.nextPage === 0;
      }
    } else {
      es.currentPage = this.esgst.currentPage;
      es.nextPage = es.currentPage + 1;
      es.pageBase = es.currentPage - 1;
      es.ended = (!this.esgst.paginationNavigation || this.esgst.paginationNavigation.lastElementChild.classList.contains(this.esgst.selectedClass));
    }
    const options = {
      rootMargin: `-${this.esgst.commentsTop + 1}px 0px 0px 0px`
    };
    es.observer = new IntersectionObserver(this.es_observe.bind(this, es), options);
    // noinspection JSIgnoredPromiseFromCall
    this.es_activate(es);
  }

  es_observe(es, entries) {
    for (const entry of entries) {
      if (!entry.boundingClientRect || !entry.rootBounds) {
        continue;
      }
      if (!entry.target.getAttribute('data-esgst-intersection')) {
        // So it doesn't get fired when starting to observe an element.
        entry.target.setAttribute('data-esgst-intersection', true);
        if (!entry.isIntersecting) {
          continue;
        }
      }

      if (entry.target.classList.contains('pagination')) {
        if (entry.isIntersecting) {
          this.esgst.pagination.setAttribute('data-esgst-intersecting', 'true');
          this.esgst.es_loadNext(null, true);
        } else {
          this.esgst.pagination.removeAttribute('data-esgst-intersecting');
        }
      } else {
        const index = parseInt(entry.target.className.match(/es-page-(\d+)/)[1]);
        if (entry.isIntersecting) {
          this.es_changePagination(es, index);
        } else if (entry.boundingClientRect.y <= entry.rootBounds.y) {
          // The intersection element is no longer visible, but was scrolled upwards,
          // so we can now change the pagination.
          this.es_changePagination(es, es.reverseScrolling ? index - 1 : index + 1);
        }
      }
    }
  }

  async es_activate(es) {
    for (let i = 0, n = es.mainContext.children.length; i < n; ++i) {
      if (i === n - 1) {
        es.observer.observe(es.mainContext.children[i]);
      }
      es.mainContext.children[i].classList.add(`esgst-es-page-${es.currentPage}`);
    }
    es.nextButton = createHeadingButton({
      featureId: 'es',
      id: 'esNext',
      icons: ['fa-step-forward'],
      title: 'Load next page'
    });
    es.continuousButton = createHeadingButton({
      featureId: 'es',
      id: 'esContinuous',
      icons: ['fa-fast-forward'],
      title: 'Continuously load pages'
    });
    if (es.ended) {
      es.continuousButton.classList.add('esgst-hidden');
    }
    es.pauseButton = createHeadingButton({
      featureId: 'es',
      id: 'esPause',
      icons: ['fa-pause'],
      title: 'Pause the endless scrolling'
    });
    es.resumeButton = createHeadingButton({
      featureId: 'es',
      id: 'esResume',
      orderId: 'esPause',
      icons: ['fa-play'],
      title: 'Resume the endless scrolling'
    });
    es.refreshButton = createHeadingButton({
      featureId: 'es',
      id: 'esRefresh',
      icons: ['fa-refresh', 'fa-map-marker'],
      title: 'Refresh current page'
    });
    es.refreshAllButton = createHeadingButton({
      featureId: 'es',
      id: 'esRefreshAll',
      icons: ['fa-refresh'],
      title: 'Refresh all pages'
    });
    this.esgst.es_refresh = this.es_refresh.bind(this, es);
    es.refreshButton.addEventListener('click', this.esgst.es_refresh.bind(this));
    this.esgst.es_refreshAll = this.es_refreshAll.bind(this, es);
    es.refreshAllButton.addEventListener('click', this.esgst.es_refreshAll.bind(this));
    es.continuousButton.addEventListener('click', this.es_continuouslyLoad.bind(this, es));
    es.nextButton.addEventListener('click', this.es_stepNext.bind(this, es));
    es.pauseButton.addEventListener('click', this.es_pause.bind(this, es, false));
    es.resumeButton.addEventListener('click', this.es_resume.bind(this, es, false));
    if (this.esgst.paginationNavigation) {
      this.esgst.modules.generalPaginationNavigationOnTop.pnot_simplify();
      this.es_fixFirstPageLinks();
      let lastLink = this.esgst.paginationNavigation.lastElementChild;
      if (this.esgst.lastPageLink && this.esgst.lastPage !== es.pageIndex && !lastLink.classList.contains('is-selected') && !lastLink.querySelector('.fa-angle-double-right')) {
        createElements(this.esgst.paginationNavigation, 'beforeEnd', this.esgst.lastPageLink);
      }
      this.es_setPagination(es);
    }
    es.isLimited = false;
    es.limitCount = 0;
    es.busy = false;
    es.paused = Settings.get(`es_paused_${es.id}_${Shared.esgst.name}`);
    this.esgst.es_loadNext = this.es_loadNext.bind(this, es);
    if (es.paused) {
      // noinspection JSIgnoredPromiseFromCall
      this.es_pause(es, true);
    } else {
      // noinspection JSIgnoredPromiseFromCall
      this.es_resume(es, true);
    }
    es.pageIndex = es.currentPage;
    const options = {
      rootMargin: `0px 0px ${window.innerHeight}px 0px`
    };
    const observer = new IntersectionObserver(this.es_observe.bind(this, es), options);
    observer.observe(this.esgst.pagination);
    if (es.paused && es.reversePages) {
      this.esgst.es_loadNext();
    } else if (Settings.get('es_cl')) {
      // noinspection JSIgnoredPromiseFromCall
      this.es_continuouslyLoad(es);
    }
  }

  async es_loadNext(es, callback, force) {
    if (!this.esgst.stopEs && !es.busy && (!es.paused || es.reversePages) && !es.ended && ((force && !es.continuous && !es.step) || (!force && (es.continuous || es.step))) && (!es.isLimited || es.limitCount > 0)) {
      es.limitCount -= 1;
      es.busy = true;
      es.progress = createElements(this.esgst.pagination.firstElementChild, 'beforeEnd', [{
        attributes: {
          class: 'esgst-bold'
        },
        type: 'span',
        children: [{
          attributes: {
            class: 'fa fa-circle-o-notch fa-spin'
          },
          type: 'i'
        }, {
          text: ' Loading next page...',
          type: 'node'
        }]
      }]);
      // noinspection JSIgnoredPromiseFromCall
      this.es_getNext(es, false, false, callback, await request({
        method: 'GET',
        url: `${this.esgst.searchUrl}${es.nextPage}`
      }));
    } else if (callback && typeof callback === 'function') {
      callback();
    }
  }

  async es_getNext(es, refresh, refreshAll, callback, response) {
    let pagination = DOM.parse(response.responseText).getElementsByClassName('pagination')[0],
      context = pagination.previousElementSibling,
      rows = context.getElementsByClassName('table__rows')[0];
    if (this.esgst.commentsPath && !context.classList.contains('comments')) {
      if (!refreshAll) {
        es.refreshButton.addEventListener('click', this.esgst.es_refresh.bind(this));
        createElements(es.refreshButton, 'inner', [{
          attributes: {
            class: 'fa fa-refresh'
          },
          type: 'i'
        }, {
          attributes: {
            class: 'fa fa-map-marker'
          },
          type: 'i'
        }]);
      }
      return;
    }
    if (rows) {
      context = rows;
    }
    let paginationNavigation = pagination.getElementsByClassName(this.esgst.paginationNavigationClass)[0];
    if (es.reversePages) {
      es.paginations[0] = paginationNavigation.innerHTML;
      createElements(this.esgst.paginationNavigation, 'inner', [...(Array.from(DOM.parse(es.paginations[0]).body.childNodes).map(x => {
        return {
          context: x
        };
      }))]);
      if (this.esgst.paginationNavigation) {
        this.esgst.modules.generalPaginationNavigationOnTop.pnot_simplify();
        this.es_fixFirstPageLinks();
        let lastLink = this.esgst.paginationNavigation.lastElementChild;
        if (this.esgst.lastPageLink && this.esgst.lastPage !== es.pageIndex && !lastLink.classList.contains('is-selected') && !lastLink.querySelector('.fa-angle-double-right')) {
          createElements(this.esgst.paginationNavigation, 'beforeEnd', this.esgst.lastPageLink);
        }
        this.es_setPagination(es);
      }
      es.reversePages = false;
      if (es.currentPage === 999999999) {
        es.currentPage = parseInt(paginationNavigation.lastElementChild.getAttribute('data-page-number'));
        es.nextPage = es.currentPage;
        es.pageBase = es.currentPage + 1;
        es.pageIndex = es.currentPage;
      }
      this.esgst.pagination.firstElementChild.firstElementChild.textContent = (parseInt(this.esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.textContent.replace(/,/g, '')) + 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
      this.esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent = this.esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.textContent;
    } else if (refresh) {
      pagination = es.paginations[(es.reverseScrolling ? es.pageBase - (refreshAll || es.pageIndex) : (refreshAll || es.pageIndex) - es.pageBase) - 1];
      if (paginationNavigation && pagination !== paginationNavigation.innerHTML) {
        es.paginations[(es.reverseScrolling ? es.pageBase - (refreshAll || es.pageIndex) : (refreshAll || es.pageIndex) - es.pageBase) - 1] = paginationNavigation.innerHTML;
        es.ended = false;
      }
    } else {
      es.paginations.push(paginationNavigation.innerHTML);
    }
    let fragment = document.createDocumentFragment();
    if (Settings.get('cr') && this.esgst.discussionPath) {
      reverseComments(context);
    }
    let n = context.children.length;
    const currentPage = refresh ? refreshAll || es.pageIndex : es.nextPage;
    for (let i = 0; i < n; ++i) {
      let child = context.children[0];
      child.classList.add(`esgst-es-page-${currentPage}`);
      fragment.appendChild(child);
    }
    let oldN = 0;
    if (refresh) {
      let elements = document.getElementsByClassName(`esgst-es-page-${currentPage}`);
      oldN = elements.length;
      for (let i = 1; i < oldN; ++i) {
        elements[0].remove();
      }
      let element = elements[0];
      if (element) {
        es.mainContext.insertBefore(fragment, element);
        es.observer.observe(element.previousElementSibling);
        element.remove();
      } else {
        es.mainContext.appendChild(fragment);
        es.observer.observe(es.mainContext.lastElementChild);
      }
      if (!refreshAll) {
        await endless_load(es.mainContext, true, null, currentPage);
        this.es_setRemoveEntry(es.mainContext);
        if (Settings.get('ts') && !Settings.get('us')) {
          this.esgst.modules.generalTableSorter.ts_sortTables();
        }
        es.refreshButton.addEventListener('click', this.esgst.es_refresh.bind(this));
        createElements(es.refreshButton, 'inner', [{
          attributes: {
            class: 'fa fa-refresh'
          },
          type: 'i'
        }, {
          attributes: {
            class: 'fa fa-map-marker'
          },
          type: 'i'
        }]);
      }
    } else {
      if (es.divisors) {
        createElements(es.mainContext, 'beforeEnd', [{
          attributes: {
            class: 'esgst-page-heading esgst-es-page-divisor'
          },
          type: 'div',
          children: [{
            attributes: {
              class: 'page__heading__breadcrumbs page_heading_breadcrumbs'
            },
            type: 'div',
            children: [{
              attributes: {
                href: `${this.esgst.searchUrl}${es.nextPage}`
              },
              text: `Page ${es.nextPage}`,
              type: 'a'
            }]
          }]
        }]);
      }
      es.mainContext.appendChild(fragment);
      es.observer.observe(es.mainContext.lastElementChild);
      await endless_load(es.mainContext, true, null, currentPage);
      this.es_setRemoveEntry(es.mainContext);
      if (Settings.get('ts') && !Settings.get('us')) {
        this.esgst.modules.generalTableSorter.ts_sortTables();
      }
      es.progress.remove();
      if (es.reverseScrolling) {
        --es.nextPage;
        es.busy = false;
        if (es.nextPage <= 0) {
          es.ended = true;
          if (callback && typeof callback === 'function') {
            callback();
          }
        } else if (!es.paused && !es.step) {
          if (es.continuous) {
            this.esgst.es_loadNext(callback);
          } else if (callback && typeof callback === 'function') {
            callback();
          } else if (this.esgst.pagination.getAttribute('data-esgst-intersecting')) {
            this.esgst.es_loadNext(null, true);
          }
        } else if (callback && typeof callback === 'function') {
          callback();
        }
      } else {
        ++es.nextPage;
        es.busy = false;
        if (paginationNavigation.lastElementChild.classList.contains(this.esgst.selectedClass)) {
          es.ended = true;
          if (callback && typeof callback === 'function') {
            callback();
          }
        } else if (!es.paused && !es.step) {
          if (es.continuous) {
            this.esgst.es_loadNext(callback);
          } else if (callback && typeof callback === 'function') {
            callback();
          } else if (this.esgst.pagination.getAttribute('data-esgst-intersecting')) {
            this.esgst.es_loadNext(null, true);
          }
        } else if (callback && typeof callback === 'function') {
          callback();
        }
      }
    }
    let paginationCount = null;
    if (this.esgst.pagination.textContent.match(/No\sresults\swere\sfound\./)) {
      this.esgst.pagination.firstElementChild.firstChild.remove();
      DOM.build(this.esgst.pagination.firstElementChild, 'afterBegin', [
        'Displaying ',
        ['strong', 1],
        ' to ',
        ['strong', n],
        ' of ',
        ['strong', n],
        ` result${n > 1 ? 's' : ''}`
      ]);
    } else {
      if (es.reverseScrolling && !refresh) {
        paginationCount = this.esgst.pagination.firstElementChild.firstElementChild;
      } else {
        paginationCount = this.esgst.pagination.firstElementChild.firstElementChild.nextElementSibling;
      }
      paginationCount.textContent = (parseInt(paginationCount.textContent.replace(/,/g, '')) - oldN + (es.reverseScrolling && !refresh ? (-n) : n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
    }
  }

  es_changePagination(es, index) {
    const correctedIndex = es.reverseScrolling ? (es.pageBase - index) : (index - es.pageBase);
    const pagination = es.paginations[correctedIndex - 1];
    if (pagination && this.esgst.paginationNavigation.innerHTML !== pagination) {
      createElements(this.esgst.paginationNavigation, 'inner', [...(Array.from(DOM.parse(pagination).body.childNodes).map(x => {
        return {
          context: x
        };
      }))]);
      this.esgst.modules.generalPaginationNavigationOnTop.pnot_simplify();
      this.es_fixFirstPageLinks();
      let lastLink = this.esgst.paginationNavigation.lastElementChild;
      if (this.esgst.lastPageLink && this.esgst.lastPage !== es.pageIndex && !lastLink.classList.contains('is-selected') && !lastLink.querySelector('.fa-angle-double-right')) {
        createElements(this.esgst.paginationNavigation, 'beforeEnd', this.esgst.lastPageLink);
      }
      this.es_setPagination(es);
    }
  }

  es_fixFirstPageLinks() {
    const firstPageLinks = this.esgst.paginationNavigation.querySelectorAll(`[data-page-number="1"]`);
    // @ts-ignore
    for (const firstPageLink of firstPageLinks) {
      firstPageLink.setAttribute('href', `${firstPageLink.getAttribute('href')}/search?page=1`);
    }
  }

  async es_stepNext(es) {
    if (es.step) return;
    createElements(es.nextButton, 'inner', [{
      attributes: {
        class: 'fa fa-circle-o-notch fa-spin'
      },
      type: 'i'
    }]);
    es.step = true;
    const wasPaused = es.paused;
    await this.es_resume(es);
    this.esgst.es_loadNext(async () => {
      es.step = false;
      if (wasPaused) {
        await this.es_pause(es);
      } else {
        await this.es_resume(es);
      }
      createElements(es.nextButton, 'inner', [{
        attributes: {
          class: 'fa fa-step-forward'
        },
        type: 'i'
      }]);
    });
  }

  async es_continuouslyLoad(es) {
    if (es.continuous) return;
    createElements(es.continuousButton, 'inner', [{
      attributes: {
        class: 'fa fa-circle-o-notch fa-spin'
      },
      type: 'i'
    }]);
    es.continuous = true;
    const wasPaused = es.paused;
    await this.es_resume(es);
    if (Settings.get('es_cl')) {
      es.isLimited = true;
      es.limitCount = Math.min(10, parseInt(Settings.get('es_pages')));
    }
    this.esgst.es_loadNext(async () => {
      es.isLimited = false;
      es.limitCount = 0;
      es.continuous = false;
      if (wasPaused) {
        await this.es_pause(es);
      } else {
        await this.es_resume(es);
      }
      createElements(es.continuousButton, 'inner', [{
        attributes: {
          class: 'fa fa-fast-forward'
        },
        type: 'i'
      }]);
    });
  }

  async es_pause(es, firstRun) {
    es.paused = true;
    es.pauseButton.classList.add('esgst-hidden');
    es.resumeButton.classList.remove('esgst-hidden');
    if (!firstRun) {
      await setSetting(`es_paused_${es.id}_${Shared.esgst.name}`, es.paused);
    }
    es.continuous = false;
    createElements(es.continuousButton, 'inner', [{
      attributes: {
        class: 'fa fa-fast-forward'
      },
      type: 'i'
    }]);
  }

  async es_resume(es, firstRun) {
    es.paused = false;
    es.resumeButton.classList.add('esgst-hidden');
    es.pauseButton.classList.remove('esgst-hidden');
    if (!firstRun) {
      await setSetting(`es_paused_${es.id}_${Shared.esgst.name}`, es.paused);
    }
    if (this.esgst.pagination.getAttribute('data-esgst-intersecting')) {
      this.esgst.es_loadNext(null, true);
    }
  }

  async es_refresh(es) {
    es.refreshButton.removeEventListener('click', this.esgst.es_refresh);
    createElements(es.refreshButton, 'inner', [{
      attributes: {
        class: 'fa fa-circle-o-notch fa-spin'
      },
      type: 'i'
    }]);
    let response = await request({ method: 'GET', url: `${this.esgst.searchUrl}${es.pageIndex}` });
    // noinspection JSIgnoredPromiseFromCall
    this.es_getNext(es, true, false, null, response);
    if (this.esgst.giveawaysPath && Settings.get('es_rd')) {
      if (Settings.get('oadd')) {
        // noinspection JSIgnoredPromiseFromCall
        this.esgst.modules.discussionsOldActiveDiscussionsDesign.oadd_load(true);
      } else {
        checkMissingDiscussions(true);
      }
    }
    if (this.esgst.pinnedGiveaways) {
      createElements(this.esgst.pinnedGiveaways, 'inner', [...(Array.from(DOM.parse(response.responseText).getElementsByClassName('pinned-giveaways__outer-wrap')[0].childNodes).map(x => {
        return {
          context: x
        };
      }))]);
      await endless_load(this.esgst.pinnedGiveaways, true);
      this.esgst.modules.giveawaysPinnedGiveawaysButton.init();
    }

    await EventDispatcher.dispatch(Events.PAGE_REFRESHED, (await FetchRequest.get(Shared.esgst.sg ? '/giveaways/search?type=wishlist' : '/')).html);
  }

  async es_refreshAll(es) {
    es.refreshAllButton.removeEventListener('click', this.esgst.es_refreshAll);
    createElements(es.refreshAllButton, 'inner', [{
      attributes: {
        class: 'fa fa-circle-o-notch fa-spin'
      },
      type: 'i'
    }]);
    let page = es.reverseScrolling ? es.pageBase - 1 : es.pageBase + 1,
      response = await request({ method: 'GET', url: `${this.esgst.searchUrl}${page}` });
    // noinspection JSIgnoredPromiseFromCall
    this.es_getNext(es, true, page, null, response);
    const promises = [];
    for (let i = 1, n = es.paginations.length; i < n; ++i) {
      page = es.reverseScrolling ? es.pageBase - (i + 1) : es.pageBase + (i + 1);
      // noinspection JSIgnoredPromiseFromCall
      promises.push(this.es_getNext(es, true, page, null, await request({ method: 'GET', url: `${this.esgst.searchUrl}${page}` })));
    }

    await EventDispatcher.dispatch(Events.PAGE_REFRESHED, (await FetchRequest.get(Shared.esgst.sg ? '/giveaways/search?type=wishlist' : '/')).html);

    await Promise.all(promises);
    await endless_load(es.mainContext, true);
    this.es_setRemoveEntry(es.mainContext);
    es.refreshAllButton.addEventListener('click', this.esgst.es_refreshAll.bind(this));
    createElements(es.refreshAllButton, 'inner', [{
      attributes: {
        class: 'fa fa-refresh'
      },
      type: 'i'
    }]);
    if (Settings.get('ts') && !Settings.get('us')) {
      this.esgst.modules.generalTableSorter.ts_sortTables();
    }
    if (this.esgst.giveawaysPath && Settings.get('es_rd')) {
      if (Settings.get('oadd')) {
        // noinspection JSIgnoredPromiseFromCall
        this.esgst.modules.discussionsOldActiveDiscussionsDesign.oadd_load(true);
      } else {
        checkMissingDiscussions(true);
      }
    }
    if (this.esgst.pinnedGiveaways) {
      createElements(this.esgst.pinnedGiveaways, 'inner', [...(Array.from(DOM.parse(response.responseText).getElementsByClassName('pinned-giveaways__outer-wrap')[0].childNodes).map(x => {
        return {
          context: x
        };
      }))]);
      await endless_load(this.esgst.pinnedGiveaways, true);
      this.esgst.modules.giveawaysPinnedGiveawaysButton.init();
    }
  }

  es_setPagination(es) {
    let matches = this.esgst.paginationNavigation.children;
    for (let i = 0, n = matches.length; i < n; ++i) {
      matches[i].addEventListener('click', this.es_setPaginationItem.bind(this, es));
    }
  }

  es_setPaginationItem(es, event) {
    event.preventDefault();
    let page = parseInt(event.currentTarget.getAttribute('data-page-number')),
      element = document.querySelector(`.esgst-es-page-${page}:not(.esgst-hidden)`);
    if (element) {
      animateScroll(element.offsetTop, () => {
        this.es_changePagination(es, page);
      });
    } else {
      window.location.href = event.currentTarget.getAttribute('href');
    }
  }

  es_setRemoveEntry(Context) {
    let Matches = Context.getElementsByClassName('table__row-inner-wrap');
    for (let I = 0, N = Matches.length; I < N; ++I) {
      this.es_removeEntry(Matches[I]);
    }
  }

  es_removeEntry(Context) {
    let Default, Loading, Complete, Data;
    Default = Context.getElementsByClassName('table__remove-default')[0];
    if (Default) {
      Loading = Default.nextElementSibling;
      Complete = Loading.nextElementSibling;
      Default.addEventListener('click', async () => {
        let Values, I, N;
        Default.classList.toggle('is-hidden');
        Loading.classList.toggle('is-hidden');
        Values = Context.getElementsByTagName('input');
        Data = '';
        for (I = 0, N = Values.length; I < N; ++I) {
          Data += `${Values[I].getAttribute('name')}=${Values[I].value}${I < (N - 1) ? '&' : ''}`;
        }
        Loading.classList.toggle('is-hidden');
        let responseJson = JSON.parse((await request({ data: Data, method: 'POST', url: '/ajax.php' })).responseText);
        if (responseJson.type === 'success') {
          Context.classList.add('is-faded');
          Complete.classList.toggle('is-hidden');
          if (responseJson.points) {
            Shared.header.updatePoints(responseJson.points);
          }
        } else {
          Default.classList.toggle('is-hidden');
        }
      });
    }
  }
}

const generalEndlessScrolling = new GeneralEndlessScrolling();

export { generalEndlessScrolling };