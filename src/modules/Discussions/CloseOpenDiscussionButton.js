_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-lock"></i> if the discussion is open and <i class="fa fa-lock esgst-red"></i> if it is closed) next to the title of a discussion created by yourself (in any <a href="https://www.steamgifts.com/discussions">discussions</a> page) that allows you to close/open the discussion without having to access it.</li>
      </ul>
    `,
    id: `codb`,
    name: `Close/Open Discussion Button`,
    sg: true,
    type: `discussions`
  });

  async function codb_close(discussion) {
    let response = await request({data: `xsrf_token=${esgst.xsrfToken}&do=close_discussion`, method: `POST`, url: discussion.url});
    if (parseHtml(response.responseText).getElementsByClassName(`page__heading__button--red`)[0]) {
      discussion.closed = true;
      discussion.innerWrap.classList.add(`is-faded`);
      return true;
    }
    return false;
  }

  async function codb_open(discussion) {
    let response = await request({data: `xsrf_token=${esgst.xsrfToken}&do=reopen_discussion`, method: `POST`, url: discussion.url});
    if (!parseHtml(response.responseText).getElementsByClassName(`page__heading__button--red`)[0]) {
      discussion.closed = false;
      discussion.innerWrap.classList.remove(`is-faded`);
      return true;
    }
    return false;
  }

