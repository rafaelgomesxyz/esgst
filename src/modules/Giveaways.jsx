import { DOM } from '../class/DOM';
import { Module } from '../class/Module';
import { Scope } from '../class/Scope';
import { Settings } from '../class/Settings';
import { Shared } from '../class/Shared';
import { Button } from '../components/Button';
import { common } from './Common';

const createElements = common.createElements.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common),
	getUser = common.getUser.bind(common),
	hideGame = common.hideGame.bind(common),
	sortContent = common.sortContent.bind(common);
class Giveaways extends Module {
	constructor() {
		super();
		this.info = {
			endless: true,
			id: 'giveaways',
			featureMap: {
				endless: this.giveaways_load.bind(this),
			},
		};
	}

	async giveaways_load(context, main, source, endless) {
		if (context.getAttribute && context.getAttribute('data-rfi')) return;
		let giveaways = await this.giveaways_get(context, main, null, false, null, false, endless);
		if (!giveaways.length) return;
		const lightbox = document.querySelector('.lightbox');
		if (!lightbox) {
			document.body.insertAdjacentHTML(
				'afterbegin',
				'<div class="lightbox" style="display: none;"><div class="lightbox_header"><div class="lightbox_header_description"><div class="lightbox_header_description_name"></div><div class="lightbox_header_description_count"></div></div><div class="lightbox_header_icons"><i data-category="images" class="lightbox_header_icon fa fa-camera"></i><i data-category="videos" class="lightbox_header_icon fa fa-video-camera"></i><i class="lightbox_header_icon lightbox_header_icon--close fa fa-times"></i></div></div><div class="lightbox_status lightbox_status--loading"><div><div class="lightbox_status_icon"><i class="fa fa-cog fa-spin"></i></div><div class="lightbox_status_text">Please Wait</div></div></div><div class="lightbox_status lightbox_status--empty"><div><div class="lightbox_status_icon"><i class="fa fa-picture-o"></i></div><div class="lightbox_status_text">No Results</div></div></div><div class="lightbox_images"></div><div class="lightbox_thumbnails_outer"><div class="lightbox_thumbnails_overlay"><div class="lightbox_thumbnails"></div></div></div></div>'
			);
		}
		let sortIndex = Scope.current?.findData('giveaways').length || 0;
		for (const giveaway of giveaways) {
			giveaway.sortIndex = sortIndex;
			sortIndex += 1;
		}
		Scope.current?.addData('giveaways', giveaways, endless);
		for (let feature of this.esgst.giveawayFeatures) {
			await feature(giveaways, main, source);
		}
		giveaways.forEach((giveaway) => this.giveaways_reorder(giveaway));
		if (this.esgst.gas && Settings.get(this.esgst.gas.autoKey)) {
			sortContent(Scope.current?.findData('giveaways'), Settings.get(this.esgst.gas.optionKey));
		}
		if (
			main &&
			Shared.esgst.gf &&
			this.esgst.gf.filteredCount &&
			Settings.get(`gf_enable${this.esgst.gf.type}`)
		) {
			this.esgst.modules.giveawaysGiveawayFilters.filters_filter(this.esgst.gf, false, endless);
		}
		if (
			!main &&
			this.esgst.gfPopup &&
			this.esgst.gfPopup.filteredCount &&
			Settings.get(`gf_enable${this.esgst.gfPopup.type}`)
		) {
			this.esgst.modules.giveawaysGiveawayFilters.filters_filter(this.esgst.gfPopup);
		}
		if (Settings.get('mm_enableGiveaways') && this.esgst.mm_enable) {
			this.esgst.mm_enable(Scope.current?.findData('giveaways'), 'Giveaways');
		}
	}

	async giveaways_get(context, main, mainUrl, hr, key, ged, endless) {
		let giveaway, giveaways, i, mainContext, matches, query;
		giveaways = [];
		if (
			!hr &&
			main &&
			(this.esgst.createdPath ||
				this.esgst.enteredPath ||
				this.esgst.wonPath ||
				this.esgst.archivePath)
		) {
			query = Shared.common.getSelectors(endless, [
				'X.giveaway__row-outer-wrap',
				'X.featured__outer-wrap--giveaway',
				`.table:not(.table--summary) X.table__row-outer-wrap`,
			]);
		} else {
			query = Shared.common.getSelectors(endless, [
				'X.giveaway__row-outer-wrap',
				'X.featured__outer-wrap--giveaway',
			]);
		}
		if (key) {
			mainContext = context;
		} else {
			if (mainUrl) {
				mainContext = context;
				key = 'data';
			} else {
				mainContext = document;
				key = 'giveaway';
			}
		}
		matches = context.querySelectorAll(query);
		for (const match of matches) {
			giveaway = await this.giveaways_getInfo(
				match,
				mainContext,
				null,
				null,
				main,
				mainUrl,
				ged,
				endless
			);
			if (giveaway) {
				giveaways.push(giveaway[key]);
			}
		}
		return giveaways;
	}

	async giveaways_getInfo(context, mainContext, ugd, ugdType, main, mainUrl, ged, endless) {
		let chance, i, info, key, keys, match, n, savedUser, thinHeadings;
		const giveaway = {
			creators: [],
			groups: [],
			winners: [],
		};
		giveaway.outerWrap = context;
		giveaway.gameId = giveaway.outerWrap.getAttribute('data-game-id');
		info = await this.esgst.modules.games.games_getInfo(giveaway.outerWrap);
		if (info) {
			giveaway.id = info.id;
			giveaway.type = info.type;
			if (this.esgst.games && this.esgst.games[giveaway.type][giveaway.id]) {
				keys = [
					'owned',
					'wishlisted',
					'previouslyWishlisted',
					'followed',
					'hidden',
					'ignored',
					'previouslyEntered',
					'previouslyWon',
					'reducedCV',
					'noCV',
					'banned',
					'removed',
				];
				for (i = 0, n = keys.length; i < n; ++i) {
					key = keys[i];
					if (
						key === 'banned' &&
						Shared.esgst.delistedGames.banned.indexOf(parseInt(giveaway.id)) > -1
					) {
						giveaway[key] = true;
					} else if (
						key === 'removed' &&
						(Shared.esgst.delistedGames.removed.indexOf(parseInt(giveaway.id)) > -1 ||
							Shared.esgst.games[giveaway.type][giveaway.id].removed)
					) {
						giveaway[key] = true;
					} else if (
						Shared.esgst.games[giveaway.type][giveaway.id][
							key === 'previouslyEntered' ? 'entered' : key === 'previouslyWon' ? 'won' : key
						]
					) {
						giveaway[key] = true;
					}
				}
			}
		}
		const giveawayPath = common.testPath('Giveaway', 'sg', mainUrl || window.location.pathname);
		const createdPath = common.testPath(
			'My Giveaways - Created',
			'sg',
			mainUrl || window.location.pathname
		);
		const enteredPath = common.testPath(
			'My Giveaways - Entered',
			'sg',
			mainUrl || window.location.pathname
		);
		const wonPath = common.testPath(
			'My Giveaways - Won',
			'sg',
			mainUrl || window.location.pathname
		);
		const wishlistPath = common.testPath(
			'Community Wishlist',
			'sg',
			mainUrl || window.location.pathname
		);
		const archivePath = common.testPath('Archive', 'sg', mainUrl || window.location.pathname);
		const giveawaysPath = common.testPath('Giveaways', 'sg', mainUrl || window.location.pathname);
		const groupPath = common.testPath('Group', 'sg', mainUrl || window.location.pathname);
		const userPath = common.testPath(
			'User - Giveaways - Sent',
			'sg',
			mainUrl || window.location.pathname
		);
		const userWonPath = common.testPath(
			'User - Giveaways - Won',
			'sg',
			mainUrl || window.location.pathname
		);
		if (giveaway.outerWrap.classList.contains('table__row-outer-wrap') && giveawayPath) {
			return;
		}
		giveaway.innerWrap = giveaway.outerWrap.querySelector(
			`.giveaway__row-inner-wrap, .featured__inner-wrap, .table__row-inner-wrap`
		);
		giveaway.avatar = giveaway.outerWrap.querySelector(
			`.giveaway_image_avatar, .featured_giveaway_image_avatar`
		);
		giveaway.image = giveaway.outerWrap.querySelector(
			`.giveaway_image_thumbnail, .giveaway_image_thumbnail_missing, .global__image-outer-wrap--game-medium`
		);
		giveaway.summary = giveaway.innerWrap.querySelector(
			`.giveaway__summary, .featured__summary, .table__column--width-fill`
		);
		if (giveaway.outerWrap.getAttribute('data-entered')) {
			giveaway.entered = true;
		} else if (giveawayPath && main) {
			let button = mainContext.getElementsByClassName('sidebar__entry-delete')[0];
			if (button) {
				giveaway.entered = !button.classList.contains('is-hidden');
			}
		} else if ((enteredPath || wonPath) && main) {
			giveaway.entered = true;
		} else {
			giveaway.entered = giveaway.innerWrap.classList.contains('is-faded');
		}
		giveaway.headingName = giveaway.innerWrap.querySelector(
			`.giveaway__heading__name, .featured__heading__medium, .table__column__heading`
		);
		if (wishlistPath) {
			giveaway.heading = giveaway.headingName;
		} else {
			giveaway.heading = giveaway.headingName.parentElement;
		}
		giveaway.name = giveaway.headingName.textContent;
		match = giveaway.name.match(/\s\((.+) Copies\)/);
		if (match) {
			giveaway.name = giveaway.name.replace(match[0], '');
			giveaway.copies = parseInt(match[1].replace(/,/g, '').match(/\d+/)[0]);
		} else {
			giveaway.copies = 1;
		}
		giveaway.url =
			giveawayPath && main && !ugd
				? (mainUrl && common.getPath(mainUrl)) || window.location.pathname
				: mainUrl || giveaway.headingName.getAttribute('href');
		if (giveaway.url) {
			giveaway.url = giveaway.url.replace(/\/(entries|groups|region-restrictions|winners)$/, '');
			match = giveaway.url.match(/\/giveaway\/(.+?)(\/.+?)$/);
			if (match) {
				giveaway.code = match[1];
			} else {
				match = giveaway.url.match(/\/giveaways\/(.+)/);
				if (match) {
					giveaway.code = match[1];
					giveaway.sgTools = true;
				} else {
					return;
				}
			}
		}
		giveaway.pinned = giveaway.outerWrap.closest('.pinned-giveaways__outer-wrap');
		thinHeadings = giveaway.innerWrap.querySelectorAll(
			`.giveaway__heading__thin:not(.dyegb_playtime):not(.dyegb_achievement), .featured__heading__small`
		);
		n = thinHeadings.length;
		giveaway.points = 0;
		giveaway.copiesContainer = null;
		if (n > 0) {
			if (n > 1) {
				giveaway.copiesContainer = thinHeadings[0];
				giveaway.copies = parseInt(thinHeadings[0].textContent.replace(/,/g, '').match(/\d+/)[0]);
				giveaway.pointsContainer = thinHeadings[1];
				giveaway.points = parseInt(thinHeadings[1].textContent.match(/\d+/)[0]);
			} else {
				giveaway.copies = 1;
				giveaway.pointsContainer = thinHeadings[0];
				giveaway.points = parseInt(thinHeadings[0].textContent.match(/\d+/)[0]);
			}
		}
		giveaway.columns = giveaway.innerWrap.querySelector(`.giveaway__columns, .featured__columns`);
		if (giveaway.columns && (!archivePath || !main)) {
			giveaway.endTimeColumn = giveaway.columns.firstElementChild;
			if (giveaway.endTimeColumn.classList.contains('esgst-ged-source')) {
				giveaway.sourceColumn = giveaway.endTimeColumn;
				giveaway.endTimeColumn = giveaway.sourceColumn.nextElementSibling;
			}
			giveaway.startTimeColumn = giveaway.columns.querySelector(
				`.giveaway__column--width-fill.text-right, .featured__column--width-fill.text-right`
			);
			giveaway.started = !giveaway.endTimeColumn.textContent.match(/Begins/);
			giveaway.endTime =
				parseInt(giveaway.endTimeColumn.lastElementChild.getAttribute('data-timestamp')) * 1e3;
			giveaway.ended = Boolean(
				giveaway.deleted || giveaway.endTimeColumn.textContent.match(/Ended/)
			);
			giveaway.startTime =
				parseInt(giveaway.startTimeColumn.firstElementChild.getAttribute('data-timestamp')) * 1e3;
			giveaway.creatorContainer = giveaway.startTimeColumn.querySelector(
				`a[href*="/user/"], a[style]`
			);
		} else {
			giveaway.started = true;
		}
		if (main && archivePath) {
			giveaway.startTimeColumn = giveaway.innerWrap.querySelector(`[data-timestamp]`);
			if (giveaway.startTimeColumn) {
				giveaway.startTime =
					parseInt(giveaway.startTimeColumn.getAttribute('data-timestamp')) * 1e3;
			} else {
				giveaway.startTime = 0;
			}
			giveaway.creatorContainer = giveaway.innerWrap.querySelector(`a[href*="/user/"]`);
		}
		if (!giveaway.endTime && main && (createdPath || enteredPath || wonPath)) {
			giveaway.endTime = giveaway.innerWrap.querySelector(`[data-timestamp]`);
			if (giveaway.endTime) {
				giveaway.endTimeColumn = giveaway.endTime.parentElement;
				giveaway.started = !giveaway.endTimeColumn.textContent.match(/Begins/);
				giveaway.deleted = giveaway.endTimeColumn.parentElement.textContent.match(/Deleted/);
				giveaway.endTime = parseInt(giveaway.endTime.getAttribute('data-timestamp')) * 1e3;
				giveaway.ended = Boolean(
					giveaway.deleted || giveaway.endTimeColumn.parentElement.textContent.match(/Ended/)
				);
			} else {
				giveaway.endTime = 0;
				giveaway.ended = true;
			}
		}
		if (giveaway.creatorContainer) {
			giveaway.creator = giveaway.creatorContainer.textContent;
		} else if (ugd) {
			if (ugdType === 'sent') {
				giveaway.creator = ugd;
			}
		} else if (userPath && !userWonPath && main && !ged) {
			giveaway.creator = ((mainUrl && common.getPath(mainUrl)) || window.location.pathname).match(
				/^\/user\/(.+?)(\/.*)?$/
			)[1];
		} else if (createdPath && main) {
			giveaway.creator = Settings.get('username');
		}
		if (giveaway.creator) {
			giveaway.creators.push(giveaway.creator.toLowerCase());
		}
		if (main) {
			if (createdPath) {
				let status = giveaway.outerWrap.querySelector(
					`.table__column--width-small.text-center:last-of-type`
				);
				if (status) {
					if (status.textContent.match(/Not\sReceived/)) {
						giveaway.notReceived = true;
					} else if (status.textContent.match(/Received/)) {
						giveaway.received = true;
					} else if (status.textContent.match(/Awaiting\sFeedback/)) {
						giveaway.awaitingFeedback = true;
					}
				}
			} else if (wonPath) {
				giveaway.received = false;
				giveaway.notReceived = false;
				const elements = giveaway.outerWrap.querySelectorAll('.table__column--gift-feedback');
				for (const element of elements) {
					const text = element.textContent.trim();
					if (
						(text.match(/^Received$/) && element.querySelector('.icon-green')) ||
						element.querySelector(`.table__gift-feedback-received:not(.is-hidden)`)
					) {
						giveaway.received = true;
						break;
					}
					if (
						(text.match(/^Not\sReceived$/) && element.querySelector('.icon-red')) ||
						element.querySelector(`.table__gift-feedback-not-received:not(.is-hidden)`)
					) {
						giveaway.notReceived = true;
						break;
					}
				}
				giveaway.awaitingFeedback = !giveaway.received && !giveaway.notReceived;
			}
		}
		giveaway.created = giveaway.creator === Settings.get('username');
		if (Settings.get('gf') && Settings.get('gf_s') && main) {
			let savedGiveaway = this.esgst.giveaways[giveaway.code];
			if (
				(giveawaysPath || groupPath) &&
				savedGiveaway &&
				savedGiveaway.hidden &&
				savedGiveaway.code &&
				savedGiveaway.endTime &&
				savedGiveaway.endTime > Date.now()
			) {
				giveaway.outerWrap.classList.add('esgst-hidden');
				giveaway.outerWrap.setAttribute('data-esgst-not-filterable', 'gf');
				if (Settings.get('gf_s_s')) {
					Shared.esgst.modules.giveawaysGiveawayFilters.updateSingleCounter();
				}
			}
		}
		giveaway.links = giveaway.innerWrap.getElementsByClassName('giveaway__links')[0];
		if (giveaway.links) {
			giveaway.links.classList.add('esgst-giveaway-links');
			giveaway.entriesLink = giveaway.links.firstElementChild;
			giveaway.commentsLink = giveaway.entriesLink.nextElementSibling;
		} else if (giveawayPath) {
			giveaway.entriesLink = mainContext.getElementsByClassName(
				'sidebar__navigation__item__count'
			)[1];
			giveaway.commentsLink = mainContext.getElementsByClassName(
				'sidebar__navigation__item__count'
			)[0];
		}
		if (giveaway.entriesLink && giveaway.commentsLink) {
			giveaway.entriesLink.setAttribute('data-draggable-id', 'entries');
			giveaway.commentsLink.setAttribute('data-draggable-id', 'comments');
			giveaway.entries = parseInt(
				giveaway.entriesLink.textContent.replace(/,/g, '').match(/\d+/)[0]
			);
			giveaway.comments = parseInt(
				giveaway.commentsLink.textContent.replace(/,/g, '').match(/\d+/)[0]
			);
		}
		if (!giveaway.entriesLink && !wonPath) {
			const entriesLink = giveaway.innerWrap.querySelectorAll('.table__column--width-small')[
				createdPath ? 1 : 0
			];
			if (entriesLink) {
				giveaway.entriesLink = entriesLink;
				giveaway.entries = parseInt(entriesLink.textContent.replace(/,/g, ''));
			}
		}
		DOM.insert(giveaway.summary, 'beforeend', <div ref={(ref) => (giveaway.extraPanel = ref)} />);
		giveaway.panel = giveaway.innerWrap.getElementsByClassName('esgst-giveaway-panel')[0];
		if (
			!giveaway.panel &&
			(Settings.get('gwc') ||
				Settings.get('gwr') ||
				Settings.get('gptw') ||
				Settings.get('gp') ||
				Settings.get('elgb') ||
				Settings.get('cewgd'))
		) {
			if (giveaway.links) {
				DOM.insert(
					giveaway.links,
					'afterend',
					<div className="esgst-panel-flexbox" ref={(ref) => (giveaway.panelFlexbox = ref)}></div>
				);
				giveaway.panelFlexbox.appendChild(giveaway.links);
				giveaway.panel = createElements(giveaway.panelFlexbox, 'beforeend', [
					{
						attributes: {
							class: 'giveaway__columns esgst-giveaway-panel',
						},
						type: 'div',
					},
				]);
			} else if (giveaway.columns) {
				if (archivePath) {
					giveaway.columns.style.justifyContent = 'flex-end';
					giveaway.panel = createElements(giveaway.columns, 'afterend', [
						{
							attributes: {
								class: 'giveaway__columns esgst-giveaway-panel',
							},
							type: 'div',
						},
					]);
				} else {
					giveaway.panel = createElements(giveaway.columns, 'afterend', [
						{
							attributes: {
								class: 'featured__columns esgst-giveaway-panel',
							},
							type: 'div',
						},
					]);
				}
			} else if (
				(enteredPath ||
					(wonPath &&
						Settings.get('cewgd') &&
						Settings.get('cewgd_w') &&
						Settings.get('cewgd_w_e'))) &&
				(Settings.get('gwc') || Settings.get('gwr') || Settings.get('gptw'))
			) {
				giveaway.panel = createElements(
					giveaway.innerWrap.firstElementChild.nextElementSibling,
					'afterend',
					[
						{
							attributes: {
								class: 'table__column--width-small text-center esgst-giveaway-panel',
							},
							type: 'div',
						},
					]
				);
			}
		}
		if (giveaway.sgTools && !giveaway.panel.getElementsByClassName('esgst-ge-sgt-button')[0]) {
			createElements(giveaway.panel, 'beforeend', [
				{
					attributes: {
						class: 'esgst-ge-sgt-button esgst-giveaway-column-button',
						['data-draggable-id']: 'sgTools',
						href: `https://www.sgtools.info/giveaways/${giveaway.code}`,
						target: '_blank',
					},
					type: 'a',
					children: [
						{
							attributes: {
								class: 'form__submit-button',
							},
							text: 'SGTools',
							type: 'div',
						},
					],
				},
			]);
		}
		giveaway.elgbPanel = giveaway.panel;
		giveaway.levelColumn = giveaway.outerWrap.querySelector(
			`.giveaway__column--contributor-level, .featured__column--contributor-level`
		);
		giveaway.level = giveaway.levelColumn
			? parseInt(giveaway.levelColumn.textContent.match(/\d+/)[0])
			: 0;
		giveaway.inviteOnly = giveaway.outerWrap.querySelector(
			`.giveaway__column--invite-only, .featured__column--invite-only`
		);
		giveaway.regionRestricted = giveaway.outerWrap.querySelector(
			`.giveaway__column--region-restricted:not(.touhou_giveaway_points), .featured__column--region-restricted:not(.touhou_giveaway_points)`
		);
		giveaway.group = giveaway.outerWrap.querySelector(
			`.giveaway__column--group, .featured__column--group`
		);
		giveaway.whitelist = giveaway.outerWrap.querySelector(
			`.giveaway__column--whitelist, .featured__column--whitelist`
		);
		giveaway.public =
			!giveaway.sgTools &&
			!giveaway.inviteOnly &&
			!giveaway.regionRestricted &&
			!giveaway.group &&
			!giveaway.whitelist;
		giveaway.touhouBox = giveaway.outerWrap.querySelector('.touhou_giveaway_points');
		if (!main || !giveawayPath) {
			if (giveaway.inviteOnly) {
				createElements(giveaway.inviteOnly, 'atinner', [
					{
						attributes: {
							class: 'fa fa-lock',
						},
						type: 'i',
					},
				]);
			}
			if (giveaway.group) {
				createElements(giveaway.group, 'atinner', [
					{
						attributes: {
							class: 'fa fa-user',
						},
						type: 'i',
					},
				]);
			}
			if (giveaway.whitelist) {
				createElements(giveaway.whitelist, 'atinner', [
					{
						attributes: {
							class: 'fa fa-heart',
						},
						type: 'i',
					},
				]);
			}
		}
		chance = context.getElementsByClassName('esgst-gwc')[0];
		giveaway.chance = chance ? parseFloat(chance.getAttribute('data-chance')) : 0;
		giveaway.projectedChance = chance ? parseFloat(chance.getAttribute('data-projectedChance')) : 0;
		giveaway.chancePerPoint = giveaway.chance / Math.max(1, giveaway.points);
		giveaway.projectedChancePerPoint = giveaway.projectedChance / Math.max(1, giveaway.points);
		giveaway.blacklist = giveaway.outerWrap.getAttribute('data-blacklist');
		giveaway.error = giveaway.outerWrap.getAttribute('data-error');
		const ratio = context.getElementsByClassName('esgst-gwr')[0];
		giveaway.ratio = ratio ? parseFloat(ratio.getAttribute('data-ratio')) : 0;
		giveaway.projectedRatio = ratio ? parseFloat(ratio.getAttribute('data-projectedRatio')) : 0;
		const pointsToWin = context.getElementsByClassName('esgst-gptw')[0];
		giveaway.pointsToWin = pointsToWin
			? parseFloat(pointsToWin.getAttribute('data-pointsToWin'))
			: 0;
		giveaway.enterable = giveaway.outerWrap.getAttribute('data-enterable');
		giveaway.currentlyEnterable = giveaway.outerWrap.getAttribute('data-currently-enterable');
		if (main) {
			if (
				Settings.get('gr') &&
				giveaway.creator === Settings.get('username') &&
				(Settings.get('gr_a') ||
					(giveaway.ended && (giveaway.entries === 0 || giveaway.entries < giveaway.copies))) &&
				(!Settings.get('gr_r') ||
					!this.esgst.giveaways[giveaway.code] ||
					!this.esgst.giveaways[giveaway.code].recreated) &&
				!giveaway.heading.getElementsByClassName('esgst-gr-button')[0]
			) {
				let button = createElements(giveaway.headingName, 'beforebegin', [
					{
						attributes: {
							class: 'esgst-gr-button',
							['data-draggable-id']: 'gr',
							title: `${getFeatureTooltip('gr', 'Recreate giveaway')}`,
						},
						type: 'div',
						children: [
							{
								attributes: {
									class: 'fa fa-rotate-left',
								},
								type: 'i',
							},
						],
					},
				]);
				button.firstElementChild.addEventListener(
					'click',
					this.esgst.modules.giveawaysGiveawayRecreator.gr_recreateGiveaway.bind(
						this.esgst.modules.giveawaysGiveawayRecreator,
						button,
						giveaway
					),
					true
				);
			}
		}
		let hideButton = giveaway.innerWrap.querySelector(`.giveaway__hide, .featured__giveaway__hide`);
		if (hideButton && !hideButton.classList.contains('fa-eye')) {
			if (!main || endless) {
				if (hideButton.classList.contains('featured__giveaway__hide')) {
					hideButton = hideButton.parentElement;
				}
				let temp = hideButton.previousElementSibling;
				createElements(hideButton, 'atouter', [
					{
						attributes: {
							class: 'fa fa-eye-slash giveaway__hide giveaway__icon',
							title: getFeatureTooltip(null, 'Hide all giveaways for this game'),
						},
						type: 'i',
					},
				]);
				hideButton = temp.nextElementSibling;
				hideButton.addEventListener(
					'click',
					hideGame.bind(
						common,
						hideButton,
						giveaway.gameId,
						giveaway.name,
						giveaway.id,
						giveaway.type
					)
				);
			} else if (Settings.get('updateHiddenGames')) {
				hideButton.addEventListener('click', () => {
					this.esgst.hidingGame = {
						id: giveaway.id,
						type: giveaway.type,
					};
				});
			}
		}
		if (hideButton) {
			if (hideButton.classList.contains('featured__giveaway__hide')) {
				hideButton.parentElement.setAttribute('data-draggable-id', 'hideGame');
			} else {
				hideButton.setAttribute('data-draggable-id', 'hideGame');
			}
		}
		for (const child of giveaway.heading.children) {
			if (
				child === giveaway.headingName ||
				child.classList.contains('giveaway__heading__name') ||
				child.classList.contains('featured__heading__medium')
			) {
				child.setAttribute('data-draggable-id', 'name');
				continue;
			}
			if (child.textContent.match(/\(.+?\sCopies\)/)) {
				child.setAttribute('data-draggable-id', 'copies');
				continue;
			}
			if (child.textContent.match(/\(.+?P\)/)) {
				child.setAttribute('data-draggable-id', 'points');
				continue;
			}
			if (
				child.getAttribute('href') &&
				child.getAttribute('href').match(/store.steampowered.com/)
			) {
				child.setAttribute('data-draggable-id', 'steam');
				continue;
			}
			if (child.matches('.giveaway__icon.fa-camera[data-lightbox-id]')) {
				child.setAttribute('data-draggable-id', 'screenshots-videos');
			}
			if (child.getAttribute('href') && child.getAttribute('href').match(/\/giveaways\/search/)) {
				child.setAttribute('data-draggable-id', 'search');
			}
		}
		/**
		 * @property {object} winnerColumns.noWinners
		 */
		giveaway.winnerColumns = {};
		giveaway.numWinners = Math.min(giveaway.entries || 0, giveaway.copies);
		if (giveaway.startTimeColumn && giveaway.endTimeColumn) {
			let column = giveaway.endTimeColumn.nextElementSibling;
			while (column && column !== giveaway.startTimeColumn) {
				let key = '';
				let status = '';
				if (column.classList.contains('giveaway__column--positive')) {
					[key, status] = ['received', 'Received'];
				} else if (column.classList.contains('giveaway__column--negative')) {
					[key, status] = ['notReceived', 'Not Received'];
				} else if (column.textContent.trim().match(/Awaiting\sfeedback/)) {
					[key, status] = ['awaitingFeedback', 'Awaiting Feedback'];
				} else if (column.textContent.trim().match(/No\swinners/)) {
					[key, status] = ['noWinners', ''];
				} else {
					continue;
				}
				const winners = [];
				if (key === 'received' || key === 'notReceived') {
					winners.push(
						...column.textContent
							.trim()
							.split(/,\s/)
							.filter((x) => x)
					);
					giveaway.winners.push(...winners.map((x) => ({ status, username: x })));
					if (key === 'received') {
						giveaway.winnerNames = winners.map((x) => x.toLowerCase());
					}
				}
				giveaway.winnerColumns[key] = { column, status, winners };
				column.setAttribute('data-draggable-id', 'winners');
				column = column.nextElementSibling;
			}
		}
		if (!giveaway.winners.length || giveaway.numWinners < 4) {
			giveaway.numWinners = giveaway.winners.length;
		}
		if (giveaway.endTimeColumn) {
			giveaway.endTimeColumn.setAttribute('data-draggable-id', 'endTime');
		}
		if (giveaway.startTimeColumn) {
			giveaway.startTimeColumn.setAttribute('data-draggable-id', 'startTime');
		}
		if (giveaway.inviteOnly) {
			giveaway.inviteOnly.setAttribute('data-draggable-id', 'inviteOnly');
		}
		if (giveaway.whitelist) {
			giveaway.whitelist.setAttribute('data-draggable-id', 'whitelist');
		}
		if (giveaway.group) {
			giveaway.group.setAttribute('data-draggable-id', 'group');
		}
		if (giveaway.regionRestricted) {
			giveaway.regionRestricted.setAttribute('data-draggable-id', 'regionRestricted');
		}
		if (giveaway.levelColumn) {
			giveaway.levelColumn.setAttribute('data-draggable-id', 'level');
		}
		if (giveaway.sourceColumn) {
			giveaway.sourceColumn.setAttribute('data-draggable-id', 'ged');
		}
		if (giveaway.touhouBox) {
			giveaway.touhouBox.setAttribute('data-draggable-id', 'touhou');
		}
		return {
			giveaway: giveaway,
			data: {
				gameId: giveaway.gameId,
				gameSteamId: giveaway.id,
				gameType: giveaway.type,
				gameName: giveaway.name,
				code: giveaway.code,
				copies: giveaway.copies,
				points: giveaway.points,
				ended: giveaway.ended,
				endTime: giveaway.endTime,
				startTime: giveaway.startTime,
				started: giveaway.started,
				creator: giveaway.creator,
				winners: giveaway.numWinners > 3 ? [] : giveaway.winners,
				numWinners: giveaway.numWinners,
				entries: giveaway.entries,
				comments: giveaway.comments,
				level: giveaway.level,
				public: giveaway.public,
				inviteOnly: !!(giveaway.inviteOnly || giveaway.sgTools),
				regionRestricted: !!giveaway.regionRestricted,
				group: !!giveaway.group,
				whitelist: !!giveaway.whitelist,
				v: Shared.esgst.CURRENT_GIVEAWAY_VERSION,
			},
		};
	}

	giveaways_reorder(giveaway) {
		if (
			(giveaway.columns && !Shared.common.isGiveawayColumnsDefault) ||
			(giveaway.gvIcons && !Shared.common.isGiveawayColumnsGvDefault)
		) {
			for (const id of giveaway.gvIcons
				? Settings.get('giveawayColumns_gv')
				: Settings.get('giveawayColumns')) {
				if (id === 'startTime' && Shared.common.isCurrentPath('Archive')) {
					continue;
				}
				const elements = giveaway.outerWrap.querySelectorAll(`[data-draggable-id="${id}"]`);
				for (const element of elements) {
					try {
						const button = Button.create().parse(element);
						button.insert(giveaway.gvIcons || giveaway.columns, 'beforeend');
					} catch (err) {
						(giveaway.gvIcons || giveaway.columns).appendChild(element);
					}
					if (giveaway.elementOrdering) {
						continue;
					}
					if (element.getAttribute('data-draggable-id').match(/^(elgb|gp)$/)) {
						element.classList.add('esgst-giveaway-column-button');
					}
					if (
						!this.esgst.giveawayPath &&
						element
							.getAttribute('data-draggable-id')
							.match(/steam|screenshots-videos|search|hideGame/)
					) {
						element.classList.remove('giveaway__icon');
					}
					element.classList.add(this.esgst.giveawayPath ? 'featured__column' : 'giveaway__column');
					if (element.getAttribute('data-color')) {
						element.firstElementChild.style.color = element.getAttribute('data-bgColor');
						element.style.color = '';
						element.style.backgroundColor = '';
					}
				}
			}
			if (giveaway.columns && giveaway.avatar && giveaway.columns.contains(giveaway.avatar)) {
				giveaway.columns.appendChild(giveaway.avatar);
			}
		}
		if (
			giveaway.panel &&
			((!giveaway.gvIcons && !Shared.common.isGiveawayPanelDefault) ||
				(giveaway.gvIcons && !Shared.common.isGiveawayPanelGvDefault))
		) {
			for (const id of giveaway.gvIcons
				? Settings.get('giveawayPanel_gv')
				: Settings.get('giveawayPanel')) {
				const elements = giveaway.outerWrap.querySelectorAll(`[data-draggable-id="${id}"]`);
				for (const element of elements) {
					try {
						const button = Button.create().parse(element);
						button.insert(giveaway.panel, 'beforeend');
					} catch (err) {
						giveaway.panel.appendChild(element);
					}
					if (giveaway.elementOrdering) {
						continue;
					}
					if (element.getAttribute('data-draggable-id').match(/^(elgb|gp)$/)) {
						element.classList.remove(
							'esgst-giveaway-column-button',
							this.esgst.giveawayPath ? 'featured__column' : 'giveaway__column'
						);
					} else {
						element.classList.add(
							this.esgst.giveawayPath ? 'featured__column' : 'giveaway__column'
						);
					}
					if (
						!this.esgst.giveawayPath &&
						element
							.getAttribute('data-draggable-id')
							.match(/steam|screenshots-videos|search|hideGame/)
					) {
						element.classList.remove('giveaway__icon');
					}
					if (element.getAttribute('data-color')) {
						element.style.color = element.getAttribute('data-color');
						element.style.backgroundColor = element.getAttribute('data-bgColor');
					}
				}
			}
		}
		if (
			giveaway.heading &&
			((!giveaway.gvIcons && !Shared.common.isGiveawayHeadingDefault) ||
				(giveaway.gvIcons && !Shared.common.isGiveawayHeadingGvDefault))
		) {
			for (const id of giveaway.gvIcons
				? Settings.get('giveawayHeading_gv')
				: Settings.get('giveawayHeading')) {
				const elements = giveaway.outerWrap.querySelectorAll(`[data-draggable-id="${id}"]`);
				for (const element of elements) {
					try {
						const button = Button.create().parse(element);
						button.insert(giveaway.heading, 'beforeend');
					} catch (err) {
						giveaway.heading.appendChild(element);
					}
					if (giveaway.elementOrdering) {
						continue;
					}
					if (element.getAttribute('data-draggable-id').match(/^(elgb|gp)$/)) {
						element.classList.remove('esgst-giveaway-column-button');
					}
					if (
						!this.esgst.giveawayPath &&
						element
							.getAttribute('data-draggable-id')
							.match(/steam|screenshots-videos|search|hideGame/)
					) {
						element.classList.add('giveaway__icon');
					}
					element.classList.remove(
						this.esgst.giveawayPath ? 'featured__column' : 'giveaway__column'
					);
					if (element.getAttribute('data-color')) {
						element.style.color = element.getAttribute('data-color');
						element.style.backgroundColor = element.getAttribute('data-bgColor');
					}
				}
			}
		}
		if (
			giveaway.links &&
			((!giveaway.gvIcons && !Shared.common.isGiveawayLinksDefault) ||
				(giveaway.gvIcons && !Shared.common.isGiveawayLinksGvDefault))
		) {
			for (const id of giveaway.gvIcons
				? Settings.get('giveawayLinks_gv')
				: Settings.get('giveawayLinks')) {
				const elements = giveaway.outerWrap.querySelectorAll(`[data-draggable-id="${id}"]`);
				for (const element of elements) {
					try {
						const button = Button.create().parse(element);
						button.insert(giveaway.links, 'beforeend');
					} catch (err) {
						giveaway.links.appendChild(element);
					}
					if (giveaway.elementOrdering) {
						continue;
					}
					if (element.getAttribute('data-draggable-id').match(/^(elgb|gp)$/)) {
						element.classList.remove('esgst-giveaway-column-button');
					}
					if (
						!this.esgst.giveawayPath &&
						element
							.getAttribute('data-draggable-id')
							.match(/steam|screenshots-videos|search|hideGame/)
					) {
						element.classList.remove('giveaway__icon');
					}
					element.classList.remove(
						this.esgst.giveawayPath ? 'featured__column' : 'giveaway__column'
					);
					if (element.getAttribute('data-color')) {
						element.style.color = element.getAttribute('data-color');
						element.style.backgroundColor = element.getAttribute('data-bgColor');
					}
				}
			}
		}
		if (
			giveaway.extraPanel &&
			((!giveaway.gvIcons && !Shared.common.isGiveawayExtraPanelDefault) ||
				(giveaway.gvIcons && !Shared.common.isGiveawayExtraPanelGvDefault))
		) {
			for (const id of giveaway.gvIcons
				? Settings.get('giveawayExtraPanel_gv')
				: Settings.get('giveawayExtraPanel')) {
				const elements = giveaway.outerWrap.querySelectorAll(`[data-draggable-id="${id}"]`);
				for (const element of elements) {
					try {
						const button = Button.create().parse(element);
						button.insert(giveaway.extraPanel, 'beforeend');
					} catch (err) {
						giveaway.extraPanel.appendChild(element);
					}
					if (giveaway.elementOrdering) {
						continue;
					}
					if (element.getAttribute('data-draggable-id').match(/^(elgb|gp)$/)) {
						element.classList.remove('esgst-giveaway-column-button');
					}
					if (
						!this.esgst.giveawayPath &&
						element
							.getAttribute('data-draggable-id')
							.match(/steam|screenshots-videos|search|hideGame/)
					) {
						element.classList.remove('giveaway__icon');
					}
					element.classList.remove(
						this.esgst.giveawayPath ? 'featured__column' : 'giveaway__column'
					);
					if (element.getAttribute('data-color')) {
						element.style.color = element.getAttribute('data-color');
						element.style.backgroundColor = element.getAttribute('data-bgColor');
					}
				}
			}
		}
		if (giveaway.gcPanel) {
			for (const id of giveaway.gvIcons
				? Settings.get('gc_categories_gv')
				: Settings.get('gc_categories')) {
				const elements = giveaway.outerWrap.querySelectorAll(`[data-draggable-id="${id}"]`);
				for (const element of elements) {
					try {
						const button = Button.create().parse(element);
						button.insert(giveaway.gcPanel, 'beforeend');
					} catch (err) {
						giveaway.gcPanel.appendChild(element);
					}
					if (giveaway.elementOrdering) {
						continue;
					}
					if (element.getAttribute('data-draggable-id').match(/^(elgb|gp)$/)) {
						element.classList.remove('esgst-giveaway-column-button');
					}
					if (
						!this.esgst.giveawayPath &&
						element
							.getAttribute('data-draggable-id')
							.match(/steam|screenshots-videos|search|hideGame/)
					) {
						element.classList.remove('giveaway__icon');
					}
					element.classList.remove(
						this.esgst.giveawayPath ? 'featured__column' : 'giveaway__column'
					);
					if (element.getAttribute('data-color')) {
						element.style.color = element.getAttribute('data-color');
						element.style.backgroundColor = element.getAttribute('data-bgColor');
					}
				}
			}
			const loading = giveaway.gcPanel.querySelector('.esgst-gc-loading');
			if (loading) {
				giveaway.gcPanel.appendChild(loading);
			}
		}
	}
}

const giveawaysModule = new Giveaways();

export { giveawaysModule };
