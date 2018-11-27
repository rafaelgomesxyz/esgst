import Module from '../class/Module';
import {common} from './Common';

const
  endless_load = common.endless_load.bind(common)
;

class EndlessLoad extends Module {
  constructor() {
    super();
    this.info = {
      endless: true,
      id: `endlessLoad`,
      load: this.endlessLoad
    };
  }

  async endlessLoad() {
    await endless_load(document, true);
  }
}

export default EndlessLoad;