<<<<<<< HEAD:src/modules/Giveaways/GiveawayErrorSearchLinks.js
import Module from '../../class/Module';
import {common} from '../Common';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
;

class GiveawaysGiveawayErrorSearchLinks extends Module {
  constructor() {
    super();
    this.info = {
      // by Royalgamer06
      description: `
      <ul>
        <li>If you cannot access a giveaway because of many different reasons, a "Search Links" row is added to the table of the <a href="https://www.steamgifts.com/giveaway/FN2PK/">error</a> page containing 3 links that allow you to search for the game elsewhere:</li>
        <ul>
          <li>A SteamGifts icon that allows you to search for open giveaways of the game on SteamGifts.</li>
          <li><i class="fa fa-steam"></i> allows you to search for the game on Steam.</li>
          <li><i class="fa"><img src="https://steamdb.info/static/logos/favicon-16x16.png"></i> allows you to search for the game on SteamDB.</li>
        </ul>
      </ul>
    `,
      id: `gesl`,
      load: this.gesl,
      name: `Giveaway Error Search Links`,
      sg: true,
      type: `giveaways`
    };
  }

  gesl() {
    if (!this.esgst.giveawayPath || !document.getElementsByClassName(`table--summary`)[0]) return;
    let name = encodeURIComponent(document.getElementsByClassName(`table__column__secondary-link`)[0].textContent);
    createElements(document.getElementsByClassName(`table__row-outer-wrap`)[0], `afterEnd`, [{
      attributes: {
        class: `table__row-outer-wrap`,
        title: getFeatureTooltip(`gesl`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `table__row-inner-wrap`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__column--width-small`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-bold`
            },
            text: `Search Links`,
            type: `span`
          }]
        }, {
          attributes: {
            class: `table__column--width-fill`
          },
          type: `div`,
          children: [{
            attributes: {
              href: `https://www.steamgifts.com/giveaways/search?q=${name}`,
              target: `_blank`,
              title: `Search for active giveaways`
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa`
              },
              type: `i`,
              children: [{
                attributes: {
                  src: this.esgst.sgIcon
                },
                type: `img`
              }]
            }]
          }, {
            attributes: {
              href: `http://store.steampowered.com/search/?term=${name}`,
              target: `_blank`,
              title: `Search on Steam`
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa fa-steam`
              },
              type: `i`
            }]
          }, {
            attributes: {
              href: `https://steamdb.info/search/?a=app&q=${name}`,
              target: `_blank`,
              title: `Search on SteamDB`
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa`
              },
              type: `i`,
              children: [{
                attributes: {
                  src: `https://steamdb.info/static/logos/favicon-16x16.png`
                },
                type: `img`
              }]
            }]
          }]
        }]
      }]
    }]);
  }
}

export default GiveawaysGiveawayErrorSearchLinks;
=======
_MODULES.push({
    // by Royalgamer06
    description: `
      <ul>
        <li>If you cannot access a giveaway because of many different reasons, a "Search Links" row is added to the table of the <a href="https://www.steamgifts.com/giveaway/FN2PK/">error</a> page containing 3 links that allow you to search for the game elsewhere:</li>
        <ul>
          <li>A SteamGifts icon that allows you to search for open giveaways of the game on SteamGifts.</li>
          <li><i class="fa fa-steam"></i> allows you to search for the game on Steam.</li>
          <li><i class="fa"><img src="https://steamdb.info/static/logos/favicon-16x16.png"></i> allows you to search for the game on SteamDB.</li>
        </ul>
      </ul>
    `,
    id: `gesl`,
    load: gesl,
    name: `Giveaway Error Search Links`,
    sg: true,
    type: `giveaways`
  });

  function gesl() {
    if (!esgst.giveawayPath || !document.getElementsByClassName(`table--summary`)[0]) return;
    let name = encodeURIComponent(document.getElementsByClassName(`table__column__secondary-link`)[0].textContent);
    createElements(document.getElementsByClassName(`table__row-outer-wrap`)[0], `afterEnd`, [{
      attributes: {
        class: `table__row-outer-wrap`,
        title: getFeatureTooltip(`gesl`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `table__row-inner-wrap`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__column--width-small`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-bold`
            },
            text: `Search Links`,
            type: `span`
          }]
        }, {
          attributes: {
            class: `table__column--width-fill`
          },
          type: `div`,
          children: [{
            attributes: {
              href: `https://www.steamgifts.com/giveaways/search?q=${name}`,
              target: `_blank`,
              title: `Search for active giveaways`
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa`
              },
              type: `i`,
              children: [{
                attributes: {
                  src: esgst.sgIcon
                },
                type: `img`
              }]
            }]
          }, {
            attributes: {
              href: `http://store.steampowered.com/search/?term=${name}`,
              target: `_blank`,
              title: `Search on Steam`
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa fa-steam`
              },
              type: `i`
            }]
          }, {
            attributes: {
              href: `https://steamdb.info/search/?a=app&q=${name}`,
              target: `_blank`,
              title: `Search on SteamDB`
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa`
              },
              type: `i`,
              children: [{
                attributes: {
                  src: `https://steamdb.info/static/logos/favicon-16x16.png`
                },
                type: `img`
              }]
            }]
          }]
        }]
      }]
    }]);
  }

>>>>>>> master:Extension/Modules/Giveaways/GiveawayErrorSearchLinks.js
