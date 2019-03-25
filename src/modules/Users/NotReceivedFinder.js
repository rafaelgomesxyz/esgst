import { Module } from '../../class/Module';
import { Process } from '../../class/Process';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';

const
  parseHtml = utils.parseHtml.bind(utils),
  createElements = common.createElements.bind(common),
  endless_load = common.endless_load.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  getUser = common.getUser.bind(common),
  saveUser = common.saveUser.bind(common)
  ;

class UsersNotReceivedFinder extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-times-circle` }],
            `) to the "Gifts Won" and "Gifts Sent" rows of a user's `,
            [`a`, { href: `https://www.steamgifts.com/user/cg` }, `profile`],
            ` page that allows you to find all of their won/created giveaways that were marked as not received.`
          ]],
          [`li`, `Giveaways for more than 3 copies that were marked as not received can only be found if the winner(s) that marked it as not received is(are) visible in the creator's profile page or if you can access the giveaway and the option to search inside of giveaways is enabled. If they are not found, a list with all of the creator's giveaways for more than 3 copies will be shown.`],
          [`li`, `Results are cached for 1 week, so if you check the same user again within that timeframe, their status will not change.`]
        ]]
      ],
      id: `nrf`,
      load: this.nrf,
      name: `Not Received Finder`,
      sg: true,
      type: `users`
    };
  }

  nrf() {
    this.esgst.profileFeatures.push(this.nrf_add.bind(this, `won`));
    this.esgst.profileFeatures.push(this.nrf_add.bind(this, `sent`));
  }

  nrf_add(key, profile) {
    if (profile[`${key}NotReceived`] < 1) {
      return;
    }
    const button = createElements(profile[`${key}RowLeft`], `beforeEnd`, [{
      attributes: {
        class: `esgst-nrf-button`
      },
      type: `span`,
      children: [{
        attributes: {
          class: `fa fa-times-circle`,
          title: getFeatureTooltip(`nrf`, `Find not received giveaways`)
        },
        type: `i`
      }]
    }]);
    new Process({
      button,
      init: this.nrf_init.bind(this, key, profile),
      popup: {
        addProgress: true,
        addScrollable: `left`,
        icon: `fa-times`,
        options: [{
          check: key === `sent`,
          description: `Also search inside giveaways with multiple copies.`,
          id: `nrf_searchMultiple`,
          tooltip: `If disabled, only giveaways with visible not received copies will be found (faster).`
        }, {
          check: true,
          description: `Clear cache.`,
          id: `nrf_clearCache`,
          tooltip: `If enabled, the cache for this user will be cleared (slower).`
        }],
        title: `Find ${profile.username}'s not received giveaways:`
      },
      requests: [{
        url: key === `sent` ? `/user/${profile.username}/search?page=` : `/user/${profile.username}/giveaways/won/search?page=`,
        onDone: this.nrf_onRequestDone.bind(this),
        request: this.nrf_request.bind(this),
        user: true,
        [key === `sent` ? `sourceUser` : `sourceUserWon`]: true
      }]
    });
  }

  async nrf_init(key, profile, obj) {
    if (profile.username !== this.esgst.username && !obj.nrfMessage) {
      obj.nrfMessage = createElements(obj.popup.scrollable, `beforeBegin`, [{
        attributes: {
          class: `esgst-description`
        },
        text: `If you're blacklisted / not whitelisted / not a member of the same Steam groups, not all giveaways will be found.`,
        type: `div`
      }]);
    }
    obj.nrfUser = {
      steamId: profile.steamId,
      id: profile.id,
      username: profile.username
    };
    const savedUser = await getUser(null, obj.nrfUser);
    if (savedUser) {
      obj.nrfData = savedUser[`nrf${key === `sent` ? `` : `Won`}`];
    }
    if (this.esgst.nrf_clearCache || !obj.nrfData) {
      obj.nrfData = {
        lastCheck: 0,
        found: 0,
        total: 0,
        results: ``
      };
    }
    obj.nrfResults = obj.popup.getScrollable();
    if ((Date.now() - obj.nrfData.lastCheck) > 604800000) {
      obj.nrfFound = 0;
      obj.nrfKey = key;
      obj.nrfMultiple = 0;
      obj.nrfResultsRaw = ``;
      obj.nrfUsername = obj.nrfUser.username;
      obj.nrfTotal = profile[`${key}NotReceived`];
      obj.onDone = this.nrf_onDone;
      /**
       * @property {object[]} obj.requestsBackup
       */
      obj.requests = obj.requestsBackup;
    } else {
      obj.onDone = null;
      obj.requests = [];
      createElements(obj.nrfResults, `inner`, [...(Array.from(parseHtml(obj.nrfData.results).body.childNodes).map(x => {
        return {
          context: x
        };
      }))]);
      createElements(obj.popup.overallProgress, `inner`, [{
        text: `${obj.nrfData.found} of ${obj.nrfData.total} not received giveaways found...`,
        type: `node`
      }]);
      await endless_load(obj.nrfResults);
    }
  }

  nrf_request(obj, details, response, responseHtml) {
    obj.popup.setProgress(`Searching ${obj.nrfUsername}'s giveaways (page ${details.nextPage}${details.lastPage})...`);
    const elements = responseHtml.querySelectorAll(`div.giveaway__column--negative`);
    for (const element of elements) {
      obj.nrfFound += element.querySelectorAll(`a[href*="/user/"]`).length;
      const giveaway = element.closest(`.giveaway__row-outer-wrap`).cloneNode(true);
      obj.nrfResults.appendChild(giveaway);
      obj.nrfResultsRaw += giveaway.outerHTML;
    }
    obj.popup.setOverallProgress(`${obj.nrfFound} of ${obj.nrfTotal} not received giveaways found...`);
    if (this.esgst.nrf_searchMultiple && obj.nrfKey === `sent` && obj.nrfFound < obj.nrfTotal) {
      const elements = responseHtml.getElementsByClassName(`giveaway__heading__thin`);
      for (const element of elements) {
        const match = element.textContent.match(/\((.+) Copies\)/);
        if (match && (parseInt(match[1]) > 3)) {
          const giveaway = element.closest(`.giveaway__row-outer-wrap`);
          const url = giveaway.getElementsByClassName(`giveaway__heading__name`)[0].getAttribute(`href`);
          if (url) {
            obj.nrfMultiple += 1;
            obj.requests.push({
              giveaway: giveaway.cloneNode(true),
              onDone: this.nrf_onRequestGiveawayDone,
              request: this.nrf_requestGiveaway,
              url: `${url}/winners/search?page=`,
            });
          }
        }
      }
    }
    if (obj.nrfFound >= obj.nrfTotal) {
      return true;
    }
  }

  nrf_onRequestDone(obj) {
    if (obj.nrfFound >= obj.nrfTotal) {
      obj.requests = [];
    }
  }

  nrf_requestGiveaway(obj, details, response, responseHtml) {
    obj.popup.setProgress(`Searching inside giveaways with multiple copies (${obj.nrfMultiple} left)...`);
    const elements = responseHtml.getElementsByClassName(`table__column--width-small`);
    details.nrfFound = false;
    for (const element of elements) {
      if (!element.textContent.match(/Not Received/)) {
        continue;
      }
      details.nrfFound = true;
      obj.nrfFound += 1;
      if (obj.nrfFound >= obj.nrfTotal) {
        break;
      }
    }
    obj.popup.setOverallProgress(`${obj.nrfFound} of ${obj.nrfTotal} not received giveaways found...`);
  }

  nrf_onRequestGiveawayDone(obj, details) {
    if (!details.nrfFound) {
      return;
    }
    obj.nrfResults.appendChild(details.giveaway);
    obj.nrfResultsRaw += details.giveaway.outerHTML;
  }

  async nrf_onDone(obj) {
    obj.nrfData.lastCheck = Date.now();
    obj.nrfData.found = obj.nrfFound;
    obj.nrfData.total = obj.nrfTotal;
    obj.nrfData.results = obj.nrfResultsRaw;
    obj.nrfUser.values = {
      [`nrf${obj.nrfKey === `sent` ? `` : `Won`}`]: obj.nrfData
    };
    await saveUser(null, null, obj.nrfUser);
    await endless_load(obj.nrfResults);
  }
}

const usersNotReceivedFinder = new UsersNotReceivedFinder();

export { usersNotReceivedFinder };
