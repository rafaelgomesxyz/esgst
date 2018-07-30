_MODULES.push({
    endless: true,
    id: `giveaways_addToStorage`,
    load: giveaways_addToStorage
  });
  
  function giveaways_addToStorage() {
    if ((esgst.lpv || esgst.cewgd || (esgst.gc && esgst.gc_gi)) && esgst.giveawayPath && document.referrer === `https://www.steamgifts.com/giveaways/new`) {
      addGiveawayToStorage();
    }
  }

