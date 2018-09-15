_MODULES.push({
  endless: true,
  id: `users`,
  load: users
});

function users() {
  esgst.endlessFeatures.push(users_load);
}

async function users_load(mainContext, main, source, endless) {
  const elements = mainContext.querySelectorAll(`${endless ? `.esgst-es-page-${endless} a[href*='/user/'], .esgst-es-page-${endless}a[href*='/user/']` : `a[href*='/user/']`}`);
  if (!elements.length) {
    return;
  }
  let found = false;
  const users = [];
  for (let i = elements.length - 1; i > -1; i--) {
    let element = elements[i];
    const sg = (esgst.sg && !element.getAttribute(`data-st`)) || element.getAttribute(`data-sg`);
    const match = element.getAttribute(`href`).match(/\/user\/(.+)/);
    if (!match) {
      continue;
    }
    const id = match[1];
    if (((!sg || element.textContent !== id) && (sg || !element.textContent || element.children.length)) || element.closest(`.markdown`)) {
      continue;
    }
    if (!esgst.currentUsers[id]) {
      esgst.currentUsers[id] = {
        elements: []
      };
      const steamId = sg ? esgst.users.steamIds[id] : id;
      esgst.currentUsers[id].savedUser = esgst.users.users[steamId];
      if (esgst.currentUsers[id].savedUser) {
        esgst.currentUsers[id].steamId = steamId;
      }
    }
    let j;
    for (j = esgst.currentUsers[id].elements.length - 1; j > -1 && esgst.currentUsers[id].elements[j] !== element; j--);
    if (j > -1) {
      continue;
    }
    const savedUser = esgst.currentUsers[id].savedUser;
    const container = element.parentElement;
    const oldElement = element;
    if (esgst.userPath && container.classList.contains(`page__heading__breadcrumbs`)) {
      element = document.getElementsByClassName(`featured__heading__medium`)[0];        
    }
    esgst.currentUsers[id].elements.push(element);
    const context = container.classList.contains(`comment__username`) ? container : element;
    esgst[main ? `mainUsers` : `popupUsers`].push({
      code: id,
      innerWrap: context,
      outerWrap: context,
      sg
    });
    if (!found) {
      found = true;
    }
    const isHeading = context.classList.contains(`featured__heading__medium`);
    const tagContainer = context.parentElement;
    let tagContext = context;
    if (tagContainer.classList.contains(`comment__username`)) {
      tagContext = tagContainer;
    }
    users.push({
      container: tagContainer,
      context,
      element,
      id,
      oldElement,
      saved: savedUser,
      steamId: sg ? savedUser && savedUser.steamId : id,
      tagContext: isHeading ? tagContainer : tagContext,
      tagPosition: isHeading ? `beforeEnd` : `afterEnd`,
      username: sg ? id : savedUser && savedUser.username
    });
  }
  for (const feature of esgst.userFeatures) {
    await feature(users, main, source, endless);
  }
  if (found) {
    if (esgst.wbcButton && mainContext === document && !esgst.aboutPath) {
      esgst.wbcButton.classList.remove(`esgst-hidden`);
      esgst.wbcButton.parentElement.classList.remove(`esgst-hidden`);
    }
    if (esgst.mm_enableUsers && esgst.mm_enable) {
      esgst.mm_enable(esgst[main ? `mainUsers` : `popupUsers`], `Users`);
    }
  }
}