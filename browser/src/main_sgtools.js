import { browser } from './browser';
import { DOM } from './class/DOM';
import { LocalStorage } from './class/LocalStorage';

let storage = null;
let themeElement = null;
let customThemeElement = null;

const theme = LocalStorage.get('theme');
if (theme) {
  const style = document.createElement('style');
  style.id = 'esgst-theme';
  style.textContent = theme;
  themeElement = style;
  document.documentElement.appendChild(style);
}
const customTheme = LocalStorage.get('customTheme');
if (customTheme) {
  const style = document.createElement('style');
  style.id = 'esgst-custom-theme';
  style.textContent = customTheme;
  customThemeElement = style;
  document.documentElement.appendChild(style);
}

browser.storage.local.get(null).then(storage => {
  const settings = JSON.parse(storage.settings);
  if (themeElement) {
    themeElement.remove();
    themeElement = null;
  }
  if (customThemeElement) {
    customThemeElement.remove();
    customThemeElement = null;
  }
  if (getSetting(settings.esgst_sgtools)) {
    setTheme(settings);
  } else {
    LocalStorage.delete('theme');
    LocalStorage.delete('customTheme');
  }
});

async function setTheme(settings) {
  const keys = ['sgDarkGrey', 'sgv2Dark'];
  for (const key of keys) {
    if (getSetting(settings[`${key}_sgtools`]) && checkThemeTime(key, settings)) {
      const theme = storage[key];
      if (!theme) continue;
      const css = getThemeCss(JSON.parse(theme));
      themeElement = DOM.build(document.head, 'beforeEnd', [
        ['style', { id: 'esgst-theme' }, css]
      ]);
      const revisedCss = css.replace(/!important;/g, ';').replace(/;/g, '!important;');
      if (revisedCss !== LocalStorage.get('theme')) {
        LocalStorage.set('theme', revisedCss);
      }
      break;
    }
  }
  if (getSetting(settings.customTheme_sgtools) && checkThemeTime('customTheme', settings)) {
    const customTheme = storage.customTheme;
    if (!customTheme) return;
    const css = JSON.parse(customTheme);
    customThemeElement = DOM.build(document.head, 'beforeEnd', [
      ['style', { id: 'esgst-custom-theme' }, css]
    ]);
    const revisedCss = css.replace(/!important;/g, ';').replace(/;/g, '!important;');
    if (revisedCss !== LocalStorage.get('customTheme')) {
      LocalStorage.set('customTheme', revisedCss);
    }
  }
}

function checkThemeTime(id, settings) {
  if (!settings[`${id}_startTime`] || !settings[`${id}_endTime`]) {
    return true;
  }
  let startParts = settings[`${id}_startTime`].split(`:`),
    endParts = settings[`${id}_endTime`].split(`:`),
    startDate = new Date(),
    startHours = parseInt(startParts[0]),
    startMinutes = parseInt(startParts[1]),
    endDate = new Date(),
    endHours = parseInt(endParts[0]),
    endMinutes = parseInt(endParts[1]),
    currentDate = new Date();
  startDate.setHours(startHours);
  startDate.setMinutes(startMinutes);
  startDate.setSeconds(0);
  endDate.setHours(endHours);
  endDate.setMinutes(endMinutes);
  endDate.setSeconds(0);
  currentDate.setSeconds(0);
  if (endDate < startDate) {
    if (currentDate < startDate) {
      startDate.setDate(startDate.getDate() - 1);
    } else {
      endDate.setDate(endDate.getDate() + 1);
    }
  }
  if (currentDate >= startDate && currentDate <= endDate) {
    window.setTimeout(() => setTheme(settings), endDate.getTime() - currentDate.getTime());
    return true;
  }
}

function getThemeCss(theme) {
  let separators = theme.match(/@-moz-document(.+?){/g);
  if (!separators) {
    return theme;
  }
  let css = [];
  separators.forEach(separator => {
    let check = false;
    for (const domain of (separator.match(/domain\(.+?\)/g) || [])) {
      if (window.location.hostname.match(domain.match(/\("(.+?)"\)/)[1])) {
        check = true;
        break;
      }
    }
    for (const url of (separator.match(/url(-prefix)?\(.+?\)/g) || [])) {
      if (window.location.href.match(url.match(/\("(.+?)"\)/)[1])) {
        check = true;
        break;
      }
    }
    if (!check) {
      return;
    }
    let index = theme.indexOf(separator) + separator.length,
      open = 1;
    do {
      let character = theme[index];
      if (character === '{') {
        open++;
      } else if (character === '}') {
        open--;
      }
      css.push(character);
      index++;
    } while (open > 0);
    css.pop();
  });
  return css.join('');
}

function getSetting(variable) {
  return typeof variable === 'object' ? variable.enabled : variable;
}