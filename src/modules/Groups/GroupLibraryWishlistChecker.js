import Module from '../../class/Module';
import {utils} from '../../lib/jsUtils'
import {common} from '../Common';

const
  {
    parseHtml
  } = utils,
  {
    createElements,
    createHeadingButton,
    createTooltip,
    getParameters,
    request
 } = common
;

class GroupsGroupLibraryWishlistChecker extends Module {
  info = ({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-folder"></i> <i class="fa fa-star"></i>) to your <a href="https://www.steamgifts.com/account/manage/whitelist">whitelist</a>/<a href="https://www.steamgifts.com/account/manage/blacklist">blacklist</a> pages and any <a href="https://www.steamgifts.com/group/SJ7Bu/">group</a> page that allows you to check how many of the whitelist/blacklist/group members have a certain game in their libraries/wishlists.</li>
        <li>The results are separated in 2 sections ("Libraries" and "Wishlists"). The games in each section are ranked based on the number of members that have them in their libraries/wishlists (each game also has a percentage that represents that number).</li>
        <li>Only the first 100 results are shown for each section, but you can use the search fields to find games that are outside of the top 100. If you are searching in the "Libraries" section, it is more accurate to search for games using their app id instead of their name, because the games in that section only have a name if they can also be found in the "Wishlists" section, as game names are not available in the libraries data and retrieving them would generate more requests to Steam, which is not good.</li>
        <li>If you hover over the number of libraries/wishlists for a game it shows the usernames of all of the members that have the game in their libraries/wishlists.</li>
        <li>A Steam API key is required to retrieve libraries data. If a key is not set in the last section of this menu, the feature will only retrieve wishlists data.</li>
      </ul>
    `,
    id: `glwc`,
    load: this.glwc,
    name: `Group Library/Wishlist Checker`,
    sg: true,
    type: `groups`
  });

  async glwc() {
    if (this.esgst.whitelistPath || this.esgst.blacklistPath || this.esgst.groupPath) {
      let parameters;
      if (this.esgst.whitelistPath) {
        parameters = `?url=account/manage/whitelist`;
      } else if (this.esgst.blacklistPath) {
        parameters = `?url=account/manage/blacklist`;
      } else {
        parameters = `?url=${location.pathname.match(/\/(group\/(.+?)\/(.+?))(\/.*)?$/)[1]}/users&id=${document.querySelector(`[href*="/gid/"]`).getAttribute(`href`).match(/\d+/)[0]}`;
      }
      createHeadingButton({id: `glwc`, icons: [`fa-folder`, `fa-star`], title: `Check libraries/wishlists`}).addEventListener(`click`, () => {
        open(`/esgst/glwc${parameters}`);
      });
    } else if (this.esgst.glwcPath) {
      let glwc = {}, parameters;
      glwc.context = document.body.firstElementChild.nextElementSibling.firstElementChild;
      glwc.progress = createElements(glwc.context, `beforeEnd`, [{
        type: `div`
      }]);
      glwc.overallProgress = createElements(glwc.context, `beforeEnd`, [{
        type: `div`
      }]);
      parameters = getParameters();
      glwc.id = parameters.id;
      glwc.url = parameters.url;
      glwc.users = [];
      glwc.games = {};
      if (glwc.id) {
        glwc.overallProgress.textContent = `Preparing...`;
        glwc.members = [];
        const members = (await request({method: `GET`, url: `http://steamcommunity.com/gid/${glwc.id}/memberslistxml?xml=1`})).responseText.match(/<steamID64>.+?<\/steamID64>/g);
        members.forEach(member => {
          glwc.members.push(member.match(/<steamID64>(.+?)<\/steamID64>/)[1]);
        });
        glwc.overallProgress.textContent = `Step 1 of 3`;
        this.glwc_getUsers(glwc, 1);
      } else {
        glwc.overallProgress.textContent = `Step 1 of 3`;
        this.glwc_getUsers(glwc, 1);
      }
    }
  }

  async glwc_getUsers(glwc, nextPage) {
    if (glwc.isCanceled) return;
    createElements(glwc.progress, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }, {
      text: `Retrieving users (page ${nextPage})...`,
      type: `span`
    }]);
    let elements, i, n, pagination, responseHtml;
    responseHtml = parseHtml((await request({method: `GET`, url: `/${glwc.url}/search?page=${nextPage}`})).responseText);
    elements = responseHtml.querySelectorAll(`.table__row-inner-wrap:not(.is-faded)`);
    for (i = 0, n = elements.length; i < n; ++i) {
      glwc.users.push({
        username: elements[i].getElementsByClassName(`table__column__heading`)[0].textContent
      });
    }
    pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
    if (pagination && !pagination.lastElementChild.classList.contains(`is-selected`)) {
      setTimeout(() => this.glwc_getUsers(glwc, ++nextPage), 0);
    } else {
      glwc.overallProgress.textContent = `Step 2 of 3`;
      this.glwc_getSteamIds(glwc, 0, glwc.users.length);
    }
  }

  async glwc_getSteamIds(glwc, i, n) {
    if (glwc.isCanceled) return;
    if (i < n) {
      createElements(glwc.progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Retrieving Steam ids (${i + 1} of ${n})...`,
        type: `span`
      }]);
      let steamId = this.esgst.users.steamIds[glwc.users[i].username];
      if (steamId) {
        glwc.users[i].steamId = steamId;
        setTimeout(() => this.glwc_getSteamIds(glwc, ++i, n), 0);
      } else {
        glwc.users[i].steamId = parseHtml((await request({method: `GET`, url: `/user/${glwc.users[i].username}`})).responseText).querySelector(`[href*="/profiles/"]`).getAttribute(`href`).match(/\d+/)[0];
        setTimeout(() => this.glwc_getSteamIds(glwc, ++i, n), 0);
      }
    } else {
      glwc.overallProgress.textContent = `Step 3 of 3 (this might take a while)`;
      glwc.memberCount = 0;
      this.glwc_getGames(glwc, 0, glwc.users.length);
    }
  }

  async glwc_getGames(glwc, i, n) {
    if (glwc.isCanceled) return;
    if (i < n) {
      createElements(glwc.progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Retrieving libraries/wishlists (${i + 1} of ${n})...`,
        type: `span`
      }]);
      if (!glwc.id || glwc.members.indexOf(glwc.users[i].steamId) >= 0) {
        try {
          glwc.users[i].library = [];
          let elements = JSON.parse((await request({method: `GET`, url: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${this.esgst.steamApiKey}&steamid=${glwc.users[i].steamId}&format=json`})).responseText).response.games;
          if (elements) {
            elements.forEach(element => {
              let game = {
                id: element.appid,
                logo: `https://steamcdn-a.akamaihd.net/steam/apps/${element.appid}/header.jpg`,
                name: `${element.appid}`
              };
              if (!glwc.games[game.id]) {
                game.libraries = [];
                game.wishlists = [];
                glwc.games[game.id] = game;
              }
              glwc.games[game.id].libraries.push(i);
              glwc.users[i].library.push(game.id);
            });
          }
        } catch (e) { /**/ }
        glwc.users[i].wishlist = [];
        let responseText = (await request({method: `GET`, url: `http://store.steampowered.com/wishlist/profiles/${glwc.users[i].steamId}`})).responseText;
        let wishlistData = responseText.match(/g_rgWishlistData\s=\s(\[(.+?)\]);/);
        if (wishlistData) {
          let appInfo = responseText.match(/g_rgAppInfo\s=\s({(.+?)});/);
          let games = appInfo ? JSON.parse(appInfo[1]) : null;
          JSON.parse(wishlistData[1]).forEach(item => {
            let id = item.appid;
            let game = {id};
            if (games && games[id]) {
              game.logo = games[id].capsule;
              game.name = games[id].name;
            } else {
              game.logo = `https://steamcdn-a.akamaihd.net/steam/apps/${id}/header.jpg`;
              game.name = `${id}`;
            }
            if (glwc.games[id]) {
              if (game.logo && game.name) {
                glwc.games[id].logo = game.logo;
                glwc.games[id].name = game.name;
              }
            } else {
              game.libraries = [];
              game.wishlists = [];
              glwc.games[id] = game;
            }
            glwc.games[id].wishlists.push(i);
            glwc.users[i].wishlist.push(parseInt(id));
          });
        }
        glwc.memberCount += 1;
        setTimeout(() => this.glwc_getGames(glwc, ++i, n), 0);
      } else {
        setTimeout(() => this.glwc_getGames(glwc, ++i, n), 0);
      }
    } else {
      this.glwc_showResults(glwc);
    }
  }

  glwc_showResults(glwc) {
    let game, i, id, j, library, libraryInput, libraryResults, librarySearch, n, user, users, wishlist, wishlistInput, wishlistResults, wishlistSearch;
    glwc.context.classList.add(`esgst-glwc-results`);
    createElements(glwc.context, `inner`, [{
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-glwc-heading`
        },
        text: `Libraries`,
        type: `div`
      }, {
        attribute: {
          placeholder: `Search by game name or app id...`,
          type: `text`
        },
        type: `input`
      }, {
        attributes: {
          class: `table`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__heading`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__column--width-small text-center`
            },
            text: `Rank`,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-fill`
            },
            text: `Game`,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small text-center`
            },
            text: `Libraries`,
            type: `div`
          }]
        }, {
          attributes: {
            class: `table__rows`
          },
          type: `div`
        }, {
          attributes: {
            class: `table__rows`
          },
          type: `div`
        }]
      }]
    }, {
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-glwc-heading`
        },
        text: `Wishlists`,
        type: `div`
      }, {
        attribute: {
          placeholder: `Search by game name or app id...`,
          type: `text`
        },
        type: `input`
      }, {
        attributes: {
          class: `table`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__heading`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__column--width-small text-center`
            },
            text: `Rank`,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-fill`
            },
            text: `Game`,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small text-center`
            },
            text: `Wishlists`,
            type: `div`
          }]
        }, {
          attributes: {
            class: `table__rows`
          },
          type: `div`
        }, {
          attributes: {
            class: `table__rows`
          },
          type: `div`
        }]
      }]
    }]);
    libraryInput = glwc.context.firstElementChild.firstElementChild.nextElementSibling;
    libraryResults = libraryInput.nextElementSibling.lastElementChild;
    librarySearch = libraryResults.previousElementSibling;
    wishlistInput = glwc.context.lastElementChild.firstElementChild.nextElementSibling;
    wishlistResults = wishlistInput.nextElementSibling.lastElementChild;
    wishlistSearch = wishlistResults.previousElementSibling;
    library = [];
    wishlist = [];
    for (id in glwc.games) {
      if (glwc.games[id].libraries.length) {
        library.push(glwc.games[id]);
      }
      if (glwc.games[id].wishlists.length) {
        wishlist.push(glwc.games[id]);
      }
    }
    if (library.length > 0) {
      library = library.sort((a, b) => {
        if (a.libraries.length > b.libraries.length) {
          return -1;
        } else if (a.libraries.length < b.libraries.length) {
          return 1;
        } else {
          return 0;
        }
      });
      for (i = 0, n = library.length; i < 100 && i < n; ++i) {
        game = library[i];
        if (i <= 0 || game.libraries.length !== library[i - 1].libraries.length) {
          j = i + 1;
        }
        users = [];
        game.libraries.forEach(k => {
          user = glwc.users[k];
          users.push(`<a href="http://steamcommunity.com/profiles/${user.steamId}/games?tab=all">${user.username}</a>`);
        });
        createTooltip(createElements(libraryResults, `beforeEnd`, [{
          attributes: {
            class: `table__row-outer-wrap`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__row-inner-wrap`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__column--width-small text-center`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `table__column__rank`
                },
                text: `${j}.`,
                type: `span`
              }]
            }, {
              type: `div`,
              children: [{
                attributes: {
                  class: `table_image_thumbnail`,
                  style: `background-image:url(${game.logo});`
                },
                type: `div`
              }]
            }, {
              attributes: {
                class: `table__column--width-fill`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `table__column__heading`
                },
                text: game.name,
                type: `p`
              }, {
                type: `p`,
                children: [{
                  attributes: {
                    class: `table__column__secondary-link`,
                    href: `http://store.steampowered.com/app/${game.id}`,
                    rel: `nofollow`,
                    target: `_blank`
                  },
                  text: `http://store.steampowered.com/app/${game.id}`,
                  type: `a`
                }]
              }]
            }, {
              attributes: {
                class: `table__column--width--small text-center`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `table__column__secondary-link esgst-clickable`
                },
                text: `${game.libraries.length} (${Math.round(game.libraries.length / glwc.memberCount * 10000) / 100}%)`,
                type: `span`
              }]
            }]
          }]
        }]).firstElementChild.lastElementChild.firstElementChild, users.join(`, `));
      }
    } else {
      createElements(libraryResults, `inner`, [{
        text: `To get libraries data you must have a Steam API key set in the settings menu.`,
        type: `node`
      }]);
    }
    wishlist = wishlist.sort((a, b) => {
      if (a.wishlists.length > b.wishlists.length) {
        return -1;
      } else if (a.wishlists.length < b.wishlists.length) {
        return 1;
      } else {
        return 0;
      }
    });
    for (i = 0, n = wishlist.length; i < 100 && i < n; ++i) {
      game = wishlist[i];
      if (i <= 0 || game.wishlists.length !== wishlist[i - 1].wishlists.length) {
        j = i + 1;
      }
      users = [];
      game.wishlists.forEach(k => {
        user = glwc.users[k];
        users.push(`<a href="http://store.steampowered.com/wishlist/profiles/${user.steamId}">${user.username}</a>`);
      });
      createTooltip(createElements(wishlistResults, `beforeEnd`, [{
        attributes: {
          class: `table__row-outer-wrap`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__row-inner-wrap`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__column--width-small text-center`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__column__rank`
              },
              text: `${j}.`,
              type: `span`
            }]
          }, {
            type: `div`,
            children: [{
              attributes: {
                class: `table_image_thumbnail`,
                style: `background-image:url(${game.logo});`
              },
              type: `div`
            }]
          }, {
            attributes: {
              class: `table__column--width-fill`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__column__heading`
              },
              text: game.name,
              type: `p`
            }, {
              type: `p`,
              children: [{
                attributes: {
                  class: `table__column__secondary-link`,
                  href: `http://store.steampowered.com/app/${game.id}`,
                  rel: `nofollow`,
                  target: `_blank`
                },
                text: `http://store.steampowered.com/app/${game.id}`,
                type: `a`
              }]
            }]
          }, {
            attributes: {
              class: `table__column--width--small text-center`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__column__secondary-link esgst-clickable`
              },
              text: `${game.wishlists.length} (${Math.round(game.wishlists.length / glwc.memberCount * 10000) / 100}%)`,
              type: `span`
            }]
          }]
        }]
      }]).firstElementChild.lastElementChild.firstElementChild, users.join(`, `));
    }
    libraryInput.addEventListener(`input`, () => {
      const value = libraryInput.value.toLowerCase();
      if (value) {
        game = glwc.games[value];
        if (game) {
          if (game.libraries.length) {
            users = [];
            game.libraries.forEach(k => {
              user = glwc.users[k];
              users.push(`<a href="http://steamcommunity.com/profiles/${user.steamId}/games?tab=all">${user.username}</a>`);
            });
            createElements(librarySearch, `inner`, [{
              attributes: {
                class: `table__row-outer-wrap`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `table__row-inner-wrap`
                },
                type: `div`,
                children: [{
                  attributes: {
                    class: `table__column--width-small text-center`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `table__column__rank`
                    },
                    text: `-`,
                    type: `span`
                  }]
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `table_image_thumbnail`,
                      style: `background-image:url(${game.logo});`
                    },
                    type: `div`
                  }]
                }, {
                  attributes: {
                    class: `table__column--width-fill`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `table__column__heading`
                    },
                    text: game.name,
                    type: `p`
                  }, {
                    type: `p`,
                    children: [{
                      attributes: {
                        class: `table__column__secondary-link`,
                        href: `http://store.steampowered.com/app/${game.id}`,
                        rel: `nofollow`,
                        target: `_blank`
                      },
                      text: `http://store.steampowered.com/app/${game.id}`,
                      type: `a`
                    }]
                  }]
                }, {
                  attributes: {
                    class: `table__column--width-small text-center`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `table__column__secondary-link esgst-clickable`
                    },
                    text: `${game.libraries.length} (${Math.round(game.libraries.length / glwc.memberCount * 10000) / 100}%)`,
                    type: `span`
                  }]
                }]
              }]
            }]);
            createTooltip(librarySearch.firstElementChild.firstElementChild.lastElementChild.firstElementChild, users.join(`, `));
          } else {
            createElements(librarySearch, `inner`, [{
              text: `Nothing found...`,
              type: `node`
            }]);
          }
        } else {
          librarySearch.innerHTML = ``;
          for (i = 0, j = 0, n = library.length; j < 100 && i < n; ++i) {
            game = library[i];
            if (game.name.toLowerCase().match(value)) {
              users = [];
              game.libraries.forEach(k => {
                user = glwc.users[k];
                users.push(`<a href="http://steamcommunity.com/profiles/${user.steamId}/games?tab=all">${user.username}</a>`);
              });
              createTooltip(createElements(librarySearch, `beforeEnd`, [{
                attributes: {
                  class: `table__row-outer-wrap`
                },
                type: `div`,
                children: [{
                  attributes: {
                    class: `table__row-inner-wrap`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `table__column--width-small text-center`
                    },
                    type: `div`,
                    children: [{
                      attributes: {
                        class: `table__column__rank`
                      },
                      text: `-`,
                      type: `span`
                    }]
                  }, {
                    type: `div`,
                    children: [{
                      attributes: {
                        class: `table_image_thumbnail`,
                        style: `background-image:url(${game.logo});`
                      },
                      type: `div`
                    }]
                  }, {
                    attributes: {
                      class: `table__column--width-fill`
                    },
                    type: `div`,
                    children: [{
                      attributes: {
                        class: `table__column__heading`
                      },
                      text: game.name,
                      type: `p`
                    }, {
                      type: `p`,
                      children: [{
                        attributes: {
                          class: `table__column__secondary-link`,
                          href: `http://store.steampowered.com/app/${game.id}`,
                          rel: `nofollow`,
                          target: `_blank`
                        },
                        text: `http://store.steampowered.com/app/${game.id}`,
                        type: `a`
                      }]
                    }]
                  }, {
                    attributes: {
                      class: `table__column--width--small text-center`
                    },
                    type: `div`,
                    children: [{
                      attributes: {
                        class: `table__column__secondary-link esgst-clickable`
                      },
                      text: `${game.libraries.length} (${Math.round(game.libraries.length / glwc.memberCount * 10000) / 100}%)`,
                      type: `span`
                    }]
                  }]
                }]
              }]).firstElementChild.lastElementChild.firstElementChild, users.join(`, `));
              j += 1;
            }
          }
          if (!librarySearch.innerHTML) {
            createElements(librarySearch, `inner`, [{
              text: `Nothing found...`,
              type: `node`
            }]);
          }
        }
        librarySearch.classList.remove(`esgst-hidden`);
        libraryResults.classList.add(`esgst-hidden`);
      } else {
        libraryResults.classList.remove(`esgst-hidden`);
        librarySearch.classList.add(`esgst-hidden`);
      }
    });
    wishlistInput.addEventListener(`input`, () => {
      const value = wishlistInput.value;
      if (value) {
        game = glwc.games[value];
        if (game) {
          if (game.wishlists.length) {
            users = [];
            game.wishlists.forEach(k => {
              user = glwc.users[k];
              users.push(`<a href="http://store.steampowered.com/wishlist/profiles/${user.steamId}">${user.username}</a>`);
            });
            createElements(wishlistSearch, `inner`, [{
              attributes: {
                class: `table__row-outer-wrap`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `table__row-inner-wrap`
                },
                type: `div`,
                children: [{
                  attributes: {
                    class: `table__column--width-small text-center`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `table__column__rank`
                    },
                    text: `-`,
                    type: `span`
                  }]
                }, {
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `table_image_thumbnail`,
                      style: `background-image:url(${game.logo});`
                    },
                    type: `div`
                  }]
                }, {
                  attributes: {
                    class: `table__column--width-fill`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `table__column__heading`
                    },
                    text: game.name,
                    type: `p`
                  }, {
                    type: `p`,
                    children: [{
                      attributes: {
                        class: `table__column__secondary-link`,
                        href: `http://store.steampowered.com/app/${game.id}`,
                        rel: `nofollow`,
                        target: `_blank`
                      },
                      text: `http://store.steampowered.com/app/${game.id}`,
                      type: `a`
                    }]
                  }]
                }, {
                  attributes: {
                    class: `table__column--width-small text-center`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `table__column__secondary-link esgst-clickable`
                    },
                    text: `${game.wishlists.length} (${Math.round(game.wishlists.length / glwc.memberCount * 10000) / 100}%)`,
                    type: `span`
                  }]
                }]
              }]
            }]);
            createTooltip(wishlistSearch.firstElementChild.firstElementChild.lastElementChild.firstElementChild, users.join(`, `));
          } else {
            createElements(wishlistSearch, `inner`, [{
              text: `Nothing found...`,
              type: `node`
            }]);
          }
        } else {
          wishlistSearch.innerHTML = ``;
          for (i = 0, j = 0, n = wishlist.length; j < 100 && i < n; ++i) {
            game = wishlist[i];
            if (game.name.toLowerCase().match(value)) {
              users = [];
              game.wishlists.forEach(k => {
                user = glwc.users[k];
                users.push(`<a href="http://steamcommunity.com/profiles/${user.steamId}/wishlists">${user.username}</a>`);
              });
              createTooltip(createElements(wishlistSearch, `beforeEnd`, [{
                attributes: {
                  class: `table__row-outer-wrap`
                },
                type: `div`,
                children: [{
                  attributes: {
                    class: `table__row-inner-wrap`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `table__column--width-small text-center`
                    },
                    type: `div`,
                    children: [{
                      attributes: {
                        class: `table__column__rank`
                      },
                      text: `-`,
                      type: `span`
                    }]
                  }, {
                    type: `div`,
                    children: [{
                      attributes: {
                        class: `table_image_thumbnail`,
                        style: `background-image:url(${game.logo});`
                      },
                      type: `div`
                    }]
                  }, {
                    attributes: {
                      class: `table__column--width-fill`
                    },
                    type: `div`,
                    children: [{
                      attributes: {
                        class: `table__column__heading`
                      },
                      text: game.name,
                      type: `p`
                    }, {
                      type: `p`,
                      children: [{
                        attributes: {
                          class: `table__column__secondary-link`,
                          href: `http://store.steampowered.com/app/${game.id}`,
                          rel: `nofollow`,
                          target: `_blank`
                        },
                        text: `http://store.steampowered.com/app/${game.id}`,
                        type: `a`
                      }]
                    }]
                  }, {
                    attributes: {
                      class: `table__column--width--small text-center`
                    },
                    type: `div`,
                    children: [{
                      attributes: {
                        class: `table__column__secondary-link esgst-clickable`
                      },
                      text: `${game.wishlists.length} (${Math.round(game.wishlists.length / glwc.memberCount * 10000) / 100}%)`,
                      type: `span`
                    }]
                  }]
                }]
              }]).firstElementChild.lastElementChild.firstElementChild, users.join(`, `));
              j += 1;
            }
          }
          if (!wishlistSearch.innerHTML) {
            createElements(wishlistSearch, `inner`, [{
              text: `Nothing found...`,
              type: `node`
            }]);
          }
        }
        wishlistSearch.classList.remove(`esgst-hidden`);
        wishlistResults.classList.add(`esgst-hidden`);
      } else {
        wishlistResults.classList.remove(`esgst-hidden`);
        wishlistSearch.classList.add(`esgst-hidden`);
      }
    });
  }
}

export default GroupsGroupLibraryWishlistChecker;