_MODULES.push({
    description: `
      <ul>
        <li>Allows you to add links to your <a href="https://www.steamgifts.com/account/manage/whitelist">whitelist</a>/<a href="https://www.steamgifts.com/account/manage/blacklist">blacklist</a>/<a href="https://www.steamgifts.com/account/steam/games">games</a>/<a href="https://www.steamgifts.com/account/steam/games">groups</a>/<a href="https://www.steamgifts.com/account/steam/wishlist">wishlist</a> pages to the sidebar of your <a href="https://www.steamgifts.com/user/your-username">profile</a> page.</li>
        <li>The count for each link might be off if you do not have your whitelist/blacklist/owned games/groups/wishlisted games synced through ESGST (first button in the page heading of this menu). The count for games might be always off, since the method ESGST uses to sync your owned games includes DLCs.</li>
      </ul>
    `,
    features: {
      pl_w: {
        name: `Show whitelist link.`,
        sg: true
      },
      pl_b: {
        name: `Show blacklist link.`,
        sg: true
      },
      pl_g: {
        name: `Show games link.`,
        sg: true
      },
      pl_gs: {
        name: `Show groups link.`,
        sg: true
      },
      pl_wl: {
        name: `Show wishlist link.`,
        sg: true
      }
    },
    id: `pl`,
    load: pl,
    name: `Profile Links`,
    sg: true,
    type: `users`
  });

  function pl() {
    if (!esgst.userPath) return;
    esgst.profileFeatures.push(pl_add);
  }

  function pl_add(profile) {
    if (profile.username !== esgst.username) {
      return;
    }
    const items = [];
    const sections = [
      {
        items: [
          {
            count: 0,
            id: `pl_w`,
            name: `Whitelist`,
            url: `/account/manage/whitelist`
          },
          {
            count: 0,
            id: `pl_b`,
            name: `Blacklist`,
            url: `/account/manage/blacklist`
          }
        ],
        name: `Manage`
      },
      {
        items: [
          {
            count: 0,
            id: `pl_g`,
            name: `Games`,
            url: `/account/steam/games`
          },
          {
            count: 0,
            id: `pl_gs`,
            name: `Groups`,
            url: `/account/steam/groups`
          },
          {
            count: 0,
            id: `pl_wl`,
            name: `Wishlist`,
            url: `/account/steam/wishlist`
          }
        ],
        name: `Steam`
      }
    ];
    for (const id in esgst.users.users) {
      const user = esgst.users.users[id];
      if (user.whitelisted) {
        sections[0].items[0].count += 1;
      } else if (user.blacklisted) {
        sections[0].items[1].count += 1;
      }
    }
    for (const id in esgst.games.apps) {
      const game = esgst.games.apps[id];
      if (game.owned) {
        sections[1].items[0].count += 1;
      } else if (game.wishlisted) {
        sections[1].items[2].count += 1;
      }
    }
    for (const group of esgst.groups) {
      if (group.member) {
        sections[1].items[1].count += 1
      }
    }
    for (const section of sections) {
      let enabled = false;
      const list = [];
      for (const item of section.items) {
        if (!esgst[item.id]) {
          return;
        }
        list.push({
          attributes: {
            class: `sidebar__navigation__item`
          },
          type: `li`,
          children: [{
            attributes: {
              class: `sidebar__navigation__item__link`,
              href: item.url
            },
            type: `a`,
            children: [{
              attributes: {
                class: `sidebar__navigation__item__name`
              },
              text: item.name,
              type: `div`
            }, {
              attributes: {
                class: `sidebar__navigation__item__underline`
              },
              type: `div`
            }, {
              attributes: {
                class: `sidebar__navigation__item__count`
              },
              text: item.count,
              type: `div`
            }]
          }]
        });
        enabled = true;
      }
      if (!enabled) {
        return;
      }
      items.push({
        attributes: {
          class: `sidebar__heading`
        },
        text: section.name,
        type: `h3`
      }, {
        attributes: {
          class: `sidebar__navigation`,
          title: getFeatureTooltip(`pl`)
        },
        type: `ul`,
        children: list
      });
    }
    createElements(esgst.sidebar.getElementsByClassName(`sidebar__navigation`)[0], `afterEnd`, items);
  }

  _MODULES.push({
    endless: true,
    id: `profile`,
    load: profile
  });
  
   async function profile() {
    if (!esgst.userPath) return;
    await profile_load(document);
  }

  async function profile_load(context) {
    let element, elements, i, input, key, match, profile, rows;
    profile = {};
    if (esgst.sg) {
      profile.heading = context.getElementsByClassName(`featured__heading`)[0];
      input = context.querySelector(`[name="child_user_id"]`);
      if (input) {
        profile.id = input.value;
      } else {
        profile.id = ``;
      }
      profile.username = profile.heading.textContent.replace(/\s[\s\S]*/, ``);
      profile.steamButtonContainer = context.getElementsByClassName(`sidebar__shortcut-outer-wrap`)[0];
      profile.steamButton = profile.steamButtonContainer.querySelector(`[href*="/profiles/"]`);
      profile.steamId = profile.steamButton.getAttribute(`href`).match(/\d+/)[0];
      profile.name = profile.username;
    } else {
      profile.heading = esgst.mainPageHeading;
      profile.id = ``;
      profile.username = ``;
      profile.steamButtonContainer = context.getElementsByClassName(`profile_links`)[0];
      profile.steamButton = profile.steamButtonContainer.querySelector(`[href*="/profiles/"]`);
      profile.steamId = profile.steamButton.getAttribute(`href`).match(/\d+/)[0];
      profile.name = profile.steamId;
    }
    elements = context.getElementsByClassName(`featured__table__row__left`);
    for (i = elements.length - 1; i >= 0; --i) {
      element = elements[i];
      match = element.textContent.match(/(Comments|Gifts (Won|Sent)|Contributor Level)/);
      if (match) {
        key = match[2];
        if (key) {
          if (key === `Won`) {
            profile.wonRow = element.parentElement;
            profile.wonRowLeft = element;
            profile.wonRowRight = element.nextElementSibling;
            rows = JSON.parse(profile.wonRowRight.firstElementChild.firstElementChild.getAttribute(`data-ui-tooltip`)).rows;
            profile.wonCount = parseInt(rows[0].columns[1].name.replace(/,/g, ``));
            profile.wonFull = parseInt(rows[1].columns[1].name.replace(/,/g, ``));
            profile.wonReduced = parseInt(rows[2].columns[1].name.replace(/,/g, ``));
            profile.wonZero = parseInt(rows[3].columns[1].name.replace(/,/g, ``));
            profile.wonCvContainer = profile.wonRowRight.firstElementChild.lastElementChild;
            rows = JSON.parse(profile.wonCvContainer.getAttribute(`data-ui-tooltip`)).rows;
            profile.wonCV = parseFloat(profile.wonCvContainer.textContent.replace(/\$|,/g, ``));
            profile.realWonCV = parseFloat(rows[0].columns[1].name.replace(/\$|,/g, ``));
          } else {
            profile.sentRow = element.parentElement;
            profile.sentRowLeft = element;
            profile.sentRowRight = element.nextElementSibling;
            rows = JSON.parse(profile.sentRowRight.firstElementChild.firstElementChild.getAttribute(`data-ui-tooltip`)).rows;
            profile.sentCount = parseInt(rows[0].columns[1].name.replace(/,/g, ``));
            profile.sentFull = parseInt(rows[1].columns[1].name.replace(/,/g, ``));
            profile.sentReduced = parseInt(rows[2].columns[1].name.replace(/,/g, ``));
            profile.sentZero = parseInt(rows[3].columns[1].name.replace(/,/g, ``));
            profile.notSent = parseInt(rows[5].columns[1].name.replace(/,/g, ``));
            profile.sentCvContainer = profile.sentRowRight.firstElementChild.lastElementChild;
            rows = JSON.parse(profile.sentCvContainer.getAttribute(`data-ui-tooltip`)).rows;
            profile.sentCV = parseFloat(profile.sentCvContainer.textContent.replace(/\$|,/g, ``));
            profile.realSentCV = parseFloat(rows[0].columns[1].name.replace(/\$|,/g, ``));
          }
        } else if (match[1] === `Comments`) {
          profile.commentsRow = element.parentElement;
        } else {
          profile.levelRow = element.parentElement;
          profile.levelRowLeft = element;
          profile.levelRowRight = element.nextElementSibling;
          rows = JSON.parse(profile.levelRowRight.firstElementChild.getAttribute(`data-ui-tooltip`)).rows;
          profile.level = parseFloat(rows[0].columns[1].name);
        }
      }
    }
    profile.whitelistButton = profile.steamButtonContainer.getElementsByClassName(`sidebar__shortcut__whitelist`)[0];
    profile.blacklistButton = profile.steamButtonContainer.getElementsByClassName(`sidebar__shortcut__blacklist`)[0];
    if (profile.whitelistButton) {
      if (esgst.updateWhitelistBlacklist) {
        profile.whitelistButton.addEventListener(`click`, updateWhitelistBlacklist.bind(null, `whitelisted`, profile));
      }
    }
    if (profile.blacklistButton) {
      if (esgst.updateWhitelistBlacklist) {
        profile.blacklistButton.addEventListener(`click`, updateWhitelistBlacklist.bind(null, `blacklisted`, profile));
      }
    }
    let savedUser = esgst.users.users[profile.steamId];
    if (savedUser) {
      const user = {
        steamId: profile.steamId,
        username: profile.username,
        values: {}
      };
      if (checkUsernameChange(esgst.users, user)) {
        await saveUser(null, esgst.users, user);
        savedUser = esgst.users.users[profile.steamId];
      }
    }
    for (const feature of esgst.profileFeatures) {
      try {
        await feature(profile, savedUser);
      } catch (error) {
        console.log(error);
      }
    }
  }

  _MODULES.push({
    endless: true,
    id: `endlessLoad`,
    load: endlessLoad
  });

  async function endlessLoad() {    
    if (!esgst.menuPath) {
      await endless_load(document, true);
    }
  }
  
