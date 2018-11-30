import Module from '../../class/Module';

class GeneralHiddenCommunityPoll extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Hides the community poll (if there is one) of the main page.`]
        ]]
      ],
      features: {
        hcp_v: {
          name: `Only hide the poll if you already voted in it.`,
          sg: true
        }
      },
      id: `hcp`,
      load: this.hcp,
      name: `Hidden Community Poll`,
      sg: true,
      type: `general`
    };
  }

  hcp() {
    if (!this.esgst.giveawaysPath || !this.esgst.activeDiscussions) return;
    let poll = this.esgst.activeDiscussions.previousElementSibling;
    if (poll && poll.classList.contains(`widget-container`)) {
      if (!this.esgst.hcp_v || poll.querySelector(`.table__row-outer-wrap.is-selected`)) {
        poll.classList.add(`esgst-hidden`);
      }
    }
  }
}

export default GeneralHiddenCommunityPoll;