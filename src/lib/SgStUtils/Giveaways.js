import { Giveaway } from './Giveaway';

class Giveaways {
	getGiveaways(context) {
		const giveaways = context.querySelectorAll('div.giveaway__row-outer-wrap');
		for (const giveaway of giveaways) {
			new Giveaway().parse(giveaway);
		}    
	}
}