import Module from '../../class/Module';

class GeneralScrollToTopButton extends Module {
  info = ({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-chevron-up"></i>) either to the bottom right corner, the main page heading or the footer (you can decide where) of any page that takes you to the top of the page.</li>
      </ul>
    `,
    id: `sttb`,
    load: this.sttb,
    name: `Scroll To Top Button`,
    options: {
      title: `Show in:`,
      values: [`Bottom Right Corner`, `Main Page Heading`, `Footer`]
    },
    sg: true,
    st: true,
    type: `general`
  });

  sttb() {
    let button;
    switch (this.esgst.sttb_index) {
      case 0:
        button = this.esgst.modules.common.createElements(document.body, `beforeEnd`, [{
          attributes: {
            class: `esgst-sttb-button esgst-sttb-button-fixed`,
            title: `${this.esgst.modules.common.getFeatureTooltip(`sttb`, `Scroll to top`)}`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-chevron-up`
            },
            type: `i`
          }]
        }]);
        button.classList.add(`esgst-hidden`);
        addEventListener(`scroll`, () => {
          if (scrollY > 100) {
            button.classList.remove(`esgst-hidden`);
          } else {
            button.classList.add(`esgst-hidden`);
          }
        });
        break;
      case 1:
        button = this.esgst.modules.common.createHeadingButton({id: `sttb`, icons: [`fa-chevron-up`], title: `Scroll to top`});
        button.classList.add(`esgst-sttb-button`);
        break;
      case 2:
        button = this.esgst.modules.common.createElements(this.esgst.footer.firstElementChild.lastElementChild, `beforeEnd`, [{
          attributes: {
            class: `esgst-sttb-button`,
            title: this.esgst.modules.common.getFeatureTooltip(`sttb`, `Scroll to top`)
          },
          type: this.esgst.sg ? `div` : `li`,
          children: [{
            attributes: {
              class: `fa fa-chevron-up`
            },
            type: `i`
          }]
        }]);
        break;
    }
    button.addEventListener(`click`, this.esgst.modules.common.animateScroll.bind(null, 0, () => {
      if (this.esgst.es && this.esgst.es.paginations) {
        this.esgst.modules.generalEndlessScrolling.es_changePagination(this.esgst.es, this.esgst.es.reverseScrolling ? this.esgst.es.paginations.length : 1);
      }
    }));
  }
}

export default GeneralScrollToTopButton;