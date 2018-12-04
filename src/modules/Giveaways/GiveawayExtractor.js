import Module from '../../class/Module';
import ButtonSet from '../../class/ButtonSet';
import Popup from '../../class/Popup';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';

const
  parseHtml = utils.parseHtml.bind(utils),
  buildGiveaway = common.buildGiveaway.bind(common),
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  endless_load = common.endless_load.bind(common),
  getParameters = common.getParameters.bind(common),
  request = common.request.bind(common),
  setMouseEvent = common.setMouseEvent.bind(common)
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
    if (((this.esgst.giveawayCommentsPath && !document.getElementsByClassName(`table--summary`)[0]) || this.esgst.discussionPath) && (document.querySelector(`.markdown [href*="/giveaway/"], .markdown [href*="sgtools.info/giveaways"], .markdown [href*="itstoohard.com/puzzle/"], .markdown [href*="jigidi.com/solve.php?id="]`))) {
      // noinspection JSIgnoredPromiseFromCall
      this.ge_addButton(false, `Extract all giveaways`);
      if (this.esgst.ge_o) {
        // noinspection JSIgnoredPromiseFromCall
        this.ge_addButton(true, `Extract only from the current giveaway onward`, [`fa-forward`]);
      }
    } else if (this.esgst.accountPath && this.esgst.parameters.esgst === `ge`) {
      const parameters = getParameters();
      let ge = {
        context: parseHtml((await request({ method: `GET`, url: parameters.url })).responseText),
        extractOnward: !!parameters.extractOnward
      };
      this.ge_openPopup(ge);
    }
  }

  ge_addButton(extractOnward, title, extraIcons = []) {
    let ge = {
      button: createHeadingButton({ id: `ge`, icons: [`fa-gift`, `fa-search`].concat(extraIcons), title }),
      extractOnward
    };
    ge.button.addEventListener(`click`, () => {
      if (this.esgst.ge_t) {
        window.open(`https://www.steamgifts.com/account/settings/profile?esgst=ge&${ge.extractOnward ? `extractOnward=true&` : ``}url=${location.pathname.match(/^\/(giveaway|discussion)\/.+?\//)[0]}`);
      } else {
        this.ge_openPopup(ge);
      }
    });
  }

  ge_openPopup(ge) {
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
    ge.ithLinks = [];
    ge.jigidiLinks = [];
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
            name: `ESGST`
          },
          {
            name: `Giveaway Extractor`
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
    ge.set = new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-search`,
      icon2: `fa-times`,
      title1: `Extract`,
      title2: `Cancel`,
      callback1: () => {
        return new Promise(resolve => {
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
            ge.mainCallback = resolve;
            let giveaways = this.ge_getGiveaways(ge, this.esgst.accountPath && this.esgst.parameters.esgst === `ge` ? ge.context : this.esgst.pageOuterWrap);
            this.ge_extractGiveaways(ge, giveaways, 0, giveaways.length, this.ge_completeExtraction.bind(this, ge, resolve));
          }
        });
      },
      callback2: () => {
        ge.isCanceled = true;
        // noinspection JSIgnoredPromiseFromCall
        this.ge_completeExtraction(ge);
      }
    });
    ge.popup.description.appendChild(ge.set.set);
    ge.progress = createElements(ge.popup.description, `beforeEnd`, [{
      type: `div`
    }]);
    if (this.esgst.es_ge) {
      ge.popup.scrollable.addEventListener(`scroll`, () => {
        if (ge.popup.scrollable.scrollTop + ge.popup.scrollable.offsetHeight >= ge.popup.scrollable.scrollHeight && ge.set && !ge.set.busy) {
          ge.set.trigger();
        }
      });
    }
    ge.set.trigger();
    ge.popup.open();
  }

  ge_extractGiveaways(ge, giveaways, i, n, callback) {
    if (!ge.isCanceled) {
      if (i < n) {
        // noinspection JSIgnoredPromiseFromCall
        this.ge_extractGiveaway(ge, giveaways[i], setTimeout.bind(null, this.ge_extractGiveaways.bind(this), 0, ge, giveaways, ++i, n, callback));
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
            open(`https://www.sgtools.info/giveaways/${code}`);
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
              giveaways = this.ge_getGiveaways(ge, responseHtml);
              n = giveaways.length;
              if (n > 0) {
                setTimeout(() => this.ge_extractGiveaways(ge, giveaways, 0, n, callback), 0);
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
            giveaways = this.ge_getGiveaways(ge, responseHtml);
            n = giveaways.length;
            if (n > 0) {
              setTimeout(() => this.ge_extractGiveaways(ge, giveaways, 0, n, callback), 0);
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
    let elements = context.querySelectorAll(`.markdown [href*="/giveaway/"], .markdown [href*="sgtools.info/giveaways"]`);
    let giveaways = [];
    if (context === ge.context) {
      let match = getParameters().url.match(/\/giveaway\/(.+?)\//);
      if (match) {
        giveaways.push(match[1]);
      }
    } else if (context === this.esgst.pageOuterWrap && this.esgst.giveawayPath) {
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
    ge.ithLinks = ge.ithLinks.concat(...Array.from(context.querySelectorAll(`.markdown [href*="itstoohard.com/puzzle/"]`)).map(element => element.getAttribute(`href`)));
    ge.jigidiLinks = ge.jigidiLinks.concat(...Array.from(context.querySelectorAll(`.markdown [href*="jigidi.com/solve.php?id="]`)).map(element => element.getAttribute(`href`)));
    return giveaways;
  }

  async ge_completeExtraction(ge, callback) {
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
    for (const link of ge.ithLinks.concat(ge.jigidiLinks)) {
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
  }
}

export default GiveawaysGiveawayExtractor;