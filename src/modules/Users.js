import { Module } from '../class/Module';
import { gSettings } from '../class/Globals';
import { shared } from '../class/Shared';

class Users extends Module {
  constructor() {
    super();
    this.info = {
      endless: true,
      id: `users`,
      featureMap: {
        endless: this.users_load.bind(this)
      }
    };
  }

  async users_load(mainContext, main, source, endless) {
    const elements = mainContext.querySelectorAll(shared.common.getSelectors(endless, [
      `Xa[href*='/user/']`,
      `Xa[href*='/profiles/']`
    ]));
    if (!elements.length) {
      return;
    }
    let found = false;
    const users = [];
    for (let i = elements.length - 1; i > -1; i--) {
      let element = elements[i];
      const sg = (this.esgst.sg && !element.getAttribute(`data-st`)) || element.getAttribute(`data-sg`);
      let isSteamLink = false;
      let match = element.getAttribute(`href`).match(/\/user\/(.+)/);
      if (!match) {
        match = element.getAttribute(`href`).match(/\/profiles\/(.+)/);
        isSteamLink = true;
      }
      if (!match) {
        continue;
      }
      const id = isSteamLink ? element.textContent : match[1];
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
      for (j = this.esgst.currentUsers[id].elements.length - 1; j > -1 && this.esgst.currentUsers[id].elements[j] !== element; j--) {
      }
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

      const userObj = {
        code: id,
        innerWrap: context,
        outerWrap: context,
        sg
      };

      if (shared.esgst.groupPath) {
        const userRow = userObj.outerWrap.closest(`.table__column--width-fill`);
        if (userRow) {
          const sentRow = userRow.nextElementSibling;
          const receivedRow = sentRow.nextElementSibling;
          const giftDifferenceRow = receivedRow.nextElementSibling;
          const valueDifferenceRow = giftDifferenceRow.nextElementSibling;
          const sentMatch = sentRow.textContent.trim().match(/(.+?)\s\((.+?)\)/);
          const receivedMatch = receivedRow.textContent.trim().match(/(.+?)\s\((.+?)\)/);
          userObj.sentCount = sentMatch[1];
          userObj.sentValue = sentMatch[2];
          userObj.receivedCount = receivedMatch[1];
          userObj.receivedValue = receivedMatch[2];
          userObj.giftDifference = giftDifferenceRow.textContent.trim();
          userObj.valueDifference = valueDifferenceRow.textContent.trim();
        }
      }

      this.esgst.currentScope.users.push(userObj);
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
      if (this.esgst.uscButton && mainContext === document && !this.esgst.aboutPath) {
        this.esgst.uscButton.classList.remove(`esgst-hidden`);
        this.esgst.uscButton.parentElement.classList.remove(`esgst-hidden`);
      }
      if (gSettings.mm_enableUsers && this.esgst.mm_enable) {
        this.esgst.mm_enable(this.esgst.currentScope.users, `Users`);
      }
    }
  }
}

const usersModule = new Users();

export { usersModule };