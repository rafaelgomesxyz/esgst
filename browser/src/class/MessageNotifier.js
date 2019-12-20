import { Popup } from './Popup';
import { Shared } from './Shared';

class _MessageNotifier {
  constructor() {
    this.messages = [
      {
        id: 100000,
        message: 'Hi there! The ability to specify paths for features had been removed from ESGST in v8.5.9, but it\'s been added back since v8.5.11. Unfortunately, your previous path preferences could not be carried over, and I apologize for that, but if you have a backup from a version prior to v8.5.9, you should be able to restore them. Have a good day and thanks for using ESGST!',
        timestamp: 1576724400000,
      },
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