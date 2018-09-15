_MODULES.push({
    endless: true,
    id: `discussionPanels`,
    load: discussionPanels
  });

  function discussionPanels() {
    if ((esgst.ct && (esgst.giveawaysPath || esgst.discussionsPath)) || (esgst.gdttt && (esgst.giveawaysPath || esgst.discussionsPath || esgst.discussionsTicketsTradesPath)) || (esgst.ust && esgst.ticketsPath)) {
      esgst.endlessFeatures.push(ct_addDiscussionPanels);
    }
  }

