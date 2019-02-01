import { Giveaway } from './Giveaway';

class Giveaways {
  getGiveaways(contex) {
    const giveaways = context.querySelectorAll(`div.giveaway__row-outer-wrap`);
    for (const giveaway of giveaways) {
      Giveaway.parse(giveaway);
    }    
  }
}