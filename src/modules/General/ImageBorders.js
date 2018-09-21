import Module from '../../class/Module';

class GeneralImageBorders extends Module {
  info = ({
    description: `
      <ul>
        <li>Brings back image borders to SteamGifts.</li>
      </ul>
    `,
    id: `ib`,
    load: this.ib,
    name: `Image Borders`,
    sg: true,
    type: `general`
  });

  ib() {
    this.esgst.endlessFeatures.push(this.ib_addBorders);
  }

  ib_addBorders(context, main, source, endless) {
    const userElements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .giveaway_image_avatar, .esgst-es-page-${endless}.giveaway_image_avatar` : `.giveaway_image_avatar`}, ${endless ? `.esgst-es-page-${endless} .featured_giveaway_image_avatar, .esgst-es-page-${endless}.featured_giveaway_image_avatar` : `.featured_giveaway_image_avatar`}, ${endless ? `.esgst-es-page-${endless} :not(.esgst-ggl-panel) .table_image_avatar, .esgst-es-page-${endless}:not(.esgst-ggl-panel) .table_image_avatar` : `:not(.esgst-ggl-panel) .table_image_avatar`}`);
    for (let i = 0, n = userElements.length; i < n; ++i) {
      userElements[i].classList.add(`esgst-ib-user`);
    }
    const gameElements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .giveaway_image_thumbnail, .esgst-es-page-${endless}.giveaway_image_thumbnail` : `.giveaway_image_thumbnail`}, ${endless ? `.esgst-es-page-${endless} .giveaway_image_thumbnail_missing, .esgst-es-page-${endless}.giveaway_image_thumbnail_missing` : `.giveaway_image_thumbnail_missing`}, ${endless ? `.esgst-es-page-${endless} .table_image_thumbnail, .esgst-es-page-${endless}.table_image_thumbnail` : `.table_image_thumbnail`}, ${endless ? `.esgst-es-page-${endless} .table_image_thumbnail_missing, .esgst-es-page-${endless}.table_image_thumbnail_missing` : `.table_image_thumbnail_missing`}`);
    for (let i = 0, n = gameElements.length; i < n; ++i) {
      gameElements[i].classList.add(`esgst-ib-game`);
    }
  }
}

export default GeneralImageBorders;