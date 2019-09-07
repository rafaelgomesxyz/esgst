import { utils } from './lib/jsUtils';
import { browser } from './browser';

let storage = null;
let themeElement = null;
let customThemeElement = null;

const theme = getLocalValue('theme');
if (theme) {
  const style = document.createElement('style');
  style.id = 'esgst-theme';
  style.textContent = theme;
  themeElement = style;
  document.documentElement.appendChild(style);
}
const customTheme = getLocalValue('customTheme');
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
    delLocalValue('theme');
    delLocalValue('customTheme');
  }
});

async function setTheme(settings) {
  const keys = ['sgDarkGrey', 'sgv2Dark'];
  for (const key of keys) {
    if (getSetting(settings[`${key}_sgtools`]) && checkThemeTime(key, settings)) {
      const theme = storage[key];
      if (!theme) continue;
      const css = getThemeCss(JSON.parse(theme));
      themeElement = createElements(document.head, 'beforeEnd', [
        ['style', { id: 'esgst-theme' }, css]
      ]);
      const revisedCss = css.replace(/!important;/g, `;`).replace(/;/g, `!important;`);
      if (revisedCss !== getLocalValue('theme')) {
        setLocalValue('theme', revisedCss);
      }
      break;
    }
  }
  if (getSetting(settings.customTheme_sgtools) && checkThemeTime('customTheme', settings)) {
    const customTheme = storage.customTheme;
    if (!customTheme) return;
    const css = JSON.parse(customTheme);
    customThemeElement = createElements(document.head, 'beforeEnd', [
      ['style', { id: 'esgst-custom-theme' }, css]
    ]);
    const revisedCss = css.replace(/!important;/g, `;`).replace(/;/g, `!important;`);
    if (revisedCss !== getLocalValue('customTheme')) {
      setLocalValue('customTheme', revisedCss);
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
      if (character === `{`) {
        open++;
      } else if (character === `}`) {
        open--;
      }
      css.push(character);
      index++;
    } while (open > 0);
    css.pop();
  });
  return css.join(``);
}

function createElements(context, position, items) {
  if (Array.isArray(context)) {
    items = context;
    context = null;
  }
  if (position && position === 'inner') {
    context.innerHTML = ``;
  }
  if (!items || !items.length) {
    return;
  }
  const fragment = document.createDocumentFragment();
  let element = null;
  buildElements(fragment, items);
  if (!context) {
    return fragment;
  }
  switch (position) {
    case 'beforeBegin':
      context.parentElement.insertBefore(fragment, context);
      element = context.previousElementSibling;
      break;
    case 'afterBegin':
      context.insertBefore(fragment, context.firstElementChild);
      element = context.firstElementChild;
      break;
    case 'beforeEnd':
      context.appendChild(fragment);
      element = context.lastElementChild;
      break;
    case 'afterEnd':
      context.parentElement.insertBefore(fragment, context.nextElementSibling);
      element = context.nextElementSibling;
      break;
    case 'inner':
      context.appendChild(fragment);
      element = context.firstElementChild;
      break;
    case 'outer':
      context.parentElement.insertBefore(fragment, context);
      element = context.previousElementSibling;
      context.remove();
      break;
  }
  return element;
}

function buildElements(context, items) {
  for (const item of items) {
    if (!item) {
      continue;
    }
    if (typeof item === 'string') {
      const node = document.createTextNode(item);
      context.appendChild(node);
      continue;
    } else if (!Array.isArray(item)) {
      context.appendChild(item);
      continue;
    }
    const element = document.createElement(item[0]);
    if (utils.isSet(item[1])) {
      if (Array.isArray(item[1])) {
        buildElements(element, item[1]);
      } else if (typeof item[1] === 'object') {
        for (const key in item[1]) {
          if (item[1].hasOwnProperty(key)) {
            if (key === 'ref') {
              item[1].ref(element);
            } if (key === 'extend') {
              item[1].extend = item[1].extend.bind(null, element);
            } else if (key.match(/^on/)) {
              element.addEventListener(key.replace(/^on/, ``), item[1][key]);
            } else {
              element.setAttribute(key, item[1][key]);
            }
          }
        }
      } else {
        element.textContent = item[1];
      }
    }
    if (utils.isSet(item[2])) {
      if (Array.isArray(item[2])) {
        buildElements(element, item[2]);
      } else {
        element.textContent = item[2];
      }
    }
    context.appendChild(element);
  }
}

function setLocalValue(key, value) {
  window.localStorage.setItem(`esgst_${key}`, value);
}

function getLocalValue(key, value = undefined) {
  return window.localStorage.getItem(`esgst_${key}`) || value;
}

function delLocalValue(key) {
  window.localStorage.removeItem(`esgst_${key}`);
}

function getSetting(variable) {
  return typeof variable === 'object' ? variable.enabled : variable;
}