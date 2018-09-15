_MODULES.push({
    description: `
      <ul>
        <li>Adds 5 columns ("Sent", "Received", "Gift Difference", "Value Difference" and "Users") to your <a href="https://www.steamgifts.com/account/steam/groups">groups</a> page that show some stats about each group.</li>
      </ul>
    `,
    id: `gs`,
    load: gs,
    name: `Group Stats`,
    sg: true,
    type: `groups`
  });

  function gs() {
    if (!esgst.groupsPath) return;
    createElements(document.getElementsByClassName(`table__heading`)[0], `beforeEnd`, [{
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Sent`,
      type: `div`
    }, {
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Received`,
      type: `div`
    }, {
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Gift Difference`,
      type: `div`
    }, {
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Value Difference`,
      type: `div`
    }, {
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Users`,
      type: `div`
    }]);
    esgst.endlessFeatures.push(gs_getGroups);
  }

  function gs_getGroups(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .table__row-inner-wrap, .esgst-es-page-${endless}.table__row-inner-wrap` : `.table__row-inner-wrap`}`);
    for (let i = 0, n = elements.length; i < n; i++) {
      gs_addStatus(elements[i]);
    }
  }

  async function gs_addStatus(context) {
    let responseHtml = parseHtml((await request({method: `GET`, url: `${context.getElementsByClassName(`table__column__heading`)[0].getAttribute(`href`)}/users/search?q=${esgst.username}`})).responseText);
    let element = responseHtml.getElementsByClassName(`table__row-inner-wrap`)[0];
    if (!element || element.getElementsByClassName(`table__column__heading`)[0].textContent !== esgst.username) return;
    let elements = element.getElementsByClassName(`table__column--width-small`);
    for (let i = 0, n = elements.length; i < n; i++) {
      context.appendChild(elements[0]);
    }
    createElements(context, `beforeEnd`, [{
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: responseHtml.getElementsByClassName(`sidebar__navigation__item__count`)[1].textContent,
      type: `div`
    }]);
  }

