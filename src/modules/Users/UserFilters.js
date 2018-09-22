import Module from '../../class/Module';
import {common} from '../Common';
import Popup from "../../class/Popup";
import ToggleSwitch from "../../class/ToggleSwitch";
import ButtonSet_v2 from "../../class/ButtonSet_v2";

const
  {
    createElements,
    getFeatureTooltip,
    saveUser
  } = common
;

class UsersUserFilters extends Module {
info = ({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-eye-slash"></i> if the user is being filtered and <i class="fa fa-eye"></i> if they are not) next to a user's username (in their <a href="https://www.steamgifts.com/user/cg">profile</a> page) that allows you to hide their discussions, giveaways and posts (each one can be hidden separately).</li>
        <li>Adds a text in parenthesis to the pagination of the page showing how many users in the page are being filtered by the filters.</li>
        <li>Adds a button (<i class="fa fa-user"></i> <i class="fa fa-eye-slash"></i>) to the page heading of this menu that allows you to view all of the users that have been filtered.</li>
      </ul>
    `,
    features: {
      uf_d: {
        name: `Automatically hide discussions from blacklisted users.`,
        sg: true
      },
      uf_g: {
        name: `Automatically hide giveaways from blacklisted users.`,
        sg: true
      },
      uf_p: {
        name: `Automatically hide posts from blacklisted users.`,
        sg: true
      }
    },
    id: `uf`,
    load: this.uf,
    name: `User Filters`,
    sg: true,
    type: `users`
  });

  uf() {
    this.esgst.profileFeatures.push(this.uf_add);
  }

  uf_add(profile, savedUser) {
    if (profile.username !== this.esgst.username) {
      profile.ufButton = createElements(profile.heading, `beforeEnd`, [{
        attributes: {
          class: `esgst-uf-button`,
          title: getFeatureTooltip(`uf`, `Edit user filters`)
        },
        type: `a`,
        children: [{
          attributes: {
            class: `fa`
          },
          type: `i`
        }]
      }]);
      profile.ufIcon = profile.ufButton.firstElementChild;
      if (savedUser) {
        profile.ufValues = savedUser.uf;
        if (profile.ufValues && (profile.ufValues.giveaways || profile.ufValues.discussions || profile.ufValues.posts)) {
          profile.ufIcon.classList.add(`fa-eye-slash`);
        } else {
          profile.ufIcon.classList.add(`fa-eye`);
          profile.ufValues = {
            giveaways: false,
            discussions: false,
            posts: false
          };
        }
      } else {
        profile.ufIcon.classList.add(`fa-eye`);
        profile.ufValues = {
          giveaways: false,
          discussions: false,
          posts: false
        };
      }
      profile.ufButton.addEventListener(`click`, this.uf_open.bind(null, profile));
    }
  }

  uf_open(profile) {
    let resetSet, saveSet;
    profile.ufPopup = new Popup(`fa-eye`, [{
      text: `Apply user filters for `,
      type: `node`
    }, {
      text: profile.name,
      type: `span`
    }, {
      text: `:`,
      type: `node`
    }], true);
    profile.ufOptions = createElements(profile.ufPopup.description, `beforeEnd`, [{
      type: `div`
    }]);
    profile.ufGiveawaysOption = new ToggleSwitch(profile.ufOptions, null, false, `Filter this user's giveaways.`, false, false, `Hides the user's giveaways from the main pages.`, profile.ufValues.giveaways);
    profile.ufDiscussionsOption = new ToggleSwitch(profile.ufOptions, null, false, `Filter this user's discussions.`, false, false, `Hides the user's discussions from the main pages.`, profile.ufValues.discussions);
    profile.ufPostsOption = new ToggleSwitch(profile.ufOptions, null, false, `Filter this user's posts.`, false, false, `Hides the user's posts everywhere.`, profile.ufValues.posts);
    saveSet = new ButtonSet_v2({color1: `green`, color2: `grey`, icon1: `fa-check`, icon2: `fa-circle-o-notch fa-spin`, title1: `Save Settings`, title2: `Saving...`, callback1: this.uf_save.bind(null, profile, false)});
    resetSet = new ButtonSet_v2({color1: `green`, color2: `grey`, icon1: `fa-rotate-left`, icon2: `fa-circle-o-notch fa-spin`, title1: `Reset Settings`, title2: `Resetting...`, callback1: this.uf_save.bind(null, profile, true)});
    saveSet.dependencies.push(resetSet.set);
    resetSet.dependencies.push(saveSet.set);
    profile.ufPopup.description.appendChild(saveSet.set);
    profile.ufPopup.description.appendChild(resetSet.set);
    profile.ufPopup.open();
  }

  async uf_save(profile, reset) {
    let user;
    if (reset) {
      profile.ufGiveawaysOption.input.checked = false;
      profile.ufDiscussionsOption.input.checked = false;
      profile.ufPostsOption.input.checked = false;
      profile.ufValues = {
        giveaways: false,
        discussions: false,
        posts: false
      };
    } else {
      profile.ufValues = {
        giveaways: profile.ufGiveawaysOption.input.checked,
        discussions: profile.ufDiscussionsOption.input.checked,
        posts: profile.ufPostsOption.input.checked
      };
    }
    user = {
      steamId: profile.steamId,
      id: profile.id,
      username: profile.username,
      values: {
        uf: profile.ufValues
      }
    };
    if (profile.ufValues && (profile.ufValues.giveaways || profile.ufValues.discussions || profile.ufValues.posts)) {
      profile.ufIcon.classList.remove(`fa-eye`);
      profile.ufIcon.classList.add(`fa-eye-slash`);
    } else {
      profile.ufIcon.classList.remove(`fa-eye-slash`);
      profile.ufIcon.classList.add(`fa-eye`);
    }
    await saveUser(null, null, user);
    profile.ufPopup.close();
  }

  uf_updateCount(context, extraCount) {
    let count;
    count = context.getElementsByClassName(`esgst-uf-count`)[0];
    context = context.firstElementChild;
    if (!extraCount) {
      extraCount = 0;
    }
    if (count) {
      createElements(count, `inner`, [{
        text: `(`,
        type: `node`
      }, {
        attributes: {
          class: `esgst-bold`
        },
        text: parseInt(count.firstElementChild.textContent) + 1 + extraCount,
        type: `span`
      }, {
        text: ` filtered by User Filters)`,
        type: `node`
      }]);
    } else {
      createElements(context, `beforeEnd`, [{
        attributes: {
          class: `esgst-uf-count`
        },
        type: `span`,
        children: [{
          text: `(`,
          type: `node`
        }, {
          attributes: {
            class: `esgst-bold`
          },
          text: `${1 + extraCount}`,
          type: `span`
        }, {
          text: ` filtered by User Filters`,
          type: `node`
        }]
      }]);
    }
  }
}

export default UsersUserFilters;