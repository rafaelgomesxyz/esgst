_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-comments"></i> <i class="fa fa-ticket"></i> <i class="fa fa-question-circle"></i>) to the main page heading of any <a href="https://www.steamgifts.com/giveaway/aeqw7/">giveaway</a> page that allows you to view the list (including the number and percentage) of users that commented without entering, users that entered without commenting and users that commented & entered.</li>
        <li>If the giveaway has a link to a discussion, the feature will also check for comments in the discussion.</li>
      </ul>
    `,
    id: `cec`,
    load: cec,
    name: `Comment/Entry Checker`,
    sg: true,
    type: `giveaways`
  });

  function cec() {
    if (!esgst.giveawayPath || !esgst.mainPageHeading) return;

    let obj = {
      button: createHeadingButton({id: `cec`, icons: [`fa-comments`, `fa-ticket`, `fa-question-circle`], title: `Check comments/entries`})
    };
    obj.button.addEventListener(`click`, cec_openPopup.bind(null, obj));
  }

  function cec_openPopup(obj) {
    if (obj.popup) {
      obj.popup.open();
      return;
    }
    obj.popup = new Popup_v2({
      icon: `fa-question`,
      title: `Check Comments/Entries`,
      buttons: [
        {
          color1: `green`,
          color2: `grey`,
          icon1: `fa-arrow-right`,
          icon2: `fa-times`,
          title1: `Check`,
          title2: `Cancel`,
          callback1: cec_start.bind(null, obj),
          callback2: cec_stop.bind(null, obj)
        }
      ],
      addProgress: true,
      addScrollable: true
    });
    obj.popup.open();
    obj.popup.triggerButton(0);
  }

  async function cec_start(obj) {
    obj.isCanceled = false;
    obj.button.classList.add(`esgst-busy`);

    // get comments
    let comments = [];
    let urls = [location.pathname.match(/\/giveaway\/.+?\//)[0]];
    for (let i = 0; !obj.isCanceled && i < urls.length; i++) {
      let nextPage = 1;
      let pagination = null;
      let url = urls[i];
      do {
        obj.popup.setProgress(`Retrieving ${i > 0 ? `bumps ` : `comments `} (page ${nextPage})...</span>`);
        let response = await request({method: `GET`, queue: true, url: `${url}${nextPage}`});
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
      obj.popup.setProgress(`Retrieving entries (page ${nextPage})...`);
      let responseHtml = parseHtml((await request({method: `GET`, queue: true, url: `${url}${nextPage}`})).responseText);
      let elements = responseHtml.getElementsByClassName(`table__column__heading`);
      for (let i = elements.length - 1; i > -1; i--) {
        entries.push(elements[i].textContent.trim());
      }
      nextPage += 1;
      pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
    } while (!obj.isCanceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));

    if (obj.isCanceled) return;

    obj.popup.removeButton(0);
    obj.button.classList.remove(`esgst-busy`);
    obj.popup.clearProgress();

    // calculate data
    comments = sortArray(Array.from(new Set(comments)));
    entries = sortArray(Array.from(new Set(entries)));
    let both = [];
    let commented = [];
    for (const user of comments) {
      if (entries.indexOf(user) > -1) {
        // user commented and entered
        both.push({
          attributes: {
            href: `/user/${user}`
          },
          text: user,
          type: `a`
        }, {
          text: `, `,
          type: `node`
        });
      } else {
        // user commented but did not enter
        commented.push({
          attributes: {
            href: `/user/${user}`
          },
          text: user,
          type: `a`
        }, {
          text: `, `,
          type: `node`
        });
      }
    }
    let entered = [];
    let total = comments.length;
    for (const user of entries) {
      if (comments.indexOf(user) < 0) {
        // user entered but did not comment
        entered.push({
          attributes: {
            href: `/user/${user}`
          },
          text: user,
          type: `a`
        }, {
          text: `, `,
          type: `node`
        });
        total += 1;
      }
    }
    both.pop();
    commented.pop();
    entered.pop();
    const items = [];
    if (both.length > 0) {
      items.push({
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: ` ${both.length} user${both.length > 1 ? `s` : ``} commented and entered (${Math.round(both.length / total * 10000) / 100}%): `,
          type: `span`
        }, ...both]
      });
    }
    if (commented.length > 0) {
      items.push({
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `${commented.length} user${commented.length > 1 ? `s` : ``} commented but did not enter (${Math.round(commented.length / total * 10000) / 100}%): `,
          type: `span`
        }, ...commented]
      });
    }
    if (entered.length > 0) {
      items.push({
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `${entered.length} user${entered.length > 1 ? `s` : ``} entered but did not comment (${Math.round(entered.length / total * 10000) / 100}%): `,
          type: `span`
        }, ...entered]
      });
    }
    obj.popup.setScrollable(items);
  }

  function cec_stop(obj) {
    obj.button.classList.remove(`esgst-busy`);
    obj.popup.clearProgress();
    obj.isCanceled = true;
  }

