_MODULES.push({
    endless: true,
    id: `users`,
    load: users
  });

  function users() {
    esgst.endlessFeatures.push(users_load);
  }

  function users_load(mainContext, main, source, endless) {
    let elements = mainContext.querySelectorAll(`${endless ? `.esgst-es-page-${endless} a[href*='/user/'], .esgst-es-page-${endless}a[href*='/user/']` : `a[href*='/user/']`}`);
    if (!elements.length) return;
    let found = false;
    for (let i = elements.length - 1; i > -1; i--) {
      let element = elements[i];
      let sg = (esgst.sg && !element.getAttribute(`data-st`)) || element.getAttribute(`data-sg`);
      let match = element.getAttribute(`href`).match(/\/user\/(.+)/);
      if (!match) continue;
      let id = match[1];
      if (((!sg || element.textContent !== id) && (sg || !element.textContent || element.children.length)) || element.closest(`.markdown`)) continue;
      if (!esgst.currentUsers[id]) {
        esgst.currentUsers[id] = {
          elements: []
        };
        let steamId = sg ? esgst.users.steamIds[id] : id;
        esgst.currentUsers[id].savedUser = esgst.users.users[steamId];
        if (esgst.currentUsers[id].savedUser) {
          esgst.currentUsers[id].steamId = steamId;
        }
      }
      let j;
      for (j = esgst.currentUsers[id].elements.length - 1; j > -1 && esgst.currentUsers[id].elements[j] !== element; j--);
      if (j > -1) continue;
      let savedUser = esgst.currentUsers[id].savedUser;
      let container = element.parentElement;
      let oldElement = element;
      if (esgst.userPath && container.classList.contains(`page__heading__breadcrumbs`)) {
        element = document.getElementsByClassName(`featured__heading__medium`)[0];        
      }
      esgst.currentUsers[id].elements.push(element);
      let context = container.classList.contains(`comment__username`) ? container : element;
      esgst[main ? `mainUsers` : `popupUsers`].push({
        code: id,
        innerWrap: context,
        outerWrap: context,
        sg
      });
      if (savedUser) {
        let html = [];
        if (esgst.namwc && esgst.namwc_h && savedUser.namwc && savedUser.namwc.results && !context.parentElement.querySelector(`.esgst-namwc-highlight, .esgst-namwc-icon`)) {
          let results = savedUser.namwc.results;
          let highlight = null;
          let icon = null;
          if (results.activated && (results.notMultiple || esgst.namwc_h_m)) {
            highlight = `positive`;
            icon = `fa-thumbs-up`;
          } else if (results.unknown) {
            highlight = `unknown`;
            icon = `fa-warning`;
          } else {
            highlight = `negative`;
            icon = `fa-thumbs-down`;
          }
          if (((highlight === `positive` || highlight === `unknown`) && !esgst.namwc_h_f) || highlight === `negative`) {
            let title = `${savedUser.username} has ${results.unknown ? `?` : Array.isArray(results.notActivated) ? results.notActivated.length : results.notActivated} not activated wins and ${Array.isArray(results.multiple) ? results.multiple.length : results.multiple} multiple wins (last checked ${getTimestamp(savedUser.namwc.lastCheck)})`;
            if (esgst.namwc_h_i || (esgst.wbh && (esgst.wbh_w || esgst.wbh_b))) {
              html.push({
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
              });
            } else {
              element.classList.add(`esgst-namwc-highlight`, `esgst-${highlight}`);
              element.title = getFeatureTooltip(`namwc`, title);
            }
          }
        }
        if (esgst.wbc && esgst.wbc_h && savedUser.wbc && !context.parentElement.getElementsByClassName(`esgst-wbc-icon`)[0]) {
          let result = savedUser.wbc.result;
          if ((result === `whitelisted`) || ((result === `blacklisted`) && !esgst.wbc_hb)) {
            html.push({
              attributes: {
                class: `esgst-wbc-icon esgst-user-icon`,
                title: getFeatureTooltip(`wbc`, `${savedUser.username} has ${result} you (last checked ${getTimestamp(savedUser.wbc.lastCheck)})`)
              },
              type: `span`,
              children: [{
                attributes: {
                  class: `fa ${(result === `whitelisted`) ? `fa-check esgst-whitelist` : `fa-times esgst-blacklist`}`
                },
                type: `i`
              }]
            });
          }
        }
        if (esgst.wbh && (savedUser.whitelisted || savedUser.blacklisted) && !context.parentElement.querySelector(`.esgst-wbh-highlight, .esgst-wbh-icon`)) {
          let [icon, status] = savedUser.whitelisted ? [`fa-heart sidebar__shortcut__whitelist`, `whitelisted`] : [`fa-ban sidebar__shortcut__blacklist`, `blacklisted`];
          let title = `You ${status} ${savedUser.username} on ${getTimestamp(savedUser[`${status}Date`])}`;
          if ((esgst.wbh_w && savedUser.whitelisted) || (esgst.wbh_b && savedUser.blacklisted)) {
            element.classList.add(`esgst-wbh-highlight`, `esgst-wbh-highlight-${status}`);
            element.title = getFeatureTooltip(`wbh`, title);
          } else {
            html.push({
              attributes: {
                class: `esgst-wbh-icon esgst-user-icon`,
                title: getFeatureTooltip(`wbh`, title)
              },
              type: `span`,
              children: [{
                attributes: {
                  class: `fa ${icon} esgst-${status.slice(0, -2)}`
                },
                type: `i`
              }]
            });
          }
        }
        if (html) {
          createElements(context, `beforeBegin`, html);
        }
        if (esgst.ut && !context.parentElement.getElementsByClassName(`esgst-ut-button`)[0]) {
          ut_addButton(context, id, esgst.currentUsers[id].steamId, savedUser.username);
          if (savedUser.tags) {
            ut_addTags(id, savedUser.tags);
          }
        }
      } else if (esgst.ut && !context.parentElement.getElementsByClassName(`esgst-ut-button`)[0]) {
        ut_addButton(context, id, sg ? null : id, sg ? id : null);
      }
      if (esgst.ap && !oldElement.classList.contains(`esgst-ap-avatar`)[0]) {
        ap_setAvatar(oldElement);
      }
      if (!found) {
        found = true;
      }
    }
    if (found) {
      if (esgst.wbcButton && mainContext === document && !esgst.aboutPath) {
        esgst.wbcButton.classList.remove(`esgst-hidden`);
        esgst.wbcButton.parentElement.classList.remove(`esgst-hidden`);
      }
      if (esgst.mm_enableUsers && esgst.mm_enable) {
        esgst.mm_enable(esgst[main ? `mainUsers` : `popupUsers`], `Users`);
      }
    }
  }

