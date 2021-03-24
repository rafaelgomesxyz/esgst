import { browser } from '../browser';
import { Utils } from '../lib/jsUtils';
import { DOM } from './DOM';
import { Lock } from './Lock';
import { Settings } from './Settings';
import { Shared } from './Shared';

export interface FetchOptions {
	method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
	headers?: Record<string, string>;
	data?: BodyInit;
	pathParams?: Record<string, string>;
	queryParams?: Record<string, string>;
	queue?: boolean | number;
	doNotQueue?: boolean;
	anon?: boolean;
	blob?: string;
	fileName?: string;
}

export interface FetchResponse {
	status: number;
	url: string;
	redirected: boolean;
	text: string;
	json?: Record<string, unknown> | null;
	html?: Document | null;
}

export class FetchRequest {
	static readonly DEFAULT_HEADERS = {
		'Content-Type': 'application/x-www-form-urlencoded',
	};
	static readonly REQUIRED_HEADERS = {
		'Esgst-Version': '',
		From: 'esgst.extension@gmail.com',
	};

	static delete(url: string, options: Partial<FetchOptions> = {}): Promise<FetchResponse> {
		return FetchRequest.send(url, { ...options, method: 'DELETE' });
	}

	static get(url: string, options: Partial<FetchOptions> = {}): Promise<FetchResponse> {
		return FetchRequest.send(url, { ...options, method: 'GET' });
	}

	static patch(url: string, options: Partial<FetchOptions> = {}): Promise<FetchResponse> {
		return FetchRequest.send(url, { ...options, method: 'PATCH' });
	}

	static post(url: string, options: Partial<FetchOptions> = {}): Promise<FetchResponse> {
		return FetchRequest.send(url, { ...options, method: 'POST' });
	}

	static put(url: string, options: Partial<FetchOptions> = {}): Promise<FetchResponse> {
		return FetchRequest.send(url, { ...options, method: 'PUT' });
	}

	static async send(url: string, options: FetchOptions): Promise<FetchResponse> {
		if (!FetchRequest.REQUIRED_HEADERS['Esgst-Version']) {
			FetchRequest.REQUIRED_HEADERS['Esgst-Version'] = Shared.esgst.currentVersion;
		}

		let response = null;
		let lock = null;

		url = url
			.replace(/^\//, `https://${window.location.hostname}/`)
			.replace(/^https?:/, Shared.esgst.locationHref.match(/^http:/) ? 'http:' : 'https:');
		if (options.pathParams) {
			url = FetchRequest.addPathParams(url, options.pathParams);
		}
		if (options.queryParams) {
			url = FetchRequest.addQueryParams(url, options.queryParams);
		}
		options.headers = {
			...FetchRequest.DEFAULT_HEADERS,
			...options.headers,
			...FetchRequest.REQUIRED_HEADERS,
		};

		try {
			const isInternal = url.match(new RegExp(window.location.hostname));
			if (isInternal && !options.doNotQueue) {
				await browser.runtime.sendMessage({
					action: 'queue_request',
					key: 'sg',
				});
			} else if (options.queue) {
				lock = new Lock('request', {
					threshold: typeof options.queue === 'number' ? options.queue : 1000,
				});
			} else if (
				url.match(/^https?:\/\/store.steampowered.com/) &&
				Settings.get('limitSteamStore')
			) {
				lock = new Lock('steamStore', { threshold: 200 });
			}

			if (lock) {
				await lock.lock();
			}

			if (isInternal) {
				response = await FetchRequest.sendInternal(url, options);

				Shared.esgst.requestLog.unshift({
					url,
					timestamp: Date.now(),
				});
				if (response.redirected) {
					Shared.esgst.requestLog.unshift({
						url: response.url,
						timestamp: Date.now(),
					});
				}
				await Shared.common.setValue('requestLog', JSON.stringify(Shared.esgst.requestLog));
			} else {
				response = await FetchRequest.sendExternal(url, options);
			}

			if (lock) {
				await lock.unlock();
			}

			response.json = null;
			response.html = null;
			try {
				response.json = JSON.parse(response.text);
			} catch (err) {}
			if (!response.json) {
				try {
					response.html = DOM.parse(response.text);
				} catch (err) {}
			}

			if (response.url.match(/www.steamgifts.com/)) {
				Shared.common.lookForPopups(response);
			}

			return response;
		} catch (err) {
			if (lock) {
				await lock.unlock();
			}

			throw err;
		}
	}

	static async sendInternal(url: string, options: FetchOptions): Promise<FetchResponse> {
		const { fetchObj, fetchOptions } = await FetchRequest.getFetchObj(options);
		const response = await fetchObj(url, fetchOptions);
		const text = await response.text();

		if (!response.ok) {
			throw new Error(text);
		}

		return {
			status: response.status,
			url: response.url,
			redirected: response.redirected,
			text,
		};
	}

	static async sendExternal(url: string, options: FetchOptions): Promise<FetchResponse> {
		const manipulateCookies =
			(await Shared.common.getBrowserInfo()).name === 'Firefox' &&
			Settings.get('manipulateCookies');

		const messageOptions = {
			action: 'fetch',
			blob: options.blob,
			fileName: options.fileName,
			manipulateCookies,
			parameters: JSON.stringify(FetchRequest.getFetchOptions(options, manipulateCookies)),
			url,
		};
		let response = await browser.runtime.sendMessage(messageOptions);
		if (typeof response === 'string') {
			response = JSON.parse(response);
		}

		if (Utils.isSet(response.error)) {
			throw new Error(response.error);
		}

		return {
			status: response.status,
			url: response.url,
			redirected: response.redirected,
			text: response.text,
		};
	}

	static async getFetchObj(options: FetchOptions) {
		let fetchObj = null;
		let fetchOptions = FetchRequest.getFetchOptions(options);

		if (
			(await Shared.common.getBrowserInfo()).name === 'Firefox' &&
			'wrappedJSObject' in window &&
			window.wrappedJSObject
		) {
			fetchObj = XPCNativeWrapper(window.wrappedJSObject.fetch);
			window.wrappedJSObject.fetchOptions = cloneInto(fetchOptions, window);
			fetchOptions = XPCNativeWrapper(window.wrappedJSObject.fetchOptions);
		} else {
			fetchObj = window.fetch;
		}

		return { fetchObj, fetchOptions };
	}

	static getFetchOptions(options: FetchOptions, manipulateCookies = false): RequestInit {
		return {
			body: options.data,
			credentials: options.anon || manipulateCookies ? 'omit' : 'include',
			headers: options.headers,
			method: options.method,
			redirect: 'follow',
		};
	}

	static addPathParams(url: string, params: Record<string, string> = {}) {
		if (!Object.keys(params).length) {
			return url;
		}

		for (const key in params) {
			url = url.replace(new RegExp(`%${key}%`), encodeURIComponent(params[key]));
		}
		return url;
	}

	static addQueryParams(url: string, params: Record<string, string> = {}) {
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
