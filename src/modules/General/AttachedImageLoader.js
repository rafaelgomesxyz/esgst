import Module from '../../class/Module';

class GeneralAttachedImageLoader extends Module {
  info = ({
    conflicts: [
      {id: `vai`, name: `Visible Attached Images`}
    ],
    description: `
      <ul>
        <li>Only loads an attached image (in any page) when you click on its "View attached image" button, instead of loading it on page load, which should speed up page loads.</li>
      </ul>
    `,
    id: `ail`,
    load: this.ail,
    name: `Attached Image Loader`,
    sg: true,
    st: true,
    type: `general`
  });

  ail() {
    if (this.esgst.vai) return;
    this.esgst.endlessFeatures.push(this.ail_getImages);
  }

  ail_getImages(context, main, source, endless) {
    const buttons = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .comment__toggle-attached, .esgst-es-page-${endless}.comment__toggle-attached` : `.comment__toggle-attached`}, ${endless ? `.esgst-es-page-${endless} .view_attached, .esgst-es-page-${endless}.view_attached` : `.view_attached`}`);
    for (let i = 0, n = buttons.length; i < n; i++) {
      const button = buttons[i],
          image = button.nextElementSibling.firstElementChild,
          url = image.getAttribute(`src`);
      image.removeAttribute(`src`);
      button.addEventListener(`click`, image.setAttribute.bind(image, `src`, url));
    }
  }
}

export default GeneralAttachedImageLoader;