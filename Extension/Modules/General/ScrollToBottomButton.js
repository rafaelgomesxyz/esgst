_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-chevron-down"></i>) either to the bottom right corner, the main page heading or the footer (you can decide where) of any page that takes you to the bottom of the page.</li>
      </ul>
    `,
    id: `stbb`,
    load: stbb,
    name: `Scroll To Bottom Button`,
    options: {
      title: `Show in:`,
      values: [`Bottom Right Corner`, `Main Page Heading`, `Footer`]
    },
    sg: true,
    st: true,
    type: `general`
  });

  function stbb() {
    let button;
    switch (esgst.stbb_index) {
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
        addEventListener(`scroll`, () => {
          if (document.documentElement.offsetHeight -  innerHeight >=  scrollY + 100) {
            button.classList.remove(`esgst-hidden`);
          } else {
            button.classList.add(`esgst-hidden`);
          }
        });
        break;
      case 1:
        button = createHeadingButton({id: `stbb`, icons: [`fa-chevron-down`], title: `Scroll to bottom`});
        button.classList.add(`esgst-stbb-button`);
        break;
      case 2:
        button = createElements(esgst.footer.firstElementChild.lastElementChild, `beforeEnd`, [{
          attributes: {
            class: `esgst-stbb-button`,
            title: getFeatureTooltip(`stbb`, `Scroll to bottom`)
          },
          type: esgst.sg ? `div` : `li`,
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
      if (esgst.es && esgst.es.paginations) {
        es_changePagination(esgst.es, esgst.es.reverseScrolling ? 1 : esgst.es.paginations.length);
      }
    }));
  }

