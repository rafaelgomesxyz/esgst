import { Button } from '../../class/Button';
import { DOM } from '../../class/DOM';
import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';
import { common } from '../Common';

const getValue = common.getValue.bind(common),
	setValue = common.setValue.bind(common);
class GiveawaysStickiedGiveawayCountries extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a button (<i className="fa fa-thumb-stack"></i> if the country is stickied and{' '}
						<i className="fa fa-thumb-stack esgst-faded"></i> if it is not) next to each country in
						the <a href="https://www.steamgifts.com/giveaways/new">new giveaway</a> page that allows
						you to sticky the country so that it appears at the top of the country list when
						creating a giveaway for quick use.
					</li>
				</ul>
			),
			id: 'sgac',
			name: 'Stickied Giveaway Countries',
			sg: true,
			type: 'giveaways',
		};
	}

	init() {
		if (!this.esgst.newGiveawayPath) return;
		let rows = document.getElementsByClassName('form__rows')[0];
		if (!rows) return;
		let container, context, elements, i, id, n, stickiedCountries;
		stickiedCountries = JSON.parse(Shared.common.getValue('stickiedCountries', '[]'));
		container = document.querySelector(`.form_list[data-input="country_item_string"]`);
		elements = container.children;
		const obj = {
			separator: container.firstElementChild,
		};
		for (i = 0, n = elements.length; i < n; ++i) {
			context = elements[i];
			id = context.getAttribute('data-item-id');
			if (stickiedCountries.indexOf(id) >= 0) {
				if (context === obj.separator) {
					obj.separator = obj.separator.nextElementSibling;
				}
				container.insertBefore(context, obj.separator);
			}
			new Button(context, 'afterbegin', {
				callbacks: [
					this.sgac_stickyCountry.bind(this, obj, container, context, id),
					null,
					this.sgac_unstickyCountry.bind(this, obj, container, context, id),
					null,
				],
				className: 'esgst-sgac-button',
				icons: [
					'fa-thumb-tack esgst-clickable esgst-faded',
					'fa-circle-o-notch fa-spin',
					'fa-thumb-tack esgst-clickable',
					'fa-circle-o-notch fa-spin',
				],
				id: 'sgac',
				index: stickiedCountries.indexOf(id) >= 0 ? 2 : 0,
				titles: ['Sticky country', 'Stickying...', 'Unsticky country', 'Unstickying...'],
			});
		}
	}

	async sgac_stickyCountry(obj, container, context, id, event) {
		event.stopPropagation();
		if (container) {
			if (context === obj.separator) {
				obj.separator = obj.separator.nextElementSibling;
			}
			container.insertBefore(context, obj.separator);
		}
		let stickiedCountries = JSON.parse(getValue('stickiedCountries', '[]'));
		if (stickiedCountries.indexOf(id) < 0) {
			stickiedCountries.push(id);
			await setValue('stickiedCountries', JSON.stringify(stickiedCountries));
		}
		return true;
	}

	async sgac_unstickyCountry(obj, container, context, id, event) {
		event.stopPropagation();
		if (container) {
			container.insertBefore(context, obj.separator);
			obj.separator = obj.separator.previousElementSibling;
		}
		let stickiedCountries = JSON.parse(getValue('stickiedCountries', '[]'));
		let index = stickiedCountries.indexOf(id);
		if (index >= 0) {
			stickiedCountries.splice(index, 1);
			await setValue('stickiedCountries', JSON.stringify(stickiedCountries));
		}
		return true;
	}
}

const giveawaysStickiedGiveawayCountries = new GiveawaysStickiedGiveawayCountries();

export { giveawaysStickiedGiveawayCountries };
