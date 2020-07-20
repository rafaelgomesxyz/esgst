import { Module } from '../../class/Module';
import { common } from '../Common';
import { Settings } from '../../class/Settings';

const createElements = common.createElements.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common),
	getTimestamp = common.getTimestamp.bind(common);
class UsersWhitelistBlacklistHighlighter extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							[
								`Adds an icon (`,
								['i', { class: 'fa fa-heart esgst-whitelist' }],
								' if the user is whitelisted and ',
								['i', { class: 'fa fa-ban esgst-blacklist' }],
								` if they are blacklisted) next to the a user's username (in any page) to indicate that they are on your whitelist/blacklist.`,
							],
						],
						[
							'li',
							`If you hover over the icon, it shows the date when you added the user to your whitelist/blacklist.`,
						],
					],
				],
			],
			features: {
				wbh_b: {
					colors: true,
					description: [
						[
							'ul',
							[
								[
									'li',
									`Adds a background color of your own preference to the user's username if they are blacklisted, instead of an icon.`,
								],
								[
									'li',
									`If you hover over the username, it shows the date when you added the user to your whitelist/blacklist.`,
								],
							],
						],
					],
					name: 'Use background colors for blacklisted users instead of icons.',
					sg: true,
					st: true,
				},
				wbh_w: {
					colors: true,
					description: [
						[
							'ul',
							[
								[
									'li',
									`Adds a background color of your own preference to the user's username if they are whitelisted, instead of an icon.`,
								],
								[
									'li',
									`If you hover over the username, it shows the date when you added the user to your whitelist/blacklist.`,
								],
							],
						],
					],
					name: 'Use background colors for whitelisted users instead of icons.',
					sg: true,
					st: true,
				},
			},
			id: 'wbh',
			name: 'Whitelist/Blacklist Highlighter',
			sg: {
				include: [{ enabled: 1, pattern: '.*' }],
				exclude: [
					{ enabled: 1, pattern: '^/account/manage/whitelist' },
					{ enabled: 1, pattern: '^/account/manage/blacklist' },
				],
			},
			st: true,
			sync: `Blacklist, Whitelist`,
			syncKeys: ['Blacklist', 'Whitelist'],
			type: 'users',
			featureMap: {
				user: this.wbh_getUsers.bind(this),
			},
		};
	}

	wbh_getUsers(users) {
		for (const user of users) {
			if (
				user.saved &&
				(user.saved.whitelisted || user.saved.blacklisted) &&
				!user.context.parentElement.querySelector(`.esgst-wbh-highlight, .esgst-wbh-icon`)
			) {
				let [icon, status] = user.saved.whitelisted
					? ['fa-heart sidebar__shortcut__whitelist', 'whitelisted']
					: ['fa-ban sidebar__shortcut__blacklist', 'blacklisted'];
				let title = `You ${status} ${user.username} on ${getTimestamp(
					user.saved[`${status}Date`]
				)}`;
				if (
					(Settings.get('wbh_w') && user.saved.whitelisted) ||
					(Settings.get('wbh_b') && user.saved.blacklisted)
				) {
					user.element.classList.add('esgst-wbh-highlight', `esgst-wbh-highlight-${status}`);
					user.element.title = getFeatureTooltip('wbh', title);
				} else {
					createElements(user.context, 'beforeBegin', [
						{
							attributes: {
								class: 'esgst-wbh-icon esgst-user-icon',
								title: getFeatureTooltip('wbh', title),
							},
							type: 'span',
							children: [
								{
									attributes: {
										class: `fa ${icon} esgst-${status.slice(0, -2)}`,
									},
									type: 'i',
								},
							],
						},
					]);
				}
			}
		}
	}
}

const usersWhitelistBlacklistHighlighter = new UsersWhitelistBlacklistHighlighter();

export { usersWhitelistBlacklistHighlighter };
