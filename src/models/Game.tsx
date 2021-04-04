import { Session } from '../class/Session';
import { Namespaces } from '../constants/Namespaces';
import { Base, BaseData, BaseNodes } from './Base';

export interface GameNodes extends BaseNodes {
	name: HTMLAnchorElement | HTMLDivElement | null;
	steam: HTMLAnchorElement | null;
	screenshots: GameScreenshotsNode | null;
	thumbnailOuter: HTMLAnchorElement | null;
	thumbnailInner: HTMLImageElement | null;
}

export type GameScreenshotsNode = HTMLElement & {
	dataset: {
		lightboxId?: string;
	};
};

export type GameData = BaseData & GameBaseData & GameExtraData;

export interface GameBaseData extends GameSteamData {
	id: string | null;
	name: string | null;
	thumbnail: string | null;
}

export interface GameExtraData {
	url: string | null;
}

export interface GameSteamData {
	steamId: string | null;
	steamType: GameSteamType | null;
}

export type GameSteamType = 'app' | 'sub' | 'bundle';

export abstract class Game extends Base<Game, GameNodes, GameData> {
	constructor(namespace: number) {
		super(namespace);
		this.nodes = Game.getDefaultNodes();
		this.data = Game.getDefaultData();
	}

	static getDefaultNodes = (): GameNodes => {
		return {
			...Base.getDefaultNodes(),
			name: null,
			steam: null,
			screenshots: null,
			thumbnailOuter: null,
			thumbnailInner: null,
		};
	};

	static getDefaultData = (): GameData => {
		return {
			...Base.getDefaultData(),
			...Game.getDefaultBaseData(),
			...Game.getDefaultExtraData(),
		};
	};

	static getDefaultBaseData = (): GameBaseData => {
		return {
			...Game.getDefaultSteamData(),
			id: null,
			name: null,
			thumbnail: null,
		};
	};

	static getDefaultExtraData = (): GameExtraData => {
		return {
			url: null,
		};
	};

	static getDefaultSteamData = (): GameSteamData => {
		return {
			steamId: null,
			steamType: null,
		};
	};

	static create = (): Game | null => {
		switch (Session.namespace) {
			case Namespaces.SG:
				return new SgGame();
			default:
				return null;
		}
	};

	static extractSteamData = (url: string): GameSteamData => {
		const matches = url.match(/\/(app|sub|bundle)s?\/(\d+)/);
		return matches
			? {
					steamId: matches[2],
					steamType: matches[1] as GameSteamType,
			  }
			: Game.getDefaultSteamData();
	};

	static extractThumbnail = (url: string): string | null => {
		return url.slice(5, -2) || null; // url("...")
	};

	parse = (refNode: HTMLElement): Game => {
		this.parseNodes(refNode);
		this.parseData();
		this.parseExtraData();

		return this;
	};

	parseNodes = (refNode: HTMLElement): Game => {
		return this;
	};

	build = (): Game => {
		return this;
	};

	reset = (): Game => {
		const outerNode = this.nodes.outer;
		this.nodes = Game.getDefaultNodes();
		this.data = Game.getDefaultData();

		if (outerNode) {
			this.nodes.outer = outerNode;
			this.built = false;
			this.build();
		}

		return this;
	};
}

class SgGame extends Game {
	constructor() {
		super(Namespaces.SG);
	}

	parseData = (): SgGame => {
		const nodes = this.nodes;
		const data = Game.getDefaultData();

		data.id = nodes.outer?.dataset.gameId ?? nodes.screenshots?.dataset.lightboxId ?? null;
		if (nodes.name) {
			data.name = nodes.name.textContent.trim() || null;
		}
		if (nodes.thumbnailInner) {
			data.thumbnail = nodes.thumbnailInner.src;
		} else if (nodes.thumbnailOuter) {
			const imageUrl = nodes.thumbnailOuter.style.backgroundImage;
			if (imageUrl) {
				data.thumbnail = Game.extractThumbnail(imageUrl);
			}
		}
		const steamUrl = nodes.steam?.getAttribute('href') || data.thumbnail;
		if (steamUrl) {
			const steamData = Game.extractSteamData(steamUrl);
			data.steamId = steamData.steamId;
			data.steamType = steamData.steamType;
		}
		this.data = data;

		return this;
	};

	parseExtraData = (): SgGame => {
		const data = this.data;

		if (data.steamType && data.steamId) {
			data.url = `https://store.steampowered.com/${data.steamType}/${data.steamId}`;
		}

		return this;
	};
}
