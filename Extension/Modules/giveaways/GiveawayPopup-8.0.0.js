_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-external-link"></i>) below a giveaway's start time (in any page) that allows you to read the description of the giveaway and/or add a comment to it without having to access it.</li>
        <li>You can move the button around by dragging and dropping it.</li>
      </ul>
    `,
    id: `gp`,
    load: gp,
    name: `Giveaway Popup`,
    sg: true,
    type: `giveaways`
  });

  function gp() {
    esgst.giveawayFeatures.push(gp_addButton);
  }

  function gp_addButton(giveaways, main, source) {
    giveaways.forEach(giveaway => {
      if (giveaway.sgTools || (main && (esgst.createdPath || esgst.enteredPath || esgst.wonPath || esgst.giveawayPath || esgst.newGiveawayPath))) return;
      if (!giveaway.innerWrap.getElementsByClassName(`esgst-gp-button`)[0] && (!giveaway.inviteOnly || giveaway.url)) {
        let buttonSet = new ButtonSet(`grey`, `grey`, `fa-external-link`, `fa-circle-o-notch fa-spin`, ``, ``, callback => {
          elgb_openPopup(giveaway, main, source, error => {
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
        buttonSet.setAttribute(`data-columnId`, `gp`);
        buttonSet.title = getFeatureTooltip(`gp`, `View giveaway description/add a comment`);
        giveaway.panel.appendChild(buttonSet);
        if (!esgst.lockGiveawayColumns && (!main || esgst.giveawaysPath || esgst.userPath || esgst.groupPath)) {
          buttonSet.setAttribute(`draggable`, true);
          buttonSet.addEventListener(`dragstart`, giveaways_setSource.bind(null, giveaway));
          buttonSet.addEventListener(`dragenter`, giveaways_getSource.bind(null, giveaway, false));
          buttonSet.addEventListener(`dragend`, giveaways_saveSource.bind(null, giveaway));
        }
      }
    });
  }

