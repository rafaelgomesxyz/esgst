import { shared } from './Shared';
import { utils } from '../lib/jsUtils';

class PersistentStorage {
  constructor() { }

  upgrade(settings, version, isRestoring) {
    if (!utils.isSet(settings)) {
      return;
    }

    if (version === shared.esgst.CURRENT_STORAGE_VERSION) {
      return;
    }

    if ((version || 1) < 2) {
      if (utils.isSet(settings.chfl_discussions_sg)) {
        settings.chfl_discussions_sg = settings.chfl_discussions_sg.filter(x => ((typeof x === `string` && x) || x.id) !== `categorize-discussions`);
      }
      if (utils.isSet(settings.chfl_footer_sg)) {
        const privacyPolicyIndex = settings.chfl_footer_sg.map((x, i) => ((typeof x === `string` && x) || x.id) === `privacy-policy` ? i : null).filter(x => utils.isSet(x))[0];
        if (utils.isSet(privacyPolicyIndex)) {
          settings.chfl_footer_sg.splice(privacyPolicyIndex + 1, 0, `cookie-policy`);
        } else {
          settings.chfl_footer_sg.push(`cookie-policy`);
        }
        const termsOfServiceIndex = settings.chfl_footer_sg.map((x, i) => ((typeof x === `string` && x) || x.id) === `terms-of-service` ? i : null).filter(x => utils.isSet(x))[0];
        if (utils.isSet(termsOfServiceIndex)) {
          settings.chfl_footer_sg.splice(termsOfServiceIndex + 1, 0, `advertising`);
        } else {
          settings.chfl_footer_sg.push(`advertising`);
        }
      }
      if (!isRestoring) {
        shared.esgst.settingsChanged = true;
      }
    }
    
    if (!isRestoring) {
      shared.common.setValue(`v`, shared.esgst.CURRENT_STORAGE_VERSION);
    }
  }
}

const persistentStorage = new PersistentStorage();

export { persistentStorage };