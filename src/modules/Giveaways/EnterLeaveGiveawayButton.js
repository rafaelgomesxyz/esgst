import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';

const
  parseHtml = utils.parseHtml.bind(utils),
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  getValue = common.getValue.bind(common),
  request = common.request.bind(common),
  setLocalValue = common.setLocalValue.bind(common),
  setSetting = common.setSetting.bind(common)
  ;

class GiveawaysEnterLeaveGiveawayButton extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button ("`,
            [`i`, { class: `fa fa-plus-circle` }],
            ` Enter" to enter and "`,
            [`i`, { class: `fa fa-minus-circle` }],
            ` Leave" to leave) below a giveaway's start time (in any page) that allows you to enter/leave the giveaway without having to access it.`
          ]],
          [`li`, `You can move the button around by dragging and dropping it.`]
        ]]
      ],
      features: {
        elgb_b: {
          description: [
            [`ul`, [
              [`li`, `Requires[id=gb] enabled.`]
            ]]
          ],
          name: `Automatically bookmark giveaways when trying to enter them without enough points .`,
          sg: true
        },
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
          description: [
            [`ul`, [
              [`li`, `Only shows the button in popups([id=gb], [id=ged], [id=ge], etc...), so basically only for any giveaways that are loaded dynamically by ESGST.`]
            ]]
          ],
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
        elgb_fp: {
          name: `Pop up the first page of comments of the giveaway when entering it, if it has any comments.`,
          sg: true
        },
        elgb_d: {
          name: `Pop up the giveaway description when entering it, if it has any.`,
          sg: true
        }
      },
      id: `elgb`,
      load: this.elgb,
      name: `Enter / Leave Giveaway Button`,
      sg: true,
      type: `giveaways`
    };
  }

  elgb() {
    this.esgst.giveawayFeatures.push(this.elgb_addButtons.bind(this));
  }

  async elgb_addButtons(giveaways, main, source) {
    giveaways.forEach(giveaway => {
      if (giveaway.sgTools || (main && (this.esgst.elgb_p || this.esgst.createdPath || this.esgst.wonPath))) return;
      if (giveaway.innerWrap.getElementsByClassName(`esgst-elgb-button`)[0]) {
        return;
      }
      if (this.esgst.enteredPath && main) {
        this.elgb_setEntryButton(giveaway);
        return;
      }
      if (giveaway.blacklist || (giveaway.inviteOnly && !giveaway.url) || !giveaway.started || giveaway.ended || giveaway.created || giveaway.level > this.esgst.level || (giveaway.id && (this.esgst.games[giveaway.type][giveaway.id] && (this.esgst.games[giveaway.type][giveaway.id].owned || this.esgst.games[giveaway.type][giveaway.id].won || (this.esgst.games[giveaway.type][giveaway.id].hidden && this.esgst.hgebd))))) {
        return;
      }
      if (this.esgst.giveawayPath && main) {
        let sidebarButton = document.getElementsByClassName(`sidebar__error is-disabled`)[0];
        if (!sidebarButton || sidebarButton.textContent.trim() !== `Not Enough Points`) {
          return;
        }
        giveaway.elgbPanel = createElements(sidebarButton.parentElement, `afterBegin`, [{
          type: `div`
        }]);
        sidebarButton.remove();
        this.elgb_addButton(giveaway, main, source);
      } else {
        this.elgb_addButton(giveaway, main, source);
      }
    });
  }

  elgb_setEntryButton(giveaway) {
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
    addButton.addEventListener(`click`, this.elgb_addEntry.bind(this, addButton, addingButton, errorButton, giveaway, removeButton));
    removeButton.addEventListener(`click`, this.elgb_removeEntry.bind(this, addButton, errorButton, giveaway, removeButton, removingButton));
    form.remove();
  }

  async elgb_addEntry(addButton, addingButton, errorButton, giveaway, removeButton) {
    addButton.classList.add(`esgst-hidden`);
    addingButton.classList.remove(`esgst-hidden`);
    try {
      let responseJson = JSON.parse((await request({
        data: `xsrf_token=${this.esgst.xsrfToken}&do=entry_insert&code=${giveaway.code}`,
        method: `POST`,
        url: `/ajax.php`
      })).responseText);
      if (responseJson.type === `success`) {
        removeButton.classList.remove(`esgst-hidden`);
      } else {
        if (this.esgst.elgb_b && this.esgst.gb && giveaway.gbButton && giveaway.gbButton.index === 1) {
          // noinspection JSIgnoredPromiseFromCall
          giveaway.gbButton.change(giveaway.gbButton.callbacks[0]);
        }
        errorButton.classList.remove(`esgst-hidden`);
      }
      this.esgst.pointsContainer.textContent = responseJson.points;
      // noinspection JSIgnoredPromiseFromCall
      this.esgst.modules.generalHeaderRefresher.hr_refreshHeaderElements(document);
    } catch (e) {
      errorButton.classList.remove(`esgst-hidden`);
    }
    addingButton.classList.add(`esgst-hidden`);
    if (this.esgst.et) {
      // noinspection JSIgnoredPromiseFromCall
      this.esgst.modules.giveawaysEntryTracker.et_setEntry(giveaway.code, true, giveaway.name);
    }
  }

  async elgb_removeEntry(addButton, errorButton, giveaway, removeButton, removingButton) {
    removeButton.classList.add(`esgst-hidden`);
    removingButton.classList.remove(`esgst-hidden`);
    try {
      let responseJson = JSON.parse((await request({
        data: `xsrf_token=${this.esgst.xsrfToken}&do=entry_delete&code=${giveaway.code}`,
        method: `POST`,
        url: `/ajax.php`
      })).responseText);
      if (responseJson.type === `success`) {
        addButton.classList.remove(`esgst-hidden`);
      } else {
        errorButton.classList.remove(`esgst-hidden`);
      }
      this.esgst.pointsContainer.textContent = responseJson.points;
      // noinspection JSIgnoredPromiseFromCall
      this.esgst.modules.generalHeaderRefresher.hr_refreshHeaderElements(document);
    } catch (e) {
      errorButton.classList.remove(`esgst-hidden`);
    }
    removingButton.classList.add(`esgst-hidden`);
    if (this.esgst.et) {
      // noinspection JSIgnoredPromiseFromCall
      this.esgst.modules.giveawaysEntryTracker.et_setEntry(giveaway.code, false, giveaway.name);
    }
  }

  elgb_addButton(giveaway, main, source) {
    let style = ``;
    if (giveaway.elgbButton) {
      style = giveaway.elgbButton.firstElementChild.getAttribute(`style`);
    }
    let doAppend = !giveaway.elgbButton;
    if (giveaway.entered) {
      giveaway.elgbButton = new ButtonSet({
        color1: `yellow`,
        color2: `grey`,
        icon1: `fa-minus-circle`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Leave`,
        title2: `Leaving...`,
        callback1: () => {
          return new Promise(resolve => this.elgb_leaveGiveaway(giveaway, main, source, resolve));
        },
        set: giveaway.elgbButton
      }).set;
      giveaway.elgbButton.removeAttribute(`title`);
    } else if (giveaway.error) {
      giveaway.elgbButton = new ButtonSet({
        color1: `red`,
        color2: `grey`,
        icon1: `fa-plus-circle`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Enter`,
        title2: `Entering...`,
        callback1: () => {
          return new Promise(resolve => this.elgb_enterGiveaway(giveaway, main, null, source, resolve));
        },
        set: giveaway.elgbButton
      }).set;
      giveaway.elgbButton.setAttribute(`title`, giveaway.error);
    } else {
      if (giveaway.points <= this.esgst.points) {
        giveaway.elgbButton = new ButtonSet({
          color1: `green`,
          color2: `grey`,
          icon1: `fa-plus-circle`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `Enter`,
          title2: `Entering...`,
          callback1: () => {
            return new Promise(resolve => this.elgb_enterGiveaway(giveaway, main, null, source, resolve));
          },
          set: giveaway.elgbButton
        }).set;
        giveaway.elgbButton.removeAttribute(`title`);
      } else {
        giveaway.elgbButton = new ButtonSet({
          color1: `red`,
          color2: `grey`,
          icon1: `fa-plus-circle`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `Enter`,
          title2: `Entering...`,
          callback1: () => {
            return new Promise(resolve => this.elgb_enterGiveaway(giveaway, main, null, source, resolve));
          },
          set: giveaway.elgbButton
        }).set;
        giveaway.elgbButton.setAttribute(`title`, `Not Enough Points`);
      }
    }
    if (doAppend) {
      giveaway.elgbButton.classList.add(`esgst-elgb-button`);
      if (this.esgst.gv && ((main && this.esgst.giveawaysPath) || (source === `gb` && this.esgst.gv_gb) || (source === `ged` && this.esgst.gv_ged) || (source === `ge` && this.esgst.gv_ge))) {
        giveaway.elgbPanel.insertBefore(giveaway.elgbButton, giveaway.elgbPanel.firstElementChild);
      } else {
        giveaway.elgbPanel.appendChild(giveaway.elgbButton);
      }
      giveaway.elgbButton.setAttribute(`data-draggable-id`, `elgb`);
    }
    giveaway.elgbButton.firstElementChild.setAttribute(`style`, style);
  }

  async elgb_openPopup(giveaway, main, source, mainCallback) {
    let popup = new Popup({
      addScrollable: true, icon: `fa-file-text-o`, isTemp: true, title: [{
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
      }]
    });
    if (giveaway.entered) {
      let set = new ButtonSet({
        color1: `yellow`,
        color2: `grey`,
        icon1: `fa-minus-circle`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Leave Giveaway`,
        title2: `Leaving...`,
        callback1: () => {
          return new Promise(resolve => {
            // noinspection JSIgnoredPromiseFromCall
            this.elgb_leaveGiveaway(giveaway, main, source, () => {
              resolve();
              popup.close();
            });
          });
        }
      });
      popup.description.appendChild(set.set);
    } else {
      let games = JSON.parse(getValue(`games`));
      if (giveaway.started && !giveaway.ended && !giveaway.created && giveaway.level <= this.esgst.level && ((giveaway.id && ((games[giveaway.type][giveaway.id] && !games[giveaway.type][giveaway.id].owned && (!games[giveaway.type][giveaway.id].hidden || !this.esgst.hgebd)) || !games[giveaway.type][giveaway.id])) || !giveaway.id)) {
        let set = new ButtonSet({
          color1: `green`,
          color2: `grey`,
          icon1: `fa-plus-circle`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `Enter Giveaway`,
          title2: `Entering...`,
          callback1: () => {
            return new Promise(resolve => {
              // noinspection JSIgnoredPromiseFromCall
              this.elgb_enterGiveaway(giveaway, main, true, source, () => {
                resolve();
                popup.close();
              });
            });
          }
        });
        popup.description.appendChild(set.set);
      }
    }
    let description = null;
    let responseHtml = null;
    if (this.esgst.elgb_d || (this.esgst.elgb_r && this.esgst.elgb_r_d) || mainCallback) {
      responseHtml = parseHtml((await request({ method: `GET`, url: giveaway.url })).responseText);
      if (mainCallback && !responseHtml.getElementsByClassName(`featured__outer-wrap--giveaway`)[0]) {
        mainCallback(true);
        return;
      }
      description = responseHtml.getElementsByClassName(`page__description`)[0];
    }
    if (description && description.textContent.trim() && !mainCallback) {
      if (this.esgst.elgb_c) {
        if (Date.now() - this.esgst.elgbCache.timestamp > 3600000) {
          this.esgst.elgbCache = {
            descriptions: {},
            timestamp: Date.now()
          };
          setLocalValue(`elgbCache`, JSON.stringify(this.esgst.elgbCache));
        }
        if (!this.esgst.elgbCache.descriptions[giveaway.creator]) {
          this.esgst.elgbCache.descriptions[giveaway.creator] = [];
        }
        let html = description.innerHTML;
        let i;
        for (i = this.esgst.elgbCache.descriptions[giveaway.creator].length - 1; i > -1 && this.esgst.elgbCache.descriptions[giveaway.creator][i] !== html; --i) {
        }
        if (i > -1) {
          description = null;
        } else {
          this.esgst.elgbCache.descriptions[giveaway.creator].push(html);
          setLocalValue(`elgbCache`, JSON.stringify(this.esgst.elgbCache));
          if (this.esgst.elgb_f) {
            let text = description.textContent.replace(/[^a-zA-Z]/g, ``).toLowerCase();
            if (text.match(new RegExp(`^(${this.esgst.elgb_filters})$`))) {
              description = null;
            }
          }
        }
      } else if (this.esgst.elgb_f) {
        let text = description.textContent.replace(/[^a-zA-Z]/g, ``).toLowerCase();
        if (text.match(new RegExp(`^(${this.esgst.elgb_filters})$`))) {
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
    if ((this.esgst.elgb_r && (!this.esgst.elgb_r_d || description)) || mainCallback) {
      box = createElements(popup.scrollable, `beforeEnd`, [{
        type: `textarea`
      }]);
      if (this.esgst.cfh) {
        this.esgst.modules.commentsCommentFormattingHelper.cfh_addPanel(box);
      }
      popup.description.appendChild(new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-arrow-circle-right`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Add Comment`,
        title2: `Saving...`,
        callback1: async () => {
          if (box.value) {
            await request({
              data: `xsrf_token=${this.esgst.xsrfToken}&do=comment_new&description=${box.value}`,
              method: `POST`,
              url: giveaway.url
            });
          }
          popup.close();
        }
      }).set);
    }
    if (description && this.esgst.elgb_f) {
      let set = new ButtonSet({
        color1: `grey`,
        color2: `grey`,
        icon1: `fa-eye`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Add Description To Filters`,
        title2: `Filtering...`,
        callback1: async () => {
          this.esgst.elgb_filters = `${this.esgst.elgb_filters}|${description.textContent.replace(/[^a-zA-Z]/g, ``).toLowerCase()}`;
          await setSetting(`elgb_filters`, this.esgst.elgb_filters);
          set.remove();
        }
      }).set;
      popup.description.appendChild(set);
    }
    const comments = responseHtml.querySelector(`.comments`);
    if (comments && comments.children.length) {
      comments.classList.add(`esgst-text-left`, `esgst-hidden`);
      createElements(popup.scrollable, `beforeEnd`, [{
        context: comments
      }]);
      if (this.esgst.elgb_fp || mainCallback) {
        comments.classList.remove(`esgst-hidden`);
        common.endless_load(comments);
      } else {
        const commentButton = new ButtonSet({
          color1: `grey`,
          color2: ``,
          icon1: `fa-comments`,
          icon2: ``,
          title1: `Show First Page Comments`,
          title2: ``,
          callback1: () => {
            commentButton.remove();
            comments.classList.remove(`esgst-hidden`);
            common.endless_load(comments);
          }
        }).set;
        popup.description.appendChild(commentButton);
      }
    }
    if ((this.esgst.elgb_fp && comments && comments.children.length) || (this.esgst.elgb_d && description) || (this.esgst.elgb_r && (!this.esgst.elgb_r_d || description)) || mainCallback) {
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

  async elgb_enterGiveaway(giveaway, main, popup, source, callback) {
    const responseText = (await request({
      data: `xsrf_token=${this.esgst.xsrfToken}&do=entry_insert&code=${giveaway.code}`,
      method: `POST`,
      url: `/ajax.php`
    })).responseText;
    let responseJson = null;
    try {
      responseJson = JSON.parse(responseText);
    } catch (e) {
      window.console.log(e);
      window.console.log(giveaway.code);
      window.console.log(responseJson);
    }
    if (!responseJson) {
      return;
    }
    if (responseJson.type === `success`) {
      if (!this.esgst.giveawayPath || !main) {
        giveaway.innerWrap.classList.add(`is-faded`);
      }
      giveaway.entered = true;
      giveaway.error = null;
      this.elgb_addButton(giveaway, main, source);
      if (this.esgst.et) {
        // noinspection JSIgnoredPromiseFromCall
        this.esgst.modules.giveawaysEntryTracker.et_setEntry(giveaway.code, true, giveaway.name);
      }
      this.esgst.pointsContainer.textContent = responseJson.points;
      await this.esgst.modules.generalHeaderRefresher.hr_refreshHeaderElements(document);
      if (this.esgst.hr) {
        setLocalValue(`hrCache`, JSON.stringify(this.esgst.modules.generalHeaderRefresher.hr_getCache()));
      }
      this.elgb_updateButtons();
      if (this.esgst.egh) {
        // noinspection JSIgnoredPromiseFromCall
        this.esgst.modules.gamesEnteredGameHighlighter.egh_saveGame(giveaway.id, giveaway.type);
      }
      if (this.esgst.gb && this.esgst.gb_ue && giveaway.gbButton) {
        if (giveaway.gbButton.index === 3) {
          // noinspection JSIgnoredPromiseFromCall
          giveaway.gbButton.change(giveaway.gbButton.callbacks[2]);
        }
        if (!this.esgst.gb_se) {
          giveaway.gbButton.button.classList.add(`esgst-hidden`);
        }
      }
      if (this.esgst.gf && this.esgst.gf.filteredCount && this.esgst[`gf_enable${this.esgst.gf.type}`]) {
        this.esgst.modules.filters.filters_filter(this.esgst.gf);
      }
      if (this.esgst.gfPopup && this.esgst.gfPopup.filteredCount && this.esgst[`gf_enable${this.esgst.gfPopup.type}`]) {
        this.esgst.modules.filters.filters_filter(this.esgst.gfPopup);
      }
      if (callback) {
        callback();
      }
      if (!popup && (!this.esgst.giveawayPath || !main)) {
        // noinspection JSIgnoredPromiseFromCall
        this.elgb_openPopup(giveaway, main, source);
      }
    } else {
      if (this.esgst.elgb_b && this.esgst.gb && giveaway.gbButton && giveaway.gbButton.index === 1) {
        // noinspection JSIgnoredPromiseFromCall
        giveaway.gbButton.change(giveaway.gbButton.callbacks[0]);
      }
      giveaway.entered = false;
      giveaway.error = responseJson.msg;
      this.elgb_addButton(giveaway, main, source);
      if (callback) {
        callback();
      }
    }
  }

  async elgb_leaveGiveaway(giveaway, main, source, callback) {
    const responseText = (await request({
      data: `xsrf_token=${this.esgst.xsrfToken}&do=entry_delete&code=${giveaway.code}`,
      method: `POST`,
      url: `/ajax.php`
    })).responseText;
    let responseJson = null;
    try {
      responseJson = JSON.parse(responseText);
    } catch (e) {
      window.console.log(e);
      window.console.log(giveaway.code);
      window.console.log(responseJson);
    }
    if (!responseJson) {
      return;
    }
    if (responseJson.type === `success`) {
      giveaway.innerWrap.classList.remove(`is-faded`);
      giveaway.entered = false;
      giveaway.error = false;
      this.elgb_addButton(giveaway, main, source);
      if (this.esgst.et) {
        // noinspection JSIgnoredPromiseFromCall
        this.esgst.modules.giveawaysEntryTracker.et_setEntry(giveaway.code, false, giveaway.name);
      }
      this.esgst.pointsContainer.textContent = responseJson.points;
      await this.esgst.modules.generalHeaderRefresher.hr_refreshHeaderElements(document);
      if (this.esgst.hr) {
        setLocalValue(`hrCache`, JSON.stringify(this.esgst.modules.generalHeaderRefresher.hr_getCache()));
      }
      this.elgb_updateButtons();
      if (this.esgst.gb && giveaway.gbButton) {
        giveaway.gbButton.button.classList.remove(`esgst-hidden`);
      }
      if (this.esgst.gf && this.esgst.gf.filteredCount && this.esgst[`gf_enable${this.esgst.gf.type}`]) {
        this.esgst.modules.filters.filters_filter(this.esgst.gf);
      }
      if (this.esgst.gfPopup && this.esgst.gfPopup.filteredCount && this.esgst[`gf_enable${this.esgst.gfPopup.type}`]) {
        this.esgst.modules.filters.filters_filter(this.esgst.gfPopup);
      }
      if (callback) {
        callback();
      }
    } else if (callback) {
      callback();
    }
  }

  elgb_updateButtons() {
    let giveaway, i, n;
    for (i = 0, n = this.esgst.scopes.main.giveaways.length; i < n; ++i) {
      giveaway = this.esgst.scopes.main.giveaways[i];
      if (giveaway.elgbButton && !giveaway.entered) {
        this.elgb_addButton(giveaway, true);
      }
    }
    if (this.esgst.ttec) {
      this.esgst.modules.giveawaysTimeToEnterCalculator.ttec_calculateTime(this.esgst.scopes.main.giveaways, true);
    }
  }
}

const giveawaysEnterLeaveGiveawayButton = new GiveawaysEnterLeaveGiveawayButton();

export { giveawaysEnterLeaveGiveawayButton };