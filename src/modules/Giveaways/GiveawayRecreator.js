import { Module } from '../../class/Module';
import { common } from '../Common';
import { DOM } from '../../class/DOM';
import { Session } from '../../class/Session';

const
	createElements = common.createElements.bind(common),
	delValue = common.delValue.bind(common),
	getValue = common.getValue.bind(common),
	request = common.request.bind(common),
	setValue = common.setValue.bind(common)
	;

class GiveawaysGiveawayRecreator extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				['ul', [
					['li', [
						`Adds an icon (`,
						['i', { class: 'fa fa-rotate-left' }],
						`) next to the game name of a giveaway created by yourself that ended with 0 entries (in any page) that opens the `,
						['a', { href: `https://www.steamgifts.com/giveaways/new` }, 'new giveaway'],
						' page with all of the details of the giveaway prefilled so that you can quickly recreate the giveaway.'
					]]
				]]
			],
			features: {
				gr_a: {
					name: 'Show the icon for all created giveaways.',
					sg: true
				},
				gr_r: {
					name: 'Remove the button for giveaways that have been recreated.',
					sg: true
				}
			},
			id: 'gr',
			name: 'Giveaway Recreator',
			sg: true,
			type: 'giveaways'
		};
	}

	async init() {
		if (!this.esgst.newGiveawayPath) return;
		let template = getValue('grTemplate');
		if (template) {
			await delValue('grTemplate');
			template = JSON.parse(template);
			this.esgst.modules.giveawaysGiveawayTemplates.gts_applyTemplate(template);
		}
	}

	async gr_recreateGiveaway(button, giveaway, event) {
		event.preventDefault();
		event.stopPropagation();
		createElements(button, 'inner', [{
			attributes: {
				class: 'fa fa-circle-o-notch fa-spin'
			},
			type: 'i'
		}]);
		if (this.esgst.createdPath) {
			let response = await request({ method: 'GET', url: giveaway.url });
			// noinspection JSIgnoredPromiseFromCall
			this.gr_saveTemplate(button, (await this.esgst.modules.giveaways.giveaways_get(DOM.parse(response.responseText), true, response.finalUrl, false, 'giveaway'))[0] || giveaway);
		} else {
			// noinspection JSIgnoredPromiseFromCall
			this.gr_saveTemplate(button, giveaway);
		}
	}

	async gr_saveTemplate(button, giveaway) {
		let context, elements, giveaways, i, keys, n,
			template = {
				delay: 0,
				description: '',
				duration: giveaway.endTime - giveaway.startTime,
				gameName: giveaway.name,
				groups: '',
				level: giveaway.level,
				region: '0'
			};
		if (giveaway.group || giveaway.whitelist) {
			template.whoCanEnter = 'groups';
			if (giveaway.whitelist) {
				template.whitelist = '1';
			}
		} else if (giveaway.inviteOnly) {
			template.whoCanEnter = 'invite_only';
		} else {
			template.whoCanEnter = 'everyone';
		}
		elements = DOM.parse(JSON.parse((await request({
			data: `do=autocomplete_giveaway_game&page_number=1&search_query=${encodeURIComponent(giveaway.name)}`,
			method: 'POST',
			url: '/ajax.php'
		})).responseText).html).getElementsByClassName('table__row-outer-wrap');
		for (i = 0, n = elements.length; i < n && elements[i].getAttribute('data-autocomplete-name') !== giveaway.name; ++i) {
		}
		if (i < n) {
			template.gameId = elements[i].getAttribute('data-autocomplete-id');
		}
		keys = [];
		if (giveaway.entries === 0 || giveaway.entries < giveaway.copies) {
			context = DOM.parse(JSON.parse((await request({
				data: `xsrf_token=${Session.xsrfToken}&do=popup_keys&code=${giveaway.code}`,
				method: 'POST',
				url: '/ajax.php'
			})).responseText).html).getElementsByClassName('popup__keys__heading');
			if (context) {
				context = context[context.length - 1];
				elements = context.nextElementSibling.nextElementSibling.children;
				for (i = 0, n = elements.length; i < n; ++i) {
					keys.push(elements[i].textContent);
				}
			}
		}
		if (keys.length > 0) {
			template.gameType = 'key';
			template.keys = keys.join('\n');
		} else {
			template.gameType = 'gift';
			template.copies = giveaway.copies;
		}
		await setValue('grTemplate', JSON.stringify(template));
		giveaways = JSON.parse(getValue('giveaways'));
		if (!giveaways[giveaway.code]) {
			giveaways[giveaway.code] = {};
		}
		giveaways[giveaway.code].recreated = true;
		await setValue('giveaways', JSON.stringify(giveaways));
		button.remove();
		window.open('/giveaways/new');
	}
}

const giveawaysGiveawayRecreator = new GiveawaysGiveawayRecreator();

export { giveawaysGiveawayRecreator };