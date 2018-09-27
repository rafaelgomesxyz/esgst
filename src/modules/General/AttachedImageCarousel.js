import Module from '../../class/Module';
import {common} from '../Common';

const
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common)
;

class GeneralAttachedImageCarousel extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Adds a button (<i class="fa fa-image"></i>) to the main page heading of any page that allows you to navigate through a carousel containing all of the attached images in the page.</li>
        <li>The carousel can also be opened by clicking on any attached image in the page.</li>
      </ul>
    `,
      features: {
        aic_b: {
          name: `Only trigger the carousel when clicking on the button in the main page heading.`,
          sg: true,
          st: true
        }
      },
      id: `aic`,
      load: this.aic.bind(this),
      name: `Attached Image Carousel`,
      sg: true,
      st: true,
      type: `general`
    };
  }

  aic() {
    this.esgst.endlessFeatures.push(this.aic_getImages.bind(this));
    this.esgst.documentEvents.keydown.add(this.aic_move);
    if (!this.esgst.mainPageHeading) return;
    this.esgst.aicButton = createHeadingButton({id: `aic`, icons: [`fa-image`], title: `View attached images`});
    this.esgst.aicButton.classList.add(`esgst-hidden`);
    this.esgst.aicButton.addEventListener(`click`, this.aic_openCarousel.bind(this, 0, null));
  }

  aic_move(event) {
    if (event.key === `ArrowLeft` && this.esgst.aicPrevious) {
      this.esgst.aicPrevious.click();
    }
    if (event.key === `ArrowRight` && this.esgst.aicNext) {
      this.esgst.aicNext.click();
    }
  }

  aic_getImages(context, main, source, endless) {
    let buttons = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .comment__toggle-attached, .esgst-es-page-${endless}.comment__toggle-attached` : `.comment__toggle-attached`}, ${endless ? `.esgst-es-page-${endless} .view_attached, .esgst-es-page-${endless}.view_attached` : `.view_attached`}`);
    let found = false;
    for (let i = 0, n = buttons.length; i < n; i++) {
      let button = buttons[i];
      let image = button.nextElementSibling.firstElementChild;
      let url = image.getAttribute(`src`);
      let index = this.esgst.attachedImages.length;
      if (!this.esgst.aic_b) {
        image.addEventListener(`click`, this.aic_openCarousel.bind(this, index));
      }
      let comment = button.closest(`.comment`);
      this.esgst.attachedImages.push({
        button: button,
        image: image,
        outerWrap: button,
        qiv: context.getAttribute && context.getAttribute(`data-esgst-qiv`),
        source: comment && comment.querySelector(`.comment__summary`).id,
        url: url
      });
      found = true;
    }
    if (!found || !this.esgst.aicButton) {
      return;
    }
    this.esgst.aicButton.classList.remove(`esgst-hidden`);
  }

  aic_openCarousel(i, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    let carousel = createElements(document.body, `beforeEnd`, [{
      attributes: {
        class: `esgst-popup-modal esgst-aic-carousel`
      },
      type: `div`
    }]);
    carousel.style.zIndex = 9999 + document.querySelectorAll(`.esgst-popup:not(.esgst-hidden), .esgst-popout:not(.esgst-hidden)`).length;
    carousel.addEventListener(`click`, this.aic_removeCarousel.bind(this));
    this.aic_showImage(carousel, i);
  }

  aic_removeCarousel(event) {
    if (event.target.closest(`.esgst-aic-panel`) || event.target.closest(`img`)) return;

    event.currentTarget.remove();
  }

  aic_showImage(carousel, i) {
    let attachedImage, height, image, n, panel;
    n = this.esgst.attachedImages.length;
    attachedImage = this.esgst.attachedImages[i];
    if (this.esgst.ail) {
      attachedImage.image.setAttribute(`src`, attachedImage.url);
    }
    const items = [{
      attributes: {
        class: `esgst-aic-left-button`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-chevron-left`
        },
        type: `i`
      }]
    }, {
      attributes: {
        class: `esgst-aic-right-button`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-chevron-right`
        },
        type: `i`
      }]
    }, {
      text: `${i + 1}/${n}`,
      type: `div`
    }];
    if (attachedImage.source) {
      items.push({
        attributes: {
          class: `esgst-aic-source`
        },
        type: `div`,
        children: [{
          attributes: {
            href: `#${attachedImage.source}`
          },
          text: `Source`,
          type: `a`
        }]
      });
    }
    const imageNode = attachedImage.image.cloneNode(true);
    imageNode.classList.remove(`is_hidden`, `is-hidden`);
    const imageClass = imageNode.querySelector(`.is_hidden, .is-hidden`);
    if (imageClass) {
      imageNode.classList.remove(`is_hidden`, `is-hidden`);
    }
    createElements(carousel, `inner`, [{
      attributes: {
        class: `esgst-aic-panel`
      },
      type: `div`,
      children: items
    }, {
      attributes: {
        href: attachedImage.url,
        rel: `nofollow noreferrer`,
        target: `_blank`
      },
      type: `a`,
      children: [{
        context: imageNode
      }]
    }]);
    panel = carousel.firstElementChild;
    image = panel.nextElementSibling;
    height = panel.offsetHeight + 25;
    image.style.maxHeight = `calc(90% - ${height}px)`;
    image.style.marginTop = `${height}px`;
    image.firstElementChild.onload = this.aic_resizeImage.bind(null, image);
    this.esgst.aicPrevious = panel.firstElementChild;
    this.esgst.aicNext = this.esgst.aicPrevious.nextElementSibling;
    if (i > 0) {
      this.esgst.aicPrevious.addEventListener(`click`, this.aic_showImage.bind(this, carousel, i - 1));
    } else {
      this.esgst.aicPrevious.classList.add(`esgst-disabled`);
    }
    if (i < n - 1) {
      this.esgst.aicNext.addEventListener(`click`, this.aic_showImage.bind(this, carousel, i + 1));
    } else {
      this.esgst.aicNext.classList.add(`esgst-disabled`);
    }
    if (attachedImage.source) {
      panel.lastElementChild.addEventListener(`click`, () => {
        carousel.remove();
        if (attachedImage.qiv && this.esgst.qiv.popout) {
          this.esgst.qiv.popout.open();
        }
      });
    }
  }

  aic_resizeImage(image) {
    image.firstElementChild.style.maxHeight = `${image.offsetHeight - 10}px`;
    image.firstElementChild.style.maxWidth = `${image.offsetWidth - 10}px`;
  }
}

export default GeneralAttachedImageCarousel;