import { DOM } from '../class/DOM';
import { LocalStorage } from '../class/LocalStorage';
import { permissions } from '../class/Permissions';
import { persistentStorage } from '../class/PersistentStorage';
import { Popup } from '../class/Popup';
import { Settings } from '../class/Settings';
import { Shared } from '../class/Shared';
import { ToggleSwitch } from '../class/ToggleSwitch';
import { Button } from '../components/Button';
import { PageHeading } from '../components/PageHeading';
import { Utils } from '../lib/jsUtils';
import { CloudStorage } from './CloudStorage';
import { settingsModule } from './Settings';

function getDataMenu(option, switches, type) {
	let i, m, menu, n, options, toggleSwitch;
	menu = document.createElement('div');
	switches[option.key] = toggleSwitch = new ToggleSwitch(
		menu,
		`${type}_${option.key}`,
		false,
		option.name,
		false,
		false,
		null,
		Settings.get(`${type}_${option.key}`)
	);
	switches[option.key].size = Shared.common.createElements(switches[option.key].name, 'beforeend', [
		{
			attributes: {
				class: 'esgst-bold',
			},
			type: 'span',
		},
	]);
	if (option.name === 'Main') {
		Shared.common.createElements(switches[option.key].name, 'beforeend', [
			{
				attributes: {
					class: 'fa fa-question-circle',
					title: `Main data is the data that is needed by other sub-options. Because of that dependency, when deleting main data not all data may be deleted, but if you delete another sub-option first and then delete main data, all data that was required exclusively by that sub-option will be deleted.`,
				},
				type: 'i',
			},
		]);
	}
	if (option.options) {
		options = Shared.common.createElements(menu, 'beforeend', [
			{
				attributes: {
					class: 'esgst-form-row-indent SMFeatures esgst-hidden',
				},
				type: 'div',
			},
		]);
		const optionSwitches = {};
		if (option.options.length > 1) {
			const group = Shared.common.createElements(options, 'beforeend', [
				{
					attributes: {
						class: 'esgst-button-group',
					},
					type: 'div',
					children: [
						{
							text: `Select:`,
							type: 'span',
						},
					],
				},
			]);
			Button.create([
				{
					color: 'white',
					icons: ['fa-square'],
					name: 'All',
					onClick: Shared.common.selectSwitches.bind(
						Shared.common,
						optionSwitches,
						'enable',
						group
					),
				},
				{
					template: 'loading',
					isDisabled: true,
					name: '',
				},
			]).insert(group, 'beforeend');
			Button.create([
				{
					color: 'white',
					icons: ['fa-square-o'],
					name: 'None',
					onClick: Shared.common.selectSwitches.bind(
						Shared.common,
						optionSwitches,
						'disable',
						group
					),
				},
				{
					template: 'loading',
					isDisabled: true,
					name: '',
				},
			]).insert(group, 'beforeend');
			Button.create([
				{
					color: 'white',
					icons: ['fa-plus-square-o'],
					name: 'Inverse',
					onClick: Shared.common.selectSwitches.bind(
						Shared.common,
						optionSwitches,
						'toggle',
						group
					),
				},
				{
					template: 'loading',
					isDisabled: true,
					name: '',
				},
			]).insert(group, 'beforeend');
		}
		for (i = 0, n = option.options.length; i < n; ++i) {
			m = getDataMenu(option.options[i], switches, type);
			optionSwitches[option.options[i].key] = switches[option.options[i].key];
			options.appendChild(m);
			toggleSwitch.dependencies.push(m);
		}
		if (Settings.get(`${type}_${option.key}`)) {
			options.classList.remove('esgst-hidden');
		}
	}
	toggleSwitch.onEnabled = () => {
		if (options) {
			options.classList.remove('esgst-hidden');
		}
	};
	toggleSwitch.onDisabled = () => {
		if (options) {
			options.classList.add('esgst-hidden');
		}
	};
	return menu;
}

function getDataSizes(dm) {
	let spacePopup = new Popup({
		addScrollable: true,
		icon: 'fa-circle-o-notch fa-spin',
		title: 'Calculating data sizes...',
	});
	spacePopup.open(manageData.bind(null, dm, false, false, false, spacePopup));
}

async function loadImportFile(dm, dropbox, googleDrive, oneDrive, space, callback) {
	let file;
	if (dropbox) {
		CloudStorage.manage(CloudStorage.DROPBOX, null, dm, callback);
	} else if (googleDrive) {
		CloudStorage.manage(CloudStorage.GOOGLEDRIVE, null, dm, callback);
	} else if (oneDrive) {
		CloudStorage.manage(CloudStorage.ONEDRIVE, null, dm, callback);
	} else {
		file = dm.input.files[0];
		if (file) {
			dm.reader = new FileReader();
			const isZip = file.name.match(/\.zip$/);
			dm.reader.onload = readImportFile.bind(
				null,
				dm,
				dropbox,
				googleDrive,
				oneDrive,
				space,
				isZip,
				callback
			);
			if (isZip) {
				dm.reader.readAsBinaryString(file);
			} else {
				dm.reader.readAsText(file);
			}
		} else {
			Shared.common.createFadeMessage(dm.warning, 'No file was loaded!');
			callback();
		}
	}
}

async function readImportFile(dm, dropbox, googleDrive, oneDrive, space, isZip, callback) {
	try {
		if (dm.reader) {
			dm.data = JSON.parse(
				isZip ? (await Shared.common.readZip(dm.reader.result))[0].value : dm.reader.result
			);
		}
		Shared.common.createConfirmation(
			'Are you sure you want to restore the selected data?',
			manageData.bind(null, dm, dropbox, googleDrive, oneDrive, space, callback),
			callback
		);
	} catch (error) {
		Shared.common.createFadeMessage(dm.warning, 'Cannot parse file!');
		callback();
	}
}

function confirmDataDeletion(dm, dropbox, googleDrive, oneDrive, space, callback) {
	Shared.common.createConfirmation(
		'Are you sure you want to delete the selected data?',
		manageData.bind(null, dm, dropbox, googleDrive, oneDrive, space, callback),
		callback
	);
}

function loadDataManagement(type, isPopup, callback) {
	let containerr, context, group1, group2, i, n, onClick, option, prep, section, title1, title2;
	let dm = {
		autoBackup: callback && Shared.esgst.parameters.autoBackup,
		type: type,
	};
	dm[type] = true;
	switch (type) {
		case 'import':
			onClick = loadImportFile.bind(null);
			prep = 'from';
			title1 = 'Restore';
			title2 = 'Restoring';
			dm.pastTense = 'restored';
			break;
		case 'export':
			onClick = manageData.bind(null);
			prep = 'to';
			title1 = 'Backup';
			title2 = 'Backing up';
			dm.pastTense = 'backed up';
			break;
		case 'delete':
			onClick = confirmDataDeletion.bind(null);
			prep = 'from';
			title1 = 'Delete';
			title2 = 'Deleting';
			dm.pastTense = 'deleted';
			break;
	}
	let popup = null;
	if (!dm.autoBackup) {
		if (isPopup) {
			popup = new Popup({
				addScrollable: 'left',
				settings: true,
				isTemp: true,
			});
			containerr = popup.description;
			context = popup.scrollable;
		} else {
			context = containerr = Shared.esgst.sidebar.nextElementSibling;
			context.setAttribute('data-esgst-popup', 'true');
			context.innerHTML = '';
		}
		containerr.classList.add('esgst-text-left');
		const heading = PageHeading.create('storage', [
			{
				name: 'ESGST',
				url: Shared.esgst.settingsUrl,
			},
			{
				name: title1,
				url: Shared.esgst[`${title1.toLowerCase()}Url`],
			},
		]).insert(containerr, 'afterbegin').nodes.outer;
		if (!isPopup) {
			Shared.esgst.mainPageHeading = heading;
		}
		dm.computerSpace = Shared.common.createElements(containerr, 'beforeend', [
			{
				type: 'div',
				children: [
					{
						text: `Total: `,
						type: 'node',
					},
					{
						attributes: {
							class: 'esgst-bold',
						},
						type: 'span',
					},
					{
						attributes: {
							class: 'esgst-clickable fa fa-refresh',
							title: 'Calculate/refresh data sizes',
						},
						type: 'i',
					},
				],
			},
		]);
		dm.computerSpaceCount = dm.computerSpace.firstElementChild;
		dm.computerSpaceCount.nextElementSibling.addEventListener('click', () => getDataSizes(dm));
		section = settingsModule.createMenuSection(context, null, 1, title1);
	}
	dm.switches = {};
	dm.options = [
		{
			check: true,
			key: 'decryptedGiveaways',
			name: 'Decrypted Giveaways',
		},
		{
			check: true,
			key: 'discussions',
			name: 'Discussions',
			options: [
				{
					key: 'discussions_main',
					name: 'Main',
				},
				{
					key: 'discussions_ct',
					name: 'Comment Tracker',
				},
				{
					key: 'discussions_df',
					name: 'Discussion Filters',
				},
				{
					key: 'discussions_dh',
					name: 'Discussion Highlighter',
				},
				{
					key: 'discussions_dt',
					name: 'Discussion Tags',
				},
				{
					key: 'discussions_gdttt',
					name: 'Giveaway/Discussion/Ticket/Trade Tracker',
				},
				{
					key: 'discussions_tds',
					name: 'Thread Subscription',
				},
				{
					key: 'discussions_pm',
					name: 'Puzzle Marker',
				},
			],
		},
		{
			check: true,
			key: 'emojis',
			name: 'Emojis',
		},
		{
			check: true,
			key: 'entries',
			name: 'Entries',
		},
		{
			check: true,
			key: 'games',
			name: 'Games',
			options: [
				{
					key: 'games_main',
					name: 'Main',
				},
				{
					key: 'games_egh',
					name: 'Entered Game Highlighter',
				},
				{
					key: 'games_gt',
					name: 'Game Tags',
				},
				{
					key: 'games_itadi',
					name: 'IsThereAnyDeal Info',
				},
			],
		},
		{
			check: true,
			key: 'giveaways',
			name: 'Giveaways',
			options: [
				{
					key: 'giveaways_main',
					name: 'Main',
				},
				{
					key: 'giveaways_ct',
					name: 'Comment Tracker',
				},
				{
					key: 'giveaways_gb',
					name: 'Giveaway Bookmarks',
				},
				{
					key: 'giveaways_gdttt',
					name: 'Giveaway/Discussion/Ticket/Trade Tracker',
				},
				{
					key: 'giveaways_gf',
					name: 'Giveaway Filters',
				},
				{
					key: 'giveaways_ggl',
					name: 'Giveaway Group Loader',
				},
			],
		},
		{
			check: true,
			key: 'groups',
			name: 'Groups',
			options: [
				{
					key: 'groups_main',
					name: 'Main',
				},
				{
					key: 'groups_gpt',
					name: 'Group Tags',
				},
				{
					key: 'groups_sgg',
					name: 'Stickied Giveaway Groups',
				},
			],
		},
		{
			check: true,
			key: 'rerolls',
			name: 'Rerolls',
		},
		{
			check: true,
			key: 'savedReplies',
			name: 'Saved Replies',
		},
		{
			check: true,
			key: 'savedReplies_st',
			name: `Saved Replies (SteamTrades)`,
		},
		{
			check: true,
			key: 'settings',
			name: 'Settings',
		},
		{
			check: true,
			key: 'sgCommentHistory',
			name: 'SG Comment History',
		},
		{
			check: true,
			key: 'stickiedCountries',
			name: 'Stickied Giveaway Countries',
		},
		{
			check: true,
			key: 'templates',
			name: 'Templates',
		},
		{
			check: true,
			key: 'themes',
			name: 'Themes',
		},
		{
			check: true,
			key: 'tickets',
			name: 'Tickets',
			options: [
				{
					key: 'tickets_main',
					name: 'Main',
				},
				{
					key: 'tickets_ct',
					name: 'Comment Tracker',
				},
				{
					key: 'tickets_gdttt',
					name: 'Giveaway/Discussion/Ticket/Trade Tracker',
				},
				{
					key: 'tickets_ust',
					name: 'User Suspension Tracker',
				},
			],
		},
		{
			check: true,
			key: 'trades',
			name: 'Trades',
			options: [
				{
					key: 'trades_main',
					name: 'Main',
				},
				{
					key: 'trades_ct',
					name: 'Comment Tracker',
				},
				{
					key: 'trades_tf',
					name: 'Trade Filters',
				},
				{
					key: 'trades_gdttt',
					name: 'Giveaway/Discussion/Ticket/Trade Tracker',
				},
				{
					key: 'trades_tds',
					name: 'Thread Subscription',
				},
			],
		},
		{
			check: true,
			key: 'users',
			name: 'Users',
			options: [
				{
					key: 'users_main',
					name: 'Main',
				},
				{
					key: 'users_cdr',
					name: 'Cake Day Reminder',
				},
				{
					key: 'users_namwc',
					name: 'Not Activated/Multiple Win  Checker',
				},
				{
					key: 'users_nrf',
					name: 'Not Received Finder',
				},
				{
					key: 'users_uf',
					name: 'User Filters',
				},
				{
					key: 'users_giveaways',
					name: 'Giveaways Data',
				},
				{
					key: 'users_notes',
					name: 'User Notes',
				},
				{
					key: 'users_tags',
					name: 'User Tags',
				},
				{
					key: 'users_wbc',
					name: 'Whitelist/Blacklist Checker',
				},
			],
		},
		{
			check: true,
			key: 'winners',
			name: 'Winners',
		},
	];
	if (dm.autoBackup) {
		let dropbox, googleDrive, oneDrive;
		switch (Settings.get('autoBackup_index')) {
			case 0:
				break;
			case 1:
				dropbox = true;
				break;
			case 2:
				googleDrive = true;
				break;
			case 3:
				oneDrive = true;
				break;
		}
		// noinspection JSIgnoredPromiseFromCall
		manageData(dm, dropbox, googleDrive, oneDrive, false, async () => {
			LocalStorage.delete('isBackingUp');
			await Shared.common.setSetting('lastBackup', Date.now());
			callback();
		});
	} else {
		for (i = 0, n = dm.options.length; i < n; ++i) {
			option = dm.options[i];
			if (option.check) {
				section.lastElementChild.appendChild(getDataMenu(option, dm.switches, type));
			}
		}
		if (type === 'import' || type === 'delete') {
			if (type === 'import') {
				dm.input = Shared.common.createElements(containerr, 'beforeend', [
					{
						attributes: {
							type: 'file',
						},
						type: 'input',
					},
				]);
				new ToggleSwitch(
					containerr,
					'importAndMerge',
					false,
					'Merge',
					false,
					false,
					'Merges the current data with the backup instead of replacing it.',
					Settings.get('importAndMerge')
				);
			}
			let select = new ToggleSwitch(
				containerr,
				'exportBackup',
				false,
				(
					<fragment>
						Backup to{' '}
						<select>
							<option>Computer</option>
							<option>Dropbox</option>
							<option>Google Drive</option>
							<option>OneDrive</option>
						</select>
					</fragment>
				),
				false,
				false,
				'Backs up the current data to one of the selected places before restoring another backup.',
				Settings.get('exportBackup')
			).name.firstElementChild;
			select.selectedIndex = Settings.get('exportBackupIndex');
			select.addEventListener('change', () => {
				// noinspection JSIgnoredPromiseFromCall
				Shared.common.setSetting('exportBackupIndex', select.selectedIndex);
			});
		}
		if (type === 'export') {
			const input = new ToggleSwitch(
				containerr,
				'deleteOldBackups',
				false,
				(
					<fragment>
						Delete backups older than{' '}
						<input
							className="esgst-switch-input"
							type="number"
							value={Settings.get('deleteOldBackups_days')}
						/>{' '}
						days when backing up to the cloud.
					</fragment>
				),
				false,
				false,
				'',
				Settings.get('deleteOldBackups')
			).name.firstElementChild;
			Shared.common.observeNumChange(input, 'deleteOldBackups_days', true);
		}
		if (type === 'import' || type === 'export') {
			Shared.common.observeChange(
				new ToggleSwitch(
					containerr,
					'usePreferredGoogle',
					false,
					(
						<fragment>
							Use preferred Google account:{' '}
							<input
								className="esgst-switch-input esgst-switch-input-large"
								placeholder="example@gmail.com"
								type="text"
							/>
							<span
								className="esgst-bold esgst-clickable"
								onclick={() =>
									window.alert(Settings.get('preferredGoogle') || 'No email address defined')
								}
							>
								Reveal
							</span>
						</fragment>
					),
					false,
					false,
					`With this option enabled, you will not be prompted to select an account when restoring/backing up to Google Drive. The account associated with the email address entered here will be automatically selected if you're already logged in. For security purposes, the email address will not be visible if you re-open the menu. After that, you have to click on "Reveal" to see it.`,
					Settings.get('usePreferredGoogle')
				).name.firstElementChild,
				'preferredGoogle',
				true
			);
			Shared.common.observeChange(
				new ToggleSwitch(
					containerr,
					'usePreferredMicrosoft',
					false,
					(
						<fragment>
							Use preferred Microsoft account:{' '}
							<input
								className="esgst-switch-input esgst-switch-input-large"
								placeholder="example@outlook.com"
								type="text"
							/>
							<span
								className="esgst-bold esgst-clickable"
								onclick={() =>
									window.alert(Settings.get('preferredMicrosoft') || 'No email address defined')
								}
							>
								Reveal
							</span>
						</fragment>
					),
					false,
					false,
					`With this option enabled, you will not be prompted to select an account when restoring/backing up to OneDrive. The account associated with the email address entered here will be automatically selected if you're already logged in. For security purposes, the email address will not be visible if you re-open the menu. After that, you have to click on "Reveal" to see it.`,
					Settings.get('usePreferredMicrosoft')
				).name.firstElementChild,
				'preferredMicrosoft',
				true
			);
		}
		dm.message = Shared.common.createElements(containerr, 'beforeend', [
			{
				attributes: {
					class: 'esgst-description',
				},
				type: 'div',
			},
		]);
		dm.warning = Shared.common.createElements(containerr, 'beforeend', [
			{
				attributes: {
					class: 'esgst-description esgst-warning',
				},
				type: 'div',
			},
		]);
		group1 = Shared.common.createElements(containerr, 'beforeend', [
			{
				attributes: {
					class: 'esgst-button-group',
				},
				type: 'div',
				children: [
					{
						text: `Select:`,
						type: 'span',
					},
				],
			},
		]);
		Button.create([
			{
				color: 'white',
				icons: ['fa-square'],
				name: 'All',
				onClick: Shared.common.selectSwitches.bind(Shared.common, dm.switches, 'enable', group1),
			},
			{
				template: 'loading',
				isDisabled: true,
				name: '',
			},
		]).insert(group1, 'beforeend');
		Button.create([
			{
				color: 'white',
				icons: ['fa-square-o'],
				name: 'None',
				onClick: Shared.common.selectSwitches.bind(Shared.common, dm.switches, 'disable', group1),
			},
			{
				template: 'loading',
				isDisabled: true,
				name: '',
			},
		]).insert(group1, 'beforeend');
		Button.create([
			{
				color: 'white',
				icons: ['fa-plus-square-o'],
				name: 'Inverse',
				onClick: Shared.common.selectSwitches.bind(Shared.common, dm.switches, 'toggle', group1),
			},
			{
				template: 'loading',
				isDisabled: true,
				name: '',
			},
		]).insert(group1, 'beforeend');
		group2 = Shared.common.createElements(containerr, 'beforeend', [
			{
				attributes: {
					class: 'esgst-button-group',
				},
				type: 'div',
				children: [
					{
						text: `${title1} ${prep}:`,
						type: 'span',
					},
				],
			},
		]);
		const computerButton = Button.create([
			{
				color: 'green',
				icons: ['fa-desktop'],
				name: 'Computer',
				onClick: () => {
					return new Promise(async (resolve) => {
						if (dm.type !== 'export') {
							let result;
							switch (Settings.get('exportBackupIndex')) {
								case 0:
									result = true;
									break;
								case 1:
									result = await permissions.contains([['dropbox']]);
									break;
								case 2:
									result = await permissions.contains([['googleDrive']]);
									break;
								case 3:
									result = await permissions.contains([['oneDrive']]);
									break;
							}
							if (!result) {
								resolve();
								return;
							}
						}

						onClick(dm, false, false, false, false, () => {
							// noinspection JSIgnoredPromiseFromCall
							manageData(dm, false, false, false, true);
							resolve();
						});
					});
				},
			},
			{
				template: 'loading',
				isDisabled: true,
				name: title2,
			},
		]).insert(group2, 'beforeend');
		let dropboxButton;
		let googleDriveButton;
		let oneDriveButton;
		if (type !== 'delete') {
			dropboxButton = Button.create([
				{
					color: 'green',
					icons: ['fa-dropbox'],
					name: 'Dropbox',
					onClick: () => {
						return new Promise(async (resolve) => {
							if (!(await permissions.contains([['dropbox']]))) {
								resolve();
								return;
							}

							onClick(dm, true, false, false, false, () => {
								// noinspection JSIgnoredPromiseFromCall
								manageData(dm, false, false, false, true);
								resolve();
							});
						});
					},
				},
				{
					template: 'loading',
					isDisabled: true,
					name: title2,
				},
			]).insert(group2, 'beforeend');
			googleDriveButton = Button.create([
				{
					color: 'green',
					icons: ['fa-google'],
					name: 'Google Drive',
					onClick: () => {
						return new Promise(async (resolve) => {
							if (!(await permissions.contains([['googleDrive']]))) {
								resolve();
								return;
							}

							onClick(dm, false, true, false, false, () => {
								// noinspection JSIgnoredPromiseFromCall
								manageData(dm, false, false, false, true);
								resolve();
							});
						});
					},
				},
				{
					template: 'loading',
					isDisabled: true,
					name: title2,
				},
			]).insert(group2, 'beforeend');
			oneDriveButton = Button.create([
				{
					color: 'green',
					icons: ['fa-windows'],
					name: 'OneDrive',
					onClick: () => {
						return new Promise(async (resolve) => {
							if (!(await permissions.contains([['oneDrive']]))) {
								resolve();
								return;
							}

							onClick(dm, false, false, true, false, () => {
								// noinspection JSIgnoredPromiseFromCall
								manageData(dm, false, false, false, true);
								resolve();
							});
						});
					},
				},
				{
					template: 'loading',
					isDisabled: true,
					name: title2,
				},
			]).insert(group2, 'beforeend');
		}
		if (isPopup) {
			popup.open();
		}
		if (Settings.get(`calculate${Shared.common.capitalizeFirstLetter(type)}`)) {
			getDataSizes(dm);
		}
		if (Shared.esgst.parameters.esgst === 'backup' && Shared.esgst.parameters.autoBackupIndex) {
			switch (parseInt(Shared.esgst.parameters.autoBackupIndex)) {
				case 0:
					computerButton.onClick();
					break;
				case 1:
					dropboxButton.onClick();
					break;
				case 2:
					googleDriveButton.onClick();
					break;
				case 3:
					oneDriveButton.onClick();
					break;
			}
		}
	}
}

function loadDataCleaner(isPopup) {
	let containerr = null;
	let context = null;
	if (isPopup) {
		const popup = new Popup({
			addScrollable: 'left',
			settings: true,
			isTemp: true,
		});
		containerr = popup.description;
		context = popup.scrollable;
		popup.open();
	} else {
		containerr = Shared.esgst.sidebar.nextElementSibling;
		containerr.innerHTML = '';
		context = containerr;
		context.setAttribute('data-esgst-popup', 'true');
	}
	const heading = PageHeading.create('storage', [
		{
			name: 'ESGST',
			url: Shared.esgst.settingsUrl,
		},
		{
			name: 'Clean',
			url: Shared.esgst.cleanUrl,
		},
	]).insert(containerr, 'afterbegin').nodes.outer;
	if (!isPopup) {
		Shared.esgst.mainPageHeading = heading;
	}
	Shared.common.createElements(context, 'beforeend', [
		{
			attributes: {
				class: 'esgst-bold esgst-description esgst-red',
			},
			text: 'Make sure to backup your data before using the cleaner.',
			type: 'div',
		},
	]);
	Shared.common.observeNumChange(
		new ToggleSwitch(
			context,
			'cleanDiscussions',
			false,
			(
				<fragment>
					Discussions data older than{' '}
					<input
						className="esgst-switch-input"
						type="text"
						value={Settings.get('cleanDiscussions_days')}
					/>{' '}
					days.
				</fragment>
			),
			false,
			false,
			`Discussions data only started being date-tracked since v7.11.0, so not all old data may be cleaned.`,
			Settings.get('cleanDiscussions')
		).name.firstElementChild,
		'cleanDiscussions_days',
		true
	);
	Shared.common.observeNumChange(
		new ToggleSwitch(
			context,
			'cleanEntries',
			false,
			(
				<fragment>
					Entries data older than{' '}
					<input
						className="esgst-switch-input"
						type="text"
						value={Settings.get('cleanEntries_days')}
					/>{' '}
					days.
				</fragment>
			),
			false,
			false,
			'',
			Settings.get('cleanEntries')
		).name.firstElementChild,
		'cleanEntries_days',
		true
	);
	Shared.common.observeNumChange(
		new ToggleSwitch(
			context,
			'cleanGiveaways',
			false,
			(
				<fragment>
					Giveaways data older than{' '}
					<input
						className="esgst-switch-input"
						type="text"
						value={Settings.get('cleanGiveaways_days')}
					/>{' '}
					days.
				</fragment>
			),
			false,
			false,
			`Some giveaways data only started being date-tracked since v7.11.0, so not all old data may be cleaned.`,
			Settings.get('cleanGiveaways')
		).name.firstElementChild,
		'cleanGiveaways_days',
		true
	);
	Shared.common.observeNumChange(
		new ToggleSwitch(
			context,
			'cleanSgCommentHistory',
			false,
			(
				<fragment>
					SteamGifts comment history data older than{' '}
					<input
						className="esgst-switch-input"
						type="text"
						value={Settings.get('cleanSgCommentHistory_days')}
					/>{' '}
					days.
				</fragment>
			),
			false,
			false,
			'',
			Settings.get('cleanSgCommentHistory')
		).name.firstElementChild,
		'cleanSgCommentHistory_days',
		true
	);
	Shared.common.observeNumChange(
		new ToggleSwitch(
			context,
			'cleanTickets',
			false,
			(
				<fragment>
					Tickets data older than{' '}
					<input
						className="esgst-switch-input"
						type="text"
						value={Settings.get('cleanTickets_days')}
					/>{' '}
					days.
				</fragment>
			),
			false,
			false,
			`Tickets data only started being date-tracked since v7.11.0, so not all old data may be cleaned.`,
			Settings.get('cleanTickets')
		).name.firstElementChild,
		'cleanTickets_days',
		true
	);
	Shared.common.observeNumChange(
		new ToggleSwitch(
			context,
			'cleanTrades',
			false,
			(
				<fragment>
					Trades data older than{' '}
					<input
						className="esgst-switch-input"
						type="text"
						value={Settings.get('cleanTrades_days')}
					/>{' '}
					days.
				</fragment>
			),
			false,
			false,
			`Trades data only started being date-tracked since v7.11.0, so not all old data may be cleaned.`,
			Settings.get('cleanTrades')
		).name.firstElementChild,
		'cleanTrades_days',
		true
	);
	new ToggleSwitch(
		context,
		'cleanDuplicates',
		false,
		'Duplicate data.',
		false,
		false,
		'Cleans up any duplicate data it finds.',
		Settings.get('cleanDuplicates')
	);
	Button.create([
		{
			template: 'success',
			name: 'Clean',
			onClick: async () => {
				const dm = {};
				dm.options = [
					{
						check: true,
						key: 'decryptedGiveaways',
						name: 'Decrypted Giveaways',
					},
					{
						check: true,
						key: 'discussions',
						name: 'Discussions',
						options: [
							{
								key: 'discussions_main',
								name: 'Main',
							},
							{
								key: 'discussions_ct',
								name: 'Comment Tracker',
							},
							{
								key: 'discussions_df',
								name: 'Discussion Filters',
							},
							{
								key: 'discussions_dh',
								name: 'Discussion Highlighter',
							},
							{
								key: 'discussions_dt',
								name: 'Discussion Tags',
							},
							{
								key: 'discussions_gdttt',
								name: 'Giveaway/Discussion/Ticket/Trade Tracker',
							},
							{
								key: 'discussions_tds',
								name: 'Thread Subscription',
							},
							{
								key: 'discussions_pm',
								name: 'Puzzle Marker',
							},
						],
					},
					{
						check: true,
						key: 'emojis',
						name: 'Emojis',
					},
					{
						check: true,
						key: 'entries',
						name: 'Entries',
					},
					{
						check: true,
						key: 'games',
						name: 'Games',
						options: [
							{
								key: 'games_main',
								name: 'Main',
							},
							{
								key: 'games_egh',
								name: 'Entered Game Highlighter',
							},
							{
								key: 'games_gt',
								name: 'Game Tags',
							},
							{
								key: 'games_itadi',
								name: 'IsThereAnyDeal Info',
							},
						],
					},
					{
						check: true,
						key: 'giveaways',
						name: 'Giveaways',
						options: [
							{
								key: 'giveaways_main',
								name: 'Main',
							},
							{
								key: 'giveaways_ct',
								name: 'Comment Tracker',
							},
							{
								key: 'giveaways_gb',
								name: 'Giveaway Bookmarks',
							},
							{
								key: 'giveaways_gdttt',
								name: 'Giveaway/Discussion/Ticket/Trade Tracker',
							},
							{
								key: 'giveaways_gf',
								name: 'Giveaway Filters',
							},
							{
								key: 'giveaways_ggl',
								name: 'Giveaway Group Loader',
							},
						],
					},
					{
						check: true,
						key: 'groups',
						name: 'Groups',
						options: [
							{
								key: 'groups_main',
								name: 'Main',
							},
							{
								key: 'groups_gpt',
								name: 'Group Tags',
							},
							{
								key: 'groups_sgg',
								name: 'Stickied Giveaway Groups',
							},
						],
					},
					{
						check: true,
						key: 'rerolls',
						name: 'Rerolls',
					},
					{
						check: true,
						key: 'savedReplies',
						name: 'Saved Replies',
					},
					{
						check: true,
						key: 'savedReplies_st',
						name: `Saved Replies (SteamTrades)`,
					},
					{
						check: true,
						key: 'settings',
						name: 'Settings',
					},
					{
						check: true,
						key: 'sgCommentHistory',
						name: 'SG Comment History',
					},
					{
						check: true,
						key: 'stickiedCountries',
						name: 'Stickied Giveaway Countries',
					},
					{
						check: true,
						key: 'templates',
						name: 'Templates',
					},
					{
						check: true,
						key: 'tickets',
						name: 'Tickets',
						options: [
							{
								key: 'tickets_main',
								name: 'Main',
							},
							{
								key: 'tickets_ct',
								name: 'Comment Tracker',
							},
							{
								key: 'tickets_gdttt',
								name: 'Giveaway/Discussion/Ticket/Trade Tracker',
							},
							{
								key: 'tickets_ust',
								name: 'User Suspension Tracker',
							},
						],
					},
					{
						check: true,
						key: 'trades',
						name: 'Trades',
						options: [
							{
								key: 'trades_main',
								name: 'Main',
							},
							{
								key: 'trades_ct',
								name: 'Comment Tracker',
							},
							{
								key: 'trades_tf',
								name: 'Trade Filters',
							},
							{
								key: 'trades_gdttt',
								name: 'Giveaway/Discussion/Ticket/Trade Tracker',
							},
							{
								key: 'trades_tds',
								name: 'Thread Subscription',
							},
						],
					},
					{
						check: true,
						key: 'users',
						name: 'Users',
						options: [
							{
								key: 'users_main',
								name: 'Main',
							},
							{
								key: 'users_cdr',
								name: 'Cake Day Reminder',
							},
							{
								key: 'users_namwc',
								name: 'Not Activated/Multiple Win  Checker',
							},
							{
								key: 'users_nrf',
								name: 'Not Received Finder',
							},
							{
								key: 'users_uf',
								name: 'User Filters',
							},
							{
								key: 'users_giveaways',
								name: 'Giveaways Data',
							},
							{
								key: 'users_notes',
								name: 'User Notes',
							},
							{
								key: 'users_tags',
								name: 'User Tags',
							},
							{
								key: 'users_wbc',
								name: 'Whitelist/Blacklist Checker',
							},
						],
					},
					{
						check: true,
						key: 'winners',
						name: 'Winners',
					},
				];
				const oldSize = await manageData(dm, false, false, false, true);
				let currentTime = Date.now();
				let toSave = {};
				if (Settings.get('cleanDiscussions')) {
					let days = Settings.get('cleanDiscussions_days') * 86400000;
					toSave.discussions = JSON.parse(Shared.common.getValue('discussions', '{}'));
					for (let code in toSave.discussions) {
						if (toSave.discussions.hasOwnProperty(code)) {
							let item = toSave.discussions[code];
							if (
								item.author !== Settings.get('username') &&
								item.lastUsed &&
								currentTime - item.lastUsed > days
							) {
								delete toSave.discussions[code];
							}
						}
					}
				}
				if (Settings.get('cleanEntries')) {
					let days = Settings.get('cleanEntries_days') * 86400000;
					let items = JSON.parse(Shared.common.getValue('entries', '[]'));
					toSave.entries = [];
					items.forEach((item) => {
						if (currentTime - item.timestamp <= days) {
							toSave.entries.push(item);
						}
					});
				}
				if (Settings.get('cleanGiveaways')) {
					let days = Settings.get('cleanGiveaways_days') * 86400000;
					toSave.giveaways = JSON.parse(Shared.common.getValue('giveaways', '{}'));
					for (let code in toSave.giveaways) {
						if (toSave.giveaways.hasOwnProperty(code)) {
							let item = toSave.giveaways[code];
							if (
								item.creator !== Settings.get('username') &&
								((item.endTime && currentTime - item.endTime > days) ||
									(item.lastUsed && currentTime - item.lastUsed > days))
							) {
								delete toSave.giveaways[code];
							}
						}
					}
				}
				if (Settings.get('cleanSgCommentHistory')) {
					let days = Settings.get('cleanSgCommentHistory_days') * 86400000;
					let items = JSON.parse(Shared.common.getValue('sgCommentHistory', '[]'));
					toSave.sgCommentHistory = [];
					items.forEach((item) => {
						if (currentTime - item.timestamp <= days) {
							toSave.sgCommentHistory.push(item);
						}
					});
				}
				if (Settings.get('cleanTickets')) {
					let days = Settings.get('cleanTickets_days') * 86400000;
					toSave.tickets = JSON.parse(Shared.common.getValue('tickets', '{}'));
					for (let code in toSave.tickets) {
						if (toSave.tickets.hasOwnProperty(code)) {
							let item = toSave.tickets[code];
							if (
								item.author !== Settings.get('username') &&
								item.lastUsed &&
								currentTime - item.lastUsed > days
							) {
								delete toSave.tickets[code];
							}
						}
					}
				}
				if (Settings.get('cleanTrades')) {
					let days = Settings.get('cleanTrades_days') * 86400000;
					toSave.trades = JSON.parse(Shared.common.getValue('trades', '{}'));
					for (let code in toSave.trades) {
						if (toSave.trades.hasOwnProperty(code)) {
							let item = toSave.trades[code];
							if (
								item.author !== Settings.get('username') &&
								item.lastUsed &&
								currentTime - item.lastUsed > days
							) {
								delete toSave.trades[code];
							}
						}
					}
				}
				if (Settings.get('cleanDuplicates')) {
					toSave.users = JSON.parse(Shared.common.getValue('users', `{"steamIds":{},"users":{}}`));
					for (let id in toSave.users.users) {
						if (toSave.users.users.hasOwnProperty(id)) {
							let giveaways = toSave.users.users[id].giveaways;
							if (giveaways) {
								['sent', 'won'].forEach((mainType) => {
									['apps', 'subs'].forEach((type) => {
										for (let code in giveaways[mainType][type]) {
											if (giveaways[mainType][type].hasOwnProperty(code)) {
												giveaways[mainType][type][code] = Array.from(
													/** @type {ArrayLike} */ new Set(giveaways[mainType][type][code])
												);
											}
										}
									});
								});
							}
						}
					}
				}
				for (let key in toSave) {
					if (toSave.hasOwnProperty(key)) {
						toSave[key] = JSON.stringify(toSave[key]);
					}
				}
				await Shared.common.setValues(toSave);
				const newSize = await manageData(dm, false, false, false, true);
				const successPopup = new Popup({
					icon: 'fa-check',
					title: (
						<fragment>
							Success! The selected data was cleaned.
							<br />
							<br />
							Size before cleaning:{' '}
							<span className="esgst-bold">{Shared.common.convertBytes(oldSize)}</span>
							<br />
							Size after cleaning:{' '}
							<span className="esgst-bold">{Shared.common.convertBytes(newSize)}</span>
							<br />
							<br />
							{`${Math.round((100 - (newSize / oldSize) * 100) * 100) / 100}% reduction`}
						</fragment>
					),
				});
				successPopup.open();
			},
		},
		{
			template: 'loading',
			isDisabled: true,
			name: 'Cleaning...',
		},
	]).insert(context, 'beforeend');
}

async function manageData(dm, dropbox, googleDrive, oneDrive, space, callback) {
	let data = {};
	let totalSize = 0;
	let mainUsernameFound;

	if (!space) {
		if (dm.type === 'import') {
			const stringified = [];

			for (const key of Object.keys(dm.data)) {
				if (Utils.is(dm.data[key], 'object') || Array.isArray(dm.data[key])) {
					dm.data[key] = JSON.stringify(dm.data[key]);

					stringified.push(key);
				}
			}

			await persistentStorage.upgrade(dm.data, dm.data.v, true);

			for (const key of stringified) {
				dm.data[key] = JSON.parse(dm.data[key]);
			}

			let notifiedMessages = JSON.parse(
				Shared.common.getValue('notifiedMessages', '{ "lastCheck": 0, "ids": [] }')
			);
			notifiedMessages.ids = Array.from(
				new Set([...notifiedMessages.ids, ...(dm.data.notifiedMessages.ids || [])])
			);
			await Shared.common.setValue('notifiedMessages', JSON.stringify(notifiedMessages));
		} else if (dm.type === 'export') {
			data.notifiedMessages = Shared.esgst.storage.notifiedMessages;
			data.v = Shared.esgst.storage.v;
		}
	}

	for (let i = 0, n = dm.options.length; i < n; i++) {
		let option = dm.options[i];
		let optionKey = option.key;
		if (!option.check || (!dm.autoBackup && !space && !Settings.get(`${dm.type}_${optionKey}`))) {
			continue;
		}
		let values = null;
		let mainFound, mergedData, sizes;
		// noinspection FallThroughInSwitchStatementJS
		switch (optionKey) {
			case 'decryptedGiveaways':
			case 'settings':
				data[optionKey] = JSON.parse(Shared.common.getValue(optionKey, '{}'));
				if (!space) {
					if (dm.import) {
						let newData = dm.data[optionKey];
						if (newData) {
							if (Settings.get('importAndMerge')) {
								mergedData = data[optionKey];
								for (let newDataKey in newData) {
									if (newData.hasOwnProperty(newDataKey)) {
										mergedData[newDataKey] = newData[newDataKey];
									}
								}
								await Shared.common.setValue(optionKey, JSON.stringify(mergedData));
							} else {
								await Shared.common.setValue(optionKey, JSON.stringify(newData));
							}
						}
					} else if (dm.delete) {
						await Shared.common.delValue(optionKey);
					}
				}
				if (!dm.autoBackup) {
					let size = `{"${optionKey}":${Shared.common.getValue(optionKey, '{}')}}`.length;
					totalSize += size;
					if (dm.switches) {
						dm.switches[optionKey].size.textContent = Shared.common.convertBytes(size);
					}
				}
				break;
			case 'discussions':
				if (!values) {
					values = {
						main: ['lastUsed'],
						ct: ['count', 'readComments'],
						df: ['hidden'],
						dh: ['highlighted'],
						dt: ['tags'],
						gdttt: ['visited'],
						tds: ['name', 'subscribed'],
						pm: ['status'],
					};
				}
			case 'giveaways':
				if (!values) {
					values = {
						main: [
							'code',
							'comments',
							'copies',
							'creator',
							'endTime',
							'entries',
							'gameId',
							'gameName',
							'gameSteamId',
							'gameType',
							'group',
							'inviteOnly',
							'lastUsed',
							'level',
							'numWinners',
							'points',
							'regionRestricted',
							'started',
							'startTime',
							'whitelist',
							'winners',
							'v',
						],
						ct: ['count', 'readComments'],
						gb: ['bookmarked'],
						gdttt: ['visited'],
						gf: ['hidden'],
						ggl: ['groups'],
					};
				}
			case 'tickets':
				if (!values) {
					values = {
						main: ['lastUsed'],
						ct: ['count', 'readComments'],
						gdttt: ['visited'],
						ust: ['sent'],
					};
				}
			case 'trades':
				if (!values) {
					values = {
						main: ['lastUsed'],
						ct: ['count', 'readComments'],
						tf: ['hidden'],
						gdttt: ['visited'],
						tds: ['name', 'subscribed'],
					};
				}
				data[optionKey] = {};
				mergedData = JSON.parse(Shared.common.getValue(optionKey, '{}'));
				sizes = {
					ct: 0,
					df: 0,
					dh: 0,
					dt: 0,
					gb: 0,
					gdttt: 0,
					tds: 0,
					gf: 0,
					tf: 0,
					ggl: 0,
					main: 0,
					pm: 0,
					total: 0,
					ust: 0,
				};
				mainFound = false;
				for (let mergedDataKey in mergedData) {
					if (mergedData.hasOwnProperty(mergedDataKey)) {
						let newData = {};
						let toDelete = 0;
						let foundSub = 0;
						let deletedSub = 0;
						let found = null;
						let toExport = false;
						for (let value in values) {
							if (values.hasOwnProperty(value)) {
								if (Settings.get(`${dm.type}_${optionKey}_${value}`)) {
									toDelete += 1;
								}
								for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
									let valueKey = values[value][j];
									let mergedDataValue = mergedData[mergedDataKey][valueKey];
									if (typeof mergedDataValue !== 'undefined') {
										if (value !== 'main') {
											foundSub += 1;
										}
										if (
											dm.autoBackup ||
											Settings.get(`${dm.type}_${optionKey}_${value}`) ||
											value === 'main'
										) {
											newData[valueKey] = mergedDataValue;
											if (value !== 'main') {
												toExport = true;
											}
										}
										let size = `"${valueKey}":${JSON.stringify(mergedDataValue)},`.length;
										sizes[value] += size;
										sizes.total += size;
										found = value;
										if (
											!space &&
											dm.delete &&
											Settings.get(`${dm.type}_${optionKey}_${value}`) &&
											value !== 'main'
										) {
											deletedSub += 1;
											delete mergedData[mergedDataKey][valueKey];
										}
									}
								}
							}
						}
						if (found) {
							sizes[found] -= 1;
							sizes.total -= 1;
						}
						if (dm.autoBackup || toExport || Settings.get(`${dm.type}_${optionKey}_main`)) {
							data[optionKey][mergedDataKey] = newData;
							mainFound = true;
						}
						let size = `"${mergedDataKey}":{},`.length;
						sizes.main += size;
						sizes.total += size;
						if (
							!space &&
							dm.delete &&
							((Settings.get(`${dm.type}_${optionKey}_main`) && foundSub === deletedSub) ||
								toDelete === Object.keys(values).length)
						) {
							delete mergedData[mergedDataKey];
						}
					}
				}
				if (!space) {
					if (dm.import) {
						let newData = dm.data[optionKey];
						if (newData) {
							for (let newDataKey in newData) {
								if (newData.hasOwnProperty(newDataKey)) {
									if (!mergedData[newDataKey]) {
										mergedData[newDataKey] = {};
									}
									for (let value in values) {
										if (values.hasOwnProperty(value)) {
											if (Settings.get(`${dm.type}_${optionKey}_${value}`)) {
												if (Settings.get('importAndMerge')) {
													for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
														let valueKey = values[value][j];
														switch (valueKey) {
															case 'tags':
																if (mergedData[newDataKey].tags) {
																	let tags = newData[newDataKey].tags;
																	for (let k = 0, numTags = tags.length; k < numTags; ++k) {
																		let tag = tags[k];
																		if (mergedData[newDataKey].tags.indexOf(tag) < 0) {
																			mergedData[newDataKey].tags.push(tag);
																		}
																	}
																} else {
																	mergedData[newDataKey].tags = newData[newDataKey].tags;
																}
																break;
															case 'readComments':
																if (mergedData[newDataKey].readComments) {
																	for (let id in mergedData[newDataKey].readComments) {
																		if (mergedData[newDataKey].readComments.hasOwnProperty(id)) {
																			if (
																				newData[newDataKey].readComments[id] >
																				mergedData[newDataKey].readComments[id]
																			) {
																				mergedData[newDataKey].readComments[id] =
																					newData[newDataKey].readComments[id];
																			}
																		}
																	}
																} else {
																	mergedData[newDataKey].readComments =
																		newData[newDataKey].readComments;
																}
																break;
															default:
																mergedData[newDataKey][valueKey] = newData[newDataKey][valueKey];
																break;
														}
													}
												} else {
													for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
														let valueKey = values[value][j];
														mergedData[newDataKey][valueKey] = newData[newDataKey][valueKey];
													}
												}
											}
										}
									}
								}
							}
							await Shared.common.setValue(optionKey, JSON.stringify(mergedData));
						}
					} else if (dm.delete) {
						await Shared.common.setValue(optionKey, JSON.stringify(mergedData));
					}
				}
				if (mainFound) {
					sizes.main -= 1;
					sizes.total -= 1;
				}
				if (!dm.autoBackup) {
					let size = `{"${optionKey}":{}}`.length;
					sizes.main += size;
					sizes.total += size;
					if (dm.switches) {
						for (let value in values) {
							if (values.hasOwnProperty(value)) {
								if (dm.switches[`${optionKey}_${value}`]) {
									dm.switches[
										`${optionKey}_${value}`
									].size.textContent = Shared.common.convertBytes(sizes[value]);
								}
							}
						}
						dm.switches[optionKey].size.textContent = Shared.common.convertBytes(sizes.total);
					}
					totalSize += sizes.total;
				}
				break;
			case 'themes':
				data.themes = {};
				for (const themeId of Object.keys(Shared.esgst.features.themes.features)) {
					const theme = Shared.common.getValue(themeId);
					if (theme) {
						data.themes[themeId] = theme;
					}
				}
				if (!space) {
					if (dm.import) {
						let newData = dm.data.themes;
						if (newData) {
							if (Settings.get('importAndMerge')) {
								for (const themeId in newData) {
									data.themes[themeId] = newData[themeId];
								}
							} else {
								data.themes = newData;
							}
							for (const themeId in data.themes) {
								await Shared.common.setValue(themeId, data.themes[themeId]);
							}
						}
					} else if (dm.delete) {
						for (const themeId in data.themes) {
							await Shared.common.delValue(themeId);
						}
						data.themes = {};
					}
				}
				if (!dm.autoBackup) {
					let size = JSON.stringify(data.themes).length;
					totalSize += size;
					if (dm.switches) {
						dm.switches[optionKey].size.textContent = Shared.common.convertBytes(size);
					}
				}
				break;
			case 'emojis':
				data.emojis = JSON.parse(Shared.common.getValue('emojis', '[]'));
				if (!space) {
					if (dm.import) {
						let newData = JSON.stringify(dm.data.emojis);
						if (newData) {
							if (Settings.get('importAndMerge')) {
								await Shared.common.setValue(
									'emojis',
									JSON.stringify(
										Array.from(
											new Set(data.emojis.concat(JSON.parse(Shared.common.fixEmojis(newData))))
										)
									)
								);
							} else {
								await Shared.common.setValue('emojis', Shared.common.fixEmojis(newData));
							}
						}
					} else if (dm.delete) {
						await Shared.common.delValue('emojis');
					}
				}
				if (!dm.autoBackup) {
					let size = `{"${optionKey}":${Shared.common.getValue(optionKey, `"[]"`)}}`.length;
					totalSize += size;
					if (dm.switches) {
						dm.switches[optionKey].size.textContent = Shared.common.convertBytes(size);
					}
				}
				break;
			case 'entries':
			case 'templates':
			case 'savedReplies':
			case 'savedReplies_st':
				data[optionKey] = JSON.parse(Shared.common.getValue(optionKey, '[]'));
				if (!space) {
					if (dm.import) {
						let newData = dm.data[optionKey];
						if (newData) {
							if (Settings.get('importAndMerge')) {
								let dataKey = optionKey === 'entries' ? 'timestamp' : 'name';
								mergedData = data[optionKey];
								for (let j = 0, numNew = newData.length; j < numNew; ++j) {
									let newDataValue = newData[j];
									let k, numMerged;
									for (
										k = 0, numMerged = mergedData.length;
										k < numMerged && mergedData[k][dataKey] !== newDataValue[dataKey];
										++k
									) {}
									if (k < numMerged) {
										mergedData[k] = newDataValue;
									} else {
										mergedData.push(newDataValue);
									}
								}
								if (optionKey === 'entries') {
									mergedData = Utils.sortArray(mergedData, false, 'timestamp');
								}
								await Shared.common.setValue(optionKey, JSON.stringify(mergedData));
							} else {
								await Shared.common.setValue(optionKey, JSON.stringify(newData));
							}
						}
					} else if (dm.delete) {
						await Shared.common.delValue(optionKey);
					}
				}
				if (!dm.autoBackup) {
					let size = `{"${optionKey}":${Shared.common.getValue(optionKey, '[]')}}`.length;
					totalSize += size;
					if (dm.switches) {
						dm.switches[optionKey].size.textContent = Shared.common.convertBytes(size);
					}
				}
				break;
			case 'games':
				values = {
					main: [
						'apps',
						'packages',
						'reducedCV',
						'noCV',
						'hidden',
						'ignored',
						'owned',
						'wishlisted',
						'followed',
						'sgId',
					],
					gt: ['tags'],
					egh: ['entered'],
					itadi: ['itadi'],
				};
				data.games = {
					apps: {},
					subs: {},
				};
				mergedData = JSON.parse(Shared.common.getValue('games', `{"apps":{},"subs":{}}`));
				sizes = {
					egh: 0,
					gt: 0,
					itadi: 0,
					main: 0,
					total: 0,
				};
				mainFound = false;
				for (let mergedDataKey in mergedData.apps) {
					if (mergedData.apps.hasOwnProperty(mergedDataKey)) {
						let mergedDataValue = mergedData.apps[mergedDataKey];
						let newData = {};
						let toDelete = 0;
						let foundSub = 0;
						let deletedSub = 0;
						let found = null;
						let toExport = false;
						for (let value in values) {
							if (values.hasOwnProperty(value)) {
								if (Settings.get(`${dm.type}_games_${value}`)) {
									toDelete += 1;
								}
								for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
									let valueKey = values[value][j];
									let newDataValue = mergedDataValue[valueKey];
									if (typeof newDataValue !== 'undefined') {
										if (value !== 'main') {
											foundSub += 1;
										}
										if (
											dm.autoBackup ||
											Settings.get(`${dm.type}_games_${value}`) ||
											value === 'main'
										) {
											newData[valueKey] = newDataValue;
											if (value !== 'main') {
												toExport = true;
											}
										}
										let size = `"${valueKey}":${JSON.stringify(newDataValue)},`.length;
										sizes[value] += size;
										sizes.total += size;
										found = value;
										if (
											!space &&
											dm.delete &&
											Settings.get(`${dm.type}_games_${value}`) &&
											value !== 'main'
										) {
											deletedSub += 1;
											delete mergedDataValue[valueKey];
										}
									}
								}
							}
						}
						if (found) {
							sizes[found] -= 1;
							sizes.total -= 1;
						}
						if (dm.autoBackup || toExport || Settings.get(`${dm.type}_${optionKey}_main`)) {
							data.games.apps[mergedDataKey] = newData;
							mainFound = true;
						}
						let size = `"${mergedDataKey}":{},`.length;
						sizes.main += size;
						sizes.total += size;
						if (
							!space &&
							dm.delete &&
							((Settings.get(`${dm.type}_${optionKey}_main`) && foundSub === deletedSub) ||
								toDelete === Object.keys(values).length)
						) {
							delete mergedData.apps[mergedDataKey];
						}
					}
				}
				if (mainFound) {
					sizes.main -= 1;
					sizes.total -= 1;
				}
				mainFound = false;
				for (let mergedDataKey in mergedData.subs) {
					if (mergedData.subs.hasOwnProperty(mergedDataKey)) {
						let mergedDataValue = mergedData.subs[mergedDataKey];
						let newData = {};
						let toDelete = 0;
						let foundSub = 0;
						let deletedSub = 0;
						let found = null;
						let toExport = false;
						for (let value in values) {
							if (values.hasOwnProperty(value)) {
								if (Settings.get(`${dm.type}_games_${value}`)) {
									toDelete += 1;
								}
								for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
									let valueKey = values[value][j];
									let newDataValue = mergedDataValue[valueKey];
									if (typeof newDataValue !== 'undefined') {
										if (value !== 'main') {
											foundSub += 1;
										}
										if (
											dm.autoBackup ||
											Settings.get(`${dm.type}_games_${value}`) ||
											value === 'main'
										) {
											newData[valueKey] = newDataValue;
											if (value !== 'main') {
												toExport = true;
											}
										}
										let size = `"${valueKey}":${JSON.stringify(newDataValue)},`.length;
										sizes[value] += size;
										sizes.total += size;
										found = value;
										if (
											!space &&
											dm.delete &&
											Settings.get(`${dm.type}_games_${value}`) &&
											value !== 'main'
										) {
											deletedSub += 1;
											delete mergedDataValue[valueKey];
										}
									}
								}
							}
						}
						if (found) {
							sizes[found] -= 1;
							sizes.total -= 1;
						}
						if (dm.autoBackup || toExport || Settings.get(`${dm.type}_${optionKey}_main`)) {
							data.games.subs[mergedDataKey] = newData;
							mainFound = true;
						}
						let size = `"${mergedDataKey}":{},`.length;
						sizes.main += size;
						sizes.total += size;
						if (
							!space &&
							dm.delete &&
							((Settings.get(`${dm.type}_${optionKey}_main`) && foundSub === deletedSub) ||
								toDelete === Object.keys(values).length)
						) {
							delete mergedData.subs[mergedDataKey];
						}
					}
				}
				if (mainFound) {
					sizes.main -= 1;
					sizes.total -= 1;
				}
				if (!space) {
					if (dm.import) {
						let newData = dm.data.games;
						if (newData) {
							for (let newDataKey in newData.apps) {
								if (newData.apps.hasOwnProperty(newDataKey)) {
									let newDataValue = newData.apps[newDataKey];
									if (!mergedData.apps[newDataKey]) {
										mergedData.apps[newDataKey] = {};
									}
									let mergedDataValue = mergedData.apps[newDataKey];
									for (let value in values) {
										if (Settings.get(`${dm.type}_games_${value}`)) {
											for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
												let valueKey = values[value][j];
												if (typeof newDataValue[valueKey] !== 'undefined') {
													if (Settings.get('importAndMerge')) {
														switch (valueKey) {
															case 'entered':
																mergedDataValue.entered = true;
																break;
															case 'itadi':
																if (mergedDataValue.itadi) {
																	if (
																		newDataValue.itadi.lastCheck > mergedDataValue.itadi.lastCheck
																	) {
																		mergedDataValue.itadi = newDataValue.itadi;
																	}
																} else {
																	mergedDataValue.itadi = newDataValue.itadi;
																}
																break;
															case 'tags':
																if (mergedDataValue.tags) {
																	let tags = newDataValue.tags;
																	for (let k = 0, numTags = tags.length; k < numTags; ++k) {
																		let tag = tags[k];
																		if (mergedDataValue.tags.indexOf(tag) < 0) {
																			mergedDataValue.tags.push(tag);
																		}
																	}
																} else {
																	mergedDataValue.tags = newDataValue.tags;
																}
																break;
															default:
																mergedDataValue[valueKey] = newDataValue[valueKey];
																break;
														}
													} else {
														mergedDataValue[valueKey] = newDataValue[valueKey];
													}
												}
											}
										}
									}
								}
							}
							for (let newDataKey in newData.subs) {
								if (newData.subs.hasOwnProperty(newDataKey)) {
									let newDataValue = newData.subs[newDataKey];
									if (!mergedData.subs[newDataKey]) {
										mergedData.subs[newDataKey] = {};
									}
									let mergedDataValue = mergedData.subs[newDataKey];
									for (let value in values) {
										if (Settings.get(`${dm.type}_games_${value}`)) {
											for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
												let valueKey = values[value][j];
												if (typeof newDataValue[valueKey] !== 'undefined') {
													if (Settings.get('importAndMerge')) {
														switch (valueKey) {
															case 'entered':
																mergedDataValue.entered = true;
																break;
															case 'itadi':
																if (mergedDataValue.itadi) {
																	if (
																		newDataValue.itadi.lastCheck > mergedDataValue.itadi.lastCheck
																	) {
																		mergedDataValue.itadi = newDataValue.itadi;
																	}
																} else {
																	mergedDataValue.itadi = newDataValue.itadi;
																}
																break;
															case 'tags':
																if (mergedDataValue.tags) {
																	let tags = newDataValue.tags;
																	for (let k = 0, numTags = tags.length; k < numTags; ++k) {
																		let tag = tags[k];
																		if (mergedDataValue.tags.indexOf(tag) < 0) {
																			mergedDataValue.tags.push(tag);
																		}
																	}
																} else {
																	mergedDataValue.tags = newDataValue.tags;
																}
																break;
															default:
																mergedDataValue[valueKey] = newDataValue[valueKey];
																break;
														}
													} else {
														mergedDataValue[valueKey] = newDataValue[valueKey];
													}
												}
											}
										}
									}
								}
							}
							await Shared.common.setValue('games', JSON.stringify(mergedData));
						}
					} else if (dm.delete) {
						await Shared.common.setValue('games', JSON.stringify(mergedData));
					}
				}
				if (!dm.autoBackup) {
					let size = `{"${optionKey}":{"apps":{},"subs":{}}}`.length;
					sizes.main += size;
					sizes.total += size;
					if (dm.switches) {
						for (let value in values) {
							if (values.hasOwnProperty(value)) {
								if (dm.switches[`${optionKey}_${value}`]) {
									dm.switches[
										`${optionKey}_${value}`
									].size.textContent = Shared.common.convertBytes(sizes[value]);
								}
							}
						}
						dm.switches[optionKey].size.textContent = Shared.common.convertBytes(sizes.total);
					}
					totalSize += sizes.total;
				}
				break;
			case 'groups':
				values = {
					main: ['avatar', 'code', 'member', 'name', 'steamId'],
					gpt: ['tags'],
					sgg: ['stickied'],
				};
				mergedData = JSON.parse(Shared.common.getValue(optionKey, '[]'));
				if (!Array.isArray(mergedData)) {
					let temp = [];
					for (let key in mergedData) {
						if (mergedData.hasOwnProperty(key)) {
							temp.push(mergedData[key]);
						}
					}
					mergedData = temp;
				}
				data[optionKey] = [];
				sizes = {
					main: 0,
					gpt: 0,
					sgg: 0,
					total: 0,
				};
				mainFound = false;
				for (let j = mergedData.length - 1; j > -1; --j) {
					let newData = {};
					let toDelete = 0;
					let foundSub = 0;
					let deletedSub = 0;
					let found = null;
					let toExport = false;
					for (let value in values) {
						if (values.hasOwnProperty(value)) {
							if (Settings.get(`${dm.type}_${optionKey}_${value}`)) {
								toDelete += 1;
							}
							for (let k = 0, numValues = values[value].length; k < numValues; ++k) {
								let valueKey = values[value][k];
								if (mergedData[j]) {
									let mergedDataValue = mergedData[j][valueKey];
									if (typeof mergedDataValue !== 'undefined') {
										if (value !== 'main') {
											foundSub += 1;
										}
										if (
											dm.autoBackup ||
											Settings.get(`${dm.type}_${optionKey}_${value}`) ||
											value === 'main'
										) {
											newData[valueKey] = mergedDataValue;
											if (value !== 'main') {
												toExport = true;
											}
										}
										let size = `"${valueKey}":${JSON.stringify(mergedDataValue)},`.length;
										sizes[value] += size;
										sizes.total += size;
										found = value;
										if (
											!space &&
											dm.delete &&
											Settings.get(`${dm.type}_${optionKey}_${value}`) &&
											value !== 'main'
										) {
											deletedSub += 1;
											delete mergedData[j][valueKey];
										}
									}
								}
							}
						}
					}
					if (found) {
						sizes[found] -= 1;
						sizes.total -= 1;
					}
					if (dm.autoBackup || toExport || Settings.get(`${dm.type}_${optionKey}_main`)) {
						data[optionKey].push(newData);
						mainFound = true;
					}
					let size = `{},`.length;
					sizes.main += size;
					sizes.total += size;
					if (
						!space &&
						dm.delete &&
						((Settings.get(`${dm.type}_${optionKey}_main`) && foundSub === deletedSub) ||
							toDelete === Object.keys(values).length)
					) {
						mergedData.pop();
					}
				}
				if (mainFound) {
					sizes.main -= 1;
					sizes.total -= 1;
				}
				if (!space) {
					if (dm.import) {
						let newData = dm.data[optionKey];
						if (!Array.isArray(newData)) {
							let temp = [];
							for (let key in newData) {
								if (newData.hasOwnProperty(key)) {
									temp.push(newData[key]);
								}
							}
							newData = temp;
						}
						if (newData) {
							for (let j = newData.length - 1; j > -1; --j) {
								let code = newData[j].code;
								let k, mergedDataValue;
								for (k = mergedData.length - 1; k > -1 && mergedData[k].code !== code; --k) {}
								if (k > -1) {
									mergedDataValue = mergedData[k];
								} else {
									mergedDataValue = {};
									mergedData.push(mergedDataValue);
								}
								for (let value in values) {
									if (values.hasOwnProperty(value)) {
										if (Settings.get(`${dm.type}_${optionKey}_${value}`)) {
											for (let k = 0, numValues = values[value].length; k < numValues; ++k) {
												let valueKey = values[value][k];
												switch (valueKey) {
													case 'tags':
														if (mergedDataValue.tags) {
															let tags = newData[j].tags;
															for (let k = 0, numTags = tags.length; k < numTags; ++k) {
																let tag = tags[k];
																if (mergedDataValue.tags.indexOf(tag) < 0) {
																	mergedDataValue.tags.push(tag);
																}
															}
														} else {
															mergedDataValue.tags = newData[j].tags;
														}
														break;
													default:
														mergedDataValue[valueKey] = newData[j][valueKey];
														break;
												}
											}
										}
									}
								}
							}
							await Shared.common.setValue(optionKey, JSON.stringify(mergedData));
						}
					} else if (dm.delete) {
						await Shared.common.setValue(optionKey, JSON.stringify(mergedData));
					}
				}
				if (!dm.autoBackup) {
					let size = `{"${optionKey}":[]}`.length;
					sizes.main += size;
					sizes.total += size;
					if (dm.switches) {
						for (let value in values) {
							if (values.hasOwnProperty(value)) {
								if (dm.switches[`${optionKey}_${value}`]) {
									dm.switches[
										`${optionKey}_${value}`
									].size.textContent = Shared.common.convertBytes(sizes[value]);
								}
							}
						}
						dm.switches[optionKey].size.textContent = Shared.common.convertBytes(sizes.total);
					}
					totalSize += sizes.total;
				}
				break;
			case 'rerolls':
			case 'stickiedCountries':
				data[optionKey] = JSON.parse(Shared.common.getValue(optionKey, '[]'));
				if (!space) {
					if (dm.import) {
						let newData = dm.data[optionKey];
						if (newData) {
							if (Settings.get('importAndMerge')) {
								mergedData = data[optionKey];
								for (let j = 0, numNew = newData.length; j < numNew; ++j) {
									let newDataValue = newData[j];
									if (mergedData.indexOf(newDataValue) < 0) {
										mergedData.push(newDataValue);
									}
								}
								await Shared.common.setValue(optionKey, JSON.stringify(mergedData));
							} else {
								await Shared.common.setValue(optionKey, JSON.stringify(newData));
							}
						}
					} else if (dm.delete) {
						await Shared.common.delValue(optionKey);
					}
				}
				if (!dm.autoBackup) {
					let size = `{"${optionKey}":${Shared.common.getValue(optionKey, '[]')}}`.length;
					totalSize += size;
					if (dm.switches) {
						dm.switches[optionKey].size.textContent = Shared.common.convertBytes(size);
					}
				}
				break;
			case 'sgCommentHistory':
				data[optionKey] = JSON.parse(Shared.common.getValue(optionKey, '[]'));
				if (!space) {
					if (dm.import) {
						let newData = dm.data[optionKey];
						if (newData) {
							if (Settings.get('importAndMerge')) {
								mergedData = [];
								let oldData = data[optionKey];
								let j = 0;
								let k = 0;
								let numNew = newData.length;
								let numOld = oldData.length;
								while (j < numOld && k < numNew) {
									let oldDataValue = oldData[j];
									let newDataValue = newData[k];
									if (oldDataValue.timestamp > newDataValue.timestamp) {
										mergedData.push(oldDataValue);
										j += 1;
									} else {
										let l;
										// noinspection JSUnusedAssignment
										for (l = 0; l < numOld && oldData[l].id !== newDataValue.id; ++l) {}
										// noinspection JSUnusedAssignment
										if (l >= numOld) {
											mergedData.push(newDataValue);
										}
										k += 1;
									}
								}
								while (j < numOld) {
									mergedData.push(oldData[j]);
									j += 1;
								}
								while (k < numNew) {
									let newDataValue = newData[k];
									let l;
									// noinspection JSUnusedAssignment
									for (l = 0; l < numOld && oldData[l].id !== newDataValue.id; ++l) {}
									// noinspection JSUnusedAssignment
									if (l >= numOld) {
										mergedData.push(newDataValue);
									}
									k += 1;
								}
								await Shared.common.setValue(optionKey, JSON.stringify(mergedData));
							} else {
								await Shared.common.setValue(optionKey, JSON.stringify(newData));
							}
						}
					} else if (dm.delete) {
						await Shared.common.delValue(optionKey);
					}
				}
				if (!dm.autoBackup) {
					let size = `{"${optionKey}":${Shared.common.getValue(optionKey, '[]')}}`.length;
					totalSize += size;
					if (dm.switches) {
						dm.switches[optionKey].size.textContent = Shared.common.convertBytes(size);
					}
				}
				break;
			case 'users':
				values = {
					main: ['whitelisted', 'whitelistedDate', 'blacklisted', 'blacklistedDate', 'steamFriend'],
					cdr: ['cdr', 'registrationDate'],
					giveaways: ['giveaways'],
					namwc: ['namwc'],
					notes: ['notes'],
					nrf: ['nrf'],
					tags: ['tags'],
					uf: ['uf'],
					wbc: ['wbc'],
				};
				data.users = {
					steamIds: {},
					users: {},
				};
				mergedData = JSON.parse(Shared.common.getValue('users', `{"steamIds":{},"users":{}}`));
				sizes = {
					cdr: 0,
					giveaways: 0,
					namwc: 0,
					notes: 0,
					nrf: 0,
					main: 0,
					tags: 0,
					total: 0,
					uf: 0,
					wbc: 0,
				};
				mainFound = false;
				mainUsernameFound = false;
				for (let mergedDataKey in mergedData.users) {
					if (mergedData.users.hasOwnProperty(mergedDataKey)) {
						let mergedDataValue = mergedData.users[mergedDataKey];
						let newData = {};
						let toDelete = 0;
						let foundSub = 0;
						let deletedSub = 0;
						let found = null;
						let toExport = false;
						for (let value in values) {
							if (values.hasOwnProperty(value)) {
								if (Settings.get(`${dm.type}_users_${value}`)) {
									toDelete += 1;
								}
								for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
									let valueKey = values[value][j];
									if (typeof mergedDataValue[valueKey] !== 'undefined') {
										if (value !== 'main') {
											foundSub += 1;
										}
										if (
											dm.autoBackup ||
											Settings.get(`${dm.type}_users_${value}`) ||
											value === 'main'
										) {
											newData[valueKey] = mergedDataValue[valueKey];
											if (value !== 'main') {
												toExport = true;
											}
										}
										let size = `"${valueKey}":${JSON.stringify(mergedDataValue[valueKey])},`.length;
										sizes[value] += size;
										sizes.total += size;
										found = value;
										if (
											!space &&
											dm.delete &&
											Settings.get(`${dm.type}_users_${value}`) &&
											value !== 'main'
										) {
											deletedSub += 1;
											delete mergedDataValue[valueKey];
										}
									}
								}
							}
						}
						if (found) {
							sizes[found] -= 1;
							sizes.total -= 1;
						}
						let id = mergedDataValue.id;
						let username = mergedDataValue.username;
						let size = 0;
						if (id) {
							size += `"id":"${id}",`.length;
						}
						if (username) {
							size += `"username":"${username}","${username}":"${mergedDataKey}",`.length;
						}
						if (dm.autoBackup || toExport || Settings.get(`${dm.type}_${optionKey}_main`)) {
							if (id) {
								newData.id = id;
							}
							if (username) {
								newData.username = username;
								data.users.steamIds[username] = mergedDataKey;
								mainUsernameFound = true;
							}
							data.users.users[mergedDataKey] = newData;
							mainFound = true;
						}
						size += `"${mergedDataKey}":{},`.length;
						sizes.main += size;
						sizes.total += size;
						if (
							!space &&
							dm.delete &&
							((Settings.get(`${dm.type}_${optionKey}_main`) && foundSub === deletedSub) ||
								toDelete === Object.keys(values).length)
						) {
							delete mergedData.steamIds[mergedDataValue.username];
							delete mergedData.users[mergedDataKey];
						}
					}
				}
				if (mainFound) {
					sizes.main -= 1;
					sizes.total -= 1;
				}
				if (mainUsernameFound) {
					sizes.main -= 1;
					sizes.total -= 1;
				}
				if (!space) {
					if (dm.import) {
						let newData = dm.data.users;
						if (newData) {
							for (let newDataKey in newData.users) {
								if (newData.users.hasOwnProperty(newDataKey)) {
									let newDataValue = newData.users[newDataKey];
									if (!mergedData.users[newDataKey]) {
										mergedData.users[newDataKey] = {
											id: newDataValue.id,
											username: newDataValue.username,
										};
										mergedData.steamIds[newDataValue.username] = newDataKey;
									}
									let mergedDataValue = mergedData.users[newDataKey];
									for (let value in values) {
										if (values.hasOwnProperty(value)) {
											if (Settings.get(`${dm.type}_users_${value}`)) {
												for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
													let valueKey = values[value][j];
													if (newDataValue[valueKey]) {
														if (Settings.get('importAndMerge')) {
															switch (valueKey) {
																case 'whitelisted':
																case 'whitelistedDate':
																case 'blacklisted':
																case 'blacklistedDate':
																case 'steamFriend':
																	mergedDataValue[valueKey] = newDataValue[valueKey];
																	break;
																case 'notes':
																	mergedDataValue.notes = Shared.common.removeDuplicateNotes(
																		mergedDataValue.notes
																			? `${mergedDataValue.notes}\n\n${newDataValue.notes}`
																			: newDataValue.notes
																	);
																	break;
																case 'tags':
																	if (mergedDataValue.tags) {
																		let tags = newDataValue.tags;
																		for (let k = 0, numTags = tags.length; k < numTags; ++k) {
																			let tag = tags[k];
																			if (mergedDataValue.tags.indexOf(tag) < 0) {
																				mergedDataValue.tags.push(tag);
																			}
																		}
																	} else {
																		mergedDataValue.tags = newDataValue.tags;
																	}
																	break;
																case 'giveaways':
																	if (mergedDataValue.giveaways) {
																		if (
																			newDataValue.giveaways.wonTimestamp >
																			mergedDataValue.giveaways.wonTimestamp
																		) {
																			mergedDataValue.giveaways.won = newDataValue.giveaways.won;
																			mergedDataValue.giveaways.wonTimestamp =
																				newDataValue.giveaways.wonTimestamp;
																		}
																		if (
																			newDataValue.giveaways.sentTimestamp >
																			mergedDataValue.giveaways.sentTimestamp
																		) {
																			mergedDataValue.giveaways.sent = newDataValue.giveaways.sent;
																			mergedDataValue.giveaways.sentTimestamp =
																				newDataValue.giveaways.sentTimestamp;
																		}
																	} else {
																		mergedDataValue.giveaways = newDataValue.giveaways;
																	}
																	break;
																default:
																	if (
																		mergedDataValue[valueKey] &&
																		mergedDataValue[valueKey].lastCheck
																	) {
																		if (
																			newDataValue[valueKey].lastCheck >
																			mergedDataValue[valueKey].lastCheck
																		) {
																			mergedDataValue[valueKey] = newDataValue[valueKey];
																		}
																	} else {
																		mergedDataValue[valueKey] = newDataValue[valueKey];
																	}
																	break;
															}
														} else {
															mergedDataValue[valueKey] = newDataValue[valueKey];
														}
													}
												}
											}
										}
									}
								}
							}
							await Shared.common.setValue('users', JSON.stringify(mergedData));
						}
					} else if (dm.delete) {
						await Shared.common.setValue('users', JSON.stringify(mergedData));
					}
				}
				if (!dm.autoBackup) {
					let size = `{"${optionKey}":{"steamIds":{},"users":{}}}`.length;
					sizes.main += size;
					sizes.total += size;
					if (dm.switches) {
						for (const value in values) {
							if (values.hasOwnProperty(value)) {
								if (dm.switches[`${optionKey}_${value}`]) {
									dm.switches[
										`${optionKey}_${value}`
									].size.textContent = Shared.common.convertBytes(sizes[value]);
								}
							}
						}
						dm.switches[optionKey].size.textContent = Shared.common.convertBytes(sizes.total);
					}
					totalSize += sizes.total;
				}
				break;
			case 'winners':
				data.winners = JSON.parse(Shared.common.getValue('winners', '{}'));
				if (!space) {
					if (dm.import) {
						let newData = dm.data.winners;
						if (newData) {
							if (Settings.get('importAndMerge')) {
								mergedData = data.winners;
								for (let newDataKey in newData) {
									if (newData.hasOwnProperty(newDataKey)) {
										if (!mergedData[newDataKey]) {
											mergedData[newDataKey] = [];
										}
										for (let j = 0, numNew = newData[newDataKey].length; j < numNew; ++j) {
											let newDataValue = newData[newDataKey][j];
											if (mergedData[newDataKey].indexOf(newDataValue) < 0) {
												mergedData[newDataKey].push(newDataValue);
											}
										}
									}
								}
								await Shared.common.setValue('winners', JSON.stringify(mergedData));
							} else {
								await Shared.common.setValue('winners', JSON.stringify(newData));
							}
						}
					} else if (dm.delete) {
						await Shared.common.delValue('winners');
					}
				}
				if (!dm.autoBackup) {
					let size = `{"${optionKey}":${Shared.common.getValue(optionKey, '{}')}}`.length;
					totalSize += size;
					if (dm.switches) {
						dm.switches[optionKey].size.textContent = Shared.common.convertBytes(size);
					}
				}
				break;
			default:
				break;
		}
	}
	if (!dm.autoBackup && dm.computerSpaceCount) {
		dm.computerSpaceCount.textContent = Shared.common.convertBytes(totalSize);
	}
	if (space) {
		if (space.close) {
			space.close();
		}
		return totalSize;
	} else {
		if (dm.type === 'export' || Settings.get('exportBackup')) {
			if (dropbox || (dm.type !== 'export' && Settings.get('exportBackupIndex') === 1)) {
				CloudStorage.manage(CloudStorage.DROPBOX, data, dm, callback);
			} else if (googleDrive || (dm.type !== 'export' && Settings.get('exportBackupIndex') === 2)) {
				CloudStorage.manage(CloudStorage.GOOGLEDRIVE, data, dm, callback);
			} else if (oneDrive || (dm.type !== 'export' && Settings.get('exportBackupIndex') === 3)) {
				CloudStorage.manage(CloudStorage.ONEDRIVE, data, dm, callback);
			} else {
				const name = `${
					Settings.get('askFileName')
						? window.prompt(
								`Enter the name of the file:`,
								`esgst_data_${new Date().toISOString().replace(/:/g, '_')}`
						  )
						: `esgst_data_${new Date().toISOString().replace(/:/g, '_')}`
				}`;
				if (name === 'null') {
					callback();
					return;
				}
				if (Settings.get('backupZip')) {
					await Shared.common.downloadZip(data, `${name}.json`, `${name}.zip`);
				} else {
					Shared.common.downloadFile(JSON.stringify(data), `${name}.json`);
				}
				if (!dm.autoBackup) {
					Shared.common.createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
				}
				callback();
			}
		} else {
			Shared.common.createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
			callback();
		}
	}
}

export { loadDataCleaner, loadDataManagement, manageData };
