import Module from '../class/Module';

class EndlessLoad extends Module {
info = ({
  endless: true,
  id: `endlessLoad`,
  load: endlessLoad
});

async endlessLoad() {    
  if (!this.esgst.menuPath) {
    await this.esgst.modules.common.endless_load(document, true);
  }
}
}

export default EndlessLoad;