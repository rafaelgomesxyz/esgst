_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-check"></i> if the thread is not marked as visited and <i class="fa fa-times"></i> if it is) to the "Comments" column of any <a href="https://www.steamgifts.com/discussions">discussions</a>/<a href="https://www.steamgifts.com/support/tickets">tickets</a>/<a href="https://www.steamtrades.com/trades">trades</a> pages and to the main page heading of any discussion/ticket/trade page that allows you to mark the thread as visited.</li>
        <li>Giveaways/theads marked as visited are faded out in the page.</li>
      <ul>
    `,
    features: {
      gdttt_g: {
        name: `Fade visited giveaways.`,
        sg: true
      },
      gdttt_vd: {
        name: `Mark discussions as visited when visiting them.`,
        sg: true
      },
      gdttt_vg: {
        name: `Mark giveaways as visited when visiting them.`,
        sg: true
      },
      gdttt_vt: {
        name: `Mark tickets as visited when visiting them.`,
        sg: true
      },
      gdttt_vts: {
        name: `Mark trades as visited when visiting them.`,
        st: true
      }
    },
    id: `gdttt`,
    load: gdttt,
    name: `Giveaway/Discussion/Ticket/Trade Tracker`,
    sg: true,
    st: true,
    type: `general`
  });

  async function gdttt() {
    esgst.endlessFeatures.push(gdttt_checkVisited);
    if (!esgst.commentsPath) return;
    let match = location.pathname.match(/(giveaway|discussion|ticket|trade)\/(.+?)\//);
    let type = `${match[1]}s`;
    let code = match[2];
    let savedComments = JSON.parse(esgst.storage[type]);
    if (esgst[`gdttt_v${{
      giveaways: `g`,
      discussions: `d`,
      tickets: `t`,
      trades: `ts`
    }[type]}`]) {
      if (!esgst.ct) {
        let cache = JSON.parse(getLocalValue(`gdtttCache`, `{"giveaways":[],"discussions":[],"tickets":[],"trades":[]}`));
        if (cache[type].indexOf(code) < 0) {
          cache[type].push(code);
          setLocalValue(`gdtttCache`, JSON.stringify(cache));
        }
        let deleteLock = await createLock(`commentLock`, 300);
        if (!savedComments[code]) {
          savedComments[code] = {
            readComments: {}
          };
        }
        savedComments[code].visited = true;
        savedComments[code].lastUsed = Date.now();
        await setValue(type, JSON.stringify(savedComments));
        deleteLock();
      }
    } else if (esgst.discussionPath || esgst.tradePath) {
      if (savedComments[code] && savedComments[code].visited) {
        gdttt_addMarkUnvisitedButton(null, code, document.querySelector(`.page__heading, .page_heading`), /*HERE*/null, type);
      } else {
        gdttt_addMarkVisitedButton(null, code, document.querySelector(`.page__heading, .page_heading`), /*HERE*/null, type);
      }
    }
  }

  async function gdttt_markVisited(code, container, count, diffContainer, type, doSave) {
    if (doSave) {
      let deleteLock = await createLock(`commentLock`, 300),
        comments = JSON.parse(await getValue(type));
      if (!comments[code]) {
        comments[code] = {
          readComments: {}
        };
      }
      if (esgst.ct_s) {
        comments[code].count = count;
        diffContainer.textContent = ``;
      }
      comments[code].visited = true;
      comments[code].lastUsed = Date.now();
      await setValue(type, JSON.stringify(comments));
      deleteLock();
    }
    container.classList.add(`esgst-ct-visited`);
    container.style.opacity = `0.5`;
    setHoverOpacity(container, `1`, `0.5`);
    return true;
  }

  async function gdttt_markUnvisited(code, container, count, diffContainer, type, doSave) {
    if (doSave) {
      let deleteLock = await createLock(`commentLock`, 300),
        comments = JSON.parse(await getValue(type));
      if (esgst.ct_s) {
        delete comments[code].count;
        diffContainer.textContent = `(+${count})`;
      }
      delete comments[code].visited;
      comments[code].lastUsed = Date.now();
      await setValue(type, JSON.stringify(comments));
      deleteLock();
    }
    container.classList.remove(`esgst-ct-visited`);
    container.style.opacity = `1`;
    setHoverOpacity(container, `1`, `1`);
    return true;
  }

  async function gdttt_checkVisited(context, main, src, endless) {
    let matches = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .homepage_table_column_heading, .esgst-es-page-${endless}.homepage_table_column_heading` : `.homepage_table_column_heading`}, ${endless ? `.esgst-es-page-${endless} .table__column__heading, .esgst-es-page-${endless}.table__column__heading` : `.table__column__heading`}, ${endless ? `.esgst-es-page-${endless} .giveaway__heading__name, .esgst-es-page-${endless}.giveaway__heading__name` : `.giveaway__heading__name`}, ${endless ? `.esgst-es-page-${endless} .column_flex h3 a, .esgst-es-page-${endless}.column_flex h3 a` : `.column_flex h3 a`}`);
    if (!matches.length) return;
    let values = await getValues({
      giveaways: `{}`,
      discussions: `{}`,
      tickets: `{}`,
      trades: `{}`
    });
    for (let key in values) {
      values[key] = JSON.parse(values[key]);
    }
    for (let i = 0, n = matches.length; i < n; ++i) {
      let match = matches[i];
      let url = match.getAttribute(`href`);
      if (url) {
        let source = url.match(/(giveaway|discussion|ticket|trade)\/(.+?)(\/.*)?$/);
        if (source) {
          let type = `${source[1]}s`;
          let code = source[2];
          let container = match.closest(`.table__row-outer-wrap, .giveaway__row-outer-wrap, .row_outer_wrap`);
          let comment = values[type][code];
          if (comment && comment.visited && container) {
            if ((type === `giveaways` && esgst.gdttt_g) || type !== `giveaways`) {
              container.classList.add(`esgst-ct-visited`);
              container.style.opacity = `0.5`;
              setHoverOpacity(container, `1`, `0.5`);
            }
          }
        }
      }
    }
  }

  function gdttt_addMarkVisitedButton(button, code, context, count, type) {
    let comments;
    let busy = false;
    if (!button) {
      button = createElements(context, `afterBegin`, [{
        attributes: {
          class: `esgst-gdttt-button page_heading_btn`
        },
        type: `div`
      }]);
    }
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-check`,
        title: `${getFeatureTooltip(`gdttt`, `Mark as visited`)}`
      },
      type: `i`
    }]);
    button.addEventListener(`click`, async () => {
      if (!busy) {
        busy = true;
        createElements(button, `inner`, [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }]);
        let deleteLock = await createLock(`commentLock`, 300);
        comments = JSON.parse(await getValue(type));
        if (!comments[code]) {
          comments[code] = {
            readComments: {}
          };
        }
        if (esgst.ct_s) {
          comments[code].count = count;
        }
        comments[code].visited = true;
        comments[code].lastUsed = Date.now();
        await setValue(type, JSON.stringify(comments));
        deleteLock();
        gdttt_addMarkUnvisitedButton(button, code, context, count, type);
      }
    });
  }

  function gdttt_addMarkUnvisitedButton(button, code, context, count, type) {
    let comments;
    let busy = false;
    if (!button) {
      button = createElements(context, `afterBegin`, [{
        attributes: {
          class: `esgst-gdttt-button page_heading_btn`
        },
        type: `div`
      }]);
    }
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-times`,
        title: `${getFeatureTooltip(`gdttt`, `Mark as unvisited`)}`
      },
      type: `i`
    }]);
    button.addEventListener(`click`, async () => {
      if (!busy) {
        busy = true;
        createElements(button, `inner`, [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }]);
        let deleteLock = await createLock(`commentLock`, 300);
        comments = JSON.parse(await getValue(type));
        if (esgst.ct_s) {
          delete comments[code].count;
        }
        delete comments[code].visited;
        comments[code].lastUsed = Date.now();
        await setValue(type, JSON.stringify(comments));
        deleteLock();
        gdttt_addMarkVisitedButton(button, code, context, count, type);
      }
    });
  }

