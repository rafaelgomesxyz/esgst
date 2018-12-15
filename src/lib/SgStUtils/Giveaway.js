class Giveaway {
  constructor(code) {
    this.plugins = [];
  }

  registerPlugin(plugin) {
    this.plugins.push(plugin);
  }

  build() {

  }

  getInfo() {
    for (const plugin of this.plugins) {
      plugin(this);
    }
  }

  getRawData() {

  }

  async getComments() {

  }

  async getCountries() {

  }

  async getEntries() {

  }

  async getGroups() {

  }

  async getWinners() {

  }
}