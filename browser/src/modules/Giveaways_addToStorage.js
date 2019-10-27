import { Module } from '../class/Module';
import {common} from './Common';
import { Settings } from '../class/Settings';

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
    if ((Settings.lpv || Settings.cewgd || (Settings.gc && Settings.gc_gi)) && this.esgst.giveawayPath && document.referrer === `https://www.steamgifts.com/giveaways/new`) {
      addGiveawayToStorage();
    }
  }
}

const giveaways_addToStorage = new Giveaways_addToStorage();

export { giveaways_addToStorage };