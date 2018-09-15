_MODULES.push({
    description: `
      <ul>
        <li>If you click on/hover over (you can decide which one) a user/group's avatar/username, it shows a popout containing all of the basic information that you can find in their page.</li>
      </ul>
    `,
    id: `ap`,
    load: ap,
    name: `Avatar Popout`,
    options: {
      title: `Open on:`,
      values: [`Hover`, `Click`]
    },
    sg: true,
    type: `general`
  });

  function ap() {
    esgst.endlessFeatures.push(ap_getAvatars);
    esgst.userFeatures.push(ap_getUsers);
  }

  function ap_getUsers(users) {
    for (const user of users) {
      if (!user.oldElement.classList.contains(`esgst-ap-avatar`)[0]) {
        ap_setAvatar(user.oldElement);
      }
    }
  }

  function ap_getAvatars(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .global__image-outer-wrap--avatar-small, .esgst-es-page-${endless}.global__image-outer-wrap--avatar-small` : `.global__image-outer-wrap--avatar-small`}, ${endless ? `.esgst-es-page-${endless} .giveaway_image_avatar, .esgst-es-page-${endless}.giveaway_image_avatar` : `.giveaway_image_avatar`}, ${endless ? `.esgst-es-page-${endless} .table_image_avatar, .esgst-es-page-${endless}.table_image_avatar` : `.table_image_avatar`}, ${endless ? `.esgst-es-page-${endless} .featured_giveaway_image_avatar, .esgst-es-page-${endless}.featured_giveaway_image_avatar` : `.featured_giveaway_image_avatar`}, ${endless ? `.esgst-es-page-${endless} .nav__avatar-outer-wrap, .esgst-es-page-${endless}.nav__avatar-outer-wrap` : `.nav__avatar-outer-wrap`}`);
    for (let i = 0, n = elements.length; i < n; ++i) {
      ap_setAvatar(elements[i]);
    }
  }

  function ap_setAvatar(apAvatar) {
    let delay, eventType, exitTimeout, id, match, onClick, popout, timeout, type, url;
    apAvatar.classList.add(`esgst-ap-avatar`);
    url = apAvatar.getAttribute(`href`);
    if (url) {
      if (esgst.ap_index === 0) {
        eventType = `mouseenter`;
        onClick = false;
        delay = 1000;
        apAvatar.addEventListener(`mouseleave`, event => {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          exitTimeout = setTimeout(() => {
            if (popout && !popout.popout.contains(event.relatedTarget)) {
              popout.close();
            }
          }, 1000);
        });
        apAvatar.addEventListener(`click`, () => {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
        });
      } else {
        eventType = `click`;
        onClick = true;
        delay = 0;
        apAvatar.classList.add(`esgst-clickable`);
      }
      match = url.match(/\/(user|group)\/(.+?)(\/.*)?$/);
      if (match) {
        id = match[2];
        type = match[1];
        apAvatar.addEventListener(eventType, event => {
          event.preventDefault();
          timeout = setTimeout(async () => {
            popout = esgst.apPopouts[id];
            if (popout) {
              if (esgst.ap_index === 1 && popout.isOpen) {
                popout.close();
              } else {
                popout.open(apAvatar);
              }
            } else {
              esgst.apPopouts[id] = popout = new Popout(`esgst-ap-popout`, null, 1000, onClick);
              createElements(popout.popout, `inner`, [{
                attributes: {
                  class: `fa fa-circle-o-notch fa-spin`
                },
                type: `i`
              }, {
                text: `Loading ${type}...`,
                type: `span`
              }]);
              popout.open(apAvatar);
              let avatar, columns, i, link, n, reportButton, responseHtml, table;
              responseHtml = parseHtml((await request({method: `GET`, url})).responseText);
              popout.popout.innerHTML = ``;
              popout.popout.appendChild(responseHtml.getElementsByClassName(`featured__outer-wrap`)[0]);
              avatar = popout.popout.getElementsByClassName(`global__image-outer-wrap--avatar-large`)[0];
              link = createElements(avatar, `afterEnd`, [{
                attributes: {
                  class: `esgst-ap-link`
                },
                type: `a`
              }]);
              link.appendChild(avatar);
              link.setAttribute(`href`, url);
              table = popout.popout.getElementsByClassName(`featured__table`)[0];
              responseHtml.getElementsByClassName(`sidebar__shortcut-outer-wrap`)[0].lastElementChild.remove();
              table.parentElement.insertBefore(responseHtml.getElementsByClassName(`sidebar__shortcut-outer-wrap`)[0], table);
              reportButton = popout.popout.getElementsByClassName(`js__submit-form-inner`)[0];
              if (reportButton) {
                const form = reportButton.getElementsByTagName(`form`)[0];
                reportButton.addEventListener(`click`, form.submit.bind(form));
              }
              columns = table.children;
              for (i = 0, n = columns[1].children.length; i < n; ++i) {
                columns[0].appendChild(columns[1].firstElementChild);
              }
              const suspension = responseHtml.getElementsByClassName(`sidebar__suspension`)[0];
              if (suspension) {
                createElements(columns[0], `beforeEnd`, [{
                  attributes: {
                    class: `esgst-ap-suspended featured__table__row`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `featured__table__row__left`
                    },
                    text: suspension.textContent,
                    type: `div`
                  }, {
                    attributes: {
                      class: `featured__table__row__right`
                    },
                    text: suspension.nextElementSibling.textContent,
                    type: `div`
                  }]
                }]);
              }
              columns[1].remove();
              if (type === `user`) {
                await profile_load(popout.popout);
              }
              popout.reposition();
            }
            if (esgst.ap_index === 0) {
              popout.popout.onmouseenter = () => {
                if (exitTimeout) {
                  clearTimeout(exitTimeout);
                  exitTimeout = null;
                }
              };
            }
          }, delay);
        });
      }
    }
  }
  
