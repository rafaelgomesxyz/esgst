_MODULES.push({
    description: `
      <ul>
        <li>When you click on any text area (in any page) to start writing a comment, a panel is added above it that helps you use SteamGifts' <a href="https://www.steamgifts.com/about/comment-formatting">comment formatting</a>.</li>
        <li>There is a button (<i class="fa fa-paste"></i> if enabled and <i class="fa fa-paste esgst-faded"></i> if disabled) in the panel that allows the feature to automatically format links/images pasted into the text area.</li>
        <li>There are also buttons (<i class="fa fa-rotate-right"></i> to redo and <i class="fa fa-rotate-left"></i> to undo) in the panel that allow you to redo/undo any formatting added.</li>
      </ul>
    `,
    features: {
      cfh_bq: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-quote-left"></i>) to the panel that allows you to write text like shown below.</li>
          </ul>
          <blockquote>Blockquote</blockquote>
        `,
        name: `Blockquote`,
        sg: true,
        st: true
      },
      cfh_b: {
        description: `
          <ul>
            <li>Adds a button (B) to the panel that allows you to write text like shown below.</li>
          </ul>
          <strong>Bold</strong>
        `,
        name: `Bold`,
        sg: true,
        st: true
      },
      cfh_h1: {
        description: `
          <ul>
            <li>Adds a button (H¹) to the panel that allows you to write text like shown below.</li>
          </ul>
          <h1>Heading 1</h1>
        `,
        name: `Heading 1`,
        sg: true,
        st: true
      },
      cfh_h2: {
        description: `
          <ul>
            <li>Adds a button (H²) to the panel that allows you to write text like shown below.</li>
          </ul>
          <h2>Heading 2</h2>
        `,
        name: `Heading 2`,
        sg: true,
        st: true
      },
      cfh_h3: {
        description: `
          <ul>
            <li>Adds a button (H³) to the panel that allows you to write text like shown below.</li>
          </ul>
          <h3>Heading 3</h3>
        `,
        name: `Heading 3`,
        sg: true,
        st: true
      },
      cfh_ic: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-code"></i>) to the panel that allows you to write text like shown below.</li>
          </ul>
          <p>Inline <code>Code</code></p>
        `,
        name: `Inline Code`,
        sg: true,
        st: true
      },
      cfh_i: {
        description: `
          <ul>
            <li>Adds a button (I) to the panel that allows you to write text like shown below.</li>
          </ul>
          <em>Italic</em>
        `,
        name: `Italic`,
        sg: true,
        st: true
      },
      cfh_lb: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-minus"></i>) to the panel that allows you to write text like shown below.</li>
          </ul>
          <p>Line</p>
          <hr>
          <p>Break</p>
        `,
        name: `Line Break`,
        sg: true,
        st: true
      },
      cfh_lc: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-code"></i> <i class="fa fa-indent"></i>) to the panel that allows you to write text like shown below.</li>
          </ul>
          <code>Line Code</code>
        `,
        name: `Line Code`,
        sg: true,
        st: true
      },
      cfh_ol: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-list-ol"></i>) to the panel that allows you to write text like shown below.</li>
          </ul>
          <ol>
            <li>Ordered</li>
            <li>List</li>
          </ol>
        `,
        name: `Ordered List`,
        sg: true,
        st: true
      },
      cfh_pc: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-code"></i> <i class="fa fa-paragraph"></i>) to the panel that allows you to write text like shown below.</li>
          </ul>
          <pre><code>Paragraph Code</code></pre>
        `,
        name: `Paragraph Code`,
        sg: true,
        st: true
      },
      cfh_s: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-eye-slash"></i>) to the panel that allows you to write text like shown below.</li>
          </ul>
          <span class="spoiler">Spoiler</spoiler>
        `,
        name: `Spoiler`,
        sg: true,
        st: true
      },
      cfh_st: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-strikethrough"></i>) to the panel that allows you to write text like shown below.</li>
          </ul>
          <del>Strikethrough</del>
        `,
        name: `Strikethrough`,
        sg: true,
        st: true
      },
      cfh_ul: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-list-ul"></i>) to the panel that allows you to write text like shown below.</li>
          </ul>
          <ul>
            <li>Unordered</li>
            <li>List</li>
          </ul>
        `,
        name: `Unordered List`,
        sg: true,
        st: true
      },
      cfh_img: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-image"></i>) to the panel that allows you to add images to your comments with an interface where you can enter the title and the URL of the image and let ESGST format it.</li>
            <li>You can also upload images from your computer instead of using a URL. The images will be uploaded to <a href="https://imgur.com">Imgur</a>.</li>
          </li>
        `,
        name: `Image`,
        sg: true,
        st: true
      },
      cfh_l: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-globe"></i>) to the panel that allows you to add links to your comments with an interface where you can enter the title and the URL of the link and let ESGST format it.</li>
          </ul>
        `,
        name: `Link`,
        sg: true,
        st: true
      },
      cfh_t: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-table"></i>) to the panel that allows you to add tables to your comments with an interface where you can dynamically add as many rows/columns as you want, align each column however you want, enter the value for each cell and let ESGST format it.</li>
          </ul>
        `,
        name: `Table`,
        sg: true,
        st: true
      },
      cfh_e: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-smile-o"></i>) to the panel that allows you to add emojis to your comments by selecting them out of a huge list of emojis.</li>
          </ul>
        `,
        name: `Emoji`,
        sg: true,
        st: true
      },
      cfh_g: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-star"></i>) to the panel that allows you to add encrypted giveaways (see [id=ged] for more details about them) to your comments.</li>
          </ul>
        `,
        name: `Giveaway Encrypter`,
        sg: true,
        st: true
      },
      cfh_p: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-eye"></i>) to the panel that allows you to preview your comment before submitting it.</li>
          </ul>
        `,
        features: {
          cfh_p_a: {
            name: `Automatically preview while typing.`,
            sg: true,
            st: true
          }
        },
        name: `Preview`,
        sg: true,
        st: true
      },
      cfh_sr: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-floppy-o"></i>) to the panel that allows you to save replies that you frequently use so that you can reuse them later.</li>
          </ul>
        `,
        name: `Saved Replies`,
        sg: true,
        st: true
      },
      cfh_cf: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-question-circle"></i>) to the panel that links to SteamGifts' <a href="https://www.steamgifts.com/about/comment-formatting">comment formatting page</a>.</li>
          </ul>
        `,
        name: `Comment Formatting`,
        sg: true,
        st: true
      },
      cfh_ghwsgi: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-github"></i>) to the panel that allows you to easily generate links for <a href="https://www.steamgifts.com/discussion/fVwFM/github-wiki-steamgifts-integration">GitHub Wiki SteamGifts Integration</a>.</li>
          </ul>
        `,
        name: `GitHub Wiki SteamGifts Integration`,
        sg: true,
        st: true
      }
    },
    id: `cfh`,
    load: cfh,
    name: `Comment Formatting Helper`,
    sg: true,
    st: true,
    type: `comments`
  });

  async function cfh() {
    esgst.cfhEmojis = cfh_emojis();
    esgst.endlessFeatures.push(cfh_setTextAreas);
    esgst.cfh = {
      backup: [],
      history: [],
      panel: document.createElement(`div`),
      preview: document.createElement(`div`)
    };
    esgst.cfh.panel.className = `esgst-cfh-panel`;
    let items = [
      {
        id: `cfh_i`,
        icons: [`fa-italic`],
        name: `Italic`,
        prefix: `*`,
        suffix: `*`
      },
      {
        id: `cfh_b`,
        icons: [`fa-bold`],
        name: `Bold`,
        prefix: `**`,
        suffix: `**`
      },
      {
        id: `cfh_s`,
        icons: [`fa-eye-slash`],
        name: `Spoiler`,
        prefix: `~`,
        suffix: `~`
      },
      {
        id: `cfh_st`,
        icons: [`fa-strikethrough`],
        name: `Strikethrough`,
        prefix: `~~`,
        suffix: `~~`
      },
      {
        id: `cfh_h1`,
        icons: [`fa-header`],
        name: `Heading 1`,
        prefix: `# `,
        text: `1`
      },
      {
        id: `cfh_h2`,
        icons: [`fa-header`],
        name: `Heading 2`,
        prefix: `## `,
        text: `2`
      },
      {
        id: `cfh_h3`,
        icons: [`fa-header`],
        name: `Heading 3`,
        prefix: `### `,
        text: `3`
      },
      {
        id: `cfh_bq`,
        icons: [`fa-quote-left`],
        name: `Blockquote`,
        prefix: `> `
      },
      {
        id: `cfh_lb`,
        icons: [`fa-minus`],
        name: `Line Break`,
        prefix: `---`
      },
      {
        id: `cfh_ol`,
        icons: [`fa-list-ol`],
        multiline: true,
        name: `Ordered List`,
        prefix: `[n]. `
      },
      {
        id: `cfh_ul`,
        icons: [`fa-list-ul`],
        multiline: true,
        name: `Unordered List`,
        prefix: `* `
      },
      {
        id: `cfh_ic`,
        icons: [`fa-code`],
        name: `Inline Code`,
        prefix: `\``,
        suffix: `\``
      },
      {
        id: `cfh_lc`,
        icons: [`fa-code`, `fa-indent`],
        name: `Line Code`,
        prefix: `    `
      },
      {
        id: `cfh_pc`,
        icons: [`fa-code`, `fa-paragraph`],
        name: `Paragraph Code`,
        prefix: `\`\`\`\n`,
        suffix: `\n\`\`\``
      },
      {
        id: `cfh_l`,
        icons: [`fa-globe`],
        name: `Link`,
        setPopout: popout => {
          let title, url;
          createElements(popout.popout, `inner`, [{
            type: `div`,
            children: [{
              text: `URL: `,
              type: `node`
            }, {
              attributes: {
                placeholder: `http://www.example.com`,
                type:  `text`
              },
              type: `input`
            }]
          }, {
            type: `div`,
            children: [{
              text: `Title: `,
              type: `node`
            }, {
              attributes: {
                placeholder: `Cat`,
                type: `text`
              },
              type: `input`
            }]
          }, {
            attributes: {
              class: `form__saving-button btn_action white`
            },
            text: `Add`,
            type: `div`
          }]);
          url = popout.popout.firstElementChild.firstElementChild;
          title = popout.popout.firstElementChild.nextElementSibling.firstElementChild;
          popout.popout.lastElementChild.addEventListener(`click`, () => {
            cfh_formatLink(title.value, url.value);
            url.value = ``;
            title.value = ``;
            popout.close();
          });
        },
        callback: popout => {
          let title, url;
          url = popout.firstElementChild.firstElementChild;
          title = popout.firstElementChild.nextElementSibling.firstElementChild;
          title.value = esgst.cfh.textArea.value.slice(esgst.cfh.textArea.selectionStart, esgst.cfh.textArea.selectionEnd);
          if (url.value && title.value) {
            popout.lastElementChild.click();
          } else if (url.value) {
            title.focus();
          } else {
            url.focus();
          }
        }
      },
      {
        id: `cfh_img`,
        icons: [`fa-image`],
        name: `Image`,
        setPopout: popout => {
          let title, url;
          createElements(popout.popout, `inner`, [{
            type: `div`,
            children: [{
              text: `URL: `,
              type: `node`
            }, {
              attributes: {
                placeholder: `http://www.example.com/image.jpg`,
                type: `text`
              },
              type: `input`
            }, {
              attributes: {
                class: `fa fa-upload esgst-clickable`,
                title: `Upload image to Imgur and use it`
              }
            }]
          }, {
            type: `div`,
            children: [{
              text: `Title: `,
              type: `node`
            }, {
              attributes: {
                placeholder: `Cat`,
                type: `text`
              },
              type: `input`
            }]
          }, {
            attributes: {
              class: `form__saving-button btn_action white`
            },
            text: `Add`,
            type: `div`
          }]);
          url = popout.popout.firstElementChild.firstElementChild;
          let imgur = url.nextElementSibling;
          title = popout.popout.firstElementChild.nextElementSibling.firstElementChild;
          imgur.addEventListener(`click`, () => {
            multiChoice(`grey`, `fa-user-secret`, `Anonymously`, `grey`, `fa-user`, `Through Account`, `How would you like to upload?`, cfh_uploadImage.bind(null, `Client-ID e25283ef48ab9aa`, popout, url), async () => {
              await delValue(`imgurToken`);
              openSmallWindow(`https://api.imgur.com/oauth2/authorize?client_id=e25283ef48ab9aa&response_type=token`);
              cfh_checkImgur(popout, url);
            });
          });
          popout.popout.lastElementChild.addEventListener(`click`, () => {
            cfh_formatLink(title.value, url.value, true);
            url.value = ``;
            title.value = ``;
            popout.close();
          });
        },
        callback: popout => {
          let title, url;
          url = popout.firstElementChild.firstElementChild;
          title = popout.firstElementChild.nextElementSibling.firstElementChild;
          title.value = esgst.cfh.textArea.value.slice(esgst.cfh.textArea.selectionStart, esgst.cfh.textArea.selectionEnd);
          if (url.value && title.value) {
            popout.lastElementChild.click();
          } else if (url.value) {
            title.focus();
          } else {
            url.focus();
          }
        }
      },
      {
        id: `cfh_t`,
        icons: [`fa-table`],
        name: `Table`,
        setPopup: popup => {
          let context, insertColumn, insertRow, table;
          context = popup.scrollable;
          createElements(context, `inner`, [{
            type: `table`
          }, {
            attributes: {
              class: `form__saving-button btn_action white`
            },
            text: `Insert Row`,
            type: `div`
          }, {
            attributes: {
              class: `form__saving-button btn_action white`
            },
            text: `Insert Column`,
            type: `div`
          }, {
            attributes: {
              class: `form__saving-button btn_action white`
            },
            text: `Add`,
            type: `div`
          }]);
          table = context.firstElementChild;
          insertRow = table.nextElementSibling;
          insertColumn = insertRow.nextElementSibling;
          cfh_insertTableRows(4, table);
          cfh_insertTableColumns(2, table);
          insertRow.addEventListener(`click`, () => {
            cfh_insertTableRows(1, table);
          });
          insertColumn.addEventListener(`click`, () => {
            cfh_insertTableColumns(1, table);
          });
          insertColumn.nextElementSibling.addEventListener(`click`, () => {
            let end, i, j, numColumns, numRows, rows, start, value;
            rows = table.rows;
            for (i = 1, numRows = rows.length; i < numRows; ++i) {
              for (j = 1, numColumns = rows[0].cells.length; j < numColumns; ++j) {
                if (!rows[i].cells[j].firstElementChild.value) {
                  i = numRows + 1;
                  j = numColumns + 1;
                }
              }
            }
            if (i <= numRows || (i > numRows &&  confirm(`Some cells are empty. This might lead to unexpected results. Are you sure you want to continue?`))) {
              value = ``;
              for (i = 1; i < numRows; ++i) {
                value += `\n`;
                for (j = 1; j < numColumns; ++j) {
                  value += `${rows[i].cells[j].firstElementChild.value}${j < numColumns - 1 ? ` | ` : ``}`;
                }
              }
              value = value.replace(/^\n/, ``);
              start = esgst.cfh.textArea.selectionStart;
              end = esgst.cfh.textArea.selectionEnd;
              esgst.cfh.textArea.value = `${esgst.cfh.textArea.value.slice(0, start)}${value}${esgst.cfh.textArea.value.slice(end)}`;
              esgst.cfh.textArea.setSelectionRange(end + value.length, end + value.length);
              esgst.cfh.textArea.focus();
              popup.close();
            }
          });
        }
      },
      {
        id: `cfh_e`,
        icons: [`fa-smile-o`],
        name: `Emojis`,
        setPopout: async popout => {
          let emojis, popup;
          createElements(popout.popout, `inner`, [{
            attributes: {
              class: `esgst-cfh-emojis`
            },
            type: `div`,
            children: await cfh_getEmojis()
          }, {
            attributes: {
              class: `form__saving-button btn_action white`
            },
            text: `Select Emojis`,
            type: `div`
          }]);
          emojis = popout.popout.firstElementChild;
          draggable_set({context: emojis, id: `emojis`});
          cfh_setEmojis(emojis);
          emojis.nextElementSibling.addEventListener(`click`, async () => {
            if (popup) {
              popup.open(() => {
                popout.popout.classList.add(`esgst-hidden`)
              });
            } else {
              let emoji, emojis, filter, i;
              popup = new Popup_v2({icon: `fa-smile-o`, title: `Select emojis:`, addScrollable: true});
              filter = popup.getScrollable([{
                attributes: {
                  placeholder: `Filter emojis...`,
                  type: `text`
                },
                type: `input`
              }, {
                attributes: {
                  class: `esgst-cfh-emojis`
                },
                type: `div`
              }, {
                attributes: {
                  class: `esgst-description`
                },
                text: `Simply click on an emoji above to add it to your selection. You can re-order emojis in your selection by dragging and dropping them. To remove an emoji from your selection, start dragging it and a trash area will appear, then drop it there.`,
                type: `div`
              }, {
                attributes: {
                  class: `global__image-outer-wrap page_heading_btn esgst-cfh-emojis`
                },
                type: `div`
              }]).firstElementChild;
              emojis = filter.nextElementSibling;
              const savedEmojis = emojis.nextElementSibling.nextElementSibling;
              createElements(savedEmojis, `inner`, await cfh_getEmojis());
              const obj = {
                context: savedEmojis,
                id: `emojid`
              };
              draggable_set(obj);
              for (const emojiData of esgst.cfhEmojis) {
                createElements(emojis, `beforeEnd`, [{
                  attributes: {
                    [`data-id`]: emojiData.emoji,
                    title: emojiData.name
                  },
                  text: emojiData.emoji,
                  type: `span`
                }]);
                emojis.lastElementChild.addEventListener(`click`, () => {
                  createElements(savedEmojis, `beforeEnd`, [{
                    attributes: {
                      [`data-id`]: emojiData.emoji,
                      title: emojiData.name
                    },
                    text: emojiData.emoji,
                    type: `span`
                  }]);
                  draggable_set(obj);
                });
              }
              popup.onClose = () => {
                const emojArr = [];
                for (const element of savedEmojis.children) {
                  emojArr.push(element.getAttribute(`data-id`));
                }
                setValue(`emojis`, JSON.stringify(emojArr));
              };
              filter.addEventListener(`input`, () => {
                if (filter.value) {
                  for (i = emojis.children.length - 1; i > -1; --i) {
                    emoji = emojis.children[i];
                    if (emoji.getAttribute(`title`).toLowerCase().match(filter.value)) {
                      emoji.classList.remove(`esgst-hidden`);
                    } else {
                      emoji.classList.add(`esgst-hidden`);
                    }
                  }
                } else {
                  for (i = emojis.children.length - 1; i > -1; --i) {
                    emojis.children[i].classList.remove(`esgst-hidden`);
                  }
                }
              });
              popup.open(() => {
                popout.popout.classList.add(`esgst-hidden`)
              });
            }
          });
        },
        callback: async popout => {
          let emojis = popout.firstElementChild;
          createElements(emojis, `inner`, await cfh_getEmojis());
          draggable_set({context: emojis, id: `emojis`});
          cfh_setEmojis(emojis);
        }
      },
      {
        id: `cfh_g`,
        icons: [`fa-star`],
        name: `Giveaway Encrypter`,
        setPopout: popout => {
          createElements(popout.popout, `inner`, [{
            text: `Giveaway Code: `,
            type: `node`
          }, {
            attributes: {
              placeholder: `XXXXX`,
              type: `text`
            },
            type: `input`
          }, {
            attributes: {
              class: `form__saving-button btn_action white`
            },
            text: `Add`,
            type: `div`
          }]);
          let code = popout.popout.firstElementChild;
          code.nextElementSibling.addEventListener(`click`, () => {
            if (code.value.match(/^[\d\w]{5}$/)) {
              let encodedCode = ged_encryptCode(code.value);
              cfh_formatLink(``, `ESGST-${encodedCode}`);
              code.value = ``;
              popout.close();
            } else {
                alert(`Wrong format. The right format is XXXXX.`);
            }
          });
        },
        callback: popout => {
          let code = popout.firstElementChild;
          code.value = esgst.cfh.textArea.value.slice(esgst.cfh.textArea.selectionStart, esgst.cfh.textArea.selectionEnd);
          code.focus();
        }
      },
      {
        id: `cfh_sr`,
        icons: [`fa-floppy-o`],
        name: `Saved Replies`,
        setPopout: async popout => {
          let addButton, filter, i, n, replies, saveButton, savedReplies;
          esgst.cfh.deletedReplies = [];
          savedReplies = JSON.parse(await getValue(`savedReplies`, `[]`));
          createElements(popout.popout, `inner`, [{
            type: `div`,
            children: [{
              attributes: {
                placeholder: `Filter replies...`,
                type: `text`
              },
              type: `input`
            }]
          }, {
            attributes: {
              class: `esgst-cfh-sr-container`
            },
            type: `div`
          }, {
            attributes: {
              class: `form__saving-button btn_action white`
            },
            text: `Add New Reply`,
            type: `div`
          }, {
            attributes: {
              class: `form__saving-button btn_action white`
            },
            text: `Save Reply`,
            type: `div`
          }, {
            attributes: {
              class: `esgst-clickable esgst-hidden`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `fa fa-rotate-left`
              },
              type: `i`
            }, {
              text: `Undo Delete`,
              type: `span`
            }]
          }]);
          filter = popout.popout.firstElementChild.firstElementChild;
          esgst.cfh.undoDelete = popout.popout.lastElementChild;
          saveButton = esgst.cfh.undoDelete.previousElementSibling;
          addButton = saveButton.previousElementSibling;
          replies = addButton.previousElementSibling;
          for (i = 0, n = savedReplies.length; i < n; ++i) {
            cfh_setReply(replies, savedReplies[i]);
          }
          filter.addEventListener(`input`, cfh_filterReplies.bind(null, replies));
          esgst.cfh.undoDelete.addEventListener(`click`, cfh_undoDelete);
          addButton.addEventListener(`click`, cfh_openReplyPopup.bind(null, null, null, replies, null));
          saveButton.addEventListener(`click`, () => cfh_saveReply(esgst.cfh.textArea.value, null, `Untitled`, null, null, replies, null, null));
        },
        callback: popout => {
          popout.firstElementChild.firstElementChild.focus();
        }
      }, {
        id: `cfh_ghwsgi`,
        icons: [`fa-github`],
        name: `GitHub Wiki SteamGifts Integration`,
        setPopout: popout => {
          let url;
          createElements(popout.popout, `inner`, [{
            type: `div`,
            children: [{
              text: `Wiki URL: `,
              type: `node`
            }, {
              attributes: {
                placeholder: `https://github.com/username/repository/wiki`,
                type:  `text`
              },
              type: `input`
            }]
          }, {
            attributes: {
              class: `form__saving-button btn_action white`
            },
            text: `Add`,
            type: `div`
          }]);
          url = popout.popout.firstElementChild.firstElementChild;
          popout.popout.lastElementChild.addEventListener(`click`, () => {
            const ghwsgiLink = `wiki-gh/${url.value.replace(/https?:\/\/(www\.)?github\.com\//, ``)}`;
            cfh_formatItem(`This thread contains a Wiki visible with the [GHWSGI userscript](https://www.steamgifts.com/discussion/fVwFM/). If you prefer to see it directly on GitHub instead, [click here](${url.value}).\n`);
            cfh_formatLink(``, ghwsgiLink);
            url.value = ``;
            popout.close();
          });
        },
        callback: popout => {
          let url = popout.firstElementChild.firstElementChild;
          url.focus();
        }
      }, {
        icons: [`fa-paste`],
        name: `Automatic Links / Images Paste Formatting: OFF`,
        callback: context => {
          esgst.cfh.alipf = context.firstElementChild;
          cfh_setAlipf(esgst.cfh_pasteFormatting, true);
        },
        onClick: cfh_setAlipf
      }, {
        icons: [`fa-rotate-left`],
        name: `Undo Formatting`,
        callback: context => {
          esgst.cfh.undo = context.firstElementChild;
          esgst.cfh.undo.classList.add(`esgst-faded`);
        },
        onClick: () => {
          let end, value;
          if (esgst.cfh.history.length) {
            cfh_redo(esgst.cfh.textArea, esgst.cfh.textArea.value);
            value = esgst.cfh.history.pop();
            end = esgst.cfh.textArea.selectionEnd - (esgst.cfh.textArea.value.length - value.length);
            esgst.cfh.textArea.value = value;
            esgst.cfh.textArea.setSelectionRange(end, end);
            if (!esgst.cfh.history.length) {
              esgst.cfh.undo.classList.add(`esgst-faded`);
            }
            esgst.cfh.textArea.focus();
          }
        }
      }, {
        icons: [`fa-rotate-right`],
        name: `Redo Formatting`,
        callback: context => {
          esgst.cfh.redo = context.firstElementChild;
          esgst.cfh.redo.classList.add(`esgst-faded`);
        },
        onClick: () => {
          let end, value;
          if (esgst.cfh.backup.length) {
            cfh_undo(esgst.cfh.textArea, esgst.cfh.textArea.value);
            value = esgst.cfh.backup.pop();
            end = esgst.cfh.textArea.selectionEnd + (value.length - esgst.cfh.textArea.value.length);
            esgst.cfh.textArea.value = value;
            esgst.cfh.textArea.setSelectionRange(end, end);
            if (!esgst.cfh.backup.length) {
              esgst.cfh.redo.classList.add(`esgst-faded`);
            }
            esgst.cfh.textArea.focus();
          }
        }
      }
    ];
    for (let i = 0, n = items.length; i < n; i++) {
      let item = items[i];
      if (!item.id || esgst[item.id]) {
        let button = createElements(esgst.cfh.panel, `beforeEnd`, [{
          attributes: {
            title: `${getFeatureTooltip(item.id || `cfh`, item.name)}`
          },
          type: `div`
        }]);
        item.icons.forEach(icon => {
          createElements(button, `beforeEnd`, [{
            attributes: {
              class: `fa ${icon}`
            },
            type: `i`
          }]);
        });
        if (item.text) {
          button.insertAdjacentText(`beforeEnd`, item.text);
        }
        if (item.setPopout) {
          await item.setPopout(new Popout(`esgst-cfh-popout`, button, 0, true, null, item.callback));
        } else if (item.setPopup) {
          let popup;
          button.addEventListener(`click`, () => {
            if (popup) {
              popup.open();
            } else {
              popup = new Popup(`fa-table`, `Add a table:`);
              item.setPopup(popup);
              popup.open();
            }
          });
        } else {
          if (item.callback) {
            item.callback(button);
          }
          button.addEventListener(`click`, () => {
            if (item.onClick) {
              item.onClick();
            } else {
              cfh_formatItem(item.prefix, item.suffix, item.multiline);
            }
          });
        }
      }
    }
    if (esgst.cfh_cf) {
      createElements(esgst.cfh.panel, `beforeEnd`, [{
        attributes: {
          href: `/about/comment-formatting`,
          title: getFeatureTooltip(`cfh_cf`, `Comment Formatting`)
        },
        type: `a`,
        children: [{
          attributes: {
            class: `fa fa-question-circle`
          },
          type: `i`
        }]
      }]);
    }
    if (esgst.cfh_p && !esgst.cfh_p_a) {
      createElements(esgst.cfh.panel, `beforeEnd`, [{
        attributes: {
          title: getFeatureTooltip(`cfh_p`, `Preview`)
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa fa-eye`
          }
        }]
      }]).addEventListener(`click`, () => {
        createElements(esgst.cfh.preview, `inner`, parseMarkdown(esgst.cfh.textArea.value));
        cfh_formatImages(esgst.cfh.preview);
      });
    }
    esgst.cfh.preview.className = `esgst-cfh-preview markdown`;
  }

  function cfh_emojis() {
    return [
      { emoji: `\u{AF}\u{5C}\u{5C}\u{5C}\u{5F}\u{28}\u{30C4}\u{29}\u{5F}\u{2F}\u{AF}`, entity: `&#xAF&#x5C&#x5C&#x5C&#x5F&#x28&#x30C4&#x29&#x5F&#x2F&#xAF`, name: `` },
      { emoji: `\u{28}\u{20}\u{361}\u{B0}\u{20}\u{35C}\u{296}\u{20}\u{361}\u{B0}\u{29}`, entity: `&#x28&#x20&#x361&#xB0&#x20&#x35C&#x296&#x20&#x361&#xB0&#x29`, name: `` },
      { emoji: `\u{28}\u{20}\u{361}\u{2299}\u{20}\u{35C}\u{296}\u{20}\u{361}\u{2299}\u{29}`, entity: `&#x28&#x20&#x361&#x2299&#x20&#x35C&#x296&#x20&#x361&#x2299&#x29`, name: `` },
      { emoji: `\u{28}\u{30CE}\u{CA0}\u{76CA}\u{CA0}\u{29}\u{30CE}`, entity: `&#x28&#x30CE&#xCA0&#x76CA&#xCA0&#x29&#x30CE`, name: `` },
      { emoji: `\u{28}\u{256F}\u{B0}\u{25A1}\u{B0}\u{FF09}\u{256F}\u{FE35}\u{20}\u{253B}\u{2501}\u{253B}`, entity: `&#x28&#x256F&#xB0&#x25A1&#xB0&#xFF09&#x256F&#xFE35&#x20&#x253B&#x2501&#x253B`, name: `` },
      { emoji: `\u{252C}\u{2500}\u{252C}\u{30CE}\u{28}\u{20}\u{BA}\u{20}\u{5F}\u{20}\u{BA}\u{30CE}\u{29}`, entity: `&#x252C&#x2500&#x252C&#x30CE&#x28&#x20&#xBA&#x20&#x5F&#x20&#xBA&#x30CE&#x29`, name: `` },
      { emoji: `\u{10DA}\u{28}\u{CA0}\u{76CA}\u{CA0}\u{10DA}\u{29}`, entity: `&#x10DA&#x28&#xCA0&#x76CA&#xCA0&#x10DA&#x29`, name: `` },
      { emoji: `\u{28}\u{25D5}\u{203F}\u{2D}\u{29}\u{270C}`, entity: `&#x28&#x25D5&#x203F&#x2D&#x29&#x270C`, name: `` },
      { emoji: `\u{28}\u{FF61}\u{25D5}\u{203F}\u{25D5}\u{FF61}\u{29}`, entity: `&#x28&#xFF61&#x25D5&#x203F&#x25D5&#xFF61&#x29`, name: `` },
      { emoji: `\u{28}\u{25D1}\u{203F}\u{25D0}\u{29}`, entity: `&#x28&#x25D1&#x203F&#x25D0&#x29`, name: `` },
      { emoji: `\u{25D4}\u{5F}\u{25D4}`, entity: `&#x25D4&#x5F&#x25D4`, name: `` },
      { emoji: `\u{28}\u{2022}\u{203F}\u{2022}\u{29}`, entity: `&#x28&#x2022&#x203F&#x2022&#x29`, name: `` },
      { emoji: `\u{28}\u{CA0}\u{5F}\u{CA0}\u{29}`, entity: `&#x28&#xCA0&#x5F&#xCA0&#x29`, name: `` },
      { emoji: `\u{28}\u{AC}\u{FF64}\u{AC}\u{29}`, entity: `&#x28&#xAC&#xFF64&#xAC&#x29`, name: `` },
      { emoji: `\u{28}\u{2500}\u{203F}\u{203F}\u{2500}\u{29}`, entity: `&#x28&#x2500&#x203F&#x203F&#x2500&#x29`, name: `` },
      { emoji: `\u{28}\u{CA5}\u{FE4F}\u{CA5}\u{29}`, entity: `&#x28&#xCA5&#xFE4F&#xCA5&#x29`, name: `` },
      { emoji: `\u{28}\u{CA5}\u{2038}\u{CA5}\u{29}`, entity: `&#x28&#xCA5&#x2038&#xCA5&#x29`, name: `` },
      { emoji: `\u{28}\u{2310}\u{25A0}\u{5F}\u{25A0}\u{29}`, entity: `&#x28&#x2310&#x25A0&#x5F&#x25A0&#x29`, name: `` },
      { emoji: `\u{28}\u{25B0}\u{2D8}\u{25E1}\u{2D8}\u{25B0}\u{29}`, entity: `&#x28&#x25B0&#x2D8&#x25E1&#x2D8&#x25B0&#x29`, name: `` },
      { emoji: `\u{4E41}\u{28}\u{20}\u{25D4}\u{20}\u{C6A}\u{25D4}\u{29}\u{310F}`, entity: `&#x4E41&#x28&#x20&#x25D4&#x20&#xC6A&#x25D4&#x29&#x310F`, name: `` },
      { emoji: `\u{28}\u{E07}\u{20}\u{360}\u{B0}\u{20}\u{35F}\u{296}\u{20}\u{361}\u{B0}\u{29}\u{E07}`, entity: `&#x28&#xE07&#x20&#x360&#xB0&#x20&#x35F&#x296&#x20&#x361&#xB0&#x29&#xE07`, name: `` },
      { emoji: `\u{3B6}\u{F3C}\u{19F}\u{346}\u{644}\u{35C}\u{19F}\u{346}\u{F3D}\u{1D98}`, entity: `&#x3B6&#xF3C&#x19F&#x346&#x644&#x35C&#x19F&#x346&#xF3D&#x1D98`, name: `` },
      { emoji: `\u{295}\u{2022}\u{1D25}\u{2022}\u{294}`, entity: `&#x295&#x2022&#x1D25&#x2022&#x294`, name: `` },
      { emoji: `\u{28}\u{20}\u{35D}\u{B0}\u{20}\u{35C}\u{296}\u{361}\u{B0}\u{29}`, entity: `&#x28&#x20&#x35D&#xB0&#x20&#x35C&#x296&#x361&#xB0&#x29`, name: `` },
      { emoji: `\u{28}\u{2F}\u{FF9F}\u{414}\u{FF9F}\u{29}\u{2F}`, entity: `&#x28&#x2F&#xFF9F&#x414&#xFF9F&#x29&#x2F`, name: `` },
      { emoji: `\u{B67}\u{F3C}\u{CA0}\u{76CA}\u{CA0}\u{F3D}\u{B68}`, entity: `&#xB67&#xF3C&#xCA0&#x76CA&#xCA0&#xF3D&#xB68`, name: `` },
      { emoji: `\u{28}\u{E07}\u{20}\u{2022}\u{300}\u{5F}\u{2022}\u{301}\u{29}\u{E07}`, entity: `&#x28&#xE07&#x20&#x2022&#x300&#x5F&#x2022&#x301&#x29&#xE07`, name: `` },
      { emoji: `\u{1F600}`, entity: `&#x1F600`, name: `Grinning Face` },
      { emoji: `\u{1F601}`, entity: `&#x1F601`, name: `Grinning Face With Smiling Eyes` },
      { emoji: `\u{1F602}`, entity: `&#x1F602`, name: `Face With Tears Of Joy` },
      { emoji: `\u{1F923}`, entity: `&#x1F923`, name: `Rolling On The Floor Laughing` },
      { emoji: `\u{1F603}`, entity: `&#x1F603`, name: `Smiling Face With Open Mouth` },
      { emoji: `\u{1F604}`, entity: `&#x1F604`, name: `Smiling Face With Open Mouth & Smiling Eyes` },
      { emoji: `\u{1F605}`, entity: `&#x1F605`, name: `Smiling Face With Open Mouth & Cold Sweat` },
      { emoji: `\u{1F606}`, entity: `&#x1F606`, name: `Smiling Face With Open Mouth & Closed Eyes` },
      { emoji: `\u{1F609}`, entity: `&#x1F609`, name: `Winking Face` },
      { emoji: `\u{1F60A}`, entity: `&#x1F60A`, name: `Smiling Face With Smiling Eyes` },
      { emoji: `\u{1F60B}`, entity: `&#x1F60B`, name: `Face Savouring Delicious Food` },
      { emoji: `\u{1F60E}`, entity: `&#x1F60E`, name: `Smiling Face With Sunglasses` },
      { emoji: `\u{1F60D}`, entity: `&#x1F60D`, name: `Smiling Face With Heart-Eyes` },
      { emoji: `\u{1F618}`, entity: `&#x1F618`, name: `Face Blowing A Kiss` },
      { emoji: `\u{1F617}`, entity: `&#x1F617`, name: `Kissing Face` },
      { emoji: `\u{1F619}`, entity: `&#x1F619`, name: `Kissing Face With Smiling Eyes` },
      { emoji: `\u{1F61A}`, entity: `&#x1F61A`, name: `Kissing Face With Closed Eyes` },
      { emoji: `\u{263A}`, entity: `&#x263A`, name: `Smiling Face` },
      { emoji: `\u{1F642}`, entity: `&#x1F642`, name: `Slightly Smiling Face` },
      { emoji: `\u{1F917}`, entity: `&#x1F917`, name: `Hugging Face` },
      { emoji: `\u{1F914}`, entity: `&#x1F914`, name: `Thinking Face` },
      { emoji: `\u{1F610}`, entity: `&#x1F610`, name: `Neutral Face` },
      { emoji: `\u{1F611}`, entity: `&#x1F611`, name: `Expressionless Face` },
      { emoji: `\u{1F636}`, entity: `&#x1F636`, name: `Face Without Mouth` },
      { emoji: `\u{1F644}`, entity: `&#x1F644`, name: `Face With Rolling Eyes` },
      { emoji: `\u{1F60F}`, entity: `&#x1F60F`, name: `Smirking Face` },
      { emoji: `\u{1F623}`, entity: `&#x1F623`, name: `Persevering Face` },
      { emoji: `\u{1F625}`, entity: `&#x1F625`, name: `Disappointed But Relieved Face` },
      { emoji: `\u{1F62E}`, entity: `&#x1F62E`, name: `Face With Open Mouth` },
      { emoji: `\u{1F910}`, entity: `&#x1F910`, name: `Zipper-Mouth Face` },
      { emoji: `\u{1F62F}`, entity: `&#x1F62F`, name: `Hushed Face` },
      { emoji: `\u{1F62A}`, entity: `&#x1F62A`, name: `Sleepy Face` },
      { emoji: `\u{1F62B}`, entity: `&#x1F62B`, name: `Tired Face` },
      { emoji: `\u{1F634}`, entity: `&#x1F634`, name: `Sleeping Face` },
      { emoji: `\u{1F60C}`, entity: `&#x1F60C`, name: `Relieved Face` },
      { emoji: `\u{1F913}`, entity: `&#x1F913`, name: `Nerd Face` },
      { emoji: `\u{1F61B}`, entity: `&#x1F61B`, name: `Face With Stuck-Out Tongue` },
      { emoji: `\u{1F61C}`, entity: `&#x1F61C`, name: `Face With Stuck-Out Tongue & Winking Eye` },
      { emoji: `\u{1F61D}`, entity: `&#x1F61D`, name: `Face With Stuck-Out Tongue & Closed Eyes` },
      { emoji: `\u{1F924}`, entity: `&#x1F924`, name: `Drooling Face` },
      { emoji: `\u{1F612}`, entity: `&#x1F612`, name: `Unamused Face` },
      { emoji: `\u{1F613}`, entity: `&#x1F613`, name: `Face With Cold Sweat` },
      { emoji: `\u{1F614}`, entity: `&#x1F614`, name: `Pensive Face` },
      { emoji: `\u{1F615}`, entity: `&#x1F615`, name: `Confused Face` },
      { emoji: `\u{1F643}`, entity: `&#x1F643`, name: `Upside-Down Face` },
      { emoji: `\u{1F911}`, entity: `&#x1F911`, name: `Money-Mouth Face` },
      { emoji: `\u{1F632}`, entity: `&#x1F632`, name: `Astonished Face` },
      { emoji: `\u{2639}`, entity: `&#x2639`, name: `Frowning Face` },
      { emoji: `\u{1F641}`, entity: `&#x1F641`, name: `Slightly Frowning Face` },
      { emoji: `\u{1F616}`, entity: `&#x1F616`, name: `Confounded Face` },
      { emoji: `\u{1F61E}`, entity: `&#x1F61E`, name: `Disappointed Face` },
      { emoji: `\u{1F61F}`, entity: `&#x1F61F`, name: `Worried Face` },
      { emoji: `\u{1F624}`, entity: `&#x1F624`, name: `Face With Steam From Nose` },
      { emoji: `\u{1F622}`, entity: `&#x1F622`, name: `Crying Face` },
      { emoji: `\u{1F62D}`, entity: `&#x1F62D`, name: `Loudly Crying Face` },
      { emoji: `\u{1F626}`, entity: `&#x1F626`, name: `Frowning Face With Open Mouth` },
      { emoji: `\u{1F627}`, entity: `&#x1F627`, name: `Anguished Face` },
      { emoji: `\u{1F628}`, entity: `&#x1F628`, name: `Fearful Face` },
      { emoji: `\u{1F629}`, entity: `&#x1F629`, name: `Weary Face` },
      { emoji: `\u{1F62C}`, entity: `&#x1F62C`, name: `Grimacing Face` },
      { emoji: `\u{1F630}`, entity: `&#x1F630`, name: `Face With Open Mouth & Cold Sweat` },
      { emoji: `\u{1F631}`, entity: `&#x1F631`, name: `Face Screaming In Fear` },
      { emoji: `\u{1F633}`, entity: `&#x1F633`, name: `Flushed Face` },
      { emoji: `\u{1F635}`, entity: `&#x1F635`, name: `Dizzy Face` },
      { emoji: `\u{1F621}`, entity: `&#x1F621`, name: `Pouting Face` },
      { emoji: `\u{1F620}`, entity: `&#x1F620`, name: `Angry Face` },
      { emoji: `\u{1F607}`, entity: `&#x1F607`, name: `Smiling Face With Halo` },
      { emoji: `\u{1F920}`, entity: `&#x1F920`, name: `Cowboy Hat Face` },
      { emoji: `\u{1F921}`, entity: `&#x1F921`, name: `Clown Face` },
      { emoji: `\u{1F925}`, entity: `&#x1F925`, name: `Lying Face` },
      { emoji: `\u{1F637}`, entity: `&#x1F637`, name: `Face With Medical Mask` },
      { emoji: `\u{1F912}`, entity: `&#x1F912`, name: `Face With Thermometer` },
      { emoji: `\u{1F915}`, entity: `&#x1F915`, name: `Face With Head-Bandage` },
      { emoji: `\u{1F922}`, entity: `&#x1F922`, name: `Nauseated Face` },
      { emoji: `\u{1F927}`, entity: `&#x1F927`, name: `Sneezing Face` },
      { emoji: `\u{1F608}`, entity: `&#x1F608`, name: `Smiling Face With Horns` },
      { emoji: `\u{1F47F}`, entity: `&#x1F47F`, name: `Angry Face With Horns` },
      { emoji: `\u{1F479}`, entity: `&#x1F479`, name: `Ogre` },
      { emoji: `\u{1F47A}`, entity: `&#x1F47A`, name: `Goblin` },
      { emoji: `\u{1F480}`, entity: `&#x1F480`, name: `Skull` },
      { emoji: `\u{2620}`, entity: `&#x2620`, name: `Skull And Crossbones` },
      { emoji: `\u{1F47B}`, entity: `&#x1F47B`, name: `Ghost` },
      { emoji: `\u{1F47D}`, entity: `&#x1F47D`, name: `Alien` },
      { emoji: `\u{1F47E}`, entity: `&#x1F47E`, name: `Alien Monster` },
      { emoji: `\u{1F916}`, entity: `&#x1F916`, name: `Robot Face` },
      { emoji: `\u{1F4A9}`, entity: `&#x1F4A9`, name: `Pile Of Poo` },
      { emoji: `\u{1F63A}`, entity: `&#x1F63A`, name: `Smiling Cat Face With Open Mouth` },
      { emoji: `\u{1F638}`, entity: `&#x1F638`, name: `Grinning Cat Face With Smiling Eyes` },
      { emoji: `\u{1F639}`, entity: `&#x1F639`, name: `Cat Face With Tears Of Joy` },
      { emoji: `\u{1F63B}`, entity: `&#x1F63B`, name: `Smiling Cat Face With Heart-Eyes` },
      { emoji: `\u{1F63C}`, entity: `&#x1F63C`, name: `Cat Face With Wry Smile` },
      { emoji: `\u{1F63D}`, entity: `&#x1F63D`, name: `Kissing Cat Face With Closed Eyes` },
      { emoji: `\u{1F640}`, entity: `&#x1F640`, name: `Weary Cat Face` },
      { emoji: `\u{1F63F}`, entity: `&#x1F63F`, name: `Crying Cat Face` },
      { emoji: `\u{1F63E}`, entity: `&#x1F63E`, name: `Pouting Cat Face` },
      { emoji: `\u{1F648}`, entity: `&#x1F648`, name: `See-No-Evil Monkey` },
      { emoji: `\u{1F649}`, entity: `&#x1F649`, name: `Hear-No-Evil Monkey` },
      { emoji: `\u{1F64A}`, entity: `&#x1F64A`, name: `Speak-No-Evil Monkey` },
      { emoji: `\u{1F466}`, entity: `&#x1F466`, name: `Boy` },
      { emoji: `\u{1F466}\u{1F3FB}`, entity: `&#x1F466&#x1F3FB`, name: `Boy: Light Skin Tone` },
      { emoji: `\u{1F466}\u{1F3FC}`, entity: `&#x1F466&#x1F3FC`, name: `Boy: Medium-Light Skin Tone` },
      { emoji: `\u{1F466}\u{1F3FD}`, entity: `&#x1F466&#x1F3FD`, name: `Boy: Medium Skin Tone` },
      { emoji: `\u{1F466}\u{1F3FE}`, entity: `&#x1F466&#x1F3FE`, name: `Boy: Medium-Dark Skin Tone` },
      { emoji: `\u{1F466}\u{1F3FF}`, entity: `&#x1F466&#x1F3FF`, name: `Boy: Dark Skin Tone` },
      { emoji: `\u{1F467}`, entity: `&#x1F467`, name: `Girl` },
      { emoji: `\u{1F467}\u{1F3FB}`, entity: `&#x1F467&#x1F3FB`, name: `Girl: Light Skin Tone` },
      { emoji: `\u{1F467}\u{1F3FC}`, entity: `&#x1F467&#x1F3FC`, name: `Girl: Medium-Light Skin Tone` },
      { emoji: `\u{1F467}\u{1F3FD}`, entity: `&#x1F467&#x1F3FD`, name: `Girl: Medium Skin Tone` },
      { emoji: `\u{1F467}\u{1F3FE}`, entity: `&#x1F467&#x1F3FE`, name: `Girl: Medium-Dark Skin Tone` },
      { emoji: `\u{1F467}\u{1F3FF}`, entity: `&#x1F467&#x1F3FF`, name: `Girl: Dark Skin Tone` },
      { emoji: `\u{1F468}`, entity: `&#x1F468`, name: `Man` },
      { emoji: `\u{1F468}\u{1F3FB}`, entity: `&#x1F468&#x1F3FB`, name: `Man: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}`, entity: `&#x1F468&#x1F3FC`, name: `Man: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}`, entity: `&#x1F468&#x1F3FD`, name: `Man: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}`, entity: `&#x1F468&#x1F3FE`, name: `Man: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}`, entity: `&#x1F468&#x1F3FF`, name: `Man: Dark Skin Tone` },
      { emoji: `\u{1F469}`, entity: `&#x1F469`, name: `Woman` },
      { emoji: `\u{1F469}\u{1F3FB}`, entity: `&#x1F469&#x1F3FB`, name: `Woman: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}`, entity: `&#x1F469&#x1F3FC`, name: `Woman: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}`, entity: `&#x1F469&#x1F3FD`, name: `Woman: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}`, entity: `&#x1F469&#x1F3FE`, name: `Woman: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}`, entity: `&#x1F469&#x1F3FF`, name: `Woman: Dark Skin Tone` },
      { emoji: `\u{1F474}`, entity: `&#x1F474`, name: `Old Man` },
      { emoji: `\u{1F474}\u{1F3FB}`, entity: `&#x1F474&#x1F3FB`, name: `Old Man: Light Skin Tone` },
      { emoji: `\u{1F474}\u{1F3FC}`, entity: `&#x1F474&#x1F3FC`, name: `Old Man: Medium-Light Skin Tone` },
      { emoji: `\u{1F474}\u{1F3FD}`, entity: `&#x1F474&#x1F3FD`, name: `Old Man: Medium Skin Tone` },
      { emoji: `\u{1F474}\u{1F3FE}`, entity: `&#x1F474&#x1F3FE`, name: `Old Man: Medium-Dark Skin Tone` },
      { emoji: `\u{1F474}\u{1F3FF}`, entity: `&#x1F474&#x1F3FF`, name: `Old Man: Dark Skin Tone` },
      { emoji: `\u{1F475}`, entity: `&#x1F475`, name: `Old Woman` },
      { emoji: `\u{1F475}\u{1F3FB}`, entity: `&#x1F475&#x1F3FB`, name: `Old Woman: Light Skin Tone` },
      { emoji: `\u{1F475}\u{1F3FC}`, entity: `&#x1F475&#x1F3FC`, name: `Old Woman: Medium-Light Skin Tone` },
      { emoji: `\u{1F475}\u{1F3FD}`, entity: `&#x1F475&#x1F3FD`, name: `Old Woman: Medium Skin Tone` },
      { emoji: `\u{1F475}\u{1F3FE}`, entity: `&#x1F475&#x1F3FE`, name: `Old Woman: Medium-Dark Skin Tone` },
      { emoji: `\u{1F475}\u{1F3FF}`, entity: `&#x1F475&#x1F3FF`, name: `Old Woman: Dark Skin Tone` },
      { emoji: `\u{1F476}`, entity: `&#x1F476`, name: `Baby` },
      { emoji: `\u{1F476}\u{1F3FB}`, entity: `&#x1F476&#x1F3FB`, name: `Baby: Light Skin Tone` },
      { emoji: `\u{1F476}\u{1F3FC}`, entity: `&#x1F476&#x1F3FC`, name: `Baby: Medium-Light Skin Tone` },
      { emoji: `\u{1F476}\u{1F3FD}`, entity: `&#x1F476&#x1F3FD`, name: `Baby: Medium Skin Tone` },
      { emoji: `\u{1F476}\u{1F3FE}`, entity: `&#x1F476&#x1F3FE`, name: `Baby: Medium-Dark Skin Tone` },
      { emoji: `\u{1F476}\u{1F3FF}`, entity: `&#x1F476&#x1F3FF`, name: `Baby: Dark Skin Tone` },
      { emoji: `\u{1F47C}`, entity: `&#x1F47C`, name: `Baby Angel` },
      { emoji: `\u{1F47C}\u{1F3FB}`, entity: `&#x1F47C&#x1F3FB`, name: `Baby Angel: Light Skin Tone` },
      { emoji: `\u{1F47C}\u{1F3FC}`, entity: `&#x1F47C&#x1F3FC`, name: `Baby Angel: Medium-Light Skin Tone` },
      { emoji: `\u{1F47C}\u{1F3FD}`, entity: `&#x1F47C&#x1F3FD`, name: `Baby Angel: Medium Skin Tone` },
      { emoji: `\u{1F47C}\u{1F3FE}`, entity: `&#x1F47C&#x1F3FE`, name: `Baby Angel: Medium-Dark Skin Tone` },
      { emoji: `\u{1F47C}\u{1F3FF}`, entity: `&#x1F47C&#x1F3FF`, name: `Baby Angel: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{2695}\u{FE0F}`, entity: `&#x1F468&#x200D&#x2695&#xFE0F`, name: `Man Health Worker` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{2695}\u{FE0F}`, entity: `&#x1F468&#x1F3FB&#x200D&#x2695&#xFE0F`, name: `Man Health Worker: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{2695}\u{FE0F}`, entity: `&#x1F468&#x1F3FC&#x200D&#x2695&#xFE0F`, name: `Man Health Worker: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{2695}\u{FE0F}`, entity: `&#x1F468&#x1F3FD&#x200D&#x2695&#xFE0F`, name: `Man Health Worker: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{2695}\u{FE0F}`, entity: `&#x1F468&#x1F3FE&#x200D&#x2695&#xFE0F`, name: `Man Health Worker: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{2695}\u{FE0F}`, entity: `&#x1F468&#x1F3FF&#x200D&#x2695&#xFE0F`, name: `Man Health Worker: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{2695}\u{FE0F}`, entity: `&#x1F469&#x200D&#x2695&#xFE0F`, name: `Woman Health Worker` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{2695}\u{FE0F}`, entity: `&#x1F469&#x1F3FB&#x200D&#x2695&#xFE0F`, name: `Woman Health Worker: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{2695}\u{FE0F}`, entity: `&#x1F469&#x1F3FC&#x200D&#x2695&#xFE0F`, name: `Woman Health Worker: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{2695}\u{FE0F}`, entity: `&#x1F469&#x1F3FD&#x200D&#x2695&#xFE0F`, name: `Woman Health Worker: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{2695}\u{FE0F}`, entity: `&#x1F469&#x1F3FE&#x200D&#x2695&#xFE0F`, name: `Woman Health Worker: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{2695}\u{FE0F}`, entity: `&#x1F469&#x1F3FF&#x200D&#x2695&#xFE0F`, name: `Woman Health Worker: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F393}`, entity: `&#x1F468&#x200D&#x1F393`, name: `Man Student` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F393}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F393`, name: `Man Student: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F393}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F393`, name: `Man Student: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F393}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F393`, name: `Man Student: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F393}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F393`, name: `Man Student: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F393}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F393`, name: `Man Student: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F393}`, entity: `&#x1F469&#x200D&#x1F393`, name: `Woman Student` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F393}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F393`, name: `Woman Student: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F393}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F393`, name: `Woman Student: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F393}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F393`, name: `Woman Student: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F393}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F393`, name: `Woman Student: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F393}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F393`, name: `Woman Student: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F3EB}`, entity: `&#x1F468&#x200D&#x1F3EB`, name: `Man Teacher` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F3EB}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F3EB`, name: `Man Teacher: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F3EB}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F3EB`, name: `Man Teacher: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F3EB}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F3EB`, name: `Man Teacher: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F3EB}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F3EB`, name: `Man Teacher: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F3EB}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F3EB`, name: `Man Teacher: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F3EB}`, entity: `&#x1F469&#x200D&#x1F3EB`, name: `Woman Teacher` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F3EB}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F3EB`, name: `Woman Teacher: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F3EB}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F3EB`, name: `Woman Teacher: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F3EB}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F3EB`, name: `Woman Teacher: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F3EB}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F3EB`, name: `Woman Teacher: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F3EB}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F3EB`, name: `Woman Teacher: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{2696}\u{FE0F}`, entity: `&#x1F468&#x200D&#x2696&#xFE0F`, name: `Man Judge` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{2696}\u{FE0F}`, entity: `&#x1F468&#x1F3FB&#x200D&#x2696&#xFE0F`, name: `Man Judge: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{2696}\u{FE0F}`, entity: `&#x1F468&#x1F3FC&#x200D&#x2696&#xFE0F`, name: `Man Judge: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{2696}\u{FE0F}`, entity: `&#x1F468&#x1F3FD&#x200D&#x2696&#xFE0F`, name: `Man Judge: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{2696}\u{FE0F}`, entity: `&#x1F468&#x1F3FE&#x200D&#x2696&#xFE0F`, name: `Man Judge: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{2696}\u{FE0F}`, entity: `&#x1F468&#x1F3FF&#x200D&#x2696&#xFE0F`, name: `Man Judge: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{2696}\u{FE0F}`, entity: `&#x1F469&#x200D&#x2696&#xFE0F`, name: `Woman Judge` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{2696}\u{FE0F}`, entity: `&#x1F469&#x1F3FB&#x200D&#x2696&#xFE0F`, name: `Woman Judge: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{2696}\u{FE0F}`, entity: `&#x1F469&#x1F3FC&#x200D&#x2696&#xFE0F`, name: `Woman Judge: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{2696}\u{FE0F}`, entity: `&#x1F469&#x1F3FD&#x200D&#x2696&#xFE0F`, name: `Woman Judge: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{2696}\u{FE0F}`, entity: `&#x1F469&#x1F3FE&#x200D&#x2696&#xFE0F`, name: `Woman Judge: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{2696}\u{FE0F}`, entity: `&#x1F469&#x1F3FF&#x200D&#x2696&#xFE0F`, name: `Woman Judge: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F33E}`, entity: `&#x1F468&#x200D&#x1F33E`, name: `Man Farmer` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F33E}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F33E`, name: `Man Farmer: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F33E}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F33E`, name: `Man Farmer: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F33E}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F33E`, name: `Man Farmer: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F33E}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F33E`, name: `Man Farmer: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F33E}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F33E`, name: `Man Farmer: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F33E}`, entity: `&#x1F469&#x200D&#x1F33E`, name: `Woman Farmer` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F33E}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F33E`, name: `Woman Farmer: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F33E}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F33E`, name: `Woman Farmer: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F33E}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F33E`, name: `Woman Farmer: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F33E}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F33E`, name: `Woman Farmer: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F33E}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F33E`, name: `Woman Farmer: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F373}`, entity: `&#x1F468&#x200D&#x1F373`, name: `Man Cook` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F373}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F373`, name: `Man Cook: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F373}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F373`, name: `Man Cook: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F373}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F373`, name: `Man Cook: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F373}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F373`, name: `Man Cook: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F373}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F373`, name: `Man Cook: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F373}`, entity: `&#x1F469&#x200D&#x1F373`, name: `Woman Cook` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F373}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F373`, name: `Woman Cook: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F373}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F373`, name: `Woman Cook: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F373}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F373`, name: `Woman Cook: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F373}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F373`, name: `Woman Cook: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F373}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F373`, name: `Woman Cook: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F527}`, entity: `&#x1F468&#x200D&#x1F527`, name: `Man Mechanic` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F527}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F527`, name: `Man Mechanic: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F527}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F527`, name: `Man Mechanic: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F527}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F527`, name: `Man Mechanic: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F527}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F527`, name: `Man Mechanic: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F527}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F527`, name: `Man Mechanic: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F527}`, entity: `&#x1F469&#x200D&#x1F527`, name: `Woman Mechanic` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F527}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F527`, name: `Woman Mechanic: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F527}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F527`, name: `Woman Mechanic: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F527}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F527`, name: `Woman Mechanic: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F527}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F527`, name: `Woman Mechanic: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F527}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F527`, name: `Woman Mechanic: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F3ED}`, entity: `&#x1F468&#x200D&#x1F3ED`, name: `Man Factory Worker` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F3ED}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F3ED`, name: `Man Factory Worker: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F3ED}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F3ED`, name: `Man Factory Worker: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F3ED}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F3ED`, name: `Man Factory Worker: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F3ED}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F3ED`, name: `Man Factory Worker: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F3ED}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F3ED`, name: `Man Factory Worker: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F3ED}`, entity: `&#x1F469&#x200D&#x1F3ED`, name: `Woman Factory Worker` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F3ED}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F3ED`, name: `Woman Factory Worker: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F3ED}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F3ED`, name: `Woman Factory Worker: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F3ED}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F3ED`, name: `Woman Factory Worker: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F3ED}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F3ED`, name: `Woman Factory Worker: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F3ED}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F3ED`, name: `Woman Factory Worker: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F4BC}`, entity: `&#x1F468&#x200D&#x1F4BC`, name: `Man Office Worker` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F4BC}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F4BC`, name: `Man Office Worker: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F4BC}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F4BC`, name: `Man Office Worker: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F4BC}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F4BC`, name: `Man Office Worker: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F4BC}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F4BC`, name: `Man Office Worker: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F4BC}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F4BC`, name: `Man Office Worker: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F4BC}`, entity: `&#x1F469&#x200D&#x1F4BC`, name: `Woman Office Worker` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F4BC}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F4BC`, name: `Woman Office Worker: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F4BC}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F4BC`, name: `Woman Office Worker: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F4BC}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F4BC`, name: `Woman Office Worker: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F4BC}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F4BC`, name: `Woman Office Worker: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F4BC}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F4BC`, name: `Woman Office Worker: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F52C}`, entity: `&#x1F468&#x200D&#x1F52C`, name: `Man Scientist` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F52C}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F52C`, name: `Man Scientist: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F52C}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F52C`, name: `Man Scientist: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F52C}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F52C`, name: `Man Scientist: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F52C}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F52C`, name: `Man Scientist: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F52C}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F52C`, name: `Man Scientist: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F52C}`, entity: `&#x1F469&#x200D&#x1F52C`, name: `Woman Scientist` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F52C}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F52C`, name: `Woman Scientist: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F52C}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F52C`, name: `Woman Scientist: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F52C}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F52C`, name: `Woman Scientist: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F52C}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F52C`, name: `Woman Scientist: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F52C}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F52C`, name: `Woman Scientist: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F4BB}`, entity: `&#x1F468&#x200D&#x1F4BB`, name: `Man Technologist` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F4BB}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F4BB`, name: `Man Technologist: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F4BB}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F4BB`, name: `Man Technologist: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F4BB}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F4BB`, name: `Man Technologist: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F4BB}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F4BB`, name: `Man Technologist: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F4BB}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F4BB`, name: `Man Technologist: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F4BB}`, entity: `&#x1F469&#x200D&#x1F4BB`, name: `Woman Technologist` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F4BB}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F4BB`, name: `Woman Technologist: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F4BB}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F4BB`, name: `Woman Technologist: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F4BB}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F4BB`, name: `Woman Technologist: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F4BB}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F4BB`, name: `Woman Technologist: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F4BB}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F4BB`, name: `Woman Technologist: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F3A4}`, entity: `&#x1F468&#x200D&#x1F3A4`, name: `Man Singer` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F3A4}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F3A4`, name: `Man Singer: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F3A4}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F3A4`, name: `Man Singer: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F3A4}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F3A4`, name: `Man Singer: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F3A4}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F3A4`, name: `Man Singer: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F3A4}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F3A4`, name: `Man Singer: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F3A4}`, entity: `&#x1F469&#x200D&#x1F3A4`, name: `Woman Singer` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F3A4}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F3A4`, name: `Woman Singer: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F3A4}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F3A4`, name: `Woman Singer: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F3A4}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F3A4`, name: `Woman Singer: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F3A4}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F3A4`, name: `Woman Singer: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F3A4}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F3A4`, name: `Woman Singer: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F3A8}`, entity: `&#x1F468&#x200D&#x1F3A8`, name: `Man Artist` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F3A8}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F3A8`, name: `Man Artist: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F3A8}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F3A8`, name: `Man Artist: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F3A8}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F3A8`, name: `Man Artist: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F3A8}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F3A8`, name: `Man Artist: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F3A8}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F3A8`, name: `Man Artist: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F3A8}`, entity: `&#x1F469&#x200D&#x1F3A8`, name: `Woman Artist` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F3A8}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F3A8`, name: `Woman Artist: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F3A8}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F3A8`, name: `Woman Artist: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F3A8}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F3A8`, name: `Woman Artist: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F3A8}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F3A8`, name: `Woman Artist: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F3A8}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F3A8`, name: `Woman Artist: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{2708}\u{FE0F}`, entity: `&#x1F468&#x200D&#x2708&#xFE0F`, name: `Man Pilot` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{2708}\u{FE0F}`, entity: `&#x1F468&#x1F3FB&#x200D&#x2708&#xFE0F`, name: `Man Pilot: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{2708}\u{FE0F}`, entity: `&#x1F468&#x1F3FC&#x200D&#x2708&#xFE0F`, name: `Man Pilot: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{2708}\u{FE0F}`, entity: `&#x1F468&#x1F3FD&#x200D&#x2708&#xFE0F`, name: `Man Pilot: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{2708}\u{FE0F}`, entity: `&#x1F468&#x1F3FE&#x200D&#x2708&#xFE0F`, name: `Man Pilot: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{2708}\u{FE0F}`, entity: `&#x1F468&#x1F3FF&#x200D&#x2708&#xFE0F`, name: `Man Pilot: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{2708}\u{FE0F}`, entity: `&#x1F469&#x200D&#x2708&#xFE0F`, name: `Woman Pilot` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{2708}\u{FE0F}`, entity: `&#x1F469&#x1F3FB&#x200D&#x2708&#xFE0F`, name: `Woman Pilot: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{2708}\u{FE0F}`, entity: `&#x1F469&#x1F3FC&#x200D&#x2708&#xFE0F`, name: `Woman Pilot: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{2708}\u{FE0F}`, entity: `&#x1F469&#x1F3FD&#x200D&#x2708&#xFE0F`, name: `Woman Pilot: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{2708}\u{FE0F}`, entity: `&#x1F469&#x1F3FE&#x200D&#x2708&#xFE0F`, name: `Woman Pilot: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{2708}\u{FE0F}`, entity: `&#x1F469&#x1F3FF&#x200D&#x2708&#xFE0F`, name: `Woman Pilot: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F680}`, entity: `&#x1F468&#x200D&#x1F680`, name: `Man Astronaut` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F680}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F680`, name: `Man Astronaut: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F680}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F680`, name: `Man Astronaut: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F680}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F680`, name: `Man Astronaut: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F680}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F680`, name: `Man Astronaut: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F680}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F680`, name: `Man Astronaut: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F680}`, entity: `&#x1F469&#x200D&#x1F680`, name: `Woman Astronaut` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F680}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F680`, name: `Woman Astronaut: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F680}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F680`, name: `Woman Astronaut: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F680}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F680`, name: `Woman Astronaut: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F680}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F680`, name: `Woman Astronaut: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F680}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F680`, name: `Woman Astronaut: Dark Skin Tone` },
      { emoji: `\u{1F468}\u{200D}\u{1F692}`, entity: `&#x1F468&#x200D&#x1F692`, name: `Man Firefighter` },
      { emoji: `\u{1F468}\u{1F3FB}\u{200D}\u{1F692}`, entity: `&#x1F468&#x1F3FB&#x200D&#x1F692`, name: `Man Firefighter: Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FC}\u{200D}\u{1F692}`, entity: `&#x1F468&#x1F3FC&#x200D&#x1F692`, name: `Man Firefighter: Medium-Light Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FD}\u{200D}\u{1F692}`, entity: `&#x1F468&#x1F3FD&#x200D&#x1F692`, name: `Man Firefighter: Medium Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FE}\u{200D}\u{1F692}`, entity: `&#x1F468&#x1F3FE&#x200D&#x1F692`, name: `Man Firefighter: Medium-Dark Skin Tone` },
      { emoji: `\u{1F468}\u{1F3FF}\u{200D}\u{1F692}`, entity: `&#x1F468&#x1F3FF&#x200D&#x1F692`, name: `Man Firefighter: Dark Skin Tone` },
      { emoji: `\u{1F469}\u{200D}\u{1F692}`, entity: `&#x1F469&#x200D&#x1F692`, name: `Woman Firefighter` },
      { emoji: `\u{1F469}\u{1F3FB}\u{200D}\u{1F692}`, entity: `&#x1F469&#x1F3FB&#x200D&#x1F692`, name: `Woman Firefighter: Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FC}\u{200D}\u{1F692}`, entity: `&#x1F469&#x1F3FC&#x200D&#x1F692`, name: `Woman Firefighter: Medium-Light Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FD}\u{200D}\u{1F692}`, entity: `&#x1F469&#x1F3FD&#x200D&#x1F692`, name: `Woman Firefighter: Medium Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FE}\u{200D}\u{1F692}`, entity: `&#x1F469&#x1F3FE&#x200D&#x1F692`, name: `Woman Firefighter: Medium-Dark Skin Tone` },
      { emoji: `\u{1F469}\u{1F3FF}\u{200D}\u{1F692}`, entity: `&#x1F469&#x1F3FF&#x200D&#x1F692`, name: `Woman Firefighter: Dark Skin Tone` },
      { emoji: `\u{1F46E}`, entity: `&#x1F46E`, name: `Police Officer` },
      { emoji: `\u{1F46E}\u{1F3FB}`, entity: `&#x1F46E&#x1F3FB`, name: `Police Officer: Light Skin Tone` },
      { emoji: `\u{1F46E}\u{1F3FC}`, entity: `&#x1F46E&#x1F3FC`, name: `Police Officer: Medium-Light Skin Tone` },
      { emoji: `\u{1F46E}\u{1F3FD}`, entity: `&#x1F46E&#x1F3FD`, name: `Police Officer: Medium Skin Tone` },
      { emoji: `\u{1F46E}\u{1F3FE}`, entity: `&#x1F46E&#x1F3FE`, name: `Police Officer: Medium-Dark Skin Tone` },
      { emoji: `\u{1F46E}\u{1F3FF}`, entity: `&#x1F46E&#x1F3FF`, name: `Police Officer: Dark Skin Tone` },
      { emoji: `\u{1F46E}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F46E&#x200D&#x2642&#xFE0F`, name: `Man Police Officer` },
      { emoji: `\u{1F46E}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F46E&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Police Officer: Light Skin Tone` },
      { emoji: `\u{1F46E}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F46E&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Police Officer: Medium-Light Skin Tone` },
      { emoji: `\u{1F46E}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F46E&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Police Officer: Medium Skin Tone` },
      { emoji: `\u{1F46E}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F46E&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Police Officer: Medium-Dark Skin Tone` },
      { emoji: `\u{1F46E}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F46E&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Police Officer: Dark Skin Tone` },
      { emoji: `\u{1F46E}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F46E&#x200D&#x2640&#xFE0F`, name: `Woman Police Officer` },
      { emoji: `\u{1F46E}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F46E&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Police Officer: Light Skin Tone` },
      { emoji: `\u{1F46E}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F46E&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Police Officer: Medium-Light Skin Tone` },
      { emoji: `\u{1F46E}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F46E&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Police Officer: Medium Skin Tone` },
      { emoji: `\u{1F46E}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F46E&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Police Officer: Medium-Dark Skin Tone` },
      { emoji: `\u{1F46E}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F46E&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Police Officer: Dark Skin Tone` },
      { emoji: `\u{1F575}`, entity: `&#x1F575`, name: `Detective` },
      { emoji: `\u{1F575}\u{1F3FB}`, entity: `&#x1F575&#x1F3FB`, name: `Detective: Light Skin Tone` },
      { emoji: `\u{1F575}\u{1F3FC}`, entity: `&#x1F575&#x1F3FC`, name: `Detective: Medium-Light Skin Tone` },
      { emoji: `\u{1F575}\u{1F3FD}`, entity: `&#x1F575&#x1F3FD`, name: `Detective: Medium Skin Tone` },
      { emoji: `\u{1F575}\u{1F3FE}`, entity: `&#x1F575&#x1F3FE`, name: `Detective: Medium-Dark Skin Tone` },
      { emoji: `\u{1F575}\u{1F3FF}`, entity: `&#x1F575&#x1F3FF`, name: `Detective: Dark Skin Tone` },
      { emoji: `\u{1F575}\u{FE0F}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F575&#xFE0F&#x200D&#x2642&#xFE0F`, name: `Man Detective` },
      { emoji: `\u{1F575}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F575&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Detective: Light Skin Tone` },
      { emoji: `\u{1F575}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F575&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Detective: Medium-Light Skin Tone` },
      { emoji: `\u{1F575}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F575&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Detective: Medium Skin Tone` },
      { emoji: `\u{1F575}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F575&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Detective: Medium-Dark Skin Tone` },
      { emoji: `\u{1F575}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F575&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Detective: Dark Skin Tone` },
      { emoji: `\u{1F575}\u{FE0F}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F575&#xFE0F&#x200D&#x2640&#xFE0F`, name: `Woman Detective` },
      { emoji: `\u{1F575}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F575&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Detective: Light Skin Tone` },
      { emoji: `\u{1F575}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F575&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Detective: Medium-Light Skin Tone` },
      { emoji: `\u{1F575}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F575&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Detective: Medium Skin Tone` },
      { emoji: `\u{1F575}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F575&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Detective: Medium-Dark Skin Tone` },
      { emoji: `\u{1F575}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F575&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Detective: Dark Skin Tone` },
      { emoji: `\u{1F482}`, entity: `&#x1F482`, name: `Guard` },
      { emoji: `\u{1F482}\u{1F3FB}`, entity: `&#x1F482&#x1F3FB`, name: `Guard: Light Skin Tone` },
      { emoji: `\u{1F482}\u{1F3FC}`, entity: `&#x1F482&#x1F3FC`, name: `Guard: Medium-Light Skin Tone` },
      { emoji: `\u{1F482}\u{1F3FD}`, entity: `&#x1F482&#x1F3FD`, name: `Guard: Medium Skin Tone` },
      { emoji: `\u{1F482}\u{1F3FE}`, entity: `&#x1F482&#x1F3FE`, name: `Guard: Medium-Dark Skin Tone` },
      { emoji: `\u{1F482}\u{1F3FF}`, entity: `&#x1F482&#x1F3FF`, name: `Guard: Dark Skin Tone` },
      { emoji: `\u{1F482}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F482&#x200D&#x2642&#xFE0F`, name: `Man Guard` },
      { emoji: `\u{1F482}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F482&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Guard: Light Skin Tone` },
      { emoji: `\u{1F482}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F482&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Guard: Medium-Light Skin Tone` },
      { emoji: `\u{1F482}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F482&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Guard: Medium Skin Tone` },
      { emoji: `\u{1F482}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F482&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Guard: Medium-Dark Skin Tone` },
      { emoji: `\u{1F482}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F482&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Guard: Dark Skin Tone` },
      { emoji: `\u{1F482}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F482&#x200D&#x2640&#xFE0F`, name: `Woman Guard` },
      { emoji: `\u{1F482}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F482&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Guard: Light Skin Tone` },
      { emoji: `\u{1F482}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F482&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Guard: Medium-Light Skin Tone` },
      { emoji: `\u{1F482}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F482&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Guard: Medium Skin Tone` },
      { emoji: `\u{1F482}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F482&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Guard: Medium-Dark Skin Tone` },
      { emoji: `\u{1F482}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F482&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Guard: Dark Skin Tone` },
      { emoji: `\u{1F477}`, entity: `&#x1F477`, name: `Construction Worker` },
      { emoji: `\u{1F477}\u{1F3FB}`, entity: `&#x1F477&#x1F3FB`, name: `Construction Worker: Light Skin Tone` },
      { emoji: `\u{1F477}\u{1F3FC}`, entity: `&#x1F477&#x1F3FC`, name: `Construction Worker: Medium-Light Skin Tone` },
      { emoji: `\u{1F477}\u{1F3FD}`, entity: `&#x1F477&#x1F3FD`, name: `Construction Worker: Medium Skin Tone` },
      { emoji: `\u{1F477}\u{1F3FE}`, entity: `&#x1F477&#x1F3FE`, name: `Construction Worker: Medium-Dark Skin Tone` },
      { emoji: `\u{1F477}\u{1F3FF}`, entity: `&#x1F477&#x1F3FF`, name: `Construction Worker: Dark Skin Tone` },
      { emoji: `\u{1F477}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F477&#x200D&#x2642&#xFE0F`, name: `Man Construction Worker` },
      { emoji: `\u{1F477}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F477&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Construction Worker: Light Skin Tone` },
      { emoji: `\u{1F477}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F477&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Construction Worker: Medium-Light Skin Tone` },
      { emoji: `\u{1F477}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F477&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Construction Worker: Medium Skin Tone` },
      { emoji: `\u{1F477}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F477&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Construction Worker: Medium-Dark Skin Tone` },
      { emoji: `\u{1F477}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F477&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Construction Worker: Dark Skin Tone` },
      { emoji: `\u{1F477}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F477&#x200D&#x2640&#xFE0F`, name: `Woman Construction Worker` },
      { emoji: `\u{1F477}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F477&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Construction Worker: Light Skin Tone` },
      { emoji: `\u{1F477}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F477&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Construction Worker: Medium-Light Skin Tone` },
      { emoji: `\u{1F477}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F477&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Construction Worker: Medium Skin Tone` },
      { emoji: `\u{1F477}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F477&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Construction Worker: Medium-Dark Skin Tone` },
      { emoji: `\u{1F477}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F477&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Construction Worker: Dark Skin Tone` },
      { emoji: `\u{1F473}`, entity: `&#x1F473`, name: `Person Wearing Turban` },
      { emoji: `\u{1F473}\u{1F3FB}`, entity: `&#x1F473&#x1F3FB`, name: `Person Wearing Turban: Light Skin Tone` },
      { emoji: `\u{1F473}\u{1F3FC}`, entity: `&#x1F473&#x1F3FC`, name: `Person Wearing Turban: Medium-Light Skin Tone` },
      { emoji: `\u{1F473}\u{1F3FD}`, entity: `&#x1F473&#x1F3FD`, name: `Person Wearing Turban: Medium Skin Tone` },
      { emoji: `\u{1F473}\u{1F3FE}`, entity: `&#x1F473&#x1F3FE`, name: `Person Wearing Turban: Medium-Dark Skin Tone` },
      { emoji: `\u{1F473}\u{1F3FF}`, entity: `&#x1F473&#x1F3FF`, name: `Person Wearing Turban: Dark Skin Tone` },
      { emoji: `\u{1F473}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F473&#x200D&#x2642&#xFE0F`, name: `Man Wearing Turban` },
      { emoji: `\u{1F473}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F473&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Wearing Turban: Light Skin Tone` },
      { emoji: `\u{1F473}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F473&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Wearing Turban: Medium-Light Skin Tone` },
      { emoji: `\u{1F473}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F473&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Wearing Turban: Medium Skin Tone` },
      { emoji: `\u{1F473}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F473&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Wearing Turban: Medium-Dark Skin Tone` },
      { emoji: `\u{1F473}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F473&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Wearing Turban: Dark Skin Tone` },
      { emoji: `\u{1F473}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F473&#x200D&#x2640&#xFE0F`, name: `Woman Wearing Turban` },
      { emoji: `\u{1F473}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F473&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Wearing Turban: Light Skin Tone` },
      { emoji: `\u{1F473}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F473&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Wearing Turban: Medium-Light Skin Tone` },
      { emoji: `\u{1F473}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F473&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Wearing Turban: Medium Skin Tone` },
      { emoji: `\u{1F473}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F473&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Wearing Turban: Medium-Dark Skin Tone` },
      { emoji: `\u{1F473}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F473&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Wearing Turban: Dark Skin Tone` },
      { emoji: `\u{1F471}`, entity: `&#x1F471`, name: `Blond-Haired Person` },
      { emoji: `\u{1F471}\u{1F3FB}`, entity: `&#x1F471&#x1F3FB`, name: `Blond-Haired Person: Light Skin Tone` },
      { emoji: `\u{1F471}\u{1F3FC}`, entity: `&#x1F471&#x1F3FC`, name: `Blond-Haired Person: Medium-Light Skin Tone` },
      { emoji: `\u{1F471}\u{1F3FD}`, entity: `&#x1F471&#x1F3FD`, name: `Blond-Haired Person: Medium Skin Tone` },
      { emoji: `\u{1F471}\u{1F3FE}`, entity: `&#x1F471&#x1F3FE`, name: `Blond-Haired Person: Medium-Dark Skin Tone` },
      { emoji: `\u{1F471}\u{1F3FF}`, entity: `&#x1F471&#x1F3FF`, name: `Blond-Haired Person: Dark Skin Tone` },
      { emoji: `\u{1F471}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F471&#x200D&#x2642&#xFE0F`, name: `Blond-Haired Man` },
      { emoji: `\u{1F471}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F471&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Blond-Haired Man: Light Skin Tone` },
      { emoji: `\u{1F471}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F471&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Blond-Haired Man: Medium-Light Skin Tone` },
      { emoji: `\u{1F471}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F471&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Blond-Haired Man: Medium Skin Tone` },
      { emoji: `\u{1F471}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F471&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Blond-Haired Man: Medium-Dark Skin Tone` },
      { emoji: `\u{1F471}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F471&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Blond-Haired Man: Dark Skin Tone` },
      { emoji: `\u{1F471}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F471&#x200D&#x2640&#xFE0F`, name: `Blond-Haired Woman` },
      { emoji: `\u{1F471}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F471&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Blond-Haired Woman: Light Skin Tone` },
      { emoji: `\u{1F471}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F471&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Blond-Haired Woman: Medium-Light Skin Tone` },
      { emoji: `\u{1F471}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F471&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Blond-Haired Woman: Medium Skin Tone` },
      { emoji: `\u{1F471}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F471&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Blond-Haired Woman: Medium-Dark Skin Tone` },
      { emoji: `\u{1F471}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F471&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Blond-Haired Woman: Dark Skin Tone` },
      { emoji: `\u{1F385}`, entity: `&#x1F385`, name: `Santa Claus` },
      { emoji: `\u{1F385}\u{1F3FB}`, entity: `&#x1F385&#x1F3FB`, name: `Santa Claus: Light Skin Tone` },
      { emoji: `\u{1F385}\u{1F3FC}`, entity: `&#x1F385&#x1F3FC`, name: `Santa Claus: Medium-Light Skin Tone` },
      { emoji: `\u{1F385}\u{1F3FD}`, entity: `&#x1F385&#x1F3FD`, name: `Santa Claus: Medium Skin Tone` },
      { emoji: `\u{1F385}\u{1F3FE}`, entity: `&#x1F385&#x1F3FE`, name: `Santa Claus: Medium-Dark Skin Tone` },
      { emoji: `\u{1F385}\u{1F3FF}`, entity: `&#x1F385&#x1F3FF`, name: `Santa Claus: Dark Skin Tone` },
      { emoji: `\u{1F936}`, entity: `&#x1F936`, name: `Mrs. Claus` },
      { emoji: `\u{1F936}\u{1F3FB}`, entity: `&#x1F936&#x1F3FB`, name: `Mrs. Claus: Light Skin Tone` },
      { emoji: `\u{1F936}\u{1F3FC}`, entity: `&#x1F936&#x1F3FC`, name: `Mrs. Claus: Medium-Light Skin Tone` },
      { emoji: `\u{1F936}\u{1F3FD}`, entity: `&#x1F936&#x1F3FD`, name: `Mrs. Claus: Medium Skin Tone` },
      { emoji: `\u{1F936}\u{1F3FE}`, entity: `&#x1F936&#x1F3FE`, name: `Mrs. Claus: Medium-Dark Skin Tone` },
      { emoji: `\u{1F936}\u{1F3FF}`, entity: `&#x1F936&#x1F3FF`, name: `Mrs. Claus: Dark Skin Tone` },
      { emoji: `\u{1F478}`, entity: `&#x1F478`, name: `Princess` },
      { emoji: `\u{1F478}\u{1F3FB}`, entity: `&#x1F478&#x1F3FB`, name: `Princess: Light Skin Tone` },
      { emoji: `\u{1F478}\u{1F3FC}`, entity: `&#x1F478&#x1F3FC`, name: `Princess: Medium-Light Skin Tone` },
      { emoji: `\u{1F478}\u{1F3FD}`, entity: `&#x1F478&#x1F3FD`, name: `Princess: Medium Skin Tone` },
      { emoji: `\u{1F478}\u{1F3FE}`, entity: `&#x1F478&#x1F3FE`, name: `Princess: Medium-Dark Skin Tone` },
      { emoji: `\u{1F478}\u{1F3FF}`, entity: `&#x1F478&#x1F3FF`, name: `Princess: Dark Skin Tone` },
      { emoji: `\u{1F934}`, entity: `&#x1F934`, name: `Prince` },
      { emoji: `\u{1F934}\u{1F3FB}`, entity: `&#x1F934&#x1F3FB`, name: `Prince: Light Skin Tone` },
      { emoji: `\u{1F934}\u{1F3FC}`, entity: `&#x1F934&#x1F3FC`, name: `Prince: Medium-Light Skin Tone` },
      { emoji: `\u{1F934}\u{1F3FD}`, entity: `&#x1F934&#x1F3FD`, name: `Prince: Medium Skin Tone` },
      { emoji: `\u{1F934}\u{1F3FE}`, entity: `&#x1F934&#x1F3FE`, name: `Prince: Medium-Dark Skin Tone` },
      { emoji: `\u{1F934}\u{1F3FF}`, entity: `&#x1F934&#x1F3FF`, name: `Prince: Dark Skin Tone` },
      { emoji: `\u{1F470}`, entity: `&#x1F470`, name: `Bride With Veil` },
      { emoji: `\u{1F470}\u{1F3FB}`, entity: `&#x1F470&#x1F3FB`, name: `Bride With Veil: Light Skin Tone` },
      { emoji: `\u{1F470}\u{1F3FC}`, entity: `&#x1F470&#x1F3FC`, name: `Bride With Veil: Medium-Light Skin Tone` },
      { emoji: `\u{1F470}\u{1F3FD}`, entity: `&#x1F470&#x1F3FD`, name: `Bride With Veil: Medium Skin Tone` },
      { emoji: `\u{1F470}\u{1F3FE}`, entity: `&#x1F470&#x1F3FE`, name: `Bride With Veil: Medium-Dark Skin Tone` },
      { emoji: `\u{1F470}\u{1F3FF}`, entity: `&#x1F470&#x1F3FF`, name: `Bride With Veil: Dark Skin Tone` },
      { emoji: `\u{1F935}`, entity: `&#x1F935`, name: `Man In Tuxedo` },
      { emoji: `\u{1F935}\u{1F3FB}`, entity: `&#x1F935&#x1F3FB`, name: `Man In Tuxedo: Light Skin Tone` },
      { emoji: `\u{1F935}\u{1F3FC}`, entity: `&#x1F935&#x1F3FC`, name: `Man In Tuxedo: Medium-Light Skin Tone` },
      { emoji: `\u{1F935}\u{1F3FD}`, entity: `&#x1F935&#x1F3FD`, name: `Man In Tuxedo: Medium Skin Tone` },
      { emoji: `\u{1F935}\u{1F3FE}`, entity: `&#x1F935&#x1F3FE`, name: `Man In Tuxedo: Medium-Dark Skin Tone` },
      { emoji: `\u{1F935}\u{1F3FF}`, entity: `&#x1F935&#x1F3FF`, name: `Man In Tuxedo: Dark Skin Tone` },
      { emoji: `\u{1F930}`, entity: `&#x1F930`, name: `Pregnant Woman` },
      { emoji: `\u{1F930}\u{1F3FB}`, entity: `&#x1F930&#x1F3FB`, name: `Pregnant Woman: Light Skin Tone` },
      { emoji: `\u{1F930}\u{1F3FC}`, entity: `&#x1F930&#x1F3FC`, name: `Pregnant Woman: Medium-Light Skin Tone` },
      { emoji: `\u{1F930}\u{1F3FD}`, entity: `&#x1F930&#x1F3FD`, name: `Pregnant Woman: Medium Skin Tone` },
      { emoji: `\u{1F930}\u{1F3FE}`, entity: `&#x1F930&#x1F3FE`, name: `Pregnant Woman: Medium-Dark Skin Tone` },
      { emoji: `\u{1F930}\u{1F3FF}`, entity: `&#x1F930&#x1F3FF`, name: `Pregnant Woman: Dark Skin Tone` },
      { emoji: `\u{1F472}`, entity: `&#x1F472`, name: `Man With Chinese Cap` },
      { emoji: `\u{1F472}\u{1F3FB}`, entity: `&#x1F472&#x1F3FB`, name: `Man With Chinese Cap: Light Skin Tone` },
      { emoji: `\u{1F472}\u{1F3FC}`, entity: `&#x1F472&#x1F3FC`, name: `Man With Chinese Cap: Medium-Light Skin Tone` },
      { emoji: `\u{1F472}\u{1F3FD}`, entity: `&#x1F472&#x1F3FD`, name: `Man With Chinese Cap: Medium Skin Tone` },
      { emoji: `\u{1F472}\u{1F3FE}`, entity: `&#x1F472&#x1F3FE`, name: `Man With Chinese Cap: Medium-Dark Skin Tone` },
      { emoji: `\u{1F472}\u{1F3FF}`, entity: `&#x1F472&#x1F3FF`, name: `Man With Chinese Cap: Dark Skin Tone` },
      { emoji: `\u{1F64D}`, entity: `&#x1F64D`, name: `Person Frowning` },
      { emoji: `\u{1F64D}\u{1F3FB}`, entity: `&#x1F64D&#x1F3FB`, name: `Person Frowning: Light Skin Tone` },
      { emoji: `\u{1F64D}\u{1F3FC}`, entity: `&#x1F64D&#x1F3FC`, name: `Person Frowning: Medium-Light Skin Tone` },
      { emoji: `\u{1F64D}\u{1F3FD}`, entity: `&#x1F64D&#x1F3FD`, name: `Person Frowning: Medium Skin Tone` },
      { emoji: `\u{1F64D}\u{1F3FE}`, entity: `&#x1F64D&#x1F3FE`, name: `Person Frowning: Medium-Dark Skin Tone` },
      { emoji: `\u{1F64D}\u{1F3FF}`, entity: `&#x1F64D&#x1F3FF`, name: `Person Frowning: Dark Skin Tone` },
      { emoji: `\u{1F64D}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64D&#x200D&#x2642&#xFE0F`, name: `Man Frowning` },
      { emoji: `\u{1F64D}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64D&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Frowning: Light Skin Tone` },
      { emoji: `\u{1F64D}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64D&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Frowning: Medium-Light Skin Tone` },
      { emoji: `\u{1F64D}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64D&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Frowning: Medium Skin Tone` },
      { emoji: `\u{1F64D}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64D&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Frowning: Medium-Dark Skin Tone` },
      { emoji: `\u{1F64D}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64D&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Frowning: Dark Skin Tone` },
      { emoji: `\u{1F64D}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64D&#x200D&#x2640&#xFE0F`, name: `Woman Frowning` },
      { emoji: `\u{1F64D}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64D&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Frowning: Light Skin Tone` },
      { emoji: `\u{1F64D}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64D&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Frowning: Medium-Light Skin Tone` },
      { emoji: `\u{1F64D}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64D&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Frowning: Medium Skin Tone` },
      { emoji: `\u{1F64D}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64D&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Frowning: Medium-Dark Skin Tone` },
      { emoji: `\u{1F64D}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64D&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Frowning: Dark Skin Tone` },
      { emoji: `\u{1F64E}`, entity: `&#x1F64E`, name: `Person Pouting` },
      { emoji: `\u{1F64E}\u{1F3FB}`, entity: `&#x1F64E&#x1F3FB`, name: `Person Pouting: Light Skin Tone` },
      { emoji: `\u{1F64E}\u{1F3FC}`, entity: `&#x1F64E&#x1F3FC`, name: `Person Pouting: Medium-Light Skin Tone` },
      { emoji: `\u{1F64E}\u{1F3FD}`, entity: `&#x1F64E&#x1F3FD`, name: `Person Pouting: Medium Skin Tone` },
      { emoji: `\u{1F64E}\u{1F3FE}`, entity: `&#x1F64E&#x1F3FE`, name: `Person Pouting: Medium-Dark Skin Tone` },
      { emoji: `\u{1F64E}\u{1F3FF}`, entity: `&#x1F64E&#x1F3FF`, name: `Person Pouting: Dark Skin Tone` },
      { emoji: `\u{1F64E}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64E&#x200D&#x2642&#xFE0F`, name: `Man Pouting` },
      { emoji: `\u{1F64E}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64E&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Pouting: Light Skin Tone` },
      { emoji: `\u{1F64E}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64E&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Pouting: Medium-Light Skin Tone` },
      { emoji: `\u{1F64E}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64E&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Pouting: Medium Skin Tone` },
      { emoji: `\u{1F64E}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64E&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Pouting: Medium-Dark Skin Tone` },
      { emoji: `\u{1F64E}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64E&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Pouting: Dark Skin Tone` },
      { emoji: `\u{1F64E}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64E&#x200D&#x2640&#xFE0F`, name: `Woman Pouting` },
      { emoji: `\u{1F64E}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64E&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Pouting: Light Skin Tone` },
      { emoji: `\u{1F64E}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64E&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Pouting: Medium-Light Skin Tone` },
      { emoji: `\u{1F64E}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64E&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Pouting: Medium Skin Tone` },
      { emoji: `\u{1F64E}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64E&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Pouting: Medium-Dark Skin Tone` },
      { emoji: `\u{1F64E}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64E&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Pouting: Dark Skin Tone` },
      { emoji: `\u{1F645}`, entity: `&#x1F645`, name: `Person Gesturing NO` },
      { emoji: `\u{1F645}\u{1F3FB}`, entity: `&#x1F645&#x1F3FB`, name: `Person Gesturing NO: Light Skin Tone` },
      { emoji: `\u{1F645}\u{1F3FC}`, entity: `&#x1F645&#x1F3FC`, name: `Person Gesturing NO: Medium-Light Skin Tone` },
      { emoji: `\u{1F645}\u{1F3FD}`, entity: `&#x1F645&#x1F3FD`, name: `Person Gesturing NO: Medium Skin Tone` },
      { emoji: `\u{1F645}\u{1F3FE}`, entity: `&#x1F645&#x1F3FE`, name: `Person Gesturing NO: Medium-Dark Skin Tone` },
      { emoji: `\u{1F645}\u{1F3FF}`, entity: `&#x1F645&#x1F3FF`, name: `Person Gesturing NO: Dark Skin Tone` },
      { emoji: `\u{1F645}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F645&#x200D&#x2642&#xFE0F`, name: `Man Gesturing NO` },
      { emoji: `\u{1F645}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F645&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Gesturing NO: Light Skin Tone` },
      { emoji: `\u{1F645}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F645&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Gesturing NO: Medium-Light Skin Tone` },
      { emoji: `\u{1F645}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F645&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Gesturing NO: Medium Skin Tone` },
      { emoji: `\u{1F645}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F645&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Gesturing NO: Medium-Dark Skin Tone` },
      { emoji: `\u{1F645}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F645&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Gesturing NO: Dark Skin Tone` },
      { emoji: `\u{1F645}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F645&#x200D&#x2640&#xFE0F`, name: `Woman Gesturing NO` },
      { emoji: `\u{1F645}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F645&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Gesturing NO: Light Skin Tone` },
      { emoji: `\u{1F645}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F645&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Gesturing NO: Medium-Light Skin Tone` },
      { emoji: `\u{1F645}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F645&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Gesturing NO: Medium Skin Tone` },
      { emoji: `\u{1F645}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F645&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Gesturing NO: Medium-Dark Skin Tone` },
      { emoji: `\u{1F645}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F645&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Gesturing NO: Dark Skin Tone` },
      { emoji: `\u{1F646}`, entity: `&#x1F646`, name: `Person Gesturing OK` },
      { emoji: `\u{1F646}\u{1F3FB}`, entity: `&#x1F646&#x1F3FB`, name: `Person Gesturing OK: Light Skin Tone` },
      { emoji: `\u{1F646}\u{1F3FC}`, entity: `&#x1F646&#x1F3FC`, name: `Person Gesturing OK: Medium-Light Skin Tone` },
      { emoji: `\u{1F646}\u{1F3FD}`, entity: `&#x1F646&#x1F3FD`, name: `Person Gesturing OK: Medium Skin Tone` },
      { emoji: `\u{1F646}\u{1F3FE}`, entity: `&#x1F646&#x1F3FE`, name: `Person Gesturing OK: Medium-Dark Skin Tone` },
      { emoji: `\u{1F646}\u{1F3FF}`, entity: `&#x1F646&#x1F3FF`, name: `Person Gesturing OK: Dark Skin Tone` },
      { emoji: `\u{1F646}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F646&#x200D&#x2642&#xFE0F`, name: `Man Gesturing OK` },
      { emoji: `\u{1F646}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F646&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Gesturing OK: Light Skin Tone` },
      { emoji: `\u{1F646}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F646&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Gesturing OK: Medium-Light Skin Tone` },
      { emoji: `\u{1F646}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F646&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Gesturing OK: Medium Skin Tone` },
      { emoji: `\u{1F646}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F646&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Gesturing OK: Medium-Dark Skin Tone` },
      { emoji: `\u{1F646}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F646&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Gesturing OK: Dark Skin Tone` },
      { emoji: `\u{1F646}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F646&#x200D&#x2640&#xFE0F`, name: `Woman Gesturing OK` },
      { emoji: `\u{1F646}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F646&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Gesturing OK: Light Skin Tone` },
      { emoji: `\u{1F646}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F646&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Gesturing OK: Medium-Light Skin Tone` },
      { emoji: `\u{1F646}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F646&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Gesturing OK: Medium Skin Tone` },
      { emoji: `\u{1F646}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F646&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Gesturing OK: Medium-Dark Skin Tone` },
      { emoji: `\u{1F646}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F646&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Gesturing OK: Dark Skin Tone` },
      { emoji: `\u{1F481}`, entity: `&#x1F481`, name: `Person Tipping Hand` },
      { emoji: `\u{1F481}\u{1F3FB}`, entity: `&#x1F481&#x1F3FB`, name: `Person Tipping Hand: Light Skin Tone` },
      { emoji: `\u{1F481}\u{1F3FC}`, entity: `&#x1F481&#x1F3FC`, name: `Person Tipping Hand: Medium-Light Skin Tone` },
      { emoji: `\u{1F481}\u{1F3FD}`, entity: `&#x1F481&#x1F3FD`, name: `Person Tipping Hand: Medium Skin Tone` },
      { emoji: `\u{1F481}\u{1F3FE}`, entity: `&#x1F481&#x1F3FE`, name: `Person Tipping Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{1F481}\u{1F3FF}`, entity: `&#x1F481&#x1F3FF`, name: `Person Tipping Hand: Dark Skin Tone` },
      { emoji: `\u{1F481}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F481&#x200D&#x2642&#xFE0F`, name: `Man Tipping Hand` },
      { emoji: `\u{1F481}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F481&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Tipping Hand: Light Skin Tone` },
      { emoji: `\u{1F481}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F481&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Tipping Hand: Medium-Light Skin Tone` },
      { emoji: `\u{1F481}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F481&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Tipping Hand: Medium Skin Tone` },
      { emoji: `\u{1F481}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F481&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Tipping Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{1F481}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F481&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Tipping Hand: Dark Skin Tone` },
      { emoji: `\u{1F481}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F481&#x200D&#x2640&#xFE0F`, name: `Woman Tipping Hand` },
      { emoji: `\u{1F481}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F481&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Tipping Hand: Light Skin Tone` },
      { emoji: `\u{1F481}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F481&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Tipping Hand: Medium-Light Skin Tone` },
      { emoji: `\u{1F481}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F481&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Tipping Hand: Medium Skin Tone` },
      { emoji: `\u{1F481}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F481&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Tipping Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{1F481}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F481&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Tipping Hand: Dark Skin Tone` },
      { emoji: `\u{1F64B}`, entity: `&#x1F64B`, name: `Person Raising Hand` },
      { emoji: `\u{1F64B}\u{1F3FB}`, entity: `&#x1F64B&#x1F3FB`, name: `Person Raising Hand: Light Skin Tone` },
      { emoji: `\u{1F64B}\u{1F3FC}`, entity: `&#x1F64B&#x1F3FC`, name: `Person Raising Hand: Medium-Light Skin Tone` },
      { emoji: `\u{1F64B}\u{1F3FD}`, entity: `&#x1F64B&#x1F3FD`, name: `Person Raising Hand: Medium Skin Tone` },
      { emoji: `\u{1F64B}\u{1F3FE}`, entity: `&#x1F64B&#x1F3FE`, name: `Person Raising Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{1F64B}\u{1F3FF}`, entity: `&#x1F64B&#x1F3FF`, name: `Person Raising Hand: Dark Skin Tone` },
      { emoji: `\u{1F64B}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64B&#x200D&#x2642&#xFE0F`, name: `Man Raising Hand` },
      { emoji: `\u{1F64B}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64B&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Raising Hand: Light Skin Tone` },
      { emoji: `\u{1F64B}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64B&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Raising Hand: Medium-Light Skin Tone` },
      { emoji: `\u{1F64B}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64B&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Raising Hand: Medium Skin Tone` },
      { emoji: `\u{1F64B}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64B&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Raising Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{1F64B}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F64B&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Raising Hand: Dark Skin Tone` },
      { emoji: `\u{1F64B}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64B&#x200D&#x2640&#xFE0F`, name: `Woman Raising Hand` },
      { emoji: `\u{1F64B}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64B&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Raising Hand: Light Skin Tone` },
      { emoji: `\u{1F64B}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64B&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Raising Hand: Medium-Light Skin Tone` },
      { emoji: `\u{1F64B}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64B&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Raising Hand: Medium Skin Tone` },
      { emoji: `\u{1F64B}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64B&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Raising Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{1F64B}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F64B&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Raising Hand: Dark Skin Tone` },
      { emoji: `\u{1F647}`, entity: `&#x1F647`, name: `Person Bowing` },
      { emoji: `\u{1F647}\u{1F3FB}`, entity: `&#x1F647&#x1F3FB`, name: `Person Bowing: Light Skin Tone` },
      { emoji: `\u{1F647}\u{1F3FC}`, entity: `&#x1F647&#x1F3FC`, name: `Person Bowing: Medium-Light Skin Tone` },
      { emoji: `\u{1F647}\u{1F3FD}`, entity: `&#x1F647&#x1F3FD`, name: `Person Bowing: Medium Skin Tone` },
      { emoji: `\u{1F647}\u{1F3FE}`, entity: `&#x1F647&#x1F3FE`, name: `Person Bowing: Medium-Dark Skin Tone` },
      { emoji: `\u{1F647}\u{1F3FF}`, entity: `&#x1F647&#x1F3FF`, name: `Person Bowing: Dark Skin Tone` },
      { emoji: `\u{1F647}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F647&#x200D&#x2642&#xFE0F`, name: `Man Bowing` },
      { emoji: `\u{1F647}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F647&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Bowing: Light Skin Tone` },
      { emoji: `\u{1F647}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F647&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Bowing: Medium-Light Skin Tone` },
      { emoji: `\u{1F647}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F647&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Bowing: Medium Skin Tone` },
      { emoji: `\u{1F647}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F647&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Bowing: Medium-Dark Skin Tone` },
      { emoji: `\u{1F647}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F647&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Bowing: Dark Skin Tone` },
      { emoji: `\u{1F647}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F647&#x200D&#x2640&#xFE0F`, name: `Woman Bowing` },
      { emoji: `\u{1F647}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F647&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Bowing: Light Skin Tone` },
      { emoji: `\u{1F647}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F647&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Bowing: Medium-Light Skin Tone` },
      { emoji: `\u{1F647}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F647&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Bowing: Medium Skin Tone` },
      { emoji: `\u{1F647}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F647&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Bowing: Medium-Dark Skin Tone` },
      { emoji: `\u{1F647}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F647&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Bowing: Dark Skin Tone` },
      { emoji: `\u{1F926}`, entity: `&#x1F926`, name: `Person Facepalming` },
      { emoji: `\u{1F926}\u{1F3FB}`, entity: `&#x1F926&#x1F3FB`, name: `Person Facepalming: Light Skin Tone` },
      { emoji: `\u{1F926}\u{1F3FC}`, entity: `&#x1F926&#x1F3FC`, name: `Person Facepalming: Medium-Light Skin Tone` },
      { emoji: `\u{1F926}\u{1F3FD}`, entity: `&#x1F926&#x1F3FD`, name: `Person Facepalming: Medium Skin Tone` },
      { emoji: `\u{1F926}\u{1F3FE}`, entity: `&#x1F926&#x1F3FE`, name: `Person Facepalming: Medium-Dark Skin Tone` },
      { emoji: `\u{1F926}\u{1F3FF}`, entity: `&#x1F926&#x1F3FF`, name: `Person Facepalming: Dark Skin Tone` },
      { emoji: `\u{1F926}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F926&#x200D&#x2642&#xFE0F`, name: `Man Facepalming` },
      { emoji: `\u{1F926}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F926&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Facepalming: Light Skin Tone` },
      { emoji: `\u{1F926}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F926&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Facepalming: Medium-Light Skin Tone` },
      { emoji: `\u{1F926}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F926&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Facepalming: Medium Skin Tone` },
      { emoji: `\u{1F926}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F926&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Facepalming: Medium-Dark Skin Tone` },
      { emoji: `\u{1F926}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F926&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Facepalming: Dark Skin Tone` },
      { emoji: `\u{1F926}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F926&#x200D&#x2640&#xFE0F`, name: `Woman Facepalming` },
      { emoji: `\u{1F926}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F926&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Facepalming: Light Skin Tone` },
      { emoji: `\u{1F926}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F926&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Facepalming: Medium-Light Skin Tone` },
      { emoji: `\u{1F926}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F926&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Facepalming: Medium Skin Tone` },
      { emoji: `\u{1F926}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F926&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Facepalming: Medium-Dark Skin Tone` },
      { emoji: `\u{1F926}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F926&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Facepalming: Dark Skin Tone` },
      { emoji: `\u{1F937}`, entity: `&#x1F937`, name: `Person Shrugging` },
      { emoji: `\u{1F937}\u{1F3FB}`, entity: `&#x1F937&#x1F3FB`, name: `Person Shrugging: Light Skin Tone` },
      { emoji: `\u{1F937}\u{1F3FC}`, entity: `&#x1F937&#x1F3FC`, name: `Person Shrugging: Medium-Light Skin Tone` },
      { emoji: `\u{1F937}\u{1F3FD}`, entity: `&#x1F937&#x1F3FD`, name: `Person Shrugging: Medium Skin Tone` },
      { emoji: `\u{1F937}\u{1F3FE}`, entity: `&#x1F937&#x1F3FE`, name: `Person Shrugging: Medium-Dark Skin Tone` },
      { emoji: `\u{1F937}\u{1F3FF}`, entity: `&#x1F937&#x1F3FF`, name: `Person Shrugging: Dark Skin Tone` },
      { emoji: `\u{1F937}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F937&#x200D&#x2642&#xFE0F`, name: `Man Shrugging` },
      { emoji: `\u{1F937}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F937&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Shrugging: Light Skin Tone` },
      { emoji: `\u{1F937}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F937&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Shrugging: Medium-Light Skin Tone` },
      { emoji: `\u{1F937}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F937&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Shrugging: Medium Skin Tone` },
      { emoji: `\u{1F937}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F937&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Shrugging: Medium-Dark Skin Tone` },
      { emoji: `\u{1F937}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F937&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Shrugging: Dark Skin Tone` },
      { emoji: `\u{1F937}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F937&#x200D&#x2640&#xFE0F`, name: `Woman Shrugging` },
      { emoji: `\u{1F937}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F937&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Shrugging: Light Skin Tone` },
      { emoji: `\u{1F937}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F937&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Shrugging: Medium-Light Skin Tone` },
      { emoji: `\u{1F937}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F937&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Shrugging: Medium Skin Tone` },
      { emoji: `\u{1F937}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F937&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Shrugging: Medium-Dark Skin Tone` },
      { emoji: `\u{1F937}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F937&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Shrugging: Dark Skin Tone` },
      { emoji: `\u{1F486}`, entity: `&#x1F486`, name: `Person Getting Massage` },
      { emoji: `\u{1F486}\u{1F3FB}`, entity: `&#x1F486&#x1F3FB`, name: `Person Getting Massage: Light Skin Tone` },
      { emoji: `\u{1F486}\u{1F3FC}`, entity: `&#x1F486&#x1F3FC`, name: `Person Getting Massage: Medium-Light Skin Tone` },
      { emoji: `\u{1F486}\u{1F3FD}`, entity: `&#x1F486&#x1F3FD`, name: `Person Getting Massage: Medium Skin Tone` },
      { emoji: `\u{1F486}\u{1F3FE}`, entity: `&#x1F486&#x1F3FE`, name: `Person Getting Massage: Medium-Dark Skin Tone` },
      { emoji: `\u{1F486}\u{1F3FF}`, entity: `&#x1F486&#x1F3FF`, name: `Person Getting Massage: Dark Skin Tone` },
      { emoji: `\u{1F486}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F486&#x200D&#x2642&#xFE0F`, name: `Man Getting Massage` },
      { emoji: `\u{1F486}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F486&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Getting Massage: Light Skin Tone` },
      { emoji: `\u{1F486}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F486&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Getting Massage: Medium-Light Skin Tone` },
      { emoji: `\u{1F486}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F486&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Getting Massage: Medium Skin Tone` },
      { emoji: `\u{1F486}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F486&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Getting Massage: Medium-Dark Skin Tone` },
      { emoji: `\u{1F486}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F486&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Getting Massage: Dark Skin Tone` },
      { emoji: `\u{1F486}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F486&#x200D&#x2640&#xFE0F`, name: `Woman Getting Massage` },
      { emoji: `\u{1F486}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F486&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Getting Massage: Light Skin Tone` },
      { emoji: `\u{1F486}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F486&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Getting Massage: Medium-Light Skin Tone` },
      { emoji: `\u{1F486}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F486&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Getting Massage: Medium Skin Tone` },
      { emoji: `\u{1F486}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F486&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Getting Massage: Medium-Dark Skin Tone` },
      { emoji: `\u{1F486}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F486&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Getting Massage: Dark Skin Tone` },
      { emoji: `\u{1F487}`, entity: `&#x1F487`, name: `Person Getting Haircut` },
      { emoji: `\u{1F487}\u{1F3FB}`, entity: `&#x1F487&#x1F3FB`, name: `Person Getting Haircut: Light Skin Tone` },
      { emoji: `\u{1F487}\u{1F3FC}`, entity: `&#x1F487&#x1F3FC`, name: `Person Getting Haircut: Medium-Light Skin Tone` },
      { emoji: `\u{1F487}\u{1F3FD}`, entity: `&#x1F487&#x1F3FD`, name: `Person Getting Haircut: Medium Skin Tone` },
      { emoji: `\u{1F487}\u{1F3FE}`, entity: `&#x1F487&#x1F3FE`, name: `Person Getting Haircut: Medium-Dark Skin Tone` },
      { emoji: `\u{1F487}\u{1F3FF}`, entity: `&#x1F487&#x1F3FF`, name: `Person Getting Haircut: Dark Skin Tone` },
      { emoji: `\u{1F487}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F487&#x200D&#x2642&#xFE0F`, name: `Man Getting Haircut` },
      { emoji: `\u{1F487}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F487&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Getting Haircut: Light Skin Tone` },
      { emoji: `\u{1F487}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F487&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Getting Haircut: Medium-Light Skin Tone` },
      { emoji: `\u{1F487}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F487&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Getting Haircut: Medium Skin Tone` },
      { emoji: `\u{1F487}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F487&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Getting Haircut: Medium-Dark Skin Tone` },
      { emoji: `\u{1F487}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F487&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Getting Haircut: Dark Skin Tone` },
      { emoji: `\u{1F487}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F487&#x200D&#x2640&#xFE0F`, name: `Woman Getting Haircut` },
      { emoji: `\u{1F487}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F487&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Getting Haircut: Light Skin Tone` },
      { emoji: `\u{1F487}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F487&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Getting Haircut: Medium-Light Skin Tone` },
      { emoji: `\u{1F487}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F487&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Getting Haircut: Medium Skin Tone` },
      { emoji: `\u{1F487}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F487&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Getting Haircut: Medium-Dark Skin Tone` },
      { emoji: `\u{1F487}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F487&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Getting Haircut: Dark Skin Tone` },
      { emoji: `\u{1F6B6}`, entity: `&#x1F6B6`, name: `Person Walking` },
      { emoji: `\u{1F6B6}\u{1F3FB}`, entity: `&#x1F6B6&#x1F3FB`, name: `Person Walking: Light Skin Tone` },
      { emoji: `\u{1F6B6}\u{1F3FC}`, entity: `&#x1F6B6&#x1F3FC`, name: `Person Walking: Medium-Light Skin Tone` },
      { emoji: `\u{1F6B6}\u{1F3FD}`, entity: `&#x1F6B6&#x1F3FD`, name: `Person Walking: Medium Skin Tone` },
      { emoji: `\u{1F6B6}\u{1F3FE}`, entity: `&#x1F6B6&#x1F3FE`, name: `Person Walking: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6B6}\u{1F3FF}`, entity: `&#x1F6B6&#x1F3FF`, name: `Person Walking: Dark Skin Tone` },
      { emoji: `\u{1F6B6}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B6&#x200D&#x2642&#xFE0F`, name: `Man Walking` },
      { emoji: `\u{1F6B6}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B6&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Walking: Light Skin Tone` },
      { emoji: `\u{1F6B6}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B6&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Walking: Medium-Light Skin Tone` },
      { emoji: `\u{1F6B6}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B6&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Walking: Medium Skin Tone` },
      { emoji: `\u{1F6B6}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B6&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Walking: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6B6}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B6&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Walking: Dark Skin Tone` },
      { emoji: `\u{1F6B6}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B6&#x200D&#x2640&#xFE0F`, name: `Woman Walking` },
      { emoji: `\u{1F6B6}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B6&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Walking: Light Skin Tone` },
      { emoji: `\u{1F6B6}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B6&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Walking: Medium-Light Skin Tone` },
      { emoji: `\u{1F6B6}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B6&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Walking: Medium Skin Tone` },
      { emoji: `\u{1F6B6}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B6&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Walking: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6B6}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B6&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Walking: Dark Skin Tone` },
      { emoji: `\u{1F3C3}`, entity: `&#x1F3C3`, name: `Person Running` },
      { emoji: `\u{1F3C3}\u{1F3FB}`, entity: `&#x1F3C3&#x1F3FB`, name: `Person Running: Light Skin Tone` },
      { emoji: `\u{1F3C3}\u{1F3FC}`, entity: `&#x1F3C3&#x1F3FC`, name: `Person Running: Medium-Light Skin Tone` },
      { emoji: `\u{1F3C3}\u{1F3FD}`, entity: `&#x1F3C3&#x1F3FD`, name: `Person Running: Medium Skin Tone` },
      { emoji: `\u{1F3C3}\u{1F3FE}`, entity: `&#x1F3C3&#x1F3FE`, name: `Person Running: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3C3}\u{1F3FF}`, entity: `&#x1F3C3&#x1F3FF`, name: `Person Running: Dark Skin Tone` },
      { emoji: `\u{1F3C3}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3C3&#x200D&#x2642&#xFE0F`, name: `Man Running` },
      { emoji: `\u{1F3C3}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3C3&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Running: Light Skin Tone` },
      { emoji: `\u{1F3C3}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3C3&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Running: Medium-Light Skin Tone` },
      { emoji: `\u{1F3C3}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3C3&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Running: Medium Skin Tone` },
      { emoji: `\u{1F3C3}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3C3&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Running: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3C3}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3C3&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Running: Dark Skin Tone` },
      { emoji: `\u{1F3C3}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3C3&#x200D&#x2640&#xFE0F`, name: `Woman Running` },
      { emoji: `\u{1F3C3}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3C3&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Running: Light Skin Tone` },
      { emoji: `\u{1F3C3}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3C3&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Running: Medium-Light Skin Tone` },
      { emoji: `\u{1F3C3}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3C3&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Running: Medium Skin Tone` },
      { emoji: `\u{1F3C3}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3C3&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Running: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3C3}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3C3&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Running: Dark Skin Tone` },
      { emoji: `\u{1F483}`, entity: `&#x1F483`, name: `Woman Dancing` },
      { emoji: `\u{1F483}\u{1F3FB}`, entity: `&#x1F483&#x1F3FB`, name: `Woman Dancing: Light Skin Tone` },
      { emoji: `\u{1F483}\u{1F3FC}`, entity: `&#x1F483&#x1F3FC`, name: `Woman Dancing: Medium-Light Skin Tone` },
      { emoji: `\u{1F483}\u{1F3FD}`, entity: `&#x1F483&#x1F3FD`, name: `Woman Dancing: Medium Skin Tone` },
      { emoji: `\u{1F483}\u{1F3FE}`, entity: `&#x1F483&#x1F3FE`, name: `Woman Dancing: Medium-Dark Skin Tone` },
      { emoji: `\u{1F483}\u{1F3FF}`, entity: `&#x1F483&#x1F3FF`, name: `Woman Dancing: Dark Skin Tone` },
      { emoji: `\u{1F57A}`, entity: `&#x1F57A`, name: `Man Dancing` },
      { emoji: `\u{1F57A}\u{1F3FB}`, entity: `&#x1F57A&#x1F3FB`, name: `Man Dancing: Light Skin Tone` },
      { emoji: `\u{1F57A}\u{1F3FC}`, entity: `&#x1F57A&#x1F3FC`, name: `Man Dancing: Medium-Light Skin Tone` },
      { emoji: `\u{1F57A}\u{1F3FD}`, entity: `&#x1F57A&#x1F3FD`, name: `Man Dancing: Medium Skin Tone` },
      { emoji: `\u{1F57A}\u{1F3FE}`, entity: `&#x1F57A&#x1F3FE`, name: `Man Dancing: Medium-Dark Skin Tone` },
      { emoji: `\u{1F57A}\u{1F3FF}`, entity: `&#x1F57A&#x1F3FF`, name: `Man Dancing: Dark Skin Tone` },
      { emoji: `\u{1F46F}`, entity: `&#x1F46F`, name: `People With Bunny Ears Partying` },
      { emoji: `\u{1F46F}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F46F&#x200D&#x2642&#xFE0F`, name: `Men With Bunny Ears Partying` },
      { emoji: `\u{1F46F}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F46F&#x200D&#x2640&#xFE0F`, name: `Women With Bunny Ears Partying` },
      { emoji: `\u{1F574}`, entity: `&#x1F574`, name: `Man In Business Suit Levitating` },
      { emoji: `\u{1F574}\u{1F3FB}`, entity: `&#x1F574&#x1F3FB`, name: `Man In Business Suit Levitating: Light Skin Tone` },
      { emoji: `\u{1F574}\u{1F3FC}`, entity: `&#x1F574&#x1F3FC`, name: `Man In Business Suit Levitating: Medium-Light Skin Tone` },
      { emoji: `\u{1F574}\u{1F3FD}`, entity: `&#x1F574&#x1F3FD`, name: `Man In Business Suit Levitating: Medium Skin Tone` },
      { emoji: `\u{1F574}\u{1F3FE}`, entity: `&#x1F574&#x1F3FE`, name: `Man In Business Suit Levitating: Medium-Dark Skin Tone` },
      { emoji: `\u{1F574}\u{1F3FF}`, entity: `&#x1F574&#x1F3FF`, name: `Man In Business Suit Levitating: Dark Skin Tone` },
      { emoji: `\u{1F5E3}`, entity: `&#x1F5E3`, name: `Speaking Head` },
      { emoji: `\u{1F464}`, entity: `&#x1F464`, name: `Bust In Silhouette` },
      { emoji: `\u{1F465}`, entity: `&#x1F465`, name: `Busts In Silhouette` },
      { emoji: `\u{1F93A}`, entity: `&#x1F93A`, name: `Person Fencing` },
      { emoji: `\u{1F3C7}`, entity: `&#x1F3C7`, name: `Horse Racing` },
      { emoji: `\u{1F3C7}\u{1F3FB}`, entity: `&#x1F3C7&#x1F3FB`, name: `Horse Racing: Light Skin Tone` },
      { emoji: `\u{1F3C7}\u{1F3FC}`, entity: `&#x1F3C7&#x1F3FC`, name: `Horse Racing: Medium-Light Skin Tone` },
      { emoji: `\u{1F3C7}\u{1F3FD}`, entity: `&#x1F3C7&#x1F3FD`, name: `Horse Racing: Medium Skin Tone` },
      { emoji: `\u{1F3C7}\u{1F3FE}`, entity: `&#x1F3C7&#x1F3FE`, name: `Horse Racing: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3C7}\u{1F3FF}`, entity: `&#x1F3C7&#x1F3FF`, name: `Horse Racing: Dark Skin Tone` },
      { emoji: `\u{26F7}`, entity: `&#x26F7`, name: `Skier` },
      { emoji: `\u{1F3C2}`, entity: `&#x1F3C2`, name: `Snowboarder` },
      { emoji: `\u{1F3C2}\u{1F3FB}`, entity: `&#x1F3C2&#x1F3FB`, name: `Snowboarder: Light Skin Tone` },
      { emoji: `\u{1F3C2}\u{1F3FC}`, entity: `&#x1F3C2&#x1F3FC`, name: `Snowboarder: Medium-Light Skin Tone` },
      { emoji: `\u{1F3C2}\u{1F3FD}`, entity: `&#x1F3C2&#x1F3FD`, name: `Snowboarder: Medium Skin Tone` },
      { emoji: `\u{1F3C2}\u{1F3FE}`, entity: `&#x1F3C2&#x1F3FE`, name: `Snowboarder: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3C2}\u{1F3FF}`, entity: `&#x1F3C2&#x1F3FF`, name: `Snowboarder: Dark Skin Tone` },
      { emoji: `\u{1F3CC}`, entity: `&#x1F3CC`, name: `Person Golfing` },
      { emoji: `\u{1F3CC}\u{1F3FB}`, entity: `&#x1F3CC&#x1F3FB`, name: `Person Golfing: Light Skin Tone` },
      { emoji: `\u{1F3CC}\u{1F3FC}`, entity: `&#x1F3CC&#x1F3FC`, name: `Person Golfing: Medium-Light Skin Tone` },
      { emoji: `\u{1F3CC}\u{1F3FD}`, entity: `&#x1F3CC&#x1F3FD`, name: `Person Golfing: Medium Skin Tone` },
      { emoji: `\u{1F3CC}\u{1F3FE}`, entity: `&#x1F3CC&#x1F3FE`, name: `Person Golfing: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3CC}\u{1F3FF}`, entity: `&#x1F3CC&#x1F3FF`, name: `Person Golfing: Dark Skin Tone` },
      { emoji: `\u{1F3CC}\u{FE0F}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CC&#xFE0F&#x200D&#x2642&#xFE0F`, name: `Man Golfing` },
      { emoji: `\u{1F3CC}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CC&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Golfing: Light Skin Tone` },
      { emoji: `\u{1F3CC}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CC&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Golfing: Medium-Light Skin Tone` },
      { emoji: `\u{1F3CC}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CC&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Golfing: Medium Skin Tone` },
      { emoji: `\u{1F3CC}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CC&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Golfing: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3CC}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CC&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Golfing: Dark Skin Tone` },
      { emoji: `\u{1F3CC}\u{FE0F}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CC&#xFE0F&#x200D&#x2640&#xFE0F`, name: `Woman Golfing` },
      { emoji: `\u{1F3CC}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CC&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Golfing: Light Skin Tone` },
      { emoji: `\u{1F3CC}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CC&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Golfing: Medium-Light Skin Tone` },
      { emoji: `\u{1F3CC}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CC&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Golfing: Medium Skin Tone` },
      { emoji: `\u{1F3CC}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CC&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Golfing: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3CC}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CC&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Golfing: Dark Skin Tone` },
      { emoji: `\u{1F3C4}`, entity: `&#x1F3C4`, name: `Person Surfing` },
      { emoji: `\u{1F3C4}\u{1F3FB}`, entity: `&#x1F3C4&#x1F3FB`, name: `Person Surfing: Light Skin Tone` },
      { emoji: `\u{1F3C4}\u{1F3FC}`, entity: `&#x1F3C4&#x1F3FC`, name: `Person Surfing: Medium-Light Skin Tone` },
      { emoji: `\u{1F3C4}\u{1F3FD}`, entity: `&#x1F3C4&#x1F3FD`, name: `Person Surfing: Medium Skin Tone` },
      { emoji: `\u{1F3C4}\u{1F3FE}`, entity: `&#x1F3C4&#x1F3FE`, name: `Person Surfing: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3C4}\u{1F3FF}`, entity: `&#x1F3C4&#x1F3FF`, name: `Person Surfing: Dark Skin Tone` },
      { emoji: `\u{1F3C4}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3C4&#x200D&#x2642&#xFE0F`, name: `Man Surfing` },
      { emoji: `\u{1F3C4}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3C4&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Surfing: Light Skin Tone` },
      { emoji: `\u{1F3C4}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3C4&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Surfing: Medium-Light Skin Tone` },
      { emoji: `\u{1F3C4}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3C4&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Surfing: Medium Skin Tone` },
      { emoji: `\u{1F3C4}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3C4&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Surfing: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3C4}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3C4&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Surfing: Dark Skin Tone` },
      { emoji: `\u{1F3C4}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3C4&#x200D&#x2640&#xFE0F`, name: `Woman Surfing` },
      { emoji: `\u{1F3C4}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3C4&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Surfing: Light Skin Tone` },
      { emoji: `\u{1F3C4}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3C4&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Surfing: Medium-Light Skin Tone` },
      { emoji: `\u{1F3C4}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3C4&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Surfing: Medium Skin Tone` },
      { emoji: `\u{1F3C4}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3C4&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Surfing: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3C4}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3C4&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Surfing: Dark Skin Tone` },
      { emoji: `\u{1F6A3}`, entity: `&#x1F6A3`, name: `Person Rowing Boat` },
      { emoji: `\u{1F6A3}\u{1F3FB}`, entity: `&#x1F6A3&#x1F3FB`, name: `Person Rowing Boat: Light Skin Tone` },
      { emoji: `\u{1F6A3}\u{1F3FC}`, entity: `&#x1F6A3&#x1F3FC`, name: `Person Rowing Boat: Medium-Light Skin Tone` },
      { emoji: `\u{1F6A3}\u{1F3FD}`, entity: `&#x1F6A3&#x1F3FD`, name: `Person Rowing Boat: Medium Skin Tone` },
      { emoji: `\u{1F6A3}\u{1F3FE}`, entity: `&#x1F6A3&#x1F3FE`, name: `Person Rowing Boat: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6A3}\u{1F3FF}`, entity: `&#x1F6A3&#x1F3FF`, name: `Person Rowing Boat: Dark Skin Tone` },
      { emoji: `\u{1F6A3}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6A3&#x200D&#x2642&#xFE0F`, name: `Man Rowing Boat` },
      { emoji: `\u{1F6A3}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6A3&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Rowing Boat: Light Skin Tone` },
      { emoji: `\u{1F6A3}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6A3&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Rowing Boat: Medium-Light Skin Tone` },
      { emoji: `\u{1F6A3}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6A3&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Rowing Boat: Medium Skin Tone` },
      { emoji: `\u{1F6A3}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6A3&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Rowing Boat: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6A3}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6A3&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Rowing Boat: Dark Skin Tone` },
      { emoji: `\u{1F6A3}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6A3&#x200D&#x2640&#xFE0F`, name: `Woman Rowing Boat` },
      { emoji: `\u{1F6A3}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6A3&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Rowing Boat: Light Skin Tone` },
      { emoji: `\u{1F6A3}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6A3&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Rowing Boat: Medium-Light Skin Tone` },
      { emoji: `\u{1F6A3}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6A3&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Rowing Boat: Medium Skin Tone` },
      { emoji: `\u{1F6A3}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6A3&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Rowing Boat: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6A3}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6A3&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Rowing Boat: Dark Skin Tone` },
      { emoji: `\u{1F3CA}`, entity: `&#x1F3CA`, name: `Person Swimming` },
      { emoji: `\u{1F3CA}\u{1F3FB}`, entity: `&#x1F3CA&#x1F3FB`, name: `Person Swimming: Light Skin Tone` },
      { emoji: `\u{1F3CA}\u{1F3FC}`, entity: `&#x1F3CA&#x1F3FC`, name: `Person Swimming: Medium-Light Skin Tone` },
      { emoji: `\u{1F3CA}\u{1F3FD}`, entity: `&#x1F3CA&#x1F3FD`, name: `Person Swimming: Medium Skin Tone` },
      { emoji: `\u{1F3CA}\u{1F3FE}`, entity: `&#x1F3CA&#x1F3FE`, name: `Person Swimming: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3CA}\u{1F3FF}`, entity: `&#x1F3CA&#x1F3FF`, name: `Person Swimming: Dark Skin Tone` },
      { emoji: `\u{1F3CA}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CA&#x200D&#x2642&#xFE0F`, name: `Man Swimming` },
      { emoji: `\u{1F3CA}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CA&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Swimming: Light Skin Tone` },
      { emoji: `\u{1F3CA}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CA&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Swimming: Medium-Light Skin Tone` },
      { emoji: `\u{1F3CA}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CA&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Swimming: Medium Skin Tone` },
      { emoji: `\u{1F3CA}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CA&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Swimming: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3CA}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CA&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Swimming: Dark Skin Tone` },
      { emoji: `\u{1F3CA}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CA&#x200D&#x2640&#xFE0F`, name: `Woman Swimming` },
      { emoji: `\u{1F3CA}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CA&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Swimming: Light Skin Tone` },
      { emoji: `\u{1F3CA}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CA&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Swimming: Medium-Light Skin Tone` },
      { emoji: `\u{1F3CA}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CA&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Swimming: Medium Skin Tone` },
      { emoji: `\u{1F3CA}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CA&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Swimming: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3CA}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CA&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Swimming: Dark Skin Tone` },
      { emoji: `\u{26F9}`, entity: `&#x26F9`, name: `Person Bouncing Ball` },
      { emoji: `\u{26F9}\u{1F3FB}`, entity: `&#x26F9&#x1F3FB`, name: `Person Bouncing Ball: Light Skin Tone` },
      { emoji: `\u{26F9}\u{1F3FC}`, entity: `&#x26F9&#x1F3FC`, name: `Person Bouncing Ball: Medium-Light Skin Tone` },
      { emoji: `\u{26F9}\u{1F3FD}`, entity: `&#x26F9&#x1F3FD`, name: `Person Bouncing Ball: Medium Skin Tone` },
      { emoji: `\u{26F9}\u{1F3FE}`, entity: `&#x26F9&#x1F3FE`, name: `Person Bouncing Ball: Medium-Dark Skin Tone` },
      { emoji: `\u{26F9}\u{1F3FF}`, entity: `&#x26F9&#x1F3FF`, name: `Person Bouncing Ball: Dark Skin Tone` },
      { emoji: `\u{26F9}\u{FE0F}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x26F9&#xFE0F&#x200D&#x2642&#xFE0F`, name: `Man Bouncing Ball` },
      { emoji: `\u{26F9}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x26F9&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Bouncing Ball: Light Skin Tone` },
      { emoji: `\u{26F9}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x26F9&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Bouncing Ball: Medium-Light Skin Tone` },
      { emoji: `\u{26F9}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x26F9&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Bouncing Ball: Medium Skin Tone` },
      { emoji: `\u{26F9}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x26F9&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Bouncing Ball: Medium-Dark Skin Tone` },
      { emoji: `\u{26F9}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x26F9&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Bouncing Ball: Dark Skin Tone` },
      { emoji: `\u{26F9}\u{FE0F}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x26F9&#xFE0F&#x200D&#x2640&#xFE0F`, name: `Woman Bouncing Ball` },
      { emoji: `\u{26F9}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x26F9&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Bouncing Ball: Light Skin Tone` },
      { emoji: `\u{26F9}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x26F9&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Bouncing Ball: Medium-Light Skin Tone` },
      { emoji: `\u{26F9}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x26F9&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Bouncing Ball: Medium Skin Tone` },
      { emoji: `\u{26F9}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x26F9&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Bouncing Ball: Medium-Dark Skin Tone` },
      { emoji: `\u{26F9}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x26F9&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Bouncing Ball: Dark Skin Tone` },
      { emoji: `\u{1F3CB}`, entity: `&#x1F3CB`, name: `Person Lifting Weights` },
      { emoji: `\u{1F3CB}\u{1F3FB}`, entity: `&#x1F3CB&#x1F3FB`, name: `Person Lifting Weights: Light Skin Tone` },
      { emoji: `\u{1F3CB}\u{1F3FC}`, entity: `&#x1F3CB&#x1F3FC`, name: `Person Lifting Weights: Medium-Light Skin Tone` },
      { emoji: `\u{1F3CB}\u{1F3FD}`, entity: `&#x1F3CB&#x1F3FD`, name: `Person Lifting Weights: Medium Skin Tone` },
      { emoji: `\u{1F3CB}\u{1F3FE}`, entity: `&#x1F3CB&#x1F3FE`, name: `Person Lifting Weights: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3CB}\u{1F3FF}`, entity: `&#x1F3CB&#x1F3FF`, name: `Person Lifting Weights: Dark Skin Tone` },
      { emoji: `\u{1F3CB}\u{FE0F}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CB&#xFE0F&#x200D&#x2642&#xFE0F`, name: `Man Lifting Weights` },
      { emoji: `\u{1F3CB}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CB&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Lifting Weights: Light Skin Tone` },
      { emoji: `\u{1F3CB}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CB&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Lifting Weights: Medium-Light Skin Tone` },
      { emoji: `\u{1F3CB}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CB&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Lifting Weights: Medium Skin Tone` },
      { emoji: `\u{1F3CB}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CB&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Lifting Weights: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3CB}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F3CB&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Lifting Weights: Dark Skin Tone` },
      { emoji: `\u{1F3CB}\u{FE0F}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CB&#xFE0F&#x200D&#x2640&#xFE0F`, name: `Woman Lifting Weights` },
      { emoji: `\u{1F3CB}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CB&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Lifting Weights: Light Skin Tone` },
      { emoji: `\u{1F3CB}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CB&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Lifting Weights: Medium-Light Skin Tone` },
      { emoji: `\u{1F3CB}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CB&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Lifting Weights: Medium Skin Tone` },
      { emoji: `\u{1F3CB}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CB&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Lifting Weights: Medium-Dark Skin Tone` },
      { emoji: `\u{1F3CB}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F3CB&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Lifting Weights: Dark Skin Tone` },
      { emoji: `\u{1F6B4}`, entity: `&#x1F6B4`, name: `Person Biking` },
      { emoji: `\u{1F6B4}\u{1F3FB}`, entity: `&#x1F6B4&#x1F3FB`, name: `Person Biking: Light Skin Tone` },
      { emoji: `\u{1F6B4}\u{1F3FC}`, entity: `&#x1F6B4&#x1F3FC`, name: `Person Biking: Medium-Light Skin Tone` },
      { emoji: `\u{1F6B4}\u{1F3FD}`, entity: `&#x1F6B4&#x1F3FD`, name: `Person Biking: Medium Skin Tone` },
      { emoji: `\u{1F6B4}\u{1F3FE}`, entity: `&#x1F6B4&#x1F3FE`, name: `Person Biking: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6B4}\u{1F3FF}`, entity: `&#x1F6B4&#x1F3FF`, name: `Person Biking: Dark Skin Tone` },
      { emoji: `\u{1F6B4}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B4&#x200D&#x2642&#xFE0F`, name: `Man Biking` },
      { emoji: `\u{1F6B4}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B4&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Biking: Light Skin Tone` },
      { emoji: `\u{1F6B4}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B4&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Biking: Medium-Light Skin Tone` },
      { emoji: `\u{1F6B4}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B4&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Biking: Medium Skin Tone` },
      { emoji: `\u{1F6B4}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B4&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Biking: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6B4}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B4&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Biking: Dark Skin Tone` },
      { emoji: `\u{1F6B4}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B4&#x200D&#x2640&#xFE0F`, name: `Woman Biking` },
      { emoji: `\u{1F6B4}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B4&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Biking: Light Skin Tone` },
      { emoji: `\u{1F6B4}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B4&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Biking: Medium-Light Skin Tone` },
      { emoji: `\u{1F6B4}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B4&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Biking: Medium Skin Tone` },
      { emoji: `\u{1F6B4}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B4&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Biking: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6B4}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B4&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Biking: Dark Skin Tone` },
      { emoji: `\u{1F6B5}`, entity: `&#x1F6B5`, name: `Person Mountain Biking` },
      { emoji: `\u{1F6B5}\u{1F3FB}`, entity: `&#x1F6B5&#x1F3FB`, name: `Person Mountain Biking: Light Skin Tone` },
      { emoji: `\u{1F6B5}\u{1F3FC}`, entity: `&#x1F6B5&#x1F3FC`, name: `Person Mountain Biking: Medium-Light Skin Tone` },
      { emoji: `\u{1F6B5}\u{1F3FD}`, entity: `&#x1F6B5&#x1F3FD`, name: `Person Mountain Biking: Medium Skin Tone` },
      { emoji: `\u{1F6B5}\u{1F3FE}`, entity: `&#x1F6B5&#x1F3FE`, name: `Person Mountain Biking: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6B5}\u{1F3FF}`, entity: `&#x1F6B5&#x1F3FF`, name: `Person Mountain Biking: Dark Skin Tone` },
      { emoji: `\u{1F6B5}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B5&#x200D&#x2642&#xFE0F`, name: `Man Mountain Biking` },
      { emoji: `\u{1F6B5}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B5&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Mountain Biking: Light Skin Tone` },
      { emoji: `\u{1F6B5}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B5&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Mountain Biking: Medium-Light Skin Tone` },
      { emoji: `\u{1F6B5}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B5&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Mountain Biking: Medium Skin Tone` },
      { emoji: `\u{1F6B5}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B5&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Mountain Biking: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6B5}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F6B5&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Mountain Biking: Dark Skin Tone` },
      { emoji: `\u{1F6B5}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B5&#x200D&#x2640&#xFE0F`, name: `Woman Mountain Biking` },
      { emoji: `\u{1F6B5}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B5&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Mountain Biking: Light Skin Tone` },
      { emoji: `\u{1F6B5}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B5&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Mountain Biking: Medium-Light Skin Tone` },
      { emoji: `\u{1F6B5}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B5&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Mountain Biking: Medium Skin Tone` },
      { emoji: `\u{1F6B5}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B5&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Mountain Biking: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6B5}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F6B5&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Mountain Biking: Dark Skin Tone` },
      { emoji: `\u{1F3CE}`, entity: `&#x1F3CE`, name: `Racing Car` },
      { emoji: `\u{1F3CD}`, entity: `&#x1F3CD`, name: `Motorcycle` },
      { emoji: `\u{1F938}`, entity: `&#x1F938`, name: `Person Cartwheeling` },
      { emoji: `\u{1F938}\u{1F3FB}`, entity: `&#x1F938&#x1F3FB`, name: `Person Cartwheeling: Light Skin Tone` },
      { emoji: `\u{1F938}\u{1F3FC}`, entity: `&#x1F938&#x1F3FC`, name: `Person Cartwheeling: Medium-Light Skin Tone` },
      { emoji: `\u{1F938}\u{1F3FD}`, entity: `&#x1F938&#x1F3FD`, name: `Person Cartwheeling: Medium Skin Tone` },
      { emoji: `\u{1F938}\u{1F3FE}`, entity: `&#x1F938&#x1F3FE`, name: `Person Cartwheeling: Medium-Dark Skin Tone` },
      { emoji: `\u{1F938}\u{1F3FF}`, entity: `&#x1F938&#x1F3FF`, name: `Person Cartwheeling: Dark Skin Tone` },
      { emoji: `\u{1F938}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F938&#x200D&#x2642&#xFE0F`, name: `Man Cartwheeling` },
      { emoji: `\u{1F938}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F938&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Cartwheeling: Light Skin Tone` },
      { emoji: `\u{1F938}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F938&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Cartwheeling: Medium-Light Skin Tone` },
      { emoji: `\u{1F938}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F938&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Cartwheeling: Medium Skin Tone` },
      { emoji: `\u{1F938}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F938&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Cartwheeling: Medium-Dark Skin Tone` },
      { emoji: `\u{1F938}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F938&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Cartwheeling: Dark Skin Tone` },
      { emoji: `\u{1F938}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F938&#x200D&#x2640&#xFE0F`, name: `Woman Cartwheeling` },
      { emoji: `\u{1F938}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F938&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Cartwheeling: Light Skin Tone` },
      { emoji: `\u{1F938}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F938&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Cartwheeling: Medium-Light Skin Tone` },
      { emoji: `\u{1F938}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F938&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Cartwheeling: Medium Skin Tone` },
      { emoji: `\u{1F938}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F938&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Cartwheeling: Medium-Dark Skin Tone` },
      { emoji: `\u{1F938}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F938&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Cartwheeling: Dark Skin Tone` },
      { emoji: `\u{1F93C}`, entity: `&#x1F93C`, name: `People Wrestling` },
      { emoji: `\u{1F93C}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93C&#x200D&#x2642&#xFE0F`, name: `Men Wrestling` },
      { emoji: `\u{1F93C}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93C&#x200D&#x2640&#xFE0F`, name: `Women Wrestling` },
      { emoji: `\u{1F93D}`, entity: `&#x1F93D`, name: `Person Playing Water Polo` },
      { emoji: `\u{1F93D}\u{1F3FB}`, entity: `&#x1F93D&#x1F3FB`, name: `Person Playing Water Polo: Light Skin Tone` },
      { emoji: `\u{1F93D}\u{1F3FC}`, entity: `&#x1F93D&#x1F3FC`, name: `Person Playing Water Polo: Medium-Light Skin Tone` },
      { emoji: `\u{1F93D}\u{1F3FD}`, entity: `&#x1F93D&#x1F3FD`, name: `Person Playing Water Polo: Medium Skin Tone` },
      { emoji: `\u{1F93D}\u{1F3FE}`, entity: `&#x1F93D&#x1F3FE`, name: `Person Playing Water Polo: Medium-Dark Skin Tone` },
      { emoji: `\u{1F93D}\u{1F3FF}`, entity: `&#x1F93D&#x1F3FF`, name: `Person Playing Water Polo: Dark Skin Tone` },
      { emoji: `\u{1F93D}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93D&#x200D&#x2642&#xFE0F`, name: `Man Playing Water Polo` },
      { emoji: `\u{1F93D}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93D&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Playing Water Polo: Light Skin Tone` },
      { emoji: `\u{1F93D}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93D&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Playing Water Polo: Medium-Light Skin Tone` },
      { emoji: `\u{1F93D}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93D&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Playing Water Polo: Medium Skin Tone` },
      { emoji: `\u{1F93D}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93D&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Playing Water Polo: Medium-Dark Skin Tone` },
      { emoji: `\u{1F93D}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93D&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Playing Water Polo: Dark Skin Tone` },
      { emoji: `\u{1F93D}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93D&#x200D&#x2640&#xFE0F`, name: `Woman Playing Water Polo` },
      { emoji: `\u{1F93D}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93D&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Playing Water Polo: Light Skin Tone` },
      { emoji: `\u{1F93D}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93D&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Playing Water Polo: Medium-Light Skin Tone` },
      { emoji: `\u{1F93D}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93D&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Playing Water Polo: Medium Skin Tone` },
      { emoji: `\u{1F93D}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93D&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Playing Water Polo: Medium-Dark Skin Tone` },
      { emoji: `\u{1F93D}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93D&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Playing Water Polo: Dark Skin Tone` },
      { emoji: `\u{1F93E}`, entity: `&#x1F93E`, name: `Person Playing Handball` },
      { emoji: `\u{1F93E}\u{1F3FB}`, entity: `&#x1F93E&#x1F3FB`, name: `Person Playing Handball: Light Skin Tone` },
      { emoji: `\u{1F93E}\u{1F3FC}`, entity: `&#x1F93E&#x1F3FC`, name: `Person Playing Handball: Medium-Light Skin Tone` },
      { emoji: `\u{1F93E}\u{1F3FD}`, entity: `&#x1F93E&#x1F3FD`, name: `Person Playing Handball: Medium Skin Tone` },
      { emoji: `\u{1F93E}\u{1F3FE}`, entity: `&#x1F93E&#x1F3FE`, name: `Person Playing Handball: Medium-Dark Skin Tone` },
      { emoji: `\u{1F93E}\u{1F3FF}`, entity: `&#x1F93E&#x1F3FF`, name: `Person Playing Handball: Dark Skin Tone` },
      { emoji: `\u{1F93E}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93E&#x200D&#x2642&#xFE0F`, name: `Man Playing Handball` },
      { emoji: `\u{1F93E}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93E&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Playing Handball: Light Skin Tone` },
      { emoji: `\u{1F93E}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93E&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Playing Handball: Medium-Light Skin Tone` },
      { emoji: `\u{1F93E}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93E&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Playing Handball: Medium Skin Tone` },
      { emoji: `\u{1F93E}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93E&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Playing Handball: Medium-Dark Skin Tone` },
      { emoji: `\u{1F93E}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F93E&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Playing Handball: Dark Skin Tone` },
      { emoji: `\u{1F93E}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93E&#x200D&#x2640&#xFE0F`, name: `Woman Playing Handball` },
      { emoji: `\u{1F93E}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93E&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Playing Handball: Light Skin Tone` },
      { emoji: `\u{1F93E}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93E&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Playing Handball: Medium-Light Skin Tone` },
      { emoji: `\u{1F93E}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93E&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Playing Handball: Medium Skin Tone` },
      { emoji: `\u{1F93E}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93E&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Playing Handball: Medium-Dark Skin Tone` },
      { emoji: `\u{1F93E}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F93E&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Playing Handball: Dark Skin Tone` },
      { emoji: `\u{1F939}`, entity: `&#x1F939`, name: `Person Juggling` },
      { emoji: `\u{1F939}\u{1F3FB}`, entity: `&#x1F939&#x1F3FB`, name: `Person Juggling: Light Skin Tone` },
      { emoji: `\u{1F939}\u{1F3FC}`, entity: `&#x1F939&#x1F3FC`, name: `Person Juggling: Medium-Light Skin Tone` },
      { emoji: `\u{1F939}\u{1F3FD}`, entity: `&#x1F939&#x1F3FD`, name: `Person Juggling: Medium Skin Tone` },
      { emoji: `\u{1F939}\u{1F3FE}`, entity: `&#x1F939&#x1F3FE`, name: `Person Juggling: Medium-Dark Skin Tone` },
      { emoji: `\u{1F939}\u{1F3FF}`, entity: `&#x1F939&#x1F3FF`, name: `Person Juggling: Dark Skin Tone` },
      { emoji: `\u{1F939}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F939&#x200D&#x2642&#xFE0F`, name: `Man Juggling` },
      { emoji: `\u{1F939}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F939&#x1F3FB&#x200D&#x2642&#xFE0F`, name: `Man Juggling: Light Skin Tone` },
      { emoji: `\u{1F939}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F939&#x1F3FC&#x200D&#x2642&#xFE0F`, name: `Man Juggling: Medium-Light Skin Tone` },
      { emoji: `\u{1F939}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F939&#x1F3FD&#x200D&#x2642&#xFE0F`, name: `Man Juggling: Medium Skin Tone` },
      { emoji: `\u{1F939}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F939&#x1F3FE&#x200D&#x2642&#xFE0F`, name: `Man Juggling: Medium-Dark Skin Tone` },
      { emoji: `\u{1F939}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}`, entity: `&#x1F939&#x1F3FF&#x200D&#x2642&#xFE0F`, name: `Man Juggling: Dark Skin Tone` },
      { emoji: `\u{1F939}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F939&#x200D&#x2640&#xFE0F`, name: `Woman Juggling` },
      { emoji: `\u{1F939}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F939&#x1F3FB&#x200D&#x2640&#xFE0F`, name: `Woman Juggling: Light Skin Tone` },
      { emoji: `\u{1F939}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F939&#x1F3FC&#x200D&#x2640&#xFE0F`, name: `Woman Juggling: Medium-Light Skin Tone` },
      { emoji: `\u{1F939}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F939&#x1F3FD&#x200D&#x2640&#xFE0F`, name: `Woman Juggling: Medium Skin Tone` },
      { emoji: `\u{1F939}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F939&#x1F3FE&#x200D&#x2640&#xFE0F`, name: `Woman Juggling: Medium-Dark Skin Tone` },
      { emoji: `\u{1F939}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}`, entity: `&#x1F939&#x1F3FF&#x200D&#x2640&#xFE0F`, name: `Woman Juggling: Dark Skin Tone` },
      { emoji: `\u{1F46B}`, entity: `&#x1F46B`, name: `Man And Woman Holding Hands` },
      { emoji: `\u{1F46C}`, entity: `&#x1F46C`, name: `Two Men Holding Hands` },
      { emoji: `\u{1F46D}`, entity: `&#x1F46D`, name: `Two Women Holding Hands` },
      { emoji: `\u{1F48F}`, entity: `&#x1F48F`, name: `Kiss` },
      { emoji: `\u{1F469}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F48B}\u{200D}\u{1F468}`, entity: `&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F468`, name: `Kiss: Woman, Man` },
      { emoji: `\u{1F468}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F48B}\u{200D}\u{1F468}`, entity: `&#x1F468&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F468`, name: `Kiss: Man, Man` },
      { emoji: `\u{1F469}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F48B}\u{200D}\u{1F469}`, entity: `&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F469`, name: `Kiss: Woman, Woman` },
      { emoji: `\u{1F491}`, entity: `&#x1F491`, name: `Couple With Heart` },
      { emoji: `\u{1F469}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F468}`, entity: `&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F468`, name: `Couple With Heart: Woman, Man` },
      { emoji: `\u{1F468}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F468}`, entity: `&#x1F468&#x200D&#x2764&#xFE0F&#x200D&#x1F468`, name: `Couple With Heart: Man, Man` },
      { emoji: `\u{1F469}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F469}`, entity: `&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F469`, name: `Couple With Heart: Woman, Woman` },
      { emoji: `\u{1F46A}`, entity: `&#x1F46A`, name: `Family` },
      { emoji: `\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F466}`, entity: `&#x1F468&#x200D&#x1F469&#x200D&#x1F466`, name: `Family: Man, Woman, Boy` },
      { emoji: `\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}`, entity: `&#x1F468&#x200D&#x1F469&#x200D&#x1F467`, name: `Family: Man, Woman, Girl` },
      { emoji: `\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}`, entity: `&#x1F468&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F466`, name: `Family: Man, Woman, Girl, Boy` },
      { emoji: `\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F466}\u{200D}\u{1F466}`, entity: `&#x1F468&#x200D&#x1F469&#x200D&#x1F466&#x200D&#x1F466`, name: `Family: Man, Woman, Boy, Boy` },
      { emoji: `\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F467}`, entity: `&#x1F468&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F467`, name: `Family: Man, Woman, Girl, Girl` },
      { emoji: `\u{1F468}\u{200D}\u{1F468}\u{200D}\u{1F466}`, entity: `&#x1F468&#x200D&#x1F468&#x200D&#x1F466`, name: `Family: Man, Man, Boy` },
      { emoji: `\u{1F468}\u{200D}\u{1F468}\u{200D}\u{1F467}`, entity: `&#x1F468&#x200D&#x1F468&#x200D&#x1F467`, name: `Family: Man, Man, Girl` },
      { emoji: `\u{1F468}\u{200D}\u{1F468}\u{200D}\u{1F467}\u{200D}\u{1F466}`, entity: `&#x1F468&#x200D&#x1F468&#x200D&#x1F467&#x200D&#x1F466`, name: `Family: Man, Man, Girl, Boy` },
      { emoji: `\u{1F468}\u{200D}\u{1F468}\u{200D}\u{1F466}\u{200D}\u{1F466}`, entity: `&#x1F468&#x200D&#x1F468&#x200D&#x1F466&#x200D&#x1F466`, name: `Family: Man, Man, Boy, Boy` },
      { emoji: `\u{1F468}\u{200D}\u{1F468}\u{200D}\u{1F467}\u{200D}\u{1F467}`, entity: `&#x1F468&#x200D&#x1F468&#x200D&#x1F467&#x200D&#x1F467`, name: `Family: Man, Man, Girl, Girl` },
      { emoji: `\u{1F469}\u{200D}\u{1F469}\u{200D}\u{1F466}`, entity: `&#x1F469&#x200D&#x1F469&#x200D&#x1F466`, name: `Family: Woman, Woman, Boy` },
      { emoji: `\u{1F469}\u{200D}\u{1F469}\u{200D}\u{1F467}`, entity: `&#x1F469&#x200D&#x1F469&#x200D&#x1F467`, name: `Family: Woman, Woman, Girl` },
      { emoji: `\u{1F469}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}`, entity: `&#x1F469&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F466`, name: `Family: Woman, Woman, Girl, Boy` },
      { emoji: `\u{1F469}\u{200D}\u{1F469}\u{200D}\u{1F466}\u{200D}\u{1F466}`, entity: `&#x1F469&#x200D&#x1F469&#x200D&#x1F466&#x200D&#x1F466`, name: `Family: Woman, Woman, Boy, Boy` },
      { emoji: `\u{1F469}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F467}`, entity: `&#x1F469&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F467`, name: `Family: Woman, Woman, Girl, Girl` },
      { emoji: `\u{1F468}\u{200D}\u{1F466}`, entity: `&#x1F468&#x200D&#x1F466`, name: `Family: Man, Boy` },
      { emoji: `\u{1F468}\u{200D}\u{1F466}\u{200D}\u{1F466}`, entity: `&#x1F468&#x200D&#x1F466&#x200D&#x1F466`, name: `Family: Man, Boy, Boy` },
      { emoji: `\u{1F468}\u{200D}\u{1F467}`, entity: `&#x1F468&#x200D&#x1F467`, name: `Family: Man, Girl` },
      { emoji: `\u{1F468}\u{200D}\u{1F467}\u{200D}\u{1F466}`, entity: `&#x1F468&#x200D&#x1F467&#x200D&#x1F466`, name: `Family: Man, Girl, Boy` },
      { emoji: `\u{1F468}\u{200D}\u{1F467}\u{200D}\u{1F467}`, entity: `&#x1F468&#x200D&#x1F467&#x200D&#x1F467`, name: `Family: Man, Girl, Girl` },
      { emoji: `\u{1F469}\u{200D}\u{1F466}`, entity: `&#x1F469&#x200D&#x1F466`, name: `Family: Woman, Boy` },
      { emoji: `\u{1F469}\u{200D}\u{1F466}\u{200D}\u{1F466}`, entity: `&#x1F469&#x200D&#x1F466&#x200D&#x1F466`, name: `Family: Woman, Boy, Boy` },
      { emoji: `\u{1F469}\u{200D}\u{1F467}`, entity: `&#x1F469&#x200D&#x1F467`, name: `Family: Woman, Girl` },
      { emoji: `\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}`, entity: `&#x1F469&#x200D&#x1F467&#x200D&#x1F466`, name: `Family: Woman, Girl, Boy` },
      { emoji: `\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F467}`, entity: `&#x1F469&#x200D&#x1F467&#x200D&#x1F467`, name: `Family: Woman, Girl, Girl` },
      { emoji: `\u{1F3FB}`, entity: `&#x1F3FB`, name: `Light Skin Tone` },
      { emoji: `\u{1F3FC}`, entity: `&#x1F3FC`, name: `Medium-Light Skin Tone` },
      { emoji: `\u{1F3FD}`, entity: `&#x1F3FD`, name: `Medium Skin Tone` },
      { emoji: `\u{1F3FE}`, entity: `&#x1F3FE`, name: `Medium-Dark Skin Tone` },
      { emoji: `\u{1F3FF}`, entity: `&#x1F3FF`, name: `Dark Skin Tone` },
      { emoji: `\u{1F4AA}`, entity: `&#x1F4AA`, name: `Flexed Biceps` },
      { emoji: `\u{1F4AA}\u{1F3FB}`, entity: `&#x1F4AA&#x1F3FB`, name: `Flexed Biceps: Light Skin Tone` },
      { emoji: `\u{1F4AA}\u{1F3FC}`, entity: `&#x1F4AA&#x1F3FC`, name: `Flexed Biceps: Medium-Light Skin Tone` },
      { emoji: `\u{1F4AA}\u{1F3FD}`, entity: `&#x1F4AA&#x1F3FD`, name: `Flexed Biceps: Medium Skin Tone` },
      { emoji: `\u{1F4AA}\u{1F3FE}`, entity: `&#x1F4AA&#x1F3FE`, name: `Flexed Biceps: Medium-Dark Skin Tone` },
      { emoji: `\u{1F4AA}\u{1F3FF}`, entity: `&#x1F4AA&#x1F3FF`, name: `Flexed Biceps: Dark Skin Tone` },
      { emoji: `\u{1F933}`, entity: `&#x1F933`, name: `Selfie` },
      { emoji: `\u{1F933}\u{1F3FB}`, entity: `&#x1F933&#x1F3FB`, name: `Selfie: Light Skin Tone` },
      { emoji: `\u{1F933}\u{1F3FC}`, entity: `&#x1F933&#x1F3FC`, name: `Selfie: Medium-Light Skin Tone` },
      { emoji: `\u{1F933}\u{1F3FD}`, entity: `&#x1F933&#x1F3FD`, name: `Selfie: Medium Skin Tone` },
      { emoji: `\u{1F933}\u{1F3FE}`, entity: `&#x1F933&#x1F3FE`, name: `Selfie: Medium-Dark Skin Tone` },
      { emoji: `\u{1F933}\u{1F3FF}`, entity: `&#x1F933&#x1F3FF`, name: `Selfie: Dark Skin Tone` },
      { emoji: `\u{1F448}`, entity: `&#x1F448`, name: `Backhand Index Pointing Left` },
      { emoji: `\u{1F448}\u{1F3FB}`, entity: `&#x1F448&#x1F3FB`, name: `Backhand Index Pointing Left: Light Skin Tone` },
      { emoji: `\u{1F448}\u{1F3FC}`, entity: `&#x1F448&#x1F3FC`, name: `Backhand Index Pointing Left: Medium-Light Skin Tone` },
      { emoji: `\u{1F448}\u{1F3FD}`, entity: `&#x1F448&#x1F3FD`, name: `Backhand Index Pointing Left: Medium Skin Tone` },
      { emoji: `\u{1F448}\u{1F3FE}`, entity: `&#x1F448&#x1F3FE`, name: `Backhand Index Pointing Left: Medium-Dark Skin Tone` },
      { emoji: `\u{1F448}\u{1F3FF}`, entity: `&#x1F448&#x1F3FF`, name: `Backhand Index Pointing Left: Dark Skin Tone` },
      { emoji: `\u{1F449}`, entity: `&#x1F449`, name: `Backhand Index Pointing Right` },
      { emoji: `\u{1F449}\u{1F3FB}`, entity: `&#x1F449&#x1F3FB`, name: `Backhand Index Pointing Right: Light Skin Tone` },
      { emoji: `\u{1F449}\u{1F3FC}`, entity: `&#x1F449&#x1F3FC`, name: `Backhand Index Pointing Right: Medium-Light Skin Tone` },
      { emoji: `\u{1F449}\u{1F3FD}`, entity: `&#x1F449&#x1F3FD`, name: `Backhand Index Pointing Right: Medium Skin Tone` },
      { emoji: `\u{1F449}\u{1F3FE}`, entity: `&#x1F449&#x1F3FE`, name: `Backhand Index Pointing Right: Medium-Dark Skin Tone` },
      { emoji: `\u{1F449}\u{1F3FF}`, entity: `&#x1F449&#x1F3FF`, name: `Backhand Index Pointing Right: Dark Skin Tone` },
      { emoji: `\u{261D}`, entity: `&#x261D`, name: `Index Pointing Up` },
      { emoji: `\u{261D}\u{1F3FB}`, entity: `&#x261D&#x1F3FB`, name: `Index Pointing Up: Light Skin Tone` },
      { emoji: `\u{261D}\u{1F3FC}`, entity: `&#x261D&#x1F3FC`, name: `Index Pointing Up: Medium-Light Skin Tone` },
      { emoji: `\u{261D}\u{1F3FD}`, entity: `&#x261D&#x1F3FD`, name: `Index Pointing Up: Medium Skin Tone` },
      { emoji: `\u{261D}\u{1F3FE}`, entity: `&#x261D&#x1F3FE`, name: `Index Pointing Up: Medium-Dark Skin Tone` },
      { emoji: `\u{261D}\u{1F3FF}`, entity: `&#x261D&#x1F3FF`, name: `Index Pointing Up: Dark Skin Tone` },
      { emoji: `\u{1F446}`, entity: `&#x1F446`, name: `Backhand Index Pointing Up` },
      { emoji: `\u{1F446}\u{1F3FB}`, entity: `&#x1F446&#x1F3FB`, name: `Backhand Index Pointing Up: Light Skin Tone` },
      { emoji: `\u{1F446}\u{1F3FC}`, entity: `&#x1F446&#x1F3FC`, name: `Backhand Index Pointing Up: Medium-Light Skin Tone` },
      { emoji: `\u{1F446}\u{1F3FD}`, entity: `&#x1F446&#x1F3FD`, name: `Backhand Index Pointing Up: Medium Skin Tone` },
      { emoji: `\u{1F446}\u{1F3FE}`, entity: `&#x1F446&#x1F3FE`, name: `Backhand Index Pointing Up: Medium-Dark Skin Tone` },
      { emoji: `\u{1F446}\u{1F3FF}`, entity: `&#x1F446&#x1F3FF`, name: `Backhand Index Pointing Up: Dark Skin Tone` },
      { emoji: `\u{1F595}`, entity: `&#x1F595`, name: `Middle Finger` },
      { emoji: `\u{1F595}\u{1F3FB}`, entity: `&#x1F595&#x1F3FB`, name: `Middle Finger: Light Skin Tone` },
      { emoji: `\u{1F595}\u{1F3FC}`, entity: `&#x1F595&#x1F3FC`, name: `Middle Finger: Medium-Light Skin Tone` },
      { emoji: `\u{1F595}\u{1F3FD}`, entity: `&#x1F595&#x1F3FD`, name: `Middle Finger: Medium Skin Tone` },
      { emoji: `\u{1F595}\u{1F3FE}`, entity: `&#x1F595&#x1F3FE`, name: `Middle Finger: Medium-Dark Skin Tone` },
      { emoji: `\u{1F595}\u{1F3FF}`, entity: `&#x1F595&#x1F3FF`, name: `Middle Finger: Dark Skin Tone` },
      { emoji: `\u{1F447}`, entity: `&#x1F447`, name: `Backhand Index Pointing Down` },
      { emoji: `\u{1F447}\u{1F3FB}`, entity: `&#x1F447&#x1F3FB`, name: `Backhand Index Pointing Down: Light Skin Tone` },
      { emoji: `\u{1F447}\u{1F3FC}`, entity: `&#x1F447&#x1F3FC`, name: `Backhand Index Pointing Down: Medium-Light Skin Tone` },
      { emoji: `\u{1F447}\u{1F3FD}`, entity: `&#x1F447&#x1F3FD`, name: `Backhand Index Pointing Down: Medium Skin Tone` },
      { emoji: `\u{1F447}\u{1F3FE}`, entity: `&#x1F447&#x1F3FE`, name: `Backhand Index Pointing Down: Medium-Dark Skin Tone` },
      { emoji: `\u{1F447}\u{1F3FF}`, entity: `&#x1F447&#x1F3FF`, name: `Backhand Index Pointing Down: Dark Skin Tone` },
      { emoji: `\u{270C}`, entity: `&#x270C`, name: `Victory Hand` },
      { emoji: `\u{270C}\u{1F3FB}`, entity: `&#x270C&#x1F3FB`, name: `Victory Hand: Light Skin Tone` },
      { emoji: `\u{270C}\u{1F3FC}`, entity: `&#x270C&#x1F3FC`, name: `Victory Hand: Medium-Light Skin Tone` },
      { emoji: `\u{270C}\u{1F3FD}`, entity: `&#x270C&#x1F3FD`, name: `Victory Hand: Medium Skin Tone` },
      { emoji: `\u{270C}\u{1F3FE}`, entity: `&#x270C&#x1F3FE`, name: `Victory Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{270C}\u{1F3FF}`, entity: `&#x270C&#x1F3FF`, name: `Victory Hand: Dark Skin Tone` },
      { emoji: `\u{1F91E}`, entity: `&#x1F91E`, name: `Crossed Fingers` },
      { emoji: `\u{1F91E}\u{1F3FB}`, entity: `&#x1F91E&#x1F3FB`, name: `Crossed Fingers: Light Skin Tone` },
      { emoji: `\u{1F91E}\u{1F3FC}`, entity: `&#x1F91E&#x1F3FC`, name: `Crossed Fingers: Medium-Light Skin Tone` },
      { emoji: `\u{1F91E}\u{1F3FD}`, entity: `&#x1F91E&#x1F3FD`, name: `Crossed Fingers: Medium Skin Tone` },
      { emoji: `\u{1F91E}\u{1F3FE}`, entity: `&#x1F91E&#x1F3FE`, name: `Crossed Fingers: Medium-Dark Skin Tone` },
      { emoji: `\u{1F91E}\u{1F3FF}`, entity: `&#x1F91E&#x1F3FF`, name: `Crossed Fingers: Dark Skin Tone` },
      { emoji: `\u{1F596}`, entity: `&#x1F596`, name: `Vulcan Salute` },
      { emoji: `\u{1F596}\u{1F3FB}`, entity: `&#x1F596&#x1F3FB`, name: `Vulcan Salute: Light Skin Tone` },
      { emoji: `\u{1F596}\u{1F3FC}`, entity: `&#x1F596&#x1F3FC`, name: `Vulcan Salute: Medium-Light Skin Tone` },
      { emoji: `\u{1F596}\u{1F3FD}`, entity: `&#x1F596&#x1F3FD`, name: `Vulcan Salute: Medium Skin Tone` },
      { emoji: `\u{1F596}\u{1F3FE}`, entity: `&#x1F596&#x1F3FE`, name: `Vulcan Salute: Medium-Dark Skin Tone` },
      { emoji: `\u{1F596}\u{1F3FF}`, entity: `&#x1F596&#x1F3FF`, name: `Vulcan Salute: Dark Skin Tone` },
      { emoji: `\u{1F918}`, entity: `&#x1F918`, name: `Sign Of The Horns` },
      { emoji: `\u{1F918}\u{1F3FB}`, entity: `&#x1F918&#x1F3FB`, name: `Sign Of The Horns: Light Skin Tone` },
      { emoji: `\u{1F918}\u{1F3FC}`, entity: `&#x1F918&#x1F3FC`, name: `Sign Of The Horns: Medium-Light Skin Tone` },
      { emoji: `\u{1F918}\u{1F3FD}`, entity: `&#x1F918&#x1F3FD`, name: `Sign Of The Horns: Medium Skin Tone` },
      { emoji: `\u{1F918}\u{1F3FE}`, entity: `&#x1F918&#x1F3FE`, name: `Sign Of The Horns: Medium-Dark Skin Tone` },
      { emoji: `\u{1F918}\u{1F3FF}`, entity: `&#x1F918&#x1F3FF`, name: `Sign Of The Horns: Dark Skin Tone` },
      { emoji: `\u{1F919}`, entity: `&#x1F919`, name: `Call Me Hand` },
      { emoji: `\u{1F919}\u{1F3FB}`, entity: `&#x1F919&#x1F3FB`, name: `Call Me Hand: Light Skin Tone` },
      { emoji: `\u{1F919}\u{1F3FC}`, entity: `&#x1F919&#x1F3FC`, name: `Call Me Hand: Medium-Light Skin Tone` },
      { emoji: `\u{1F919}\u{1F3FD}`, entity: `&#x1F919&#x1F3FD`, name: `Call Me Hand: Medium Skin Tone` },
      { emoji: `\u{1F919}\u{1F3FE}`, entity: `&#x1F919&#x1F3FE`, name: `Call Me Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{1F919}\u{1F3FF}`, entity: `&#x1F919&#x1F3FF`, name: `Call Me Hand: Dark Skin Tone` },
      { emoji: `\u{1F590}`, entity: `&#x1F590`, name: `Raised Hand With Fingers Splayed` },
      { emoji: `\u{1F590}\u{1F3FB}`, entity: `&#x1F590&#x1F3FB`, name: `Raised Hand With Fingers Splayed: Light Skin Tone` },
      { emoji: `\u{1F590}\u{1F3FC}`, entity: `&#x1F590&#x1F3FC`, name: `Raised Hand With Fingers Splayed: Medium-Light Skin Tone` },
      { emoji: `\u{1F590}\u{1F3FD}`, entity: `&#x1F590&#x1F3FD`, name: `Raised Hand With Fingers Splayed: Medium Skin Tone` },
      { emoji: `\u{1F590}\u{1F3FE}`, entity: `&#x1F590&#x1F3FE`, name: `Raised Hand With Fingers Splayed: Medium-Dark Skin Tone` },
      { emoji: `\u{1F590}\u{1F3FF}`, entity: `&#x1F590&#x1F3FF`, name: `Raised Hand With Fingers Splayed: Dark Skin Tone` },
      { emoji: `\u{270B}`, entity: `&#x270B`, name: `Raised Hand` },
      { emoji: `\u{270B}\u{1F3FB}`, entity: `&#x270B&#x1F3FB`, name: `Raised Hand: Light Skin Tone` },
      { emoji: `\u{270B}\u{1F3FC}`, entity: `&#x270B&#x1F3FC`, name: `Raised Hand: Medium-Light Skin Tone` },
      { emoji: `\u{270B}\u{1F3FD}`, entity: `&#x270B&#x1F3FD`, name: `Raised Hand: Medium Skin Tone` },
      { emoji: `\u{270B}\u{1F3FE}`, entity: `&#x270B&#x1F3FE`, name: `Raised Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{270B}\u{1F3FF}`, entity: `&#x270B&#x1F3FF`, name: `Raised Hand: Dark Skin Tone` },
      { emoji: `\u{1F44C}`, entity: `&#x1F44C`, name: `OK Hand` },
      { emoji: `\u{1F44C}\u{1F3FB}`, entity: `&#x1F44C&#x1F3FB`, name: `OK Hand: Light Skin Tone` },
      { emoji: `\u{1F44C}\u{1F3FC}`, entity: `&#x1F44C&#x1F3FC`, name: `OK Hand: Medium-Light Skin Tone` },
      { emoji: `\u{1F44C}\u{1F3FD}`, entity: `&#x1F44C&#x1F3FD`, name: `OK Hand: Medium Skin Tone` },
      { emoji: `\u{1F44C}\u{1F3FE}`, entity: `&#x1F44C&#x1F3FE`, name: `OK Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{1F44C}\u{1F3FF}`, entity: `&#x1F44C&#x1F3FF`, name: `OK Hand: Dark Skin Tone` },
      { emoji: `\u{1F44D}`, entity: `&#x1F44D`, name: `Thumbs Up` },
      { emoji: `\u{1F44D}\u{1F3FB}`, entity: `&#x1F44D&#x1F3FB`, name: `Thumbs Up: Light Skin Tone` },
      { emoji: `\u{1F44D}\u{1F3FC}`, entity: `&#x1F44D&#x1F3FC`, name: `Thumbs Up: Medium-Light Skin Tone` },
      { emoji: `\u{1F44D}\u{1F3FD}`, entity: `&#x1F44D&#x1F3FD`, name: `Thumbs Up: Medium Skin Tone` },
      { emoji: `\u{1F44D}\u{1F3FE}`, entity: `&#x1F44D&#x1F3FE`, name: `Thumbs Up: Medium-Dark Skin Tone` },
      { emoji: `\u{1F44D}\u{1F3FF}`, entity: `&#x1F44D&#x1F3FF`, name: `Thumbs Up: Dark Skin Tone` },
      { emoji: `\u{1F44E}`, entity: `&#x1F44E`, name: `Thumbs Down` },
      { emoji: `\u{1F44E}\u{1F3FB}`, entity: `&#x1F44E&#x1F3FB`, name: `Thumbs Down: Light Skin Tone` },
      { emoji: `\u{1F44E}\u{1F3FC}`, entity: `&#x1F44E&#x1F3FC`, name: `Thumbs Down: Medium-Light Skin Tone` },
      { emoji: `\u{1F44E}\u{1F3FD}`, entity: `&#x1F44E&#x1F3FD`, name: `Thumbs Down: Medium Skin Tone` },
      { emoji: `\u{1F44E}\u{1F3FE}`, entity: `&#x1F44E&#x1F3FE`, name: `Thumbs Down: Medium-Dark Skin Tone` },
      { emoji: `\u{1F44E}\u{1F3FF}`, entity: `&#x1F44E&#x1F3FF`, name: `Thumbs Down: Dark Skin Tone` },
      { emoji: `\u{270A}`, entity: `&#x270A`, name: `Raised Fist` },
      { emoji: `\u{270A}\u{1F3FB}`, entity: `&#x270A&#x1F3FB`, name: `Raised Fist: Light Skin Tone` },
      { emoji: `\u{270A}\u{1F3FC}`, entity: `&#x270A&#x1F3FC`, name: `Raised Fist: Medium-Light Skin Tone` },
      { emoji: `\u{270A}\u{1F3FD}`, entity: `&#x270A&#x1F3FD`, name: `Raised Fist: Medium Skin Tone` },
      { emoji: `\u{270A}\u{1F3FE}`, entity: `&#x270A&#x1F3FE`, name: `Raised Fist: Medium-Dark Skin Tone` },
      { emoji: `\u{270A}\u{1F3FF}`, entity: `&#x270A&#x1F3FF`, name: `Raised Fist: Dark Skin Tone` },
      { emoji: `\u{1F44A}`, entity: `&#x1F44A`, name: `Oncoming Fist` },
      { emoji: `\u{1F44A}\u{1F3FB}`, entity: `&#x1F44A&#x1F3FB`, name: `Oncoming Fist: Light Skin Tone` },
      { emoji: `\u{1F44A}\u{1F3FC}`, entity: `&#x1F44A&#x1F3FC`, name: `Oncoming Fist: Medium-Light Skin Tone` },
      { emoji: `\u{1F44A}\u{1F3FD}`, entity: `&#x1F44A&#x1F3FD`, name: `Oncoming Fist: Medium Skin Tone` },
      { emoji: `\u{1F44A}\u{1F3FE}`, entity: `&#x1F44A&#x1F3FE`, name: `Oncoming Fist: Medium-Dark Skin Tone` },
      { emoji: `\u{1F44A}\u{1F3FF}`, entity: `&#x1F44A&#x1F3FF`, name: `Oncoming Fist: Dark Skin Tone` },
      { emoji: `\u{1F91B}`, entity: `&#x1F91B`, name: `Left-Facing Fist` },
      { emoji: `\u{1F91B}\u{1F3FB}`, entity: `&#x1F91B&#x1F3FB`, name: `Left-Facing Fist: Light Skin Tone` },
      { emoji: `\u{1F91B}\u{1F3FC}`, entity: `&#x1F91B&#x1F3FC`, name: `Left-Facing Fist: Medium-Light Skin Tone` },
      { emoji: `\u{1F91B}\u{1F3FD}`, entity: `&#x1F91B&#x1F3FD`, name: `Left-Facing Fist: Medium Skin Tone` },
      { emoji: `\u{1F91B}\u{1F3FE}`, entity: `&#x1F91B&#x1F3FE`, name: `Left-Facing Fist: Medium-Dark Skin Tone` },
      { emoji: `\u{1F91B}\u{1F3FF}`, entity: `&#x1F91B&#x1F3FF`, name: `Left-Facing Fist: Dark Skin Tone` },
      { emoji: `\u{1F91C}`, entity: `&#x1F91C`, name: `Right-Facing Fist` },
      { emoji: `\u{1F91C}\u{1F3FB}`, entity: `&#x1F91C&#x1F3FB`, name: `Right-Facing Fist: Light Skin Tone` },
      { emoji: `\u{1F91C}\u{1F3FC}`, entity: `&#x1F91C&#x1F3FC`, name: `Right-Facing Fist: Medium-Light Skin Tone` },
      { emoji: `\u{1F91C}\u{1F3FD}`, entity: `&#x1F91C&#x1F3FD`, name: `Right-Facing Fist: Medium Skin Tone` },
      { emoji: `\u{1F91C}\u{1F3FE}`, entity: `&#x1F91C&#x1F3FE`, name: `Right-Facing Fist: Medium-Dark Skin Tone` },
      { emoji: `\u{1F91C}\u{1F3FF}`, entity: `&#x1F91C&#x1F3FF`, name: `Right-Facing Fist: Dark Skin Tone` },
      { emoji: `\u{1F91A}`, entity: `&#x1F91A`, name: `Raised Back Of Hand` },
      { emoji: `\u{1F91A}\u{1F3FB}`, entity: `&#x1F91A&#x1F3FB`, name: `Raised Back Of Hand: Light Skin Tone` },
      { emoji: `\u{1F91A}\u{1F3FC}`, entity: `&#x1F91A&#x1F3FC`, name: `Raised Back Of Hand: Medium-Light Skin Tone` },
      { emoji: `\u{1F91A}\u{1F3FD}`, entity: `&#x1F91A&#x1F3FD`, name: `Raised Back Of Hand: Medium Skin Tone` },
      { emoji: `\u{1F91A}\u{1F3FE}`, entity: `&#x1F91A&#x1F3FE`, name: `Raised Back Of Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{1F91A}\u{1F3FF}`, entity: `&#x1F91A&#x1F3FF`, name: `Raised Back Of Hand: Dark Skin Tone` },
      { emoji: `\u{1F44B}`, entity: `&#x1F44B`, name: `Waving Hand` },
      { emoji: `\u{1F44B}\u{1F3FB}`, entity: `&#x1F44B&#x1F3FB`, name: `Waving Hand: Light Skin Tone` },
      { emoji: `\u{1F44B}\u{1F3FC}`, entity: `&#x1F44B&#x1F3FC`, name: `Waving Hand: Medium-Light Skin Tone` },
      { emoji: `\u{1F44B}\u{1F3FD}`, entity: `&#x1F44B&#x1F3FD`, name: `Waving Hand: Medium Skin Tone` },
      { emoji: `\u{1F44B}\u{1F3FE}`, entity: `&#x1F44B&#x1F3FE`, name: `Waving Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{1F44B}\u{1F3FF}`, entity: `&#x1F44B&#x1F3FF`, name: `Waving Hand: Dark Skin Tone` },
      { emoji: `\u{1F44F}`, entity: `&#x1F44F`, name: `Clapping Hands` },
      { emoji: `\u{1F44F}\u{1F3FB}`, entity: `&#x1F44F&#x1F3FB`, name: `Clapping Hands: Light Skin Tone` },
      { emoji: `\u{1F44F}\u{1F3FC}`, entity: `&#x1F44F&#x1F3FC`, name: `Clapping Hands: Medium-Light Skin Tone` },
      { emoji: `\u{1F44F}\u{1F3FD}`, entity: `&#x1F44F&#x1F3FD`, name: `Clapping Hands: Medium Skin Tone` },
      { emoji: `\u{1F44F}\u{1F3FE}`, entity: `&#x1F44F&#x1F3FE`, name: `Clapping Hands: Medium-Dark Skin Tone` },
      { emoji: `\u{1F44F}\u{1F3FF}`, entity: `&#x1F44F&#x1F3FF`, name: `Clapping Hands: Dark Skin Tone` },
      { emoji: `\u{270D}`, entity: `&#x270D`, name: `Writing Hand` },
      { emoji: `\u{270D}\u{1F3FB}`, entity: `&#x270D&#x1F3FB`, name: `Writing Hand: Light Skin Tone` },
      { emoji: `\u{270D}\u{1F3FC}`, entity: `&#x270D&#x1F3FC`, name: `Writing Hand: Medium-Light Skin Tone` },
      { emoji: `\u{270D}\u{1F3FD}`, entity: `&#x270D&#x1F3FD`, name: `Writing Hand: Medium Skin Tone` },
      { emoji: `\u{270D}\u{1F3FE}`, entity: `&#x270D&#x1F3FE`, name: `Writing Hand: Medium-Dark Skin Tone` },
      { emoji: `\u{270D}\u{1F3FF}`, entity: `&#x270D&#x1F3FF`, name: `Writing Hand: Dark Skin Tone` },
      { emoji: `\u{1F450}`, entity: `&#x1F450`, name: `Open Hands` },
      { emoji: `\u{1F450}\u{1F3FB}`, entity: `&#x1F450&#x1F3FB`, name: `Open Hands: Light Skin Tone` },
      { emoji: `\u{1F450}\u{1F3FC}`, entity: `&#x1F450&#x1F3FC`, name: `Open Hands: Medium-Light Skin Tone` },
      { emoji: `\u{1F450}\u{1F3FD}`, entity: `&#x1F450&#x1F3FD`, name: `Open Hands: Medium Skin Tone` },
      { emoji: `\u{1F450}\u{1F3FE}`, entity: `&#x1F450&#x1F3FE`, name: `Open Hands: Medium-Dark Skin Tone` },
      { emoji: `\u{1F450}\u{1F3FF}`, entity: `&#x1F450&#x1F3FF`, name: `Open Hands: Dark Skin Tone` },
      { emoji: `\u{1F64C}`, entity: `&#x1F64C`, name: `Raising Hands` },
      { emoji: `\u{1F64C}\u{1F3FB}`, entity: `&#x1F64C&#x1F3FB`, name: `Raising Hands: Light Skin Tone` },
      { emoji: `\u{1F64C}\u{1F3FC}`, entity: `&#x1F64C&#x1F3FC`, name: `Raising Hands: Medium-Light Skin Tone` },
      { emoji: `\u{1F64C}\u{1F3FD}`, entity: `&#x1F64C&#x1F3FD`, name: `Raising Hands: Medium Skin Tone` },
      { emoji: `\u{1F64C}\u{1F3FE}`, entity: `&#x1F64C&#x1F3FE`, name: `Raising Hands: Medium-Dark Skin Tone` },
      { emoji: `\u{1F64C}\u{1F3FF}`, entity: `&#x1F64C&#x1F3FF`, name: `Raising Hands: Dark Skin Tone` },
      { emoji: `\u{1F64F}`, entity: `&#x1F64F`, name: `Folded Hands` },
      { emoji: `\u{1F64F}\u{1F3FB}`, entity: `&#x1F64F&#x1F3FB`, name: `Folded Hands: Light Skin Tone` },
      { emoji: `\u{1F64F}\u{1F3FC}`, entity: `&#x1F64F&#x1F3FC`, name: `Folded Hands: Medium-Light Skin Tone` },
      { emoji: `\u{1F64F}\u{1F3FD}`, entity: `&#x1F64F&#x1F3FD`, name: `Folded Hands: Medium Skin Tone` },
      { emoji: `\u{1F64F}\u{1F3FE}`, entity: `&#x1F64F&#x1F3FE`, name: `Folded Hands: Medium-Dark Skin Tone` },
      { emoji: `\u{1F64F}\u{1F3FF}`, entity: `&#x1F64F&#x1F3FF`, name: `Folded Hands: Dark Skin Tone` },
      { emoji: `\u{1F91D}`, entity: `&#x1F91D`, name: `Handshake` },
      { emoji: `\u{1F485}`, entity: `&#x1F485`, name: `Nail Polish` },
      { emoji: `\u{1F485}\u{1F3FB}`, entity: `&#x1F485&#x1F3FB`, name: `Nail Polish: Light Skin Tone` },
      { emoji: `\u{1F485}\u{1F3FC}`, entity: `&#x1F485&#x1F3FC`, name: `Nail Polish: Medium-Light Skin Tone` },
      { emoji: `\u{1F485}\u{1F3FD}`, entity: `&#x1F485&#x1F3FD`, name: `Nail Polish: Medium Skin Tone` },
      { emoji: `\u{1F485}\u{1F3FE}`, entity: `&#x1F485&#x1F3FE`, name: `Nail Polish: Medium-Dark Skin Tone` },
      { emoji: `\u{1F485}\u{1F3FF}`, entity: `&#x1F485&#x1F3FF`, name: `Nail Polish: Dark Skin Tone` },
      { emoji: `\u{1F442}`, entity: `&#x1F442`, name: `Ear` },
      { emoji: `\u{1F442}\u{1F3FB}`, entity: `&#x1F442&#x1F3FB`, name: `Ear: Light Skin Tone` },
      { emoji: `\u{1F442}\u{1F3FC}`, entity: `&#x1F442&#x1F3FC`, name: `Ear: Medium-Light Skin Tone` },
      { emoji: `\u{1F442}\u{1F3FD}`, entity: `&#x1F442&#x1F3FD`, name: `Ear: Medium Skin Tone` },
      { emoji: `\u{1F442}\u{1F3FE}`, entity: `&#x1F442&#x1F3FE`, name: `Ear: Medium-Dark Skin Tone` },
      { emoji: `\u{1F442}\u{1F3FF}`, entity: `&#x1F442&#x1F3FF`, name: `Ear: Dark Skin Tone` },
      { emoji: `\u{1F443}`, entity: `&#x1F443`, name: `Nose` },
      { emoji: `\u{1F443}\u{1F3FB}`, entity: `&#x1F443&#x1F3FB`, name: `Nose: Light Skin Tone` },
      { emoji: `\u{1F443}\u{1F3FC}`, entity: `&#x1F443&#x1F3FC`, name: `Nose: Medium-Light Skin Tone` },
      { emoji: `\u{1F443}\u{1F3FD}`, entity: `&#x1F443&#x1F3FD`, name: `Nose: Medium Skin Tone` },
      { emoji: `\u{1F443}\u{1F3FE}`, entity: `&#x1F443&#x1F3FE`, name: `Nose: Medium-Dark Skin Tone` },
      { emoji: `\u{1F443}\u{1F3FF}`, entity: `&#x1F443&#x1F3FF`, name: `Nose: Dark Skin Tone` },
      { emoji: `\u{1F463}`, entity: `&#x1F463`, name: `Footprints` },
      { emoji: `\u{1F440}`, entity: `&#x1F440`, name: `Eyes` },
      { emoji: `\u{1F441}`, entity: `&#x1F441`, name: `Eye` },
      { emoji: `\u{1F441}\u{FE0F}\u{200D}\u{1F5E8}\u{FE0F}`, entity: `&#x1F441&#xFE0F&#x200D&#x1F5E8&#xFE0F`, name: `Eye In Speech Bubble` },
      { emoji: `\u{1F445}`, entity: `&#x1F445`, name: `Tongue` },
      { emoji: `\u{1F444}`, entity: `&#x1F444`, name: `Mouth` },
      { emoji: `\u{1F48B}`, entity: `&#x1F48B`, name: `Kiss Mark` },
      { emoji: `\u{1F498}`, entity: `&#x1F498`, name: `Heart With Arrow` },
      { emoji: `\u{2764}`, entity: `&#x2764`, name: `Red Heart` },
      { emoji: `\u{1F493}`, entity: `&#x1F493`, name: `Beating Heart` },
      { emoji: `\u{1F494}`, entity: `&#x1F494`, name: `Broken Heart` },
      { emoji: `\u{1F495}`, entity: `&#x1F495`, name: `Two Hearts` },
      { emoji: `\u{1F496}`, entity: `&#x1F496`, name: `Sparkling Heart` },
      { emoji: `\u{1F497}`, entity: `&#x1F497`, name: `Growing Heart` },
      { emoji: `\u{1F499}`, entity: `&#x1F499`, name: `Blue Heart` },
      { emoji: `\u{1F49A}`, entity: `&#x1F49A`, name: `Green Heart` },
      { emoji: `\u{1F49B}`, entity: `&#x1F49B`, name: `Yellow Heart` },
      { emoji: `\u{1F49C}`, entity: `&#x1F49C`, name: `Purple Heart` },
      { emoji: `\u{1F5A4}`, entity: `&#x1F5A4`, name: `Black Heart` },
      { emoji: `\u{1F49D}`, entity: `&#x1F49D`, name: `Heart With Ribbon` },
      { emoji: `\u{1F49E}`, entity: `&#x1F49E`, name: `Revolving Hearts` },
      { emoji: `\u{1F49F}`, entity: `&#x1F49F`, name: `Heart Decoration` },
      { emoji: `\u{2763}`, entity: `&#x2763`, name: `Heavy Heart Exclamation` },
      { emoji: `\u{1F48C}`, entity: `&#x1F48C`, name: `Love Letter` },
      { emoji: `\u{1F4A4}`, entity: `&#x1F4A4`, name: `Zzz` },
      { emoji: `\u{1F4A2}`, entity: `&#x1F4A2`, name: `Anger Symbol` },
      { emoji: `\u{1F4A3}`, entity: `&#x1F4A3`, name: `Bomb` },
      { emoji: `\u{1F4A5}`, entity: `&#x1F4A5`, name: `Collision` },
      { emoji: `\u{1F4A6}`, entity: `&#x1F4A6`, name: `Sweat Droplets` },
      { emoji: `\u{1F4A8}`, entity: `&#x1F4A8`, name: `Dashing Away` },
      { emoji: `\u{1F4AB}`, entity: `&#x1F4AB`, name: `Dizzy` },
      { emoji: `\u{1F4AC}`, entity: `&#x1F4AC`, name: `Speech Balloon` },
      { emoji: `\u{1F5E8}`, entity: `&#x1F5E8`, name: `Left Speech Bubble` },
      { emoji: `\u{1F5EF}`, entity: `&#x1F5EF`, name: `Right Anger Bubble` },
      { emoji: `\u{1F4AD}`, entity: `&#x1F4AD`, name: `Thought Balloon` },
      { emoji: `\u{1F573}`, entity: `&#x1F573`, name: `Hole` },
      { emoji: `\u{1F453}`, entity: `&#x1F453`, name: `Glasses` },
      { emoji: `\u{1F576}`, entity: `&#x1F576`, name: `Sunglasses` },
      { emoji: `\u{1F454}`, entity: `&#x1F454`, name: `Necktie` },
      { emoji: `\u{1F455}`, entity: `&#x1F455`, name: `T-Shirt` },
      { emoji: `\u{1F456}`, entity: `&#x1F456`, name: `Jeans` },
      { emoji: `\u{1F457}`, entity: `&#x1F457`, name: `Dress` },
      { emoji: `\u{1F458}`, entity: `&#x1F458`, name: `Kimono` },
      { emoji: `\u{1F459}`, entity: `&#x1F459`, name: `Bikini` },
      { emoji: `\u{1F45A}`, entity: `&#x1F45A`, name: `Woman’s Clothes` },
      { emoji: `\u{1F45B}`, entity: `&#x1F45B`, name: `Purse` },
      { emoji: `\u{1F45C}`, entity: `&#x1F45C`, name: `Handbag` },
      { emoji: `\u{1F45D}`, entity: `&#x1F45D`, name: `Clutch Bag` },
      { emoji: `\u{1F6CD}`, entity: `&#x1F6CD`, name: `Shopping Bags` },
      { emoji: `\u{1F392}`, entity: `&#x1F392`, name: `School Backpack` },
      { emoji: `\u{1F45E}`, entity: `&#x1F45E`, name: `Man’s Shoe` },
      { emoji: `\u{1F45F}`, entity: `&#x1F45F`, name: `Running Shoe` },
      { emoji: `\u{1F460}`, entity: `&#x1F460`, name: `High-Heeled Shoe` },
      { emoji: `\u{1F461}`, entity: `&#x1F461`, name: `Woman’s Sandal` },
      { emoji: `\u{1F462}`, entity: `&#x1F462`, name: `Woman’s Boot` },
      { emoji: `\u{1F451}`, entity: `&#x1F451`, name: `Crown` },
      { emoji: `\u{1F452}`, entity: `&#x1F452`, name: `Woman’s Hat` },
      { emoji: `\u{1F3A9}`, entity: `&#x1F3A9`, name: `Top Hat` },
      { emoji: `\u{1F393}`, entity: `&#x1F393`, name: `Graduation Cap` },
      { emoji: `\u{26D1}`, entity: `&#x26D1`, name: `Rescue Worker’s Helmet` },
      { emoji: `\u{1F4FF}`, entity: `&#x1F4FF`, name: `Prayer Beads` },
      { emoji: `\u{1F484}`, entity: `&#x1F484`, name: `Lipstick` },
      { emoji: `\u{1F48D}`, entity: `&#x1F48D`, name: `Ring` },
      { emoji: `\u{1F48E}`, entity: `&#x1F48E`, name: `Gem Stone` },
      { emoji: `\u{1F435}`, entity: `&#x1F435`, name: `Monkey Face` },
      { emoji: `\u{1F412}`, entity: `&#x1F412`, name: `Monkey` },
      { emoji: `\u{1F98D}`, entity: `&#x1F98D`, name: `Gorilla` },
      { emoji: `\u{1F436}`, entity: `&#x1F436`, name: `Dog Face` },
      { emoji: `\u{1F415}`, entity: `&#x1F415`, name: `Dog` },
      { emoji: `\u{1F429}`, entity: `&#x1F429`, name: `Poodle` },
      { emoji: `\u{1F43A}`, entity: `&#x1F43A`, name: `Wolf Face` },
      { emoji: `\u{1F98A}`, entity: `&#x1F98A`, name: `Fox Face` },
      { emoji: `\u{1F431}`, entity: `&#x1F431`, name: `Cat Face` },
      { emoji: `\u{1F408}`, entity: `&#x1F408`, name: `Cat` },
      { emoji: `\u{1F981}`, entity: `&#x1F981`, name: `Lion Face` },
      { emoji: `\u{1F42F}`, entity: `&#x1F42F`, name: `Tiger Face` },
      { emoji: `\u{1F405}`, entity: `&#x1F405`, name: `Tiger` },
      { emoji: `\u{1F406}`, entity: `&#x1F406`, name: `Leopard` },
      { emoji: `\u{1F434}`, entity: `&#x1F434`, name: `Horse Face` },
      { emoji: `\u{1F40E}`, entity: `&#x1F40E`, name: `Horse` },
      { emoji: `\u{1F98C}`, entity: `&#x1F98C`, name: `Deer` },
      { emoji: `\u{1F984}`, entity: `&#x1F984`, name: `Unicorn Face` },
      { emoji: `\u{1F42E}`, entity: `&#x1F42E`, name: `Cow Face` },
      { emoji: `\u{1F402}`, entity: `&#x1F402`, name: `Ox` },
      { emoji: `\u{1F403}`, entity: `&#x1F403`, name: `Water Buffalo` },
      { emoji: `\u{1F404}`, entity: `&#x1F404`, name: `Cow` },
      { emoji: `\u{1F437}`, entity: `&#x1F437`, name: `Pig Face` },
      { emoji: `\u{1F416}`, entity: `&#x1F416`, name: `Pig` },
      { emoji: `\u{1F417}`, entity: `&#x1F417`, name: `Boar` },
      { emoji: `\u{1F43D}`, entity: `&#x1F43D`, name: `Pig Nose` },
      { emoji: `\u{1F40F}`, entity: `&#x1F40F`, name: `Ram` },
      { emoji: `\u{1F411}`, entity: `&#x1F411`, name: `Sheep` },
      { emoji: `\u{1F410}`, entity: `&#x1F410`, name: `Goat` },
      { emoji: `\u{1F42A}`, entity: `&#x1F42A`, name: `Camel` },
      { emoji: `\u{1F42B}`, entity: `&#x1F42B`, name: `Two-Hump Camel` },
      { emoji: `\u{1F418}`, entity: `&#x1F418`, name: `Elephant` },
      { emoji: `\u{1F98F}`, entity: `&#x1F98F`, name: `Rhinoceros` },
      { emoji: `\u{1F42D}`, entity: `&#x1F42D`, name: `Mouse Face` },
      { emoji: `\u{1F401}`, entity: `&#x1F401`, name: `Mouse` },
      { emoji: `\u{1F400}`, entity: `&#x1F400`, name: `Rat` },
      { emoji: `\u{1F439}`, entity: `&#x1F439`, name: `Hamster Face` },
      { emoji: `\u{1F430}`, entity: `&#x1F430`, name: `Rabbit Face` },
      { emoji: `\u{1F407}`, entity: `&#x1F407`, name: `Rabbit` },
      { emoji: `\u{1F43F}`, entity: `&#x1F43F`, name: `Chipmunk` },
      { emoji: `\u{1F987}`, entity: `&#x1F987`, name: `Bat` },
      { emoji: `\u{1F43B}`, entity: `&#x1F43B`, name: `Bear Face` },
      { emoji: `\u{1F428}`, entity: `&#x1F428`, name: `Koala` },
      { emoji: `\u{1F43C}`, entity: `&#x1F43C`, name: `Panda Face` },
      { emoji: `\u{1F43E}`, entity: `&#x1F43E`, name: `Paw Prints` },
      { emoji: `\u{1F983}`, entity: `&#x1F983`, name: `Turkey` },
      { emoji: `\u{1F414}`, entity: `&#x1F414`, name: `Chicken` },
      { emoji: `\u{1F413}`, entity: `&#x1F413`, name: `Rooster` },
      { emoji: `\u{1F423}`, entity: `&#x1F423`, name: `Hatching Chick` },
      { emoji: `\u{1F424}`, entity: `&#x1F424`, name: `Baby Chick` },
      { emoji: `\u{1F425}`, entity: `&#x1F425`, name: `Front-Facing Baby Chick` },
      { emoji: `\u{1F426}`, entity: `&#x1F426`, name: `Bird` },
      { emoji: `\u{1F427}`, entity: `&#x1F427`, name: `Penguin` },
      { emoji: `\u{1F54A}`, entity: `&#x1F54A`, name: `Dove` },
      { emoji: `\u{1F985}`, entity: `&#x1F985`, name: `Eagle` },
      { emoji: `\u{1F986}`, entity: `&#x1F986`, name: `Duck` },
      { emoji: `\u{1F989}`, entity: `&#x1F989`, name: `Owl` },
      { emoji: `\u{1F438}`, entity: `&#x1F438`, name: `Frog Face` },
      { emoji: `\u{1F40A}`, entity: `&#x1F40A`, name: `Crocodile` },
      { emoji: `\u{1F422}`, entity: `&#x1F422`, name: `Turtle` },
      { emoji: `\u{1F98E}`, entity: `&#x1F98E`, name: `Lizard` },
      { emoji: `\u{1F40D}`, entity: `&#x1F40D`, name: `Snake` },
      { emoji: `\u{1F432}`, entity: `&#x1F432`, name: `Dragon Face` },
      { emoji: `\u{1F409}`, entity: `&#x1F409`, name: `Dragon` },
      { emoji: `\u{1F433}`, entity: `&#x1F433`, name: `Spouting Whale` },
      { emoji: `\u{1F40B}`, entity: `&#x1F40B`, name: `Whale` },
      { emoji: `\u{1F42C}`, entity: `&#x1F42C`, name: `Dolphin` },
      { emoji: `\u{1F41F}`, entity: `&#x1F41F`, name: `Fish` },
      { emoji: `\u{1F420}`, entity: `&#x1F420`, name: `Tropical Fish` },
      { emoji: `\u{1F421}`, entity: `&#x1F421`, name: `Blowfish` },
      { emoji: `\u{1F988}`, entity: `&#x1F988`, name: `Shark` },
      { emoji: `\u{1F419}`, entity: `&#x1F419`, name: `Octopus` },
      { emoji: `\u{1F41A}`, entity: `&#x1F41A`, name: `Spiral Shell` },
      { emoji: `\u{1F980}`, entity: `&#x1F980`, name: `Crab` },
      { emoji: `\u{1F990}`, entity: `&#x1F990`, name: `Shrimp` },
      { emoji: `\u{1F991}`, entity: `&#x1F991`, name: `Squid` },
      { emoji: `\u{1F98B}`, entity: `&#x1F98B`, name: `Butterfly` },
      { emoji: `\u{1F40C}`, entity: `&#x1F40C`, name: `Snail` },
      { emoji: `\u{1F41B}`, entity: `&#x1F41B`, name: `Bug` },
      { emoji: `\u{1F41C}`, entity: `&#x1F41C`, name: `Ant` },
      { emoji: `\u{1F41D}`, entity: `&#x1F41D`, name: `Honeybee` },
      { emoji: `\u{1F41E}`, entity: `&#x1F41E`, name: `Lady Beetle` },
      { emoji: `\u{1F577}`, entity: `&#x1F577`, name: `Spider` },
      { emoji: `\u{1F578}`, entity: `&#x1F578`, name: `Spider Web` },
      { emoji: `\u{1F982}`, entity: `&#x1F982`, name: `Scorpion` },
      { emoji: `\u{1F490}`, entity: `&#x1F490`, name: `Bouquet` },
      { emoji: `\u{1F338}`, entity: `&#x1F338`, name: `Cherry Blossom` },
      { emoji: `\u{1F4AE}`, entity: `&#x1F4AE`, name: `White Flower` },
      { emoji: `\u{1F3F5}`, entity: `&#x1F3F5`, name: `Rosette` },
      { emoji: `\u{1F339}`, entity: `&#x1F339`, name: `Rose` },
      { emoji: `\u{1F940}`, entity: `&#x1F940`, name: `Wilted Flower` },
      { emoji: `\u{1F33A}`, entity: `&#x1F33A`, name: `Hibiscus` },
      { emoji: `\u{1F33B}`, entity: `&#x1F33B`, name: `Sunflower` },
      { emoji: `\u{1F33C}`, entity: `&#x1F33C`, name: `Blossom` },
      { emoji: `\u{1F337}`, entity: `&#x1F337`, name: `Tulip` },
      { emoji: `\u{1F331}`, entity: `&#x1F331`, name: `Seedling` },
      { emoji: `\u{1F332}`, entity: `&#x1F332`, name: `Evergreen Tree` },
      { emoji: `\u{1F333}`, entity: `&#x1F333`, name: `Deciduous Tree` },
      { emoji: `\u{1F334}`, entity: `&#x1F334`, name: `Palm Tree` },
      { emoji: `\u{1F335}`, entity: `&#x1F335`, name: `Cactus` },
      { emoji: `\u{1F33E}`, entity: `&#x1F33E`, name: `Sheaf Of Rice` },
      { emoji: `\u{1F33F}`, entity: `&#x1F33F`, name: `Herb` },
      { emoji: `\u{2618}`, entity: `&#x2618`, name: `Shamrock` },
      { emoji: `\u{1F340}`, entity: `&#x1F340`, name: `Four Leaf Clover` },
      { emoji: `\u{1F341}`, entity: `&#x1F341`, name: `Maple Leaf` },
      { emoji: `\u{1F342}`, entity: `&#x1F342`, name: `Fallen Leaf` },
      { emoji: `\u{1F343}`, entity: `&#x1F343`, name: `Leaf Fluttering In Wind` },
      { emoji: `\u{1F347}`, entity: `&#x1F347`, name: `Grapes` },
      { emoji: `\u{1F348}`, entity: `&#x1F348`, name: `Melon` },
      { emoji: `\u{1F349}`, entity: `&#x1F349`, name: `Watermelon` },
      { emoji: `\u{1F34A}`, entity: `&#x1F34A`, name: `Tangerine` },
      { emoji: `\u{1F34B}`, entity: `&#x1F34B`, name: `Lemon` },
      { emoji: `\u{1F34C}`, entity: `&#x1F34C`, name: `Banana` },
      { emoji: `\u{1F34D}`, entity: `&#x1F34D`, name: `Pineapple` },
      { emoji: `\u{1F34E}`, entity: `&#x1F34E`, name: `Red Apple` },
      { emoji: `\u{1F34F}`, entity: `&#x1F34F`, name: `Green Apple` },
      { emoji: `\u{1F350}`, entity: `&#x1F350`, name: `Pear` },
      { emoji: `\u{1F351}`, entity: `&#x1F351`, name: `Peach` },
      { emoji: `\u{1F352}`, entity: `&#x1F352`, name: `Cherries` },
      { emoji: `\u{1F353}`, entity: `&#x1F353`, name: `Strawberry` },
      { emoji: `\u{1F95D}`, entity: `&#x1F95D`, name: `Kiwi Fruit` },
      { emoji: `\u{1F345}`, entity: `&#x1F345`, name: `Tomato` },
      { emoji: `\u{1F951}`, entity: `&#x1F951`, name: `Avocado` },
      { emoji: `\u{1F346}`, entity: `&#x1F346`, name: `Eggplant` },
      { emoji: `\u{1F954}`, entity: `&#x1F954`, name: `Potato` },
      { emoji: `\u{1F955}`, entity: `&#x1F955`, name: `Carrot` },
      { emoji: `\u{1F33D}`, entity: `&#x1F33D`, name: `Ear Of Corn` },
      { emoji: `\u{1F336}`, entity: `&#x1F336`, name: `Hot Pepper` },
      { emoji: `\u{1F952}`, entity: `&#x1F952`, name: `Cucumber` },
      { emoji: `\u{1F344}`, entity: `&#x1F344`, name: `Mushroom` },
      { emoji: `\u{1F95C}`, entity: `&#x1F95C`, name: `Peanuts` },
      { emoji: `\u{1F330}`, entity: `&#x1F330`, name: `Chestnut` },
      { emoji: `\u{1F35E}`, entity: `&#x1F35E`, name: `Bread` },
      { emoji: `\u{1F950}`, entity: `&#x1F950`, name: `Croissant` },
      { emoji: `\u{1F956}`, entity: `&#x1F956`, name: `Baguette Bread` },
      { emoji: `\u{1F95E}`, entity: `&#x1F95E`, name: `Pancakes` },
      { emoji: `\u{1F9C0}`, entity: `&#x1F9C0`, name: `Cheese Wedge` },
      { emoji: `\u{1F356}`, entity: `&#x1F356`, name: `Meat On Bone` },
      { emoji: `\u{1F357}`, entity: `&#x1F357`, name: `Poultry Leg` },
      { emoji: `\u{1F953}`, entity: `&#x1F953`, name: `Bacon` },
      { emoji: `\u{1F354}`, entity: `&#x1F354`, name: `Hamburger` },
      { emoji: `\u{1F35F}`, entity: `&#x1F35F`, name: `French Fries` },
      { emoji: `\u{1F355}`, entity: `&#x1F355`, name: `Pizza` },
      { emoji: `\u{1F32D}`, entity: `&#x1F32D`, name: `Hot Dog` },
      { emoji: `\u{1F32E}`, entity: `&#x1F32E`, name: `Taco` },
      { emoji: `\u{1F32F}`, entity: `&#x1F32F`, name: `Burrito` },
      { emoji: `\u{1F959}`, entity: `&#x1F959`, name: `Stuffed Flatbread` },
      { emoji: `\u{1F95A}`, entity: `&#x1F95A`, name: `Egg` },
      { emoji: `\u{1F373}`, entity: `&#x1F373`, name: `Cooking` },
      { emoji: `\u{1F958}`, entity: `&#x1F958`, name: `Shallow Pan Of Food` },
      { emoji: `\u{1F372}`, entity: `&#x1F372`, name: `Pot Of Food` },
      { emoji: `\u{1F957}`, entity: `&#x1F957`, name: `Green Salad` },
      { emoji: `\u{1F37F}`, entity: `&#x1F37F`, name: `Popcorn` },
      { emoji: `\u{1F371}`, entity: `&#x1F371`, name: `Bento Box` },
      { emoji: `\u{1F358}`, entity: `&#x1F358`, name: `Rice Cracker` },
      { emoji: `\u{1F359}`, entity: `&#x1F359`, name: `Rice Ball` },
      { emoji: `\u{1F35A}`, entity: `&#x1F35A`, name: `Cooked Rice` },
      { emoji: `\u{1F35B}`, entity: `&#x1F35B`, name: `Curry Rice` },
      { emoji: `\u{1F35C}`, entity: `&#x1F35C`, name: `Steaming Bowl` },
      { emoji: `\u{1F35D}`, entity: `&#x1F35D`, name: `Spaghetti` },
      { emoji: `\u{1F360}`, entity: `&#x1F360`, name: `Roasted Sweet Potato` },
      { emoji: `\u{1F362}`, entity: `&#x1F362`, name: `Oden` },
      { emoji: `\u{1F363}`, entity: `&#x1F363`, name: `Sushi` },
      { emoji: `\u{1F364}`, entity: `&#x1F364`, name: `Fried Shrimp` },
      { emoji: `\u{1F365}`, entity: `&#x1F365`, name: `Fish Cake With Swirl` },
      { emoji: `\u{1F361}`, entity: `&#x1F361`, name: `Dango` },
      { emoji: `\u{1F366}`, entity: `&#x1F366`, name: `Soft Ice Cream` },
      { emoji: `\u{1F367}`, entity: `&#x1F367`, name: `Shaved Ice` },
      { emoji: `\u{1F368}`, entity: `&#x1F368`, name: `Ice Cream` },
      { emoji: `\u{1F369}`, entity: `&#x1F369`, name: `Doughnut` },
      { emoji: `\u{1F36A}`, entity: `&#x1F36A`, name: `Cookie` },
      { emoji: `\u{1F382}`, entity: `&#x1F382`, name: `Birthday Cake` },
      { emoji: `\u{1F370}`, entity: `&#x1F370`, name: `Shortcake` },
      { emoji: `\u{1F36B}`, entity: `&#x1F36B`, name: `Chocolate Bar` },
      { emoji: `\u{1F36C}`, entity: `&#x1F36C`, name: `Candy` },
      { emoji: `\u{1F36D}`, entity: `&#x1F36D`, name: `Lollipop` },
      { emoji: `\u{1F36E}`, entity: `&#x1F36E`, name: `Custard` },
      { emoji: `\u{1F36F}`, entity: `&#x1F36F`, name: `Honey Pot` },
      { emoji: `\u{1F37C}`, entity: `&#x1F37C`, name: `Baby Bottle` },
      { emoji: `\u{1F95B}`, entity: `&#x1F95B`, name: `Glass Of Milk` },
      { emoji: `\u{2615}`, entity: `&#x2615`, name: `Hot Beverage` },
      { emoji: `\u{1F375}`, entity: `&#x1F375`, name: `Teacup Without Handle` },
      { emoji: `\u{1F376}`, entity: `&#x1F376`, name: `Sake` },
      { emoji: `\u{1F37E}`, entity: `&#x1F37E`, name: `Bottle With Popping Cork` },
      { emoji: `\u{1F377}`, entity: `&#x1F377`, name: `Wine Glass` },
      { emoji: `\u{1F378}`, entity: `&#x1F378`, name: `Cocktail Glass` },
      { emoji: `\u{1F379}`, entity: `&#x1F379`, name: `Tropical Drink` },
      { emoji: `\u{1F37A}`, entity: `&#x1F37A`, name: `Beer Mug` },
      { emoji: `\u{1F37B}`, entity: `&#x1F37B`, name: `Clinking Beer Mugs` },
      { emoji: `\u{1F942}`, entity: `&#x1F942`, name: `Clinking Glasses` },
      { emoji: `\u{1F943}`, entity: `&#x1F943`, name: `Tumbler Glass` },
      { emoji: `\u{1F37D}`, entity: `&#x1F37D`, name: `Fork And Knife With Plate` },
      { emoji: `\u{1F374}`, entity: `&#x1F374`, name: `Fork And Knife` },
      { emoji: `\u{1F944}`, entity: `&#x1F944`, name: `Spoon` },
      { emoji: `\u{1F52A}`, entity: `&#x1F52A`, name: `Kitchen Knife` },
      { emoji: `\u{1F3FA}`, entity: `&#x1F3FA`, name: `Amphora` },
      { emoji: `\u{1F30D}`, entity: `&#x1F30D`, name: `Globe Showing Europe-Africa` },
      { emoji: `\u{1F30E}`, entity: `&#x1F30E`, name: `Globe Showing Americas` },
      { emoji: `\u{1F30F}`, entity: `&#x1F30F`, name: `Globe Showing Asia-Australia` },
      { emoji: `\u{1F310}`, entity: `&#x1F310`, name: `Globe With Meridians` },
      { emoji: `\u{1F5FA}`, entity: `&#x1F5FA`, name: `World Map` },
      { emoji: `\u{1F5FE}`, entity: `&#x1F5FE`, name: `Map Of Japan` },
      { emoji: `\u{1F3D4}`, entity: `&#x1F3D4`, name: `Snow-Capped Mountain` },
      { emoji: `\u{26F0}`, entity: `&#x26F0`, name: `Mountain` },
      { emoji: `\u{1F30B}`, entity: `&#x1F30B`, name: `Volcano` },
      { emoji: `\u{1F5FB}`, entity: `&#x1F5FB`, name: `Mount Fuji` },
      { emoji: `\u{1F3D5}`, entity: `&#x1F3D5`, name: `Camping` },
      { emoji: `\u{1F3D6}`, entity: `&#x1F3D6`, name: `Beach With Umbrella` },
      { emoji: `\u{1F3DC}`, entity: `&#x1F3DC`, name: `Desert` },
      { emoji: `\u{1F3DD}`, entity: `&#x1F3DD`, name: `Desert Island` },
      { emoji: `\u{1F3DE}`, entity: `&#x1F3DE`, name: `National Park` },
      { emoji: `\u{1F3DF}`, entity: `&#x1F3DF`, name: `Stadium` },
      { emoji: `\u{1F3DB}`, entity: `&#x1F3DB`, name: `Classical Building` },
      { emoji: `\u{1F3D7}`, entity: `&#x1F3D7`, name: `Building Construction` },
      { emoji: `\u{1F3D8}`, entity: `&#x1F3D8`, name: `House` },
      { emoji: `\u{1F3D9}`, entity: `&#x1F3D9`, name: `Cityscape` },
      { emoji: `\u{1F3DA}`, entity: `&#x1F3DA`, name: `Derelict House` },
      { emoji: `\u{1F3E0}`, entity: `&#x1F3E0`, name: `House` },
      { emoji: `\u{1F3E1}`, entity: `&#x1F3E1`, name: `House With Garden` },
      { emoji: `\u{1F3E2}`, entity: `&#x1F3E2`, name: `Office Building` },
      { emoji: `\u{1F3E3}`, entity: `&#x1F3E3`, name: `Japanese Post Office` },
      { emoji: `\u{1F3E4}`, entity: `&#x1F3E4`, name: `Post Office` },
      { emoji: `\u{1F3E5}`, entity: `&#x1F3E5`, name: `Hospital` },
      { emoji: `\u{1F3E6}`, entity: `&#x1F3E6`, name: `Bank` },
      { emoji: `\u{1F3E8}`, entity: `&#x1F3E8`, name: `Hotel` },
      { emoji: `\u{1F3E9}`, entity: `&#x1F3E9`, name: `Love Hotel` },
      { emoji: `\u{1F3EA}`, entity: `&#x1F3EA`, name: `Convenience Store` },
      { emoji: `\u{1F3EB}`, entity: `&#x1F3EB`, name: `School` },
      { emoji: `\u{1F3EC}`, entity: `&#x1F3EC`, name: `Department Store` },
      { emoji: `\u{1F3ED}`, entity: `&#x1F3ED`, name: `Factory` },
      { emoji: `\u{1F3EF}`, entity: `&#x1F3EF`, name: `Japanese Castle` },
      { emoji: `\u{1F3F0}`, entity: `&#x1F3F0`, name: `Castle` },
      { emoji: `\u{1F492}`, entity: `&#x1F492`, name: `Wedding` },
      { emoji: `\u{1F5FC}`, entity: `&#x1F5FC`, name: `Tokyo Tower` },
      { emoji: `\u{1F5FD}`, entity: `&#x1F5FD`, name: `Statue Of Liberty` },
      { emoji: `\u{26EA}`, entity: `&#x26EA`, name: `Church` },
      { emoji: `\u{1F54C}`, entity: `&#x1F54C`, name: `Mosque` },
      { emoji: `\u{1F54D}`, entity: `&#x1F54D`, name: `Synagogue` },
      { emoji: `\u{26E9}`, entity: `&#x26E9`, name: `Shinto Shrine` },
      { emoji: `\u{1F54B}`, entity: `&#x1F54B`, name: `Kaaba` },
      { emoji: `\u{26F2}`, entity: `&#x26F2`, name: `Fountain` },
      { emoji: `\u{26FA}`, entity: `&#x26FA`, name: `Tent` },
      { emoji: `\u{1F301}`, entity: `&#x1F301`, name: `Foggy` },
      { emoji: `\u{1F303}`, entity: `&#x1F303`, name: `Night With Stars` },
      { emoji: `\u{1F304}`, entity: `&#x1F304`, name: `Sunrise Over Mountains` },
      { emoji: `\u{1F305}`, entity: `&#x1F305`, name: `Sunrise` },
      { emoji: `\u{1F306}`, entity: `&#x1F306`, name: `Cityscape At Dusk` },
      { emoji: `\u{1F307}`, entity: `&#x1F307`, name: `Sunset` },
      { emoji: `\u{1F309}`, entity: `&#x1F309`, name: `Bridge At Night` },
      { emoji: `\u{2668}`, entity: `&#x2668`, name: `Hot Springs` },
      { emoji: `\u{1F30C}`, entity: `&#x1F30C`, name: `Milky Way` },
      { emoji: `\u{1F3A0}`, entity: `&#x1F3A0`, name: `Carousel Horse` },
      { emoji: `\u{1F3A1}`, entity: `&#x1F3A1`, name: `Ferris Wheel` },
      { emoji: `\u{1F3A2}`, entity: `&#x1F3A2`, name: `Roller Coaster` },
      { emoji: `\u{1F488}`, entity: `&#x1F488`, name: `Barber Pole` },
      { emoji: `\u{1F3AA}`, entity: `&#x1F3AA`, name: `Circus Tent` },
      { emoji: `\u{1F3AD}`, entity: `&#x1F3AD`, name: `Performing Arts` },
      { emoji: `\u{1F5BC}`, entity: `&#x1F5BC`, name: `Framed Picture` },
      { emoji: `\u{1F3A8}`, entity: `&#x1F3A8`, name: `Artist Palette` },
      { emoji: `\u{1F3B0}`, entity: `&#x1F3B0`, name: `Slot Machine` },
      { emoji: `\u{1F682}`, entity: `&#x1F682`, name: `Locomotive` },
      { emoji: `\u{1F683}`, entity: `&#x1F683`, name: `Railway Car` },
      { emoji: `\u{1F684}`, entity: `&#x1F684`, name: `High-Speed Train` },
      { emoji: `\u{1F685}`, entity: `&#x1F685`, name: `High-Speed Train With Bullet Nose` },
      { emoji: `\u{1F686}`, entity: `&#x1F686`, name: `Train` },
      { emoji: `\u{1F687}`, entity: `&#x1F687`, name: `Metro` },
      { emoji: `\u{1F688}`, entity: `&#x1F688`, name: `Light Rail` },
      { emoji: `\u{1F689}`, entity: `&#x1F689`, name: `Station` },
      { emoji: `\u{1F68A}`, entity: `&#x1F68A`, name: `Tram` },
      { emoji: `\u{1F69D}`, entity: `&#x1F69D`, name: `Monorail` },
      { emoji: `\u{1F69E}`, entity: `&#x1F69E`, name: `Mountain Railway` },
      { emoji: `\u{1F68B}`, entity: `&#x1F68B`, name: `Tram Car` },
      { emoji: `\u{1F68C}`, entity: `&#x1F68C`, name: `Bus` },
      { emoji: `\u{1F68D}`, entity: `&#x1F68D`, name: `Oncoming Bus` },
      { emoji: `\u{1F68E}`, entity: `&#x1F68E`, name: `Trolleybus` },
      { emoji: `\u{1F690}`, entity: `&#x1F690`, name: `Minibus` },
      { emoji: `\u{1F691}`, entity: `&#x1F691`, name: `Ambulance` },
      { emoji: `\u{1F692}`, entity: `&#x1F692`, name: `Fire Engine` },
      { emoji: `\u{1F693}`, entity: `&#x1F693`, name: `Police Car` },
      { emoji: `\u{1F694}`, entity: `&#x1F694`, name: `Oncoming Police Car` },
      { emoji: `\u{1F695}`, entity: `&#x1F695`, name: `Taxi` },
      { emoji: `\u{1F696}`, entity: `&#x1F696`, name: `Oncoming Taxi` },
      { emoji: `\u{1F697}`, entity: `&#x1F697`, name: `Automobile` },
      { emoji: `\u{1F698}`, entity: `&#x1F698`, name: `Oncoming Automobile` },
      { emoji: `\u{1F699}`, entity: `&#x1F699`, name: `Sport Utility Vehicle` },
      { emoji: `\u{1F69A}`, entity: `&#x1F69A`, name: `Delivery Truck` },
      { emoji: `\u{1F69B}`, entity: `&#x1F69B`, name: `Articulated Lorry` },
      { emoji: `\u{1F69C}`, entity: `&#x1F69C`, name: `Tractor` },
      { emoji: `\u{1F6B2}`, entity: `&#x1F6B2`, name: `Bicycle` },
      { emoji: `\u{1F6F4}`, entity: `&#x1F6F4`, name: `Kick Scooter` },
      { emoji: `\u{1F6F5}`, entity: `&#x1F6F5`, name: `Motor Scooter` },
      { emoji: `\u{1F68F}`, entity: `&#x1F68F`, name: `Bus Stop` },
      { emoji: `\u{1F6E3}`, entity: `&#x1F6E3`, name: `Motorway` },
      { emoji: `\u{1F6E4}`, entity: `&#x1F6E4`, name: `Railway Track` },
      { emoji: `\u{26FD}`, entity: `&#x26FD`, name: `Fuel Pump` },
      { emoji: `\u{1F6A8}`, entity: `&#x1F6A8`, name: `Police Car Light` },
      { emoji: `\u{1F6A5}`, entity: `&#x1F6A5`, name: `Horizontal Traffic Light` },
      { emoji: `\u{1F6A6}`, entity: `&#x1F6A6`, name: `Vertical Traffic Light` },
      { emoji: `\u{1F6A7}`, entity: `&#x1F6A7`, name: `Construction` },
      { emoji: `\u{1F6D1}`, entity: `&#x1F6D1`, name: `Stop Sign` },
      { emoji: `\u{2693}`, entity: `&#x2693`, name: `Anchor` },
      { emoji: `\u{26F5}`, entity: `&#x26F5`, name: `Sailboat` },
      { emoji: `\u{1F6F6}`, entity: `&#x1F6F6`, name: `Canoe` },
      { emoji: `\u{1F6A4}`, entity: `&#x1F6A4`, name: `Speedboat` },
      { emoji: `\u{1F6F3}`, entity: `&#x1F6F3`, name: `Passenger Ship` },
      { emoji: `\u{26F4}`, entity: `&#x26F4`, name: `Ferry` },
      { emoji: `\u{1F6E5}`, entity: `&#x1F6E5`, name: `Motor Boat` },
      { emoji: `\u{1F6A2}`, entity: `&#x1F6A2`, name: `Ship` },
      { emoji: `\u{2708}`, entity: `&#x2708`, name: `Airplane` },
      { emoji: `\u{1F6E9}`, entity: `&#x1F6E9`, name: `Small Airplane` },
      { emoji: `\u{1F6EB}`, entity: `&#x1F6EB`, name: `Airplane Departure` },
      { emoji: `\u{1F6EC}`, entity: `&#x1F6EC`, name: `Airplane Arrival` },
      { emoji: `\u{1F4BA}`, entity: `&#x1F4BA`, name: `Seat` },
      { emoji: `\u{1F681}`, entity: `&#x1F681`, name: `Helicopter` },
      { emoji: `\u{1F69F}`, entity: `&#x1F69F`, name: `Suspension Railway` },
      { emoji: `\u{1F6A0}`, entity: `&#x1F6A0`, name: `Mountain Cableway` },
      { emoji: `\u{1F6A1}`, entity: `&#x1F6A1`, name: `Aerial Tramway` },
      { emoji: `\u{1F680}`, entity: `&#x1F680`, name: `Rocket` },
      { emoji: `\u{1F6F0}`, entity: `&#x1F6F0`, name: `Satellite` },
      { emoji: `\u{1F6CE}`, entity: `&#x1F6CE`, name: `Bellhop Bell` },
      { emoji: `\u{1F6AA}`, entity: `&#x1F6AA`, name: `Door` },
      { emoji: `\u{1F6CC}`, entity: `&#x1F6CC`, name: `Person In Bed` },
      { emoji: `\u{1F6CC}\u{1F3FB}`, entity: `&#x1F6CC&#x1F3FB`, name: `Person In Bed: Light Skin Tone` },
      { emoji: `\u{1F6CC}\u{1F3FC}`, entity: `&#x1F6CC&#x1F3FC`, name: `Person In Bed: Medium-Light Skin Tone` },
      { emoji: `\u{1F6CC}\u{1F3FD}`, entity: `&#x1F6CC&#x1F3FD`, name: `Person In Bed: Medium Skin Tone` },
      { emoji: `\u{1F6CC}\u{1F3FE}`, entity: `&#x1F6CC&#x1F3FE`, name: `Person In Bed: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6CC}\u{1F3FF}`, entity: `&#x1F6CC&#x1F3FF`, name: `Person In Bed: Dark Skin Tone` },
      { emoji: `\u{1F6CF}`, entity: `&#x1F6CF`, name: `Bed` },
      { emoji: `\u{1F6CB}`, entity: `&#x1F6CB`, name: `Couch And Lamp` },
      { emoji: `\u{1F6BD}`, entity: `&#x1F6BD`, name: `Toilet` },
      { emoji: `\u{1F6BF}`, entity: `&#x1F6BF`, name: `Shower` },
      { emoji: `\u{1F6C0}`, entity: `&#x1F6C0`, name: `Person Taking Bath` },
      { emoji: `\u{1F6C0}\u{1F3FB}`, entity: `&#x1F6C0&#x1F3FB`, name: `Person Taking Bath: Light Skin Tone` },
      { emoji: `\u{1F6C0}\u{1F3FC}`, entity: `&#x1F6C0&#x1F3FC`, name: `Person Taking Bath: Medium-Light Skin Tone` },
      { emoji: `\u{1F6C0}\u{1F3FD}`, entity: `&#x1F6C0&#x1F3FD`, name: `Person Taking Bath: Medium Skin Tone` },
      { emoji: `\u{1F6C0}\u{1F3FE}`, entity: `&#x1F6C0&#x1F3FE`, name: `Person Taking Bath: Medium-Dark Skin Tone` },
      { emoji: `\u{1F6C0}\u{1F3FF}`, entity: `&#x1F6C0&#x1F3FF`, name: `Person Taking Bath: Dark Skin Tone` },
      { emoji: `\u{1F6C1}`, entity: `&#x1F6C1`, name: `Bathtub` },
      { emoji: `\u{231B}`, entity: `&#x231B`, name: `Hourglass` },
      { emoji: `\u{23F3}`, entity: `&#x23F3`, name: `Hourglass With Flowing Sand` },
      { emoji: `\u{231A}`, entity: `&#x231A`, name: `Watch` },
      { emoji: `\u{23F0}`, entity: `&#x23F0`, name: `Alarm Clock` },
      { emoji: `\u{23F1}`, entity: `&#x23F1`, name: `Stopwatch` },
      { emoji: `\u{23F2}`, entity: `&#x23F2`, name: `Timer Clock` },
      { emoji: `\u{1F570}`, entity: `&#x1F570`, name: `Mantelpiece Clock` },
      { emoji: `\u{1F55B}`, entity: `&#x1F55B`, name: `Twelve O’clock` },
      { emoji: `\u{1F567}`, entity: `&#x1F567`, name: `Twelve-Thirty` },
      { emoji: `\u{1F550}`, entity: `&#x1F550`, name: `One O’clock` },
      { emoji: `\u{1F55C}`, entity: `&#x1F55C`, name: `One-Thirty` },
      { emoji: `\u{1F551}`, entity: `&#x1F551`, name: `Two O’clock` },
      { emoji: `\u{1F55D}`, entity: `&#x1F55D`, name: `Two-Thirty` },
      { emoji: `\u{1F552}`, entity: `&#x1F552`, name: `Three O’clock` },
      { emoji: `\u{1F55E}`, entity: `&#x1F55E`, name: `Three-Thirty` },
      { emoji: `\u{1F553}`, entity: `&#x1F553`, name: `Four O’clock` },
      { emoji: `\u{1F55F}`, entity: `&#x1F55F`, name: `Four-Thirty` },
      { emoji: `\u{1F554}`, entity: `&#x1F554`, name: `Five O’clock` },
      { emoji: `\u{1F560}`, entity: `&#x1F560`, name: `Five-Thirty` },
      { emoji: `\u{1F555}`, entity: `&#x1F555`, name: `Six O’clock` },
      { emoji: `\u{1F561}`, entity: `&#x1F561`, name: `Six-Thirty` },
      { emoji: `\u{1F556}`, entity: `&#x1F556`, name: `Seven O’clock` },
      { emoji: `\u{1F562}`, entity: `&#x1F562`, name: `Seven-Thirty` },
      { emoji: `\u{1F557}`, entity: `&#x1F557`, name: `Eight O’clock` },
      { emoji: `\u{1F563}`, entity: `&#x1F563`, name: `Eight-Thirty` },
      { emoji: `\u{1F558}`, entity: `&#x1F558`, name: `Nine O’clock` },
      { emoji: `\u{1F564}`, entity: `&#x1F564`, name: `Nine-Thirty` },
      { emoji: `\u{1F559}`, entity: `&#x1F559`, name: `Ten O’clock` },
      { emoji: `\u{1F565}`, entity: `&#x1F565`, name: `Ten-Thirty` },
      { emoji: `\u{1F55A}`, entity: `&#x1F55A`, name: `Eleven O’clock` },
      { emoji: `\u{1F566}`, entity: `&#x1F566`, name: `Eleven-Thirty` },
      { emoji: `\u{1F311}`, entity: `&#x1F311`, name: `New Moon` },
      { emoji: `\u{1F312}`, entity: `&#x1F312`, name: `Waxing Crescent Moon` },
      { emoji: `\u{1F313}`, entity: `&#x1F313`, name: `First Quarter Moon` },
      { emoji: `\u{1F314}`, entity: `&#x1F314`, name: `Waxing Gibbous Moon` },
      { emoji: `\u{1F315}`, entity: `&#x1F315`, name: `Full Moon` },
      { emoji: `\u{1F316}`, entity: `&#x1F316`, name: `Waning Gibbous Moon` },
      { emoji: `\u{1F317}`, entity: `&#x1F317`, name: `Last Quarter Moon` },
      { emoji: `\u{1F318}`, entity: `&#x1F318`, name: `Waning Crescent Moon` },
      { emoji: `\u{1F319}`, entity: `&#x1F319`, name: `Crescent Moon` },
      { emoji: `\u{1F31A}`, entity: `&#x1F31A`, name: `New Moon Face` },
      { emoji: `\u{1F31B}`, entity: `&#x1F31B`, name: `First Quarter Moon With Face` },
      { emoji: `\u{1F31C}`, entity: `&#x1F31C`, name: `Last Quarter Moon With Face` },
      { emoji: `\u{1F321}`, entity: `&#x1F321`, name: `Thermometer` },
      { emoji: `\u{2600}`, entity: `&#x2600`, name: `Sun` },
      { emoji: `\u{1F31D}`, entity: `&#x1F31D`, name: `Full Moon With Face` },
      { emoji: `\u{1F31E}`, entity: `&#x1F31E`, name: `Sun With Face` },
      { emoji: `\u{2B50}`, entity: `&#x2B50`, name: `White Medium Star` },
      { emoji: `\u{1F31F}`, entity: `&#x1F31F`, name: `Glowing Star` },
      { emoji: `\u{1F320}`, entity: `&#x1F320`, name: `Shooting Star` },
      { emoji: `\u{2601}`, entity: `&#x2601`, name: `Cloud` },
      { emoji: `\u{26C5}`, entity: `&#x26C5`, name: `Sun Behind Cloud` },
      { emoji: `\u{26C8}`, entity: `&#x26C8`, name: `Cloud With Lightning And Rain` },
      { emoji: `\u{1F324}`, entity: `&#x1F324`, name: `Sun Behind Small Cloud` },
      { emoji: `\u{1F325}`, entity: `&#x1F325`, name: `Sun Behind Large Cloud` },
      { emoji: `\u{1F326}`, entity: `&#x1F326`, name: `Sun Behind Rain Cloud` },
      { emoji: `\u{1F327}`, entity: `&#x1F327`, name: `Cloud With Rain` },
      { emoji: `\u{1F328}`, entity: `&#x1F328`, name: `Cloud With Snow` },
      { emoji: `\u{1F329}`, entity: `&#x1F329`, name: `Cloud With Lightning` },
      { emoji: `\u{1F32A}`, entity: `&#x1F32A`, name: `Tornado` },
      { emoji: `\u{1F32B}`, entity: `&#x1F32B`, name: `Fog` },
      { emoji: `\u{1F32C}`, entity: `&#x1F32C`, name: `Wind Face` },
      { emoji: `\u{1F300}`, entity: `&#x1F300`, name: `Cyclone` },
      { emoji: `\u{1F308}`, entity: `&#x1F308`, name: `Rainbow` },
      { emoji: `\u{1F302}`, entity: `&#x1F302`, name: `Closed Umbrella` },
      { emoji: `\u{2602}`, entity: `&#x2602`, name: `Umbrella` },
      { emoji: `\u{2614}`, entity: `&#x2614`, name: `Umbrella With Rain Drops` },
      { emoji: `\u{26F1}`, entity: `&#x26F1`, name: `Umbrella On Ground` },
      { emoji: `\u{26A1}`, entity: `&#x26A1`, name: `High Voltage` },
      { emoji: `\u{2744}`, entity: `&#x2744`, name: `Snowflake` },
      { emoji: `\u{2603}`, entity: `&#x2603`, name: `Snowman` },
      { emoji: `\u{26C4}`, entity: `&#x26C4`, name: `Snowman Without Snow` },
      { emoji: `\u{2604}`, entity: `&#x2604`, name: `Comet` },
      { emoji: `\u{1F525}`, entity: `&#x1F525`, name: `Fire` },
      { emoji: `\u{1F4A7}`, entity: `&#x1F4A7`, name: `Droplet` },
      { emoji: `\u{1F30A}`, entity: `&#x1F30A`, name: `Water Wave` },
      { emoji: `\u{1F383}`, entity: `&#x1F383`, name: `Jack-O-Lantern` },
      { emoji: `\u{1F384}`, entity: `&#x1F384`, name: `Christmas Tree` },
      { emoji: `\u{1F386}`, entity: `&#x1F386`, name: `Fireworks` },
      { emoji: `\u{1F387}`, entity: `&#x1F387`, name: `Sparkler` },
      { emoji: `\u{2728}`, entity: `&#x2728`, name: `Sparkles` },
      { emoji: `\u{1F388}`, entity: `&#x1F388`, name: `Balloon` },
      { emoji: `\u{1F389}`, entity: `&#x1F389`, name: `Party Popper` },
      { emoji: `\u{1F38A}`, entity: `&#x1F38A`, name: `Confetti Ball` },
      { emoji: `\u{1F38B}`, entity: `&#x1F38B`, name: `Tanabata Tree` },
      { emoji: `\u{1F38D}`, entity: `&#x1F38D`, name: `Pine Decoration` },
      { emoji: `\u{1F38E}`, entity: `&#x1F38E`, name: `Japanese Dolls` },
      { emoji: `\u{1F38F}`, entity: `&#x1F38F`, name: `Carp Streamer` },
      { emoji: `\u{1F390}`, entity: `&#x1F390`, name: `Wind Chime` },
      { emoji: `\u{1F391}`, entity: `&#x1F391`, name: `Moon Viewing Ceremony` },
      { emoji: `\u{1F380}`, entity: `&#x1F380`, name: `Ribbon` },
      { emoji: `\u{1F381}`, entity: `&#x1F381`, name: `Wrapped Gift` },
      { emoji: `\u{1F397}`, entity: `&#x1F397`, name: `Reminder Ribbon` },
      { emoji: `\u{1F39F}`, entity: `&#x1F39F`, name: `Admission Tickets` },
      { emoji: `\u{1F3AB}`, entity: `&#x1F3AB`, name: `Ticket` },
      { emoji: `\u{1F396}`, entity: `&#x1F396`, name: `Military Medal` },
      { emoji: `\u{1F3C6}`, entity: `&#x1F3C6`, name: `Trophy` },
      { emoji: `\u{1F3C5}`, entity: `&#x1F3C5`, name: `Sports Medal` },
      { emoji: `\u{1F947}`, entity: `&#x1F947`, name: `1st Place Medal` },
      { emoji: `\u{1F948}`, entity: `&#x1F948`, name: `2nd Place Medal` },
      { emoji: `\u{1F949}`, entity: `&#x1F949`, name: `3rd Place Medal` },
      { emoji: `\u{26BD}`, entity: `&#x26BD`, name: `Soccer Ball` },
      { emoji: `\u{26BE}`, entity: `&#x26BE`, name: `Baseball` },
      { emoji: `\u{1F3C0}`, entity: `&#x1F3C0`, name: `Basketball` },
      { emoji: `\u{1F3D0}`, entity: `&#x1F3D0`, name: `Volleyball` },
      { emoji: `\u{1F3C8}`, entity: `&#x1F3C8`, name: `American Football` },
      { emoji: `\u{1F3C9}`, entity: `&#x1F3C9`, name: `Rugby Football` },
      { emoji: `\u{1F3BE}`, entity: `&#x1F3BE`, name: `Tennis` },
      { emoji: `\u{1F3B1}`, entity: `&#x1F3B1`, name: `Pool 8 Ball` },
      { emoji: `\u{1F3B3}`, entity: `&#x1F3B3`, name: `Bowling` },
      { emoji: `\u{1F3CF}`, entity: `&#x1F3CF`, name: `Cricket` },
      { emoji: `\u{1F3D1}`, entity: `&#x1F3D1`, name: `Field Hockey` },
      { emoji: `\u{1F3D2}`, entity: `&#x1F3D2`, name: `Ice Hockey` },
      { emoji: `\u{1F3D3}`, entity: `&#x1F3D3`, name: `Ping Pong` },
      { emoji: `\u{1F3F8}`, entity: `&#x1F3F8`, name: `Badminton` },
      { emoji: `\u{1F94A}`, entity: `&#x1F94A`, name: `Boxing Glove` },
      { emoji: `\u{1F94B}`, entity: `&#x1F94B`, name: `Martial Arts Uniform` },
      { emoji: `\u{1F945}`, entity: `&#x1F945`, name: `Goal Net` },
      { emoji: `\u{1F3AF}`, entity: `&#x1F3AF`, name: `Direct Hit` },
      { emoji: `\u{26F3}`, entity: `&#x26F3`, name: `Flag In Hole` },
      { emoji: `\u{26F8}`, entity: `&#x26F8`, name: `Ice Skate` },
      { emoji: `\u{1F3A3}`, entity: `&#x1F3A3`, name: `Fishing Pole` },
      { emoji: `\u{1F3BD}`, entity: `&#x1F3BD`, name: `Running Shirt` },
      { emoji: `\u{1F3BF}`, entity: `&#x1F3BF`, name: `Skis` },
      { emoji: `\u{1F3AE}`, entity: `&#x1F3AE`, name: `Video Game` },
      { emoji: `\u{1F579}`, entity: `&#x1F579`, name: `Joystick` },
      { emoji: `\u{1F3B2}`, entity: `&#x1F3B2`, name: `Game Die` },
      { emoji: `\u{2660}`, entity: `&#x2660`, name: `Spade Suit` },
      { emoji: `\u{2665}`, entity: `&#x2665`, name: `Heart Suit` },
      { emoji: `\u{2666}`, entity: `&#x2666`, name: `Diamond Suit` },
      { emoji: `\u{2663}`, entity: `&#x2663`, name: `Club Suit` },
      { emoji: `\u{1F0CF}`, entity: `&#x1F0CF`, name: `Joker` },
      { emoji: `\u{1F004}`, entity: `&#x1F004`, name: `Mahjong Red Dragon` },
      { emoji: `\u{1F3B4}`, entity: `&#x1F3B4`, name: `Flower Playing Cards` },
      { emoji: `\u{1F507}`, entity: `&#x1F507`, name: `Muted Speaker` },
      { emoji: `\u{1F508}`, entity: `&#x1F508`, name: `Speaker Low Volume` },
      { emoji: `\u{1F509}`, entity: `&#x1F509`, name: `Speaker Medium Volume` },
      { emoji: `\u{1F50A}`, entity: `&#x1F50A`, name: `Speaker High Volume` },
      { emoji: `\u{1F4E2}`, entity: `&#x1F4E2`, name: `Loudspeaker` },
      { emoji: `\u{1F4E3}`, entity: `&#x1F4E3`, name: `Megaphone` },
      { emoji: `\u{1F4EF}`, entity: `&#x1F4EF`, name: `Postal Horn` },
      { emoji: `\u{1F514}`, entity: `&#x1F514`, name: `Bell` },
      { emoji: `\u{1F515}`, entity: `&#x1F515`, name: `Bell With Slash` },
      { emoji: `\u{1F3BC}`, entity: `&#x1F3BC`, name: `Musical Score` },
      { emoji: `\u{1F3B5}`, entity: `&#x1F3B5`, name: `Musical Note` },
      { emoji: `\u{1F3B6}`, entity: `&#x1F3B6`, name: `Musical Notes` },
      { emoji: `\u{1F399}`, entity: `&#x1F399`, name: `Studio Microphone` },
      { emoji: `\u{1F39A}`, entity: `&#x1F39A`, name: `Level Slider` },
      { emoji: `\u{1F39B}`, entity: `&#x1F39B`, name: `Control Knobs` },
      { emoji: `\u{1F3A4}`, entity: `&#x1F3A4`, name: `Microphone` },
      { emoji: `\u{1F3A7}`, entity: `&#x1F3A7`, name: `Headphone` },
      { emoji: `\u{1F4FB}`, entity: `&#x1F4FB`, name: `Radio` },
      { emoji: `\u{1F3B7}`, entity: `&#x1F3B7`, name: `Saxophone` },
      { emoji: `\u{1F3B8}`, entity: `&#x1F3B8`, name: `Guitar` },
      { emoji: `\u{1F3B9}`, entity: `&#x1F3B9`, name: `Musical Keyboard` },
      { emoji: `\u{1F3BA}`, entity: `&#x1F3BA`, name: `Trumpet` },
      { emoji: `\u{1F3BB}`, entity: `&#x1F3BB`, name: `Violin` },
      { emoji: `\u{1F941}`, entity: `&#x1F941`, name: `Drum` },
      { emoji: `\u{1F4F1}`, entity: `&#x1F4F1`, name: `Mobile Phone` },
      { emoji: `\u{1F4F2}`, entity: `&#x1F4F2`, name: `Mobile Phone With Arrow` },
      { emoji: `\u{260E}`, entity: `&#x260E`, name: `Telephone` },
      { emoji: `\u{1F4DE}`, entity: `&#x1F4DE`, name: `Telephone Receiver` },
      { emoji: `\u{1F4DF}`, entity: `&#x1F4DF`, name: `Pager` },
      { emoji: `\u{1F4E0}`, entity: `&#x1F4E0`, name: `Fax Machine` },
      { emoji: `\u{1F50B}`, entity: `&#x1F50B`, name: `Battery` },
      { emoji: `\u{1F50C}`, entity: `&#x1F50C`, name: `Electric Plug` },
      { emoji: `\u{1F4BB}`, entity: `&#x1F4BB`, name: `Laptop Computer` },
      { emoji: `\u{1F5A5}`, entity: `&#x1F5A5`, name: `Desktop Computer` },
      { emoji: `\u{1F5A8}`, entity: `&#x1F5A8`, name: `Printer` },
      { emoji: `\u{2328}`, entity: `&#x2328`, name: `Keyboard` },
      { emoji: `\u{1F5B1}`, entity: `&#x1F5B1`, name: `Computer Mouse` },
      { emoji: `\u{1F5B2}`, entity: `&#x1F5B2`, name: `Trackball` },
      { emoji: `\u{1F4BD}`, entity: `&#x1F4BD`, name: `Computer Disk` },
      { emoji: `\u{1F4BE}`, entity: `&#x1F4BE`, name: `Floppy Disk` },
      { emoji: `\u{1F4BF}`, entity: `&#x1F4BF`, name: `Optical Disk` },
      { emoji: `\u{1F4C0}`, entity: `&#x1F4C0`, name: `Dvd` },
      { emoji: `\u{1F3A5}`, entity: `&#x1F3A5`, name: `Movie Camera` },
      { emoji: `\u{1F39E}`, entity: `&#x1F39E`, name: `Film Frames` },
      { emoji: `\u{1F4FD}`, entity: `&#x1F4FD`, name: `Film Projector` },
      { emoji: `\u{1F3AC}`, entity: `&#x1F3AC`, name: `Clapper Board` },
      { emoji: `\u{1F4FA}`, entity: `&#x1F4FA`, name: `Television` },
      { emoji: `\u{1F4F7}`, entity: `&#x1F4F7`, name: `Camera` },
      { emoji: `\u{1F4F8}`, entity: `&#x1F4F8`, name: `Camera With Flash` },
      { emoji: `\u{1F4F9}`, entity: `&#x1F4F9`, name: `Video Camera` },
      { emoji: `\u{1F4FC}`, entity: `&#x1F4FC`, name: `Videocassette` },
      { emoji: `\u{1F50D}`, entity: `&#x1F50D`, name: `Left-Pointing Magnifying Glass` },
      { emoji: `\u{1F50E}`, entity: `&#x1F50E`, name: `Right-Pointing Magnifying Glass` },
      { emoji: `\u{1F52C}`, entity: `&#x1F52C`, name: `Microscope` },
      { emoji: `\u{1F52D}`, entity: `&#x1F52D`, name: `Telescope` },
      { emoji: `\u{1F4E1}`, entity: `&#x1F4E1`, name: `Satellite Antenna` },
      { emoji: `\u{1F56F}`, entity: `&#x1F56F`, name: `Candle` },
      { emoji: `\u{1F4A1}`, entity: `&#x1F4A1`, name: `Light Bulb` },
      { emoji: `\u{1F526}`, entity: `&#x1F526`, name: `Flashlight` },
      { emoji: `\u{1F3EE}`, entity: `&#x1F3EE`, name: `Red Paper Lantern` },
      { emoji: `\u{1F4D4}`, entity: `&#x1F4D4`, name: `Notebook With Decorative Cover` },
      { emoji: `\u{1F4D5}`, entity: `&#x1F4D5`, name: `Closed Book` },
      { emoji: `\u{1F4D6}`, entity: `&#x1F4D6`, name: `Open Book` },
      { emoji: `\u{1F4D7}`, entity: `&#x1F4D7`, name: `Green Book` },
      { emoji: `\u{1F4D8}`, entity: `&#x1F4D8`, name: `Blue Book` },
      { emoji: `\u{1F4D9}`, entity: `&#x1F4D9`, name: `Orange Book` },
      { emoji: `\u{1F4DA}`, entity: `&#x1F4DA`, name: `Books` },
      { emoji: `\u{1F4D3}`, entity: `&#x1F4D3`, name: `Notebook` },
      { emoji: `\u{1F4D2}`, entity: `&#x1F4D2`, name: `Ledger` },
      { emoji: `\u{1F4C3}`, entity: `&#x1F4C3`, name: `Page With Curl` },
      { emoji: `\u{1F4DC}`, entity: `&#x1F4DC`, name: `Scroll` },
      { emoji: `\u{1F4C4}`, entity: `&#x1F4C4`, name: `Page Facing Up` },
      { emoji: `\u{1F4F0}`, entity: `&#x1F4F0`, name: `Newspaper` },
      { emoji: `\u{1F5DE}`, entity: `&#x1F5DE`, name: `Rolled-Up Newspaper` },
      { emoji: `\u{1F4D1}`, entity: `&#x1F4D1`, name: `Bookmark Tabs` },
      { emoji: `\u{1F516}`, entity: `&#x1F516`, name: `Bookmark` },
      { emoji: `\u{1F3F7}`, entity: `&#x1F3F7`, name: `Label` },
      { emoji: `\u{1F4B0}`, entity: `&#x1F4B0`, name: `Money Bag` },
      { emoji: `\u{1F4B4}`, entity: `&#x1F4B4`, name: `Yen Banknote` },
      { emoji: `\u{1F4B5}`, entity: `&#x1F4B5`, name: `Dollar Banknote` },
      { emoji: `\u{1F4B6}`, entity: `&#x1F4B6`, name: `Euro Banknote` },
      { emoji: `\u{1F4B7}`, entity: `&#x1F4B7`, name: `Pound Banknote` },
      { emoji: `\u{1F4B8}`, entity: `&#x1F4B8`, name: `Money With Wings` },
      { emoji: `\u{1F4B3}`, entity: `&#x1F4B3`, name: `Credit Card` },
      { emoji: `\u{1F4B9}`, entity: `&#x1F4B9`, name: `Chart Increasing With Yen` },
      { emoji: `\u{1F4B1}`, entity: `&#x1F4B1`, name: `Currency Exchange` },
      { emoji: `\u{1F4B2}`, entity: `&#x1F4B2`, name: `Heavy Dollar Sign` },
      { emoji: `\u{2709}`, entity: `&#x2709`, name: `Envelope` },
      { emoji: `\u{1F4E7}`, entity: `&#x1F4E7`, name: `E-Mail` },
      { emoji: `\u{1F4E8}`, entity: `&#x1F4E8`, name: `Incoming Envelope` },
      { emoji: `\u{1F4E9}`, entity: `&#x1F4E9`, name: `Envelope With Arrow` },
      { emoji: `\u{1F4E4}`, entity: `&#x1F4E4`, name: `Outbox Tray` },
      { emoji: `\u{1F4E5}`, entity: `&#x1F4E5`, name: `Inbox Tray` },
      { emoji: `\u{1F4E6}`, entity: `&#x1F4E6`, name: `Package` },
      { emoji: `\u{1F4EB}`, entity: `&#x1F4EB`, name: `Closed Mailbox With Raised Flag` },
      { emoji: `\u{1F4EA}`, entity: `&#x1F4EA`, name: `Closed Mailbox With Lowered Flag` },
      { emoji: `\u{1F4EC}`, entity: `&#x1F4EC`, name: `Open Mailbox With Raised Flag` },
      { emoji: `\u{1F4ED}`, entity: `&#x1F4ED`, name: `Open Mailbox With Lowered Flag` },
      { emoji: `\u{1F4EE}`, entity: `&#x1F4EE`, name: `Postbox` },
      { emoji: `\u{1F5F3}`, entity: `&#x1F5F3`, name: `Ballot Box With Ballot` },
      { emoji: `\u{270F}`, entity: `&#x270F`, name: `Pencil` },
      { emoji: `\u{2712}`, entity: `&#x2712`, name: `Black Nib` },
      { emoji: `\u{1F58B}`, entity: `&#x1F58B`, name: `Fountain Pen` },
      { emoji: `\u{1F58A}`, entity: `&#x1F58A`, name: `Pen` },
      { emoji: `\u{1F58C}`, entity: `&#x1F58C`, name: `Paintbrush` },
      { emoji: `\u{1F58D}`, entity: `&#x1F58D`, name: `Crayon` },
      { emoji: `\u{1F4DD}`, entity: `&#x1F4DD`, name: `Memo` },
      { emoji: `\u{1F4BC}`, entity: `&#x1F4BC`, name: `Briefcase` },
      { emoji: `\u{1F4C1}`, entity: `&#x1F4C1`, name: `File Folder` },
      { emoji: `\u{1F4C2}`, entity: `&#x1F4C2`, name: `Open File Folder` },
      { emoji: `\u{1F5C2}`, entity: `&#x1F5C2`, name: `Card Index Dividers` },
      { emoji: `\u{1F4C5}`, entity: `&#x1F4C5`, name: `Calendar` },
      { emoji: `\u{1F4C6}`, entity: `&#x1F4C6`, name: `Tear-Off Calendar` },
      { emoji: `\u{1F5D2}`, entity: `&#x1F5D2`, name: `Spiral Notepad` },
      { emoji: `\u{1F5D3}`, entity: `&#x1F5D3`, name: `Spiral Calendar` },
      { emoji: `\u{1F4C7}`, entity: `&#x1F4C7`, name: `Card Index` },
      { emoji: `\u{1F4C8}`, entity: `&#x1F4C8`, name: `Chart Increasing` },
      { emoji: `\u{1F4C9}`, entity: `&#x1F4C9`, name: `Chart Decreasing` },
      { emoji: `\u{1F4CA}`, entity: `&#x1F4CA`, name: `Bar Chart` },
      { emoji: `\u{1F4CB}`, entity: `&#x1F4CB`, name: `Clipboard` },
      { emoji: `\u{1F4CC}`, entity: `&#x1F4CC`, name: `Pushpin` },
      { emoji: `\u{1F4CD}`, entity: `&#x1F4CD`, name: `Round Pushpin` },
      { emoji: `\u{1F4CE}`, entity: `&#x1F4CE`, name: `Paperclip` },
      { emoji: `\u{1F587}`, entity: `&#x1F587`, name: `Linked Paperclips` },
      { emoji: `\u{1F4CF}`, entity: `&#x1F4CF`, name: `Straight Ruler` },
      { emoji: `\u{1F4D0}`, entity: `&#x1F4D0`, name: `Triangular Ruler` },
      { emoji: `\u{2702}`, entity: `&#x2702`, name: `Scissors` },
      { emoji: `\u{1F5C3}`, entity: `&#x1F5C3`, name: `Card File Box` },
      { emoji: `\u{1F5C4}`, entity: `&#x1F5C4`, name: `File Cabinet` },
      { emoji: `\u{1F5D1}`, entity: `&#x1F5D1`, name: `Wastebasket` },
      { emoji: `\u{1F512}`, entity: `&#x1F512`, name: `Locked` },
      { emoji: `\u{1F513}`, entity: `&#x1F513`, name: `Unlocked` },
      { emoji: `\u{1F50F}`, entity: `&#x1F50F`, name: `Locked With Pen` },
      { emoji: `\u{1F510}`, entity: `&#x1F510`, name: `Locked With Key` },
      { emoji: `\u{1F511}`, entity: `&#x1F511`, name: `Key` },
      { emoji: `\u{1F5DD}`, entity: `&#x1F5DD`, name: `Old Key` },
      { emoji: `\u{1F528}`, entity: `&#x1F528`, name: `Hammer` },
      { emoji: `\u{26CF}`, entity: `&#x26CF`, name: `Pick` },
      { emoji: `\u{2692}`, entity: `&#x2692`, name: `Hammer And Pick` },
      { emoji: `\u{1F6E0}`, entity: `&#x1F6E0`, name: `Hammer And Wrench` },
      { emoji: `\u{1F5E1}`, entity: `&#x1F5E1`, name: `Dagger` },
      { emoji: `\u{2694}`, entity: `&#x2694`, name: `Crossed Swords` },
      { emoji: `\u{1F52B}`, entity: `&#x1F52B`, name: `Pistol` },
      { emoji: `\u{1F3F9}`, entity: `&#x1F3F9`, name: `Bow And Arrow` },
      { emoji: `\u{1F6E1}`, entity: `&#x1F6E1`, name: `Shield` },
      { emoji: `\u{1F527}`, entity: `&#x1F527`, name: `Wrench` },
      { emoji: `\u{1F529}`, entity: `&#x1F529`, name: `Nut And Bolt` },
      { emoji: `\u{2699}`, entity: `&#x2699`, name: `Gear` },
      { emoji: `\u{1F5DC}`, entity: `&#x1F5DC`, name: `Clamp` },
      { emoji: `\u{2697}`, entity: `&#x2697`, name: `Alembic` },
      { emoji: `\u{2696}`, entity: `&#x2696`, name: `Balance Scale` },
      { emoji: `\u{1F517}`, entity: `&#x1F517`, name: `Link` },
      { emoji: `\u{26D3}`, entity: `&#x26D3`, name: `Chains` },
      { emoji: `\u{1F489}`, entity: `&#x1F489`, name: `Syringe` },
      { emoji: `\u{1F48A}`, entity: `&#x1F48A`, name: `Pill` },
      { emoji: `\u{1F6AC}`, entity: `&#x1F6AC`, name: `Cigarette` },
      { emoji: `\u{26B0}`, entity: `&#x26B0`, name: `Coffin` },
      { emoji: `\u{26B1}`, entity: `&#x26B1`, name: `Funeral Urn` },
      { emoji: `\u{1F5FF}`, entity: `&#x1F5FF`, name: `Moai` },
      { emoji: `\u{1F6E2}`, entity: `&#x1F6E2`, name: `Oil Drum` },
      { emoji: `\u{1F52E}`, entity: `&#x1F52E`, name: `Crystal Ball` },
      { emoji: `\u{1F6D2}`, entity: `&#x1F6D2`, name: `Shopping Cart` },
      { emoji: `\u{1F3E7}`, entity: `&#x1F3E7`, name: `ATM Sign` },
      { emoji: `\u{1F6AE}`, entity: `&#x1F6AE`, name: `Litter In Bin Sign` },
      { emoji: `\u{1F6B0}`, entity: `&#x1F6B0`, name: `Potable Water` },
      { emoji: `\u{267F}`, entity: `&#x267F`, name: `Wheelchair Symbol` },
      { emoji: `\u{1F6B9}`, entity: `&#x1F6B9`, name: `Men’s Room` },
      { emoji: `\u{1F6BA}`, entity: `&#x1F6BA`, name: `Women’s Room` },
      { emoji: `\u{1F6BB}`, entity: `&#x1F6BB`, name: `Restroom` },
      { emoji: `\u{1F6BC}`, entity: `&#x1F6BC`, name: `Baby Symbol` },
      { emoji: `\u{1F6BE}`, entity: `&#x1F6BE`, name: `Water Closet` },
      { emoji: `\u{1F6C2}`, entity: `&#x1F6C2`, name: `Passport Control` },
      { emoji: `\u{1F6C3}`, entity: `&#x1F6C3`, name: `Customs` },
      { emoji: `\u{1F6C4}`, entity: `&#x1F6C4`, name: `Baggage Claim` },
      { emoji: `\u{1F6C5}`, entity: `&#x1F6C5`, name: `Left Luggage` },
      { emoji: `\u{26A0}`, entity: `&#x26A0`, name: `Warning` },
      { emoji: `\u{1F6B8}`, entity: `&#x1F6B8`, name: `Children Crossing` },
      { emoji: `\u{26D4}`, entity: `&#x26D4`, name: `No Entry` },
      { emoji: `\u{1F6AB}`, entity: `&#x1F6AB`, name: `Prohibited` },
      { emoji: `\u{1F6B3}`, entity: `&#x1F6B3`, name: `No Bicycles` },
      { emoji: `\u{1F6AD}`, entity: `&#x1F6AD`, name: `No Smoking` },
      { emoji: `\u{1F6AF}`, entity: `&#x1F6AF`, name: `No Littering` },
      { emoji: `\u{1F6B1}`, entity: `&#x1F6B1`, name: `Non-Potable Water` },
      { emoji: `\u{1F6B7}`, entity: `&#x1F6B7`, name: `No Pedestrians` },
      { emoji: `\u{1F4F5}`, entity: `&#x1F4F5`, name: `No Mobile Phones` },
      { emoji: `\u{1F51E}`, entity: `&#x1F51E`, name: `No One Under Eighteen` },
      { emoji: `\u{2622}`, entity: `&#x2622`, name: `Radioactive` },
      { emoji: `\u{2623}`, entity: `&#x2623`, name: `Biohazard` },
      { emoji: `\u{2B06}`, entity: `&#x2B06`, name: `Up Arrow` },
      { emoji: `\u{2197}`, entity: `&#x2197`, name: `Up-Right Arrow` },
      { emoji: `\u{27A1}`, entity: `&#x27A1`, name: `Right Arrow` },
      { emoji: `\u{2198}`, entity: `&#x2198`, name: `Down-Right Arrow` },
      { emoji: `\u{2B07}`, entity: `&#x2B07`, name: `Down Arrow` },
      { emoji: `\u{2199}`, entity: `&#x2199`, name: `Down-Left Arrow` },
      { emoji: `\u{2B05}`, entity: `&#x2B05`, name: `Left Arrow` },
      { emoji: `\u{2196}`, entity: `&#x2196`, name: `Up-Left Arrow` },
      { emoji: `\u{2195}`, entity: `&#x2195`, name: `Up-Down Arrow` },
      { emoji: `\u{2194}`, entity: `&#x2194`, name: `Left-Right Arrow` },
      { emoji: `\u{21A9}`, entity: `&#x21A9`, name: `Right Arrow Curving Left` },
      { emoji: `\u{21AA}`, entity: `&#x21AA`, name: `Left Arrow Curving Right` },
      { emoji: `\u{2934}`, entity: `&#x2934`, name: `Right Arrow Curving Up` },
      { emoji: `\u{2935}`, entity: `&#x2935`, name: `Right Arrow Curving Down` },
      { emoji: `\u{1F503}`, entity: `&#x1F503`, name: `Clockwise Vertical Arrows` },
      { emoji: `\u{1F504}`, entity: `&#x1F504`, name: `Anticlockwise Arrows Button` },
      { emoji: `\u{1F519}`, entity: `&#x1F519`, name: `BACK Arrow` },
      { emoji: `\u{1F51A}`, entity: `&#x1F51A`, name: `END Arrow` },
      { emoji: `\u{1F51B}`, entity: `&#x1F51B`, name: `ON! Arrow` },
      { emoji: `\u{1F51C}`, entity: `&#x1F51C`, name: `SOON Arrow` },
      { emoji: `\u{1F51D}`, entity: `&#x1F51D`, name: `TOP Arrow` },
      { emoji: `\u{1F6D0}`, entity: `&#x1F6D0`, name: `Place Of Worship` },
      { emoji: `\u{269B}`, entity: `&#x269B`, name: `Atom Symbol` },
      { emoji: `\u{1F549}`, entity: `&#x1F549`, name: `Om` },
      { emoji: `\u{2721}`, entity: `&#x2721`, name: `Star Of David` },
      { emoji: `\u{2638}`, entity: `&#x2638`, name: `Wheel Of Dharma` },
      { emoji: `\u{262F}`, entity: `&#x262F`, name: `Yin Yang` },
      { emoji: `\u{271D}`, entity: `&#x271D`, name: `Latin Cross` },
      { emoji: `\u{2626}`, entity: `&#x2626`, name: `Orthodox Cross` },
      { emoji: `\u{262A}`, entity: `&#x262A`, name: `Star And Crescent` },
      { emoji: `\u{262E}`, entity: `&#x262E`, name: `Peace Symbol` },
      { emoji: `\u{1F54E}`, entity: `&#x1F54E`, name: `Menorah` },
      { emoji: `\u{1F52F}`, entity: `&#x1F52F`, name: `Dotted Six-Pointed Star` },
      { emoji: `\u{2648}`, entity: `&#x2648`, name: `Aries` },
      { emoji: `\u{2649}`, entity: `&#x2649`, name: `Taurus` },
      { emoji: `\u{264A}`, entity: `&#x264A`, name: `Gemini` },
      { emoji: `\u{264B}`, entity: `&#x264B`, name: `Cancer` },
      { emoji: `\u{264C}`, entity: `&#x264C`, name: `Leo` },
      { emoji: `\u{264D}`, entity: `&#x264D`, name: `Virgo` },
      { emoji: `\u{264E}`, entity: `&#x264E`, name: `Libra` },
      { emoji: `\u{264F}`, entity: `&#x264F`, name: `Scorpius` },
      { emoji: `\u{2650}`, entity: `&#x2650`, name: `Sagittarius` },
      { emoji: `\u{2651}`, entity: `&#x2651`, name: `Capricorn` },
      { emoji: `\u{2652}`, entity: `&#x2652`, name: `Aquarius` },
      { emoji: `\u{2653}`, entity: `&#x2653`, name: `Pisces` },
      { emoji: `\u{26CE}`, entity: `&#x26CE`, name: `Ophiuchus` },
      { emoji: `\u{1F500}`, entity: `&#x1F500`, name: `Shuffle Tracks Button` },
      { emoji: `\u{1F501}`, entity: `&#x1F501`, name: `Repeat Button` },
      { emoji: `\u{1F502}`, entity: `&#x1F502`, name: `Repeat Single Button` },
      { emoji: `\u{25B6}`, entity: `&#x25B6`, name: `Play Button` },
      { emoji: `\u{23E9}`, entity: `&#x23E9`, name: `Fast-Forward Button` },
      { emoji: `\u{23ED}`, entity: `&#x23ED`, name: `Next Track Button` },
      { emoji: `\u{23EF}`, entity: `&#x23EF`, name: `Play Or Pause Button` },
      { emoji: `\u{25C0}`, entity: `&#x25C0`, name: `Reverse Button` },
      { emoji: `\u{23EA}`, entity: `&#x23EA`, name: `Fast Reverse Button` },
      { emoji: `\u{23EE}`, entity: `&#x23EE`, name: `Last Track Button` },
      { emoji: `\u{1F53C}`, entity: `&#x1F53C`, name: `Up Button` },
      { emoji: `\u{23EB}`, entity: `&#x23EB`, name: `Fast Up Button` },
      { emoji: `\u{1F53D}`, entity: `&#x1F53D`, name: `Down Button` },
      { emoji: `\u{23EC}`, entity: `&#x23EC`, name: `Fast Down Button` },
      { emoji: `\u{23F8}`, entity: `&#x23F8`, name: `Pause Button` },
      { emoji: `\u{23F9}`, entity: `&#x23F9`, name: `Stop Button` },
      { emoji: `\u{23FA}`, entity: `&#x23FA`, name: `Record Button` },
      { emoji: `\u{23CF}`, entity: `&#x23CF`, name: `Eject Button` },
      { emoji: `\u{1F3A6}`, entity: `&#x1F3A6`, name: `Cinema` },
      { emoji: `\u{1F505}`, entity: `&#x1F505`, name: `Dim Button` },
      { emoji: `\u{1F506}`, entity: `&#x1F506`, name: `Bright Button` },
      { emoji: `\u{1F4F6}`, entity: `&#x1F4F6`, name: `Antenna Bars` },
      { emoji: `\u{1F4F3}`, entity: `&#x1F4F3`, name: `Vibration Mode` },
      { emoji: `\u{1F4F4}`, entity: `&#x1F4F4`, name: `Mobile Phone Off` },
      { emoji: `\u{267B}`, entity: `&#x267B`, name: `Recycling Symbol` },
      { emoji: `\u{1F4DB}`, entity: `&#x1F4DB`, name: `Name Badge` },
      { emoji: `\u{269C}`, entity: `&#x269C`, name: `Fleur-De-Lis` },
      { emoji: `\u{1F530}`, entity: `&#x1F530`, name: `Japanese Symbol For Beginner` },
      { emoji: `\u{1F531}`, entity: `&#x1F531`, name: `Trident Emblem` },
      { emoji: `\u{2B55}`, entity: `&#x2B55`, name: `Heavy Large Circle` },
      { emoji: `\u{2705}`, entity: `&#x2705`, name: `White Heavy Check Mark` },
      { emoji: `\u{2611}`, entity: `&#x2611`, name: `Ballot Box With Check` },
      { emoji: `\u{2714}`, entity: `&#x2714`, name: `Heavy Check Mark` },
      { emoji: `\u{2716}`, entity: `&#x2716`, name: `Heavy Multiplication X` },
      { emoji: `\u{274C}`, entity: `&#x274C`, name: `Cross Mark` },
      { emoji: `\u{274E}`, entity: `&#x274E`, name: `Cross Mark Button` },
      { emoji: `\u{2795}`, entity: `&#x2795`, name: `Heavy Plus Sign` },
      { emoji: `\u{2640}`, entity: `&#x2640`, name: `Female Sign` },
      { emoji: `\u{2642}`, entity: `&#x2642`, name: `Male Sign` },
      { emoji: `\u{2695}`, entity: `&#x2695`, name: `Medical Symbol` },
      { emoji: `\u{2796}`, entity: `&#x2796`, name: `Heavy Minus Sign` },
      { emoji: `\u{2797}`, entity: `&#x2797`, name: `Heavy Division Sign` },
      { emoji: `\u{27B0}`, entity: `&#x27B0`, name: `Curly Loop` },
      { emoji: `\u{27BF}`, entity: `&#x27BF`, name: `Double Curly Loop` },
      { emoji: `\u{303D}`, entity: `&#x303D`, name: `Part Alternation Mark` },
      { emoji: `\u{2733}`, entity: `&#x2733`, name: `Eight-Spoked Asterisk` },
      { emoji: `\u{2734}`, entity: `&#x2734`, name: `Eight-Pointed Star` },
      { emoji: `\u{2747}`, entity: `&#x2747`, name: `Sparkle` },
      { emoji: `\u{203C}`, entity: `&#x203C`, name: `Double Exclamation Mark` },
      { emoji: `\u{2049}`, entity: `&#x2049`, name: `Exclamation Question Mark` },
      { emoji: `\u{2753}`, entity: `&#x2753`, name: `Question Mark` },
      { emoji: `\u{2754}`, entity: `&#x2754`, name: `White Question Mark` },
      { emoji: `\u{2755}`, entity: `&#x2755`, name: `White Exclamation Mark` },
      { emoji: `\u{2757}`, entity: `&#x2757`, name: `Exclamation Mark` },
      { emoji: `\u{3030}`, entity: `&#x3030`, name: `Wavy Dash` },
      { emoji: `\u{00A9}`, entity: `&#x00A9`, name: `Copyright` },
      { emoji: `\u{00AE}`, entity: `&#x00AE`, name: `Registered` },
      { emoji: `\u{2122}`, entity: `&#x2122`, name: `Trade Mark` },
      { emoji: `\u{0023}\u{FE0F}\u{20E3}`, entity: `&#x0023&#xFE0F&#x20E3`, name: `Keycap: #` },
      { emoji: `\u{002A}\u{FE0F}\u{20E3}`, entity: `&#x002A&#xFE0F&#x20E3`, name: `Keycap: *` },
      { emoji: `\u{0030}\u{FE0F}\u{20E3}`, entity: `&#x0030&#xFE0F&#x20E3`, name: `Keycap: 0` },
      { emoji: `\u{0031}\u{FE0F}\u{20E3}`, entity: `&#x0031&#xFE0F&#x20E3`, name: `Keycap: 1` },
      { emoji: `\u{0032}\u{FE0F}\u{20E3}`, entity: `&#x0032&#xFE0F&#x20E3`, name: `Keycap: 2` },
      { emoji: `\u{0033}\u{FE0F}\u{20E3}`, entity: `&#x0033&#xFE0F&#x20E3`, name: `Keycap: 3` },
      { emoji: `\u{0034}\u{FE0F}\u{20E3}`, entity: `&#x0034&#xFE0F&#x20E3`, name: `Keycap: 4` },
      { emoji: `\u{0035}\u{FE0F}\u{20E3}`, entity: `&#x0035&#xFE0F&#x20E3`, name: `Keycap: 5` },
      { emoji: `\u{0036}\u{FE0F}\u{20E3}`, entity: `&#x0036&#xFE0F&#x20E3`, name: `Keycap: 6` },
      { emoji: `\u{0037}\u{FE0F}\u{20E3}`, entity: `&#x0037&#xFE0F&#x20E3`, name: `Keycap: 7` },
      { emoji: `\u{0038}\u{FE0F}\u{20E3}`, entity: `&#x0038&#xFE0F&#x20E3`, name: `Keycap: 8` },
      { emoji: `\u{0039}\u{FE0F}\u{20E3}`, entity: `&#x0039&#xFE0F&#x20E3`, name: `Keycap: 9` },
      { emoji: `\u{1F51F}`, entity: `&#x1F51F`, name: `Keycap 10` },
      { emoji: `\u{1F4AF}`, entity: `&#x1F4AF`, name: `Hundred Points` },
      { emoji: `\u{1F520}`, entity: `&#x1F520`, name: `Input Latin Uppercase` },
      { emoji: `\u{1F521}`, entity: `&#x1F521`, name: `Input Latin Lowercase` },
      { emoji: `\u{1F522}`, entity: `&#x1F522`, name: `Input Numbers` },
      { emoji: `\u{1F523}`, entity: `&#x1F523`, name: `Input Symbols` },
      { emoji: `\u{1F524}`, entity: `&#x1F524`, name: `Input Latin Letters` },
      { emoji: `\u{1F170}`, entity: `&#x1F170`, name: `A Button (blood Type)` },
      { emoji: `\u{1F18E}`, entity: `&#x1F18E`, name: `AB Button (blood Type)` },
      { emoji: `\u{1F171}`, entity: `&#x1F171`, name: `B Button (blood Type)` },
      { emoji: `\u{1F191}`, entity: `&#x1F191`, name: `CL Button` },
      { emoji: `\u{1F192}`, entity: `&#x1F192`, name: `COOL Button` },
      { emoji: `\u{1F193}`, entity: `&#x1F193`, name: `FREE Button` },
      { emoji: `\u{2139}`, entity: `&#x2139`, name: `Information` },
      { emoji: `\u{1F194}`, entity: `&#x1F194`, name: `ID Button` },
      { emoji: `\u{24C2}`, entity: `&#x24C2`, name: `Circled M` },
      { emoji: `\u{1F195}`, entity: `&#x1F195`, name: `NEW Button` },
      { emoji: `\u{1F196}`, entity: `&#x1F196`, name: `NG Button` },
      { emoji: `\u{1F17E}`, entity: `&#x1F17E`, name: `O Button (blood Type)` },
      { emoji: `\u{1F197}`, entity: `&#x1F197`, name: `OK Button` },
      { emoji: `\u{1F17F}`, entity: `&#x1F17F`, name: `P Button` },
      { emoji: `\u{1F198}`, entity: `&#x1F198`, name: `SOS Button` },
      { emoji: `\u{1F199}`, entity: `&#x1F199`, name: `UP! Button` },
      { emoji: `\u{1F19A}`, entity: `&#x1F19A`, name: `VS Button` },
      { emoji: `\u{1F201}`, entity: `&#x1F201`, name: `Japanese “here” Button` },
      { emoji: `\u{1F202}`, entity: `&#x1F202`, name: `Japanese “service Charge” Button` },
      { emoji: `\u{1F237}`, entity: `&#x1F237`, name: `Japanese “monthly Amount” Button` },
      { emoji: `\u{1F236}`, entity: `&#x1F236`, name: `Japanese “not Free Of Charge” Button` },
      { emoji: `\u{1F22F}`, entity: `&#x1F22F`, name: `Japanese “reserved” Button` },
      { emoji: `\u{1F250}`, entity: `&#x1F250`, name: `Japanese “bargain” Button` },
      { emoji: `\u{1F239}`, entity: `&#x1F239`, name: `Japanese “discount” Button` },
      { emoji: `\u{1F21A}`, entity: `&#x1F21A`, name: `Japanese “free Of Charge” Button` },
      { emoji: `\u{1F232}`, entity: `&#x1F232`, name: `Japanese “prohibited” Button` },
      { emoji: `\u{1F251}`, entity: `&#x1F251`, name: `Japanese “acceptable” Button` },
      { emoji: `\u{1F238}`, entity: `&#x1F238`, name: `Japanese “application” Button` },
      { emoji: `\u{1F234}`, entity: `&#x1F234`, name: `Japanese “passing Grade” Button` },
      { emoji: `\u{1F233}`, entity: `&#x1F233`, name: `Japanese “vacancy” Button` },
      { emoji: `\u{3297}`, entity: `&#x3297`, name: `Japanese “congratulations” Button` },
      { emoji: `\u{3299}`, entity: `&#x3299`, name: `Japanese “secret” Button` },
      { emoji: `\u{1F23A}`, entity: `&#x1F23A`, name: `Japanese “open For Business” Button` },
      { emoji: `\u{1F235}`, entity: `&#x1F235`, name: `Japanese “no Vacancy” Button` },
      { emoji: `\u{25AA}`, entity: `&#x25AA`, name: `Black Small Square` },
      { emoji: `\u{25AB}`, entity: `&#x25AB`, name: `White Small Square` },
      { emoji: `\u{25FB}`, entity: `&#x25FB`, name: `White Medium Square` },
      { emoji: `\u{25FC}`, entity: `&#x25FC`, name: `Black Medium Square` },
      { emoji: `\u{25FD}`, entity: `&#x25FD`, name: `White Medium-Small Square` },
      { emoji: `\u{25FE}`, entity: `&#x25FE`, name: `Black Medium-Small Square` },
      { emoji: `\u{2B1B}`, entity: `&#x2B1B`, name: `Black Large Square` },
      { emoji: `\u{2B1C}`, entity: `&#x2B1C`, name: `White Large Square` },
      { emoji: `\u{1F536}`, entity: `&#x1F536`, name: `Large Orange Diamond` },
      { emoji: `\u{1F537}`, entity: `&#x1F537`, name: `Large Blue Diamond` },
      { emoji: `\u{1F538}`, entity: `&#x1F538`, name: `Small Orange Diamond` },
      { emoji: `\u{1F539}`, entity: `&#x1F539`, name: `Small Blue Diamond` },
      { emoji: `\u{1F53A}`, entity: `&#x1F53A`, name: `Red Triangle Pointed Up` },
      { emoji: `\u{1F53B}`, entity: `&#x1F53B`, name: `Red Triangle Pointed Down` },
      { emoji: `\u{1F4A0}`, entity: `&#x1F4A0`, name: `Diamond With A Dot` },
      { emoji: `\u{1F518}`, entity: `&#x1F518`, name: `Radio Button` },
      { emoji: `\u{1F532}`, entity: `&#x1F532`, name: `Black Square Button` },
      { emoji: `\u{1F533}`, entity: `&#x1F533`, name: `White Square Button` },
      { emoji: `\u{26AA}`, entity: `&#x26AA`, name: `White Circle` },
      { emoji: `\u{26AB}`, entity: `&#x26AB`, name: `Black Circle` },
      { emoji: `\u{1F534}`, entity: `&#x1F534`, name: `Red Circle` },
      { emoji: `\u{1F535}`, entity: `&#x1F535`, name: `Blue Circle` },
      { emoji: `\u{1F3C1}`, entity: `&#x1F3C1`, name: `Chequered Flag` },
      { emoji: `\u{1F6A9}`, entity: `&#x1F6A9`, name: `Triangular Flag` },
      { emoji: `\u{1F38C}`, entity: `&#x1F38C`, name: `Crossed Flags` },
      { emoji: `\u{1F3F4}`, entity: `&#x1F3F4`, name: `Black Flag` },
      { emoji: `\u{1F3F3}`, entity: `&#x1F3F3`, name: `White Flag` },
      { emoji: `\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}`, entity: `&#x1F3F3&#xFE0F&#x200D&#x1F308`, name: `Rainbow Flag` },
      { emoji: `\u{1F1E6}\u{1F1E8}`, entity: `&#x1F1E6&#x1F1E8`, name: `Ascension Island` },
      { emoji: `\u{1F1E6}\u{1F1E9}`, entity: `&#x1F1E6&#x1F1E9`, name: `Andorra` },
      { emoji: `\u{1F1E6}\u{1F1EA}`, entity: `&#x1F1E6&#x1F1EA`, name: `United Arab Emirates` },
      { emoji: `\u{1F1E6}\u{1F1EB}`, entity: `&#x1F1E6&#x1F1EB`, name: `Afghanistan` },
      { emoji: `\u{1F1E6}\u{1F1EC}`, entity: `&#x1F1E6&#x1F1EC`, name: `Antigua & Barbuda` },
      { emoji: `\u{1F1E6}\u{1F1EE}`, entity: `&#x1F1E6&#x1F1EE`, name: `Anguilla` },
      { emoji: `\u{1F1E6}\u{1F1F1}`, entity: `&#x1F1E6&#x1F1F1`, name: `Albania` },
      { emoji: `\u{1F1E6}\u{1F1F2}`, entity: `&#x1F1E6&#x1F1F2`, name: `Armenia` },
      { emoji: `\u{1F1E6}\u{1F1F4}`, entity: `&#x1F1E6&#x1F1F4`, name: `Angola` },
      { emoji: `\u{1F1E6}\u{1F1F6}`, entity: `&#x1F1E6&#x1F1F6`, name: `Antarctica` },
      { emoji: `\u{1F1E6}\u{1F1F7}`, entity: `&#x1F1E6&#x1F1F7`, name: `Argentina` },
      { emoji: `\u{1F1E6}\u{1F1F8}`, entity: `&#x1F1E6&#x1F1F8`, name: `American Samoa` },
      { emoji: `\u{1F1E6}\u{1F1F9}`, entity: `&#x1F1E6&#x1F1F9`, name: `Austria` },
      { emoji: `\u{1F1E6}\u{1F1FA}`, entity: `&#x1F1E6&#x1F1FA`, name: `Australia` },
      { emoji: `\u{1F1E6}\u{1F1FC}`, entity: `&#x1F1E6&#x1F1FC`, name: `Aruba` },
      { emoji: `\u{1F1E6}\u{1F1FD}`, entity: `&#x1F1E6&#x1F1FD`, name: `Åland Islands` },
      { emoji: `\u{1F1E6}\u{1F1FF}`, entity: `&#x1F1E6&#x1F1FF`, name: `Azerbaijan` },
      { emoji: `\u{1F1E7}\u{1F1E6}`, entity: `&#x1F1E7&#x1F1E6`, name: `Bosnia & Herzegovina` },
      { emoji: `\u{1F1E7}\u{1F1E7}`, entity: `&#x1F1E7&#x1F1E7`, name: `Barbados` },
      { emoji: `\u{1F1E7}\u{1F1E9}`, entity: `&#x1F1E7&#x1F1E9`, name: `Bangladesh` },
      { emoji: `\u{1F1E7}\u{1F1EA}`, entity: `&#x1F1E7&#x1F1EA`, name: `Belgium` },
      { emoji: `\u{1F1E7}\u{1F1EB}`, entity: `&#x1F1E7&#x1F1EB`, name: `Burkina Faso` },
      { emoji: `\u{1F1E7}\u{1F1EC}`, entity: `&#x1F1E7&#x1F1EC`, name: `Bulgaria` },
      { emoji: `\u{1F1E7}\u{1F1ED}`, entity: `&#x1F1E7&#x1F1ED`, name: `Bahrain` },
      { emoji: `\u{1F1E7}\u{1F1EE}`, entity: `&#x1F1E7&#x1F1EE`, name: `Burundi` },
      { emoji: `\u{1F1E7}\u{1F1EF}`, entity: `&#x1F1E7&#x1F1EF`, name: `Benin` },
      { emoji: `\u{1F1E7}\u{1F1F1}`, entity: `&#x1F1E7&#x1F1F1`, name: `St. Barthélemy` },
      { emoji: `\u{1F1E7}\u{1F1F2}`, entity: `&#x1F1E7&#x1F1F2`, name: `Bermuda` },
      { emoji: `\u{1F1E7}\u{1F1F3}`, entity: `&#x1F1E7&#x1F1F3`, name: `Brunei` },
      { emoji: `\u{1F1E7}\u{1F1F4}`, entity: `&#x1F1E7&#x1F1F4`, name: `Bolivia` },
      { emoji: `\u{1F1E7}\u{1F1F6}`, entity: `&#x1F1E7&#x1F1F6`, name: `Caribbean Netherlands` },
      { emoji: `\u{1F1E7}\u{1F1F7}`, entity: `&#x1F1E7&#x1F1F7`, name: `Brazil` },
      { emoji: `\u{1F1E7}\u{1F1F8}`, entity: `&#x1F1E7&#x1F1F8`, name: `Bahamas` },
      { emoji: `\u{1F1E7}\u{1F1F9}`, entity: `&#x1F1E7&#x1F1F9`, name: `Bhutan` },
      { emoji: `\u{1F1E7}\u{1F1FB}`, entity: `&#x1F1E7&#x1F1FB`, name: `Bouvet Island` },
      { emoji: `\u{1F1E7}\u{1F1FC}`, entity: `&#x1F1E7&#x1F1FC`, name: `Botswana` },
      { emoji: `\u{1F1E7}\u{1F1FE}`, entity: `&#x1F1E7&#x1F1FE`, name: `Belarus` },
      { emoji: `\u{1F1E7}\u{1F1FF}`, entity: `&#x1F1E7&#x1F1FF`, name: `Belize` },
      { emoji: `\u{1F1E8}\u{1F1E6}`, entity: `&#x1F1E8&#x1F1E6`, name: `Canada` },
      { emoji: `\u{1F1E8}\u{1F1E8}`, entity: `&#x1F1E8&#x1F1E8`, name: `Cocos (Keeling) Islands` },
      { emoji: `\u{1F1E8}\u{1F1E9}`, entity: `&#x1F1E8&#x1F1E9`, name: `Congo - Kinshasa` },
      { emoji: `\u{1F1E8}\u{1F1EB}`, entity: `&#x1F1E8&#x1F1EB`, name: `Central African Republic` },
      { emoji: `\u{1F1E8}\u{1F1EC}`, entity: `&#x1F1E8&#x1F1EC`, name: `Congo - Brazzaville` },
      { emoji: `\u{1F1E8}\u{1F1ED}`, entity: `&#x1F1E8&#x1F1ED`, name: `Switzerland` },
      { emoji: `\u{1F1E8}\u{1F1EE}`, entity: `&#x1F1E8&#x1F1EE`, name: `Côte D’Ivoire` },
      { emoji: `\u{1F1E8}\u{1F1F0}`, entity: `&#x1F1E8&#x1F1F0`, name: `Cook Islands` },
      { emoji: `\u{1F1E8}\u{1F1F1}`, entity: `&#x1F1E8&#x1F1F1`, name: `Chile` },
      { emoji: `\u{1F1E8}\u{1F1F2}`, entity: `&#x1F1E8&#x1F1F2`, name: `Cameroon` },
      { emoji: `\u{1F1E8}\u{1F1F3}`, entity: `&#x1F1E8&#x1F1F3`, name: `China` },
      { emoji: `\u{1F1E8}\u{1F1F4}`, entity: `&#x1F1E8&#x1F1F4`, name: `Colombia` },
      { emoji: `\u{1F1E8}\u{1F1F5}`, entity: `&#x1F1E8&#x1F1F5`, name: `Clipperton Island` },
      { emoji: `\u{1F1E8}\u{1F1F7}`, entity: `&#x1F1E8&#x1F1F7`, name: `Costa Rica` },
      { emoji: `\u{1F1E8}\u{1F1FA}`, entity: `&#x1F1E8&#x1F1FA`, name: `Cuba` },
      { emoji: `\u{1F1E8}\u{1F1FB}`, entity: `&#x1F1E8&#x1F1FB`, name: `Cape Verde` },
      { emoji: `\u{1F1E8}\u{1F1FC}`, entity: `&#x1F1E8&#x1F1FC`, name: `Curaçao` },
      { emoji: `\u{1F1E8}\u{1F1FD}`, entity: `&#x1F1E8&#x1F1FD`, name: `Christmas Island` },
      { emoji: `\u{1F1E8}\u{1F1FE}`, entity: `&#x1F1E8&#x1F1FE`, name: `Cyprus` },
      { emoji: `\u{1F1E8}\u{1F1FF}`, entity: `&#x1F1E8&#x1F1FF`, name: `Czech Republic` },
      { emoji: `\u{1F1E9}\u{1F1EA}`, entity: `&#x1F1E9&#x1F1EA`, name: `Germany` },
      { emoji: `\u{1F1E9}\u{1F1EC}`, entity: `&#x1F1E9&#x1F1EC`, name: `Diego Garcia` },
      { emoji: `\u{1F1E9}\u{1F1EF}`, entity: `&#x1F1E9&#x1F1EF`, name: `Djibouti` },
      { emoji: `\u{1F1E9}\u{1F1F0}`, entity: `&#x1F1E9&#x1F1F0`, name: `Denmark` },
      { emoji: `\u{1F1E9}\u{1F1F2}`, entity: `&#x1F1E9&#x1F1F2`, name: `Dominica` },
      { emoji: `\u{1F1E9}\u{1F1F4}`, entity: `&#x1F1E9&#x1F1F4`, name: `Dominican Republic` },
      { emoji: `\u{1F1E9}\u{1F1FF}`, entity: `&#x1F1E9&#x1F1FF`, name: `Algeria` },
      { emoji: `\u{1F1EA}\u{1F1E6}`, entity: `&#x1F1EA&#x1F1E6`, name: `Ceuta & Melilla` },
      { emoji: `\u{1F1EA}\u{1F1E8}`, entity: `&#x1F1EA&#x1F1E8`, name: `Ecuador` },
      { emoji: `\u{1F1EA}\u{1F1EA}`, entity: `&#x1F1EA&#x1F1EA`, name: `Estonia` },
      { emoji: `\u{1F1EA}\u{1F1EC}`, entity: `&#x1F1EA&#x1F1EC`, name: `Egypt` },
      { emoji: `\u{1F1EA}\u{1F1ED}`, entity: `&#x1F1EA&#x1F1ED`, name: `Western Sahara` },
      { emoji: `\u{1F1EA}\u{1F1F7}`, entity: `&#x1F1EA&#x1F1F7`, name: `Eritrea` },
      { emoji: `\u{1F1EA}\u{1F1F8}`, entity: `&#x1F1EA&#x1F1F8`, name: `Spain` },
      { emoji: `\u{1F1EA}\u{1F1F9}`, entity: `&#x1F1EA&#x1F1F9`, name: `Ethiopia` },
      { emoji: `\u{1F1EA}\u{1F1FA}`, entity: `&#x1F1EA&#x1F1FA`, name: `European Union` },
      { emoji: `\u{1F1EB}\u{1F1EE}`, entity: `&#x1F1EB&#x1F1EE`, name: `Finland` },
      { emoji: `\u{1F1EB}\u{1F1EF}`, entity: `&#x1F1EB&#x1F1EF`, name: `Fiji` },
      { emoji: `\u{1F1EB}\u{1F1F0}`, entity: `&#x1F1EB&#x1F1F0`, name: `Falkland Islands` },
      { emoji: `\u{1F1EB}\u{1F1F2}`, entity: `&#x1F1EB&#x1F1F2`, name: `Micronesia` },
      { emoji: `\u{1F1EB}\u{1F1F4}`, entity: `&#x1F1EB&#x1F1F4`, name: `Faroe Islands` },
      { emoji: `\u{1F1EB}\u{1F1F7}`, entity: `&#x1F1EB&#x1F1F7`, name: `France` },
      { emoji: `\u{1F1EC}\u{1F1E6}`, entity: `&#x1F1EC&#x1F1E6`, name: `Gabon` },
      { emoji: `\u{1F1EC}\u{1F1E7}`, entity: `&#x1F1EC&#x1F1E7`, name: `United Kingdom` },
      { emoji: `\u{1F1EC}\u{1F1E9}`, entity: `&#x1F1EC&#x1F1E9`, name: `Grenada` },
      { emoji: `\u{1F1EC}\u{1F1EA}`, entity: `&#x1F1EC&#x1F1EA`, name: `Georgia` },
      { emoji: `\u{1F1EC}\u{1F1EB}`, entity: `&#x1F1EC&#x1F1EB`, name: `French Guiana` },
      { emoji: `\u{1F1EC}\u{1F1EC}`, entity: `&#x1F1EC&#x1F1EC`, name: `Guernsey` },
      { emoji: `\u{1F1EC}\u{1F1ED}`, entity: `&#x1F1EC&#x1F1ED`, name: `Ghana` },
      { emoji: `\u{1F1EC}\u{1F1EE}`, entity: `&#x1F1EC&#x1F1EE`, name: `Gibraltar` },
      { emoji: `\u{1F1EC}\u{1F1F1}`, entity: `&#x1F1EC&#x1F1F1`, name: `Greenland` },
      { emoji: `\u{1F1EC}\u{1F1F2}`, entity: `&#x1F1EC&#x1F1F2`, name: `Gambia` },
      { emoji: `\u{1F1EC}\u{1F1F3}`, entity: `&#x1F1EC&#x1F1F3`, name: `Guinea` },
      { emoji: `\u{1F1EC}\u{1F1F5}`, entity: `&#x1F1EC&#x1F1F5`, name: `Guadeloupe` },
      { emoji: `\u{1F1EC}\u{1F1F6}`, entity: `&#x1F1EC&#x1F1F6`, name: `Equatorial Guinea` },
      { emoji: `\u{1F1EC}\u{1F1F7}`, entity: `&#x1F1EC&#x1F1F7`, name: `Greece` },
      { emoji: `\u{1F1EC}\u{1F1F8}`, entity: `&#x1F1EC&#x1F1F8`, name: `South Georgia & South Sandwich Islands` },
      { emoji: `\u{1F1EC}\u{1F1F9}`, entity: `&#x1F1EC&#x1F1F9`, name: `Guatemala` },
      { emoji: `\u{1F1EC}\u{1F1FA}`, entity: `&#x1F1EC&#x1F1FA`, name: `Guam` },
      { emoji: `\u{1F1EC}\u{1F1FC}`, entity: `&#x1F1EC&#x1F1FC`, name: `Guinea-Bissau` },
      { emoji: `\u{1F1EC}\u{1F1FE}`, entity: `&#x1F1EC&#x1F1FE`, name: `Guyana` },
      { emoji: `\u{1F1ED}\u{1F1F0}`, entity: `&#x1F1ED&#x1F1F0`, name: `Hong Kong SAR China` },
      { emoji: `\u{1F1ED}\u{1F1F2}`, entity: `&#x1F1ED&#x1F1F2`, name: `Heard & McDonald Islands` },
      { emoji: `\u{1F1ED}\u{1F1F3}`, entity: `&#x1F1ED&#x1F1F3`, name: `Honduras` },
      { emoji: `\u{1F1ED}\u{1F1F7}`, entity: `&#x1F1ED&#x1F1F7`, name: `Croatia` },
      { emoji: `\u{1F1ED}\u{1F1F9}`, entity: `&#x1F1ED&#x1F1F9`, name: `Haiti` },
      { emoji: `\u{1F1ED}\u{1F1FA}`, entity: `&#x1F1ED&#x1F1FA`, name: `Hungary` },
      { emoji: `\u{1F1EE}\u{1F1E8}`, entity: `&#x1F1EE&#x1F1E8`, name: `Canary Islands` },
      { emoji: `\u{1F1EE}\u{1F1E9}`, entity: `&#x1F1EE&#x1F1E9`, name: `Indonesia` },
      { emoji: `\u{1F1EE}\u{1F1EA}`, entity: `&#x1F1EE&#x1F1EA`, name: `Ireland` },
      { emoji: `\u{1F1EE}\u{1F1F1}`, entity: `&#x1F1EE&#x1F1F1`, name: `Israel` },
      { emoji: `\u{1F1EE}\u{1F1F2}`, entity: `&#x1F1EE&#x1F1F2`, name: `Isle Of Man` },
      { emoji: `\u{1F1EE}\u{1F1F3}`, entity: `&#x1F1EE&#x1F1F3`, name: `India` },
      { emoji: `\u{1F1EE}\u{1F1F4}`, entity: `&#x1F1EE&#x1F1F4`, name: `British Indian Ocean Territory` },
      { emoji: `\u{1F1EE}\u{1F1F6}`, entity: `&#x1F1EE&#x1F1F6`, name: `Iraq` },
      { emoji: `\u{1F1EE}\u{1F1F7}`, entity: `&#x1F1EE&#x1F1F7`, name: `Iran` },
      { emoji: `\u{1F1EE}\u{1F1F8}`, entity: `&#x1F1EE&#x1F1F8`, name: `Iceland` },
      { emoji: `\u{1F1EE}\u{1F1F9}`, entity: `&#x1F1EE&#x1F1F9`, name: `Italy` },
      { emoji: `\u{1F1EF}\u{1F1EA}`, entity: `&#x1F1EF&#x1F1EA`, name: `Jersey` },
      { emoji: `\u{1F1EF}\u{1F1F2}`, entity: `&#x1F1EF&#x1F1F2`, name: `Jamaica` },
      { emoji: `\u{1F1EF}\u{1F1F4}`, entity: `&#x1F1EF&#x1F1F4`, name: `Jordan` },
      { emoji: `\u{1F1EF}\u{1F1F5}`, entity: `&#x1F1EF&#x1F1F5`, name: `Japan` },
      { emoji: `\u{1F1F0}\u{1F1EA}`, entity: `&#x1F1F0&#x1F1EA`, name: `Kenya` },
      { emoji: `\u{1F1F0}\u{1F1EC}`, entity: `&#x1F1F0&#x1F1EC`, name: `Kyrgyzstan` },
      { emoji: `\u{1F1F0}\u{1F1ED}`, entity: `&#x1F1F0&#x1F1ED`, name: `Cambodia` },
      { emoji: `\u{1F1F0}\u{1F1EE}`, entity: `&#x1F1F0&#x1F1EE`, name: `Kiribati` },
      { emoji: `\u{1F1F0}\u{1F1F2}`, entity: `&#x1F1F0&#x1F1F2`, name: `Comoros` },
      { emoji: `\u{1F1F0}\u{1F1F3}`, entity: `&#x1F1F0&#x1F1F3`, name: `St. Kitts & Nevis` },
      { emoji: `\u{1F1F0}\u{1F1F5}`, entity: `&#x1F1F0&#x1F1F5`, name: `North Korea` },
      { emoji: `\u{1F1F0}\u{1F1F7}`, entity: `&#x1F1F0&#x1F1F7`, name: `South Korea` },
      { emoji: `\u{1F1F0}\u{1F1FC}`, entity: `&#x1F1F0&#x1F1FC`, name: `Kuwait` },
      { emoji: `\u{1F1F0}\u{1F1FE}`, entity: `&#x1F1F0&#x1F1FE`, name: `Cayman Islands` },
      { emoji: `\u{1F1F0}\u{1F1FF}`, entity: `&#x1F1F0&#x1F1FF`, name: `Kazakhstan` },
      { emoji: `\u{1F1F1}\u{1F1E6}`, entity: `&#x1F1F1&#x1F1E6`, name: `Laos` },
      { emoji: `\u{1F1F1}\u{1F1E7}`, entity: `&#x1F1F1&#x1F1E7`, name: `Lebanon` },
      { emoji: `\u{1F1F1}\u{1F1E8}`, entity: `&#x1F1F1&#x1F1E8`, name: `St. Lucia` },
      { emoji: `\u{1F1F1}\u{1F1EE}`, entity: `&#x1F1F1&#x1F1EE`, name: `Liechtenstein` },
      { emoji: `\u{1F1F1}\u{1F1F0}`, entity: `&#x1F1F1&#x1F1F0`, name: `Sri Lanka` },
      { emoji: `\u{1F1F1}\u{1F1F7}`, entity: `&#x1F1F1&#x1F1F7`, name: `Liberia` },
      { emoji: `\u{1F1F1}\u{1F1F8}`, entity: `&#x1F1F1&#x1F1F8`, name: `Lesotho` },
      { emoji: `\u{1F1F1}\u{1F1F9}`, entity: `&#x1F1F1&#x1F1F9`, name: `Lithuania` },
      { emoji: `\u{1F1F1}\u{1F1FA}`, entity: `&#x1F1F1&#x1F1FA`, name: `Luxembourg` },
      { emoji: `\u{1F1F1}\u{1F1FB}`, entity: `&#x1F1F1&#x1F1FB`, name: `Latvia` },
      { emoji: `\u{1F1F1}\u{1F1FE}`, entity: `&#x1F1F1&#x1F1FE`, name: `Libya` },
      { emoji: `\u{1F1F2}\u{1F1E6}`, entity: `&#x1F1F2&#x1F1E6`, name: `Morocco` },
      { emoji: `\u{1F1F2}\u{1F1E8}`, entity: `&#x1F1F2&#x1F1E8`, name: `Monaco` },
      { emoji: `\u{1F1F2}\u{1F1E9}`, entity: `&#x1F1F2&#x1F1E9`, name: `Moldova` },
      { emoji: `\u{1F1F2}\u{1F1EA}`, entity: `&#x1F1F2&#x1F1EA`, name: `Montenegro` },
      { emoji: `\u{1F1F2}\u{1F1EB}`, entity: `&#x1F1F2&#x1F1EB`, name: `St. Martin` },
      { emoji: `\u{1F1F2}\u{1F1EC}`, entity: `&#x1F1F2&#x1F1EC`, name: `Madagascar` },
      { emoji: `\u{1F1F2}\u{1F1ED}`, entity: `&#x1F1F2&#x1F1ED`, name: `Marshall Islands` },
      { emoji: `\u{1F1F2}\u{1F1F0}`, entity: `&#x1F1F2&#x1F1F0`, name: `Macedonia` },
      { emoji: `\u{1F1F2}\u{1F1F1}`, entity: `&#x1F1F2&#x1F1F1`, name: `Mali` },
      { emoji: `\u{1F1F2}\u{1F1F2}`, entity: `&#x1F1F2&#x1F1F2`, name: `Myanmar (Burma)` },
      { emoji: `\u{1F1F2}\u{1F1F3}`, entity: `&#x1F1F2&#x1F1F3`, name: `Mongolia` },
      { emoji: `\u{1F1F2}\u{1F1F4}`, entity: `&#x1F1F2&#x1F1F4`, name: `Macau SAR China` },
      { emoji: `\u{1F1F2}\u{1F1F5}`, entity: `&#x1F1F2&#x1F1F5`, name: `Northern Mariana Islands` },
      { emoji: `\u{1F1F2}\u{1F1F6}`, entity: `&#x1F1F2&#x1F1F6`, name: `Martinique` },
      { emoji: `\u{1F1F2}\u{1F1F7}`, entity: `&#x1F1F2&#x1F1F7`, name: `Mauritania` },
      { emoji: `\u{1F1F2}\u{1F1F8}`, entity: `&#x1F1F2&#x1F1F8`, name: `Montserrat` },
      { emoji: `\u{1F1F2}\u{1F1F9}`, entity: `&#x1F1F2&#x1F1F9`, name: `Malta` },
      { emoji: `\u{1F1F2}\u{1F1FA}`, entity: `&#x1F1F2&#x1F1FA`, name: `Mauritius` },
      { emoji: `\u{1F1F2}\u{1F1FB}`, entity: `&#x1F1F2&#x1F1FB`, name: `Maldives` },
      { emoji: `\u{1F1F2}\u{1F1FC}`, entity: `&#x1F1F2&#x1F1FC`, name: `Malawi` },
      { emoji: `\u{1F1F2}\u{1F1FD}`, entity: `&#x1F1F2&#x1F1FD`, name: `Mexico` },
      { emoji: `\u{1F1F2}\u{1F1FE}`, entity: `&#x1F1F2&#x1F1FE`, name: `Malaysia` },
      { emoji: `\u{1F1F2}\u{1F1FF}`, entity: `&#x1F1F2&#x1F1FF`, name: `Mozambique` },
      { emoji: `\u{1F1F3}\u{1F1E6}`, entity: `&#x1F1F3&#x1F1E6`, name: `Namibia` },
      { emoji: `\u{1F1F3}\u{1F1E8}`, entity: `&#x1F1F3&#x1F1E8`, name: `New Caledonia` },
      { emoji: `\u{1F1F3}\u{1F1EA}`, entity: `&#x1F1F3&#x1F1EA`, name: `Niger` },
      { emoji: `\u{1F1F3}\u{1F1EB}`, entity: `&#x1F1F3&#x1F1EB`, name: `Norfolk Island` },
      { emoji: `\u{1F1F3}\u{1F1EC}`, entity: `&#x1F1F3&#x1F1EC`, name: `Nigeria` },
      { emoji: `\u{1F1F3}\u{1F1EE}`, entity: `&#x1F1F3&#x1F1EE`, name: `Nicaragua` },
      { emoji: `\u{1F1F3}\u{1F1F1}`, entity: `&#x1F1F3&#x1F1F1`, name: `Netherlands` },
      { emoji: `\u{1F1F3}\u{1F1F4}`, entity: `&#x1F1F3&#x1F1F4`, name: `Norway` },
      { emoji: `\u{1F1F3}\u{1F1F5}`, entity: `&#x1F1F3&#x1F1F5`, name: `Nepal` },
      { emoji: `\u{1F1F3}\u{1F1F7}`, entity: `&#x1F1F3&#x1F1F7`, name: `Nauru` },
      { emoji: `\u{1F1F3}\u{1F1FA}`, entity: `&#x1F1F3&#x1F1FA`, name: `Niue` },
      { emoji: `\u{1F1F3}\u{1F1FF}`, entity: `&#x1F1F3&#x1F1FF`, name: `New Zealand` },
      { emoji: `\u{1F1F4}\u{1F1F2}`, entity: `&#x1F1F4&#x1F1F2`, name: `Oman` },
      { emoji: `\u{1F1F5}\u{1F1E6}`, entity: `&#x1F1F5&#x1F1E6`, name: `Panama` },
      { emoji: `\u{1F1F5}\u{1F1EA}`, entity: `&#x1F1F5&#x1F1EA`, name: `Peru` },
      { emoji: `\u{1F1F5}\u{1F1EB}`, entity: `&#x1F1F5&#x1F1EB`, name: `French Polynesia` },
      { emoji: `\u{1F1F5}\u{1F1EC}`, entity: `&#x1F1F5&#x1F1EC`, name: `Papua New Guinea` },
      { emoji: `\u{1F1F5}\u{1F1ED}`, entity: `&#x1F1F5&#x1F1ED`, name: `Philippines` },
      { emoji: `\u{1F1F5}\u{1F1F0}`, entity: `&#x1F1F5&#x1F1F0`, name: `Pakistan` },
      { emoji: `\u{1F1F5}\u{1F1F1}`, entity: `&#x1F1F5&#x1F1F1`, name: `Poland` },
      { emoji: `\u{1F1F5}\u{1F1F2}`, entity: `&#x1F1F5&#x1F1F2`, name: `St. Pierre & Miquelon` },
      { emoji: `\u{1F1F5}\u{1F1F3}`, entity: `&#x1F1F5&#x1F1F3`, name: `Pitcairn Islands` },
      { emoji: `\u{1F1F5}\u{1F1F7}`, entity: `&#x1F1F5&#x1F1F7`, name: `Puerto Rico` },
      { emoji: `\u{1F1F5}\u{1F1F8}`, entity: `&#x1F1F5&#x1F1F8`, name: `Palestinian Territories` },
      { emoji: `\u{1F1F5}\u{1F1F9}`, entity: `&#x1F1F5&#x1F1F9`, name: `Portugal` },
      { emoji: `\u{1F1F5}\u{1F1FC}`, entity: `&#x1F1F5&#x1F1FC`, name: `Palau` },
      { emoji: `\u{1F1F5}\u{1F1FE}`, entity: `&#x1F1F5&#x1F1FE`, name: `Paraguay` },
      { emoji: `\u{1F1F6}\u{1F1E6}`, entity: `&#x1F1F6&#x1F1E6`, name: `Qatar` },
      { emoji: `\u{1F1F7}\u{1F1EA}`, entity: `&#x1F1F7&#x1F1EA`, name: `Réunion` },
      { emoji: `\u{1F1F7}\u{1F1F4}`, entity: `&#x1F1F7&#x1F1F4`, name: `Romania` },
      { emoji: `\u{1F1F7}\u{1F1F8}`, entity: `&#x1F1F7&#x1F1F8`, name: `Serbia` },
      { emoji: `\u{1F1F7}\u{1F1FA}`, entity: `&#x1F1F7&#x1F1FA`, name: `Russia` },
      { emoji: `\u{1F1F7}\u{1F1FC}`, entity: `&#x1F1F7&#x1F1FC`, name: `Rwanda` },
      { emoji: `\u{1F1F8}\u{1F1E6}`, entity: `&#x1F1F8&#x1F1E6`, name: `Saudi Arabia` },
      { emoji: `\u{1F1F8}\u{1F1E7}`, entity: `&#x1F1F8&#x1F1E7`, name: `Solomon Islands` },
      { emoji: `\u{1F1F8}\u{1F1E8}`, entity: `&#x1F1F8&#x1F1E8`, name: `Seychelles` },
      { emoji: `\u{1F1F8}\u{1F1E9}`, entity: `&#x1F1F8&#x1F1E9`, name: `Sudan` },
      { emoji: `\u{1F1F8}\u{1F1EA}`, entity: `&#x1F1F8&#x1F1EA`, name: `Sweden` },
      { emoji: `\u{1F1F8}\u{1F1EC}`, entity: `&#x1F1F8&#x1F1EC`, name: `Singapore` },
      { emoji: `\u{1F1F8}\u{1F1ED}`, entity: `&#x1F1F8&#x1F1ED`, name: `St. Helena` },
      { emoji: `\u{1F1F8}\u{1F1EE}`, entity: `&#x1F1F8&#x1F1EE`, name: `Slovenia` },
      { emoji: `\u{1F1F8}\u{1F1EF}`, entity: `&#x1F1F8&#x1F1EF`, name: `Svalbard & Jan Mayen` },
      { emoji: `\u{1F1F8}\u{1F1F0}`, entity: `&#x1F1F8&#x1F1F0`, name: `Slovakia` },
      { emoji: `\u{1F1F8}\u{1F1F1}`, entity: `&#x1F1F8&#x1F1F1`, name: `Sierra Leone` },
      { emoji: `\u{1F1F8}\u{1F1F2}`, entity: `&#x1F1F8&#x1F1F2`, name: `San Marino` },
      { emoji: `\u{1F1F8}\u{1F1F3}`, entity: `&#x1F1F8&#x1F1F3`, name: `Senegal` },
      { emoji: `\u{1F1F8}\u{1F1F4}`, entity: `&#x1F1F8&#x1F1F4`, name: `Somalia` },
      { emoji: `\u{1F1F8}\u{1F1F7}`, entity: `&#x1F1F8&#x1F1F7`, name: `Suriname` },
      { emoji: `\u{1F1F8}\u{1F1F8}`, entity: `&#x1F1F8&#x1F1F8`, name: `South Sudan` },
      { emoji: `\u{1F1F8}\u{1F1F9}`, entity: `&#x1F1F8&#x1F1F9`, name: `São Tomé & Príncipe` },
      { emoji: `\u{1F1F8}\u{1F1FB}`, entity: `&#x1F1F8&#x1F1FB`, name: `El Salvador` },
      { emoji: `\u{1F1F8}\u{1F1FD}`, entity: `&#x1F1F8&#x1F1FD`, name: `Sint Maarten` },
      { emoji: `\u{1F1F8}\u{1F1FE}`, entity: `&#x1F1F8&#x1F1FE`, name: `Syria` },
      { emoji: `\u{1F1F8}\u{1F1FF}`, entity: `&#x1F1F8&#x1F1FF`, name: `Swaziland` },
      { emoji: `\u{1F1F9}\u{1F1E6}`, entity: `&#x1F1F9&#x1F1E6`, name: `Tristan Da Cunha` },
      { emoji: `\u{1F1F9}\u{1F1E8}`, entity: `&#x1F1F9&#x1F1E8`, name: `Turks & Caicos Islands` },
      { emoji: `\u{1F1F9}\u{1F1E9}`, entity: `&#x1F1F9&#x1F1E9`, name: `Chad` },
      { emoji: `\u{1F1F9}\u{1F1EB}`, entity: `&#x1F1F9&#x1F1EB`, name: `French Southern Territories` },
      { emoji: `\u{1F1F9}\u{1F1EC}`, entity: `&#x1F1F9&#x1F1EC`, name: `Togo` },
      { emoji: `\u{1F1F9}\u{1F1ED}`, entity: `&#x1F1F9&#x1F1ED`, name: `Thailand` },
      { emoji: `\u{1F1F9}\u{1F1EF}`, entity: `&#x1F1F9&#x1F1EF`, name: `Tajikistan` },
      { emoji: `\u{1F1F9}\u{1F1F0}`, entity: `&#x1F1F9&#x1F1F0`, name: `Tokelau` },
      { emoji: `\u{1F1F9}\u{1F1F1}`, entity: `&#x1F1F9&#x1F1F1`, name: `Timor-Leste` },
      { emoji: `\u{1F1F9}\u{1F1F2}`, entity: `&#x1F1F9&#x1F1F2`, name: `Turkmenistan` },
      { emoji: `\u{1F1F9}\u{1F1F3}`, entity: `&#x1F1F9&#x1F1F3`, name: `Tunisia` },
      { emoji: `\u{1F1F9}\u{1F1F4}`, entity: `&#x1F1F9&#x1F1F4`, name: `Tonga` },
      { emoji: `\u{1F1F9}\u{1F1F7}`, entity: `&#x1F1F9&#x1F1F7`, name: `Turkey` },
      { emoji: `\u{1F1F9}\u{1F1F9}`, entity: `&#x1F1F9&#x1F1F9`, name: `Trinidad & Tobago` },
      { emoji: `\u{1F1F9}\u{1F1FB}`, entity: `&#x1F1F9&#x1F1FB`, name: `Tuvalu` },
      { emoji: `\u{1F1F9}\u{1F1FC}`, entity: `&#x1F1F9&#x1F1FC`, name: `Taiwan` },
      { emoji: `\u{1F1F9}\u{1F1FF}`, entity: `&#x1F1F9&#x1F1FF`, name: `Tanzania` },
      { emoji: `\u{1F1FA}\u{1F1E6}`, entity: `&#x1F1FA&#x1F1E6`, name: `Ukraine` },
      { emoji: `\u{1F1FA}\u{1F1EC}`, entity: `&#x1F1FA&#x1F1EC`, name: `Uganda` },
      { emoji: `\u{1F1FA}\u{1F1F2}`, entity: `&#x1F1FA&#x1F1F2`, name: `U.S. Outlying Islands` },
      { emoji: `\u{1F1FA}\u{1F1F3}`, entity: `&#x1F1FA&#x1F1F3`, name: `United Nations` },
      { emoji: `\u{1F1FA}\u{1F1F8}`, entity: `&#x1F1FA&#x1F1F8`, name: `United States` },
      { emoji: `\u{1F1FA}\u{1F1FE}`, entity: `&#x1F1FA&#x1F1FE`, name: `Uruguay` },
      { emoji: `\u{1F1FA}\u{1F1FF}`, entity: `&#x1F1FA&#x1F1FF`, name: `Uzbekistan` },
      { emoji: `\u{1F1FB}\u{1F1E6}`, entity: `&#x1F1FB&#x1F1E6`, name: `Vatican City` },
      { emoji: `\u{1F1FB}\u{1F1E8}`, entity: `&#x1F1FB&#x1F1E8`, name: `St. Vincent & Grenadines` },
      { emoji: `\u{1F1FB}\u{1F1EA}`, entity: `&#x1F1FB&#x1F1EA`, name: `Venezuela` },
      { emoji: `\u{1F1FB}\u{1F1EC}`, entity: `&#x1F1FB&#x1F1EC`, name: `British Virgin Islands` },
      { emoji: `\u{1F1FB}\u{1F1EE}`, entity: `&#x1F1FB&#x1F1EE`, name: `U.S. Virgin Islands` },
      { emoji: `\u{1F1FB}\u{1F1F3}`, entity: `&#x1F1FB&#x1F1F3`, name: `Vietnam` },
      { emoji: `\u{1F1FB}\u{1F1FA}`, entity: `&#x1F1FB&#x1F1FA`, name: `Vanuatu` },
      { emoji: `\u{1F1FC}\u{1F1EB}`, entity: `&#x1F1FC&#x1F1EB`, name: `Wallis & Futuna` },
      { emoji: `\u{1F1FC}\u{1F1F8}`, entity: `&#x1F1FC&#x1F1F8`, name: `Samoa` },
      { emoji: `\u{1F1FD}\u{1F1F0}`, entity: `&#x1F1FD&#x1F1F0`, name: `Kosovo` },
      { emoji: `\u{1F1FE}\u{1F1EA}`, entity: `&#x1F1FE&#x1F1EA`, name: `Yemen` },
      { emoji: `\u{1F1FE}\u{1F1F9}`, entity: `&#x1F1FE&#x1F1F9`, name: `Mayotte` },
      { emoji: `\u{1F1FF}\u{1F1E6}`, entity: `&#x1F1FF&#x1F1E6`, name: `South Africa` },
      { emoji: `\u{1F1FF}\u{1F1F2}`, entity: `&#x1F1FF&#x1F1F2`, name: `Zambia` }
    ];
  }

  async function cfh_getEmojis() {
    let emojis = JSON.parse(await getValue(`emojis`, `[]`));
    return emojis
      .map(emoji => {
        if (emoji === `&#xAF&#x5C&#x5C&#x5F&#x28&#x30C4&#x29&#x5F&#x2F&#xAF`) {
          emoji = `&#xAF&#x5C&#x5C&#x5C&#x5F&#x28&#x30C4&#x29&#x5F&#x2F&#xAF`;
        }
        const emojiData = esgst.cfhEmojis.filter(x => x.emoji === emoji || x.entity === emoji)[0];
        emoji = emojiData.emoji;
        return {
          attributes: {
            [`data-id`]: emoji,
            title: emojiData.name
          },
          text: emoji,
          type: `span`
        };
      });
  }

  function cfh_setTextAreas(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} textarea[name*="description"], .esgst-es-page-${endless}textarea[name*="description"]` : `textarea[name*="description"]`}`);
    for (let i = elements.length - 1; i > -1; --i) {
      elements[i].onfocus = cfh_addPanel.bind(null, elements[i]);
    }
  }

  function cfh_addPanel(textArea) {
    if (textArea === esgst.cfh.textArea) return;

    const isNotMain = textArea.closest(`.esgst-popup, .esgst-popout`);
    if (isNotMain) {
      esgst.cfh.panel.style.top = `0px`;
    } else {
      esgst.cfh.panel.style.top = `${esgst.commentsTop}px`;
    }

    textArea.parentElement.insertBefore(esgst.cfh.panel, textArea);
    textArea.onfocus = cfh_addPanel.bind(null, textArea);
    textArea.onpaste = event => {
      if (esgst.cfh_pasteFormatting) {
        let clipboard, value;
        clipboard = event.clipboardData.getData(`text/plain`);
        if (clipboard.match(/^https?:/)) {
          event.preventDefault();
          value = textArea.value;
          cfh_undo(textArea, `${value.slice(0, textArea.selectionStart)}${clipboard}${value.slice(textArea.selectionEnd)}`);
          cfh_formatLink(``, clipboard, clipboard.match(/\.(jpg|jpeg|gif|bmp|png)/), true);
        }
      }
    };
    textArea.onkeydown = event => {
      if (event.key === `Backspace` && esgst.cfh.recent) {
        event.preventDefault();
        esgst.cfh.undo.click();
      }
      esgst.cfh.recent = false;
      if (!event.ctrlKey) {
        return;
      }
      if (event.key === `y` && (esgst.cfh.backup.length || esgst.cfh.history.length)) {
        event.preventDefault();
        esgst.cfh.redo.click();
      } else if (event.key === `z` && esgst.cfh.history.length) {
        event.preventDefault();
        esgst.cfh.undo.click();
      }
    };
    if (esgst.cfh_p) {
      esgst.cfh.preview.innerHTML = ``;
      textArea.parentElement.insertBefore(esgst.cfh.preview, textArea.nextElementSibling);
      if (esgst.cfh_p_a) {
        textArea.oninput = () => {
          createElements(esgst.cfh.preview, `inner`, parseMarkdown(textArea.value));
          cfh_formatImages(esgst.cfh.preview);
        };
      }
    }
    esgst.cfh.textArea = textArea;
  }

  function cfh_undo(textArea, value) {
    esgst.cfh.history.push(value);
    esgst.cfh.undo.classList.remove(`esgst-faded`);
  }

  function cfh_redo(textArea, value) {
    esgst.cfh.backup.push(value);
    esgst.cfh.redo.classList.remove(`esgst-faded`);
  }

  function cfh_formatItem(prefix = ``, suffix = ``, multiline) {
    let end, n, range, start, text, value;
    value = esgst.cfh.textArea.value;
    cfh_undo(esgst.cfh.textArea, value);
    start = esgst.cfh.textArea.selectionStart;
    end = esgst.cfh.textArea.selectionEnd;
    text = value.slice(start, end);
    range = text.length;
    if (multiline) {
      n = 0;
      text = text.replace(/^|\n/g, match => {
        return `${match}${prefix.replace(/\[n\]/, ++n)}`;
      });
    } else {
      text = `${prefix}${text}${suffix}`;
    }
    range += range > 0 ? start + text.length - range : start + text.length - range - suffix.length;
    esgst.cfh.textArea.value = `${value.slice(0, start)}${text}${value.slice(end)}`;
    esgst.cfh.textArea.setSelectionRange(range, range);
    esgst.cfh.textArea.focus();
    if (esgst.cfh_p && esgst.cfh_p_a) {
      createElements(esgst.cfh.preview, `inner`, parseMarkdown(esgst.cfh.textArea.value));
      cfh_formatImages(esgst.cfh.preview);
    }
  }

  function cfh_formatLink(title, url, isImage, isPaste) {
    let end, start, value;
    if (isPaste) {
      esgst.cfh.recent = true;
    } else {
      cfh_undo(esgst.cfh.textArea, esgst.cfh.textArea.value);
    }
    start = esgst.cfh.textArea.selectionStart;
    end = esgst.cfh.textArea.selectionEnd;
    value = isImage ? `![${title}](${url})` : `[${title}](${url})`;
    esgst.cfh.textArea.value = `${esgst.cfh.textArea.value.slice(0, start)}${value}${esgst.cfh.textArea.value.slice(end)}`;
    if (title) {
      esgst.cfh.textArea.setSelectionRange(end + value.length, end + value.length);
    } else {
      esgst.cfh.textArea.setSelectionRange(end + value.indexOf(`[`) + 1, end + value.indexOf(`[`) + 1);
    }
    esgst.cfh.textArea.focus();
    if (esgst.cfh_p && esgst.cfh_p_a) {
      createElements(esgst.cfh.preview, `inner`, parseMarkdown(esgst.cfh.textArea.value));
      cfh_formatImages(esgst.cfh.preview);
    }
  }

  async function cfh_checkImgur(popout, url) {
    let value = await getValue(`imgurToken`);
    if (value) {
      cfh_uploadImage(`Bearer ${value}`, popout, url);
    } else {
      setTimeout(() => cfh_checkImgur(popout, url), 250);
    }
  }

  function cfh_uploadImage(authorization, popout, url) {
    let input, popup, warning;
    popup = new Popup(`fa-upload`, `Upload Image`, true);
    input = createElements(popup.description, `beforeEnd`, [{
      attributes: {
        type: `file`
      },
      type: `input`
    }]);
    warning = createElements(popup.description, `beforeEnd`, [{
      attributes: {
        class: `esgst-description esgst-warning`
      },
      type: `div`
    }]);
    popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-upload`, `fa-circle-o-notch fa-spin`, `Upload`, `Uploading...`, callback => {
      let file = input.files[0];
      if (file) {
        if (file.type.match(/^image/)) {
          if (file.size / 1024 / 1024 <= 10) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = cfh_readImgur.bind(null, authorization, popout, popup, reader, url, warning, callback);
          } else {
            createFadeMessage(warning, `Image is larger than 10 MB!`);
            callback();
          }
        } else {
          createFadeMessage(warning, `File is not an image!`);
          callback();
        }
      } else {
        createFadeMessage(warning, `No file was loaded!`);
        callback();
      }
    }).set);
    if (esgst.cfh_img_remember) {
      popup.description.appendChild(new ButtonSet_v2({color1: `grey`, color2: `grey`, icon1: `fa-rotate-left`, icon2: `fa-circle-o-notch fa-spin`, title1: `Reset`, title2: `Resetting...`, callback1: async () => {
        await setSetting(`cfh_img_remember`, false);
        esgst.cfh_img_remember = false;
        popup.close();
      }}).set);
    }
    popup.open();
  }

  async function cfh_readImgur(authorization, popout, popup, reader, url, warning, callback) {
    let responseJson = JSON.parse((await request({data: `image=${encodeURIComponent(reader.result.match(/base64,(.+)/)[1])}`, headers: {authorization}, method: `POST`, url: `https://api.imgur.com/3/image`})).responseText);
    if (responseJson.success) {
      callback();
      popup.close();
      url.value = responseJson.data.link;
      popout.open();
    } else {
      createFadeMessage(warning, `Could not upload image!`);
      callback();
    }
  }

  function cfh_insertTableRows(rows, table) {
    let deleteRow, i, j, n, row;
    while (rows > 0) {
      n = table.rows.length;
      row = table.insertRow(n);
      for (i = 0, j = table.rows[0].cells.length - 1; i < j; ++i) {
        createElements(row.insertCell(0), `inner`, [{
          attributes: {
            placeholder: `Value`,
            type: `text`
          },
          type: `input`
        }]);
      }
      deleteRow = row.insertCell(0);
      if (n > 2) {
        createElements(deleteRow, `inner`, [{
          type: `a`,
          children: [{
            attributes: {
              class: `fa fa-times-circle`,
              title: `Delete row`
            },
            type: `i`
          }]
        }]);
        deleteRow.firstElementChild.addEventListener(`click`, () => {
          if (table.rows.length > 4) {
            deleteRow.remove();
            row.remove();
          } else {
              alert(`A table must have a least one row and two columns.`);
          }
        });
      }
      --rows;
    }
  }

  function cfh_insertTableColumns(columns, table) {
    let column, deleteColumn, i, j, n, rows;
    while (columns > 0) {
      rows = table.rows;
      n = rows[0].cells.length;
      for (i = 3, j = rows.length; i < j; ++i) {
        createElements(rows[i].insertCell(n), `inner`, [{
          attributes: {
            placeholder: `Value`,
            type: `text`
          },
          type: `input`
        }]);
      }
      createElements(rows[2].insertCell(n), `inner`, [{
        type: `select`,
        children: [{
          attributes: {
            value: `:-`
          },
          text: `Left`,
          type: `option`
        }, {
          attributes: {
            value: `:-:`
          },
          text: `Center`,
          type: `option`
        }, {
          attributes: {
            value: `-:`
          },
          text: `Right`,
          type: `option`
        }]
      }]);
      column = rows[1].insertCell(n);
      createElements(column, `inner`, [{
        attributes: {
          placeholder: `Header`,
          type: `text`
        },
        type: `input`
      }]);
      deleteColumn = rows[0].insertCell(n);
      createElements(deleteColumn, `inner`, [{
        type: `a`,
        children: [{
          attributes: {
            class: `fa fa-times-circle`,
            title: `Delete column`
          },
          type: `i`
        }]
      }]);
      deleteColumn.firstElementChild.addEventListener(`click`, () => {
        rows = table.rows;
        n = rows[1].cells.length;
        if (n > 3) {
          do {
            --n;
          } while (rows[1].cells[n] !== column);
          for (i = 0, j = rows.length; i < j; ++i) {
            rows[i].deleteCell(n);
          }
        } else {
            alert(`A table must have at least one row and two columns.`);
        }
      });
      --columns;
    }
  }

  function cfh_setEmojis(emojis) {
    let emoji, i;
    for (i = emojis.children.length - 1; i > -1; --i) {
      emoji = emojis.children[i];
      emoji.addEventListener(`click`, cfh_formatItem.bind(null, emoji.textContent, ``));
    }
  }

  function cfh_setReply(replies, savedReply) {
    let editButton, description, name, replaceButton, reply, summary;
    reply = createElements(replies, `beforeEnd`, [{
      attributes: {
        class: `esgst-cfh-sr-box`,
        draggable: true
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-cfh-sr-summary`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-cfh-sr-name`
          },
          text: savedReply.name,
          type: `div`
        }, {
          attributes: {
            class: `esgst-cfh-sr-description`
          },
          text: savedReply.description,
          type: `div`
        }]
      }, {
        attributes: {
          class: `esgst-cfh-sr-controls`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-clickable fa fa-retweet`,
            title: `Replace description with current reply`
          },
          type: `i`
        }, {
          attributes: {
            class: `esgst-clickable fa fa-edit`,
            title: `Edit reply`
          },
          type: `i`
        }, {
          attributes: {
            class: `esgst-clickable fa fa-trash`,
            title: `Delete reply`
          },
          type: `i`
        }, {
          attributes: {
            class: `fa fa-question-circle`,
            title: `Drag the reply to move it`
          },
          type: `i`
        }]
      }]
    }]);
    summary = reply.firstElementChild;
    name = summary.firstElementChild;
    description = name.nextElementSibling;
    replaceButton = summary.nextElementSibling.firstElementChild;
    editButton = replaceButton.nextElementSibling;
    reply.addEventListener(`dragstart`, cfh_setSource.bind(null, description, name, reply));
    reply.addEventListener(`dragenter`, cfh_getSource.bind(null, reply, replies));
    reply.addEventListener(`dragend`, cfh_saveSource);
    summary.addEventListener(`click`, () => {
      cfh_undo(esgst.cfh.textArea, esgst.cfh.textArea.value);
      let end, i, matches, n, value;
      end = esgst.cfh.textArea.selectionEnd;
      value = savedReply.description;
      matches = value.match(/\[ESGST-R\][\s\S]+?\[\/ESGST-R\]/g);
      if (matches) {
        n = matches.length;
        i = Math.floor(Math.random() * n);
        value = matches[i].match(/\[ESGST-R\]([\s\S]+?)\[\/ESGST-R\]/)[1];
      }
      esgst.cfh.textArea.value = `${esgst.cfh.textArea.value.slice(0, esgst.cfh.textArea.selectionStart)}${value}${esgst.cfh.textArea.value.slice(end)}`;
      esgst.cfh.textArea.setSelectionRange(end + value.length, end + value.length);
      esgst.cfh.textArea.focus();
    });
    editButton.addEventListener(`click`, cfh_openReplyPopup.bind(null, savedReply.description, savedReply.name, replies, summary));
    replaceButton.addEventListener(`click`, () => cfh_saveReply(savedReply.description, esgst.cfh.textArea, savedReply.name, null, null, replies, summary, null));
    editButton.nextElementSibling.addEventListener(`click`, async () => {
      let savedReplies = JSON.parse(await getValue(`savedReplies`, `[]`));
      let i;
      for (i = savedReplies.length - 1; i > -1 && (savedReplies[i].name !== name.textContent || savedReplies[i].description !== description.textContent); i--);
      if (i > -1) {
        savedReplies.splice(i, 1);
        setValue(`savedReplies`, JSON.stringify(savedReplies));
        reply.classList.add(`esgst-hidden`);
        esgst.cfh.deletedReplies.push({
          reply: reply,
          savedReply: savedReply
        });
        esgst.cfh.undoDelete.classList.remove(`esgst-hidden`);
      }
    });
  }

  async function cfh_setSource(description, name, reply, event) {
    let i, savedReplies;
    event.dataTransfer.setData(`text/plain`, ``);
    esgst.cfh.source = reply;
    savedReplies = JSON.parse(await getValue(`savedReplies`, `[]`));
    for (i = savedReplies.length - 1; i > -1 && (savedReplies[i].name !== name.textContent || savedReplies[i].description !== description.textContent); --i);
    if (i > -1) {
      esgst.cfh.sourceIndex = i;
    }
  }

  function cfh_getSource(reply, replies) {
    let current, i;
    current = esgst.cfh.source;
    i = 0;
    do {
      current = current.previousElementSibling;
      if (current && current === reply) {
        esgst.cfh.sourceNewIndex = i;
        replies.insertBefore(esgst.cfh.source, reply);
        return;
      }
      ++i;
    } while (current);
    esgst.cfh.sourceNewIndex = i - 1;
    replies.insertBefore(esgst.cfh.source, reply.nextElementSibling);
  }

  async function cfh_saveSource() {
    let savedReplies = JSON.parse(await getValue(`savedReplies`, `[]`));
    savedReplies.splice(esgst.cfh.sourceNewIndex, 0, savedReplies.splice(esgst.cfh.sourceIndex, 1)[0]);
    setValue(`savedReplies`, JSON.stringify(savedReplies));
  }

  function cfh_openReplyPopup(description, name, replies, summary) {
    let descriptionArea, nameArea, panel, popup;
    popup = new Popup(`fa-floppy-o`, summary ? `Edit reply:` : `Save new reply:`, true);
    createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-description`
      },
      type: `div`,
      children: [{
        text: `You can save a defined list of replies to be picked at random when using it. To do so, enclose each option with `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-bold`
        },
        text: `[ESGST-R][/ESGST-R]`,
        type: `span`
      }, {
        text: `. For example, a defined list that renders a random "thank you" comment when using it would look like this:`,
        type: `node`
      }, {
        type: `br`
      }, {
        type: `br`
      }, {
        text: `[ESGST-R]Thanks![/ESGST-R]`,
        type: `node`
      }, {
        type: `br`
      }, {
        text: `[ESGST-R]Thank you![/ESGST-R]`,
        type: `node`
      }, {
        type: `br`
      }, {
        text: `[ESGST-R]Thank you so much!`,
        type: `node`
      }, {
        type: `br`
      }, {
        type: `br`
      }, {
        text: `Can't wait to play this game![/ESGST-R]`,
        type: `node`
      }]
    }]);
    panel = createElements(popup.scrollable, `beforeEnd`, [{
      type: `div`,
      children: [{
        type: `div`,
        children: [{
          text: `Name`,
          type: `div`
        }, {
          attributes: {
            type: `text`,
            value: name || ``
          },
          type: `input`
        }]
      }, {
        type: `div`,
        children: [{
          text: `Description:`,
          type: `div`
        }, {
          text: description || ``,
          type: `textarea`
        }]
      }]
    }]);
    nameArea = panel.firstElementChild;
    descriptionArea = nameArea.nextElementSibling;
    nameArea = nameArea.lastElementChild;
    descriptionArea = descriptionArea.lastElementChild;
    if (esgst.cfh) {
      cfh_addPanel(descriptionArea);
    }
    popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-check`, `fa-circle-o-notch fa-spin`, `Save`, `Saving...`, cfh_saveReply.bind(null, description, descriptionArea, name, nameArea, popup, replies, summary)).set);
    popup.open();
  }

  async function cfh_saveReply(description, descriptionArea, name, nameArea, popup, replies, summary, callback) {
    let [descVal, nameVal] = [descriptionArea ? descriptionArea.value.trim() : description, nameArea ? nameArea.value.trim() : name];
    if (descVal && nameVal) {
      let savedReplies = JSON.parse(await getValue(`savedReplies`, `[]`));
      let savedReply = {
        description: descVal,
        name: nameVal
      };
      if (summary) {
        let i;
        for (i = savedReplies.length - 1; i > -1 && (savedReplies[i].name !== name || savedReplies[i].description !== description); i--);
        if (i > -1) {
          savedReplies[i] = savedReply;
          summary.firstElementChild.textContent = nameVal;
          summary.lastElementChild.textContent = descVal;
        }
      } else {
        savedReplies.push(savedReply);
        cfh_setReply(replies, savedReply);
      }
      await setValue(`savedReplies`, JSON.stringify(savedReplies));
      if (callback) {
        callback();
        popup.close();
      }
    } else if (callback) {
      callback();
      createAlert(`Both fields are required.`);
    }
  }

  function cfh_filterReplies(replies, event) {
    let i, reply, value;
    value = event.currentTarget.value;
    for (i = replies.children.length - 1; i > -1; --i) {
      reply = replies.children[i];
      if (reply.textContent.toLowerCase().match(value.toLowerCase())) {
        reply.classList.remove(`esgst-hidden`);
      } else {
        reply.classList.add(`esgst-hidden`);
      }
    }
  }

  async function cfh_undoDelete() {
    let deleted, saved;
    deleted = esgst.cfh.deletedReplies.pop();
    deleted.reply.classList.remove(`esgst-hidden`);
    deleted.reply.parentElement.appendChild(deleted.reply);
    saved = JSON.parse(await getValue(`savedReplies`, `[]`));
    saved.push(deleted.savedReply);
    setValue(`savedReplies`, JSON.stringify(saved));
    if (esgst.cfh.deletedReplies.length === 0) {
      esgst.cfh.undoDelete.classList.add(`esgst-hidden`);
    }
  }

  function cfh_setAlipf(value, firstTime) {
    if (typeof value === `undefined`) {
      value = esgst.cfh_pasteFormatting ? false : true;
    }
    if (!firstTime) {
      setSetting(`cfh_pasteFormatting`, value);
    }
    esgst.cfh_pasteFormatting = value;
    if (value) {
      esgst.cfh.alipf.title = getFeatureTooltip(`cfh`, `Automatic Links / Images Paste Formatting: ON`);
      esgst.cfh.alipf.classList.remove(`esgst-faded`);
    } else {
      esgst.cfh.alipf.title = getFeatureTooltip(`cfh`, `Automatic Links / Images Paste Formatting: OFF`);
      esgst.cfh.alipf.classList.add(`esgst-faded`);
    }
    if (esgst.cfh.textArea) {
      esgst.cfh.textArea.focus();
    }
  }

  function cfh_formatImages(context) {
    let i, images, n;
    images = context.getElementsByTagName(`img`);
    for (i = 0, n = images.length; i < n; ++i) {
      const image = images[0];
      context.appendChild(image);
      image.classList.add(`is-hidden`, `is_hidden`);
      createElements(image, `outer`, [{
        type: `div`,
        children: [{
          attributes: {
            class: `${esgst.sg ? `comment__toggle-attached` : `view_attached`}`
          },
          text: `View attached image.`,
          type: `div`
        }, {
          attributes: {
            href: image.getAttribute(`src`),
            rel: `nofollow noreferrer`,
            target: `_blank`
          },
          type: `a`,
          children: [{
            context: image.cloneNode(true)
          }]
        }]
      }]);
    }
  }

