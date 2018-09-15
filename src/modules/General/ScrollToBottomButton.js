import Module from '../../class/Module';

class GeneralScrollToBottomButton extends Module {
info = ({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-chevron-down"></i>) either to the bottom right corner, the main page heading or the footer (you can decide where) of any page that takes you to the bottom of the page.</li>
      </ul>
    `,
    id: `stbb`,
    load: this.stbb,
    name: `Scroll To Bottom Button`,
    options: {
      title: `Show in:`,
      values: [`Bottom Right Corner`, `Main Page Heading`, `Footer`]
    },
    sg: true,
    st: true,
    type: `general`
  });

  stbb() {
    let button;
    switch (this.esgst.stbb_index) {
      case 0:
        button = this.esgst.modules.common.createElements(document.body, `beforeEnd`, [{
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
        addEventListener(`scroll`, () => {
          if (document.documentElement.offsetHeight -  innerHeight >=  scrollY + 100) {
            button.classList.remove(`esgst-hidden`);
          } else {
            button.classList.add(`esgst-hidden`);
          }
        });
        break;
      case 1:
        button = this.esgst.modules.common.createHeadingButton({id: `stbb`, icons: [`fa-chevron-down`], title: `Scroll to bottom`});
        button.classList.add(`esgst-stbb-button`);
        break;
      case 2:
        button = this.esgst.modules.common.createElements(this.esgst.footer.firstElementChild.lastElementChild, `beforeEnd`, [{
          attributes: {
            class: `esgst-stbb-button`,
            title: this.esgst.modules.common.getFeatureTooltip(`stbb`, `Scroll to bottom`)
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
    button.addEventListener(`click`, () => this.esgst.modules.common.animateScroll(document.documentElement.offsetHeight, () => {
      if (this.esgst.es && this.esgst.es.paginations) {
        this.esgst.modules.generalEndlessScrolling.es_changePagination(this.esgst.es, this.esgst.es.reverseScrolling ? 1 : this.esgst.es.paginations.length);
      }
    }));
  }
}

export default GeneralScrollToBottomButton;