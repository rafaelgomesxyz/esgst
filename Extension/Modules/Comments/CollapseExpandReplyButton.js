_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-plus-square"></i> if all of the replies in the page are collapsed and <i class="fa fa-minus-square"></i> if they are expanded) above the comments (in any page) that allows you to collapse/expand all of the replies (comments nested 2 or more levels deep) in the page.</li>
        <li>Also adds the same button in front of each comment nested 1 level deep in the page, which allows you to collapse/expand the replies of the comment individually.</li>
      </ul>
    `,
    features: {
      cerb_a: {
        name: `Automatically collapse all replies when visiting a page.`,
        sg: true,
        st: true
      }
    },
    id: `cerb`,
    load: cerb,
    name: `Collapse/Expand Reply Button`,
    sg: true,
    st: true,
    type: `comments`
  });

  function cerb() {
    if (!esgst.commentsPath) return;
    let button, collapse, comments, expand;
    comments = document.getElementsByClassName(`comments`)[0];
    if (comments && comments.children.length) {
      esgst.cerbButtons = [];
      button = createElements(esgst.mainPageHeading, `afterEnd`, [{
        attributes: {
          class: `esgst-cerb-button esgst-clickable`
        },
        type: `div`,
        children: [{
          type: `span`,
          children: [{
            attributes: {
              class: `fa fa-minus-square`
            },
            type: `i`
          }, {
            text: ` Collapse all replies`,
            type: `node`
          }]
        }, {
          attributes: {
            class: `esgst-hidden`
          },
          type: `span`,
          children: [{
            attributes: {
              class: `fa fa-plus-square`
            },
            type: `i`
          }, {
            text: ` Expand all replies`,
            type: `node`
          }]
        }]
      }]);
      collapse = button.firstElementChild;
      expand = collapse.nextElementSibling;
      collapse.addEventListener(`click`, cerb_collapseAllReplies.bind(null, collapse, expand));
      expand.addEventListener(`click`, cerb_expandAllReplies.bind(null, collapse, expand));
      esgst.endlessFeatures.push(cerb_getReplies.bind(null, collapse, expand));
    }
  }

  function cerb_getReplies(collapse, expand, context, main, source, endless) {
    let id = context === document && main ? location.hash.replace(/#/, ``) : null,
      permalink = id ? document.getElementById(id) : null,
      elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} :not(.esgst-popup) .comments > .comment, .esgst-es-page-${endless}:not(.esgst-popup) .comments > .comment` : `:not(.esgst-popup) .comments > .comment`}, ${endless ? `.esgst-es-page-${endless} :not(.esgst-popup) .comments > .comment_outer, .esgst-es-page-${endless}:not(.esgst-popup) .comments > .comment_outer` : `:not(.esgst-popup) .comments > .comment_outer`}`);
    if (!elements.length) return;
    for (let reply of elements) {
      let replies = reply.querySelector(`.comment__children, .comment_children`);
      if (replies && replies.children.length) {
        cerb_setButton(createElements(reply.firstElementChild, `afterBegin`, [{
          attributes: {
            class: `esgst-cerb-reply-button esgst-clickable`
          },
          type: `div`,
          children: [{
            attributes: {
              title: getFeatureTooltip(`cerb`, `Collapse all replies`)
            },
            type: `span`,
            children: [{
              attributes: {
                class: `fa fa-minus-square`
              },
            }]
          }, {
            attributes: {
              class: `esgst-hidden`,
              title: getFeatureTooltip(`cerb`, `Expand all replies`)
            },
            type: `span`,
            children: [{
              attributes: {
                class: `fa fa-plus-square`
              },
            }]
          }]
        }]), permalink && reply.contains(permalink), reply, replies.children);
      }
    }
    if (esgst.cerb_a) {
      cerb_collapseAllReplies(collapse, expand);
    }
  }

  function cerb_setButton(button, permalink,  reply, replies) {
    let collapse, expand;
    collapse = button.firstElementChild;
    expand = collapse.nextElementSibling;
    esgst.cerbButtons.push({
      collapse: cerb_collapseReplies.bind(null, collapse, expand, replies),
      expand: cerb_expandReplies.bind(null, collapse, expand, replies),
      permalink: permalink
    });
    collapse.addEventListener(`click`, cerb_collapseReplies.bind(null, collapse, expand, replies));
    expand.addEventListener(`click`, cerb_expandReplies.bind(null, collapse, expand, replies));
    if (esgst.cerb_a && !permalink) {
      collapse.classList.toggle(`esgst-hidden`);
      expand.classList.toggle(`esgst-hidden`);
    }
  }

  function cerb_collapseReplies(collapse, expand, replies) {
    let i, n;
    for (i = 0, n = replies.length; i < n; ++i) {
      replies[i].classList.add(`esgst-hidden`);
    }
    collapse.classList.add(`esgst-hidden`);
    expand.classList.remove(`esgst-hidden`);
  }

  function cerb_expandReplies(collapse, expand, replies) {
    let i, n;
    for (i = 0, n = replies.length; i < n; ++i) {
      replies[i].classList.remove(`esgst-hidden`);
    }
    collapse.classList.remove(`esgst-hidden`);
    expand.classList.add(`esgst-hidden`);
  }

  function cerb_collapseAllReplies(collapse, expand) {
    let i, n;
    for (i = 0, n = esgst.cerbButtons.length; i < n; ++i) {
      if (!esgst.cerbButtons[i].permalink) {
        esgst.cerbButtons[i].collapse();
      }
    }
    collapse.classList.add(`esgst-hidden`);
    expand.classList.remove(`esgst-hidden`);
  }

  function cerb_expandAllReplies(collapse, expand) {
    let i, n;
    for (i = 0, n = esgst.cerbButtons.length; i < n; ++i) {
      esgst.cerbButtons[i].expand();
    }
    collapse.classList.remove(`esgst-hidden`);
    expand.classList.add(`esgst-hidden`);
  }

