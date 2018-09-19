_MODULES.push({
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
    load: es,
    name: `Endless Scrolling`,
    sg: true,
    st: true,
    type: `general`
  });

  function es() {
    if (!esgst.mainPageHeading || !esgst.pagination) return;
    let es = {};
    esgst.es = es;
    es.divisors = esgst.es_pd;
    es.mainContext = esgst.pagination.previousElementSibling;
    let rows = es.mainContext.getElementsByClassName(`table__rows`)[0];
    if (rows) {
      es.mainContext = rows;
    }
    es.paginations = [esgst.paginationNavigation ? esgst.paginationNavigation.innerHTML : ``];
    es.reverseScrolling = esgst.es_r && esgst.discussionPath;
    if (es.reverseScrolling) {
      if (esgst.currentPage === 1 && esgst.paginationNavigation && !esgst.parameters.page) {
        for (let i = 0, n = es.mainContext.children.length; i < n; ++i) {
          es.mainContext.children[0].remove();
        }
        esgst.mainComments = [];
        esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent = 0;
        if (esgst.paginationNavigation) {
          let lastLink = esgst.paginationNavigation.lastElementChild;
          if (lastLink.classList.contains(`is-selected`) && lastLink.textContent.match(/Last/) && !esgst.lastPageLink) {
            es.currentPage = parseInt(lastLink.getAttribute(`data-page-number`));
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
        es.currentPage = esgst.currentPage;
        es.nextPage = es.currentPage - 1;
        es.pageBase = es.currentPage + 1;
        es.ended = es.nextPage === 0;
      }
    } else {
      es.currentPage = esgst.currentPage;
      es.nextPage = es.currentPage + 1;
      es.pageBase = es.currentPage - 1;
      es.ended = (!esgst.paginationNavigation || esgst.paginationNavigation.lastElementChild.classList.contains(esgst.selectedClass));
    }
    const options = {
      rootMargin: `-${esgst.commentsTop + 1}px 0px 0px 0px`
    };
    es.observer = new IntersectionObserver(es_observe.bind(null, es), options);
    es_activate(es);
  }

  function es_observe(es, entries) {
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
          esgst.pagination.setAttribute(`data-esgst-intersecting`, true);
          esgst.es_loadNext(null, true);
        } else {
          esgst.pagination.removeAttribute(`data-esgst-intersecting`);
        }
      } else {
        const index = parseInt(entry.target.className.match(/es-page-(\d+)/)[1]);
        if (entry.isIntersecting) {
          es_changePagination(es, index);
        } else if (entry.boundingClientRect.y <= entry.rootBounds.y) {
          // The intersection element is no longer visible, but was scrolled upwards,
          // so we can now change the pagination.
          es_changePagination(es, es.reverseScrolling ? index - 1 : index + 1);
        }
      }
    }
  }

  async function es_activate(es) {
    for (let i = 0, n = es.mainContext.children.length; i < n; ++i) {
      if (i === n - 1) {
        es.observer.observe(es.mainContext.children[i]);
      }
      es.mainContext.children[i].classList.add(`esgst-es-page-${es.currentPage}`);
    }
    es.nextButton = createHeadingButton({featureId: `es`, id: `esNext`, icons: [`fa-step-forward`], title: `Load next page`});
    es.continuousButton = createHeadingButton({featureId: `es`, id: `esContinuous`, icons: [`fa-fast-forward`], title: `Continuously load pages`});
    if (es.ended) {
      es.continuousButton.classList.add(`esgst-hidden`);
    }
    es.pauseButton = createHeadingButton({featureId: `es`, id: `esPause`, icons: [`fa-pause`], title: `Pause the endless scrolling`});
    es.resumeButton = createHeadingButton({featureId: `es`, id: `esResume`, orderId: `esPause`, icons: [`fa-play`], title: `Resume the endless scrolling`});
    es.refreshButton = createHeadingButton({featureId: `es`, id: `esRefresh`, icons: [`fa-refresh`, `fa-map-marker`], title: `Refresh current page`});
    es.refreshAllButton = createHeadingButton({featureId: `es`, id: `esRefreshAll`, icons: [`fa-refresh`], title: `Refresh all pages`});
    esgst.es_refresh = es_refresh.bind(null, es);
    es.refreshButton.addEventListener(`click`, esgst.es_refresh);
    esgst.es_refreshAll = es_refreshAll.bind(null, es);
    es.refreshAllButton.addEventListener(`click`, esgst.es_refreshAll);
    es.continuousButton.addEventListener(`click`, es_continuouslyLoad.bind(null, es));
    es.nextButton.addEventListener(`click`, es_stepNext.bind(null, es));
    es.pauseButton.addEventListener(`click`, es_pause.bind(null, es, false));
    es.resumeButton.addEventListener(`click`, es_resume.bind(null, es, false));
    if (esgst.paginationNavigation) {
      let lastLink = esgst.paginationNavigation.lastElementChild;
      if (esgst.lastPageLink && esgst.lastPage !== es.pageIndex && !lastLink.classList.contains(`is-selected`) && !lastLink.textContent.match(/Last/)) {
        createElements(esgst.paginationNavigation, `beforeEnd`, esgst.lastPageLink);
      }
      es_setPagination(es);
    }
    es.isLimited = false;
    es.limitCount = 0;
    es.busy = false;
    es.paused = await getValue(`esPause`, false);
    esgst.es_loadNext = es_loadNext.bind(null, es);
    if (es.paused) {
      es_pause(es, true);
    } else {
      es_resume(es, true);
    }
    es.pageIndex = es.currentPage;
    const options = {
      rootMargin: `0px 0px ${innerHeight}px 0px`
    };
    const observer = new IntersectionObserver(es_observe.bind(null, es), options);
    observer.observe(esgst.pagination);
    if (es.paused && es.reversePages) {
      esgst.es_loadNext();
    } else if (esgst.es_cl) {
      es_continuouslyLoad(es);
    }
  }

  async function es_loadNext(es, callback, force) {
    if (!esgst.stopEs && !es.busy && (!es.paused || es.reversePages) && !es.ended && ((force && !es.continuous && !es.step) || (!force && (es.continuous || es.step))) && (!es.isLimited || es.limitCount > 0)) {
      es.limitCount -= 1;
      es.busy = true;
      es.progress = createElements(esgst.pagination.firstElementChild, `beforeEnd`, [{
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
      es_getNext(es, false, false, callback, await request({method: `GET`, url: `${esgst.searchUrl}${es.nextPage}`}));
    } else if (callback && typeof callback === `function`) {
      callback();
    }
  }

  async function es_getNext(es, refresh, refreshAll, callback, response) {
    let pagination = parseHtml(response.responseText).getElementsByClassName(`pagination`)[0],
      context = pagination.previousElementSibling,
      rows = context.getElementsByClassName(`table__rows`)[0];
    if (rows) {
      context = rows;
    }
    let paginationNavigation = pagination.getElementsByClassName(esgst.paginationNavigationClass)[0];
    if (es.reversePages) {
      es.paginations[0] = paginationNavigation.innerHTML;
      createElements(esgst.paginationNavigation, `inner`, [...(Array.from(parseHtml(es.paginations[0]).body.childNodes).map(x => {
        return {
          context: x
        };
      }))]);
      if (esgst.paginationNavigation) {
        let lastLink = esgst.paginationNavigation.lastElementChild;
        if (esgst.lastPageLink && esgst.lastPage !== es.pageIndex && !lastLink.classList.contains(`is-selected`) && !lastLink.textContent.match(/Last/)) {
          createElements(esgst.paginationNavigation, `beforeEnd`, esgst.lastPageLink);
        }
        es_setPagination(es);
      }
      es.reversePages = false;
      if (es.currentPage === 999999999) {
        es.currentPage = parseInt(paginationNavigation.lastElementChild.getAttribute(`data-page-number`));
        es.nextPage = es.currentPage;
        es.pageBase = es.currentPage + 1;
        es.pageIndex = es.currentPage;
      }
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
    if (esgst.cr && esgst.discussionPath) {
      reverseComments(context);
    }
    let n = context.children.length;
    const currentPage = refresh ? refreshAll || es.pageIndex : es.nextPage;
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
      es.mainContext.insertBefore(fragment, element);
      es.observer.observe(element.previousElementSibling);
      element.remove();
      if (!refreshAll) {
        es_purgeRemovedElements();
        await endless_load(es.mainContext, true, null, currentPage);
        es_setRemoveEntry(es.mainContext);
        if (esgst.gf && esgst.gf.filteredCount) {
          filters_updateCount(esgst.gf);
        }
        if (esgst.df && esgst.df.filteredCount) {
          filters_updateCount(esgst.df);
        }
        if (esgst.cf && esgst.cf.filteredCount) {
          filters_updateCount(esgst.cf);
        }
        if (esgst.ts && !esgst.us) {
          ts_sortTables();
        }
      }
      esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent = (parseInt(esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent.replace(/,/g, ``)) - oldN + n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
      if (refreshAll) {
        es.check.count += 1;
      } else {
        es.refreshButton.addEventListener(`click`, esgst.es_refresh);
        createElements(es.refreshButton, `inner`, [{
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
        createElements(es.mainContext, `beforeEnd`, [{
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
                href: `${esgst.searchUrl}${es.nextPage}`
              },
              text: `Page ${es.nextPage}`,
              type: `a`
            }]
          }]
        }]);
      }
      es.mainContext.appendChild(fragment);
      es.observer.observe(es.mainContext.lastElementChild);
      await endless_load(es.mainContext, true, null, currentPage);
      es_setRemoveEntry(es.mainContext);
      if (esgst.ts && !esgst.us) {
        ts_sortTables();
      }
      esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent = (parseInt(esgst.pagination.firstElementChild.firstElementChild.nextElementSibling.textContent.replace(/,/g, ``)) + n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
      es.progress.remove();
      if (es.reverseScrolling) {
        --es.nextPage;
        es.busy = false;
        if (es.nextPage <= 0) {
          es.ended = true;
          if (callback && typeof callback === `function`) {
            callback();
          }
        } else if (!es.paused && !es.step) {
          if (es.continuous) {
            esgst.es_loadNext(callback);
          } else if (callback && typeof callback === `function`) {
            callback();
          } else if (esgst.pagination.getAttribute(`data-esgst-intersecting`)) {
            esgst.es_loadNext(null, true);
          }
        } else if (callback && typeof callback === `function`) {
          callback();
        }
      } else {
        ++es.nextPage;
        es.busy = false;
        if (paginationNavigation.lastElementChild.classList.contains(esgst.selectedClass)) {
          es.ended = true;
          if (callback && typeof callback === `function`) {
            callback();
          }
        } else if (!es.paused && !es.step) {
          if (es.continuous) {
            esgst.es_loadNext(callback);
          } else if (callback && typeof callback === `function`) {
            callback();
          } else if (esgst.pagination.getAttribute(`data-esgst-intersecting`)) {
            esgst.es_loadNext(null, true);
          }
        } else if (callback && typeof callback === `function`) {
          callback();
        }
      }
    }
  }

  function es_purgeRemovedElements() {
    // there are more elements that need to be purged,
    // but for now these are the most critical ones
    const keys = [`attachedImages`, `mainComments`, `tsTables`, `mainGiveaways`, `mainDiscussions`, `mainUsers`, `mainGames`, `popupGiveaways`, `popupDiscussions`, `popupUsers`, `popupGames`];
    for (const key of keys) {
      for (let i = esgst[key].length - 1; i > -1; i--) {
        if (document.contains(esgst[key][i].outerWrap)) continue;
        esgst[key].splice(i, 1);
      }
    }
    for (const key in esgst.apPopouts) {
      if (document.contains(esgst.apPopouts[key].popout)) continue;
      delete esgst.apPopouts[key];
    }
    for (const key in esgst.currentUsers) {
      const elements = esgst.currentUsers[key].elements;
      for (let i = elements.length - 1; i > -1; i--) {
        if (document.contains(elements[i])) continue;
        elements.splice(i, 1);
      }
      if (elements.length) continue;
      delete esgst.currentUsers[key];
    }
  }

  function es_changePagination(es, index) {
    const pagination = es.paginations[index - 1];
    if (pagination && esgst.paginationNavigation.innerHTML !== pagination) {
      createElements(esgst.paginationNavigation, `inner`, [...(Array.from(parseHtml(pagination).body.childNodes).map(x => {
        return {
          context: x
        };
      }))]);
      let lastLink = esgst.paginationNavigation.lastElementChild;
      if (esgst.lastPageLink && esgst.lastPage !== es.pageIndex && !lastLink.classList.contains(`is-selected`) && !lastLink.textContent.match(/Last/)) {
        createElements(esgst.paginationNavigation, `beforeEnd`, esgst.lastPageLink);
      }
      es_setPagination(es);
    }
  }

  async function es_stepNext(es) {
    if (es.step) return;
    createElements(es.nextButton, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    es.step = true;
    const wasPaused = es.paused;
    await es_resume(es);
    esgst.es_loadNext(async () => {
      es.step = false;
      if (wasPaused) {
        await es_pause(es);
      } else {
        await es_resume(es);
      }
      createElements(es.nextButton, `inner`, [{
        attributes: {
          class: `fa fa-step-forward`
        },
        type: `i`
      }]);
    });
  }

  async function es_continuouslyLoad(es) {
    if (es.continuous) return;
    createElements(es.continuousButton, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    es.continuous = true;
    const wasPaused = es.paused;
    await es_resume(es);
    if (esgst.es_cl) {
      es.isLimited = true;
      es.limitCount = Math.min(10, parseInt(esgst.es_pages));
    }
    esgst.es_loadNext(async () => {
      es.isLimited = false;
      es.limitCount = 0;
      es.continuous = false;
      if (wasPaused) {
        await es_pause(es);
      } else {
        await es_resume(es);
      }
      createElements(es.continuousButton, `inner`, [{
        attributes: {
          class: `fa fa-fast-forward`
        },
        type: `i`
      }]);
    });
  }

  async function es_pause(es, firstRun) {
    es.paused = true;
    es.pauseButton.classList.add(`esgst-hidden`);
    es.resumeButton.classList.remove(`esgst-hidden`);
    if (!firstRun) {
      await setValue(`esPause`, es.paused);
    }
    es.continuous = false;
    createElements(es.continuousButton, `inner`, [{
      attributes: {
        class: `fa fa-fast-forward`
      },
      type: `i`
    }]);
  }

  async function es_resume(es, firstRun) {
    es.paused = false;
    es.resumeButton.classList.add(`esgst-hidden`);
    es.pauseButton.classList.remove(`esgst-hidden`);
    if (!firstRun) {
      await setValue(`esPause`, es.paused);
    }
    if (esgst.pagination.getAttribute(`data-esgst-intersecting`)) {
      esgst.es_loadNext(null, true);
    }
  }

  async function es_refresh(es) {
    es.refreshButton.removeEventListener(`click`, esgst.es_refresh);
    createElements(es.refreshButton, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    let response = await request({method: `GET`, url: `${esgst.searchUrl}${es.pageIndex}`});
    es_getNext(es, true, false, null, response);
    if (esgst.giveawaysPath && esgst.es_rd) {
      if (esgst.oadd) {
        oadd_load(true);
      } else {
        checkMissingDiscussions(true);
      }
    }
    if (esgst.pinnedGiveaways) {
      createElements(esgst.pinnedGiveaways, `inner`, [...(Array.from(parseHtml(response.responseText).getElementsByClassName(`pinned-giveaways__outer-wrap`)[0].childNodes).map(x => {
        return {
          context: x
        };
      }))]);
      await endless_load(esgst.pinnedGiveaways, true);
      pgb();
    }
    if (!esgst.hr) {
      await hr_refreshHeaderElements(parseHtml((await request({method: `GET`, url: esgst.sg ? `/giveaways/search?type=wishlist` : `/`})).responseText));
      hr_refreshHeader(hr_getCache());
    }
  }

  async function es_refreshAll(es) {
    es.refreshAllButton.removeEventListener(`click`, esgst.es_refreshAll);
    createElements(es.refreshAllButton, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    es.check = new CompletionCheck(es.paginations.length, async () => {
      es_purgeRemovedElements();
      await endless_load(es.mainContext, true);
      es_setRemoveEntry(es.mainContext);
      es.refreshAllButton.addEventListener(`click`, esgst.es_refreshAll);
      createElements(es.refreshAllButton, `inner`, [{
        attributes: {
          class: `fa fa-refresh`
        },
        type: `i`
      }]);
      if (esgst.gf && esgst.gf.filteredCount) {
        filters_updateCount(esgst.gf);
      }
      if (esgst.df && esgst.df.filteredCount) {
        filters_updateCount(esgst.df);
      }
      if (esgst.cf && esgst.cf.filteredCount) {
        filters_updateCount(esgst.cf);
      }
      if (esgst.ts && !esgst.us) {
        ts_sortTables();
      }
      if (esgst.giveawaysPath && esgst.es_rd) {
        if (esgst.oadd) {
          oadd_load(true);
        } else {
          checkMissingDiscussions(true);
        }
      }
      if (esgst.pinnedGiveaways) {
        createElements(esgst.pinnedGiveaways, `inner`, [...(Array.from(parseHtml(response.responseText).getElementsByClassName(`pinned-giveaways__outer-wrap`)[0].childNodes).map(x => {
          return {
            context: x
          };
        }))]);
        await endless_load(esgst.pinnedGiveaways, true);
        pgb();
      }
    });
    let page = es.reverseScrolling ? es.pageBase - 1 : es.pageBase + 1,
      response = await request({method: `GET`, url: `${esgst.searchUrl}${page}`});
    es_getNext(es, true, page, null, response);
    for (let i = 1; i < es.check.total; ++i) {
      page = es.reverseScrolling ? es.pageBase - (i + 1) : es.pageBase + (i + 1);
      es_getNext(es, true, page, null, await request({method: `GET`, url: `${esgst.searchUrl}${page}`}));
    }
    if (!esgst.hr) {
      await hr_refreshHeaderElements(parseHtml((await request({method: `GET`, url: esgst.sg ? `/giveaways/search?type=wishlist` : `/`})).responseText));
      hr_refreshHeader(hr_getCache());
    }
  }

  function es_setPagination(es) {
    let matches = esgst.paginationNavigation.children;
    for (let i = 0, n = matches.length; i < n; ++i) {
      matches[i].addEventListener(`click`, es_setPaginationItem.bind(null, es));
    }
  }

  function es_setPaginationItem(es, event) {
    event.preventDefault();
    let page = parseInt(event.currentTarget.getAttribute(`data-page-number`)),
      element = document.querySelector(`.esgst-es-page-${page}:not(.esgst-hidden)`);
    if (element) {
      animateScroll(element.offsetTop, () => {
        es_changePagination(es, page);
      });
    } else {
      location.href = event.currentTarget.getAttribute(`href`);
    }
  }

  function es_setRemoveEntry(Context) {
    let Matches = Context.getElementsByClassName(`table__row-inner-wrap`);
    for (let I = 0, N = Matches.length; I < N; ++I) {
      es_removeEntry(Matches[I]);
    }
  }

  function es_removeEntry(Context) {
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
        let responseJson = JSON.parse((await request({data: Data, method: `POST`, url: `/ajax.php`})).responseText);
        if (responseJson.type === `success`) {
          Context.classList.add(`is-faded`);
          Complete.classList.toggle(`is-hidden`);
          esgst.pointsContainer.textContent = responseJson.points;
          esgst.points = parseInt(esgst.pointsContainer.textContent.replace(/,/g, ``).match(/\d+/)[0]);
        } else {
          Default.classList.toggle(`is-hidden`);
        }
      });
    }
  }

