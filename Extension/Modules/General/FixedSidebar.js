_MODULES.push({
    description: `
      <ul>
        <li>Keeps the sidebar of any page at the left side of the window while you scroll down the page.</li>
      </ul>
    `,
    id: `fs`,
    load: fs,
    name: `Fixed Sidebar`,
    sg: true,
    type: `general`
  });

  function fs() {
    if (!esgst.sidebar) {
      return;
    }

    const top = esgst.pageTop + 25;
    esgst.style.insertAdjacentText(`beforeEnd`, `
      .esgst-fs {
        max-height: calc(100vh - ${top + 30 + (esgst.ff ? 39 : 0)}px);
        top: ${top}px;
      }

      .esgst-fs.stuck {
        height: calc(100vh - ${top + 30 + (esgst.ff ? 39 : 0)}px);
      }

      .sticky_sentinel--top {
        top: ${esgst.sidebar.offsetTop - top - 1}px;
      }
    `);

    esgst.sidebar.classList.add(`esgst-fs`, `sticky`);
  }

