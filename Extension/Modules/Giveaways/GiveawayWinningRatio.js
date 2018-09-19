_MODULES.push({
    description: `
      <ul>
        <li>Adds an element (<i class="fa fa-pie-chart"></i> [Ratio]:1) below a giveaway's start time (in any page) that shows the ratio (number of entries per copy) of the giveaway.</li>
        <li>The ratio is calculated by rounding up the result of the following formula: number_of_entries / number_of_copies
        <li>You can move the element around by dragging and dropping it.</li>
      </ul>
    `,
    features: {
      gwr_e: {
        description: `
          <ul>
            <li>The formula changes to: (number_of_entries + 1) / number_of_copies
            <li>For example, if a giveaway has 2 copies and 6 entries, the current ratio is 3:1, but after you enter it, it will have 7 entries, so the ratio will increase to 4:1.</li>
          </ul>
        `,
        name: `Show what the ratio will be when you enter the giveaway instead of the current ratio.`,
        sg: true
      },
      gwr_a: {
        description: `
          <ul>
            <li>Uses an advanced formula ((number_of_entries / time_open_in_milliseconds * duration_in_milliseconds) / number_of_copies) to calculate the ratio based on how much time the giveaway has been open and the duration of the giveaway. This gives you an estimate of what the ratio will be when the giveaway ends.</li>
          </ul>
        `,
        features: {
          gwr_a_b: {
            name: `Show the basic ratio along with the advanced one (the advanced ratio will appear in a parenthesis, like "[Basic]:1 ([Advanced]:1)").`,
            sg: true
          }
        },
        name: `Use advanced formula.`,
        sg: true
      },
      gwr_h: {
        conflicts: [
          {id: `gwc_h`, name: `Giveaway Winning Chance > Highlight the giveaway.`}
        ],
        description: `
          <ul>
            <li>Changes the color of the giveaway's title to the same color as the ratio and adds a border of same color to the giveaway's game image.</li>
          </ul>
        `,
        inputItems: [
          {
            id: `gwr_h_width`,
            prefix: `Image Border Width: `
          }
        ],
        name: `Highlight the giveaway.`,
        sg: true
      }
    },
    id: `gwr`,
    load: gwr,
    name: `Giveaway Winning Ratio`,
    sg: true,
    type: `giveaways`
  });

  function gwr() {
    esgst.giveawayFeatures.push(gwr_addRatios);
    if (esgst.gptw || esgst.gwc || !esgst.enteredPath) return;
    esgst.endlessFeatures.push(gwc_addHeading);
  }

  function gwr_addRatios(giveaways, main, source) {
    giveaways.forEach(giveaway => {
      if (giveaway.sgTools || (main && (esgst.createdPath || esgst.wonPath || esgst.newGiveawayPath || esgst.archivePath))) return;
      if (giveaway.started && ((giveaway.inviteOnly && ((main && (esgst.giveawayPath || esgst.enteredPath)) || !main || giveaway.ended)) || !giveaway.inviteOnly) && !giveaway.innerWrap.getElementsByClassName(`esgst-gwr`)[0]) {
        let context = createElements(giveaway.panel, (esgst.gv && ((main && esgst.giveawaysPath) || (source === `gb` && esgst.gv_gb) || (source === `ged` && esgst.gv_ged) || (source === `ge` && esgst.gv_ge))) ? `afterBegin` : `beforeEnd`, [{
          attributes: {
            class: `${esgst.giveawayPath ? `featured__column` : ``} esgst-gwr`,
            [`data-columnId`]: `gwr`,
            title: getFeatureTooltip(`gwr`, `Giveaway Winning Ratio`)
          },
          type: `div`
        }]);
        gwr_addRatio(context, giveaway);
        if (!esgst.lockGiveawayColumns && (!main || esgst.giveawaysPath || esgst.userPath || esgst.groupPath)) {
          draggable_set({
            context: giveaway.panel,
            id: `giveawayPanel`,
            source: giveaway
          });
        }
      }
    });
  }

  function gwr_addRatio(context, giveaway) {
    let advancedColor, advancedRatio = 0, basicColor, basicRatio, colors, entries, i;
    entries = giveaway.entered || giveaway.ended || giveaway.created || !esgst.gwr_e ? giveaway.entries : giveaway.entries + 1;
    basicRatio = Math.ceil(entries / giveaway.copies);
    if (esgst.gwr_a && !giveaway.ended && giveaway.startTime) {
      advancedRatio = Math.ceil((entries / (Date.now() - giveaway.startTime) * (giveaway.endTime - giveaway.startTime)) / giveaway.copies);
    }
    giveaway.ratio = basicRatio;
    giveaway.projectedRatio = advancedRatio;
    context.setAttribute(`data-ratio`, giveaway.ratio);
    context.setAttribute(`data-projectedRatio`, giveaway.projectedRatio);
    for (i = esgst.gwr_colors.length - 1; i > -1; --i) {
      colors = esgst.gwr_colors[i];
      if (basicRatio >= parseInt(colors.lower) && basicRatio <= parseInt(colors.upper)) {
        basicColor = colors.color;
        break;
      }
    }
    for (i = esgst.gwr_colors.length - 1; i > -1; --i) {
      colors = esgst.gwr_colors[i];
      if (advancedRatio >= parseInt(colors.lower) && advancedRatio <= parseInt(colors.upper)) {
        advancedColor = colors.color;
        break;
      }
    }
    if (esgst.gwr_h) {
      giveaway.headingName.classList.add(`esgst-gwr-highlight`);
      giveaway.headingName.style.color = esgst.gwr_a && !esgst.gwr_a_b ? advancedColor : basicColor;
      if (giveaway.image) {
        giveaway.image.classList.add(`esgst-gwr-highlight`);
        giveaway.image.style.color = `${esgst.gwr_a && !esgst.gwr_a_b ? advancedColor : basicColor}`;
        giveaway.image.style.boxShadow = `${esgst.gwr_a && !esgst.gwr_a_b ? advancedColor : basicColor} 0px 0px 0px var(--esgst-gwr-highlight-width, 3px)  inset`;
      }
    }
    if (esgst.enteredPath) {
      context.style.display = `inline-block`;
    }    
    const items = [];
    if (!esgst.enteredPath) {
      items.push({
        attributes: {
          class: `fa fa-pie-chart`
        },
        type: `i`
      });
    }
    const children = [];
    const basicAttributes = {};
    if (basicColor) {
      basicAttributes.style = `color: ${basicColor}; font-weight: bold;`
    }
    const advancedAttributes = {};
    if (advancedColor) {
      advancedAttributes.style = `color: ${advancedColor}; font-weight: bold;`
    }
    if (esgst.gwr_a && advancedRatio) {
      if (esgst.gwr_a_b) {
        children.push({
          attributes: basicAttributes,
          text: `${basicRatio}:1`,
          type: `span`        
        }, {
          text: ` (`,
          type: `node`
        }, {
          attributes: advancedAttributes,
          text: `${advancedRatio}:1`,
          type: `span`        
        }, {
          text: `)`,
          type: `node`
        });
      } else {
        children.push({
          attributes: advancedAttributes,
          text: `${advancedRatio}:1`,
          type: `span`        
        });     
      }
    } else {
      children.push({
        attributes: basicAttributes,
        text: `${basicRatio}:1`,
        type: `span`        
      });
    }
    items.push({
      type: `span`,
      children
    });
    if (esgst.enteredPath && esgst.gptw) {
      items.push({
        text: ` / `,
        type: `node`
      });
    }
    createElements(context, `inner`, items);
  }
  
