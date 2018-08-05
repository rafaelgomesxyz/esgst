_MODULES.push({
    description: `
      <ul>
        <li>Adds a button ("<i class="fa fa-plus-circle"></i> Enter" to enter and "<i class="fa fa-minus-circle"></i> Leave" to leave) below a giveaway's start time (in any page) that allows you to enter/leave the giveaway without having to access it.</li>
        <li>You can move the button around by dragging and dropping it.</li>
      </ul>
    `,
    features: {
      elgb_c: {
        name: `Cache repeated descriptions from the same creator for 1 hour and only show them once.`,
        sg: true
      },
      elgb_f: {
        inputItems: [
          {
            id: `elgb_filters`,
            prefix: `Filters: `,
            title: `Enter only lowercase letters with no spaces and separate filters with '|'.\n\nFor example, if you want to filter out 'Good luck! No need to thank, unless you're the winner.', use the filter 'goodlucknoneedtothankunlessyourethewinner'.\n\nIf you're familiar with regular expressions, you can also use them. For example, to include a variation of the description above that uses 'you are' instead of 'you're' you could use the filter 'goodlucknoneedtothankunlessyoua?rethewinner'. 'a?' will match or not an 'a' between 'you' and 're'.\n\nThe '.' filter, for example, filters out any descriptions that only have one letter.`
          }
        ],
        name: `Filter out useless descriptions.`,
        sg: true
      },
      elgb_p: {
        description: `
          <ul>
            <li>Only shows the button in popups ([id=gb], [id=ged], [id=ge], etc...), so basically only for any giveaways that are loaded dynamically by ESGST.</li>
          </ul>
        `,
        name: `Only enable for popups.`,
        sg: true
      },
      elgb_r: {
        features: {
          elgb_r_d: {
            name: `Only pop up if the giveaway has a description.`,
            sg: true
          }
        },
        name: `Pop up a box to reply to the giveaway when entering it.`,
        sg: true
      },
      elgb_d: {
        name: `Pop up the giveaway description when entering it, if it has any.`,
        sg: true
      }
    },
    id: `elgb`,
    load: elgb,
    name: `Enter/Leave Giveaway Button`,
    sg: true,
    type: `giveaways`
  });

  function elgb() {
    esgst.giveawayFeatures.push(elgb_addButtons);
  }

  async function elgb_addButtons(giveaways, main, source) {
    giveaways.forEach(giveaway => {
      if (giveaway.sgTools || (main && (esgst.elgb_p || esgst.createdPath || esgst.wonPath))) return;
      if (giveaway.innerWrap.getElementsByClassName(`esgst-elgb-button`)[0]) {
        return;
      }
      if (esgst.enteredPath && main) {
        elgb_setEntryButton(giveaway);
        return;
      }
      if (giveaway.blacklist || (giveaway.inviteOnly && !giveaway.url) || !giveaway.started || giveaway.ended || giveaway.created || giveaway.level > esgst.level || (giveaway.id && (esgst.games[giveaway.type][giveaway.id] && (esgst.games[giveaway.type][giveaway.id].owned || esgst.games[giveaway.type][giveaway.id].won || (esgst.games[giveaway.type][giveaway.id].hidden && esgst.hgebd))))) {
        return;
      }
      if (esgst.giveawayPath && main) {
        let sidebarButton = document.getElementsByClassName(`sidebar__error is-disabled`)[0];
        if (!sidebarButton || sidebarButton.textContent.trim() !== `Not Enough Points`) {
          return;
        }
        giveaway.elgbPanel = createElements(sidebarButton.parentElement, `afterBegin`, [{
          type: `div`
        }]);
        sidebarButton.remove();
        elgb_addButton(giveaway, main, source);
      } else {
        elgb_addButton(giveaway, main, source);
      }
    });
  }

  function elgb_setEntryButton(giveaway) {
    let button = giveaway.outerWrap.getElementsByClassName(`table__remove-default`)[0];
    if (!button) return;
    let form = button.parentElement;
    let errorButton = createElements(form.parentElement, `beforeEnd`, [{
      attributes: {
        class: `esgst-clickable esgst-hidden`,
        title: getFeatureTooltip(`elgb`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-plus-circle esgst-green`
        },
        type: `i`
      }, {
        attributes: {
          class: `table__column__secondary-link`
        },
        text: `Add`,
        type: `span`
      }]
    }, {
      attributes: {
        class: `esgst-clickable`,
        title: getFeatureTooltip(`elgb`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-times-circle esgst-red`
        },
        type: `i`
      }, {
        attributes: {
          class: `table__column__secondary-link`
        },
        text: `Remove`,
        type: `span`
      }]
    }, {
      attributes: {
        class: `esgst-hidden`,
        title: getFeatureTooltip(`elgb`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-refresh fa-spin`
        },
        type: `i`
      }, {
        text: `Adding...`,
        type: `span`
      }]
    }, {
      attributes: {
        class: `esgst-hidden`,
        title: getFeatureTooltip(`elgb`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-refresh fa-spin`
        },
        type: `i`
      }, {
        text: `Removing...`,
        type: `span`
      }]
    }, {
      attributes: {
        class: `esgst-hidden`,
        title: getFeatureTooltip(`elgb`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-exclamation esgst-red`
        },
        type: `i`
      }, {
        text: `Error`,
        type: `span`
      }]
    }]);
    let removingButton = errorButton.previousElementSibling;
    let addingButton = removingButton.previousElementSibling;
    let removeButton = addingButton.previousElementSibling;
    let addButton = removeButton.previousElementSibling;
    addButton.addEventListener(`click`, elgb_addEntry.bind(null, addButton, addingButton, errorButton, giveaway, removeButton));
    removeButton.addEventListener(`click`, elgb_removeEntry.bind(null, addButton, errorButton, giveaway, removeButton, removingButton));
    form.remove();
  }

  async function elgb_addEntry(addButton, addingButton, errorButton, giveaway, removeButton) {
    addButton.classList.add(`esgst-hidden`);
    addingButton.classList.remove(`esgst-hidden`);
    try {
      let responseJson = JSON.parse((await request({data: `xsrf_token=${esgst.xsrfToken}&do=entry_insert&code=${giveaway.code}`, method: `POST`, url: `/ajax.php`})).responseText);
      if (responseJson.type === `success`) {
        removeButton.classList.remove(`esgst-hidden`);
      } else {
        errorButton.classList.remove(`esgst-hidden`);
      }
      esgst.pointsContainer.textContent = responseJson.points;
      hr_refreshHeaderElements(document);
    } catch (e) {
      errorButton.classList.remove(`esgst-hidden`);
    }
    addingButton.classList.add(`esgst-hidden`);
    if (esgst.et) {
      et_setEntry(giveaway.code, true, giveaway.name);
    }
  }

  async function elgb_removeEntry(addButton, errorButton, giveaway, removeButton, removingButton) {
    removeButton.classList.add(`esgst-hidden`);
    removingButton.classList.remove(`esgst-hidden`);
    try {
      let responseJson = JSON.parse((await request({data: `xsrf_token=${esgst.xsrfToken}&do=entry_delete&code=${giveaway.code}`, method: `POST`, url: `/ajax.php`})).responseText);
      if (responseJson.type === `success`) {
        addButton.classList.remove(`esgst-hidden`);
      } else {
        errorButton.classList.remove(`esgst-hidden`);
      }
      esgst.pointsContainer.textContent = responseJson.points;
      hr_refreshHeaderElements(document);
    } catch (e) {
      errorButton.classList.remove(`esgst-hidden`);
    }
    removingButton.classList.add(`esgst-hidden`);
    if (esgst.et) {
      et_setEntry(giveaway.code, false, giveaway.name);
    }
  }

  function elgb_addButton(giveaway, main, source) {
    let doAppend = !giveaway.elgbButton;
    if (giveaway.entered) {
      giveaway.elgbButton = new ButtonSet_v2({color1: `yellow`, color2: `grey`, icon1: `fa-minus-circle`, icon2: `fa-circle-o-notch fa-spin`, title1: `Leave`, title2: `Leaving...`, callback1: elgb_leaveGiveaway.bind(null, giveaway, main, source), set: giveaway.elgbButton}).set;
      giveaway.elgbButton.removeAttribute(`title`);
    } else if (giveaway.error) {
      giveaway.elgbButton = new ButtonSet_v2({color1: `red`, color2: `grey`, icon1: `fa-plus-circle`, icon2: `fa-circle-o-notch fa-spin`, title1: `Enter`, title2: `Entering...`, callback1: elgb_enterGiveaway.bind(null, giveaway, main, null, source), set: giveaway.elgbButton}).set;
      giveaway.elgbButton.setAttribute(`title`, giveaway.error);
    } else {
      if (giveaway.points <= esgst.points) {
        giveaway.elgbButton = new ButtonSet_v2({color1: `green`, color2: `grey`, icon1: `fa-plus-circle`, icon2: `fa-circle-o-notch fa-spin`, title1: `Enter`, title2: `Entering...`, callback1: elgb_enterGiveaway.bind(null, giveaway, main, null, source), set: giveaway.elgbButton}).set;
        giveaway.elgbButton.removeAttribute(`title`);
      } else {
        giveaway.elgbButton = new ButtonSet_v2({color1: `red`, color2: `grey`, icon1: `fa-plus-circle`, icon2: `fa-circle-o-notch fa-spin`, title1: `Enter`, title2: `Entering...`, callback1: elgb_enterGiveaway.bind(null, giveaway, main, null, source), set: giveaway.elgbButton}).set;
        giveaway.elgbButton.setAttribute(`title`, `Not Enough Points`);
      }
    }
    if (doAppend) {
      giveaway.elgbButton.classList.add(`esgst-elgb-button`);
      if (esgst.gv && ((main && esgst.giveawaysPath) || (source === `gb` && esgst.gv_gb) || (source === `ged` && esgst.gv_ged) || (source === `ge` && esgst.gv_ge))) {
        giveaway.elgbPanel.insertBefore(giveaway.elgbButton, giveaway.elgbPanel.firstElementChild);
      } else {
        giveaway.elgbPanel.appendChild(giveaway.elgbButton);
      }
      giveaway.elgbButton.setAttribute(`data-columnId`, `elgb`);
      if (!esgst.lockGiveawayColumns && (!main || esgst.giveawaysPath || esgst.userPath || esgst.groupPath)) {
        giveaway.elgbButton.setAttribute(`draggable`, true);
        giveaway.elgbButton.addEventListener(`dragstart`, giveaways_setSource.bind(null, giveaway));
        giveaway.elgbButton.addEventListener(`dragenter`, giveaways_getSource.bind(null, giveaway, false));
        giveaway.elgbButton.addEventListener(`dragend`, giveaways_saveSource.bind(null, giveaway));
      }
    }
  }

  async function elgb_openPopup(giveaway, main, source, mainCallback) {
    let popup = new Popup(`fa-file-text-o`, [{
      attributes: {
        href: giveaway.url
      },
      type: `a`,
      children: [{
        text: giveaway.name,
        type: `span`
      }]
    }, {
      text: ` by `,
      type: `node`
    }, {
      attributes: {
        href: `/user/${giveaway.creator}`
      }, text: giveaway.creator,
      type: `a`
    }], true);
    if (giveaway.entered) {
      let set = new ButtonSet(`yellow`, `grey`, `fa-minus-circle`, `fa-circle-o-notch fa-spin`, `Leave Giveaway`, `Leaving...`, callback => {
        elgb_leaveGiveaway(giveaway, main, source, () => {
          callback();
          popup.close();
        });
      });
      popup.description.appendChild(set.set);
    } else {
      let games = JSON.parse(await getValue(`games`));
      if (giveaway.started && !giveaway.ended && !giveaway.created && giveaway.level <= esgst.level && ((giveaway.id && ((games[giveaway.type][giveaway.id] && !games[giveaway.type][giveaway.id].owned && (!games[giveaway.type][giveaway.id].hidden || !esgst.hgebd)) || !games[giveaway.type][giveaway.id])) || !giveaway.id)) {
        let set = new ButtonSet(`green`, `grey`, `fa-plus-circle`, `fa-circle-o-notch fa-spin`, `Enter Giveaway`, `Entering...`, callback => {
          elgb_enterGiveaway(giveaway, main, true, source, () => {
            callback();
            popup.close();
          });
        });
        popup.description.appendChild(set.set);
      }
    }
    let description = null;
    if (esgst.elgb_d || (esgst.elgb_r && esgst.elgb_r_d) || mainCallback) {
      const responseHtml = parseHtml((await request({method: `GET`, url: giveaway.url})).responseText);
      if (mainCallback && !responseHtml.getElementsByClassName(`featured__outer-wrap--giveaway`)[0]) {
        mainCallback(true);
        return;
      }
      description = responseHtml.getElementsByClassName(`page__description`)[0];
    }
    if (description && description.textContent.trim() && !mainCallback) {
      if (esgst.elgb_c) {
        if (Date.now() - esgst.elgbCache.timestamp > 3600000) {
          esgst.elgbCache = {
            descriptions: {},
            timestamp: Date.now()
          };
          setLocalValue(`elgbCache`, JSON.stringify(esgst.elgbCache));
        }
        if (!esgst.elgbCache.descriptions[giveaway.creator]) {
          esgst.elgbCache.descriptions[giveaway.creator] = [];
        }
        let html = description.innerHTML;
        let i;
        for (i = esgst.elgbCache.descriptions[giveaway.creator].length - 1; i > -1 && esgst.elgbCache.descriptions[giveaway.creator][i] !== html; --i);
        if (i > -1) {
          description = null;
        } else {
          esgst.elgbCache.descriptions[giveaway.creator].push(html);
          setLocalValue(`elgbCache`, JSON.stringify(esgst.elgbCache));
          if (esgst.elgb_f) {
            let text = description.textContent.replace(/[^a-zA-Z]/g, ``).toLowerCase();
            if (text.match(new RegExp(`^(${esgst.elgb_filters})$`))) {
              description = null;
            }
          }
        }
      } else if (esgst.elgb_f) {
        let text = description.textContent.replace(/[^a-zA-Z]/g, ``).toLowerCase();
        if (text.match(new RegExp(`^(${esgst.elgb_filters})$`))) {
          description = null;
        }
      }
    }
    if (description) {
      description.classList.add(`esgst-text-left`);
      createElements(popup.scrollable, `beforeEnd`, [{
        context: description
      }]);
    }
    let box = null;
    if ((esgst.elgb_r && (!esgst.elgb_r_d || description)) || mainCallback) {
      box = createElements(popup.scrollable, `beforeEnd`, [{
        type: `textarea`
      }]);
      if (esgst.cfh) {
        cfh_addPanel(box);
      }
      popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-arrow-circle-right`, `fa-circle-o-notch fa-spin`, `Add Comment`, `Saving...`, async callback => {
        if (box.value) {
          await request({data: `xsrf_token=${esgst.xsrfToken}&do=comment_new&description=${box.value}`, method: `POST`, url: giveaway.url});
        }
        callback();
        popup.close();
      }).set);
    }
    if (description && esgst.elgb_f) {
      let set = new ButtonSet(`grey`, `grey`, `fa-eye`, `fa-circle-o-notch fa-spin`, `Add Description To Filters`, `Filtering...`, async callback => {
        esgst.elgb_filters = `${esgst.elgb_filters}|${description.textContent.replace(/[^a-zA-Z]/g, ``).toLowerCase()}`;
        await setSetting(`elgb_filters`, esgst.elgb_filters);
        callback();
        set.remove();
      }).set;
      popup.description.appendChild(set);
    }
    if ((esgst.elgb_d && description) || (esgst.elgb_r && (!esgst.elgb_r_d || description)) || mainCallback) {
      if (mainCallback) {
        popup.onClose = mainCallback;
      }
      popup.open(() => {
        if (box) {
          box.focus();
        }
      });
    }
  }

  async function elgb_enterGiveaway(giveaway, main, popup, source, callback) {
    const responseText = (await request({data: `xsrf_token=${esgst.xsrfToken}&do=entry_insert&code=${giveaway.code}`, method: `POST`, url: `/ajax.php`})).responseText;
    let responseJson = null;
    try {
      responseJson = JSON.parse(responseText);
    } catch (e) {
      console.log(e);
      console.log(giveaway.code);
      console.log(responseJson);
    }
    if (!responseJson) {
      return;
    }
    if (responseJson.type === `success`) {
      if (!esgst.giveawayPath || !main) {
        giveaway.innerWrap.classList.add(`is-faded`);
      }
      giveaway.entered = true;
      giveaway.error = null;
      elgb_addButton(giveaway, main, source);
      if (esgst.et) {
        et_setEntry(giveaway.code, true, giveaway.name);
      }
      esgst.pointsContainer.textContent = responseJson.points;
      await hr_refreshHeaderElements(document);
      if (esgst.hr) {
        setLocalValue(`hrCache`, JSON.stringify(hr_getCache()));
      }
      elgb_updateButtons();
      if (esgst.egh) {
        egh_saveGame(giveaway.id, giveaway.type);
      }
      if (esgst.gb && esgst.gb_ue && giveaway.gbButton) {
        if (giveaway.gbButton.index === 3) {
          giveaway.gbButton.change(giveaway.gbButton.callbacks[2]);
        }
        if (!esgst.gb_se) {
          giveaway.gbButton.button.classList.add(`esgst-hidden`);
        }
      }
      if (esgst.gf && esgst.gf.filteredCount && esgst[`gf_enable${esgst.gf.type}`]) {
        filters_filter(esgst.gf);
      }
      if (esgst.gfPopup && esgst.gfPopup.filteredCount && esgst[`gf_enable${esgst.gfPopup.type}`]) {
        filters_filter(esgst.gfPopup);
      }
      if (callback) {
        callback();
      }
      if (!popup && (!esgst.giveawayPath || !main)) {
        elgb_openPopup(giveaway, main, source);
      }
    } else {
      giveaway.entered = false;
      giveaway.error = responseJson.msg;
      elgb_addButton(giveaway, main, source);
      if (callback) {
        callback();
      }
    }
  }

  async function elgb_leaveGiveaway(giveaway, main, source, callback) {
    const responseText = (await request({data: `xsrf_token=${esgst.xsrfToken}&do=entry_delete&code=${giveaway.code}`, method: `POST`, url: `/ajax.php`})).responseText;
    let responseJson = null;
    try {
      responseJson = JSON.parse(responseText);
    } catch (e) {
      console.log(e);
      console.log(giveaway.code);
      console.log(responseJson);
    }
    if (!responseJson) {
      return;
    }
    if (responseJson.type === `success`) {
      giveaway.innerWrap.classList.remove(`is-faded`);
      giveaway.entered = false;
      giveaway.error = false;
      elgb_addButton(giveaway, main, source);
      if (esgst.et) {
        et_setEntry(giveaway.code, false, giveaway.name);
      }
      esgst.pointsContainer.textContent = responseJson.points;
      await hr_refreshHeaderElements(document);
      if (esgst.hr) {
        setLocalValue(`hrCache`, JSON.stringify(hr_getCache()));
      }
      elgb_updateButtons();
      if (esgst.gb && giveaway.gbButton) {
        giveaway.gbButton.button.classList.remove(`esgst-hidden`);
      }
      if (esgst.gf && esgst.gf.filteredCount && esgst[`gf_enable${esgst.gf.type}`]) {
        filters_filter(esgst.gf);
      }
      if (esgst.gfPopup && esgst.gfPopup.filteredCount && esgst[`gf_enable${esgst.gfPopup.type}`]) {
        filters_filter(esgst.gfPopup);
      }
      if (callback) {
        callback();
      }
    } else if (callback) {
      callback();
    }
  }

  function elgb_updateButtons() {
    let giveaway, i, n;
    for (i = 0, n = esgst.mainGiveaways.length; i < n; ++i) {
      giveaway = esgst.mainGiveaways[i];
      if (giveaway.elgbButton && !giveaway.entered) {
        elgb_addButton(giveaway, true);
      }
    }
    if (esgst.ttec) {
      ttec_calculateTime(esgst.mainGiveaways, true);
    }
  }
  
