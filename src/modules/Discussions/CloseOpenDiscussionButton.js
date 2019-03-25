import { Button } from '../../class/Button';
import { Module } from '../../class/Module';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';

const
  parseHtml = utils.parseHtml.bind(utils),
  request = common.request.bind(common)
  ;

class DiscussionsCloseOpenDiscussionButton extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-lock` }],
            ` if the discussion is open and `,
            [`i`, { class: `fa fa-lock esgst-red` }],
            ` if it is closed) next to the title of a discussion created by yourself (in any `,
            [`a`, { href: `https://www.steamgifts.com/discussions` }, `discussions`],
            ` page) that allows you to close/open the discussion without having to access it.`
          ]]
        ]]
      ],
      id: `codb`,
      name: `Close/Open Discussion Button`,
      sg: true,
      type: `discussions`
    };
  }

  init() {
    this.esgst.discussionFeatures.push(this.codb_addButtons.bind(this));
  }

  codb_addButtons(discussions) {
    for (const discussion of discussions) {
      if (discussion.author === this.esgst.username && !discussion.heading.parentElement.getElementsByClassName(`esgst-codb-button`)[0]) {
        if (discussion.closed) {
          discussion.closed.remove();
          discussion.closed = true;
        }
        new Button(discussion.headingContainer.firstElementChild, `beforeBegin`, {
          callbacks: [this.codb_close.bind(this, discussion), null, this.codb_open.bind(this, discussion), null],
          className: `esgst-codb-button`,
          icons: [`fa-lock esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-lock esgst-clickable esgst-red`, `fa-circle-o-notch fa-spin`],
          id: `codb`,
          index: discussion.closed ? 2 : 0,
          titles: [`Close discussion`, `Closing discussion...`, `Open discussion`, `Opening discussion...`]
        });
      }
    }
  }

  async codb_close(discussion) {
    let response = await request({
      data: `xsrf_token=${this.esgst.xsrfToken}&do=close_discussion`,
      method: `POST`,
      url: discussion.url
    });
    if (parseHtml(response.responseText).getElementsByClassName(`page__heading__button--red`)[0]) {
      discussion.closed = true;
      discussion.innerWrap.classList.add(`is-faded`);
      return true;
    }
    return false;
  }

  async codb_open(discussion) {
    let response = await request({
      data: `xsrf_token=${this.esgst.xsrfToken}&do=reopen_discussion`,
      method: `POST`,
      url: discussion.url
    });
    if (!parseHtml(response.responseText).getElementsByClassName(`page__heading__button--red`)[0]) {
      discussion.closed = false;
      discussion.innerWrap.classList.remove(`is-faded`);
      return true;
    }
    return false;
  }
}

const discussionsCloseOpenDiscussionButton = new DiscussionsCloseOpenDiscussionButton();

export { discussionsCloseOpenDiscussionButton };