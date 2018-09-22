import Module from '../class/Module';
import {common} from './Common';

const
  {
    endless_load
  } = common
;

class EndlessLoad extends Module {
  info = ({
    endless: true,
    id: `endlessLoad`,
    load: this.endlessLoad
  });

  async endlessLoad() {    
    if (!this.esgst.menuPath) {
      await endless_load(document, true);
    }
  }
}

export default EndlessLoad;