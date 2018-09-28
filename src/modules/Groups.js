import Module from '../class/Module';

class Groups extends Module {
  constructor() {
    super();
    this.info = {
      endless: true,
      id: `groups`,
      featureMap: {
        endless: `groups_load`
      }
    };
  }

  async groups_load(mainContext, main, source, endless) {
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
        const avatarImage = element.parentElement.previousElementSibling;
        const avatar = avatarImage.style.backgroundImage;
        savedGroup = this.esgst.groups.filter(group => avatar.match(group.avatar))[0];
      }
      const id = (match && match[1]) || (savedGroup && savedGroup.code);
      if (!id) {
        continue;
      }
      if (!this.esgst.currentGroups[id]) {
        this.esgst.currentGroups[id] = {
          elements: []
        };
        if (!savedGroup) {
          savedGroup = this.esgst.groups.filter(group => group.code === id)[0];
        }
        this.esgst.currentGroups[id].savedGroup = savedGroup
      }
      let j;
      for (j = this.esgst.currentGroups[id].elements.length - 1; j > -1 && this.esgst.currentGroups[id].elements[j] !== element; j--) {
      }
      if (j > -1) {
        continue;
      }
      const name = element.textContent.trim();
      const container = element.parentElement;
      const oldElement = element;
      if (this.esgst.groupPath && container.classList.contains(`page__heading__breadcrumbs`)) {
        element = document.getElementsByClassName(`featured__heading__medium`)[0];
      }
      this.esgst.currentGroups[id].elements.push(element);
      const context = element;
      this.esgst[main ? `mainGroups` : `popupGroups`].push({
        code: id,
        innerWrap: context,
        name,
        outerWrap: context
      });
      const isHeading = context.classList.contains(`featured__heading__medium`);
      const tagContainer = context.parentElement;
      groups.push({
        container: tagContainer,
        context,
        element,
        id,
        name,
        oldElement,
        saved: savedGroup,
        tagContext: isHeading ? tagContainer : context,
        tagPosition: isHeading ? `beforeEnd` : `afterEnd`
      });
    }
    for (const feature of this.esgst.groupFeatures) {
      await feature(groups, main, source, endless);
    }
  }
}

export default Groups;