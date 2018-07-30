_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-refresh"></i>) to the page heading of the active discussions (in the main page) that allows you to refresh the active discussions without having to refresh the entire page.</li>
      </ul>
    `,
    id: `radb`,
    name: `Refresh Active Discussions Button`,
    sg: true,
    type: `discussions`
  });

  function radb_addButtons() {
    let elements, i;
    elements = esgst.activeDiscussions.querySelectorAll(`.homepage_heading, .esgst-heading-button`);
    for (i = elements.length - 1; i > -1; --i) {
      createElements(elements[i], `beforeBegin`, [{
        attributes: {
          class: `esgst-radb-button${esgst.oadd ? `` : ` homepage_heading`}`,
          title: getFeatureTooltip(`radb`, `Refresh active discussions/deals`)
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa fa-refresh`
          },
          type: `i`
        }]
      }]).addEventListener(`click`, event => {
        let icon = event.currentTarget.firstElementChild;
        icon.classList.add(`fa-spin`);
        if (esgst.oadd) {
          oadd_load(true, () => {
            icon.classList.remove(`fa-spin`);
          });
        } else {
          checkMissingDiscussions(true, () => {
            icon.classList.remove(`fa-spin`);
          });
        }
      });
    }
  }

