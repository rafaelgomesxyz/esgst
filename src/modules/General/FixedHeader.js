_MODULES.push({
    description: `
      <ul>
        <li>Keeps the header of any page at the top of the window while you scroll down the page.</li>
      </ul>
    `,
    id: `fh`,
    load: fh,
    name: `Fixed Header`,
    sg: true,
    st: true,
    type: `general`
  });

  function fh() {
    if (!esgst.header) {
      return;
    }

    esgst.header.classList.add(`esgst-fh`);
    const height = esgst.header.offsetHeight;
    esgst.pageTop += height;
    esgst.commentsTop += height;
  }

