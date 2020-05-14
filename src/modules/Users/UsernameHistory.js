import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';
import { permissions } from '../../class/Permissions';
import { DOM } from '../../class/DOM';
import { FetchRequest } from '../../class/FetchRequest';

class UsersUsernameHistory extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				['ul', [
					['li', [
						'Adds a button (',
						['i', { class: 'fa fa-caret-down' }],
						') next to a user\'s username (in their ',
						['a', { href: 'https://www.steamgifts.com/user/cg' }, 'profile'],
						' page) that allows you to view their username history ever since they started being tracked.'
					]],
					['li', 'It is impossible to keep track of every SteamGifts user due to a database capacity limitation (and that would also be impractical), so instead the feature keeps track of a limited number of users (currently around 9000). A user starts being tracked when anyone using ESGST clicks on the button to view their username history.'],
					['li', 'Username changes are detected in two instances:'],
					['ul', [
						['li', 'Every 30 days the usernames of all of the users in the database are updated and if any changes are detected they are added to the history.'],
						['li', 'Every time anyone using ESGST clicks on the button to view the username history of a user the username of that user is updated and if a change is detected it is added to the history.'],
					]],
					['li', 'The database is kept in a server, which means that everyone using ESGST interacts with the same database and views the same history.'],
					['li', [
						'Adds a button (',
						['i', { class: 'fa fa-user' }],
						' ',
						['i', { class: 'fa fa-history' }],
						') to the page heading of this menu that allows you to view all of the recent username changes detected.'
					]]
				]]
			],
			id: 'uh',
			name: 'Username History',
			sg: true,
			type: 'users',
			featureMap: {
				profile: this.addButton.bind(this),
			},
		};
	}

	addButton(profile) {
		const container = DOM.insert(profile.heading, 'beforeEnd', (
			<div class="esgst-uh-container">
				<a class="esgst-uh-button" title={Shared.common.getFeatureTooltip('uh', 'View username history')}>
					<i class="fa fa-caret-down"></i>
				</a>
				<div class="esgst-uh-box esgst-hidden">
					<div class="esgst-uh-title">
						<span>Username History</span>
					</div>
					<ul class="esgst-uh-list"></ul>
				</div>
			</div>
		));
		const button = container.querySelector('.esgst-uh-button');
		const box = container.querySelector('.esgst-uh-box');
		const list = box.querySelector('.esgst-uh-list');
		button.addEventListener('click', this.toggleBox.bind(this, profile, box, list));
		Shared.esgst.documentEvents.click.add(this.closeBox.bind(this, container, box));
	}

	async toggleBox(profile, box, list) {
		box.classList.toggle('esgst-hidden');
		if (list.innerHTML) {
			return;
		}
		const hasPermissions = await permissions.contains([['server']]);
		if (!hasPermissions) {
			DOM.insert(list, 'inner', (
				<div>
					<i class="fa fa-times"></i>
					<span>No permissions granted for https://rafaelgssa.com. Please grant the permissions on the settings menu so that the data can be retrieved from the ESGST API.</span>
				</div>
			));
			return;
		}
		DOM.insert(list, 'inner', (
			<div>
				<i class="fa fa-circle-o-notch fa-spin"></i>
				<span>Loading username history...</span>
			</div>
		));
		try {
			const response = await this.getUserNames(profile.steamId, profile.username);
			DOM.insert(list, 'inner', (
				<fragment>
					{response.result.usernames.map(username => (
						<li>{username}</li>
					))}
				</fragment>
			));
		} catch (err) {
			Logger.warning(err);
			DOM.insert(list, 'inner', (
				<div>
					<i class="fa fa-times"></i>
					<span>Failed to load history. Please try again later.</span>
				</div>
			));
		}
	}

	closeBox(container, box, event) {
		if (!box.classList.contains('esgst-hidden') && !container.contains(event.target)) {
			box.classList.add('esgst-hidden');
		}
	}

	/**
	 * @param steamId
	 * @param username
	 */
	async getUserNames(steamId, username) {
		const response = await FetchRequest.get(`https://rafaelgssa.com/esgst/user/+${steamId}/uh?username=${username}`);
		return response.json;
	}
}

const usersUsernameHistory = new UsersUsernameHistory();

export { usersUsernameHistory };