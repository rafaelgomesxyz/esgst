_MODULES.push({
    endless: true,
    id: `giveaways`,
    load: giveaways
  });
  
  function giveaways() {
    esgst.endlessFeatures.push(giveaways_load);
  }

  async function giveaways_load(context, main, source, endless) {
    if (context.getAttribute && context.getAttribute(`data-rfi`)) return;
    let giveaways = await giveaways_get(context, main, null, false, null, false, endless, source);
    if (!giveaways.length) return;
    if (main) {
      for (let i = giveaways.length - 1; i > -1; --i) {
        giveaways[i].sortIndex = esgst.mainGiveaways.length;
        esgst.mainGiveaways.push(giveaways[i]);
      }
    } else {
      for (let i = giveaways.length - 1; i > -1; --i) {
        giveaways[i].sortIndex = esgst.popupGiveaways.length;
        esgst.popupGiveaways.push(giveaways[i]);
      }
    }
    for (let feature of esgst.giveawayFeatures) {
      await feature(giveaways, main, source);
    }
    if (!main || esgst.giveawaysPath || esgst.userPath || esgst.groupPath) {
      giveaways.forEach(giveaway => giveaways_reorder(giveaway));
    }
    if (esgst.gas && esgst[esgst.gas.autoKey]) {
      sortContent(esgst[esgst.gas.mainKey], esgst.gas.mainKey, esgst[esgst.gas.optionKey]);
    }
    if (esgst.gf && esgst.gf.filteredCount && esgst[`gf_enable${esgst.gf.type}`]) {
      filters_filter(esgst.gf, false, endless);
    }
    if (esgst.gfPopup && esgst.gfPopup.filteredCount && esgst[`gf_enable${esgst.gfPopup.type}`]) {
      filters_filter(esgst.gfPopup);
    }
    if (esgst.mm_enableGiveaways && esgst.mm_enable) {
      esgst.mm_enable(esgst[main ? `mainGiveaways` : `popupGiveaways`], `Giveaways`);
    }
  }

  async function giveaways_get(context, main, mainUrl, hr, key, ged, endless, source) {
    let giveaway, giveaways, i, mainContext, matches, query;
    giveaways = [];
    if (!hr && main && (esgst.createdPath || esgst.enteredPath || esgst.wonPath || esgst.archivePath)) {
      query = `${endless ? `.esgst-es-page-${endless} .giveaway__row-outer-wrap, .esgst-es-page-${endless}.giveaway__row-outer-wrap` : `.giveaway__row-outer-wrap`}, ${endless ? `.esgst-es-page-${endless} .featured__outer-wrap--giveaway, .esgst-es-page-${endless}.featured__outer-wrap--giveaway` : `.featured__outer-wrap--giveaway`}, ${endless ? `.table:not(.table--summary) .esgst-es-page-${endless} .table__row-outer-wrap, .table:not(.table--summary) .esgst-es-page-${endless}.table__row-outer-wrap` : `.table:not(.table--summary) .table__row-outer-wrap`}`;
    } else {
      query = `${endless ? `.esgst-es-page-${endless} .giveaway__row-outer-wrap, .esgst-es-page-${endless}.giveaway__row-outer-wrap` : `.giveaway__row-outer-wrap`}, ${endless ? `.esgst-es-page-${endless} .featured__outer-wrap--giveaway, .esgst-es-page-${endless}.featured__outer-wrap--giveaway` : `.featured__outer-wrap--giveaway`}`;
    }
    if (key) {
      mainContext = context;
    } else {
      if (mainUrl) {
        mainContext = context;
        key = `data`;
      } else {
        mainContext = document;
        key = `giveaway`;
      }
    }
    matches = context.querySelectorAll(query);
    for (i = matches.length - 1; i > -1; --i) {
      giveaway = await giveaways_getInfo(matches[i], mainContext, null, null, main, mainUrl, ged, endless, source);
      if (giveaway) {
        giveaways.push(giveaway[key]);
      }
    }
    return giveaways;
  }

  async function giveaways_getInfo(context, mainContext, ugd, ugdType, main, mainUrl, ged, endless, source) {
    let chance, giveaway, i, info, key, keys, match, n, savedUser, uf, thinHeadings;
    giveaway = {
      creators: [],
      groups: []
    };
    giveaway.outerWrap = context;
    giveaway.gameId = giveaway.outerWrap.getAttribute(`data-game-id`);
    info = games_getInfo(giveaway.outerWrap);
    if (info) {
      giveaway.id = info.id;
      giveaway.type = info.type;
      if (esgst.games && esgst.games[giveaway.type][giveaway.id]) {
        keys = [`owned`, `wishlisted`, `hidden`, `ignored`, `previouslyEntered`, `previouslyWon`, `reducedCV`, `noCV`];
        for (i = 0, n = keys.length; i < n; ++i) {
          key = keys[i];
          if (esgst.games[giveaway.type][giveaway.id][key === `previouslyEntered` ? `entered` : (key === `previouslyWon` ? `won` : key)]) {
            giveaway[key] = true;
          }
        }
      }
    }
    if (giveaway.outerWrap.classList.contains(`table__row-outer-wrap`) && esgst.giveawayPath) {
      return;
    }
    giveaway.innerWrap = giveaway.outerWrap.querySelector(`.giveaway__row-inner-wrap, .featured__inner-wrap, .table__row-inner-wrap`);
    giveaway.avatar = giveaway.outerWrap.querySelector(`.giveaway_image_avatar, .featured_giveaway_image_avatar`);
    giveaway.image = giveaway.outerWrap.querySelector(`.giveaway_image_thumbnail, .giveaway_image_thumbnail_missing, .global__image-outer-wrap--game-medium`);
    giveaway.summary = giveaway.innerWrap.querySelector(`.giveaway__summary, .featured__summary, .table__column--width-fill`);
    if (source === `gb`) {
      giveaway.entered = giveaway.outerWrap.getAttribute(`data-entered`);
    } else if (esgst.giveawayPath && main) {
      let button = mainContext.getElementsByClassName(`sidebar__entry-delete`)[0];
      if (button) {
        giveaway.entered = !button.classList.contains(`is-hidden`);
      }
    } else if (esgst.enteredPath && main) {
      giveaway.entered = true;
    } else {
      giveaway.entered = giveaway.innerWrap.classList.contains(`is-faded`);
    }
    giveaway.headingName = giveaway.innerWrap.querySelector(`.giveaway__heading__name, .featured__heading__medium, .table__column__heading`);
    giveaway.name = giveaway.headingName.textContent;
    match = giveaway.name.match(/\s\((.+) Copies\)/);
    if (match) {
      giveaway.name = giveaway.name.replace(match[0], ``);
      giveaway.copies = parseInt(match[1].replace(/,/g, ``).match(/\d+/)[0]);
    } else {
      giveaway.copies = 1;
    }
    giveaway.url = esgst.giveawayPath && main && !ugd ? location.pathname : (mainUrl || giveaway.headingName.getAttribute(`href`));
    if (giveaway.url) {
      giveaway.url = giveaway.url.replace(/\/(entries|groups|region-restrictions|winners)$/, ``);
      match = giveaway.url.match(/\/giveaway\/(.+?)(\/.+?)$/);
      if (match) {
        giveaway.code = match[1];
      } else {
        match = giveaway.url.match(/\/giveaways\/(.+)/);
        if (match) {
          giveaway.code = match[1];
          giveaway.sgTools = true;
        } else {
          return;
        }
      }
    }
    giveaway.pinned = giveaway.outerWrap.closest(`.pinned-giveaways__outer-wrap`);
    thinHeadings = giveaway.innerWrap.querySelectorAll(`.giveaway__heading__thin:not(.dyegb_playtime):not(.dyegb_achievement), .featured__heading__small`);
    n = thinHeadings.length;
    giveaway.points = 0;
    if (n > 0) {
      if (n > 1) {
        giveaway.copies = parseInt(thinHeadings[0].textContent.replace(/,/g, ``).match(/\d+/)[0]);
        if (esgst.gch && !giveaway.pinned) {
          let color, bgColor;
          for (const colors of esgst.gch_colors) {
            if (giveaway.copies >= parseInt(colors.lower) && giveaway.copies <= parseInt(colors.upper)) {
              color = colors.color;
              bgColor = colors.bgColor;
              break;
            }
          }
          thinHeadings[0].classList.add(`esgst-bold`);
          if (color) {
            thinHeadings[0].style.color = color;
            if (bgColor) {
              thinHeadings[0].classList.add(`esgst-gch-highlight`);
              thinHeadings[0].style.backgroundColor = bgColor;
            }
          } else {
            thinHeadings[0].classList.add(`esgst-red`);
          }
        }
        giveaway.pointsContainer = thinHeadings[1];
        giveaway.points = parseInt(thinHeadings[1].textContent.match(/\d+/)[0]);
      } else {
        giveaway.copies = 1;
        giveaway.pointsContainer = thinHeadings[0];
        giveaway.points = parseInt(thinHeadings[0].textContent.match(/\d+/)[0]);
      }
    }
    giveaway.columns = giveaway.innerWrap.querySelector(`.giveaway__columns, .featured__columns`);
    if (giveaway.columns && (!esgst.archivePath || !main)) {
      giveaway.endTimeColumn = giveaway.columns.firstElementChild;
      if (giveaway.endTimeColumn.classList.contains(`esgst-ged-source`)) {
        giveaway.sourceColumn = giveaway.endTimeColumn;
        giveaway.endTimeColumn = giveaway.sourceColumn.nextElementSibling;
      }
      giveaway.startTimeColumn = giveaway.columns.querySelector(`.giveaway__column--width-fill.text-right, .featured__column--width-fill.text-right`);
      giveaway.started = !giveaway.endTimeColumn.textContent.match(/Begins/);
      giveaway.endTime = parseInt(giveaway.endTimeColumn.lastElementChild.getAttribute(`data-timestamp`)) * 1e3;
      giveaway.ended = Boolean(giveaway.deleted || giveaway.endTimeColumn.textContent.match(/Ended/));
      giveaway.startTime = parseInt(giveaway.startTimeColumn.firstElementChild.getAttribute(`data-timestamp`)) * 1e3;
      if (!main || !esgst.userPath || (ugd && ugdType === `won`) || ged) {
        giveaway.creatorContainer = giveaway.startTimeColumn.lastElementChild;
        giveaway.creator = giveaway.creatorContainer.textContent;
      }
    } else {
      giveaway.started = true;
    }
    if (main && esgst.archivePath) {
      giveaway.startTimeColumn = giveaway.innerWrap.querySelector(`[data-timestamp]`);
      if (giveaway.startTimeColumn) {
        giveaway.startTime = parseInt(giveaway.startTimeColumn.getAttribute(`data-timestamp`)) * 1e3;
        giveaway.creatorContainer = giveaway.startTimeColumn.nextElementSibling;
        giveaway.creator = giveaway.creatorContainer.textContent;
      } else {
        giveaway.startTime = 0;
      }
    }
    if (!giveaway.endTime && main && (esgst.createdPath || esgst.enteredPath || esgst.wonPath)) {
      giveaway.endTime = giveaway.innerWrap.querySelector(`[data-timestamp]`);
      if (giveaway.endTime) {
        giveaway.endTimeColumn = giveaway.endTime.parentElement;
        giveaway.started = !giveaway.endTimeColumn.textContent.match(/Begins/);
        giveaway.deleted = giveaway.endTimeColumn.parentElement.textContent.match(/Deleted/);
        giveaway.endTime = parseInt(giveaway.endTime.getAttribute(`data-timestamp`)) * 1e3;
        giveaway.ended = Boolean(giveaway.deleted || giveaway.endTimeColumn.parentElement.textContent.match(/Ended/));
      } else {
        giveaway.endTime = 0;
        giveaway.ended = true;
      }
    }
    if (ugd) {
      if (ugdType === `sent`) {
        giveaway.creator = ugd;
      }
    } else if (esgst.userPath && main && !ged) {
      giveaway.creator = location.pathname.match(/^\/user\/(.+?)(\/.*)?$/)[1];
    } else if (esgst.createdPath && main) {
      giveaway.creator = esgst.username;
    }
    if (giveaway.creator) {
      giveaway.creators.push(giveaway.creator.toLowerCase());
    }
    if (main) {
      if (esgst.createdPath) {
        let status = giveaway.outerWrap.querySelector(`.table__column--width-small.text-center:last-of-type`);
        if (status) {
          if (status.textContent.match(/Not\sReceived/)) {
            giveaway.notReceived = true;
          } else if (status.textContent.match(/Received/)) {
            giveaway.received = true;
          } else if (status.textContent.match(/Awaiting\sFeedback/)) {
            giveaway.awaitingFeedback = true;
          }
        }
      } else if (esgst.wonPath) {
        giveaway.received = false;
        giveaway.notReceived = false;
        const elements = giveaway.outerWrap.querySelectorAll(`.table__column--gift-feedback`);
        for (const element of elements) {
          const text = element.textContent.trim();
          if (text.match(/^Received$/) && element.querySelector(`.icon-green`)) {
            giveaway.received = true;
            break;
          }
          if (text.match(/^Not\sReceived$/) && element.querySelector(`.icon-red`)) {
            giveaway.notReceived = true;
            break;
          }
        }
        giveaway.awaitingFeedback = !giveaway.received && !giveaway.notReceived;
      }
    }
    giveaway.created = giveaway.creator === esgst.username;
    if (esgst.uf && esgst.giveawaysPath && main) {
      savedUser = await getUser(esgst.users, {
        username: giveaway.creator
      });
      if (savedUser) {
        uf = savedUser.uf;
        if (esgst.uf_g && savedUser.blacklisted && !uf) {
          uf_updateCount(giveaway.outerWrap.parentElement.nextElementSibling);
          giveaway.outerWrap.remove();
          return;
        } else if (uf && uf.giveaways) {
          uf_updateCount(giveaway.outerWrap.parentElement.nextElementSibling);
          giveaway.outerWrap.remove();
          return;
        }
      }
    }
    if (esgst.gf && esgst.gf_s && main) {
      let savedGiveaway = esgst.giveaways[giveaway.code];
      if ((esgst.giveawaysPath || esgst.groupPath) && savedGiveaway && savedGiveaway.hidden && savedGiveaway.code) {
        giveaway.outerWrap.remove();
        return;
      }
    }
    giveaway.links = giveaway.innerWrap.getElementsByClassName(`giveaway__links`)[0];
    if (giveaway.links) {
      giveaway.links.classList.add(`esgst-giveaway-links`);
      giveaway.entriesLink = giveaway.links.firstElementChild;
      giveaway.commentsLink = giveaway.entriesLink.nextElementSibling;
    } else {
      giveaway.entriesLink = mainContext.getElementsByClassName(`sidebar__navigation__item__count`)[1];
      giveaway.commentsLink = mainContext.getElementsByClassName(`sidebar__navigation__item__count`)[0];
    }
    if (giveaway.entriesLink && giveaway.commentsLink) {
      giveaway.entries = parseInt(giveaway.entriesLink.textContent.replace(/,/g, ``).match(/\d+/)[0]);
      giveaway.comments = parseInt(giveaway.commentsLink.textContent.replace(/,/g, ``).match(/\d+/)[0]);
    }
    giveaway.panel = giveaway.innerWrap.getElementsByClassName(`esgst-giveaway-panel`)[0];
    if (!giveaway.panel && (esgst.gwc || esgst.gwr || esgst.gptw || esgst.gp || esgst.elgb || esgst.cewgd)) {
      if (giveaway.links) {
        giveaway.panel = createElements(giveaway.links, `afterEnd`, [{
          attributes: {
            class: `giveaway__columns esgst-giveaway-panel`
          },
          type: `div`
        }, {
          attributes: {
            style: `clear: both;`
          },
          type: `div`
        }]);
      } else if (giveaway.columns) {
        if (esgst.archivePath) {
          giveaway.columns.style.justifyContent = `right`;
          giveaway.panel = createElements(giveaway.columns, `afterEnd`, [{
            attributes: {
              class: `giveaway__columns esgst-giveaway-panel`
            },
            type: `div`
          }]);
        } else {
          giveaway.panel = createElements(giveaway.columns, `afterEnd`, [{
            attributes: {
              class: `featured__columns esgst-giveaway-panel`
            },
            type: `div`
          }]);
        }
      } else if (esgst.enteredPath && (esgst.gwc || esgst.gwr || esgst.gptw)) {
        giveaway.panel = createElements(giveaway.innerWrap.firstElementChild.nextElementSibling, `afterEnd`, [{
          attributes: {
            class: `table__column--width-small text-center esgst-giveaway-panel`
          },
          type: `div`
        }]);
      }
    }
    if (giveaway.sgTools && !giveaway.summary.getElementsByClassName(`esgst-ge-sgt-button`)[0]) {
      const sgTools = createElements(giveaway.summary, `beforeEnd`, [{
        attributes: {
          class: `esgst-ge-sgt-button esgst-giveaway-column-button`,
          href: `https://www.sgtools.info/giveaways/${giveaway.code}`,
          target: `_blank`
        },
        type: `a`,
        children: [{
          attributes: {
            class: `form__submit-button`
          },
          text: `SGTools`,
          type: `div`
        }]
      }]);
      sgTools.setAttribute(`data-columnId`, `sgTools`);
      if (!esgst.lockGiveawayColumns && (!main || esgst.giveawaysPath || esgst.userPath || esgst.groupPath)) {
        sgTools.setAttribute(`draggable`, true);
        sgTools.addEventListener(`dragstart`, giveaways_setSource.bind(null, giveaway));
        sgTools.addEventListener(`dragenter`, giveaways_getSource.bind(null, giveaway, false));
        sgTools.addEventListener(`dragend`, giveaways_saveSource.bind(null, giveaway));
      }
    }
    giveaway.elgbPanel = giveaway.panel;
    if (!giveaway.entriesLink) {
      let ct = giveaway.panel || (esgst.gm_enable && esgst.createdPath ? giveaway.innerWrap.firstElementChild.nextElementSibling.nextElementSibling : giveaway.innerWrap.firstElementChild.nextElementSibling);
      if (ct.nextElementSibling) {
        giveaway.entries = parseInt(ct.nextElementSibling.textContent.replace(/,/g, ``));
      }
    }
    giveaway.levelColumn = giveaway.outerWrap.querySelector(`.giveaway__column--contributor-level, .featured__column--contributor-level`);
    giveaway.level = giveaway.levelColumn ? parseInt(giveaway.levelColumn.textContent.match(/\d+/)[0]) : 0;
    giveaway.inviteOnly = giveaway.outerWrap.querySelector(`.giveaway__column--invite-only, .featured__column--invite-only`);
    giveaway.regionRestricted = giveaway.outerWrap.querySelector(`.giveaway__column--region-restricted:not(.touhou_giveaway_points), .featured__column--region-restricted:not(.touhou_giveaway_points)`);
    giveaway.group = giveaway.outerWrap.querySelector(`.giveaway__column--group, .featured__column--group`);
    giveaway.whitelist = giveaway.outerWrap.querySelector(`.giveaway__column--whitelist, .featured__column--whitelist`);
    giveaway.public = !giveaway.sgTools && !giveaway.inviteOnly && !giveaway.regionRestricted && !giveaway.group && !giveaway.whitelist;
    giveaway.touhouBox = giveaway.outerWrap.querySelector(`.touhou_giveaway_points`);
    if (!main || !esgst.giveawayPath) {
      if (giveaway.inviteOnly) {
        createElements(giveaway.inviteOnly, `inner`, [{
          attributes: {
            class: `fa fa-lock`
          },
          type: `i`
        }]);
      }
      if (giveaway.group) {
        createElements(giveaway.group, `inner`, [{
          attributes: {
            class: `fa fa-user`
          },
          type: `i`
        }]);
      }
      if (giveaway.whitelist) {
        createElements(giveaway.whitelist, `inner`, [{
          attributes: {
            class: `fa fa-heart`
          },
          type: `i`
        }]);
      }
    }
    if (source === `ge`) {
      if (giveaway.outerWrap.getAttribute(`data-blacklist`)) {
        if (esgst.ge_b) {
          giveaway.outerWrap.classList.add(`esgst-ge-blacklist`);
          giveaway.summary.classList.add(`esgst-ge-blacklist`);
        }
      } else {
        if (giveaway.public && esgst.ge_p) {
          giveaway.outerWrap.classList.add(`esgst-ge-public`);
          giveaway.summary.classList.add(`esgst-ge-public`);
        }
        if ((giveaway.group || giveaway.whitelist) && esgst.ge_g) {
          giveaway.outerWrap.classList.add(`esgst-ge-group`);
          giveaway.summary.classList.add(`esgst-ge-group`);
        }
      }
    }
    chance = context.getElementsByClassName(`esgst-gwc`)[0];
    giveaway.chance = chance ? parseFloat(chance.getAttribute(`data-chance`)) : 0;
    giveaway.projectedChance = chance ? parseFloat(chance.getAttribute(`data-projectedChance`)) : 0;
    giveaway.chancePerPoint = Math.round(giveaway.chance / Math.max(1, giveaway.points) * 100) / 100;
    giveaway.projectedChancePerPoint = Math.round(giveaway.projectedChance / Math.max(1, giveaway.points) * 100) / 100;
    giveaway.blacklist = giveaway.outerWrap.getAttribute(`data-blacklist`);
    giveaway.error = giveaway.outerWrap.getAttribute(`data-error`);
    const ratio = context.getElementsByClassName(`esgst-gwr`)[0];
    giveaway.ratio = ratio ? parseFloat(ratio.getAttribute(`data-ratio`)) : 0;
    giveaway.projectedRatio = ratio ? parseFloat(ratio.getAttribute(`data-projectedRatio`)) : 0;
    const pointsToWin = context.getElementsByClassName(`esgst-gptw`)[0];
    giveaway.pointsToWin = pointsToWin ? parseFloat(pointsToWin.getAttribute(`data-pointsToWin`)) : 0;
    giveaway.enterable = giveaway.outerWrap.getAttribute(`data-enterable`);
    if (main) {
      if (esgst.gr && giveaway.creator === esgst.username && (esgst.gr_a || (giveaway.ended && (giveaway.entries === 0 || giveaway.entries < giveaway.copies))) && (!esgst.gr_r || !esgst.giveaways[giveaway.code] || !esgst.giveaways[giveaway.code].recreated) && !giveaway.headingName.parentElement.getElementsByClassName(`esgst-gr-button`)[0]) {
        let button = createElements(giveaway.headingName, `beforeBegin`, [{
          attributes: {
            class: `esgst-gr-button`,
            title: `${getFeatureTooltip(`gr`, `Recreate giveaway`)}`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-rotate-left`
            },
            type: `i`
          }]
        }]);
        button.firstElementChild.addEventListener(`click`, gr_recreateGiveaway.bind(null, button, giveaway));
      }
    }
    let hideButton = giveaway.innerWrap.querySelector(`.giveaway__hide, .featured__giveaway__hide`);
    if (hideButton && !hideButton.classList.contains(`fa-eye`)) {
      if (!main || endless) {
        if (hideButton.classList.contains(`featured__giveaway__hide`)) {
          hideButton = hideButton.parentElement;
        }
        let temp = hideButton.previousElementSibling;
        createElements(hideButton, `outer`, [{
          attributes: {
            class: `fa fa-eye-slash giveaway__hide giveaway__icon`,
            title: getFeatureTooltip(null, `Hide all giveaways for this game`)
          },
          type: `i`
        }])
        hideButton = temp.nextElementSibling;
        hideButton.addEventListener(`click`, hideGame.bind(null, hideButton, giveaway.gameId, giveaway.name, giveaway.id, giveaway.type));
      } else if (esgst.updateHiddenGames) {
        hideButton.addEventListener(`click`, () => {
          esgst.hidingGame = {
            id: giveaway.id,
            type: giveaway.type
          };
        });
      }
    }
    giveaway.winnerColumns = {};
    if (giveaway.startTimeColumn && giveaway.endTimeColumn) {
      let column = giveaway.endTimeColumn.nextElementSibling;
      while (column && column !== giveaway.startTimeColumn) {
        let key = ``;
        let status = ``;
        if (column.classList.contains(`giveaway__column--positive`)) {
          [key, status] = [`received`, `Received`];
        } else if (column.classList.contains(`giveaway__column--negative`)) {
          [key, status] = [`notReceived`, `Not Received`];
        } else if (column.textContent.trim().match(/Awaiting\sfeedback/)) {
          [key, status] = [`awaitingFeedback`, `Awaiting Feedback`];
        } else if (column.textContent.trim().match(/No\swinners/)) {
          [key, status] = [`noWinners`, ``];
        } else {
          continue;
        }
        const winners = column.textContent.trim().split(/,\s/).filter(x => x);
        giveaway.winnerColumns[key] = { column, status, winners };
        column.setAttribute(`data-columnId`, `winners`);
        column = column.nextElementSibling;
      }
    }
    giveaway.winners = giveaway.winnerColumns.noWinners ? 0 : Math.min(giveaway.entries || 0, giveaway.copies);
    if (!main || esgst.giveawaysPath || esgst.userPath || esgst.groupPath) {
      if (giveaway.endTimeColumn) {
        giveaway.endTimeColumn.setAttribute(`data-columnId`, `endTime`);
      }
      if (giveaway.startTimeColumn) {
        giveaway.startTimeColumn.setAttribute(`data-columnId`, `startTime`);
      }
      if (giveaway.inviteOnly) {
        giveaway.inviteOnly.setAttribute(`data-columnId`, `inviteOnly`);
      }
      if (giveaway.whitelist) {
        giveaway.whitelist.setAttribute(`data-columnId`, `whitelist`);
      }
      if (giveaway.group) {
        giveaway.group.setAttribute(`data-columnId`, `group`);
      }
      if (giveaway.regionRestricted) {
        giveaway.regionRestricted.setAttribute(`data-columnId`, `regionRestricted`);
      }
      if (giveaway.levelColumn) {
        giveaway.levelColumn.setAttribute(`data-columnId`, `level`);
      }
      if (giveaway.sourceColumn) {
        giveaway.sourceColumn.setAttribute(`data-columnId`, `ged`);
      }
      if (giveaway.touhouBox) {
        giveaway.touhouBox.setAttribute(`data-columnId`, `touhou`);
      }
      if (!esgst.lockGiveawayColumns) {
        if (giveaway.columns) {
          for (let i = giveaway.columns.children.length - 1; i > -1; i--) {
            let item = giveaway.columns.children[i];
            item.setAttribute(`draggable`, true);
            item.addEventListener(`dragstart`, giveaways_setSource.bind(null, giveaway));
            item.addEventListener(`dragenter`, giveaways_getSource.bind(null, giveaway, false));
            item.addEventListener(`dragend`, giveaways_saveSource.bind(null, giveaway));
          }
        }
        if (giveaway.columns) {
          giveaway.columns.addEventListener(`dragenter`, giveaways_getSource.bind(null, giveaway, false));
        }
        if (giveaway.panel) {
          giveaway.panel.addEventListener(`dragenter`, giveaways_getSource.bind(null, giveaway, true));
        }
      }
    }
    return {
      giveaway: giveaway,
      data: {
        gameId: giveaway.gameId,
        gameSteamId: giveaway.id,
        gameType: giveaway.type,
        gameName: giveaway.name,
        code: giveaway.code,
        copies: giveaway.copies,
        points: giveaway.points,
        ended: giveaway.ended,
        endTime: giveaway.endTime,
        startTime: giveaway.startTime,
        started: giveaway.started,
        creator: giveaway.creator,
        winners: giveaway.winners,
        entries: giveaway.entries,
        comments: giveaway.comments,
        level: giveaway.level,
        public: giveaway.public,
        inviteOnly: giveaway.inviteOnly || giveaway.sgTools ? true : false,
        regionRestricted: giveaway.regionRestricted ? true : false,
        group: giveaway.group ? true : false,
        whitelist: giveaway.whitelist ? true : false
      }
    };
  }

  function giveaways_reorder(giveaway) {
    if (giveaway.columns) {
      (giveaway.gvIcons ? esgst.giveawayColumns_gv : esgst.giveawayColumns).forEach(id => {
        const elements = giveaway.outerWrap.querySelectorAll(`[data-columnId="${id}"]`);
        for (const element of elements) {
          (giveaway.gvIcons || giveaway.columns).appendChild(element);
          if (id.match(/^elgb|gp|ttec$/)) {
            element.classList.add(`esgst-giveaway-column-button`);
          }
        }
      });
    }
    if (giveaway.panel) {
      (giveaway.gvIcons ? esgst.giveawayPanel_gv : esgst.giveawayPanel).forEach(id => {
        const elements = giveaway.outerWrap.querySelectorAll(`[data-columnId="${id}"]`);
        for (const element of elements) {
          giveaway.panel.appendChild(element);
          if (id.match(/^elgb|gp|ttec$/)) {
            element.classList.remove(`esgst-giveaway-column-button`);
          }
        }
      });
    }
  }

  function giveaways_setSource(giveaway, event) {
    event.dataTransfer.setData(`text/plain`, ``);
    giveaway.sourceItem = event.currentTarget;
    giveaway.newSourceItem = null;
    giveaway.newSourcePos = 0;
    giveaway.columnSource = false;
    giveaway.panelSource = false;
    setTimeout(() => {
      if (giveaway.gvIcons && giveaway.gvIcons.children.length < 1) {
        giveaway.gvIcons.style.height = `25px`;
        giveaway.gvIcons.style.width = `100%`;
      } else if (giveaway.columns && giveaway.columns.children.length < 1) {
        giveaway.columns.style.height = `25px`;
        giveaway.columns.style.width = `100%`;
      }
      if (giveaway.panel && giveaway.panel.children.length < 1) {
        giveaway.panel.style.height = `25px`;
        giveaway.panel.style.width = `100%`;
      }
    }, 0);
  }

  function giveaways_getSource(giveaway, panel, event) {
    if (!giveaway.sourceItem) return;
    if (panel) {
      if (giveaway.panel.children.length < 1) {
        giveaway.panel.appendChild(giveaway.sourceItem);
        if (giveaway.sourceItem.getAttribute(`data-columnId`).match(/^elgb|gp|ttec$/)) {
          giveaway.sourceItem.classList.remove(`esgst-giveaway-column-button`);
        }
        giveaway.panelSource = true;
      }
      return;
    }
    let item = event.currentTarget;
    if (item === giveaway.sourceItem) return;
    if (item.getAttribute(`data-columnId`) === giveaway.sourceItem.getAttribute(`data-columnId`)) return;
    if (item === giveaway.gvIcons) {
      if (giveaway.gvIcons.children.length < 1) {
        giveaway.gvIcons.appendChild(giveaway.sourceItem);
        if (giveaway.sourceItem.getAttribute(`data-columnId`).match(/^elgb|gp|ttec$/)) {
          giveaway.sourceItem.classList.add(`esgst-giveaway-column-button`);
        }
        giveaway.columnSource = true;
      }
      return;
    }
    if (item === giveaway.columns) {
      if (giveaway.columns.children.length < 1) {
        giveaway.columns.appendChild(giveaway.columns);
        if (giveaway.sourceItem.getAttribute(`data-columnId`).match(/^elgb|gp|ttec$/)) {
          giveaway.sourceItem.classList.add(`esgst-giveaway-column-button`);
        }
        giveaway.columnSource = true;
      }
      return;
    }
    let current = giveaway.sourceItem;
    do {
      current = current.previousElementSibling;
      if (current && current === item) {
        item.parentElement.insertBefore(giveaway.sourceItem, item);
        if (item.getAttribute(`data-columnId`).match(/^elgb|gp|ttec$/)) {
          if (item.parentElement === giveaway.columns || item.parentElement === giveaway.gvIcons) {
            item.classList.add(`esgst-giveaway-column-button`);
          } else {
            item.classList.remove(`esgst-giveaway-column-button`);
          }
        }
        giveaway.newSourceItem = item;
        giveaway.newSourcePos = 0;
        return;
      }
    } while (current);
    item.parentElement.insertBefore(giveaway.sourceItem, item.nextElementSibling);
    if (item.getAttribute(`data-columnId`).match(/^elgb|gp|ttec$/)) {
      if (item.parentElement === giveaway.columns || item.parentElement === giveaway.gvIcons) {
        item.classList.add(`esgst-giveaway-column-button`);
      } else {
        item.classList.remove(`esgst-giveaway-column-button`);
      }
    }
    giveaway.newSourceItem = item;
    giveaway.newSourcePos = 1;
  }

  async function giveaways_saveSource(giveaway) {
    let [columnKey, panelKey] = giveaway.gvIcons ? [`giveawayColumns_gv`, `giveawayPanel_gv`] : [`giveawayColumns`, `giveawayPanel`];
    if (giveaway.panelSource) {
      let index = esgst[columnKey].indexOf(giveaway.sourceItem.getAttribute(`data-columnId`));
      if (index > -1) {
        esgst[columnKey].splice(index, 1);
      }
      esgst[panelKey].push(giveaway.sourceItem.getAttribute(`data-columnId`));
    } else if (giveaway.columnSource) {
      let index = esgst[panelKey].indexOf(giveaway.sourceItem.getAttribute(`data-columnId`));
      if (index > -1) {
        esgst[panelKey].splice(index, 1);
      }
      esgst[columnKey].push(giveaway.sourceItem.getAttribute(`data-columnId`));
    } else if (giveaway.newSourceItem) {
      let columnsIndex = esgst[columnKey].indexOf(giveaway.sourceItem.getAttribute(`data-columnId`));
      let panelIndex = esgst[panelKey].indexOf(giveaway.sourceItem.getAttribute(`data-columnId`));
      if (giveaway.newSourceItem.parentElement === giveaway.columns || giveaway.newSourceItem.parentElement === giveaway.gvIcons) {
        if (columnsIndex > -1) {
          let id = esgst[columnKey].splice(columnsIndex, 1)[0];
          esgst[columnKey].splice(esgst[columnKey].indexOf(giveaway.newSourceItem.getAttribute(`data-columnId`)) + giveaway.newSourcePos, 0, id);
        } else {
          let id = esgst[panelKey].splice(panelIndex, 1)[0];
          esgst[columnKey].splice(esgst[columnKey].indexOf(giveaway.newSourceItem.getAttribute(`data-columnId`)) + giveaway.newSourcePos, 0, id);
        }
      } else {
        if (columnsIndex > -1) {
          let id = esgst[columnKey].splice(columnsIndex, 1)[0];
          esgst[panelKey].splice(esgst[panelKey].indexOf(giveaway.newSourceItem.getAttribute(`data-columnId`)) + giveaway.newSourcePos, 0, id);
        } else {
          let id = esgst[panelKey].splice(panelIndex, 1)[0];
          esgst[panelKey].splice(esgst[panelKey].indexOf(giveaway.newSourceItem.getAttribute(`data-columnId`)) + giveaway.newSourcePos, 0, id);
        }
      }
    }
    giveaway.sourceItem = null;
    giveaway.newSourceItem = null;
    giveaway.newSourcePos = 0;
    giveaway.columnSource = false;
    giveaway.panelSource = false;
    if (giveaway.gvIcons) {
      giveaway.gvIcons.style.height = ``;
      giveaway.gvIcons.style.width = ``;
    }
    if (giveaway.columns) {
      giveaway.columns.style.height = ``;
      giveaway.columns.style.width = ``;
    }
    if (giveaway.panel) {
      giveaway.panel.style.height = ``;
      giveaway.panel.style.width = ``;
    }
    await setSetting(columnKey, esgst[columnKey]);
    await setSetting(panelKey, esgst[panelKey]);
  }

