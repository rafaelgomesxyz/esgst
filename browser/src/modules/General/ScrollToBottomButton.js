import { Module } from '../../class/Module';
import { common } from '../Common';
import { gSettings } from '../../class/Globals';

const
  animateScroll = common.animateScroll.bind(common),
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
  ;

class GeneralScrollToBottomButton extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-chevron-down` }],
            `) either to the bottom right corner, the main page heading or the footer (you can decide where) of any page that takes you to the bottom of the page.`
          ]]
        ]]
      ],
      id: `stbb`,
      name: `Scroll To Bottom Button`,
      options: {
        title: `Show in:`,
        values: [`Bottom Right Corner`, `Main Page Heading`, `Footer`]
      },
      sg: true,
      st: true,
      type: `general`
    };
  }

  init() {
    let button;
    switch (gSettings.stbb_index) {
      case 0:
        button = createElements(document.body, `beforeEnd`, [{
          attributes: {
            class: `esgst-stbb-button esgst-stbb-button-fixed`,
            title: `${getFeatureTooltip(`stbb`, `Scroll to bottom`)}`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-chevron-down`
            },
            type: `i`
          }]
        }]);
        window.addEventListener(`scroll`, () => {
          if (document.documentElement.offsetHeight - window.innerHeight >= window.scrollY + 100) {
            button.classList.remove(`esgst-hidden`);
          } else {
            button.classList.add(`esgst-hidden`);
          }
        });
        break;
      case 1:
        button = createHeadingButton({ id: `stbb`, icons: [`fa-chevron-down`], title: `Scroll to bottom` });
        button.classList.add(`esgst-stbb-button`);
        break;
      case 2:
        button = createElements(this.esgst.footer.firstElementChild.lastElementChild, `beforeEnd`, [{
          attributes: {
            class: `esgst-stbb-button`,
            title: getFeatureTooltip(`stbb`, `Scroll to bottom`)
          },
          type: this.esgst.sg ? `div` : `li`,
          children: [{
            attributes: {
              class: `fa fa-chevron-down`
            },
            type: `i`
          }]
        }]);
        break;
    }
    button.addEventListener(`click`, () => animateScroll(document.documentElement.offsetHeight, () => {
      if (gSettings.es && this.esgst.es.paginations) {
        this.esgst.modules.generalEndlessScrolling.es_changePagination(this.esgst.es, this.esgst.es.reverseScrolling ? 1 : this.esgst.es.paginations.length);
      }
    }));
  }
}

const generalScrollToBottomButton = new GeneralScrollToBottomButton();

export { generalScrollToBottomButton };