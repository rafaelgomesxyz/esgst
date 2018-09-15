import Module from '../../class/Module';

class UsersUserNotes extends Module {
info = ({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-sticky-note"></i> if there are notes saved and <i class="fa fa-sticky-note-o"></i> if there are not) next to a user's username (in their <a href="https://www.steamgifts.com/user/cg">profile</a> page) that allows you to save notes for them (only visible to you).</li>
        <li>You can press Ctrl + Enter to save the notes.</li>
        <li>This feature is recommended for cases where you want to associate a long text with a user, since the notes are not displayed in the page. For a short text, check [id=ut].</li>
      </ul>
    `,
    features: {
      un_p: {
        name: `Pop up when whitelisting/blacklisting a user.`,
        sg: true
      }
    },
    id: `un`,
    load: this.un,
    name: `User Notes`,
    sg: true,
    st: true,
    type: `users`
  });

  un() {
    this.esgst.profileFeatures.push(un_add);
  }

  un_add(profile, savedUser) {
    let blacklistButton, position, whitelistButton;
    if (this.esgst.sg) {
      position = `beforeEnd`;
      if (this.esgst.un_p) {
        whitelistButton = profile.steamButtonContainer.getElementsByClassName(`sidebar__shortcut__whitelist`)[0];
        if (whitelistButton) {
          whitelistButton.addEventListener(`click`, this.un_open.bind(null, profile));
        }
        blacklistButton = profile.steamButtonContainer.getElementsByClassName(`sidebar__shortcut__blacklist`)[0];
        if (blacklistButton) {
          blacklistButton.addEventListener(`click`, this.un_open.bind(null, profile));
        }
      }
    } else {
      position = `afterBegin`;
    }
    profile.unButton = this.esgst.modules.common.createElements(profile.heading, position, [{
      attributes: {
        class: `esgst-un-button`,
        title: this.esgst.modules.common.getFeatureTooltip(`un`, `Edit user notes`)
      },
      type: `a`,
      children: [{
        attributes: {
          class: `fa`
        },
        type: `i`
      }]
    }]);
    profile.unIcon = profile.unButton.firstElementChild;
    if (savedUser && savedUser.notes) {
      profile.unIcon.classList.add(`fa-sticky-note`);
    } else {
      profile.unIcon.classList.add(`fa-sticky-note-o`);
    }
    profile.unButton.addEventListener(`click`, this.un_open.bind(null, profile));
  }

  un_open(profile) {
    let set;
    profile.unPopup = new Popup(`fa-sticky-note`, [{
      text: `Edit user notes for `,
      type: `node`
    }, {
      text: profile.name,
      type: `span`
    }, {
      text: `:`,
      type: `node`
    }], true);
    profile.unTextArea = this.esgst.modules.common.createElements(profile.unPopup.scrollable, `beforeEnd`, [{
      type: `textarea`
    }]);
    set = new ButtonSet_v2({color1: `green`, color2: `grey`, icon1: `fa-check`, icon2: `fa-circle-o-notch fa-spin`, title1: `Save`, title2: `Saving...`, callback1: this.un_save.bind(null, profile)});
    profile.unTextArea.addEventListener(`keydown`, event => {
      if (event.ctrlKey && event.key === `Enter`) {
        set.trigger();
      }
    });
    profile.unPopup.description.appendChild(set.set);
    profile.unPopup.open(un_get.bind(null, profile));
  }

  async un_save(profile) {
    let notes = this.esgst.modules.common.removeDuplicateNotes(profile.unTextArea.value.trim());
    let user = {
      steamId: profile.steamId,
      id: profile.id,
      username: profile.username,
      values: {
        notes: notes
      }
    };
    if (notes) {
      profile.unIcon.classList.remove(`fa-sticky-note-o`);
      profile.unIcon.classList.add(`fa-sticky-note`);
    } else {
      profile.unIcon.classList.remove(`fa-sticky-note`);
      profile.unIcon.classList.add(`fa-sticky-note-o`);
    }
    await this.esgst.modules.common.saveUser(null, null, user);
    profile.unPopup.close();
  }

  async un_get(profile) {
    profile.unTextArea.focus();
    let savedUsers = JSON.parse(await getValue(`users`));
    let savedUser = savedUsers.users[profile.steamId];
    if (savedUser) {
      let notes = savedUser.notes;
      if (notes) {
        profile.unTextArea.value = notes;
      }
    }
  }
}

export default UsersUserNotes;