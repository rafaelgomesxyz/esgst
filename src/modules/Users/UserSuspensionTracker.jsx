import { Checkbox } from '../../class/Checkbox';
import { DOM } from '../../class/DOM';
import { FetchRequest } from '../../class/FetchRequest';
import { Module } from '../../class/Module';
import { permissions } from '../../class/Permissions';
import { Popup } from '../../class/Popup';
import { Shared } from '../../class/Shared';
import { common } from '../Common';

const createElements = common.createElements.bind(common),
	createHeadingButton = common.createHeadingButton.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common),
	getValue = common.getValue.bind(common),
	request = common.request.bind(common),
	setValue = common.setValue.bind(common);
class UsersUserSuspensionTracker extends Module {
	constructor() {
		super();
		this.callback = null;
		this.checkboxes = {};
		this.tickets = {};
		this.info = {
			description: () => (
				<ul>
					<li>
						When checking a user with <span data-esgst-feature-id="namwc"></span>, that feature will
						also check if the user has already served suspensions for any infractions found so that
						you do not need to report them again.
					</li>
					<li>
						It is impossible to retrieve that information automatically, so the database (which is
						kept globally in a Google Sheet) needs to be maintained by ESGST users. For that, this
						feature adds 2 identical buttons (<i className="fa fa-paper-plane"></i>) to the main
						page heading of 2 different locations:
					</li>
					<ul>
						<li>
							Your <a href="https://www.steamgifts.com/support/tickets">tickets</a> page, which
							allows you to send multiple tickets to the database at once. The feature adds a
							checkbox in front of each ticket that belongs to one of the accepted categories so
							that you can select the tickets that you want to send. There are shortcuts that can
							help you select them:
							<ul>
								<li>
									Clicking on an unchecked checkbox with the Ctrl key pressed will select all of the
									tickets.
								</li>
								<li>
									Clicking on a checked checkbox with the Ctrl key pressed will unselect all of the
									tickets.
								</li>
								<li>
									Clicking on any checkbox with the Alt key pressed will toggle all of the tickets
									(any tickets that were unselected will be selected and any tickets that were
									selected will be unselected).
								</li>
							</ul>
						</li>
						<li>
							A ticket you created, which allows you to send that single ticket to the database.
						</li>
					</ul>
					<li>
						You can only send tickets that belong to one of the accepted categories to the database:
					</li>
					<ul>
						<li>Request New Winner {'>'} Did Not Activate Previous Wins This Month</li>
						<li>Request New Winner {'>'} Other</li>
						<li>User Report {'>'} Multiple Wins for the Same Game</li>
						<li>User Report {'>'} Not Activating Won Gift</li>
					</ul>
					<li>
						When you send a ticket, the HTML containing all of the ticket's information (including
						any comments) is sent to the database, and the ticket is requested before being sent,
						which prevents users from tampering with the HTML.
					</li>
					<li>
						After you send a ticket you will no longer have the option to send it again, to prevent
						duplicate entries.
					</li>
				</ul>
			),
			id: 'ust',
			name: 'User Suspension Tracker',
			sg: true,
			st: true,
			type: 'users',
		};
	}

	init() {
		if (Shared.esgst.ticketsPath) {
			Shared.esgst.ustButton = createHeadingButton({
				id: 'ust',
				icons: ['fa-paper-plane'],
				title: 'Send selected tickets to the User Suspension Tracker database',
			});
			this.callback = this.ust_sendAll.bind(this, null);
			Shared.esgst.ustButton.addEventListener('click', this.callback);
		} else if (
			Shared.esgst.ticketPath &&
			document
				.getElementsByClassName('table__column--width-fill')[1]
				.textContent.trim()
				.match(
					/Did\sNot\sActivate\sPrevious\sWins\sThis\sMonth|Other|Multiple\sWins\sfor\sthe\sSame\sGame|Not\sActivating\sWon\sGift/
				)
		) {
			const authorElement = document.querySelector('.comment__username');
			const closeElement = document.querySelector(`.notification [href*="/user/"]`);
			if (
				authorElement &&
				closeElement &&
				authorElement.textContent.trim() !== closeElement.textContent.trim()
			) {
				let code, tickets;
				code = window.location.pathname.match(/\/ticket\/(.+?)\//)[1];
				tickets = JSON.parse(Shared.common.getValue('tickets', '{}'));
				if (!tickets[code] || !tickets[code].sent) {
					Shared.esgst.ustButton = createElements(
						document.getElementsByClassName('page__heading')[0].lastElementChild,
						'beforebegin',
						[
							{
								attributes: {
									class: 'esgst-heading-button',
									title: `${getFeatureTooltip(
										'ust',
										'Send ticket to the User Suspension Tracker database'
									)}`,
								},
								type: 'div',
								children: [
									{
										attributes: {
											class: 'fa fa-paper-plane',
										},
										type: 'i',
									},
								],
							},
						]
					);
					this.callback = this.ust_sendAll.bind(this, code);
					Shared.esgst.ustButton.addEventListener('click', this.callback);
				}
			}
		}
	}

	async ust_sendAll(code) {
		if (!(await permissions.contains([['server']]))) {
			return;
		}

		Shared.esgst.ustButton.removeEventListener('click', this.callback);
		createElements(Shared.esgst.ustButton, 'atinner', [
			{
				attributes: {
					class: 'fa fa-circle-o-notch fa-spin',
				},
				type: 'i',
			},
		]);
		const obj = {
			tickets: [],
		};
		const promises = [];
		if (code) {
			promises.push(this.ust_check(code, obj));
		} else {
			const codes = Object.keys(this.checkboxes);
			for (const code of codes) {
				promises.push(this.ust_check(code, obj));
			}
		}
		await Promise.all(promises);
		const response = await FetchRequest.post('https://rafaelgssa.com/esgst/users/ust', {
			data: JSON.stringify(obj),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (!response.json || response.json.error) {
			createElements(Shared.esgst.ustButton, 'atinner', [
				{
					attributes: {
						class: 'fa fa-paper-plane',
					},
					type: 'i',
				},
			]);
			Shared.esgst.ustButton.addEventListener('click', this.callback);
			new Popup({
				icon: '',
				isTemp: true,
				title: 'Failed to send tickets! Try again later.',
			}).open();
		} else {
			let tickets = JSON.parse(getValue('tickets'));
			for (let code in this.checkboxes) {
				if (this.checkboxes.hasOwnProperty(code)) {
					if (!tickets[code]) {
						tickets[code] = {
							readComments: {},
						};
					}
					tickets[code].sent = 1;
					this.checkboxes[code].remove();
					delete this.checkboxes[code];
				}
			}
			await setValue('tickets', JSON.stringify(tickets));
			Shared.esgst.ustButton.remove();
			new Popup({
				icon: '',
				isTemp: true,
				title:
					'Tickets sent! It could take from 48 hours to 1 week until they are added to the database.',
			}).open();
		}
	}

	async ust_check(code, obj) {
		let responseHtml = DOM.parse(
			(await request({ method: 'GET', url: `/support/ticket/${code}/` })).responseText
		);
		if (
			responseHtml
				.getElementsByClassName('table__column--width-fill')[1]
				.textContent.trim()
				.match(
					/Did\sNot\sActivate\sPrevious\sWins\sThis\sMonth|Other|Multiple\sWins\sfor\sthe\sSame\sGame|Not\sActivating\sWon\sGift/
				)
		) {
			const authorElement = responseHtml.querySelector('.comment__username');
			const closeElement = responseHtml.querySelector(`.notification [href*="/user/"]`);
			if (
				authorElement &&
				closeElement &&
				authorElement.textContent.trim() !== closeElement.textContent.trim()
			) {
				obj.tickets.push({
					ticketId: code,
					ticket: responseHtml
						.getElementsByClassName('sidebar')[0]
						.nextElementSibling.innerHTML.replace(/\n|\r|\r\n|\s{2,}/g, '')
						.trim(),
				});
			}
		}
	}

	ust_addCheckbox(code, context) {
		if (!context.getElementsByClassName('esgst-ust-checkbox')[0]) {
			context.classList.add('esgst-relative');
			let checkbox = new Checkbox(context);
			checkbox.checkbox.classList.add('esgst-ust-checkbox');
			this.tickets[code] = checkbox;
			checkbox.onEnabled = (event) => {
				if (event) {
					if (event.ctrlKey) {
						for (let code in this.tickets) {
							if (this.tickets.hasOwnProperty(code)) {
								this.tickets[code].check();
							}
						}
					} else if (event.altKey) {
						checkbox.toggle();
						for (let code in this.tickets) {
							if (this.tickets.hasOwnProperty(code)) {
								this.tickets[code].toggle();
							}
						}
					}
				}
				this.checkboxes[code] = checkbox.checkbox;
			};
			checkbox.onDisabled = (event) => {
				if (event) {
					if (event.ctrlKey) {
						for (let code in this.tickets) {
							if (this.tickets.hasOwnProperty(code)) {
								this.tickets[code].uncheck();
							}
						}
					} else if (event.altKey) {
						checkbox.toggle();
						for (let code in this.tickets) {
							if (this.tickets.hasOwnProperty(code)) {
								this.tickets[code].toggle();
							}
						}
					}
				}
				delete this.checkboxes[code];
			};
		}
	}
}

const usersUserSuspensionTracker = new UsersUserSuspensionTracker();

export { usersUserSuspensionTracker };
