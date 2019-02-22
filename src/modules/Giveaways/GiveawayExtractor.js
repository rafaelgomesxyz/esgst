import Module from '../../class/Module';
import ButtonSet from '../../class/ButtonSet';
import Popup from '../../class/Popup';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';
import dateFns_differenceInDays from 'date-fns/differenceInDays';

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
        ge_o: {
          description: [
            [`ul`, [
              [`li`, `With this option enabled, a second button is added to the main page heading that when used, for example, in the 6th giveaway of a train that has links to the previous giveaways, will not go back and extract giveaways 1-5.`],
              [`li`, `This method is not 100% accurate, because the feature looks for a link with any variation of "next" in the description of the giveaway to make sure that it is going forward, so if it does not find such a link, the extraction will stop.`]
            ]]
          ],
          name: `Add button to only extract from the current giveaway onward.`,
          sg: true
        },
        ge_f: {
          name: `Add button to flush the cache before extracting the giveaways.`,
          inputItems: [
            {
              id: `ge_f_h`,
              prefix: `Only flush the cache if it is older than `,
              suffix: ` hours`
            }
          ],
          sg: true
        },
        ge_j: {
          name: `Convert all Jigidi links to the "jigidi.com/jigsaw-puzzle" format.`,
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
      load: this.ge,
      name: `Giveaway Extractor`,
      sg: true,
      type: `giveaways`
    };
  }

  async ge() {
    if (((this.esgst.giveawayCommentsPath && !document.getElementsByClassName(`table--summary`)[0]) || this.esgst.discussionPath) && this.checkGiveaways()) {
      // noinspection JSIgnoredPromiseFromCall
      this.ge_addButton(false, `Extract all giveaways`);
      if (this.esgst.ge_o) {
        // noinspection JSIgnoredPromiseFromCall
        this.ge_addButton(true, `Extract only from the current giveaway onward`, [`fa-forward`]);
      }
      if (this.esgst.ge_f) {
        this.ge_addButton(true, false, `Extract all giveaways (flush cache)`, [`fa-paint-brush`]);
      }
    } else if (this.esgst.accountPath && this.esgst.parameters.esgst === `ge`) {
      const parameters = getParameters();
      let ge = {
        context: parseHtml((await request({ method: `GET`, url: parameters.url })).responseText),
        flushCache: !!parameters.flush,
        extractOnward: !!parameters.extractOnward
      };
      this.ge_openPopup(ge);
    }
  }

  ge_addButton(flushCache, extractOnward, title, extraIcons = []) {
    let ge = {
      button: createHeadingButton({ id: `ge`, icons: [`fa-gift`, `fa-search`].concat(extraIcons), title }),
      flushCache,
      extractOnward
    };
    ge.button.addEventListener(`click`, () => {
      if (this.esgst.ge_t) {
        window.open(`https://www.steamgifts.com/account/settings/profile?esgst=ge&${ge.flushCache ? `flush=true&` : ``}${ge.extractOnward ? `extractOnward=true&` : ``}url=${window.location.pathname.match(/^\/(giveaway|discussion)\/.+?\//)[0]}`);
      } else {
        this.ge_openPopup(ge);
      }
    });
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
    ge.cacheId = this.esgst.parameters.url || window.location.pathname.match(/^\/(giveaway|discussion)\/.+?\//)[0];
    ge.count = 0;
    ge.total = 0;
    ge.extracted = [];
    ge.bumpLink = ``;
    ge.points = 0;
    ge.sgToolsCount = 0;
    ge.isDivided = this.esgst.gc_gi || this.esgst.gc_r || this.esgst.gc_rm || this.esgst.gc_ea || this.esgst.gc_tc || this.esgst.gc_a || this.esgst.gc_mp || this.esgst.gc_sc || this.esgst.gc_l || this.esgst.gc_m || this.esgst.gc_dlc || this.esgst.gc_rd || this.esgst.gc_g;
    if (this.esgst.accountPath && this.esgst.parameters.esgst === `ge`) {
      const context = this.esgst.sidebar.nextElementSibling;
      if (this.esgst.removeSidebarInFeaturePages) {
        this.esgst.sidebar.remove();
      }
      context.innerHTML = ``;
      common.createPageHeading(context, `beforeEnd`, {
        items: [
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
      ge.popup = {
        description: container,
        scrollable: container,
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
        this.esgst.modules.giveawaysGiveawaysSorter.gas(heading);
      }
      if (this.esgst.gf && this.esgst.gf_m) {
        heading.appendChild(this.esgst.modules.filters.filters_addContainer(`gf`, heading, `Ge`));
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
      callback1: () => {
        return new Promise(resolve => {
          if (cacheWarning) {
            cacheWarning.remove();
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
            if (this.esgst.es_ge) {
              ge.popup.scrollable.addEventListener(`scroll`, () => {
                if (!ge.isCanceled && ge.popup.scrollable.scrollTop + ge.popup.scrollable.offsetHeight >= ge.popup.scrollable.scrollHeight && ge.set && !ge.set.busy) {
                  ge.set.trigger();
                }
              });
            }
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
            let giveaways = this.ge_getGiveaways(ge, this.esgst.accountPath && this.esgst.parameters.esgst === `ge` ? ge.context : this.esgst.pageOuterWrap);
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
    if (ge.flushCache && ge.cache[ge.cacheId] && now - ge.cache[ge.cacheId].timestamp > this.esgst.ge_f_h * 3600000) {
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
      ge.results.insertAdjacentHTML(`beforeEnd`, html);
      await endless_load(ge.results, false, `ge`);  
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
      if (this.esgst.es_ge) {
        ge.popup.scrollable.addEventListener(`scroll`, () => {
          if (!ge.isCanceled && ge.popup.scrollable.scrollTop + ge.popup.scrollable.offsetHeight >= ge.popup.scrollable.scrollHeight && ge.set && !ge.set.busy) {
            ge.set.trigger();
          }
        });
      }
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
        if ((this.esgst.es_ge && ge.popup.scrollable.scrollHeight <= ge.popup.scrollable.offsetHeight) || filtered) {
          ge.set.trigger();
        }
      } else {
        if (ge.extracted.indexOf(code) < 0) {
          let sgTools = code.length > 5;
          if (sgTools && this.esgst.ge_sgt && (!this.esgst.ge_sgt_l || ge.sgToolsCount < this.esgst.ge_sgt_limit)) {
            window.open(`https://www.sgtools.info/giveaways/${code}`);
            ge.cache[ge.cacheId].codes.push(code);
            ge.extracted.push(code);
            ge.sgToolsCount += 1;
            callback();
            return;
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
    let elements = context.querySelectorAll(`.markdown img[title], .markdown [href*="/giveaway/"], .markdown [href*="sgtools.info/giveaways"]`);
    let giveaways = [];
    if (context === ge.context) {
      let match = getParameters().url.match(/\/giveaway\/(.+?)\//);
      if (match) {
        giveaways.push(match[1]);
      }
    } else if (context === this.esgst.pageOuterWrap && this.esgst.giveawayPath) {
      let match = window.location.href.match(/\/giveaway\/(.+?)\//);
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
    const ithLinks = context.querySelectorAll(`.markdown [href*="itstoohard.com/puzzle/"]`);
    for (const link of ithLinks) {
      const url = link.getAttribute(`href`);
      ge.cache[ge.cacheId].ithLinks.add(url);
    }
    const jigidiLinks = context.querySelectorAll(`.markdown [href*="jigidi.com/jigsaw-puzzle/"], .markdown [href*="jigidi.com/solve.php"]`);
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
    ge.set.set.remove();
    ge.set = null;
    if (!ge.isCanceled && !ge.extractOnward) {
      ge.cache[ge.cacheId].ithLinks = Array.from(ge.cache[ge.cacheId].ithLinks);
      ge.cache[ge.cacheId].jigidiLinks = Array.from(ge.cache[ge.cacheId].jigidiLinks);
      await common.setValue(`geCache`, JSON.stringify(ge.cache));
    }
  }
}

export default GiveawaysGiveawayExtractor;