import { ButtonSet } from '../class/ButtonSet';
import { Popup } from '../class/Popup';
import { shared } from '../class/Shared';
import { ToggleSwitch } from '../class/ToggleSwitch';
import { utils } from '../lib/jsUtils';
import { setSync } from './Sync';
import { elementBuilder } from '../lib/SgStUtils/ElementBuilder';
import { gSettings } from '../class/Globals';
import { permissions } from '../class/Permissions';
import { Table } from '../class/Table';

class Settings {
  constructor() {
    this.toSave = {};
    this.grantedPermissions = new Set();
    this.deniedPermissions = new Set();
  }

  preSave(key, value) {
    const match = key.match(/_(sg|st|sgtools)$/);
    if (match) {
      const id = key.replace(match[0], ``);
      const namespace = match[1];
      const feature = shared.esgst.featuresById[id];
      if (feature) {
        if (typeof value === `object`) {
          this.toSave[key] = value;
          gSettings.full[key] = gSettings[key] = value;
        } else {
          const setting = gSettings.full[key] || shared.common.getFeaturePath(null, id, namespace);
          setting.enabled = value;
          this.toSave[key] = setting;
          gSettings[key] = setting;
        }
        return;
      }
    }
    this.toSave[key] = value;
    gSettings[key] = value;
  }

  preSavePermissions(permissionKeys) {
    for (const key of permissionKeys) {
      this.grantedPermissions.add(key);
    }
  }

  loadMenu(isPopup) {
    /** @type {HTMLInputElement} */
    let SMAPIKey;

    let Container = null;
    let Context = null;
    let popup = null;
    if (isPopup) {
      popup = new Popup({
        addScrollable: `left`,
        settings: true,
        isTemp: true
      });
      popup.popup.classList.add(`esgst-text-left`);
      Container = popup.description;
      Context = popup.scrollable;
    } else {
      Context = Container = shared.esgst.sidebar.nextElementSibling;
      Container.innerHTML = ``;
    }

    const input = shared.common.createElements_v2(isPopup ? Container : shared.esgst.sidebar, `afterBegin`, [
      [`div`, { class: `sidebar__search-container` }, [
        [`input`, { class: `sidebar__search-input`, type: `text`, placeholder: `Search...` }]
      ]]
    ]).firstElementChild;
    if (isPopup && gSettings.scb) {
      shared.esgst.modules.generalSearchClearButton.getInputs(Container);
    }

    let newIndicators = null;

    const dismissAllButton = new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: ``,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Dismiss All New`,
      title2: `Dismissing`,
      callback1: async () => {      
        await shared.common.setSetting(`dismissedOptions`, shared.esgst.toDismiss);
        for (let i = newIndicators.length - 1; i > -1; i--) {
          newIndicators[i].remove();
        }
      }
    }).set;
    dismissAllButton.classList.add(`esgst-hidden`);
    Container.appendChild(dismissAllButton);

    Container.setAttribute(`data-esgst-popup`, true);
    const items = [
      {
        check: true,
        icons: [`fa-refresh`],
        position: `afterBegin`,
        title: `Sync data`,
        onclick: () => setSync(true)
      },
      {
        check: true,
        icons: [`fa-sign-in esgst-rotate-90`],
        position: `afterBegin`,
        title: `Restore data`,
        onclick: () => shared.esgst.modules.loadDataManagement(`import`, true)
      },
      {
        check: true,
        icons: [`fa-sign-out esgst-rotate-270`],
        position: `afterBegin`,
        title: `Backup data`,
        onclick: () => shared.esgst.modules.loadDataManagement(`export`, true)
      },
      {
        check: true,
        icons: [`fa-trash`],
        position: `afterBegin`,
        title: `Delete data`,
        onclick: () => shared.esgst.modules.loadDataManagement(`delete`, true)
      },
      {
        check: true,
        icons: [`fa-gear`, `fa-arrow-circle-down`],
        position: `afterBegin`,
        title: `Download settings (downloads your settings to your computer without your personal data so you can easily share them with other users)`,
        onclick: () => shared.common.exportSettings()
      },
      {
        check: true,
        icons: [`fa-paint-brush`],
        position: `afterBegin`,
        title: `Clean old data`,
        onclick: () => shared.esgst.modules.loadDataCleaner(true)
      },
      {
        check: !shared.esgst.parameters.esgst || shared.esgst.parameters.esgst === `guide`,
        icons: [`fa-user`, `fa-history`],
        position: `afterBegin`,
        title: `View recent username changes`,
        onclick: event => shared.common.setSMRecentUsernameChanges()
      },
      {
        check: (!shared.esgst.parameters.esgst || shared.esgst.parameters.esgst === `guide`) && gSettings.uf,
        icons: [`fa-user`, `fa-eye-slash`],
        position: `afterBegin`,
        title: `See list of filtered users`,
        onclick: event => shared.common.setSMManageFilteredUsers()
      },
      {
        check: (!shared.esgst.parameters.esgst || shared.esgst.parameters.esgst === `guide`) && shared.esgst.sg && gSettings.gf && gSettings.gf_s,
        icons: [`fa-gift`, `fa-eye-slash`],
        position: `afterBegin`,
        title: `Manage hidden giveaways`,
        onclick: event => shared.common.setSMManageFilteredGiveaways()
      },
      {
        check: (!shared.esgst.parameters.esgst || shared.esgst.parameters.esgst === `guide`) && shared.esgst.sg && gSettings.df && gSettings.df_s,
        icons: [`fa-comments`, `fa-eye-slash`],
        position: `afterBegin`,
        title: `Manage hidden discussions`,
        onclick: event => shared.esgst.modules.discussionsDiscussionFilters.df_menu({}, event.currentTarget)
      },
      {
        check: (!shared.esgst.parameters.esgst || shared.esgst.parameters.esgst === `guide`) && shared.esgst.st && gSettings.tf && gSettings.tf_s,
        icons: [`fa-retweet`, `fa-eye-slash`],
        position: `afterBegin`,
        title: `Manage hidden trades`,
        onclick: event => shared.esgst.modules.tradesTradeFilters.tf_menu({}, event.currentTarget)
      },
      {
        check: (!shared.esgst.parameters.esgst || shared.esgst.parameters.esgst === `guide`) && shared.esgst.sg && gSettings.dt,
        icons: [`fa-comments`, `fa-tags`],
        position: `afterBegin`,
        title: `Manage discussion tags`,
        onclick: () => shared.common.openManageDiscussionTagsPopup()
      },
      {
        check: (!shared.esgst.parameters.esgst || shared.esgst.parameters.esgst === `guide`) && shared.esgst.sg && gSettings.ut,
        icons: [`fa-user`, `fa-tags`],
        position: `afterBegin`,
        title: `Manage user tags`,
        onclick: () => shared.common.openManageUserTagsPopup()
      },
      {
        check: (!shared.esgst.parameters.esgst || shared.esgst.parameters.esgst === `guide`) && gSettings.gt,
        icons: [`fa-gamepad`, `fa-tags`],
        position: `afterBegin`,
        title: `Manage game tags`,
        onclick: () => shared.common.openManageGameTagsPopup()
      },
      {
        check: (!shared.esgst.parameters.esgst || shared.esgst.parameters.esgst === `guide`) && gSettings.gpt,
        icons: [`fa-users`, `fa-tags`],
        position: `afterBegin`,
        title: `Manage group tags`,
        onclick: () => shared.common.openManageGroupTagsPopup()
      },
      {
        check: (!shared.esgst.parameters.esgst || shared.esgst.parameters.esgst === `guide`) && gSettings.wbc,
        icons: [`fa-heart`, `fa-ban`, `fa-cog`],
        position: `afterBegin`,
        title: `Manage Whitelist / Blacklist Checker caches`,
        ref: button => shared.esgst.modules.usersWhitelistBlacklistChecker.wbc_addButton(false, button)
      },
      {
        check: (!shared.esgst.parameters.esgst || shared.esgst.parameters.esgst === `guide`) && gSettings.namwc,
        icons: [`fa-trophy`, `fa-cog`],
        position: `afterBegin`,
        title: `Manage Not Activated / Multiple Wins Checker caches`,
        ref: button => shared.esgst.modules.usersNotActivatedMultipleWinChecker.namwc_setPopup(button)
      }
    ].filter(x => x.check).reverse();
    const heading = new elementBuilder[shared.esgst.name].pageHeading({
      context: Container,
      position: `afterBegin`,
      breadcrumbs: [
        {
          name: `ESGST`,
          url: shared.esgst.settingsUrl
        },
        {
          name: `Settings`,
          url: shared.esgst.settingsUrl
        }
      ],
      buttons: items
    }).pageHeading;
    if (!isPopup) {
      shared.esgst.mainPageHeading = heading;
    }

    input.addEventListener(`input`, event => this.filterSm(event));
    input.addEventListener(`change`, event => this.filterSm(event));
    Context.classList.add(`esgst-menu-layer`);
    shared.common.createElements_v2(Context, `beforeEnd`, [
      [`div`, { class: `esgst-menu-split` }, [
        [`div`, { class: `esgst-settings-menu` }],
        [`div`, { class: `esgst-settings-menu-feature ${isPopup ? `` : `esgst-menu-split-fixed`}` }, [
          `Click on a feature/option to manage it here.`
        ]]
      ]]
    ]);
    heading.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: ``,
      icon2: ``,
      title1: `Save Changes`,
      title2: `Saving...`,
      callback1: async () => {
        await permissions.request(Array.from(this.grantedPermissions));
        await permissions.remove(Array.from(this.deniedPermissions));
        await shared.common.lockAndSaveSettings(this.toSave);
        this.toSave = {};
        if (isPopup) {
          popup.close();
        } else {
          window.location.reload();
        }
      }
    }).set);
    Context.addEventListener(`click`, event => this.loadFeatureDetails(null, popup && popup.scrollable.offsetTop, event));
    let SMMenu = Context.getElementsByClassName(`esgst-settings-menu`)[0];
    let i, type;
    i = 1;
    for (type in shared.esgst.features) {
      if (shared.esgst.features.hasOwnProperty(type)) {
        if (type !== `trades` || gSettings.esgst_st || gSettings.esgst_sgtools) {
          let id, j, section, title, isNew = false;
          title = type.replace(/^./, m => {
            return m.toUpperCase()
          });
          section = this.createMenuSection(SMMenu, null, i, title, type);
          j = 1;
          for (id in shared.esgst.features[type].features) {
            if (shared.esgst.features[type].features.hasOwnProperty(id)) {
              if (id === `common`) {
                continue;
              }
              let feature, ft;
              feature = shared.esgst.features[type].features[id];
              if (!feature.sg && (((feature.sgtools && !gSettings.esgst_sgtools) || (feature.st && !gSettings.esgst_st)) && id !== `esgst`)) {
                continue;
              }
              ft = this.getSMFeature(feature, id, j, popup);
              if (ft) {
                if (ft.isNew) {
                  isNew = true;
                }
                section.lastElementChild.appendChild(ft.menu);
                j += 1;
              }
            }
          }
          if (isNew) {
            shared.common.createElements(section.firstElementChild.lastElementChild, `afterBegin`, [{
              attributes: {
                class: `esgst-bold esgst-red esgst-new-indicator`,
                title: `There is a new feature/option in this section`
              },
              type: `span`,
              children: [{
                attributes: {
                  class: `fa fa-star`
                },
                type: `i`
              }]
            }]);
          }
          i += 1;
        }
      }
    }
    const elementOrdering = this.createMenuSection(SMMenu, null, i, `Element Ordering`, `element_ordering`);
    this.setElementOrderingSection(elementOrdering.lastElementChild);
    i += 1;
    const permissionsSection = this.createMenuSection(SMMenu, null, i, `Permissions`, `permissions`);
    this.setPermissionsSection(permissionsSection.lastElementChild);
    i += 1;
    this.createMenuSection(SMMenu, [{
      attributes: {
        class: `esgst-steam-api-key`,
        type: `text`
      },
      type: `input`
    }, {
      attributes: {
        class: `esgst-description`
      },
      type: `div`,
      children: [{
        text: `This is optional for syncing owned games faster and required for syncing alt accounts. Get a Steam API Key `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-bold`,
          href: `https://steamcommunity.com/dev/apikey`,
          target: `_blank`
        },
        text: `here`,
        type: `a`
      }, {
        text: `. You can enter any domain in there, it is irrelevant, for example, "https://www.steamgifts.com".`,
        type: `node`
      }]
    }], i, `Steam API Key`, `steam_api_key`);
    SMAPIKey = /** @type {HTMLInputElement} */ Context.getElementsByClassName(`esgst-steam-api-key`)[0];
    let key = gSettings.steamApiKey;
    if (key) {
      SMAPIKey.value = key;
    }
    SMAPIKey.addEventListener(`input`, () => {
      // noinspection JSIgnoredPromiseFromCall
      this.preSave(`steamApiKey`, SMAPIKey.value);
    });
    if (shared.esgst.parameters.esgst === `settings` && shared.esgst.parameters.id) {
      this.loadFeatureDetails(shared.esgst.parameters.id, popup && popup.scrollable.offsetTop);
    }
    if (isPopup) {
      popup.open();
    }

    newIndicators = document.querySelectorAll(`.esgst-new-indicator`);
    if (newIndicators.length) {
      dismissAllButton.classList.remove(`esgst-hidden`);
    }
  }

  loadFeatureDetails(id, offset, event) {
    if (!offset) {
      offset = 0;
    }
    if (!id) {
      if (event.target.matches(`.esgst-settings-feature`)) {
        id = event.target.getAttribute(`data-id`);
      } else {
        return;
      }
    }
    const feature = shared.esgst.featuresById[id];
    const url = `${shared.esgst.settingsUrl}&id=${id}`;
    const items = [{
      check: true,
      content: [...(Array.isArray(feature.name) ? feature.name : [feature.name])],
      name: `Name`
    }, {
      check: true,
      content: [
        url,
        [`i`, { 'data-clipboard-text': url, class: `icon_to_clipboard fa fa-fw fa-copy` }]
      ],
      name: `Link`
    }, {
      check: feature.guideUrl,
      content: [
        [`a`,  { href: `${feature.guideUrl}?esgst=guide&id=${id}` }, `${feature.guideUrl}?esgst=guide&id=${id}`]
      ],
      name: `Guide`
    }];
    let sgContext, stContext, sgtoolsContext;
    if (feature.sg) {
      const value = gSettings[`${id}_sg`] || (gSettings.full[`${id}_sg`] || shared.common.getFeaturePath(feature, id, `sg`)).enabled;
      sgContext = shared.common.createElements_v2([[`div`]]).firstElementChild;
      const sgSwitch = new ToggleSwitch(sgContext, null, true, gSettings.esgst_st || gSettings.esgst_sgtools ? `SteamGifts` : ``, true, false, null, value);
      feature.sgFeatureSwitch = sgSwitch;
      sgSwitch.onEnabled = () => {
        if (feature.conflicts) {
          for (const conflictId of feature.conflicts) {
            const setting = gSettings[`${conflictId}_sg`];
            if ((typeof setting === `object` && setting.enabled) || setting) {
              sgSwitch.disable(true);
              new Popup({
                addScrollable: true,
                icon: `fa-exclamation`,
                isTemp: true,
                title: `This feature conflicts with ${shared.common.getFeatureName(null, conflictId)}. While that feature is enabled, this feature cannot be enabled.`
              }).open();
              return;
            }
          }
        }
        this.preSave(`${id}_sg`, true);
        if (feature.sgSwitch) {
          feature.sgSwitch.enable(true);
        }
        if (feature.theme) {
          if (id === `customTheme`) {
            shared.common.setTheme();
          } else {
            shared.common.updateTheme(id);
          }
        }
        shared.common.createElements_v2(document.querySelector(`#esgst-paths-sg`), `inner`, [
          this.openPathsPopup(feature, id, `sg`)
        ]);
      };
      sgSwitch.onDisabled = async () => {
        this.preSave(`${id}_sg`, false);
        if (feature.sgSwitch) {
          feature.sgSwitch.disable(true);
        }
        if (feature.theme) {
          if (id === `customTheme`) {
            shared.common.delLocalValue(`customTheme`);
          } else {
            shared.common.delLocalValue(`theme`);
            await shared.common.delValue(id);
          }
          shared.common.setTheme();
        }
        shared.common.createElements_v2(document.querySelector(`#esgst-paths-sg`), `inner`, [
          this.openPathsPopup(feature, id, `sg`)
        ]);
      };
    }
    if (feature.st && (gSettings.esgst_st || id === `esgst`)) {
      const value = gSettings[`${id}_st`] || (gSettings.full[`${id}_st`] || shared.common.getFeaturePath(feature, id, `st`)).enabled;
      stContext = shared.common.createElements_v2([[`div`]]).firstElementChild;
      const stSwitch = new ToggleSwitch(stContext, null, true, `SteamTrades`, false, true, null, value);
      feature.stFeatureSwitch = stSwitch;
      stSwitch.onEnabled = () => {
        if (feature.conflicts) {
          for (const conflictId of feature.conflicts) {
            const setting = gSettings[`${conflictId}_st`];
            if ((typeof setting === `object` && setting.enabled) || setting) {
              stSwitch.disable(true);
              new Popup({
                addScrollable: true,
                icon: `fa-exclamation`,
                isTemp: true,
                title: `This feature conflicts with ${shared.common.getFeatureName(null, conflictId)}. While that feature is enabled, this feature cannot be enabled.`
              }).open();
              return;
            }
          }
        }
        this.preSave(`${id}_st`, true);
        if (feature.stSwitch) {
          feature.stSwitch.enable(true);
        }
        if (feature.theme) {
          if (id === `customTheme`) {
            shared.common.setTheme();
          } else {
            shared.common.updateTheme(id);
          }
        }
        shared.common.createElements_v2(document.querySelector(`#esgst-paths-st`), `inner`, [
          this.openPathsPopup(feature, id, `st`)
        ]);
      };
      stSwitch.onDisabled = async () => {
        this.preSave(`${id}_st`, false);
        if (feature.stSwitch) {
          feature.stSwitch.disable(true);
        }
        if (feature.theme) {
          if (id === `customTheme`) {
            shared.common.delLocalValue(`customTheme`);
          } else {
            shared.common.delLocalValue(`theme`);
            await shared.common.delValue(id);
          }
          shared.common.setTheme();
        }
        shared.common.createElements_v2(document.querySelector(`#esgst-paths-st`), `inner`, [
          this.openPathsPopup(feature, id, `st`)
        ]);
      };
    }
    if (feature.sgtools && (gSettings.esgst_sgtools || id === `esgst`)) {
      const value = gSettings[`${id}_sgtools`] || (gSettings.full[`${id}_sgtools`] || shared.common.getFeaturePath(feature, id, `sgtools`)).enabled;
      sgtoolsContext = shared.common.createElements_v2([[`div`]]).firstElementChild;
      const sgtoolsSwitch = new ToggleSwitch(sgtoolsContext, null, true, `SGTools`, true, false, null, value);
      feature.sgtoolsFeatureSwitch = sgtoolsSwitch;
      sgtoolsSwitch.onEnabled = () => {
        if (feature.conflicts) {
          for (const conflictId of feature.conflicts) {
            const setting = gSettings[`${conflictId}_sgtools`];
            if ((typeof setting === `object` && setting.enabled) || setting) {
              sgtoolsSwitch.disable(true);
              new Popup({
                addScrollable: true,
                icon: `fa-exclamation`,
                isTemp: true,
                title: `This feature conflicts with ${shared.common.getFeatureName(null, conflictId)}. While that feature is enabled, this feature cannot be enabled.`
              }).open();
              return;
            }
          }
        }
        this.preSave(`${id}_sgtools`, true);
        if (feature.sgtoolsSwitch) {
          feature.sgtoolsSwitch.enable(true);
        }
        if (feature.theme) {
          if (id === `customTheme`) {
            shared.common.setTheme();
          } else {
            shared.common.updateTheme(id);
          }
        }
        shared.common.createElements_v2(document.querySelector(`#esgst-paths-sgtools`), `inner`, [
          this.openPathsPopup(feature, id, `sgtools`)
        ]);
      };
      sgtoolsSwitch.onDisabled = async () => {
        this.preSave(`${id}_sgtools`, false);
        if (feature.sgtoolsSwitch) {
          feature.sgtoolsSwitch.disable(true);
        }
        if (feature.theme) {
          if (id === `customTheme`) {
            shared.common.delLocalValue(`customTheme`);
          } else {
            shared.common.delLocalValue(`theme`);
            await shared.common.delValue(id);
          }
          shared.common.setTheme();
        }
        shared.common.createElements_v2(document.querySelector(`#esgst-paths-sgtools`), `inner`, [
          this.openPathsPopup(feature, id, `sgtools`)
        ]);
      };
    }
    items.push({
      check: true,
      content: [sgContext, stContext, sgtoolsContext],
      name: `Enable/Disable`
    });
    if (feature.description) {
      items.push({
        check: true,
        content: [
          [`div`, { class: `markdown` }, JSON.parse(JSON.stringify(feature.description).replace(/\[id=(.+?)]/g, shared.common.getFeatureName.bind(shared.common)))]
        ],
        name: typeof feature.description === `string` ? `Description` : `What does it do?`
      });
    }
    const additionalOptions = this.getSmFeatureAdditionalOptions(feature, id);
    if (additionalOptions.length) {
      items.push({
        check: true,
        content: additionalOptions,
        name: `Additional Options`
      });
    }
    if (feature.sync) {
      items.push({
        check: true,
        content: [
          [`p`, [
            `This feature requires the following data to be synced in order to function properly: `,
            [`strong`, feature.sync]
          ]],
          [`br`],
          [`p`, [
            `To sync these now, click `,
            [`a`, { class: `table__column__secondary-link`, href: `${shared.esgst.syncUrl}&autoSync=true&${feature.syncKeys.map(x => `${x}=1`).join(`&`)}`, target: `_blank` }, `here`],
            `.`
          ]]
        ],
        name: `Sync Requirements`
      });
    }
    if (feature.sg && (!feature.sgPaths || typeof feature.sgPaths !== `string`)) {
      items.push({
        check: true,
        content: [
          this.openPathsPopup(feature, id, `sg`)
        ],
        // @ts-ignore
        id: `esgst-paths-sg`,
        name: `Where to run it on SteamGifts?`
      });
    }
    if (feature.st && gSettings.esgst_st && (!feature.stPaths || typeof feature.stPaths !== `string`)) {
      items.push({
        check: true,
        content: [
          this.openPathsPopup(feature, id, `st`)
        ],
        // @ts-ignore
        id: `esgst-paths-st`,
        name: `Where to run it on SteamTrades?`
      });
    }
    if (feature.sgtools && gSettings.esgst_sgtools && (!feature.sgtoolsPaths || typeof feature.sgtoolsPaths !== `string`)) {
      items.push({
        check: true,
        content: [
          this.openPathsPopup(feature, id, `sgtools`)
        ],
        // @ts-ignore
        id: `esgst-paths-sgtools`,
        name: `Where to run it on SGTools?`
      });
    }
    const context = document.querySelector(`.esgst-settings-menu-feature`);
    if (!context.classList.contains(`esgst-menu-split-fixed`)) {
      context.style.maxHeight = `${context.closest(`.esgst-menu-layer`).offsetHeight - 24}px`;
    }
    context.innerHTML = `Click on a feature/option to manage it here.`;
    shared.common.createFormRows(context, `beforeEnd`, { items });
  }

  setElementOrderingSection(context) {
    const obj = {
      elementOrdering: true,
      outerWrap: shared.common.createElements(context, `beforeEnd`, [{
        attributes: {
          class: `esgst-element-ordering-container`
        },
        type: `div`
      }])
    };
    const obj_gv = {
      elementOrdering: true,
      outerWrap: shared.common.createElements(context, `beforeEnd`, [{
        attributes: {
          class: `esgst-element-ordering-container`
        },
        type: `div`
      }])
    };
    const items = [{
      includeGridView: true,
      group: `giveaways`,
      id: `gc_categories`,
      key: `gcPanel`,
      name: `Game Categories`,
      labels: {
        gc_fcv: `Full CV`,
        gc_rcv: `Reduced CV`,
        gc_ncv: `No CV`,
        gc_h: `Hidden`,
        gc_i: `Ignored`,
        gc_o: `Owned`,
        gc_w: `Wishlisted`,
        gc_f: `Followed`,
        gc_pw: `Previously Won`,
        gc_a: `Achievements`,
        gc_bd: `Banned`,
        gc_bvg: `Barter.vg`,
        gc_sp: `Singleplayer`,
        gc_mp: `Multiplayer`,
        gc_sc: `Steam Cloud`,
        gc_tc: `Trading Cards`,
        gc_l: `Linux`,
        gc_m: `Mac`,
        gc_ea: `Early Access`,
        gc_lg: `Learning`,
        gc_rm: `Removed`,
        gc_dlc: `DLC`,
        gc_p: `Package`,
        gc_gi: `Giveaway Info`,
        gc_r: `Rating`,
        gc_hltb: `HLTB`,
        gc_rd: `Release Date`,
        gc_g: `Genres`
      }
    }, {
      includeGridView: true,
      group: `giveaways`,
      id: `giveawayHeading`,
      key: `heading`,
      name: `Giveaway Heading`,
      labels: {
        gr: `Giveaway Recreator`,
        gb: `Giveaway Bookmarks`,
        gf: `Giveaway Filters`,
        egh: `Entered Game Highlighter`,
        name: `Game Name`,
        points: `Points`,
        copies: `Copies`,
        steam: `Steam Link`,
        search: `Search Link`,
        hideGame: `Hide Game`,
        gt: `Game Tags`
      }
    }, {
      group: `giveaways`,
      id: `giveawayColumns`,
      key: `columns`,
      name: `Giveaway Columns`,
      labels: {
        ged: `Giveaway Encrypter/Decrypter`,
        endTime: `End Time`,
        winners: `Winners`,
        startTime: `Start Time`,
        touhou: `Touhou`,
        inviteOnly: `Invite Only`,
        whitelist: `Whitelist`,
        group: `Group`,
        regionRestricted: `Region Restricted`,
        level: `Level`
      }
    }, {
      isGridView: true,
      group: `giveaways_gv`,
      id: `giveawayColumns_gv`,
      key: `gvIcons`,
      name: `Giveaway Columns`,
      labels: {
        sgTools: `SGTools`,
        ged: `Giveaway Encrypter/Decrypter`,
        time: `End/Start Time`,
        touhou: `Touhou`,
        inviteOnly: `Invite Only`,
        whitelist: `Whitelist`,
        group: `Group`,
        regionRestricted: `Region Restricted`,
        level: `Level`
      }
    }, {
      group: `giveaways`,
      id: `giveawayPanel`,
      key: `panel`,
      name: `Giveaway Panel`,
      labels: {
        ttec: `Time To Enter Calculator`,
        gwc: `Giveaway Winning Chance`,
        gwr: `Giveaway Winning Ratio`,
        gptw: `Giveaway Points To Win`,
        gp: `Giveaway Popup`,
        elgb: `Enter/Leave Giveaway Button`,
        sgTools: `SGTools`
      }
    }, {
      isGridView: true,
      group: `giveaways_gv`,
      id: `giveawayPanel_gv`,
      key: `panel`,
      name: `Giveaway Panel`,
      labels: {
        ttec: `Time To Enter Calculator`,
        gwc: `Giveaway Winning Chance`,
        gwr: `Giveaway Winning Ratio`,
        gptw: `Giveaway Points To Win`,
        gp: `Giveaway Popup`,
        elgb: `Enter/Leave Giveaway Button`
      }
    }, {
      includeGridView: true,
      group: `giveaways`,
      id: `giveawayLinks`,
      key: `links`,
      name: `Giveaway Links`,
      labels: {
        entries: `Entries`,
        winners_count: `Winners Count`,
        comments: `Comments`
      }
    }, {
      includeGridView: true,
      group: `giveaways`,
      id: `giveawayExtraPanel`,
      key: `extraPanel`,
      name: `Giveaway Extra Panel`,
      labels: {
        ggl: `Giveaway Groups Loader`
      }
    }, {
      group: `mainPageHeading`,
      id: `leftButtonIds`,
      key: `leftButtons`,
      name: `Left Main Page Heading Buttons (Hidden)`,
      tooltip: `Moving an element to this group will hide it from the main page heading. It will be accessible by clicking on the button with the vertical ellipsis located at the left side of the heading.`,
      labels: {}
    }, {
      group: `mainPageHeading`,
      id: `rightButtonIds`,
      key: `rightButtons`,
      name: `Right Main Page Heading Buttons (Hidden)`,
      tooltip: `Moving an element to this group will hide it from the main page heading. It will be accessible by clicking on the button with the vertical ellipsis located at the  right side of the heading.`,
      labels: {}
    }, {
      group: `mainPageHeading`,
      id: `leftMainPageHeadingIds`,
      key: `leftMainPageHeadingButtons`,
      name: `Left Main Page Heading Buttons`,
      labels: {
        aic: `Attached Images Carousel`,
        as: `Archive Searcher`,
        cec: `Comment/Entry Checker`,
        cf: `Comment Filters`,
        cs: `Comment Searcher`,
        ctGo: `Comment Tracker (Go To Unread)`,
        ctRead: `Comment Tracker (Mark As Read)`,
        ctUnread: `Comment Tracker (Mark As Unread)`,
        df: `Discussion Filters`,
        tf: `Trade Filters`,
        gpf: `Group Filters`,
        ds: `Discussion Sorter`,
        gas: `Giveaway Sorter`,
        ge: `Giveaway Extractor`,
        gf: `Giveaway Filters`,
        glwc: `Group Library/Wishlist Checker`,
        gts: `Giveaway Templates`,
        gv: `Grid View`,
        hgm: `Hidden Games Manager`,
        mpp: `Main Post Popup`,
        namwc: `Not Activated/Multiple Wins Checker`,
        rbp: `Reply Box Popup`,
        sks: `Sent Keys Searcher`,
        tb: `Trade Bumper`,
        ugs: `Unsent Gifts Sender`,
        usc: `User Suspension Checker`,
        ust: `User Suspension Tracker`,
        wbc: `Whitelist/Blacklist Checker`,
        wbm: `Whitelist/Blacklist Manager`,
        wbsAsc: `Whitelist/Blacklist Sorter (Ascending)`,
        wbsDesc: `Whitelist/Blacklist Sorter (Descending)`
      }
    }, {
      group: `mainPageHeading`,
      id: `rightMainPageHeadingIds`,
      key: `rightMainPageHeadingButtons`,
      name: `Right Main Page Heading Buttons`,
      labels: {
        esContinuous: `Endless Scrolling (Continuously Load)`,
        esNext: `Endless Scrolling (Load Next),`,
        esResume: `Endless Scrolling (Resume)`,
        esPause: `Endless Scrolling (Pause)`,
        esRefresh: `Endless Scrolling (Refresh)`,
        esRefreshAll: `Endless Scrolling (Refresh All)`,
        mm: `Multi-Manager`,
        stbb: `Scroll To Bottom Button`,
        sttb: `Scroll To Top Button`
      }
    }];
    for (const item of items) {
      const children = [];
      for (const id in item.labels) {
        if (!item.labels.hasOwnProperty(id)) {
          continue;
        }
        children.push({
          attributes: {
            [`data-draggable-id`]: id,
            [`data-draggable-group`]: item.group
          },
          text: item.labels[id],
          type: `div`
        });
      }
      const section = shared.common.createElements((item.isGridView ? obj_gv : obj).outerWrap, `beforeEnd`, [{
        text: `${item.name}${item.isGridView ? ` (Grid View)` : ``}`,
        type: `strong`
      }, item.tooltip ? {
        attributes: {
          class: `fa fa-question-circle`,
          title: item.tooltip
        },
        type: `i`
      } : null, {
        attributes: {
          class: `esgst-element-ordering-box`
        },
        type: `div`,
        children
      }]);
      (item.isGridView ? obj_gv : obj).outerWrap.insertBefore(new ButtonSet({
        color1: `grey`,
        color2: `grey`,
        icon1: `fa-undo`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Reset`,
        title2: `Resetting`,
        callback1: this.resetElementOrdering.bind(this, item.id, obj, obj_gv)
      }).set, section);
      (item.isGridView ? obj_gv : obj)[item.key] = section;
      section.addEventListener(`dragenter`, shared.common.draggable_enter.bind(shared.common, {
        context: section,
        item: {
          outerWrap: section
        }
      }));
      shared.common.draggable_set({
        context: section,
        id: item.id,
        item: {
          outerWrap: section
        },
        onDragEnd: obj => {
          for (const key in obj) {
            this.preSave(key, obj[key]);
          }
        }
      });
      if (item.includeGridView) {
        const children_gv = [];
        for (const id in item.labels) {
          if (!item.labels.hasOwnProperty(id)) {
            return;
          }
          children_gv.push({
            attributes: {
              [`data-draggable-id`]: id,
              [`data-draggable-group`]: `${item.group}_gv`
            },
            text: item.labels[id],
            type: `div`
          });
        }
        const section_gv = shared.common.createElements(obj_gv.outerWrap, `beforeEnd`, [{
          text: `${item.name} (Grid View)`,
          type: `strong`
        }, {
          attributes: {
            class: `esgst-element-ordering-box`
          },
          type: `div`,
          children: children_gv
        }]);
        obj_gv.outerWrap.insertBefore(new ButtonSet({
          color1: `grey`,
          color2: `grey`,
          icon1: `fa-undo`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `Reset`,
          title2: `Resetting`,
          callback1: this.resetElementOrdering.bind(this, `${item.id}_gv`, obj, obj_gv)
        }).set, section_gv);
        obj_gv[item.key] = section_gv;
        section_gv.addEventListener(`dragenter`, shared.common.draggable_enter.bind(shared.common, {
          context: section_gv,
          item: {
            outerWrap: section_gv
          }
        }));
        shared.common.draggable_set({
          context: section_gv,
          id: `${item.id}_gv`,
          item: {
            outerWrap: section_gv
          },
          onDragEnd: obj => {
            for (const key in obj) {
              this.preSave(key, obj[key]);
            }
          }
        });
      }
    }
    shared.esgst.modules.giveaways.giveaways_reorder(obj);
    shared.esgst.modules.giveaways.giveaways_reorder(obj_gv);
    shared.common.reorderButtons(obj);
  }

  async resetElementOrdering(id, obj, obj_gv) {
    this.preSave(id, shared.esgst.defaultValues[id]);
    shared.esgst.modules.giveaways.giveaways_reorder(obj);
    shared.esgst.modules.giveaways.giveaways_reorder(obj_gv);
    shared.common.reorderButtons(obj);
  }

  async setPermissionsSection(context) {
    const table = new Table([
      [`Granted`, { size: `fill`, value: `Permission` }, { size: `fill`, value: `Usage` }]
    ]);
    context.appendChild(table.table);
    for (const key in permissions.permissions) {
      const permission = permissions.permissions[key];
      const toggleSwitch = new ToggleSwitch(null, null, true, ``, false, false, ``, await permissions.contains([key]));
      toggleSwitch.onEnabled = () => {
        this.grantedPermissions.add(key);
        this.deniedPermissions.delete(key);
      };
      toggleSwitch.onDisabled = () => {
        this.grantedPermissions.delete(key);
        this.deniedPermissions.add(key);
      };
      const permissionArray = [];
      for (const value of permission.values) {
        permissionArray.push(
          value,
          [`br`]
        );
      }
      const usageArray = [];
      for (const key in permission.messages) {
        usageArray.push(
          permission.messages[key],
          [`br`],
          [`br`]
        );
      }
      table.addRow([
        [ toggleSwitch.switch ],
        { alignment: `left`, size: `fill`, value: permissionArray },
        { alignment: `left`, size: `fill`, value: usageArray }
      ]);
    }
  }

  openPathsPopup(feature, id, name) {
    feature.id = id;
    let obj = {
      exclude: { extend: this.addPath.bind(this) },
      excludeItems: [],
      include: { extend: this.addPath.bind(this) },
      includeItems: [],
      name: name
    };
    const context = shared.common.createElements_v2([
      [`div`, { class: `esgst-bold` }, [
        `Run it here: `,
        [`i`, { class: `fa fa-question-circle`, title: `Select the places where you want the feature to run. If you cannot find the place you want, select "Custom" and enter the place manually (you have to use regular expressions).` }]
      ]],
      [`div`, obj.include],
      [`div`, { class: `esgst-button-group` }, [
        new ButtonSet({
          color1: `grey`,
          color2: ``,
          icon1: `fa-plus-circle`,
          icon2: ``,
          title1: `Add New`,
          title2: ``,
          callback1: () => obj.include.extend(feature, `include`, obj, { enabled: 1, pattern: `` }, true)
        }).set
      ]],
      [`div`, { class: `esgst-bold` }, [
        `Do NOT run it here: `,
        [`i`, { class: `fa fa-question-circle`, title: `Select the places where you don't want the feature to run. If you cannot find the place you want, select "Custom" and enter the place manually (you have to use regular expressions).` }]
      ]],
      [`div`, obj.exclude],
      [`div`, { class: `esgst-button-group` }, [
        new ButtonSet({
          color1: `grey`,
          color2: ``,
          icon1: `fa-plus-circle`,
          icon2: ``,
          title1: `Add New`,
          title2: ``,
          callback1: () => obj.exclude.extend(feature, `exclude`, obj, { enabled: 1, pattern: `` }, true)
        }).set
      ]]
    ]);
    obj.setting = gSettings.full[`${id}_${obj.name}`] || shared.common.getFeaturePath(feature, id, obj.name);
    obj.setting.include.forEach(path => obj.include.extend(feature, `include`, obj, path));
    obj.setting.exclude.forEach(path => obj.exclude.extend(feature, `exclude`, obj, path));
    return context;
  }

  addPath(context, feature, key, obj, path, userAdded) {
    let item = {};
    item.container = shared.common.createElements(context, `beforeEnd`, [{
      type: `div`
    }]);
    item.switch = new ToggleSwitch(item.container, null, true, ``, false, false, null, path.enabled);
    let found = false;
    item.switch.onChange = () => {
      this.savePaths(feature.id, obj);
    };
    item.select = shared.common.createElements_v2(item.container, `beforeEnd`, [
      [`select`, { class: `esgst-switch-input esgst-switch-input-large` }, [
        ...(shared.esgst.paths[obj.name].filter(x => !feature[`${obj.name}Paths`] || x.name === `Everywhere` || x.name.match(feature[`${obj.name}Paths`])).map(x =>
          [`option`, Object.assign({ value: x.pattern }, x.pattern === path.pattern && (found = true) ? { selected: true } : null), x.name]
        )),
        feature[`${obj.name}Paths`] ? null : [`option`, Object.assign({ value: `custom` }, found ? null : { selected: true }), `Custom`]
      ]]
    ]);
    item.input = shared.common.createElements_v2(item.container, `beforeEnd`, [
      [`input`, Object.assign({ class: `esgst-switch-input esgst-switch-input-large`, type: `text` }, item.select.value === `custom` ? null : { disabled: true })]
    ]);
    item.select.addEventListener(`change`, () => {
      if (item.select.value === `custom`) {
        item.input.disabled = false;
        item.input.value = ``;
      } else {
        item.input.disabled = true;
        item.input.value = item.select.value;
      }
      this.savePaths(feature.id, obj);
    });
    item.input.value = path.pattern;
    item.input.addEventListener(`input`, () => {
      this.validatePathRegex(item);
      this.savePaths(feature.id, obj);
    });
    shared.common.createElements(item.container, `beforeEnd`, [{
      attributes: {
        class: `fa fa-times-circle esgst-clickable`,
        title: `Remove`
      },
      type: `i`
    }]).addEventListener(`click`, () => this.removePath(feature, item, key, obj));
    item.invalid = shared.common.createElements(item.container, `beforeEnd`, [{
      attributes: {
        class: `fa fa-exclamation esgst-hidden esgst-red`,
        title: `Invalid Regular Expression`
      },
      type: `i`
    }]);
    obj[`${key}Items`].push(item);
    if (key === `include` && feature.includeOptions) {
      item.options = [];
      const optionsContainer = shared.common.createElements(item.container, `beforeEnd`, [{
        attributes: {
          class: `esgst-form-row-indent`
        },
        type: `div`
      }]);
      for (const option of feature.includeOptions) {
        const optionObj = {
          id: option.id,
          switch: new ToggleSwitch(optionsContainer, null, true, option.name, false, false, null, !!(path.options && path.options[option.id]))
        };
        optionObj.switch.onChange = () => this.savePaths(feature.id, obj);
        item.options.push(optionObj);
      }
    }
    if (userAdded) {
      this.savePaths(feature.id, obj);
    }
  }

  removePath(feature, item, key, obj) {
    let i = obj[`${key}Items`].length - 1;
    if (i === 0 && key === `include`) {
      window.alert(`At least 1 place is required!`);
      return;
    }
    while (i > -1 && obj[`${key}Items`][i].input.value !== item.input.value) i--;
    if (i > -1) {
      obj[`${key}Items`].splice(i, 1);
    }
    item.container.remove();
    this.savePaths(feature.id, obj);
  }

  validatePathRegex(item) {
    item.invalid.classList.add(`esgst-hidden`);
    try {
      new RegExp(item.input.value);
    } catch (error) {
      window.console.log(error);
      item.invalid.classList.remove(`esgst-hidden`);
    }
  }

  async savePaths(id, obj) {
    obj.setting.include = [];
    obj.setting.exclude = [];
    for (const item of obj.includeItems) {
      const setting = {
        enabled: item.switch.value ? 1 : 0,
        pattern: item.input.value
      };
      if (item.options) {
        setting.options = {};
        for (const option of item.options) {
          setting.options[option.id] = option.switch.value ? 1 : 0;
        }
      }
      obj.setting.include.push(setting);
    }
    for (const item of obj.excludeItems) {
      obj.setting.exclude.push({
        enabled: item.switch.value ? 1 : 0,
        pattern: item.input.value
      });
    }
    this.preSave(`${id}_${obj.name}`, obj.setting);
  }

  dismissNewOption(id, event) {
    event.currentTarget.remove();
    const dismissedOptions = gSettings.dismissedOptions;
    if (dismissedOptions.indexOf(id) < 0) {
      dismissedOptions.push(id);
      // noinspection JSIgnoredPromiseFromCall
      this.preSave(`dismissedOptions`, dismissedOptions);
    }
  }

  getSMFeature(feature, id, number, popup) {
    const menu = document.createElement(`div`);
    menu.id = `esgst_${id}`;
    shared.common.createElements(menu, `beforeEnd`, [{
      attributes: {
        class: `esgst-sm-small-number esgst-form-heading-number`
      },
      text: `${number}.`,
      type: `div`
    }]);
    let isMainNew = gSettings.dismissedOptions.indexOf(id) < 0 && !utils.isSet(shared.esgst.settings[`${id}_sg`]) && !utils.isSet(shared.esgst.settings[`${id}_st`]) && !utils.isSet(shared.esgst.settings[`${id}_sgtools`]);
    if (isMainNew) {
      feature.isNew = true;
      shared.common.createElements(menu.firstElementChild, `afterEnd`, [{
        attributes: {
          class: `esgst-bold esgst-red esgst-clickable esgst-new-indicator`,
          title: `This is a new feature/option. Click to dismiss.`
        },
        text: `[NEW]`,
        type: `span`
      }]).addEventListener(`click`, event => this.dismissNewOption(id, event));
    }
    let isHidden = true;
    let sgContext, stContext, sgtoolsContext;
    let collapseButton, isExpanded, subMenu;
    if (feature.sg) {
      const value = gSettings[`${id}_sg`] || (gSettings.full[`${id}_sg`] || shared.common.getFeaturePath(feature, id, `sg`)).enabled;
      if (value) {
        isHidden = false;
      }
      sgContext = shared.common.createElements_v2([[`div`]]).firstElementChild;
      const sgSwitch = new ToggleSwitch(sgContext, null, true, gSettings.esgst_st || gSettings.esgst_sgtools ? `[SG]` : ``, true, false, null, value);
      feature.sgSwitch = sgSwitch;
      sgSwitch.onEnabled = () => {
        if (feature.conflicts) {
          for (const conflictId of feature.conflicts) {
            const setting = gSettings[`${conflictId}_sg`];
            if ((typeof setting === `object` && setting.enabled) || setting) {
              sgSwitch.disable(true);
              new Popup({
                addScrollable: true,
                icon: `fa-exclamation`,
                isTemp: true,
                title: `This feature conflicts with ${shared.common.getFeatureName(null, conflictId)}. While that feature is enabled, this feature cannot be enabled.`
              }).open();
              return;
            }
          }
        }
        if (feature.permissions) {
          this.preSavePermissions(feature.permissions);
        }
        this.loadFeatureDetails(id, popup && popup.scrollable.offsetTop);
        if (feature.sgFeatureSwitch) {
          feature.sgFeatureSwitch.enable();
        } else {
          this.preSave(`${id}_sg`, true);
        }
        if (subMenu.classList.contains(`esgst-hidden`)) {
          this.expandOptions(collapseButton, id, subMenu);
          isExpanded = true;
        }
        if (feature.dependencies) {
          shared.common.createConfirmation([
            `This feature depends on the following features to work properly: `,
            [`br`],
            [`br`],
            ...feature.dependencies.map(x => `"${shared.common.getFeatureName(null, x)}"::ESGST::["br"]::ESGST::`).join(``).split(`::ESGST::`).filter(x => x).map(x => JSON.parse(x)),
            [`br`],
            `Would you like ESGST to automatically enable these features now if they're not already enabled?`
          ], () => this.enableDependencies(feature.dependencies, `sg`));
        }
      };
      sgSwitch.onDisabled = async () => {
        this.loadFeatureDetails(id, popup && popup.scrollable.offsetTop);
        if (feature.sgFeatureSwitch) {
          feature.sgFeatureSwitch.disable();
        } else {
          this.preSave(`${id}_sg`, false);
        }
        if (feature.stSwitch && !feature.stSwitch.value) {
          this.collapseOptions(collapseButton, id, subMenu);
          isExpanded = false;
        }
      };
    }
    if (feature.st && (gSettings.esgst_st || id === `esgst`)) {
      const value = gSettings[`${id}_st`] || (gSettings.full[`${id}_st`] || shared.common.getFeaturePath(feature, id, `st`)).enabled;
      if (value) {
        isHidden = false;
      }
      stContext = shared.common.createElements_v2([[`div`]]).firstElementChild;
      const stSwitch = new ToggleSwitch(stContext, null, true, `[ST]`, false, true, null, value);
      feature.stSwitch = stSwitch;
      stSwitch.onEnabled = () => {
        if (feature.conflicts) {
          for (const conflictId of feature.conflicts) {
            const setting = gSettings[`${conflictId}_st`];
            if ((typeof setting === `object` && setting.enabled) || setting) {
              stSwitch.disable(true);
              new Popup({
                addScrollable: true,
                icon: `fa-exclamation`,
                isTemp: true,
                title: `This feature conflicts with ${shared.common.getFeatureName(null, conflictId)}. While that feature is enabled, this feature cannot be enabled.`
              }).open();
              return;
            }
          }
        }
        if (feature.permissions) {
          this.preSavePermissions(feature.permissions);
        }
        this.loadFeatureDetails(id, popup && popup.scrollable.offsetTop);
        if (feature.stFeatureSwitch) {
          feature.stFeatureSwitch.enable();
        } else {
          this.preSave(`${id}_st`, true);
        }
        if (subMenu.classList.contains(`esgst-hidden`)) {
          this.expandOptions(collapseButton, id, subMenu);
          isExpanded = true;
        }
        if (feature.dependencies) {
          shared.common.createConfirmation([
            `This feature depends on the following features to work properly: `,
            [`br`],
            [`br`],
            ...feature.dependencies.map(x => `"${shared.common.getFeatureName(null, x)}"::ESGST::["br"]::ESGST::`).join(``).split(`::ESGST::`).filter(x => x).map(x => JSON.parse(x)),
            [`br`],
            `Would you like ESGST to automatically enable these features now if they're not already enabled?`
          ], () => this.enableDependencies(feature.dependencies, `st`));
        }
      };
      stSwitch.onDisabled = async () => {
        this.loadFeatureDetails(id, popup && popup.scrollable.offsetTop);
        if (feature.stFeatureSwitch) {
          feature.stFeatureSwitch.disable();
        } else {
          this.preSave(`${id}_st`, false);
        }
        if (feature.sgSwitch && !feature.sgSwitch.value) {
          this.collapseOptions(collapseButton, id, subMenu);
          isExpanded = false;
        }
      };
    }
    if (feature.sgtools && (gSettings.esgst_sgtools || id === `esgst`)) {
      const value = gSettings[`${id}_sgtools`] || (gSettings.full[`${id}_sgtools`] || shared.common.getFeaturePath(feature, id, `sgtools`)).enabled;
      if (value) {
        isHidden = false;
      }
      sgtoolsContext = shared.common.createElements_v2([[`div`]]).firstElementChild;
      const sgtoolsSwitch = new ToggleSwitch(sgtoolsContext, null, true, `[SGT]`, false, true, null, value);
      feature.sgtoolsSwitch = sgtoolsSwitch;
      sgtoolsSwitch.onEnabled = () => {
        if (feature.conflicts) {
          for (const conflictId of feature.conflicts) {
            const setting = gSettings[`${conflictId}_sgtools`];
            if ((typeof setting === `object` && setting.enabled) || setting) {
              sgtoolsSwitch.disable(true);
              new Popup({
                addScrollable: true,
                icon: `fa-exclamation`,
                isTemp: true,
                title: `This feature conflicts with ${shared.common.getFeatureName(null, conflictId)}. While that feature is enabled, this feature cannot be enabled.`
              }).open();
              return;
            }
          }
        }
        if (feature.permissions) {
          this.preSavePermissions(feature.permissions);
        }
        this.loadFeatureDetails(id, popup && popup.scrollable.offsetTop);
        if (feature.sgtoolsFeatureSwitch) {
          feature.sgtoolsFeatureSwitch.enable();
        } else {
          this.preSave(`${id}_sgtools`, true);
        }
        if (subMenu.classList.contains(`esgst-hidden`)) {
          this.expandOptions(collapseButton, id, subMenu);
          isExpanded = true;
        }
        if (feature.dependencies) {
          shared.common.createConfirmation([
            `This feature depends on the following features to work properly: `,
            [`br`],
            [`br`],
            ...feature.dependencies.map(x => `"${shared.common.getFeatureName(null, x)}"::ESGST::["br"]::ESGST::`).join(``).split(`::ESGST::`).filter(x => x).map(x => JSON.parse(x)),
            [`br`],
            `Would you like ESGST to automatically enable these features now if they're not already enabled?`
          ], () => this.enableDependencies(feature.dependencies, `sgt`));
        }
      };
      sgtoolsSwitch.onDisabled = async () => {
        this.loadFeatureDetails(id, popup && popup.scrollable.offsetTop);
        if (feature.sgtoolsFeatureSwitch) {
          feature.sgtoolsFeatureSwitch.disable();
        } else {
          this.preSave(`${id}_sgtools`, false);
        }
        if (feature.sgtoolsSwitch && !feature.sgtoolsSwitch.value) {
          this.collapseOptions(collapseButton, id, subMenu);
          isExpanded = false;
        }
      };
    }
    shared.common.createElements_v2(menu, `beforeEnd`, [
      [`span`, [
        sgContext && sgContext.firstElementChild,
        stContext && stContext.firstElementChild,
        sgtoolsContext && sgtoolsContext.firstElementChild,
        [`a`, { class: `esgst-settings-feature table__column__secondary-link esgst-clickable `, 'data-id': id }, [
          ...(Array.isArray(feature.name) ? feature.name : [feature.name])
        ]]
      ]],
      [`div`, { class: `esgst-form-row-indent SMFeatures ${isHidden ? `esgst-hidden` : ``}` }]
    ]);
    subMenu = menu.lastElementChild;
    if (feature.features) {
      let i = 1;
      let isNew = false;
      for (const subId in feature.features) {
        if (!feature.features.hasOwnProperty(subId)) {
          continue;
        }
        const subFt = feature.features[subId];
        if (!subFt.sg && (((subFt.sgtools && !gSettings.esgst_sgtools) || (subFt.st && !gSettings.esgst_st)) && id !== `esgst`)) {
          continue;
        }
        const subFeature = this.getSMFeature(subFt, subId, i, popup);
        if (subFeature) {
          if (subFeature.isNew) {
            isNew = true;
          }
          subMenu.appendChild(subFeature.menu);
          i += 1;
        }
      }
      isMainNew = isMainNew || isNew;
      if (isNew) {
        shared.common.createElements(menu.firstElementChild, `afterEnd`, [{
          attributes: {
            class: `esgst-bold esgst-red esgst-new-indicator`,
            title: `There is a new feature/option in this section`
          },
          type: `span`,
          children: [{
            attributes: {
              class: `fa fa-star`
            },
            type: `i`
          }]
        }]);
      }      
      if (gSettings.makeSectionsCollapsible) {
        collapseButton = shared.common.createElements(menu, `afterBegin`, [{
          attributes: {
            class: `esgst-clickable`,
            style: `margin-right: 5px;`
          },
          type: `span`,
          children: [{
            attributes: {
              class: `fa fa-${gSettings[`collapse_${id}`] ? `plus` : `minus`}-square`,
              title: `${gSettings[`collapse_${id}`] ? `Expand` : `Collapse`} options`
            },
            type: `i`
          }]
        }]);
        if (gSettings[`collapse_${id}`]) {
          subMenu.classList.add(`esgst-hidden`);
          isExpanded = false;
        } else {
          isExpanded = true;
        }
        collapseButton.addEventListener(`click`, () => {
          if (isExpanded) {
            this.collapseOptions(collapseButton, id, subMenu);
          } else {
            this.expandOptions(collapseButton, id, subMenu);
          }
          isExpanded = !isExpanded;
        });
      }
    }
    return {
      isNew: isMainNew,
      menu
    };
  }

  collapseOptions(collapseButton, id, subMenu) {
    subMenu.classList.add(`esgst-hidden`);
    if (collapseButton) {
      shared.common.createElements(collapseButton, `inner`, [{
        attributes: {
          class: `fa fa-plus-square`,
          title: `Expand options`
        },
        type: `i`
      }]);
      this.preSave(`collapse_${id}`, true);
    }
  }

  expandOptions(collapseButton, id, subMenu) {
    subMenu.classList.remove(`esgst-hidden`);
    if (collapseButton) {
      shared.common.createElements(collapseButton, `inner`, [{
        attributes: {
          class: `fa fa-minus-square`,
          title: `Collapse options`
        },
        type: `i`
      }]);
      this.preSave(`collapse_${id}`, null);
    }
  }

  resetColor(hexInput, alphaInput, id, colorId) {
    const color = utils.rgba2Hex(shared.esgst.defaultValues[`${id}_${colorId}`]);
    hexInput.value = color.hex;
    alphaInput.value = color.alpha;
    this.preSave(`${id}_${colorId}`, utils.hex2Rgba(hexInput.value, alphaInput.value));
  }

  getSmFeatureAdditionalOptions(Feature, ID) {
    let items = [];
    if (ID === `ul`) {
      items.push(this.addUlMenuPanel(`ul_links`));
    } else if (ID === `gch`) {
      items.push(this.addGwcrMenuPanel(`gch_colors`, `copies`, true));
    } else if (ID === `glh`) {
      items.push(this.addGwcrMenuPanel(`glh_colors`, `level`, true, `10`));
    } else if (ID === `gwc`) {
      items.push(this.addGwcrMenuPanel(`gwc_colors`, `chance`));
    } else if (ID === `gwr`) {
      items.push(this.addGwcrMenuPanel(`gwr_colors`, `ratio`));
    } else if (ID === `gptw`) {
      items.push(this.addGwcrMenuPanel(`gptw_colors`, `points to win`));
    } else if (ID === `geth`) {
      items.push(this.addGwcrMenuPanel(`geth_colors`, `hours`));
    } else if (ID === `gc_r`) {
      items.push(this.addGcRatingPanel());
    } else if (ID === `gc_o_a`) {
      items.push(this.addGcAltMenuPanel());
    } else if (Feature.colors || Feature.background) {
      if (typeof Feature.background === `boolean`) {
        Feature.colors = {
          bgColor: `Background`
        };
      } else if (typeof Feature.colors === `boolean`) {
        Feature.colors = {
          color: `Text`,
          bgColor: `Background`
        };
      }
      const children = [];
      for (const id in Feature.colors) {
        const color = utils.rgba2Hex(gSettings[`${ID}_${id}`]);
        children.push(
          [`strong`, `${Feature.colors[id]}: `],
          [`br`],
          [`input`, { 'data-color-id': id, type: `color`, value: color.hex }],
          ` Opacity: `,
          [`input`, { max: `1.0`, min: `0.0`, step: `0.1`, type: `number`, value: color.alpha }],
          ` `,
          [`div`, { class: `form__saving-button esgst-sm-colors-default` }, `Reset`],
          [`br`]
        );
      }
      const context = shared.common.createElements_v2([
        [`div`, { class: `esgst-sm-colors` }, children]
      ]).firstElementChild;
      const elements = context.querySelectorAll(`[data-color-id]`);
      for (const hexInput of elements) {
        const colorId = hexInput.getAttribute(`data-color-id`);
        const alphaInput = hexInput.nextElementSibling;
        this.addColorObserver(hexInput, alphaInput, ID, colorId);
        alphaInput.nextElementSibling.addEventListener(`click`, this.resetColor.bind(this, hexInput, alphaInput, ID, colorId));
      }
      items.push(context);
      if (ID === `gc_g`) {
        const input = shared.common.createElements_v2([
          [`div`, { class: `esgst-sm-colors` }, [
            `Only show the following genres: `,
            [`input`, { type: `text`, value: gSettings.gc_g_filters }],
            [`i`, { class: `fa fa-question-circle`, title: `If you enter genres here, a genre category will only appear if the game has the listed genre. Separate genres with a comma, for example: Genre1, Genre2` }]
          ]]
        ]).firstElementChild;
        shared.common.observeChange(input.firstElementChild, `gc_g_filters`, this.toSave);
        items.push(input);
        items.push(this.addGcMenuPanel());
      }
      if (Feature.input) {
        const input = shared.common.createElements_v2([
          [`div`, { class: `esgst-sm-colors` }, [
            `Icon: `,
            [`input`, { type: `text`, value: gSettings[`${ID}Icon`] }],
            [`i`, { class: `esgst-clickable fa fa-question-circle` }],
            [`br`],
            `Label: `,
            [`input`, { type: `text`, value: gSettings[`${ID}Label`] }]
          ]]
        ]).firstElementChild;
        shared.common.createTooltip(input.firstElementChild.nextElementSibling, `The name of the icon must be any name in this page: <a href="https://fontawesome.com/v4.7.0/icons/">https://fontawesome.com/v4.7.0/icons/</a>`);
        let icon = input.firstElementChild;
        let label = input.lastElementChild;
        shared.common.observeChange(icon, `${ID}Icon`, this.toSave);
        shared.common.observeChange(label, `${ID}Label`, this.toSave);
        if (ID === `gc_rd`) {
          shared.common.createElements(input, `beforeEnd`, [{
            attributes: {
              class: `fa fa-question-circle`,
              title: `Enter the date format here, using the following keywords:\n\nDD - Day\nMM - Month in numbers (i.e. 1)\nMon - Month in short name (i.e. Jan)\nMonth - Month in full name (i.e. January)\nYYYY - Year`
            },
            type: `i`
          }]);
        }
        items.push(input);
      }
    } else if (Feature.inputItems) {
      let containerr = shared.common.createElements_v2([
        [`div`, { class: `esgst-sm-colors` }]
      ]).firstElementChild;
      if (ID.match(/^(chfl|sk_)/)) {
        Feature.inputItems = [
          {
            event: `keydown`,
            id: Feature.inputItems,
            shortcutKey: true,
            prefix: `Enter the key combo you want to use for this task: `
          }
        ]
      } else if (ID.match(/^hr_.+_s$/)) {
        Feature.inputItems = [
          {
            id: `${ID}_sound`,
            play: true
          }
        ];
      }
      Feature.inputItems.forEach(item => {
        const children = [];
        const attributes = item.attributes || {};
        if (item.play) {
          attributes.style = `width: 200px`;
          attributes.type = `file`;
          children.push({
            attributes,
            type: `input`
          }, {
              attributes: {
                class: `fa fa-play-circle esgst-clickable`
              },
              type: `i`
            });
        } else {
          attributes.class = `esgst-switch-input esgst-switch-input-large`;
          attributes.type = attributes.type || `text`;
          attributes.value = gSettings[item.id];
          children.push({
            text: item.prefix || ``,
            type: `node`
          }, {
              attributes,
              type: `input`
            }, {
              text: item.suffix || ``,
              type: `node`
            });
          if (item.tooltip) {
            children.push({
              attributes: {
                class: `fa fa-question-circle`,
                title: item.tooltip
              },
              type: `i`
            });
          }
        }
        let input,
          value = ``,
          context = shared.common.createElements(containerr, `beforeEnd`, [{
            type: `div`,
            children
          }]);
        input = context.firstElementChild;
        if (item.play) {
          input.nextElementSibling.addEventListener(`click`, async () => (await shared.esgst.modules.generalHeaderRefresher.hr_createPlayer(gSettings[item.id] || shared.esgst.modules.generalHeaderRefresher.hr_getDefaultSound())).play());
        }
        if (typeof gSettings[item.id] === `undefined` && gSettings.dismissedOptions.indexOf(item.id) < 0) {
          Feature.isNew = true;
          shared.common.createElements(context, `afterBegin`, [{
            attributes: {
              class: `esgst-bold esgst-red esgst-clickable esgst-new-indicator`,
              title: `This is a new feature/option. Click to dismiss.`
            },
            text: `[NEW]`,
            type: `span`
          }]).addEventListener(`click`, event => this.dismissNewOption(item.id, event));
        }
        input.addEventListener(item.event || `change`, event => {
          if (item.shortcutKey) {
            event.preventDefault();
            event.stopPropagation();
            if (!event.repeat) {
              value = ``;
              if (event.ctrlKey) {
                value += `ctrlKey + `;
              } else if (event.shiftKey) {
                value += `shiftKey + `;
              } else if (event.altKey) {
                value += `altKey + `;
              }
              value += event.key.toLowerCase();
            }
          } else if (item.play) {
            this.readHrAudioFile(ID, event);
          } else if (item.event === `keydown`) {
            event.preventDefault();
            // noinspection JSIgnoredPromiseFromCall
            this.preSave(item.id, event.key);
            input.value = event.key;
          } else {
            // noinspection JSIgnoredPromiseFromCall
            this.preSave(item.id, input.value);
          }
        }, item.shortcutKey || false);
        if (item.shortcutKey) {
          input.addEventListener(`keyup`, () => {
            // noinspection JSIgnoredPromiseFromCall
            this.preSave(item.id, value);
            input.value = value;
          });
        }
      });
      items.push(containerr);
    } else if (Feature.theme) {
      const children = [
        `Enabled from `,
        [`input`, { type: `text`, value: gSettings[`${ID}_startTime`] }],
        ` to `,
        [`input`, { type: `text`, value: gSettings[`${ID}_endTime`] }],
        [`i`, { class: `fa fa-question-circle`, title: `You can specify here what time of the day you want the theme to be enabled. Use the HH:MM format.` }],
        [`br`]
      ];
      if (ID === `customTheme`) {
        children.push(
          [`textarea`]
        );
      } else {
        children.push(
          // @ts-ignore
          [`div`, { class: `form__saving-button esgst-sm-colors-default`, id: ID }, `Update`],
          [`span`]
        );
      }
      let containerr = shared.common.createElements_v2([
        [`div`, { class: `esgst-sm-colors` }, children]
      ]).firstElementChild;
      let startTime = containerr.firstElementChild;
      let endTime = startTime.nextElementSibling;
      shared.common.observeChange(startTime, `${ID}_startTime`, this.toSave);
      shared.common.observeChange(endTime, `${ID}_endTime`, this.toSave);
      if (ID === `customTheme`) {
        let textArea = containerr.lastElementChild;
        const value = shared.common.getValue(ID);
        if (value) {
          textArea.value = JSON.parse(value);
        }
        textArea.addEventListener(`change`, async () => {
          await shared.common.setValue(ID, JSON.stringify(textArea.value));
          // noinspection JSIgnoredPromiseFromCall
          shared.common.setTheme();
        });
      } else {
        let version = containerr.lastElementChild,
          button = version.previousElementSibling;
        // noinspection JSIgnoredPromiseFromCall
        shared.common.setThemeVersion(ID, version);
        button.addEventListener(`click`, async () => {
          if (!(await permissions.requestUi([`userStyles`], `settings`))) {
            return;
          }

          let url = await this.getThemeUrl(ID, Feature.theme);
          shared.common.createElements(button, `inner`, [{
            attributes: {
              class: `fa fa-circle-o-notch fa-spin`
            },
            type: `i`
          }, {
            text: ` Updating...`,
            type: `node`
          }]);
          let theme = JSON.stringify((await shared.common.request({ method: `GET`, url })).responseText);
          await shared.common.setValue(ID, theme);
          shared.common.createElements(button, `inner`, [{
            text: `Update`,
            type: `node`
          }]);
          // noinspection JSIgnoredPromiseFromCall
          shared.common.setThemeVersion(ID, version, theme);
          // noinspection JSIgnoredPromiseFromCall
          shared.common.setTheme();
        });
      }
      items.push(containerr);
    }
    if (Feature.options) {
      const [key, options] = Array.isArray(Feature.options) ? [`_index_*`, Feature.options] : [`_index`, [Feature.options]];
      for (const [index, option] of options.entries()) {
        const currentKey = key.replace(/\*/, index);
        const selectedIndex = gSettings[`${ID}${currentKey}`];
        const children = [];
        for (const value of option.values) {
          children.push(
            [`option`, value]
          );
        }
        const select = shared.common.createElements_v2([
          [`div`, { class: `esgst-sm-colors` }, [
            option.title,
            [`select`, children]
          ]]
        ]).firstElementChild;
        select.firstElementChild.selectedIndex = selectedIndex;
        shared.common.observeNumChange(select.firstElementChild, `${ID}${currentKey}`, this.toSave, `selectedIndex`);
        items.push(select);
      }
    }
    return items;
  }

  readHrAudioFile(id, event) {
    let popup = new Popup({ addScrollable: true, icon: `fa-circle-o-notch fa-spin`, title: `Uploading...` });
    popup.open();
    try {
      let reader = new FileReader();
      reader.onload = () => this.saveHrFile(id, popup, reader);
      reader.readAsArrayBuffer(event.currentTarget.files[0]);
    } catch (e) {
      window.console.log(e);
      popup.icon.classList.remove(`fa-circle-o-notch`);
      popup.icon.classList.remove(`fa-spin`);
      popup.icon.classList.add(`fa-times`);
      popup.title.textContent = `An error happened.`;
    }
  }

  async saveHrFile(id, popup, reader) {
    try {
      let bytes = new Uint8Array(reader.result);
      let binary = ``;
      for (let i = 0, n = reader.result.byteLength; i < n; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let string = window.btoa(binary);
      (await shared.esgst.modules.generalHeaderRefresher.hr_createPlayer(string)).play();
      // noinspection JSIgnoredPromiseFromCall
      this.preSave(`${id}_sound`, string);
      popup.close();
    } catch (e) {
      window.console.log(e);
      popup.icon.classList.remove(`fa-circle-o-notch`);
      popup.icon.classList.remove(`fa-spin`);
      popup.icon.classList.add(`fa-times`);
      popup.title.textContent = `An error happened.`;
    }
  }

  addGwcrMenuPanel(id, key, background, upper = `100`) {
    const panel = shared.common.createElements_v2([
      [`div`, { class: `esgst-sm-colors` }, [
        [`div`, { class: `form__saving-button esgst-sm-colors-default` }, [
          [`span`, `Add Color Setting`]
        ]],
        [`i`, { class: `fa fa-question-circle`, title: `Allows you to set different colors for different ${key} ranges.` }]
      ]]
    ]).firstElementChild;
    const button = panel.firstElementChild;
    for (let i = 0, n = gSettings[id].length; i < n; ++i) {
      this.addGwcColorSetting(gSettings[id][i], id, key, panel, background);
    }
    button.addEventListener(`click`, () => {
      const colors = {
        color: `#ffffff`,
        lower: `0`,
        upper: upper
      };
      if (background) {
        colors.bgColor = ``;
      }
      const setting = gSettings[id];
      setting.push(colors);
      this.preSave(id, setting);
      this.addGwcColorSetting(colors, id, key, panel, background);
    });
    return panel;
  }

  addGwcColorSetting(colors, id, key, panel, background) {
    let bgColor, color, i, lower, n, remove, setting, upper;
    setting = shared.common.createElements(panel, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `From: `,
        type: `node`
      }, {
        attributes: {
          step: `0.01`,
          type: `number`,
          value: colors.lower
        },
        type: `input`
      }, {
        text: ` to `,
        type: `node`
      }, {
        attributes: {
          step: `0.01`,
          type: `number`,
          value: colors.upper
        },
        type: `input`
      }, {
        text: ` ${key}, color it as `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colors.color
        },
        type: `input`
      }, ...(background ? [{
        text: ` with the background `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colors.bgColor
        },
        type: `input`
      }] : []), {
        attributes: {
          class: `esgst-clickable fa fa-times`,
          title: `Delete this setting`
        },
        type: `i`
      }]
    }]);
    lower = setting.firstElementChild;
    upper = lower.nextElementSibling;
    color = upper.nextElementSibling;
    if (background) {
      bgColor = color.nextElementSibling;
      remove = bgColor.nextElementSibling;
    } else {
      remove = color.nextElementSibling;
    }
    lower.addEventListener(`change`, () => {
      colors.lower = lower.value;
    });
    upper.addEventListener(`change`, () => {
      colors.upper = upper.value;
    });
    color.addEventListener(`change`, () => {
      colors.color = color.value;
    });
    if (bgColor) {
      bgColor.addEventListener(`change`, () => {
        colors.bgColor = bgColor.value;
      });
    }
    remove.addEventListener(`click`, () => {
      if (window.confirm(`Are you sure you want to delete this setting?`)) {
        const gwcsetting = gSettings[id];
        for (i = 0, n = gwcsetting.length; i < n && gwcsetting[i] !== colors; ++i) {
        }
        if (i < n) {
          gwcsetting.splice(i, 1);
          this.preSave(id, gwcsetting);
          setting.remove();
        }
      }
    });
  }

  addUlMenuPanel(id) {
    const panel = shared.common.createElements_v2([
      [`div`, { class: `esgst-sm-colors` }, [
        [`div`],
        [`div`, { class: `form__saving-button esgst-sm-colors-default`, onclick: () => this.addUlMenuItem(id, panel) }, [
          [`span`, `Add Link`]
        ]],
        [`div`, { class: `form__saving-button esgst-sm-colors-default`, onclick: () => { this.preSave(id, shared.esgst.defaultValues[id]); panel.firstElementChild.innerHTML = ``; this.addUlMenuItems(id, panel); } }, [
          [`span`, `Reset`]
        ]],
        [`div`, { class: `form__input-description` }, [
          `The default links should give you an idea of how the format works.`,
          [`br`],
          [`br`],
          `As label, you can use FontAwesome icons (for example, "fa-icon"), image URLs (for example, "https://www.example.com/image.jpg") and plain text (for example, "Text"). You can also combine them (for example, "fa-icon https://www.example.com/image.jpg Text"). Images will be resized to 16x16.`,
          [`br`],
          [`br`],
          `In the URL, you can use the templates %username% and %steamid%, they will be replaced with the user's username/Steam id.`
        ]]
      ]]
    ]).firstElementChild;
    shared.common.draggable_set({
      addTrash: true,
      context: panel.firstElementChild,
      id: `ul_links`,
      item: {},
      onDragEnd: obj => {
        for (const key in obj) {
          this.preSave(key, obj[key]);
        }
      }
    });
    this.addUlMenuItems(id, panel);
    return panel;
  }

  addUlMenuItems(id, panel) {
    for (const [i, link] of gSettings[id].entries()) {
      this.addUlLink(i, id, link, panel);
    }
  }

  addUlMenuItem(id, panel) {
    const link = {
      label: ``,
      url: ``
    };
    const setting = gSettings[id];
    setting.push(link);
    this.preSave(id, setting);
    this.addUlLink(setting.length - 1, id, link, panel);
  }

  addUlLink(i, id, link, panel) {
    const setting = shared.common.createElements_v2(panel.firstElementChild, `beforeEnd`, [
      [`div`, { 'data-draggable-id': i, 'data-draggable-obj': JSON.stringify(link) }, [
        `Label: `,
        [`input`, { onchange: event => (link.label = event.currentTarget.value) && setting.setAttribute(`data-draggable-obj`, JSON.stringify(link)), type: `text`, value: link.label }],
        `URL: `,
        [`input`, { onchange: event => (link.url = event.currentTarget.value) && setting.setAttribute(`data-draggable-obj`, JSON.stringify(link)), type: `text`, value: link.url }]
      ]]
    ]);
    shared.common.draggable_set({
      addTrash: true,
      context: panel.firstElementChild,
      id: `ul_links`,
      item: {},
      onDragEnd: obj => {
        for (const key in obj) {
          this.preSave(key, obj[key]);
        }
      }
    });
  }

  addGcRatingPanel() {
    const panel = shared.common.createElements_v2([
      [`div`, { class: `esgst-sm-colors` }, [
        [`div`, { class: `form__saving-button esgst-sm-colors-default` }, [
          [`span`, `Add Rating Setting`]
        ]],
        [`i`, { class: `fa fa-question-circle`, title: `Allows you to set different colors/icons for different rating ranges.` }]
      ]]
    ]).firstElementChild;
    let button = panel.firstElementChild;
    for (let i = 0, n = gSettings.gc_r_colors.length; i < n; ++i) {
      this.addGcRatingColorSetting(gSettings.gc_r_colors[i], panel);
    }
    button.addEventListener(`click`, () => {
      let colors = {
        color: ``,
        bgColor: ``,
        icon: ``,
        lower: ``,
        upper: ``
      };
      const setting = gSettings.gc_r_colors;
      setting.push(colors);
      this.preSave(`gc_r_colors`, setting);
      this.addGcRatingColorSetting(colors, panel);
    });
    return panel;
  }

  addGcRatingColorSetting(colors, panel) {
    let setting = shared.common.createElements(panel, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `From: `,
        type: `node`
      }, {
        attributes: {
          type: `number`,
          value: colors.lower
        },
        type: `input`
      }, {
        text: `% to `,
        type: `node`
      }, {
        attributes: {
          type: `number`,
          value: colors.upper
        },
        type: `input`
      }, {
        text: `% rating, color it as `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colors.color
        },
        type: `input`
      }, {
        text: ` with the background `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colors.bgColor
        },
        type: `input`
      }, {
        text: ` and the icon `,
        type: `node`
      }, {
        attributes: {
          type: `text`,
          value: colors.icon
        },
        type: `input`
      }, {
        attributes: {
          class: `fa fa-question-circle`
        },
        type: `i`
      }, {
        text: `.`,
        type: `node`
      }, {
        attributes: {
          class: `esgst-clickable fa fa-times`,
          title: `Delete this setting`
        },
        type: `i`
      }]
    }]);
    let lower = setting.firstElementChild;
    let upper = lower.nextElementSibling;
    let color = upper.nextElementSibling;
    let bgColor = color.nextElementSibling;
    let icon = bgColor.nextElementSibling;
    let tooltip = icon.nextElementSibling;
    shared.common.createTooltip(tooltip, `The name of the icon can be any name from <a href="https://fontawesome.com/v4.7.0/icons/">FontAwesome</a> or any text. For example, if you want to use alt symbols like ▲ (Alt + 3 + 0) and ▼ (Alt + 3 + 1), you can.`);
    let remove = tooltip.nextElementSibling;
    lower.addEventListener(`change`, () => {
      colors.lower = lower.value;
    });
    upper.addEventListener(`change`, () => {
      colors.upper = upper.value;
    });
    color.addEventListener(`change`, () => {
      colors.color = color.value;
    });
    bgColor.addEventListener(`change`, () => {
      colors.bgColor = bgColor.value;
    });
    icon.addEventListener(`change`, () => {
      colors.icon = icon.value;
    });
    remove.addEventListener(`click`, () => {
      if (window.confirm(`Are you sure you want to delete this setting?`)) {
        let i, n;
        const colorSetting = gSettings.gc_r_colors;
        for (i = 0, n = colorSetting.length; i < n && colorSetting[i] !== colors; ++i) {
        }
        if (i < n) {
          colorSetting.splice(i, 1);
          this.preSave(`gc_r_colors`, colorSetting);
          setting.remove();
        }
      }
    });
  }

  addGcMenuPanel() {
    let button, colorSetting, i, n;
    const panel = shared.common.createElements_v2([
      [`div`, { class: `esgst-sm-colors` }, [
        [`div`, { class: `form__saving-button esgst-sm-colors-default` }, [
          [`span`, `Add Custom Genre Setting`]
        ]],
        [`i`, { class: `fa fa-question-circle`, title: `Allows you to color genres (colored genres will appear at the beginning of the list).` }]
      ]]
    ]).firstElementChild;
    button = panel.firstElementChild;
    for (i = 0, n = gSettings.gc_g_colors.length; i < n; ++i) {
      this.addGcColorSetting(gSettings.gc_g_colors[i], panel);
    }
    button.addEventListener(`click`, () => {
      colorSetting = {
        bgColor: `#7f8c8d`,
        color: `#ffffff`,
        genre: ``
      };
      const gcgcolors = gSettings.gc_g_colors;
      gcgcolors.push(colorSetting);
      this.preSave(`gc_g_colors`, gcgcolors);
      this.addGcColorSetting(colorSetting, panel);
    });
    return panel;
  }

  addGcColorSetting(colorSetting, panel) {
    let bgColor, color, genre, i, n, remove, setting;
    setting = shared.common.createElements(panel, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `For genre `,
        type: `node`
      }, {
        attributes: {
          type: `text`,
          value: colorSetting.genre
        },
        type: `input`
      }, {
        text: `, color it as `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colorSetting.color
        },
        type: `input`
      }, {
        text: ` with the background `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colorSetting.bgColor
        },
        type: `input`
      }, {
        text: `.`,
        type: `node`
      }, {
        attributes: {
          class: `esgst-clickable fa fa-times`,
          title: `Delete this setting`
        },
        type: `i`
      }]
    }]);
    genre = setting.firstElementChild;
    color = genre.nextElementSibling;
    bgColor = color.nextElementSibling;
    remove = bgColor.nextElementSibling;
    genre.addEventListener(`change`, () => {
      colorSetting.genre = genre.value;
    });
    color.addEventListener(`change`, () => {
      colorSetting.color = color.value;
    });
    bgColor.addEventListener(`change`, () => {
      colorSetting.bgColor = bgColor.value;
    });
    remove.addEventListener(`click`, () => {
      if (window.confirm(`Are you sure you want to delete this setting?`)) {
        const gcgcolors = gSettings.gc_g_colors;
        for (i = 0, n = gcgcolors.length; i < n && gcgcolors[i] !== colorSetting; ++i) {
        }
        if (i < n) {
          gcgcolors.splice(i, 1);
          gSettings.gc_g_colors = gcgcolors;
          setting.remove();
        }
      }
    });
  }

  addGcAltMenuPanel() {
    let altSetting, button, i, n;
    const panel = shared.common.createElements_v2([
      [`div`, { class: `esgst-sm-colors` }, [
        [`div`, { class: `form__saving-button esgst-sm-colors-default` }, [
          [`span`, `Add Alt Account`]
        ]]
      ]]
    ]).firstElementChild;
    button = panel.firstElementChild;
    shared.common.createTooltip(shared.common.createElements(panel, `beforeEnd`, [{
      attributes: {
        class: `fa fa-question-circle`
      },
      type: `i`
    }]), `
    <div>You must sync your owned games normally for the script to pick up the games owned by your alt accounts. Syncing with alt accounts only works with a Steam API Key though, so make sure one is set at the last section of this menu.</div>
    <br/>
    <div>Steam ID is the number that comes after "steamcommunity.com/profiles/" in your alt account's URL. If your alt account has a URL in the format "steamcommunity.com/id/" though, you can get your Steam ID <a href="https://steamid.io/">here</a> by entering your URL in the input (you want the steamID64 one).</div>
    <br/>
    <div>You must fill the fields relative to your settings. For example, if you have simplified version enabled with icons, you must fill the "icon" field. If you don't have simplified version enabled, you must fill the "label" field. The current text in the fields are simply placeholders.</div>
  `);
    for (i = 0, n = gSettings.gc_o_altAccounts.length; i < n; ++i) {
      this.addGcAltSetting(gSettings.gc_o_altAccounts[i], panel);
    }
    button.addEventListener(`click`, () => {
      altSetting = {
        bgColor: `#000000`,
        color: `#ffffff`,
        games: {
          apps: {},
          subs: {}
        },
        icon: ``,
        label: ``,
        name: ``,
        steamId: ``
      };
      const gcoalt = gSettings.gc_o_altAccounts;
      gcoalt.push(altSetting);
      this.preSave(`gc_o_altAccounts`, gcoalt);
      this.addGcAltSetting(altSetting, panel);
    });
    return panel;
  }

  addGcAltSetting(altSetting, panel) {
    let color, bgColor, i, icon, label, n, name, remove, setting, steamId;
    setting = shared.common.createElements(panel, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `For account with Steam ID `,
        type: `node`
      }, {
        attributes: {
          placeholder: `0000000000000000`,
          type: `text`,
          value: altSetting.steamId
        },
        type: `input`
      }, {
        text: `, using the nickname `,
        type: `node`
      }, {
        attributes: {
          placeholder: `alt1`,
          type: `text`,
          value: altSetting.name
        },
        type: `input`
      }, {
        text: `, `,
        type: `node`
      }, {
        type: `br`
      }, {
        text: `color it as `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: altSetting.color
        },
        type: `input`
      }, {
        text: ` with the background `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: altSetting.bgColor
        },
        type: `input`
      }, {
        text: `, icon `,
        type: `node`
      }, {
        attributes: {
          placeholder: `folder`,
          type: `text`,
          value: altSetting.icon
        },
        type: `input`
      }, {
        text: ` and label `,
        type: `node`
      }, {
        attributes: {
          placeholder: `Owned by alt1`,
          type: `text`,
          value: altSetting.label
        },
        type: `input`
      }, {
        text: `.`,
        type: `node`
      }, {
        attributes: {
          class: `esgst-clickable fa fa-times`,
          title: `Delete this setting`
        },
        type: `i`
      }]
    }]);
    steamId = setting.firstElementChild;
    name = steamId.nextElementSibling;
    color = name.nextElementSibling.nextElementSibling;
    bgColor = color.nextElementSibling;
    icon = bgColor.nextElementSibling;
    label = icon.nextElementSibling;
    remove = label.nextElementSibling;
    steamId.addEventListener(`change`, () => {
      altSetting.steamId = steamId.value;
    });
    name.addEventListener(`change`, () => {
      altSetting.name = name.value;
    });
    color.addEventListener(`change`, () => {
      altSetting.color = color.value;
    });
    bgColor.addEventListener(`change`, () => {
      altSetting.bgColor = bgColor.value;
    });
    icon.addEventListener(`change`, () => {
      altSetting.icon = icon.value;
    });
    label.addEventListener(`change`, () => {
      altSetting.label = label.value;
    });
    remove.addEventListener(`click`, () => {
      if (window.confirm(`Are you sure you want to delete this setting?`)) {
        const gcoalt = gSettings.gc_o_altAccounts;
        for (i = 0, n = gcoalt.length; i < n && gcoalt[i] !== altSetting; ++i) {
        }
        if (i < n) {
          gcoalt.splice(i, 1);
          this.preSave(`gc_o_altAccounts`, gcoalt);
          setting.remove();
        }
      }
    });
  }

  addColorObserver(hexInput, alphaInput, id, colorId) {
    hexInput.addEventListener(`change`, () => {
      // noinspection JSIgnoredPromiseFromCall
      this.preSave(`${id}_${colorId}`, utils.hex2Rgba(hexInput.value, alphaInput.value));
    });
    alphaInput.addEventListener(`change`, () => {
      // noinspection JSIgnoredPromiseFromCall
      this.preSave(`${id}_${colorId}`, utils.hex2Rgba(hexInput.value, alphaInput.value));
    });
  }

  getThemeUrl(id, url) {
    return new Promise(resolve => this.openThemePopup(id, url, resolve));
  }

  openThemePopup(id, url, resolve) {
    let obj = {
      resolve,
      url
    };
    obj.options = {
      sgv2Dark: [
        {
          default: 0,
          id: `ik-page width`,
          name: `Page width`,
          options: [
            {
              id: `ik-def page width`,
              name: `100%`
            },
            {
              id: `ik-fixed sg page width`,
              name: `Fixed (1440px)`
            }
          ]
        }
      ],
      steamGifties: [
        {
          default: 1,
          id: `ik-spoilertags`,
          name: `Remove spoiler tags`
        },
        {
          default: 1,
          id: `ik-hiddenlinks`,
          name: `Reveal hidden links`
        },
        {
          default: 0,
          id: `ik-sgppsupport`,
          name: `SG++ support`
        },
        {
          default: 0,
          id: `ik-whiteblacklist`,
          name: `Blacklist/Whitelist Indicator support`
        },
        {
          default: 0,
          id: `ik-easysteamgifts`,
          name: `Easy SteamGifts support`
        },
        {
          default: 0,
          id: `ik-visited-link`,
          name: `Highlight visited links`,
          options: [
            {
              id: `ik-1`,
              name: `Mark visited links`
            },
            {
              id: `ik-3`,
              name: `Mark visited links + threads in forum`
            },
            {
              id: `ik-2`,
              name: `No`
            }
          ]
        },
        {
          default: 0,
          id: `ik-touhou-style`,
          name: `TouHou Giveaways Helper support`
        },
        {
          default: 0,
          id: `ik-sg2os`,
          name: `SG2O support`
        },
        {
          default: 0,
          id: `ik-avatarsize`,
          name: `Avatar size`,
          options: [
            {
              id: `ik-1`,
              name: `Big (52px)`
            },
            {
              id: `ik-2`,
              name: `Normal`
            }
          ]
        },
        {
          default: 0,
          id: `ik-extendedsg`,
          name: `Extended SteamGifts support`
        },
        {
          default: 0,
          id: `ik-navbarbutton`,
          name: `Navigation bar button color`,
          options: [
            {
              id: `ik-1`,
              name: `Default`
            },
            {
              id: `ik-2`,
              name: `White`
            }
          ]
        },
        {
          default: 0,
          id: `ik-ESGST`,
          name: `ESGST support`
        },
        {
          default: 1,
          id: `ik-featurega`,
          name: `Featured giveaway`,
          options: [
            {
              id: `ik-1`,
              name: `No`
            },
            {
              id: `ik-2`,
              name: `Smaller banner`
            },
            {
              id: `ik-2`,
              name: `Hide banner`
            }
          ]
        },
        {
          default: 0,
          id: `ik-removepoll`,
          name: `Homepage poll`,
          options: [
            {
              id: `ik-1`,
              name: `Default`
            },
            {
              id: `ik-2`,
              name: `Remove poll`
            }
          ]
        }
      ],
      steamTradies: [
        {
          default: 0,
          id: `ik-color-sc`,
          name: `Color`,
          options: [
            {
              id: `ik-1`,
              name: `Dark blue`
            },
            {
              id: `ik-2`,
              name: `Black`
            }
          ]
        }
      ]
    };
    let binaryOptions = [
      {
        id: `ik-1`,
        name: `Yes`
      },
      {
        id: `ik-2`,
        name: `No`
      }
    ];
    let key = id.replace(/Black|Blue/g, ``);
    if (!obj.options[key]) {
      resolve(url);
      return;
    }
    obj.popup = new Popup({
      icon: `fa-gear`,
      title: `Select the options that you want:`,
      buttons: [
        {
          color1: `green`, color2: `grey`,
          icon1: `fa-gear`, icon2: `fa-circle-o-notch fa-spin`,
          title1: `Generate`, title2: `Generating...`,
          callback1: () => this.generateThemeUrl(obj, key)
        }
      ],
      addScrollable: true
    });
    obj.popup.onClose = resolve.bind(shared.common, url);
    let context = obj.popup.getScrollable([
      [`div`, { class: `esgst-sm-colors` }]
    ]).firstElementChild;
    obj.options[key].forEach(option => {
      option.select = shared.common.createElements(context, `beforeEnd`, [{
        type: `div`,
        children: [{
          text: `${option.name} `,
          type: `node`
        }, {
          type: `select`
        }]
      }]).lastElementChild;
      (option.options || binaryOptions).forEach(subOption => {
        shared.common.createElements(option.select, `beforeEnd`, [{
          attributes: {
            value: subOption.id
          },
          text: subOption.name,
          type: `option`
        }]);
      });
      option.select.selectedIndex = option.default;
    });
    obj.popup.open();
  }

  generateThemeUrl(obj, key) {
    obj.url += `?`;
    obj.options[key].forEach(option => {
      obj.url += `${option.id}=${option.select.value}&`;
    });
    obj.url = obj.url.slice(0, -1);
    obj.popup.onClose = null;
    obj.popup.close();
    obj.resolve(obj.url);
  }

  createMenuSection(context, html, number, title, type) {
    let section = shared.common.createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-form-row`,
        id: `esgst_${type}`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-form-heading`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-form-heading-number`
          },
          text: `${number}.`,
          type: `div`
        }, {
          attributes: {
            class: `esgst-form-heading-text`
          },
          type: `div`,
          children: [{
            text: title,
            type: `span`
          }]
        }]
      }, {
        attributes: {
          class: `esgst-form-row-indent`
        },
        type: `div`,
        children: html
      }]
    }]);
    if (gSettings.makeSectionsCollapsible && !title.match(/Backup|Restore|Delete/)) {
      let button, containerr, isExpanded;
      button = shared.common.createElements(section.firstElementChild, `afterBegin`, [{
        attributes: {
          class: `esgst-clickable`,
          style: `margin-right: 5px;`
        },
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-${gSettings[`collapse_${type}`] ? `plus` : `minus`}-square`,
            title: `${gSettings[`collapse_${type}`] ? `Expand` : `Collapse`} section`
          },
          type: `i`
        }]
      }]);
      containerr = section.lastElementChild;
      if (gSettings[`collapse_${type}`]) {
        containerr.classList.add(`esgst-hidden`);
        isExpanded = false;
      } else {
        isExpanded = true;
      }
      button.addEventListener(`click`, () => {
        if (isExpanded) {
          containerr.classList.add(`esgst-hidden`);
          shared.common.createElements(button, `inner`, [{
            attributes: {
              class: `fa fa-plus-square`,
              title: `Expand section`
            },
            type: `i`
          }]);
          isExpanded = false;
        } else {
          containerr.classList.remove(`esgst-hidden`);
          shared.common.createElements(button, `inner`, [{
            attributes: {
              class: `fa fa-minus-square`,
              title: `Collapse section`
            },
            type: `i`
          }]);
          isExpanded = true;
        }
        this.preSave(`collapse_${type}`, !isExpanded);
      });
    }
    return section;
  }

  filterSm(event) {
    let collapse, element, expand, found, id, type, typeFound, value;
    value = event.currentTarget.value.toLowerCase().trim().replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    for (type in shared.esgst.features) {
      if (shared.esgst.features.hasOwnProperty(type)) {
        found = false;
        typeFound = false;
        for (id in shared.esgst.features[type].features) {
          if (shared.esgst.features[type].features.hasOwnProperty(id)) {
            this.unfadeSmFeatures(shared.esgst.features[type].features[id], id);
            found = this.filterSmFeature(shared.esgst.features[type].features[id], id, value);
            if (found) {
              typeFound = true;
              this.unhideSmFeature(shared.esgst.features[type].features[id], id);
            }
          }
        }
        element = document.getElementById(`esgst_${type}`);
        if (element) {
          if (typeFound) {
            element.classList.remove(`esgst-hidden`);
          } else {
            element.classList.add(`esgst-hidden`);
          }
          if (value) {
            expand = element.getElementsByClassName(`fa-plus-square`)[0];
            if (expand) {
              expand.click();
            }
          } else {
            collapse = element.getElementsByClassName(`fa-minus-square`)[0];
            if (collapse) {
              collapse.click();
            }
          }
        }
      }
    }
    for (type of [`element_ordering`, `steam_api_key`]) {      
      element = document.getElementById(`esgst_${type}`);
      if (element) {
        if (element.textContent.toLowerCase().trim().match(value)) {
          element.classList.remove(`esgst-hidden`);
        } else {
          element.classList.add(`esgst-hidden`);
        }
        if (value) {
          expand = element.getElementsByClassName(`fa-plus-square`)[0];
          if (expand) {
            expand.click();
          }
        } else {
          collapse = element.getElementsByClassName(`fa-minus-square`)[0];
          if (collapse) {
            collapse.click();
          }
        }
      }
    }
  }

  unfadeSmFeatures(feature, id) {
    let element = document.getElementById(`esgst_${id}`);
    if (element) {
      element.classList.remove(`esgst-sm-faded`);
    }
    if (feature.features) {
      for (id in feature.features) {
        if (feature.features.hasOwnProperty(id)) {
          this.unfadeSmFeatures(feature.features[id], id);
        }
      }
    }
  }

  filterSmFeature(feature, id, value) {
    let found = !value || (typeof feature.name === `string` ? feature.name : JSON.stringify(feature.name)).toLowerCase().match(value) || (value === `\\[new\\]` && feature.isNew);
    let exactFound = found;
    if (!value || !found) {
      if (!found) {
        exactFound = found = (feature.description && JSON.stringify(feature.description).toLowerCase().match(value));
      }
      if ((!value || !found) && feature.features) {
        for (const subId in feature.features) {
          if (feature.features.hasOwnProperty(subId)) {
            found = this.filterSmFeature(feature.features[subId], subId, value) || found;
          }
        }
      }
    }
    let element = document.getElementById(`esgst_${id}`);
    if (element) {
      if (found) {
        element.classList.remove(`esgst-hidden`);
      } else {
        element.classList.add(`esgst-hidden`);
      }
      if (exactFound) {
        element.classList.remove(`esgst-sm-faded`);
      } else {
        element.classList.add(`esgst-sm-faded`);
      }
    }
    return found;
  }

  unhideSmFeature(feature, id) {
    let element = document.getElementById(`esgst_${id}`);
    if (element) {
      element.classList.remove(`esgst-hidden`);
    }
    if (feature.features) {
      for (id in feature.features) {
        if (feature.features.hasOwnProperty(id)) {
          this.unhideSmFeature(feature.features[id], id);
        }
      }
    }
  }

  enableDependencies(ids, namespace) {
    for (const id of ids) {
      const feature = shared.esgst.featuresById[id];
      if (feature && feature[`${namespace}Switch`]) {
        feature[`${namespace}Switch`].enable();
      }
    }
  }
}

const settingsModule = new Settings();

export { settingsModule };