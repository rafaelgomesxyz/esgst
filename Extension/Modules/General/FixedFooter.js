_MODULES.push({
    description: `
      <ul>
        <li>Keeps the footer of any page at the bottom of the window while you scroll down the page.</li>
      </ul>
    `,
    id: `ff`,
    load: ff,
    name: `Fixed Footer`,
    sg: true,
    st: true,
    type: `general`
  });

  function ff() {
    if (!esgst.footer) {
      return;
    }

    esgst.footer.classList.add(`esgst-ff`);
  }

