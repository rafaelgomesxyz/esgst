import { Module } from '../../class/Module';
import { FetchRequest } from '../../class/FetchRequest';
import { Logger } from '../../class/Logger';
import { Namespaces } from '../../class/Namespaces';
import { Session } from '../../class/Session';
import { Shared } from '../../class/Shared';
import { Header } from '../../components/Header';
import { EventDispatcher } from '../../class/EventDispatcher';
import { Events } from '../../class/Events';

class GeneralNotificationMerger extends Module {
  constructor() {
    super();
    this.info = {
      // by Royalgamer06
      description: [
        ['ul', [
          ['li', [
            `Adds a second inbox icon colored as red (`,
            ['i', { class: 'fa fa-envelope esgst-red' }],
            `) to the header of any page that allows you to be notified about messages from SteamTrades on SteamGifts and vice-versa.`
          ]],
          ['li', `This feature is compatible with [id=hr_b].`]
        ]]
      ],
      id: 'nm',
      name: 'Notification Merger',
      sg: true,
      st: true,
      type: 'general'
    };
  }

  init() {
    if (!Shared.header) {
      return;
    }

    EventDispatcher.subscribe(Events.HEADER_REFRESHED, this.getNotifications.bind(this));

    this.getNotifications();
  }

  async getNotifications() {
    switch (Session.namespace) {
      case Namespaces.SG: {
        /** @type {import('../../components/Header').IHeader} */
        const header = new Header(Namespaces.ST);

        try {
          header.parse((await FetchRequest.get('https://www.steamtrades.com')).html);
        } catch (error) {
          Logger.error(error.message);
        }

        if (!header.buttonContainers['messages']) {
          if (Shared.header.buttonContainers['stMessages']) {
            Shared.header.buttonContainers['stMessages'].nodes.outer.classList.add('esgst-hidden');
          }

          return;
        }

        const counterNode = header.buttonContainers['messages'].nodes.counter;

        if (Shared.header.buttonContainers['stMessages']) {
          Shared.header.buttonContainers['stMessages'].nodes.outer.classList.remove('esgst-hidden');


          Shared.header.updateCounter('stMessages', counterNode ? counterNode.textContent : null);
        } else {
          Shared.header.addButtonContainer({
            buttonIcon: 'fa fa-envelope esgst-nm-icon',
            buttonName: 'ST Messages',
            context: Shared.header.buttonContainers['messages'].nodes.outer,
            counter: counterNode ? counterNode.textContent : '',
            isActive: true,
            isNotification: true,
            position: 'afterEnd',
            url: 'https://www.steamtrades.com/messages',
          });
        }

        if (!counterNode) {
          Shared.header.buttonContainers['stMessages'].nodes.outer.classList.add('esgst-hidden');
        }

        break;
      }

      case Namespaces.ST: {
        /** @type {import('../../components/Header').IHeader} */
        const header = new Header(Namespaces.SG);

        try {
          header.parse((await FetchRequest.get('https://www.steamgifts.com')).html);
        } catch (error) {
          Logger.error(error.message);
        }

        if (!header.buttonContainers['messages']) {
          if (Shared.header.buttonContainers['sgMessages']) {
            Shared.header.buttonContainers['sgMessages'].nodes.outer.classList.add('esgst-hidden');
          }

          return;
        }

        const counterNode = header.buttonContainers['messages'].nodes.counter;

        if (Shared.header.buttonContainers['sgMessages']) {
          Shared.header.buttonContainers['sgMessages'].nodes.outer.classList.remove('esgst-hidden');

          Shared.header.updateCounter('sgMessages', counterNode ? counterNode.textContent : null);
        } else {
          Shared.header.addButtonContainer({
            buttonIcon: 'fa fa-envelope esgst-nm-icon',
            buttonName: 'SG Messages ',
            context: Shared.header.buttonContainers['messages'].nodes.outer,
            counter: counterNode ? counterNode.textContent : '',
            isActive: true,
            position: 'afterEnd',
            url: 'https://www.steamgifts.com/messages',
          });
        }

        if (!counterNode) {
          Shared.header.buttonContainers['stMessages'].nodes.outer.classList.add('esgst-hidden');
        }

        break;
      }

      default: {
        throw 'Invalid namespace.';
      }
    }
  }
}

const generalNotificationMerger = new GeneralNotificationMerger();

export { generalNotificationMerger };