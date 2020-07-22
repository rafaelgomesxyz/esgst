import { Module } from '../../class/Module';
import { common } from '../Common';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

const createElements = common.createElements.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common);
class UsersProfileLinks extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Allows you to add links to your{' '}
						<a href="https://www.steamgifts.com/account/manage/whitelist">whitelist</a>/
						<a href="https://www.steamgifts.com/account/manage/blacklist">blacklist</a>/
						<a href="https://www.steamgifts.com/account/steam/games">games</a>/
						<a href="https://www.steamgifts.com/account/steam/groups">groups</a>/
						<a href="https://www.steamgifts.com/account/steam/wishlist">wishlist</a> pages to the
						sidebar of your <a href="https://www.steamgifts.com/user/your-username">profile</a>{' '}
						page.
					</li>
					<li>
						The count for each link might be off if you do not have your whitelist/blacklist/owned
						games/groups/wishlisted games synced through ESGST (first button in the page heading of
						this menu). The count for games might be always off, since the method ESGST uses to sync
						your owned games includes DLCs.
					</li>
				</ul>
			),
			features: {
				pl_w: {
					name: 'Show whitelist link.',
					sg: true,
				},
				pl_b: {
					name: 'Show blacklist link.',
					sg: true,
				},
				pl_g: {
					name: 'Show games link.',
					sg: true,
				},
				pl_gs: {
					name: 'Show groups link.',
					sg: true,
				},
				pl_wl: {
					name: 'Show wishlist link.',
					sg: true,
				},
			},
			id: 'pl',
			name: 'Profile Links',
			sg: true,
			type: 'users',
		};
	}

	init() {
		if (!Shared.esgst.userPath) return;
		Shared.esgst.profileFeatures.push(this.pl_add.bind(this));
	}

	pl_add(profile) {
		if (profile.username !== Settings.get('username')) {
			return;
		}
		const items = [];
		const sections = [
			{
				items: [
					{
						count: 0,
						id: 'pl_w',
						name: 'Whitelist',
						url: '/account/manage/whitelist',
					},
					{
						count: 0,
						id: 'pl_b',
						name: 'Blacklist',
						url: '/account/manage/blacklist',
					},
				],
				name: 'Manage',
			},
			{
				items: [
					{
						count: 0,
						id: 'pl_g',
						name: 'Games',
						url: '/account/steam/games',
					},
					{
						count: 0,
						id: 'pl_gs',
						name: 'Groups',
						url: '/account/steam/groups',
					},
					{
						count: 0,
						id: 'pl_wl',
						name: 'Wishlist',
						url: '/account/steam/wishlist',
					},
				],
				name: 'Steam',
			},
		];
		for (const id in Shared.esgst.users.users) {
			if (Shared.esgst.users.users.hasOwnProperty(id)) {
				const user = Shared.esgst.users.users[id];
				if (user.whitelisted) {
					sections[0].items[0].count += 1;
				} else if (user.blacklisted) {
					sections[0].items[1].count += 1;
				}
			}
		}
		for (const id in Shared.esgst.games.apps) {
			if (Shared.esgst.games.apps.hasOwnProperty(id)) {
				const game = Shared.esgst.games.apps[id];
				if (game.owned) {
					sections[1].items[0].count += 1;
				} else if (game.wishlisted) {
					sections[1].items[2].count += 1;
				}
			}
		}
		for (const group of Shared.esgst.groups) {
			if (group.member) {
				sections[1].items[1].count += 1;
			}
		}
		for (const section of sections) {
			let enabled = false;
			const list = [];
			for (const item of section.items) {
				if (!Settings.get(item.id)) {
					continue;
				}
				list.push({
					attributes: {
						class: 'sidebar__navigation__item',
					},
					type: 'li',
					children: [
						{
							attributes: {
								class: 'sidebar__navigation__item__link',
								href: item.url,
							},
							type: 'a',
							children: [
								{
									attributes: {
										class: 'sidebar__navigation__item__name',
									},
									text: item.name,
									type: 'div',
								},
								{
									attributes: {
										class: 'sidebar__navigation__item__underline',
									},
									type: 'div',
								},
								{
									attributes: {
										class: 'sidebar__navigation__item__count',
									},
									text: item.count,
									type: 'div',
								},
							],
						},
					],
				});
				enabled = true;
			}
			if (!enabled) {
				continue;
			}
			items.push(
				{
					attributes: {
						class: 'sidebar__heading',
					},
					text: section.name,
					type: 'h3',
				},
				{
					attributes: {
						class: 'sidebar__navigation',
						title: getFeatureTooltip('pl'),
					},
					type: 'ul',
					children: list,
				}
			);
		}
		createElements(
			Shared.esgst.sidebar.getElementsByClassName('sidebar__navigation')[0],
			'afterend',
			items
		);
	}
}

const usersProfileLinks = new UsersProfileLinks();

export { usersProfileLinks };
