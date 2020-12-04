import { LocalStorage } from './LocalStorage';
import { Settings } from './Settings';
import { Shared } from './Shared';

interface RequestQueueList {
	threshold: number;
	thresholds: Record<string, number> | null;
	minThresholds: Record<string, number>;
	minute_limit: number;
	hour_limit: number;
	day_limit: number;
	requests: (() => void)[];
	wasRequesting: boolean;
}

class _RequestQueue {
	queue: Record<string, RequestQueueList> = {};

	constructor() {
		this.queue.sg = {
			threshold: 250,
			thresholds: null,
			minThresholds: {
				default: 0.25,
				minute50: 0.5,
				minute75: 1,
				hourly75: 1.5,
				daily75: 2,
			},
			minute_limit: 120,
			hour_limit: 2400,
			day_limit: 14400,
			requests: [],
			wasRequesting: false,
		};
	}

	init = (): void => {
		this.continuouslyCheck();
		void this.checkLocalRequests();
	};

	continuouslyCheck = (): void => {
		this.check();
		window.setTimeout(this.continuouslyCheck, 100);
	};

	check = (): void => {
		const now = Date.now();
		for (const [key, queue] of Object.entries(this.queue)) {
			if (queue.requests.length === 0) {
				continue;
			}

			const lastRequest = this.getLastRequest(key);
			if (lastRequest === 0 || now - queue.threshold > lastRequest) {
				this.setLastRequest(key, now);
				const request = queue.requests.shift();
				if (request) {
					request();
				}
			}
		}
	};

	getLastRequest = (key: string): number => {
		return parseInt(LocalStorage.get(`request_${key}`, '0'));
	};

	setLastRequest = (key: string, lastRequest: number): void => {
		LocalStorage.set(`request_${key}`, lastRequest.toString());
	};

	checkLocalRequests = async (): Promise<void> => {
		if (!this.queue.sg.wasRequesting) {
			return;
		}
		this.queue.sg.wasRequesting = false;

		if (!this.queue.sg.thresholds) {
			this.queue.sg.thresholds = await this.loadRequestThresholds();
		}

		const currentDate = new Date();
		const now = currentDate.getTime();
		const currentDay = currentDate.getDate();
		const currentHour = currentDate.getHours();
		const currentMinute = currentDate.getMinutes();

		let minuteTotal = 0;
		let hourTotal = 0;
		let dayTotal = 0;

		let requestLog = await this.getRequestLog();
		requestLog = requestLog.filter((log) => now - log.timestamp <= 86400000);
		for (const log of requestLog) {
			const date = new Date(log.timestamp);
			const day = date.getDate();
			const hour = date.getHours();
			const minute = date.getMinutes();

			if (day === currentDay) {
				dayTotal += 1;
				if (hour === currentHour) {
					hourTotal += 1;
					if (minute === currentMinute) {
						minuteTotal += 1;
					}
				}
			} else {
				break;
			}
		}

		if (dayTotal > this.queue.sg.day_limit * 0.75) {
			this.queue.sg.threshold = this.queue.sg.thresholds.daily75 * 1000;
		} else if (hourTotal > this.queue.sg.hour_limit * 0.75) {
			this.queue.sg.threshold = this.queue.sg.thresholds.hourly75 * 1000;
		} else if (minuteTotal > this.queue.sg.minute_limit * 0.75) {
			this.queue.sg.threshold = this.queue.sg.thresholds.minute75 * 1000;
		} else if (minuteTotal > this.queue.sg.minute_limit * 0.5) {
			this.queue.sg.threshold = this.queue.sg.thresholds.minute50 * 1000;
		} else {
			this.queue.sg.threshold = this.queue.sg.thresholds.default * 1000;
		}

		window.setTimeout(this.checkLocalRequests, 15000);
	};

	loadRequestThresholds = async (): Promise<Record<string, number>> => {
		if (Settings.get('useCustomAdaReqLim')) {
			const thresholds: Record<string, number> = {};
			for (const [key, minThreshold] of Object.entries(this.queue.sg.minThresholds)) {
				thresholds[key] = parseFloat(Settings.get(`customAdaReqLim_${key}`) ?? 0.0);
				if (thresholds[key] < minThreshold) {
					thresholds[key] = minThreshold;
				}
			}
			return thresholds;
		} else {
			return { ...this.queue.sg.minThresholds };
		}
	};

	getRequestLog = async () => {
		return Shared.esgst.requestLog;
	};

	enqueue = (key: string): Promise<void> => {
		const promise = new Promise<void>((resolve) => {
			this.queue[key] = this.queue[key] ?? { threshold: 100, requests: [], wasRequesting: false };
			this.queue[key].requests.push(resolve);
			this.queue[key].wasRequesting = true;
		});
		this.check();
		return promise;
	};
}

export const RequestQueue = new _RequestQueue();
