_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-gift"></i> <i class="fa fa-search"></i>) to the main page heading of any giveaway/discussion page that allows you to extract all of the giveaways that are linked in the page.</li>
        <li>The giveaways are extracted recursively. For example, if giveaway A has links to giveaways B and C, the feature will extract giveaway B and all of the giveaways linked in it before moving on to giveaway C, and so on.</li>
        <li>The feature keeps extracting giveaways until it no longer finds a giveaway link in the page. To prevent a loop (and consequently duplicate results), it keeps track of which giveaways it has already extracted so that they are not extracted again.</li>
        <li>If you use the feature in a giveaway page, it will add a "Bump" link to the results (when available).</li>
        <li>This feature is useful for extracting trains (multiple giveaways linked to each other).</li>
      </ul>
    `,
    features: {
      ge_b: {
        background: true,
        name: `Highlight giveaways that cannot be entered because of blacklist reasons.`,
        sg: true
      },
      ge_g: {
        background: true,
        name: `Highlight group giveaways.`,
        sg: true
      },
      ge_p: {
        background: true,
        name: `Highlight public giveaways.`,
        sg: true
      },
      ge_o: {
        description: `
          <ul>
            <li>With this option enabled, if you use the feature in the 6th giveaway of a train and the train has links to the previous giveaways, it will not go back and extract giveaways 1-5.</li>
            <li>This method is not 100% accurate, because the feature looks for a link with any variation of "next" in the description of the giveaway to make sure that it is going forward, so if it does not find such a link, the extraction will stop.</li>
          </ul>
        `,
        name: `Only extract from the current giveaway onward.`,
        sg: true
      },
      ge_sgt: {
        features: {
          ge_sgt_l: {
            inputItems: [
              {
                id: `ge_sgt_limit`,
                prefix: `Limit: `
              }
            ],
            name: `Limit how many links are opened.`,
            sg: true
          }
        },
        name: `Automatically open any SGTools links found in new tabs.`,
        sg: true
      },
      ge_t: {
        name: `Open the extractor in a new tab.`,
        sg: true
      }
    },
    id: `ge`,
    load: ge,
    name: `Giveaway Extractor`,
    sg: true,
    type: `giveaways`
  });

  async function ge() {
    if (((esgst.giveawayCommentsPath && !document.getElementsByClassName(`table--summary`)[0]) || esgst.discussionPath) && (document.querySelector(`.markdown [href*="/giveaway/"], .markdown [href*="sgtools.info/giveaways"]`))) {
      let ge = {
        button: createHeadingButton({id: `ge`, icons: [`fa-gift`, `fa-search`], title: `Extract giveaways`})
      };
      setMouseEvent(ge.button, `ge_t`, `/esgst/extracted-giveaways?url=${location.pathname.match(/^\/(giveaway|discussion)\/.+?\//)[0]}`, ge_openPopup.bind(null, ge));
    } else if (esgst.gePath) {
      let ge = {
        context: parseHtml((await request({method: `GET`, url: getParameters().url})).responseText)
      };
      ge_openPopup(ge);
    }
  }

  function ge_openPopup(ge) {
    if (ge.popup) {
      ge.popup.open();
      return;
    }
    ge.count = 0;
    ge.total = 0;
    ge.extracted = [];
    ge.bumpLink = ``;
    ge.points = 0;
    ge.sgToolsCount = 0;
    ge.isDivided = esgst.gc_gi || esgst.gc_r || esgst.gc_rm || esgst.gc_ea || esgst.gc_tc || esgst.gc_a || esgst.gc_mp || esgst.gc_sc || esgst.gc_l || esgst.gc_m || esgst.gc_dlc || esgst.gc_rd || esgst.gc_g;
    if (esgst.gePath) {
      ge.popup = {
        description: esgst.mainContext,
        scrollable: esgst.mainContext,
        open: () => {},
        reposition: () => {}
      };
    } else {
      ge.popup = new Popup(`fa-gift`, `Extracted giveaways:`);
    }
    ge.results = createElements(ge.popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-text-left`
      },
      type: `div`
    }]);
    if (esgst.gas || (esgst.gf && esgst.gf_m) || esgst.mm) {
      let heading = createElements(ge.popup.scrollable, `afterBegin`, [{
        attributes: {
          class: `page__heading`
        },
        type: `div`
      }]);
      if (esgst.gas) {
        gas(heading);
      }
      if (esgst.gf && esgst.gf_m) {
        heading.appendChild(filters_addContainer(`gf`, heading, `Ge`));
      }
      if (esgst.mm) {
        mm(heading);
      }
    }
    ge.set = new ButtonSet(`green`, `grey`, `fa-search`, `fa-times`, `Extract`, `Cancel`, callback => {
      if (ge.callback) {
        createElements(ge.results, `beforeEnd`, [{
          type: `div`
        }]);
        ge.callback();
      } else {
        ge.isCanceled = false;
        if (ge.button) {
          ge.button.classList.add(`esgst-busy`);
        }
        createElements(ge.progress, `inner`, [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }, {
          text: ge.total,
          type: `span`
        }, {
          text: ` giveaways extracted.`,
          type: `node`
        }]);
        createElements(ge.results, `beforeEnd`, [{
          type: `div`
        }]);
        ge.mainCallback = callback;
        let giveaways = ge_getGiveaways(ge, esgst.gePath ? ge.context : esgst.pageOuterWrap);
        ge_extractGiveaways(ge, giveaways, 0, giveaways.length, ge_completeExtraction.bind(null, ge, callback));
      }
    }, () => {
      ge.isCanceled = true;
      ge_completeExtraction(ge);
    });
    ge.popup.description.appendChild(ge.set.set);
    ge.progress = createElements(ge.popup.description, `beforeEnd`, [{
      type: `div`
    }]);
    if (esgst.es_ge) {
      ge.popup.scrollable.addEventListener(`scroll`, () => {
        if (ge.popup.scrollable.scrollTop + ge.popup.scrollable.offsetHeight >= ge.popup.scrollable.scrollHeight && ge.set && !ge.set.busy) {
          ge.set.trigger();
        }
      });
    }
    ge.set.trigger();
    ge.popup.open();
  }

  function ge_extractGiveaways(ge, giveaways, i, n, callback) {
    if (!ge.isCanceled) {
      if (i < n) {
        ge_extractGiveaway(ge, giveaways[i], setTimeout.bind(null, ge_extractGiveaways, 0, ge, giveaways, ++i, n, callback));
      } else {
        callback();
      }
    }
  }

  async function ge_extractGiveaway(ge, code, callback) {
    if (!ge.isCanceled) {
      if (ge.isDivided && ge.count === 50) {
        let children, filtered, i;
        ge.mainCallback();
        ge.count = 0;
        await endless_load(ge.results.lastElementChild, false, `ge`);
        ge.set.set.firstElementChild.lastElementChild.textContent = `Extract More`;
        ge.progress.firstElementChild.remove();
        ge.callback = ge_extractGiveaway.bind(null, ge, code, callback);
        filtered = false;
        children = ge.results.lastElementChild.children;
        for (i = children.length - 1; i > -1 && !filtered; --i) {
          if (children[i].firstElementChild.classList.contains(`esgst-hidden`)) {
            filtered = true;
          }
        }
        if ((esgst.es_ge && ge.popup.scrollable.scrollHeight <= ge.popup.scrollable.offsetHeight) || filtered) {
          ge.set.trigger();
        }
      } else {
        if (ge.extracted.indexOf(code) < 0) {
          let sgTools = code.length > 5;
          if (sgTools && esgst.ge_sgt && (!esgst.ge_sgt_l || ge.sgToolsCount < esgst.ge_sgt_limit)) {
            open(`https://www.sgtools.info/giveaways/${code}`);
            ge.extracted.push(code);
            ge.sgToolsCount += 1;
            callback();
            return;
          }
          let response = await request({method: `GET`, url: sgTools ? `https://www.sgtools.info/giveaways/${code}` : `/giveaway/${code}/`});
          let bumpLink, button, giveaway, giveaways, n, responseHtml;
          responseHtml = parseHtml(response.responseText);
          button = responseHtml.getElementsByClassName(`sidebar__error`)[0];
          giveaway = buildGiveaway(responseHtml, response.finalUrl, button && button.textContent);
          if (giveaway) {
            createElements(ge.results.lastElementChild, `beforeEnd`, giveaway.html);
            ge.points += giveaway.points;
            ge.count += 1;
            ge.total += 1;
            createElements(ge.progress, `inner`, [{
              attributes: {
                class: `fa fa-circle-o-notch fa-spin`
              },
              type: `i`
            }, {
              text: ge.total,
              type: `span`
            }, {
              text: ` giveaways extracted.`,
              type: `node`
            }]);
            ge.extracted.push(code);
            if (sgTools) {
              callback();
            } else {
              if (!ge.bumpLink) {
                bumpLink = responseHtml.querySelector(`[href*="/discussion/"]`);
                if (bumpLink) {
                  ge.bumpLink = bumpLink.getAttribute(`href`);
                }
              }
              giveaways = ge_getGiveaways(ge, responseHtml);
              n = giveaways.length;
              if (n > 0) {
                setTimeout(() => ge_extractGiveaways(ge, giveaways, 0, n, callback), 0);
              } else {
                callback();
              }
            }
          } else if (!sgTools) {
            let response = await request({anon: true, method: `GET`, url: `/giveaway/${code}/`});
            let bumpLink, giveaway, giveaways, n, responseHtml;
            responseHtml = parseHtml(response.responseText);
            giveaway = buildGiveaway(responseHtml, response.finalUrl, null, true);
            if (giveaway) {
              createElements(ge.results.lastElementChild, `beforeEnd`, giveaway.html);
              ge.points += giveaway.points;
            }
            ge.count += 1;
            ge.total += 1;
            createElements(ge.progress, `inner`, [{
              attributes: {
                class: `fa fa-circle-o-notch fa-spin`
              },
              type: `i`
            }, {
              text: ge.total,
              type: `span`
            }, {
              text: ` giveaways extracted.`,
              type: `node`
            }]);
            ge.extracted.push(code);
            if (!ge.bumpLink) {
              bumpLink = responseHtml.querySelector(`[href*="/discussion/"]`);
              if (bumpLink) {
                ge.bumpLink = bumpLink.getAttribute(`href`);
              }
            }
            giveaways = ge_getGiveaways(ge, responseHtml);
            n = giveaways.length;
            if (n > 0) {
              setTimeout(() => ge_extractGiveaways(ge, giveaways, 0, n, callback), 0);
            } else {
              callback();
            }
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    }
  }

  function ge_getGiveaways(ge, context) {
    let elements = context.querySelectorAll(`.markdown [href*="/giveaway/"], .markdown [href*="sgtools.info/giveaways"]`);
    let giveaways = [];
    if (context === ge.context) {
      let match = getParameters().url.match(/\/giveaway\/(.+?)\//);
      if (match) {
        giveaways.push(match[1]);
      }
    } else if (context === esgst.pageOuterWrap && esgst.giveawayPath) {
      let match = location.href.match(/\/giveaway\/(.+?)\//);
      if (match) {
        giveaways.push(match[1]);
      }
    }
    let next = {
      code: null,
      count: 0
    };
    for (let element of elements) {
      let url = element.getAttribute(`href`);
      let match = url.match(/\/(\w{5})\b/);
      if (!match) {
        match = url.match(/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})/);
        if (!match) continue;
      }
      let code = match[1];
      if (!esgst.ge_o || esgst.discussionPath || element.textContent.toLowerCase().match(/forw|more|next|>|→/)) {
        if (ge.extracted.indexOf(code) < 0 && giveaways.indexOf(code) < 0) {
          giveaways.push(code);
        }
      } else {
        match = element.textContent.match(/\d+/);
        if (match) {
          let count = parseInt(match[0]);
          if (count > next.count && ge.extracted.indexOf(code) < 0 && giveaways.indexOf(code) < 0) {
            next.code = code;
            next.count = count;
          }
        }
      }
    }
    if (next.count > 0) {
      giveaways.push(next.code);
    }
    return giveaways;
  }

  async function ge_completeExtraction(ge, callback) {
    if (ge.button) {
      ge.button.classList.remove(`esgst-busy`);
    }
    ge.progress.firstElementChild.remove();
    if (callback) {
      callback();
    }
    await endless_load(ge.results.lastElementChild, false, `ge`);
    const items = [{
      attributes: {
        class: `markdown esgst-text-center`
      },
      type: `div`,
      children: []
    }];
    if (ge.bumpLink && !esgst.discussionPath) {
      items[0].children.push({
        type: `h2`,
        children: [{
          attributes: {
            href: ge.bumpLink
          },
          text: `Bump`,
          type: `a`
        }]
      });
    }
    items[0].children.push({
      text: `${ge.points}P required to enter all giveaways.`,
      type: `node`
    });
    createElements(ge.results, `afterBegin`, items);
    createElements(ge.results, `beforeEnd`, items);
    ge.set.set.remove();
    ge.set = null;
  }

