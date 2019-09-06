import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { common } from '../Common';
import { shared } from '../../class/Shared';
import { permissions } from '../../class/Permissions';

const
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  getLocalValue = common.getLocalValue.bind(common),
  getTextNodesIn = common.getTextNodesIn.bind(common),
  request = common.request.bind(common),
  setLocalValue = common.setLocalValue.bind(common)
  ;

const WHITELIST = {
  borderlandsgameoftheyear: `borderlandsgoty`,
  mafia2: `mafiaii`
};

class TradesHaveWantListChecker extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-list` }],
            `) to the right side of the first page heading of any trade that allows you to check the have/want list against your wishlisted/owned games, along with some filtering options.`
          ]]
        ]]
      ],
      id: `hwlc`,
      name: `Have/Want List Checker`,
      st: true,
      type: `trades`
    };
  }

  init() {
    if (!shared.esgst.tradePath) {
      return;
    }
    let obj = {
      button: createHeadingButton({
        context: document.getElementsByClassName(`page_heading`)[0],
        id: `hwlc`,
        icons: [`fa-list`]
      })
    };
    obj.button.addEventListener(`click`, this.hwlc_openPopup.bind(this, obj));
  }

  async hwlc_openPopup(obj) {
    if (!(await permissions.requestUi([`steamApi`, `steamStore`], `hwlc`))) {
      return;
    }

    if (obj.popup) {
      obj.popup.open();
      return;
    }
    obj.popup = new Popup({
      icon: `fa-list`,
      title: `Have/Want List Checker`,
      addScrollable: `left`
    });
    this.hwlc_addPanel(obj);
    obj.popup.open();
    window.setTimeout(async () => {
      await this.hwlc_getGames();
      obj.games = {};
      // noinspection JSIgnoredPromiseFromCall
      this.hwlc_addGames(obj, `have`, shared.esgst.appList);
      // noinspection JSIgnoredPromiseFromCall
      this.hwlc_addGames(obj, `want`, shared.esgst.appList);
    }, 1000);
  }

  hwlc_addPanel(obj) {
    obj.panel = obj.popup.getScrollable();
    obj.panel.classList.add(`esgst-hwlc-panel`, `markdown`);
    obj.sections = {};
    this.hwlc_addSection(obj, `have`, `want`);
    this.hwlc_addSection(obj, `want`, `have`);
  }

  hwlc_addSection(obj, key, counterKey) {
    obj[key] = document.querySelector(`.${key}`);
    createElements(obj.panel, `beforeEnd`, [{
      attributes: {
        class: `esgst-hwlc-section`
      },
      type: `div`,
      children: [{
        text: `You ${counterKey}:`,
        type: `h2`
      }, {
        type: `br`
      }, {
        attributes: {
          id: `esgst-hwlc-${key}-textArea`
        },
        type: `textarea`
      }, {
        type: `br`
      }, {
        type: `br`
      }, {
        text: `Matches (you ${counterKey} x they ${key}):`,
        type: `h2`
      }, {
        attributes: {
          id: `esgst-hwlc-${key}-matches`
        },
        type: `ul`,
        children: [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }]
      }, {
        type: `br`
      }, {
        text: `They ${key}:`,
        type: `h2`
      }, {
        attributes: {
          id: `esgst-hwlc-${key}-games`
        },
        type: `ul`,
        children: [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }]
      }, {
        type: `br`
      }, {
        type: `h2`,
        children: [{
          text: `Unable to identify: `,
          type: `node`
        }, {
          attributes: {
            class: `fa fa-question-circle`,
            title: `You can report unidentified games in the ESGST thread so that exceptions can be added for them`
          },
          type: `i`
        }]
      }, {
        attributes: {
          id: `esgst-hwlc-${key}-unidentified`
        },
        type: `ul`,
        children: [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }]
      }]
    }]);
    obj.sections[key] = {
      textArea: document.getElementById(`esgst-hwlc-${key}-textArea`),
      matches: document.getElementById(`esgst-hwlc-${key}-matches`),
      games: document.getElementById(`esgst-hwlc-${key}-games`),
      unidentified: document.getElementById(`esgst-hwlc-${key}-unidentified`)
    };
    obj.sections[key].textArea.addEventListener(`input`, this.hwlc_filter.bind(this, obj, key, null));
  }

  async hwlc_getGames(convertToObj) {
    if (shared.esgst.appList) {
      return;
    }

    try {
      const response = await request({
        method: `GET`,
        url: `https://api.steampowered.com/ISteamApps/GetAppList/v2/`
      });

      const appList = JSON.parse(response.responseText);

      if (convertToObj) {
        // eslint-disable-next-line require-atomic-updates
        shared.esgst.appList = {};

        for (const app of appList.applist.apps) {
          shared.esgst.appList[app.appid] = app.name;
        }
      } else {
        // eslint-disable-next-line require-atomic-updates
        shared.esgst.appList = appList;
      }
    } catch (error) {
      console.log(error);

      window.alert(`Could not retrieve list of Steam games. Games will not be identified by name.`);
    }
  }

  /**
   * @param obj
   * @param key
   * @returns {Promise<void>}
   */
  async hwlc_addGames(obj, key, json) {
    obj.games[key] = {
      apps: [],
      subs: []
    };
    const unidentified = [];
    const elements = getTextNodesIn(obj[key]);
    for (const element of elements) {
      const parent = element.parentElement;
      const striked = parent.closest(`del`);
      if (striked) {
        // Game assumed to no longer be available.
        continue;
      }
      const name = element.textContent.trim();
      const link = parent.closest(`a`);
      const url = link && link.getAttribute && link.getAttribute(`href`);
      if (url) {
        const match = url.match(/\/(app|sub)\/(\d+)/);
        if (match) {
          obj.games[key][`${match[1]}s`].push({
            id: parseInt(match[2]),
            name,
            parent
          });
          continue;
        }
      }
      if (!this.hwlc_tidyName(name)) {
        continue;
      }
      if (json) {
        const matches = json.applist.apps.filter(x => this.hwlc_formatName(x.name) === this.hwlc_formatName(name));
        if (matches.length) {
          obj.games[key].apps.push({
            id: parseInt(matches[0].appid),
            name,
            parent
          });
          continue;
        }
      }
      if (unidentified.filter(x => x.name === name).length) {
        // Name has already been found (duplicate).
        continue;
      }
      unidentified.push({ name, parent });
    }
    if (key === `want`) {
      try {
        const steamId = document.querySelector(`.author_name`).getAttribute(`href`).match(/\d+/)[0];
        const response = await request({
          method: `GET`,
          url: `http://store.steampowered.com/wishlist/profiles/${steamId}`
        });
        const responseText = response.responseText;
        const wishlistData = responseText.match(/g_rgWishlistData\s=\s(\[(.+?)]);/);
        if (wishlistData) {
          const appInfo = responseText.match(/g_rgAppInfo\s=\s({(.+?)});/);
          JSON.parse(wishlistData[1]).forEach(item => {
            const id = parseInt(item.appid);
            const found = obj.games[key].apps.filter(x => x.id === id)[0];
            if (found) {
              found.wishlisted = true;
              return;
            }
            const app = appInfo ? JSON.parse(appInfo[1])[id] : (json ? json.applist.apps.filter(x => parseInt(x.appid) === id)[0] : null);
            if (app) {
              obj.games[key].apps.push({
                id,
                name: app.name,
                wishlisted: true
              });
            } else {
              obj.games[key].apps.push({
                id,
                name: `${id}`,
                wishlisted: true
              });
            }
          });
        }
      } catch (e) { /**/
      }
    }
    for (const section in obj.sections[key]) {
      if (obj.sections[key].hasOwnProperty(section)) {
        obj.sections[key][section].innerHTML = ``;
      }
    }
    obj.games[key].apps = obj.games[key].apps.map(game => {
      if (key === `want` && game.wishlisted) {
        game.html = {
          type: `li`,
          children: [{
            attributes: {
              class: `fa fa-star`,
              title: `On their wishlist`
            },
            type: `i`
          }, {
            attributes: {
              href: `https://store.steampowered.com/app/${game.id}`
            },
            text: game.name,
            type: `a`
          }]
        };
        return game;
      }
      if (key === `have` && shared.esgst.games.apps[game.id]) {
        if (shared.esgst.games.apps[game.id].owned) {
          game.owned = true;
          game.html = {
            type: `li`,
            children: [{
              attributes: {
                class: `fa fa-folder`,
                title: `On your library`
              },
              type: `i`
            }, {
              attributes: {
                href: `https://store.steampowered.com/app/${game.id}`
              },
              text: game.name,
              type: `a`
            }]
          };
          return game;
        } else if (shared.esgst.games.apps[game.id].wishlisted) {
          game.wishlisted = true;
          game.html = {
            type: `li`,
            children: [{
              attributes: {
                class: `fa fa-star`,
                title: `On your wishlist`
              },
              type: `i`
            }, {
              attributes: {
                href: `https://store.steampowered.com/app/${game.id}`
              },
              text: game.name,
              type: `a`
            }]
          };
          return game;
        }
      }
      game.html = {
        type: `li`,
        children: [{
          attributes: {
            href: `https://store.steampowered.com/app/${game.id}`
          },
          text: game.name,
          type: `a`
        }]
      };
      return game;
    }).sort(this.hwlc_sortGames);
    obj.games[key].subs = obj.games[key].subs.sort(this.hwlc_sortGames);
    const appItems = [];
    for (const game of obj.games[key].apps) {
      appItems.push(game.html);
    }
    createElements(obj.sections[key].games, `beforeEnd`, appItems);
    const subItems = [];
    for (const game of obj.games[key].subs) {
      subItems.push({
        type: `li`,
        children: [{
          attributes: {
            class: `fa fa-suitcase`,
            title: `This is a package (packages are not checked for wishlisted/owned status)`
          },
          type: `i`
        }, {
          attributes: {
            href: `https://store.steampowered.com/sub/${game.id}`
          },
          text: game.name || game.id,
          type: `a`
        }]
      });
    }
    createElements(obj.sections[key].games, `beforeEnd`, subItems);
    const unidentifiedItems = [];
    for (const game of unidentified) {
      unidentifiedItems.push({
        text: game.name,
        type: `li`
      });
    }
    createElements(obj.sections[key].unidentified, `beforeEnd`, unidentifiedItems);
    for (const section in obj.sections[key]) {
      if (obj.sections[key].hasOwnProperty(section)) {
        if (section === `textArea` || obj.sections[key][section].innerHTML) {
          continue;
        }
        createElements(obj.sections[key][section], `inner`, [{
          text: `None.`,
          type: `node`
        }]);
      }
      const query = getLocalValue(`hwlc_${key}`);
      if (query) {
        obj.sections[key].textArea.value = query;
        this.hwlc_filter(obj, key);
      }
    }
  }

  hwlc_filter(obj, key) {
    obj.sections[key].matches.innerHTML = ``;
    const query = obj.sections[key].textArea.value;
    setLocalValue(`hwlc_${key}`, query);
    let found = [];
    const values = query.split(/\n/);
    for (let value of values) {
      value = value.trim().toLowerCase();
      if (!value) {
        continue;
      }
      obj.games[key].apps.filter(game => game.name.toLowerCase().match(value)).forEach(game => {
        if (found.filter(x => x.name === game.name).length) {
          return;
        }
        found.push({
          id: game.id,
          name: game.name,
          owned: game.owned,
          wishlisted: game.wishlisted,
          type: `app`
        });
      });
      obj.games[key].subs.filter(game => game.name.toLowerCase().match(value)).forEach(game => {
        if (found.filter(x => x.name === game.name).length) {
          return;
        }
        found.push({
          id: game.id,
          name: game.name,
          owned: game.owned,
          wishlisted: game.wishlisted,
          type: `sub`
        });
      });
    }
    found = found.sort(this.hwlc_sortGames);
    const items = [];
    for (const game of found) {
      items.push({
        type: `li`,
        children: [key === `have` && game.owned ? {
          attributes: {
            class: `fa fa-folder`,
            title: `On your library`
          },
          type: `i`
        } : null, game.wishlisted ? {
          attributes: {
            class: `fa fa-star`,
            title: `On ${key === `want` ? `their` : `your`} wishlist`
          },
          type: `i`
        } : null, {
          attributes: {
            href: `https://store.steampowered.com/${game.type}/${game.id}`
          },
          text: game.name || game.id,
          type: `a`
        }]
      });
    };
    createElements(obj.sections[key].matches, `beforeEnd`, items);
    if (!obj.sections[key].matches.innerHTML) {
      createElements(obj.sections[key].matches, `inner`, [{
        text: `None.`,
        type: `node`
      }]);
    }
  }

  hwlc_tidyName(name) {
    return name
      .replace(/[^\w]/g, ``).toLowerCase()
      .replace(/steamkeys/, ``);
  }

  hwlc_formatName(name) {
    name = name
      .replace(/[^\w]/g, ``).toLowerCase()
      .replace(/windowsedition/, ``);
    return WHITELIST[name] || name;
  }

  hwlc_sortGames(a, b) {
    if (a.wishlisted && !b.wishlisted) {
      return -1;
    }
    if (!a.wishlisted && b.wishlisted) {
      return 1;
    }
    if (a.owned && !b.owned) {
      return 1;
    }
    if (!a.owned && b.owned) {
      return -1;
    }
    return a.name.localeCompare(b.name, {
      sensitivity: `base`
    });
  }
}

const tradesHaveWantListChecker = new TradesHaveWantListChecker();

export { tradesHaveWantListChecker };