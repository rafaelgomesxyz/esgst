import { v4 as uuidv4 } from 'uuid';
import { browser } from '../browser';

type LockData = {
	uuid: string;
	key: string;
} & LockOptions;

interface LockOptions {
	threshold: number;
	timeout: number;
	tryOnce: boolean;
}

export class Lock {
	private data: LockData;
	private locked = false;

	constructor(key: string, data: Partial<LockOptions> = {}) {
		this.data = {
			uuid: uuidv4(),
			key: `${key}Lock`,
			threshold: 100,
			timeout: 15000,
			tryOnce: false,
			...data,
		};
	}

	get isLocked(): boolean {
		return this.locked;
	}

	lock = async (): Promise<void> => {
		const response = await browser.runtime.sendMessage({
			action: 'do_lock',
			lock: JSON.stringify(this.data),
		});
		this.locked = JSON.parse(response);
	};

	update = (): Promise<void> => {
		return browser.runtime.sendMessage({
			action: 'update_lock',
			lock: JSON.stringify(this.data),
		});
	};

	unlock = (): Promise<void> => {
		return browser.runtime.sendMessage({
			action: 'do_unlock',
			lock: JSON.stringify(this.data),
		});
	};
}
