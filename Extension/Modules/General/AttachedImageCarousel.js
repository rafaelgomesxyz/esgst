_MODULES.push({
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
    load: aic,
    name: `Attached Image Carousel`,
    sg: true,
    st: true,
    type: `general`
  });

  function aic() {
    esgst.endlessFeatures.push(aic_getImages);
    esgst.documentEvents.keydown.push(aic_move);
    if (!esgst.mainPageHeading) return;
    esgst.aicButton = createHeadingButton({id: `aic`, icons: [`fa-image`], title: `View attached images`});
    esgst.aicButton.classList.add(`esgst-hidden`);
    esgst.aicButton.addEventListener(`click`, aic_openCarousel.bind(null, 0, null));
  }

  function aic_move(event) {
    if (event.key === `ArrowLeft` && esgst.aicPrevious) {
      esgst.aicPrevious.click();
    }
    if (event.key === `ArrowRight` && esgst.aicNext) {
      esgst.aicNext.click();
    }
  }

  function aic_getImages(context, main, source, endless) {
    let buttons = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .comment__toggle-attached, .esgst-es-page-${endless}.comment__toggle-attached` : `.comment__toggle-attached`}, ${endless ? `.esgst-es-page-${endless} .view_attached, .esgst-es-page-${endless}.view_attached` : `.view_attached`}`);
    let found = false;
    for (let i = 0, n = buttons.length; i < n; i++) {
      let button = buttons[i];
      let image = button.nextElementSibling.firstElementChild;
      let url = image.getAttribute(`src`);
      let index = esgst.attachedImages.length;
      if (!esgst.aic_b) {
        image.addEventListener(`click`, aic_openCarousel.bind(null, index));
      }
      let comment = button.closest(`.comment`);
      esgst.attachedImages.push({
        button: button,
        image: image,
        outerWrap: button,
        qiv: context.getAttribute && context.getAttribute(`data-esgst-qiv`),
        source: comment && comment.querySelector(`.comment__summary`).id,
        url: url
      });
      found = true;
    }
    if (!found || !esgst.aicButton) {
      return;
    }
    esgst.aicButton.classList.remove(`esgst-hidden`);
  }

  function aic_openCarousel(i, event) {
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
    carousel.addEventListener(`click`, aic_removeCarousel);
    aic_showImage(carousel, i);
  }

  function aic_removeCarousel(event) {
    if (event.target.closest(`.esgst-aic-panel`) || event.target.closest(`img`)) return;

    event.currentTarget.remove();
  }

  function aic_showImage(carousel, i) {
    let attachedImage, height, image, n, panel;
    n = esgst.attachedImages.length;
    attachedImage = esgst.attachedImages[i];
    if (esgst.ail) {
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
    image.firstElementChild.onload = aic_resizeImage.bind(null, image);
    esgst.aicPrevious = panel.firstElementChild;
    esgst.aicNext = esgst.aicPrevious.nextElementSibling;
    if (i > 0) {
      esgst.aicPrevious.addEventListener(`click`, aic_showImage.bind(null, carousel, i - 1));
    } else {
      esgst.aicPrevious.classList.add(`esgst-disabled`);
    }
    if (i < n - 1) {
      esgst.aicNext.addEventListener(`click`, aic_showImage.bind(null, carousel, i + 1));
    } else {
      esgst.aicNext.classList.add(`esgst-disabled`);
    }
    if (attachedImage.source) {
      panel.lastElementChild.addEventListener(`click`, () => {
        carousel.remove();
        if (attachedImage.qiv && esgst.qiv.popout) {
          esgst.qiv.popout.open();
        }
      });
    }
  }

  function aic_resizeImage(image) {
    image.firstElementChild.style.maxHeight = `${image.offsetHeight - 10}px`;
    image.firstElementChild.style.maxWidth = `${image.offsetWidth - 10}px`;
  }

