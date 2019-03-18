import Popup from './Popup';
import {utils} from '../lib/jsUtils';
import {common} from '../modules/Common';
import esgst from './Esgst';

const
  parseHtml = utils.parseHtml.bind(utils),
  createHeadingButton = common.createHeadingButton.bind(common),
  endless_load = common.endless_load.bind(common),
  request = common.request.bind(common)
;

export default class Process {
  constructor(details) {
    this.mainContext = null;
    this.mainPopup = details.mainPopup;
    this.popupDetails = details.popup;
    this.contextHtml = details.contextHtml;
    this.init = details.init;
    this.requests = details.requests;
    this.requestsBackup = this.requests;
    this.urls = details.urls;
    if (!details.mainPopup) {
      if (details.button) {
        this.button = details.button;
      } else {
        this.button = createHeadingButton(details.headingButton);
      }
      this.button.addEventListener(`click`, this.openPopup.bind(this));
    }
  }

  async openPopup() {
    if (this.popup) {
      this.popup.open();
      return;
    }
    this.popupDetails.buttons = [
      {
        color1: `green`,
        color2: `red`,
        icon1: `fa-arrow-circle-right`,
        icon2: `fa-times-circle`,
        title1: `Start`,
        title2: `Stop`,
        callback1: this.start.bind(this),
        callback2: this.stop.bind(this)
      }
    ];
    this.popup = new Popup(this.popupDetails);
    this.popup.open();
    if (this.urls) {
      this.index = 0;
      this.perLoad = this.urls.perLoad;
      this.items = [];
      // noinspection JSAnnotator
      await this.urls.init(this, ...this.urls.arguments || []);
      this.total = this.items.length;
      if (!this.urls.doNotTrigger) {
        this.popup.triggerButton(0);
      }
      if (esgst[`es_${this.urls.id}`]) {
        this.popup.scrollable.addEventListener(`scroll`, () => {
          if (this.popup.scrollable.scrollTop + this.popup.scrollable.offsetHeight >= this.popup.scrollable.scrollHeight && !this.popup.isButtonBusy(0)) {
            this.popup.triggerButton(0);
          }
        });
      }
    }
  }

  async start() {
    if (this.button) {
      this.button.classList.add(`esgst-busy`);
    }
    this.isCanceled = false;

    if (this.popup && (!this.urls || this.urls.doNotTrigger)) {
      this.popup.clear();
    }

    if (this.init && (await this.init(this))) {
      if (this.button) {
        this.button.classList.remove(`esgst-busy`);
      }
      return;
    }

    if (this.urls) {
      await this.requestNextUrl(this.urls.request);
    } else {
      for (let i = 0; !this.isCanceled && i < this.requests.length; i++) {
        const request = this.requests[i];
        if (typeof request === `object`) {
          await this.request(request);
          if (request.onDone) {
            await request.onDone(this, request);
          }
        } else {
          await request(this);
        }
      }
    }

    if (this.button) {
      this.button.classList.remove(`esgst-busy`);
    }
    if (this.popup) {
      this.popup.clearProgress();
    }
  }

  stop() {
    this.isCanceled = true;
  }

  async requestNextUrl(details) {
    if (!this.urls.doNotTrigger && this.index >= this.total) {
      this.popup.removeButton(0);
      return;
    }
    this.popup.setProgress(`Loading more...`);
    this.popup.setOverallProgress(`${this.index} of ${this.total} loaded.`);
    this.context = this.mainContext ? common.createElements_v2(this.mainContext, `beforeEnd`, this.contextHtml) : this.popup.getScrollable(this.contextHtml);
    let i = 0;
    while (!this.isCanceled && (i < this.perLoad || (esgst[`es_${this.urls.id}`] && this.popup.scrollable.scrollHeight <= this.popup.scrollable.offsetHeight))) {
      let url = this.items[this.index];
      if (!url) break;
      url = url.url || url;
      let response = await request({method: `GET`, queue: details.queue, url: url});
      let responseHtml = parseHtml(response.responseText);
      await details.request(this, details, response, responseHtml);
      i += 1;
      this.index += 1;
      this.popup.setOverallProgress(`${this.index} of ${this.total} loaded.`);
    }
    if (!this.urls.doNotTrigger && this.index >= this.total) {
      this.popup.removeButton(0);
    }
    if (this.urls.restart) {
      this.index = 0;
    }
    await endless_load(this.context);
  }

  async request(details) {
    if (!details.nextPage) {
      details.nextPage = 1;
    }
    let backup = details.nextPage;
    details.lastPage = ``;
    let pagination = null;
    let stop = false;
    do {
      let response = await request({method: `GET`, queue: details.queue, url: `${details.url}${details.nextPage}`});
      let responseHtml = parseHtml(response.responseText);
      if (details.nextPage === backup) {
        details.lastPage = esgst.modules.generalLastPageLink.lpl_getLastPage(responseHtml, false, details.discussion, details.user, details.userWon, details.group, details.groupUsers, details.groupWishlist);
        details.lastPage = details.lastPage === 999999999 ? `` : ` of ${details.lastPage}`;
      }
      stop = await details.request(this, details, response, responseHtml);
      details.nextPage += 1;
      pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
    } while (!stop && !this.isCanceled && (!details.maxPage || details.nextPage <= details.maxPage) && pagination && !pagination.lastElementChild.classList.contains(esgst.selectedClass));
    details.nextPage = backup;
  }
}
