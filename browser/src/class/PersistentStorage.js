import { IHeader } from '../components/Header';
import { Utils } from '../lib/jsUtils';
import { generalCustomHeaderFooterLinks } from '../modules/General/CustomHeaderFooterLinks';
import { Settings } from './Settings';
import { Shared } from './Shared';
import { LocalStorage } from './LocalStorage';

class PersistentStorage {
  constructor() {
    this.currentVersion = 7;

    this.defaultValues = {
      decryptedGiveaways: '{}',
      delistedGames: '{ "banned": [], "removed": [] }',
      discussions: '{}',
      emojis: '[]',
      entries: '[]',
      games: '{ "apps": {}, "subs": {} }',
      gdtttCache: '{ "giveaways": [], "discussions": [], "tickets": [], "trades": [] }',
      giveaways: '{}',
      groups: '[]',
      notifiedMessages: '{ "lastCheck": 0, "ids": [] }',
      rerolls: '[]',
      rfiCache: '{}',
      settings: '{}',
      stickiedCountries: '[]',
      templates: '[]',
      tickets: '{}',
      trades: '{}',
      users: '{ "steamIds": {}, "users": {} }',
      winners: '{}',
    };
  }

  async upgrade(storage, version, isRestoring) {
    if (!Utils.isSet(storage)) {
      return;
    }

    const toDelete = [];
    const toSet = {};

    version = version || 1;

    if (version < 2) {
      window.console.log('Upgrading storage to version 2...');

      if (!Utils.isSet(storage.delistedGames)) {
        toSet.delistedGames = this.defaultValues.delistedGames;
      }

      if (Utils.isSet(storage.emojis)) {
        const fixedEmojis = Shared.common.fixEmojis(storage.emojis);

        if (storage.emojis !== fixedEmojis) {
          toSet.emojis = fixedEmojis;
        } else if (!storage.emojis) {
          toSet.emojis = this.defaultValues.emojis;
        }
      } else {
        toDelete.push('Emojis');

        toSet.emojis = Utils.isSet(storage.Emojis) ? Shared.common.fixEmojis(storage.Emojis) : this.defaultValues.emojis;
      }

      if (!Utils.isSet(storage.games)) {
        toSet.games = this.defaultValues.games;
      }

      if (!Utils.isSet(storage[`${Shared.esgst.name}RfiCache`])) {
        toSet[`${Shared.esgst.name}RfiCache`] = LocalStorage.get('replies', this.defaultValues.rfiCache);
        LocalStorage.delete('replies');
      }

      if (Utils.isSet(storage.users)) {
        let usersChanged = false;

        const users = JSON.parse(storage.users);

        for (const key of Object.keys(users.users)) {
          const wbc = users.users[key].wbc;

          if (wbc && wbc.result && wbc.result !== 'whitelisted' && wbc.result !== 'blacklisted') {
            delete users.users[key].wbc;

            usersChanged = true;
          }
        }

        if (usersChanged) {
          toSet.users = JSON.stringify(users);
        }
      } else {
        toSet.users = this.defaultValues.users;
      }

      if (Shared.esgst.sg) {
        if (Utils.isSet(storage.decryptedGiveaways)) {
          if (typeof storage.decryptedGiveaways !== 'string') {
            toSet.decryptedGiveaways = JSON.stringify(storage.decryptedGiveaways);
          }
        } else {
          toSet.decryptedGiveaways = this.defaultValues.decryptedGiveaways;
        }

        if (!Utils.isSet(storage.discussions)) {
          toSet.discussions = LocalStorage.get('discussions', this.defaultValues.discussions);
          LocalStorage.delete('discussions');
        }

        if (!Utils.isSet(storage.entries)) {
          toSet.entries = LocalStorage.get('entries', this.defaultValues.entries);
          LocalStorage.delete('entries');
        }

        if (!Utils.isSet(storage.giveaways)) {
          toSet.giveaways = LocalStorage.get('giveaways', this.defaultValues.giveaways);
          LocalStorage.delete('giveaways');
        }

        if (!Utils.isSet(storage.groups)) {
          toSet.groups = LocalStorage.get('groups', this.defaultValues.groups);
          LocalStorage.delete('groups');
        }

        if (!Utils.isSet(storage.rerolls)) {
          toSet.rerolls = LocalStorage.get('rerolls', this.defaultValues.rerolls);
          LocalStorage.delete('rerolls');
        }

        if (!Utils.isSet(storage.stickiedCountries)) {
          toSet.stickiedCountries = LocalStorage.get('stickiedCountries', this.defaultValues.stickiedCountries);
          LocalStorage.delete('stickiedCountries');
        }

        if (!Utils.isSet(storage.templates)) {
          toSet.templates = LocalStorage.get('templates', this.defaultValues.templates);
          LocalStorage.delete('templates');
        }

        if (!Utils.isSet(storage.tickets)) {
          toSet.tickets = LocalStorage.get('tickets', this.defaultValues.tickets);
          LocalStorage.delete('tickets');
        }

        if (!Utils.isSet(storage.winners)) {
          toSet.winners = LocalStorage.get('winners', this.defaultValues.winners);
          LocalStorage.delete('winners');
        }

        LocalStorage.delete('dFix');
        LocalStorage.delete('gFix');
        LocalStorage.delete('tFix');
      } else {
        if (!Utils.isSet(storage.trades)) {
          toSet.trades = LocalStorage.get('trades', this.defaultValues.trades);
          LocalStorage.delete('trades');
        }

        LocalStorage.delete('tFix');
      }

      if (!Utils.isSet(storage.settings)) {
        toSet.settings = this.defaultValues.settings;
        storage.settings = toSet.settings;
      }

      let settingsChanged = false;

      const settings = JSON.parse(storage.settings);

      if (settings.hasOwnProperty('avatar_sg')) {
        delete settings.avatar_sg;

        settingsChanged = true;
      }

      if (settings.hasOwnProperty('avatar_st')) {
        delete settings.avatar_st;

        settingsChanged = true;
      }

      if (settings.hasOwnProperty('username')) {
        delete settings.username;

        settingsChanged = true;
      }

      if (Utils.isSet(storage.filterPresets)) {
        const presets = (settings.gf_presets || Settings.defaultValues.gf_presets).concat(
          Shared.esgst.modules.giveawaysGiveawayFilters.filters_convert(JSON.parse(storage.filterPresets))
        );

        settings.gf_presets = presets;

        settingsChanged = true;

        toDelete.push('filterPresets');
        toSet.old_gf_presets = storage.filterPresets;
      }

      if (Utils.isSet(storage.dfPresets)) {
        const presets = (settings.df_presets || Settings.defaultValues.df_presets).concat(
          Shared.esgst.modules.giveawaysGiveawayFilters.filters_convert(JSON.parse(storage.dfPresets))
        );

        settings.df_presets = presets;

        settingsChanged = true;

        toDelete.push('dfPresets');
        toSet.old_df_presets = storage.dfPresets;
      }

      if (Utils.isSet(settings.comments)) {
        delete settings.comments;

        settingsChanged = true;
      }

      if (Utils.isSet(settings.giveaways)) {
        delete settings.giveaways;

        settingsChanged = true;
      }

      if (Utils.isSet(settings.groups)) {
        delete settings.groups;

        settingsChanged = true;
      }

      if (Utils.isSet(settings.users)) {
        delete settings.users;

        settingsChanged = true;
      }

      if (Utils.isSet(settings.gc_categories_ids)) {
        if (!settings.gc_categories_ids.includes('gc_f')) {
          settings.gc_categories_ids.push('gc_f');

          settingsChanged = true;
        }

        if (!settings.gc_categories_ids.includes('gc_bvg')) {
          settings.gc_categories_ids.push('gc_bvg');

          settingsChanged = true;
        }

        if (!settings.gc_categories_ids.includes('gc_bd')) {
          settings.gc_categories_ids.push('gc_bd');

          settingsChanged = true;
        }
      }

      ['gc_categories', 'gc_categories_gv', 'gc_categories_ids'].forEach(key => {
        if (!Utils.isSet(settings[key])) {
          return;
        }

        const bkpLength = settings[key].length;

        settings[key] = Array.from(new Set(settings[key]));

        if (bkpLength !== settings[key].length) {
          settingsChanged = true;
        }
      });

      if (settings.elementOrdering !== '1') {
        if (Utils.isSet(settings.leftButtonIds)) {
          for (let i = settings.leftButtonIds.length - 1; i > -1; i--) {
            const id = settings.leftButtonIds[i];

            if (!settings[`hideButtons_${id}_sg`]) {
              if (Utils.isSet(settings.leftMainPageHeadingIds)) {
                settings.leftMainPageHeadingIds.push(id);
              }

              settings.leftButtonIds.splice(i, 1);
            } else if (Utils.isSet(settings.rightButtonsIds) && settings.rightButtonIds.includes(id)) {
              settings.leftButtonIds.splice(i, 1);
            }
          }
        }

        if (Utils.isSet(settings.rightButtonIds)) {
          for (let i = settings.rightButtonIds.length - 1; i > -1; i--) {
            const id = settings.rightButtonIds[i];

            if (!settings[`hideButtons_${id}_sg`]) {
              if (Utils.isSet(settings.rightMainPageHeadingIds)) {
                settings.rightMainPageHeadingIds.push(id);
              }

              settings.rightButtonIds.splice(i, 1);
            } else if (Utils.isSet(settings.leftButtonIds) && settings.leftButtonIds.includes(id)) {
              settings.rightButtonIds.splice(i, 1);
            }
          }
        }

        if (Utils.isSet(settings.leftMainPageHeadingIds)) {
          for (let i = settings.leftMainPageHeadingIds.length - 1; i > -1; i--) {
            const id = settings.leftMainPageHeadingIds[i];

            if (!settings[`hideButtons_${id}_sg`]) {
              if (Utils.isSet(settings.leftButtonIds)) {
                settings.leftButtonIds.push(id);
              }

              settings.leftMainPageHeadingIds.splice(i, 1);
            } else if (Utils.isSet(settings.rightMainPageHeadingIds) && settings.rightMainPageHeadingIds.includes(id)) {
              settings.leftMainPageHeadingIds.splice(i, 1);
            }
          }
        }

        if (Utils.isSet(settings.rightMainPageHeadingIds)) {
          for (let i = settings.rightMainPageHeadingIds.length - 1; i > -1; i--) {
            const id = settings.rightMainPageHeadingIds[i];

            if (!settings[`hideButtons_${id}_sg`]) {
              if (Utils.isSet(settings.rightButtonIds)) {
                settings.rightButtonIds.push(id);
              }

              settings.rightMainPageHeadingIds.splice(i, 1);
            } else if (Utils.isSet(settings.leftMainPageHeadingIds) && settings.leftMainPageHeadingIds.includes(id)) {
              settings.rightMainPageHeadingIds.splice(i, 1);
            }
          }
        }

        settings.leftButtonIds = Array.from(new Set(settings.leftButtonIds));
        settings.rightButtonIds = Array.from(new Set(settings.rightButtonIds));
        settings.leftMainPageHeadingIds = Array.from(new Set(settings.leftMainPageHeadingIds));
        settings.rightMainPageHeadingIds = Array.from(new Set(settings.rightMainPageHeadingIds));

        settings.elementOrdering = '1';

        settingsChanged = true;
      }

      if (Utils.isSet(settings.leftButtonIds) && Utils.isSet(settings.rightButtonIds) && Utils.isSet(settings.leftMainPageHeadingIds) && Utils.isSet(settings.rightMainPageHeadingIds)) {
        [
          { id: 'cec', side: 'left' },
          { id: 'esContinuous', side: 'right' },
          { id: 'esNext', side: 'right' },
          { id: 'glwc', side: 'left' },
          { id: 'mm', side: 'right' },
          { id: 'stbb', side: 'right' },
          { id: 'sttb', side: 'right' },
          { id: 'usc', side: 'left' },
          { id: 'ust', side: 'left' },
          { id: 'wbm', side: 'left' },
          { id: 'df_s_s', side: 'left' },
          { id: 'gf_s_s', side: 'left' },
          { id: 'tf_s_s', side: 'left' },
          { id: 'uf_s_s', side: 'left' },
          { id: 'gmf', side: 'left' },
        ].forEach(item => {
          if (!settings.leftButtonIds.includes(item.id) && !settings.rightButtonIds.includes(item.id) && !settings.leftMainPageHeadingIds.includes(item.id) && !settings.rightMainPageHeadingIds.includes(item.id)) {
            settings[`${item.side}MainPageHeadingIds`].push(item.id);

            settingsChanged = true;
          }
        });
      }

      if (Utils.isSet(settings.chfl_discussions_sg)) {
        settings.chfl_discussions_sg = settings.chfl_discussions_sg.filter(x => ((typeof x === 'string' && x) || x.id) !== 'categorize-discussions');

        settingsChanged = true;
      }

      if (Utils.isSet(settings.chfl_footer_sg)) {
        const privacyPolicyIndex = settings.chfl_footer_sg.map((x, i) => ((typeof x === 'string' && x) || x.id) === 'privacy-policy' ? i : null).filter(x => Utils.isSet(x))[0];

        if (Utils.isSet(privacyPolicyIndex)) {
          settings.chfl_footer_sg.splice(privacyPolicyIndex + 1, 0, 'cookie-policy');
        } else {
          settings.chfl_footer_sg.push('cookie-policy');
        }

        const termsOfServiceIndex = settings.chfl_footer_sg.map((x, i) => ((typeof x === 'string' && x) || x.id) === 'terms-of-service' ? i : null).filter(x => Utils.isSet(x))[0];

        if (Utils.isSet(termsOfServiceIndex)) {
          settings.chfl_footer_sg.splice(termsOfServiceIndex + 1, 0, 'advertising');
        } else {
          settings.chfl_footer_sg.push('advertising');
        }

        settingsChanged = true;
      }

      if (settingsChanged) {
        toSet.settings = JSON.stringify(settings);
        storage.settings = toSet.settings;
      }
    }

    if (version < 3) {
      window.console.log('Upgrading storage to version 3...');

      let settingsChanged = false;

      const settings = JSON.parse(storage.settings);

      if (Utils.isSet(settings.chfl_discussions_sg)) {
        const index = settings.chfl_discussions_sg.indexOf('created');

        if (index > -1) {
          settings.chfl_discussions_sg.splice(index + 1, 0, 'bookmarked');
        } else {
          settings.chfl_discussions_sg.push('bookmarked');
        }

        settingsChanged = true;
      }

      if (settingsChanged) {
        toSet.settings = JSON.stringify(settings);
        storage.settings = toSet.settings;
      }
    }

    if (version < 4) {
      window.console.log('Upgrading storage to version 4...');

      let settingsChanged = false;

      const settings = JSON.parse(storage.settings);

      const keys = ['giveaways_sg', 'discussions_sg', 'support_sg', 'help_sg', 'account_sg', 'footer_sg', 'trades_st', 'account_st', 'footer_st'];

      for (const key of keys) {
        const source = key.match(/(.+?)_/)[1];

        if (Utils.isSet(settings[`chfl_${key}`])) {
          settings[`chfl_${key}`] = settings[`chfl_${key}`].map(item => {
            if (item.id) {
              item.id = IHeader.generateId(item.name);
            } else {
              item = generalCustomHeaderFooterLinks.newIds[source][item] || item;
            }

            return item;
          });

          settingsChanged = true;
        }
      }

      if (Utils.isSet(settings.chfl_account_st)) {
        const index = settings.chfl_account_st.indexOf('reviews');

        if (index > -1) {
          settings.chfl_account_st.splice(index + 1, 0, 'comments', 'settings');
        } else {
          settings.chfl_account_st.push('comments', 'settings');
        }

        settingsChanged = true;
      }

      if (Utils.isSet(settings.chfl_footer_st)) {
        let index = settings.chfl_footer_st.indexOf('privacyPolicy');

        if (index > -1) {
          settings.chfl_footer_st.splice(index + 1, 0, 'cookiePolicy');
        } else {
          settings.chfl_footer_st.push('cookiePolicy');
        }

        index = settings.chfl_footer_st.indexOf('termsOfService');

        if (index > -1) {
          settings.chfl_footer_st.splice(index + 1, 0, 'advertise');
        } else {
          settings.chfl_footer_st.push('advertise');
        }

        settingsChanged = true;
      }

      if (settingsChanged) {
        toSet.settings = JSON.stringify(settings);
        storage.settings = toSet.settings;
      }
    }

    if (version < 5) {
      window.console.log('Upgrading storage to version 5...');

      let settingsChanged = false;

      const settings = JSON.parse(storage.settings);

      if (settings.npth_nextRegex === 'forw|more|next|onwards|►|>|→') {
        settings.npth_nextRegex = 'forw|more|next|onwards?|►|>|→';

        settingsChanged = true;
      }

      if (settingsChanged) {
        toSet.settings = JSON.stringify(settings);
        storage.settings = toSet.settings;
      }
    }

    if (version < 7) {
      window.console.log('Upgrading storage to version 7...');

      if (storage.notifiedMessages) {
        toSet.notifiedMessages = JSON.stringify({
          lastCheck: 0,
          ids: JSON.parse(storage.notifiedMessages),
        });
      }
    }

    for (const key of Object.keys(toSet)) {
      storage[key] = toSet[key];
    }

    for (const key of Object.keys(this.defaultValues)) {
      if (!Utils.isSet(storage[key])) {
        toSet[key] = this.defaultValues[key];
        storage[key] = toSet[key];
      }
    }

    try {
      const emojis = JSON.parse(storage.emojis);
      if (typeof emojis === 'string') {
        toSet.emojis = emojis;
        storage.emojis = emojis;
      }
    } catch (e) {}

    const gdtttCache = JSON.parse(LocalStorage.get('gdtttCache', this.defaultValues.gdtttCache));

    for (const type of Object.keys(gdtttCache)) {
      if (!storage[type]) {
        continue;
      }

      let doSet = false;

      const data = JSON.parse(storage[type]);

      for (const code of gdtttCache[type]) {
        if (!data[code]) {
          data[code] = {
            readComments: {},
          };
        }

        if (!data[code].visited) {
          data[code].visited = true;

          doSet = true;
        }
      }

      if (doSet) {
        toSet[type] = JSON.stringify(data);
        storage[type] = toSet[type];
      }
    }

    LocalStorage.set('gdtttCache', this.defaultValues.gdtttCache);

    if (!isRestoring && version !== this.currentVersion) {
      if (Object.keys(toDelete).length > 0) {
        await Shared.common.delValues(toDelete);
      }

      if (Object.keys(toSet).length > 0) {
        await Shared.common.setValues(toSet);
      }

      await Shared.common.setValue('v', this.currentVersion);
    }
  }
}

const persistentStorage = new PersistentStorage();

export { persistentStorage };