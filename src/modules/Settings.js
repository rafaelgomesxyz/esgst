import ButtonSet from '../class/ButtonSet';
import Popup from '../class/Popup';
import ToggleSwitch from '../class/ToggleSwitch';
import { container } from '../class/Container';
import { utils } from '../lib/jsUtils';
import { setSync } from './Sync';
import { loadDataCleaner, loadDataManagement } from './Storage';

const
  rgba2Hex = utils.rgba2Hex.bind(utils),
  hex2Rgba = utils.hex2Rgba.bind(utils)
;

function loadMenu(isPopup) {
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
    Context = Container = container.esgst.sidebar.nextElementSibling;
    Container.innerHTML = ``;
  }

  const input = container.common.createElements_v2(isPopup ? Container : container.esgst.sidebar, `afterBegin`, [
    [`div`, { class: `sidebar__search-container` }, [
      [`input`, { class: `sidebar__search-input`, type: `text`, placeholder: `Search...` }]
    ]]
  ]).firstElementChild;
  if (isPopup && container.esgst.scb) {
    container.esgst.modules.generalSearchClearButton.getInputs(Container);
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
      await container.common.setSetting(`dismissedOptions`, container.esgst.toDismiss);
      container.esgst.dismissedOptions = container.esgst.toDismiss;
      for (let i = newIndicators.length - 1; i > -1; i--) {
        newIndicators[i].remove();
      }
    }
  }).set;
  dismissAllButton.classList.add(`esgst-hidden`);
  Container.appendChild(dismissAllButton);

  Container.setAttribute(`data-esgst-popup`, true);
  const heading = container.common.createPageHeading(Container, `afterBegin`, {
    items: [
      {
        name: `ESGST`,
        url: container.esgst.settingsUrl
      },
      {
        name: `Settings`,
        url: container.esgst.settingsUrl
      }
    ]
  });
  const items = [
    {
      check: true,
      icons: [`fa-refresh`],
      title: `Sync data`,
      onClick: () => setSync(true)
    },
    {
      check: true,
      icons: [`fa-sign-in esgst-rotate-90`],
      title: `Restore data`,
      onClick: () => loadDataManagement(`import`, true)
    },
    {
      check: true,
      icons: [`fa-sign-out esgst-rotate-270`],
      title: `Backup data`,
      onClick: () => loadDataManagement(`export`, true)
    },
    {
      check: true,
      icons: [`fa-trash`],
      title: `Delete data`,
      onClick: () => loadDataManagement(`delete`, true)
    },
    {
      check: true,
      icons: [`fa-gear`, `fa-arrow-circle-down`],
      title: `Download settings (downloads your settings to your computer without your personal data so you can easily share them with other users)`,
      onClick: () => container.common.exportSettings()
    },
    {
      check: true,
      icons: [`fa-paint-brush`],
      title: `Clean old data`,
      onClick: () => loadDataCleaner(true)
    },
    {
      check: !container.esgst.parameters.esgst,
      icons: [`fa-user`, `fa-history`],
      title: `View recent username changes`,
      onClick: event => container.common.setSMRecentUsernameChanges(event.currentTarget)
    },
    {
      check: !container.esgst.parameters.esgst && container.esgst.uf,
      icons: [`fa-user`, `fa-eye-slash`],
      title: `See list of filtered users`,
      onClick: event => container.common.setSMManageFilteredUsers(event.currentTarget)
    },
    {
      check: !container.esgst.parameters.esgst && container.esgst.sg && container.esgst.gf && container.esgst.gf_s,
      icons: [`fa-gift`, `fa-eye-slash`],
      title: `Manage hidden giveaways`,
      onClick: event => container.common.setSMManageFilteredGiveaways(event.currentTarget)
    },
    {
      check: !container.esgst.parameters.esgst && container.esgst.sg && container.esgst.df && container.esgst.df_s,
      icons: [`fa-comments`, `fa-eye-slash`],
      title: `Manage hidden discussions`,
      onClick: event => container.esgst.modules.discussionsDiscussionFilters.df_menu({}, event.currentTarget)
    },
    {
      check: !container.esgst.parameters.esgst && container.esgst.st && container.esgst.tf && container.esgst.tf_s,
      icons: [`fa-retweet`, `fa-eye-slash`],
      title: `Manage hidden trades`,
      onClick: event => container.esgst.modules.tradesTradeFilters.tf_menu({}, event.currentTarget)
    },
    {
      check: !container.esgst.parameters.esgst && container.esgst.sg && container.esgst.dt,
      icons: [`fa-comments`, `fa-tags`],
      title: `Manage discussion tags`,
      onClick: () => container.common.openManageDiscussionTagsPopup()
    },
    {
      check: !container.esgst.parameters.esgst && container.esgst.sg && container.esgst.ut,
      icons: [`fa-user`, `fa-tags`],
      title: `Manage user tags`,
      onClick: () => container.common.openManageUserTagsPopup()
    },
    {
      check: !container.esgst.parameters.esgst && container.esgst.gt,
      icons: [`fa-gamepad`, `fa-tags`],
      title: `Manage game tags`,
      onClick: () => container.common.openManageGameTagsPopup()
    },
    {
      check: !container.esgst.parameters.esgst && container.esgst.gpt,
      icons: [`fa-users`, `fa-tags`],
      title: `Manage group tags`,
      onClick: () => container.common.openManageGroupTagsPopup()
    },
    {
      check: !container.esgst.parameters.esgst && container.esgst.wbc,
      icons: [`fa-heart`, `fa-ban`, `fa-cog`],
      title: `Manage Whitelist / Blacklist Checker caches`,
      callback: button => container.esgst.modules.usersWhitelistBlacklistChecker.wbc_addButton(false, button)
    },
    {
      check: !container.esgst.parameters.esgst && container.esgst.namwc,
      icons: [`fa-trophy`, `fa-cog`],
      title: `Manage Not Activated / Multiple Wins Checker caches`,
      callback: button => container.esgst.modules.usersNotActivatedMultipleWinChecker.namwc_setPopup(button)
    }
  ];
  for (let i = items.length - 1; i > -1; i--) {
    const item = items[i];
    if (!item.check) {
      continue;
    }
    const button = container.common.createElements_v2(heading, `afterBegin`, [
      [`div`, { title: item.title }, [
        ...item.icons.map(x => [`i`, {class: `fa ${x}`}])
      ]]
    ]);
    if (item.onClick) {
      button.addEventListener(`click`, event => item.onClick(event));
    }
    if (item.callback) {
      item.callback(button);
    }
  }
  if (!isPopup) {
    container.esgst.mainPageHeading = heading;
  }

  input.addEventListener(`input`, event => filterSm(event));
  input.addEventListener(`change`, event => filterSm(event));
  Context.classList.add(`esgst-menu-layer`);
  container.common.createElements_v2(Context, `beforeEnd`, [
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
      await container.common.lockAndSaveSettings();
      if (isPopup) {
        popup.close();
      } else {
        window.location.reload();
      }
    }
  }).set);
  Context.addEventListener(`click`, event => loadFeatureDetails(null, popup && popup.scrollable.offsetTop, event));
  container.esgst.featuresById = {};
  let SMMenu = Context.getElementsByClassName(`esgst-settings-menu`)[0];
  let i, type;
  i = 1;
  for (type in container.esgst.features) {
    if (container.esgst.features.hasOwnProperty(type)) {
      if (type !== `trades` || container.esgst.settings.esgst_st || container.esgst.settings.esgst_sgtools) {
        let id, j, section, title, isNew = false;
        title = type.replace(/^./, m => {
          return m.toUpperCase()
        });
        section = createMenuSection(SMMenu, null, i, title, type);
        j = 1;
        for (id in container.esgst.features[type].features) {
          if (container.esgst.features[type].features.hasOwnProperty(id)) {
            if (id === `common`) {
              continue;
            }
            let feature, ft;
            feature = container.esgst.features[type].features[id];
            if (!feature.sg && (((feature.sgtools && !container.esgst.settings.esgst_sgtools) || (feature.st && !container.esgst.settings.esgst_st)) && id !== `esgst`)) {
              continue;
            }
            ft = getSMFeature(feature, id, j, popup);
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
          container.common.createElements(section.firstElementChild.lastElementChild, `afterBegin`, [{
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
  const elementOrdering = createMenuSection(SMMenu, null, i, `Element Ordering`, `element_ordering`);
  setElementOrderingSection(elementOrdering.lastElementChild);
  i += 1;
  createMenuSection(SMMenu, [{
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
  let key = container.esgst.steamApiKey;
  if (key) {
    SMAPIKey.value = key;
  }
  SMAPIKey.addEventListener(`input`, () => {
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings.steamApiKey = SMAPIKey.value;
  });
  let pp = null;
  if (container.esgst.firstInstall) {
    pp = new Popup({ addScrollable: true, icon: `fa-check`, isTemp: true, title: `Getting Started` });
    container.common.createElements(pp.scrollable, `inner`, [{
      attributes: {
        class: `esgst-bold`
      },
      text: `Here are some things you should know to help you get started:`,
      type: `div`
    }, {
      type: `br`
    }, {
      attributes: {
        class: `markdown`
      },
      type: `div`,
      children: [{
        type: `ul`,
        children: [{
          type: `li`,
          children: [{
            text: `Bugs and suggestions should be reported on the `,
            type: `node`
          }, {
            attributes: {
              href: `https://github.com/gsrafael01/ESGST/issues`
            },
            text: `GitHub page`,
            type: `a`
          }, {
            text: `.`,
            type: `node`
          }]
        }, {
          text: `Make sure you backup your data using the backup button at the top of the menu every once in a while to prevent any data loss that might occur. It's also probably a good idea to disable automatic updates, since ESGST is in constant development.`,
          type: `node`
        }, {
          type: `li`,
          children: [{
            text: `Click on an option in the menu to learn more about it and how to use it. Some options are currently missing documentation, so feel free to ask about them in the official ESGST thread.`,
            type: `node`
          }]
        }, {
          type: `li`,
          children: [{
            text: `Some features rely on sync to work properly. These features have a "Sync Requirements" section in their detailed menu that show you what type of data you have to sync. You should sync often to keep your data up-to-date. ESGST offers an option to automatically sync your data for you every amount of days so you don't have to do it manually. To enable the automatic sync, simply go to the sync menu (though the sync button at the top of the menu) and select the number of days in the dropdown.`,
            type: `node`
          }]
        }, {
          type: `li`,
          children: [{
            text: `ESGST uses 2 terms to define a window opened in the same page: `,
            type: `node`
          }, {
            text: `popout`,
            type: `strong`
          }, {
            text: ` is when the window opens up, down, left or right from the element you clicked/hovered over (like the one you get with the description of the features) and `,
            type: `node`
          }, {
            text: `popup`,
            type: `strong`
          }, {
            text: ` is when the window opens in the center of the screen with a modal background behind it (like this one).`,
            type: `node`
          }]
        }, {
          text: `That's all for now, you can close container.common.`,
          type: `li`
        }]
      }]
    }]);
    container.esgst.firstInstall = false;
  }
  if (container.esgst.parameters.id) {
    loadFeatureDetails(container.esgst.parameters.id, popup && popup.scrollable.offsetTop);
  }
  if (isPopup) {
    popup.open();
  }
  if (pp) {      
    pp.open();
  }

  newIndicators = document.querySelectorAll(`.esgst-new-indicator`);
  if (newIndicators.length) {
    dismissAllButton.classList.remove(`esgst-hidden`);
  }
}

function show_extension_only_popup() {
  new Popup({
    addScrollable: true,
    icon: `fa-exclamation`,
    isTemp: true,
     title: [{
      text: `This feature is only available in the extension version of ESGST. Please upgrade to the extension to use it. Below are the links for it:`,
      type: `node`
    }, {
      type: `br`
    }, {
      type: `br`
    }, {
      attributes: {
        href: `https://chrome.google.com/webstore/detail/esgst/ibedmjbicclcdfmghnkfldnplocgihna`
      },
      text: `https://chrome.google.com/webstore/detail/esgst/ibedmjbicclcdfmghnkfldnplocgihna`,
      type: `a`
    }, {
      type: `br`
    }, {
      type: `br`
    }, {
      attributes: {
        href: `https://addons.mozilla.org/en-US/firefox/addon/esgst/`
      },
      text: `https://addons.mozilla.org/en-US/firefox/addon/esgst/`,
      type: `a`
    }, {
      type: `br`
    }, {
      type: `br`
    }, {
      text: `To transfer your data from the userscript to the extension, backup your data in the backup menu of the userscript, then disable the userscript, install the extension and restore your data in the restore menu of the extension. Below are the links to the backup/restore pages:`,
      type: `node`
    }, {
      type: `br`
    }, {
      type: `br`
    }, {
      attributes: {
        href: `https://www.steamgifts.com/account/settings/profile?esgst=backup`
      },
      text: `https://www.steamgifts.com/account/settings/profile?esgst=backup`,
      type: `a`
    }, {
      type: `br`
    }, {
      type: `br`
    }, {
      attributes: {
        href: `https://www.steamgifts.com/account/settings/profile?esgst=restore`
      },
      text: `https://www.steamgifts.com/account/settings/profile?esgst=restore`,
      type: `a`
    }]
  }).open();
}

function loadFeatureDetails(id, offset, event) {
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
  const feature = container.esgst.featuresById[id];
  const url = `${container.esgst.settingsUrl}&id=${id}`;
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
  }];
  let sgContext, stContext, sgtoolsContext;
  if (feature.sg) {
    const value = container.common.getFeaturePath(feature, id, `sg`).enabled;
    sgContext = container.common.createElements_v2([[`div`]]).firstElementChild;
    const sgSwitch = new ToggleSwitch(sgContext, null, true, container.esgst.settings.esgst_st || container.esgst.settings.esgst_sgtools ? `SteamGifts` : ``, true, false, null, value);
    feature.sgFeatureSwitch = sgSwitch;
    sgSwitch.onEnabled = () => {
      if (feature.conflicts) {
        for (const conflictId of feature.conflicts) {
          const setting = container.esgst.settings[`${conflictId}_sg`];
          if ((typeof setting === `object` && setting.enabled) || setting) {
            sgSwitch.disable(true);
            new Popup({
              addScrollable: true,
              icon: `fa-exclamation`,
              isTemp: true,
              title: `This feature conflicts with ${container.common.getFeatureName(null, conflictId)}. While that feature is enabled, this feature cannot be enabled.`
            }).open();
            return;
          }
        }
      }
      container.esgst.settings[`${id}_sg`] = true;
      container.esgst[id] = true;
      if (feature.sgSwitch) {
        feature.sgSwitch.enable(true);
      }
      if (feature.theme) {
        if (id === `customTheme`) {
          container.common.setTheme();
        } else {
          container.common.updateTheme(id);
        }
      }
      container.common.createElements_v2(document.querySelector(`#esgst-paths-sg`), `inner`, [
        openPathsPopup(feature, id, `sg`)
      ]);
    };
    sgSwitch.onDisabled = async () => {
      container.esgst.settings[`${id}_sg`] = false;
      container.esgst[id] = false;
      if (feature.sgSwitch) {
        feature.sgSwitch.disable(true);
      }
      if (feature.theme) {
        if (id === `customTheme`) {
          container.common.delLocalValue(`customTheme`);
        } else {
          container.common.delLocalValue(`theme`);
          await container.common.delValue(id);
        }
        container.common.setTheme();
      }
      container.common.createElements_v2(document.querySelector(`#esgst-paths-sg`), `inner`, [
        openPathsPopup(feature, id, `sg`)
      ]);
    };
  }
  if (feature.st && (container.esgst.settings.esgst_st || id === `esgst`)) {
    const value = container.common.getFeaturePath(feature, id, `st`).enabled;
    stContext = container.common.createElements_v2([[`div`]]).firstElementChild;
    const stSwitch = new ToggleSwitch(stContext, null, true, `SteamTrades`, false, true, null, value);
    feature.stFeatureSwitch = stSwitch;
    stSwitch.onEnabled = () => {
      if (feature.conflicts) {
        for (const conflictId of feature.conflicts) {
          const setting = container.esgst.settings[`${conflictId}_st`];
          if ((typeof setting === `object` && setting.enabled) || setting) {
            stSwitch.disable(true);
            new Popup({
              addScrollable: true,
              icon: `fa-exclamation`,
              isTemp: true,
              title: `This feature conflicts with ${container.common.getFeatureName(null, conflictId)}. While that feature is enabled, this feature cannot be enabled.`
            }).open();
            return;
          }
        }
      }
      container.esgst.settings[`${id}_st`] = true;
      container.esgst[id] = true;
      if (feature.stSwitch) {
        feature.stSwitch.enable(true);
      }
      if (feature.theme) {
        if (id === `customTheme`) {
          container.common.setTheme();
        } else {
          container.common.updateTheme(id);
        }
      }
      container.common.createElements_v2(document.querySelector(`#esgst-paths-st`), `inner`, [
        openPathsPopup(feature, id, `st`)
      ]);
    };
    stSwitch.onDisabled = async () => {
      container.esgst.settings[`${id}_st`] = false;
      container.esgst[id] = false;
      if (feature.stSwitch) {
        feature.stSwitch.disable(true);
      }
      if (feature.theme) {
        if (id === `customTheme`) {
          container.common.delLocalValue(`customTheme`);
        } else {
          container.common.delLocalValue(`theme`);
          await container.common.delValue(id);
        }
        container.common.setTheme();
      }
      container.common.createElements_v2(document.querySelector(`#esgst-paths-st`), `inner`, [
        openPathsPopup(feature, id, `st`)
      ]);
    };
  }
  if (feature.sgtools && (container.esgst.settings.esgst_sgtools || id === `esgst`)) {
    const value = container.common.getFeaturePath(feature, id, `sgtools`).enabled;
    sgtoolsContext = container.common.createElements_v2([[`div`]]).firstElementChild;
    const sgtoolsSwitch = new ToggleSwitch(sgtoolsContext, null, true, `SGTools`, true, false, null, value);
    feature.sgtoolsFeatureSwitch = sgtoolsSwitch;
    sgtoolsSwitch.onEnabled = () => {
      if (feature.conflicts) {
        for (const conflictId of feature.conflicts) {
          const setting = container.esgst.settings[`${conflictId}_sgtools`];
          if ((typeof setting === `object` && setting.enabled) || setting) {
            sgtoolsSwitch.disable(true);
            new Popup({
              addScrollable: true,
              icon: `fa-exclamation`,
              isTemp: true,
              title: `This feature conflicts with ${container.common.getFeatureName(null, conflictId)}. While that feature is enabled, this feature cannot be enabled.`
            }).open();
            return;
          }
        }
      }
      container.esgst.settings[`${id}_sgtools`] = true;
      container.esgst[id] = true;
      if (feature.sgtoolsSwitch) {
        feature.sgtoolsSwitch.enable(true);
      }
      if (feature.theme) {
        if (id === `customTheme`) {
          container.common.setTheme();
        } else {
          container.common.updateTheme(id);
        }
      }
      container.common.createElements_v2(document.querySelector(`#esgst-paths-sgtools`), `inner`, [
        openPathsPopup(feature, id, `sgtools`)
      ]);
    };
    sgtoolsSwitch.onDisabled = async () => {
      container.esgst.settings[`${id}_sgtools`] = false;
      container.esgst[id] = false;
      if (feature.sgtoolsSwitch) {
        feature.sgtoolsSwitch.disable(true);
      }
      if (feature.theme) {
        if (id === `customTheme`) {
          container.common.delLocalValue(`customTheme`);
        } else {
          container.common.delLocalValue(`theme`);
          await container.common.delValue(id);
        }
        container.common.setTheme();
      }
      container.common.createElements_v2(document.querySelector(`#esgst-paths-sgtools`), `inner`, [
        openPathsPopup(feature, id, `sgtools`)
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
        [`div`, { class: `markdown` }, JSON.parse(JSON.stringify(feature.description).replace(/\[id=(.+?)]/g, container.common.getFeatureName.bind(container.common)))]
      ],
      name: `What does it do?`
    });
  }
  const additionalOptions = getSmFeatureAdditionalOptions(feature, id);
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
          [`a`, { class: `table__column__secondary-link`, href: `${container.esgst.syncUrl}&autoSync=true&${feature.syncKeys.map(x => `${x}=1`).join(`&`)}`, target: `_blank` }, `here`],
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
        openPathsPopup(feature, id, `sg`)
      ],
      id: `esgst-paths-sg`,
      name: `Where to run it on SteamGifts?`
    });
  }
  if (feature.st && container.esgst.settings.esgst_st && (!feature.stPaths || typeof feature.stPaths !== `string`)) {
    items.push({
      check: true,
      content: [
        openPathsPopup(feature, id, `st`)
      ],
      id: `esgst-paths-st`,
      name: `Where to run it on SteamTrades?`
    });
  }
  if (feature.sgtools && container.esgst.settings.esgst_sgtools && (!feature.sgtoolsPaths || typeof feature.sgtoolsPaths !== `string`)) {
    items.push({
      check: true,
      content: [
        openPathsPopup(feature, id, `sgtools`)
      ],
      id: `esgst-paths-sgtools`,
      name: `Where to run it on SGTools?`
    });
  }
  const context = document.querySelector(`.esgst-settings-menu-feature`);
  if (!context.classList.contains(`esgst-menu-split-fixed`)) {
    context.style.maxHeight = `${context.closest(`.esgst-menu-layer`).offsetHeight - 24}px`;
  }
  context.innerHTML = `Click on a feature/option to manage it here.`;
  container.common.createFormRows(context, `beforeEnd`, { items });
}

function setElementOrderingSection(context) {
  const obj = {
    elementOrdering: true,
    outerWrap: container.common.createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-element-ordering-container`
      },
      type: `div`
    }])
  };
  const obj_gv = {
    elementOrdering: true,
    outerWrap: container.common.createElements(context, `beforeEnd`, [{
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
    const section = container.common.createElements((item.isGridView ? obj_gv : obj).outerWrap, `beforeEnd`, [{
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
      callback1: resetElementOrdering.bind(null, item.id, obj, obj_gv)
    }).set, section);
    (item.isGridView ? obj_gv : obj)[item.key] = section;
    section.addEventListener(`dragenter`, container.common.draggable_enter.bind(container.common, {
      context: section,
      item: {
        outerWrap: section
      }
    }));
    container.common.draggable_set({
      context: section,
      id: item.id,
      item: {
        outerWrap: section
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
      const section_gv = container.common.createElements(obj_gv.outerWrap, `beforeEnd`, [{
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
        callback1: resetElementOrdering.bind(null, `${item.id}_gv`, obj, obj_gv)
      }).set, section_gv);
      obj_gv[item.key] = section_gv;
      section_gv.addEventListener(`dragenter`, container.common.draggable_enter.bind(container.common, {
        context: section_gv,
        item: {
          outerWrap: section_gv
        }
      }));
      container.common.draggable_set({
        context: section_gv,
        id: `${item.id}_gv`,
        item: {
          outerWrap: section_gv
        }
      });
    }
  }
  container.esgst.modules.giveaways.giveaways_reorder(obj);
  container.esgst.modules.giveaways.giveaways_reorder(obj_gv);
  container.common.reorderButtons(obj);
}

async function resetElementOrdering(id, obj, obj_gv) {
  container.esgst[id] = container.esgst.settings[id] = container.esgst.defaultValues[id];
  await container.common.setValue(`settings`, JSON.stringify(container.esgst.settings));
  container.esgst.modules.giveaways.giveaways_reorder(obj);
  container.esgst.modules.giveaways.giveaways_reorder(obj_gv);
  container.common.reorderButtons(obj);
}

function openPathsPopup(feature, id, name) {
  feature.id = id;
  let obj = {
    exclude: { extend: addPath },
    excludeItems: [],
    include: { extend: addPath },
    includeItems: [],
    name: name
  };
  const context = container.common.createElements_v2([
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
  obj.setting = container.common.getFeaturePath(feature, id, obj.name);
  obj.setting.include.forEach(path => obj.include.extend(feature, `include`, obj, path));
  obj.setting.exclude.forEach(path => obj.exclude.extend(feature, `exclude`, obj, path));
  return context;
}

function addPath(context, feature, key, obj, path, userAdded) {
  let item = {};
  item.container = container.common.createElements(context, `beforeEnd`, [{
    type: `div`
  }]);
  item.switch = new ToggleSwitch(item.container, null, true, ``, false, false, null, path.enabled);
  let found = false;
  item.switch.onChange = () => {
    savePaths(feature.id, obj);
  };
  item.select = container.common.createElements_v2(item.container, `beforeEnd`, [
    [`select`, { class: `esgst-switch-input esgst-switch-input-large` }, [
      ...(container.esgst.paths[obj.name].filter(x => !feature[`${obj.name}Paths`] || x.name === `Everywhere` || x.name.match(feature[`${obj.name}Paths`])).map(x =>
        [`option`, Object.assign({ value: x.pattern }, x.pattern === path.pattern && (found = true) ? { selected: true } : null), x.name]
      )),
      feature[`${obj.name}Paths`] ? null : [`option`, Object.assign({ value: `custom` }, found ? null : { selected: true }), `Custom`]
    ]]
  ]);
  item.input = container.common.createElements_v2(item.container, `beforeEnd`, [
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
    savePaths(feature.id, obj);
  });
  item.input.value = path.pattern;
  item.input.addEventListener(`input`, () => {
    validatePathRegex(item);
    savePaths(feature.id, obj);
  });
  container.common.createElements(item.container, `beforeEnd`, [{
    attributes: {
      class: `fa fa-times-circle esgst-clickable`,
      title: `Remove`
    },
    type: `i`
  }]).addEventListener(`click`, () => removePath(feature, item, key, obj));
  item.invalid = container.common.createElements(item.container, `beforeEnd`, [{
    attributes: {
      class: `fa fa-exclamation esgst-hidden esgst-red`,
      title: `Invalid Regular Expression`
    },
    type: `i`
  }]);
  obj[`${key}Items`].push(item);
  if (key === `include` && feature.includeOptions) {
    item.options = [];
    const optionsContainer = container.common.createElements(item.container, `beforeEnd`, [{
      attributes: {
        class: `esgst-form-row-indent`
      },
      type: `div`
    }]);
    for (const option of feature.includeOptions) {
      item.options.push({
        id: option.id,
        switch: new ToggleSwitch(optionsContainer, null, true, option.name, false, false, null, !!(path.options && path.options[option.id]))
      });
    }
  }
  if (userAdded) {
    savePaths(feature.id, obj);
  }
}

function removePath(feature, item, key, obj) {
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
  savePaths(feature.id, obj);
}

function validatePathRegex(item) {
  item.invalid.classList.add(`esgst-hidden`);
  try {
    new RegExp(item.input.value);
  } catch (error) {
    window.console.log(error);
    item.invalid.classList.remove(`esgst-hidden`);
  }
}

async function savePaths(id, obj) {
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
  container.esgst.settings[`${id}_${obj.name}`] = obj.setting;
}

function dismissNewOption(id, event) {
  event.currentTarget.remove();
  if (container.esgst.dismissedOptions.indexOf(id) < 0) {
    container.esgst.dismissedOptions.push(id);
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings.dismissedOptions = container.esgst.dismissedOptions;
  }
}

function getSMFeature(feature, id, number, popup) {
  container.esgst.featuresById[id] = feature;
  const menu = document.createElement(`div`);
  menu.id = `esgst_${id}`;
  container.common.createElements(menu, `beforeEnd`, [{
    attributes: {
      class: `esgst-sm-small-number esgst-form-heading-number`
    },
    text: `${number}.`,
    type: `div`
  }]);
  let isMainNew = container.esgst.dismissedOptions.indexOf(id) < 0 && !utils.isSet(container.esgst.settings[`${id}_sg`]) && !utils.isSet(container.esgst.settings[`${id}_st`]) && !utils.isSet(container.esgst.settings[`${id}_sgtools`]);
  if (isMainNew) {
    feature.isNew = true;
    container.common.createElements(menu.firstElementChild, `afterEnd`, [{
      attributes: {
        class: `esgst-bold esgst-red esgst-clickable esgst-new-indicator`,
        title: `This is a new feature/option. Click to dismiss.`
      },
      text: `[NEW]`,
      type: `span`
    }]).addEventListener(`click`, event => dismissNewOption(id, event));
  }
  let isHidden = true;
  let sgContext, stContext, sgtoolsContext;
  let collapseButton, isExpanded, subMenu;
  if (feature.sg) {
    const value = container.common.getFeaturePath(feature, id, `sg`).enabled;
    if (value) {
      isHidden = false;
    }
    sgContext = container.common.createElements_v2([[`div`]]).firstElementChild;
    const sgSwitch = new ToggleSwitch(sgContext, null, true, container.esgst.settings.esgst_st || container.esgst.settings.esgst_sgtools ? `[SG]` : ``, true, false, null, value);
    feature.sgSwitch = sgSwitch;
    sgSwitch.onEnabled = () => {
      if (feature.conflicts) {
        for (const conflictId of feature.conflicts) {
          const setting = container.esgst.settings[`${conflictId}_sg`];
          if ((typeof setting === `object` && setting.enabled) || setting) {
            sgSwitch.disable(true);
            new Popup({
              addScrollable: true,
              icon: `fa-exclamation`,
              isTemp: true,
              title: `This feature conflicts with ${container.common.getFeatureName(null, conflictId)}. While that feature is enabled, this feature cannot be enabled.`
            }).open();
            return;
          }
        }
      }
      loadFeatureDetails(id, popup && popup.scrollable.offsetTop);
      if (feature.sgFeatureSwitch) {
        feature.sgFeatureSwitch.enable();
      } else {
        container.esgst.settings[`${id}_sg`] = true;
        container.esgst[id] = true;
      }
      if (collapseButton && subMenu.classList.contains(`esgst-hidden`)) {
        expandOptions(collapseButton, id, subMenu);
        isExpanded = true;
      }
    };
    sgSwitch.onDisabled = async () => {
      loadFeatureDetails(id, popup && popup.scrollable.offsetTop);
      if (feature.sgFeatureSwitch) {
        feature.sgFeatureSwitch.disable();
      } else {
        container.esgst.settings[`${id}_sg`] = false;
        container.esgst[id] = false;
      }
      if (collapseButton && feature.stSwitch && !feature.stSwitch.value) {
        collapseOptions(collapseButton, id, subMenu);
        isExpanded = false;
      }
    };
  }
  if (feature.st && (container.esgst.settings.esgst_st || id === `esgst`)) {
    const value = container.common.getFeaturePath(feature, id, `st`).enabled;
    if (value) {
      isHidden = false;
    }
    stContext = container.common.createElements_v2([[`div`]]).firstElementChild;
    const stSwitch = new ToggleSwitch(stContext, null, true, `[ST]`, false, true, null, value);
    feature.stSwitch = stSwitch;
    stSwitch.onEnabled = () => {
      if (feature.conflicts) {
        for (const conflictId of feature.conflicts) {
          const setting = container.esgst.settings[`${conflictId}_st`];
          if ((typeof setting === `object` && setting.enabled) || setting) {
            stSwitch.disable(true);
            new Popup({
              addScrollable: true,
              icon: `fa-exclamation`,
              isTemp: true,
              title: `This feature conflicts with ${container.common.getFeatureName(null, conflictId)}. While that feature is enabled, this feature cannot be enabled.`
            }).open();
            return;
          }
        }
      }
      loadFeatureDetails(id, popup && popup.scrollable.offsetTop);
      if (feature.stFeatureSwitch) {
        feature.stFeatureSwitch.enable();
      } else {
        container.esgst.settings[`${id}_st`] = true;
        container.esgst[id] = true;
      }
      if (collapseButton && subMenu.classList.contains(`esgst-hidden`)) {
        expandOptions(collapseButton, id, subMenu);
        isExpanded = true;
      }
    };
    stSwitch.onDisabled = async () => {
      loadFeatureDetails(id, popup && popup.scrollable.offsetTop);
      if (feature.stFeatureSwitch) {
        feature.stFeatureSwitch.disable();
      } else {
        container.esgst.settings[`${id}_st`] = false;
        container.esgst[id] = false;
      }
      if (collapseButton && feature.sgSwitch && !feature.sgSwitch.value) {
        collapseOptions(collapseButton, id, subMenu);
        isExpanded = false;
      }
    };
  }
  if (feature.sgtools && (container.esgst.settings.esgst_sgtools || id === `esgst`)) {
    const value = container.common.getFeaturePath(feature, id, `sgtools`).enabled;
    if (value) {
      isHidden = false;
    }
    sgtoolsContext = container.common.createElements_v2([[`div`]]).firstElementChild;
    const sgtoolsSwitch = new ToggleSwitch(sgtoolsContext, null, true, `[SGT]`, false, true, null, value);
    feature.sgtoolsSwitch = sgtoolsSwitch;
    sgtoolsSwitch.onEnabled = () => {
      if (feature.conflicts) {
        for (const conflictId of feature.conflicts) {
          const setting = container.esgst.settings[`${conflictId}_sgtools`];
          if ((typeof setting === `object` && setting.enabled) || setting) {
            sgtoolsSwitch.disable(true);
            new Popup({
              addScrollable: true,
              icon: `fa-exclamation`,
              isTemp: true,
              title: `This feature conflicts with ${container.common.getFeatureName(null, conflictId)}. While that feature is enabled, this feature cannot be enabled.`
            }).open();
            return;
          }
        }
      }
      loadFeatureDetails(id, popup && popup.scrollable.offsetTop);
      if (feature.sgtoolsFeatureSwitch) {
        feature.sgtoolsFeatureSwitch.enable();
      } else {
        container.esgst.settings[`${id}_sgtools`] = true;
        container.esgst[id] = true;
      }
      if (collapseButton && subMenu.classList.contains(`esgst-hidden`)) {
        expandOptions(collapseButton, id, subMenu);
        isExpanded = true;
      }
    };
    sgtoolsSwitch.onDisabled = async () => {
      loadFeatureDetails(id, popup && popup.scrollable.offsetTop);
      if (feature.sgtoolsFeatureSwitch) {
        feature.sgtoolsFeatureSwitch.disable();
      } else {
        container.esgst.settings[`${id}_sgtools`] = false;
        container.esgst[id] = false;
      }
      if (collapseButton && feature.sgtoolsSwitch && !feature.sgtoolsSwitch.value) {
        collapseOptions(collapseButton, id, subMenu);
        isExpanded = false;
      }
    };
  }
  container.common.createElements_v2(menu, `beforeEnd`, [
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
      if (!subFt.sg && (((subFt.sgtools && !container.esgst.settings.esgst_sgtools) || (subFt.st && !container.esgst.settings.esgst_st)) && id !== `esgst`)) {
        continue;
      }
      const subFeature = getSMFeature(subFt, subId, i, popup);
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
      container.common.createElements(menu.firstElementChild, `afterEnd`, [{
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
    if (container.esgst.makeSectionsCollapsible) {
      collapseButton = container.common.createElements(menu, `afterBegin`, [{
        attributes: {
          class: `esgst-clickable`,
          style: `margin-right: 5px;`
        },
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-${container.esgst.settings[`collapse_${id}`] ? `plus` : `minus`}-square`,
            title: `${container.esgst.settings[`collapse_${id}`] ? `Expand` : `Collapse`} options`
          },
          type: `i`
        }]
      }]);
      if (container.esgst.settings[`collapse_${id}`]) {
        subMenu.classList.add(`esgst-hidden`);
        isExpanded = false;
      } else {
        isExpanded = true;
      }
      collapseButton.addEventListener(`click`, () => {
        if (isExpanded) {
          collapseOptions(collapseButton, id, subMenu);
        } else {
          expandOptions(collapseButton, id, subMenu);
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

function collapseOptions(collapseButton, id, subMenu) {
  subMenu.classList.add(`esgst-hidden`);
  container.common.createElements(collapseButton, `inner`, [{
    attributes: {
      class: `fa fa-plus-square`,
      title: `Expand options`
    },
    type: `i`
  }]);
  container.esgst.settings[`collapse_${id}`] = true;
}

function expandOptions(collapseButton, id, subMenu) {
  subMenu.classList.remove(`esgst-hidden`);
  container.common.createElements(collapseButton, `inner`, [{
    attributes: {
      class: `fa fa-minus-square`,
      title: `Collapse options`
    },
    type: `i`
  }]);
  delete container.esgst.settings[`collapse_${id}`];
}

function getSmFeatureAdditionalOptions(Feature, ID) {
  let items = [];
  if (ID === `ul`) {
    items.push(addUlMenuPanel(`ul_links`));
  } else if (ID === `gch`) {
    items.push(addGwcrMenuPanel(`gch_colors`, `copies`, true));
  } else if (ID === `glh`) {
    items.push(addGwcrMenuPanel(`glh_colors`, `level`, true, `10`));
  } else if (ID === `gwc`) {
    items.push(addGwcrMenuPanel(`gwc_colors`, `chance`));
  } else if (ID === `gwr`) {
    items.push(addGwcrMenuPanel(`gwr_colors`, `ratio`));
  } else if (ID === `gptw`) {
    items.push(addGwcrMenuPanel(`gptw_colors`, `points to win`));
  } else if (ID === `geth`) {
    items.push(addGwcrMenuPanel(`geth_colors`, `hours`));
  } else if (ID === `gc_r`) {
    items.push(addGcRatingPanel());
  } else if (ID === `gc_o_a`) {
    items.push(addGcAltMenuPanel());
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
      const color = rgba2Hex(container.esgst[`${ID}_${id}`]);
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
    const context = container.common.createElements_v2([
      [`div`, { class: `esgst-sm-colors` }, children]
    ]).firstElementChild;
    const elements = context.querySelectorAll(`[data-color-id]`);
    for (const hexInput of elements) {
      const colorId = hexInput.getAttribute(`data-color-id`);
      const alphaInput = hexInput.nextElementSibling;
      addColorObserver(hexInput, alphaInput, ID, colorId);
      alphaInput.nextElementSibling.addEventListener(`click`, container.common.resetColor.bind(container.common, hexInput, alphaInput, ID, colorId));
    }
    items.push(context);
    if (ID === `gc_g`) {
      const input = container.common.createElements_v2([
        [`div`, { class: `esgst-sm-colors` }, [
          `Only show the following genres: `,
          [`input`, { type: `text`, value: container.esgst.gc_g_filters }],
          [`i`, { class: `fa fa-question-circle`, title: `If you enter genres here, a genre category will only appear if the game has the listed genre. Separate genres with a comma, for example: Genre1, Genre2` }]
        ]]
      ]).firstElementChild;
      container.common.observeChange(input.firstElementChild, `gc_g_filters`);
      items.push(input);
      items.push(addGcMenuPanel());
    }
    if (Feature.input) {
      const input = container.common.createElements_v2([
        [`div`, { class: `esgst-sm-colors` }, [
          `Icon: `,
          [`input`, { type: `text`, value: container.esgst[`${ID}Icon`] }],
          [`i`, { class: `esgst-clickable fa fa-question-circle` }],
          [`br`],
          `Label: `,
          [`input`, { type: `text`, value: container.esgst[`${ID}Label`] }]
        ]]
      ]).firstElementChild;
      container.common.createTooltip(input.firstElementChild.nextElementSibling, `The name of the icon must be any name in this page: <a href="https://fontawesome.com/v4.7.0/icons/">https://fontawesome.com/v4.7.0/icons/</a>`);
      let icon = input.firstElementChild;
      let label = input.lastElementChild;
      container.common.observeChange(icon, `${ID}Icon`);
      container.common.observeChange(label, `${ID}Label`);
      if (ID === `gc_rd`) {
        container.common.createElements(input, `beforeEnd`, [{
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
    let containerr = container.common.createElements_v2([
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
        attributes.value = container.esgst[item.id];
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
        context = container.common.createElements(containerr, `beforeEnd`, [{
          type: `div`,
          children
        }]);
      input = context.firstElementChild;
      if (item.play) {
        input.nextElementSibling.addEventListener(`click`, async () => (await container.esgst.modules.generalHeaderRefresher.hr_createPlayer(container.esgst.settings[item.id] || container.esgst.modules.generalHeaderRefresher.hr_getDefaultSound())).play());
      }
      if (typeof container.esgst.settings[item.id] === `undefined` && container.esgst.dismissedOptions.indexOf(item.id) < 0) {
        Feature.isNew = true;
        container.common.createElements(context, `afterBegin`, [{
          attributes: {
            class: `esgst-bold esgst-red esgst-clickable esgst-new-indicator`,
            title: `This is a new feature/option. Click to dismiss.`
          },
          text: `[NEW]`,
          type: `span`
        }]).addEventListener(`click`, event => dismissNewOption(item.id, event));
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
          readHrAudioFile(ID, event);
        } else if (item.event === `keydown`) {
          event.preventDefault();
          // noinspection JSIgnoredPromiseFromCall
          container.esgst.settings[item.id] = event.key;
          container.esgst[item.id] = event.key;
          input.value = event.key;
        } else {
          // noinspection JSIgnoredPromiseFromCall
          container.esgst.settings[item.id] = input.value;
          container.esgst[item.id] = input.value;
        }
      }, item.shortcutKey || false);
      if (item.shortcutKey) {
        input.addEventListener(`keyup`, () => {
          // noinspection JSIgnoredPromiseFromCall
          container.esgst.settings[item.id] = value;
          container.esgst[item.id] = value;
          input.value = value;
        });
      }
    });
    items.push(containerr);
  } else if (Feature.theme) {
    const children = [
      `Enabled from `,
      [`input`, { type: `text`, value: container.esgst[`${ID}_startTime`] }],
      ` to `,
      [`input`, { type: `text`, value: container.esgst[`${ID}_endTime`] }],
      [`i`, { class: `fa fa-question-circle`, title: `You can specify here what time of the day you want the theme to be enabled. Use the HH:MM format.` }],
      [`br`]
    ];
    if (ID === `customTheme`) {
      children.push(
        [`textarea`]
      );
    } else {
      children.push(
        [`div`, { class: `form__saving-button esgst-sm-colors-default`, id: ID }, `Update`],
        [`span`]
      );
    }
    let containerr = container.common.createElements_v2([
      [`div`, { class: `esgst-sm-colors` }, children]
    ]).firstElementChild;
    let startTime = containerr.firstElementChild;
    let endTime = startTime.nextElementSibling;
    container.common.observeChange(startTime, `${ID}_startTime`);
    container.common.observeChange(endTime, `${ID}_endTime`);
    if (ID === `customTheme`) {
      let textArea = containerr.lastElementChild;
      const value = container.common.getValue(ID);
      if (value) {
        textArea.value = JSON.parse(value);
      }
      textArea.addEventListener(`change`, async () => {
        await container.common.setValue(ID, JSON.stringify(textArea.value));
        // noinspection JSIgnoredPromiseFromCall
        container.common.setTheme();
      });
    } else {
      let version = containerr.lastElementChild,
        button = version.previousElementSibling;
      // noinspection JSIgnoredPromiseFromCall
      container.common.setThemeVersion(ID, version);
      button.addEventListener(`click`, async () => {
        let url = await getThemeUrl(ID, Feature.theme);
        container.common.createElements(button, `inner`, [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }, {
          text: ` Updating...`,
          type: `node`
        }]);
        let theme = JSON.stringify((await container.common.request({ method: `GET`, url })).responseText);
        await container.common.setValue(ID, theme);
        container.common.createElements(button, `inner`, [{
          text: `Update`,
          type: `node`
        }]);
        // noinspection JSIgnoredPromiseFromCall
        container.common.setThemeVersion(ID, version, theme);
        // noinspection JSIgnoredPromiseFromCall
        container.common.setTheme();
      });
    }
    items.push(containerr);
  }
  if (Feature.options) {
    const [key, options] = Array.isArray(Feature.options) ? [`_index_*`, Feature.options] : [`_index`, [Feature.options]];
    for (const [index, option] of options.entries()) {
      const currentKey = key.replace(/\*/, index);
      const selectedIndex = container.esgst[`${ID}${currentKey}`];
      const children = [];
      for (const value of option.values) {
        children.push(
          [`option`, value]
        );
      }
      const select = container.common.createElements_v2([
        [`div`, { class: `esgst-sm-colors` }, [
          option.title,
          [`select`, children]
        ]]
      ]).firstElementChild;
      select.firstElementChild.selectedIndex = selectedIndex;
      container.common.observeNumChange(select.firstElementChild, `${ID}${currentKey}`, false, `selectedIndex`);
      items.push(select);
    }
  }
  return items;
}

function readHrAudioFile(id, event) {
  let popup = new Popup({ addScrollable: true, icon: `fa-circle-o-notch fa-spin`, title: `Uploading...` });
  popup.open();
  try {
    let reader = new FileReader();
    reader.onload = () => saveHrFile(id, popup, reader);
    reader.readAsArrayBuffer(event.currentTarget.files[0]);
  } catch (e) {
    window.console.log(e);
    popup.icon.classList.remove(`fa-circle-o-notch`);
    popup.icon.classList.remove(`fa-spin`);
    popup.icon.classList.add(`fa-times`);
    popup.title.textContent = `An error happened.`;
  }
}

async function saveHrFile(id, popup, reader) {
  try {
    let bytes = new Uint8Array(reader.result);
    let binary = ``;
    for (let i = 0, n = reader.result.byteLength; i < n; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let string = window.btoa(binary);
    (await container.esgst.modules.generalHeaderRefresher.hr_createPlayer(string)).play();
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`${id}_sound`] = string;
    container.esgst[`${id}_sound`] = string;
    popup.close();
  } catch (e) {
    window.console.log(e);
    popup.icon.classList.remove(`fa-circle-o-notch`);
    popup.icon.classList.remove(`fa-spin`);
    popup.icon.classList.add(`fa-times`);
    popup.title.textContent = `An error happened.`;
  }
}

function addGwcrMenuPanel(id, key, background, upper = `100`) {
  const panel = container.common.createElements_v2([
    [`div`, { class: `esgst-sm-colors` }, [
      [`div`, { class: `form__saving-button esgst-sm-colors-default` }, [
        [`span`, `Add Color Setting`]
      ]],
      [`i`, { class: `fa fa-question-circle`, title: `Allows you to set different colors for different ${key} ranges.` }]
    ]]
  ]).firstElementChild;
  const button = panel.firstElementChild;
  for (let i = 0, n = container.esgst[id].length; i < n; ++i) {
    addGwcColorSetting(container.esgst[id][i], id, key, panel, background);
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
    container.esgst[id].push(colors);
    addGwcColorSetting(colors, id, key, panel, background);
  });
  return panel;
}

function addGwcColorSetting(colors, id, key, panel, background) {
  let bgColor, color, i, lower, n, remove, setting, upper;
  setting = container.common.createElements(panel, `beforeEnd`, [{
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
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[id] = container.esgst[id];
  });
  upper.addEventListener(`change`, () => {
    colors.upper = upper.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[id] = container.esgst[id];
  });
  color.addEventListener(`change`, () => {
    colors.color = color.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[id] = container.esgst[id];
  });
  if (bgColor) {
    bgColor.addEventListener(`change`, () => {
      colors.bgColor = bgColor.value;
      // noinspection JSIgnoredPromiseFromCall
      container.esgst.settings[id] = container.esgst[id];
    });
  }
  remove.addEventListener(`click`, () => {
    if (window.confirm(`Are you sure you want to delete this setting?`)) {
      for (i = 0, n = container.esgst[id].length; i < n && container.esgst[id][i] !== colors; ++i) {
      }
      if (i < n) {
        container.esgst[id].splice(i, 1);
        // noinspection JSIgnoredPromiseFromCall
        container.esgst.settings[id] = container.esgst[id];
        setting.remove();
      }
    }
  });
}

function addUlMenuPanel(id) {
  const panel = container.common.createElements_v2([
    [`div`, { class: `esgst-sm-colors` }, [
      [`div`],
      [`div`, { class: `form__saving-button esgst-sm-colors-default`, onclick: () => addUlMenuItem(id, panel) }, [
        [`span`, `Add Link`]
      ]],
      [`div`, { class: `form__saving-button esgst-sm-colors-default`, onclick: () => (container.esgst.settings[id] = container.esgst[id] = container.esgst.defaultValues[id]) && !(panel.firstElementChild.innerHTML = ``) && addUlMenuItems(id, panel) }, [
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
  container.common.draggable_set({
    addTrash: true,
    context: panel.firstElementChild,
    id: `ul_links`,
    item: {}
  });
  addUlMenuItems(id, panel);
  return panel;
}

function addUlMenuItems(id, panel) {
  for (const [i, link] of container.esgst[id].entries()) {
    addUlLink(i, id, link, panel);
  }
}

function addUlMenuItem(id, panel) {
  const link = {
    label: ``,
    url: ``
  };
  container.esgst[id].push(link);
  container.esgst.settings[id] = container.esgst[id];
  addUlLink(container.esgst[id].length - 1, id, link, panel);
}

function addUlLink(i, id, link, panel) {
  const setting = container.common.createElements_v2(panel.firstElementChild, `beforeEnd`, [
    [`div`, { 'data-draggable-id': i, 'data-draggable-obj': JSON.stringify(link) }, [
      `Label: `,
      [`input`, { onchange: event => (link.label = event.currentTarget.value) && setting.setAttribute(`data-draggable-obj`, JSON.stringify(link)), type: `text`, value: link.label }],
      `URL: `,
      [`input`, { onchange: event => (link.url = event.currentTarget.value) && setting.setAttribute(`data-draggable-obj`, JSON.stringify(link)), type: `text`, value: link.url }]
    ]]
  ]);
  container.common.draggable_set({
    addTrash: true,
    context: panel.firstElementChild,
    id: `ul_links`,
    item: {}
  });
}

function addGcRatingPanel() {
  const panel = container.common.createElements_v2([
    [`div`, { class: `esgst-sm-colors` }, [
      [`div`, { class: `form__saving-button esgst-sm-colors-default` }, [
        [`span`, `Add Rating Setting`]
      ]],
      [`i`, { class: `fa fa-question-circle`, title: `Allows you to set different colors/icons for different rating ranges.` }]
    ]]
  ]).firstElementChild;
  let button = panel.firstElementChild;
  for (let i = 0, n = container.esgst.gc_r_colors.length; i < n; ++i) {
    addGcRatingColorSetting(container.esgst.gc_r_colors[i], panel);
  }
  button.addEventListener(`click`, () => {
    let colors = {
      color: ``,
      bgColor: ``,
      icon: ``,
      lower: ``,
      upper: ``
    };
    container.esgst.gc_r_colors.push(colors);
    addGcRatingColorSetting(colors, panel);
  });
  return panel;
}

function addGcRatingColorSetting(colors, panel) {
  let setting = container.common.createElements(panel, `beforeEnd`, [{
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
  container.common.createTooltip(tooltip, `The name of the icon can be any name from <a href="https://fontawesome.com/v4.7.0/icons/">FontAwesome</a> or any text. For example, if you want to use alt symbols like ▲ (Alt + 3 + 0) and ▼ (Alt + 3 + 1), you can.`);
  let remove = tooltip.nextElementSibling;
  lower.addEventListener(`change`, () => {
    colors.lower = lower.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_r_colors`] = container.esgst.gc_r_colors;
  });
  upper.addEventListener(`change`, () => {
    colors.upper = upper.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_r_colors`] = container.esgst.gc_r_colors;
  });
  color.addEventListener(`change`, () => {
    colors.color = color.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_r_colors`] = container.esgst.gc_r_colors;
  });
  bgColor.addEventListener(`change`, () => {
    colors.bgColor = bgColor.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_r_colors`] = container.esgst.gc_r_colors;
  });
  icon.addEventListener(`change`, () => {
    colors.icon = icon.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_r_colors`] = container.esgst.gc_r_colors;
  });
  remove.addEventListener(`click`, () => {
    if (window.confirm(`Are you sure you want to delete this setting?`)) {
      let i, n;
      for (i = 0, n = container.esgst.gc_r_colors.length; i < n && container.esgst.gc_r_colors[i] !== colors; ++i) {
      }
      if (i < n) {
        container.esgst.gc_r_colors.splice(i, 1);
        // noinspection JSIgnoredPromiseFromCall
        container.esgst.settings[`gc_r_colors`] = container.esgst.gc_r_colors;
        setting.remove();
      }
    }
  });
}

function addGcMenuPanel() {
  let button, colorSetting, i, n;
  const panel = container.common.createElements_v2([
    [`div`, { class: `esgst-sm-colors` }, [
      [`div`, { class: `form__saving-button esgst-sm-colors-default` }, [
        [`span`, `Add Custom Genre Setting`]
      ]],
      [`i`, { class: `fa fa-question-circle`, title: `Allows you to color genres (colored genres will appear at the beginning of the list).` }]
    ]]
  ]).firstElementChild;
  button = panel.firstElementChild;
  for (i = 0, n = container.esgst.gc_g_colors.length; i < n; ++i) {
    addGcColorSetting(container.esgst.gc_g_colors[i], panel);
  }
  button.addEventListener(`click`, () => {
    colorSetting = {
      bgColor: `#7f8c8d`,
      color: `#ffffff`,
      genre: ``
    };
    container.esgst.gc_g_colors.push(colorSetting);
    addGcColorSetting(colorSetting, panel);
  });
  return panel;
}

function addGcColorSetting(colorSetting, panel) {
  let bgColor, color, genre, i, n, remove, setting;
  setting = container.common.createElements(panel, `beforeEnd`, [{
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
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_g_colors`] = container.esgst.gc_g_colors;
  });
  color.addEventListener(`change`, () => {
    colorSetting.color = color.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_g_colors`] = container.esgst.gc_g_colors;
  });
  bgColor.addEventListener(`change`, () => {
    colorSetting.bgColor = bgColor.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_g_colors`] = container.esgst.gc_g_colors;
  });
  remove.addEventListener(`click`, () => {
    if (window.confirm(`Are you sure you want to delete this setting?`)) {
      for (i = 0, n = container.esgst.gc_g_colors.length; i < n && container.esgst.gc_g_colors[i] !== colorSetting; ++i) {
      }
      if (i < n) {
        container.esgst.gc_g_colors.splice(i, 1);
        // noinspection JSIgnoredPromiseFromCall
        container.esgst.settings[`gc_g_colors`] = container.esgst.gc_g_colors;
        setting.remove();
      }
    }
  });
}

function addGcAltMenuPanel() {
  let altSetting, button, i, n;
  const panel = container.common.createElements_v2([
    [`div`, { class: `esgst-sm-colors` }, [
      [`div`, { class: `form__saving-button esgst-sm-colors-default` }, [
        [`span`, `Add Alt Account`]
      ]]
    ]]
  ]).firstElementChild;
  button = panel.firstElementChild;
  container.common.createTooltip(container.common.createElements(panel, `beforeEnd`, [{
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
  for (i = 0, n = container.esgst.gc_o_altAccounts.length; i < n; ++i) {
    addGcAltSetting(container.esgst.gc_o_altAccounts[i], panel);
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
    container.esgst.gc_o_altAccounts.push(altSetting);
    addGcAltSetting(altSetting, panel);
  });
  return panel;
}

function addGcAltSetting(altSetting, panel) {
  let color, bgColor, i, icon, label, n, name, remove, setting, steamId;
  setting = container.common.createElements(panel, `beforeEnd`, [{
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
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_o_altAccounts`] = container.esgst.gc_o_altAccounts;
  });
  name.addEventListener(`change`, () => {
    altSetting.name = name.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_o_altAccounts`] = container.esgst.gc_o_altAccounts;
  });
  color.addEventListener(`change`, () => {
    altSetting.color = color.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_o_altAccounts`] = container.esgst.gc_o_altAccounts;
  });
  bgColor.addEventListener(`change`, () => {
    altSetting.bgColor = bgColor.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_o_altAccounts`] = container.esgst.gc_o_altAccounts;
  });
  icon.addEventListener(`change`, () => {
    altSetting.icon = icon.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_o_altAccounts`] = container.esgst.gc_o_altAccounts;
  });
  label.addEventListener(`change`, () => {
    altSetting.label = label.value;
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`gc_o_altAccounts`] = container.esgst.gc_o_altAccounts;
  });
  remove.addEventListener(`click`, () => {
    if (window.confirm(`Are you sure you want to delete this setting?`)) {
      for (i = 0, n = container.esgst.gc_o_altAccounts.length; i < n && container.esgst.gc_o_altAccounts[i] !== altSetting; ++i) {
      }
      if (i < n) {
        container.esgst.gc_o_altAccounts.splice(i, 1);
        // noinspection JSIgnoredPromiseFromCall
        container.esgst.settings[`gc_o_altAccounts`] = container.esgst.gc_o_altAccounts;
        setting.remove();
      }
    }
  });
}

function addColorObserver(hexInput, alphaInput, id, colorId) {
  hexInput.addEventListener(`change`, () => {
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`${id}_${colorId}`] = hex2Rgba(hexInput.value, alphaInput.value);
  });
  alphaInput.addEventListener(`change`, () => {
    // noinspection JSIgnoredPromiseFromCall
    container.esgst.settings[`${id}_${colorId}`] = hex2Rgba(hexInput.value, alphaInput.value);
  });
}

function getThemeUrl(id, url) {
  return new Promise(resolve => openThemePopup(id, url, resolve));
}

function openThemePopup(id, url, resolve) {
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
        callback1: () => generateThemeUrl(obj, key)
      }
    ],
    addScrollable: true
  });
  obj.popup.onClose = resolve.bind(container.common, url);
  let context = obj.popup.getScrollable([{
    attributes: {
      class: `esgst-sm-colors`
    },
    type: `div`
  }]).firstElementChild;
  obj.options[key].forEach(option => {
    option.select = container.common.createElements(context, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `${option.name} `,
        type: `node`
      }, {
        type: `select`
      }]
    }]).lastElementChild;
    (option.options || binaryOptions).forEach(subOption => {
      container.common.createElements(option.select, `beforeEnd`, [{
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

function generateThemeUrl(obj, key) {
  obj.url += `?`;
  obj.options[key].forEach(option => {
    obj.url += `${option.id}=${option.select.value}&`;
  });
  obj.url = obj.url.slice(0, -1);
  obj.popup.onClose = null;
  obj.popup.close();
  obj.resolve(obj.url);
}

function createMenuSection(context, html, number, title, type) {
  let section = container.common.createElements(context, `beforeEnd`, [{
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
  if (container.esgst.makeSectionsCollapsible && !title.match(/Backup|Restore|Delete/)) {
    let button, containerr, isExpanded;
    button = container.common.createElements(section.firstElementChild, `afterBegin`, [{
      attributes: {
        class: `esgst-clickable`,
        style: `margin-right: 5px;`
      },
      type: `span`,
      children: [{
        attributes: {
          class: `fa fa-${container.esgst[`collapse_${type}`] ? `plus` : `minus`}-square`,
          title: `${container.esgst[`collapse_${type}`] ? `Expand` : `Collapse`} section`
        },
        type: `i`
      }]
    }]);
    containerr = section.lastElementChild;
    if (container.esgst[`collapse_${type}`]) {
      containerr.classList.add(`esgst-hidden`);
      isExpanded = false;
    } else {
      isExpanded = true;
    }
    button.addEventListener(`click`, () => {
      if (isExpanded) {
        containerr.classList.add(`esgst-hidden`);
        container.common.createElements(button, `inner`, [{
          attributes: {
            class: `fa fa-plus-square`,
            title: `Expand section`
          },
          type: `i`
        }]);
        isExpanded = false;
      } else {
        containerr.classList.remove(`esgst-hidden`);
        container.common.createElements(button, `inner`, [{
          attributes: {
            class: `fa fa-minus-square`,
            title: `Collapse section`
          },
          type: `i`
        }]);
        isExpanded = true;
      }
      container.esgst.settings[`collapse_${type}`] = !isExpanded;
    });
  }
  return section;
}

function filterSm(event) {
  let collapse, element, expand, found, id, type, typeFound, value;
  value = event.currentTarget.value.toLowerCase().trim().replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  for (type in container.esgst.features) {
    if (container.esgst.features.hasOwnProperty(type)) {
      found = false;
      typeFound = false;
      for (id in container.esgst.features[type].features) {
        if (container.esgst.features[type].features.hasOwnProperty(id)) {
          unfadeSmFeatures(container.esgst.features[type].features[id], id);
          found = filterSmFeature(container.esgst.features[type].features[id], id, value);
          if (found) {
            typeFound = true;
            unhideSmFeature(container.esgst.features[type].features[id], id);
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

function unfadeSmFeatures(feature, id) {
  let element = document.getElementById(`esgst_${id}`);
  if (element) {
    element.classList.remove(`esgst-sm-faded`);
  }
  if (feature.features) {
    for (id in feature.features) {
      if (feature.features.hasOwnProperty(id)) {
        unfadeSmFeatures(feature.features[id], id);
      }
    }
  }
}

function filterSmFeature(feature, id, value) {
  let found = !value || (typeof feature.name === `string` ? feature.name : JSON.stringify(feature.name)).toLowerCase().match(value) || (value === `\\[new\\]` && feature.isNew);
  let exactFound = found;
  if (!value || !found) {
    if (!found) {
      exactFound = found = (feature.description && JSON.stringify(feature.description).toLowerCase().match(value));
    }
    if ((!value || !found) && feature.features) {
      for (const subId in feature.features) {
        if (feature.features.hasOwnProperty(subId)) {
          found = filterSmFeature(feature.features[subId], subId, value) || found;
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

function unhideSmFeature(feature, id) {
  let element = document.getElementById(`esgst_${id}`);
  if (element) {
    element.classList.remove(`esgst-hidden`);
  }
  if (feature.features) {
    for (id in feature.features) {
      if (feature.features.hasOwnProperty(id)) {
        unhideSmFeature(feature.features[id], id);
      }
    }
  }
}

export {
  createMenuSection,
  loadMenu
};