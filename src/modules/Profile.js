import { Module } from '../class/Module';
import { common } from './Common';
import { Settings } from '../class/Settings';
import { Logger } from '../class/Logger';
import { Shared } from '../class/Shared';

const checkUsernameChange = common.checkUsernameChange.bind(common),
	saveUser = common.saveUser.bind(common),
	updateWhitelistBlacklist = common.updateWhitelistBlacklist.bind(common);
class Profile extends Module {
	constructor() {
		super();
		this.info = {
			endless: true,
			id: 'profile',
		};
	}

	async init() {
		if (
			Settings.get('updateWhitelistBlacklist') &&
			(Shared.esgst.whitelistPath || Shared.esgst.blacklistPath)
		) {
			const key = Shared.esgst.whitelistPath ? 'whitelisted' : 'blacklisted';
			Shared.esgst.endlessFeatures.push(this.getUsers.bind(this, key));
		}
		if (this.esgst.userPath) {
			await this.profile_load(document);
		}
	}

	getUsers(key, context, main, source, endless) {
		const elements = context.querySelectorAll(
			Shared.common.getSelectors(endless, [`X.table__remove-default:not(.is-hidden)`])
		);
		for (const element of elements) {
			const container = element.closest('.table__row-inner-wrap');
			const heading = container.querySelector('.table__column__heading');
			const username = heading.textContent.trim();
			element.addEventListener('click', () =>
				Shared.common.updateWhitelistBlacklist(key, { username }, null)
			);
		}
	}

	async profile_load(context) {
		let element, elements, i, input, key, match, rows;
		const profile = {};
		if (this.esgst.sg) {
			profile.heading = context.getElementsByClassName('featured__heading')[0];
			input = context.querySelector(`[name="child_user_id"]`);
			if (input) {
				profile.id = input.value;
			} else {
				profile.id = '';
			}
			profile.username = profile.heading
				.querySelector('.featured__heading__medium')
				.textContent.replace(/\s[\s\S]*/, '');
			profile.steamButtonContainer = context.getElementsByClassName(
				'sidebar__shortcut-outer-wrap'
			)[0];
			profile.steamButton = profile.steamButtonContainer.querySelector(`[href*="/profiles/"]`);
			profile.steamId = profile.steamButton.getAttribute('href').match(/\d+/)[0];
			profile.name = profile.username;
		} else {
			profile.heading = this.esgst.mainPageHeading;
			profile.id = '';
			profile.username = '';
			profile.steamButtonContainer = context.getElementsByClassName('profile_links')[0];
			profile.steamButton = profile.steamButtonContainer.querySelector(`[href*="/profiles/"]`);
			profile.steamId = profile.steamButton.getAttribute('href').match(/\d+/)[0];
			profile.name = profile.steamId;
		}
		elements = context.getElementsByClassName('featured__table__row__left');
		for (i = elements.length - 1; i >= 0; --i) {
			element = elements[i];
			match = element.textContent.match(
				/(Comments|Gifts\s(Won|Sent)|Contributor\sLevel|Registered)/
			);
			if (match) {
				key = match[2];
				if (key) {
					if (key === 'Won') {
						profile.wonRow = element.parentElement;
						profile.wonRowLeft = element;
						profile.wonRowRight = element.nextElementSibling;
						rows = JSON.parse(
							profile.wonRowRight.firstElementChild.firstElementChild.getAttribute(
								'data-ui-tooltip'
							)
						).rows;
						profile.wonCount = parseInt(rows[0].columns[1].name.replace(/,/g, ''));
						profile.wonFull = parseInt(rows[1].columns[1].name.replace(/,/g, ''));
						profile.wonReduced = parseInt(rows[2].columns[1].name.replace(/,/g, ''));
						profile.wonZero = parseInt(rows[3].columns[1].name.replace(/,/g, ''));
						profile.notWon = parseInt(rows[4].columns[1].name.replace(/,/g, ''));
						profile.wonNotReceived = profile.notWon;
						profile.wonCvContainer = profile.wonRowRight.firstElementChild.lastElementChild;
						rows = JSON.parse(profile.wonCvContainer.getAttribute('data-ui-tooltip')).rows;
						profile.wonCV = parseFloat(profile.wonCvContainer.textContent.replace(/[$,]/g, ''));
						profile.realWonCV = parseFloat(rows[0].columns[1].name.replace(/[$,]/g, ''));
					} else if (key === 'Sent') {
						profile.sentRow = element.parentElement;
						profile.sentRowLeft = element;
						profile.sentRowRight = element.nextElementSibling;
						rows = JSON.parse(
							profile.sentRowRight.firstElementChild.firstElementChild.getAttribute(
								'data-ui-tooltip'
							)
						).rows;
						profile.sentCount = parseInt(rows[0].columns[1].name.replace(/,/g, ''));
						profile.sentFull = parseInt(rows[1].columns[1].name.replace(/,/g, ''));
						profile.sentReduced = parseInt(rows[2].columns[1].name.replace(/,/g, ''));
						profile.sentZero = parseInt(rows[3].columns[1].name.replace(/,/g, ''));
						profile.sentAwaiting = parseInt(rows[4].columns[1].name.replace(/,/g, ''));
						profile.notSent = parseInt(rows[5].columns[1].name.replace(/,/g, ''));
						profile.sentNotReceived = profile.notSent;
						profile.sentCvContainer = profile.sentRowRight.firstElementChild.lastElementChild;
						rows = JSON.parse(profile.sentCvContainer.getAttribute('data-ui-tooltip')).rows;
						profile.sentCV = parseFloat(profile.sentCvContainer.textContent.replace(/[$,]/g, ''));
						profile.realSentCV = parseFloat(rows[0].columns[1].name.replace(/[$,]/g, ''));
					}
				} else if (match[1] === 'Comments') {
					profile.commentsRow = element.parentElement;
				} else if (match[1] === 'Contributor Level') {
					profile.levelRow = element.parentElement;
					profile.levelRowLeft = element;
					profile.levelRowRight = element.nextElementSibling;
					rows = JSON.parse(profile.levelRowRight.firstElementChild.getAttribute('data-ui-tooltip'))
						.rows;
					profile.level = parseFloat(rows[0].columns[1].name);
				} else if (match[1] === 'Registered') {
					profile.registrationDate = parseInt(
						element.nextElementSibling.firstElementChild.getAttribute('data-timestamp')
					);
				}
			}
		}
		profile.whitelistButton = profile.steamButtonContainer.getElementsByClassName(
			'sidebar__shortcut__whitelist'
		)[0];
		profile.blacklistButton = profile.steamButtonContainer.getElementsByClassName(
			'sidebar__shortcut__blacklist'
		)[0];
		if (profile.whitelistButton) {
			if (Settings.get('updateWhitelistBlacklist')) {
				profile.whitelistButton.addEventListener(
					'click',
					updateWhitelistBlacklist.bind(common, 'whitelisted', profile)
				);
			}
		}
		if (profile.blacklistButton) {
			if (Settings.get('updateWhitelistBlacklist')) {
				profile.blacklistButton.addEventListener(
					'click',
					updateWhitelistBlacklist.bind(common, 'blacklisted', profile)
				);
			}
		}
		let savedUser = this.esgst.users.users[profile.steamId];
		if (savedUser) {
			const user = {
				steamId: profile.steamId,
				username: profile.username,
				values: {},
			};
			if (checkUsernameChange(this.esgst.users, user)) {
				await saveUser(null, this.esgst.users, user);
				savedUser = this.esgst.users.users[profile.steamId];
			}
		}
		for (const feature of this.esgst.profileFeatures) {
			try {
				await feature(profile, savedUser);
			} catch (error) {
				Logger.error(error.message, error.stack);
			}
		}
	}
}

const profileModule = new Profile();

export { profileModule };
