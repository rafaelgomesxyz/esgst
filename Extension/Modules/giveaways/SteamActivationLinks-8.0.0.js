_MODULES.push({
    description: `
      <ul>
        <li>Adds 2 optional icons (<i class="fa fa-steam"></i> for the Steam client and <i class="fa fa-globe"></i> for the browser) next to each key in the "Key" column of your <a href="https://www.steamgifts.com/giveaways/won">won</a> page that allow you to quickly activate a won game on Steam, either through the client or the browser.</li>
        <li>When you click on the icon, the key is automatically copied to the clipboard.</li>
      </ul>
    `,
    id: `sal`,
    load: sal,
    name: `Steam Activation Links`,
    options: {
      title: `Show links to:`,
      values: [`Steam Client`, `Browser`, `Both`]
    },
    sg: true,
    type: `giveaways`
  });

  function sal() {
    if (!esgst.wonPath) return;
    esgst.endlessFeatures.push(sal_addLinks, sal_addObservers);
  }

  function sal_addObservers(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .view_key_btn, .esgst-es-page-${endless}.view_key_btn` : `.view_key_btn`}`);
    for (const element of elements) {
      sal_addObserver(element);
    }
  }

  function sal_addObserver(button) {
    let interval = null;
    const context = button.closest(`.table__row-outer-wrap`);
    button.addEventListener(`click`, () => {
      if (interval) {
        return;
      }
      interval = setInterval(() => {
        if (!context.contains(button)) {
          clearInterval(interval);
          interval = null;
          if (esgst.sal) {
            const element = context.querySelector(`[data-clipboard-text]`);
            const match = element.getAttribute(`data-clipboard-text`).match(/^[\d\w]{5}(-[\d\w]{5}){2,}$/);
            if (match) {
              sal_addLink(element, match[0]);
            }
          }
          if (esgst.ef) {
            ef_hideElements(context);
          }
        }
      }, 100);
    });
  }

  function sal_addLinks(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} [data-clipboard-text], .esgst-es-page-${endless}[data-clipboard-text]` : `[data-clipboard-text]`}`);
    for (const element of elements) {
      if (element.parentElement.getElementsByClassName(`esgst-sal`)[0]) {
        continue;
      }
      const match = element.getAttribute(`data-clipboard-text`).match(/^[\d\w]{5}(-[\d\w]{5}){2,}$/);
      if (match) {
        sal_addLink(element, match[0]);
      }
    }
  }

  function sal_addLink(element, match) {
    let link, textArea;
    if ((element.nextElementSibling && !element.nextElementSibling.classList.contains(`esgst-sal`)) || !element.nextElementSibling) {
      link = createElements(element, `afterEnd`, [{
        type: `span`
      }]);
      switch (esgst.sal_index) {
        case 0:
          createElements(link, `beforeEnd`, [{
            attributes: {
              class: `esgst-sal esgst-clickable`,
              title: getFeatureTooltip(`sal`, `Activate on Steam (client)`)
            },
            type: `span`,
            children: [{
              attributes: {
                class: `fa fa-steam`
              },
              type: `i`
            }]
          }]).addEventListener(`click`, () => {
            textArea = createElements(document.body, `beforeEnd`, [{
              type: `textarea`
            }]);
            textArea.value = match;
            textArea.select();
            document.execCommand(`copy`);
            textArea.remove();
            location.href = `steam://open/activateproduct`;
          });
          break;
        case 1:
          createElements(link, `beforeEnd`, [{
            attributes: {
              class: `esgst-sal esgst-clickable`,
              href: `https://store.steampowered.com/account/registerkey?key=${match}`,
              target: `_blank`,
              title: getFeatureTooltip(`sal`, `Activate on Steam (browser)`)
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa fa-globe`
              },
              type: `i`
            }]
          }]);
          break;
        case 2:
          createElements(link, `beforeEnd`, [{
            attributes: {
              class: `esgst-sal esgst-clickable`,
              title: getFeatureTooltip(`sal`, `Activate on Steam (client)`)
            },
            type: `span`,
            children: [{
              attributes: {
                class: `fa fa-steam`
              },
              type: `i`
            }]
          }, {
            attributes: {
              class: `esgst-sal esgst-clickable`,
              href: `https://store.steampowered.com/account/registerkey?key=${match}`,
              target: `_blank`,
              title: getFeatureTooltip(`sal`, `Activate on Steam (browser)`)
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa fa-globe`
              },
              type: `i`
            }]
          }]).previousElementSibling.addEventListener(`click`, () => {
            textArea = createElements(document.body, `beforeEnd`, [{
              type: `textarea`
            }]);
            textArea.value = match;
            textArea.select();
            document.execCommand(`copy`);
            textArea.remove();
            location.href = `steam://open/activateproduct`;
          });
          break;
      }
    }
  }

