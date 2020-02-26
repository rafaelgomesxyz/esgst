import { Module } from '../../class/Module';
import { common } from '../Common';
import { Settings } from '../../class/Settings';

const
  createAlert = common.createAlert.bind(common)
  ;

class GiveawaysNextPreviousTrainHotkeys extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', 'Allows you to navigate through a train using hotkeys.'],
          ['li', `This feature is not 100% accurate, because the feature looks for a link with any variation of "previous"/"next" in the giveaway's description to make sure that it is going backward/forward, so if it does not find such a link, it will not work.`],
          ['li', 'It also does not work if you press the hotkey inside of an input/text area.'],
          ['li', `If you press Ctrl together with the hotkey, the giveaway is open in a new tab.`]
        ]]
      ],
      id: 'npth',
      name: 'Next/Previous Train Hotkeys',
      inputItems: [
        {
          event: 'keydown',
          id: 'npth_previousKey',
          prefix: `Enter the key you want to use for previous links: `
        },
        {
          event: 'keydown',
          id: 'npth_nextKey',
          prefix: `Enter the key you want to use for next links: `
        },
        {
          id: 'npth_previousRegex',
          prefix: `Enter the regex you want to use to detect previous links: `
        },
        {
          id: 'npth_nextRegex',
          prefix: `Enter the regex you want to use to detect next links: `
        }
      ],
      sg: true,
      type: 'giveaways'
    };
  }

  init() {
    const previousRegex = new RegExp(Settings.get('npth_previousRegex'));
    const nextRegex = new RegExp(Settings.get('npth_nextRegex'));
    let description, element, elements, i, n, next, previous, text;
    if (this.esgst.giveawayCommentsPath) {
      description = document.getElementsByClassName('page__description')[0];
      if (description) {
        elements = description.querySelectorAll(`[href*="/giveaway/"]`);
        n = elements.length;
        for (i = 0; i < n && (!previous || !next); ++i) {
          element = elements[i];
          text = element.textContent.toLowerCase();
          if (!previous && text.match(previousRegex)) {
            previous = element;
          } else if (!next && text.match(nextRegex)) {
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
          this.esgst.documentEvents.keydown.add(this.npth_loadGiveaway.bind(this, next, previous));
        }
      }
    }
  }

  npth_loadGiveaway(next, previous, event) {
    let referrer;
    if (!event.target.closest(`input, textarea`)) {
      if (event.key === Settings.get('npth_previousKey')) {
        if (previous) {
          if (event.ctrlKey) {
            window.open(previous.getAttribute('href'));
          } else {
            window.location.href = previous.getAttribute('href');
          }
        } else {
          referrer = document.referrer;
          if (referrer.match(/\/giveaway\//) && ((next && referrer !== next.getAttribute('href')) || !next)) {
            if (event.ctrlKey) {
              window.open(referrer);
            } else {
              window.location.href = referrer;
            }
          } else {
            createAlert('No previous link found.');
          }
        }
      } else if (event.key === Settings.get('npth_nextKey')) {
        if (next) {
          if (event.ctrlKey) {
            window.open(next.getAttribute('href'));
          } else {
            window.location.href = next.getAttribute('href');
          }
        } else {
          createAlert('No next link found.');
        }
      }
    }
  }
}

const giveawaysNextPreviousTrainHotkeys = new GiveawaysNextPreviousTrainHotkeys();

export { giveawaysNextPreviousTrainHotkeys };