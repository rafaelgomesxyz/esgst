import { DOM } from '../class/DOM';
import { FetchRequest } from '../class/FetchRequest';
import { Session } from '../class/Session';
import { Shared } from '../class/Shared';
import { Namespaces } from '../constants/Namespaces';
import { Utils } from '../lib/jsUtils';
import { Base, BaseData, BaseNodes } from './Base';
import { Game } from './Game';
import { User } from './User';

export interface GiveawayNodes extends BaseNodes {
	outer: SgGiveawayOuterNode | null;
	inner: HTMLDivElement | null;
	summary: HTMLDivElement | null;
	heading: HTMLDivElement | HTMLHeadingElement | null;
	columns: HTMLDivElement | null;
	links: HTMLDivElement | null;
	headingName: HTMLAnchorElement | null;
	copies: HTMLSpanElement | null;
	points: HTMLSpanElement | null;
	search: HTMLAnchorElement | null;
	hide: HTMLElement | null;
	deleted: HTMLSpanElement | null;
	startTimestampContainer: HTMLElement | null;
	startTimestamp: TimestampNode | null;
	endTimestampContainer: HTMLElement | null;
	endTimestamp: TimestampNode | null;
	createdTimestampContainer: HTMLElement | null;
	createdTimestamp: TimestampNode | null;
	awaitingFeedback: HTMLDivElement | null;
	received: HTMLDivElement | null;
	notReceived: HTMLDivElement | null;
	noWinners: HTMLDivElement | null;
	whitelist: HTMLDivElement | null;
	group: HTMLAnchorElement | null;
	inviteOnly: HTMLDivElement | null;
	regionRestricted: HTMLAnchorElement | null;
	level: HTMLDivElement | null;
	entries: HTMLAnchorElement | HTMLDivElement | null;
	comments: HTMLAnchorElement | null;
}

export type SgGiveawayOuterNode = HTMLDivElement & {
	dataset: {
		gameId?: string;
	};
};

export type GiveawayData = BaseData & GiveawayBaseData & GiveawayExtraData;

export interface GiveawayBaseData {
	url: string | null;
	copies: number;
	points: number;
	startTimestamp: number;
	endTimestamp: number;
	createdTimestamp: number;
	whitelist: boolean;
	group: boolean;
	inviteOnly: boolean;
	regionRestricted: boolean;
	level: number;
	entries: number;
	comments: number;
}

export interface GiveawayExtraData {
	code: string | null;
	searchUrl: string | null;
	deleted: boolean;
	started: boolean;
	ended: boolean;
	public: boolean;
	showHide: boolean;
	showCreator: boolean;
	showWinners: boolean;
}

export interface GiveawayWinners {
	received: User[];
	notReceived: User[];
}

export abstract class Giveaway extends Base<Giveaway, GiveawayNodes, GiveawayData> {
	game: Game;
	creator: User;
	winners: GiveawayWinners = {
		received: [],
		notReceived: [],
	};

	constructor(namespace: number) {
		super(namespace);
		this.nodes = Giveaway.getDefaultNodes();
		this.data = Giveaway.getDefaultData();

		const game = Game.create();
		const user = User.create();

		if (!game || !user) {
			throw this.getError('failed to construct');
		}

		this.game = game;
		this.creator = user;
	}

	static getDefaultNodes = (): GiveawayNodes => {
		return {
			...Base.getDefaultNodes(),
			outer: null,
			inner: null,
			summary: null,
			heading: null,
			columns: null,
			links: null,
			headingName: null,
			copies: null,
			points: null,
			search: null,
			hide: null,
			deleted: null,
			startTimestampContainer: null,
			startTimestamp: null,
			endTimestampContainer: null,
			endTimestamp: null,
			createdTimestampContainer: null,
			createdTimestamp: null,
			awaitingFeedback: null,
			received: null,
			notReceived: null,
			noWinners: null,
			whitelist: null,
			group: null,
			inviteOnly: null,
			regionRestricted: null,
			level: null,
			entries: null,
			comments: null,
		};
	};

	static getDefaultData = (): GiveawayData => {
		return {
			...Base.getDefaultData(),
			...Giveaway.getDefaultBaseData(),
			...Giveaway.getDefaultExtraData(),
		};
	};

	static getDefaultBaseData = (): GiveawayBaseData => {
		return {
			url: null,
			copies: 1,
			points: 0,
			startTimestamp: 0,
			endTimestamp: 0,
			createdTimestamp: 0,
			whitelist: false,
			group: false,
			inviteOnly: false,
			regionRestricted: false,
			level: 0,
			entries: 0,
			comments: 0,
		};
	};

	static getDefaultExtraData = (): GiveawayExtraData => {
		return {
			code: null,
			searchUrl: null,
			deleted: false,
			started: true,
			ended: false,
			public: true,
			showHide: true,
			showCreator: true,
			showWinners: false,
		};
	};

	static create = (namespace = Session.namespace): Giveaway | null => {
		switch (namespace) {
			case Namespaces.SG:
				return new SgGiveaway();
			default:
				return null;
		}
	};

	static parseAll = (refNode: HTMLElement): Giveaway[] => {
		switch (Session.namespace) {
			case Namespaces.SG:
				return SgGiveaway.parseAll(refNode);
			default:
				return [];
		}
	};

	parse = (outerNode: SgGiveawayOuterNode): Giveaway => {
		const game = Game.create();
		const creator = User.create();

		if (!game || !creator) {
			throw this.getError('failed to parse');
		}

		this.game = game;
		this.creator = creator;

		this.parseNodes(outerNode);
		this.parseData();
		this.parseExtraData();

		if (this.nodes.outer) {
			this.nodes.outer.dataset.esgstParsed = '';
		}

		return this;
	};

	reset = (): Giveaway => {
		const outerNode = this.nodes.outer;
		this.nodes = Giveaway.getDefaultNodes();
		this.data = Giveaway.getDefaultData();

		if (outerNode) {
			this.nodes.outer = outerNode;
			this.built = false;
			this.build();
		}

		return this;
	};

	abstract fetch(url: string): Promise<Giveaway | null>;
}

class SgGiveaway extends Giveaway {
	constructor() {
		super(Namespaces.SG);
	}

	static parseAll(refNode: HTMLElement): SgGiveaway[] {
		const giveaways: SgGiveaway[] = [];

		const nodes = refNode.querySelectorAll('.giveaway__row-outer-wrap:not([data-esgst-parsed])');
		for (const node of nodes) {
			const giveaway = new SgGiveaway();
			giveaway.parse(node as SgGiveawayOuterNode);
			giveaways.push(giveaway);
		}

		const featuredNodes = refNode.querySelectorAll(
			'.featured__outer-wrap--giveaway:not([data-esgst-parsed])'
		);
		for (const featuredNode of featuredNodes) {
			const giveaway = new SgFeaturedGiveaway();
			giveaway.parse(featuredNode as SgGiveawayOuterNode, refNode);
			giveaways.push(giveaway);
		}

		const tableColumns = SgTableGiveaway.getTableColumns(refNode);
		if (tableColumns[0] === 'Giveaway') {
			if (tableColumns.length > 1) {
				const tableNodes = refNode.querySelectorAll(
					'.table:not(.table--summary) .table__row-outer-wrap:not([data-esgst-parsed])'
				);
				for (const tableNode of tableNodes) {
					const giveaway = new SgTableGiveaway(tableColumns);
					giveaway.parse(tableNode as SgGiveawayOuterNode);
					giveaways.push(giveaway);
				}
			} else {
				const tableNodes = refNode.querySelectorAll(
					'.table:not(.table--summary) .table__row-outer-wrap:not([data-esgst-parsed])'
				);
				for (const tableNode of tableNodes) {
					const giveaway = new SgArchiveGiveaway(tableColumns);
					giveaway.parse(tableNode as SgGiveawayOuterNode);
					giveaways.push(giveaway);
				}
			}
		}

		return giveaways;
	}

	parseNodes = (outerNode: SgGiveawayOuterNode): SgGiveaway => {
		const nodes = Giveaway.getDefaultNodes();
		const gameNodes = Game.getDefaultNodes();
		const creatorNodes = User.getDefaultNodes();

		nodes.outer = outerNode;
		gameNodes.outer = outerNode;
		creatorNodes.outer = outerNode;
		nodes.inner = nodes.outer.querySelector('.giveaway__row-inner-wrap');

		if (!nodes.inner) {
			throw this.getError('failed to parse nodes');
		}

		nodes.summary = nodes.inner.querySelector('.giveaway__summary');
		creatorNodes.avatarOuter = nodes.inner.querySelector('.giveaway_image_avatar');
		gameNodes.thumbnailOuter = nodes.inner.querySelector(
			'.giveaway_image_thumbnail, .giveaway_image_thumbnail_missing'
		);

		if (!nodes.summary) {
			throw this.getError('failed to parse nodes');
		}

		nodes.heading = nodes.summary.querySelector('.giveaway__heading');
		nodes.columns = nodes.summary.querySelector('.giveaway__columns');
		nodes.links = nodes.summary.querySelector('.giveaway__links');

		if (!nodes.heading || !nodes.columns || !nodes.links) {
			throw this.getError('failed to parse nodes');
		}

		nodes.headingName = nodes.heading.querySelector('.giveaway__heading__name');
		gameNodes.name = nodes.headingName;

		const headingThinNodes = nodes.heading.querySelectorAll(
			'.giveaway__heading__thin'
		) as NodeListOf<HTMLElement>;
		for (const headingThinNode of headingThinNodes) {
			const text = headingThinNode.textContent.trim();
			if (text.includes('Copies')) {
				nodes.copies = headingThinNode;
			} else if (text.includes('P')) {
				nodes.points = headingThinNode;
			}
		}

		gameNodes.steam =
			(nodes.heading.querySelector('.giveaway__icon .fa-steam')
				?.parentElement as HTMLAnchorElement) ?? null;
		gameNodes.screenshots = nodes.heading.querySelector('.giveaway__icon.fa-camera');
		nodes.search =
			(nodes.heading.querySelector('.giveaway__icon .fa-search')
				?.parentElement as HTMLAnchorElement) ?? null;
		nodes.hide = nodes.heading.querySelector('.giveaway__icon.giveaway__hide');

		const timestampNodes = nodes.columns.querySelectorAll('[data-timestamp]') as NodeListOf<
			TimestampNode
		>;
		for (const timestampNode of timestampNodes) {
			const containerNode = timestampNode.parentElement;
			if (!containerNode) {
				continue;
			}

			const text = containerNode.textContent.trim();
			if (text.includes('Begins in')) {
				nodes.startTimestampContainer = containerNode;
				nodes.startTimestamp = timestampNode;
			} else if (text.includes('remaining') || text.includes('Ended')) {
				nodes.endTimestampContainer = containerNode;
				nodes.endTimestamp = timestampNode;
			} else {
				nodes.createdTimestampContainer = containerNode;
				nodes.createdTimestamp = timestampNode;
			}
		}

		nodes.awaitingFeedback =
			(nodes.columns.querySelector('.fa-question-circle')?.parentElement as HTMLDivElement) ?? null;
		nodes.received = nodes.columns.querySelector('.giveaway__column--positive');
		nodes.notReceived = nodes.columns.querySelector('.giveaway__column--negative');
		nodes.noWinners =
			(nodes.columns.querySelector('.fa-ban')?.parentElement as HTMLDivElement) ?? null;

		const winnerStatuses = Object.keys(this.winners) as (keyof GiveawayWinners)[];
		for (const winnerStatus of winnerStatuses) {
			const statusNode = nodes[winnerStatus];
			if (!statusNode) {
				continue;
			}

			const winnerNodes = statusNode.querySelectorAll('[href*="/user/"]') as NodeListOf<
				HTMLAnchorElement
			>;
			for (const winnerNode of winnerNodes) {
				const winner = User.create();
				if (!winner) {
					continue;
				}

				winner.nodes.outer = statusNode;
				winner.nodes.usernameInner = winnerNode;
				this.winners[winnerStatus].push(winner);
			}
		}

		creatorNodes.usernameInner = nodes.columns.querySelector('.giveaway__username');

		nodes.whitelist = nodes.columns.querySelector('.giveaway__column--whitelist');
		nodes.group = nodes.columns.querySelector('.giveaway__column--group');
		nodes.inviteOnly = nodes.columns.querySelector('.giveaway__column--invite-only');
		nodes.regionRestricted = nodes.columns.querySelector('.giveaway__column--region-restricted');
		nodes.level = nodes.columns.querySelector('.giveaway__column--contributor-level');

		const linkNodes = nodes.links.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
		for (const linkNode of linkNodes) {
			const text = linkNode.textContent.trim();
			if (text.includes('entr')) {
				nodes.entries = linkNode;
			} else if (text.includes('comm')) {
				nodes.comments = linkNode;
			}
		}

		this.nodes = nodes;
		this.game.nodes = gameNodes;
		this.creator.nodes = creatorNodes;

		return this;
	};

	parseData = (): SgGiveaway => {
		const nodes = this.nodes;
		const data = Giveaway.getDefaultData();

		if (!nodes.outer) {
			throw this.getError('failed to parse data');
		}

		if (nodes.headingName) {
			data.url = nodes.headingName.getAttribute('href') || null;
		}

		if (nodes.copies) {
			const matches = nodes.copies.textContent.trim().match(/[,\d]+/);
			if (matches) {
				data.copies = parseInt(matches[0].replace(',', ''));
			}
		}
		if (nodes.points) {
			const matches = nodes.points.textContent.trim().match(/[,\d]+/);
			if (matches) {
				data.points = parseInt(matches[0].replace(',', ''));
			}
		}

		if (nodes.startTimestamp) {
			data.startTimestamp = parseInt(nodes.startTimestamp.dataset.timestamp);
		}
		if (nodes.endTimestamp) {
			data.endTimestamp = parseInt(nodes.endTimestamp.dataset.timestamp);
		}
		if (nodes.createdTimestamp) {
			data.createdTimestamp = parseInt(nodes.createdTimestamp.dataset.timestamp);
		}

		const winnerStatuses = Object.keys(this.winners) as (keyof GiveawayWinners)[];
		for (const winnerStatus of winnerStatuses) {
			const winners = this.winners[winnerStatus];
			for (const winner of winners) {
				winner.parseData();
			}
		}

		data.whitelist = !!nodes.whitelist;
		data.group = !!nodes.group;
		data.inviteOnly = !!nodes.inviteOnly;
		data.regionRestricted = !!nodes.regionRestricted;
		if (nodes.level) {
			const matches = nodes.level.textContent.trim().match(/\d+/);
			if (matches) {
				data.level = parseInt(matches[0]);
			}
		}

		if (nodes.entries) {
			const matches = nodes.entries.textContent.trim().match(/[,\d]+/);
			if (matches) {
				data.entries = parseInt(matches[0].replace(',', ''));
			}
		}
		if (nodes.comments) {
			const matches = nodes.comments.textContent.trim().match(/[,\d]+/);
			if (matches) {
				data.comments = parseInt(matches[0].replace(',', ''));
			}
		}

		this.data = data;
		this.game.parseData();
		this.creator.parseData();

		return this;
	};

	parseExtraData = (): SgGiveaway => {
		const nodes = this.nodes;
		const creatorNodes = this.creator.nodes;
		const data = this.data;
		const gameData = this.game.data;

		if (data.url) {
			data.code = data.url.slice(10, 15) || null;
		}
		if (gameData.steamId && gameData.steamType) {
			data.searchUrl = `/giveaways/search?${gameData.steamType}=${gameData.steamId}`;
		}
		data.deleted = !!nodes.deleted;

		const now = Math.trunc(Date.now() / 1e3);
		data.started = !!(data.endTimestamp || (data.startTimestamp && data.startTimestamp <= now));
		data.ended = !!(data.endTimestamp && data.endTimestamp <= now);

		const winnerStatuses = Object.keys(this.winners) as (keyof GiveawayWinners)[];
		for (const winnerStatus of winnerStatuses) {
			const winners = this.winners[winnerStatus];
			for (const winner of winners) {
				winner.parseExtraData();
			}
		}

		data.public = !data.whitelist && !data.group && !data.inviteOnly;
		data.showHide = !!nodes.hide;
		data.showCreator = !!creatorNodes.usernameInner;
		data.showWinners = !!(
			nodes.awaitingFeedback ||
			nodes.received ||
			nodes.notReceived ||
			nodes.noWinners
		);

		this.game.parseExtraData();
		this.creator.parseExtraData();

		return this;
	};

	build = (): SgGiveaway => {
		if (!this.nodes.outer) {
			this.nodes.outer = <div className="giveaway__row-outer-wrap"></div>;
		}

		if (!this.nodes.outer) {
			throw this.getError('failed to build');
		}

		if (this.game.data.id) {
			this.nodes.outer.dataset.gameId = this.game.data.id;
		}

		DOM.insert(
			this.nodes.outer,
			'atinner',
			<div className="giveaway__row-inner-wrap">
				<div className="giveaway__summary">
					<h2 className="giveaway__heading">
						<a className="giveaway__heading__name" href={this.data.url}>
							{this.game.data.name}
						</a>
						{this.data.copies > 1 && (
							<span className="giveaway__heading__thin">
								({this.data.copies.toLocaleString('en-US')} Copies)
							</span>
						)}
						<span className="giveaway__heading__thin">
							({this.data.points.toLocaleString('en-US')}P)
						</span>
						{this.game.data.url && (
							<a
								className="giveaway__icon"
								href={this.game.data.url}
								target="_blank"
								rel="nofollow noopener"
							>
								<i className="fa fa-fw fa-steam"></i>
							</a>
						)}
						{this.game.data.id && (
							<i
								className="giveaway__icon fa fa-fw fa-camera"
								data-lightbox-id={this.game.data.id}
							></i>
						)}
						{this.data.searchUrl && (
							<a className="giveaway__icon" href={this.data.searchUrl}>
								<i className="fa fa-fw fa-search"></i>
							</a>
						)}
						{!this.data.hidden && this.data.showHide && (
							<i
								className="giveaway__icon giveaway__hide trigger-popup fa fa-fw fa-eye-slash"
								data-popup="popup--hide-games"
							></i>
						)}
					</h2>
					<div className="giveaway__columns">
						<div>
							<i className="fa fa-clock-o"></i>{' '}
							{this.data.started ? (
								this.data.ended ? (
									<fragment>
										{'Ended '}
										<span data-timestamp={this.data.endTimestamp}>
											{Shared.common.getTimeSince(this.data.endTimestamp)}
										</span>
										{' ago'}
									</fragment>
								) : (
									<fragment>
										<span data-timestamp={this.data.endTimestamp}>
											{Shared.common.getTimeSince(this.data.endTimestamp, true)}
										</span>
										{' remaining'}
									</fragment>
								)
							) : (
								<fragment>
									{'Begins in '}
									<span data-timestamp={this.data.startTimestamp}>
										{Shared.common.getTimeSince(this.data.startTimestamp, true)}
									</span>
								</fragment>
							)}
						</div>
						{this.data.showWinners && (
							<fragment>
								{this.winners.received.length === 0 && this.winners.notReceived.length === 0 && (
									<div>
										<i className="fa fa-question-circle"></i> Awaiting feedback
									</div>
								)}
								{this.winners.received.length > 0 && (
									<div className="giveaway__column--positive">
										<i className="fa fa-check-circle"></i>{' '}
										<fragment>
											{this.winners.received
												.slice(0, 3)
												.map((winner) => [
													<a href={winner.data.url}>{winner.data.username}</a>,
													', ',
												])
												.flat()
												.slice(0, -1)}
										</fragment>
									</div>
								)}
								{this.winners.notReceived.length > 0 && (
									<div className="giveaway__column--negative">
										<i className="fa fa-times-circle"></i>{' '}
										<fragment>
											{this.winners.notReceived
												.slice(0, 3)
												.map((winner) => [
													<a href={winner.data.url}>{winner.data.username}</a>,
													', ',
												])
												.flat()
												.slice(0, -1)}
										</fragment>
									</div>
								)}
								{this.data.entries === 0 && (
									<div>
										<i className="fa fa-ban"></i> No winners
									</div>
								)}
							</fragment>
						)}
						<div className="giveaway__column--width-fill text-right">
							<span data-timestamp={this.data.createdTimestamp}>
								{Shared.common.getTimeSince(this.data.createdTimestamp)}
							</span>
							{' ago'}
							{this.data.showCreator && (
								<fragment>
									{' by '}
									<a className="giveaway__username" href={this.creator.data.url}>
										{this.creator.data.username}
									</a>
								</fragment>
							)}
						</div>
						{this.data.whitelist && (
							<div className="giveaway__column--whitelist" title="Whitelist">
								<i className="fa fa-fw fa-heart"></i>
							</div>
						)}
						{this.data.group && (
							<a className="giveaway__column--group" href={`${this.data.url}/groups`}>
								<i className="fa fa-fw fa-user"></i>
							</a>
						)}
						{this.data.inviteOnly && (
							<div className="giveaway__column--invite-only" title="Invite Only">
								<i className="fa fa-fw fa-lock"></i>
							</div>
						)}
						{this.data.regionRestricted && (
							<a
								className="giveaway__column--region-restricted"
								href={`${this.data.url}/region-restrictions`}
								title="Region Restricted"
							>
								<i className="fa fa-fw fa-globe"></i>
							</a>
						)}
						{this.data.level > 0 && (
							<div
								className={`giveaway__column--contributor-level giveaway__column--contributor-level--${
									this.data.level <= Session.counters.level.base ? 'positive' : 'negative'
								}`}
								title="Contributor Level"
							>
								Level {`${this.data.level}${this.data.level < 10 ? '+' : ''}`}
							</div>
						)}
					</div>
					<div className="giveaway__links">
						<a href={this.data.url && `${this.data.url}/entries`}>
							<i className="fa fa-tag"></i>{' '}
							<span>
								{this.data.entries.toLocaleString('en-US')}{' '}
								{Utils.getPlural(this.data.entries, 'entry', 'entries')}
							</span>
						</a>
						<a href={this.data.url && `${this.data.url}/comments`}>
							<i className="fa fa-comment"></i>{' '}
							<span>
								{this.data.comments.toLocaleString('en-US')}{' '}
								{Utils.getPlural(this.data.comments, 'comment')}
							</span>
						</a>
					</div>
				</div>
				{this.data.showCreator && (
					<a
						className="giveaway_image_avatar"
						href={this.creator.data.url}
						style={`background-image:url(${this.creator.data.avatar});`}
					></a>
				)}
				{this.game.data.thumbnail ? (
					<a
						className="giveaway_image_thumbnail"
						href={this.data.url}
						style={`background-image:url(${this.game.data.thumbnail});`}
					></a>
				) : (
					<a className="giveaway_image_thumbnail_missing" href={this.data.url}>
						<i className="fa fa-picture-o"></i>
					</a>
				)}
			</div>
		);

		this.parseNodes(this.nodes.outer);
		this.nodes.outer.dataset.esgstParsed = '';

		return this;
	};

	fetch = async (url: string): Promise<Giveaway | null> => {
		const response = await FetchRequest.get(url);
		if (!response.html) {
			return null;
		}

		const giveaways = Giveaway.parseAll((response.html as unknown) as HTMLElement);
		return giveaways.length > 1 ? giveaways[0] : null;
	};
}

class SgFeaturedGiveaway extends SgGiveaway {
	constructor() {
		super();
	}

	parse = (outerNode: SgGiveawayOuterNode, refNode?: HTMLElement): SgFeaturedGiveaway => {
		const game = Game.create();
		const creator = User.create();

		if (!game || !creator) {
			throw this.getError('failed to parse');
		}

		this.game = game;
		this.creator = creator;

		this.parseNodes(outerNode, refNode);
		this.parseData();
		this.parseExtraData();

		if (this.nodes.outer) {
			this.nodes.outer.dataset.esgstParsed = '';
		}

		return this;
	};

	parseNodes = (outerNode: SgGiveawayOuterNode, refNode?: HTMLElement): SgFeaturedGiveaway => {
		const nodes = Giveaway.getDefaultNodes();
		const gameNodes = Game.getDefaultNodes();
		const creatorNodes = User.getDefaultNodes();

		nodes.outer = outerNode;
		gameNodes.outer = outerNode;
		creatorNodes.outer = outerNode;
		nodes.inner = nodes.outer.querySelector('.featured__inner-wrap');

		if (!nodes.inner) {
			throw this.getError('failed to parse nodes');
		}

		nodes.summary = nodes.inner.querySelector('.featured__summary');
		creatorNodes.avatarOuter = nodes.inner.querySelector('.featured_giveaway_image_avatar');
		gameNodes.thumbnailOuter = nodes.inner.querySelector('.global__image-outer-wrap');

		if (!nodes.summary) {
			throw this.getError('failed to parse nodes');
		}

		nodes.heading = nodes.summary.querySelector('.featured__heading');
		nodes.columns = nodes.summary.querySelector('.featured__columns');
		if (refNode) {
			nodes.links = refNode.querySelector('.sidebar__navigation');
		}

		if (!nodes.heading || !nodes.columns || !nodes.links) {
			throw this.getError('failed to parse nodes');
		}

		nodes.headingName = nodes.heading.querySelector('.featured__heading__medium');
		gameNodes.name = nodes.headingName;

		const headingThinNodes = nodes.heading.querySelectorAll(
			'.featured__heading__small'
		) as NodeListOf<HTMLElement>;
		for (const headingThinNode of headingThinNodes) {
			const text = headingThinNode.textContent.trim();
			if (text.includes('Copies')) {
				nodes.copies = headingThinNode;
			} else if (text.includes('P')) {
				nodes.points = headingThinNode;
			}
		}

		gameNodes.steam =
			(nodes.heading.querySelector('.fa-steam')?.parentElement as HTMLAnchorElement) ?? null;
		gameNodes.screenshots =
			(nodes.heading.querySelector('.fa-camera')?.parentElement as HTMLAnchorElement) ?? null;
		nodes.search =
			(nodes.heading.querySelector('.fa-search')?.parentElement as HTMLAnchorElement) ?? null;
		nodes.hide =
			(nodes.heading.querySelector('.featured__giveaway__hide')
				?.parentElement as HTMLAnchorElement) ?? null;

		const timestampNodes = nodes.columns.querySelectorAll('[data-timestamp]') as NodeListOf<
			TimestampNode
		>;
		for (const timestampNode of timestampNodes) {
			const containerNode = timestampNode.parentElement;
			if (!containerNode) {
				continue;
			}

			const text = containerNode.textContent.trim();
			if (text.includes('Begins in')) {
				nodes.startTimestampContainer = containerNode;
				nodes.startTimestamp = timestampNode;
			} else if (text.includes('remaining') || text.includes('Ended')) {
				nodes.endTimestampContainer = containerNode;
				nodes.endTimestamp = timestampNode;
			} else {
				nodes.createdTimestampContainer = containerNode;
				nodes.createdTimestamp = timestampNode;
			}
		}

		creatorNodes.usernameInner = nodes.columns.querySelector('[href*="/user/"]');

		nodes.whitelist = nodes.columns.querySelector('.featured__column--whitelist');
		nodes.group = nodes.columns.querySelector('.featured__column--group');
		nodes.inviteOnly = nodes.columns.querySelector('.featured__column--invite-only');
		nodes.regionRestricted = nodes.columns.querySelector('.featured__column--region-restricted');
		nodes.level = nodes.columns.querySelector('.featured__column--contributor-level');

		const linkNodes = nodes.links.querySelectorAll(
			'.sidebar__navigation__item__link'
		) as NodeListOf<HTMLAnchorElement>;
		for (const linkNode of linkNodes) {
			const text = linkNode.textContent.trim();
			if (text.includes('Entr')) {
				nodes.entries = linkNode;
			} else if (text.includes('Comm')) {
				nodes.comments = linkNode;
			}
		}

		this.nodes = nodes;
		this.game.nodes = gameNodes;
		this.creator.nodes = creatorNodes;

		return this;
	};

	parseData = (): SgGiveaway => {
		const nodes = this.nodes;
		const data = Giveaway.getDefaultData();

		if (!nodes.outer) {
			throw this.getError('failed to parse data');
		}

		if (nodes.comments) {
			data.url = nodes.comments.getAttribute('href') || null;
		}

		if (nodes.copies) {
			const matches = nodes.copies.textContent.trim().match(/[,\d]+/);
			if (matches) {
				data.copies = parseInt(matches[0].replace(',', ''));
			}
		}
		if (nodes.points) {
			const matches = nodes.points.textContent.trim().match(/[,\d]+/);
			if (matches) {
				data.points = parseInt(matches[0].replace(',', ''));
			}
		}

		if (nodes.startTimestamp) {
			data.startTimestamp = parseInt(nodes.startTimestamp.dataset.timestamp);
		}
		if (nodes.endTimestamp) {
			data.endTimestamp = parseInt(nodes.endTimestamp.dataset.timestamp);
		}
		if (nodes.createdTimestamp) {
			data.createdTimestamp = parseInt(nodes.createdTimestamp.dataset.timestamp);
		}

		data.whitelist = !!nodes.whitelist;
		data.group = !!nodes.group;
		data.inviteOnly = !!nodes.inviteOnly;
		data.regionRestricted = !!nodes.regionRestricted;
		if (nodes.level) {
			const matches = nodes.level.textContent.trim().match(/\d+/);
			if (matches) {
				data.level = parseInt(matches[0]);
			}
		}

		if (nodes.entries) {
			const matches = nodes.entries.textContent.trim().match(/[,\d]+/);
			if (matches) {
				data.entries = parseInt(matches[0].replace(',', ''));
			}
		}
		if (nodes.comments) {
			const matches = nodes.comments.textContent.trim().match(/[,\d]+/);
			if (matches) {
				data.comments = parseInt(matches[0].replace(',', ''));
			}
		}

		this.data = data;
		this.game.parseData();
		this.creator.parseData();

		return this;
	};

	build = (): SgFeaturedGiveaway => {
		if (!this.nodes.outer) {
			this.nodes.outer = (
				<div className="featured__outer-wrap featured__outer-wrap--giveaway"></div>
			);
		}

		if (!this.nodes.outer) {
			throw this.getError('failed to build');
		}

		if (this.game.data.id) {
			this.nodes.outer.dataset.gameId = this.game.data.id;
		}

		DOM.insert(
			this.nodes.outer,
			'atinner',
			<div className="featured__inner-wrap">
				{this.game.data.thumbnail ? (
					<a
						className="global__image-outer-wrap global__image-outer-wrap--game-large"
						href={this.game.data.url}
						target="_blank"
						rel="nofollow noopener"
					>
						<img src={this.game.data.thumbnail} />
					</a>
				) : (
					<a
						className="global__image-outer-wrap global__image-outer-wrap--game-large global__image-outer-wrap--missing-image"
						href={this.game.data.url}
						target="_blank"
						rel="nofollow noopener"
					>
						<i className="fa fa-picture-o"></i>
					</a>
				)}
				<div className="featured__summary">
					<h2 className="featured__heading">
						<div className="featured__heading__medium">{this.game.data.name}</div>
						{this.data.copies > 1 && (
							<div className="featured__heading__small">
								({this.data.copies.toLocaleString('en-US')} Copies)
							</div>
						)}
						<div className="featured__heading__small">
							({this.data.points.toLocaleString('en-US')}P)
						</div>
						{this.game.data.url && (
							<a href={this.game.data.url} target="_blank" rel="nofollow noopener">
								<i className="fa fa-fw fa-steam"></i>
							</a>
						)}
						{this.game.data.id && (
							<a data-lightbox-id={this.game.data.id}>
								<i className="fa fa-fw fa-camera"></i>
							</a>
						)}
						{this.data.searchUrl && (
							<a href={this.data.searchUrl}>
								<i className="fa fa-fw fa-search"></i>
							</a>
						)}
						{!this.data.hidden && (
							<a>
								<i
									className="featured__giveaway__hide trigger-popup fa fa-fw fa-eye-slash"
									data-popup="popup--hide-games"
								></i>
							</a>
						)}
					</h2>
					<div className="featured__columns">
						<div className="featured__column">
							<i className="fa fa-clock-o"></i>{' '}
							{this.data.started ? (
								this.data.ended ? (
									<fragment>
										{'Ended '}
										<span data-timestamp={this.data.endTimestamp}>
											{Shared.common.getTimeSince(this.data.endTimestamp)}
										</span>
										{' ago'}
									</fragment>
								) : (
									<fragment>
										<span data-timestamp={this.data.endTimestamp}>
											{Shared.common.getTimeSince(this.data.endTimestamp, true)}
										</span>
										{' remaining'}
									</fragment>
								)
							) : (
								<fragment>
									{'Begins in '}
									<span data-timestamp={this.data.startTimestamp}>
										{Shared.common.getTimeSince(this.data.startTimestamp, true)}
									</span>
								</fragment>
							)}
						</div>
						<div className="featured__column featured__column--width-fill text-right">
							<span data-timestamp={this.data.createdTimestamp}>
								{Shared.common.getTimeSince(this.data.createdTimestamp)}
							</span>
							{' ago by '}
							<a href={this.creator.data.url}>{this.creator.data.username}</a>
						</div>
						{this.data.whitelist && (
							<div className="featured__column featured__column--whitelist" title="Whitelist">
								<i className="fa fa-fw fa-heart"></i> Whitelist
							</div>
						)}
						{this.data.group && (
							<a
								className="featured__column featured__column--group"
								href={`${this.data.url}/groups`}
							>
								<i className="fa fa-fw fa-user"></i>
							</a>
						)}
						{this.data.inviteOnly && (
							<div className="featured__column featured__column--invite-only" title="Invite Only">
								<i className="fa fa-fw fa-lock"></i> Invite Only
							</div>
						)}
						{this.data.regionRestricted && (
							<a
								className="featured__column featured__column--region-restricted"
								href={`${this.data.url}/region-restrictions`}
								title="Region Restricted"
							>
								<i className="fa fa-fw fa-globe"></i>
							</a>
						)}
						{this.data.level > 0 && (
							<div
								className={`featured__column featured__column--contributor-level featured__column--contributor-level--${
									this.data.level <= Session.counters.level.base ? 'positive' : 'negative'
								}`}
								title="Contributor Level"
							>
								Level {`${this.data.level}${this.data.level < 10 ? '+' : ''}`}
							</div>
						)}
						<a
							className="featured_giveaway_image_avatar"
							href={this.creator.data.url}
							style={`background-image:url(${this.creator.data.avatar});`}
						></a>
					</div>
				</div>
				{this.game.data.thumbnail ? (
					<a
						className="giveaway_image_thumbnail"
						href={this.data.url}
						style={`background-image:url(${this.game.data.thumbnail});`}
					></a>
				) : (
					<a className="giveaway_image_thumbnail_missing" href={this.data.url}>
						<i className="fa fa-picture-o"></i>
					</a>
				)}
			</div>
		);

		this.parseNodes(this.nodes.outer);
		this.nodes.outer.dataset.esgstParsed = '';

		return this;
	};
}

class SgTableGiveaway extends SgGiveaway {
	tableColumns: string[];

	constructor(tableColumns: string[]) {
		super();
		this.tableColumns = tableColumns;
	}

	static getTableColumns = (refNode: HTMLElement): string[] => {
		const columns: string[] = [];

		const headingNode = refNode.querySelector('.table__heading');
		if (!headingNode) {
			return columns;
		}

		const columnNodes = headingNode.children;
		for (const columnNode of columnNodes) {
			columns.push(columnNode.textContent.trim());
		}

		return columns;
	};

	parseNodes = (outerNode: SgGiveawayOuterNode): SgTableGiveaway => {
		const nodes = Giveaway.getDefaultNodes();
		const gameNodes = Game.getDefaultNodes();

		nodes.outer = outerNode;
		gameNodes.outer = outerNode;
		nodes.inner = nodes.outer.querySelector('.table__row-inner-wrap');

		if (!nodes.inner) {
			throw this.getError('failed to parse nodes');
		}

		gameNodes.thumbnailOuter = nodes.inner.querySelector(
			'.table_image_thumbnail, .table_image_thumbnail_missing'
		);
		nodes.heading = nodes.inner.querySelector('.table__column--width-fill');

		if (!nodes.heading) {
			throw this.getError('failed to parse nodes');
		}

		nodes.headingName = nodes.heading.querySelector('.table__column__heading');
		gameNodes.name = nodes.headingName;
		nodes.deleted = nodes.heading.querySelector('.table__column__deleted');

		const timestampNodes = nodes.heading.querySelectorAll('[data-timestamp]') as NodeListOf<
			TimestampNode
		>;
		for (const timestampNode of timestampNodes) {
			const containerNode = timestampNode.parentElement;
			if (!containerNode) {
				continue;
			}

			const text = containerNode.textContent.trim();
			if (text.includes('Begins in')) {
				nodes.startTimestampContainer = containerNode;
				nodes.startTimestamp = timestampNode;
			} else if (text.includes('remaining') || text.includes('Ended')) {
				nodes.endTimestampContainer = containerNode;
				nodes.endTimestamp = timestampNode;
			} else {
				nodes.createdTimestampContainer = containerNode;
				nodes.createdTimestamp = timestampNode;
			}
		}

		const columnNodes = nodes.inner.querySelectorAll('.table__column--width-small') as NodeListOf<
			HTMLDivElement
		>;
		for (const [i, column] of this.tableColumns.entries()) {
			switch (column) {
				case 'Entries':
					nodes.entries = columnNodes[i - 1];
					break;
				default:
					break;
			}
		}

		this.nodes = nodes;
		this.game.nodes = gameNodes;

		return this;
	};

	parseData = (): SgTableGiveaway => {
		const nodes = this.nodes;
		const data = Giveaway.getDefaultData();

		if (!nodes.outer) {
			throw this.getError('failed to parse data');
		}

		if (nodes.headingName) {
			data.url = nodes.headingName.getAttribute('href') || null;

			const matches = nodes.headingName.textContent.trim().match(/\(([,\d]+?)\sCopies\)/);
			if (matches) {
				data.copies = parseInt(matches[1].replace(',', ''));
			}
		}

		if (nodes.startTimestamp) {
			data.startTimestamp = parseInt(nodes.startTimestamp.dataset.timestamp);
		}
		if (nodes.endTimestamp) {
			data.endTimestamp = parseInt(nodes.endTimestamp.dataset.timestamp);
		}
		if (nodes.createdTimestamp) {
			data.createdTimestamp = parseInt(nodes.createdTimestamp.dataset.timestamp);
		}

		if (nodes.entries) {
			const matches = nodes.entries.textContent.trim().match(/[,\d]+/);
			if (matches) {
				data.entries = parseInt(matches[0].replace(',', ''));
			}
		}

		this.data = data;
		this.game.parseData();

		return this;
	};

	build = (): SgTableGiveaway => {
		if (!this.nodes.outer) {
			this.nodes.outer = <div className="table__row-outer-wrap"></div>;
		}

		if (!this.nodes.outer) {
			throw this.getError('failed to build');
		}

		DOM.insert(
			this.nodes.outer,
			'atinner',
			<div className="table__row-inner-wrap">
				<div>
					{this.game.data.thumbnail ? (
						<a
							className="table_image_thumbnail"
							href={this.data.url}
							style={`background-image:url(${this.game.data.thumbnail});`}
						></a>
					) : (
						<a className="table_image_thumbnail_missing" href={this.data.url}>
							<i className="fa fa-picture-o"></i>
						</a>
					)}
				</div>
				<div className="table__column--width-fill">
					<p>
						<a className="table__column__heading" href={this.data.url}>
							{this.game.data.name}
							{this.data.copies > 1 && ` (${this.data.copies.toLocaleString('en-US')} Copies)`}
						</a>
					</p>
					<p>
						{this.data.deleted && (
							<fragment>
								<span className="table__column__deleted">(Deleted)</span>{' '}
							</fragment>
						)}
						<span>
							{this.data.started ? (
								this.data.ended ? (
									<fragment>
										{'Ended '}
										<span data-timestamp={this.data.endTimestamp}>
											{Shared.common.getTimeSince(this.data.endTimestamp)}
										</span>
										{' ago'}
									</fragment>
								) : (
									<fragment>
										<span data-timestamp={this.data.startTimestamp}>
											{Shared.common.getTimeSince(this.data.startTimestamp, true)}
										</span>
										{' remaining'}
									</fragment>
								)
							) : (
								<fragment>
									{'Begins in '}
									<span data-timestamp={this.data.startTimestamp}>
										{Shared.common.getTimeSince(this.data.startTimestamp, true)}
									</span>
								</fragment>
							)}
						</span>
					</p>
				</div>
				<fragment>
					{this.tableColumns.map((column) => {
						let text = '-';
						switch (column) {
							case 'Entries':
								text = this.data.entries.toLocaleString('en-US');
								break;
							default:
								break;
						}
						return <div className="table__column--width-small text-center">{text}</div>;
					})}
				</fragment>
			</div>
		);

		this.parseNodes(this.nodes.outer);
		this.nodes.outer.dataset.esgstParsed = '';

		return this;
	};
}

class SgArchiveGiveaway extends SgTableGiveaway {
	constructor(tableColumns: string[]) {
		super(tableColumns);
	}

	parseNodes = (outerNode: SgGiveawayOuterNode): SgArchiveGiveaway => {
		const nodes = Giveaway.getDefaultNodes();
		const gameNodes = Game.getDefaultNodes();
		const creatorNodes = User.getDefaultNodes();

		nodes.outer = outerNode;
		gameNodes.outer = outerNode;
		creatorNodes.outer = outerNode;
		nodes.inner = nodes.outer.querySelector('.table__row-inner-wrap');

		if (!nodes.inner) {
			throw this.getError('failed to parse nodes');
		}

		gameNodes.thumbnailOuter = nodes.inner.querySelector(
			'.table_image_thumbnail, .table_image_thumbnail_missing'
		);
		nodes.heading = nodes.inner.querySelector('.table__column--width-fill');
		nodes.columns = nodes.inner.querySelector('.giveaway__columns');

		if (!nodes.heading || !nodes.columns) {
			throw this.getError('failed to parse nodes');
		}

		nodes.headingName = nodes.heading.querySelector('.table__column__heading');
		gameNodes.name = nodes.headingName;
		nodes.deleted = nodes.heading.querySelector('.table__column__deleted');

		const timestampNodes = nodes.heading.querySelectorAll('[data-timestamp]') as NodeListOf<
			TimestampNode
		>;
		for (const timestampNode of timestampNodes) {
			const containerNode = timestampNode.parentElement;
			if (!containerNode) {
				continue;
			}

			const text = containerNode.textContent.trim();
			if (text.includes('Begins in')) {
				nodes.startTimestampContainer = containerNode;
				nodes.startTimestamp = timestampNode;
			} else if (text.includes('remaining') || text.includes('Ended')) {
				nodes.endTimestampContainer = containerNode;
				nodes.endTimestamp = timestampNode;
			} else {
				nodes.createdTimestampContainer = containerNode;
				nodes.createdTimestamp = timestampNode;
			}
		}

		creatorNodes.usernameInner = nodes.heading.querySelector('.table__column__secondary-link');

		nodes.whitelist = nodes.columns.querySelector('.giveaway__column--whitelist');
		nodes.group = nodes.columns.querySelector('.giveaway__column--group');
		nodes.inviteOnly = nodes.columns.querySelector('.giveaway__column--invite-only');
		nodes.regionRestricted = nodes.columns.querySelector('.giveaway__column--region-restricted');
		nodes.level = nodes.columns.querySelector('.giveaway__column--contributor-level');

		this.nodes = nodes;
		this.game.nodes = gameNodes;
		this.creator.nodes = creatorNodes;

		return this;
	};

	parseData = (): SgArchiveGiveaway => {
		const nodes = this.nodes;
		const data = Giveaway.getDefaultData();

		if (!nodes.outer) {
			throw this.getError('failed to parse data');
		}

		if (nodes.headingName) {
			data.url = nodes.headingName.getAttribute('href') || null;

			const matches = nodes.headingName.textContent.trim().match(/\(([,\d]+?)\sCopies\)/);
			if (matches) {
				data.copies = parseInt(matches[1].replace(',', ''));
			}
		}

		if (nodes.createdTimestamp) {
			data.createdTimestamp = parseInt(nodes.createdTimestamp.dataset.timestamp);
		}

		data.whitelist = !!nodes.whitelist;
		data.group = !!nodes.group;
		data.inviteOnly = !!nodes.inviteOnly;
		data.regionRestricted = !!nodes.regionRestricted;
		if (nodes.level) {
			const matches = nodes.level.textContent.trim().match(/\d+/);
			if (matches) {
				data.level = parseInt(matches[0]);
			}
		}

		this.data = data;
		this.game.parseData();
		this.creator.parseData();

		return this;
	};

	build = (): SgArchiveGiveaway => {
		if (!this.nodes.outer) {
			this.nodes.outer = <div className="table__row-outer-wrap"></div>;
		}

		if (!this.nodes.outer) {
			throw this.getError('failed to build');
		}

		DOM.insert(
			this.nodes.outer,
			'atinner',
			<div className="table__row-inner-wrap">
				<div>
					{this.game.data.thumbnail ? (
						<a
							className="table_image_thumbnail"
							href={this.data.url}
							style={`background-image:url(${this.game.data.thumbnail});`}
						></a>
					) : (
						<a className="table_image_thumbnail_missing" href={this.data.url}>
							<i className="fa fa-picture-o"></i>
						</a>
					)}
				</div>
				<div className="table__column--width-fill">
					<p>
						<a className="table__column__heading" href={this.data.url}>
							{this.game.data.url ? (
								<fragment>
									{this.game.data.name}
									{this.data.copies > 1 && ` (${this.data.copies.toLocaleString('en-US')} Copies)`}
								</fragment>
							) : (
								'Invite Only'
							)}
						</a>
					</p>
					<p>
						{this.data.deleted && (
							<fragment>
								<span className="table__column__deleted">(Deleted)</span>{' '}
							</fragment>
						)}
						{'Created '}
						<span data-timestamp={this.data.createdTimestamp}>
							{Shared.common.getTimeSince(this.data.createdTimestamp)}
						</span>
						{' ago by '}
						<a className="table__column__secondary-link" href={this.creator.data.url}>
							{this.creator.data.username}
						</a>
					</p>
				</div>
				<div>
					<div className="giveaway__columns">
						{this.data.whitelist && (
							<div className="giveaway__column--whitelist" title="Whitelist">
								<i className="fa fa-fw fa-heart"></i>
							</div>
						)}
						{this.data.group && (
							<a className="giveaway__column--group" href={`${this.data.url}/groups`}>
								<i className="fa fa-fw fa-user"></i>
							</a>
						)}
						{this.data.inviteOnly && (
							<div className="giveaway__column--invite-only" title="Invite Only">
								<i className="fa fa-fw fa-lock"></i>
							</div>
						)}
						{this.data.regionRestricted && (
							<a
								className="giveaway__column--region-restricted"
								href={`${this.data.url}/region-restrictions`}
								title="Region Restricted"
							>
								<i className="fa fa-fw fa-globe"></i>
							</a>
						)}
						{this.data.level > 0 && (
							<div
								className={`giveaway__column--contributor-level giveaway__column--contributor-level--${
									this.data.level <= Session.counters.level.base ? 'positive' : 'negative'
								}`}
								title="Contributor Level"
							>
								Level {`${this.data.level}${this.data.level < 10 ? '+' : ''}`}
							</div>
						)}
					</div>
				</div>
			</div>
		);

		this.parseNodes(this.nodes.outer);
		this.nodes.outer.dataset.esgstParsed = '';

		return this;
	};
}
