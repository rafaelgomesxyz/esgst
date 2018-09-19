_MODULES.push({
    description: `
      <ul>
        <li>Adds a search box before the "Giveaways" box at the header of any page that allows you to quickly search for giveaways from any page.</li>
        <li>Has [id=ags] built-in.</li>
      </ul>
    `,
    features: {
      qgs_h: {
        name: `Hide the native search on the main page.`,
        sg: true
      }
    },
    id: `qgs`,
    load: qgs,
    name: `Quick Giveaway Search`,
    sg: true,
    type: `giveaways`
  });

  function qgs() {
    let container = createElements(document.getElementsByClassName(`nav__left-container`)[0], `afterBegin`, [{
      attributes: {
        class: `esgst-qgs-container`,
        title: getFeatureTooltip(`qgs`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-qgs-input`,
          placeholder: `Search...`,
          type: `text`
        },
        type: `input`
      }, {
        attributes: {
          class: `fa fa-search`
        },
        type: `i`
      }]
    }]);
    container.addEventListener(`mouseenter`, qgs_expand);
    container.addEventListener(`mouseleave`, qgs_collapse);
    container.firstElementChild.addEventListener(`keypress`, qgs_trigger);
    if (esgst.qgs_h && esgst.giveawaysPath) {
      document.getElementsByClassName(`sidebar__search-container`)[0].remove();
    }
  }

  function qgs_expand(event) {
    event.currentTarget.classList.add(`esgst-qgs-container-expanded`);
  }

  function qgs_collapse(event) {
    if (event.relatedTarget && event.relatedTarget.closest(`.esgst-popout`)) return;
    event.currentTarget.classList.remove(`esgst-qgs-container-expanded`);
  }

  function qgs_trigger(event) {
    if (event.key !== `Enter`) return;
    event.preventDefault();
    location.href = `/giveaways/search?q=${encodeURIComponent(event.currentTarget.value)}`;
  }
  
