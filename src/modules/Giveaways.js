import Module from '../class/Module';
import {common} from './Common';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  getUser = common.getUser.bind(common),
  hideGame = common.hideGame.bind(common),
  sortContent = common.sortContent.bind(common)
;

class Giveaways extends Module {
  constructor() {
    super();
    this.info = {
      endless: true,
      id: `giveaways`,
      featureMap: {
        endless: `giveaways_load`
      }
    };
  }

  async giveaways_load(context, main, source, endless) {
    if (context.getAttribute && context.getAttribute(`data-rfi`)) return;
    let giveaways = await this.giveaways_get(context, main, null, false, null, false, endless, source);
    if (!giveaways.length) return;
    for (let i = giveaways.length - 1; i > -1; --i) {
      giveaways[i].sortIndex = this.esgst.currentScope.giveaways.length;
      this.esgst.currentScope.giveaways.push(giveaways[i]);
    }
    for (let feature of this.esgst.giveawayFeatures) {
      await feature(giveaways, main, source);
    }
    giveaways.forEach(giveaway => this.giveaways_reorder(giveaway));
    if (this.esgst.gas && this.esgst[this.esgst.gas.autoKey]) {
      sortContent(this.esgst.currentScope.giveaways, this.esgst[this.esgst.gas.optionKey]);
    }
    if (this.esgst.gf && this.esgst.gf.filteredCount && this.esgst[`gf_enable${this.esgst.gf.type}`]) {
      this.esgst.modules.filters.filters_filter(this.esgst.gf, false, endless);
    }
    if (this.esgst.gfPopup && this.esgst.gfPopup.filteredCount && this.esgst[`gf_enable${this.esgst.gfPopup.type}`]) {
      this.esgst.modules.filters.filters_filter(this.esgst.gfPopup);
    }
    if (this.esgst.mm_enableGiveaways && this.esgst.mm_enable) {
      this.esgst.mm_enable(this.esgst.currentScope.giveaways, `Giveaways`);
    }
  }

  async giveaways_get(context, main, mainUrl, hr, key, ged, endless, source) {
    let giveaway, giveaways, i, mainContext, matches, query;
    giveaways = [];
    if (!hr && main && (this.esgst.createdPath || this.esgst.enteredPath || this.esgst.wonPath || this.esgst.archivePath)) {
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
      giveaway = await this.giveaways_getInfo(matches[i], mainContext, null, null, main, mainUrl, ged, endless, source);
      if (giveaway) {
        giveaways.push(giveaway[key]);
      }
    }
    return giveaways;
  }

  async giveaways_getInfo(context, mainContext, ugd, ugdType, main, mainUrl, ged, endless, source) {
    let chance, giveaway, i, info, key, keys, match, n, savedUser, uf, thinHeadings;
    giveaway = {
      creators: [],
      groups: [],
      winners: []
    };
    giveaway.outerWrap = context;
    giveaway.gameId = giveaway.outerWrap.getAttribute(`data-game-id`);
    info = await this.esgst.modules.games.games_getInfo(giveaway.outerWrap);
    if (info) {
      giveaway.id = info.id;
      giveaway.type = info.type;
      if (this.esgst.games && this.esgst.games[giveaway.type][giveaway.id]) {
        keys = [`owned`, `wishlisted`, `followed`, `hidden`, `ignored`, `previouslyEntered`, `previouslyWon`, `reducedCV`, `noCV`];
        for (i = 0, n = keys.length; i < n; ++i) {
          key = keys[i];
          if (this.esgst.games[giveaway.type][giveaway.id][key === `previouslyEntered` ? `entered` : (key === `previouslyWon` ? `won` : key)]) {
            giveaway[key] = true;
          }
        }
      }
    }
    const giveawayPath = common.testPath(`Giveaway`, `sg`, mainUrl || window.location.pathname);
    const createdPath = common.testPath(`My Giveaways - Created`, `sg`, mainUrl || window.location.pathname);
    const enteredPath = common.testPath(`My Giveaways - Entered`, `sg`, mainUrl || window.location.pathname);
    const wonPath = common.testPath(`My Giveaways - Won`, `sg`, mainUrl || window.location.pathname);
    const wishlistPath = common.testPath(`Community Wishlist`, `sg`, mainUrl || window.location.pathname);
    const archivePath = common.testPath(`Archive`, `sg`, mainUrl || window.location.pathname);
    const giveawaysPath = common.testPath(`Giveaways`, `sg`, mainUrl || window.location.pathname);
    const groupPath = common.testPath(`Group`, `sg`, mainUrl || window.location.pathname);
    const userPath = common.testPath(`Usernt`, `sg`, mainUrl || window.location.pathname);
    const userWonPath = common.testPath(`User - Giveaways - Won`, `sg`, mainUrl || window.location.pathname);
    if (giveaway.outerWrap.classList.contains(`table__row-outer-wrap`) && giveawayPath) {
      return;
    }
    giveaway.innerWrap = giveaway.outerWrap.querySelector(`.giveaway__row-inner-wrap, .featured__inner-wrap, .table__row-inner-wrap`);
    giveaway.avatar = giveaway.outerWrap.querySelector(`.giveaway_image_avatar, .featured_giveaway_image_avatar`);
    giveaway.image = giveaway.outerWrap.querySelector(`.giveaway_image_thumbnail, .giveaway_image_thumbnail_missing, .global__image-outer-wrap--game-medium`);
    giveaway.summary = giveaway.innerWrap.querySelector(`.giveaway__summary, .featured__summary, .table__column--width-fill`);
    if (source === `gb`) {
      giveaway.entered = giveaway.outerWrap.getAttribute(`data-entered`);
    } else if (giveawayPath && main) {
      let button = mainContext.getElementsByClassName(`sidebar__entry-delete`)[0];
      if (button) {
        giveaway.entered = !button.classList.contains(`is-hidden`);
      }
    } else if (enteredPath && main) {
      giveaway.entered = true;
    } else {
      giveaway.entered = giveaway.innerWrap.classList.contains(`is-faded`);
    }
    giveaway.headingName = giveaway.innerWrap.querySelector(`.giveaway__heading__name, .featured__heading__medium, .table__column__heading`);
    if (wishlistPath) {
      giveaway.heading = giveaway.headingName;
    } else {
      giveaway.heading = giveaway.headingName.parentElement;
    }
    giveaway.name = giveaway.headingName.textContent;
    match = giveaway.name.match(/\s\((.+) Copies\)/);
    if (match) {
      giveaway.name = giveaway.name.replace(match[0], ``);
      giveaway.copies = parseInt(match[1].replace(/,/g, ``).match(/\d+/)[0]);
    } else {
      giveaway.copies = 1;
    }
    giveaway.url = giveawayPath && main && !ugd ? ((mainUrl && common.getPath(mainUrl)) || window.location.pathname) : (mainUrl || giveaway.headingName.getAttribute(`href`));
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
    giveaway.copiesContainer = null;
    if (n > 0) {
      if (n > 1) {
        giveaway.copiesContainer = thinHeadings[0];
        giveaway.copies = parseInt(thinHeadings[0].textContent.replace(/,/g, ``).match(/\d+/)[0]);
        giveaway.pointsContainer = thinHeadings[1];
        giveaway.points = parseInt(thinHeadings[1].textContent.match(/\d+/)[0]);
      } else {
        giveaway.copies = 1;
        giveaway.pointsContainer = thinHeadings[0];
        giveaway.points = parseInt(thinHeadings[0].textContent.match(/\d+/)[0]);
      }
    }
    giveaway.columns = giveaway.innerWrap.querySelector(`.giveaway__columns, .featured__columns`);
    if (giveaway.columns && (!archivePath || !main)) {
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
      if (!main || !userPath || userWonPath || (ugd && ugdType === `won`) || ged) {
        giveaway.creatorContainer = giveaway.startTimeColumn.lastElementChild;
        giveaway.creator = giveaway.creatorContainer.textContent;
      }
    } else {
      giveaway.started = true;
    }
    if (main && archivePath) {
      giveaway.startTimeColumn = giveaway.innerWrap.querySelector(`[data-timestamp]`);
      if (giveaway.startTimeColumn) {
        giveaway.startTime = parseInt(giveaway.startTimeColumn.getAttribute(`data-timestamp`)) * 1e3;
        giveaway.creatorContainer = giveaway.startTimeColumn.nextElementSibling;
        giveaway.creator = giveaway.creatorContainer.textContent;
      } else {
        giveaway.startTime = 0;
      }
    }
    if (!giveaway.endTime && main && (createdPath || enteredPath || wonPath)) {
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
    } else if (userPath && !userWonPath && main && !ged) {
      giveaway.creator = ((mainUrl && common.getPath(mainUrl)) || window.location.pathname).match(/^\/user\/(.+?)(\/.*)?$/)[1];
    } else if (createdPath && main) {
      giveaway.creator = this.esgst.username;
    }
    if (giveaway.creator) {
      giveaway.creators.push(giveaway.creator.toLowerCase());
    }
    if (main) {
      if (createdPath) {
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
      } else if (wonPath) {
        giveaway.received = false;
        giveaway.notReceived = false;
        const elements = giveaway.outerWrap.querySelectorAll(`.table__column--gift-feedback`);
        for (const element of elements) {
          const text = element.textContent.trim();
          if ((text.match(/^Received$/) && element.querySelector(`.icon-green`)) || element.querySelector(`.table__gift-feedback-received:not(.is-hidden)`)) {
            giveaway.received = true;
            break;
          }
          if ((text.match(/^Not\sReceived$/) && element.querySelector(`.icon-red`)) || element.querySelector(`.table__gift-feedback-not-received:not(.is-hidden)`)) {
            giveaway.notReceived = true;
            break;
          }
        }
        giveaway.awaitingFeedback = !giveaway.received && !giveaway.notReceived;
      }
    }
    giveaway.created = giveaway.creator === this.esgst.username;
    if (this.esgst.uf && giveawaysPath && main) {
      savedUser = await getUser(this.esgst.users, {
        username: giveaway.creator
      });
      if (savedUser) {
        uf = savedUser.uf;
        if (this.esgst.uf_g && savedUser.blacklisted && !uf) {
          this.esgst.modules.usersUserFilters.uf_updateCount(giveaway.outerWrap.parentElement.nextElementSibling);
          giveaway.outerWrap.remove();
          return;
        } else if (uf && uf.giveaways) {
          this.esgst.modules.usersUserFilters.uf_updateCount(giveaway.outerWrap.parentElement.nextElementSibling);
          giveaway.outerWrap.remove();
          return;
        }
      }
    }
    if (this.esgst.gf && this.esgst.gf_s && main) {
      let savedGiveaway = this.esgst.giveaways[giveaway.code];
      if ((giveawaysPath || groupPath) && savedGiveaway && savedGiveaway.hidden && savedGiveaway.code && savedGiveaway.endTime && savedGiveaway.endTime > Date.now()) {
        giveaway.outerWrap.remove();
        return;
      }
    }
    giveaway.links = giveaway.innerWrap.getElementsByClassName(`giveaway__links`)[0];
    if (giveaway.links) {
      giveaway.links.classList.add(`esgst-giveaway-links`);
      giveaway.entriesLink = giveaway.links.firstElementChild;
      giveaway.commentsLink = giveaway.entriesLink.nextElementSibling;
    } else if (giveawayPath) {
      giveaway.entriesLink = mainContext.getElementsByClassName(`sidebar__navigation__item__count`)[1];
      giveaway.commentsLink = mainContext.getElementsByClassName(`sidebar__navigation__item__count`)[0];
    }
    if (giveaway.entriesLink && giveaway.commentsLink) {
      giveaway.entriesLink.setAttribute(`data-draggable-id`, `entries`);
      giveaway.commentsLink.setAttribute(`data-draggable-id`, `comments`);
      giveaway.entries = parseInt(giveaway.entriesLink.textContent.replace(/,/g, ``).match(/\d+/)[0]);
      giveaway.comments = parseInt(giveaway.commentsLink.textContent.replace(/,/g, ``).match(/\d+/)[0]);
    }
    giveaway.extraPanel = common.createElements_v2(giveaway.summary, `beforeEnd`, [[`div`]]);
    giveaway.panel = giveaway.innerWrap.getElementsByClassName(`esgst-giveaway-panel`)[0];
    if (!giveaway.panel && (this.esgst.gwc || this.esgst.gwr || this.esgst.gptw || this.esgst.gp || this.esgst.elgb || this.esgst.cewgd)) {
      if (giveaway.links) {
        giveaway.panelFlexbox = common.createElements_v2(giveaway.links, `afterEnd`, [
          [`div`, { class: `esgst-panel-flexbox` }]
        ]);
        giveaway.panelFlexbox.appendChild(giveaway.links);
        giveaway.panel = createElements(giveaway.panelFlexbox, `beforeEnd`, [{
          attributes: {
            class: `giveaway__columns esgst-giveaway-panel`
          },
          type: `div`
        }]);
      } else if (giveaway.columns) {
        if (archivePath) {
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
      } else if (enteredPath && (this.esgst.gwc || this.esgst.gwr || this.esgst.gptw)) {
        giveaway.panel = createElements(giveaway.innerWrap.firstElementChild.nextElementSibling, `afterEnd`, [{
          attributes: {
            class: `table__column--width-small text-center esgst-giveaway-panel`
          },
          type: `div`
        }]);
      }
    }
    if (giveaway.sgTools && !giveaway.panel.getElementsByClassName(`esgst-ge-sgt-button`)[0]) {
      createElements(giveaway.panel, `beforeEnd`, [{
        attributes: {
          class: `esgst-ge-sgt-button esgst-giveaway-column-button`,
          [`data-draggable-id`]: `sgTools`,
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
    }
    giveaway.elgbPanel = giveaway.panel;
    if (!giveaway.entriesLink) {
      let ct = giveaway.panel || (this.esgst.gm_enable && createdPath ? giveaway.innerWrap.firstElementChild.nextElementSibling.nextElementSibling : giveaway.innerWrap.firstElementChild.nextElementSibling);
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
    if (!main || !giveawayPath) {
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
    giveaway.currentlyEnterable = giveaway.outerWrap.getAttribute(`data-currently-enterable`);
    if (main) {
      if (this.esgst.gr && giveaway.creator === this.esgst.username && (this.esgst.gr_a || (giveaway.ended && (giveaway.entries === 0 || giveaway.entries < giveaway.copies))) && (!this.esgst.gr_r || !this.esgst.giveaways[giveaway.code] || !this.esgst.giveaways[giveaway.code].recreated) && !giveaway.heading.getElementsByClassName(`esgst-gr-button`)[0]) {
        let button = createElements(giveaway.headingName, `beforeBegin`, [{
          attributes: {
            class: `esgst-gr-button`,
            [`data-draggable-id`]: `gr`,
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
        button.firstElementChild.addEventListener(`click`, this.esgst.modules.giveawaysGiveawayRecreator.gr_recreateGiveaway.bind(this.esgst.modules.giveawaysGiveawayRecreator, button, giveaway), true);
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
        }]);
        hideButton = temp.nextElementSibling;
        hideButton.addEventListener(`click`, hideGame.bind(common, hideButton, giveaway.gameId, giveaway.name, giveaway.id, giveaway.type));
      } else if (this.esgst.updateHiddenGames) {
        hideButton.addEventListener(`click`, () => {
          this.esgst.hidingGame = {
            id: giveaway.id,
            type: giveaway.type
          };
        });
      }
    }
    if (hideButton) {
      if (hideButton.classList.contains(`featured__giveaway__hide`)) {
        hideButton.parentElement.setAttribute(`data-draggable-id`, `hideGame`);
      } else {
        hideButton.setAttribute(`data-draggable-id`, `hideGame`);
      }
    }
    for (const child of giveaway.heading.children) {
      if (child === giveaway.headingName || child.classList.contains(`giveaway__heading__name`) || child.classList.contains(`featured__heading__medium`)) {
        child.setAttribute(`data-draggable-id`, `name`);
        continue;
      }
      if (child.textContent.match(/\(.+?\sCopies\)/)) {
        child.setAttribute(`data-draggable-id`, `copies`);
        continue;
      }
      if (child.textContent.match(/\(.+?P\)/)) {
        child.setAttribute(`data-draggable-id`, `points`);
        continue;
      }
      if (child.getAttribute(`href`) && child.getAttribute(`href`).match(/store.steampowered.com/)) {
        child.setAttribute(`data-draggable-id`, `steam`);
        continue;
      }
      if (child.getAttribute(`href`) && child.getAttribute(`href`).match(/\/giveaways\/search/)) {
        child.setAttribute(`data-draggable-id`, `search`);
      }
    }
    /**
     * @property {object} winnerColumns.noWinners
     */
    giveaway.winnerColumns = {};
    giveaway.numWinners = 0;
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
        if (key !== `noWinners`) {
          giveaway.winners.push(...winners.map(x => ({ status, username: x })));
        }
        if (key === `received`) {
          giveaway.winnerNames = winners.map(x => x.toLowerCase());
          giveaway.numWinners += winners.length;
        }
        giveaway.winnerColumns[key] = {column, status, winners};
        column.setAttribute(`data-draggable-id`, `winners`);
        column = column.nextElementSibling;
      }
    }
    if (!giveaway.numWinners) {
      giveaway.numWinners = giveaway.winnerColumns.awaitingFeedback || giveaway.winnerColumns.noWinners ? 0 : Math.min(giveaway.entries || 0,  giveaway.copies);
    }
    if (giveaway.endTimeColumn) {
      giveaway.endTimeColumn.setAttribute(`data-draggable-id`, `endTime`);
    }
    if (giveaway.startTimeColumn) {
      giveaway.startTimeColumn.setAttribute(`data-draggable-id`, `startTime`);
    }
    if (giveaway.inviteOnly) {
      giveaway.inviteOnly.setAttribute(`data-draggable-id`, `inviteOnly`);
    }
    if (giveaway.whitelist) {
      giveaway.whitelist.setAttribute(`data-draggable-id`, `whitelist`);
    }
    if (giveaway.group) {
      giveaway.group.setAttribute(`data-draggable-id`, `group`);
    }
    if (giveaway.regionRestricted) {
      giveaway.regionRestricted.setAttribute(`data-draggable-id`, `regionRestricted`);
    }
    if (giveaway.levelColumn) {
      giveaway.levelColumn.setAttribute(`data-draggable-id`, `level`);
    }
    if (giveaway.sourceColumn) {
      giveaway.sourceColumn.setAttribute(`data-draggable-id`, `ged`);
    }
    if (giveaway.touhouBox) {
      giveaway.touhouBox.setAttribute(`data-draggable-id`, `touhou`);
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
        numWinners: giveaway.numWinners,
        entries: giveaway.entries,
        comments: giveaway.comments,
        level: giveaway.level,
        public: giveaway.public,
        inviteOnly: !!(giveaway.inviteOnly || giveaway.sgTools),
        regionRestricted: !!giveaway.regionRestricted,
        group: !!giveaway.group,
        whitelist: !!giveaway.whitelist
      }
    };
  }

  giveaways_reorder(giveaway) {
    if (giveaway.columns || giveaway.gvIcons) {
      for (const id of (giveaway.gvIcons ? this.esgst.giveawayColumns_gv : this.esgst.giveawayColumns)) {
        const elements = giveaway.outerWrap.querySelectorAll(`[data-draggable-id="${id}"]`);
        for (const element of elements) {
          (giveaway.gvIcons || giveaway.columns).appendChild(element);
          if (giveaway.elementOrdering) {
            continue;
          }
          if (element.getAttribute(`data-draggable-id`).match(/^(elgb|gp)$/)) {
            element.classList.add(`esgst-giveaway-column-button`);
          }
          if (!this.esgst.giveawayPath && element.getAttribute(`data-draggable-id`).match(/steam|search|hideGame/)) {
            element.classList.remove(`giveaway__icon`);
          }
          element.classList.add(this.esgst.giveawayPath ? `featured__column` : `giveaway__column`);
          if (element.getAttribute(`data-color`)) {
            element.firstElementChild.style.color = element.getAttribute(`data-bgColor`);
            element.style.color = ``;
            element.style.backgroundColor = ``;
          }
        }
      }
      if (giveaway.columns && giveaway.avatar && giveaway.columns.contains(giveaway.avatar)) {
        giveaway.columns.appendChild(giveaway.avatar);
      }
    }
    if (giveaway.panel) {
      for (const id of (giveaway.gvIcons ? this.esgst.giveawayPanel_gv : this.esgst.giveawayPanel)) {
        const elements = giveaway.outerWrap.querySelectorAll(`[data-draggable-id="${id}"]`);
        for (const element of elements) {
          giveaway.panel.appendChild(element);
          if (giveaway.elementOrdering) {
            continue;
          }
          if (element.getAttribute(`data-draggable-id`).match(/^(elgb|gp)$/)) {
            element.classList.remove(`esgst-giveaway-column-button`, this.esgst.giveawayPath ? `featured__column` : `giveaway__column`);
          } else {
            element.classList.add(this.esgst.giveawayPath ? `featured__column` : `giveaway__column`);
          }
          if (!this.esgst.giveawayPath && element.getAttribute(`data-draggable-id`).match(/steam|search|hideGame/)) {
            element.classList.remove(`giveaway__icon`);
          }
          if (element.getAttribute(`data-color`)) {
            element.style.color = element.getAttribute(`data-color`);
            element.style.backgroundColor = element.getAttribute(`data-bgColor`);
          }
        }
      }
    }
    if (giveaway.heading) {
      for (const id of (giveaway.gvIcons ? this.esgst.giveawayHeading_gv : this.esgst.giveawayHeading)) {
        const elements = giveaway.outerWrap.querySelectorAll(`[data-draggable-id="${id}"]`);
        for (const element of elements) {
          giveaway.heading.appendChild(element);
          if (giveaway.elementOrdering) {
            continue;
          }
          if (element.getAttribute(`data-draggable-id`).match(/^(elgb|gp)$/)) {
            element.classList.remove(`esgst-giveaway-column-button`);
          }
          if (!this.esgst.giveawayPath && element.getAttribute(`data-draggable-id`).match(/steam|search|hideGame/)) {
            element.classList.add(`giveaway__icon`);
          }
          element.classList.remove(this.esgst.giveawayPath ? `featured__column` : `giveaway__column`);
          if (element.getAttribute(`data-color`)) {
            element.style.color = element.getAttribute(`data-color`);
            element.style.backgroundColor = element.getAttribute(`data-bgColor`);
          }
        }
      }
    }
    if (giveaway.links) {
      for (const id of (giveaway.gvIcons ? this.esgst.giveawayLinks_gv : this.esgst.giveawayLinks)) {
        const elements = giveaway.outerWrap.querySelectorAll(`[data-draggable-id="${id}"]`);
        for (const element of elements) {
          giveaway.links.appendChild(element);
          if (giveaway.elementOrdering) {
            continue;
          }
          if (element.getAttribute(`data-draggable-id`).match(/^(elgb|gp)$/)) {
            element.classList.remove(`esgst-giveaway-column-button`);
          }
          if (!this.esgst.giveawayPath && element.getAttribute(`data-draggable-id`).match(/steam|search|hideGame/)) {
            element.classList.remove(`giveaway__icon`);
          }
          element.classList.remove(this.esgst.giveawayPath ? `featured__column` : `giveaway__column`);
          if (element.getAttribute(`data-color`)) {
            element.style.color = element.getAttribute(`data-color`);
            element.style.backgroundColor = element.getAttribute(`data-bgColor`);
          }
        }
      }
    }
    if (giveaway.extraPanel) {
      for (const id of (giveaway.gvIcons ? this.esgst.giveawayExtraPanel_gv : this.esgst.giveawayExtraPanel)) {
        const elements = giveaway.outerWrap.querySelectorAll(`[data-draggable-id="${id}"]`);
        for (const element of elements) {
          giveaway.extraPanel.appendChild(element);
          if (giveaway.elementOrdering) {
            continue;
          }
          if (element.getAttribute(`data-draggable-id`).match(/^(elgb|gp)$/)) {
            element.classList.remove(`esgst-giveaway-column-button`);
          }
          if (!this.esgst.giveawayPath && element.getAttribute(`data-draggable-id`).match(/steam|search|hideGame/)) {
            element.classList.remove(`giveaway__icon`);
          }
          element.classList.remove(this.esgst.giveawayPath ? `featured__column` : `giveaway__column`);
          if (element.getAttribute(`data-color`)) {
            element.style.color = element.getAttribute(`data-color`);
            element.style.backgroundColor = element.getAttribute(`data-bgColor`);
          }
        }
      }
    }
    if (giveaway.gcPanel) {
      for (const id of (giveaway.gvIcons ? this.esgst.gc_categories_gv : this.esgst.gc_categories)) {
        const elements = giveaway.outerWrap.querySelectorAll(`[data-draggable-id="${id}"]`);
        for (const element of elements) {
          giveaway.gcPanel.appendChild(element);
          if (giveaway.elementOrdering) {
            continue;
          }
          if (element.getAttribute(`data-draggable-id`).match(/^(elgb|gp)$/)) {
            element.classList.remove(`esgst-giveaway-column-button`);
          }
          if (!this.esgst.giveawayPath && element.getAttribute(`data-draggable-id`).match(/steam|search|hideGame/)) {
            element.classList.remove(`giveaway__icon`);
          }
          element.classList.remove(this.esgst.giveawayPath ? `featured__column` : `giveaway__column`);
          if (element.getAttribute(`data-color`)) {
            element.style.color = element.getAttribute(`data-color`);
            element.style.backgroundColor = element.getAttribute(`data-bgColor`);
          }
        }
      }
    }
  }
}

export default Giveaways;