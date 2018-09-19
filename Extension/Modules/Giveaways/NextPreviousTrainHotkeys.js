_MODULES.push({
    description: `
      <ul>
        <li>Allows you to navigate through a train using hotkeys.</a>
        <li>This feature is not 100% accurate, because the feature looks for a link with any variation of "previous"/"next" in the giveaway's description to make sure that it is going backward/forward, so if it does not find such a link, it will not work.</li>
        <li>It also does not work if you press the hotkey inside of an input/text area.</li>
        <li>If you press Ctrl together with the hotkey, the giveaway is open in a new tab.</li>
      </ul>
    `,
    id: `npth`,
    load: npth,
    name: `Next/Previous Train Hotkeys`,
    inputItems: [
      {
        event: `keydown`,
        id: `npth_previousKey`,
        prefix: `Enter the key you want to use for previous links: `
      },
      {
        event: `keydown`,
        id: `npth_nextKey`,
        prefix: `Enter the key you want to use for next links: `
      }
    ],
    sg: true,
    type: `giveaways`
  });

  function npth() {
    let description, element, elements, i, n, next, previous, text;
    if (esgst.giveawayCommentsPath) {
      description = document.getElementsByClassName(`page__description`)[0];
      if (description) {
        elements = description.querySelectorAll(`[href*="/giveaway/"]`);
        n = elements.length;
        for (i = 0; i < n && (!previous || !next); ++i) {
          element = elements[i];
          text = element.textContent.toLowerCase();
          if (!previous && text.match(/back|last|less|prev|<|←/)) {
            previous = element;
          } else if (!next && text.match(/forw|more|next|>|→/)) {
            next = element;
          }
        }
        if (!previous || !next) {
          if (n > 1) {
            previous = elements[0];
            next = elements[1];
          } else {
            next = elements[0];
          }
        }
        if (previous || next) {
          esgst.documentEvents.keydown.add(npth_loadGiveaway.bind(null, next, previous));
        }
      }
    }
  }

  function npth_loadGiveaway(next, previous, event) {
    let referrer;
    if (!event.target.closest(`input, textarea`)) {
      if (event.key === esgst.npth_previousKey) {
        if (previous) {
          if (event.ctrlKey) {
            open(previous.getAttribute(`href`));
          } else {
            location.href = previous.getAttribute(`href`);
          }
        } else {
          referrer = document.referrer;
          if (referrer.match(/\/giveaway\//) && ((next && referrer !== next.getAttribute(`href`)) || !next)) {
            if (event.ctrlKey) {
              open(referrer);
            } else {
              location.href = referrer;
            }
          } else {
            createAlert(`No previous link found.`);
          }
        }
      } else if (event.key === esgst.npth_nextKey) {
        if (next) {
          if (event.ctrlKey) {
            open(next.getAttribute(`href`));
          } else {
            location.href = next.getAttribute(`href`);
          }
        } else {
          createAlert(`No next link found.`);
        }
      }
    }
  }

