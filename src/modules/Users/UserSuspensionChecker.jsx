import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { Utils } from '../../lib/jsUtils';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

class UsersUserSuspensionChecker extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a button (<i className="fa fa-user"></i> <i className="fa fa-ban"></i>{' '}
						<i className="fa fa-question-circle"></i>) to the main page heading of any page that
						allows you to check which users in the page are suspended.
					</li>
				</ul>
			),
			id: 'usc',
			name: 'User Suspension Checker',
			sg: true,
			type: 'users',
		};
	}

	init() {
		if (!Shared.esgst.mainPageHeading) {
			return;
		}
		Shared.esgst.uscButton = Shared.common.createHeadingButton({
			id: 'usc',
			icons: ['fa-user', 'fa-ban', 'fa-question-circle'],
			title: 'Check users for suspensions',
		});
		this.addButton(Shared.esgst.uscButton);
	}

	addButton(button) {
		const uscObj = {};
		if (window.location.pathname.match(new RegExp(`^/user/(?!${Settings.get('username')})`))) {
			uscObj.username = document.getElementsByClassName('featured__heading__medium')[0].textContent;
		}
		const popup = new Popup({
			addScrollable: true,
			icon: 'fa-question',
			title: `Check users for suspensions:`,
		});
		DOM.insert(popup.description, 'beforeend', <div ref={(ref) => (uscObj.options = ref)} />);
		let checkSingleSwitch;
		if (uscObj.username) {
			checkSingleSwitch = new ToggleSwitch(
				uscObj.options,
				'usc_checkSingle',
				false,
				`Only check ${uscObj.username || 'current user'}.`,
				false,
				false,
				`If disabled, all users in the current page will be checked.`,
				Settings.get('usc_checkSingle')
			);
		}
		const mmFeature = Shared.common.getFeatureNumber('mm');
		const checkSelectedSwitch = new ToggleSwitch(
			uscObj.options,
			'usc_checkSelected',
			false,
			'Only check selected.',
			false,
			false,
			`Use ${mmFeature.number} ${mmFeature.name} to select the users that you want to check. Then click the button 'Check Suspensions' in the Multi-Manager popout and you will be redirected here.`,
			Settings.get('usc_checkSelected')
		);
		let checkAllSwitch;
		let checkPagesSwitch;
		if (!window.location.pathname.match(/^\/(discussions|users|archive)/)) {
			checkAllSwitch = new ToggleSwitch(
				uscObj.options,
				'usc_checkAll',
				false,
				'Check all pages.',
				false,
				false,
				`If disabled, only the current page will be checked.`,
				Settings.get('usc_checkAll')
			);
			checkPagesSwitch = new ToggleSwitch(
				uscObj.options,
				'usc_checkPages',
				false,
				(
					<fragment>
						Check only pages from{' '}
						<input
							className="esgst-switch-input"
							min="1"
							type="number"
							value={Settings.get('usc_minPage')}
						/>
						{' to '}
						<input
							className="esgst-switch-input"
							min="1"
							type="number"
							value={Settings.get('usc_maxPage')}
						/>
						.
					</fragment>
				),
				false,
				false,
				null,
				Settings.get('usc_checkPages')
			);
			const minPage = checkPagesSwitch.name.firstElementChild;
			const maxPage = minPage.nextElementSibling;
			const lastPage = Shared.esgst.modules.generalLastPageLink.lpl_getLastPage(document, true);
			if (lastPage !== 999999999) {
				maxPage.setAttribute('max', lastPage);
			}
			Shared.common.observeNumChange(minPage, 'usc_minPage', true);
			Shared.common.observeNumChange(maxPage, 'usc_maxPage', true);
		}
		if (checkSingleSwitch || checkAllSwitch || checkPagesSwitch) {
			if (checkSingleSwitch) {
				if (checkAllSwitch) {
					checkSingleSwitch.exclusions.push(checkAllSwitch.container);
				}
				if (checkPagesSwitch) {
					checkSingleSwitch.exclusions.push(checkPagesSwitch.container);
				}
				checkSingleSwitch.exclusions.push(checkSelectedSwitch.container);
				checkSelectedSwitch.exclusions.push(checkSingleSwitch.container);
				if (Settings.get('usc_checkSingle')) {
					if (checkAllSwitch) {
						checkAllSwitch.container.classList.add('esgst-hidden');
					}
					if (checkPagesSwitch) {
						checkPagesSwitch.container.classList.add('esgst-hidden');
					}
					checkSelectedSwitch.container.classList.add('esgst-hidden');
				} else if (Settings.get('usc_checkSelected')) {
					checkSingleSwitch.container.classList.add('esgst-hidden');
				}
			}
			if (checkAllSwitch) {
				if (checkSingleSwitch) {
					checkAllSwitch.exclusions.push(checkSingleSwitch.container);
				}
				if (checkPagesSwitch) {
					checkAllSwitch.exclusions.push(checkPagesSwitch.container);
				}
				checkSelectedSwitch.exclusions.push(checkAllSwitch.container);
				checkAllSwitch.exclusions.push(checkSelectedSwitch.container);
				if (Settings.get('usc_checkAll')) {
					if (checkSingleSwitch) {
						checkSingleSwitch.container.classList.add('esgst-hidden');
					}
					if (checkPagesSwitch) {
						checkPagesSwitch.container.classList.add('esgst-hidden');
					}
					checkSelectedSwitch.container.classList.add('esgst-hidden');
				} else if (Settings.get('usc_checkSelected')) {
					checkAllSwitch.container.classList.add('esgst-hidden');
				}
			}
			if (checkPagesSwitch) {
				if (checkSingleSwitch) {
					checkPagesSwitch.exclusions.push(checkSingleSwitch.container);
				}
				if (checkAllSwitch) {
					checkPagesSwitch.exclusions.push(checkAllSwitch.container);
				}
				checkSelectedSwitch.exclusions.push(checkPagesSwitch.container);
				checkPagesSwitch.exclusions.push(checkSelectedSwitch.container);
				if (Settings.get('usc_checkPages')) {
					if (checkSingleSwitch) {
						checkSingleSwitch.container.classList.add('esgst-hidden');
					}
					if (checkAllSwitch) {
						checkAllSwitch.container.classList.add('esgst-hidden');
					}
					checkSelectedSwitch.container.classList.add('esgst-hidden');
				} else if (Settings.get('usc_checkSelected')) {
					checkPagesSwitch.container.classList.add('esgst-hidden');
				}
			}
		}
		popup.description.appendChild(
			new ButtonSet({
				color1: 'green',
				color2: 'grey',
				icon1: 'fa-question-circle',
				icon2: 'fa-times-circle',
				title1: 'Check',
				title2: 'Cancel',
				callback1: async () => {
					button.classList.add('esgst-busy');
					await this.setCheck(uscObj);
					button.classList.remove('esgst-busy');
					popup.setDone();
				},
				callback2: () => {
					uscObj.canceled = true;
					window.setTimeout(() => {
						uscObj.progress.innerHTML = '';
					}, 500);
					button.classList.remove('esgst-busy');
				},
			}).set
		);
		DOM.insert(popup.description, 'beforeend', <div ref={(ref) => (uscObj.progress = ref)}></div>);
		DOM.insert(popup.scrollable, 'beforeend', <div ref={(ref) => (uscObj.results = ref)}></div>);
		Shared.common.createResults(uscObj.results, uscObj, [
			{
				Icon: 'fa fa-times-circle esgst-red',
				Description: `Suspended: `,
				Key: 'suspended',
			},
			{
				Icon: 'fa fa-times esgst-red',
				Description: `Banned: `,
				Key: 'banned',
			},
			{
				Icon: 'fa fa-check esgst-green',
				Description: `None: `,
				Key: 'none',
			},
		]);
		button.addEventListener('click', () => {
			if (button.getAttribute('data-mm')) {
				if (!Settings.get('usc_checkSelected')) {
					if (Settings.get('usc_checkSingle') && checkSingleSwitch) {
						let element = Shared.common.createElements(checkSingleSwitch.container, 'afterbegin', [
							{
								attributes: {
									class: 'esgst-bold esgst-red',
								},
								text: 'Disable this -->',
								type: 'span',
							},
						]);
						window.setTimeout(() => element.remove(), 5000);
					} else if (Settings.get('usc_checkAll')) {
						let element = Shared.common.createElements(checkAllSwitch.container, 'afterbegin', [
							{
								attributes: {
									class: 'esgst-bold esgst-red',
								},
								text: 'Disable this -->',
								type: 'span',
							},
						]);
						window.setTimeout(() => element.remove(), 5000);
					} else if (Settings.get('usc_checkPages')) {
						let element = Shared.common.createElements(checkPagesSwitch.container, 'afterbegin', [
							{
								attributes: {
									class: 'esgst-bold esgst-red',
								},
								text: 'Disable this -->',
								type: 'span',
							},
						]);
						window.setTimeout(() => element.remove(), 5000);
					}
					let element = Shared.common.createElements(checkSelectedSwitch.container, 'afterbegin', [
						{
							attributes: {
								class: 'esgst-bold esgst-red',
							},
							text: 'Enable this -->',
							type: 'span',
						},
					]);
					window.setTimeout(() => element.remove(), 5000);
				}
				button.removeAttribute('data-mm');
			}
			popup.open();
		});
	}

	async setCheck(uscObj) {
		uscObj.progress.innerHTML = '';
		uscObj.suspended.classList.add('esgst-hidden');
		uscObj.banned.classList.add('esgst-hidden');
		uscObj.none.classList.add('esgst-hidden');
		uscObj.suspendedCount.textContent = uscObj.bannedCount.textContent = uscObj.noneCount.textContent =
			'0';
		uscObj.suspendedUsers.innerHTML = '';
		uscObj.bannedUsers.innerHTML = '';
		uscObj.noneUsers.innerHTML = '';
		uscObj.users = [];
		uscObj.canceled = false;
		if (uscObj.username && Settings.get('usc_checkSingle')) {
			uscObj.users.push(uscObj.username);
			await this.checkUsers(uscObj);
		} else {
			if (Settings.get('usc_checkSelected')) {
				uscObj.users = Array.from(Shared.esgst.mmWbcUsers);
			} else if (!Settings.get('usc_checkPages')) {
				const elements = Shared.esgst.pageOuterWrap.querySelectorAll(`a[href*="/user/"]`);
				for (const element of elements) {
					const match = element.getAttribute('href').match(/\/user\/(.+)/);
					if (!match) {
						continue;
					}
					const username = match[1];
					if (
						uscObj.users.indexOf(username) > -1 ||
						username === Settings.get('username') ||
						username !== element.textContent ||
						element.closest('.markdown')
					) {
						continue;
					}
					uscObj.users.push(username);
				}
			}
			if (
				(Settings.get('usc_checkAll') || Settings.get('usc_checkPages')) &&
				((uscObj.username && !Settings.get('usc_checkSingle')) || !uscObj.username) &&
				!window.location.pathname.match(/^\/(discussions|users|archive)/)
			) {
				await this.getUsers(uscObj);
			}
			uscObj.users = Utils.sortArray(uscObj.users);
			if (window.location.pathname.match(/^\/users/)) {
				uscObj.users = uscObj.users.slice(0, 25);
			}
			await this.checkUsers(uscObj);
		}
	}

	async checkUsers(uscObj) {
		let i, n;
		for (i = 0, n = uscObj.users.length; i < n && !uscObj.canceled; i++) {
			uscObj.progress.innerHTML = `${i} of ${n} users checked...`;
			const username = uscObj.users[i];
			const html = DOM.parse(
				(
					await Shared.common.request({
						method: 'GET',
						url: `/user/${username}`,
					})
				).responseText
			);
			if (uscObj.canceled) {
				return;
			}
			let key = '';
			let text = '';
			const suspension = html.querySelector('.sidebar__suspension');
			if (suspension) {
				if (suspension.textContent.match(/Suspended/)) {
					key = 'suspended';
					const suspensionTime = html.querySelector('.sidebar__suspension-time');
					text = suspensionTime.textContent;
				} else {
					key = 'banned';
				}
			} else {
				key = 'none';
			}
			uscObj[key].classList.remove('esgst-hidden');
			DOM.insert(
				uscObj[`${key}Users`],
				'beforeend',
				<div>
					<a href={`/user/${username}`}>{username}</a> {text ? ` (${text})` : null}
				</div>
			);
			uscObj[`${key}Count`].textContent = parseInt(uscObj[`${key}Count`].textContent) + 1;
		}
		uscObj.progress.innerHTML = `${i} of ${n} users checked...`;
	}

	async getUsers(uscObj) {
		if (uscObj.canceled) {
			return;
		}
		let pagination = null;
		let nextPage;
		if (Settings.get('usc_checkPages')) {
			nextPage = Settings.get('usc_minPage');
			uscObj.lastPage = `of ${Settings.get('usc_maxPage')}`;
		} else {
			nextPage = 1;
			uscObj.lastPage = '';
		}
		do {
			let html;
			if (nextPage === Shared.esgst.currentPage) {
				html = Shared.esgst.pageOuterWrap;
			} else {
				html = DOM.parse(
					(
						await Shared.common.request({
							method: 'GET',
							url: `${Shared.esgst.searchUrl}${nextPage}`,
						})
					).responseText
				);
			}
			if (uscObj.canceled) {
				return;
			}
			if (!uscObj.lastPage) {
				uscObj.lastPage = Shared.esgst.modules.generalLastPageLink.lpl_getLastPage(html, true);
				uscObj.lastPage = uscObj.lastPage === 999999999 ? '' : ` of ${uscObj.lastPage}`;
			}
			DOM.insert(
				uscObj.progress,
				'atinner',
				<fragment>
					<i className="fa fa-circle-o-notch fa-spin"></i>
					<span>{`Retrieving users (page ${nextPage}${uscObj.lastPage})...`}</span>
				</fragment>
			);
			const elements = html.querySelectorAll(`a[href*="/user/"]`);
			for (const element of elements) {
				const match = element.getAttribute('href').match(/\/user\/(.+)/);
				if (match) {
					const username = match[1];
					if (
						uscObj.users.indexOf(username) < 0 &&
						username !== Settings.get('username') &&
						username === element.textContent &&
						!element.closest('.markdown')
					) {
						uscObj.users.push(username);
					}
				}
			}
			pagination = html.querySelector('.pagination__navigation');
			nextPage += 1;
		} while (
			!uscObj.canceled &&
			pagination &&
			!pagination.lastElementChild.classList.contains('is-selected') &&
			(!Settings.get('usc_checkPages') || nextPage <= Settings.get('usc_maxPage'))
		);
	}
}

const usersUserSuspensionChecker = new UsersUserSuspensionChecker();

export { usersUserSuspensionChecker };
