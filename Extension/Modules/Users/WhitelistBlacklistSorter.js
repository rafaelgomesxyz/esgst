_MODULES.push({
    description: `
      <ul>
        <li>Adds 2 buttons (<i class="fa fa-sort-amount-asc"></i> to sort in ascending order and <i class="fa fa-sort-amount-desc"></i> to sort in descending order) to the main page heading of your <a href="https://www.steamgifts.com/account/manage/whitelist">whitelist</a>/<a href="https://www.steamgifts.com/account/manage/blacklist">blacklist</a> pages that allow you to view all of the users in your whitelist/blacklist at once sorted by added date.</li>
      </ul>
    `,
    id: `wbs`,
    load: wbs,
    name: `Whitelist/Blacklist Sorter`,
    sg: true,
    sync: `Whitelist and Blacklist`,
    type: `users`
  });

  function wbs() {
    if (!esgst.whitelistPath && !esgst.blacklistPath) return;

    let [dateKey, mainKey, saveKey] = esgst.whitelistPath ? [`whitelistedDate`, `whitelist`, `whitelisted`] : [`blacklistedDate`, `blacklist`, `blacklisted`];

    // add ascending button
    let object = {
      dateKey,
      icon: `fa-sort-amount-asc`,
      key: mainKey,
      saveKey,
      title: `Oldest to newest ${saveKey} users:`
    };
    createHeadingButton({featureId: `wbs`, id: `wbsAsc`, icons: [`fa-sort-amount-asc`], title: `Sort by added date from oldest to newest`}).addEventListener(`click`, wbs_sort.bind(null, object));

    // add descending button
    object = {
      dateKey,
      icon: `fa-sort-amount-desc`,
      isDescending: true,
      key: mainKey,
      saveKey,
      title: `Newest to oldest ${saveKey} users:`
    };
    createHeadingButton({featureId: `wbs`, id: `wbsDesc`, icons: [`fa-sort-amount-desc`], title: `Sort by added date from newest to oldest`}).addEventListener(`click`, wbs_sort.bind(null, object));
  }

  async function wbs_sort(obj) {
    let savedUsers = JSON.parse(await getValue(`users`)).users;
    let users = [];
    for (let steamId in savedUsers) {
      let savedUser = savedUsers[steamId];
      if (!savedUser[obj.saveKey]) continue;
      savedUser.steamId = steamId;
      users.push(savedUser);
    }
    users = sortArray(users, obj.isDescending, obj.dateKey);

    let popup = new Popup(obj.icon, obj.title, true);
    popup.popup.classList.add(`esgst-wbs-popup`);
    let table = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-text-left table`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `table__heading`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__column--width-fill`
          },
          text: `User`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small text-center`
          },
          text: `Added`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small text-center`
          },
          text: `Remove`,
          type: `div`
        }]
      }, {
        attributes: {
          class: `table__rows`
        },
        type: `div`
      }]
    }]);
    let rows = table.lastElementChild;
    users.forEach(user => {
      let row = createElements(rows, `beforeEnd`, [{
        attributes: {
          class: `table__row-outer-wrap`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__row-inner-wrap`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__column--width-fill`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__column__heading`,
                href: `/user/${user.username}`
              },
              text: user.username,
              type: `a`
            }]
          }, {
            attributes: {
              class: `table__column--width-small text-center`
            },
            text: getTimestamp(user[obj.dateKey]),
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small text-center`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__remove-default esgst-clickable`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `icon-red fa fa-times-circle`
                },
                type: `i`
              }, {
                attributes: {
                  class: `table__column__secondary-link`
                },
                text: `Remove`,
                type: `span`
              }]
            }, {
              attributes: {
                class: `table__remove-loading esgst-hidden`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `fa fa-refresh fa-spin`
                },
                type: `i`
              }, {
                text: ` Removing`,
                type: `node`
              }]
            }, {
              attributes: {
                class: `table__remove-complete esgst-hidden`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `fa fa-times-circle`
                },
                type: `i`
              }, {
                text: ` Removed`,
                type: `node`
              }]
            }]
          }]
        }]
      }]);
      let object = {
        dateKey: obj.dateKey,
        key: obj.key,
        saveKey: obj.saveKey,
        user
      };
      object.removeButton = row.firstElementChild.lastElementChild.firstElementChild;
      object.removingButton = object.removeButton.nextElementSibling;
      object.removedButton = object.removingButton.nextElementSibling;
      object.removeButton.addEventListener(`click`, wbs_removeMember.bind(null, object));
    });
    popup.open();
    endless_load(table);
  }

  async function wbs_removeMember(obj) {
    obj.removeButton.classList.add(`esgst-hidden`);
    obj.removingButton.classList.remove(`esgst-hidden`);
    await request({data: `xsrf_token=${esgst.xsrfToken}&do=${obj.key}&action=delete&child_user_id=${obj.user.id}`, method: `POST`, url: `/ajax.php`});
    let deleteLock = await createLock(`userLock`, 300);
    let savedUsers = JSON.parse(await getValue(`users`));
    delete savedUsers.users[obj.user.steamId][obj.dateKey];
    delete savedUsers.users[obj.user.steamId][obj.saveKey];
    await setValue(`users`, JSON.stringify(savedUsers));
    deleteLock();
    obj.removingButton.classList.add(`esgst-hidden`);
    obj.removedButton.classList.remove(`esgst-hidden`);
  }

