// ==UserScript==
// @name ESGST
// @namespace ESGST
// @description Enhances SteamGifts and SteamTrades by adding some cool features to them.
// @icon https://dl.dropboxusercontent.com/s/lr3t3bxrxfxylqe/esgstIcon.ico?raw=1
// @version 7.26.3
// @author revilheart
// @contributor Royalgamer06
// @downloadURL https://github.com/revilheart/ESGST/raw/master/ESGST.user.js
// @updateURL https://github.com/revilheart/ESGST/raw/master/ESGST.meta.js
// @match https://www.steamgifts.com/*
// @match https://www.steamtrades.com/*
// @connect raw.githubusercontent.com
// @connect api.steampowered.com
// @connect store.steampowered.com
// @connect script.google.com
// @connect script.googleusercontent.com
// @connect sgtools.info
// @connect steamcommunity.com
// @connect steamgifts.com
// @connect steamtrades.com
// @connect isthereanydeal.com
// @connect api.dropboxapi.com
// @connect content.dropboxapi.com
// @connect api.imgur.com
// @connect googleapis.com
// @connect graph.microsoft.com
// @connect userstyles.org
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_xmlhttpRequest
// @grant GM_getResourceURL
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.deleteValue
// @grant GM.listValues
// @grant GM.xmlHttpRequest
// @grant GM.getResourceUrl
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/js/jquery-3.3.1.min.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/js/jquery-ui-1.12.1.min.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/js/bootstrap-3.3.7.min.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/js/interact-1.3.4.min.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/js/jszip-3.1.5.min.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/js/parsedown-0.0.1.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/js/query-builder-2.5.2.min.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/js/intersection-observer.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/js/encoding.js
// @require https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/js/jsUtils-0.0.1.js
// @resource bs https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/css/bootstrap-3.3.7.min.css
// @resource abc https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/css/awesome-bootstrap-checkbox-0.3.7.min.css
// @resource qb https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/css/query-builder-2.5.2.min.css
// @resource sg https://raw.githubusercontent.com/revilheart/ESGST/7.26.3/Extension/css/steamgifts-v34.min.css
// @run-at document-start
// @noframes
// ==/UserScript==