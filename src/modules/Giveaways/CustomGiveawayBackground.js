import Module from '../../class/Module';

class GiveawaysCustomGiveawayBackground extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Allows you to color the background of giveaways based on their type (public, invite only, region restricted, group or whitelist).`]
        ]]
      ],
      features: {
        cgb_p: {
          background: true,
          name: `Color public giveaways.`,
          sg: true
        },
        cgb_io: {
          background: true,
          name: `Color invite only giveaways.`,
          sg: true
        },
        cgb_rr: {
          background: true,
          name: `Color region restricted giveaways.`,
          sg: true
        },
        cgb_g: {
          background: true,
          name: `Color group giveaways.`,
          sg: true
        },
        cgb_w: {
          background: true,
          name: `Color whitelist giveaways.`,
          sg: true
        }
      },
      featureMap: {
        giveaway: `color`
      },
      id: `cgb`,
      name: `Custom Giveaway Background`,
      sg: true,
      type: `giveaways`
    };
  }

  color(giveaways) {
    for (const giveaway of giveaways) {
      if (this.esgst.cgb_p && giveaway.public) {
        giveaway.outerWrap.style.backgroundColor = this.esgst.cgb_p_bgColor;
      }
      if (this.esgst.cgb_io && giveaway.inviteOnly) {
        giveaway.outerWrap.style.backgroundColor = this.esgst.cgb_io_bgColor;
      }
      if (this.esgst.cgb_rr && giveaway.regionRestricted) {
        giveaway.outerWrap.style.backgroundColor = this.esgst.cgb_rr_bgColor;
      }
      if (this.esgst.cgb_g && giveaway.group) {
        giveaway.outerWrap.style.backgroundColor = this.esgst.cgb_g_bgColor;
      }
      if (this.esgst.cgb_w && giveaway.whitelist) {
        giveaway.outerWrap.style.backgroundColor = this.esgst.cgb_w_bgColor;
      }
    }
  }
}

export default GiveawaysCustomGiveawayBackground;