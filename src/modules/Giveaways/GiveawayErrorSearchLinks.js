import { Module } from '../../class/Module';
import { common } from '../Common';

const
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
  ;

class GiveawaysGiveawayErrorSearchLinks extends Module {
  constructor() {
    super();
    this.info = {
      // by Royalgamer06
      description: [
        [`ul`, [
          [`li`, [
            `If you cannot access a giveaway because of many different reasons, a "Search Links" row is added to the table of the `,
            [`a`, { href: `https://www.steamgifts.com/giveaway/FN2PK/` }, `error`],
            ` page containing 4 links that allow you to search for the game elsewhere:`
          ]],
          [`ul`, [
            [`li`, `A SteamGifts icon that allows you to search for open giveaways of the game on SteamGifts.`],
            [`li`, [
              [`i`, { class: `fa fa-steam` }],
              `  allows you to search for the game on Steam.`,
            ]],
            [`li`, [
              [`i`, { class: `fa` }, [
                [`img`, { src: `https://steamdb.info/static/logos/favicon-16x16.png` }]
              ]],
              ` allows you to search for the game on SteamDB.`
            ]],
            [`li`, [
              [`i`, { class: `fa` }, [
                [`img`, { src: `https://bartervg.com/imgs/ico/barter/favicon-16x16.png` }]
              ]],
              ` allows you to search for the game on Barter.vg.`
            ]]
          ]]
        ]]
      ],
      id: `gesl`,
      name: `Giveaway Error Search Links`,
      sg: true,
      type: `giveaways`
    };
  }

  init() {
    const table = document.getElementsByClassName(`table--summary`)[0];
    if (!this.esgst.giveawayPath || !table) return;
    let name = encodeURIComponent(table.getElementsByClassName(`table__column__secondary-link`)[0].textContent);
    common.createElements_v2(table.getElementsByClassName(`table__row-outer-wrap`)[0], `afterEnd`, [
      [`div`, { class: `table__row-outer-wrap`, title: getFeatureTooltip(`gesl`) }, [
        [`div`, { class: `table__row-inner-wrap` }, [
          [`div`, { class: `table__column--width-small` }, [
            [`span`, { class: `esgst-bold` }, `Search Links`]
          ]],
          [`div`, { class: `table__column--width-fill esgst-gesl` }, [
            [`a`, { href: `https://www.steamgifts.com/giveaways/search?q=${name}`, target: `_blank`, title: `Search for active giveaways` }, [
              [`i`, { class: `fa` }, [
                [`img`, { src: this.esgst.sgIcon} ]
              ]]
            ]],
            [`a`, { href: `http://store.steampowered.com/search/?term=${name}`, target: `_blank`, title: `Search on Steam` }, [
              [`i`, { class: `fa fa-steam` }]
            ]],
            [`a`, { href: `https://steamdb.info/search/?a=app&q=${name}`, target: `_blank`, title: `Search on SteamDB` }, [
              [`i`, { class: `fa` }, [
                [`img`, { src: `https://steamdb.info/static/logos/favicon-16x16.png` } ]
              ]]
            ]],
            [`a`, { href: `https://barter.vg/search?q=${name}`, target: `_blank`, title: `Search on Barter.vg` }, [
              [`i`, { class: `fa` }, [
                [`img`, { src: `https://bartervg.com/imgs/ico/barter/favicon-16x16.png` } ]
              ]]
            ]]
          ]]
        ]]
      ]]
    ]);
  }
}

const giveawaysGiveawayErrorSearchLinks = new GiveawaysGiveawayErrorSearchLinks();

export { giveawaysGiveawayErrorSearchLinks };