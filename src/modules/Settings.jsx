import { browser } from '../browser';
import { DOM } from '../class/DOM';
import { Logger } from '../class/Logger';
import { permissions } from '../class/Permissions';
import { Popup } from '../class/Popup';
import { Settings } from '../class/Settings';
import { SettingsWizard } from '../class/SettingsWizard';
import { Shared } from '../class/Shared';
import { ToggleSwitch } from '../class/ToggleSwitch';
import { Button } from '../components/Button';
import { PageHeading } from '../components/PageHeading';
import { Utils } from '../lib/jsUtils';
import { setSync } from './Sync';

class SettingsModule {
	constructor() {
		this.toSave = {};
		this.requiredPermissions = {};
		this.collapseButtons = [];
	}

	preSave(key, value) {
		const match = key.match(/_(sg|st)$/);
		if (match) {
			const id = key.replace(match[0], '');
			const namespace = match[1];
			const feature = Shared.esgst.featuresById[id];
			if (feature) {
				let setting;
				if (typeof value === 'object') {
					setting = value;
				} else {
					setting = Settings.getFull(key) || Shared.common.getFeaturePath(null, id, namespace);
					setting.enabled = value ? 1 : 0;
				}
				const globalInclude = setting.include.filter((x) => x.pattern === '.*')[0];
				if (globalInclude) {
					globalInclude.enabled = setting.enabled;
				}
				Settings.set(id, setting.enabled);
				Settings.setFull(key, setting);
				this.toSave[key] = setting;
				return;
			}
		}
		this.toSave[key] = value;
		Settings.set(key, value);
	}

	loadMenu(isPopup) {
		/** @type {HTMLInputElement} */
		let SMAPIKey;

		let Container = null;
		let Context = null;
		let popup = null;
		if (isPopup) {
			popup = new Popup({
				addScrollable: 'left',
				settings: true,
				isTemp: true,
			});
			popup.popup.classList.add('esgst-text-left');
			Container = popup.description;
			Context = popup.scrollable;
		} else {
			Context = Container = Shared.esgst.sidebar.nextElementSibling;
			Container.innerHTML = '';
		}

		let input;
		DOM.insert(
			isPopup ? Container : Shared.esgst.sidebar,
			'afterbegin',
			<div className="sidebar__search-container">
				<input
					className="sidebar__search-input"
					type="text"
					placeholder="Search..."
					ref={(ref) => (input = ref)}
				/>
			</div>
		);
		if (isPopup && Settings.get('scb')) {
			Shared.esgst.modules.generalSearchClearButton.getInputs(Container);
		}

		let newIndicators = null;

		let buttonGroup;
		DOM.insert(
			Container,
			'beforeend',
			<div className="esgst-button-group" ref={(ref) => (buttonGroup = ref)}></div>
		);

		Button.create({
			color: 'green',
			icons: [],
			name: 'Run Wizard',
			onClick: () => SettingsWizard.run(),
		}).insert(buttonGroup, 'beforeend');
		Button.create([
			{
				color: 'green',
				icons: [],
				name: 'Collapse All',
				onClick: async () => {
					for (const item of this.collapseButtons) {
						this.collapseSection(item.collapseButton, item.id, item.subMenu);
					}
				},
			},
			{
				template: 'loading',
				isDisabled: true,
				name: 'Collapsing',
			},
		]).insert(buttonGroup, 'beforeend');
		Button.create([
			{
				color: 'green',
				icons: [],
				name: 'Expand All',
				onClick: async () => {
					for (const item of this.collapseButtons) {
						this.expandSection(item.collapseButton, item.id, item.subMenu);
					}
				},
			},
			{
				template: 'loading',
				isDisabled: true,
				name: 'Expanding',
			},
		]).insert(buttonGroup, 'beforeend');
		const dismissAllButton = Button.create([
			{
				color: 'green',
				icons: [],
				name: 'Dismiss All New',
				onClick: async () => {
					await Shared.common.setSetting('dismissedOptions', Shared.esgst.toDismiss);
					for (let i = newIndicators.length - 1; i > -1; i--) {
						newIndicators[i].remove();
					}
				},
			},
			{
				template: 'loading',
				isDisabled: true,
				name: 'Dismissing',
			},
		])
			.insert(buttonGroup, 'beforeend')
			.hide();

		Container.setAttribute('data-esgst-popup', true);
		const items = [
			{
				check: true,
				options: {
					color: 'alternate-white',
					tooltip: 'Sync data',
					icons: ['fa-refresh'],
					onClick: () => setSync(true),
				},
			},
			{
				check: true,
				options: {
					color: 'alternate-white',
					tooltip: 'Restore data',
					icons: ['fa-sign-in esgst-rotate-90'],
					onClick: () => Shared.esgst.modules.loadDataManagement('import', true),
				},
			},
			{
				check: true,
				options: {
					color: 'alternate-white',
					tooltip: 'Backup data',
					icons: ['fa-sign-out esgst-rotate-270'],
					onClick: () => Shared.esgst.modules.loadDataManagement('export', true),
				},
			},
			{
				check: true,
				options: {
					color: 'alternate-white',
					tooltip: 'Delete data',
					icons: ['fa-trash'],
					onClick: () => Shared.esgst.modules.loadDataManagement('delete', true),
				},
			},
			{
				check: true,
				options: {
					color: 'alternate-white',
					tooltip: `Download settings (downloads your settings to your computer without your personal data so you can easily share them with other users)`,
					icons: ['fa-gear', 'fa-arrow-circle-down'],
					onClick: () => Shared.common.exportSettings(),
				},
			},
			{
				check: true,
				options: {
					color: 'alternate-white',
					tooltip: 'Clean old data',
					icons: ['fa-paint-brush'],
					onClick: () => Shared.esgst.modules.loadDataCleaner(true),
				},
			},
			{
				check: !Shared.esgst.parameters.esgst,
				options: {
					color: 'alternate-white',
					tooltip: 'View recent username changes',
					icons: ['fa-user', 'fa-history'],
					onClick: () => Shared.common.setSMRecentUsernameChanges(),
				},
			},
			{
				check: !Shared.esgst.parameters.esgst && Settings.get('uf'),
				options: {
					color: 'alternate-white',
					tooltip: 'See list of filtered users',
					icons: ['fa-user', 'fa-eye-slash'],
					onClick: () => Shared.common.setSMManageFilteredUsers(),
				},
			},
			{
				check:
					!Shared.esgst.parameters.esgst &&
					Shared.esgst.sg &&
					Settings.get('gf') &&
					Settings.get('gf_s'),
				options: {
					color: 'alternate-white',
					tooltip: 'Manage hidden giveaways',
					icons: ['fa-gift', 'fa-eye-slash'],
					onClick: () => Shared.common.setSMManageFilteredGiveaways(),
				},
			},
			{
				check:
					!Shared.esgst.parameters.esgst &&
					Shared.esgst.sg &&
					Settings.get('df') &&
					Settings.get('df_s'),
				options: {
					color: 'alternate-white',
					tooltip: 'Manage hidden discussions',
					icons: ['fa-comments', 'fa-eye-slash'],
				},
				ref: (button) => Shared.esgst.modules.discussionsDiscussionFilters.df_menu({}, button),
			},
			{
				check:
					!Shared.esgst.parameters.esgst &&
					Shared.esgst.st &&
					Settings.get('tf') &&
					Settings.get('tf_s'),
				options: {
					color: 'alternate-white',
					tooltip: 'Manage hidden trades',
					icons: ['fa-retweet', 'fa-eye-slash'],
				},
				ref: (button) => Shared.esgst.modules.tradesTradeFilters.tf_menu({}, button),
			},
			{
				check: !Shared.esgst.parameters.esgst && Shared.esgst.sg && Settings.get('dt'),
				options: {
					color: 'alternate-white',
					tooltip: 'Manage discussion tags',
					icons: ['fa-comments', 'fa-tags'],
					onClick: () => Shared.common.openManageDiscussionTagsPopup(),
				},
			},
			{
				check: !Shared.esgst.parameters.esgst && Shared.esgst.sg && Settings.get('ut'),
				options: {
					color: 'alternate-white',
					tooltip: 'Manage user tags',
					icons: ['fa-user', 'fa-tags'],
					onClick: () => Shared.common.openManageUserTagsPopup(),
				},
			},
			{
				check: !Shared.esgst.parameters.esgst && Settings.get('gt'),
				options: {
					color: 'alternate-white',
					tooltip: 'Manage game tags',
					icons: ['fa-gamepad', 'fa-tags'],
					onClick: () => Shared.common.openManageGameTagsPopup(),
				},
			},
			{
				check: !Shared.esgst.parameters.esgst && Settings.get('gpt'),
				options: {
					color: 'alternate-white',
					tooltip: 'Manage group tags',
					icons: ['fa-users', 'fa-tags'],
					onClick: () => Shared.common.openManageGroupTagsPopup(),
				},
			},
			{
				check: !Shared.esgst.parameters.esgst && Settings.get('wbc'),
				options: {
					color: 'alternate-white',
					tooltip: 'Manage Whitelist / Blacklist Checker caches',
					icons: ['fa-heart', 'fa-ban', 'fa-cog'],
				},
				ref: (button) =>
					Shared.esgst.modules.usersWhitelistBlacklistChecker.wbc_addButton(false, button),
			},
			{
				check: !Shared.esgst.parameters.esgst && Settings.get('namwc'),
				options: {
					color: 'alternate-white',
					tooltip: 'Manage Not Activated / Multiple Wins Checker caches',
					icons: ['fa-trophy', 'fa-cog'],
				},
				ref: (button) =>
					Shared.esgst.modules.usersNotActivatedMultipleWinChecker.namwc_setPopup(button),
			},
		].filter((x) => x.check);
		const heading = PageHeading.create('sm', [
			{
				name: 'ESGST',
				url: Shared.esgst.settingsUrl,
			},
			{
				name: 'Settings',
				url: Shared.esgst.settingsUrl,
			},
		]).insert(Container, 'afterbegin');
		for (const item of items) {
			const button = Button.create(item.options).insert(heading.nodes.outer, 'beforeend');
			if (item.ref) {
				item.ref(button.nodes.outer);
			}
		}
		if (!isPopup) {
			Shared.esgst.mainPageHeading = heading.nodes.outer;
		}

		input.addEventListener('input', (event) => this.filterSm(event));
		input.addEventListener('change', (event) => this.filterSm(event));
		Context.classList.add('esgst-menu-layer');
		DOM.insert(
			Context,
			'beforeend',
			<div className="esgst-menu-split">
				<div className="esgst-settings-menu"></div>
				<div className={`esgst-settings-menu-feature ${isPopup ? '' : 'esgst-menu-split-fixed'}`}>
					Click on a feature/option to manage it here.
				</div>
			</div>
		);
		Button.create([
			{
				color: 'green',
				icons: [],
				name: 'Save Changes',
				onClick: async () => {
					const missingPermissions = [];
					const requiredPermissions = new Set(Object.values(this.requiredPermissions).flat());
					for (const permissionKey of requiredPermissions) {
						if (!(await permissions.contains([[permissionKey]]))) {
							missingPermissions.push(permissionKey);
						}
					}
					if (browser.runtime.getURL && missingPermissions.length > 0) {
						const permissionsPopup = new Popup({
							addScrollable: true,
							icon: 'fa-exclamation',
							isTemp: true,
							title: (
								<fragment>
									Some of the features you enabled require permissions in order to work. Go{' '}
									<a
										className="esgst-bold table__column__secondary-link"
										href={`${browser.runtime.getURL(
											'permissions.html'
										)}?keys=${missingPermissions.join(',')}`}
										target="_blank"
									>
										here
									</a>{' '}
									and click the "Grant" button to grant them.
								</fragment>
							),
						});
						permissionsPopup.open();
						this.requiredPermissions = {};
					}
					await Shared.common.lockAndSaveSettings(this.toSave);
					this.toSave = {};
					new Popup({
						icon: 'fa-check',
						isTemp: true,
						title: 'Settings saved!',
					}).open();
				},
			},
			{
				color: 'white',
				isDisabled: true,
				icons: [],
				name: 'Saving...',
			},
		]).insert(heading.nodes.outer, 'beforeend');
		Context.addEventListener('click', (event) =>
			this.loadFeatureDetails(null, null, popup && popup.scrollable.offsetTop, event)
		);
		let SMMenu = Context.getElementsByClassName('esgst-settings-menu')[0];
		let i, type;
		for (const permissionKey of Object.keys(permissions.permissions)) {
			const permission = permissions.permissions[permissionKey];
			for (const featureKey of Object.keys(permission.messages)) {
				const feature = Shared.esgst.featuresById[featureKey];
				if (feature) {
					if (!feature.permissions) {
						feature.permissions = [];
					}
					feature.permissions.push(permissionKey);
				}
			}
		}
		i = 1;
		if (browser.runtime.getURL) {
			const permissionsSection = this.createMenuSection(
				SMMenu,
				null,
				i,
				'Permissions',
				'permissions'
			);
			permissionsSection.lastElementChild.innerHTML = `
				Go <a class="esgst-bold table__column__secondary-link" href="${browser.runtime.getURL(
					'permissions.html'
				)}" target="_blank">here</a> to grant / deny permissions.
			`;
			i += 1;
		}
		for (type in Shared.esgst.features) {
			if (Shared.esgst.features.hasOwnProperty(type)) {
				if (type !== 'trades' || Settings.get('esgst_st')) {
					let id,
						j,
						section,
						title,
						isNew = false;
					title = type.replace(/^./, (m) => {
						return m.toUpperCase();
					});
					section = this.createMenuSection(SMMenu, null, i, title, type);
					j = 1;
					for (id in Shared.esgst.features[type].features) {
						if (Shared.esgst.features[type].features.hasOwnProperty(id)) {
							if (id === 'common') {
								continue;
							}
							let feature, ft;
							feature = Shared.esgst.features[type].features[id];
							if (!feature.sg && feature.st && !Settings.get('esgst_st') && id !== 'esgst') {
								continue;
							}
							ft = this.getSMFeature(feature, id, j, `${i}.${j}`, popup);
							if (ft) {
								if (ft.isNew) {
									isNew = true;
								}
								section.lastElementChild.appendChild(ft.menu);
								j += 1;
							}
						}
					}
					if (isNew) {
						Shared.common.createElements(section.firstElementChild.lastElementChild, 'afterbegin', [
							{
								attributes: {
									class: 'esgst-bold esgst-red esgst-new-indicator',
									title: 'There is a new feature/option in this section',
								},
								type: 'span',
								children: [
									{
										attributes: {
											class: 'fa fa-star',
										},
										type: 'i',
									},
								],
							},
						]);
					}
					i += 1;
				}
			}
		}
		const elementOrdering = this.createMenuSection(
			SMMenu,
			null,
			i,
			'Element Ordering',
			'element_ordering'
		);
		this.setElementOrderingSection(elementOrdering.lastElementChild);
		i += 1;
		this.createMenuSection(
			SMMenu,
			[
				{
					attributes: {
						class: 'esgst-steam-api-key',
						type: 'text',
					},
					type: 'input',
				},
				{
					attributes: {
						class: 'esgst-description',
					},
					type: 'div',
					children: [
						{
							text:
								'This is optional for syncing owned games faster and required for syncing alt accounts. Get a Steam API Key ',
							type: 'node',
						},
						{
							attributes: {
								class: 'esgst-bold',
								href: `https://steamcommunity.com/dev/apikey`,
								target: '_blank',
							},
							text: 'here',
							type: 'a',
						},
						{
							text: `. You can enter any domain in there, it is irrelevant, for example, "https://www.steamgifts.com".`,
							type: 'node',
						},
					],
				},
			],
			i,
			'Steam API Key',
			'steam_api_key'
		);
		SMAPIKey = /** @type {HTMLInputElement} */ Context.getElementsByClassName(
			'esgst-steam-api-key'
		)[0];
		let key = Settings.get('steamApiKey');
		if (key) {
			SMAPIKey.value = key;
		}
		SMAPIKey.addEventListener('input', () => {
			// noinspection JSIgnoredPromiseFromCall
			this.preSave('steamApiKey', SMAPIKey.value);
		});
		if (Shared.esgst.parameters.esgst === 'settings' && Shared.esgst.parameters.id) {
			this.loadFeatureDetails(
				Shared.esgst.parameters.id,
				Shared.common.getFeatureNumber(Shared.esgst.parameters.id).number,
				popup && popup.scrollable.offsetTop
			);
		}
		if (isPopup) {
			popup.open();
		}

		newIndicators = document.querySelectorAll('.esgst-new-indicator');
		if (newIndicators.length) {
			dismissAllButton.show();
		}
	}

	showExtensionOnlyPopup() {
		new Popup({
			addScrollable: true,
			icon: 'fa-exclamation',
			isTemp: true,
			title: (
				<fragment>
					This feature is only available in the extension version of ESGST. Please upgrade to the
					extension to use it. Below are the links for it:
					<br />
					<br />
					<a href="https://chrome.google.com/webstore/detail/esgst/ibedmjbicclcdfmghnkfldnplocgihna">
						https://chrome.google.com/webstore/detail/esgst/ibedmjbicclcdfmghnkfldnplocgihna
					</a>
					<br />
					<br />
					<a href="https://addons.mozilla.org/en-US/firefox/addon/esgst/">
						https://addons.mozilla.org/en-US/firefox/addon/esgst/
					</a>
					<br />
					<br />
					<a href="http://addons.palemoon.org/addon/esgst/">
						http://addons.palemoon.org/addon/esgst/
					</a>
					<br />
					<br />
					To transfer your data from the userscript to the extension, backup your data in the backup
					menu of the userscript, then disable the userscript, install the extension and restore
					your data in the restore menu of the extension. Below are the links to the backup/restore
					pages:
					<br />
					<br />
					<a href="https://www.steamgifts.com/account/settings/profile?esgst=backup">
						https://www.steamgifts.com/account/settings/profile?esgst=backup
					</a>
					<br />
					<br />
					<a href="https://www.steamgifts.com/account/settings/profile?esgst=restore">
						https://www.steamgifts.com/account/settings/profile?esgst=restore
					</a>
				</fragment>
			),
		}).open();
	}

	loadFeatureDetails(id, numberPath, offset, event) {
		if (!offset) {
			offset = 0;
		}
		if (!id) {
			if (event.target.matches('.esgst-settings-feature')) {
				id = event.target.getAttribute('data-id');
				numberPath = event.target.getAttribute('data-number');
			} else {
				return;
			}
		}
		const feature = Shared.esgst.featuresById[id];
		if (!feature) {
			return;
		}
		const url = `${Shared.esgst.settingsUrl}&id=${id}`;
		const featureId = feature.alias ?? id;
		let featureName;
		if (feature.customName) {
			featureName = feature.customName();
			this.replaceFeatureNamePlaceholders(featureName);
		} else {
			featureName = feature.name.replace(
				/\[id=(.+?)]/g,
				Shared.common.getFeatureName.bind(Shared.common)
			);
		}
		const items = [
			{
				check: true,
				content: featureName,
				name: 'Name',
			},
			{
				check: true,
				content: (
					<fragment>
						<div>
							{numberPath}
							<i
								data-clipboard-text={numberPath}
								className="icon_to_clipboard fa fa-fw fa-copy"
							></i>
						</div>
						<div>
							{url}
							<i data-clipboard-text={url} className="icon_to_clipboard fa fa-fw fa-copy"></i>
						</div>
					</fragment>
				),
				name: 'Number / Link',
			},
		];
		let sgContext, stContext;
		if (feature.sg) {
			const value = (
				Settings.getFull(`${featureId}_sg`) ||
				Shared.common.getFeaturePath(feature, featureId, 'sg')
			).enabled;
			sgContext = <div></div>;
			const sgSwitch = new ToggleSwitch(
				sgContext,
				null,
				true,
				Settings.get('esgst_st') ? 'SteamGifts' : '',
				true,
				false,
				null,
				value
			);
			feature.sgFeatureSwitch = sgSwitch;
			sgSwitch.onEnabled = () => {
				if (feature.extensionOnly && browser.gm) {
					sgSwitch.disable(true);
					this.showExtensionOnlyPopup();
					return;
				}
				if (feature.conflicts) {
					for (const conflictId of feature.conflicts) {
						const setting = Settings.getFull(`${conflictId}_sg`);
						if (typeof setting === 'object' ? setting.enabled : setting) {
							sgSwitch.disable(true);
							new Popup({
								addScrollable: true,
								icon: 'fa-exclamation',
								isTemp: true,
								title: `This feature conflicts with ${Shared.common.getFeatureName(
									null,
									conflictId
								)}. While that feature is enabled, this feature cannot be enabled.`,
							}).open();
							return;
						}
					}
				}
				this.preSave(`${featureId}_sg`, true);
				if (feature.sgSwitch) {
					feature.sgSwitch.enable(true);
				}
				DOM.insert(
					document.querySelector('#esgst-paths-sg'),
					'atinner',
					this.openPathsPopup(feature, featureId, 'sg')
				);
			};
			sgSwitch.onDisabled = async () => {
				this.preSave(`${featureId}_sg`, false);
				if (feature.sgSwitch) {
					feature.sgSwitch.disable(true);
				}
				DOM.insert(
					document.querySelector('#esgst-paths-sg'),
					'atinner',
					this.openPathsPopup(feature, featureId, 'sg')
				);
			};
		}
		if (feature.st && (Settings.get('esgst_st') || featureId === 'esgst')) {
			const value = (
				Settings.getFull(`${featureId}_st`) ||
				Shared.common.getFeaturePath(feature, featureId, 'st')
			).enabled;
			stContext = <div></div>;
			const stSwitch = new ToggleSwitch(
				stContext,
				null,
				true,
				'SteamTrades',
				false,
				true,
				null,
				value
			);
			feature.stFeatureSwitch = stSwitch;
			stSwitch.onEnabled = () => {
				if (feature.extensionOnly && browser.gm) {
					stSwitch.disable(true);
					this.showExtensionOnlyPopup();
					return;
				}
				if (feature.conflicts) {
					for (const conflictId of feature.conflicts) {
						const setting = Settings.getFull(`${conflictId}_st`);
						if (typeof setting === 'object' ? setting.enabled : setting) {
							stSwitch.disable(true);
							new Popup({
								addScrollable: true,
								icon: 'fa-exclamation',
								isTemp: true,
								title: `This feature conflicts with ${Shared.common.getFeatureName(
									null,
									conflictId
								)}. While that feature is enabled, this feature cannot be enabled.`,
							}).open();
							return;
						}
					}
				}
				this.preSave(`${featureId}_st`, true);
				if (feature.stSwitch) {
					feature.stSwitch.enable(true);
				}
				DOM.insert(
					document.querySelector('#esgst-paths-st'),
					'atinner',
					this.openPathsPopup(feature, featureId, 'st')
				);
			};
			stSwitch.onDisabled = async () => {
				this.preSave(`${featureId}_st`, false);
				if (feature.stSwitch) {
					feature.stSwitch.disable(true);
				}
				DOM.insert(
					document.querySelector('#esgst-paths-st'),
					'atinner',
					this.openPathsPopup(feature, featureId, 'st')
				);
			};
		}
		items.push({
			check: true,
			content: (
				<fragment>
					{sgContext}
					{stContext}
				</fragment>
			),
			name: 'Enable/Disable',
		});
		if (feature.description) {
			const descriptionEl = feature.description();
			this.replaceFeatureNamePlaceholders(descriptionEl);
			items.push({
				check: true,
				content: <div className="markdown">{descriptionEl}</div>,
				name: 'What does it do?',
			});
		}
		const additionalOptions = this.getSmFeatureAdditionalOptions(feature, featureId);
		if (additionalOptions.length > 0) {
			items.push({
				check: true,
				content: <fragment>{additionalOptions}</fragment>,
				name: 'Additional Options',
			});
		}
		if (feature.sync) {
			items.push({
				check: true,
				content: (
					<fragment>
						<p>
							This feature requires the following data to be synced in order to function properly:{' '}
							<strong>{feature.sync}</strong>
						</p>
						<br />
						<p>
							To sync these now, click{' '}
							<a
								className="table__column__secondary-link"
								href={`${Shared.esgst.syncUrl}&autoSync=true&${feature.syncKeys
									.map((x) => `${x}=1`)
									.join('&')}`}
								target="_blank"
							>
								here
							</a>
							.
						</p>
					</fragment>
				),
				name: 'Sync Requirements',
			});
		}
		if (feature.sg && (!feature.sgPaths || typeof feature.sgPaths !== 'string')) {
			items.push({
				check: true,
				content: this.openPathsPopup(feature, featureId, 'sg'),
				// @ts-ignore
				id: 'esgst-paths-sg',
				name: 'Where to run it on SteamGifts?',
			});
		}
		if (
			feature.st &&
			Settings.get('esgst_st') &&
			(!feature.stPaths || typeof feature.stPaths !== 'string')
		) {
			items.push({
				check: true,
				content: this.openPathsPopup(feature, featureId, 'st'),
				// @ts-ignore
				id: 'esgst-paths-st',
				name: 'Where to run it on SteamTrades?',
			});
		}
		const context = document.querySelector('.esgst-settings-menu-feature');
		if (!context.classList.contains('esgst-menu-split-fixed')) {
			context.style.maxHeight = `${context.closest('.esgst-menu-layer').offsetHeight - 24}px`;
		}
		context.innerHTML = 'Click on a feature/option to manage it here.';
		Shared.common.createFormRows(context, 'beforeend', { items });
	}

	setElementOrderingSection(context) {
		const obj = {
			elementOrdering: true,
			outerWrap: Shared.common.createElements(context, 'beforeend', [
				{
					attributes: {
						class: 'esgst-element-ordering-container',
					},
					type: 'div',
				},
			]),
		};
		const obj_gv = {
			elementOrdering: true,
			outerWrap: Shared.common.createElements(context, 'beforeend', [
				{
					attributes: {
						class: 'esgst-element-ordering-container',
					},
					type: 'div',
				},
			]),
		};
		const items = [
			{
				includeGridView: true,
				group: 'giveaways',
				id: 'gc_categories',
				key: 'gcPanel',
				name: 'Game Categories',
				labels: {
					gc_ocv: 'Original CV',
					gc_fcv: 'Full CV',
					gc_rcv: 'Reduced CV',
					gc_ncv: 'No CV',
					gc_h: 'Hidden',
					gc_i: 'Ignored',
					gc_o: 'Owned',
					gc_w: 'Wishlisted',
					gc_f: 'Followed',
					gc_pw: 'Previously Won',
					gc_a: 'Achievements',
					gc_bd: 'Banned',
					gc_bvg: 'Barter.vg',
					gc_sp: 'Singleplayer',
					gc_mp: 'Multiplayer',
					gc_sc: 'Steam Cloud',
					gc_tc: 'Trading Cards',
					gc_l: 'Linux',
					gc_m: 'Mac',
					gc_ea: 'Early Access',
					gc_lg: 'Learning',
					gc_rm: 'Removed',
					gc_dlc: 'DLC',
					gc_p: 'Package',
					gc_gi: 'Giveaway Info',
					gc_r: 'Rating',
					gc_hltb: 'HLTB',
					gc_rd: 'Release Date',
					gc_g: 'Genres',
				},
			},
			{
				includeGridView: true,
				group: 'giveaways',
				id: 'giveawayHeading',
				key: 'heading',
				name: 'Giveaway Heading',
				labels: {
					gr: 'Giveaway Recreator',
					gb: 'Giveaway Bookmarks',
					gf: 'Giveaway Filters',
					egh: 'Entered Game Highlighter',
					name: 'Game Name',
					points: 'Points',
					copies: 'Copies',
					steam: 'Steam Link',
					'screenshots-videos': 'Screenshots / Videos',
					search: 'Search Link',
					hideGame: 'Hide Game',
					gt: 'Game Tags',
				},
			},
			{
				group: 'giveaways',
				id: 'giveawayColumns',
				key: 'columns',
				name: 'Giveaway Columns',
				labels: {
					ged: 'Giveaway Encrypter/Decrypter',
					endTime: 'End Time',
					winners: 'Winners',
					startTime: 'Start Time',
					touhou: 'Touhou',
					inviteOnly: 'Invite Only',
					whitelist: 'Whitelist',
					group: 'Group',
					regionRestricted: 'Region Restricted',
					level: 'Level',
				},
			},
			{
				isGridView: true,
				group: 'giveaways_gv',
				id: 'giveawayColumns_gv',
				key: 'gvIcons',
				name: 'Giveaway Columns',
				labels: {
					sgTools: 'SGTools',
					ged: 'Giveaway Encrypter/Decrypter',
					time: 'End/Start Time',
					touhou: 'Touhou',
					inviteOnly: 'Invite Only',
					whitelist: 'Whitelist',
					group: 'Group',
					regionRestricted: 'Region Restricted',
					level: 'Level',
				},
			},
			{
				group: 'giveaways',
				id: 'giveawayPanel',
				key: 'panel',
				name: 'Giveaway Panel',
				labels: {
					ttec: 'Time To Enter Calculator',
					gwc: 'Giveaway Winning Chance',
					gwr: 'Giveaway Winning Ratio',
					gptw: 'Giveaway Points To Win',
					gp: 'Giveaway Popup',
					elgb: 'Enter/Leave Giveaway Button',
					sgTools: 'SGTools',
				},
			},
			{
				isGridView: true,
				group: 'giveaways_gv',
				id: 'giveawayPanel_gv',
				key: 'panel',
				name: 'Giveaway Panel',
				labels: {
					ttec: 'Time To Enter Calculator',
					gwc: 'Giveaway Winning Chance',
					gwr: 'Giveaway Winning Ratio',
					gptw: 'Giveaway Points To Win',
					gp: 'Giveaway Popup',
					elgb: 'Enter/Leave Giveaway Button',
				},
			},
			{
				includeGridView: true,
				group: 'giveaways',
				id: 'giveawayLinks',
				key: 'links',
				name: 'Giveaway Links',
				labels: {
					entries: 'Entries',
					winners_count: 'Winners Count',
					comments: 'Comments',
				},
			},
			{
				includeGridView: true,
				group: 'giveaways',
				id: 'giveawayExtraPanel',
				key: 'extraPanel',
				name: 'Giveaway Extra Panel',
				labels: {
					ggl: 'Giveaway Groups Loader',
				},
			},
			{
				group: 'mainPageHeading',
				id: 'leftButtonIds',
				key: 'leftButtons',
				name: `Left Main Page Heading Buttons (Hidden)`,
				tooltip:
					'Moving an element to this group will hide it from the main page heading. It will be accessible by clicking on the button with the vertical ellipsis located at the left side of the heading.',
				labels: {},
			},
			{
				group: 'mainPageHeading',
				id: 'rightButtonIds',
				key: 'rightButtons',
				name: `Right Main Page Heading Buttons (Hidden)`,
				tooltip:
					'Moving an element to this group will hide it from the main page heading. It will be accessible by clicking on the button with the vertical ellipsis located at the  right side of the heading.',
				labels: {},
			},
			{
				group: 'mainPageHeading',
				id: 'leftMainPageHeadingIds',
				key: 'leftMainPageHeadingButtons',
				name: 'Left Main Page Heading Buttons',
				labels: {
					aic: 'Attached Images Carousel',
					as: 'Archive Searcher',
					cec: 'Comment/Entry Checker',
					cf: 'Comment Filters',
					cs: 'Comment Searcher',
					ctGo: `Comment Tracker (Go To Unread)`,
					ctRead: `Comment Tracker (Mark As Read)`,
					ctUnread: `Comment Tracker (Mark As Unread)`,
					df: 'Discussion Filters',
					df_s_s: `Discussion Filters (Single Filters Switch)`,
					tf: 'Trade Filters',
					tf_s_s: `Trade Filters (Single Filters Switch)`,
					gmf: 'Game Filters',
					gpf: 'Group Filters',
					ds: 'Discussion Sorter',
					gas: 'Giveaway Sorter',
					ge: 'Giveaway Extractor',
					gf: 'Giveaway Filters',
					gf_s_s: `Giveaway Filters (Single Filters Switch)`,
					glwc: 'Group Library/Wishlist Checker',
					gts: 'Giveaway Templates',
					gv: 'Grid View',
					hgm: 'Hidden Games Manager',
					mpp: 'Main Post Popup',
					namwc: 'Not Activated/Multiple Wins Checker',
					rbp: 'Reply Box Popup',
					sks: 'Sent Keys Searcher',
					tb: 'Trade Bumper',
					uf_s_s: `User Filters (Single Filters Switch)`,
					ugs: 'Unsent Gifts Sender',
					usc: 'User Suspension Checker',
					ust: 'User Suspension Tracker',
					wbc: 'Whitelist/Blacklist Checker',
					wbm: 'Whitelist/Blacklist Manager',
					wbsAsc: `Whitelist/Blacklist Sorter (Ascending)`,
					wbsDesc: `Whitelist/Blacklist Sorter (Descending)`,
				},
			},
			{
				group: 'mainPageHeading',
				id: 'rightMainPageHeadingIds',
				key: 'rightMainPageHeadingButtons',
				name: 'Right Main Page Heading Buttons',
				labels: {
					esContinuous: `Endless Scrolling (Continuously Load)`,
					esNext: `Endless Scrolling (Load Next),`,
					esResume: `Endless Scrolling (Resume)`,
					esPause: `Endless Scrolling (Pause)`,
					esRefresh: `Endless Scrolling (Refresh)`,
					esRefreshAll: `Endless Scrolling (Refresh All)`,
					mm: 'Multi-Manager',
					stbb: 'Scroll To Bottom Button',
					sttb: 'Scroll To Top Button',
				},
			},
		];
		for (const item of items) {
			const children = [];
			for (const id in item.labels) {
				if (!item.labels.hasOwnProperty(id)) {
					continue;
				}
				children.push({
					attributes: {
						['data-draggable-id']: id,
						['data-draggable-group']: item.group,
					},
					text: item.labels[id],
					type: 'div',
				});
			}
			const section = Shared.common.createElements(
				(item.isGridView ? obj_gv : obj).outerWrap,
				'beforeend',
				[
					{
						text: `${item.name}${item.isGridView ? ` (Grid View)` : ''}`,
						type: 'strong',
					},
					item.tooltip
						? {
								attributes: {
									class: 'fa fa-question-circle',
									title: item.tooltip,
								},
								type: 'i',
						  }
						: null,
					{
						attributes: {
							class: 'esgst-element-ordering-box',
						},
						type: 'div',
						children,
					},
				]
			);
			Button.create([
				{
					color: 'white',
					icons: ['fa-undo'],
					name: 'Reset',
					onClick: this.resetElementOrdering.bind(this, item.id, obj, obj_gv),
				},
				{
					template: 'loading',
					isDisabled: true,
					name: 'Resetting',
				},
			]).insert(section, 'beforebegin');
			(item.isGridView ? obj_gv : obj)[item.key] = section;
			section.addEventListener(
				'dragenter',
				Shared.common.draggable_enter.bind(Shared.common, {
					context: section,
					item: {
						outerWrap: section,
					},
				})
			);
			Shared.common.draggable_set({
				context: section,
				id: item.id,
				item: {
					outerWrap: section,
				},
				onDragEnd: (obj) => {
					for (const key in obj) {
						this.preSave(key, obj[key]);
					}
				},
			});
			if (item.includeGridView) {
				const children_gv = [];
				for (const id in item.labels) {
					if (!item.labels.hasOwnProperty(id)) {
						return;
					}
					children_gv.push({
						attributes: {
							['data-draggable-id']: id,
							['data-draggable-group']: `${item.group}_gv`,
						},
						text: item.labels[id],
						type: 'div',
					});
				}
				const section_gv = Shared.common.createElements(obj_gv.outerWrap, 'beforeend', [
					{
						text: `${item.name} (Grid View)`,
						type: 'strong',
					},
					{
						attributes: {
							class: 'esgst-element-ordering-box',
						},
						type: 'div',
						children: children_gv,
					},
				]);
				Button.create([
					{
						color: 'white',
						icons: ['fa-undo'],
						name: 'Reset',
						onClick: this.resetElementOrdering.bind(this, `${item.id}_gv`, obj, obj_gv),
					},
					{
						template: 'loading',
						isDisabled: true,
						name: 'Resetting',
					},
				]).insert(section_gv, 'beforebegin');
				obj_gv[item.key] = section_gv;
				section_gv.addEventListener(
					'dragenter',
					Shared.common.draggable_enter.bind(Shared.common, {
						context: section_gv,
						item: {
							outerWrap: section_gv,
						},
					})
				);
				Shared.common.draggable_set({
					context: section_gv,
					id: `${item.id}_gv`,
					item: {
						outerWrap: section_gv,
					},
					onDragEnd: (obj) => {
						for (const key in obj) {
							this.preSave(key, obj[key]);
						}
					},
				});
			}
		}
		Shared.esgst.modules.giveaways.giveaways_reorder(obj);
		Shared.esgst.modules.giveaways.giveaways_reorder(obj_gv);
		Shared.common.reorderButtons(obj);
	}

	async resetElementOrdering(id, obj, obj_gv) {
		this.preSave(id, Settings.defaultValues[id]);
		Shared.esgst.modules.giveaways.giveaways_reorder(obj);
		Shared.esgst.modules.giveaways.giveaways_reorder(obj_gv);
		Shared.common.reorderButtons(obj);
	}

	openPathsPopup(feature, id, name) {
		feature.id = id;
		let obj = {
			exclude: { extend: this.addPath.bind(this) },
			excludeItems: [],
			include: { extend: this.addPath.bind(this) },
			includeItems: [],
			name: name,
		};
		const context = (
			<fragment>
				<div className="esgst-bold">
					Run it here:{' '}
					<i
						className="fa fa-question-circle"
						title="Select the places where you want the feature to run. If you cannot find the place you want, select 'Custom' and enter the place manually (you have to use regular expressions)."
					></i>
				</div>
				<div {...obj.include}></div>
				<div className="esgst-button-group">
					{
						Button.create({
							color: 'white',
							icons: ['fa-plus-circle'],
							name: 'Add New',
							onClick: () =>
								obj.include.extend(feature, 'include', obj, { enabled: 1, pattern: '' }, true),
						}).build().nodes.outer
					}
				</div>
				<div className="esgst-bold">
					Do NOT run it here:{' '}
					<i
						className="fa fa-question-circle"
						title="Select the places where you don't want the feature to run. If you cannot find the place you want, select 'Custom' and enter the place manually (you have to use regular expressions)."
					></i>
				</div>
				<div {...obj.exclude}></div>
				<div className="esgst-button-group">
					{
						Button.create({
							color: 'white',
							icons: ['fa-plus-circle'],
							name: 'Add New',
							onClick: () =>
								obj.exclude.extend(feature, 'exclude', obj, { enabled: 1, pattern: '' }, true),
						}).build().nodes.outer
					}
				</div>
			</fragment>
		);
		obj.setting =
			Settings.getFull(`${id}_${obj.name}`) || Shared.common.getFeaturePath(feature, id, obj.name);
		obj.setting.include.forEach((path) => obj.include.extend(feature, 'include', obj, path));
		obj.setting.exclude.forEach((path) => obj.exclude.extend(feature, 'exclude', obj, path));
		return context;
	}

	addPath(context, feature, key, obj, path, userAdded) {
		let item = {};
		item.container = Shared.common.createElements(context, 'beforeend', [
			{
				type: 'div',
			},
		]);
		item.switch = new ToggleSwitch(
			item.container,
			null,
			true,
			'',
			false,
			false,
			null,
			path.enabled
		);
		let found = false;
		item.switch.onChange = () => {
			this.savePaths(feature.id, obj);
		};
		DOM.insert(
			item.container,
			'beforeend',
			<select
				className="esgst-switch-input esgst-switch-input-large"
				ref={(ref) => (item.select = ref)}
			>
				{Shared.esgst.paths[obj.name]
					.filter(
						(x) =>
							!feature[`${obj.name}Paths`] ||
							x.name === 'Everywhere' ||
							x.name.match(feature[`${obj.name}Paths`])
					)
					.map((x) => (
						<option
							value={x.pattern}
							selected={x.pattern === path.pattern && (found = true) ? true : null}
						>
							{x.name}
						</option>
					))}
				{feature[`${obj.name}Paths`] ? null : (
					<option value="custom" selected={!found || null}>
						Custom
					</option>
				)}
			</select>
		);
		DOM.insert(
			item.container,
			'beforeend',
			<input
				className="esgst-switch-input esgst-switch-input-large"
				type="text"
				disabled={item.select.value === 'custom' ? null : true}
				ref={(ref) => (item.input = ref)}
			/>
		);
		item.select.addEventListener('change', () => {
			if (item.select.value === 'custom') {
				item.input.disabled = false;
				item.input.value = '';
			} else {
				item.input.disabled = true;
				item.input.value = item.select.value;
			}
			this.savePaths(feature.id, obj);
		});
		item.input.value = path.pattern;
		item.input.addEventListener('input', () => {
			this.validatePathRegex(item);
			this.savePaths(feature.id, obj);
		});
		Shared.common
			.createElements(item.container, 'beforeend', [
				{
					attributes: {
						class: 'fa fa-times-circle esgst-clickable',
						title: 'Remove',
					},
					type: 'i',
				},
			])
			.addEventListener('click', () => this.removePath(feature, item, key, obj));
		item.invalid = Shared.common.createElements(item.container, 'beforeend', [
			{
				attributes: {
					class: 'fa fa-exclamation esgst-hidden esgst-red',
					title: 'Invalid Regular Expression',
				},
				type: 'i',
			},
		]);
		obj[`${key}Items`].push(item);
		if (key === 'include' && feature.includeOptions) {
			item.options = [];
			const optionsContainer = Shared.common.createElements(item.container, 'beforeend', [
				{
					attributes: {
						class: 'esgst-form-row-indent',
					},
					type: 'div',
				},
			]);
			for (const option of feature.includeOptions) {
				const optionObj = {
					id: option.id,
					switch: new ToggleSwitch(
						optionsContainer,
						null,
						true,
						option.name,
						false,
						false,
						null,
						!!(path.options && path.options[option.id])
					),
				};
				optionObj.switch.onChange = () => this.savePaths(feature.id, obj);
				item.options.push(optionObj);
			}
		}
		if (userAdded) {
			this.savePaths(feature.id, obj);
		}
	}

	removePath(feature, item, key, obj) {
		let i = obj[`${key}Items`].length - 1;
		if (i === 0 && key === 'include') {
			window.alert('At least 1 place is required!');
			return;
		}
		while (i > -1 && obj[`${key}Items`][i].input.value !== item.input.value) i--;
		if (i > -1) {
			obj[`${key}Items`].splice(i, 1);
		}
		item.container.remove();
		this.savePaths(feature.id, obj);
	}

	validatePathRegex(item) {
		item.invalid.classList.add('esgst-hidden');
		try {
			new RegExp(item.input.value);
		} catch (error) {
			Logger.warning(error.message, error.stack);
			item.invalid.classList.remove('esgst-hidden');
		}
	}

	async savePaths(id, obj) {
		obj.setting.include = [];
		obj.setting.exclude = [];
		for (const item of obj.includeItems) {
			const setting = {
				enabled: item.switch.value ? 1 : 0,
				pattern: item.input.value,
			};
			if (item.options) {
				setting.options = {};
				for (const option of item.options) {
					setting.options[option.id] = option.switch.value ? 1 : 0;
				}
			}
			obj.setting.include.push(setting);
		}
		for (const item of obj.excludeItems) {
			obj.setting.exclude.push({
				enabled: item.switch.value ? 1 : 0,
				pattern: item.input.value,
			});
		}
		this.preSave(`${id}_${obj.name}`, obj.setting);
	}

	dismissNewOption(id, event) {
		event.currentTarget.remove();
		const dismissedOptions = Settings.get('dismissedOptions');
		if (dismissedOptions.indexOf(id) < 0) {
			dismissedOptions.push(id);
			// noinspection JSIgnoredPromiseFromCall
			this.preSave('dismissedOptions', dismissedOptions);
		}
	}

	getSMFeature(feature, id, number, numberPath, popup) {
		const featureId = feature.alias ?? id;
		const menuContainer = document.createElement('div');
		menuContainer.className = 'esgst-sm-feature-container';
		menuContainer.id = `esgst_${id}`;
		let menu;
		DOM.insert(
			menuContainer,
			'atinner',
			<div className="esgst-sm-feature" ref={(ref) => (menu = ref)}></div>
		);
		Shared.common.createElements(menu, 'beforeend', [
			{
				attributes: {
					class: 'esgst-sm-small-number esgst-form-heading-number',
				},
				text: `${number}.`,
				type: 'div',
			},
		]);
		let isMainNew =
			Settings.get('dismissedOptions').indexOf(featureId) < 0 &&
			!Utils.isSet(Shared.esgst.settings[`${featureId}_sg`]) &&
			!Utils.isSet(Shared.esgst.settings[`${featureId}_st`]);
		if (isMainNew) {
			feature.isNew = true;
			Shared.common
				.createElements(menu.firstElementChild, 'afterend', [
					{
						attributes: {
							class: 'esgst-bold esgst-red esgst-clickable esgst-new-indicator',
							title: 'This is a new feature/option. Click to dismiss.',
						},
						text: `[NEW]`,
						type: 'span',
					},
				])
				.addEventListener('click', (event) => this.dismissNewOption(featureId, event));
		}
		let isHidden = true;
		let sgContext, stContext;
		let collapseButton, isExpanded, subMenu;
		if (feature.sg) {
			const value = (
				Settings.getFull(`${featureId}_sg`) ||
				Shared.common.getFeaturePath(feature, featureId, 'sg')
			).enabled;
			if (value) {
				isHidden = false;
			}
			sgContext = <div></div>;
			const sgSwitch = new ToggleSwitch(
				sgContext,
				null,
				true,
				Settings.get('esgst_st') ? `[SG]` : '',
				true,
				false,
				null,
				value
			);
			feature.sgSwitch = sgSwitch;
			sgSwitch.onEnabled = () => {
				if (feature.extensionOnly && browser.gm) {
					sgSwitch.disable(true);
					this.showExtensionOnlyPopup();
					return;
				}
				if (feature.conflicts) {
					for (const conflictId of feature.conflicts) {
						const setting = Settings.getFull(`${conflictId}_sg`);
						if (typeof setting === 'object' ? setting.enabled : setting) {
							sgSwitch.disable(true);
							new Popup({
								addScrollable: true,
								icon: 'fa-exclamation',
								isTemp: true,
								title: `This feature conflicts with ${Shared.common.getFeatureName(
									null,
									conflictId
								)}. While that feature is enabled, this feature cannot be enabled.`,
							}).open();
							return;
						}
					}
				}
				if (feature.permissions) {
					this.requiredPermissions[featureId] = feature.permissions;
				}
				this.loadFeatureDetails(id, numberPath, popup && popup.scrollable.offsetTop);
				if (feature.sgFeatureSwitch) {
					feature.sgFeatureSwitch.enable();
				} else {
					this.preSave(`${featureId}_sg`, true);
				}
				if (subMenu.classList.contains('esgst-hidden')) {
					this.expandSection(collapseButton, id, subMenu);
					isExpanded = true;
				}
				if (feature.dependencies) {
					Shared.common.createConfirmation(
						<fragment>
							This feature depends on the following features to work properly: <br />
							<br />
							{feature.dependencies
								.map((x) => [`"${Shared.common.getFeatureName(null, x)}"`, <br />])
								.flat()}
							<br />
							Would you like ESGST to automatically enable these features now if they're not already
							enabled?
						</fragment>,
						() => this.enableDependencies(feature.dependencies, 'sg')
					);
				}
			};
			sgSwitch.onDisabled = () => {
				if (feature.permissions) {
					delete this.requiredPermissions[featureId];
				}
				this.loadFeatureDetails(id, numberPath, popup && popup.scrollable.offsetTop);
				if (feature.sgFeatureSwitch) {
					feature.sgFeatureSwitch.disable();
				} else {
					this.preSave(`${featureId}_sg`, false);
				}
				if (!feature.stSwitch || !feature.stSwitch.value) {
					this.collapseSection(collapseButton, id, subMenu);
					isExpanded = false;
				}
			};
		}
		if (feature.st && (Settings.get('esgst_st') || featureId === 'esgst')) {
			const value = (
				Settings.getFull(`${featureId}_st`) ||
				Shared.common.getFeaturePath(feature, featureId, 'st')
			).enabled;
			if (value) {
				isHidden = false;
			}
			stContext = <div></div>;
			const stSwitch = new ToggleSwitch(stContext, null, true, `[ST]`, false, true, null, value);
			feature.stSwitch = stSwitch;
			stSwitch.onEnabled = () => {
				if (feature.extensionOnly && browser.gm) {
					stSwitch.disable(true);
					this.showExtensionOnlyPopup();
					return;
				}
				if (feature.conflicts) {
					for (const conflictId of feature.conflicts) {
						const setting = Settings.getFull(`${conflictId}_st`);
						if (typeof setting === 'object' ? setting.enabled : setting) {
							stSwitch.disable(true);
							new Popup({
								addScrollable: true,
								icon: 'fa-exclamation',
								isTemp: true,
								title: `This feature conflicts with ${Shared.common.getFeatureName(
									null,
									conflictId
								)}. While that feature is enabled, this feature cannot be enabled.`,
							}).open();
							return;
						}
					}
				}
				if (feature.permissions) {
					this.requiredPermissions[featureId] = feature.permissions;
				}
				this.loadFeatureDetails(id, numberPath, popup && popup.scrollable.offsetTop);
				if (feature.stFeatureSwitch) {
					feature.stFeatureSwitch.enable();
				} else {
					this.preSave(`${featureId}_st`, true);
				}
				if (subMenu.classList.contains('esgst-hidden')) {
					this.expandSection(collapseButton, id, subMenu);
					isExpanded = true;
				}
				if (feature.dependencies) {
					Shared.common.createConfirmation(
						<fragment>
							This feature depends on the following features to work properly: <br />
							<br />
							{feature.dependencies
								.map((x) => [`"${Shared.common.getFeatureName(null, x)}"`, <br />])
								.flat()}
							<br />
							Would you like ESGST to automatically enable these features now if they're not already
							enabled?
						</fragment>,
						() => this.enableDependencies(feature.dependencies, 'st')
					);
				}
			};
			stSwitch.onDisabled = () => {
				if (feature.permissions) {
					delete this.requiredPermissions[featureId];
				}
				this.loadFeatureDetails(id, numberPath, popup && popup.scrollable.offsetTop);
				if (feature.stFeatureSwitch) {
					feature.stFeatureSwitch.disable();
				} else {
					this.preSave(`${featureId}_st`, false);
				}
				if (!feature.sgSwitch || !feature.sgSwitch.value) {
					this.collapseSection(collapseButton, id, subMenu);
					isExpanded = false;
				}
			};
		}
		let featureName;
		if (feature.customName) {
			featureName = feature.customName();
			this.replaceFeatureNamePlaceholders(featureName);
		} else {
			featureName = feature.name.replace(
				/\[id=(.+?)]/g,
				Shared.common.getFeatureName.bind(Shared.common)
			);
		}
		DOM.insert(
			menu,
			'beforeend',
			<span className="esgst-sm-feature-name">
				{sgContext && sgContext.firstElementChild}
				{stContext && stContext.firstElementChild}
				<a
					className="esgst-settings-feature table__column__secondary-link esgst-clickable"
					data-id={id}
					data-number={numberPath}
				>
					{featureName}
				</a>
			</span>
		);
		DOM.insert(
			menuContainer,
			'beforeend',
			<div
				className={`esgst-form-row-indent SMFeatures ${isHidden ? 'esgst-hidden' : ''}`}
				ref={(ref) => (subMenu = ref)}
			></div>
		);
		if (feature.features) {
			let i = 1;
			let isNew = false;
			for (const subId in feature.features) {
				if (!feature.features.hasOwnProperty(subId)) {
					continue;
				}
				const subFt = feature.features[subId];
				if (!subFt.sg && subFt.st && !Settings.get('esgst_st') && featureId !== 'esgst') {
					continue;
				}
				const subFeature = this.getSMFeature(subFt, subId, i, `${numberPath}.${i}`, popup);
				if (subFeature) {
					if (subFeature.isNew) {
						isNew = true;
					}
					subMenu.appendChild(subFeature.menu);
					i += 1;
				}
			}
			isMainNew = isMainNew || isNew;
			if (isNew) {
				Shared.common.createElements(menu.firstElementChild, 'afterend', [
					{
						attributes: {
							class: 'esgst-bold esgst-red esgst-new-indicator',
							title: 'There is a new feature/option in this section',
						},
						type: 'span',
						children: [
							{
								attributes: {
									class: 'fa fa-star',
								},
								type: 'i',
							},
						],
					},
				]);
			}
			if (Settings.get('makeSectionsCollapsible')) {
				collapseButton = Shared.common.createElements(menu, 'afterbegin', [
					{
						attributes: {
							class: 'esgst-clickable',
							style: `margin-right: 5px;`,
						},
						type: 'span',
						children: [
							{
								attributes: {
									class: `fa fa-${Settings.get(`collapse_${id}`) ? 'plus' : 'minus'}-square`,
									title: `${Settings.get(`collapse_${id}`) ? 'Expand' : 'Collapse'} options`,
								},
								type: 'i',
							},
						],
					},
				]);
				if (Settings.get(`collapse_${id}`)) {
					subMenu.classList.add('esgst-hidden');
					isExpanded = false;
				} else {
					isExpanded = true;
				}
				this.collapseButtons.push({ collapseButton, id, subMenu });
				collapseButton.addEventListener(
					'click',
					() => (isExpanded = this.collapseOrExpandSection(collapseButton, id, subMenu, isExpanded))
				);
			}
		} else if (Settings.get('makeSectionsCollapsible')) {
			menuContainer.style.marginLeft = '17px';
		}
		return {
			isNew: isMainNew,
			menu: menuContainer,
		};
	}

	resetColor(hexInput, alphaInput, id, colorId) {
		const color = Utils.rgba2Hex(Settings.defaultValues[`${id}_${colorId}`]);
		hexInput.value = color.hex;
		alphaInput.value = color.alpha;
		this.preSave(`${id}_${colorId}`, Utils.hex2Rgba(hexInput.value, alphaInput.value));
	}

	getSmFeatureAdditionalOptions(Feature, ID) {
		let items = [];
		if (ID.startsWith('gc_')) {
			if (Feature.isCategory) {
				items.push(this.addGcCategoryPanel(ID, Feature));
			}
			if (ID === 'gc_r') {
				items.push(this.addGcRatingPanel());
			} else if (ID === 'gc_o_a') {
				items.push(this.addGcAltMenuPanel());
			}
		}
		if (ID === 'ul') {
			items.push(this.addUlMenuPanel('ul_links'));
		} else if (ID === 'cgb') {
			items.push(this.addGwcrMenuPanel('cgb_levelColors', 'level', false, '10'));
		} else if (ID === 'gch') {
			items.push(this.addGwcrMenuPanel('gch_colors', 'copies', true));
		} else if (ID === 'glh') {
			items.push(this.addGwcrMenuPanel('glh_colors', 'level', true, '10'));
		} else if (ID === 'gwc') {
			items.push(this.addGwcrMenuPanel('gwc_colors', 'chance'));
		} else if (ID === 'gwr') {
			items.push(this.addGwcrMenuPanel('gwr_colors', 'ratio'));
		} else if (ID === 'gptw') {
			items.push(this.addGwcrMenuPanel('gptw_colors', 'points to win'));
		} else if (ID === 'geth') {
			items.push(this.addGwcrMenuPanel('geth_colors', 'hours'));
		} else if (Feature.colors || Feature.background) {
			if (typeof Feature.background === 'boolean') {
				Feature.colors = {
					bgColor: 'Background',
				};
			} else if (typeof Feature.colors === 'boolean') {
				Feature.colors = {
					color: 'Text',
					bgColor: 'Background',
				};
			}
			const children = [];
			for (const id in Feature.colors) {
				const color = Utils.rgba2Hex(Settings.get(`${ID}_${id}`));
				children.push(
					<fragment>
						<div>
							<strong>{`${Feature.colors[id]}:`}</strong>
						</div>
						<div>
							<input data-color-id={id} type="color" value={color.hex} />
							Opacity:
							<input max="1.0" min="0.0" step="0.1" type="number" value={color.alpha} />
							<div className="form__saving-button">Reset</div>
						</div>
					</fragment>
				);
			}
			const context = <div className="esgst-sm-additional-option">{children}</div>;
			const elements = context.querySelectorAll(`[data-color-id]`);
			for (const hexInput of elements) {
				const colorId = hexInput.getAttribute('data-color-id');
				const alphaInput = hexInput.nextElementSibling;
				this.addColorObserver(hexInput, alphaInput, ID, colorId);
				alphaInput.nextElementSibling.addEventListener(
					'click',
					this.resetColor.bind(this, hexInput, alphaInput, ID, colorId)
				);
			}
			items.push(context);
			if (ID === 'gc_g') {
				let input;
				const inputContainer = (
					<div className="esgst-sm-additional-option">
						<div>Only show the following genres:</div>
						<div>
							<input
								type="text"
								value={Settings.get('gc_g_filters')}
								ref={(ref) => (input = ref)}
							/>
							<i
								className="fa fa-question-circle"
								title="If you enter genres here, a genre category will only appear if the game has the listed genre. Separate genres with a comma, for example: Genre1, Genre2"
							></i>
						</div>
					</div>
				);
				Shared.common.observeChange(input, 'gc_g_filters', this.toSave);
				items.push(inputContainer);
				items.push(this.addGcMenuPanel());
			}
		} else if (Feature.inputItems) {
			let containerr = <div className="esgst-sm-additional-option"></div>;
			if (ID.match(/^(chfl|sk_)/)) {
				Feature.inputItems = [
					{
						event: 'keydown',
						id: Feature.inputItems,
						shortcutKey: true,
						prefix: `Enter the key combo you want to use for this task: `,
					},
				];
			} else if (ID.match(/^hr_.+_s$/)) {
				Feature.inputItems = [
					{
						id: `${ID}_sound`,
						play: true,
					},
				];
			}
			Feature.inputItems.forEach((item) => {
				const children = [];
				const attributes = item.attributes || {};
				if (item.play) {
					attributes.style = `width: 200px`;
					attributes.type = 'file';
					children.push(
						{
							attributes,
							type: 'input',
						},
						{
							attributes: {
								class: 'fa fa-play-circle esgst-clickable',
							},
							type: 'i',
						}
					);
				} else {
					attributes.class = 'esgst-switch-input esgst-switch-input-large';
					attributes.type = attributes.type || 'text';
					attributes.value = Settings.get(item.id);
					children.push(
						{
							text: item.prefix || '',
							type: 'node',
						},
						{
							attributes,
							type: 'input',
						},
						{
							text: item.suffix || '',
							type: 'node',
						}
					);
					if (item.tooltip) {
						children.push({
							attributes: {
								class: 'fa fa-question-circle',
								title: item.tooltip,
							},
							type: 'i',
						});
					}
				}
				let input,
					value = '',
					context = Shared.common.createElements(containerr, 'beforeend', [
						{
							type: 'div',
							children,
						},
					]);
				input = context.firstElementChild;
				if (item.play) {
					input.nextElementSibling.addEventListener('click', async () =>
						(
							await Shared.esgst.modules.generalHeaderRefresher.createPlayer(
								Settings.get(item.id) ||
									Shared.esgst.modules.generalHeaderRefresher.getDefaultSound()
							)
						).play()
					);
				}
				if (
					typeof Settings.get(item.id) === 'undefined' &&
					Settings.get('dismissedOptions').indexOf(item.id) < 0
				) {
					Feature.isNew = true;
					Shared.common
						.createElements(context, 'afterbegin', [
							{
								attributes: {
									class: 'esgst-bold esgst-red esgst-clickable esgst-new-indicator',
									title: 'This is a new feature/option. Click to dismiss.',
								},
								text: `[NEW]`,
								type: 'span',
							},
						])
						.addEventListener('click', (event) => this.dismissNewOption(item.id, event));
				}
				input.addEventListener(
					item.event || 'change',
					(event) => {
						if (item.shortcutKey) {
							event.preventDefault();
							event.stopPropagation();
							if (!event.repeat) {
								value = '';
								if (event.ctrlKey) {
									value += 'ctrlKey + ';
								} else if (event.shiftKey) {
									value += 'shiftKey + ';
								} else if (event.altKey) {
									value += 'altKey + ';
								}
								value += event.key.toLowerCase();
							}
						} else if (item.play) {
							this.readHrAudioFile(ID, event);
						} else if (item.event === 'keydown') {
							event.preventDefault();
							// noinspection JSIgnoredPromiseFromCall
							this.preSave(item.id, event.key);
							input.value = event.key;
						} else {
							// noinspection JSIgnoredPromiseFromCall
							this.preSave(item.id, input.value);
						}
					},
					item.shortcutKey || false
				);
				if (item.shortcutKey) {
					input.addEventListener('keyup', () => {
						// noinspection JSIgnoredPromiseFromCall
						this.preSave(item.id, value);
						input.value = value;
					});
				}
			});
			items.push(containerr);
		}
		if (Feature.options) {
			const [key, options] = Array.isArray(Feature.options)
				? ['_index_*', Feature.options]
				: ['_index', [Feature.options]];
			for (const [index, option] of options.entries()) {
				const currentKey = key.replace(/\*/, index);
				const selectedIndex = Settings.get(`${ID}${currentKey}`);
				const children = [];
				for (const value of option.values) {
					children.push(
						value.match(/~/) ? (
							<option disabled={true}>{value.replace(/~/, '')}</option>
						) : (
							<option>{value}</option>
						)
					);
				}
				let select;
				const selectContainer = (
					<div className="esgst-sm-additional-option">
						<div>
							{option.title}
							<select ref={(ref) => (select = ref)}>{children}</select>
						</div>
					</div>
				);
				select.selectedIndex = selectedIndex;
				Shared.common.observeNumChange(select, `${ID}${currentKey}`, this.toSave, 'selectedIndex');
				items.push(selectContainer);
			}
		}
		return items;
	}

	readHrAudioFile(id, event) {
		let popup = new Popup({
			addScrollable: true,
			icon: 'fa-circle-o-notch fa-spin',
			title: 'Uploading...',
		});
		popup.open();
		try {
			let reader = new FileReader();
			reader.onload = () => this.saveHrFile(id, popup, reader);
			reader.readAsArrayBuffer(event.currentTarget.files[0]);
		} catch (e) {
			Logger.warning(e.message, e.stack);
			popup.icon.classList.remove('fa-circle-o-notch');
			popup.icon.classList.remove('fa-spin');
			popup.icon.classList.add('fa-times');
			popup.title.textContent = 'An error happened.';
		}
	}

	async saveHrFile(id, popup, reader) {
		try {
			let bytes = new Uint8Array(reader.result);
			let binary = '';
			for (let i = 0, n = reader.result.byteLength; i < n; i++) {
				binary += String.fromCharCode(bytes[i]);
			}
			let string = window.btoa(binary);
			(await Shared.esgst.modules.generalHeaderRefresher.createPlayer(string)).play();
			// noinspection JSIgnoredPromiseFromCall
			this.preSave(`${id}_sound`, string);
			popup.close();
		} catch (e) {
			Logger.warning(e.message, e.stack);
			popup.icon.classList.remove('fa-circle-o-notch');
			popup.icon.classList.remove('fa-spin');
			popup.icon.classList.add('fa-times');
			popup.title.textContent = 'An error happened.';
		}
	}

	addGwcrMenuPanel(id, key, background, upper = '100') {
		let button;
		const panel = (
			<div className="esgst-sm-additional-option">
				<div>
					<div className="form__saving-button" ref={(ref) => (button = ref)}>
						<span>Add Color Setting</span>
					</div>
					<i
						className="fa fa-question-circle"
						title={`Allows you to set different colors for different ${key} ranges.`}
					></i>
				</div>
			</div>
		);
		for (let i = 0, n = Settings.get(id).length; i < n; ++i) {
			this.addGwcColorSetting(Settings.get(id)[i], id, key, panel, background);
		}
		button.addEventListener('click', () => {
			const colors = {
				color: '#ffffff',
				lower: '0',
				upper: upper,
			};
			if (background) {
				colors.bgColor = '';
			}
			const setting = Settings.get(id);
			setting.push(colors);
			this.preSave(id, setting);
			this.addGwcColorSetting(colors, id, key, panel, background);
		});
		return panel;
	}

	addGwcColorSetting(colors, id, key, panel, background) {
		let bgColor, color, i, lower, n, remove, setting, upper;
		setting = Shared.common.createElements(panel, 'beforeend', [
			{
				type: 'div',
				children: [
					{
						text: `From: `,
						type: 'node',
					},
					{
						attributes: {
							step: '0.01',
							type: 'number',
							value: colors.lower,
						},
						type: 'input',
					},
					{
						text: ' to ',
						type: 'node',
					},
					{
						attributes: {
							step: '0.01',
							type: 'number',
							value: colors.upper,
						},
						type: 'input',
					},
					{
						text: ` ${key}, color it as `,
						type: 'node',
					},
					{
						attributes: {
							type: 'color',
							value: colors.color,
						},
						type: 'input',
					},
					...(background
						? [
								{
									text: ' with the background ',
									type: 'node',
								},
								{
									attributes: {
										type: 'color',
										value: colors.bgColor,
									},
									type: 'input',
								},
						  ]
						: []),
					{
						attributes: {
							class: 'esgst-clickable fa fa-times',
							title: 'Delete this setting',
						},
						type: 'i',
					},
				],
			},
		]);
		lower = setting.firstElementChild;
		upper = lower.nextElementSibling;
		color = upper.nextElementSibling;
		if (background) {
			bgColor = color.nextElementSibling;
			remove = bgColor.nextElementSibling;
		} else {
			remove = color.nextElementSibling;
		}
		lower.addEventListener('change', () => {
			colors.lower = lower.value;
			this.preSave(id, Settings.get(id));
		});
		upper.addEventListener('change', () => {
			colors.upper = upper.value;
			this.preSave(id, Settings.get(id));
		});
		color.addEventListener('change', () => {
			colors.color = color.value;
			this.preSave(id, Settings.get(id));
		});
		if (bgColor) {
			bgColor.addEventListener('change', () => {
				colors.bgColor = bgColor.value;
				this.preSave(id, Settings.get(id));
			});
		}
		remove.addEventListener('click', () => {
			if (window.confirm('Are you sure you want to delete this setting?')) {
				const gwcsetting = Settings.get(id);
				for (i = 0, n = gwcsetting.length; i < n && gwcsetting[i] !== colors; ++i) {}
				if (i < n) {
					gwcsetting.splice(i, 1);
					this.preSave(id, gwcsetting);
					setting.remove();
				}
			}
		});
	}

	addUlMenuPanel(id) {
		let draggableArea;
		const panel = (
			<fragment>
				<div className="esgst-sm-additional-option" ref={(ref) => (draggableArea = ref)}></div>
				<div className="esgst-sm-additional-option">
					<div>
						<div
							className="form__saving-button"
							onclick={() => this.addUlMenuItem(id, draggableArea)}
						>
							<span>Add Link</span>
						</div>
						<div
							className="form__saving-button"
							onclick={() => {
								this.preSave(id, Settings.defaultValues[id]);
								draggableArea.innerHTML = '';
								this.addUlMenuItems(id, draggableArea);
							}}
						>
							<span>Reset</span>
						</div>
						<div
							className="form__saving-button"
							title="This will merge your list with the default list, meaning that any new items in the default list will be added to your list. Also, if you previously deleted an item from the default list, it will come back."
							onclick={() => this.mergeValues(id, draggableArea, this.addUlMenuItems.bind(this))}
						>
							<span>Merge</span>
						</div>
					</div>
					<div>
						<div className="form__input-description">
							The default links should give you an idea of how the format works.
							<br />
							<br />
							As label, you can use FontAwesome icons (for example, "fa-icon"), image URLs (for
							example, "https://www.example.com/image.jpg") and plain text (for example, "Text").
							You can also combine them (for example, "fa-icon https://www.example.com/image.jpg
							Text"). Images will be resized to 16x16.
							<br />
							<br />
							In the URL, you can use the templates %username% and %steamid%, they will be replaced
							with the user's username/Steam id.`
						</div>
					</div>
				</div>
			</fragment>
		);
		Shared.common.draggable_set({
			addTrash: true,
			context: draggableArea,
			id: 'ul_links',
			item: {},
			onDragEnd: (obj) => {
				for (const key in obj) {
					this.preSave(key, obj[key]);
				}
			},
		});
		this.addUlMenuItems(id, draggableArea);
		return panel;
	}

	mergeValues(id, draggableArea, callback) {
		const setting = Settings.get(id);
		for (const item of Settings.defaultValues[id]) {
			const itemString = JSON.stringify(item);
			if (!setting.filter((x) => JSON.stringify(x) === itemString)[0]) {
				setting.push(item);
			}
		}
		this.preSave(id, setting);
		draggableArea.innerHTML = '';
		if (callback) {
			callback(id, draggableArea);
		}
	}

	addUlMenuItems(id, draggableArea) {
		for (const [i, link] of Settings.get(id).entries()) {
			this.addUlLink(i, id, link, draggableArea);
		}
	}

	addUlMenuItem(id, draggableArea) {
		const link = {
			label: '',
			url: '',
		};
		const setting = Settings.get(id);
		setting.push(link);
		this.preSave(id, setting);
		this.addUlLink(setting.length - 1, id, link, draggableArea);
	}

	addUlLink(i, id, link, draggableArea) {
		let setting;
		DOM.insert(
			draggableArea,
			'beforeend',
			<div
				data-draggable-id={i}
				data-draggable-obj={JSON.stringify(link)}
				ref={(ref) => (setting = ref)}
			>
				Label:
				<input
					onchange={(event) => {
						link.label = event.currentTarget.value;
						this.preSave(id, Settings.get(id));
						setting.setAttribute('data-draggable-obj', JSON.stringify(link));
					}}
					type="text"
					value={link.label}
				/>
				URL:
				<input
					onchange={(event) => {
						link.url = event.currentTarget.value;
						this.preSave(id, Settings.get(id));
						setting.setAttribute('data-draggable-obj', JSON.stringify(link));
					}}
					type="text"
					value={link.url}
				/>
			</div>
		);
		Shared.common.draggable_set({
			addTrash: true,
			context: draggableArea,
			id: 'ul_links',
			item: {},
			onDragEnd: (obj) => {
				for (const key in obj) {
					this.preSave(key, obj[key]);
				}
			},
		});
	}

	addGcCategoryPanel(id, feature) {
		let showField;
		let labelField;
		let labelInfoNode;
		let iconField;
		let iconInfoNode;
		let urlField;
		let urlInfoNode;
		const panel = (
			<div className="esgst-sm-additional-option">
				{feature.allowCustomDisplay ? (
					<div>
						<strong>Show:</strong>
						<select
							onchange={(event) => {
								switch (event.currentTarget.value) {
									case 'label':
										this.preSave(`${id}_s`, false);
										this.preSave(`${id}_s_i`, false);
										labelField.classList.remove('esgst-hidden');
										if (id === 'gc_rd') {
											labelInfoNode.classList.remove('esgst-hidden');
										}
										iconField.classList.add('esgst-hidden');
										iconInfoNode.classList.add('esgst-hidden');
										break;
									case 'initials':
										this.preSave(`${id}_s`, true);
										this.preSave(`${id}_s_i`, false);
										labelField.classList.add('esgst-hidden');
										labelInfoNode.classList.add('esgst-hidden');
										iconField.classList.add('esgst-hidden');
										iconInfoNode.classList.add('esgst-hidden');
										break;
									case 'icon':
										this.preSave(`${id}_s`, true);
										this.preSave(`${id}_s_i`, true);
										labelField.classList.add('esgst-hidden');
										labelInfoNode.classList.add('esgst-hidden');
										iconField.classList.remove('esgst-hidden');
										iconInfoNode.classList.remove('esgst-hidden');
										break;
								}
							}}
							ref={(ref) => (showField = ref)}
						>
							<option value="label">Label</option>
							<option value="initials">Initials</option>
							<option value="icon">Icon</option>
						</select>
						<input
							className="esgst-hidden"
							type="text"
							value={Settings.get(`${id}Label`)}
							ref={(ref) => (labelField = ref)}
						/>
						<i
							className="esgst-clickable esgst-hidden fa fa-question-circle"
							ref={(ref) => (labelInfoNode = ref)}
						></i>
						<input
							className="esgst-hidden"
							type="text"
							value={Settings.get(`${id}Icon`)}
							ref={(ref) => (iconField = ref)}
						/>
						<i
							className="esgst-clickable esgst-hidden fa fa-question-circle"
							ref={(ref) => (iconInfoNode = ref)}
						></i>
					</div>
				) : null}
				<div>
					<strong>URL:</strong>
					<input type="text" value={Settings.get(`${id}Url`)} ref={(ref) => (urlField = ref)} />
					<i
						className="esgst-clickable fa fa-question-circle"
						ref={(ref) => (urlInfoNode = ref)}
					></i>
				</div>
			</div>
		);
		if (feature.allowCustomDisplay) {
			Shared.common.createTooltip(
				labelInfoNode,
				`Enter the date format here, using the following keywords:
			<br/>
			<br/>
			DD - Day<br/>
			MM - Month in numbers (i.e. 1)<br/>
			Mon - Month in short name (i.e. Jan)<br/>
			Month - Month in full name (i.e. January)<br/>
			YYYY - Year`
			);
			Shared.common.createTooltip(
				iconInfoNode,
				'The name of the icon must be any name in this page: <a href="https://fontawesome.com/v4.7.0/icons/">https://fontawesome.com/v4.7.0/icons/</a>'
			);
		}
		Shared.common.createTooltip(
			urlInfoNode,
			`You can use the following placeholders here:
			<br/>
			<span class="esgst-bold">%steam-id%</span> - Your Steam ID.<br/>
			<span class="esgst-bold">%username%</span> - Your username.<br/>
			<span class="esgst-bold">%game-type%</span> - The type of the game e.g. "app" or "sub".<br/>
			<span class="esgst-bold">%game-id%</span> - The Steam ID of the game.<br/>
			<span class="esgst-bold">%game-name%</span> - The name of the game.<br/>
			<span class="esgst-bold">%game-search-name%</span> - The name of the game as a URI encoded string, useful for search URLs.<br/>
			<span class="esgst-bold">%hltb-id%</span> - The HLTB ID of the game.<br/>`
		);
		if (feature.allowCustomDisplay) {
			if (Settings.get(`${id}_s`)) {
				if (Settings.get(`${id}_s_i`)) {
					showField.selectedIndex = 2;
					iconField.classList.remove('esgst-hidden');
					iconInfoNode.classList.remove('esgst-hidden');
				} else {
					showField.selectedIndex = 1;
				}
			} else {
				showField.selectedIndex = 0;
				labelField.classList.remove('esgst-hidden');
				if (id === 'gc_rd') {
					labelInfoNode.classList.remove('esgst-hidden');
				}
			}
			Shared.common.observeChange(labelField, `${id}Label`, this.toSave);
			Shared.common.observeChange(iconField, `${id}Icon`, this.toSave);
		}
		Shared.common.observeChange(urlField, `${id}Url`, this.toSave);
		return panel;
	}

	addGcRatingPanel() {
		let button;
		const panel = (
			<div className="esgst-sm-additional-option">
				<div>
					<div className="form__saving-button" ref={(ref) => (button = ref)}>
						<span>Add Rating Setting</span>
					</div>
					<i
						className="fa fa-question-circle"
						title="Allows you to set different colors/icons for different rating ranges."
					></i>
				</div>
			</div>
		);
		for (let i = 0, n = Settings.get('gc_r_colors').length; i < n; ++i) {
			this.addGcRatingColorSetting(Settings.get('gc_r_colors')[i], panel);
		}
		button.addEventListener('click', () => {
			let colors = {
				color: '',
				bgColor: '',
				icon: '',
				lower: '',
				upper: '',
			};
			const setting = Settings.get('gc_r_colors');
			setting.push(colors);
			this.preSave('gc_r_colors', setting);
			this.addGcRatingColorSetting(colors, panel);
		});
		return panel;
	}

	addGcRatingColorSetting(colors, panel) {
		let setting, lower, upper, color, bgColor, icon, tooltip, remove;
		DOM.insert(
			panel,
			'beforeend',
			<div className="esgst-sm-additional-option" ref={(ref) => (setting = ref)}>
				<div>
					Rating Range:
					<input type="number" value={colors.lower} ref={(ref) => (lower = ref)} />% -
					<input type="number" value={colors.upper} ref={(ref) => (upper = ref)} />%
				</div>
				<div>
					Color:
					<input type="color" value={colors.color} ref={(ref) => (color = ref)} />
					Background Color:
					<input type="color" value={colors.bgColor} ref={(ref) => (bgColor = ref)} />
					Icon:
					<input type="text" value={colors.icon} ref={(ref) => (icon = ref)} />
					<i className="fa fa-question-circle" ref={(ref) => (tooltip = ref)}></i>
				</div>
				<div>
					<div className="form__saving-button" ref={(ref) => (remove = ref)}>
						<span>Delete</span>
					</div>
				</div>
			</div>
		);
		Shared.common.createTooltip(
			tooltip,
			`The name of the icon can be any name from <a href="https://fontawesome.com/v4.7.0/icons/">FontAwesome</a> or any text. For example, if you want to use alt symbols like ▲ (Alt + 3 + 0) and ▼ (Alt + 3 + 1), you can.`
		);
		lower.addEventListener('change', () => {
			colors.lower = lower.value;
			this.preSave('gc_r_colors', Settings.get('gc_r_colors'));
		});
		upper.addEventListener('change', () => {
			colors.upper = upper.value;
			this.preSave('gc_r_colors', Settings.get('gc_r_colors'));
		});
		color.addEventListener('change', () => {
			colors.color = color.value;
			this.preSave('gc_r_colors', Settings.get('gc_r_colors'));
		});
		bgColor.addEventListener('change', () => {
			colors.bgColor = bgColor.value;
			this.preSave('gc_r_colors', Settings.get('gc_r_colors'));
		});
		icon.addEventListener('change', () => {
			colors.icon = icon.value;
			this.preSave('gc_r_colors', Settings.get('gc_r_colors'));
		});
		remove.addEventListener('click', () => {
			if (window.confirm('Are you sure you want to delete this setting?')) {
				let i, n;
				const colorSetting = Settings.get('gc_r_colors');
				for (i = 0, n = colorSetting.length; i < n && colorSetting[i] !== colors; ++i) {}
				if (i < n) {
					colorSetting.splice(i, 1);
					this.preSave('gc_r_colors', colorSetting);
					setting.remove();
				}
			}
		});
	}

	addGcMenuPanel() {
		let button, colorSetting, i, n;
		const panel = (
			<div className="esgst-sm-additional-option">
				<div>
					<div className="form__saving-button" ref={(ref) => (button = ref)}>
						<span>Add Custom Genre Setting</span>
					</div>
					<i
						className="fa fa-question-circle"
						title="Allows you to color genres (colored genres will appear at the beginning of the list)."
					></i>
				</div>
			</div>
		);
		for (i = 0, n = Settings.get('gc_g_colors').length; i < n; ++i) {
			this.addGcColorSetting(Settings.get('gc_g_colors')[i], panel);
		}
		button.addEventListener('click', () => {
			colorSetting = {
				bgColor: '#7f8c8d',
				color: '#ffffff',
				genre: '',
			};
			const gcgcolors = Settings.get('gc_g_colors');
			gcgcolors.push(colorSetting);
			this.preSave('gc_g_colors', gcgcolors);
			this.addGcColorSetting(colorSetting, panel);
		});
		return panel;
	}

	addGcColorSetting(colorSetting, panel) {
		let bgColor, color, genre, i, n, remove, setting;
		DOM.insert(
			panel,
			'beforeend',
			<div className="esgst-sm-additional-option" ref={(ref) => (setting = ref)}>
				<div>
					Genre:
					<input type="text" value={colorSetting.genre} ref={(ref) => (genre = ref)} />
				</div>
				<div>
					Color:
					<input type="color" value={colorSetting.color} ref={(ref) => (color = ref)} />
					Background Color:
					<input type="color" value={colorSetting.bgColor} ref={(ref) => (bgColor = ref)} />
				</div>
				<div>
					<div className="form__saving-button" ref={(ref) => (remove = ref)}>
						<span>Delete</span>
					</div>
				</div>
			</div>
		);
		genre.addEventListener('change', () => {
			colorSetting.genre = genre.value;
			this.preSave('gc_g_colors', Settings.get('gc_g_colors'));
		});
		color.addEventListener('change', () => {
			colorSetting.color = color.value;
			this.preSave('gc_g_colors', Settings.get('gc_g_colors'));
		});
		bgColor.addEventListener('change', () => {
			colorSetting.bgColor = bgColor.value;
			this.preSave('gc_g_colors', Settings.get('gc_g_colors'));
		});
		remove.addEventListener('click', () => {
			if (window.confirm('Are you sure you want to delete this setting?')) {
				const gcgcolors = Settings.get('gc_g_colors');
				for (i = 0, n = gcgcolors.length; i < n && gcgcolors[i] !== colorSetting; ++i) {}
				if (i < n) {
					gcgcolors.splice(i, 1);
					Settings.set('gc_g_colors', gcgcolors);
					this.preSave('gc_g_colors', Settings.get('gc_g_colors'));
					setting.remove();
				}
			}
		});
	}

	addGcAltMenuPanel() {
		let altSetting, button, i, n;
		const panel = (
			<div className="esgst-sm-additional-option">
				<div>
					<div className="form__saving-button" ref={(ref) => (button = ref)}>
						<span>Add Alt Account</span>
					</div>
				</div>
			</div>
		);
		Shared.common.createTooltip(
			Shared.common.createElements(panel.firstElementChild, 'beforeend', [
				{
					attributes: {
						class: 'fa fa-question-circle',
					},
					type: 'i',
				},
			]),
			`
		<div>You must sync your owned games normally for the script to pick up the games owned by your alt accounts. Syncing with alt accounts only works with a Steam API Key though, so make sure one is set at the last section of this menu.</div>
		<br/>
		<div>Steam ID is the number that comes after "steamcommunity.com/profiles/" in your alt account's URL. If your alt account has a URL in the format "steamcommunity.com/id/" though, you can get your Steam ID <a href="https://steamid.io/">here</a> by entering your URL in the input (you want the steamID64 one).</div>
		<br/>
		<div>You must fill the fields relative to your settings. For example, if you have simplified version enabled with icons, you must fill the "icon" field. If you don't have simplified version enabled, you must fill the "label" field. The current text in the fields are simply placeholders.</div>
	`
		);
		for (i = 0, n = Settings.get('gc_o_altAccounts').length; i < n; ++i) {
			this.addGcAltSetting(Settings.get('gc_o_altAccounts')[i], panel);
		}
		button.addEventListener('click', () => {
			altSetting = {
				bgColor: '#000000',
				color: '#ffffff',
				games: {
					apps: {},
					subs: {},
				},
				icon: '',
				label: '',
				name: '',
				steamId: '',
			};
			const gcoalt = Settings.get('gc_o_altAccounts');
			gcoalt.push(altSetting);
			this.preSave('gc_o_altAccounts', gcoalt);
			this.addGcAltSetting(altSetting, panel);
		});
		return panel;
	}

	addGcAltSetting(altSetting, panel) {
		let color, bgColor, i, icon, label, n, name, remove, setting, steamId;
		DOM.insert(
			panel,
			'beforeend',
			<div className="esgst-sm-additional-option" ref={(ref) => (setting = ref)}>
				<div>
					Steam ID:
					<input
						type="text"
						placeholder="0000000000000000"
						value={altSetting.steamId}
						ref={(ref) => (steamId = ref)}
					/>
					Nickname:
					<input
						type="text"
						placeholder="alt1"
						value={altSetting.name}
						ref={(ref) => (name = ref)}
					/>
				</div>
				<div>
					Color:
					<input type="color" value={altSetting.color} ref={(ref) => (color = ref)} />
					Background Color:
					<input type="color" value={altSetting.bgColor} ref={(ref) => (bgColor = ref)} />
				</div>
				<div>
					Icon:
					<input
						type="text"
						placeholder="folder"
						value={altSetting.icon}
						ref={(ref) => (icon = ref)}
					/>
					Label:
					<input
						type="text"
						placeholder="Owned by alt1"
						value={altSetting.label}
						ref={(ref) => (label = ref)}
					/>
				</div>
				<div>
					<div className="form__saving-button" ref={(ref) => (remove = ref)}>
						<span>Delete</span>
					</div>
				</div>
			</div>
		);
		steamId.addEventListener('change', () => {
			altSetting.steamId = steamId.value;
			this.preSave('gc_o_altAccounts', Settings.get('gc_o_altAccounts'));
		});
		name.addEventListener('change', () => {
			altSetting.name = name.value;
			this.preSave('gc_o_altAccounts', Settings.get('gc_o_altAccounts'));
		});
		color.addEventListener('change', () => {
			altSetting.color = color.value;
			this.preSave('gc_o_altAccounts', Settings.get('gc_o_altAccounts'));
		});
		bgColor.addEventListener('change', () => {
			altSetting.bgColor = bgColor.value;
			this.preSave('gc_o_altAccounts', Settings.get('gc_o_altAccounts'));
		});
		icon.addEventListener('change', () => {
			altSetting.icon = icon.value;
			this.preSave('gc_o_altAccounts', Settings.get('gc_o_altAccounts'));
		});
		label.addEventListener('change', () => {
			altSetting.label = label.value;
			this.preSave('gc_o_altAccounts', Settings.get('gc_o_altAccounts'));
		});
		remove.addEventListener('click', () => {
			if (window.confirm('Are you sure you want to delete this setting?')) {
				const gcoalt = Settings.get('gc_o_altAccounts');
				for (i = 0, n = gcoalt.length; i < n && gcoalt[i] !== altSetting; ++i) {}
				if (i < n) {
					gcoalt.splice(i, 1);
					this.preSave('gc_o_altAccounts', gcoalt);
					setting.remove();
				}
			}
		});
	}

	addColorObserver(hexInput, alphaInput, id, colorId) {
		hexInput.addEventListener('change', () => {
			// noinspection JSIgnoredPromiseFromCall
			this.preSave(`${id}_${colorId}`, Utils.hex2Rgba(hexInput.value, alphaInput.value));
		});
		alphaInput.addEventListener('change', () => {
			// noinspection JSIgnoredPromiseFromCall
			this.preSave(`${id}_${colorId}`, Utils.hex2Rgba(hexInput.value, alphaInput.value));
		});
	}

	createMenuSection(context, html, number, title, type) {
		let section = Shared.common.createElements(context, 'beforeend', [
			{
				attributes: {
					class: 'esgst-form-row',
					id: `esgst_${type}`,
					'data-id': type,
					'data-number': number,
				},
				type: 'div',
				children: [
					{
						attributes: {
							class: 'esgst-form-heading',
						},
						type: 'div',
						children: [
							{
								attributes: {
									class: 'esgst-form-heading-number',
								},
								text: `${number}.`,
								type: 'div',
							},
							{
								attributes: {
									class: 'icon_to_clipboard fa fa-fw fa-copy',
									'data-clipboard-text': `https://www.steamgifts.com/account/settings/profile?esgst=settings&id=${type}`,
								},
								type: 'i',
							},
							{
								attributes: {
									class: 'esgst-form-heading-text',
								},
								type: 'div',
								children: [
									{
										text: title,
										type: 'span',
									},
								],
							},
						],
					},
					{
						attributes: {
							class: 'esgst-form-row-indent',
						},
						type: 'div',
						children: html,
					},
				],
			},
		]);
		if (Settings.get('makeSectionsCollapsible') && !title.match(/Backup|Restore|Delete/)) {
			let button, containerr, isExpanded;
			button = Shared.common.createElements(section.firstElementChild, 'afterbegin', [
				{
					attributes: {
						class: 'esgst-clickable',
						style: `margin-right: 5px;`,
					},
					type: 'span',
					children: [
						{
							attributes: {
								class: `fa fa-${Settings.get(`collapse_${type}`) ? 'plus' : 'minus'}-square`,
								title: `${Settings.get(`collapse_${type}`) ? 'Expand' : 'Collapse'} section`,
							},
							type: 'i',
						},
					],
				},
			]);
			containerr = section.lastElementChild;
			if (Settings.get(`collapse_${type}`)) {
				containerr.classList.add('esgst-hidden');
				isExpanded = false;
			} else {
				isExpanded = true;
			}
			this.collapseButtons.push({ collapseButton: button, id: type, subMenu: containerr });
			button.addEventListener(
				'click',
				() => (isExpanded = this.collapseOrExpandSection(button, type, containerr, isExpanded))
			);
		}
		return section;
	}

	collapseOrExpandSection(collapseButton, id, subMenu, isExpanded) {
		if (isExpanded) {
			this.collapseSection(collapseButton, id, subMenu);
		} else {
			this.expandSection(collapseButton, id, subMenu);
		}
		return !isExpanded;
	}

	collapseSection(collapseButton, id, subMenu) {
		subMenu.classList.add('esgst-hidden');
		if (!collapseButton) {
			return;
		}
		Shared.common.createElements(collapseButton, 'atinner', [
			{
				attributes: {
					class: 'fa fa-plus-square',
					title: 'Expand section',
				},
				type: 'i',
			},
		]);
		this.preSave(`collapse_${id}`, true);
	}

	expandSection(collapseButton, id, subMenu) {
		subMenu.classList.remove('esgst-hidden');
		if (!collapseButton) {
			return;
		}
		Shared.common.createElements(collapseButton, 'atinner', [
			{
				attributes: {
					class: 'fa fa-minus-square',
					title: 'Collapse section',
				},
				type: 'i',
			},
		]);
		this.preSave(`collapse_${id}`, null);
	}

	filterSm(event) {
		let collapse, element, expand, found, id, type, typeFound, value;
		value = event.currentTarget.value
			.toLowerCase()
			.trim()
			.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
		for (type in Shared.esgst.features) {
			if (Shared.esgst.features.hasOwnProperty(type)) {
				found = false;
				typeFound = false;
				for (id in Shared.esgst.features[type].features) {
					if (Shared.esgst.features[type].features.hasOwnProperty(id)) {
						this.unfadeSmFeatures(Shared.esgst.features[type].features[id], id);
						found = this.filterSmFeature(Shared.esgst.features[type].features[id], id, value);
						if (found) {
							typeFound = true;
							this.unhideSmFeature(Shared.esgst.features[type].features[id], id);
						}
					}
				}
				element = document.getElementById(`esgst_${type}`);
				if (element) {
					if (typeFound) {
						element.classList.remove('esgst-hidden');
					} else {
						element.classList.add('esgst-hidden');
					}
					if (value) {
						expand = element.getElementsByClassName('fa-plus-square')[0];
						if (expand) {
							expand.click();
						}
					} else {
						collapse = element.getElementsByClassName('fa-minus-square')[0];
						if (collapse) {
							collapse.click();
						}
					}
				}
			}
		}
		for (type of ['element_ordering', 'steam_api_key']) {
			element = document.getElementById(`esgst_${type}`);
			if (element) {
				if (element.textContent.toLowerCase().trim().match(value)) {
					element.classList.remove('esgst-hidden');
				} else {
					element.classList.add('esgst-hidden');
				}
				if (value) {
					expand = element.getElementsByClassName('fa-plus-square')[0];
					if (expand) {
						expand.click();
					}
				} else {
					collapse = element.getElementsByClassName('fa-minus-square')[0];
					if (collapse) {
						collapse.click();
					}
				}
			}
		}
	}

	unfadeSmFeatures(feature, id) {
		let element = document.getElementById(`esgst_${id}`);
		if (element) {
			element.classList.remove('esgst-sm-faded');
		}
		if (feature.features) {
			for (id in feature.features) {
				if (feature.features.hasOwnProperty(id)) {
					this.unfadeSmFeatures(feature.features[id], id);
				}
			}
		}
	}

	filterSmFeature(feature, id, value) {
		let found =
			!value || feature.name.toLowerCase().match(value) || (value === `\\[new\\]` && feature.isNew);
		let exactFound = found;
		if (!value || !found) {
			if (!found) {
				exactFound = found = (feature.description ? feature.description().textContent : '')
					.toLowerCase()
					.match(value);
			}
			if ((!value || !found) && feature.features) {
				for (const subId in feature.features) {
					if (feature.features.hasOwnProperty(subId)) {
						found = this.filterSmFeature(feature.features[subId], subId, value) || found;
					}
				}
			}
		}
		let element = document.getElementById(`esgst_${id}`);
		if (element) {
			if (found) {
				element.classList.remove('esgst-hidden');
			} else {
				element.classList.add('esgst-hidden');
			}
			if (exactFound) {
				element.classList.remove('esgst-sm-faded');
			} else {
				element.classList.add('esgst-sm-faded');
			}
		}
		return found;
	}

	unhideSmFeature(feature, id) {
		let element = document.getElementById(`esgst_${id}`);
		if (element) {
			element.classList.remove('esgst-hidden');
		}
		if (feature.features) {
			for (id in feature.features) {
				if (feature.features.hasOwnProperty(id)) {
					this.unhideSmFeature(feature.features[id], id);
				}
			}
		}
	}

	enableDependencies(ids, namespace) {
		for (const id of ids) {
			const feature = Shared.esgst.featuresById[id];
			if (feature && feature[`${namespace}Switch`]) {
				feature[`${namespace}Switch`].enable();
			}
		}
	}

	addCombos() {
		const combos = [
			{
				title: 'Keep the important stuff at your reach while scrolling',
				description:
					'This combo fixes the header, main page heading and sidebar while you scroll through the page.',
				image: '',
				settings: ['fh', 'fpmh', 'fs'],
			},
		];
	}

	replaceFeatureNamePlaceholders(referenceEl) {
		const featureNamePlaceholders = referenceEl.querySelectorAll('[data-esgst-feature-id]');
		for (const featureNamePlaceholder of featureNamePlaceholders) {
			featureNamePlaceholder.textContent = Shared.common.getFeatureName(
				null,
				featureNamePlaceholder.dataset.esgstFeatureId
			);
		}
	}
}

const settingsModule = new SettingsModule();

export { settingsModule };
