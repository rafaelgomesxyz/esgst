import Module from '../../class/Module';

class GeneralFixedSidebar extends Module {
  info = ({
    description: `
      <ul>
        <li>Keeps the sidebar of any page at the left side of the window while you scroll down the page.</li>
      </ul>
    `,
    id: `fs`,
    load: this.fs,
    name: `Fixed Sidebar`,
    sg: true,
    type: `general`
  });

  fs() {
    if (!this.esgst.sidebar) {
      return;
    }

    const top = this.esgst.pageTop + 25;
    this.esgst.style.insertAdjacentText(`beforeEnd`, `
      .esgst-fs {
        max-height: calc(100vh - ${top + 30 + (this.esgst.ff ? 39 : 0)}px);
        top: ${top}px;
      }

      .esgst-fs.stuck {
        height: calc(100vh - ${top + 30 + (this.esgst.ff ? 39 : 0)}px);
      }

      .sticky_sentinel--top {
        top: ${this.esgst.sidebar.offsetTop - top - 1}px;
      }
    `);

    this.esgst.sidebar.classList.add(`esgst-fs`, `sticky`);
  }
}

export default GeneralFixedSidebar;