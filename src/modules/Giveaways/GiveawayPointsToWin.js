_MODULES.push({
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
    load: gptw,
    name: `Giveaway Points To Win`,
    sg: true,
    type: `giveaways`
  });

  function gptw() {
    esgst.giveawayFeatures.push(gptw_addPoints);
    if (!esgst.enteredPath) return;
    esgst.endlessFeatures.push(gwc_addHeading);
  }

  function gptw_addPoints(giveaways, main, source) {
    for (const giveaway of giveaways) {
      if (giveaway.sgTools || (main && (esgst.createdPath || esgst.wonPath || esgst.newGiveawayPath || esgst.archivePath))) {
        continue;
      }
      if (((!giveaway.inviteOnly || ((!main || (!esgst.giveawayPath && !esgst.enteredPath)) && main && !giveaway.ended)) && giveaway.inviteOnly) || giveaway.innerWrap.getElementsByClassName(`esgst-gptw`)[0]) {
        continue;
      }
      if (giveaway.started) {
        giveaway.gptwContext = createElements(giveaway.panel, (esgst.gv && ((main && esgst.giveawaysPath) || (source === `gb` && esgst.gv_gb) || (source === `ged` && esgst.gv_ged) || (source === `ge` && esgst.gv_ge))) ? `afterBegin` : `beforeEnd`, [{
          attributes: {
            class: `${esgst.giveawayPath ? `featured__column` : ``} esgst-gptw`,
            [`data-columnId`]: `gptw`,
            title: getFeatureTooltip(`gptw`, `Giveaway Points To Win`)
          },
          type: `div`
        }]);
        gptw_addPoint(giveaway);
        if (!esgst.lockGiveawayColumns && (!main || esgst.giveawaysPath || esgst.userPath || esgst.groupPath)) {
          giveaway.gptwContext.setAttribute(`draggable`, true);
          giveaway.gptwContext.addEventListener(`dragstart`, giveaways_setSource.bind(null, giveaway));
          giveaway.gptwContext.addEventListener(`dragenter`, giveaways_getSource.bind(null, giveaway, false));
          giveaway.gptwContext.addEventListener(`dragend`, giveaways_saveSource.bind(null, giveaway));
        }
      } else {
        giveaway.pointsToWin = 0;
      }
    }
  }

  function gptw_addPoint(giveaway) {
    const entries = giveaway.entered || giveaway.ended || giveaway.created || !esgst.gptw_e ? giveaway.entries : giveaway.entries + 1;
    giveaway.pointsToWin = Math.round((giveaway.points || 0) / giveaway.copies * entries * 100) / 100;
    giveaway.gptwContext.setAttribute(`data-pointsToWin`, giveaway.pointsToWin);
    let color = null;
    for (const colors of esgst.gptw_colors) {
      if (giveaway.pointsToWin >= parseFloat(colors.lower) && giveaway.pointsToWin <= parseFloat(colors.upper)) {
        color = colors.color;
        break;
      }
    }
    if (esgst.enteredPath) {
      giveaway.gptwContext.style.display = `inline-block`;
    }
    const items = [];
    if (!esgst.enteredPath) {
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
    createElements(giveaway.gptwContext, `inner`, items);
  }

