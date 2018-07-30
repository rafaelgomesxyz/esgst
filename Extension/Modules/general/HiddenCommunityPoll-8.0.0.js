_MODULES.push({
    description: `
      <ul>
        <li>Hides the community poll (if there is one) of the main page.</li>
      </ul>
    `,
    features: {
      hcp_v: {
        name: `Only hide the poll if you already voted in it.`,
        sg: true
      }
    },
    id: `hcp`,
    load: hcp,
    name: `Hidden Community Poll`,
    sg: true,
    type: `general`
  });

  function hcp() {
    if (!esgst.giveawaysPath || !esgst.activeDiscussions) return;
    let poll = esgst.activeDiscussions.previousElementSibling;
    if (poll && poll.classList.contains(`widget-container`)) {
      if (!esgst.hcp_v || poll.querySelector(`.table__row-outer-wrap.is-selected`)) {
        poll.classList.add(`esgst-hidden`);
      }
    }
  }

