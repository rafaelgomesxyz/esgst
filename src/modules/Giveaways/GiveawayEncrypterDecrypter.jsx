import { DOM } from '../../class/DOM';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { Button } from '../../components/Button';
import { PageHeading } from '../../components/PageHeading';
import { Utils } from '../../lib/jsUtils';
import { common } from '../Common';

const buildGiveaway = common.buildGiveaway.bind(common),
	createElements = common.createElements.bind(common),
	createLock = common.createLock.bind(common),
	endless_load = common.endless_load.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common),
	getValue = common.getValue.bind(common),
	lockAndSaveGiveaways = common.lockAndSaveGiveaways.bind(common),
	request = common.request.bind(common),
	rot = common.rot.bind(common),
	setValue = common.setValue.bind(common);
class GiveawaysGiveawayEncrypterDecrypter extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds an icon (<i className="fa fa-star"></i> if the giveaway is open,{' '}
						<i className="fa fa-star esgst-green"></i> if it is open and new,{' '}
						<i className="fa fa-star esgst-yellow"></i> if it is not open yet and{' '}
						<i className="fa fa-star esgst-red"></i> if it has already ended) next to a comment's
						"Permalink" (in any page) for each encrypted giveaway that the comment has (if it has
						any). The icon links to the giveaway.
					</li>
					<li>
						Encrypted giveaways are basically invite only giveaway codes that ESGST encrypts using
						various encryption methods and hides in your comments so that they can only be visible
						through the source code of the page. Other ESGST users are able to easily see these
						giveaways if they have this feature enabled, but since the codes are visible through the
						source code of the page, anyone who finds them and manages to decrypt them can access
						the giveaways. So it is more like a puzzle that ESGST users can solve instantly and
						non-ESGST users can solve if they give it some effort, though it is doubtful that
						someone will check the source code of every page they open on SteamGifts looking for the
						codes.
					</li>
					<li>
						To add encrypted giveaways to your comments, check{' '}
						<span data-esgst-feature-id="cfh_g"></span>.
					</li>
					<li>
						Adds a button (<i className="fa fa-star"></i>) next to the ESGST button at the header of
						any page that allows you to view all of the currently open decrypted giveaways that you
						have unlocked (they are unlocked whenever you visit a page that contains them).
					</li>
				</ul>
			),
			features: {
				ged_b: {
					description: () => (
						<ul>
							<li>
								With this option enabled, the header button will always appear if there are
								decrypted giveaways in the page, even if they have already ended (but they will not
								be listed in the popup).
							</li>
						</ul>
					),
					name: 'Always show the header button if there are decrypted giveaways in the page.',
					sg: true,
				},
				ged_t: {
					name: 'Open the list of decrypted giveaways in a new tab.',
					sg: true,
				},
			},
			id: 'ged',
			name: 'Giveaway Encrypter/Decrypter',
			sg: true,
			type: 'giveaways',
		};
	}

	init() {
		if (!this.esgst.sg) return;
		let ged = {
			newGiveaways: [],
		};
		if (Shared.common.isCurrentPath('Account') && this.esgst.parameters.esgst === 'ged') {
			// noinspection JSIgnoredPromiseFromCall
			this.ged_openPopup(ged);
		} else {
			ged.button = Shared.header.addButtonContainer({
				buttonIcon: 'fa fa-star',
				buttonName: 'ESGST Decrypted Giveaways',
				isActive: true,
				isNotification: true,
				side: 'left',
				url: Settings.get('ged_t')
					? 'https://www.steamgifts.com/account/settings/profile?esgst=ged'
					: '',
				openInNewTab: true,
			});

			ged.button.nodes.outer.classList.add('esgst-hidden');
			ged.button.nodes.buttonIcon.title = getFeatureTooltip('ged', 'View your decrypted giveaways');

			if (!Settings.get('ged_t')) {
				ged.button.nodes.outer.addEventListener('click', () => {
					ged.isPopup = true;
					this.ged_openPopup(ged);
				});
			}
			// noinspection JSIgnoredPromiseFromCall
			this.ged_getGiveaways(ged, true);
		}
		this.esgst.ged_addIcons = this.ged_addIcons.bind(this, ged);
	}

	async ged_openPopup(ged) {
		if (ged.isPopup) {
			ged.popup = new Popup({
				addScrollable: true,
				isTemp: true,
			});
			ged.container = ged.popup.description;
			ged.context = ged.popup.scrollable;
		} else {
			ged.popup = this.esgst.sidebar.nextElementSibling;
			if (Settings.get('removeSidebarInFeaturePages')) {
				this.esgst.sidebar.remove();
			}
			ged.popup.innerHTML = '';
			ged.container = ged.context = createElements(ged.popup, 'beforeend', [{ type: 'div' }]);
			ged.context.setAttribute('data-esgst-popup', true);
		}
		const heading = PageHeading.create('ged', [
			{
				name: 'ESGST',
				url: this.esgst.settingsUrl,
			},
			{
				name: 'Decrypted Giveaways',
				url: `https://www.steamgifts.com/account/settings/profile?esgst=ged`,
			},
		]).insert(ged.popup.description || ged.popup, 'afterbegin');
		createElements(ged.context, 'atinner', [
			{
				attributes: {
					class: 'fa fa-circle-o-notch fa-spin',
				},
				type: 'i',
			},
			{
				text: 'Loading...',
				type: 'node',
			},
		]);
		await this.ged_getGiveaways(ged);
		ged.context.innerHTML = '';
		if (Settings.get('gas') || (Settings.get('gf') && Settings.get('gf_m')) || Settings.get('mm')) {
			if (Settings.get('gas')) {
				this.esgst.modules.giveawaysGiveawaysSorter.init(heading.nodes.outer);
			}
			if (Settings.get('gf') && Settings.get('gf_m')) {
				heading.nodes.outer.appendChild(
					this.esgst.modules.giveawaysGiveawayFilters.filters_addContainer(
						heading.nodes.outer,
						'Ged'
					)
				);
			}
			if (Settings.get('mm')) {
				this.esgst.modules.generalMultiManager.mm(heading.nodes.outer);
			}
		}
		ged.results = createElements(ged.context, 'beforeend', [
			{
				attributes: {
					class: 'esgst-text-left',
				},
				type: 'div',
			},
		]);
		ged.loadMoreButton = Button.create([
			{
				color: 'green',
				icons: ['fa-plus'],
				name: 'Load More',
				onClick: this.ged_loadGiveaways.bind(this, ged),
			},
			{
				template: 'loading',
				isDisabled: true,
				name: 'Loading more...',
			},
		]).insert(heading.nodes.outer, 'beforeend');
		if (ged.isPopup) {
			ged.popup.open();
		}
		ged.loadMoreButton.onClick();
		if (Settings.get('es_ged')) {
			ged.context.addEventListener('scroll', this.ged_checkEndless.bind(this, ged));
		}
	}

	async ged_getGiveaways(ged, firstRun) {
		ged.giveaways = [];
		ged.i = 0;
		let currentGiveaways = {};
		let currentTime = Date.now();
		const deleteLock = await createLock('gedLock', 300);
		this.esgst.decryptedGiveaways = JSON.parse(getValue('decryptedGiveaways'));
		for (let code in this.esgst.decryptedGiveaways) {
			if (this.esgst.decryptedGiveaways.hasOwnProperty(code)) {
				if (this.esgst.decryptedGiveaways[code].html) {
					delete this.esgst.decryptedGiveaways[code].html;
				}
				let isEnded = this.esgst.decryptedGiveaways[code].timestamp <= currentTime;
				let filtered = true;
				let giveaway = this.esgst.giveaways[code];
				if (giveaway) {
					const name = Settings.get('gf_presetGed');
					if (name) {
						let i;
						for (
							i = Settings.get('gf_presets').length - 1;
							i > -1 && Settings.get('gf_presets')[i].name !== name;
							i--
						) {}
						if (i > -1) {
							const preset = Settings.get('gf_presets')[i];
							filtered = this.esgst.modules.giveawaysGiveawayFilters.filters_filterItem(
								this.esgst.modules.giveawaysGiveawayFilters.getFilters(true),
								giveaway,
								preset.rules,
								true
							);
						}
					}
					if (filtered && isEnded && !giveaway.started) {
						await this.ged_getGiveaway(code, currentGiveaways, true);
						isEnded = this.esgst.decryptedGiveaways[code].timestamp <= currentTime;
					}
				}
				if (filtered && !isEnded) {
					ged.giveaways.push({
						code: code,
						source: this.esgst.decryptedGiveaways[code].source,
						timestamp: this.esgst.decryptedGiveaways[code].timestamp,
					});
				}
			}
		}
		await lockAndSaveGiveaways(currentGiveaways, firstRun);
		await setValue('decryptedGiveaways', JSON.stringify(this.esgst.decryptedGiveaways));
		deleteLock();
		ged.n = ged.giveaways.length;
		if (ged.n > 0) {
			if (ged.button) {
				ged.button.nodes.outer.classList.remove('esgst-hidden');
			}
			ged.giveaways = Utils.sortArray(ged.giveaways, false, 'timestamp');
		}
	}

	async ged_getGiveaway(code, currentGiveaways, isEnded, source) {
		let response = await request({ method: 'GET', url: `/giveaway/${code}/` });
		let giveaway = (
			await this.esgst.modules.giveaways.giveaways_get(
				DOM.parse(response.responseText),
				false,
				response.finalUrl,
				false,
				null,
				true
			)
		)[0];
		if (giveaway) {
			currentGiveaways[code] = giveaway;
			if (giveaway.started && isEnded) {
				this.esgst.decryptedGiveaways[code].timestamp = giveaway.endTime;
			}
		}
		if (source) {
			this.esgst.decryptedGiveaways[code] = {
				source: source,
				timestamp: (giveaway && giveaway.endTime) || 0,
			};
		}
		return giveaway;
	}

	async ged_loadGiveaways(ged) {
		let i = 0;
		while (
			(i < 5 ||
				(Settings.get('es_ged') && ged.context.scrollHeight <= ged.context.offsetHeight) ||
				(ged.results.children.length -
					((this.esgst.gfPopup && parseInt(this.esgst.gfPopup.filteredCount.textContent)) || 0)) %
					5 !==
					0) &&
			ged.i < ged.n
		) {
			i += 1;
			let giveaway = ged.giveaways[ged.i];
			ged.i += 1;
			let response = await request({ method: 'GET', url: `/giveaway/${giveaway.code}/` });
			let builtGiveaway = await buildGiveaway(DOM.parse(response.responseText), response.finalUrl);
			if (!builtGiveaway || !builtGiveaway.started) {
				continue;
			}
			let context = createElements(ged.results, 'beforeend', builtGiveaway.html);
			if (giveaway.source) {
				createElements(context.getElementsByClassName('giveaway__columns')[0], 'afterbegin', [
					{
						attributes: {
							class: 'esgst-ged-source',
							href: `${
								giveaway.source.match(/\/discussion\//)
									? giveaway.source
									: `/go/comment/${giveaway.source}`
							}`,
						},
						text: 'Source',
						type: 'a',
					},
				]);
			}
			await endless_load(context, false, 'ged');
			if (ged.newGiveaways.indexOf(giveaway.code) > -1) {
				context
					.getElementsByClassName('giveaway__heading__name')[0]
					.insertAdjacentText('afterbegin', `[NEW] `);
			}
		}
		if (ged.i >= ged.n) {
			ged.loadMoreButton.destroy();
		}
	}

	ged_checkEndless(ged) {
		if (
			ged.context.scrollTop + ged.context.offsetHeight >= ged.context.scrollHeight &&
			!ged.loadMoreButton.isBusy
		) {
			ged.loadMoreButton.onClick();
		}
	}

	async ged_addIcons(ged, comments) {
		let currentGiveaways = {};
		let currentTime = Date.now();
		let deleteLock = null;
		let hasEnded = false;
		let hasNew = false;
		for (let i = comments.length - 1; i > -1; i--) {
			let comment = comments[i];
			let icons = comment.actions.getElementsByClassName('esgst-ged-icon');
			for (let j = icons.length - 1; j > -1; j--) {
				icons[0].remove();
			}
			if (!comment.displayState) continue;
			let links = comment.displayState.querySelectorAll(`[href^="ESGST-"]`);
			for (let j = links.length - 1; j > -1; j--) {
				let code = links[j].getAttribute('href').match(/ESGST-(.+)/)[1];
				if (!deleteLock) {
					deleteLock = await createLock('gedLock', 300);
					this.esgst.decryptedGiveaways = JSON.parse(getValue('decryptedGiveaways'));
				}
				code = this.ged_decryptCode(code);
				let isEnded =
					this.esgst.decryptedGiveaways[code] &&
					currentTime > this.esgst.decryptedGiveaways[code].timestamp;
				let isNew = false;
				let isStarted = this.esgst.giveaways[code] && this.esgst.giveaways[code].started;
				if (!this.esgst.decryptedGiveaways[code] || (isEnded && !isStarted)) {
					let giveaway = await this.ged_getGiveaway(
						code,
						currentGiveaways,
						false,
						comment.id || window.location.href
					);
					ged.newGiveaways.push(code);
					if (giveaway) {
						isEnded = giveaway.ended;
						isStarted = giveaway.started;
					}
				}
				if (isEnded) {
					if (Settings.get('ged_b')) {
						hasEnded = true;
					}
				} else {
					hasNew = isNew = true;
				}
				createElements(comment.actions, 'beforeend', [
					{
						attributes: {
							class: `esgst-ged-icon${
								isEnded ? ' esgst-red' : isStarted ? (isNew ? ' esgst-green' : '') : ' esgst-yellow'
							}`,
							href: `/giveaway/${code}/`,
							title: getFeatureTooltip('ged', 'ESGST Decrypted Giveaway'),
						},
						type: 'a',
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
		}
		if (deleteLock) {
			await lockAndSaveGiveaways(currentGiveaways);
			await setValue('decryptedGiveaways', JSON.stringify(this.esgst.decryptedGiveaways));
			deleteLock();
		}
		if (ged.button && (hasEnded || hasNew)) {
			ged.button.nodes.outer.classList.remove('esgst-hidden');
			if (hasNew) {
				ged.button.nodes.buttonIcon.classList.add('esgst-positive');
			}
		}
	}

	ged_encryptCode(code) {
		let alphabet, encrypted, i, n, rotated, rotation;
		alphabet = 'NOPQRSTUVWXYZABCDEFGHIJKLM';
		switch (Math.floor(Math.random() * 4)) {
			case 0:
				rotated = rot(code, 13);
				encrypted = '';
				for (i = 0, n = rotated.length; i < n; ++i) {
					encrypted += rotated.charCodeAt(i).toString(16);
				}
				return encrypted;
			case 1:
				rotated = rot(code, 13);
				encrypted = '';
				for (i = 0, n = rotated.length; i < n; ++i) {
					encrypted += rotated.charCodeAt(i).toString(16);
				}
				encrypted = encrypted.replace(/\d/g, (n) => {
					return alphabet[parseInt(n)];
				});
				return encrypted;
			case 2:
				rotation = Math.ceil(Math.random() * 25);
				rotated = rot(code, rotation);
				encrypted = '';
				for (i = 0, n = rotated.length; i < n; ++i) {
					encrypted += rotated.charCodeAt(i).toString(16);
				}
				encrypted += rotation.toString(16);
				return encrypted;
			case 3:
				rotation = Math.ceil(Math.random() * 25);
				rotated = rot(code, rotation);
				encrypted = '';
				for (i = 0, n = rotated.length; i < n; ++i) {
					encrypted += rotated.charCodeAt(i).toString(16);
				}
				encrypted += rotation.toString(16);
				encrypted = encrypted.replace(/\d/g, (n) => {
					return alphabet[parseInt(n)];
				});
				return encrypted;
		}
	}

	ged_decryptCode(encrypted) {
		let alphabet, code, rotation;
		alphabet = 'NOPQRSTUVWXYZABCDEFGHIJKLM';
		encrypted = encrypted.replace(/-/g, '').replace(/[A-Z]/g, (n) => {
			return `${alphabet.indexOf(n)}`;
		});
		rotation = encrypted.slice(10);
		if (rotation) {
			rotation = parseInt(rotation, 16);
		} else {
			rotation = 13;
		}
		code = '';
		encrypted
			.slice(0, 10)
			.match(/../g)
			.forEach((n) => {
				code += String.fromCharCode(parseInt(n, 16));
			});
		return rot(code, 26 - rotation);
	}

	async ged_saveGiveaways(context, source) {
		let codes = [];
		let elements = context.querySelectorAll(`[href^="ESGST-"]`);
		for (let i = 0, n = elements.length; i < n; i++) {
			let encryptedCode = elements[i].getAttribute('href').match(/ESGST-(.+)/)[1];
			codes.push(this.ged_decryptCode(encryptedCode));
		}
		if (!codes.length) {
			return;
		}
		let ged = {
			giveaways: {},
		};
		this.esgst.decryptedGiveaways = JSON.parse(getValue('decryptedGiveaways'));
		let promises = [];
		codes.forEach((code) => {
			if (this.esgst.decryptedGiveaways[code]) {
				return;
			}
			let giveaway = this.esgst.giveaways[code];
			if (giveaway && giveaway.endTime) {
				this.esgst.decryptedGiveaways[code] = {
					source: source,
					timestamp: giveaway.endTime,
				};
				return;
			}
			promises.push(this.ged_getGiveaway(code, ged.giveaways, false, source));
		});
		await Promise.all(promises);
		await setValue('decryptedGiveaways', JSON.stringify(this.esgst.decryptedGiveaways));
		await lockAndSaveGiveaways(ged.giveaways);
	}
}

const giveawaysGiveawayEncrypterDecrypter = new GiveawaysGiveawayEncrypterDecrypter();

export { giveawaysGiveawayEncrypterDecrypter };
