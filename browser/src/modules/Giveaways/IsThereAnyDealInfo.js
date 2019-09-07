import { Module } from '../../class/Module';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';
import { permissions } from '../../class/Permissions';

const
  parseHtml = utils.parseHtml.bind(utils),
  createElements = common.createElements.bind(common),
  createLock = common.createLock.bind(common),
  getValue = common.getValue.bind(common),
  request = common.request.bind(common),
  setValue = common.setValue.bind(common)
  ;

class GiveawaysIsThereAnyDealInfo extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            'Adds a box to the sidebar of any ',
            ['a', { href: `https://www.steamgifts.com/giveaway/aeqw7/` }, 'giveaway'],
            ` page that shows the best current deal for the game, the historical lowest price of the game and a list with all of the bundles that the game has been in. All of this information is retrieved from `,
            ['a', { href: `https://isthereanydeal.com` }, 'IsThereAnyDeal'],
            '.'
          ]],
          ['li', `Results are cached for 24 hours, so if you access a giveaway for the same game again within that timeframe, the information will not change.`]
        ]]
      ],
      id: 'itadi',
      name: 'IsThereAnyDeal Info',
      sg: true,
      type: 'giveaways'
    };
  }

  async init() {
    if (!this.esgst.giveawayPath) {
      return;
    }

    if (!(await permissions.requestUi(['isThereAnyDeal'], 'itadi', true))) {
      return;
    }

    this.esgst.giveawayFeatures.push(this.itadi_getGiveaways.bind(this));
  }

  itadi_getGiveaways(giveaways, main) {
    if (!main) {
      return;
    }
    const currentTime = Date.now();
    for (const giveaway of giveaways) {
      // noinspection JSIgnoredPromiseFromCall
      this.itadi_getInfo(currentTime, giveaway);
    }
  }

  async itadi_getInfo(currentTime, giveaway) {
    const game = this.esgst.games[giveaway.type][giveaway.id];
    let itadi = null;
    const plain = this.itadi_getPlain(giveaway.name);
    if (game && game.itadi && game.itadi.version === 2 && (currentTime - game.itadi.lastCheck < 86400000)) {
      itadi = game.itadi;
    } else {
      const loading = createElements(this.esgst.sidebar, 'beforeEnd', [{
        attributes: {
          class: 'sidebar__heading'
        },
        type: 'h3',
        children: [{
          attributes: {
            class: 'fa fa-circle-o-notch fa-spin'
          },
          type: 'i'
        }, {
          text: ' Loading IsThereAnyDeal info...',
          type: 'node'
        }]
      }]);
      itadi = await this.itadi_loadInfo(giveaway, plain);
      loading.remove();
    }
    this.itadi_addInfo(itadi, plain);
  }

  async itadi_loadInfo(giveaway, plain) {
    const itadi = {
      bundles: [],
      current: null,
      historical: null,
      lastCheck: Date.now(),
      version: 2
    };
    const response = await request({
      method: 'GET',
      queue: true,
      url: `https://isthereanydeal.com/game/${plain}/info/`
    });
    const html = parseHtml(response.responseText);
    const deals = html.querySelectorAll(`#gh-po tr`);
    for (const deal of deals) {
      const match = deal.firstElementChild.textContent.trim().match(/(Current\sBest|Historical\sLow)/);
      if (!match) {
        continue;
      }
      itadi[match[1] === 'Current Best' ? 'current' : 'historical'] = {
        cut: deal.querySelector('.gh-po__cut').textContent.trim(),
        date: deal.querySelector('.date').textContent.trim(),
        price: deal.querySelector('.gh-po__price').textContent.trim(),
        source: deal.querySelector('.gh-po__shopTitle').textContent.trim()
      };
    }
    const bundles = html.querySelectorAll(`.bundleTable tr:not(:first-child)`);
    for (const bundle of bundles) {
      const link = bundle.querySelector('.t-st3--link');
      itadi.bundles.push({
        expiry: bundle.querySelector('.bundleTable__expiry').textContent.trim(),
        id: link.getAttribute('href').match(/id\/(.+)/)[1],
        name: link.textContent.trim(),
        price: bundle.querySelector('.t-st3__price').textContent.trim(),
        source: bundle.querySelector('.shopTitle').textContent.trim()
      });
    }
    const deleteLock = await createLock('gameLock', 300);
    const games = JSON.parse(getValue('games'));
    if (!games[giveaway.type][giveaway.id]) {
      games[giveaway.type][giveaway.id] = {};
    }
    games[giveaway.type][giveaway.id].itadi = itadi;
    await setValue('games', JSON.stringify(games));
    deleteLock();
    return itadi;
  }

  itadi_template(text) {
    return [{
      attributes: {
        class: 'sidebar__heading'
      },
      text,
      type: 'h3'
    }, {
      attributes: {
        class: 'sidebar__navigation'
      },
      type: 'ul',
      children: []
    }];
  }

  itadi_itemTemplate(text1, text2, url) {
    return {
      attributes: {
        class: 'sidebar__navigation__item'
      },
      type: 'li',
      children: [{
        attributes: {
          class: 'sidebar__navigation__item__link',
          href: url
        },
        type: 'a',
        children: [{
          attributes: {
            class: 'sidebar__navigation__item__name'
          },
          text: text1,
          type: 'div'
        }, {
          attributes: {
            class: 'sidebar__navigation__item__underline'
          },
          type: 'div'
        }, {
          attributes: {
            class: 'sidebar__navigation__item__count'
          },
          text: text2,
          type: 'div'
        }]
      }]
    };
  }

  itadi_noItemTemplate(text) {
    return {
      text,
      type: 'node'
    };
  }

  itadi_addInfo(itadi, plain) {
    const items = [
      ...this.itadi_template('Best Current Deal'),
      ...this.itadi_template('Historical Lowest Price'),
      ...this.itadi_template('Bundles')
    ];
    if (itadi.current) {
      items[1].children.push(this.itadi_itemTemplate(`${itadi.current.source} (${itadi.current.date})`, `${itadi.current.price} (${itadi.current.cut})`, `https://isthereanydeal.com/game/${plain}/info/`));
    } else {
      items[1].children.push(this.itadi_noItemTemplate('There are no current deals for this game.'));
    }
    if (itadi.historical) {
      items[3].children.push(this.itadi_itemTemplate(`${itadi.historical.source} (${itadi.historical.date})`, `${itadi.historical.price} (${itadi.historical.cut})`, `https://isthereanydeal.com/game/${plain}/info/`));
    } else {
      items[3].children.push(this.itadi_noItemTemplate('There is no price history for this game.'));
    }
    if (itadi.bundles && itadi.bundles.length) {
      for (const bundle of itadi.bundles) {
        items[5].children.push(this.itadi_itemTemplate(`${bundle.name} (${bundle.source})`, `${bundle.price} (${bundle.expiry})`, `https://isthereanydeal.com/specials/#/filter:id/${bundle.id}`));
      }
    } else {
      items[5].children.push(this.itadi_noItemTemplate('This game has never been in a bundle.'));
    }
    createElements(this.esgst.sidebar, 'beforeEnd', items);
  }

  itadi_getPlain(name) {
    return name.toLowerCase()
      .replace(/\sthe|the\s/g, ``)
      .replace(/\s/g, ``)
      .replace(/\d/g, m => {
        return ['0', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][m];
      })
      .replace(/&/g, 'and')
      .replace(/\+/g, 'plus')
      .replace(/[^\d\w]/g, ``);
  }
}

const giveawaysIsThereAnyDealInfo = new GiveawaysIsThereAnyDealInfo();

export { giveawaysIsThereAnyDealInfo };