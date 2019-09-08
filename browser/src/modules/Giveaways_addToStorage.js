import { Module } from '../class/Module';
import {common} from './Common';
import { gSettings } from '../class/Globals';

const
  addGiveawayToStorage = common.addGiveawayToStorage.bind(common)
;

class Giveaways_addToStorage extends Module {
  constructor() {
    super();
    this.info = {
      endless: true,
      id: 'giveaways_addToStorage'
    };
  }

  init() {
    if ((gSettings.lpv || gSettings.cewgd || (gSettings.gc && gSettings.gc_gi)) && this.esgst.giveawayPath && document.referrer === `https://www.steamgifts.com/giveaways/new`) {
      addGiveawayToStorage();
    }
  }
}

const giveaways_addToStorage = new Giveaways_addToStorage();

export { giveaways_addToStorage };