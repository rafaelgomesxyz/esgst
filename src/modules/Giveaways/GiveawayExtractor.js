import dateFns_differenceInDays from 'date-fns/differenceInDays';
import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';
import { elementBuilder } from '../../lib/SgStUtils/ElementBuilder';
import { shared } from '../../class/Shared';

const
  parseHtml = utils.parseHtml.bind(utils),
  buildGiveaway = common.buildGiveaway.bind(common),
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  endless_load = common.endless_load.bind(common),
  getParameters = common.getParameters.bind(common),
  request = common.request.bind(common)
  ;

class GiveawaysGiveawayExtractor extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-gift` }],
            ` `,
            [`i`, { class: `fa fa-search` }],
            `) to the main page heading of any giveaway/discussion page that allows you to extract all of the giveaways that are linked in the page.`
          ]],
          [`li`, `The giveaways are extracted recursively. For example, if giveaway A has links to giveaways B and C, the feature will extract giveaway B and all of the giveaways linked in it before moving on to giveaway C, and so on.`],
          [`li`, `The feature keeps extracting giveaways until it no longer finds a giveaway link in the page. To prevent a loop (and consequently duplicate results), it keeps track of which giveaways it has already extracted so that they are not extracted again.`],
          [`li`, `If you use the feature in a giveaway page, it will add a "Bump" link to the results (when available).`],
          [`li`, `This feature is useful for extracting trains (multiple giveaways linked to each other).`]
        ]]
      ],
      features: {
        ge_p: {
          description: [
            [`li`, `With this option enabled, a second button is added that allows you to specify certain parameters before beginning the extraction.`]
          ],
          name: `Add button to specify parameters.`,
          sg: true
        },
        ge_j: {
          name: `Convert all Jigidi links to the "jigidi.com/jigsaw-puzzle" format.`,
          sg: true
        },
        ge_sgt: {
          conflicts: [
            `ge_sgtga`
          ],
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
        ge_sgtga: {
          conflicts: [
            `ge_sgt`
          ],
          features: {
            ge_sgtga_u: {
              name: `Automatically unlock SGTools giveaways that have not yet been unlocked.`,
              sg: true
            }
          },
          name: `Automatically retrieve the giveaway link from SGTools giveaways that have already been unlocked.`,
          sg: true
        },
        ge_t: {
          name: `Open the extractor in a new tab.`,
          sg: true
        }
      },
      id: `ge`,
      name: `Giveaway Extractor`,
      sg: true,
      type: `giveaways`
    };
  }

  async init() {
    if (((this.esgst.giveawayCommentsPath && !document.getElementsByClassName(`table--summary`)[0]) || this.esgst.discussionPath) && this.checkGiveaways()) {
      // noinspection JSIgnoredPromiseFromCall
      this.ge_addButton(`Extract all giveaways`);
      if (this.esgst.ge_p) {
        this.ge_addButton(`Extract all giveaways (specify parameters)`, [`fa-gear`], true);
      }
    } else if (shared.common.isCurrentPath(`Account`) && this.esgst.parameters.esgst === `ge`) {
      const parameters = getParameters();
      let ge = {
        context: parseHtml((await request({ method: `GET`, url: `${parameters.url}${parameters.page ? `/search?page=${parameters.page}` : ``}` })).responseText),
        extractOnward: !!parameters.extractOnward,
        flushCache: !!parameters.flush,
        flushCacheHours: parameters.flushHrs,
        ignoreDiscussionComments: !!parameters.noDiscCmt,
        ignoreGiveawayComments: !!parameters.noGaCmt
      };
      this.ge_openPopup(ge);
    }
  }

  ge_addButton(title, extraIcons = [], specifyParams) {
    let ge = {
      button: createHeadingButton({ id: `ge`, icons: [`fa-gift`, `fa-search`].concat(extraIcons), title })
    };
    if (specifyParams) {
      ge.button.addEventListener(`click`, () => {
        ge.extractOnward = this.esgst.ge_extractOnward;
        ge.flushCache = this.esgst.ge_flushCache;
        ge.flushCacheHours = this.esgst.ge_flushCacheHours;
        ge.ignoreDiscussionComments = this.esgst.ge_ignoreDiscussionComments;
        ge.ignoreGiveawayComments = this.esgst.ge_ignoreGiveawayComments;
        const popup = new Popup({
          icon: `fa-gear`,
          title: `Specify extractor parameters:`,
          addScrollable: true,
          buttons: [
            {
              color1: `green`,
              color2: `grey`,
              icon1: `fa-arrow-circle-right`,
              icon2: `fa-circle-o-notch fa-spin`,
              title1: `Open Extractor`,
              title2: `Opening...`,
              callback1: () => {
                popup.close();
                ge.extractOnward = this.esgst.ge_extractOnward;
                ge.flushCache = this.esgst.ge_flushCache;
                ge.flushCacheHours = this.esgst.ge_flushCacheHours;
                ge.ignoreDiscussionComments = this.esgst.ge_ignoreDiscussionComments;
                ge.ignoreGiveawayComments = this.esgst.ge_ignoreGiveawayComments;
                if (this.esgst.ge_t) {
                  window.open(`https://www.steamgifts.com/account/settings/profile?esgst=ge&${ge.extractOnward ? `extractOnward=true&` : ``}${ge.flushCache ? `flush=true&flushHrs=${ge.flushCacheHours}&` : ``}${ge.ignoreDiscussionComments ? `noDiscCmt=true&` : ``}${ge.ignoreGiveawayComments ? `noGaCmt=true&` : ``}url=${window.location.pathname.replace(/\/search.*/, ``)}${this.esgst.parameters.page ? `&page=${this.esgst.parameters.page}` : ``}`);
                } else {
                  this.ge_openPopup(ge);
                }
              }
            }
          ]
        });
        this.ge_showOptions(ge, popup.scrollable);
        popup.open();
      });
    } else {
      ge.button.addEventListener(`click`, () => {
        if (this.esgst.ge_t) {
          window.open(`https://www.steamgifts.com/account/settings/profile?esgst=ge&url=${window.location.pathname.replace(/\/search.*/, ``)}${this.esgst.parameters.page ? `&page=${this.esgst.parameters.page}` : ``}`);
        } else {
          this.ge_openPopup(ge);
        }
      });
    }
  }

  ge_showOptions(ge, context, reExtract) {
    new ToggleSwitch(context, `ge_extractOnward`, null, `Only extract from the current giveaway onward.`, false, false, `With this option enabled, if you are in the 6th giveaway of a train that has links to the previous giveaways, the extractor will not go back and extract giveaways 1-5. This method is not 100% accurate, because the feature looks for a link with any variation of "next" in the description of the giveaway to make sure that it is going forward, so if it does not find such a link, the extraction will stop.`, ge.extractOnward);
    if (!reExtract) {
      common.observeNumChange(new ToggleSwitch(context, `ge_flushCache`, null, [{
        text: `Flush the cache if it is older than `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-switch-input`,
          step: `0.1`,
          type: `number`,
          value: ge.flushCacheHours
        },
        type: `input`
      }, {
        text: ` hours.`,
        type: `node`
      }], false, false, null, ge.flushCache).name.firstElementChild, `ge_flushCacheHours`, true);
    }
    new ToggleSwitch(context, `ge_ignoreDiscussionComments`, null, `Ignore discussion comments when extracting giveaways.`, false, false, null, ge.ignoreDiscussionComments);
    new ToggleSwitch(context, `ge_ignoreGiveawayComments`, null, `Ignore giveaway comments when extracting giveaways.`, false, false, null, ge.ignoreGiveawayComments);
  }

  async ge_openPopup(ge) {
    if (ge.popup) {
      ge.popup.open();
      return;
    }
    const now = Date.now();
    let changed = false;
    ge.cache = JSON.parse(common.getValue(`geCache`, `{}`));
    for (const id in ge.cache) {
      if (dateFns_differenceInDays(now, ge.cache[id].timestamp) > 7) {
        changed = true;
        delete ge.cache[id];
      }
    }
    if (changed) {
      await common.setValue(`geCache`, JSON.stringify(ge.cache));
    }
    ge.cacheId = (this.esgst.parameters.url && this.esgst.parameters.url.match(/^\/(giveaway|discussion)\/.+?\//)[0]) || window.location.pathname.match(/^\/(giveaway|discussion)\/.+?\//)[0];
    ge.count = 0;
    ge.total = 0;
    ge.extracted = [];
    ge.bumpLink = ``;
    ge.points = 0;
    ge.sgToolsCount = 0;
    ge.isDivided = this.esgst.gc_gi || this.esgst.gc_r || this.esgst.gc_rm || this.esgst.gc_ea || this.esgst.gc_tc || this.esgst.gc_a || this.esgst.gc_mp || this.esgst.gc_sc || this.esgst.gc_l || this.esgst.gc_m || this.esgst.gc_dlc || this.esgst.gc_rd || this.esgst.gc_g;
    if (shared.common.isCurrentPath(`Account`) && this.esgst.parameters.esgst === `ge`) {
      const context = this.esgst.sidebar.nextElementSibling;
      if (this.esgst.removeSidebarInFeaturePages) {
        this.esgst.sidebar.remove();
      }
      context.setAttribute(`data-esgst-popup`, `true`);
      context.innerHTML = ``;
      new elementBuilder[shared.esgst.name].pageHeading({
        context: context,
        position: `beforeEnd`,
        breadcrumbs: [
          {
            name: `ESGST`,
            url: this.esgst.settingsUrl
          },
          {
            name: `Giveaway Extractor`,
            url: `https://www.steamgifts.com/account/settings/profile?esgst=ge`
          }
        ]
      });
      const container = createElements(context, `beforeEnd`, [{ type: `div` }]);
      const scrollable = createElements(context, `beforeEnd`, [{ type: `div` }]);
      ge.popup = {
        description: container,
        scrollable: scrollable,
        open: () => {
        },
        reposition: () => {
        }
      };
    } else {
      ge.popup = new Popup({ addScrollable: true, icon: `fa-gift`, title: `Extracted giveaways:` });
    }
    ge.results = createElements(ge.popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-text-left`
      },
      type: `div`
    }]);
    if (this.esgst.gas || (this.esgst.gf && this.esgst.gf_m) || this.esgst.mm) {
      let heading = createElements(ge.popup.scrollable, `afterBegin`, [{
        attributes: {
          class: `page__heading`
        },
        type: `div`
      }]);
      if (this.esgst.gas) {
        this.esgst.modules.giveawaysGiveawaysSorter.init(heading);
      }
      if (this.esgst.gf && this.esgst.gf_m) {
        heading.appendChild(this.esgst.modules.giveawaysGiveawayFilters.filters_addContainer(heading, `Ge`));
      }
      if (this.esgst.mm) {
        this.esgst.modules.generalMultiManager.mm(heading);
      }
    }
    let cacheWarning = null;
    ge.set = new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-search`,
      icon2: `fa-times`,
      title1: `Extract`,
      title2: `Cancel`,
      callback1: (hasScrolled) => {
        return new Promise(resolve => {
          if (hasScrolled && ge.isComplete) {
            resolve();
            return;
          }
          ge.isComplete = false;
          if (cacheWarning || ge.reExtract) {
            if (ge.reExtract) {
              ge.extractOnward = this.esgst.ge_extractOnward;
              ge.ignoreDiscussionComments = this.esgst.ge_ignoreDiscussionComments;
              ge.ignoreGiveawayComments = this.esgst.ge_ignoreGiveawayComments;
              ge.count = 0;
              ge.total = 0;
              ge.extracted = [];
              ge.bumpLink = ``;
              ge.points = 0;
              ge.sgToolsCount = 0;
            }
            ge.flushCache = true;
            ge.flushCacheHours = 0;
            ge.reExtract = false;
            if (cacheWarning) {
              cacheWarning.remove();
            }
            cacheWarning = null;
            ge.results.innerHTML = ``;
            ge.cache[ge.cacheId] = {
              codes: [],
              giveaways: {},
              bumpLink: ``,
              ithLinks: new Set(),
              jigidiLinks: new Set(),
              timestamp: now
            };
          }
          ge.mainCallback = resolve;
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
            this.esgst.modules.common.createElements(ge.progress, `inner`, [{
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
            let giveaways = this.ge_getGiveaways(ge, shared.common.isCurrentPath(`Account`) && this.esgst.parameters.esgst === `ge` ? ge.context : this.esgst.pageOuterWrap);
            this.ge_extractGiveaways(ge, giveaways, 0, giveaways.length, this.ge_completeExtraction.bind(this, ge));
          }
        });
      },
      callback2: () => {
        ge.mainCallback = null;
        ge.isCanceled = true;
        // noinspection JSIgnoredPromiseFromCall
        this.ge_completeExtraction(ge);
      }
    });
    ge.popup.description.appendChild(ge.set.set);
    ge.progress = createElements(ge.popup.description, `beforeEnd`, [{
      type: `div`
    }]);
    ge.popup.open();
    if (ge.flushCache && ge.cache[ge.cacheId] && now - ge.cache[ge.cacheId].timestamp > parseInt(ge.flushCacheHours) * 3600000) {
      delete ge.cache[ge.cacheId];
    }
    if (!ge.extractOnward && ge.cache[ge.cacheId]) {
      ge.cache[ge.cacheId].ithLinks = new Set(ge.cache[ge.cacheId].ithLinks);
      ge.cache[ge.cacheId].jigidiLinks = new Set(ge.cache[ge.cacheId].jigidiLinks);
      cacheWarning = common.createElements_v2(ge.popup.description, `beforeEnd`, [
        [`div`, `These results were retrieved from the cache from ${common.getTimeSince(ge.cache[ge.cacheId].timestamp)} ago (${this.esgst.modules.generalAccurateTimestamp.at_formatTimestamp(ge.cache[ge.cacheId].timestamp)}). If you want to update the cache, you will have to extract again.`]
      ]);
      let html = ``;
      let points = 0;
      let total = 0;
      for (const code of ge.cache[ge.cacheId].codes) {
        const giveaway = ge.cache[ge.cacheId].giveaways[code];
        if (giveaway) {
          html += giveaway.html;
          points += giveaway.points;
          total += 1;
        } else {
          window.open(`https://www.sgtools.info/giveaways/${code}`);
        }
      }
      this.esgst.modules.common.createElements(ge.progress, `inner`, [{
        text: total,
        type: `span`
      }, {
        text: ` giveaways extracted.`,
        type: `node`
      }]);
      createElements(ge.results, `beforeEnd`, [{
        type: `div`
      }]);
      ge.results.lastElementChild.insertAdjacentHTML(`beforeEnd`, html);
      await endless_load(ge.results.lastElementChild, false, `ge`);
      const items = [{
        attributes: {
          class: `markdown esgst-text-center`
        },
        type: `div`,
        children: []
      }];
      if (ge.cache[ge.cacheId].bumpLink && !this.esgst.discussionPath) {
        items[0].children.push({
          type: `h2`,
          children: [{
            attributes: {
              href: ge.cache[ge.cacheId].bumpLink
            },
            text: `Bump`,
            type: `a`
          }]
        });
      }
      items[0].children.push({
        text: `${points}P required to enter all giveaways.`,
        type: `node`
      });
      for (let link of [...ge.cache[ge.cacheId].ithLinks, ...ge.cache[ge.cacheId].jigidiLinks]) {
        if (this.esgst.ge_j) {
          const match = link.match(/id=(.+)/);
          if (match) {
            link = `https://www.jigidi.com/jigsaw-puzzle/${match[1]}`;
          }
        }
        items[0].children.push({
          type: `br`
        }, {
            attributes: {
              href: link
            },
            text: link,
            type: `a`
          });
      }
      createElements(ge.results, `afterBegin`, items);
      createElements(ge.results, `beforeEnd`, items);
    } else {
      ge.cache[ge.cacheId] = {
        codes: [],
        giveaways: {},
        bumpLink: ``,
        ithLinks: new Set(),
        jigidiLinks: new Set(),
        timestamp: now
      };
      ge.set.trigger();
    }
    if (this.esgst.es_ge) {
      ge.popup.scrollable.addEventListener(`scroll`, this.checkScroll.bind(this, ge));
    }
  }

  checkScroll(ge, filtered) {
    if (!ge.isCanceled && ge.set && !ge.set.busy && (ge.popup.scrollable.scrollTop + ge.popup.scrollable.offsetHeight >= ge.popup.scrollable.scrollHeight || filtered)) {
      ge.set.trigger(true);
    }
  }

  ge_extractGiveaways(ge, giveaways, i, n, callback) {
    if (!ge.isCanceled) {
      if (i < n) {
        // noinspection JSIgnoredPromiseFromCall
        this.ge_extractGiveaway(ge, giveaways[i], () => window.setTimeout(this.ge_extractGiveaways.bind(this), 0, ge, giveaways, ++i, n, callback));
      } else {
        callback();
      }
    }
  }

  async ge_extractGiveaway(ge, code, callback) {
    if (!ge.isCanceled) {
      if (ge.isDivided && ge.count === 50) {
        let children, filtered, i;
        ge.mainCallback();
        ge.mainCallback = null;
        ge.count = 0;
        await endless_load(ge.results.lastElementChild, false, `ge`);
        ge.set.set.firstElementChild.lastElementChild.textContent = `Extract More`;
        ge.progress.firstElementChild.remove();
        ge.callback = this.ge_extractGiveaway.bind(this, ge, code, callback);
        filtered = false;
        children = ge.results.lastElementChild.children;
        for (i = children.length - 1; i > -1 && !filtered; --i) {
          if (children[i].firstElementChild.classList.contains(`esgst-hidden`)) {
            filtered = true;
          }
        }
        this.checkScroll(ge, filtered);
      } else {
        if (ge.extracted.indexOf(code) < 0) {
          let sgTools = code.length > 5;
          if (sgTools) {
            if (this.esgst.ge_sgt && (!this.esgst.ge_sgt_l || ge.sgToolsCount < this.esgst.ge_sgt_limit)) {
              window.open(`https://www.sgtools.info/giveaways/${code}`);
              ge.cache[ge.cacheId].codes.push(code);
              ge.extracted.push(code);
              ge.sgToolsCount += 1;
              callback();
              return;
            }
            if (this.esgst.ge_sgtga) {
              try {
                if (this.esgst.ge_sgtga_u) {
                  await request({
                    method: `GET`,
                    queue: true,
                    url: `https://www.sgtools.info/giveaways/${code}/check`
                  });
                }
                const response = await request({
                  method: `GET`,
                  queue: true,
                  url: `https://www.sgtools.info/giveaways/${code}/getLink`
                });
                const json = JSON.parse(response.responseText);
                if (json && json.url) {
                  code = json.url.match(/\/giveaway\/(.{5})/)[1];
                  sgTools = false;
                }
              } catch (error) {
                window.console.log(error);
              }
            }
          }
          let response = await request({
            method: `GET`,
            url: sgTools ? `https://www.sgtools.info/giveaways/${code}` : `/giveaway/${code}/`
          });
          let bumpLink, button, giveaway, giveaways, n, responseHtml;
          responseHtml = parseHtml(response.responseText);
          button = responseHtml.getElementsByClassName(`sidebar__error`)[0];
          giveaway = await buildGiveaway(responseHtml, response.finalUrl, button && button.textContent);
          if (ge.isCanceled) {
            return;
          }
          if (giveaway) {
            createElements(ge.results.lastElementChild, `beforeEnd`, giveaway.html);
            giveaway.html = ge.results.lastElementChild.lastElementChild.outerHTML;
            ge.cache[ge.cacheId].codes.push(code);
            ge.cache[ge.cacheId].giveaways[code] = giveaway;
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
                  ge.cache[ge.cacheId].bumpLink = ge.bumpLink;
                }
              }
              giveaways = this.ge_getGiveaways(ge, responseHtml);
              n = giveaways.length;
              if (n > 0) {
                window.setTimeout(() => this.ge_extractGiveaways(ge, giveaways, 0, n, callback), 0);
              } else {
                callback();
              }
            }
          } else if (!sgTools) {
            let response = await request({ anon: true, method: `GET`, url: `/giveaway/${code}/` });
            let bumpLink, giveaway, giveaways, n, responseHtml;
            responseHtml = parseHtml(response.responseText);
            giveaway = await buildGiveaway(responseHtml, response.finalUrl, null, true);
            if (giveaway) {
              createElements(ge.results.lastElementChild, `beforeEnd`, giveaway.html);
              giveaway.html = ge.results.lastElementChild.lastElementChild.outerHTML;
              ge.cache[ge.cacheId].codes.push(code);
              ge.cache[ge.cacheId].giveaways[code] = giveaway;
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
              if (!ge.bumpLink) {
                bumpLink = responseHtml.querySelector(`[href*="/discussion/"]`);
                if (bumpLink) {
                  ge.bumpLink = bumpLink.getAttribute(`href`);
                  ge.cache[ge.cacheId].bumpLink = ge.bumpLink;
                }
              }
              giveaways = this.ge_getGiveaways(ge, responseHtml);
              n = giveaways.length;
              if (n > 0) {
                window.setTimeout(() => this.ge_extractGiveaways(ge, giveaways, 0, n, callback), 0);
              } else {
                callback();
              }
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

  ge_getGiveaways(ge, context) {
    const description = context.querySelector(`.page__description`);
    const op = context.querySelector(`.markdown`);
    const giveawaySelectors = [
      `img[title]`,
      `[href*="/giveaway/"]`,
      `[href*="sgtools.info/giveaways"]`
    ];
    let elements;
    if (ge.ignoreDiscussionComments && !description && op) {
      elements = op.querySelectorAll(giveawaySelectors.join(`, `));
    } else if (ge.ignoreGiveawayComments && description) {
      elements = description.querySelectorAll(giveawaySelectors.join(`, `));
    } else {
      elements = context.querySelectorAll(giveawaySelectors.map(x => `.markdown ${x}`).join(`, `));
    }
    let giveaways = [];
    if (context === ge.context) {
      let match = getParameters().url.match(/\/giveaway\/(.+?)\//);
      if (match) {
        giveaways.push(match[1]);
      }
    } else if (context === this.esgst.pageOuterWrap && this.esgst.giveawayPath) {
      let match = shared.esgst.locationHref.match(/\/giveaway\/(.+?)\//);
      if (match) {
        giveaways.push(match[1]);
      }
    }
    let next = {
      code: null,
      count: 0
    };
    for (let element of elements) {
      if (element.matches(`img`)) {
        const title = element.getAttribute(`title`);
        if (title.length === 5) {
          if (ge.extracted.indexOf(title) < 0 && giveaways.indexOf(title) < 0) {
            giveaways.push(title);
          }
        }
        continue;
      }
      let url = element.getAttribute(`href`);
      let match = url.match(/\/(\w{5})\b/);
      if (!match) {
        match = url.match(/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})/);
        if (!match) continue;
      }
      let code = match[1];
      if (!ge.extractOnward || this.esgst.discussionPath || element.textContent.toLowerCase().match(/forw|more|next|>|→/)) {
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
    const ithSelectors = [
      `[href*="itstoohard.com/puzzle/"]`
    ];
    let ithLinks;
    if (ge.ignoreDiscussionComments && !description && op) {
      ithLinks = op.querySelectorAll(ithSelectors.join(`, `));
    } else if (ge.ignoreGiveawayComments && description) {
      ithLinks = description.querySelectorAll(ithSelectors.join(`, `));
    } else {
      ithLinks = context.querySelectorAll(ithSelectors.map(x => `.markdown ${x}`).join(`, `));
    }
    for (const link of ithLinks) {
      const url = link.getAttribute(`href`);
      ge.cache[ge.cacheId].ithLinks.add(url);
    }
    const jigidiSelectors = [
      `[href*="jigidi.com/jigsaw-puzzle/"]`,
      `[href*="jigidi.com/solve.php"]`
    ];
    let jigidiLinks;
    if (ge.ignoreDiscussionComments && !description && op) {
      jigidiLinks = op.querySelectorAll(jigidiSelectors.join(`, `));
    } else if (ge.ignoreGiveawayComments && description) {
      jigidiLinks = description.querySelectorAll(jigidiSelectors.join(`, `));
    } else {
      jigidiLinks = context.querySelectorAll(jigidiSelectors.map(x => `.markdown ${x}`).join(`, `));
    }
    for (const link of jigidiLinks) {
      let url = link.getAttribute(`href`);
      if (this.esgst.ge_j) {
        const match = url.match(/id=(.+)/);
        if (match) {
          url = `https://www.jigidi.com/jigsaw-puzzle/${match[1]}`;
        }
      }
      ge.cache[ge.cacheId].jigidiLinks.add(url);
    }
    return giveaways;
  }

  checkGiveaways() {
    let isFound = false;
    const elements = document.querySelectorAll(`.markdown img[title], .markdown [href*="/giveaway/"], .markdown [href*="sgtools.info/giveaways"]`);
    for (const element of elements) {
      if (element.matches(`img`)) {
        if (element.getAttribute(`title`).length === 5) {
          isFound = true;
        }
      } else {
        return true;
      }
    }
    return isFound;
  }

  async ge_completeExtraction(ge) {
    if (ge.button) {
      ge.button.classList.remove(`esgst-busy`);
    }
    ge.progress.firstElementChild.remove();
    if (ge.mainCallback) {
      ge.mainCallback();
      ge.mainCallback = null;
    }
    await endless_load(ge.results.lastElementChild, false, `ge`);
    const items = [{
      attributes: {
        class: `markdown esgst-text-center`
      },
      type: `div`,
      children: []
    }];
    if (ge.bumpLink && !this.esgst.discussionPath) {
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
    for (const link of [...ge.cache[ge.cacheId].ithLinks, ...ge.cache[ge.cacheId].jigidiLinks]) {
      items[0].children.push({
        type: `br`
      }, {
          attributes: {
            href: link
          },
          text: link,
          type: `a`
        });
    }
    createElements(ge.results, `afterBegin`, items);
    createElements(ge.results, `beforeEnd`, items);
    ge.set.set.firstElementChild.lastElementChild.textContent = `Re-Extract`;
    ge.reExtract = true;
    ge.isComplete = true;
    if (!ge.optionsAdded) {
      this.ge_showOptions(ge, ge.popup.description, true);
      ge.optionsAdded = true;
    }
    if (!ge.isCanceled && !ge.extractOnward) {
      ge.cache[ge.cacheId].ithLinks = Array.from(ge.cache[ge.cacheId].ithLinks);
      ge.cache[ge.cacheId].jigidiLinks = Array.from(ge.cache[ge.cacheId].jigidiLinks);
      await common.setValue(`geCache`, JSON.stringify(ge.cache));
    }
  }
}

const giveawaysGiveawayExtractor = new GiveawaysGiveawayExtractor();

export { giveawaysGiveawayExtractor };