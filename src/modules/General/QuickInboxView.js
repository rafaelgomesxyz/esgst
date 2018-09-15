_MODULES.push({
    description: `
      <ul>
        <li>If you hover over the inbox icon (<i class="fa fa-envelope"></i>) at the header, it shows a popout with your messages so that you do not need to access your inbox page to read them.</li>
        <li>You can also mark the messages as read from the popout and reply to them if [id=rfi] is enabled.</li>
      </ul>
    `,
    features: {
      qiv_p: {
        description: `
          <ul>
            <li>Preloads the first page so that you do not have to wait for it to load after hovering over the inbox icon (this can slow down the page load though).</li>
          </ul>
        `,
        name: `Preload the first page.`,
        sg: true,
        st: true
      }
    },
    id: `qiv`,
    load: qiv.bind(null, true),
    name: `Quick Inbox View`,
    sg: true,
    st: true,
    type: `general`
  });

  function qiv(first) {
    if (!esgst.inboxButton) return;

    if (typeof esgst.qiv !== `object`) {
      esgst.qiv = {
        nextPage: 1
      };
    }

    if (first && esgst.qiv_p) {
      esgst.qiv.popout = new Popout(`esgst-qiv-popout`, null, 1000);
      esgst.qiv.popout.onClose = qiv_removeNew;
      if (esgst.messageCount > 0) {
        qiv_addMarkReadButton();
      }
      esgst.qiv.comments = createElements(esgst.qiv.popout.popout, `beforeEnd`, [{
        attributes: {
          class: `esgst-qiv-comments`
        },
        type: `div`
      }]);
      esgst.qiv.comments.addEventListener(`scroll`, qiv_scroll.bind(null, false, false));
      qiv_scroll(true);
    }
    esgst.inboxButton.addEventListener(`mouseenter`, qiv_openPopout);
    esgst.inboxButton.addEventListener(`mouseleave`, event => {
      if (esgst.qiv.timeout) {
        clearTimeout(esgst.qiv.timeout);
        esgst.qiv.timeout = null;
      }
      esgst.qiv.exitTimeout = setTimeout(() => {
        if (esgst.qiv.popout && !esgst.qiv.popout.popout.contains(event.relatedTarget)) {
          esgst.qiv.popout.close();
        }
      }, 1000);
    });
  }

  function qiv_openPopout() {
    esgst.qiv.timeout = setTimeout(() => {
      if (esgst.qiv.popout) {
        esgst.qiv.popout.open(esgst.inboxButton);
      } else {
        esgst.qiv.popout = new Popout(`esgst-qiv-popout`, null, 1000);
        esgst.qiv.popout.onClose = qiv_removeNew;
        if (esgst.messageCount > 0) {
          qiv_addMarkReadButton();
        }
        esgst.qiv.comments = createElements(esgst.qiv.popout.popout, `beforeEnd`, [{
          attributes: {
            class: `esgst-qiv-comments`
          },
          type: `div`
        }]);
        esgst.qiv.popout.open(esgst.inboxButton);
        esgst.qiv.comments.addEventListener(`scroll`, qiv_scroll.bind(null, false, false));
        qiv_scroll(true);
      }
      esgst.qiv.popout.popout.onmouseenter = () => {
        if (esgst.qiv.exitTimeout) {
          clearTimeout(esgst.qiv.exitTimeout);
          esgst.qiv.exitTimeout = null;
        }
      };
    }, 1000);
  }

  function qiv_removeNew() {
    const elements = esgst.qiv.popout.popout.getElementsByClassName(`esgst-qiv-new`);
    for (let i = elements.length - 1; i > -1; i--) {
      elements[i].remove();
    }
  }

  async function qiv_scroll(first, preload) {
    if ((first || preload || esgst.qiv.comments.scrollTop + esgst.qiv.comments.offsetHeight >= esgst.qiv.comments.scrollHeight) && !esgst.qiv.busy) {
      esgst.qiv.busy = true;
      const firstPage = esgst.qiv.comments.firstElementChild;
      let doContinue = false;
      do {
        const loading = createElements(
          esgst.qiv.popout.popout,
          first || preload ? `afterBegin` : `beforeEnd`, [{
            type: `span`,
            children: [{
              attributes: {
                class: `fa fa-circle-o-notch fa-spin`
              },
              type: `i`
            }, {
              text: ` Loading...`,
              type: `node`
            }]
          }]
        );
        esgst.qiv.popout.reposition(esgst.inboxButton);
        const context = parseHtml((await request({
          method: `GET`,
          url: `/messages/search?page=${esgst.qiv.nextPage}`
        })).responseText).querySelector(`.page__heading, .page_heading`).nextElementSibling;
        loading.remove();

        if (preload) {
          const currentId = esgst.qiv.comments.querySelector(`[href*="/go/comment/"]`)
                .getAttribute(`href`).match(/\/go\/comment\/(.+)/)[1],
              comments = context.querySelectorAll(`.comment, .comment_outer`);
          let i = comments.length - 1;
          while (i > -1 && comments[i].querySelector(`[href*="/go/comment/"]`).getAttribute(`href`).match(/\/go\/comment\/(.+)/)[1] !== currentId) i--;
          if (i > -1) {
            doContinue = false;
            i--;
            for (let j = comments.length - 1; j > i; j--) {
              const container = comments[j].parentElement;
              comments[j].remove();
              if (!container.children.length) {
                container.previousElementSibling.remove();
                container.remove();
              }
            }
          } else {
            doContinue = true;
          }
          if (context.children.length) {
            for (const element of comments) {
              createElements(element, `afterBegin`, [{
                attributes: {
                  class: `esgst-qiv-new esgst-warning`
                },
                text: `[NEW]`,
                type: `div`
              }]);
            }
            esgst.qiv.comments.insertBefore(context, firstPage);
          }
        } else {
          const comments = context.querySelectorAll(`.comment, .comment_outer`);
          let i = comments.length - 1;
          while (i > -1 && !esgst.qiv.comments.querySelector(`[href*="/go/comment/${comments[i].querySelector(`[href*="/go/comment/"]`).getAttribute(`href`).match(/\/go\/comment\/(.+)/)[1]}"]`)) i--;
          if (i > -1) {
            while (i > -1) {
              const container = comments[i].parentElements;
              comments[i].remove();
              if (!container.children.length) {
                container.previousElementSibling.remove();
                container.remove();
              }
              i--;
            }
            if (context.children.length) {
              doContinue = false;
            } else {
              doContinue = true;
            }
          } else {
            doContinue = false;
          }
          if (context.children.length) {
            esgst.qiv.comments.appendChild(context);
          }
        }
        if (context.children.length) {
          context.setAttribute(`data-esgst-qiv`, true);
          await endless_load(context);
        }
        if (esgst.qiv.popout.isOpen) {
          esgst.qiv.popout.reposition(esgst.inboxButton);
        }
        esgst.qiv.nextPage += 1;
      } while (doContinue);
      esgst.qiv.busy = false;
    }
  }

  function qiv_addMarkReadButton() {
    let key, url;
    if (esgst.qiv.markReadButton) return;
    if (esgst.sg) {
      esgst.qiv.markReadButton = createElements(esgst.qiv.popout.popout, `afterBegin`, [{
        attributes: {
          class: `sidebar__action-button`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa fa-check-circle`
          },
          type: `i`
        }, {
          text: ` Mark as Read`,
          type: `node`
        }]
      }]);
      key = `read_messages`;
      url = `/messages`;
    } else {
      esgst.qiv.markReadButton = createElements(esgst.qiv.popout.popout, `afterBegin`, [{
        attributes: {
          class: `page_heading_btn green`
        },
        type: `a`,
        children: [{
          attributes: {
            class: `fa fa-check-square-o`
          },
          type: `i`
        }, {
          text: `Mark as Read`,
          type: `span`
        }]
      }]);
      key = `mark_as_read`;
      url = `/ajax.php`;
    }
    esgst.qiv.markReadButton.addEventListener(`click`, async () => {
      await request({data: `xsrf_token=${esgst.xsrfToken}&do=${key}`, method: `POST`, url});
      esgst.qiv.markReadButton.remove();
      esgst.qiv.markReadButton = null;
      let elements = esgst.qiv.comments.querySelectorAll(`.comment__envelope`);
      for (let i = elements.length - 1; i > -1; i--) {
        elements[i].remove();
      }
      esgst.inboxButton.classList.remove(`nav__button-container--active`);
      esgst.messageCountContainer.remove();
      esgst.messageCount = 0;
      if (esgst.hr) {
        hr_notifyChange(esgst.hr);
      }
    });
  }

