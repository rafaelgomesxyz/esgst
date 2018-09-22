import Module from '../class/Module';
import {common} from './Common';

const
  {
    checkUsernameChange,
    updateWhitelistBlacklist,
    saveUser
  } = common
;

class Profile extends Module {
  info = ({
    endless: true,
    id: `profile`,
    load: this.profile
  });

  async profile() {
    if (!this.esgst.userPath) return;
    await this.profile_load(document);
  }

  async profile_load(context) {
    let element, elements, i, input, key, match, profile, rows;
    profile = {};
    if (this.esgst.sg) {
      profile.heading = context.getElementsByClassName(`featured__heading`)[0];
      input = context.querySelector(`[name="child_user_id"]`);
      if (input) {
        profile.id = input.value;
      } else {
        profile.id = ``;
      }
      profile.username = profile.heading.textContent.replace(/\s[\s\S]*/, ``);
      profile.steamButtonContainer = context.getElementsByClassName(`sidebar__shortcut-outer-wrap`)[0];
      profile.steamButton = profile.steamButtonContainer.querySelector(`[href*="/profiles/"]`);
      profile.steamId = profile.steamButton.getAttribute(`href`).match(/\d+/)[0];
      profile.name = profile.username;
    } else {
      profile.heading = this.esgst.mainPageHeading;
      profile.id = ``;
      profile.username = ``;
      profile.steamButtonContainer = context.getElementsByClassName(`profile_links`)[0];
      profile.steamButton = profile.steamButtonContainer.querySelector(`[href*="/profiles/"]`);
      profile.steamId = profile.steamButton.getAttribute(`href`).match(/\d+/)[0];
      profile.name = profile.steamId;
    }
    elements = context.getElementsByClassName(`featured__table__row__left`);
    for (i = elements.length - 1; i >= 0; --i) {
      element = elements[i];
      match = element.textContent.match(/(Comments|Gifts (Won|Sent)|Contributor Level)/);
      if (match) {
        key = match[2];
        if (key) {
          if (key === `Won`) {
            profile.wonRow = element.parentElement;
            profile.wonRowLeft = element;
            profile.wonRowRight = element.nextElementSibling;
            rows = JSON.parse(profile.wonRowRight.firstElementChild.firstElementChild.getAttribute(`data-ui-tooltip`)).rows;
            profile.wonCount = parseInt(rows[0].columns[1].name.replace(/,/g, ``));
            profile.wonFull = parseInt(rows[1].columns[1].name.replace(/,/g, ``));
            profile.wonReduced = parseInt(rows[2].columns[1].name.replace(/,/g, ``));
            profile.wonZero = parseInt(rows[3].columns[1].name.replace(/,/g, ``));
            profile.notWon = parseInt(rows[4].columns[1].name.replace(/,/g, ``));
            profile.wonNotReceived = profile.notWon;
            profile.wonCvContainer = profile.wonRowRight.firstElementChild.lastElementChild;
            rows = JSON.parse(profile.wonCvContainer.getAttribute(`data-ui-tooltip`)).rows;
            profile.wonCV = parseFloat(profile.wonCvContainer.textContent.replace(/\$|,/g, ``));
            profile.realWonCV = parseFloat(rows[0].columns[1].name.replace(/\$|,/g, ``));
          } else {
            profile.sentRow = element.parentElement;
            profile.sentRowLeft = element;
            profile.sentRowRight = element.nextElementSibling;
            rows = JSON.parse(profile.sentRowRight.firstElementChild.firstElementChild.getAttribute(`data-ui-tooltip`)).rows;
            profile.sentCount = parseInt(rows[0].columns[1].name.replace(/,/g, ``));
            profile.sentFull = parseInt(rows[1].columns[1].name.replace(/,/g, ``));
            profile.sentReduced = parseInt(rows[2].columns[1].name.replace(/,/g, ``));
            profile.sentZero = parseInt(rows[3].columns[1].name.replace(/,/g, ``));
            profile.notSent = parseInt(rows[5].columns[1].name.replace(/,/g, ``));
            profile.sentNotReceived = profile.notSent;
            profile.sentCvContainer = profile.sentRowRight.firstElementChild.lastElementChild;
            rows = JSON.parse(profile.sentCvContainer.getAttribute(`data-ui-tooltip`)).rows;
            profile.sentCV = parseFloat(profile.sentCvContainer.textContent.replace(/\$|,/g, ``));
            profile.realSentCV = parseFloat(rows[0].columns[1].name.replace(/\$|,/g, ``));
          }
        } else if (match[1] === `Comments`) {
          profile.commentsRow = element.parentElement;
        } else {
          profile.levelRow = element.parentElement;
          profile.levelRowLeft = element;
          profile.levelRowRight = element.nextElementSibling;
          rows = JSON.parse(profile.levelRowRight.firstElementChild.getAttribute(`data-ui-tooltip`)).rows;
          profile.level = parseFloat(rows[0].columns[1].name);
        }
      }
    }
    profile.whitelistButton = profile.steamButtonContainer.getElementsByClassName(`sidebar__shortcut__whitelist`)[0];
    profile.blacklistButton = profile.steamButtonContainer.getElementsByClassName(`sidebar__shortcut__blacklist`)[0];
    if (profile.whitelistButton) {
      if (this.esgst.updateWhitelistBlacklist) {
        profile.whitelistButton.addEventListener(`click`, updateWhitelistBlacklist.bind(null, `whitelisted`, profile));
      }
    }
    if (profile.blacklistButton) {
      if (this.esgst.updateWhitelistBlacklist) {
        profile.blacklistButton.addEventListener(`click`, updateWhitelistBlacklist.bind(null, `blacklisted`, profile));
      }
    }
    let savedUser = this.esgst.users.users[profile.steamId];
    if (savedUser) {
      const user = {
        steamId: profile.steamId,
        username: profile.username,
        values: {}
      };
      if (checkUsernameChange(this.esgst.users, user)) {
        await saveUser(null, this.esgst.users, user);
        savedUser = this.esgst.users.users[profile.steamId];
      }
    }
    for (const feature of this.esgst.profileFeatures) {
      try {
        await feature(profile, savedUser);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export default Profile;