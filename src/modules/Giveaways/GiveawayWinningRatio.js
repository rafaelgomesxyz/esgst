import Module from '../../class/Module';
import {common} from '../Common';

const
  {
    createElements,
    getFeatureTooltip
  } = common
;

class GiveawaysGiveawayWinningRatio extends Module {
  info = ({
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
    load: this.gwr,
    name: `Giveaway Winning Ratio`,
    sg: true,
    type: `giveaways`
  });

  gwr() {
    this.esgst.giveawayFeatures.push(this.gwr_addRatios);
    if (this.esgst.gptw || this.esgst.gwc || !this.esgst.enteredPath) return;
    this.esgst.endlessFeatures.push(this.gwc_addHeading);
  }

  gwr_addRatios(giveaways, main, source) {
    giveaways.forEach(giveaway => {
      if (giveaway.sgTools || (main && (this.esgst.createdPath || this.esgst.wonPath || this.esgst.newGiveawayPath || this.esgst.archivePath))) return;
      if (giveaway.started && ((giveaway.inviteOnly && ((main && (this.esgst.giveawayPath || this.esgst.enteredPath)) || !main || giveaway.ended)) || !giveaway.inviteOnly) && !giveaway.innerWrap.getElementsByClassName(`esgst-gwr`)[0]) {
        let context = createElements(giveaway.panel, (this.esgst.gv && ((main && this.esgst.giveawaysPath) || (source === `gb` && this.esgst.gv_gb) || (source === `ged` && this.esgst.gv_ged) || (source === `ge` && this.esgst.gv_ge))) ? `afterBegin` : `beforeEnd`, [{
          attributes: {
            class: `${this.esgst.giveawayPath ? `featured__column` : ``} esgst-gwr`,
            [`data-draggable-id`]: `gwr`,
            title: getFeatureTooltip(`gwr`, `Giveaway Winning Ratio`)
          },
          type: `div`
        }]);
        this.gwr_addRatio(context, giveaway);
      }
    });
  }

  gwr_addRatio(context, giveaway) {
    let advancedColor, advancedRatio = 0, basicColor, basicRatio, colors, entries, i;
    entries = giveaway.entered || giveaway.ended || giveaway.created || !this.esgst.gwr_e ? giveaway.entries : giveaway.entries + 1;
    basicRatio = Math.ceil(entries / giveaway.copies);
    if (this.esgst.gwr_a && !giveaway.ended && giveaway.startTime) {
      advancedRatio = Math.ceil((entries / (Date.now() - giveaway.startTime) * (giveaway.endTime - giveaway.startTime)) / giveaway.copies);
    }
    giveaway.ratio = basicRatio;
    giveaway.projectedRatio = advancedRatio;
    context.setAttribute(`data-ratio`, giveaway.ratio);
    context.setAttribute(`data-projectedRatio`, giveaway.projectedRatio);
    for (i = this.esgst.gwr_colors.length - 1; i > -1; --i) {
      colors = this.esgst.gwr_colors[i];
      if (basicRatio >= parseInt(colors.lower) && basicRatio <= parseInt(colors.upper)) {
        basicColor = colors.color;
        break;
      }
    }
    for (i = this.esgst.gwr_colors.length - 1; i > -1; --i) {
      colors = this.esgst.gwr_colors[i];
      if (advancedRatio >= parseInt(colors.lower) && advancedRatio <= parseInt(colors.upper)) {
        advancedColor = colors.color;
        break;
      }
    }
    if (this.esgst.gwr_h) {
      giveaway.headingName.classList.add(`esgst-gwr-highlight`);
      giveaway.headingName.style.color = this.esgst.gwr_a && !this.esgst.gwr_a_b ? advancedColor : basicColor;
      if (giveaway.image) {
        giveaway.image.classList.add(`esgst-gwr-highlight`);
        giveaway.image.style.color = `${this.esgst.gwr_a && !this.esgst.gwr_a_b ? advancedColor : basicColor}`;
        giveaway.image.style.boxShadow = `${this.esgst.gwr_a && !this.esgst.gwr_a_b ? advancedColor : basicColor} 0px 0px 0px var(--esgst-gwr-highlight-width, 3px)  inset`;
      }
    }
    if (this.esgst.enteredPath) {
      context.style.display = `inline-block`;
    }    
    const items = [];
    if (!this.esgst.enteredPath) {
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
    if (this.esgst.gwr_a && advancedRatio) {
      if (this.esgst.gwr_a_b) {
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
    if (this.esgst.enteredPath && this.esgst.gptw) {
      items.push({
        text: ` / `,
        type: `node`
      });
    }
    createElements(context, `inner`, items);
  }
}

export default GiveawaysGiveawayWinningRatio;