import { Module } from '../../class/Module';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

class GeneralShortcutKeys extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>Allows you to perform many different tasks by pressing certain keys.</li>
				</ul>
			),
			features: {
				sk_cp: {
					inputItems: 'sk_closePopups',
					name: 'Close all currently opened popups.',
					sg: true,
					st: true,
				},
				sk_sb: {
					inputItems: 'sk_searchBox',
					name: 'Focus on the search box.',
					sg: true,
					st: true,
				},
				sk_fp: {
					inputItems: 'sk_firstPage',
					name: 'Go to the first page.',
					sg: true,
					st: true,
				},
				sk_pp: {
					inputItems: 'sk_previousPage',
					name: 'Go to the previous page.',
					sg: true,
					st: true,
				},
				sk_np: {
					inputItems: 'sk_nextPage',
					name: 'Go to the next page.',
					sg: true,
					st: true,
				},
				sk_lp: {
					inputItems: 'sk_lastPage',
					name: 'Go to the last page.',
					sg: true,
					st: true,
				},
				sk_tf: {
					inputItems: 'sk_toggleFilters',
					name: 'Toggle the giveaway filters.',
					sg: true,
				},
				sk_hg: {
					inputItems: 'sk_hideGame',
					name: 'Hide the game when inside of a giveaway.',
					sg: true,
				},
				sk_hga: {
					inputItems: 'sk_hideGiveaway',
					name: 'Hide the giveaway when inside of a giveaway.',
					sg: true,
				},
				sk_ge: {
					inputItems: 'sk_giveawayEntry',
					name: 'Enter/leave the giveaway when inside of a giveaway.',
					sg: true,
				},
				sk_c: {
					inputItems: 'sk_creator',
					name:
						'Insert the username of the creator of the giveaway/discussion/trade to the current reply box.',
					sg: true,
					st: true,
				},
				sk_rb: {
					inputItems: 'sk_replyBox',
					name: 'Focus on the reply box.',
					sg: true,
					st: true,
				},
				sk_ru: {
					inputItems: 'sk_replyUser',
					name:
						'Insert the username of the user to whom you are replying to the current reply box.',
					sg: true,
					st: true,
				},
				sk_sr: {
					inputItems: 'sk_submitReply',
					name: 'Submit the current reply.',
					sg: true,
					st: true,
				},
			},
			id: 'sk',
			name: 'Shortcut Keys',
			sg: true,
			st: true,
			type: 'general',
		};
	}

	init() {
		let methods = {};
		if (Settings.get('sk_cp')) {
			methods[Settings.get('sk_closePopups')] = (event) => {
				if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/)) {
					let buttons = document.querySelectorAll(`.b-close, .esgst-popup-close`),
						i;
					for (i = buttons.length - 1; i > -1; --i) {
						buttons[i].click();
					}
					event.preventDefault();
				}
			};
		}
		if (Settings.get('sk_sb')) {
			methods[Settings.get('sk_searchBox')] = (event) => {
				if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/)) {
					let search = document.getElementsByClassName('sidebar__search-input')[0];
					if (search) {
						search.focus();
						event.preventDefault();
					}
				}
			};
		}
		if (Settings.get('sk_fp')) {
			methods[Settings.get('sk_firstPage')] = (event) => {
				if (
					!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) &&
					this.esgst.paginationNavigation &&
					this.esgst.currentPage > 1
				) {
					window.location.href = `${this.esgst.searchUrl}1`;
					event.preventDefault();
				}
			};
		}
		if (Settings.get('sk_pp')) {
			methods[Settings.get('sk_previousPage')] = (event) => {
				if (
					!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) &&
					this.esgst.paginationNavigation &&
					this.esgst.currentPage > 1
				) {
					window.location.href = `${this.esgst.searchUrl}${this.esgst.currentPage - 1}`;
					event.preventDefault();
				}
			};
		}
		if (Settings.get('sk_np')) {
			methods[Settings.get('sk_nextPage')] = (event) => {
				if (
					!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) &&
					this.esgst.paginationNavigation &&
					this.esgst.currentPage < this.esgst.lastPage
				) {
					window.location.href = `${this.esgst.searchUrl}${this.esgst.currentPage + 1}`;
					event.preventDefault();
				}
			};
		}
		if (Settings.get('sk_lp')) {
			methods[Settings.get('sk_lastPage')] = (event) => {
				if (
					!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) &&
					this.esgst.paginationNavigation &&
					this.esgst.currentPage < this.esgst.lastPage &&
					this.esgst.lastPage !== 999999999
				) {
					window.location.href = `${this.esgst.searchUrl}${this.esgst.lastPage}`;
					event.preventDefault();
				}
			};
		}
		if (Settings.get('sk_tf')) {
			methods[Settings.get('sk_toggleFilters')] = (event) => {
				if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/)) {
					let toggle = document.querySelector('.esgst-gf-toggle-switch');
					if (toggle) {
						toggle.click();
						event.preventDefault();
					}
				}
			};
		}
		if (Settings.get('sk_hg')) {
			methods[Settings.get('sk_hideGame')] = (event) => {
				if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) && this.esgst.giveawayPath) {
					let button =
						(document.getElementsByClassName('popup--hide-games')[0].style.display &&
							document.getElementsByClassName('popup--hide-games')[0].style.display !== 'none' &&
							document.getElementsByClassName('js__submit-hide-games')[0]) ||
						document.querySelector(`.esgst-ochgb, .giveaway__hide, .featured__giveaway__hide`);
					if (button) {
						(button.classList.contains('esgst-ochgb') ? button.firstElementChild : button).click();
						event.preventDefault();
					}
				}
			};
		}
		if (Settings.get('sk_hga')) {
			methods[Settings.get('sk_hideGiveaway')] = (event) => {
				if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) && this.esgst.giveawayPath) {
					let button = document.querySelector(`.esgst-gf-hide-button, .esgst-gf-unhide-button`);
					if (button) {
						button.firstElementChild.dispatchEvent(new Event('click'));
						event.preventDefault();
					}
				}
			};
		}
		if (Settings.get('sk_ge')) {
			methods[Settings.get('sk_giveawayEntry')] = (event) => {
				if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) && this.esgst.enterGiveawayButton) {
					if (this.esgst.enterGiveawayButton.classList.contains('is-hidden')) {
						this.esgst.leaveGiveawayButton.click();
					} else {
						this.esgst.enterGiveawayButton.click();
					}
					event.preventDefault();
				}
			};
		}
		if (Settings.get('sk_c')) {
			methods[Settings.get('sk_creator')] = (event) => {
				if (event.target.tagName.match(/^(INPUT|TEXTAREA)$/)) {
					let text = event.target.value;
					let end = event.target.selectionEnd;
					const creatorElement = document.querySelector(
						`.featured__column--width-fill.text-right a, .comment__username, .author_name`
					);
					if (creatorElement) {
						const creator = creatorElement.textContent;
						let range = end + creator.length;
						event.target.value = `${text.slice(
							0,
							event.target.selectionStart
						)}${creator}${text.slice(end)}`;
						event.target.setSelectionRange(range, range);
						event.target.focus();
						event.preventDefault();
					}
				}
			};
		}
		if (Settings.get('sk_rb')) {
			methods[Settings.get('sk_replyBox')] = (event) => {
				if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) && this.esgst.replyBox) {
					this.esgst.replyBox.getElementsByTagName('textarea')[0].focus();
					event.preventDefault();
				}
			};
		}
		if (Settings.get('sk_ru')) {
			methods[Settings.get('sk_replyUser')] = (event) => {
				if (event.target.tagName === 'TEXTAREA') {
					let text = event.target.value;
					let end = event.target.selectionEnd;
					let user = event.target.closest(`.comment__children, .comment_children`);
					user =
						(user &&
							user
								.closest(`.comment, .comment_outer`)
								.querySelector(`.comment__username, .author_name`)) ||
						document.querySelector(
							`.featured__column--width-fill.text-right a, .comment__username, .author_name`
						);
					if (user) {
						user = user.textContent;
						let range = end + user.length;
						event.target.value = `${text.slice(0, event.target.selectionStart)}${user}${text.slice(
							end
						)}`;
						event.target.setSelectionRange(range, range);
						event.target.focus();
						event.preventDefault();
					}
				}
			};
		}
		if (Settings.get('sk_sr')) {
			methods[Settings.get('sk_submitReply')] = (event) => {
				if (event.target.tagName === 'TEXTAREA') {
					let reply = event.target.closest(`.comment, .reply_form, .esgst-popup`);
					if (reply) {
						let button = reply.querySelector(
							`.esgst-button-set >:first-child, .js__submit-form, .js_submit`
						);
						if (button) {
							button.click();
							event.preventDefault();
						}
					}
				}
			};
		}
		if (Object.keys(methods).length > 0) {
			this.esgst.documentEvents.keydown.add((event) => {
				let value = '';
				if (event.ctrlKey) {
					value += 'ctrlKey + ';
				} else if (event.shiftKey) {
					value += 'shiftKey + ';
				} else if (event.altKey) {
					value += 'altKey + ';
				}
				value += event.key.toLowerCase();
				if (methods[value]) {
					event.stopPropagation();
					methods[value](event);
				}
			});
		}
	}
}

const generalShortcutKeys = new GeneralShortcutKeys();

export { generalShortcutKeys };
