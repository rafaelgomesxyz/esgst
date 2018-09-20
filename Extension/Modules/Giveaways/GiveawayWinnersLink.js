_MODULES.push({
    description: `
      <ul>
        <li>Adds a link next to an ended giveaway's "Entries" link (in any page) that shows how many winners the giveaway has and takes you to the giveaway's <a href="https://www.steamgifts.com/giveaway/aeqw7/dead-space/winners">winners</a> page.</li>
      </ul>
    `,
    id: `gwl`,
    load: gwl,
    name: `Giveaway Winners Link`,
    sg: true,
    type: `giveaways`
  });

  function gwl() {
    esgst.giveawayFeatures.push(gwl_addLinks);
  }

  function gwl_addLinks(giveaways, main) {
    if (((!esgst.createdPath && !esgst.enteredPath && !esgst.wonPath && !esgst.giveawayPath && !esgst.archivePath) || main) && (esgst.giveawayPath || esgst.createdPath || esgst.enteredPath || esgst.wonPath || esgst.archivePath)) return;
    giveaways.forEach(giveaway => {
      if (giveaway.innerWrap.getElementsByClassName(`esgst-gwl`)[0] || !giveaway.ended) return;
      const attributes = {
        class: `esgst-gwl`,
        [`data-draggable-id`]: `winners_count`
      };
      if (giveaway.url) {
        attributes.href = `${giveaway.url}/winners`;
      }
      createElements(giveaway.entriesLink, `afterEnd`, [{
        attributes,
        type: `a`,
        children: [{
          attributes: {
            class: `fa fa-trophy`
          },
          type: `i`
        }, {
          text: `${giveaway.winners} winners`,
          type: `span`
        }]
      }]);
    });
  }
  
