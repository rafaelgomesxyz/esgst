_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-thumb-stack"></i> if the country is stickied and <i class="fa fa-thumb-stack esgst-faded"></i> if it is not) next to each country in the <a href="https://www.steamgifts.com/giveaways/new">new giveaway</a> page that allows you to sticky the country so that it appears at the top of the country list when creating a giveaway for quick use.</li>
      </ul>
    `,
    id: `sgac`,
    load: sgac,
    name: `Stickied Giveaway Countries`,
    sg: true,
    type: `giveaways`
  });

  function sgac() {
    if (!esgst.newGiveawayPath) return;
    let rows = document.getElementsByClassName(`form__rows`)[0];
    if (!rows) return;
    let container, context, elements, i, id, n, separator, stickiedCountries;
    stickiedCountries = JSON.parse(esgst.storage.stickiedCountries);
    container = document.querySelector(`.form_list[data-input="country_item_string"]`);
    separator = container.firstElementChild;
    elements = container.children;
    for (i = 0, n = elements.length; i < n; ++i) {
      context = elements[i];
      id = context.getAttribute(`data-item-id`);
      if (stickiedCountries.indexOf(id) >= 0) {
        if (context === separator) {
          separator = separator.nextElementSibling;
        }
        container.insertBefore(context, separator);
      }
      new Button(context, `afterBegin`, {
        callbacks: [sgac_stickyCountry.bind(null, container, context, id, separator), null, sgac_unstickyCountry.bind(null, container, context, id, separator), null],
        className: `esgst-sgac-button`,
        icons: [`fa-thumb-tack esgst-clickable esgst-faded`, `fa-circle-o-notch fa-spin`, `fa-thumb-tack esgst-clickable`, `fa-circle-o-notch fa-spin`],
        id: `sgac`,
        index: stickiedCountries.indexOf(id) >= 0 ? 2 : 0,
        titles: [`Sticky country`, `Stickying...`, `Unsticky country`, `Unstickying...`]
      });
    }
  }

  async function sgac_stickyCountry(container, context, id, separator, event) {
    event.stopPropagation();
    if (container) {
      if (context === separator) {
        separator = separator.nextElementSibling;
      }
      container.insertBefore(context, separator);
    }
    let stickiedCountries = JSON.parse(await getValue(`stickiedCountries`, `[]`));
    if (stickiedCountries.indexOf(id) < 0) {
      stickiedCountries.push(id);
      await setValue(`stickiedCountries`, JSON.stringify(stickiedCountries));
    }
    return true;
  }

  async function sgac_unstickyCountry(container, context, id, separator, event) {
    event.stopPropagation();
    if (container) {
      container.insertBefore(context, separator);
      separator = separator.previousElementSibling;
    }
    let stickiedCountries = JSON.parse(await getValue(`stickiedCountries`, `[]`));
    let index = stickiedCountries.indexOf(id);
    if (index >= 0) {
      stickiedCountries.splice(index, 1);
      await setValue(`stickiedCountries`, JSON.stringify(stickiedCountries));
    }
    return true;
  }

