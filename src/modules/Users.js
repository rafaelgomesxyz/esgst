import Module from '../class/Module';

class Users extends Module {
  info = ({
    endless: true,
    id: `users`,
    load: this.users
  });

  users() {
    this.esgst.endlessFeatures.push(this.users_load);
  }

  async users_load(mainContext, main, source, endless) {
    const elements = mainContext.querySelectorAll(`${endless ? `.esgst-es-page-${endless} a[href*='/user/'], .esgst-es-page-${endless}a[href*='/user/']` : `a[href*='/user/']`}`);
    if (!elements.length) {
      return;
    }
    let found = false;
    const users = [];
    for (let i = elements.length - 1; i > -1; i--) {
      let element = elements[i];
      const sg = (this.esgst.sg && !element.getAttribute(`data-st`)) || element.getAttribute(`data-sg`);
      const match = element.getAttribute(`href`).match(/\/user\/(.+)/);
      if (!match) {
        continue;
      }
      const id = match[1];
      if (((!sg || element.textContent !== id) && (sg || !element.textContent || element.children.length)) || element.closest(`.markdown`)) {
        continue;
      }
      if (!this.esgst.currentUsers[id]) {
        this.esgst.currentUsers[id] = {
          elements: []
        };
        const steamId = sg ? this.esgst.users.steamIds[id] : id;
        this.esgst.currentUsers[id].savedUser = this.esgst.users.users[steamId];
        if (this.esgst.currentUsers[id].savedUser) {
          this.esgst.currentUsers[id].steamId = steamId;
        }
      }
      let j;
      for (j = this.esgst.currentUsers[id].elements.length - 1; j > -1 && this.esgst.currentUsers[id].elements[j] !== element; j--) {}
      if (j > -1) {
        continue;
      }
      const savedUser = this.esgst.currentUsers[id].savedUser;
      const container = element.parentElement;
      const oldElement = element;
      if (this.esgst.userPath && container.classList.contains(`page__heading__breadcrumbs`)) {
        element = document.getElementsByClassName(`featured__heading__medium`)[0];        
      }
      this.esgst.currentUsers[id].elements.push(element);
      const context = container.classList.contains(`comment__username`) ? container : element;
      this.esgst[main ? `mainUsers` : `popupUsers`].push({
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
    for (const feature of this.esgst.userFeatures) {
      await feature(users, main, source, endless);
    }
    if (found) {
      if (this.esgst.wbcButton && mainContext === document && !this.esgst.aboutPath) {
        this.esgst.wbcButton.classList.remove(`esgst-hidden`);
        this.esgst.wbcButton.parentElement.classList.remove(`esgst-hidden`);
      }
      if (this.esgst.mm_enableUsers && this.esgst.mm_enable) {
        this.esgst.mm_enable(this.esgst[main ? `mainUsers` : `popupUsers`], `Users`);
      }
    }
  }
}

export default Users;