_MODULES.push({
    conflicts: [
      {id: `ail`, name: `Attached Image Loader`}
    ],
    description: `
      <ul>
        <li>Displays all of the attached images (in any page) by default so that you do not need to click on "View attached image" to view them.</li>
      </ul>
    `,
    features: {
      vai_gifv: {
        name: `Rename .gifv images to .gif so that they are properly attached.`,
        sg: true,
        st: true
      }
    },
    id: `vai`,
    load: vai,
    name: `Visible Attached Images`,
    sg: true,
    st: true,
    type: `general`
  });

  function vai() {
    esgst.endlessFeatures.push(vai_getImages);
  }

  function vai_getImages(context, main, source, endless) {
    let buttons = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .comment__toggle-attached, .esgst-es-page-${endless}.comment__toggle-attached` : `.comment__toggle-attached`}, ${endless ? `.esgst-es-page-${endless} .view_attached, .esgst-es-page-${endless}.view_attached` : `.view_attached`}`);
    for (let i = 0, n = buttons.length; i < n; i++) {
      let button = buttons[i];
      let image = button.nextElementSibling.firstElementChild;
      let url = image.getAttribute(`src`);
      if (url && esgst.vai_gifv) {
        url = url.replace(/\.gifv/, `.gif`);
        image.setAttribute(`src`, url);
      }
      image.classList.remove(`is_hidden`, `is-hidden`);
    }
  }

