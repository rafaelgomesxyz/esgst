_MODULES.push({
    description: `
      <ul>
        <li>Brings back the SteamGifts' old active discussions design, while keeping the new "Deals" section.</li>
        <li>Only one section ("Discussions" or "Deals") can be shown at a time. There is a button (<i class="fa fa-retweet"></i>) in the page heading of the active discussions that allows you to switch sections.</li>
      </ul>
    `,
    features: {
      oadd_d: {
        description: `
          <ul>
            <li>With this option enabled, the deals are included in the "Discussions" section instead of being exclusive to the "Deals" section.</li>
          </ul>
        `,
        name: `Show deals in the "Discussions" section.`,
        sg: true
      }
    },
    id: `oadd`,
    load: oadd,
    name: `Old Active Discussions Design`,
    sg: true,
    type: `discussions`
  });

  async function oadd() {
    if (!esgst.giveawaysPath || !esgst.activeDiscussions) return;
    await oadd_load();
  }

  async function oadd_load(refresh, callback) {
    let deals, dealsRows, dealsSwitch, discussions, discussionsRows, discussionsSwitch, i, j, response1Html, response2Html, revisedElements, savedDiscussions;
    response1Html = parseHtml((await request({method: `GET`, url: `/discussions`})).responseText);
    response2Html = parseHtml((await request({method: `GET`, url: `/discussions/deals`})).responseText);
    esgst.activeDiscussions.classList.add(`esgst-oadd`);
    createElements(esgst.activeDiscussions, `inner`, [{
      type: `div`,
      children: [{
        attributes: {
          class: `page__heading`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-heading-button`,
            title: `Switch to Deals`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-retweet`
            },
            type: `i`
          }]
        }, {
          attributes: {
            class: `page__heading__breadcrumbs`
          },
          type: `div`,
          children: [{
            attributes: {
              href: `/discussions`
            },
            text: `Active Discussions`,
            type: `a`
          }]
        }, {
          attributes: {
            class: `page__heading__button page__heading__button--green`,
            href: `/discussions`
          },
          type: `a`,
          children: [{
            text: `More`,
            type: `node`
          }, {
            attributes: {
              class: `fa fa-angle-right`
            },
            type: `i`
          }]
        }]
      }, {
        attributes: {
          class: `table`
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
            text: `Summary`,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small text-center`
            },
            text: `Comments`,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-medium text-right`
            },
            text: `Last Post`,
            type: `div`
          }]
        }, {
          attributes: {
            class: `table__rows`
          },
          type: `div`
        }]
      }]
    }, {
      attributes: {
        class: `esgst-hidden`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `page__heading`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-heading-button`,
            title: `Switch to Discussions`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-retweet`
            },
            type: `i`
          }]
        }, {
          attributes: {
            class: `page__heading__breadcrumbs`
          },
          type: `div`,
          children: [{
            attributes: {
              href: `/discussions/deals`
            },
            text: `Active Deals`,
            type: `a`
          }]
        }, {
          attributes: {
            class: `page__heading__button page__heading__button--green`,
            href: `/discussions/deals`
          },
          type: `a`,
          children: [{
            text: `More`,
            type: `node`
          }, {
            attributes: {
              class: `fa fa-angle-right`
            },
            type: `i`
          }]
        }]
      }, {
        attributes: {
          class: `table`
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
            text: `Summary`,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small text-center`
            },
            text: `Comments`,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-medium text-right`
            },
            text: `Last Post`,
            type: `div`
          }]
        }, {
          attributes: {
            class: `table__rows`
          },
          type: `div`
        }]
      }]
    }]);
    discussions = esgst.activeDiscussions.firstElementChild;
    deals = discussions.nextElementSibling;
    discussionsSwitch = discussions.firstElementChild.firstElementChild;
    discussionsRows = discussions.lastElementChild.lastElementChild;
    dealsSwitch = deals.firstElementChild.firstElementChild;
    dealsRows = deals.lastElementChild.lastElementChild;
    let preset = null;
    if (esgst.df && esgst.df_m && esgst.df_enable) {
      let name = esgst.df_preset;
      if (name) {
        let i;
        for (i = esgst.df_presets.length - 1; i > -1 && esgst.df_presets[i].name !== name; i--);
        if (i > -1) {
          preset = esgst.df_presets[i];
        }
      }
    }
    savedDiscussions = JSON.parse(await getValue(`discussions`, `{}`));
    let elements = await discussions_get(response1Html, true);
    if (!esgst.oadd_d) {
      revisedElements = [];
      elements.forEach(element => {
        if (element.category !== `Deals`) {
          revisedElements.push(element);
        }
      });
      elements = revisedElements;
    }
    const filters = df_getFilters();
    for (i = 0, j = elements.length - 1; i < 5 && j > -1; j--) {
      if (!preset || filters_filterItem(`df`, filters, elements[j], preset.rules)) {
        discussionsRows.appendChild(elements[j].outerWrap);
        i += 1;
      }
    }
    elements = await discussions_get(response2Html, true);
    for (i = 0, j = elements.length - 1; i < 5 && j > -1; j--) {
      if (!preset || filters_filterItem(`df`, filters, elements[j], preset.rules)) {
        dealsRows.appendChild(elements[j].outerWrap);
        i += 1;
      }
    }
    discussionsSwitch.addEventListener(`click`, () => {
      discussions.classList.add(`esgst-hidden`);
      deals.classList.remove(`esgst-hidden`);
    });
    dealsSwitch.addEventListener(`click`, () => {
      discussions.classList.remove(`esgst-hidden`);
      deals.classList.add(`esgst-hidden`);
    });
    if (esgst.adots) {
      adots_load(refresh);
    } else if (esgst.radb) {
      radb_addButtons();
    }
    if (refresh) {
      await endless_load(esgst.activeDiscussions);
      if (callback) {
        callback();
      }
    } else if (callback) {
      callback();
    }
  }

