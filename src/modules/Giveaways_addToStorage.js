import Module from '../class/Module';
import {common} from './Common';

const
  addGiveawayToStorage = common.addGiveawayToStorage.bind(common)
;

class Giveaways_addToStorage extends Module {
  constructor() {
    super();
    this.info = {
      endless: true,
      id: `giveaways_addToStorage`,
      load: this.giveaways_addToStorage.bind(this)
    };
  }

  giveaways_addToStorage() {
    if ((this.esgst.lpv || this.esgst.cewgd || (this.esgst.gc && this.esgst.gc_gi)) && this.esgst.giveawayPath && document.referrer === `https://www.steamgifts.com/giveaways/new`) {
      addGiveawayToStorage();
    }
  }
}

export default Giveaways_addToStorage;