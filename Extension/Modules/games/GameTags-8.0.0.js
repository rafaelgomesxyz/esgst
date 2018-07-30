_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-tag"></i>) next to a game's name (in any page) that allows you to save tags for the game (only visible to you).</li>
        <li>You can press Enter to save the tags.</li>
        <li>Each tag can be colored individually.</li>
        <li>There is a button (<i class="fa fa-list"></i>) in the tags popup that allows you to view a list with all of the tags that you have used ordered from most used to least used.</li>
        <li>Adds a button (<i class="fa fa-gamepad"></i> <i class="fa fa-tags"></i>) to the page heading of this menu that allows you to manage all of the tags that have been saved.</li>
      </ul>
    `,
    id: `gt`,
    name: `Game Tags`,
    sg: true,
    type: `games`
  });

  async function gt_openPopup(id, name, type) {
    let popup = new Popup(`fa-tag`, [{
      text: `Edit game tags for `,
      type: `node`
    }, {
      text: name,
      type: `span`
    }, {
      text: `:`,
      type: `node`
    }]);
    let set = new ButtonSet(`green`, `grey`, `fa-check`, `fa-circle-o-notch fa-spin`, `Save`, `Saving...`, gt_saveTags.bind(null, id, popup, type));
    createElements(popup.description, `beforeEnd`, [{
      attributes: {
        class: `esgst-description`
      },
      type: `div`,
      children: [{
        text: `Drag the tags to move them.`,
        type: `p`
      }, {
        type: `br`
      }, {
        text: `When editing a tag color, it will also alter the color for all games with that tag (you have to refresh the page for it to take effect).`,
        type: `p`
      }]
    }]);
    popup.tags = createElements(popup.description, `beforeEnd`, [{
      attributes: {
        class: `esgst-gt-tags`
      },
      type: `div`
    }]);
    popup.input = createElements(popup.description, `beforeEnd`, [{
      attributes: {
        type: `text`
      },
      type: `input`
    }]);
    createElements(popup.description, `beforeEnd`, [{
      attributes: {
        class: `esgst-ut-existing-button esgst-clickable fa fa-list`,
        title: `Select from existing tags`
      },
      type: `i`
    }]).addEventListener(`click`, gt_showExistingTags.bind(null, popup));
    popup.input.addEventListener(`keydown`, triggerSetOnEnter.bind(null, set));
    popup.input.addEventListener(`input`, gt_createTags.bind(null, popup));
    createElements(popup.description, `beforeEnd`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `Use commas to separate tags, for example: Tag1, Tag2, ...`,
      type: `div`
    }]);
    popup.description.appendChild(set.set);
    popup.open();
    let savedGames = JSON.parse(await getValue(`games`));
    let game = savedGames[type][id];
    popup.input.focus();
    if (game) {
      let tags = game.tags;
      if (tags) {
        popup.tags.innerHTML = ``;
        for (let i = 0, n = tags.length; i < n; ++i) {
          gt_createTag(popup, tags[i]);
        }
        popup.input.value = tags.join(`, `);
      }
    }
  }

  async function gt_showExistingTags(mainPopup) {
    let key, list, popup, savedGames, selectedTags, tag, tagCount, tags;
    popup = new Popup(`fa-list`, `Select from existing tags:`, true);
    tagCount = {};
    savedGames = JSON.parse(await getValue(`games`));
    for (key in savedGames.apps) {
      tags = savedGames.apps[key].tags;
      if (tags) {
        tags.forEach(tag => {
          if (!tagCount[tag]) {
            tagCount[tag] = 0;
          }
          tagCount[tag] += 1;
        });
      }
    }
    for (key in savedGames.subs) {
      tags = savedGames.subs[key].tags;
      if (tags) {
        tags.forEach(tag => {
          if (!tagCount[tag]) {
            tagCount[tag] = 0;
          }
          tagCount[tag] += 1;
        });
      }
    }
    tags = [];
    for (tag in tagCount) {
      tags.push({
        count: tagCount[tag],
        tag: tag
      });
    }
    list = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-ut-existing-tags popup__keys__list`
      },
      type: `div`
    }]);
    selectedTags = [];
    tags = sortArray(tags, true, `count`);
    tags.forEach(tag => {
      let checkbox, item;
      tag = tag.tag;
      item = createElements(list, `beforeEnd`, [{
        type: `div`,
        children: [{
          type: `span`
        }, {
          text: ` ${tag}`,
          type: `node`
        }]
      }]);
      if (esgst.gt_colors[tag]) {
        item.style.color = esgst.gt_colors[tag].color;
        item.style.backgroundColor = esgst.gt_colors[tag].bgColor;
      }
      checkbox = new Checkbox(item);
      checkbox.onEnabled = () => {
        selectedTags.push(tag);
      };
      checkbox.onDisabled = () => {
        selectedTags.splice(selectedTags.indexOf(tag), 1);
      };
    });
    popup.description.appendChild(new ButtonSet(`green`, ``, `fa-check`, ``, `Add Tags`, ``, callback => {
      selectedTags.forEach(tag => {
        gt_createTag(mainPopup, tag);
      });
      mainPopup.input.value = mainPopup.input.value ? `${mainPopup.input.value}, ${selectedTags.join(`, `)}` : selectedTags.join(`, `);
      callback();
      popup.close();
    }).set);
    popup.open();
  }

  function gt_createTags(popup) {
    let i, n, tags;
    tags = popup.input.value.replace(/(,\s*)+/g, formatTags).split(`, `);
    popup.tags.innerHTML = ``;
    for (i = 0, n = tags.length; i < n; ++i) {
      gt_createTag(popup, tags[i]);
    }
  }

  function gt_createTag(popup, tag) {
    let bgColorInput, colorInput, colors, container, deleteButton, editButton, input, tagBox, tagContainer;
    container = createElements(popup.tags, `beforeEnd`, [{
      attributes: {
        class: `esgst-gt-preview`,
        draggable: true
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-gt-tags`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `global__image-outer-wrap author_avatar is_icon`
          },
          text: tag,
          type: `span`
        }]
      }, {
        attributes: {
          class: `esgst-hidden`,
          type: `text`
        },
        type: `input`
      }, {
        attributes: {
          title: `Set text color for this tag`,
          type: `color`
        },
        type: `input`
      }, {
        attributes: {
          title: `Set background color for this tag`,
          type: `color`
        },
        type: `input`
      }, {
        attributes: {
          class: `esgst-clickable fa fa-edit`,
          title: `Edit tag`
        },
        type: `i`
      }, {
        attributes: {
          class: `esgst-clickable fa fa-trash`,
          title: `Delete tag`
        },
        type: `i`
      }, {
        attributes: {
          class: `esgst-clickable fa fa-rotate-left`,
          title: `Reset tag color`
        },
        type: `i`
      }]
    }]);
    tagContainer = container.firstElementChild;
    tagBox = tagContainer.firstElementChild;
    input = tagContainer.nextElementSibling;
    colorInput = input.nextElementSibling;
    bgColorInput = colorInput.nextElementSibling;
    editButton = bgColorInput.nextElementSibling;
    deleteButton = editButton.nextElementSibling;
    const resetButton = deleteButton.nextElementSibling;
    colors = esgst.gt_colors[tag];
    if (colors) {
      colorInput.value = tagBox.style.color = colors.color;
      bgColorInput.value = tagBox.style.backgroundColor = colors.bgColor;
    }
    container.addEventListener(`dragstart`, gt_startDrag.bind(null, container, popup));
    container.addEventListener(`dragenter`, gt_continueDrag.bind(null, container, popup));
    container.addEventListener(`dragend`, gt_endDrag.bind(null, popup));
    input.addEventListener(`keydown`, gt_editTag.bind(null, bgColorInput, colorInput, input, popup, tagBox, tagContainer));
    colorInput.addEventListener(`change`, gt_saveColor.bind(null, colorInput, `color`, `color`, tagBox));
    bgColorInput.addEventListener(`change`, gt_saveColor.bind(null, bgColorInput, `backgroundColor`, `bgColor`, tagBox));
    editButton.addEventListener(`click`, gt_showEdit.bind(null, input, tagBox, tagContainer));
    deleteButton.addEventListener(`click`, gt_deleteTag.bind(null, container, popup));
    resetButton.addEventListener(`click`, gt_resetColor.bind(null, bgColorInput, colorInput, tagBox));
  }

  function gt_startDrag(container, popup, event) {
    event.dataTransfer.setData(`text/plain`, ``);
    popup.dragged = container;
  }

  function gt_continueDrag(container, popup) {
    let current;
    current = popup.dragged;
    do {
      current = current.previousElementSibling;
      if (current && current === container) {
        popup.tags.insertBefore(popup.dragged, container);
        return;
      }
    } while (current);
    popup.tags.insertBefore(popup.dragged, container.nextElementSibling);
  }

  function gt_endDrag(popup) {
    let children, i, n, tags;
    tags = [];
    children = popup.tags.children;
    for (i = 0, n = children.length; i < n; ++i) {
      tags.push(children[i].firstElementChild.firstElementChild.textContent);
    }
    popup.input.value = tags.join(`, `);
  }

  function gt_editTag(bgColorInput, colorInput, input, popup, tagBox, tagContainer, event) {
    let colors, tag;
    if (event.key === `Enter`) {
      tagContainer.classList.remove(`esgst-hidden`);
      input.classList.add(`esgst-hidden`);
      tag = input.value;
      tagBox.textContent = tag;
      colors = esgst.gt_colors[tag];
      if (colors) {
        colorInput.value = tagBox.style.color = colors.color;
        bgColorInput.value = tagBox.style.backgroundColor = colors.bgColor;
      }
      gt_endDrag(popup);
    }
  }

  function gt_saveColor(input, key, saveKey, tagBox) {
    let tag;
    tag = tagBox.textContent;
    if (!esgst.gt_colors[tag]) {
      esgst.gt_colors[tag] = {
        bgColor: ``,
        color: ``
      };
    }
    esgst.gt_colors[tag][saveKey] = tagBox.style[key] = input.value;
  }

  function gt_resetColor(bgColorInput, colorInput, tagBox) {
    bgColorInput.value = ``;
    colorInput.value = ``;
    tagBox.style.backgroundColor = ``;
    tagBox.style.color = ``;
    delete esgst.gt_colors[tagBox.textContent];
  }

  function gt_showEdit(input, tagBox, tagContainer) {
    tagContainer.classList.add(`esgst-hidden`);
    input.classList.remove(`esgst-hidden`);
    input.value = tagBox.textContent;
    input.focus();
  }

  function gt_deleteTag(container, popup) {
    container.remove();
    gt_endDrag(popup);
  }

  async function gt_saveTags(id, popup, type, callback) {
    let tags = popup.input.value.replace(/(,\s*)+/g, formatTags).split(`, `);
    if (tags.length === 1 && !tags[0].trim()) {
      tags = ``;
    }
    let deleteLock = await createLock(`gameLock`, 300);
    let savedGames = JSON.parse(await getValue(`games`));
    if (!savedGames[type][id]) {
      savedGames[type][id] = {};
    }
    savedGames[type][id].tags = tags;
    await setValue(`games`, JSON.stringify(savedGames));
    deleteLock();
    await setSetting(`gt_colors`, esgst.gt_colors);
    gt_addTags(null, id, tags, type);
    callback();
    popup.close();
  }

  function gt_template(text) {
    return {
      attributes: {
        class: `global__image-outer-wrap author_avatar is_icon`
      },
      text,
      type: `span`
    };
  }

  async function gt_addTags(games, id, tags, type) {
    if (!games) {
      games = games_get(document, true, JSON.parse(await getValue(`games`)))[type][id];
    }
    if (!games) {
      return;
    }
    const items = tags.length && tags[0] ? tags.map(x => gt_template(x)) : [{
      text: ``,
      type: `node`
    }];
    for (const game of games) {
      const button = game.container.getElementsByClassName(`esgst-gt-button`)[0];
      button.classList[items ? `remove` : `add`](`esgst-faded`);
      const tagsContainer = button.lastElementChild;
      createElements(tagsContainer, `inner`, items);
      for (const tagsBox of tagsContainer.children) {
        const colors = esgst.gt_colors[tagsBox.textContent];
        if (!colors) {
          continue;
        }
        tagsBox.style.color = colors.color;
        tagsBox.style.backgroundColor = colors.bgColor;
      }
    }
  }

