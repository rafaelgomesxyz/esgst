_MODULES.push({
    description: `
      <ul>
        <li>Allows you to perform many different tasks by pressing certain keys.</li>
      </ul>
    `,
    features: {
      sk_cp: {
        inputItems: `sk_closePopups`,
        name: `Close all currently opened popups.`,
        sg: true,
        st: true
      },
      sk_sb: {
        inputItems: `sk_searchBox`,
        name: `Focus on the search box.`,
        sg: true,
        st: true
      },
      sk_fp: {
        inputItems: `sk_firstPage`,
        name: `Go to the first page.`,
        sg: true,
        st: true
      },
      sk_pp: {
        inputItems: `sk_previousPage`,
        name: `Go to the previous page.`,
        sg: true,
        st: true
      },
      sk_np: {
        inputItems: `sk_nextPage`,
        name: `Go to the next page.`,
        sg: true,
        st: true
      },
      sk_lp: {
        inputItems: `sk_lastPage`,
        name: `Go to the last page.`,
        sg: true,
        st: true
      },
      sk_tf: {
        inputItems: `sk_toggleFilters`,
        name: `Toggle the giveaway filters.`,
        sg: true
      },
      sk_hg: {
        inputItems: `sk_hideGame`,
        name: `Hide the game when inside of a giveaway.`,
        sg: true
      },
      sk_hga: {
        inputItems: `sk_hideGiveaway`,
        name: `Hide the giveaway when inside of a giveaway.`,
        sg: true
      },
      sk_ge: {
        inputItems: `sk_giveawayEntry`,
        name: `Enter/leave the giveaway when inside of a giveaway.`,
        sg: true
      },
      sk_c: {
        inputItems: `sk_creator`,
        name: `Insert the username of the creator of the giveaway/discussion/trade to the current reply box.`,
        sg: true,
        st: true
      },
      sk_rb: {
        inputItems: `sk_replyBox`,
        name: `Focus on the reply box.`,
        sg: true,
        st: true
      },
      sk_ru: {
        inputItems: `sk_replyUser`,
        name: `Insert the username of the user to whom you are replying to the current reply box.`,
        sg: true,
        st: true
      },
      sk_sr: {
        inputItems: `sk_submitReply`,
        name: `Submit the current reply.`,
        sg: true,
        st: true
      }
    },
    id: `sk`,
    load: sk,
    name: `Shortcut Keys`,
    sg: true,
    st: true,
    type: `general`
  });

  function sk() {
    let methods = {};
    if (esgst.sk_cp) {
      methods[esgst.sk_closePopups] = event => {
        if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/)) {
          let buttons = document.querySelectorAll(`.b-close, .esgst-popup-close`), i;
          for (i = buttons.length - 1; i > -1; --i) {
            buttons[i].click();
          }
          event.preventDefault();
        }
      };
    }
    if (esgst.sk_sb) {
      methods[esgst.sk_searchBox] = event => {
        if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/)) {
          let search = document.getElementsByClassName(`sidebar__search-input`)[0];
          if (search) {
            search.focus();
            event.preventDefault();
          }
        }
      };
    }
    if (esgst.sk_fp) {
      methods[esgst.sk_firstPage] = event => {
        if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) && esgst.paginationNavigation && esgst.currentPage > 1) {
          location.href = `${esgst.searchUrl}1`;
          event.preventDefault();
        }
      };
    }
    if (esgst.sk_pp) {
      methods[esgst.sk_previousPage] = event => {
        if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) && esgst.paginationNavigation && esgst.currentPage > 1) {
          location.href = `${esgst.searchUrl}${esgst.currentPage - 1}`;
          event.preventDefault();
        }
      };
    }
    if (esgst.sk_np) {
      methods[esgst.sk_nextPage] = event => {
        if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) && esgst.paginationNavigation && esgst.currentPage < esgst.lastPage) {
          location.href = `${esgst.searchUrl}${esgst.currentPage + 1}`;
          event.preventDefault();
        }
      };
    }
    if (esgst.sk_lp) {
      methods[esgst.sk_lastPage] = event => {
        if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) && esgst.paginationNavigation && esgst.currentPage < esgst.lastPage && esgst.lastPage !== 999999999) {
          location.href = `${esgst.searchUrl}${esgst.lastPage}`;
          event.preventDefault();
        }
      };
    }
    if (esgst.sk_tf) {
      methods[esgst.sk_toggleFilters] = event => {
        if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/)) {
          let toggle = document.querySelector(`.esgst-gf-toggle-switch`);
          if (toggle) {
            toggle.click();
            event.preventDefault();
          }
        }
      };
    }
    if (esgst.sk_hg) {
      methods[esgst.sk_hideGame] = event => {
        if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) && esgst.giveawayPath) {
          let button = (document.getElementsByClassName(`popup--hide-games`)[0].style.display && document.getElementsByClassName(`popup--hide-games`)[0].style.display !== `none` && document.getElementsByClassName(`js__submit-hide-games`)[0]) || document.querySelector(`.esgst-ochgb, .giveaway__hide, .featured__giveaway__hide`);
          if (button) {
            (button.classList.contains(`esgst-ochgb`) ? button.firstElementChild : button).click();
            event.preventDefault();
          }
        }
      };
    }
    if (esgst.sk_hga) {
      methods[esgst.sk_hideGiveaway] = event => {
        if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) && esgst.giveawayPath) {
          let button = document.querySelector(`.esgst-gf-hide-button, .esgst-gf-unhide-button`);
          if (button) {
            button.firstElementChild.click();
            event.preventDefault();
          }
        }
      };
    }
    if (esgst.sk_ge) {
      methods[esgst.sk_giveawayEntry] = event => {
        if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) && esgst.enterGiveawayButton) {
          if (esgst.enterGiveawayButton.classList.contains(`is-hidden`)) {
            esgst.leaveGiveawayButton.click();
          } else {
            esgst.enterGiveawayButton.click();
          }
          event.preventDefault();
        }
      };
    }
    if (esgst.sk_c) {
      methods[esgst.sk_creator] = event => {
        if (event.target.tagName.match(/^(INPUT|TEXTAREA)$/)) {
          let text = event.target.value;
          let end = event.target.selectionEnd;
          let creator = document.querySelector(`.featured__column--width-fill.text-right a, .comment__username, .author_name`);
          if (creator) {
            creator = creator.textContent;
            let range = end + creator.length;
            event.target.value = `${text.slice(0, event.target.selectionStart)}${creator}${text.slice(end)}`;
            event.target.setSelectionRange(range, range);
            event.target.focus();
            event.preventDefault();
          }
        }
      };
    }
    if (esgst.sk_rb) {
      methods[esgst.sk_replyBox] = event => {
        if (!event.target.tagName.match(/^(INPUT|TEXTAREA)$/) && esgst.replyBox) {
          esgst.replyBox.getElementsByTagName(`textarea`)[0].focus();
          event.preventDefault();
        }
      };
    }
    if (esgst.sk_ru) {
      methods[esgst.sk_replyUser] = event => {
        if (event.target.tagName === `TEXTAREA`) {
          let text = event.target.value;
          let end = event.target.selectionEnd;
          let user = event.target.closest(`.comment__children, .comment_children`);
          user = (user && user.closest(`.comment, .comment_outer`).querySelector(`.comment__username, .author_name`)) || document.querySelector(`.featured__column--width-fill.text-right a, .comment__username, .author_name`);
          if (user) {
            user = user.textContent;
            let range = end + user.length;
            event.target.value = `${text.slice(0, event.target.selectionStart)}${user}${text.slice(end)}`;
            event.target.setSelectionRange(range, range);
            event.target.focus();
            event.preventDefault();
          }
        }
      };
    }
    if (esgst.sk_sr) {
      methods[esgst.sk_submitReply] = event => {
        if (event.target.tagName === `TEXTAREA`) {
          let reply = event.target.closest(`.comment, .reply_form, .esgst-popup`);
          if (reply) {
            let button = reply.querySelector(`.esgst-button-set >:first-child, .js_submit`);
            if (button) {
              button.click();
              event.preventDefault();
            }
          }
        }
      };
    }
    if (Object.keys(methods).length > 0) {
      esgst.documentEvents.keydown.add(event => {
        let value = ``;
        if (event.ctrlKey) {
          value += `ctrlKey + `;
        } else if (event.shiftKey) {
          value += `shiftKey + `;
        } else if (event.altKey) {
          value += `altKey + `;
        }
        value += event.key.toLowerCase();
        if (methods[value]) {
          event.stopPropagation();
          methods[value](event);
        }
      });
    }
  }

