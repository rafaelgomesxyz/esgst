import { shared } from './Shared';
import { Utils } from '../lib/jsUtils';
import { IHeader } from '../components/Header';
import { generalCustomHeaderFooterLinks } from '../modules/General/CustomHeaderFooterLinks';

class PersistentStorage {
  constructor() { }

  upgrade(settings, version, isRestoring) {
    if (!Utils.isSet(settings)) {
      return;
    }

    if (version === shared.esgst.CURRENT_STORAGE_VERSION) {
      return;
    }

    version = version || 1;

    if (version < 2) {
      if (Utils.isSet(settings.chfl_discussions_sg)) {
        settings.chfl_discussions_sg = settings.chfl_discussions_sg.filter(x => ((typeof x === 'string' && x) || x.id) !== 'categorize-discussions');
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
      }
      if (!isRestoring) {
        shared.esgst.settingsChanged = true;
      }
    }

    if (version < 3) {
      if (Utils.isSet(settings.chfl_discussions_sg)) {
        const index = settings.chfl_discussions_sg.indexOf('created');

        if (index > -1) {
          settings.chfl_discussions_sg.splice(index + 1, 0, 'bookmarked');
        } else {
          settings.chfl_discussions_sg.push('bookmarked');
        }
      }

      if (!isRestoring) {
        shared.esgst.settingsChanged = true;
      }
    }

    if (version < 4) {
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
        }
      }

      if (Utils.isSet(settings.chfl_account_st)) {
        const index = settings.chfl_account_st.indexOf('reviews');

        if (index > -1) {
          settings.chfl_account_st.splice(index + 1, 0, 'comments', 'settings');
        } else {
          settings.chfl_account_st.push('comments', 'settings');
        }
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
      }

      if (!isRestoring) {
        shared.esgst.settingsChanged = true;
      }
    }

    if (version < 5) {
      if (settings.npth_nextRegex === 'forw|more|next|onwards|►|>|→') {
        settings.npth_nextRegex = 'forw|more|next|onwards?|►|>|→';
      }

      if (!isRestoring) {
        shared.esgst.settingsChanged = true;
      }
    }

    if (!isRestoring) {
      shared.common.setValue('v', shared.esgst.CURRENT_STORAGE_VERSION);
    }
  }
}

const persistentStorage = new PersistentStorage();

export { persistentStorage };