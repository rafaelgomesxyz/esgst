import { v4 as uuidv4 } from 'uuid';

interface ScopeData {
	comments: unknown[];
	commentsV2: unknown[];
	discussions: unknown[];
	games: unknown[];
	giveaways: unknown[];
	groups: unknown[];
	trades: unknown[];
	users: unknown[];
}

export class Scope {
	static readonly scopes = new Map<string, Scope>();
	static readonly history: string[] = [];
	static current: Scope | null = null;

	readonly id: string;
	readonly context: HTMLElement;
	readonly data: ScopeData;
	readonly pages: Map<number, ScopeData>;
	sourceLink: HTMLElement | null = null;

	constructor(id: string | null, context: HTMLElement) {
		this.findData = this.findData.bind(this);

		this.id = id || uuidv4();
		this.context = context;
		this.data = Scope.getInitialData();
		this.pages = new Map<number, ScopeData>();
	}

	addData = (key: keyof ScopeData, data: unknown[], page = 1): void => {
		this.data[key].push(...data);
		if (page > 0) {
			this.addPage(page);
			const pageData = this.pages.get(page);
			if (pageData) {
				pageData[key].push(...data);
			}
		}
	};

	addPage = (page: number): void => {
		if (!this.pages.has(page)) {
			this.pages.set(page, Scope.getInitialData());
		}
	};

	findData(key: keyof ScopeData, page?: number): unknown[];
	findData(keys: (keyof ScopeData)[], page?: number): ScopeData;
	findData(keyOrKeys: keyof ScopeData | (keyof ScopeData)[], page = 0): unknown[] | ScopeData {
		let data;
		const sourceData = page === 0 ? this.data : this.pages.get(page);
		if (typeof keyOrKeys === 'string') {
			data = sourceData ? sourceData[keyOrKeys] : [];
		} else {
			data = Scope.getInitialData();
			if (sourceData) {
				for (const key of keyOrKeys) {
					data[key] = sourceData[key];
				}
			}
		}
		return data;
	}

	resetData = (key: keyof ScopeData): void => {
		this.data[key] = [];
		for (const pageData of this.pages.values()) {
			pageData[key] = [];
		}
	};

	static getInitialData = (): ScopeData => {
		return {
			comments: [],
			commentsV2: [],
			discussions: [],
			games: [],
			giveaways: [],
			groups: [],
			trades: [],
			users: [],
		};
	};

	static create = (id: string | null, context: HTMLElement): Scope => {
		if (id && Scope.scopes.has(id)) {
			throw new Error('Scope ID already exists.');
		}
		const scope = new Scope(id, context);
		Scope.scopes.set(scope.id, scope);
		return scope;
	};

	static addData = (id: string, key: keyof ScopeData, data: unknown[], page = 1): void => {
		const scope = Scope.scopes.get(id);
		if (scope) {
			scope.addData(key, data, page);
		}
	};

	static find = (id: string): Scope | null => {
		return Scope.scopes.get(id) || null;
	};

	static findData(id: string | null, key: keyof ScopeData, page?: number): unknown[];
	static findData(id: string | null, keys: (keyof ScopeData)[], page?: number): ScopeData;
	static findData(
		id: string | null,
		keyOrKeys: keyof ScopeData | (keyof ScopeData)[],
		page = 0
	): unknown[] | ScopeData {
		let data;
		if (typeof keyOrKeys === 'string') {
			data = [];
			if (id) {
				const scope = Scope.find(id);
				if (scope) {
					data = scope.findData(keyOrKeys, page);
				}
			} else {
				for (const scope of Scope.scopes.values()) {
					const foundData = scope.findData(keyOrKeys, page);
					data.push(...foundData);
				}
			}
		} else {
			data = Scope.getInitialData();
			if (id) {
				const scope = Scope.find(id);
				if (scope) {
					data = scope.findData(keyOrKeys, page);
				}
			} else {
				for (const scope of Scope.scopes.values()) {
					const foundData = scope.findData(keyOrKeys, page);
					for (const [key, scopeData] of Object.entries(foundData) as [
						keyof ScopeData,
						ScopeData
					][]) {
						data[key].push(...scopeData[key]);
					}
				}
			}
		}
		return data;
	}

	static remove = (id: string): void => {
		if (Scope.scopes.has(id)) {
			Scope.scopes.delete(id);
		}
	};

	static setCurrent = (id: string): void => {
		Scope.history.push(id);
		Scope.current = Scope.find(id);
	};

	static resetCurrent = (): void => {
		Scope.history.pop();
		if (Scope.history.length > 0) {
			const id = Scope.history[Scope.history.length - 1];
			Scope.current = Scope.find(id);
		} else {
			Scope.current = null;
		}
	};

	static purge = (): void => {
		for (const scope of Scope.scopes.values()) {
			for (const scopeData of Object.values(scope.data)) {
				for (let i = scopeData.length - 1; i > -1; i--) {
					if (
						!document.contains(
							scopeData[i].nodes ? scopeData[i].nodes.outer : scopeData[i].outerWrap
						)
					) {
						scopeData.splice(i, 1);
					}
				}
			}
		}
	};
}
