import { shared } from './Shared';
import { browser } from '../browser';
import { gSettings } from './Globals';
import { utils } from '../lib/jsUtils';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded'
};
const REQUIRED_HEADERS = {
  'From': 'esgst.extension@gmail.com'
};

(async () => {
  REQUIRED_HEADERS['Esgst-Version'] = (await browser.runtime.getManifest()).version;
})();

class FetchRequest {
  static delete(url, options = {}) {
    options = Object.assign(options, { method: 'DELETE' });
    return FetchRequest.send(url, options);
  }

  static get(url, options = {}) {
    options = Object.assign(options, { method: 'GET' });
    return FetchRequest.send(url, options);
  }

  static patch(url, options = {}) {
    options = Object.assign(options, { method: 'PATCH' });
    return FetchRequest.send(url, options);
  }

  static post(url, options = {}) {
    options = Object.assign(options, { method: 'POST' });
    return FetchRequest.send(url, options);
  }

  static put(url, options = {}) {
    options = Object.assign(options, { method: 'PUT' });
    return FetchRequest.send(url, options);
  }

  static async send(url, options) {
    let response = null;
    let deleteLock = null;

    url = url
      .replace(/^\//, `https://${window.location.hostname}/`)
      .replace(/^https?:/, shared.esgst.locationHref.match(/^http:/) ? 'http:' : 'https:');
    if (options.pathParams) {
      url = FetchRequest.addPathParams(url, options.pathParams);
    }
    if (options.queryParams) {
      url = FetchRequest.addQueryParams(url, options.queryParams);
    }
    options.headers = Object.assign({}, DEFAULT_HEADERS, options.headers, REQUIRED_HEADERS);
    try {
      if (options.queue) {
        deleteLock = await shared.common.createLock('requestLock', 1000);
      } else if (url.match(/^https?:\/\/store.steampowered.com/)) {
        deleteLock = await shared.common.createLock('steamStore', 200);
      }

      const isInternal = url.match(new RegExp(window.location.hostname));
      if (isInternal) {
        response = await FetchRequest.sendInternal(url, options);
      } else {
        response = await FetchRequest.sendExternal(url, options);
      }

      if (deleteLock) {
        deleteLock();
      }

      response.html = null;
      response.json = null;
      try {
        response.json = JSON.parse(response.text);
      } catch (error) {}
      if (!response.json) {
        try {
          response.html = utils.parseHtml(response.text);
        } catch (error) {}
      }

      if (response.url.match(/www.steamgifts.com/)) {
        shared.common.lookForPopups(response);
      }
  
      return response;
    } catch (error) {
      if (deleteLock) {
        deleteLock();
      }

      throw error;
    }
  }

  static async sendInternal(url, options) {
    const { fetchObj, fetchOptions } = await FetchRequest.getFetchObj(options);
    const response = await fetchObj(url, fetchOptions);
    const text = await response.text();

    if (!response.ok) {
      throw new Error(text);
    }

    return {
      redirected: response.redirected,
      text,
      url: response.url
    };
  }

  static async sendExternal(url, options) {
    const messageOptions = {
      action: 'fetch',
      blob: options.blob,
      fileName: options.fileName,
      manipulateCookies: (await shared.common.getBrowserInfo()).name === 'Firefox' && gSettings.manipulateCookies,
      parameters: JSON.stringify(FetchRequest.getFetchOptions(options)),
      url
    };
    let response = await browser.runtime.sendMessage(messageOptions);
    if (typeof response === 'string') {
      response = JSON.parse(response);
    }

    if (utils.isSet(response.error)) {
      throw new Error(response.error);
    }

    return {
      redirected: response.redirected,
      text: response.responseText,
      url: response.finalUrl
    };
  }

  static async getFetchObj(options) {
    let fetchObj = null;
    let fetchOptions = FetchRequest.getFetchOptions(options);

    // @ts-ignore
    if ((await shared.common.getBrowserInfo()).name === 'Firefox' && utils.isSet(window.wrappedJSObject)) {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      fetchObj = XPCNativeWrapper(window.wrappedJSObject.fetch);
      // @ts-ignore
      window.wrappedJSObject.fetchOptions = cloneInto(fetchOptions, window);
      // @ts-ignore
      // eslint-disable-next-line no-undef
      fetchOptions = XPCNativeWrapper(window.wrappedJSObject.fetchOptions);
    } else {
      fetchObj = window.fetch;
    }

    return { fetchObj, fetchOptions };
  }

  static getFetchOptions(options) {
    return {
      body: options.data,
      credentials: options.anon ? 'omit' : 'include',
      headers: options.headers,
      method: options.method,
      redirect: 'follow'
    };
  }

  static addPathParams(url, params = {}) {
    if (!Object.keys(params).length) {
      return url;
    }

    for (const key in params) {
      url = url.replace(new RegExp(`%${key}%`), encodeURIComponent(params[key]));
    }
    return url;
  }

  static addQueryParams(url, params = {}) {
    if (!Object.keys(params).length) {
      return url;
    }

    const queryParams = [];
    for (const key in params) {
      queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
    return `${url}?${queryParams.join('&')}`;
  }
}

export { FetchRequest };