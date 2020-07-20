import { Settings } from './Settings';
import { Shared } from './Shared';
import { ICloudStorage } from './ICloudStorage';
import { FetchRequest } from './FetchRequest';

/**
 * @see https://docs.microsoft.com/en-us/onedrive/developer/rest-api/?view=odsp-graph-online
 */
class OneDriveStorage extends ICloudStorage {
	static get CLIENT_ID() {
		return '1781429b-289b-4e6e-877a-e50015c0af21';
	}
	static get AUTH_URL() {
		return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`;
	}
	static get API_BASE_URL() {
		return `https://graph.microsoft.com/v1.0`;
	}
	static get UPLOAD_URL() {
		return `${OneDriveStorage.API_BASE_URL}/me/drive/special/approot:/%fileName%:/content`;
	}
	static get DOWNLOAD_URL() {
		return `${OneDriveStorage.API_BASE_URL}/me/drive/items/%fileId%/content`;
	}
	static get DELETE_URL() {
		return `${OneDriveStorage.API_BASE_URL}/me/drive/items/%fileId%`;
	}
	static get DELETE_BATCH_URL() {
		return `${OneDriveStorage.API_BASE_URL}/$batch`;
	}
	static get LIST_URL() {
		return `${OneDriveStorage.API_BASE_URL}/me/drive/special/approot/children`;
	}

	static getDefaultHeaders(token) {
		return {
			Authorization: `bearer ${token}`,
		};
	}

	static async authenticate() {
		const key = 'oneDriveToken';
		const params = {
			client_id: OneDriveStorage.CLIENT_ID,
			redirect_uri: OneDriveStorage.REDIRECT_URL,
			response_type: 'token',
			scope: 'files.readwrite',
			state: 'onedrive',
		};
		if (Settings.get('usePreferredMicrosoft')) {
			params['login_hint'] = Settings.get('preferredMicrosoft');
		}
		const url = FetchRequest.addQueryParams(OneDriveStorage.AUTH_URL, params);
		await Shared.common.delValue(key);
		Shared.common.openSmallWindow(url);
		return await OneDriveStorage.getToken(key);
	}

	static async upload(token, data, fileName) {
		if (!token) {
			token = await OneDriveStorage.authenticate();
		}
		const requestOptions = {
			anon: true,
			data,
			fileName: Settings.get('backupZip') ? `${fileName}.json` : null,
			headers: Object.assign(OneDriveStorage.getDefaultHeaders(token), {
				'Content-Type': Settings.get('backupZip') ? 'application/zip' : 'text/plain',
			}),
			pathParams: {
				fileName: `${fileName}.${Settings.get('backupZip') ? 'zip' : 'json'}`,
			},
		};
		const response = await FetchRequest.put(OneDriveStorage.UPLOAD_URL, requestOptions);
		if (!response.json || !response.json.id) {
			throw new Error(response.text);
		}
	}

	static async download(token, fileInfo) {
		if (!token) {
			token = await OneDriveStorage.authenticate();
		}
		const requestOptions = {
			anon: true,
			blob: fileInfo.name.match(/\.zip$/),
			headers: Object.assign(OneDriveStorage.getDefaultHeaders(token), {}),
			pathParams: {
				fileId: fileInfo.id,
			},
		};
		const response = await FetchRequest.get(OneDriveStorage.DOWNLOAD_URL, requestOptions);
		return response.text;
	}

	static async delete(token, fileInfo) {
		if (!token) {
			token = await OneDriveStorage.authenticate();
		}
		const requestOptions = {
			anon: true,
			headers: Object.assign(OneDriveStorage.getDefaultHeaders(token), {}),
			pathParams: {
				fileId: fileInfo.id,
			},
		};
		const response = await FetchRequest.delete(OneDriveStorage.DELETE_URL, requestOptions);
		if (response.text) {
			throw new Error(response.text);
		}
	}

	static async deleteBatch(token, fileIds) {
		if (!token) {
			token = await OneDriveStorage.authenticate();
		}
		const output = {
			success: [],
			error: [],
		};
		const batchRequests = JSON.stringify(
			fileIds.map((x) => ({
				id: x,
				method: 'DELETE',
				url: `/me/drive/items/${x}`,
			}))
		);
		const requestOptions = {
			anon: true,
			data: `{ "requests": ${batchRequests} }`,
			headers: Object.assign(OneDriveStorage.getDefaultHeaders(token), {
				'Content-Type': 'application/json',
			}),
		};
		const response = await FetchRequest.post(OneDriveStorage.DELETE_BATCH_URL, requestOptions);
		if (!response.json || !response.json.responses) {
			throw new Error(response.text);
		}
		for (const batchResponse of response.json.responses) {
			if (batchResponse.status === 204) {
				output.success.push(batchResponse.id);
			} else {
				output.error.push(batchResponse.id);
			}
		}
		return output;
	}

	static async list(token) {
		if (!token) {
			token = await OneDriveStorage.authenticate();
		}
		const requestOptions = {
			anon: true,
			headers: Object.assign(OneDriveStorage.getDefaultHeaders(token), {}),
		};
		const response = await FetchRequest.get(OneDriveStorage.LIST_URL, requestOptions);
		if (!response.json || !response.json.value) {
			throw new Error(response.text);
		}
		return response.json.value.reverse().map((x) => (x.date = x.lastModifiedDateTime) && x);
	}
}

export { OneDriveStorage };
