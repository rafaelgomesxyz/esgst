_MODULES.push({
    description: `
      <ul>
        <li>Moves the reply box over the comments (in any page) so that you do not need to scroll down to the bottom of the page to add a comment.</li>
      </ul>
    `,
    id: `rbot`,
    load: rbot,
    name: `Reply Box On Top`,
    sg: true,
    st: true,
    type: `comments`
  });

  function rbot() {
    let element = esgst.mainPageHeading;
    if (!esgst.replyBox) {
      if (esgst.st && esgst.userPath) {
        let review = document.getElementsByClassName(`notification yellow`)[0];
        if (!review) return;
        element.parentElement.insertBefore(review, element.nextElementSibling);
      }
      return;
    }
    let box = createElements(element, `afterEnd`, [{
      attributes: {
        class: `esgst-rbot`
      },
      type: `div`
    }]);
    box.appendChild(esgst.replyBox);
    let button = box.getElementsByClassName(esgst.cancelButtonClass)[0];
    if (!button) return;
    button.addEventListener(`click`, setTimeout.bind(null, box.appendChild.bind(box, esgst.replyBox), 0));
  }

