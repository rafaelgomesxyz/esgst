/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || new Function(\"return this\")();\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

/***/ }),

/***/ "../lib/jsUtils/index.js":
/*!*******************************!*\
  !*** ../lib/jsUtils/index.js ***!
  \*******************************/
/*! exports provided: default, utils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Utils; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"utils\", function() { return utils; });\nclass Utils {\n  constructor() {\n    this.parser = new DOMParser();\n  }\n\n  compareTypes(variable, type) {\n    return Object.prototype.toString.call(variable).toLowerCase() === `[object ${type}]`;\n  }\n\n  isNumber(number) {\n    return this.isSet(number) && this.compareTypes(number, `number`) && !isNaN(number);\n  }\n\n  isObject(object) {\n    return this.isSet(object) && this.compareTypes(object, `object`);\n  }\n\n  isSet(variable) {\n    return typeof variable !== `undefined` && variable !== null;\n  }\n\n  isString(string) {\n    return this.isSet(string) && this.compareTypes(string, `string`);\n  }\n\n  isValidDate(date) {\n    return this.isSet(date) && this.compareTypes(date, `date`) && !isNaN(date);\n  }\n\n  parseHtml(string) {\n    return this.parser.parseFromString(string, `text/html`);\n  }\n\n  sortArray(array, desc, key) {\n    if (!this.isSet(array) || !Array.isArray(array)) {\n      throw `The \"array\" argument is not an array`;\n    }\n\n    const modifier = desc ? -1 : 1;\n    return array.sort((a, b) => {\n      if (this.isObject(a) && this.isObject(b)) {\n        if (key && this.isString(key)) {\n          if (this.isNumber(a[key]) && this.isNumber(b[key])) {\n            if (a[key] < b[key]) {\n              return -1 * modifier;\n            }\n            if (a[key] > b[key]) {\n              return modifier;\n            }\n            return 0;\n          }\n          return a[key].localeCompare(b[key], {\n            sensitivity: `base`\n          }) * modifier;\n        }\n        return 0;\n      }\n      if (this.isNumber(a) && this.isNumber(b)) {\n        if (a < b) {\n          return -1 * modifier;\n        }\n        if (a > b) {\n          return modifier;\n        }\n        return 0;\n      }\n      return a.localeCompare(b, {\n        sensitivity: `base`\n      }) * modifier;\n    });\n  }\n\n  rgba2Hex(string) {\n    const match = string.match(/rgba?\\((\\d+?),\\s*(\\d+?),\\s*(\\d+?)(,\\s*(.+?))?\\)/);\n    if (!match) {\n      return {\n        hex: string,\n        alpha: 1.0\n      };\n    }\n    const red = parseInt(match[1]);\n    const green = parseInt(match[2]);\n    const blue = parseInt(match[3]);\n    const alpha = (match[5] && parseFloat(match[5])) || 1.0;\n    return {\n      hex: `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`,\n      alpha\n    };\n  }\n\n  hex2Rgba(hex, alpha) {\n    alpha = parseFloat(alpha);\n    if (alpha === 1.0) {\n      return hex;\n    }\n    const match = hex.match(/[\\dA-Fa-f]{2}/g);\n    if (!match) {\n      return ``;\n    }\n    const red = parseInt(match[0], 16);\n    const green = parseInt(match[1], 16);\n    const blue = parseInt(match[2], 16);\n    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;\n  }\n}\n\nlet utils = new Utils;\n\n\n//# sourceURL=webpack:///../lib/jsUtils/index.js?");

/***/ }),

/***/ "../main_sgtools.js":
/*!**************************!*\
  !*** ../main_sgtools.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _lib_jsUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/jsUtils */ \"../lib/jsUtils/index.js\");\n\n\nlet storage = null;\nlet themeElement = null;\nlet customThemeElement = null;\n\nconst theme = getLocalValue(`theme`);\nif (theme) {\n  const style = document.createElement(`style`);\n  style.id = `esgst-theme`;\n  style.textContent = theme;\n  themeElement = style;\n  document.documentElement.appendChild(style);\n}\nconst customTheme = getLocalValue(`customTheme`);\nif (customTheme) {\n  const style = document.createElement(`style`);\n  style.id = `esgst-custom-theme`;\n  style.textContent = customTheme;\n  customThemeElement = style;\n  document.documentElement.appendChild(style);\n}\n\nconst browser = (global.chrome && global.chrome.runtime) ? global.chrome : global.browser;\nbrowser.runtime.sendMessage({ action: `getStorage` }, stg => {\n  storage = JSON.parse(stg);\n  const settings = JSON.parse(storage.settings);\n  if (settings.esgst_sgtools) {\n    setTheme(settings);\n  }\n});\n\nasync function setTheme(settings) {\n  if (themeElement) {\n    themeElement.remove();\n    themeElement = null;\n  }\n  if (customThemeElement) {\n    customThemeElement.remove();\n    customThemeElement = null;\n  }\n  const keys = [`sgDarkGrey`, `sgv2Dark`];\n  for (const key of keys) {\n    if (settings[`${key}_sgtools`] && checkThemeTime(key, settings)) {\n      const theme = storage[key];\n      if (!theme) continue;\n      const css = getThemeCss(JSON.parse(theme));\n      themeElement = createElements(document.head, `beforeEnd`, [\n        [`style`, { id: `esgst-theme` }, css]\n      ]);\n      const revisedCss = css.replace(/!important;/g, `;`).replace(/;/g, `!important;`);\n      if (revisedCss !== getLocalValue(`theme`)) {\n        setLocalValue(`theme`, revisedCss);\n      }\n      break;\n    }\n  }\n  if (settings.customTheme_sgtools && checkThemeTime(`customTheme`, settings)) {\n    const customTheme = storage.customTheme;\n    if (!customTheme) return;\n    const css = JSON.parse(customTheme);\n    customThemeElement = createElements(document.head, `beforeEnd`, [\n      [`style`, { id: `esgst-custom-theme` }, css]\n    ]);\n    const revisedCss = css.replace(/!important;/g, `;`).replace(/;/g, `!important;`);\n    if (revisedCss !== getLocalValue(`customTheme`)) {\n      setLocalValue(`customTheme`, revisedCss);\n    }\n  }\n}\n\nfunction checkThemeTime(id, settings) {\n  let startParts = settings[`${id}_startTime`].split(`:`),\n    endParts = settings[`${id}_endTime`].split(`:`),\n    startDate = new Date(),\n    startHours = parseInt(startParts[0]),\n    startMinutes = parseInt(startParts[1]),\n    endDate = new Date(),\n    endHours = parseInt(endParts[0]),\n    endMinutes = parseInt(endParts[1]),\n    currentDate = new Date();\n  startDate.setHours(startHours);\n  startDate.setMinutes(startMinutes);\n  startDate.setSeconds(0);\n  endDate.setHours(endHours);\n  endDate.setMinutes(endMinutes);\n  endDate.setSeconds(0);\n  currentDate.setSeconds(0);\n  if (endDate < startDate) {\n    if (currentDate < startDate) {\n      startDate.setDate(startDate.getDate() - 1);\n    } else {\n      endDate.setDate(endDate.getDate() + 1);\n    }\n  }\n  if (currentDate >= startDate && currentDate <= endDate) {\n    window.setTimeout(() => setTheme(settings), endDate - currentDate);\n    return true;\n  }\n}\n\nfunction getThemeCss(theme) {\n  let separators = theme.match(/@-moz-document(.+?){/g);\n  if (!separators) {\n    return theme;\n  }\n  let css = [];\n  separators.forEach(separator => {\n    let check = false;\n    for (const domain of (separator.match(/domain\\(.+?\\)/g) || [])) {\n      if (window.location.hostname.match(domain.match(/\\(\"(.+?)\"\\)/)[1])) {\n        check = true;\n        break;\n      }\n    }\n    for (const url of (separator.match(/url(-prefix)?\\(.+?\\)/g) || [])) {\n      if (window.location.href.match(url.match(/\\(\"(.+?)\"\\)/)[1])) {\n        check = true;\n        break;\n      }\n    }\n    if (!check) {\n      return;\n    }\n    let index = theme.indexOf(separator) + separator.length,\n      open = 1;\n    do {\n      let character = theme[index];\n      if (character === `{`) {\n        open++;\n      } else if (character === `}`) {\n        open--;\n      }\n      css.push(character);\n      index++;\n    } while (open > 0);\n    css.pop();\n  });\n  return css.join(``);\n}\n\nfunction createElements(context, position, items) {\n  if (Array.isArray(context)) {\n    items = context;\n    context = null;\n  }\n  if (position && position === `inner`) {\n    context.innerHTML = ``;\n  }\n  if (!items || !items.length) {\n    return;\n  }\n  const fragment = document.createDocumentFragment();\n  let element = null;\n  buildElements(fragment, items);\n  if (!context) {\n    return fragment;\n  }\n  switch (position) {\n    case `beforeBegin`:\n      context.parentElement.insertBefore(fragment, context);\n      element = context.previousElementSibling;\n      break;\n    case `afterBegin`:\n      context.insertBefore(fragment, context.firstElementChild);\n      element = context.firstElementChild;\n      break;\n    case `beforeEnd`:\n      context.appendChild(fragment);\n      element = context.lastElementChild;\n      break;\n    case `afterEnd`:\n      context.parentElement.insertBefore(fragment, context.nextElementSibling);\n      element = context.nextElementSibling;\n      break;\n    case `inner`:\n      context.appendChild(fragment);\n      element = context.firstElementChild;\n      break;\n    case `outer`:\n      context.parentElement.insertBefore(fragment, context);\n      element = context.previousElementSibling;\n      context.remove();\n      break;\n  }\n  return element;\n}\n\nfunction buildElements(context, items) {\n  for (const item of items) {\n    if (!item) {\n      continue;\n    }\n    if (typeof item === `string`) {\n      const node = document.createTextNode(item);\n      context.appendChild(node);\n      continue;\n    } else if (!Array.isArray(item)) {\n      context.appendChild(item);\n      continue;\n    }\n    const element = document.createElement(item[0]);\n    if (_lib_jsUtils__WEBPACK_IMPORTED_MODULE_0__[\"utils\"].isSet(item[1])) {\n      if (Array.isArray(item[1])) {\n        buildElements(element, item[1]);\n      } else if (typeof item[1] === `object`) {\n        for (const key in item[1]) {\n          if (item[1].hasOwnProperty(key)) {\n            if (key === `ref`) {\n              item[1].ref(element);\n            } if (key === `extend`) {\n              item[1].extend = item[1].extend.bind(null, element);\n            } else if (key.match(/^on/)) {\n              element.addEventListener(key.replace(/^on/, ``), item[1][key]);\n            } else {\n              element.setAttribute(key, item[1][key]);\n            }\n          }\n        }\n      } else {\n        element.textContent = item[1];\n      }\n    }\n    if (_lib_jsUtils__WEBPACK_IMPORTED_MODULE_0__[\"utils\"].isSet(item[2])) {\n      if (Array.isArray(item[2])) {\n        buildElements(element, item[2]);\n      } else {\n        element.textContent = item[2];\n      }\n    }\n    context.appendChild(element);\n  }\n}\n\nfunction setLocalValue(key, value) {\n  window.localStorage.setItem(`esgst_${key}`, value);\n}\n\nfunction getLocalValue(key, value = undefined) {\n  return window.localStorage.getItem(`esgst_${key}`) || value;\n}\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ \"../../node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///../main_sgtools.js?");

/***/ }),

/***/ "./extension/index_sgtools.js":
/*!************************************!*\
  !*** ./extension/index_sgtools.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _main_sgtools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../main_sgtools */ \"../main_sgtools.js\");\n\n\n//# sourceURL=webpack:///./extension/index_sgtools.js?");

/***/ }),

/***/ 2:
/*!******************************************!*\
  !*** multi ./extension/index_sgtools.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./extension/index_sgtools.js */\"./extension/index_sgtools.js\");\n\n\n//# sourceURL=webpack:///multi_./extension/index_sgtools.js?");

/***/ })

/******/ });