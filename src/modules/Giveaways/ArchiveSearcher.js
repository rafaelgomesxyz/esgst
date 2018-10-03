<<<<<<< HEAD:src/modules/Giveaways/ArchiveSearcher.js
import Module from '../../class/Module';
import Process from '../../class/Process';
import {utils} from '../../lib/jsUtils';
import {common} from '../Common';

const
  parseHtml = utils.parseHtml.bind(utils),
  endless_load = common.endless_load.bind(common),
  request = common.request.bind(common)
;

class GiveawaysArchiveSearcher extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Adds a button (<i class="fa fa-folder"></i> <i class="fa fa-search"></i>) to the main page heading of any <a href="https://www.steamgifts.com/archive">archive</a> page that allows you to search the archive by exact title/app id.</li>
      </ul>
    `,
      id: `as`,
      load: this.as_load,
      name: `Archive Searcher`,
      sg: true,
      type: `giveaways`
    };
  }

  as_load() {
    if (!this.esgst.archivePath) return;

    let category = location.pathname.match(/^\/archive\/(coming-soon|open|closed|deleted)/);
    new Process({
      headingButton: {
        id: `as`,
        icons: [`fa-folder`, `fa-search`],
        title: `Search archive`
      },
      popup: {
        icon: `fa-folder`,
        title: `Search archive${category ? ` for ${category[1]} giveaways` : ``}:`,
        options: [
          {
            check: true,
            description: `Search by AppID.`,
            id: `as_searchAppId`,
            tooltip: `If unchecked, a search by exact title will be performed.`
          }
        ],
        textInputs: [
          {
            placeholder: `Title/app id`
          }
        ],
        addProgress: true,
        addScrollable: `left`
      },
      init: this.as_init.bind(this),
      requests: [
        {
          request: this.as_request.bind(this)
        }
      ]
    });
  }

  async as_init(obj) {
    obj.query = obj.popup.getTextInputValue(0);
    if (!obj.query) {
      obj.popup.setError(`Please enter a title/app id.`);
      return true;
    }

    // retrieve the game title from Steam
    if (this.esgst.as_searchAppId) {
      obj.popup.setProgress(`Retrieving game title...`);
      let title = parseHtml((await request({
        method: `GET`,
        url: `https://steamcommunity.com/app/${obj.query}`
      })).responseText).getElementsByClassName(`apphub_AppName`)[0];
      if (title) {
        obj.query = title.textContent;
      } else {
        obj.button.classList.remove(`esgst-busy`);
        obj.popup.setError(`Game title not found. Make sure you are entering a valid AppID. For example, 229580 is the AppID for Dream (http://steamcommunity.com/app/229580).`);
        return true;
      }
    }
    obj.query = ((obj.query.length >= 50) ? obj.query.slice(0, 50) : obj.query).toLowerCase();
    obj.total = 0;
    obj.requests[0].url = `${location.href.match(/(.+?)(\/search.+?)?$/)[1]}/search?q=${encodeURIComponent(obj.query)}&page=`;
  }

  async as_request(obj, details, response, responseHtml) {
    obj.popup.setProgress(`Loading page ${details.nextPage}...`);
    obj.popup.setOverallProgress(`${obj.total} giveaways found...`);
    let context = obj.popup.getScrollable();
    let elements = responseHtml.getElementsByClassName(`table__row-outer-wrap`);
    for (let i = 0, n = elements.length; i < n; i++) {
      let element = elements[i];
      if (element.getElementsByClassName(`table__column__heading`)[0].textContent.match(/(.+?)( \(.+ Copies\))?$/)[1].toLowerCase() === obj.query) {
        context.appendChild(element.cloneNode(true));
        obj.total += 1;
      }
    }
    obj.popup.setOverallProgress(`${obj.total} giveaways found...`);
    await endless_load(context);
  }
}

export default GiveawaysArchiveSearcher;
=======
_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-folder"></i> <i class="fa fa-search"></i>) to the main page heading of any <a href="https://www.steamgifts.com/archive">archive</a> page that allows you to search the archive by exact title/app id.</li>
      </ul>
    `,
    id: `as`,
    load: as_load,
    name: `Archive Searcher`,
    sg: true,
    type: `giveaways`
  });

  function as_load() {
    if (!esgst.archivePath) return;

    let category = location.pathname.match(/^\/archive\/(coming-soon|open|closed|deleted)/);
    new Process({
      headingButton: {
        id: `as`,
        icons: [`fa-folder`, `fa-search`],
        title: `Search archive`
      },
      popup: {
        icon: `fa-folder`,
        title: `Search archive${category ? ` for ${category[1]} giveaways` : ``}:`,
        options: [
          {
            check: true,
            description: `Search by AppID.`,
            id: `as_searchAppId`,
            tooltip: `If unchecked, a search by exact title will be performed.`
          }
        ],
        textInputs: [
          {
            placeholder: `Title/app id`
          }
        ],
        addProgress: true,
        addScrollable: `left`
      },
      init: as_init,
      requests: [
        {
          request: as_request
        }
      ]
    });
  }

  async function as_init(obj) {
    obj.query = obj.popup.getTextInputValue(0);
    if (!obj.query) {
      obj.popup.setError(`Please enter a title/app id.`);
      return true;
    }

    // retrieve the game title from Steam
    if (esgst.as_searchAppId) {
      obj.popup.setProgress(`Retrieving game title...`);
      let title = parseHtml((await request({method: `GET`, url: `https://steamcommunity.com/app/${obj.query}`})).responseText).getElementsByClassName(`apphub_AppName`)[0];
      if (title) {
        obj.query = title.textContent;
      } else {
        obj.button.classList.remove(`esgst-busy`);
        obj.popup.setError(`Game title not found. Make sure you are entering a valid AppID. For example, 229580 is the AppID for Dream (http://steamcommunity.com/app/229580).`);
        return true;
      }
    }
    obj.query = ((obj.query.length >= 50) ? obj.query.slice(0, 50) : obj.query).toLowerCase();
    obj.total = 0;
    obj.requests[0].url = `${location.href.match(/(.+?)(\/search.+?)?$/)[1]}/search?q=${encodeURIComponent(obj.query)}&page=`;
  }

  async function as_request(obj, details, response, responseHtml) {
    obj.popup.setProgress(`Loading page ${details.nextPage}...`);
    obj.popup.setOverallProgress(`${obj.total} giveaways found...`);
    let context = obj.popup.getScrollable();
    let elements = responseHtml.getElementsByClassName(`table__row-outer-wrap`);
    for (let i = 0, n = elements.length; i < n; i++) {
      let element = elements[i];
      if (element.getElementsByClassName(`table__column__heading`)[0].textContent.match(/(.+?)( \(.+ Copies\))?$/)[1].toLowerCase() === obj.query) {
        context.appendChild(element.cloneNode(true));
        obj.total += 1;
      }
    }
    obj.popup.setOverallProgress(`${obj.total} giveaways found...`);
    await endless_load(context);
  }

>>>>>>> master:Extension/Modules/Giveaways/ArchiveSearcher.js
