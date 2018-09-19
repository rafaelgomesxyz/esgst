_MODULES.push({
  endless: true,
  id: `groups`,
  load: groups
});

function groups() {
  esgst.endlessFeatures.push(groups_load);
}

async function groups_load(mainContext, main, source, endless) {
  const elements = mainContext.querySelectorAll(`${endless ? `.esgst-es-page-${endless} a[href*='/group/'], .esgst-es-page-${endless}a[href*='/group/']` : `a[href*='/group/']`}, .form_list_item_summary_name`);
  if (!elements.length) {
    return;
  }
  const groups = [];
  for (let i = elements.length - 1; i > -1; i--) {
    let element = elements[i];
    let match = null;
    if (element.getAttribute(`href`)) {
      match = element.getAttribute(`href`).match(/\/group\/(.+?)\//);
      if (!match) {
        continue;
      }
    }
    if (!element.textContent || element.children.length || element.closest(`.markdown`)) {
      continue;
    }
    let savedGroup = null;
    if (!match) {
      const avatar = element.parentElement.previousElementSibling.style.backgroundImage;
      savedGroup = esgst.groups.filter(group => avatar.match(group.avatar))[0];
    }
    const id = (match && match[1]) || (savedGroup && savedGroup.code);
    if (!id) {
      continue;
    }
    if (!esgst.currentGroups[id]) {
      esgst.currentGroups[id] = {
        elements: []
      };
      if (!savedGroup) {
        savedGroup = esgst.groups.filter(group => group.code === id)[0];
      }
      esgst.currentGroups[id].savedGroup = savedGroup
    }
    let j;
    for (j = esgst.currentGroups[id].elements.length - 1; j > -1 && esgst.currentGroups[id].elements[j] !== element; j--);
    if (j > -1) {
      continue;
    }
    const name = element.textContent.trim();
    const container = element.parentElement;
    const oldElement = element;
    if (esgst.groupPath && container.classList.contains(`page__heading__breadcrumbs`)) {
      element = document.getElementsByClassName(`featured__heading__medium`)[0];        
    }
    esgst.currentGroups[id].elements.push(element);
    const context = element;
    esgst[main ? `mainGroups` : `popupGroups`].push({
      code: id,
      innerWrap: context,
      name,
      outerWrap: context
    });
    const isHeading = context.classList.contains(`featured__heading__medium`);
    const tagContainer = context.parentElement;
    let tagContext = context;
    groups.push({
      container: tagContainer,
      context,
      element,
      id,
      name,
      oldElement,
      saved: savedGroup,
      tagContext: isHeading ? tagContainer : tagContext,
      tagPosition: isHeading ? `beforeEnd` : `afterEnd`
    });
  }
  for (const feature of esgst.groupFeatures) {
    await feature(groups, main, source, endless);
  }
}