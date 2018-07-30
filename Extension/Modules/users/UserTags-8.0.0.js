_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-tag"></i>) next a user's username (in any page) that allows you to save tags for the user (only visible to you).</li>
        <li>You can press Enter to save the tags.</li>
        <li>Each tag can be colored individually.</li>
        <li>There is a button (<i class="fa fa-list"></i>) in the tags popup that allows you to view a list with all of the tags that you have used ordered from most used to least used.</li>
        <li>Adds a button (<i class="fa fa-user"></i> <i class="fa fa-tags"></i>) to the page heading of this menu that allows you to manage all of the tags that have been saved.</li>
        <li>This feature is recommended for cases where you want to associate a short text with a user, since the tags are displayed next to their username. For a long text, check [id=un].</li>
      </ul>
    `,
    id: `ut`,
    name: `User Tags`,
    sg: true,
    st: true,
    type: `users`
  });

  function ut_addButton(context, key, steamId, username) {
    const isHeading = context.classList.contains(`featured__heading__medium`);
    const container = context.parentElement;
    if (container.classList.contains(`comment__username`)) {
      context = container;
    }
    createElements(isHeading ? container : context, isHeading ? `beforeEnd` : `afterEnd`, [{
      attributes: {
        class: `esgst-ut-button esgst-faded`,
        title: getFeatureTooltip(`ut`, `Edit user tags`)
      },
      type: `a`,
      children: [{
        attributes: {
          class: `fa fa-tag`
        },
        type: `i`
      }, {
        attributes: {
          class: `esgst-ut-tags`
        },
        type: `span`
      }]
    }]).addEventListener(`click`, ut_openPopup.bind(null, key, steamId, username));
  }

  function ut_openPopup(key, steamId, username) {
    let popup, set;
    const user = {
      steamId: steamId,
      username: username
    };
    popup = new Popup(`fa-tag`, [{
      text: `Edit user tags for `,
      type: `node`
    }, {
      text: key,
      type: `span`
    }, {
      text: `:`,
      type: `node`
    }]);
    set = new ButtonSet(`green`, `grey`, `fa-check`, `fa-circle-o-notch fa-spin`, `Save`, `Saving...`, ut_saveTags.bind(null, key, popup, user));
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
        text: `When editing a tag color, it will also alter the color for all users with that tag (you have to refresh the page for it to take effect).`,
        type: `p`
      }]
    }]);
    popup.tags = createElements(popup.description, `beforeEnd`, [{
      attributes: {
        class: `esgst-ut-tags`
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
    }]).addEventListener(`click`, ut_showExistingTags.bind(null, popup));
    popup.input.addEventListener(`keydown`, triggerSetOnEnter.bind(null, set));
    popup.input.addEventListener(`input`, ut_createTags.bind(null, popup));
    createElements(popup.description, `beforeEnd`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `Use commas to separate tags, for example: Tag1, Tag2, ...`,
      type: `div`
    }]);
    popup.description.appendChild(set.set);
    popup.open(ut_loadTags.bind(null, popup, user));
  }

  async function ut_showExistingTags(mainPopup) {
    let key, list, popup, savedUsers, selectedTags, tag, tagCount, tags;
    popup = new Popup(`fa-list`, `Select from existing tags:`, true);
    tagCount = {};
    savedUsers = JSON.parse(await getValue(`users`)).users;
    for (key in savedUsers) {
      tags = savedUsers[key].tags;
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
      if (esgst.ut_colors[tag]) {
        item.style.color = esgst.ut_colors[tag].color;
        item.style.backgroundColor = esgst.ut_colors[tag].bgColor;
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
        ut_createTag(mainPopup, tag);
      });
      mainPopup.input.value = mainPopup.input.value ? `${mainPopup.input.value}, ${selectedTags.join(`, `)}` : selectedTags.join(`, `);
      callback();
      popup.close();
    }).set);
    popup.open();
  }

  function ut_createTags(popup) {
    let i, n, tags;
    tags = popup.input.value.replace(/(,\s*)+/g, formatTags).split(`, `);
    popup.tags.innerHTML = ``;
    for (i = 0, n = tags.length; i < n; ++i) {
      ut_createTag(popup, tags[i]);
    }
  }

  function ut_createTag(popup, tag) {
    let bgColorInput, colorInput, colors, container, deleteButton, editButton, input, resetButton, tagBox, tagContainer;
    container = createElements(popup.tags, `beforeEnd`, [{
      attributes: {
        class: `esgst-ut-preview`,
        draggable: true
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-ut-tags`
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
    resetButton = deleteButton.nextElementSibling;
    colors = esgst.ut_colors[tag];
    if (colors) {
      colorInput.value = tagBox.style.color = colors.color;
      bgColorInput.value = tagBox.style.backgroundColor = colors.bgColor;
    }
    container.addEventListener(`dragstart`, ut_startDrag.bind(null, container, popup));
    container.addEventListener(`dragenter`, ut_continueDrag.bind(null, container, popup));
    container.addEventListener(`dragend`, ut_endDrag.bind(null, popup));
    input.addEventListener(`keydown`, ut_editTag.bind(null, bgColorInput, colorInput, input, popup, tagBox, tagContainer));
    colorInput.addEventListener(`change`, ut_saveColor.bind(null, colorInput, `color`, `color`, tagBox));
    bgColorInput.addEventListener(`change`, ut_saveColor.bind(null, bgColorInput, `backgroundColor`, `bgColor`, tagBox));
    editButton.addEventListener(`click`, ut_showEdit.bind(null, input, tagBox, tagContainer));
    deleteButton.addEventListener(`click`, ut_deleteTag.bind(null, container, popup));
    resetButton.addEventListener(`click`, ut_resetColor.bind(null, bgColorInput, colorInput, tagBox));
  }

  function ut_startDrag(container, popup, event) {
    event.dataTransfer.setData(`text/plain`, ``);
    popup.dragged = container;
  }

  function ut_continueDrag(container, popup) {
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

  function ut_endDrag(popup) {
    let children, i, n, tags;
    tags = [];
    children = popup.tags.children;
    for (i = 0, n = children.length; i < n; ++i) {
      tags.push(children[i].firstElementChild.firstElementChild.textContent);
    }
    popup.input.value = tags.join(`, `);
  }

  function ut_editTag(bgColorInput, colorInput, input, popup, tagBox, tagContainer, event) {
    let colors, tag;
    if (event.key === `Enter`) {
      tagContainer.classList.remove(`esgst-hidden`);
      input.classList.add(`esgst-hidden`);
      tag = input.value;
      tagBox.textContent = tag;
      colors = esgst.ut_colors[tag];
      if (colors) {
        colorInput.value = tagBox.style.color = colors.color;
        bgColorInput.value = tagBox.style.backgroundColor = colors.bgColor;
      }
      ut_endDrag(popup);
    }
  }

  function ut_saveColor(input, key, saveKey, tagBox) {
    let tag;
    tag = tagBox.textContent;
    if (!esgst.ut_colors[tag]) {
      esgst.ut_colors[tag] = {
        bgColor: ``,
        color: ``
      };
    }
    esgst.ut_colors[tag][saveKey] = tagBox.style[key] = input.value;
  }

  function ut_resetColor(bgColorInput, colorInput, tagBox) {
    bgColorInput.value = ``;
    colorInput.value = ``;
    tagBox.style.backgroundColor = ``;
    tagBox.style.color = ``;
    delete esgst.ut_colors[tagBox.textContent];
  }

  function ut_showEdit(input, tagBox, tagContainer) {
    tagContainer.classList.add(`esgst-hidden`);
    input.classList.remove(`esgst-hidden`);
    input.value = tagBox.textContent;
    input.focus();
  }

  function ut_deleteTag(container, popup) {
    container.remove();
    ut_endDrag(popup);
  }

  async function ut_saveTags(key, popup, user, callback) {
    let tags;
    tags = popup.input.value.replace(/(,\s*)+/g, formatTags).split(`, `);
    if (tags.length === 1 && !tags[0].trim()) {
      tags = ``;
    }
    user.values = {
      tags: tags
    };
    await saveUser(null, null, user);
    ut_completeSave(key, popup, tags, callback);
  }

  async function ut_completeSave(key, popup, tags, callback) {
    await setSetting(`ut_colors`, esgst.ut_colors);
    ut_addTags(key, tags);
    callback();
    popup.close();
  }

  async function ut_loadTags(popup, user) {
    let i, n, savedUser, tags;
    savedUser = await getUser(null, user);
    popup.input.focus();
    if (savedUser) {
      tags = savedUser.tags;
      if (tags) {
        popup.tags.innerHTML = ``;
        for (i = 0, n = tags.length; i < n; ++i) {
          ut_createTag(popup, tags[i]);
        }
        popup.input.value = tags.join(`, `);
      }
    }
  }

  function ut_addTags(key, tags) {
    const elements = esgst.currentUsers[key].elements;
    const items = tags.length && tags[0] ? tags.map(x => gt_template(x)) : [{
      text: ``,
      type: `node`
    }];
    for (let context of elements) {
      const container = context.parentElement;
      if (!container) {
        continue;
      }
      if (container.classList.contains(`comment__username`)) {
        context = container;
      }
      const button = context.parentElement.getElementsByClassName(`esgst-ut-button`)[0];
      if (items) {
        button.classList.remove(`esgst-faded`);
      } else {
        button.classList.add(`esgst-faded`);
      }
      const tagsContainer = button.lastElementChild;
      createElements(tagsContainer, `inner`, items);
      for (const tagsBox of tagsContainer.children) {
        const colors = esgst.ut_colors[tagsBox.textContent];
        if (colors) {
          tagsBox.style.color = colors.color;
          tagsBox.style.backgroundColor = colors.bgColor;
        }
      }
    }
  }
  
