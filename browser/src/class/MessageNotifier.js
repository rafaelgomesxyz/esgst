import { Popup } from './Popup';
import { Shared } from './Shared';
import { Settings } from './Settings';

class _MessageNotifier {
  constructor() {
    this.messages = [
      {
        id: 100000,
        message: 'Hi there! The ability to specify paths for features had been removed from ESGST in v8.5.9, but it\'s been added back since v8.5.11. Unfortunately, your previous path preferences could not be carried over, and I apologize for that, but if you have a backup from a version prior to v8.5.9, you should be able to restore them. Have a good day and thanks for using ESGST!',
        timestamp: 1576724400000,
      },
      {
        id: 100001,
        check: () => Settings.get('ge'),
        message: [
          'Hi there! You can now extract giveaways from any URL with Giveaway Extractor. There isn\'t a UI for accessing this feature at the moment, but you can access it manually by going to ',
          ['a', { class: 'table__column__secondary-link', href: 'https://www.steamgifts.com/account/settings/profile?esgst=ge&url=URL' }, 'https://www.steamgifts.com/account/settings/profile?esgst=ge&url=URL'],
          '. For example, to extract giveaways from the SteamGifts Community Christmas Calendar 2019, go to ',
          ['a', { class: 'table__column__secondary-link', href: 'https://www.steamgifts.com/account/settings/profile?esgst=ge&url=https://www.steamgiftscalendar.lima-city.de/' }, 'https://www.steamgifts.com/account/settings/profile?esgst=ge&url=https://www.steamgiftscalendar.lima-city.de/'],
          '. You\'ll be asked to grant permission to all URLs. Happy holidays and thanks for using ESGST!',
        ],
        timestamp: 1577145600000,
      }
    ];
  }

  async notify(notifiedMessages) {
    const now = Date.now();
    for (const message of this.messages) {
      if (now - message.timestamp > 2592000000) {
        // Message is older than 30 days.
        continue;
      }
      if (notifiedMessages.includes(message.id)) {
        continue;
      }
      if (message.check && !message.check()) {
        continue;
      }
      new Popup({
        icon: 'fa-warning',
        title: message.message,
      }).open();
      notifiedMessages.push(message.id);
    }

    await Shared.common.setValue('notifiedMessages', JSON.stringify(notifiedMessages));
  }
}

const MessageNotifier = new _MessageNotifier();

export { MessageNotifier };