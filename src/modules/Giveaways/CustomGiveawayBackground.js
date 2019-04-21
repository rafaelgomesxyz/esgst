import { Module } from '../../class/Module';
import { gSettings } from '../../class/Globals';

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
        cgb_b: {
          background: true,
          name: `Color giveaways that cannot be entered because of blacklist reasons.`,
          sg: true
        },
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
        },
        cgb_sgt: {
          background: true,
          name: `Color SGTools giveaways.`,
          sg: true
        }
      },
      featureMap: {
        giveaway: this.color.bind(this)
      },
      id: `cgb`,
      name: `Custom Giveaway Background`,
      sg: true,
      type: `giveaways`
    };
  }

  color(giveaways) {
    for (const giveaway of giveaways) {
      if (gSettings.cgb_b && giveaway.outerWrap.getAttribute(`data-blacklist`)) {
        giveaway.outerWrap.setAttribute(`style`, `background-color: ${gSettings.cgb_b_bgColor} !important`);
      } else if (gSettings.cgb_sgt && giveaway.sgTools) {
        giveaway.outerWrap.setAttribute(`style`, `background-color: ${gSettings.cgb_sgt_bgColor} !important`);
      } else if (gSettings.cgb_w && giveaway.whitelist) {
        giveaway.outerWrap.setAttribute(`style`, `background-color: ${gSettings.cgb_w_bgColor} !important`);
      } else if (gSettings.cgb_g && giveaway.group) {
        giveaway.outerWrap.setAttribute(`style`, `background-color: ${gSettings.cgb_g_bgColor} !important`);
      } else if (gSettings.cgb_rr && giveaway.regionRestricted) {
        giveaway.outerWrap.setAttribute(`style`, `background-color: ${gSettings.cgb_rr_bgColor} !important`);
      } else if (gSettings.cgb_io && giveaway.inviteOnly) {
        giveaway.outerWrap.setAttribute(`style`, `background-color: ${gSettings.cgb_io_bgColor} !important`);
      } else if (gSettings.cgb_p && giveaway.public) {
        giveaway.outerWrap.setAttribute(`style`, `background-color: ${gSettings.cgb_p_bgColor} !important`);
      } else {
        giveaway.outerWrap.style.backgroundColor = ``;
      }
      if (giveaway.outerWrap.style.backgroundColor) {
        giveaway.outerWrap.style.backgroundImage = `none`;
      }
    }
  }
}

const giveawaysCustomGiveawayBackground = new GiveawaysCustomGiveawayBackground();

export { giveawaysCustomGiveawayBackground };