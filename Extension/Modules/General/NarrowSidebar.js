_MODULES.push({
    description: `
      <ul>
        <li>Keeps the sidebar narrowed in all pages.</li>
      </ul>
    `,
    id: `ns`,
    load: ns,
    name: `Narrow Sidebar`,
    sg: true,
    type: `general`
  });

  function ns() {
    if (!esgst.sidebar) return;
    esgst.sidebar.classList.remove(`sidebar--wide`);
    esgst.sidebar.classList.add(`esgst-ns`);
  }

