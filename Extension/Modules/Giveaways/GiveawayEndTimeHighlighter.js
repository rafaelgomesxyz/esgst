_MODULES.push({
    description: `
      <ul>
        <li>Allows you to highlight the end time of a giveaway (in any page) by coloring it based on how many hours there are left.</li>
      </ul>
    `,
    id: `geth`,
    load: geth,
    name: `Giveaway End Time Highlighter`,
    sg: true,
    type: `giveaways`
  });

  function geth() {
    esgst.giveawayFeatures.push(geth_getGiveaways);
  }

  function geth_getGiveaways(giveaways) {
    if (!esgst.geth_colors.length) {
      return;
    }

    for (const giveaway of giveaways) {
      if (!giveaway.started) {
        continue;
      }

      const hoursLeft = (giveaway.endTime - Date.now()) / 3600000;
      for (let i = esgst.geth_colors.length - 1; i > -1; i--) {
        const colors = esgst.geth_colors[i];
        if (hoursLeft >= parseFloat(colors.lower) && hoursLeft <= parseFloat(colors.upper)) {
          (giveaway.endTimeColumn_gv || giveaway.endTimeColumn).style.color = colors.color;
          break;
        }
      }
    }
  }
  
