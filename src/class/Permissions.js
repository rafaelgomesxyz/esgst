import { browser } from '../browser';
import { Popup } from './Popup';
import { shared } from './Shared';
import { ButtonSet } from './ButtonSet';

class Permissions {
  constructor() {
    this.permissions = {
      cookies: {
        messages: {
          manipulateCookies: ``
        },
        values: [`cookies`]
      },
      dropbox: {
        isOrigin: true,
        messages: {
          storage: `Required to back up / restore data to / from Dropbox.`
        },
        values: [`*://*.api.dropboxapi.com/*`, `*://*.content.dropboxapi.com/*`]
      },
      gitHub: {
        isOrigin: true,
        messages: {
          changelog: `Required to retrieve changelog.`
        },
        values: [`*://*.raw.githubusercontent.com/*`]
      },
      googleDrive: {
        isOrigin: true,
        messages: {
          storage: `Re`
        },
        values: [`*://*.googleapis.com/*`]
      },
      googleWebApp: {
        isOrigin: true,
        messages: {
          namwc: `Required by Not Activated / Multiple Wins Checker to see if the user received suspensions for their infractions.`,
          ncv: `Required to update the No CV Games database.`,
          sync: `Required to sync reduced / no CV games and HLTB times.`,
          uh: `Required by Username History to retrieve the username history of the user from the database and to retrieve the list of recent username changes.`,
          ust: `Required by User Suspension Tracker to send tickets to the database.`
        },
        values: [`*://*.script.google.com/*`, `*://*.script.googleusercontent.com/*`]
      },
      imgur: {
        isOrigin: true,
        messages: {
          cfh: `upload images`
        },
        values: [`*://*.api.imgur.com/*`]
      },
      isThereAnyDeal: {
        isOrigin: true,
        messages: {
          itadi: `Required by ITADI`
        },
        values: [`*://*.isthereanydeal.com/*`]
      },
      oneDrive: {
        isOrigin: true,
        messages: {
          storage: `r`
        },
        values: [`*://*.files.1drv.com/*`, `*://*.graph.microsoft.com/*`]
      },
      server: {
        isOrigin: true,
        messages: {
          gc: `Required by Game Categories to retrieve categories that need to be retrieved from Steam.`,
          sync: `This permission is required to sync reduced CV games.`
        },
        values: [`*://*.gsrafael01.me/*`]
      },
      revadike: {
        isOrigin: true,
        messages: {
          hgm: `yesyes`,
          mm: `yeye`,
          sync: `Sync owned hgm_s`
        },
        values: [`*://*.revadike.ga/*`]
      },
      steamApi: {
        isOrigin: true,
        messages: {
          glwc: ``,
          hwlc: ``,
          sync: `This permission is required to sync owned/wishlisted/ignored games.`,
          ugd: `This permission is required to retrieve the user's playtimes / achievement stats.`
        },
        values: [`*://*.api.steampowered.com/*`]
      },
      steamCommunity: {
        isOrigin: true,
        messages: {
          as: `Required by [id=as]`,
          glwc: `Required by [id=glwc]`,
          gs: `Required by Groups Stats`,
          sgc: `Required by Shared Group Checker to check which groups you have in common.`,
          sync: `This permission is required to sync followed games.`,
          ugs: `Required by [id=ugs] if "Check members" is enabled.`
        },
        values: [`*://*.steamcommunity.com/*`]
      },
      steamStore: {
        isOrigin: true,
        messages: {
          gc: `asas`,
          glwc: `wishlist`,
          hwlc: `get wishlist`,
          rcvc: `asdad`,
          sync: `This permission is required to sync owned/wishlisted/ignored games.`,
          ugd: `Packages`
        },
        values: [`*://*.store.steampowered.com/*`]
      },
      steamTracker: {
        isOrigin: true,
        messages: {
          sync: `This permission is required to sync delisted games.`
        },
        values: [`*://*.steam-tracker.com/*`]
      },
      userStyles: {
        isOrigin: true,
        messages: {
          settings: `Required to retrieve themes.`
        },
        values: [`*://*.userstyles.org/*`]
      }
    };
  }

  async contains(keys) {
    const { permissions, origins } = this.getValues(keys);
    const result = await browser.runtime.sendMessage({
      action: `permissions_contains`,
      permissions: JSON.stringify({ permissions, origins })
    });
    return result;
  }

  async request(keys) {
    const result = await this.contains(keys);
    if (result) {
      return result;
    }
    const { permissions, origins } = this.getValues(keys);
    return browser.runtime.sendMessage({
      action: `permissions_request`,
      permissions: JSON.stringify({ permissions, origins })
    });
  }

  remove(keys) {
    const { permissions, origins } = this.getValues(keys);
    return browser.runtime.sendMessage({
      action: `permissions_remove`,
      permissions: JSON.stringify({ permissions, origins })
    });
  }

  getValues(keys = []) {
    const permissions = [];
    const origins = [];
    for (const key of keys) {
      const permission = this.permissions[key];
      if (permission.isOrigin) {
        origins.push(...permission.values);
      } else {
        permissions.push(...permission.values);
      }
    }
    return { permissions, origins };
  }

  requestUi(keys, messageKey, isProgrammatic) {
    return new Promise(async resolve => {
      const result = await this.contains(keys);
      if (result) {
        resolve(result);
        return;
      }
      if (isProgrammatic) {
        new Popup({
          icon: `fa-lock`,
          isTemp: true,
          title: this.getMessage(keys, messageKey)
        }).open();
        resolve(false);
        return;
      }
      const popup = new Popup({
        icon: `fa-lock`,
        isTemp: true,
        title: `In order to perform this action, ESGST requires the permissions below. Click "Proceed" to decide if you want to grant them or not.`
      });
      for (const key of keys) {
        const permission = this.permissions[key];
        shared.common.createElements_v2(popup.scrollable, `beforeEnd`, [
          [`div`, [
            [`strong`, `${permission.values.join(`, `)}: `],
            permission.messages[messageKey]
          ]]
        ]);
      }
      popup.description.appendChild(new ButtonSet({
        color1: `grey`,
        color2: ``,
        icon1: `fa-arrow-circle-right`,
        icon2: ``,
        title1: `Proceed`,
        title2: ``,
        callback1: async () => {
          popup.close();
          resolve(await this.request(keys));
        }
      }).set);
      popup.onCloseByUser = () => resolve(false);
      popup.open();
    });
  }

  getMessage(keys, messageKey) {
    const { permissions, origins } = this.getValues(keys);
    return `${messageKey && shared.esgst.featuresById[messageKey] ? `${shared.esgst.featuresById[messageKey].name} says: ` : ``} No permission to perform this action. Please go to the "Permissions" section of the settings menu and grant the required permissions: ${permissions.concat(origins).join(`, `)}`;
  }
}

const permissions = new Permissions();

export { permissions };