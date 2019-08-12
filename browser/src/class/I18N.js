import { utils } from '../lib/jsUtils';
import { browser } from '../browser';

class I18N {
  getMessage(messageName, substitutions) {
    if (utils.isNumber(substitutions)) {
      if (substitutions === 1) {
        messageName += `_one`;
      } else {
        messageName += `_other`;
      }
    }
    return browser.i18n.getMessage(messageName, substitutions);
  }
}

const i18n = new I18N();

export { i18n };