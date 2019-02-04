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

/***/ "../browser.js":
/*!*********************!*\
  !*** ../browser.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _lib_jsUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/jsUtils */ \"../lib/jsUtils/index.js\");\n\r\n\r\nlet _browser = null;\r\n\r\nif (typeof browser !== `undefined`) {\r\n  _browser = browser;\r\n} else if (typeof self !== `undefined`) {\r\n  _browser = {\r\n    runtime: {\r\n      onMessage: {\r\n        addListener: callback => {\r\n          self.port.on(`esgstMessage`, obj => callback(obj));\r\n        }\r\n      },\r\n      getManifest: () => {\r\n        return new Promise(resolve => {\r\n          _browser.runtime.sendMessage({\r\n            action: `getPackageJson`\r\n          }, result => {\r\n            resolve(JSON.parse(result));\r\n          });\r\n        });\r\n      },\r\n      sendMessage: (obj, callback) => {\r\n        obj.uuid = `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, _lib_jsUtils__WEBPACK_IMPORTED_MODULE_0__[\"utils\"].createUuid.bind(_lib_jsUtils__WEBPACK_IMPORTED_MODULE_0__[\"utils\"]));\r\n        self.port.emit(obj.action, obj);\r\n        self.port.on(`${obj.action}_${obj.uuid}_response`, function onResponse(result) {\r\n          self.port.removeListener(`${obj.action}_${obj.uuid}_response`, `onResponse`);\r\n          callback(result);\r\n        });\r\n      }\r\n    }\r\n  };\r\n} else {\r\n  _browser = {\r\n    runtime: {}\r\n  };\r\n}\r\n\r\nif (typeof _browser.runtime.getBrowserInfo === `undefined`) {\r\n  _browser.runtime.getBrowserInfo = () => ({\r\n    name: `?`\r\n  });\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (_browser);\n\n//# sourceURL=webpack:///../browser.js?");

/***/ }),

/***/ "../lib/jsUtils/index.js":
/*!*******************************!*\
  !*** ../lib/jsUtils/index.js ***!
  \*******************************/
/*! exports provided: default, utils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Utils; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"utils\", function() { return utils; });\nclass Utils {\r\n  constructor() {\r\n    this.parser = new DOMParser();\r\n  }\r\n\r\n  compareTypes(variable, type) {\r\n    return Object.prototype.toString.call(variable).toLowerCase() === `[object ${type}]`;\r\n  }\r\n\r\n  isNumber(number) {\r\n    return this.isSet(number) && this.compareTypes(number, `number`) && !isNaN(number);\r\n  }\r\n\r\n  isObject(object) {\r\n    return this.isSet(object) && this.compareTypes(object, `object`);\r\n  }\r\n\r\n  isSet(variable) {\r\n    return typeof variable !== `undefined` && variable !== null;\r\n  }\r\n\r\n  isString(string) {\r\n    return this.isSet(string) && this.compareTypes(string, `string`);\r\n  }\r\n\r\n  isValidDate(date) {\r\n    return this.isSet(date) && this.compareTypes(date, `date`) && !isNaN(date);\r\n  }\r\n\r\n  parseHtml(string) {\r\n    return this.parser.parseFromString(string, `text/html`);\r\n  }\r\n\r\n  sortArray(array, desc, key) {\r\n    if (!this.isSet(array) || !Array.isArray(array)) {\r\n      throw `The \"array\" argument is not an array`;\r\n    }\r\n\r\n    const modifier = desc ? -1 : 1;\r\n    return array.sort((a, b) => {\r\n      if (this.isObject(a) && this.isObject(b)) {\r\n        if (key && this.isString(key)) {\r\n          if (this.isNumber(a[key]) && this.isNumber(b[key])) {\r\n            if (a[key] < b[key]) {\r\n              return -1 * modifier;\r\n            }\r\n            if (a[key] > b[key]) {\r\n              return modifier;\r\n            }\r\n            return 0;\r\n          }\r\n          return a[key].localeCompare(b[key], {\r\n            sensitivity: `base`\r\n          }) * modifier;\r\n        }\r\n        return 0;\r\n      }\r\n      if (this.isNumber(a) && this.isNumber(b)) {\r\n        if (a < b) {\r\n          return -1 * modifier;\r\n        }\r\n        if (a > b) {\r\n          return modifier;\r\n        }\r\n        return 0;\r\n      }\r\n      return a.localeCompare(b, {\r\n        sensitivity: `base`\r\n      }) * modifier;\r\n    });\r\n  }\r\n\r\n  rgba2Hex(string) {\r\n    const match = string.match(/rgba?\\((\\d+?),\\s*(\\d+?),\\s*(\\d+?)(,\\s*(.+?))?\\)/);\r\n    if (!match) {\r\n      return {\r\n        hex: string,\r\n        alpha: 1.0\r\n      };\r\n    }\r\n    const red = parseInt(match[1]);\r\n    const green = parseInt(match[2]);\r\n    const blue = parseInt(match[3]);\r\n    const alpha = (match[5] && parseFloat(match[5])) || 1.0;\r\n    return {\r\n      hex: `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`,\r\n      alpha\r\n    };\r\n  }\r\n\r\n  hex2Rgba(hex, alpha) {\r\n    alpha = parseFloat(alpha);\r\n    if (alpha === 1.0) {\r\n      return hex;\r\n    }\r\n    const match = hex.match(/[\\dA-Fa-f]{2}/g);\r\n    if (!match) {\r\n      return ``;\r\n    }\r\n    const red = parseInt(match[0], 16);\r\n    const green = parseInt(match[1], 16);\r\n    const blue = parseInt(match[2], 16);\r\n    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;\r\n  }\r\n\r\n  createUuid(c) {\r\n    let r, v;\r\n    r = Math.random() * 16 | 0;\r\n    v = c === `x` ? r : (r & 0x3 | 0x8);\r\n    return v.toString(16);\r\n  }\r\n}\r\n\r\nlet utils = new Utils;\r\n\n\n//# sourceURL=webpack:///../lib/jsUtils/index.js?");

/***/ }),

/***/ "../main_sgtools.js":
/*!**************************!*\
  !*** ../main_sgtools.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _lib_jsUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/jsUtils */ \"../lib/jsUtils/index.js\");\n/* harmony import */ var _browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./browser */ \"../browser.js\");\n\r\n\r\n\r\nlet storage = null;\r\nlet themeElement = null;\r\nlet customThemeElement = null;\r\n\r\nconst theme = getLocalValue(`theme`);\r\nif (theme) {\r\n  const style = document.createElement(`style`);\r\n  style.id = `esgst-theme`;\r\n  style.textContent = theme;\r\n  themeElement = style;\r\n  document.documentElement.appendChild(style);\r\n}\r\nconst customTheme = getLocalValue(`customTheme`);\r\nif (customTheme) {\r\n  const style = document.createElement(`style`);\r\n  style.id = `esgst-custom-theme`;\r\n  style.textContent = customTheme;\r\n  customThemeElement = style;\r\n  document.documentElement.appendChild(style);\r\n}\r\n\r\n_browser__WEBPACK_IMPORTED_MODULE_1__[\"default\"].runtime.sendMessage({ action: `getStorage` }).then(stg => {\r\n  storage = JSON.parse(stg);\r\n  const settings = JSON.parse(storage.settings);\r\n  if (settings.esgst_sgtools) {\r\n    setTheme(settings);\r\n  }\r\n});\r\n\r\nasync function setTheme(settings) {\r\n  if (themeElement) {\r\n    themeElement.remove();\r\n    themeElement = null;\r\n  }\r\n  if (customThemeElement) {\r\n    customThemeElement.remove();\r\n    customThemeElement = null;\r\n  }\r\n  const keys = [`sgDarkGrey`, `sgv2Dark`];\r\n  for (const key of keys) {\r\n    if (settings[`${key}_sgtools`] && checkThemeTime(key, settings)) {\r\n      const theme = storage[key];\r\n      if (!theme) continue;\r\n      const css = getThemeCss(JSON.parse(theme));\r\n      themeElement = createElements(document.head, `beforeEnd`, [\r\n        [`style`, { id: `esgst-theme` }, css]\r\n      ]);\r\n      const revisedCss = css.replace(/!important;/g, `;`).replace(/;/g, `!important;`);\r\n      if (revisedCss !== getLocalValue(`theme`)) {\r\n        setLocalValue(`theme`, revisedCss);\r\n      }\r\n      break;\r\n    }\r\n  }\r\n  if (settings.customTheme_sgtools && checkThemeTime(`customTheme`, settings)) {\r\n    const customTheme = storage.customTheme;\r\n    if (!customTheme) return;\r\n    const css = JSON.parse(customTheme);\r\n    customThemeElement = createElements(document.head, `beforeEnd`, [\r\n      [`style`, { id: `esgst-custom-theme` }, css]\r\n    ]);\r\n    const revisedCss = css.replace(/!important;/g, `;`).replace(/;/g, `!important;`);\r\n    if (revisedCss !== getLocalValue(`customTheme`)) {\r\n      setLocalValue(`customTheme`, revisedCss);\r\n    }\r\n  }\r\n}\r\n\r\nfunction checkThemeTime(id, settings) {\r\n  if (!settings[`${id}_startTime`] || !settings[`${id}_endTime`]) {\r\n    return true;\r\n  }\r\n  let startParts = settings[`${id}_startTime`].split(`:`),\r\n    endParts = settings[`${id}_endTime`].split(`:`),\r\n    startDate = new Date(),\r\n    startHours = parseInt(startParts[0]),\r\n    startMinutes = parseInt(startParts[1]),\r\n    endDate = new Date(),\r\n    endHours = parseInt(endParts[0]),\r\n    endMinutes = parseInt(endParts[1]),\r\n    currentDate = new Date();\r\n  startDate.setHours(startHours);\r\n  startDate.setMinutes(startMinutes);\r\n  startDate.setSeconds(0);\r\n  endDate.setHours(endHours);\r\n  endDate.setMinutes(endMinutes);\r\n  endDate.setSeconds(0);\r\n  currentDate.setSeconds(0);\r\n  if (endDate < startDate) {\r\n    if (currentDate < startDate) {\r\n      startDate.setDate(startDate.getDate() - 1);\r\n    } else {\r\n      endDate.setDate(endDate.getDate() + 1);\r\n    }\r\n  }\r\n  if (currentDate >= startDate && currentDate <= endDate) {\r\n    window.setTimeout(() => setTheme(settings), endDate - currentDate);\r\n    return true;\r\n  }\r\n}\r\n\r\nfunction getThemeCss(theme) {\r\n  let separators = theme.match(/@-moz-document(.+?){/g);\r\n  if (!separators) {\r\n    return theme;\r\n  }\r\n  let css = [];\r\n  separators.forEach(separator => {\r\n    let check = false;\r\n    for (const domain of (separator.match(/domain\\(.+?\\)/g) || [])) {\r\n      if (window.location.hostname.match(domain.match(/\\(\"(.+?)\"\\)/)[1])) {\r\n        check = true;\r\n        break;\r\n      }\r\n    }\r\n    for (const url of (separator.match(/url(-prefix)?\\(.+?\\)/g) || [])) {\r\n      if (window.location.href.match(url.match(/\\(\"(.+?)\"\\)/)[1])) {\r\n        check = true;\r\n        break;\r\n      }\r\n    }\r\n    if (!check) {\r\n      return;\r\n    }\r\n    let index = theme.indexOf(separator) + separator.length,\r\n      open = 1;\r\n    do {\r\n      let character = theme[index];\r\n      if (character === `{`) {\r\n        open++;\r\n      } else if (character === `}`) {\r\n        open--;\r\n      }\r\n      css.push(character);\r\n      index++;\r\n    } while (open > 0);\r\n    css.pop();\r\n  });\r\n  return css.join(``);\r\n}\r\n\r\nfunction createElements(context, position, items) {\r\n  if (Array.isArray(context)) {\r\n    items = context;\r\n    context = null;\r\n  }\r\n  if (position && position === `inner`) {\r\n    context.innerHTML = ``;\r\n  }\r\n  if (!items || !items.length) {\r\n    return;\r\n  }\r\n  const fragment = document.createDocumentFragment();\r\n  let element = null;\r\n  buildElements(fragment, items);\r\n  if (!context) {\r\n    return fragment;\r\n  }\r\n  switch (position) {\r\n    case `beforeBegin`:\r\n      context.parentElement.insertBefore(fragment, context);\r\n      element = context.previousElementSibling;\r\n      break;\r\n    case `afterBegin`:\r\n      context.insertBefore(fragment, context.firstElementChild);\r\n      element = context.firstElementChild;\r\n      break;\r\n    case `beforeEnd`:\r\n      context.appendChild(fragment);\r\n      element = context.lastElementChild;\r\n      break;\r\n    case `afterEnd`:\r\n      context.parentElement.insertBefore(fragment, context.nextElementSibling);\r\n      element = context.nextElementSibling;\r\n      break;\r\n    case `inner`:\r\n      context.appendChild(fragment);\r\n      element = context.firstElementChild;\r\n      break;\r\n    case `outer`:\r\n      context.parentElement.insertBefore(fragment, context);\r\n      element = context.previousElementSibling;\r\n      context.remove();\r\n      break;\r\n  }\r\n  return element;\r\n}\r\n\r\nfunction buildElements(context, items) {\r\n  for (const item of items) {\r\n    if (!item) {\r\n      continue;\r\n    }\r\n    if (typeof item === `string`) {\r\n      const node = document.createTextNode(item);\r\n      context.appendChild(node);\r\n      continue;\r\n    } else if (!Array.isArray(item)) {\r\n      context.appendChild(item);\r\n      continue;\r\n    }\r\n    const element = document.createElement(item[0]);\r\n    if (_lib_jsUtils__WEBPACK_IMPORTED_MODULE_0__[\"utils\"].isSet(item[1])) {\r\n      if (Array.isArray(item[1])) {\r\n        buildElements(element, item[1]);\r\n      } else if (typeof item[1] === `object`) {\r\n        for (const key in item[1]) {\r\n          if (item[1].hasOwnProperty(key)) {\r\n            if (key === `ref`) {\r\n              item[1].ref(element);\r\n            } if (key === `extend`) {\r\n              item[1].extend = item[1].extend.bind(null, element);\r\n            } else if (key.match(/^on/)) {\r\n              element.addEventListener(key.replace(/^on/, ``), item[1][key]);\r\n            } else {\r\n              element.setAttribute(key, item[1][key]);\r\n            }\r\n          }\r\n        }\r\n      } else {\r\n        element.textContent = item[1];\r\n      }\r\n    }\r\n    if (_lib_jsUtils__WEBPACK_IMPORTED_MODULE_0__[\"utils\"].isSet(item[2])) {\r\n      if (Array.isArray(item[2])) {\r\n        buildElements(element, item[2]);\r\n      } else {\r\n        element.textContent = item[2];\r\n      }\r\n    }\r\n    context.appendChild(element);\r\n  }\r\n}\r\n\r\nfunction setLocalValue(key, value) {\r\n  window.localStorage.setItem(`esgst_${key}`, value);\r\n}\r\n\r\nfunction getLocalValue(key, value = undefined) {\r\n  return window.localStorage.getItem(`esgst_${key}`) || value;\r\n}\n\n//# sourceURL=webpack:///../main_sgtools.js?");

/***/ }),

/***/ "./index_sgtools.js":
/*!**************************!*\
  !*** ./index_sgtools.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _main_sgtools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../main_sgtools */ \"../main_sgtools.js\");\n\n\n//# sourceURL=webpack:///./index_sgtools.js?");

/***/ }),

/***/ 2:
/*!********************************!*\
  !*** multi ./index_sgtools.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./index_sgtools.js */\"./index_sgtools.js\");\n\n\n//# sourceURL=webpack:///multi_./index_sgtools.js?");

/***/ })

/******/ });