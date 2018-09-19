_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-chevron-up"></i>) either to the bottom right corner, the main page heading or the footer (you can decide where) of any page that takes you to the top of the page.</li>
      </ul>
    `,
    id: `sttb`,
    load: sttb,
    name: `Scroll To Top Button`,
    options: {
      title: `Show in:`,
      values: [`Bottom Right Corner`, `Main Page Heading`, `Footer`]
    },
    sg: true,
    st: true,
    type: `general`
  });

  function sttb() {
    let button;
    switch (esgst.sttb_index) {
      case 0:
        button = createElements(document.body, `beforeEnd`, [{
          attributes: {
            class: `esgst-sttb-button esgst-sttb-button-fixed`,
            title: `${getFeatureTooltip(`sttb`, `Scroll to top`)}`
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
        button = createHeadingButton({id: `sttb`, icons: [`fa-chevron-up`], title: `Scroll to top`});
        button.classList.add(`esgst-sttb-button`);
        break;
      case 2:
        button = createElements(esgst.footer.firstElementChild.lastElementChild, `beforeEnd`, [{
          attributes: {
            class: `esgst-sttb-button`,
            title: getFeatureTooltip(`sttb`, `Scroll to top`)
          },
          type: esgst.sg ? `div` : `li`,
          children: [{
            attributes: {
              class: `fa fa-chevron-up`
            },
            type: `i`
          }]
        }]);
        break;
    }
    button.addEventListener(`click`, animateScroll.bind(null, 0, () => {
      if (esgst.es && esgst.es.paginations) {
        es_changePagination(esgst.es, esgst.es.reverseScrolling ? esgst.es.paginations.length : 1);
      }
    }));
  }

