<<<<<<< HEAD:src/modules/Users/WhitelistBlacklistManager.js
import Module from '../../class/Module';
import ButtonSet from '../../class/ButtonSet';
import Popup from '../../class/Popup';
import ToggleSwitch from '../../class/ToggleSwitch';
import {utils} from '../../lib/jsUtils';
import {common} from '../Common';

const
  parseHtml = utils.parseHtml.bind(utils),
  createConfirmation = common.createConfirmation.bind(common),
  createElements = common.createElements.bind(common),
  createFadeMessage = common.createFadeMessage.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  downloadFile = common.downloadFile.bind(common),
  formatTags = common.formatTags.bind(common),
  request = common.request.bind(common),
  setSetting = common.setSetting.bind(common)
;

class UsersWhitelistBlacklistManager extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Adds a button (<i class="fa fa-arrow-up"></i> <i class="fa fa-arrow-down"></i> <i class="fa fa-trash"></i>) to the main page heading of your <a href="https://www.steamgifts.com/account/manage/whitelist">whitelist</a>/<a href="https://www.steamgifts.com/account/manage/blacklist">blacklist</a> pages that allows you to import/export/clear your whitelist/blacklist.</li>
      </ul>
    `,
      id: `wbm`,
      load: this.wbm_init,
      name: `Whitelist/Blacklist Manager`,
      sg: true,
      type: `users`
    };
  }

  wbm_init() {
    if (!this.esgst.whitelistPath && !this.esgst.blacklistPath) return;
    let wbm = {};
    if (this.esgst.whitelistPath) {
      wbm.key = `whitelist`;
      wbm.name = `Whitelist`;
    } else {
      wbm.key = `blacklist`;
      wbm.name = `Blacklist`;
    }
    wbm.button = createHeadingButton({
      id: `wbm`,
      icons: [`fa-arrow-up`, `fa-arrow-down`, `fa-trash`],
      title: `Manage ${wbm.key}`
    });
    wbm.button.addEventListener(`click`, this.wbm_openPopup.bind(this, wbm));
  }

  wbm_openPopup(wbm) {
    if (!wbm.popup) {
      wbm.popup = new Popup({addScrollable: true, icon: `fa-gear`, title: `Manage ${wbm.name}:`});
      new ToggleSwitch(wbm.popup.description, `wbm_useCache`, false, `Use cache.`, false, false, `Uses the cache created the last time you synced your whitelist/blacklist. This speeds up the process, but could lead to incomplete results if your cache isn't up-to-date.`, this.esgst.wbm_useCache);
      new ToggleSwitch(wbm.popup.description, `wbm_clearTags`, false, [{
        text: `Only clear users who are tagged with these specific tags (separate with comma): `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-switch-input esgst-switch-input-large`,
          type: `text`,
          value: this.esgst.wbm_tags.join(`, `)
        },
        type: `input`
      }], false, false, `Uses the User Tags database to remove only users with the specified tags.`, this.esgst.wbm_clearTags).name.firstElementChild.addEventListener(`change`, event => {
        const element = event.currentTarget;
        let tags = element.value.replace(/(,\s*)+/g, formatTags).split(`, `);
        setSetting(`wbm_tags`, tags);
        this.esgst.wbm_tags = tags;
      });
      wbm.input = createElements(wbm.popup.description, `beforeEnd`, [{
        attributes: {
          type: `file`
        },
        type: `input`
      }]);
      wbm.message = createElements(wbm.popup.description, `beforeEnd`, [{
        attributes: {
          class: `esgst-description`
        },
        type: `div`
      }]);
      wbm.warning = createElements(wbm.popup.description, `beforeEnd`, [{
        attributes: {
          class: `esgst-description esgst-warning`
        },
        type: `div`
      }]);
      wbm.popup.description.appendChild(new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-arrow-up`,
        icon2: `fa-times`,
        title1: `Import`,
        title2: `Cancel`,
        callback1: this.wbm_start.bind(this, wbm, this.wbm_importList.bind(this, wbm)),
        callback2: this.wbm_cancel.bind(this, wbm)
      }).set);
      wbm.popup.description.appendChild(new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-arrow-down`,
        icon2: `fa-times`,
        title1: `Export`,
        title2: `Cancel`,
        callback1: this.wbm_start.bind(this, wbm, this.wbm_exportList.bind(this, wbm, [], 1)),
        callback2: this.wbm_cancel.bind(this, wbm)
      }).set);
      wbm.popup.description.appendChild(new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-trash`,
        icon2: `fa-times`,
        title1: `Clear`,
        title2: `Cancel`,
        callback1: this.wbm_start.bind(this, wbm, this.wbm_clearList.bind(this, wbm, [], 1)),
        callback2: this.wbm_cancel.bind(this, wbm)
      }).set);
      wbm.results = createElements(wbm.popup.scrollable, `beforeEnd`, [{
        type: `div`
      }]);
    }
    wbm.popup.open();
  }

  wbm_start(wbm, callback, mainCallback) {
    createConfirmation(`Are you sure you want to do this?`, () => {
      wbm.isCanceled = false;
      wbm.button.classList.add(`esgst-busy`);
      wbm.usernames = [];
      wbm.results.innerHTML = ``;
      callback(this.wbm_complete.bind(this, wbm, mainCallback));
    }, mainCallback);
  }

  wbm_complete(wbm, callback) {
    wbm.button.classList.remove(`esgst-busy`);
    callback();
  }

  wbm_cancel(wbm) {
    wbm.isCanceled = true;
    wbm.button.classList.remove(`esgst-busy`);
  }

  wbm_importList(wbm, callback) {
    let file = wbm.input.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        try {
          let list = JSON.parse(/** @type {string} */  reader.result);
          // noinspection JSIgnoredPromiseFromCall
          this.wbm_insertUsers(wbm, list, 0, list.length, callback);
        } catch (error) {
          createFadeMessage(wbm.warning, `Cannot parse file!`);
          callback();
        }
      };
    } else {
      createFadeMessage(wbm.warning, `No file was loaded!`);
      callback();
    }
  }

  async wbm_insertUsers(wbm, list, i, n, callback) {
    if (wbm.isCanceled) return;
    createElements(wbm.message, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }, {
      text: `Importing list (${i} of ${n})...`,
      type: `span`
    }]);
    if (i < n) {
      await request({
        data: `xsrf_token=${this.esgst.xsrfToken}&do=${wbm.key}&action=insert&child_user_id=${list[i]}`,
        method: `POST`,
        url: `/ajax.php`
      });
      setTimeout(() => this.wbm_insertUsers(wbm, list, ++i, n, callback), 0);
    } else {
      createFadeMessage(wbm.message, `List imported with success!`);
      callback();
    }
  }

  async wbm_exportList(wbm, list, nextPage, callback) {
    if (wbm.isCanceled) return;
    if (this.esgst.wbm_useCache) {
      let steamId;
      for (steamId in this.esgst.users.users) {
        if (this.esgst.users.users.hasOwnProperty(steamId)) {
          if (this.esgst.users.users[steamId][`${wbm.key}ed`]) {
            list.push(this.esgst.users.users[steamId].id);
          }
        }
      }
      downloadFile(JSON.stringify(list), `esgst_${wbm.key}_${new Date().toISOString()}.json`);
      createFadeMessage(wbm.message, `List exported with success!`);
      callback();
    } else {
      createElements(wbm.message, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Retrieving list (page ${nextPage})...`,
        type: `span`
      }]);
      let elements, i, n, pagination, responseHtml;
      responseHtml = parseHtml((await request({
        method: `GET`,
        url: `https://www.steamgifts.com/account/manage/${wbm.key}/search?page=${nextPage}`
      })).responseText);
      elements = responseHtml.querySelectorAll(`[name="child_user_id"]`);
      for (i = 0, n = elements.length; i < n; ++i) {
        list.push(elements[i].value);
      }
      pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
      if (pagination && !pagination.lastElementChild.classList.contains(`is-selected`)) {
        setTimeout(() => this.wbm_exportList(wbm, list, ++nextPage, callback), 0);
      } else {
        downloadFile(JSON.stringify(list), `esgst_${wbm.key}_${new Date().toISOString()}.json`);
        createFadeMessage(wbm.message, `List exported with success!`);
        callback();
      }
    }
  }

  async wbm_clearList(wbm, list, nextPage, callback) {
    if (wbm.isCanceled) return;
    if (this.esgst.wbm_useCache) {
      let steamId;
      for (steamId in this.esgst.users.users) {
        if (this.esgst.users.users.hasOwnProperty(steamId)) {
          let user = this.esgst.users.users[steamId];
          if (user[`${wbm.key}ed`]) {
            if (this.esgst.wbm_clearTags) {
              if (user.tags) {
                let i;
                for (i = user.tags.length - 1; i > -1 && this.esgst.wbm_tags.indexOf(user.tags[i]) < 0; --i) {
                }
                if (i > -1) {
                  list.push(user.id);
                  wbm.usernames.push(user.username);
                }
              }
            } else {
              list.push(user.id);
            }
          }
        }
      }
      // noinspection JSIgnoredPromiseFromCall
      this.wbm_deleteUsers(wbm, list, 0, list.length, callback);
    } else {
      createElements(wbm.message, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Retrieving list (page ${nextPage})...`,
        type: `span`
      }]);
      let element, elements, i, n, pagination, responseHtml;
      responseHtml = parseHtml((await request({
        method: `GET`,
        url: `https://www.steamgifts.com/account/manage/${wbm.key}/search?page=${nextPage}`
      })).responseText);
      elements = responseHtml.querySelectorAll(`[name="child_user_id"]`);
      for (i = 0, n = elements.length; i < n; ++i) {
        element = elements[i];
        if (this.esgst.wbm_clearTags) {
          let steamId, username;
          username = element.closest(`.table__row-inner-wrap`).getElementsByClassName(`table__column__heading`)[0].textContent;
          steamId = this.esgst.users.steamIds[username];
          if (steamId) {
            let user = this.esgst.users.users[steamId];
            if (user.tags) {
              let j;
              for (j = user.tags.length - 1; j > -1 && this.esgst.wbm_tags.indexOf(user.tags[j]) < 0; --j) {
              }
              if (j > -1) {
                list.push(element.value);
                wbm.usernames.push(username);
              }
            }
          }
        } else {
          list.push(element.value);
        }
      }
      pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
      if (pagination && !pagination.lastElementChild.classList.contains(`is-selected`)) {
        setTimeout(() => this.wbm_clearList(wbm, list, ++nextPage, callback), 0);
      } else {
        // noinspection JSIgnoredPromiseFromCall
        this.wbm_deleteUsers(wbm, list, 0, list.length, callback);
      }
    }
  }

  async wbm_deleteUsers(wbm, list, i, n, callback) {
    if (wbm.isCanceled) return;
    createElements(wbm.message, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }, {
      text: `Clearing list (${i} of ${n})...`,
      type: `span`
    }]);
    if (i < n) {
      await request({
        data: `xsrf_token=${this.esgst.xsrfToken}&do=${wbm.key}&action=delete&child_user_id=${list[i]}`,
        method: `POST`,
        url: `/ajax.php`
      });
      setTimeout(() => this.wbm_deleteUsers(wbm, list, ++i, n, callback), 0);
    } else {
      createFadeMessage(wbm.message, `List cleared with success!`);
      createElements(wbm.results, `inner`, [{
        attributes: {
          class: `esgst-bold`
        },
        text: `Users cleared (${wbm.usernames.length}):`,
        type: `span`
      }, {
        attributes: {
          class: `esgst-popup-actions`
        },
        type: `span`
      }]);
      wbm.usernames.forEach(username => {
        createElements(wbm.results.lastElementChild, `beforeEnd`, [{
          attributes: {
            href: `/user/${username}`
          },
          text: username,
          type: `a`
        }]);
      });
      callback();
    }
  }
}

export default UsersWhitelistBlacklistManager;
=======
_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-arrow-up"></i> <i class="fa fa-arrow-down"></i> <i class="fa fa-trash"></i>) to the main page heading of your <a href="https://www.steamgifts.com/account/manage/whitelist">whitelist</a>/<a href="https://www.steamgifts.com/account/manage/blacklist">blacklist</a> pages that allows you to import/export/clear your whitelist/blacklist.</li>
      </ul>
    `,
    id: `wbm`,
    load: wbm,
    name: `Whitelist/Blacklist Manager`,
    sg: true,
    type: `users`
  });

  function wbm() {
    if (!esgst.whitelistPath && !esgst.blacklistPath) return;
    let wbm = {};
    if (esgst.whitelistPath) {
      wbm.key = `whitelist`;
      wbm.name = `Whitelist`;
    } else {
      wbm.key = `blacklist`;
      wbm.name = `Blacklist`;
    }
    wbm.button = createHeadingButton({id: `wbm`, icons: [`fa-arrow-up`, `fa-arrow-down`, `fa-trash`], title: `Manage ${wbm.key}`});
    wbm.button.addEventListener(`click`, wbm_openPopup.bind(null, wbm));
  }

  function wbm_openPopup(wbm) {
    if (!wbm.popup) {
      wbm.popup = new Popup(`fa-gear`, `Manage ${wbm.name}:`);
      new ToggleSwitch(wbm.popup.description, `wbm_useCache`, false, `Use cache.`, false, false, `Uses the cache created the last time you synced your whitelist/blacklist. This speeds up the process, but could lead to incomplete results if your cache isn't up-to-date.`, esgst.wbm_useCache);
      new ToggleSwitch(wbm.popup.description, `wbm_clearTags`, false, [{
        text: `Only clear users who are tagged with these specific tags (separate with comma): `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-switch-input esgst-switch-input-large`,
          type: `text`,
          value: esgst.wbm_tags.join(`, `)
        },
        type: `input`
      }], false, false, `Uses the User Tags database to remove only users with the specified tags.`, esgst.wbm_clearTags).name.firstElementChild.addEventListener(`change`, event => {
        let tags = event.currentTarget.value.replace(/(,\s*)+/g, formatTags).split(`, `);
        setSetting(`wbm_tags`, tags);
        esgst.wbm_tags = tags;
      });
      wbm.input = createElements(wbm.popup.description, `beforeEnd`, [{
        attributes: {
          type: `file`
        },
        type: `input`
      }]);
      wbm.message = createElements(wbm.popup.description, `beforeEnd`, [{
        attributes: {
          class: `esgst-description`
        },
        type: `div`
      }]);
      wbm.warning = createElements(wbm.popup.description, `beforeEnd`, [{
        attributes: {
          class: `esgst-description esgst-warning`
        },
        type: `div`
      }]);
      wbm.popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-arrow-up`, `fa-times`, `Import`, `Cancel`, wbm_start.bind(null, wbm, wbm_importList.bind(null, wbm)), wbm_cancel.bind(null, wbm)).set);
      wbm.popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-arrow-down`, `fa-times`, `Export`, `Cancel`, wbm_start.bind(null, wbm, wbm_exportList.bind(null, wbm, [], 1)), wbm_cancel.bind(null, wbm)).set);
      wbm.popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-trash`, `fa-times`, `Clear`, `Cancel`, wbm_start.bind(null, wbm, wbm_clearList.bind(null, wbm, [], 1)), wbm_cancel.bind(null, wbm)).set);
      wbm.results = createElements(wbm.popup.scrollable,  `beforeEnd`, [{
        type: `div`
      }]);
    }
    wbm.popup.open();
  }

  function wbm_start(wbm, callback, mainCallback) {
    createConfirmation(`Are you sure you want to do this?`, () => {
      wbm.isCanceled = false;
      wbm.button.classList.add(`esgst-busy`);
      wbm.usernames = [];
      wbm.results.innerHTML = ``;
      callback(wbm_complete.bind(null, wbm, mainCallback));
    }, mainCallback);
  }

  function wbm_complete(wbm, callback) {
    wbm.button.classList.remove(`esgst-busy`);
    callback();
  }

  function wbm_cancel(wbm) {
    wbm.isCanceled = true;
    wbm.button.classList.remove(`esgst-busy`);
  }

  function wbm_importList(wbm, callback) {
    let file = wbm.input.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        try {
          let list = JSON.parse(reader.result);
          wbm_insertUsers(wbm, list, 0, list.length, callback);
        } catch (error) {
          createFadeMessage(wbm.warning, `Cannot parse file!`);
          callback();
        }
      };
    } else {
      createFadeMessage(wbm.warning, `No file was loaded!`);
      callback();
    }
  }

  async function wbm_insertUsers(wbm, list, i, n, callback) {
    if (wbm.isCanceled) return;
    createElements(wbm.message, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }, {
      text: `Importing list (${i} of ${n})...`,
      type: `span`
    }]);
    if (i < n) {
      await request({data: `xsrf_token=${esgst.xsrfToken}&do=${wbm.key}&action=insert&child_user_id=${list[i]}`, method: `POST`, url: `/ajax.php`});
      setTimeout(() => wbm_insertUsers(wbm, list, ++i, n, callback), 0);
    } else {
      createFadeMessage(wbm.message, `List imported with success!`);
      callback();
    }
  }

  async function wbm_exportList(wbm, list, nextPage, callback) {
    if (wbm.isCanceled) return;
    if (esgst.wbm_useCache) {
      let steamId;
      for (steamId in esgst.users.users) {
        if (esgst.users.users[steamId][`${wbm.key}ed`]) {
          list.push(esgst.users.users[steamId].id);
        }
      }
      downloadFile(JSON.stringify(list), `esgst_${wbm.key}_${new Date().toISOString()}.json`);
      createFadeMessage(wbm.message, `List exported with success!`);
      callback();
    } else {
      createElements(wbm.message, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Retrieving list (page ${nextPage})...`,
        type: `span`
      }]);
      let elements, i, n, pagination, responseHtml;
      responseHtml = parseHtml((await request({method: `GET`, url: `https://www.steamgifts.com/account/manage/${wbm.key}/search?page=${nextPage}`})).responseText);
      elements = responseHtml.querySelectorAll(`[name="child_user_id"]`);
      for (i = 0, n = elements.length; i < n; ++i) {
        list.push(elements[i].value);
      }
      pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
      if (pagination && !pagination.lastElementChild.classList.contains(`is-selected`)) {
        setTimeout(() => wbm_exportList(wbm, list, ++nextPage, callback), 0);
      } else {
        downloadFile(JSON.stringify(list), `esgst_${wbm.key}_${new Date().toISOString()}.json`);
        createFadeMessage(wbm.message, `List exported with success!`);
        callback();
      }
    }
  }

  async function wbm_clearList(wbm, list, nextPage, callback) {
    if (wbm.isCanceled) return;
    if (esgst.wbm_useCache) {
      let steamId;
      for (steamId in esgst.users.users) {
        let user = esgst.users.users[steamId];
        if (user[`${wbm.key}ed`]) {
          if (esgst.wbm_clearTags) {
            if (user.tags) {
              let i;
              for (i = user.tags.length - 1; i > -1 && esgst.wbm_tags.indexOf(user.tags[i]) < 0; --i);
              if (i > -1) {
                list.push(user.id);
                wbm.usernames.push(user.username);
              }
            }
          } else {
            list.push(user.id);
          }
        }
      }
      wbm_deleteUsers(wbm, list, 0, list.length, callback);
    } else {
      createElements(wbm.message, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Retrieving list (page ${nextPage})...`,
        type: `span`
      }]);
      let element, elements, i, n, pagination, responseHtml;
      responseHtml = parseHtml((await request({method: `GET`, url: `https://www.steamgifts.com/account/manage/${wbm.key}/search?page=${nextPage}`})).responseText);
      elements = responseHtml.querySelectorAll(`[name="child_user_id"]`);
      for (i = 0, n = elements.length; i < n; ++i) {
        element = elements[i];
        if (esgst.wbm_clearTags) {
          let steamId, username;
          username = element.closest(`.table__row-inner-wrap`).getElementsByClassName(`table__column__heading`)[0].textContent;
          steamId = esgst.users.steamIds[username];
          if (steamId) {
            let user = esgst.users.users[steamId];
            if (user.tags) {
              let j;
              for (j = user.tags.length - 1; j > -1 && esgst.wbm_tags.indexOf(user.tags[j]) < 0; --j);
              if (j > -1) {
                list.push(element.value);
                wbm.usernames.push(username);
              }
            }
          }
        } else {
          list.push(element.value);
        }
      }
      pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
      if (pagination && !pagination.lastElementChild.classList.contains(`is-selected`)) {
        setTimeout(() => wbm_clearList(wbm, list, ++nextPage, callback), 0);
      } else {
        wbm_deleteUsers(wbm, list, 0, list.length, callback);
      }
    }
  }

  async function wbm_deleteUsers(wbm, list, i, n, callback) {
    if (wbm.isCanceled) return;
    createElements(wbm.message, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }, {
      text: `Clearing list (${i} of ${n})...`,
      type: `span`
    }]);
    if (i < n) {
      await request({data: `xsrf_token=${esgst.xsrfToken}&do=${wbm.key}&action=delete&child_user_id=${list[i]}`, method: `POST`, url: `/ajax.php`});
      setTimeout(() => wbm_deleteUsers(wbm, list, ++i, n, callback), 0);
    } else {
      createFadeMessage(wbm.message, `List cleared with success!`);
      createElements(wbm.results, `inner`, [{
        attributes: {
          class: `esgst-bold`
        },
        text: `Users cleared (${wbm.usernames.length}):`,
        type: `span`
      }, {
        attributes: {
          class: `esgst-popup-actions`
        },
        type: `span`
      }]);
      wbm.usernames.forEach(username => {
        createElements(wbm.results.lastElementChild, `beforeEnd`, [{
          attributes: {
            href: `/user/${username}`
          },
          text: username,
          type: `a`
        }]);
      });
      callback();
    }
  }
  
>>>>>>> master:Extension/Modules/Users/WhitelistBlacklistManager.js
