import { shared } from './Shared';
import { Utils } from '../lib/jsUtils';

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
    } else if (version < 3) {
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

    if (!isRestoring) {
      shared.common.setValue('v', shared.esgst.CURRENT_STORAGE_VERSION);
    }
  }
}

const persistentStorage = new PersistentStorage();

export { persistentStorage };