import { LocalStorage } from './LocalStorage';
import { Shared } from './Shared';

interface RequestQueueList {
	threshold: number;
	minute_limit: number;
	hour_limit: number;
	day_limit: number;
	requests: (() => void)[];
}

class _RequestQueue {
	queue: Record<string, RequestQueueList> = {};

	constructor() {
		this.queue.sg = {
			threshold: 250,
			minute_limit: 120,
			hour_limit: 2400,
			day_limit: 14400,
			requests: [],
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
			const lastRequest = this.getLastRequest(key);
			if (lastRequest === 0 || now - queue.threshold > lastRequest) {
				this.setLastRequest(key, now);
				const request = this.queue[key].requests.shift();
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
			this.queue.sg.threshold = 2000;
		} else if (hourTotal > this.queue.sg.hour_limit * 0.75) {
			this.queue.sg.threshold = 1500;
		} else if (minuteTotal > this.queue.sg.minute_limit * 0.75) {
			this.queue.sg.threshold = 1000;
		} else if (minuteTotal > this.queue.sg.minute_limit * 0.5) {
			this.queue.sg.threshold = 500;
		} else {
			this.queue.sg.threshold = 250;
		}

		window.setTimeout(this.checkLocalRequests, 15000);
	};

	getRequestLog = async () => {
		return Shared.esgst.requestLog;
	};

	enqueue = (key: string): Promise<void> => {
		const promise = new Promise<void>((resolve) => {
			this.queue[key] = this.queue[key] ?? { threshold: 100, requests: [] };
			this.queue[key].requests.push(resolve);
		});
		this.check();
		return promise;
	};
}

export const RequestQueue = new _RequestQueue();
