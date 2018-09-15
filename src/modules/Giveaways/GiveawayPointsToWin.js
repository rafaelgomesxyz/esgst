import Module from '../../class/Module';

class GiveawaysGiveawayPointsToWin extends Module {
info = ({
    description: `
      <ul>
        <li>Adds an element (<i class="fa fa-rub"></i> [Points]) below a giveaway's start time (in any page) that shows how many points you would have to spend to win the giveaway.</li>
        <li>The points are calculated by rounding up (using 2 decimals) the result of the following formula: number_of_points / number_of_copies * number_of_entries
        <li>You can move the element around by dragging and dropping it.</li>
      </ul>
    `,
    features: {
      gptw_e: {
        description: `
          <ul>
            <li>The formula changes to: number_of_points / number_of_copies * (number_of_entries + 1)
            <li>For example, if a giveaway for 2 copies has 5 entries and is worth 10 points, the current points to win are 25, but after you enter it, it will have 6 entries, so the points will increase to 30.</li>
          </ul>
        `,
        name: `Show what the points to win will be when you enter the giveaway instead of the current points to win.`,
        sg: true
      }
    },
    id: `gptw`,
    load: this.gptw,
    name: `Giveaway Points To Win`,
    sg: true,
    type: `giveaways`
  });

  gptw() {
    this.esgst.giveawayFeatures.push(gptw_addPoints);
    if (!this.esgst.enteredPath) return;
    this.esgst.endlessFeatures.push(gwc_addHeading);
  }

  gptw_addPoints(giveaways, main, source) {
    for (const giveaway of giveaways) {
      if (giveaway.sgTools || (main && (this.esgst.createdPath || this.esgst.wonPath || this.esgst.newGiveawayPath || this.esgst.archivePath))) {
        continue;
      }
      if (((!giveaway.inviteOnly || ((!main || (!this.esgst.giveawayPath && !this.esgst.enteredPath)) && main && !giveaway.ended)) && giveaway.inviteOnly) || giveaway.innerWrap.getElementsByClassName(`esgst-gptw`)[0]) {
        continue;
      }
      if (giveaway.started) {
        giveaway.gptwContext = this.esgst.modules.common.createElements(giveaway.panel, (this.esgst.gv && ((main && this.esgst.giveawaysPath) || (source === `gb` && this.esgst.gv_gb) || (source === `ged` && this.esgst.gv_ged) || (source === `ge` && this.esgst.gv_ge))) ? `afterBegin` : `beforeEnd`, [{
          attributes: {
            class: `${this.esgst.giveawayPath ? `featured__column` : ``} esgst-gptw`,
            [`data-columnId`]: `gptw`,
            title: this.esgst.modules.common.getFeatureTooltip(`gptw`, `Giveaway Points To Win`)
          },
          type: `div`
        }]);
        this.gptw_addPoint(giveaway);
        if (!this.esgst.lockGiveawayColumns && (!main || this.esgst.giveawaysPath || this.esgst.userPath || this.esgst.groupPath)) {
          giveaway.gptwContext.setAttribute(`draggable`, true);
          giveaway.gptwContext.addEventListener(`dragstart`, this.esgst.modules.giveaways.giveaways_setSource.bind(null, giveaway));
          giveaway.gptwContext.addEventListener(`dragenter`, this.esgst.modules.giveaways.giveaways_getSource.bind(null, giveaway, false));
          giveaway.gptwContext.addEventListener(`dragend`, this.esgst.modules.giveaways.giveaways_saveSource.bind(null, giveaway));
        }
      } else {
        giveaway.pointsToWin = 0;
      }
    }
  }

  gptw_addPoint(giveaway) {
    const entries = giveaway.entered || giveaway.ended || giveaway.created || !this.esgst.gptw_e ? giveaway.entries : giveaway.entries + 1;
    giveaway.pointsToWin = Math.round((giveaway.points || 0) / giveaway.copies * entries * 100) / 100;
    giveaway.gptwContext.setAttribute(`data-pointsToWin`, giveaway.pointsToWin);
    let color = null;
    for (const colors of this.esgst.gptw_colors) {
      if (giveaway.pointsToWin >= parseFloat(colors.lower) && giveaway.pointsToWin <= parseFloat(colors.upper)) {
        color = colors.color;
        break;
      }
    }
    if (this.esgst.enteredPath) {
      giveaway.gptwContext.style.display = `inline-block`;
    }
    const items = [];
    if (!this.esgst.enteredPath) {
      items.push({
        attributes: {
          class: `fa fa-rub`
        },
        type: `i`
      });
    }
    const attributes = {};
    if (color) {
      attributes.style = `color: ${color}; font-weight: bold;`
    }
    items.push({
      attributes,
      text: giveaway.pointsToWin,
      type: `span`
    });
    this.esgst.modules.common.createElements(giveaway.gptwContext, `inner`, items);
  }
}

export default GiveawaysGiveawayPointsToWin;