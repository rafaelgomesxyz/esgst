import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { common } from '../Common';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';

const createElements = common.createElements.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common),
	getValue = common.getValue.bind(common),
	removeDuplicateNotes = common.removeDuplicateNotes.bind(common),
	saveUser = common.saveUser.bind(common);
class UsersUserNotes extends Module {
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
								`Adds a button (`,
								['i', { class: 'fa fa-sticky-note' }],
								' if there are notes saved and ',
								['i', { class: 'fa fa-sticky-note-o' }],
								` if there are not) next to a user's username (in their `,
								['a', { href: `https://www.steamgifts.com/user/cg` }, 'profile'],
								` page) that allows you to save notes for them (only visible to you).`,
							],
						],
						['li', 'You can press Ctrl + Enter to save the notes.'],
						[
							'li',
							`This feature is recommended for cases where you want to associate a long text with a user, since the notes are not displayed in the page.For a short text, check [id=ut].`,
						],
					],
				],
			],
			features: {
				un_p: {
					name: 'Pop up when whitelisting/blacklisting a user.',
					sg: true,
				},
			},
			id: 'un',
			name: 'User Notes',
			sg: true,
			st: true,
			type: 'users',
			featureMap: {
				profile: this.un_add.bind(this),
			},
		};
	}

	un_add(profile, savedUser) {
		let blacklistButton, position, whitelistButton;
		if (Shared.esgst.sg) {
			position = 'beforeEnd';
			if (Settings.get('un_p')) {
				whitelistButton = profile.steamButtonContainer.getElementsByClassName(
					'sidebar__shortcut__whitelist'
				)[0];
				if (whitelistButton) {
					whitelistButton.addEventListener('click', this.un_open.bind(this, profile));
				}
				blacklistButton = profile.steamButtonContainer.getElementsByClassName(
					'sidebar__shortcut__blacklist'
				)[0];
				if (blacklistButton) {
					blacklistButton.addEventListener('click', this.un_open.bind(this, profile));
				}
			}
		} else {
			position = 'afterBegin';
		}
		profile.unButton = createElements(profile.heading, position, [
			{
				attributes: {
					class: 'esgst-un-button',
					title: getFeatureTooltip('un', 'Edit user notes'),
				},
				type: 'a',
				children: [
					{
						attributes: {
							class: 'fa',
						},
						type: 'i',
					},
				],
			},
		]);
		profile.unIcon = profile.unButton.firstElementChild;
		if (savedUser && savedUser.notes) {
			profile.unIcon.classList.add('fa-sticky-note');
		} else {
			profile.unIcon.classList.add('fa-sticky-note-o');
		}
		profile.unButton.addEventListener('click', this.un_open.bind(this, profile));
	}

	un_open(profile) {
		let set;
		profile.unPopup = new Popup({
			addScrollable: true,
			icon: 'fa-sticky-note',
			isTemp: true,
			title: (
				<fragment>
					Edit user notes for <span>{profile.name}</span>:
				</fragment>
			),
		});
		profile.unTextArea = createElements(profile.unPopup.scrollable, 'beforeEnd', [
			{
				type: 'textarea',
			},
		]);
		if (Settings.get('cfh')) {
			Shared.esgst.modules.commentsCommentFormattingHelper.cfh_addPanel(profile.unTextArea);
		}
		set = new ButtonSet({
			color1: 'green',
			color2: 'grey',
			icon1: 'fa-check',
			icon2: 'fa-circle-o-notch fa-spin',
			title1: 'Save',
			title2: 'Saving...',
			callback1: this.un_save.bind(this, profile),
		});
		profile.unTextArea.addEventListener('keydown', (event) => {
			if (event.ctrlKey && event.key === 'Enter') {
				set.trigger();
			}
		});
		profile.unPopup.description.appendChild(set.set);
		profile.unPopup.open(this.un_get.bind(this, profile));
	}

	async un_save(profile) {
		let notes = removeDuplicateNotes(profile.unTextArea.value.trim());
		let user = {
			steamId: profile.steamId,
			id: profile.id,
			username: profile.username,
			values: {
				notes: notes,
			},
		};
		if (notes) {
			profile.unIcon.classList.remove('fa-sticky-note-o');
			profile.unIcon.classList.add('fa-sticky-note');
		} else {
			profile.unIcon.classList.remove('fa-sticky-note');
			profile.unIcon.classList.add('fa-sticky-note-o');
		}
		await saveUser(null, null, user);
		profile.unPopup.close();
	}

	async un_get(profile) {
		profile.unTextArea.focus();
		let savedUsers = JSON.parse(getValue('users'));
		let savedUser = savedUsers.users[profile.steamId];
		if (savedUser) {
			let notes = savedUser.notes;
			if (notes) {
				profile.unTextArea.value = notes;
			}
		}
	}
}

const usersUserNotes = new UsersUserNotes();

export { usersUserNotes };
