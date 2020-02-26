import { Settings } from './Settings';
import { Shared } from './Shared';
import { ICloudStorage } from './ICloudStorage';
import { FetchRequest } from './FetchRequest';

/**
 * @see https://www.dropbox.com/developers/documentation/http/documentation
 */
class DropboxStorage extends ICloudStorage {
  static get CLIENT_ID() { return 'nix7kvchwa8wdvj'; }
  static get AUTH_URL() { return `https://www.dropbox.com/oauth2/authorize`; }
  static get API_BASE_URL() { return `https://api.dropboxapi.com/2`; }
  static get CONTENT_BASE_URL() { return `https://content.dropboxapi.com/2`; }
  static get UPLOAD_URL() { return `${DropboxStorage.CONTENT_BASE_URL}/files/upload`; }
  static get DOWNLOAD_URL() { return `${DropboxStorage.CONTENT_BASE_URL}/files/download`; }
  static get DELETE_URL() { return `${DropboxStorage.API_BASE_URL}/files/delete_v2`; }
  static get DELETE_BATCH_URL() { return `${DropboxStorage.API_BASE_URL}/files/delete_batch`; }
  static get DELETE_BATCH_CHECK_URL() { return `${DropboxStorage.API_BASE_URL}/files/delete_batch/check`; }
  static get LIST_URL() { return `${DropboxStorage.API_BASE_URL}/files/list_folder`; }

  static getDefaultHeaders(token) {
    return {
      authorization: `Bearer ${token}`
    };
  }

  static async authenticate() {
    const key = 'dropboxToken';
    const params = {
      client_id: DropboxStorage.CLIENT_ID,
      redirect_uri: DropboxStorage.REDIRECT_URL,
      response_type: 'token',
      state: 'dropbox'
    };
    const url = FetchRequest.addQueryParams(DropboxStorage.AUTH_URL, params);
    await Shared.common.delValue(key);
    Shared.common.openSmallWindow(url);
    return (await DropboxStorage.getToken(key));
  }

  static async upload(token, data, fileName) {
    if (!token) {
      token = await DropboxStorage.authenticate();
    }
    const requestOptions = {
      data,
      fileName: Settings.get('backupZip') ? `${fileName}.json` : null,
      headers: Object.assign(DropboxStorage.getDefaultHeaders(token), {
        'Dropbox-API-Arg': Settings.get('backupZip') ? `{"path": "/${fileName}.zip"}` : `{"path": "/${fileName}.json"}`,
        'Content-Type': 'application/octet-stream'
      })
    };
    const response = await FetchRequest.post(DropboxStorage.UPLOAD_URL, requestOptions);
    if (!response.json || !response.json.id) {
      throw new Error(response.text);
    }
  }

  static async download(token, fileInfo) {
    if (!token) {
      token = await DropboxStorage.authenticate();
    }
    const requestOptions = {
      blob: fileInfo.name.match(/\.zip$/),
      headers: Object.assign(DropboxStorage.getDefaultHeaders(token), {
        'Dropbox-API-Arg': `{"path": "/${fileInfo.name}"}`,
        'Content-Type': 'text/plain'
      })
    };
    const response = await FetchRequest.get(DropboxStorage.DOWNLOAD_URL, requestOptions);
    return response.text;
  }

  static async delete(token, fileInfo) {
    if (!token) {
      token = await DropboxStorage.authenticate();
    }
    const requestOptions = {
      data: `{ "path": "/${fileInfo.name}" }`,
      headers: Object.assign(DropboxStorage.getDefaultHeaders(token), {
        'Content-Type': 'application/json'
      })
    };
    const response = await FetchRequest.post(DropboxStorage.DELETE_URL, requestOptions);
    if (!response.json || response.json.error) {
      throw new Error(response.text);
    }
  }

  static async deleteBatch(token, fileIds) {
    if (!token) {
      token = await DropboxStorage.authenticate();
    }
    const output = {
      success: [],
      error: []
    };
    const batchRequests = JSON.stringify(fileIds.map(x => ({ path: `/${x}` })));
    const requestOptions = {
      data: `{ "entries": ${batchRequests} }`,
      headers: Object.assign(DropboxStorage.getDefaultHeaders(token), {
        'Content-Type': 'application/json'
      })
    };
    const response = await FetchRequest.post(DropboxStorage.DELETE_BATCH_URL, requestOptions);
    if (!response.json) {
      throw new Error(response.text);
    }
    if (response.json['.tag'] !== 'complete') {
      response.json = await DropboxStorage.waitDeleteBatch(token, response.json.async_job_id);
    }
    for (const file of response.json.entries) {
      if (file['.tag'] === 'success') {
        output.success.push(file.metadata.name);
      } else {
        output.error.push(file.metadata.name);
      }
    }
    return output;
  }

  static waitDeleteBatch(token, jobId) {
    return new Promise(resolve => {
      DropboxStorage.checkDeleteBatch(token, jobId, resolve);
    });
  }
  
  static async checkDeleteBatch(token, jobId, resolve) {  
    const requestOptions = {
      data: `{ "async_job_id": ${JSON.stringify(jobId)} }`,
      headers: Object.assign(DropboxStorage.getDefaultHeaders(token), {
        'Content-Type': 'application/json'
      })
    };
    const response = await FetchRequest.post(DropboxStorage.DELETE_BATCH_CHECK_URL, requestOptions);
    if (response.json && response.json['.tag'] === 'complete') {
      resolve(response.json);
    } else {
      window.setTimeout(DropboxStorage.checkDeleteBatch, 1000, token, jobId, resolve);
    }
  }

  static async list(token) {
    if (!token) {
      token = await DropboxStorage.authenticate();
    }
    const requestOptions = {
      data: `{ "path": "" }`,
      headers: Object.assign(DropboxStorage.getDefaultHeaders(token), {
        'Content-Type': 'application/json'
      }),
    };
    const response = await FetchRequest.post(DropboxStorage.LIST_URL, requestOptions);
    if (!response.json || !response.json.entries) {
      throw new Error(response.text);
    }
    return response.json.entries.reverse().map(x => (x.id = x.name) && (x.date = x.server_modified) && x);
  }
}

export { DropboxStorage };