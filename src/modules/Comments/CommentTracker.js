_MODULES.push({
    description: `
      <ul>
        <li>Keeps track of any comments (in any page) and fades out comments that you have marked as read so that you can easily see which comments you have read/unread in the page.</li>
        <li>Comments made by yourself are automatically marked as read.</li>
        <li>The comments are tracked by saving the date when they were made. If a comment is edited then the date when it was last edited is saved instead, so if you had previously marked a comment as read and that comment was edited, it will now appear as unread.</li>
        <li>Adds a panel to the "Comments" column of any <a href="https://www.steamgifts.com/discussions">discussions</a>/<a href="https://www.steamgifts.com/support/tickets">tickets</a>/<a href="https://www.steamtrades.com/trades">trades</a> pages and to the main page heading of any page containing:</li>
        <ul>
          <li>A red number in parenthesis indicating how many unread comments there are in the thread.</li>
          <li>A button (<i class="fa fa-comments"></i>) that allows you to go to the first unread comment of the thread/page.</li>
          <li>A button (<i class="fa fa-eye"></i>) that allows you to mark every comment in the thread/page as read.</li>
          <li>A button (<i class="fa fa-eye-slash"></i>) that allows you to mark every comment in the thread/page as unread.</li>
        </ul>
        <li>Adds a panel next a comment's "Permalink" (in any page) containing:</li>
        <ul>
          <li>A button (<i class="fa fa-eye"></i>) that allows you to mark the comment as read.</li>
          <li>A button (<i class="fa fa-eye-slash"></i>) that allows you to mark the comment as unread.</li>
          <li>A button (<i class="fa fa-eye"></i> <i class="fa fa-angle-double-right"></i>) that allows you to mark the comment as read and go to the next unread comment.</li>
          <li>A button (<i class="fa fa-eye"></i> <i class="fa fa-angle-up"></i>) that allows you to mark every comment from the comment upward as read.</li>
          <li>A button (<i class="fa fa-eye-slash"></i> <i class="fa fa-angle-up"></i>) that allows you to mark every comment from the comment upward as unread.</li>
        </ul>
      </ul>
    `,
    features: {
      ct_a: {
        name: `Automatically mark comments as read in the inbox page when clicking on the "Mark as Read" button.`,
        sg: true,
        st: true
      },
      ct_o: {
        name: `Automatically mark your own comments as read.`,
        sg: true,
        st: true
      },
      ct_c: {
        name: `Enable tracking controls for your own comments.`,
        sg: true,
        st: true
      },
      ct_s: {
        description: `
          <ul>
            <li>The simplified version of the tracker does not have the concept of read/unread comments, but simply shows the red number of comments that were made since you last visited a thread, so the comments are not tracked by date (they are tracked by quantity) and there are no buttons to go to the first unread comment of a thread/page or mark comments as read/unread.</li>
            <li>If you mark a thread as visited with [id=gdttt], all of the comments in the thread will be considered as "read", and if you mark it as unvisited, they will be considered as "unread".</li>
          </ul>
        `,
        features: {
          ct_s_h: {
            description: `
              <ul>
                <li>Only shows the red number for a thread after you have visited it.</li>
              </ul>
            `,
            name: `Hide the counter if you have not visited the thread yet.`,
            sg: true,
            st: true
          }
        },
        name: `Enable the simplified version.`,
        sg: true,
        st: true
      },
      ct_f: {
        name: `Fade out read comments.`,
        sg: true,
        st: true
      },
      ct_r: {
        description: `
          <ul>
            <li>Searches pages for an unread comment from the bottom to the top if [id=cr] is disabled or from the top to the bottom if it is enabled.</li>
          </ul>
        `,
        name: `Search for the first unread comment in reverse order.`,
        sg: true,
        st: true
      }
    },
    id: `ct`,
    load: ct,
    name: `Comment Tracker`,
    sg: true,
    st: true,
    type: `comments`
  });

  async function ct() {
    if (((esgst.commentsPath && (!esgst.giveawayPath || !document.getElementsByClassName(`table--summary`)[0])) || esgst.inboxPath) && !esgst.ct_s) {
      if (!esgst.ct_s) {
        let button3 = createHeadingButton({featureId: `ct`, id: `ctUnread`, icons: [`fa-eye-slash`], title: `Mark all comments in this page as unread`});
        let button2 = createHeadingButton({featureId: `ct`, id: `ctRead`, icons: [`fa-eye`], title: `Mark all comments in this page as read`});
        let button1 = createHeadingButton({featureId: `ct`, id: `ctGo`, icons: [`fa-comments-o`], title: `Go to the first unread comment of this page`});
        ct_addCommentPanel(button1, button2, button3);
      }
      let match = location.pathname.match(/\/(giveaway|discussion|ticket|trade)\/(.+?)\//);
      if (match) {
        let code, count, diff, comments, element, type;
        element = esgst.mainPageHeading.querySelector(`.page__heading__breadcrumbs, .page_heading_breadcrumbs`).firstElementChild;
        type = `${match[1]}s`;
        code = match[2];
        comments = JSON.parse(await getValue(type));
        count = parseInt(element.textContent.replace(/,/g, ``).match(/\d+/)[0]);
        if (comments[code]) {
          let id, read;
          if (esgst.ct_s) {
            read = comments[code].count || (esgst.ct_s_h ? count : 0);
          } else {
            read = 0;
            for (id in comments[code].readComments) {
              if (!id.match(/^(Count|undefined|)$/) && comments[code].readComments[id]) {
                ++read;
              }
            }
          }
          diff = count === read ? 0 : count - read;
        } else if (esgst.ct_s && esgst.ct_s_h) {
          diff = 0;
        } else {
          diff = count;
        }
        createElements(element, `beforeEnd`, [{
          attributes: {
            class: `esgst-ct-count`,
            title: getFeatureTooltip(`ct`, `Unread comments`)
          },
          text: ` (+${diff})`,
          type: `span`
        }]);
      }
    }
  }

  async function ct_addDiscussionPanels(context, main, source, endless, dh) {
    let code, comments, count, countLink, diff, heading, i, id, j, match, matches, n, read, url, key;
    matches = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .table__row-outer-wrap, .esgst-es-page-${endless}.table__row-outer-wrap` : `.table__row-outer-wrap`}, ${endless ? `.esgst-es-page-${endless} .row_outer_wrap, .esgst-es-page-${endless}.row_outer_wrap` : `.row_outer_wrap`}`);
    if (!matches.length) return;
    if (esgst.discussionsPath || dh) {
      key = `discussions`;
    } else if (esgst.ticketsPath) {
      key = `tickets`;
    } else if (esgst.tradesPath) {
      key = `trades`;
    } else {
      key = `discussions`;
    }
    comments = JSON.parse(await getValue(key, `{}`));
    for (i = 0, n = matches.length; i < n; ++i) {
      match = matches[i];
      countLink = match.querySelector(`.table__column__secondary-link[href*="/discussion/"], .table__column--width-small.text-center, .column_small.text_center`);
      if (countLink) {
        count = parseInt(countLink.textContent.replace(/,/g, ``));
        heading = match.querySelector(`.homepage_table_column_heading, .table__column__heading, .column_flex h3 a`);
        url = heading.getAttribute(`href`);
        if (url) {
          code = url.match(new RegExp(`/${key.slice(0, -1)}/(.+?)(/.*)?$`));
          if (code) {
            code = code[1];
            if (esgst.ust && key === `tickets` && (!comments[code] || !comments[code].sent) && match.getElementsByClassName(`table__column__secondary-link`)[0].textContent.trim().match(/Request\sNew\sWinner|User\sReport/)) {
              ust_addCheckbox(code, match);
            }
            if (esgst.gdttt || esgst.ct) {
              if (comments[code]) {
                if (esgst.ct_s) {
                  read = comments[code].count || (esgst.ct_s_h ? count : 0);
                } else {
                  read = 0;
                  for (id in comments[code].readComments) {
                    if (!id.match(/^(Count|undefined|)$/) && comments[code].readComments[id]) {
                      ++read;
                    }
                  }
                }
                diff = count === read ? 0 : count - read;
              } else if (esgst.ct_s && esgst.ct_s_h) {
                diff = 0;
              } else {
                diff = count;
              }
              let discussion = null;
              for (j = esgst.mainDiscussions.length - 1; j > -1 && esgst.mainDiscussions[j].code !== code; --j);
                if (j > -1) {
                discussion = esgst.mainDiscussions[j];
                }
              if (key === `discussions` && diff > 0 && discussion) {
                discussion.unread = true;
              }
              ct_addDiscussionPanel(code, comments, match, countLink, count, diff, url, key, dh, discussion);
            }
          }
        }
      }
    }
    if (esgst.df && esgst.df.filteredCount && esgst[`df_enable${esgst.df.type}`]) {
      filters_filter(esgst.df, false, endless);
    }
    if (esgst.ustButton) {
      if (esgst.numUstTickets > 0) {
        esgst.ustButton.classList.remove(`esgst-hidden`);
      } else {
        esgst.ustButton.classList.add(`esgst-hidden`);
      }
    }
  }

  async function ct_getComments(count, comments, index, goToUnread, markRead, markUnread, endless) {
    let found = false;
    if (goToUnread) {
      found = await ct_checkComments(count, comments, index, true, false, false, endless);
    } else {
      let deleteLock;
      if (!endless) {
        deleteLock = await createLock(`commentLock`, 300);
      }
      found = await ct_checkComments(count, comments, index, false, markRead, markUnread, endless);
      if (deleteLock) {
        deleteLock();
      }
    }
    return found;
  }

  async function ct_checkComments(count, comments, index, goToUnread, markRead, markUnread, endless) {
    let code, comment, found, i, n, saved, source, type, unread;
    esgst.ctGoToUnread = false;
    let values;
    if (endless) {
      if (esgst.sg) {
        saved = {
          giveaways: esgst.giveaways,
          discussions: esgst.discussions,
          tickets: esgst.tickets
        };
      } else {
        saved = {
          trades: esgst.trades
        };
      }
    } else {
      values = await getValues({
        giveaways: `{}`,
        discussions: `{}`,
        tickets: `{}`,
        trades: `{}`
      });
      if (esgst.sg) {
        saved = {
          giveaways: JSON.parse(values.giveaways),
          discussions: JSON.parse(values.discussions),
          tickets: JSON.parse(values.tickets)
        };
      } else {
        saved = {
          trades: JSON.parse(values.trades)
        };
      }
    }
    n = comments.length;
    found = false;
    if (n > 0) {
      for (i = index || 0; i < n; ++i) {
        comment = comments[i];
        if (comment.id || comment.id.match(/^$/)) {
          if (!saved[comment.type][comment.code]) {
            saved[comment.type][comment.code] = {
              readComments: {}
            };
          } else if (!saved[comment.type][comment.code].readComments) {
            saved[comment.type][comment.code].readComments = {};
          }
          if (count > 0) {
            saved[comment.type][comment.code].count = count;
          }
          if (esgst.gdttt && esgst[`gdttt_v${{
            giveaways: `g`,
            discussions: `d`,
            tickets: `t`,
            trades: `ts`
          }[comment.type]}`]) {
            saved[comment.type][comment.code].visited = true;
            let cache = JSON.parse(getLocalValue(`gdtttCache`, `{"giveaways":[],"discussions":[],"tickets":[],"trades":[]}`));
            if (cache[comment.type].indexOf(comment.code) < 0) {
              cache[comment.type].push(comment.code);
              setLocalValue(`gdtttCache`, JSON.stringify(cache));
            }
          }
          saved[comment.type][comment.code].lastUsed = Date.now();
          esgst.edited[comment.type] = true;
          if (!esgst.ct_s) {
            let buttons = comment.comment.getElementsByClassName(`esgst-ct-comment-button`);
            if (comment.author === esgst.username) {
              if (esgst.ct_c) {
                if (!saved[comment.type][comment.code].readComments[comment.id] || comment.timestamp !== saved[comment.type][comment.code].readComments[comment.id]) {
                  if (markRead) {
                    ct_markCommentRead(comment, saved);
                    ct_addUnreadCommentButton(buttons[0], comment);
                  } else {
                    ct_markCommentUnread(comment, saved);
                    ct_addReadCommentButton(buttons[0], comment);
                  }
                } else {
                  if (markUnread) {
                    ct_markCommentUnread(comment, saved);
                    ct_addReadCommentButton(buttons[0], comment);
                  } else {
                    ct_markCommentRead(comment, saved);
                    ct_addUnreadCommentButton(buttons[0], comment);
                  }
                }
                ct_addReadUntilHereButton(buttons[1], comment);
                ct_addUnreadUntilHereButton(buttons[2], comment);
              }
              if (esgst.ct_o) {
                ct_markCommentRead(comment, saved);
                if (esgst.ct_c) {
                  ct_addUnreadCommentButton(buttons[0], comment);
                }
              }
            } else if (!saved[comment.type][comment.code].readComments[comment.id] || comment.timestamp !== saved[comment.type][comment.code].readComments[comment.id]) {
              if (goToUnread && (!esgst.ctGoToUnread || ((((esgst.ct_r && !esgst.cr) || (!esgst.ct_r && esgst.cr)) && comment.comment.offsetTop <  scrollY + esgst.commentsTop) || (((!esgst.ct_r && !esgst.cr) || (esgst.ct_r && esgst.cr)) && comment.comment.offsetTop >  scrollY + esgst.commentsTop)))) {
                esgst.ctGoToUnread = true;
                if ((esgst.discussionPath && ((!esgst.ct_r && !esgst.cr) || (esgst.ct_r && esgst.cr))) || (!esgst.discussionPath && !esgst.ct_r)) {
                  unread = comment;
                  found = true;
                } else {
                  if (esgst.discussionsPath) {
                    esgst.ctUnreadFound = true;
                    if (!esgst.ctNewTab && esgst.sto) {
                      if (comment.id) {
                        location.href = `/go/comment/${comment.id}`;
                      } else {
                        location.href = `/discussion/${comment.code}/`;
                      }
                    } else {
                      if (comment.id) {
                        open(`/go/comment/${comment.id}`);
                      } else {
                        open(`/discussion/${comment.code}/`);
                      }
                    }
                  } else {
                    goToComment(comment.id, comment.comment);
                  }
                  found = true;
                  break;
                }
              } else {
                if (markRead) {
                  ct_markCommentRead(comment, saved);
                  ct_addUnreadCommentButton(buttons[0], comment);
                } else {
                  ct_markCommentUnread(comment, saved);
                  ct_addReadCommentButton(buttons[0], comment);
                }
                ct_addReadUntilHereButton(buttons[1], comment);
                ct_addUnreadUntilHereButton(buttons[2], comment);
              }
            } else {
              if (markUnread) {
                ct_markCommentUnread(comment, saved);
                ct_addReadCommentButton(buttons[0], comment);
              } else {
                ct_markCommentRead(comment, saved);
                ct_addUnreadCommentButton(buttons[0], comment);
              }
              ct_addReadUntilHereButton(buttons[1], comment);
              ct_addUnreadUntilHereButton(buttons[2], comment);
            }
          }
        }
      }
      if (!esgst.ct_s && goToUnread) {
        if (unread) {
          if (esgst.discussionsPath) {
            esgst.ctUnreadFound = true;
            if (!esgst.ctNewTab && esgst.sto) {
              if (unread.id) {
                location.href = `/go/comment/${unread.id}`;
              } else {
                location.href = `/discussion/${unread.code}/`;
              }
            } else {
              if (unread.id) {
                open(`/go/comment/${unread.id}`);
              } else {
                open(`/discussion/${unread.code}/`);
              }
            }
          } else {
            goToComment(unread.id, unread.comment);
          }
        }
      } else if (!endless) {
        if (esgst.sg) {
          await setValues({
            giveaways: JSON.stringify(saved.giveaways),
            discussions: JSON.stringify(saved.discussions),
            tickets: JSON.stringify(saved.tickets)
          });
        } else {
          await setValue(`trades`, JSON.stringify(saved.trades));
        }
      }
    } else {
      source = location.pathname.match(/(giveaway|discussion|trade|ticket)\/(.+?)(\/.*)?$/);
      if (source) {
        type = `${source[1]}s`;
        code = source[2];
        if (!saved[type][code]) {
          saved[type][code] = {
            readComments: {},
            visited: true
          };
        }
        if (count > 0) {
          saved[type][code].count = count;
        }
        saved[type][code].lastUsed = Date.now();
        esgst.edited[type] = true;
        if (!endless) {
          if (esgst.sg) {
            await setValues({
              giveaways: JSON.stringify(saved.giveaways),
              discussions: JSON.stringify(saved.discussions),
              tickets: JSON.stringify(saved.tickets)
            });
          } else {
            await setValue(`trades`, JSON.stringify(saved.trades));
          }
        }
      }
    }
    return found;
  }

  async function ct_markCommentRead(comment, comments, save) {
    let count;
    if (save) {
      let deleteLock = await createLock(`commentLock`, 300);
      comments = JSON.parse(await getValue(comment.type));
      if (comment.id && !comments[comment.code].readComments[comment.id] && esgst.commentsPath) {
        count = document.getElementsByClassName(`esgst-ct-count`)[0];
        count.textContent = ` (+${parseInt(count.textContent.match(/\d+/)[0]) - 1})`;
      }
      comments[comment.code].readComments[comment.id] = comment.timestamp;
      await setValue(comment.type, JSON.stringify(comments));
      deleteLock();
      if (esgst.ct_f) {
        comment.comment.classList.add(`esgst-ct-comment-read`);
        comment.comment.style.opacity = `0.5`;
        setHoverOpacity(comment.comment, `1`, `0.5`);
      }
    } else {
      if (comments) {
        if (comment.id && !comments[comment.type][comment.code].readComments[comment.id] && esgst.commentsPath) {
          count = document.getElementsByClassName(`esgst-ct-count`)[0];
          count.textContent = ` (+${parseInt(count.textContent.match(/\d+/)[0]) - 1})`;
        }
        comments[comment.type][comment.code].readComments[comment.id] = comment.timestamp;
      }
      if (esgst.ct_f) {
        comment.comment.classList.add(`esgst-ct-comment-read`);
        comment.comment.style.opacity = `0.5`;
        setHoverOpacity(comment.comment, `1`, `0.5`);
      }
    }
  }

  async function ct_markCommentUnread(comment, comments, save) {
    let count;
    if (save) {
      let deleteLock = await createLock(`commentLock`, 300);
      comments = JSON.parse(await getValue(comment.type));
      if (comments[comment.code].readComments[comment.id]) {
        delete comments[comment.code].readComments[comment.id];
        if (comment.id && esgst.commentsPath) {
          count = document.getElementsByClassName(`esgst-ct-count`)[0];
          count.textContent = ` (+${parseInt(count.textContent.match(/\d+/)[0]) + 1})`;
        }
      }
      await setValue(comment.type, JSON.stringify(comments));
      deleteLock();
      if (esgst.ct_f) {
        comment.comment.classList.remove(`esgst-ct-comment-read`);
        comment.comment.style.opacity = `1`;
        setHoverOpacity(comment.comment, `1`, `1`);
      }
    } else {
      if (comments && comments[comment.type][comment.code].readComments[comment.id]) {
        if (comment.id && esgst.commentsPath) {
          count = document.getElementsByClassName(`esgst-ct-count`)[0];
          count.textContent = ` (+${parseInt(count.textContent.match(/\d+/)[0]) + 1})`;
        }
        delete comments[comment.type][comment.code].readComments[comment.id];
      }
      if (esgst.ct_f) {
        comment.comment.classList.remove(`esgst-ct-comment-read`);
        comment.comment.style.opacity = `1`;
        setHoverOpacity(comment.comment, `1`, `1`);
      }
    }
  }

  function ct_addReadUntilHereButton(button, comment) {
    if (!button) {
      button = createElements(comment.actions, `beforeEnd`, [{
        attributes: {
          class: `esgst-ct-comment-button`,
          title: `${getFeatureTooltip(`ct`, `Mark all comments from this comment upwards as read`)}`
        },
        type: `div`
      }]);
    }
    createElements(button, `inner`, [{
      type: `span`,
      children: [{
        attributes: {
          class: `fa fa-eye`
        },
        type: `i`
      }, {
        attributes: {
          class: `fa fa-angle-up`
        },
        type: `i`
      }]
    }]);
    button.firstElementChild.addEventListener(`click`, ct_readUntilHere.bind(null, button, comment));
  }

  async function ct_readUntilHere(button, comment) {
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    await ct_getComments(0, esgst.mainComments, comment.index, false, true, false);
    ct_addReadUntilHereButton(button, comment);
  }

  function ct_addUnreadUntilHereButton(button, comment) {
    if (!button) {
      button = createElements(comment.actions, `beforeEnd`, [{
        attributes: {
          class: `esgst-ct-comment-button`,
          title: `${getFeatureTooltip(`ct`, `Mark all comments from this comment upwards as unread`)}`
        },
        type: `div`
      }]);
    }
    createElements(button, `inner`, [{
      type: `span`,
      children: [{
        attributes: {
          class: `fa fa-eye-slash`
        },
        type: `i`
      }, {
        attributes: {
          class: `fa fa-angle-up`
        },
        type: `i`
      }]
    }]);
    button.firstElementChild.addEventListener(`click`, ct_unreadUntilHere.bind(null, button, comment));
  }

  async function ct_unreadUntilHere(button, comment) {
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    await ct_getComments(0, esgst.mainComments, comment.index, false, false, true);
    ct_addUnreadUntilHereButton(button, comment);
  }

  function ct_addReadCommentButton(button, comment) {
    if (!button) {
      button = createElements(comment.actions, `beforeEnd`, [{
        attributes: {
          class: `esgst-ct-comment-button`
        },
        type: `div`
      }]);
    }
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-eye`,
        title: getFeatureTooltip(`ct`, `Mark this comment as read`)
      },
      type: `i`
    }, {
      attributes: {
        title: getFeatureTooltip(`ct`, `Mark this comment as read and go to the next unread comment`)
      },
      type: `span`,
      children: [{
        attributes: {
          class: `fa fa-eye`
        },
        type: `i`
      }, {
        attributes: {
          class: `fa fa-angle-double-right`
        },
        type: `i`
      }]
    }]);
    button.firstElementChild.addEventListener(`click`, ct_readComment.bind(null, button, comment));
    button.lastElementChild.addEventListener(`click`, ct_readCommentAndGo.bind(null, button, comment));
  }

  async function ct_readComment(button, comment) {
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    await ct_markCommentRead(comment, null, true);
    button.innerHTML = ``;
    ct_addUnreadCommentButton(button, comment);
  }

  async function ct_readCommentAndGo(button, comment) {
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    await ct_markCommentRead(comment, null, true);
    button.innerHTML = ``;
    ct_addUnreadCommentButton(button, comment);
    ct_getComments(0, esgst.mainComments, null, true);
  }

  function ct_addUnreadCommentButton(button, comment) {
    if (!button) {
      button = createElements(comment.actions, `beforeEnd`, [{
        attributes: {
          class: `esgst-ct-comment-button`
        },
        type: `div`
      }]);
    }
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-eye-slash`,
        title: `${getFeatureTooltip(`ct`, `Mark comment as unread`)}`
      },
      type: `i`
    }]);
    button.firstElementChild.addEventListener(`click`, ct_unreadComment.bind(null, button, comment));
  }

  async function ct_unreadComment(button, comment) {
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    await ct_markCommentUnread(comment, null, true);
    button.innerHTML = ``;
    ct_addReadCommentButton(button, comment);
  }

  function ct_addCommentPanel(goToUnread, markRead, markUnread) {
    let button, key, newButton, url;
    goToUnread.addEventListener(`click`, ct_goToUnread.bind(null, goToUnread));
    markRead.addEventListener(`click`, ct_markCommentsRead.bind(null, markRead));
    markUnread.addEventListener(`click`, ct_markCommentsUnread.bind(null, markUnread));
    if (esgst.ct_a && esgst.inboxPath) {
      button = document.querySelector(`.js__submit-form, .js_mark_as_read`);
      if (button) {
        if (esgst.sg) {
          newButton = createElements(button, `afterEnd`, [{
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
          newButton = createElements(button, `afterEnd`, [{
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
        button.remove();
        newButton.addEventListener(`click`, ct_markMessagesRead.bind(null, key, markRead, url));
      }
    }
  }

  async function ct_markMessagesRead(key, markRead, url, event) {
    await request({data: `xsrf_token=${esgst.xsrfToken}&do=${key}`, method: `POST`, url});
    await ct_markCommentsRead(markRead);
    ct_completeInboxRead(event.currentTarget);
  }

  function ct_completeInboxRead(newButton) {
    let elements, i, n;
    elements = document.querySelectorAll(`.comment__envelope, .comment_unread`);
    for (i = 0, n = elements.length; i < n; ++i) {
      elements[i].remove();
    }
    newButton.remove();
  }

  async function ct_goToUnread(goToUnread) {
    createElements(goToUnread, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    const found = await ct_getComments(0, esgst.mainComments, null, true, false, false);
    createElements(goToUnread, `inner`, [{
      attributes: {
        class: `fa fa-comments-o`
      },
      type: `i`
    }]);
    if (!found) {
      createAlert(`No unread comments were found.`);
    }
  }

  async function ct_markCommentsRead(markRead) {
    createElements(markRead, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    await ct_getComments(0, esgst.mainComments, null, false, true, false);
    createElements(markRead, `inner`, [{
      attributes: {
        class: `fa fa-eye`
      },
      type: `i`
    }]);
  }

  async function ct_markCommentsUnread(markUnread) {
    createElements(markUnread, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    await ct_getComments(0, esgst.mainComments, null, false, false, true);
    createElements(markUnread, `inner`, [{
      attributes: {
        class: `fa fa-eye-slash`
      },
      type: `i`
    }]);
  }

  function ct_addDiscussionPanel(code, comments, container, context, count, diff, url, type, dh, discussion) {
    const obj = {
      code,
      count,
      diff,
      panel: createElements(context, esgst.giveawaysPath && !esgst.oadd ? `afterEnd` : `beforeEnd`, [{
        type: `span`,
        children: [{
          attributes: {
            class: `esgst-ct-count esgst-hidden`,
            title:getFeatureTooltip(`ct`)
          },
          text: `(+${diff})`,
          type: `span`
        }, {        
          attributes: {
            class: `esgst-heading-button esgst-hidden`,
            title: getFeatureTooltip(`ct`, `Go to first unread comment of this discussion`)
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-comments-o`
            },
            type: `i`
          }]
        }, {        
          attributes: {
            class: `esgst-heading-button esgst-hidden`,
            title: getFeatureTooltip(`ct`, `Mark all comments in this discussion as read`)
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-eye`
            },
            type: `i`
          }]
        }, {        
          attributes: {
            class: `esgst-heading-button esgst-hidden`,
            title: getFeatureTooltip(`ct`, `Mark all comments in this discussion as unread`)
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-eye-slash`
            },
            type: `i`
          }]
        }, {        
          attributes: {
            class: `esgst-heading-button esgst-hidden`,
            title: getFeatureTooltip(`ct`, `Clean discussion (remove deleted comments from the database)`)
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-paint-brush`
            },
            type: `i`
          }]
        }, {
          attributes: {
            class: `fa fa-circle-o-notch fa-spin esgst-hidden`
          },
          type: `i`
        }]
      }]),
      url
    };
    obj.diffContainer = obj.panel.firstElementChild;
    obj.goToUnread = obj.diffContainer.nextElementSibling;
    obj.markRead = obj.goToUnread.nextElementSibling;
    obj.markUnread = obj.markRead.nextElementSibling;
    obj.clean = obj.markUnread.nextElementSibling;
    obj.loadingIcon = obj.clean.nextElementSibling;
    if (esgst.gdttt) {
      const button = new Button(obj.panel, `beforeEnd`, {
        callbacks: [gdttt_markVisited.bind(null, code, container, count, obj.diffContainer, type), null, gdttt_markUnvisited.bind(null, code, container, count, obj.diffContainer, type), null],
        className: `esgst-gdttt-button`,
        icons: [`fa-check esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-times esgst-clickable`, `fa-circle-o-notch fa-spin`],
        id: `gdttt`,
        index: !comments[code] || !comments[code].visited ? 0 : 2,
        titles: [`Mark discussion as visited`, `Marking...`, `Mark discussion as unvisited`, `Marking...`]
      });
      if (discussion) {
        discussion.gdtttButton = button;
        discussion.count = count;
      }
    }
    if (esgst.ct && (esgst.giveawaysPath || esgst.discussionsPath || dh)) {
      if (esgst.ct_s) {
        if (diff > 0) {
          obj.diffContainer.classList.remove(`esgst-hidden`);
        }
      } else {
        if (diff > 0) {
          obj.diffContainer.classList.remove(`esgst-hidden`);
          obj.goToUnread.classList.remove(`esgst-hidden`);
          obj.markRead.classList.remove(`esgst-hidden`);
          if (diff !== count) {
            obj.markUnread.classList.remove(`esgst-hidden`);
          }
        } else {
          obj.markUnread.classList.remove(`esgst-hidden`);
        }
        obj.clean.classList.remove(`esgst-hidden`);
      }
    }
    obj.goToUnread.addEventListener(`mousedown`, ct_goToUnreadPanel.bind(null, obj));
    obj.markRead.addEventListener(`click`, ct_markReadPanel.bind(null, obj));
    obj.markUnread.addEventListener(`click`, ct_markUnreadPanel.bind(null, obj));
    obj.clean.addEventListener(`click`, ct_clean.bind(null, obj));
  }

  async function ct_clean(obj) {
    obj.clean.classList.add(`esgst-hidden`);
    obj.goToUnread.classList.add(`esgst-hidden`);
    obj.markRead.classList.add(`esgst-hidden`);
    obj.markUnread.classList.add(`esgst-hidden`);
    obj.loadingIcon.classList.remove(`esgst-hidden`);
    await ct_markCommentsReadUnread(false, false, false, obj.code, `${obj.url}/search?page=`);
    obj.loadingIcon.classList.add(`esgst-hidden`);
    obj.goToUnread.classList.remove(`esgst-hidden`);
    obj.markRead.classList.remove(`esgst-hidden`);
    obj.clean.classList.remove(`esgst-hidden`);
    if (obj.diff !== obj.count) {
      obj.markUnread.classList.remove(`esgst-hidden`);
    }
  }

  async function ct_goToUnreadPanel(obj, event) {
    esgst.ctNewTab = false;
    if (event.button === 1) {
      event.preventDefault();
      esgst.ctNewTab = true;
    } else if (event.button === 2) {
      return;
    }
    obj.clean.classList.add(`esgst-hidden`);
    obj.goToUnread.classList.add(`esgst-hidden`);
    obj.markRead.classList.add(`esgst-hidden`);
    obj.markUnread.classList.add(`esgst-hidden`);
    obj.loadingIcon.classList.remove(`esgst-hidden`);
    esgst.ctUnreadFound = false;
    await ct_markCommentsReadUnread(true, false, false, null, `${obj.url}/search?page=`);
    obj.loadingIcon.classList.add(`esgst-hidden`);
    obj.goToUnread.classList.remove(`esgst-hidden`);
    obj.markRead.classList.remove(`esgst-hidden`);
    obj.clean.classList.remove(`esgst-hidden`);
    if (obj.diff !== obj.count) {
      obj.markUnread.classList.remove(`esgst-hidden`);
    }
  }

  async function ct_markReadPanel(obj) {
    obj.clean.classList.add(`esgst-hidden`);
    obj.goToUnread.classList.add(`esgst-hidden`);
    obj.markRead.classList.add(`esgst-hidden`);
    obj.markUnread.classList.add(`esgst-hidden`);
    obj.loadingIcon.classList.remove(`esgst-hidden`);
    await ct_markCommentsReadUnread(false, true, false, null, `${obj.url}/search?page=`);
    obj.loadingIcon.classList.add(`esgst-hidden`);
    obj.diffContainer.classList.add(`esgst-hidden`);
    obj.markUnread.classList.remove(`esgst-hidden`);
    obj.clean.classList.remove(`esgst-hidden`);
  }

  async function ct_markUnreadPanel(obj) {
    obj.clean.classList.add(`esgst-hidden`);
    obj.goToUnread.classList.add(`esgst-hidden`);
    obj.markRead.classList.add(`esgst-hidden`);
    obj.markUnread.classList.add(`esgst-hidden`);
    obj.loadingIcon.classList.remove(`esgst-hidden`);
    const deleteLock = await createLock(`commentLock`, 300);
    const comments = JSON.parse(await getValue(`discussions`));
    for (const key in comments[obj.code].readComments) {
      delete comments[obj.code].readComments[key];
    }
    comments[obj.code].lastUsed = Date.now();
    await setValue(`discussions`, JSON.stringify(comments));
    deleteLock();
    obj.loadingIcon.classList.add(`esgst-hidden`);
    obj.diffContainer.classList.remove(`esgst-hidden`);
    obj.diffContainer.textContent = `(+${obj.count})`;
    obj.goToUnread.classList.remove(`esgst-hidden`);
    obj.markRead.classList.remove(`esgst-hidden`);
    obj.clean.classList.remove(`esgst-hidden`);
  }

  async function ct_markCommentsReadUnread(goToUnread, markRead, markUnread, code, url) {
    let firstRun = true;
    let lastPageMissing = false;
    let nextPage = 1;
    let comments = [];
    let discussion = null;
    if (code) {
      discussion = JSON.parse(await getValue(`discussions`))[code];
      if (!discussion || !discussion.readComments) {
        return;
      }
    }
    while (true) {
      const context = parseHtml((await request({
        method: `GET`,
        queue: true,
        url: `${url}${nextPage}`
      })).responseText);
      if (code) {
        const elements = context.querySelectorAll(`[href*="/go/comment/"]`);
        for (const element of elements) {
          comments.push(element.getAttribute(`href`).match(/\/go\/comment\/(.+)/)[1]);
        }
      } else {
        await ct_getComments(0, await comments_get(context, context, true), null, goToUnread, markRead, markUnread);
      }

      if (goToUnread && esgst.ctUnreadFound) break;

      nextPage += 1;
      const pagination = context.getElementsByClassName(`pagination__navigation`)[0];

      if (!pagination || ((!goToUnread || ((!esgst.ct_r || nextPage <= 1) && (esgst.ct_r || pagination.lastElementChild.classList.contains(`is-selected`)))) && (goToUnread || pagination.lastElementChild.classList.contains(`is-selected`)))) break;

      if (!goToUnread || !esgst.ct_r) continue;

      if (firstRun) {
        firstRun = !firstRun;
        const lastLink = pagination.lastElementChild;
        if (lastLink.textContent.match(/Last/)) {
          nextPage = parseInt(lastLink.getAttribute(`data-page-number`));
        } else {
          nextPage = 999999999;
          lastPageMissing = true;
        }
      } else {
        if (lastPageMissing) {
          nextPage = parseInt(pagination.lastElementChild.getAttribute(`data-page-number`)) - 1;
        } else {
          nextPage -= 2;
        }
      }

      if (nextPage <= 1) break;
    }
    if (code) {
      for (const id in discussion.readComments) {
        if (id && comments.indexOf(id) < 0) {
          delete discussion.readComments[id];
        }
      }
      await lockAndSaveDiscussions({[code]: discussion});
    }
  }
  
