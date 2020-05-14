import { Module } from '../../class/Module';
import { common } from '../Common';
import { Shared } from '../../class/Shared';

const
	createElements = common.createElements.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common),
	getValue = common.getValue.bind(common),
	setValue = common.setValue.bind(common)
	;

class UsersInboxWinnerHighlighter extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				['ul', [
					['li', [
						`Adds an icon (`,
						['i', { class: 'fa fa-trophy' }],
						`) next to the username of a giveaway comment made by the giveaway's winner(s) (in the `,
						['a', { href: `https://www.steamgifts.com/messages` }, 'inbox'],
						` page).`
					]],
					['li', 'A winner is only highlighted if you sent the gift to them after this feature was enabled.']
				]]
			],
			id: 'iwh',
			name: 'Inbox Winner Highlighter',
			sg: true,
			type: 'users',
			featureMap: {
				endless: this.iwh_getUsers.bind(this)
			}
		};
	}

	async iwh_getUsers(context, main, source, endless) {
		if (!Shared.esgst.winnersPath && !Shared.common.isCurrentPath('Messages') && (!context.getAttribute || !context.getAttribute('data-esgst-qiv'))) return;
		const [callback, query] = Shared.esgst.winnersPath ? [this.iwh_setObserver, `${endless ? `.esgst-es-page-${endless} .table__gift-not-sent, .esgst-es-page-${endless}.table__gift-not-sent` : '.table__gift-not-sent'}`] : [this.iwh_highlightWinner, `${endless ? `.esgst-es-page-${endless} .comments__entity, .esgst-es-page-${endless}.comments__entity` : '.comments__entity'}`],
			elements = context.querySelectorAll(query);
		if (!elements.length) return;
		const winners = JSON.parse(getValue('winners', '{}'));
		for (let i = 0, n = elements.length; i < n; ++i) {
			callback(elements[i], winners);
		}
	}

	iwh_setObserver(Context, winners) {
		let Key, Username;
		Key = window.location.pathname.match(/\/giveaway\/(.+?)\//)[1];
		Username = Context.closest('.table__row-inner-wrap').getElementsByClassName('table__column__heading')[0].querySelector(`a[href*="/user/"]`).textContent;
		Context.addEventListener('click', async () => {
			let Winners;
			Winners = JSON.parse(getValue('winners', '{}'));
			if (!Winners[Key]) {
				Winners[Key] = [];
			}
			if (Winners[Key].indexOf(Username) < 0) {
				Winners[Key].push(Username);
			}
			setValue('winners', JSON.stringify(Winners));
		});
	}

	iwh_highlightWinner(Context, Winners) {
		let Match, Key, Matches, I, N, Username;
		Match = Context.firstElementChild.firstElementChild.getAttribute('href').match(/\/giveaway\/(.+?)\//);
		if (Match) {
			Key = Match[1];
			if (Winners[Key]) {
				Matches = Context.nextElementSibling.children;
				for (I = 0, N = Matches.length; I < N; ++I) {
					Context = Matches[I].getElementsByClassName('comment__username')[0];
					Username = Context.textContent;
					if (Winners[Key].indexOf(Username) >= 0) {
						createElements(Context, 'afterEnd', [{
							attributes: {
								class: 'fa fa-trophy esgst-iwh-icon',
								title: getFeatureTooltip('iwh', 'This is the winner or one of the winners of this giveaway')
							},
							type: 'i'
						}]);
					}
				}
			}
		}
	}
}

const usersInboxWinnerHighlighter = new UsersInboxWinnerHighlighter();

export { usersInboxWinnerHighlighter };