import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { common } from '../Common';
import { Settings } from '../../class/Settings';
import { permissions } from '../../class/Permissions';
import { DOM } from '../../class/DOM';
import { Session } from '../../class/Session';
import { NotificationBar } from '../../components/NotificationBar';

const createElements = common.createElements.bind(common),
	createHeadingButton = common.createHeadingButton.bind(common),
	getSteamId = common.getSteamId.bind(common),
	getUser = common.getUser.bind(common),
	getValue = common.getValue.bind(common),
	observeNumChange = common.observeNumChange.bind(common),
	request = common.request.bind(common),
	saveUsers = common.saveUsers.bind(common),
	setValue = common.setValue.bind(common);
class GiveawaysUnsentGiftSender extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a button (<i className="fa fa-gift"></i> <i className="fa fa-send"></i>) to the
						main page heading of your{' '}
						<a href="https://www.steamgifts.com/giveaways/created">created</a> page that allows you
						to send all of your unsent gifts at once.
					</li>
					<li>
						You can limit which gifts are sent based on whether or not the winner has any not
						activated/multiple wins (using <a href="https://www.sgtools.info/">SGTools</a>), whether
						or not the winner is still a member of the group and has a certain gift difference for
						group giveaways, and whether or not the winner is on your whitelist/blacklist.
					</li>
				</ul>
			),
			id: 'ugs',
			name: 'Unsent Gift Sender',
			sg: true,
			type: 'giveaways',
		};
	}

	init() {
		if (this.esgst.createdPath) {
			let button = createHeadingButton({
				id: 'ugs',
				icons: ['fa-gift', 'fa-send'],
				title: 'Send unsent gifts',
			});
			button.addEventListener('click', this.ugs_openPopup.bind(this, { button }));
		} else if (this.esgst.newTicketPath) {
			document
				.getElementsByClassName('form__submit-button')[0]
				.addEventListener(
					'click',
					this.ugs_saveReroll.bind(
						this,
						document.querySelector(`[name="category_id"]`),
						document.querySelector(`[name="reroll_winner_id"]`)
					)
				);
		}
	}

	async ugs_saveReroll(category, winner) {
		let rerolls;
		if (category.value === '1') {
			const id = winner.value;
			if (id) {
				rerolls = JSON.parse(getValue('rerolls'));
				if (rerolls.indexOf(id) < 0) {
					rerolls.push(id);
					setValue('rerolls', JSON.stringify(rerolls));
				}
			}
		}
	}

	ugs_openPopup(ugs) {
		if (!ugs.popup) {
			ugs.popup = new Popup({ addScrollable: true, icon: 'fa-gift', title: `Send unsent gifts:` });
			new ToggleSwitch(
				ugs.popup.description,
				'ugs_checkRules',
				false,
				'Do not send if the winner has any not activated/multiple wins.',
				false,
				false,
				'The winners will be checked in real time.',
				Settings.get('ugs_checkRules')
			);
			const checkMemberSwitch = new ToggleSwitch(
				ugs.popup.description,
				'ugs_checkMember',
				false,
				'Do not send if the winner is no longer a member of at least one of the groups for group giveaways.',
				false,
				false,
				'The winners will be checked in real time.',
				Settings.get('ugs_checkMember')
			);
			const checkDifferenceSwitch = new ToggleSwitch(
				ugs.popup.description,
				'ugs_checkDifference',
				false,
				(
					<fragment>
						Do not send if the winner has a gift difference lower than{' '}
						<input
							className="esgst-ugs-difference"
							step="0.1"
							type="number"
							value={Settings.get('ugs_difference')}
						/>
						.
					</fragment>
				),
				false,
				false,
				'The winners will be checked in real time.',
				Settings.get('ugs_checkDifference')
			);
			new ToggleSwitch(
				ugs.popup.description,
				'ugs_checkWhitelist',
				false,
				'Do not send if the winner is not on your whitelist.',
				false,
				false,
				`You must sync your whitelist through the settings menu. Whitelisted winners get a pass for broken rules, so if this option is enabled and the winner is whitelisted, the gift will be sent regardless of whether or not the first option is enabled.`,
				Settings.get('ugs_checkWhitelist')
			);
			new ToggleSwitch(
				ugs.popup.description,
				'ugs_checkBlacklist',
				false,
				'Do not send if the winner on your blacklist.',
				false,
				false,
				`You must sync your blacklist through the settings menu. If the winner is blacklisted, but is a member of one of the groups, the gift will be sent anyway.`,
				Settings.get('ugs_checkBlacklist')
			);
			if (!Settings.get('ugs_checkMember')) {
				checkDifferenceSwitch.container.classList.add('esgst-hidden');
			}
			observeNumChange(checkDifferenceSwitch.name.firstElementChild, 'ugs_setDifference', true);
			checkMemberSwitch.dependencies.push(checkDifferenceSwitch.container);
			ugs.results = createElements(ugs.popup.scrollable, 'beforeend', [
				{
					attributes: {
						class: 'esgst-hidden markdown',
					},
					type: 'div',
					children: [
						{
							type: 'ul',
							children: [
								{
									attributes: {
										class: 'esgst-inline-list',
									},
									type: 'li',
									children: [
										{
											attributes: {
												class: 'esgst-bold',
											},
											type: 'span',
											children: [
												{
													text: 'Successfully sent gifts to ',
													type: 'node',
												},
												{
													text: '0',
													type: 'span',
												},
												{
													text: ` winners:`,
													type: 'node',
												},
											],
										},
										{
											attributes: {
												class: 'esgst-inline-list',
											},
											type: 'span',
										},
									],
								},
								{
									attributes: {
										class: 'esgst-inline-list',
									},
									type: 'li',
									children: [
										{
											attributes: {
												class: 'esgst-bold',
											},
											type: 'span',
											children: [
												{
													text: 'Failed to send gifts to ',
													type: 'node',
												},
												{
													text: '0',
													type: 'span',
												},
												{
													text: ` winners (check the tooltips to find out the cause of the failures):`,
													type: 'node',
												},
											],
										},
										{
											attributes: {
												class: 'esgst-inline-list',
											},
											type: 'span',
										},
									],
								},
								{
									attributes: {
										class: 'esgst-inline-list',
									},
									type: 'li',
									children: [
										{
											attributes: {
												class: 'esgst-bold',
											},
											type: 'span',
											children: [
												{
													text: '0',
													type: 'span',
												},
												{
													text: ` giveaways with leftover gifts/keys:`,
													type: 'node',
												},
											],
										},
										{
											attributes: {
												class: 'esgst-inline-list',
											},
											type: 'span',
										},
									],
								},
							],
						},
					],
				},
			]);
			ugs.sent = ugs.results.firstElementChild.firstElementChild;
			ugs.sentCount = ugs.sent.firstElementChild.firstElementChild;
			ugs.sentGifts = ugs.sent.lastElementChild;
			ugs.unsent = ugs.sent.nextElementSibling;
			ugs.unsentCount = ugs.unsent.firstElementChild.firstElementChild;
			ugs.unsentGifts = ugs.unsent.lastElementChild;
			ugs.leftover = ugs.unsent.nextElementSibling;
			ugs.leftoverCount = ugs.leftover.firstElementChild.firstElementChild;
			ugs.leftoverGifts = ugs.leftover.lastElementChild;
			ugs.popup.description.appendChild(
				new ButtonSet({
					color1: 'green',
					color2: 'red',
					icon1: 'fa-send',
					icon2: 'fa-times-circle',
					title1: 'Send',
					title2: 'Cancel',
					callback1: this.ugs_start.bind(this, ugs),
					callback2: this.ugs_cancel.bind(this, ugs),
				}).set
			);
			ugs.progressBar = NotificationBar.create().insert(ugs.popup.description, 'beforeend').hide();
			ugs.overallProgressBar = NotificationBar.create()
				.insert(ugs.popup.description, 'beforeend')
				.hide();
			ugs.popup.description.appendChild(ugs.popup.scrollable);
		}
		ugs.popup.open();
	}

	async ugs_start(ugs) {
		if (Settings.get('ugs_checkMember') && !(await permissions.contains([['steamCommunity']]))) {
			return;
		}

		// initialize/reset stuff
		ugs.isCanceled = false;
		ugs.giveaways = [];
		ugs.groups = {};
		ugs.button.classList.add('esgst-busy');
		ugs.results.classList.add('esgst-hidden');
		ugs.sent.classList.add('esgst-hidden');
		ugs.unsent.classList.add('esgst-hidden');
		ugs.leftover.classList.add('esgst-hidden');
		ugs.sentGifts.innerHTML = '';
		ugs.unsentGifts.innerHTML = '';
		ugs.leftoverGifts.innerHTML = '';
		ugs.sentCount.textContent = ugs.unsentCount.textContent = ugs.leftoverCount.textContent = '0';

		if (!Session.counters.created) {
			// there are no unsent giveaways
			ugs.button.classList.remove('esgst-busy');
			ugs.progressBar.setWarning('You do not have any unsent gifts.').show();
			return;
		}

		ugs.progressBar.setLoading(null).show();
		ugs.overallProgressBar.reset().show();

		// retrieve unsent giveaways
		ugs.count = Session.counters.created;
		let giveaways = [];
		let nextPage = 1;
		let pagination = null;
		let skipped = false;
		do {
			let context = null;
			skipped = false;
			if (nextPage === this.esgst.currentPage) {
				context = document;
			} else if (document.getElementsByClassName(`esgst-es-page-${nextPage}}`)[0]) {
				// page has been loaded with endless scrolling, so its giveaways were already retrieved when the context was the document
				skipped = true;
				continue;
			} else {
				context = DOM.parse(
					(
						await request({
							method: 'GET',
							url: `/giveaways/created/search?page=${nextPage}`,
						})
					).responseText
				);
			}
			if (nextPage === 1) {
				ugs.lastPage = this.esgst.modules.generalLastPageLink.lpl_getLastPage(
					context,
					context === document
				);
				ugs.lastPage = ugs.lastPage === 999999999 ? '' : ` of ${ugs.lastPage}`;
			}
			ugs.progressBar.setMessage(`Searching for unsent gifts (page ${nextPage}${ugs.lastPage})...`);
			ugs.continue = false;
			let elements = context.getElementsByClassName('table__row-outer-wrap');
			for (let i = 0, n = elements.length; i < n; i++) {
				let element = elements[i];
				let unsent = element.getElementsByClassName('fa icon-red fa-warning')[0];
				if (unsent) {
					let heading = element.getElementsByClassName('table__column__heading')[0];
					let url = heading.getAttribute('href');
					giveaways.push({
						code: url.match(/\/giveaway\/(.+?)\//)[1],
						context: unsent,
						name: heading.firstChild.textContent.trim().match(/(.+?)(\s\(.+\sCopies\))?$/)[1],
						url: url,
					});
					ugs.continue = true;
					ugs.count -= 1;
				}
			}
			pagination = context.getElementsByClassName('pagination__navigation')[0];
			nextPage += 1;
		} while (
			!ugs.isCanceled &&
			(ugs.count > 0 || ugs.continue) &&
			(skipped || (pagination && !pagination.lastElementChild.classList.contains('is-selected')))
		);

		// retrieve the winners/groups of each giveaway
		for (let i = 0, n = giveaways.length; !ugs.isCanceled && i < n; i++) {
			ugs.overallProgressBar.setMessage(`${i} of ${n} giveaways checked`);
			let giveaway = giveaways[i];
			ugs.giveaways[giveaway.code] = {
				code: giveaway.code,
				copies: 0,
				context: giveaway.context,
				name: giveaway.name,
				url: giveaway.url,
				totalWinners: 0,
				winners: [],
			};

			// retrieve the winners of the giveaway
			let nextPage = 1;
			let pagination = null;
			do {
				let context = DOM.parse(
					(
						await request({
							method: 'GET',
							url: `${giveaway.url}/winners/search?page=${nextPage}`,
						})
					).responseText
				);
				if (nextPage === 1) {
					ugs.lastWinnersPage = this.esgst.modules.generalLastPageLink.lpl_getLastPage(context);
					ugs.lastWinnersPage =
						ugs.lastWinnersPage === 999999999 ? '' : ` of ${ugs.lastWinnersPage}`;
				}
				ugs.progressBar.setMessage(
					`Retrieving winners (page ${nextPage}${ugs.lastWinnersPage})...`
				);
				if (!ugs.giveaways[giveaway.code].copies) {
					const elements = context.querySelectorAll('.featured__heading__small');
					if (elements && elements.length === 2) {
						ugs.giveaways[giveaway.code].copies = parseInt(
							elements[0].textContent.replace(/,|\(|\)|Copies/g, '').trim()
						);
					}
				}
				let elements = context.getElementsByClassName('table__row-outer-wrap');
				const n = elements.length;
				ugs.giveaways[giveaway.code].totalWinners += n;
				for (let i = 0; i < n; i++) {
					let element = elements[i];
					if (element.querySelector(`.table__gift-not-sent:not(.is-hidden)`)) {
						ugs.giveaways[giveaway.code].winners.push({
							username: element.getElementsByClassName('table__column__heading')[0].textContent,
							values: {},
							winnerId: element.querySelector(`[name="winner_id"]`).value,
						});
						ugs.count -= 1;
					}
				}
				if (!ugs.giveaways[giveaway.code].group) {
					ugs.giveaways[giveaway.code].group = context.getElementsByClassName(
						'featured__column--group'
					)[0];
				}
				if (!ugs.giveaways[giveaway.code].whitelist) {
					ugs.giveaways[giveaway.code].whitelist = context.getElementsByClassName(
						'featured__column--whitelist'
					)[0];
				}
				pagination = context.getElementsByClassName('pagination__navigation')[0];
				nextPage += 1;
			} while (
				!ugs.isCanceled &&
				pagination &&
				!pagination.lastElementChild.classList.contains('is-selected')
			);

			if (!ugs.giveaways[giveaway.code].copies) {
				ugs.giveaways[giveaway.code].copies = 1;
			}
			if (ugs.giveaways[giveaway.code].copies > ugs.giveaways[giveaway.code].totalWinners) {
				ugs.leftover.classList.remove('esgst-hidden');
				ugs.leftoverCount.textContent = parseInt(ugs.leftoverCount.textContent) + 1;
				createElements(ugs.leftoverGifts, 'beforeend', [
					{
						type: 'span',
						children: [
							{
								attributes: {
									href: giveaway.url,
								},
								text: giveaway.name,
								type: 'a',
							},
							{
								text: ` (${
									ugs.giveaways[giveaway.code].copies - ugs.giveaways[giveaway.code].totalWinners
								})`,
								type: 'node',
							},
						],
					},
				]);
			}

			// retrieve the groups of the giveaway
			if (Settings.get('ugs_checkMember') && ugs.giveaways[giveaway.code].group) {
				ugs.giveaways[giveaway.code].groups = [];
				let nextPage = 1;
				let pagination = null;
				do {
					let context = DOM.parse(
						(
							await request({
								method: 'GET',
								url: `${giveaway.url}/groups/search?page=${nextPage}`,
							})
						).responseText
					);
					if (nextPage === 1) {
						ugs.lastGroupsPage = this.esgst.modules.generalLastPageLink.lpl_getLastPage(context);
						ugs.lastGroupsPage =
							ugs.lastGroupsPage === 999999999 ? '' : ` of ${ugs.lastGroupsPage}`;
					}
					ugs.progressBar.setMessage(
						`Retrieving groups (page ${nextPage}${ugs.lastGroupsPage})...`
					);
					let elements = context.getElementsByClassName('table__row-outer-wrap');
					for (let i = 0, n = elements.length; i < n; i++) {
						let element = elements[i];
						let heading = element.getElementsByClassName('table__column__heading')[0];
						let match = heading.getAttribute('href').match(/\/group\/(.+?)\/(.+)/);
						ugs.giveaways[giveaway.code].groups.push({
							avatar: element
								.getElementsByClassName('table_image_avatar')[0]
								.style.backgroundImage.match(/\/avatars\/(.+)_medium/)[1],
							code: match[1],
							name: heading.textContent,
							urlName: match[2],
						});
					}
					pagination = context.getElementsByClassName('pagination__navigation')[0];
					nextPage += 1;
				} while (
					!ugs.isCanceled &&
					pagination &&
					!pagination.lastElementChild.classList.contains('is-selected')
				);
			}
		}

		if (ugs.isCanceled) {
			// process canceled
			return;
		}

		let codes = Object.keys(ugs.giveaways);
		let n = codes.length;
		if (n > 0) {
			// send gifts
			ugs.rerolls = JSON.parse(this.esgst.storage.rerolls);
			ugs.sentWinners = {};
			ugs.winners = {};
			ugs.results.classList.remove('esgst-hidden');
			for (let i = 0; !ugs.isCanceled && i < n; i++) {
				ugs.overallProgressBar.setMessage(`${i} of ${n} giveaways checked`);
				let giveaway = ugs.giveaways[codes[i]];
				for (let j = 0, numWinners = giveaway.winners.length; j < numWinners; j++) {
					let winner = giveaway.winners[j];
					let savedUser = await getUser(this.esgst.users, winner);

					// check order:
					// 1. check if the winner is being rerolled
					// 2. check if the winner has not activated/multiple wins
					// 3. if passed and it's a group giveaway, check if the winner is still a group member, otherwise go to 3
					// 4. check if the winner is whitelisted, which would give them a pass for not activated/multiple wins
					// 5. finally check if the winner is blacklisted

					if (ugs.rerolls.indexOf(winner.winnerId) > -1) {
						// winner is being rerolled, cannot send gift
						winner.error = `${winner.username} is currently being rerolled.`;
					} else {
						if (Settings.get('ugs_checkRules')) {
							// check if winner has not activated/multiple wins
							ugs.progressBar.setMessage(
								`Checking if ${winner.username} has not activated/multiple wins...`
							);
							winner.values.namwc = {
								lastCheck: Date.now(),
								results: {},
							};
							try {
								await this.esgst.modules.usersNotActivatedMultipleWinChecker.namwc_checkNotActivated(
									ugs,
									winner
								);
								await this.esgst.modules.usersNotActivatedMultipleWinChecker.namwc_checkMultiple(
									ugs,
									winner
								);
								let notActivated = Array.isArray(winner.values.namwc.results.notActivated)
									? winner.values.namwc.results.notActivated.length
									: winner.values.namwc.results.notActivated;
								let multiple = Array.isArray(winner.values.namwc.results.multiple)
									? winner.values.namwc.results.multiple.length
									: winner.values.namwc.results.multiple;
								let unknown = Array.isArray(winner.values.namwc.results.unknown)
									? winner.values.namwc.results.unknown.length
									: winner.values.namwc.results.unknown;
								if (unknown) {
									winner.error = `Could not check ${winner.username}'s not activated / multiple wins (probably a private profile).`;
								} else if (notActivated && multiple) {
									winner.error = `${winner.username} has ${notActivated} not activated wins and ${multiple} multiple wins.`;
								} else if (notActivated) {
									winner.error = `${winner.username} has ${notActivated} not activated wins.`;
								} else if (multiple) {
									winner.error = `${winner.username} has ${multiple} multiple wins.`;
								}
								winner.sgToolsErrorNAW = notActivated;
								winner.sgToolsErrorMW = multiple;
							} catch (e) {
								winner.error = `Could not check ${winner.username}'s not activated / multiple wins (probably a connection error).`;
							}
						}

						if (Settings.get('ugs_checkMember') && giveaway.group && !winner.error) {
							// check if winner is still a group member
							ugs.progressBar.setMessage(
								`Checking if ${winner.username} is a member of one of the groups...`
							);
							await getSteamId(null, false, this.esgst.users, winner);
							let member = false;
							for (let k = 0, numGroups = giveaway.groups.length; k < numGroups; k++) {
								let group = giveaway.groups[k];
								let code = group.code;
								if (!ugs.groups[code]) {
									// retrieve group members and store them in case another giveaway has the same group
									let l;
									for (
										l = this.esgst.groups.length - 1;
										l > -1 && this.esgst.groups[l].code !== code;
										l--
									) {}
									if (l < 0) {
										this.esgst.groups.push({
											avatar: group.avatar,
											code: code,
											name: group.name,
										});
										l = this.esgst.groups.length - 1;
									}
									if (!this.esgst.groups[l].steamId) {
										this.esgst.groups[l].steamId = DOM.parse(
											(
												await request({
													method: 'GET',
													url: `/group/${code}/`,
												})
											).responseText
										)
											.getElementsByClassName('sidebar__shortcut-inner-wrap')[0]
											.firstElementChild.getAttribute('href')
											.match(/\d+/)[0];
									}
									ugs.groups[code] = (
										await request({
											method: 'GET',
											url: `http://steamcommunity.com/gid/${this.esgst.groups[l].steamId}/memberslistxml?xml=1`,
										})
									).responseText.match(/<steamID64>.+?<\/steamID64>/g);
									for (l = ugs.groups[code].length - 1; l > -1; l--) {
										ugs.groups[code][l] = ugs.groups[code][l].match(
											/<steamID64>(.+?)<\/steamID64>/
										)[1];
									}
								}

								if (ugs.groups[code].indexOf(winner.steamId) < 0) {
									// winner is not a member of this group, continue to check the next group
									continue;
								}

								if (!Settings.get('ugs_checkDifference')) {
									// no need to check gift difference, gift can be sent
									member = true;
									break;
								}

								// check winner's gift difference
								ugs.progressBar.setMessage(
									`Checking if ${winner.username} has a gift difference higher than the one set...`
								);
								let element = DOM.parse(
									(
										await request({
											method: 'GET',
											url: `/group/${code}/${group.urlName}/users/search?q=${winner.username}`,
										})
									).responseText
								).getElementsByClassName('table__row-outer-wrap')[0];
								if (
									element &&
									element.getElementsByClassName('table__column__heading')[0].textContent ===
										winner.username
								) {
									let difference = parseFloat(
										element.getElementsByClassName('table__column--width-small')[2].textContent
									);
									if (difference >= Settings.get('ugs_difference')) {
										member = true;
										break;
									}
									winner.error = `${winner.username} has a ${difference} gift difference.`;
									break;
								}
							}
							if (!winner.error && !member) {
								winner.error = `${winner.username} is not a member of one of the groups.`;
							}
						}

						if (Settings.get('ugs_checkWhitelist')) {
							// check if winner is whitelisted
							winner.error =
								savedUser && savedUser.whitelisted
									? null
									: `${winner.username} is not whitelisted.`;
						}

						if (
							Settings.get('ugs_checkBlacklist') &&
							savedUser &&
							savedUser.blacklisted &&
							!winner.error
						) {
							// check if winner is blacklisted
							winner.error = `${winner.username} is blacklisted.`;
						}
					}

					// send gift to the winner or not, based on the previous checks
					if (!ugs.winners[winner.username]) {
						ugs.winners[winner.username] = [];
					}
					if (ugs.winners[winner.username].indexOf(giveaway.name) < 0) {
						if (winner.error) {
							ugs.unsent.classList.remove('esgst-hidden');
							ugs.unsentCount.textContent = parseInt(ugs.unsentCount.textContent) + 1;
							createElements(ugs.unsentGifts, 'beforeend', [
								{
									type: 'span',
									children: [
										{
											attributes: {
												href: `/user/${winner.username}`,
											},
											text: winner.username,
											type: 'a',
										},
										{
											text: ` (`,
											type: 'node',
										},
										{
											attributes: {
												href: `${giveaway.url}/winners`,
											},
											text: giveaway.name,
											type: 'a',
										},
										{
											text: `) `,
											type: 'node',
										},
										winner.sgToolsErrorNAW
											? {
													attributes: {
														class: 'esgst-red',
														href: `http://www.sgtools.info/nonactivated/${winner.username}`,
													},
													type: 'a',
													children: [
														{
															text: `${winner.sgToolsErrorNAW} `,
															type: 'node',
														},
														{
															attributes: {
																class: 'fa fa-steam',
																title: 'Not activated wins',
															},
															type: 'i',
														},
													],
											  }
											: null,
										winner.sgToolsErrorMW
											? {
													attributes: {
														class: 'esgst-red',
														href: `http://www.sgtools.info/multiple/${winner.username}`,
													},
													type: 'a',
													children: [
														{
															text: `${winner.sgToolsErrorMW} `,
															type: 'node',
														},
														{
															attributes: {
																class: 'fa fa-clone',
																title: 'Multiple wins',
															},
															type: 'i',
														},
													],
											  }
											: null,
										{
											attributes: {
												class: 'fa fa-question-circle',
												title: winner.error,
											},
											type: 'i',
										},
									],
								},
							]);
						} else if (!ugs.isCanceled) {
							await request({
								data: `xsrf_token=${Session.xsrfToken}&do=sent_feedback&action=1&winner_id=${winner.winnerId}`,
								method: 'POST',
								url: '/ajax.php',
							});
							if (!ugs.sentWinners[giveaway.code]) {
								ugs.sentWinners[giveaway.code] = [];
							}
							ugs.sent.classList.remove('esgst-hidden');
							ugs.sentWinners[giveaway.code].push(winner.username);
							ugs.sentCount.textContent = parseInt(ugs.sentCount.textContent) + 1;
							createElements(ugs.sentGifts, 'beforeend', [
								{
									type: 'span',
									children: [
										{
											attributes: {
												href: `/user/${winner.username}`,
											},
											text: winner.username,
											type: 'a',
										},
										{
											text: ` (`,
											type: 'node',
										},
										{
											attributes: {
												href: `${giveaway.url}/winners`,
											},
											text: giveaway.name,
											type: 'a',
										},
										{
											text: `)`,
											type: 'node',
										},
									],
								},
							]);
							ugs.winners[winner.username].push(giveaway.name);
							if (document.body.contains(giveaway.context)) {
								giveaway.context.className = 'fa fa-check-circle icon-green';
								giveaway.context.nextElementSibling.textContent = 'Sent';
							}
						}
					} else {
						// exact same game has already been sent to this winner, meaning they won multiple copies of the same game, so extra gifts cannot be sent
						ugs.unsent.classList.remove('esgst-hidden');
						ugs.unsentCount.textContent = parseInt(ugs.unsentCount.textContent) + 1;
						createElements(ugs.unsentGifts, 'beforeend', [
							{
								type: 'span',
								children: [
									{
										attributes: {
											href: `/user/${winner.username}`,
										},
										text: winner.username,
										type: 'a',
									},
									{
										text: ` (`,
										type: 'node',
									},
									{
										attributes: {
											href: `${giveaway.url}/winners`,
										},
										text: giveaway.name,
										type: 'a',
									},
									{
										text: `) `,
										type: 'node',
									},
									{
										attributes: {
											class: 'fa fa-question-circle',
											title: `${winner.username} already won ${giveaway.name} from another giveaway of yours`,
										},
										type: 'i',
									},
								],
							},
						]);
					}
				}
			}

			// finalize process
			let winners = JSON.parse(getValue('winners', '{}'));
			for (let key in ugs.sentWinners) {
				if (ugs.sentWinners.hasOwnProperty(key)) {
					if (!winners[key]) {
						winners[key] = [];
					}
					for (let i = 0, n = ugs.sentWinners[key].length; i < n; i++) {
						winners[key].push(ugs.sentWinners[key][i]);
					}
				}
			}
			let savedUsers = [];
			for (let key in ugs.giveaways) {
				if (ugs.giveaways.hasOwnProperty(key)) {
					for (let i = 0, n = ugs.giveaways[key].winners.length; i < n; i++) {
						savedUsers.push(ugs.giveaways[key].winners[i]);
					}
				}
			}
			ugs.progressBar.setMessage('Saving data...');
			ugs.overallProgressBar.hide();
			await Promise.all([
				setValue('winners', JSON.stringify(winners)),
				saveUsers(savedUsers),
				setValue('groups', JSON.stringify(this.esgst.groups)),
			]);
			ugs.button.classList.remove('esgst-busy');
			ugs.progressBar.reset().hide();
			ugs.overallProgressBar.setSuccess('All giveaways checked!').show();
		} else {
			// there are no unsent gifts
			ugs.button.classList.remove('esgst-busy');
			ugs.progressBar.setWarning('You do not have any unsent gifts.');
			ugs.overallProgressBar.reset().hide();
		}
	}

	ugs_cancel(ugs) {
		ugs.isCanceled = true;
		ugs.button.classList.remove('esgst-busy');
		ugs.progressBar.reset().hide();
	}
}

const giveawaysUnsentGiftSender = new GiveawaysUnsentGiftSender();

export { giveawaysUnsentGiftSender };
