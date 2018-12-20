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
    if (window.location.pathname.match(/^\/happy-holidays($|\/search)/)) {
      this.esgst.endlessFeatures.push(this.getBoxes.bind(this));
    }
  }

  async getBoxes(context) {
    if (context !== document && !this.esgst.hhi_d) {
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

function giveaway_box_redraw() {
  window.$('.giveaway_box').each(function(){
  var elem = window.$(this);
  var background_default = 'repeating-linear-gradient(45deg, rgba(232, 234, 237, 0.95), rgba(232, 234, 237, 0.95) 15px, rgba(239, 241, 245, 0.95) 15px, rgba(239, 241, 245, 0.95) 30px)';
  // Dimensions
  var base_width = parseInt(elem.data('base-width'));
  var base_height = parseInt(elem.data('base-height'));
  var base_depth = parseInt(elem.data('base-depth'));
  var cover_height = parseInt(elem.data('cover-height'));
  // Base
  var base_front = giveaway_box_validate_background(elem.data('base-front')) ? 'url(' + elem.data('base-front') + ')' : background_default;
  var base_back = giveaway_box_validate_background(elem.data('base-back')) ? 'url(' + elem.data('base-back') + ')' : background_default;
  var base_left = giveaway_box_validate_background(elem.data('base-left')) ? 'url(' + elem.data('base-left') + ')' : background_default;
  var base_right = giveaway_box_validate_background(elem.data('base-right')) ? 'url(' + elem.data('base-right') + ')' : background_default;
  var base_bottom = giveaway_box_validate_background(elem.data('base-bottom')) ? 'url(' + elem.data('base-bottom') + ')' : background_default;
  // Cover
  var cover_front = giveaway_box_validate_background(elem.data('cover-front')) ? 'url(' + elem.data('cover-front') + ')' : background_default;
  var cover_back = giveaway_box_validate_background(elem.data('cover-back')) ? 'url(' + elem.data('cover-back') + ')' : background_default;
  var cover_left = giveaway_box_validate_background(elem.data('cover-left')) ? 'url(' + elem.data('cover-left') + ')' : background_default;
  var cover_right = giveaway_box_validate_background(elem.data('cover-right')) ? 'url(' + elem.data('cover-right') + ')' : background_default;
  var cover_top = giveaway_box_validate_background(elem.data('cover-top')) ? 'url(' + elem.data('cover-top') + ')' : background_default;
  
  elem.find('.giveaway_box_cover > .front').css({'background-image' : 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.13) 100%), ' + cover_front, 'width' : (base_width + 10) + 'px', 'height' : (cover_height) + 'px', 'transform' : 'translateY(-' + Math.round((base_height/2)-(cover_height/2) + 2) + 'px) translateZ(' + (Math.round(base_depth/2) + 5) + 'px)'});
  elem.find('.giveaway_box_cover > .back').css({'background-image' : 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.13) 100%), ' + cover_back, 'width' : (base_width + 10) + 'px', 'height' : (cover_height) + 'px', 'transform' : 'translateY(-' + Math.round((base_height/2)-(cover_height/2) + 2) + 'px) translateZ(-' + (Math.round(base_depth/2) + 5) + 'px) rotateX(180deg) rotateZ(-180deg)'});
  elem.find('.giveaway_box_cover > .left').css({'background-image' : 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.13) 100%), ' + cover_left, 'width' : (base_depth + 10) + 'px', 'height' : (cover_height) + 'px', 'transform' : 'translateY(-' + Math.round((base_height/2)-(cover_height/2) + 2) + 'px) translateX(-' + (Math.round(base_width/2) + 5) + 'px) rotateY(-90deg)'});
  elem.find('.giveaway_box_cover > .right').css({'background-image' : 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.13) 100%), ' + cover_right, 'width' : (base_depth + 10) + 'px', 'height' : (cover_height) + 'px', 'transform' : 'translateY(-' + Math.round((base_height/2)-(cover_height/2) + 2) + 'px) translateX(' + (Math.round(base_width/2) + 5) + 'px) rotateY(90deg)'});
  elem.find('.giveaway_box_cover > .top').css({'background-image' : cover_top, 'width' : (base_width + 10) + 'px', 'height' : (base_depth + 10) + 'px', 'transform' : 'translateY(-' + (Math.round(base_height/2) + 2) + 'px) rotateX(90deg)'});

  elem.find('.giveaway_box_base > .right').css({'background-image' : 'linear-gradient(rgb(0, 0, 1) ' + Math.round((cover_height-2)) + 'px, rgba(0, 0, 0, 0.7) ' + Math.round((cover_height + 1)) + 'px, rgba(0, 0, 0, 0.2) ' + Math.round((cover_height + 4)) + 'px, rgba(0, 0, 0, 0.05) ' + Math.round((cover_height + 6)) + 'px, rgba(0, 0, 0, 0) ' + Math.round((cover_height + 9)) + 'px, rgba(0, 0, 0, 0.18) 100%), ' + base_right, 'width' : base_depth + 'px', 'height' : base_height + 'px', 'transform' : 'translateX(' + Math.round(base_width/2) + 'px) rotateY(90deg)'});
  elem.find('.giveaway_box_base > .left').css({'background-image' : 'linear-gradient(rgb(0, 0, 1) ' + Math.round((cover_height-2)) + 'px, rgba(0, 0, 0, 0.7) ' + Math.round((cover_height + 1)) + 'px, rgba(0, 0, 0, 0.2) ' + Math.round((cover_height + 4)) + 'px, rgba(0, 0, 0, 0.05) ' + Math.round((cover_height + 6)) + 'px, rgba(0, 0, 0, 0) ' + Math.round((cover_height + 9)) + 'px, rgba(0, 0, 0, 0.18) 100%), ' + base_left, 'width' : base_depth + 'px', 'height' : base_height + 'px', 'transform' : 'translateX(-' + Math.round(base_width/2) + 'px) rotateY(-90deg)'});
  elem.find('.giveaway_box_base > .front').css({'background-image' : 'linear-gradient(rgb(0, 0, 1) ' + Math.round((cover_height-2)) + 'px, rgba(0, 0, 0, 0.7) ' + Math.round((cover_height + 1)) + 'px, rgba(0, 0, 0, 0.2) ' + Math.round((cover_height + 4)) + 'px, rgba(0, 0, 0, 0.05) ' + Math.round((cover_height + 6)) + 'px, rgba(0, 0, 0, 0) ' + Math.round((cover_height + 9)) + 'px, rgba(0, 0, 0, 0.18) 100%), ' + base_front, 'width' : base_width + 'px', 'height' : base_height + 'px', 'transform' : 'translateZ(' + Math.round(base_depth/2) + 'px)'});
  elem.find('.giveaway_box_base > .back').css({'background-image' : 'linear-gradient(rgb(0, 0, 1) ' + Math.round((cover_height-2)) + 'px, rgba(0, 0, 0, 0.7) ' + Math.round((cover_height + 1)) + 'px, rgba(0, 0, 0, 0.2) ' + Math.round((cover_height + 4)) + 'px, rgba(0, 0, 0, 0.05) ' + Math.round((cover_height + 6)) + 'px, rgba(0, 0, 0, 0) ' + Math.round((cover_height + 9)) + 'px, rgba(0, 0, 0, 0.18) 100%), ' + base_back, 'width' : base_width + 'px', 'height' : base_height + 'px', 'transform' : 'translateZ(-' + Math.round(base_depth/2) + 'px) rotateX(180deg) rotateZ(-180deg)'});
  elem.find('.giveaway_box_base > .bottom').css({'background-image' : 'linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.18)), ' + base_bottom, 'width' : base_width + 'px', 'height' : base_depth + 'px', 'transform' : 'translateY(' + Math.round(base_height/2) + 'px) rotateX(90deg)'});

  elem.find('.giveaway_box_shadow > div').css({'width' : base_width + 'px', 'height' : base_depth + 'px', 'transform' : 'translateY(' + Math.round(base_height/2) + 'px) rotateX(-90deg)'});
  });
}

function giveaway_box_validate_background(val) {
  return val.match(/^(http|https):\/\/i.imgur.com\/([A-Za-z0-9]{5,8}).(jpg|png|gif)$/i);
}

export default GiveawaysHappyHolidaysIntegration;