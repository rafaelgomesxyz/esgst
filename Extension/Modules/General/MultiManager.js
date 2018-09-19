_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-gears"></i>) to the main page heading of any page that allows you to do stuff with multiple giveaways/discussions/users/games at once.</li>
        <li>When you click on the button, a popout appears where you can select what type of item you want to manage (giveaways, discussions, users or games) and enable the manager for that type. When you do this, checkboxes are added in front of each item in the page, allowing you to select which ones you want to manage.</li>
        <li>You can:</li>
        <ul>
          <li>Search and replace something in the description of the selected giveaways.</li>
          <li>Hide the selected giveaways, if [id=gf_s] is enabled.</li>
          <li>Bookmark/unbookmark the selected giveaways, if [id=gb] is enabled.</li>
          <li>Calculate how much time you have to wait until you have enough points to enter the selected giveaways, if [id=ttec] is enabled.</li>
          <li>Export the selected giveaways to encrypted giveaways, if [id=ged] is enabled.</li>
          <li>Hide the selected discussions, if [id=df_s] is enabled.</li>
          <li>Highlight/unhighlight the selected discussions, if [id=dh] is enabled.</li>
          <li>Mark the selected discussions as visited/unvisited, if [id=gdttt] is enabled.</li>
          <li>Tag the selected users with the same tags, if [id=ut], is enabled.</li>
          <li>Check the selected users for whitelists/blacklists, if [id=wbc] is enabled.</li>
          <li>Tag the selected games with the same tags, if [id=gt], is enabled.</li>
          <li>Export the selected giveaways/discussions/users/games to links or to a custom format that you can specify.</li>
          <li>Tag the selected groups with the same tags, if [id=gpt], is enabled.</li>
        </ul>
        <li>On SteamTrades you can only manage users.</li>
      </ul>
    `,
    id: `mm`,
    load: mm,
    name: `Multi-Manager`,
    sg: true,
    st: true,
    type: `general`
  });

  function mm(context, items, itemsKey) {
    if (!context && !esgst.mainPageHeading) return;
    let obj = {
      button: createHeadingButton({
        context,
        id: `mm`,
        icons: [`fa-gears`],
        title: `Multi-manage`
      }),
      checkboxes: {
        Giveaways: {},
        Discussions: {},
        Users: {},
        Games: {},
        Groups: {}
      },
      counters: {
        Giveaways: 0,
        Discussions: 0,
        Users: 0,
        Games: 0,
        Groups: 0
      },
      counterElements: {},
      scope: context ? `popup` : `main`
    };
    esgst.mm_enable = mm_enable.bind(null, obj);
    esgst.mm_disable = mm_disable.bind(null, obj);
    obj.button.addEventListener(`click`,  mm_openPopout.bind(null, obj, items, itemsKey));
    if (esgst.mm_enableGames) {
      esgst.gameFeatures.push(mm_getGames);
    }
  }

  function mm_getGames(games, main) {
    esgst.mm_enable(esgst[main ? `mainGames` : `popupGames`], `Games`);
  }

  function mm_openPopout(obj, items, itemsKey) {
    if (obj.popout) return;
    obj.popout = new Popout(`esgst-mm-popout`, obj.button, 0, true);
    obj.headings = createElements(obj.popout.popout, `afterBegin`, [{
      attributes: {
        class: `esgst-mm-headings`
      },
      type: `div`
    }, {
      attributes: {
        class: `esgst-mm-sections`
      },
      type: `div`
    }]);
    obj.sections = obj.headings.nextElementSibling;
    let activeIndex = 0;
    Object.keys(obj.checkboxes).forEach((key, i) => {
      if (!esgst.sg && key !== `Users`) return;
      let heading = createElements(obj.headings, `beforeEnd`, [{
        type: `div`,
        children: [{
          type: `span`
        }, {
          text: ` ${key}`,
          type: `node`
        }, {
          type: `br`
        }, {
          attributes: {
            class: `esgst-bold`
          },
          text: obj.counters[key],
          type: `span`
        }, {
          text: ` selected`,
          type: `node`
        }]
      }]);
      obj.counterElements[key] = heading.lastElementChild;
      let toggleSwitch = new ToggleSwitch(heading.firstElementChild, `mm_enable${key}`, true, ``, false, false, null, esgst[`mm_enable${key}`]);
      toggleSwitch.onEnabled = mm_enable.bind(null, obj, itemsKey === key ? items : null, key);
      toggleSwitch.onDisabled = mm_disable.bind(null, obj, itemsKey === key ? items : null, key);
      mm_setSection(obj, createElements(obj.sections, `beforeEnd`, [{
        type: `div`
      }]), itemsKey === key ? items : null, key);
      if (esgst.sg) {
        heading.addEventListener(`click`, mm_changeActiveSection.bind(null, obj, i));
      }
      if (esgst[`mm_enable${key}`]) {
        activeIndex = i;
      }
    });
    mm_changeActiveSection(obj, esgst.sg ? activeIndex : 0);
    obj.popout.open();
  }

  function mm_changeActiveSection(obj, i) {
    for (let j = obj.headings.children.length - 1; j > -1; j--) {
      obj.headings.children[j].classList.remove(`esgst-selected`);
    }
    obj.headings.children[i].classList.add(`esgst-selected`);
    for (let j = obj.sections.children.length - 1; j > -1; j--) {
      obj.sections.children[j].classList.remove(`esgst-selected`);
    }
    obj.sections.children[i].classList.add(`esgst-selected`);
  }

  function mm_enable(obj, items, key) {
    if (!items) {
      items = esgst[obj.scope + key];
    }
    items.forEach(item => {
      let checkbox = getChildByClassName(item.innerWrap, `esgst-mm-checkbox`) || getChildByClassName(item.innerWrap.parentElement, `esgst-mm-checkbox`);
      if (checkbox) return;
      checkbox = new Checkbox(createElements(item.innerWrap, key.match(/Giveaways|Discussions/) ? `afterBegin` : `beforeBegin`, [{
        attributes: {
          class: `esgst-mm-checkbox`
        },
        type: `div`
      }]), false, false, {
        select: `Add item to Multi-Manager selection`,
        unselect: `Remove item from Multi-Manager selection`
      });
      checkbox.onPreEnabled = mm_selectItem.bind(null, obj, item, key, 1);
      checkbox.onPreDisabled = mm_selectItem.bind(null, obj, item, key, 0);
      let itemKey = item.type ? `${item.type}_${item.code}` : item.code;
      if (!obj.checkboxes[key][itemKey]) {
        obj.checkboxes[key][itemKey] = [];
      }
      obj.checkboxes[key][itemKey].push(checkbox);
    });
    mm_resetCounters(obj);
  }

  function mm_disable(obj, items, key) {
    obj.checkboxes[key] = {};
    if (!items) {
      items = esgst[obj.scope + key];
    }
    items.forEach(item => {
      let checkbox = getChildByClassName(item.innerWrap, `esgst-mm-checkbox`) || getChildByClassName(item.innerWrap.parentElement, `esgst-mm-checkbox`);
      if (checkbox) {
        checkbox.remove();
      }
      item.mm = 0;
    });
    mm_resetCounters(obj);
  }

  function mm_selectItem(obj, item, key, value) {
    let isNew = false;
    item.mm = value;
    obj.checkboxes[key][item.type ? `${item.type}_${item.code}` : item.code].forEach(checkbox => {
      if (value) {
        if (!checkbox.value) {
          isNew = true;
          checkbox.isBlocked = true;
          checkbox.check();
          checkbox.isBlocked = false;
        }
      } else {
        if (checkbox.value) {
          isNew = true;
          checkbox.isBlocked = true;
          checkbox.uncheck();
          checkbox.isBlocked = false;
        }
      }
    });
    if (isNew && item.outerWrap.offsetParent) {
      obj.counters[key] += (value ? 1 : -1);
      if (obj.counterElements[key]) {
        obj.counterElements[key].textContent = obj.counters[key];
      }
    }
  }

  function mm_resetCounters(obj) {
    for (let key in obj.counters) {
      obj.counters[key] = 0;
      if (obj.counterElements[key]) {
        obj.counterElements[key].textContent = 0;
      }
    }
  }

  function mm_setSection(obj, context, items, key) {
    if (!items) {
      items = esgst[`${obj.scope}${key}`];
    }
    let sections = {
      default: [
        {
          buttons: [
            {
              check: true,
              color1: `grey`, color2: `grey`,
              icon1: `fa-square`, icon2: `fa-circle-o-notch fa-spin`,
              title1: `All`, title2: ``,
              callback1: selectSwitches.bind(null, obj.checkboxes[key], `check`, null)
            },
            {
              check: true,
              color1: `grey`, color2: `grey`,
              icon1: `fa-square-o`, icon2: `fa-circle-o-notch fa-spin`,
              title1: `None`, title2: ``,
              callback1: selectSwitches.bind(null, obj.checkboxes[key], `uncheck`, null)
            },
            {
              check: true,
              color1: `grey`, color2: `grey`,
              icon1: `fa-plus-square-o`, icon2: `fa-circle-o-notch fa-spin`,
              title1: `Inverse`, title2: ``,
              callback1: selectSwitches.bind(null, obj.checkboxes[key], `toggle`, null)
            }
          ],
          name: `Select:`
        },
        {
          buttons: [],
          name: ``
        },
        {
          buttons: [
            {
              check: true,
              color1: `green`, color2: `grey`,
              icon1: `fa-globe`, icon2: `fa-circle-o-notch fa-spin`,
              title1: `Links`, title2: ``,
              callback1: mm_exportLinks.bind(null, obj, items, key)
            },
            {
              check: true,
              color1: `green`, color2: `grey`,
              icon1: `fa-pencil`, icon2: `fa-circle-o-notch fa-spin`,
              title1: `Custom`, title2: ``,
              callback1: mm_exportCustom.bind(null, obj, items, key)
            }
          ],
          name: `Export to:`
        }
      ],
      Giveaways: [
        [],
        [
          {
            check: true,
            color1: `green`, color2: ``,
            icon1: `fa-search`, icon2: ``,
            key: `searchReplace`,
            title1: `Replace`, title2: ``
          },
          {
            check: esgst.gf && esgst.gf_s,
            color1: `green`, color2: `grey`,
            icon1: `fa-eye-slash`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Hide`, title2: ``,
            callback1: mm_hideGiveaways.bind(null, obj, items)
          },
          {
            check: esgst.gb,
            color1: `green`, color2: `grey`,
            icon1: `fa-bookmark`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Bookmark`, title2: ``,
            callback1: mm_bookmarkGiveaways.bind(null, obj, items)
          },
          {
            check: esgst.gb,
            color1: `green`, color2: `grey`,
            icon1: `fa-bookmark-o`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Unbookmark`, title2: ``,
            callback1: mm_unbookmarkGiveaways.bind(null, obj, items)
          },
          {
            check: esgst.ttec,
            color1: `green`, color2: `grey`,
            icon1: `fa-clock-o`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Calculate`, title2: ``,
            callback1: mm_calculateGiveaways.bind(null, obj, items)
          }
        ],
        [
          {
            check: esgst.ged,
            color1: `green`, color2: `grey`,
            icon1: `fa-puzzle-piece`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Encrypted`, title2: ``,
            callback1: mm_exportEncryptedGiveaways.bind(null, obj, items)
          }
        ]
      ],
      Discussions: [
        [],
        [
          {
            check: esgst.df && esgst.df_s,
            color1: `green`, color2: `grey`,
            icon1: `fa-eye-slash`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Hide`, title2: ``,
            callback1: mm_hideDiscussions.bind(null, obj, items)
          },
          {
            check: esgst.dh,
            color1: `green`, color2: `grey`,
            icon1: `fa-star`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Highlight`, title2: ``,
            callback1: mm_highlightDiscussions.bind(null, obj, items)
          },
          {
            check: esgst.dh,
            color1: `green`, color2: `grey`,
            icon1: `fa-star-o`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Unhighlight`, title2: ``,
            callback1: mm_unhighlightDiscussions.bind(null, obj, items)
          },
          {
            check: esgst.gdttt,
            color1: `green`, color2: `grey`,
            icon1: `fa-check`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Visit`, title2: ``,
            callback1: mm_visitDiscussions.bind(null, obj, items)
          },
          {
            check: esgst.gdttt,
            color1: `green`, color2: `grey`,
            icon1: `fa-times`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Unvisit`, title2: ``,
            callback1: mm_unvisitDiscussions.bind(null, obj, items)
          }
        ],
        []
      ],
      Users: [
        [],
        [
          {
            check: esgst.ut,
            color1: `green`, color2: `grey`,
            icon1: `fa-tags`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Tag`, title2: ``,
            callback1: tags_openMmPopup.bind(null, obj, items, key)
          },
          {
            check: esgst.wbc,
            color1: `green`, color2: `grey`,
            icon1: `fa-question-circle`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Check WL/BL`, title2: ``,
            callback1: mm_selectWbcUsers.bind(null, obj, items)
          }
        ],
        []
      ],
      Games: [
        [],
        [
          {
            check: esgst.gt,
            color1: `green`, color2: `grey`,
            icon1: `fa-tags`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Tag`, title2: ``,
            callback1: tags_openMmPopup.bind(null, obj, items, key)
          },
          {
            check: true,
            color1: `green`, color2: `grey`,
            icon1: `fa-eye-slash`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Hide`, title2: ``,
            callback1: mm_hideGames.bind(null, obj, items)
          }
        ],
        []
      ],
      Groups: [
        [],
        [
          {
            check: esgst.gpt,
            color1: `green`, color2: `grey`,
            icon1: `fa-tags`, icon2: `fa-circle-o-notch fa-spin`,
            title1: `Tag`, title2: ``,
            callback1: tags_openMmPopup.bind(null, obj, items, key)
          }
        ],
        []
      ]
    };
    sections.default.forEach((section, i) => {
      let group = createElements(context, `beforeEnd`, [{
        attributes: {
          class: `esgst-button-group`
        },
        type: `div`,
        children: [{
          text: `${section.name}`,
          type: `span`
        }]
      }]);
      let buttons = sections[key][i].concat(section.buttons);
      buttons.forEach(button => {
        if (!button.check) return;
        let element = new ButtonSet_v2(button).set;
        if (group.children.length === 4) {
          group = createElements(context, `beforeEnd`, [{
            attributes: {
              class: `esgst-button-group`
            },
            type: `div`,
            children: [{
              text: `${section.name}`,
              type: `span`
            }]
          }]);
        }
        group.appendChild(element);
        if (button.key === `searchReplace`) {
          new Process({
            button: element,
            contextHtml: [{
              attributes: {
                class: `markdown`
              },
              type: `div`,
              children: [{
                type: `ul`
              }]
            }],
            popup: {
              icon: `fa-search`,
              title: `Search & Replace`,
              options: [
                {
                  check: true,
                  description: [{
                    text: `Use `,
                    type: `text`
                  }, {
                    attributes: {
                      class: `esgst-bold`,
                      href: `https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions`
                    },
                    text: `regular expression`,
                    type: `a`
                  }, {
                    text: `.`,
                    type: `node`
                  }],
                  id: `mm_useRegExp`,
                  tooltip: null
                }
              ],
              textInputs: [
                {
                  placeholder: `Example without regular expression: query | Example with regular expression: /query/flags`,
                  title: `Search for: `
                },
                {
                  placeholder: `Do not use regular expression here.`,
                  title: `Replace with: `
                }
              ],
              addProgress: true,
              addScrollable: true
            },
            urls: {
              arguments: [items],
              doNotTrigger: true,
              id: `mm`,
              init: mm_initUrls,
              request: {
                request: mm_getSearchReplaceUrlRequest
              },
              restart: true
            }
          });
        }
      });
    });
    createTooltip(createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-description`
      },
      type: `div`,
      children: [{
        text: `Enter the custom format below. `,
        type: `node`
      }, {
        attributes: {
          class: `fa fa-question-circle`
        },
        type: `i`
      }]
    }]).lastElementChild, `
      <div>Delimit the line to be replaced and duplicated (in case more than one items were selected) with [line][/line]. If you want the lines to be sorted in ascending order use [line-asc][/line] instead, and for descending order use [line-desc][/line]. Then build your custom format between [line] and [/line] using the templates below. Some templates are not available depending on which page you are on.</div>
      <br/>
      <div class="esgst-bold">Giveaways:</div>
      <ul>
        <li>[code] - The 5-character code of the giveaway.</li>
        <li>[comments] - The current number of comments that the giveaway has.</li>
        <li>[copies] - The number of copies being given away.</li>
        <li>[creator] - The creator of the giveaway.</li>
        <li>[end-time="$"] - When the giveaway ended/will end. Replace $ with the date templates specified at the end of this tooltip.</li>
        <li>[entries] - The current number of entries that the giveaway has.</li>
        <li>[level] - The level of the giveaway.</li>
        <li>[name] - The name of the game being given away.</li>
        <li>[points] - The number of points that the giveaway is worth.</li>
        <li>[short-url] - The short URL of the giveaway (https://www.steamgifts.com/giveaway/XXXXX/).</li>
        <li>[start-time="$"] - When the giveaway started. Replace $ with the date templates specified at the end of this tooltip.</li>
        <li>[steam-id] - The Steam app/sub id of the game being given away.</li>
        <li>[steam-type] - The Steam type of the game being given away ("app" or "sub").</li>
        <li>[steam-url] - The Steam store URL of the game being given away.</li>
        <li>[type] - The type of the giveaway ("Public", "Invite Only", "Group", "Whitelist", "Region Restricted", "Invite Only + Region Restricted", "Group + Whitelist", "Group + Region Restricted" or "Whitelist + Region Restricted").</li>
        <li>[url] - The full URL of the giveaway (https://www.steamgifts.com/giveaway/XXXXX/game-name).</li>
      </ul>
      <div class="esgst-bold">Discussions:</div>
      <ul>
        <li>[author] - The author of the discussion.</li>
        <li>[category] - The category of the discussion.</li>
        <li>[code] - The 5-character code of the discussion.</li>
        <li>[comments] - The current number of comments that the discussion has.</li>
        <li>[created-time="$"] - When the discussion was created. Replace $ with the date templates specified at the end of this tooltip.</li>
        <li>[poll] - "Yes" if the discussion has a poll and "No" otherwise.</li>
        <li>[short-url] - The short URL of the discussion (https://www.steamgifts.com/discussion/XXXXX/).</li>
        <li>[title] - The title of the discussion.</li>
        <li>[url] - The full URL of the discussion (https://www.steamgifts.com/discussion/XXXXX/title).</li>
      </ul>
      <div class="esgst-bold">Users:</div>
      <ul>
        <li>[url] - The URL of the user (https://www.steamgifts.com/user/username).</li>
        <li>[username] - The username of the user.</li>
      </ul>
      <div class="esgst-bold">Games:</div>
      <ul>
        <li>[id] - The Steam app/sub id of the game.</li>
        <li>[name] - The name of the game.</li>
        <li>[type] - The Steam type of the game ("app" or "sub").</li>
        <li>[url] - The Steam store URL of the game.</li>
      </ul>
      <div class="esgst-bold">Groups:</div>
      <ul>
        <li>[code] - The 5-character code of the group.</li>
        <li>[name] - The name of the group.</li>
        <li>[url] - The short URL of the group (https://www.steamgifts.com/group/XXXXX/).</li>
      </ul>
      <div class="esgst-bold">Date Templates:</div>
      <ul>
        <li>[d] - The number of the day with no leading zeroes if it is lower than 10.</li>
        <li>[dd] - The number of the day with leading zeroes if it is lower than 10.</li>
        <li>[m] - The number of the month with no leading zeroes if it is lower than 10.</li>
        <li>[mm] - The number of the month with leading zeroes if it is lower than 10.</li>
        <li>[mmm] - The name of the month abbreviated to 3 letters ("Jan", "Feb", etc...).</li>
        <li>[mmmm] - The full name of the month.</li>
        <li>[yyyy] - The year.</li>
        <li>[h] - The number of hours with no leading zeroes if it is lower than 10, using the 24-hour clock.</li>
        <li>[hh] - The number of hours with leading zeroes if it is lower than 10, using the 24-hour clock.</li>
        <li>[h12] - The number of hours with no leading zeroes if it is lower than 10, using the 12-hour clock.</li>
        <li>[hh12] - The number of hours with leading zeroes if it is lower than 10, using the 12-hour clock.</li>
        <li>[hm] - The number of minutes with no leading zeroes if it is lower than 10.</li>
        <li>[hmm] - The number of minutes with leading zeroes if it is lower than 10.</li>
        <li>[s] - The number of seconds with no leading zeroes if it is lower than 10.</li>
        <li>[ss] - The number of seconds with leading zeroes if it is lower than 10.</li>
        <li>[xx] - "am" or "pm". Remember to use h12 or hh12 if you use this template.</li>
      </ul>
      <div>You can use any symbol except for """ to separate things in your date templates. For example: "[mmm] [d], [yyyy] [h]:[hmm]", "[yyyy]-[mm]-[dd] [hh]:[hmm]", etc...</div>
      <br/>
      <div>Here is an example that generates a table with links to giveaways sorted in ascending order:</div>
      <br/>
      <div>Game | Giveaway | Level | Points | Ends</div>
      <div>:-: | :-: | :-: | :-: | :-:</div>
      <div>[line-asc][[name]]([steam-url]) | [Enter]([short-url]) | [level] | [points] | [end-time="[mmm] [d], [yyyy]"][/line]
      <br/>
      <br/>
    `);
    obj[`textArea${key}`] = createElements(context, `beforeEnd`, [{
      attributes: {
        class: `page_outer_wrap`
      },
      type: `div`,
      children: [{
        type: `textarea`
      }]
    }]).firstElementChild;
    if (esgst.cfh) {
      cfh_addPanel(obj[`textArea${key}`]);
    }
    obj[`message${key}`] = createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-description`
      },
      type: `div`
    }]);
    context.appendChild(new ButtonSet_v2({
      color1: `grey`, color2: `grey`,
      icon1: `fa-copy`, icon2: `fa-circle-o-notch fa-spin`,
      title1: `Copy`, title2: `Copying...`,
      callback1: mm_copyOutput.bind(null, obj, key)
    }).set);
  }

  function mm_exportLinks(obj, items, key) {
    let links = [];
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))) return;
      links.push(`[${escapeMarkdown(item.name || item.title || item.code)}](https://${key === `Games` ? `store.steampowered.com/${item.type.slice(0, -1)}/${item.code}` : `${location.hostname}/${key.toLowerCase().slice(0, -1)}/${item.code}/`})`);
    });
    obj[`textArea${key}`].value = links.join(`\n`);
  }

  function mm_exportCustom(obj, items, key) {
    let match = obj[`textArea${key}`].value.match(/\[LINE(.*?)\](.+)\[\/LINE\]/i),
      links = [];
    if (!match) return;
    let sorting = match[1],
      line = match[2];
    switch (key) {
      case `Giveaways`:
        items.forEach(item => {
          if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))) return;
          let type = ``;
          if (item.public) {
            type += `Public`;
          } else if (item.inviteOnly) {
            type += `Invite Only`;
            if (item.regionRestricted) {
              type += `Region Restricted`;
            }
          } else if (item.group) {
            type += `Group`;
            if (item.whitelist) {
              type += `Whitelist`;
            }
            if (item.regionRestricted) {
              type += `Region Restricted`;
            }
          } else if (item.whitelist) {
            type += `Whitelist`;
            if (item.regionRestricted) {
              type += `Region Restricted`;
            }
          } else if (item.regionRestricted) {
            type += `Region Restricted`;
          }
          links.push(line
            .replace(/\[CODE\]/ig, item.code)
            .replace(/\[COMMENTS\]/ig, item.comments)
            .replace(/\[COPIES\]/ig, item.copies)
            .replace(/\[CREATOR\]/ig, item.creator)
            .replace(/\[END-TIME="(.+?)"\]/ig, mm_formatDate.bind(null, item.endTime))
            .replace(/\[ENTRIES\]/ig, item.entries)
            .replace(/\[LEVEL\]/ig, item.level)
            .replace(/\[NAME\]/ig, escapeMarkdown(item.name))
            .replace(/\[POINTS\]/ig, item.points)
            .replace(/\[SHORT-URL\]/ig, `https://www.steamgifts.com/giveaway/${item.code}/`)
            .replace(/\[START-TIME="(.+?)"\]/ig, mm_formatDate.bind(null, item.startTime))
            .replace(/\[STEAM-ID\]/ig, item.id)
            .replace(/\[STEAM-TYPE\]/ig, item.type.slice(0, -1))
            .replace(/\[STEAM-URL\]/ig, `http://store.steampowered.com/${item.type.slice(0, -1)}/${item.id}`)
            .replace(/\[TYPE\]/ig, type)
            .replace(/\[URL\]/ig, `https://www.steamgifts.com${item.url.match(/\/giveaway\/.+/)[0]}`)
          );
        });
        break;
      case `Discussions`:
        items.forEach(item => {
          if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))) return;
          links.push(line
            .replace(/\[AUTHOR\]/ig, item.author)
            .replace(/\[CATEGORY\]/ig, escapeMarkdown(item.category))
            .replace(/\[CODE\]/ig, item.code)
            .replace(/\[COMMENTS\]/ig, item.comments)
            .replace(/\[CREATED-TIME="(.+?)"\]/ig, mm_formatDate.bind(null, item.createdTimestamp))
            .replace(/\[POLL\]/ig, item.poll ? `Yes` : `No`)
            .replace(/\[SHORT-URL\]/ig, `https://www.steamgifts.com/discussion/${item.code}/`)
            .replace(/\[TITLE\]/ig, escapeMarkdown(item.title))
            .replace(/\[URL\]/ig, `https://www.steamgifts.com${item.url.match(/\/discussion\/.+/)[0]}`)
          );
        });
        break;
      case `Users`:
        items.forEach(item => {
          if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))) return;
          links.push(line
            .replace(/\[URL\]/ig, `https://${location.hostname}/user/${item.code}`)
            .replace(/\[USERNAME\]/ig, item.code)
          );
        });
        break;
      case `Games`:
        items.forEach(item => {
          if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))) return;
          links.push(line
            .replace(/\[ID\]/ig, item.code)
            .replace(/\[NAME\]/ig, escapeMarkdown(item.name))
            .replace(/\[TYPE\]/ig, item.type.slice(0, -1))
            .replace(/\[URL\]/ig, `https://store.steampowered.com/${item.type.slice(0, -1)}/${item.code}`)
          );
        });
        break;
      case `Groups`:
        items.forEach(item => {
          if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))) return;
          links.push(line
            .replace(/\[CODE\]/ig, item.code)
            .replace(/\[NAME\]/ig, escapeMarkdown(item.name))
            .replace(/\[URL\]/ig, `https://www.steamgifts.com/group/${item.code}/`)
          );
        });
        break;
      default:
        break;
    }
    if (sorting) {
      links = sortArray(links, sorting === `-desc`);
    }
    obj[`textArea${key}`].value = obj[`textArea${key}`].value.replace(/\[LINE.*?\].+\[\/LINE\]/i, links.join(`\n`));
  }

  function mm_formatDate(timestamp, match, p1) {
    return escapeMarkdown(formatDate(p1, timestamp));
  }

  function mm_initUrls(obj, items) {
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))) return;
      obj.items.push({
        name: item.name,
        url: `https://www.steamgifts.com/giveaway/${item.code}/`
      });
    });
    obj.perLoad = obj.items.length;
  }

  async function mm_getSearchReplaceUrlRequest(obj, details, response, responseHtml) {
    let replaceValue, searchValue;
    if (esgst.mm_useRegExp) {
      try {
        let parts = obj.popup.getTextInputValue(0).match(/^\/(.+)\/(.*)$/);
        searchValue = new RegExp(parts[1], parts[2]);
        replaceValue = obj.popup.getTextInputValue(1);
      } catch (error) {
        obj.popup.setError(`Invalid regular expression!`);
        return;
      }
    } else {
      searchValue = obj.popup.getTextInputValue(0);
      replaceValue = obj.popup.getTextInputValue(1);
    }
    let description = responseHtml.querySelector(`.page__description textarea[name=description]`),
      name = obj.items[obj.index].name,
      url = obj.items[obj.index].url;
    if (description) {
      let match = esgst.mm_useRegExp ? description.value.match(searchValue) : description.value.includes(searchValue);
      if (match) {
        let responseJson = JSON.parse((await request({data: `xsrf_token=${esgst.xsrfToken}&do=edit_giveaway_description&giveaway_id=${description.previousElementSibling.value}&description=${encodeURIComponent(description.value.replace(searchValue, replaceValue))}`, method: `POST`, url: `/ajax.php`})).responseText);
        if (responseJson.type === `success`) {
          createElements(obj.context.firstElementChild.firstElementChild, `beforeEnd`, [{
            type: `li`,
            children: [{
              text: `Found and replaced in `,
              type: `node`
            }, {
              attributes: {
                href: url
              },
              text: name,
              type: `a`
            }]
          }]);
        } else {
          createElements(obj.context.firstElementChild.firstElementChild, `beforeEnd`, [{
            type: `li`,
            children: [{
              text: `Found, but failed to replace, in `,
              type: `node`
            }, {
              attributes: {
                href: url
              },
              text: name,
              type: `a`
            }]
          }]);
        }
      } else {
        createElements(obj.context.firstElementChild.firstElementChild, `beforeEnd`, [{
          type: `li`,
          children: [{
            text: `Not found in `,
            type: `node`
          }, {
            attributes: {
              href: url
            },
            text: name,
            type: `a`
          }]
        }]);
      }
    } else {
      createElements(obj.context.firstElementChild.firstElementChild, `beforeEnd`, [{
        type: `li`,
        children: [{
          text: `Not found in `,
          type: `node`
        }, {
          attributes: {
            href: url
          },
          text: name,
          type: `a`
        }]
      }]);
    }
  }

  async function mm_hideGiveaways(obj, items) {
    let newItems = {};
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))) return;
      newItems[item.code] = {
        code: item.code,
        endTime: item.endTime,
        hidden: true
      };
      if (obj.source !== `main` || !esgst.giveawayPath) {
        item.outerWrap.remove();
      }
    });
    await lockAndSaveGiveaways(newItems);
  }

  async function mm_bookmarkGiveaways(obj, items) {
    let newItems = {};
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`)) || !item.gbButton || item.gbButton.index !== 1) return;
      newItems[item.code] = {
        bookmarked: true,
        code: item.code,
        endTime: item.endTime,
        name: item.name,
        started: item.started
      };
      item.gbButton.change(null, 2);
    });
    await lockAndSaveGiveaways(newItems);
  }

  async function mm_unbookmarkGiveaways(obj, items) {
    let newItems = {};
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`)) || !item.gbButton || item.gbButton.index !== 3) return;
      newItems[item.code] = {
        bookmarked: false
      };
      item.gbButton.change(null, 0);
    });
    await lockAndSaveGiveaways(newItems);
  }

  function mm_calculateGiveaways(obj, items) {
    let points = 0;
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`)) || item.ended) return;
      points += item.points;
    });
    let nextRefresh = 60 - new Date().getMinutes();
    while (nextRefresh > 15) nextRefresh -= 15;
    if (points > esgst.points) {
      obj.textAreaGiveaways.value = `You will need to wait ${ttec_getTime(Math.round((nextRefresh + (15 * Math.floor((points - esgst.points) / 6))) * 100) / 100)} to enter all selected giveaways for a total of ${points}P.${points > 400 ? `\n\nSince each 400P regeneration takes about 17h, you will need to return in 17h and use all your points so more can be regenerated.` : ``}`;
    } else {
      obj.textAreaGiveaways.value = `You have enough points to enter all giveaways right now.`;
    }
  }

  function mm_exportEncryptedGiveaways(obj, items) {
    let encrypted = [];
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))) return;
      encrypted.push(`[](ESGST-${ged_encryptCode(item.code)})`);
    });
    obj.textAreaGiveaways.value = encrypted.join(` `);
  }

  function mm_copyOutput(obj, key) {
    obj[`textArea${key}`].select();
    document.execCommand(`copy`);
    createFadeMessage(obj[`message${key}`], `Copied!`);
  }

  async function mm_hideDiscussions(obj, items) {
    let newItems = {};
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))) return;
      let currentDate = Date.now();
      newItems[item.code] = {
        hidden: currentDate,
        lastUsed: currentDate
      };
      if (obj.source !== `main` || !esgst.discussionPath) {
        item.outerWrap.remove();
      }
    });
    await lockAndSaveDiscussions(newItems);
  }

  async function mm_highlightDiscussions(obj, items) {
    let newItems = {};
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`)) || !item.dhButton || item.dhButton.index !== 1) return;
      newItems[item.code] = {
        highlighted: true,
        lastUsed: Date.now()
      };
      item.dhButton.change(null, 2);
    });
    await lockAndSaveDiscussions(newItems);
  }

  async function mm_unhighlightDiscussions(obj, items) {
    let newItems = {};
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`)) || !item.dhButton || item.dhButton.index !== 3) return;
      newItems[item.code] = {
        highlighted: false,
        lastUsed: Date.now()
      };
      item.dhButton.change(null, 0);
    });
    await lockAndSaveDiscussions(newItems);
  }

  async function mm_visitDiscussions(obj, items) {
    let newItems = {};
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`)) || !item.gdtttButton || item.gdtttButton.index !== 1) return;
      newItems[item.code] = {
        visited: true,
        lastUsed: Date.now()
      };
      if (esgst.ct_s) {
        newItems[item.code].count = item.count;
      }
      item.gdtttButton.callbacks[0]();
      item.gdtttButton.change(null, 2);
    });
    await lockAndSaveDiscussions(newItems);
  }

  async function mm_unvisitDiscussions(obj, items) {
    let newItems = {};
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`)) || !item.gdtttButton || item.gdtttButton.index !== 3) return;
      newItems[item.code] = {
        count: 0,
        visited: false,
        lastUsed: Date.now()
      };
      item.gdtttButton.callbacks[2]();
      item.gdtttButton.change(null, 0);
    });
    await lockAndSaveDiscussions(newItems);
  }

  function mm_selectWbcUsers(obj, items) {
    if (!esgst.wbcButton) return;
    esgst.mmWbcUsers = [];
    items.forEach(item => {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))) return;
      esgst.mmWbcUsers.push(item.code);
    });
    esgst.wbcButton.setAttribute(`data-mm`, true);
    esgst.wbcButton.click();
  }

  async function mm_hideGames(obj, items) {
    const newItems = {
          apps: {},
          subs: {}
        },
        notFound = [];
    for (const item of items) {
      if (!item.mm || (!item.outerWrap.offsetParent && !item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))) continue;

      const elements = parseHtml(JSON.parse((await request({
        data: `do=autocomplete_giveaway_game&page_number=1&search_query=${encodeURIComponent(item.code)}`,
        method: `POST`,
        url: `/ajax.php`
      })).responseText).html).getElementsByClassName(`table__row-outer-wrap`);
      let found = false;
      for (let i = elements.length - 1; i > -1; i--) {
        const element = elements[i],
            info = games_getInfo(element);
        if (info && info.type === item.type && info.id === item.code) {
          await request({
            data: `xsrf_token=${esgst.xsrfToken}&do=hide_giveaways_by_game_id&game_id=${element.getAttribute(`data-autocomplete-id`)}`,
            method: `POST`,
            url: `/ajax.php`
          });
          newItems[item.type][item.code] = {
            hidden: true
          };
          found = true;
          break;
        }
      }
      if (!found) {
        notFound.push(item.name);
      }
    }
    await lockAndSaveGames(newItems);
    if (notFound.length) {
      alert(`The following games were not found and therefore not hidden: ${notFound.join(`, `)}`);
    }
  }

