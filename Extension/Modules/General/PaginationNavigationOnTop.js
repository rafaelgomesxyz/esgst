_MODULES.push({
    description: `
      <ul>
        <li>Moves the pagination navigation of any page to the main page heading of the page.</li>
      </ul>
    `,
    id: `pnot`,
    load: pnot,
    name: `Pagination Navigation On Top`,
    sg: true,
    st: true,
    type: `general`
  });

  function pnot() {
    if (!esgst.paginationNavigation || !esgst.mainPageHeading) return;

    if (esgst.st) {
      esgst.paginationNavigation.classList.add(`page_heading_btn`);
    }
    esgst.paginationNavigation.title = getFeatureTooltip(`pnot`);
    esgst.mainPageHeading.appendChild(esgst.paginationNavigation);
  }

