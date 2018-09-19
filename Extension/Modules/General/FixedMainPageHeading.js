_MODULES.push({
    description: `
      <ul>
        <li>Keeps the main page heading (usually the first heading of the page, for example, the heading that says "Giveaways" in the main page) of any page at the top of the window while you scroll down the page.</li>
      </ul>
    `,
    id: `fmph`,
    load: fmph,
    name: `Fixed Main Page Heading`,
    sg: true,
    st: true,
    type: `general`
  });

  function fmph() {
    if (!esgst.mainPageHeading) {
      return;
    }

    esgst.style.insertAdjacentText(`beforeEnd`, `
      .esgst-fmph {
        top: ${esgst.pageTop}px;
      }
    `);

    esgst.mainPageHeading.classList.add(`esgst-fmph`);
    const height = esgst.mainPageHeading.offsetHeight;
    esgst.commentsTop += height;
  }

