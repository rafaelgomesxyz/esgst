import { Module } from '../../class/Module';
import { common } from '../Common';
import { Settings } from '../../class/Settings';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
  ;

class GiveawaysGiveawayWinningRatio extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            `Adds an element (`,
            ['i', { class: 'fa fa-pie-chart' }],
            ` [Ratio]: 1) below a giveaway's start time (in any page) that shows the ratio (number of entries per copy) of the giveaway.`
          ]],
          ['li', `The ratio is calculated by rounding up the result of the following formula: number_of_entries / number_of_copies`],
          ['li', 'You can move the element around by dragging and dropping it.']
        ]]
      ],
      features: {
        gwr_e: {
          description: [
            ['ul', [
              ['li', `The formula changes to: (number_of_entries + 1) / number_of_copies`],
              ['li', `For example, if a giveaway has 2 copies and 6 entries, the current ratio is 3:1, but after you enter it, it will have 7 entries, so the ratio will increase to 4:1.`]
            ]]
          ],
          name: 'Show what the ratio will be when you enter the giveaway instead of the current ratio.',
          sg: true
        },
        gwr_a: {
          description: [
            ['ul', [
              ['li', `Uses an advanced formula ((number_of_entries / time_open_in_milliseconds * duration_in_milliseconds) / number_of_copies) to calculate the ratio based on how much time the giveaway has been open and the duration of the giveaway. This gives you an estimate of what the ratio will be when the giveaway ends.`]
            ]]
          ],
          features: {
            gwr_a_b: {
              name: `Show the basic ratio along with the advanced one (the advanced ratio will appear in a parenthesis, like "[Basic]:1 ([Advanced]:1)").`,
              sg: true
            }
          },
          name: 'Use advanced formula.',
          sg: true
        },
        gwr_h: {
          conflicts: [
            'gwc_h'
          ],
          description: [
            ['ul', [
              ['li', 'Changes the color of the giveaway\'s title to the same color as the ratio and adds a border of same color to the giveaway\'s game image.']
            ]]
          ],
          inputItems: [
            {
              id: 'gwr_h_width',
              prefix: `Image Border Width: `
            }
          ],
          name: 'Highlight the giveaway.',
          sg: true
        }
      },
      id: 'gwr',
      name: 'Giveaway Winning Ratio',
      sg: true,
      type: 'giveaways',
      featureMap: {
        giveaway: this.gwr_addRatios.bind(this)
      }
    };
  }

  init() {
    if (Settings.get('gptw') || Settings.get('gwc') || (!this.esgst.enteredPath && (!this.esgst.wonPath || !Settings.get('cewgd') || !Settings.get('cewgd_w') || !Settings.get('cewgd_w_e')))) return;
    this.esgst.endlessFeatures.push(this.esgst.modules.giveawaysGiveawayWinningChance.gwc_addHeading.bind(this.esgst.modules.giveawaysGiveawayWinningChance));
  }

  gwr_addRatios(giveaways, main, source) {
    giveaways.forEach(giveaway => {
      if (giveaway.sgTools || (main && (this.esgst.createdPath || (this.esgst.wonPath && (!Settings.get('cewgd') || !Settings.get('cewgd_w') || !Settings.get('cewgd_w_e'))) || this.esgst.newGiveawayPath || this.esgst.archivePath))) return;
      if (giveaway.started && ((giveaway.inviteOnly && ((main && (this.esgst.giveawayPath || this.esgst.enteredPath || (this.esgst.wonPath && Settings.get('cewgd') && Settings.get('cewgd_w') && Settings.get('cewgd_w_e')))) || !main || giveaway.ended || giveaway.id)) || !giveaway.inviteOnly) && !giveaway.innerWrap.getElementsByClassName('esgst-gwr')[0]) {
        let context = createElements(giveaway.panel, (Settings.get('gv') && ((main && this.esgst.giveawaysPath) || (source === 'gb' && Settings.get('gv_gb')) || (source === 'ged' && Settings.get('gv_ged')) || (source === 'ge' && Settings.get('gv_ge')))) ? 'afterBegin' : 'beforeEnd', [{
          attributes: {
            class: `${this.esgst.giveawayPath ? 'featured__column' : ''} esgst-gwr`,
            ['data-draggable-id']: 'gwr',
            title: getFeatureTooltip('gwr', 'Giveaway Winning Ratio')
          },
          type: 'div'
        }]);
        this.gwr_addRatio(context, giveaway);
      }
    });
  }

  gwr_addRatio(context, giveaway) {
    let advancedColor, advancedRatio = 0, basicColor, basicRatio, colors, entries, i;
    entries = giveaway.entered || giveaway.ended || giveaway.created || !Settings.get('gwr_e') ? giveaway.entries : giveaway.entries + 1;
    basicRatio = Math.ceil(entries / giveaway.copies);
    if (Settings.get('gwr_a') && !giveaway.ended && giveaway.startTime) {
      advancedRatio = Math.ceil((entries / (Date.now() - giveaway.startTime) * (giveaway.endTime - giveaway.startTime)) / giveaway.copies);
    }
    giveaway.ratio = basicRatio;
    giveaway.projectedRatio = advancedRatio;
    context.setAttribute('data-ratio', giveaway.ratio);
    context.setAttribute('data-projectedRatio', giveaway.projectedRatio);
    for (i = Settings.get('gwr_colors').length - 1; i > -1; --i) {
      colors = Settings.get('gwr_colors')[i];
      if (basicRatio >= parseInt(colors.lower) && basicRatio <= parseInt(colors.upper)) {
        basicColor = colors.color;
        break;
      }
    }
    for (i = Settings.get('gwr_colors').length - 1; i > -1; --i) {
      colors = Settings.get('gwr_colors')[i];
      if (advancedRatio >= parseInt(colors.lower) && advancedRatio <= parseInt(colors.upper)) {
        advancedColor = colors.color;
        break;
      }
    }
    if (Settings.get('gwr_h')) {
      giveaway.headingName.classList.add('esgst-gwr-highlight');
      giveaway.headingName.style.color = Settings.get('gwr_a') && !Settings.get('gwr_a_b') ? advancedColor : basicColor;
      if (giveaway.image) {
        giveaway.image.classList.add('esgst-gwr-highlight');
        giveaway.image.style.color = `${Settings.get('gwr_a') && !Settings.get('gwr_a_b') ? advancedColor : basicColor}`;
        giveaway.image.style.boxShadow = `${Settings.get('gwr_a') && !Settings.get('gwr_a_b') ? advancedColor : basicColor} 0px 0px 0px var(--esgst-gwr-highlight-width, 3px)  inset`;
      }
    }
    if (this.esgst.enteredPath || this.esgst.wonPath) {
      context.style.display = 'inline-block';
    }
    const items = [];
    if (!this.esgst.enteredPath && !this.esgst.wonPath) {
      items.push({
        attributes: {
          class: 'fa fa-pie-chart'
        },
        type: 'i'
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
    if (Settings.get('gwr_a') && advancedRatio) {
      if (Settings.get('gwr_a_b')) {
        children.push({
          attributes: basicAttributes,
          text: `${basicRatio}:1`,
          type: 'span'
        }, {
            text: ` (`,
            type: 'node'
          }, {
            attributes: advancedAttributes,
            text: `${advancedRatio}:1`,
            type: 'span'
          }, {
            text: `)`,
            type: 'node'
          });
      } else {
        children.push({
          attributes: advancedAttributes,
          text: `${advancedRatio}:1`,
          type: 'span'
        });
      }
    } else {
      children.push({
        attributes: basicAttributes,
        text: `${basicRatio}:1`,
        type: 'span'
      });
    }
    items.push({
      type: 'span',
      children
    });
    if ((this.esgst.enteredPath || this.esgst.wonPath) && Settings.get('gptw')) {
      items.push({
        text: ' / ',
        type: 'node'
      });
    }
    createElements(context, 'inner', items);
  }
}

const giveawaysGiveawayWinningRatio = new GiveawaysGiveawayWinningRatio();

export { giveawaysGiveawayWinningRatio };