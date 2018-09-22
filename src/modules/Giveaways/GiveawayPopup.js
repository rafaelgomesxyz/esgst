import Module from '../../class/Module';
import ButtonSet from '../../class/ButtonSet';
import {common} from '../Common';

const
  {
    getFeatureTooltip
  } = common
;

class GiveawaysGiveawayPopup extends Module {
  info = ({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-external-link"></i>) below a giveaway's start time (in any page) that allows you to read the description of the giveaway and/or add a comment to it without having to access it.</li>
        <li>You can move the button around by dragging and dropping it.</li>
      </ul>
    `,
    id: `gp`,
    load: this.gp,
    name: `Giveaway Popup`,
    sg: true,
    type: `giveaways`
  });

  gp() {
    this.esgst.giveawayFeatures.push(this.gp_addButton);
  }

  gp_addButton(giveaways, main, source) {
    giveaways.forEach(giveaway => {
      if (giveaway.sgTools || (main && (this.esgst.createdPath || this.esgst.enteredPath || this.esgst.wonPath || this.esgst.giveawayPath || this.esgst.newGiveawayPath))) return;
      if (!giveaway.innerWrap.getElementsByClassName(`esgst-gp-button`)[0] && (!giveaway.inviteOnly || giveaway.url)) {
        let buttonSet = new ButtonSet(`grey`, `grey`, `fa-external-link`, `fa-circle-o-notch fa-spin`, ``, ``, callback => {
          // noinspection JSIgnoredPromiseFromCall
          this.esgst.modules.giveawaysEnterLeaveGiveawayButton.elgb_openPopup(giveaway, main, source, error => {
            if (error) {
              buttonSet.firstElementChild.classList.remove(`form__saving-button`, `grey`);
              buttonSet.firstElementChild.classList.add(`sidebar__error`, `red`);
              buttonSet.title = getFeatureTooltip(`gp`, `Could not access giveaway`);
            } else if (buttonSet.firstElementChild.classList.contains(`sidebar__error`)) {
              buttonSet.firstElementChild.classList.remove(`sidebar__error`, `red`);
              buttonSet.firstElementChild.classList.add(`form__saving-button`, `grey`);
              buttonSet.title = getFeatureTooltip(`gp`, `View giveaway description/add a comment`);
            }
            callback();
          });
        }).set;
        buttonSet.classList.add(`esgst-gp-button`);
        buttonSet.setAttribute(`data-draggable-id`, `gp`);
        buttonSet.title = getFeatureTooltip(`gp`, `View giveaway description/add a comment`);
        giveaway.panel.appendChild(buttonSet);
      }
    });
  }
}

export default GiveawaysGiveawayPopup;