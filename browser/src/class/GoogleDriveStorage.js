import { Settings } from './Settings';
import { Shared } from './Shared';
import { ICloudStorage } from './ICloudStorage';
import { FetchRequest } from './FetchRequest';

/**
 * @see https://developers.google.com/drive/api/v3/reference/
 */
class GoogleDriveStorage extends ICloudStorage {
  static get CLIENT_ID() { return '102804278399-95kit5e09mdskdta7eq97ra7tuj20qps.apps.googleusercontent.com'; }
  static get AUTH_URL() { return `https://accounts.google.com/o/oauth2/v2/auth`; }
  static get BASE_URL() { return `https://www.googleapis.com`; }
  static get API_BASE_URL() { return `${GoogleDriveStorage.BASE_URL}/drive/v3`; }
  static get UPLOAD_METADATA_URL() { return `${GoogleDriveStorage.API_BASE_URL}/files`; }
  static get UPLOAD_URL() { return `${GoogleDriveStorage.BASE_URL}/upload/drive/v3/files/%fileId%`; }
  static get DOWNLOAD_URL() { return `${GoogleDriveStorage.API_BASE_URL}/files/%fileId%`}
  static get DELETE_URL() { return `${GoogleDriveStorage.API_BASE_URL}/files/%fileId%`}
  static get DELETE_BATCH_URL() { return `${GoogleDriveStorage.BASE_URL}/batch/drive/v3`; }
  static get LIST_URL() { return `${GoogleDriveStorage.API_BASE_URL}/files`; }

  static getDefaultHeaders(token) {
    return {
      authorization: `Bearer ${token}`
    };
  }

  static async authenticate() {
    const key = 'googleDriveToken';
    const params = {
      client_id: GoogleDriveStorage.CLIENT_ID,
      redirect_uri: GoogleDriveStorage.REDIRECT_URL,
      response_type: 'token',
      scope: `https://www.googleapis.com/auth/drive.appdata`,
      state: 'google-drive'
    };
    if (Settings.usePreferredGoogle) {
      params['login_hint'] = Settings.preferredGoogle;
    }
    const url = FetchRequest.addQueryParams(GoogleDriveStorage.AUTH_URL, params);
    await Shared.common.delValue(key);
    Shared.common.openSmallWindow(url);
    return (await GoogleDriveStorage.getToken(key));
  }

  static async upload(token, data, fileName) {
    if (!token) {
      token = await GoogleDriveStorage.authenticate();
    }
    const metadataRequestOptions = {
      data: Settings.backupZip ? `{ "name": "${fileName}.zip", "parents": ["appDataFolder"]}` : `{"name": "${fileName}.json", "parents": ["appDataFolder"] }`,
      headers: Object.assign(GoogleDriveStorage.getDefaultHeaders(token), {
        'Content-Type': 'application/json'
      })
    };
    const metadataResponse = await FetchRequest.post(GoogleDriveStorage.UPLOAD_METADATA_URL, metadataRequestOptions);
    if (!metadataResponse.json || !metadataResponse.json.id) {
      throw new Error(metadataResponse.text);
    }
    const requestOptions = {
      data,
      fileName: Settings.backupZip ? `${fileName}.json` : null,
      headers: Object.assign(GoogleDriveStorage.getDefaultHeaders(token), {
        'Content-Type': Settings.backupZip ? 'application/zip' : 'text/plain'
      }),
      pathParams: {
        fileId: metadataResponse.json.id
      },
      queryParams: {
        uploadType: 'media'
      }
    };
    const response = await FetchRequest.patch(GoogleDriveStorage.UPLOAD_URL, requestOptions);
    if (!response.json || !response.json.id) {
      throw new Error(response.text);
    }
  }

  static async download(token, fileInfo) {
    if (!token) {
      token = await GoogleDriveStorage.authenticate();
    }
    const requestOptions = {
      blob: fileInfo.name.match(/\.zip$/),
      headers: Object.assign(GoogleDriveStorage.getDefaultHeaders(token), {}),
      pathParams: {
        fileId: fileInfo.id
      },
      queryParams: {
        alt: 'media'
      }
    };
    const response = await FetchRequest.get(GoogleDriveStorage.DOWNLOAD_URL, requestOptions);
    return response.text;
  }

  static async delete(token, fileInfo) {
    if (!token) {
      token = await GoogleDriveStorage.authenticate();
    }
    const requestOptions = {
      headers: Object.assign(GoogleDriveStorage.getDefaultHeaders(token), {}),
      pathParams: {
        fileId: fileInfo.id
      }
    };
    const response = await FetchRequest.delete(GoogleDriveStorage.DELETE_URL, requestOptions);
    if (response.text) {
      throw new Error(response.text);
    }
  }

  static async deleteBatch(token, fileIds) {
    if (!token) {
      token = await GoogleDriveStorage.authenticate();
    }
    const output = {
      success: [],
      error: []
    };
    // Google Drive only allows 100 file deletions per request
    for (let i = 0, n = fileIds.length; i < n; i += 100) {
      const chunk = fileIds.slice(i, i + 100);
      const formData = [];
      for (const fileId of chunk) {
        formData.push(
          '--ESGST',
          `Content-Type: application/http`,
          '',
          `DELETE ${FetchRequest.addPathParams(GoogleDriveStorage.DELETE_URL, { fileId })}`,
          '',
          ''
        );
      }
      const data = formData.join('\n');
      formData.push('--ESGST--');
      const requestOptions = {
        data,
        isFormData: true,
        headers: Object.assign(GoogleDriveStorage.getDefaultHeaders(token), {
          'Content-Type': `multipart/mixed; boundary=ESGST`
        })
      };
      const response = await FetchRequest.post(GoogleDriveStorage.DELETE_BATCH_URL, requestOptions);
      if (!response.text) {
        throw new Error(response.text);
      }
      const parts = response.text
        .replace(/\r?\n|\r/g, '\n')
        .replace(/\n\n+/g, '\n\n')
        .split(/--batch.*\n/)
        .filter(x => x)
        .map(x => x.split(/\n\n/)[2]);
      for (const [index, part] of parts.entries()) {
        if (part) {
          output.failed.push(chunk[index]);
        } else {
          output.success.push(chunk[index]);
        }
      }
    }
    return output;
  }

  static async list(token) {
    if (!token) {
      token = await GoogleDriveStorage.authenticate();
    }
    const requestOptions = {
      headers: Object.assign(GoogleDriveStorage.getDefaultHeaders(token), {}),
      queryParams: {
        fields: `files(kind,id,name,mimeType,size,modifiedTime)`,
        spaces: 'appDataFolder'
      }
    };
    const response = await FetchRequest.get(GoogleDriveStorage.LIST_URL, requestOptions);
    if (!response.json || !response.json.files) {
      throw new Error(response.text);
    }
    return response.json.files.map(x => (x.date = x.modifiedTime) && x);
  }
}

export { GoogleDriveStorage };