import Module from '../../class/Module';
import ButtonSet_v2 from "../../class/ButtonSet_v2";
import Popup from "../../class/Popup";
import {utils} from '../../lib/jsUtils';
import {common} from '../Common';

const 
  {
    sortArray,
    parseHtml
  } = utils,
  {
    getTimestamp,
    getValue,
    createHeadingButton,
    createElements,
    getFeatureTooltip,
    createResults,
    getUser,
    saveUser,
    saveUsers,
    getSuspensions
  } = common
;

class UsersNotActivatedMultipleWinChecker extends Module {
  info = ({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-question-circle"></i>) to the "Gifts Won" row of a user's <a href="https://www.steamgifts.com/user/cg">profile</a> page that allows you to check if they have any not activated/multiple wins (using <a href="https://www.sgtools.info/">SGTools</a>).</li>
        <li>Adds a button (<i class="fa fa-trophy"></i> <i class="fa fa-question-circle"></i>) to the main page heading of any <a href="https://www.steamgifts.com/giveaway/aeqw7/dead-space/winners">winners</a> page that allows you to check all of the winners in the page at once. You cannot check more than that at once due to certain limitations when requesting the data to SGTools.</li>
        <li>Adds a button (<i class="fa fa-trophy"></i> <i class="fa fa-gear"></i>) to the page heading of this menu that allows you to view all of the users that have been checked.</li>
        <li>Results are cached for 1 week, so if you check the same user again within that timeframe, their status will not change.</li>
      </ul>
    `,
    features: {
      namwc_h: {
        description: `
          <ul>
            <li>Changes the color (to green if the user passed the check, red if they failed and grey if their profile is private) of a checked user's username (in any page).</li>
            <li>If you hover over the username, it shows how many not activated/multiple wins the user has and the date when they were checked for the last time.</li>
          </ul>
        `,
        features: {
          namwc_h_m: {
            description: `
              <ul>
                <li>Multiple wins are not the winner's fault sometimes. For example, if they tried to contact the giveaway creator to ask for a reroll and were unable to.</li>
                <li>With this option enabled, multiple wins are ignored when highlighting the user. So if the user has 0 not activated wins and 1 or more multiple wins, they will be considered as having passed the check.</li>
              </ul>
            `,
            name: `Ignore multiple wins.`,
            sg: true,
            st: true
          },
          namwc_h_f: {
            name: `Only highlight users who failed to pass the check.`,
            sg: true,
            st: true
          },
          namwc_h_i: {
            description: `
              <ul>
                <li>Adds an icon (<i class="fa fa-thumbs-up esgst-green"></i> if the user passed the check, <i class="fa fa-thumbs-down esgst-red"></i> if they failed and <i class="fa fa-warning esgst-grey"></i> if their profile is private) next to the user's username instead of coloring it.</li>
                <li>If you hover over the icon, it shows how many not activated/multiple wins the user has and the date when they were checked for the last time.</li>
              </ul>
            `,
            name: `Use icons instead of colors.`,
            sg: true,
            st: true
          },
        },
        name: `Highlight checked users.`,
        sg: true,
        st: true
      }
    },
    id: `namwc`,
    load: this.namwc,
    name: `Not Activated/Multiple Win Checker`,
    sg: true,
    type: `users`
  });

  namwc() {
    this.esgst.profileFeatures.push(this.namwc_addUser);
    if (this.esgst.namwc_h) {
      this.esgst.userFeatures.push(this.namwc_getUsers);
    }

    if (!this.esgst.winnersPath) return;

    this.namwc_setPopup({
      button: createHeadingButton({
        id: `namwc`,
        icons: [`fa-trophy`, `fa-question-circle`],
        title: `Check for not activated/multiple wins`
      })
    });
  }

  namwc_getUsers(users) {
    for (const user of users) {
      if (user.saved && user.saved.namwc && user.saved.namwc.results && !user.context.parentElement.querySelector(`.esgst-namwc-highlight, .esgst-namwc-icon`)) {
        let results = user.saved.namwc.results;
        let highlight = null;
        let icon = null;
        if (results.activated && (results.notMultiple || this.esgst.namwc_h_m)) {
          highlight = `positive`;
          icon = `fa-thumbs-up`;
        } else if (results.unknown) {
          highlight = `unknown`;
          icon = `fa-warning`;
        } else {
          highlight = `negative`;
          icon = `fa-thumbs-down`;
        }
        if (((highlight === `positive` || highlight === `unknown`) && !this.esgst.namwc_h_f) || highlight === `negative`) {
          let title = `${user.username} has ${results.unknown ? `?` : Array.isArray(results.notActivated) ? results.notActivated.length : results.notActivated} not activated wins and ${Array.isArray(results.multiple) ? results.multiple.length : results.multiple} multiple wins (last checked ${getTimestamp(user.saved.namwc.lastCheck)})`;
          if (this.esgst.namwc_h_i || (this.esgst.wbh && (this.esgst.wbh_w || this.esgst.wbh_b))) {
            createElements(user.context, `beforeBegin`, [{
              attributes: {
                class: `esgst-namwc-icon esgst-user-icon`,
                title: getFeatureTooltip(`namwc`, title)
              },
              type: `span`,
              children: [{
                attributes: {
                  class: `fa ${icon} esgst-${highlight}`
                },
                type: `i`
              }]
            }]);
          } else {
            user.element.classList.add(`esgst-namwc-highlight`, `esgst-${highlight}`);
            user.element.title = getFeatureTooltip(`namwc`, title);
          }
        }
      }
    }
  }

  namwc_addUser(profile) {
    this.namwc_setPopup({
      button: createElements(profile.wonRowLeft, `beforeEnd`, [{
        attributes: {
          class: `esgst-namwc-button`
        },
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-question-circle`,
            title: getFeatureTooltip(`namwc`, `Check for not activated/multiple wins`)
          },
          type: `i`
        }]
      }]),
      user: {
        id: profile.id,
        steamId: profile.steamId,
        username: profile.username
      }
    });
  }

  namwc_setPopup(obj) {
    obj.popup = new Popup(obj.isMenu ? `fa-cog` : `fa-question`, obj.isMenu ? `Manage Not Activated / Multiple Wins Checker caches:` : `Check for ${obj.user ? `${obj.user.username}'s ` : ``} not activated / multiple wins:`);
    if (!obj.isMenu) {
      createElements(obj.popup.scrollable, `beforeBegin`, [{
        type: `div`
      }]).appendChild(createOptions([{
        check: true,
        description: `Only check for not activated wins.`,
        exclusions: [`namwc_checkMultiple`],
        id: `namwc_checkNotActivated`,
        tooltip: `If enabled, multiple wins will not be checked (faster).`
      }, {
        check: true,
        description: `Only check for multiple wins.`,
        exclusions: [`namwc_checkNotActivated`],
        id: `namwc_checkMultiple`,
        tooltip: `If enabled, not activated wins will not be checked (faster).`
      }]));
      createElements(obj.popup.scrollable, `beforeBegin`, [{
        attributes: {
          class: `esgst-description`
        },
        text: `If a user is highlighted, that means that they have been either checked for the first time or updated`,
        type: `div`
      }]);
      obj.popup.description.insertBefore(new ButtonSet_v2({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-question-circle`,
        icon2: `fa-times-circle`,
        title1: `Check`,
        title2: `Cancel`,
        callback1: this.namwc_start.bind(null, obj),
        callback2: this.namwc_stop.bind(null, obj)
      }).set, obj.popup.scrollable);
    }
    obj.popup.progress = createElements(obj.popup.scrollable, `beforeBegin`, [{
      type: `div`
    }]);
    obj.popup.overallProgress = createElements(obj.popup.scrollable, `beforeBegin`, [{
      type: `div`
    }]);
    obj.popup.results = createElements(obj.popup.scrollable, `beforeEnd`, [{
      type: `div`
    }]);
    createResults(obj.popup.results, obj.popup, [{
      Icon: `fa fa-check-circle esgst-positive`,
      Description: `Users with 0 not activated wins`,
      Key: `activated`
    }, {
      Icon: `fa fa-check-circle esgst-positive`,
      Description: `Users with 0 multiple wins`,
      Key: `notMultiple`
    }, {
      Icon: `fa fa-times-circle esgst-negative`,
      Description: `Users with not activated wins`,
      Key: `notActivated`
    }, {
      Icon: `fa fa-times-circle esgst-negative`,
      Description: `Users with multiple wins`,
      Key: `multiple`
    }, {
      Icon: `fa fa-question-circle`,
      Description: `Users who cannot be checked for not activated wins either because they have a private profile or SteamCommunity is down`,
      Key: `unknown`
    }]);
    obj.button.addEventListener(`click`, obj.popup.open.bind(obj.popup, obj.isMenu ? this.namwc_start.bind(null, obj) : null));
  }

  /**
   * @param {PopupComplexObject} obj
   */
  async namwc_start(obj) {
    obj.isCanceled = false;
    obj.button.classList.add(`esgst-busy`);
    obj.popup.progress.innerHTML = ``;
    obj.popup.overallProgress.innerHTML = ``;
    obj.popup.activated.classList.add(`esgst-hidden`);
    obj.popup.notMultiple.classList.add(`esgst-hidden`);
    obj.popup.notActivated.classList.add(`esgst-hidden`);
    obj.popup.multiple.classList.add(`esgst-hidden`);
    obj.popup.unknown.classList.add(`esgst-hidden`);
    obj.popup.activatedCount.textContent = obj.popup.notMultipleCount.textContent = obj.popup.notActivatedCount.textContent = obj.popup.multipleCount.textContent = obj.popup.unknownCount.textContent = `0`;
    obj.popup.activatedUsers.innerHTML = ``;
    obj.popup.notMultipleUsers.textContent = ``;
    obj.popup.notActivatedUsers.innerHTML = ``;
    obj.popup.multipleUsers.innerHTML = ``;
    obj.popup.unknownUsers.innerHTML = ``;

    // get users
    let users = [];
    if (obj.isMenu) {
      let savedUsers = JSON.parse(await getValue(`users`));
      for (let id in savedUsers.users) {
        if (savedUsers.users.hasOwnProperty(id)) {
          let savedUser = savedUsers.users[id];
          if (!savedUser.namwc || !savedUser.namwc.results) continue;
          users.push(savedUser.username);
        }
      }
    } else if (obj.user) {
      users.push(obj.user.username);
    } else {
      let elements = this.esgst.pageOuterWrap.querySelectorAll(`a[href*="/user/"]`);
      for (let element of elements) {
        let match = element.getAttribute(`href`).match(/\/user\/(.+)/);
        if (!match) continue;
        let username = match[1];
        if (users.indexOf(username) > -1 || username === this.esgst.username || username !== element.textContent || element.closest(`.markdown`)) continue;
        users.push(username);
        if (users.length > 25) break;
      }
    }

    if (users.length === 0) {
      obj.popup.setDone();
      return;
    }

    // check users
    users = sortArray(users);
    let steamIds = [];
    let userElements = {
      activated: {},
      notMultiple: {},
      notActivated: {},
      multiple: {},
      unknown: {}
    };
    for (let i = 0, n = users.length; !obj.isCanceled && i < n; i++) {
      obj.popup.progress.innerHTML = ``;
      obj.popup.overallProgress.textContent = `${i} of ${n} users checked...`;
      let user = obj.user || {username: users[i]};
      let savedUser = await getUser(null, user);
      user.values = {
        namwc: savedUser && savedUser.namwc
      };
      let isNew = false;
      if (!obj.isMenu) {
        let resultsBackup = user.values.namwc && user.values.namwc.results;
        if (!user.values.namwc) {
          user.values.namwc = {
            lastCheck: 0,
            results: {}
          };
        }
        if (Date.now() - user.values.namwc.lastCheck > 6.048 * 1e8) {
          if (this.esgst.namwc_checkNotActivated) {
            await this.namwc_checkNotActivated(obj, user);
          } else if (this.esgst.namwc_checkMultiple) {
            await this.namwc_checkMultiple(obj, user);
          } else {
            await this.namwc_checkNotActivated(obj, user);
            await this.namwc_checkMultiple(obj, user);
          }
        }
        if (resultsBackup) {
          for (let key in resultsBackup) {
            if (resultsBackup.hasOwnProperty(key)) {
              if (((Array.isArray(resultsBackup[key]) && resultsBackup[key].length) || (!Array.isArray(resultsBackup[key]) && resultsBackup[key])) === ((Array.isArray(user.values.namwc.results[key]) && user.values.namwc.results[key].length) || (!Array.isArray(user.values.namwc.results[key]) && user.values.namwc.results[key]))) continue;
              isNew = true;
              break;
            }
          }
        } else {
          isNew = true;
        }
      }
      let elements = [];
      for (let key in user.values.namwc.results) {
        if (user.values.namwc.results.hasOwnProperty(key)) {
          let value = (Array.isArray(user.values.namwc.results[key]) && user.values.namwc.results[key].length) || (!Array.isArray(user.values.namwc.results[key]) && user.values.namwc.results[key]);
          if (!value) continue;
          obj.popup[key].classList.remove(`esgst-hidden`);
          let count = obj.popup[`${key}Count`];
          count.textContent = parseInt(count.textContent) + 1;
          const attributes = {
            href: `http://www.sgtools.info/${key.match(/multiple/i) ? `multiple` : `nonactivated`}/${user.username}`,
            target: `_blank`
          };
          if (isNew) {
            attributes.class = `esgst-bold esgst-italic`;
          }
          elements[key] = createElements(obj.popup[`${key}Users`], `beforeEnd`, [{
            attributes,
            text: `${user.username}${key.match(/^(notActivated|multiple)$/) ? ` (${value})` : ``}`,
            type: `a`
          }]);
        }
      }
      if (!obj.isMenu) {
        await saveUser(null, null, user);
        steamIds.push(user.steamId);
        userElements[user.steamId] = elements;
      }
      obj.popup.overallProgress.textContent = `${i + 1} of ${n} users checked...`;
    }

    if (obj.isCanceled) {
      obj.popup.setDone();
      return;
    }

    if (!this.esgst.ust || obj.isMenu) {
      obj.button.classList.remove(`esgst-busy`);
      obj.popup.progress.innerHTML = ``;
      obj.popup.setDone();
      return;
    }

    // check for suspensions
    obj.popup.progress.textContent = `Checking suspensions...`;
    users = [];
    let savedUsers = JSON.parse(await getValue(`users`));
    let suspensions = (await getSuspensions(steamIds)).suspensions;
    for (let steamId in suspensions) {
      let suspension = suspensions[steamId];
      let user = {steamId};
      user.values = {
        namwc: (await getUser(savedUsers, user)).namwc
      };
      user.values.namwc.suspension = suspension;
      users.push(user);
      if (Array.isArray(user.values.namwc.results.notActivated)) {
        let i, n;
        for (i = 0, n = user.values.namwc.results.notActivated.length; i < n && user.values.namwc.results.notActivated[i] <= suspension; i++) {}
        if (i > 0) {
          createElements(userElements[steamId].notActivated, `beforeEnd`, [{
            attributes: {
              title: getFeatureTooltip(`ust`, `This user already served suspension for ${i} of their not activated wins (until ${getTimestamp(suspension, true, true)})`)
            },
            text: `[-${i}]`,
            type: `span`
          }]);
        } else if (userElements[steamId].activated) {
          createElements(userElements[steamId].activated, `beforeEnd`, [{
            attributes: {
              title: getFeatureTooltip(`ust`, `This user already served suspension for not activated wins until ${getTimestamp(suspension, true, true)}`)
            },
            text: `[x]`,
            type: `span`
          }]);
        }
      }
      if (Array.isArray(user.values.namwc.results.multiple)) {
        let i, n;
        for (i = 0, n = user.values.namwc.results.multiple.length; i < n && user.values.namwc.results.multiple[i] <= suspension; i++) {}
        if (i > 0) {
          createElements(userElements[steamId].multiple, `beforeEnd`,[{
            attributes: {
              title: getFeatureTooltip(`ust`, `This user already served suspension for ${i} of their multiple wins (until ${getTimestamp(suspension, true, true)})`)
            },
            text: `[-${i}]`,
            type: `span`
          }]);
        } else if (userElements[steamId].notMultiple) {
          createElements(userElements[steamId].notMultiple, `beforeEnd`, [{
            attributes: {
              title: getFeatureTooltip(`ust`, `This user already served suspension for multiple wins until ${getTimestamp(suspension, true, true)}`)
            },
            text: `[x]`,
            type: `span`
          }]);
        }
      }
    }
    await saveUsers(users);
    obj.button.classList.remove(`esgst-busy`);
    obj.popup.progress.innerHTML = ``;
    obj.popup.setDone();
  }

  namwc_stop(obj) {
    obj.button.classList.remove(`esgst-busy`);
    obj.popup.progress.innerHTML = ``;
    obj.isCanceled = true;
  }

  async namwc_checkNotActivated(obj, user) {
    if (obj.isCanceled) return;

    if (obj.popup.progress) {
      createElements(obj.popup.progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Retrieving ${user.username}'s not activated wins...`,
        type: `span`
      }]);
    }
    let responseText = (await request({
      method: `GET`,
      queue: true,
      url: `http://www.sgtools.info/nonactivated/${user.username}`
    })).responseText;
    if (responseText.match(/has a private profile/)) {
      user.values.namwc.results.activated = 0;
      user.values.namwc.results.notActivated = [];
      user.values.namwc.results.unknown = 1;
    } else {
      user.values.namwc.results.notActivated = [];
      let elements = parseHtml(responseText).getElementsByClassName(`notActivatedGame`);
      let n = elements.length;
      for (let i = 0; i < n; ++i) {
        user.values.namwc.results.notActivated.push(new Date(elements[i].textContent.match(/\((\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})\)/)[1]).getTime());
      }
      user.values.namwc.results.activated = n === 0 ? 1 : 0;
      user.values.namwc.results.unknown = 0;
    }
    user.values.namwc.lastCheck = Date.now();
  }

  async namwc_checkMultiple(obj, user) {
    if (obj.isCanceled) return;

    if (obj.popup.progress) {
      createElements(obj.popup.progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Retrieving ${user.username}'s multiple wins...`,
        type: `span`
      }]);
    }
    user.values.namwc.results.multiple = [];
    let elements = parseHtml((await request({
      method: `GET`,
      queue: true,
      url: `http://www.sgtools.info/multiple/${user.username}`
    })).responseText).getElementsByClassName(`multiplewins`);
    let n = elements.length;
    for (let i = 0; i < n; ++i) {
      user.values.namwc.results.multiple.push(new Date(elements[i].textContent.match(/and\s(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})\)/)[1]).getTime());
    }
    user.values.namwc.results.notMultiple = n === 0 ? 1 : 0;
    user.values.namwc.lastCheck = Date.now();
  }
}

export default UsersNotActivatedMultipleWinChecker;