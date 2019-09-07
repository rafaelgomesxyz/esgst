import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { common } from '../Common';

const
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
  ;

class GiveawaysGiveawayPopup extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            `Adds a button (`,
            ['i', { class: `fa fa-external-link` }],
            ` ) below a giveaway's start time (in any page) that allows you to read the description of the giveaway and/or add a comment to it without having to access it.`
          ]],
          ['li', `You can move the button around by dragging and dropping it.`]
        ]]
      ],
      id: 'gp',
      name: `Giveaway Popup`,
      sg: true,
      type: 'giveaways',
      featureMap: {
        giveaway: this.gp_addButton.bind(this)
      }
    };
  }

  gp_addButton(giveaways, main, source) {
    giveaways.forEach(giveaway => {
      if (giveaway.sgTools || (main && (this.esgst.createdPath || this.esgst.enteredPath || this.esgst.wonPath || this.esgst.giveawayPath || this.esgst.newGiveawayPath))) return;
      if (!giveaway.innerWrap.getElementsByClassName(`esgst-gp-button`)[0] && (!giveaway.inviteOnly || giveaway.url)) {
        let buttonSet = new ButtonSet({
          color1: 'grey',
          color2: 'grey',
          icon1: `fa-external-link`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: ``,
          title2: ``,
          callback1: () => {
            return new Promise(resolve => {
              // noinspection JSIgnoredPromiseFromCall
              this.esgst.modules.giveawaysEnterLeaveGiveawayButton.elgb_openPopup(giveaway, main, source, error => {
                if (error) {
                  buttonSet.firstElementChild.classList.remove(`form__saving-button`, 'grey');
                  buttonSet.firstElementChild.classList.add('sidebar__error', 'red');
                  buttonSet.title = getFeatureTooltip('gp', `Could not access giveaway`);
                } else if (buttonSet.firstElementChild.classList.contains('sidebar__error')) {
                  buttonSet.firstElementChild.classList.remove('sidebar__error', 'red');
                  buttonSet.firstElementChild.classList.add(`form__saving-button`, 'grey');
                  buttonSet.title = getFeatureTooltip('gp', `View giveaway description/add a comment`);
                }
                resolve();
              });
            });
          }
        }).set;
        buttonSet.classList.add(`esgst-gp-button`);
        buttonSet.setAttribute(`data-draggable-id`, 'gp');
        buttonSet.title = getFeatureTooltip('gp', `View giveaway description/add a comment`);
        giveaway.panel.appendChild(buttonSet);
      }
    });
  }
}

const giveawaysGiveawayPopup = new GiveawaysGiveawayPopup();

export { giveawaysGiveawayPopup };