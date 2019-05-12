import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { Table } from '../../class/Table';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';
import { elementBuilder } from '../../lib/SgStUtils/ElementBuilder';
import { shared } from '../../class/Shared';
import { gSettings } from '../../class/Globals';

const
  parseHtml = utils.parseHtml.bind(utils),
  sortArray = utils.sortArray.bind(utils),
  request = common.request.bind(common)
  ;

class GiveawaysCommentEntryChecker extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-comments` }],
            ` `,
            [`i`, { class: `fa fa-ticket` }],
            ` `,
            [`i`, { class: `fa fa-question-circle` }],
            ` ) to the main page heading of any `,
            [`a`, { href: `https://www.steamgifts.com/giveaway/aeqw7/` }, `giveaway`],
            ` page that allows you to view the list (including the number and percentage) of users that commented without entering, users that entered without commenting and users that commented & entered.`
          ]],
          [`li`, `If the giveaway has a link to a discussion, the feature will also check for comments in the discussion.`]
        ]]
      ],
      features: {
        cec_t: {
          name: `Open results in a new tab.`,
          sg: true
        }
      },
      id: `cec`,
      name: `Comment/Entry Checker`,
      sg: true,
      sgPaths: /^Giveaway($|\s-\s.+?)$/,
      type: `giveaways`
    };
  }

  init() {
    this.esgst.customPages.cec = {
      check: this.esgst.giveawayPath,
      load: async () => await this.cec_openPopup({})
    };

    if (!this.esgst.giveawayPath || document.getElementsByClassName(`table--summary`)[0] ||  !this.esgst.mainPageHeading) return;

    common.createElements_v2(this.esgst.sidebarGroups[0].navigation, `beforeEnd`, [
      [`li`, { class: `sidebar__navigation__item`, id: `cec` }, [
        [`a`, { class: `sidebar__navigation__item__link`, href: `${this.esgst.path.replace(/\/entries/, ``)}/entries?esgst=cec`, onclick: event => !gSettings.cec_t && !event.preventDefault() && this.cec_openPopup(true) }, [
          [`div`, { class: `sidebar__navigation__item__name` }, `Comments vs Entries`],
          [`div`, { class: `sidebar__navigation__item__underline` }]
        ]]
      ]]
    ]);
  }

  async cec_openPopup(isPopup) {
    let container = null;
    let context = null;
    if (isPopup) {
      const popup = new Popup({
        addScrollable: `left`,
        isTemp: true
      });
      container = popup.description;
      context = popup.scrollable;
      popup.open();
    } else {
      container = context = this.esgst.sidebar.nextElementSibling;
      context.setAttribute(`data-esgst-popup`, `true`);
      context.innerHTML = ``;
    }
    if (!isPopup) {
      common.setSidebarActive(`cec`);
    }
    const heading = new elementBuilder[shared.esgst.name].pageHeading({
      context: container,
      position: `afterBegin`,
      breadcrumbs: [
        {
          name: `ESGST`,
          url: this.esgst.settingsUrl
        },
        {
          name: `Comment / Entry Checker`,
          url: `?esgst=cec`
        }
      ]
    }).pageHeading;
    if (!isPopup) {
      this.esgst.mainPageHeading = heading;
    }
    const obj = { context };
    obj.progress = common.createElements_v2(context, `beforeEnd`, [[`div`]]);
    this.cec_start(obj);
  }

  async cec_start(obj) {
    obj.isCanceled = false;

    // get comments
    let comments = [];
    let urls = [window.location.pathname.match(/\/giveaway\/.+?\//)[0]];
    for (let i = 0; !obj.isCanceled && i < urls.length; i++) {
      let nextPage = 1;
      let pagination = null;
      let url = urls[i];
      do {
        obj.progress.innerHTML = `Retrieving ${i > 0 ? `bumps ` : `comments `} (page ${nextPage})...`;
        let response = await request({ method: `GET`, queue: true, url: `${url}${nextPage}` });
        let responseHtml = parseHtml(response.responseText);
        let elements = responseHtml.querySelectorAll(`.comment:not(.comment--submit) .comment__username:not(.comment__username--op):not(.comment__username--deleted)`);
        for (let j = elements.length - 1; j > -1; j--) {
          comments.push(elements[j].textContent.trim());
        }
        if (nextPage === 1) {
          url = urls[i] = `${response.finalUrl}/search?page=`;
        }
        nextPage += 1;
        pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];

        if (i === 0) {
          // get discussion links to check for bump comments
          let elements = responseHtml.querySelectorAll(`.page__description [href*="/discussion/"]`);
          for (let j = elements.length - 1; j > -1; j--) {
            urls.push(elements[j].getAttribute(`href`).match(/\/discussion\/.+?\//)[0]);
          }
        }
      } while (!obj.isCanceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
    }

    if (obj.isCanceled) return;

    // get entries
    let entries = [];
    let nextPage = 1;
    let pagination = null;
    let url = urls[0].replace(/search\?page=/, `entries/search?page=`);
    do {
      obj.progress.innerHTML = `Retrieving entries (page ${nextPage})...`;
      let responseHtml = parseHtml((await request({
        method: `GET`,
        queue: true,
        url: `${url}${nextPage}`
      })).responseText);
      let elements = responseHtml.getElementsByClassName(`table__column__heading`);
      for (let i = elements.length - 1; i > -1; i--) {
        entries.push(elements[i].textContent.trim());
      }
      nextPage += 1;
      pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
    } while (!obj.isCanceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));

    if (obj.isCanceled) return;

    obj.progress.innerHTML = ``;

    // calculate data
    comments = sortArray(Array.from(/** @type {ArrayLike} */ new Set(comments)));
    entries = sortArray(Array.from(/** @type {ArrayLike} */ new Set(entries)));
    let both = 0;
    let commented = 0;
    let entered = 0;
    const rows = [];
    for (const user of comments) {
      if (entries.indexOf(user) > -1) {
        // user commented and entered
        rows.push(
          [
            {
              alignment: `left`, size: `fill`, value: [
                [`a`, { class: `table__column__heading`, href: `/user/${user}` }, user]
              ]
            },
            `Yes`,
            `-`,
            `-`
          ]
        );
        both += 1;
      } else {
        // user commented but did not enter
        rows.push(
          [
            {
              alignment: `left`, size: `fill`, value: [
                [`a`, { class: `table__column__heading`, href: `/user/${user}` }, user]
              ]
            },
            `-`,
            `Yes`,
            `-`
          ]
        );
        commented += 1;
      }
    }
    let total = comments.length;
    for (const user of entries) {
      if (comments.indexOf(user) < 0) {
        // user entered but did not comment        
        rows.push(
          [
            {
              alignment: `left`, size: `fill`, value: [
                [`a`, { class: `table__column__heading`, href: `/user/${user}` }, user]
              ]
            },
            `-`,
            `-`,
            `Yes`
          ]
        );
        entered += 1;
        total += 1;
      }
    }
    const table = new Table([
      [
        { alignment: `left`, size: `fill`, value: `User` },
        `Commented and Entered (${both} - ${Math.round(both / total * 10000) / 100}%)`,
        `Commented but did not Enter (${commented} - ${Math.round(commented / total * 10000) / 100}%)`,
        `Entered but did not Comment (${entered} - ${Math.round(entered / total * 10000) / 100}%)`
      ],
      ...rows
    ]);
    obj.context.appendChild(table.table);
    await common.endless_load(obj.context);
  }

  cec_stop(obj) {
    obj.progress.innerHTML = ``
    obj.isCanceled = true;
  }
}

const giveawaysCommentEntryChecker = new GiveawaysCommentEntryChecker();

export { giveawaysCommentEntryChecker };