import { Module } from '../../class/Module';
import { gSettings } from '../../class/Globals';

class GeneralElementFilters extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Allows you to hide elements in any page using CSS selectors.`],
          [`li`, `If you do not know how to use CSS selectors or you are having trouble hiding an element, leave a comment in the ESGST thread with a description/image of the element that you want to hide and I will give you the selector that you have to use.`],
          [`li`, `Here are some quick examples:`],
          [`ul`, [
            [`li`, [
              `To hide the "Redeem" button in your `,
              [`a`, { href: `https://www.steamgifts.com/giveaways/won` }, `won`],
              ` page, use: `,
              [`code`, `.table__column__key__redeem`]
            ]],
            [`li`, [
              `To hide the featured giveaway container (the big giveaway) in the main page, use: `,
              [`code`, `[esgst.giveawaysPath].featured__container`]
            ]],
            [`li`, [
              `To hide the pinned giveaways (the multiple copy giveaways) in the main page, use: `,
              [`code`, `[esgst.giveawaysPath].pinned-giveaways__outer-wrap`]
            ]]
          ]]
        ]]
      ],
      inputItems: [
        {
          id: `ef_filters`,
          prefix: `Filters: `,
          tooltip: `Separate each selector by a comma followed by a space, for example: .class_1, .class_2, #id`
        }
      ],
      id: `ef`,
      name: `Element Filters`,
      sg: true,
      st: true,
      type: `general`
    };
  }

  init() {
    this.ef_hideElements(document);
    this.esgst.endlessFeatures.push(this.ef_hideElements.bind(this));
    if (gSettings.sal || !this.esgst.wonPath) return;
    this.esgst.endlessFeatures.push(this.esgst.modules.giveawaysSteamActivationLinks.sal_addObservers.bind(this.esgst.modules.giveawaysSteamActivationLinks));
  }

  ef_hideElements(context, main, source, endless) {
    if (context === document && main) return;
    gSettings.ef_filters.split(`, `).forEach(filter => {
      if (!filter) return;
      try {
        const property = filter.match(/\[esgst\.(.+)]/);
        if (property) {
          if (!this.esgst[property[1]]) return;
          filter = filter.replace(/\[esgst\..+]/, ``);
        }
        const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} ${filter}, .esgst-es-page-${endless}${filter}` : `${filter}`}`);
        for (let i = elements.length - 1; i > -1; i--) {
          elements[i].classList.add(`esgst-hidden`);
        }
      } catch (e) { /**/
      }
    });
  }
}

const generalElementFilters = new GeneralElementFilters();

export { generalElementFilters };