_MODULES.push({
    // by Royalgamer06
    description: `
      <ul>
        <li>Adds a second inbox icon colored as red (<i class="fa fa-envelope esgst-red"></i>) to the header of any page that allows you to be notified about messages from SteamTrades on SteamGifts and vice-versa.</li>
        <li>This feature is compatible with [id=hr_b].</li>
      </ul>
    `,
    id: `nm`,
    load: nm,
    name: `Notification Merger`,
    sg: true,
    st: true,
    type: `general`
  });

  function nm() {
    if (esgst.hr) return;
    nm_getNotifications();
  }

  async function nm_getNotifications() {
    if (esgst.sg) {
      let notification = parseHtml((await request({method: `GET`, url: `https://www.steamtrades.com`})).responseText).getElementsByClassName(`message_count`)[0];
      if (!notification) {
        if (esgst.altInboxButton) {
          // hide the button, since there are no notifications
          esgst.altInboxButton.classList.add(`esgst-hidden`);
        }
        return;
      }
      if (esgst.altInboxButton) {
        // the button already exists, so simply unhide it and change the message count
        esgst.altInboxButton.classList.remove(`esgst-hidden`);
        esgst.altMessageCount.textContent = notification.textContent;
      } else {
        // the button does not exist yet, so add it and save it in a global variable
        esgst.altInboxButton = createElements(esgst.inboxButton, `afterEnd`, [{
          attributes: {
            class: `nav__button-container nav__button-container--notification nav__button-container--active`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `nav__button`,
              href: `https://www.steamtrades.com/messages`,
              title: getFeatureTooltip(`nm`, `SteamTrades Messages`)
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa fa-envelope esgst-nm-icon`
              },
              type: `i`
            }, {
              attributes: {
                class: `nav__notification`
              },
              text: notification.textContent,
              type: `div`
            }]
          }]
        }]);
        esgst.altMessageCount = esgst.altInboxButton.firstElementChild.lastElementChild;
      }
    } else {
      let notification = parseHtml((await request({method: `GET`, url: `https://www.steamgifts.com`})).responseText).getElementsByClassName(`nav__notification`)[0];
      if (!notification) {
        if (esgst.altInboxButton) {
          // hide the button, since there are no notifications
          esgst.altInboxButton.classList.add(`esgst-hidden`);
        }
        return;
      }
      if (esgst.altInboxButton) {
        // the button already exists, so simply unhide it and change the message count
        esgst.altInboxButton.classList.remove(`esgst-hidden`);
        esgst.altMessageCount.textContent = notification.textContent;
      } else {
        // the button does not exist yet, so add it and save it in a global variable
        esgst.altInboxButton = createElements(esgst.inboxButton, `afterEnd`, [{
          attributes: {
            class: `nav_btn_container`,
            title: getFeatureTooltip(`nm`)
          },
          type: `div`,
          children: [{
            attributes: {
              class: `nav_btn`,
              href: `https://www.steamgifts.com/messages`
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa fa-envelope esgst-nm-icon`
              },
              type: `i`
            }, {
              type: `span`,
              children: [{
                text: `Messages `,
                type: `node`
              }, {
                attributes: {
                  class: `message_count`
                },
                text: notification.textContent,
                type: `span`
              }]
            }]
          }]
        }]);
        esgst.altMessageCount = esgst.altInboxButton.firstElementChild.lastElementChild.lastElementChild;
      }
    }
  }

