const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

class Request {
  static delete(url, config = {}) {
    config = Object.assign({}, Request.DEFAULT_CONFIG, config, { method: 'DELETE' });
    return Request.send(url, config);
  }

  static get(url, config = {}) {
    config = Object.assign({}, Request.DEFAULT_CONFIG, config, { method: 'GET' });
    return Request.send(url, config);
  }

  static patch(url, config = {}) {
    config = Object.assign({}, Request.DEFAULT_CONFIG, config, { method: 'PATCH' });
    return Request.send(url, config);
  }

  static post(url, config = {}) {
    config = Object.assign({}, Request.DEFAULT_CONFIG, config, { method: 'POST' });
    return Request.send(url, config);
  }

  static put(url, config = {}) {
    config = Object.assign({}, Request.DEFAULT_CONFIG, config, { method: 'PUT' });
    return Request.send(url, config);
  }

  static async send(url, config) {
    if (config.pathParams) {
      url = Request.addPathParams(url, config.pathParams);
    }
    if (config.queryParams) {
      url = Request.addQueryParams(url, config.queryParams);
    }
    config.headers = Object.assign({}, Request.DEFAULT_HEADERS, config.headers, Request.REQUIRED_HEADERS);
    let response = null;    
    try {
      response = await fetch(url, config);
      const text = await response.text();  
      if (!response.ok) {
        throw new Error(text);
      }
      const result = {
        /** @type {HTMLElement} */
        html: null,
        /** @type {Object} */
        json: null,
        /** @type {boolean} */
        redirected: response.redirected,
        /** @type {string} */
        text,
        /** @type {string} */
        url: response.url,
      };
      try {
        result.json = JSON.parse(result.text);
      } catch (error) {}
      if (!result.json) {
        try {
          result.html = new JSDOM(result.text).window.document;
        } catch (err) {
          console.log(`${config.method} request to ${url} could not parse HTML: ${err}`);
        }
      }
      return result;
    } catch (err) {
      console.log(`${config.method} request to ${url} failed with ${response.status}`);
    }
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

Request.DEFAULT_CONFIG = {
  method: 'GET',
  redirect: 'follow',
};
Request.DEFAULT_HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
Request.REQUIRED_HEADERS = {
  'Esgst-Version': 'ServerV2',
  'From': 'esgst.extension@gmail.com',
};

module.exports = Request;