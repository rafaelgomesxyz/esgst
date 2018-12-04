import Module from '../../class/Module';
import { common } from '../Common';
import { utils } from '../../lib/jsUtils';

const imageKeys = [
  `cover-back`,
  `cover-left`,
  `cover-top`,
  `cover-right`,
  `cover-front`,
  `base-back`,
  `base-left`,
  `base-bottom`,
  `base-right`,
  `base-front`
];

class GiveawaysHappyHolidaysIntegration extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Checks if you can open Happy Holidays gift boxes.`
          ]]
        ]]
      ],
      features: {
        hhi_d: {
          name: `Disable 3D box animations to improve performance.`,
          sg: true
        },
        hhi_r: {
          name: `Remove boxes that cannot be open from the list.`,
          sg: true
        }
      },
      id: `hhi`,
      name: `Happy Holidays Integration`,
      sg: true,
      type: `giveaways`
    };
  }

  init() {
    if (location.pathname.match(/^\/happy-holidays($|\/search)/)) {
      this.esgst.endlessFeatures.push(this.getBoxes.bind(this));
    }
  }

  async getBoxes(context) {
    const giveaway_box_redraw = window.giveaway_box_redraw || (window.wrappedJSObject && window.wrappedJSObject.giveaway_box_redraw);
    if (context !== document && !this.esgst.hhi_d && giveaway_box_redraw) {
      giveaway_box_redraw();
    }
    const cache = JSON.parse(common.getLocalValue(`hhiCache`, `{}`));
    const boxes = context.querySelectorAll(`.giveaway_box_container:not([data-esgst])`);
    const promises = [];
    for (const box of boxes) {
      box.setAttribute(`data-esgst`, true);
      if (this.esgst.hhi_d) {
        this.disableBoxAnimations(box);
      }
      promises.push(this.getBox(box, cache));
    }
    await Promise.all(promises);
    common.setLocalValue(`hhiCache`, JSON.stringify(cache));
  }

  async getBox(box, cache) {
    const url = box.getAttribute(`href`);
    const code = url.match(/\/happy-holidays\/(.+)/)[1];
    let container = box.parentElement.nextElementSibling;
    if (!container || !container.classList.contains(`esgst-hhi`)) {
      container = common.createElements_v2(box.parentElement, `afterEnd`, [
        [`div`, { class: `giveaway_box_list_row esgst-hhi` }]
      ]);
    }
    const element = common.createElements_v2(container, `beforeEnd`, [
      [`div`, [
        [`i`, { class: `fa fa-circle-o-notch fa-spin` }],
        ` Checking...`
      ]]
    ]);
    if (!cache[code]) {
      const html = utils.parseHtml((await common.request({method: `GET`, url})).responseText);
      const error = html.querySelector(`.giveaway_box_notification`);
      if (error) {
        if (error.textContent.match(/You\salready\sopened\s5\sgift\sboxes\stoday\./)) {
          common.createElements_v2(element, `inner`, [ `Cannot check, as you already opened 5 gift boxes today.` ]);
          return;
        } else {
          cache[code] = {
            error: error.textContent.trim()
          };
        }
      } else {
        const button = html.querySelector(`.form__submit-button[href*="/giveaway/"]`);
        if (button) {
          cache[code] = {
            url: button.getAttribute(`href`)
          };
        }
      }
    }
    if (cache[code]) {
      if (cache[code].error) {
        if (this.esgst.hhi_r) {
          box.remove();
          element.remove();
        } else {
          common.createElements_v2(element, `inner`, [ cache[code].error ]);
        }
      } else if (cache[code].url) {
        common.createElements_v2(element, `inner`, [
          `You unlocked this giveaway: `,
          [`a`, { class: `table__column__secondary-link`, href: cache[code].url }, cache[code].url ]
        ]);
      }
    } else {
      common.createElements_v2(element, `inner`, [ `You can unlock this giveaway.` ]);
    }
  }

  disableBoxAnimations(box) {
    const element = box.firstElementChild;
    const images = [];
    for (const key of imageKeys) {
      const image = element.getAttribute(`data-${key}`);
      if (image) {
        images.push([`img`, { src: image, height: 50, width: 50 }]);
      }
    }
    common.createElements_v2(box, `inner`, images);
    box.style.display = `block`;
    box.style.textAlign = `center`;
  }
}

export default GiveawaysHappyHolidaysIntegration;