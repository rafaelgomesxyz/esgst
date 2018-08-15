async function tags_load(key) {
  await tags_getTags(key);
  esgst.userFeatures.push(tags_addButtons.bind(null, key));
}

async function tags_getTags(key) {
  const allTags = [];
  switch (key) {
    case `gpt`: {
      const savedGroups = JSON.parse(await getValue(`groups`));
      for (const group of savedGroups) {
        const tags = group.tags;
        if (tags && Array.isArray(tags)) {
          allTags.push(...tags);
        }
      }
      break;
    }      
    case `gt`: {
      const savedGames = JSON.parse(await getValue(`games`));
      for (const id in savedGames.apps) {
        const tags = savedGames.apps[id].tags;
        if (tags && Array.isArray(tags)) {
          allTags.push(...tags);
        }
      }
      for (const id in savedGames.subs) {
        const tags = savedGames.subs[id].tags;
        if (tags && Array.isArray(tags)) {
          allTags.push(...tags);
        }
      }
      break;
    }
    case `ut`: {
      const savedUsers = JSON.parse(await getValue(`users`));
      for (const id in savedUsers.users) {
        const tags = savedUsers.users[id].tags;
        if (tags && Array.isArray(tags)) {
          allTags.push(...tags);
        }
      }
      break;
    }
  }  
  const tagCount = {};
  for (const tag of allTags) {
    if (!tagCount[tag]) {
      tagCount[tag] = 0;
    }
    tagCount[tag] += 1;
  }
  esgst[`${key}Tags`] = [];
  for (const tag in tagCount) {
    esgst[`${key}Tags`].push({
      count: tagCount[tag],
      tag
    });
  }
  esgst[`${key}Tags`] = sortArray(esgst[`${key}Tags`], true, `count`).map(x => x.tag);
  if (esgst[`${key}_s`]) {
    esgst.documentEvents.keydown.add(tags_navigateSuggestions);
    esgst.documentEvents.click.add(tags_closeSuggestions);
  }
}

function tags_navigateSuggestions(event) {
  if (!event.key.match(/^(ArrowDown|ArrowUp|Enter)$/) || event.repeat) {
    return;
  }
  const selected = document.querySelector(`.esgst-tag-suggestion.esgst-selected`);
  let element = null;
  if (selected) {
    if (event.key === `ArrowDown`) {
      element = selected.nextElementSibling;
      while (element && element.classList.contains(`esgst-hidden`)) {
        element = element.nextElementSibling;
      }
    } else if (event.key === `ArrowUp`) {
      element = selected.previousElementSibling;
      while (element && element.classList.contains(`esgst-hidden`)) {
        element = element.previousElementSibling;
      }
    } else if (event.key === `Enter`) {
      event.stopPropagation();
      selected.click();
    }
    selected.classList.remove(`esgst-selected`);
    if (element) {
      element.classList.add(`esgst-selected`);
    }
  } else if (event.key !== `Enter`) {
    element = document.querySelector(`.esgst-tag-suggestion:not(.esgst-hidden)`);
    if (element) {      
      element.classList.add(`esgst-selected`);
    }
  }
}

function tags_closeSuggestions(event) {
  const suggestions = document.querySelector(`.esgst-tag-suggestions:not(.esgst-hidden)`);
  if (suggestions && !suggestions.contains(event.target) && event.target.tagName !== `INPUT`) {
    tags_hideSuggestions(suggestions);
  }
}

function tags_hideSuggestions(suggestions) {
  suggestions.classList.add(`esgst-hidden`);
  for (const item of suggestions.children) {
    item.classList.remove(`esgst-selected`);
  }
}

function tags_addButtons(key, items) {
  items = items.all || items;
  for (const item of items) {
    const obj = {item, key};
    if (!item.container.getElementsByClassName(`esgst-tag-button`)[0]) {
      createElements(item.tagContext, item.tagPosition, [{
        attributes: {
          class: `esgst-tag-button esgst-faded`,
          title: getFeatureTooltip(key, `Edit tags`)
        },
        type: `a`,
        children: [{
          attributes: {
            class: `fa fa-tag`
          },
          type: `i`
        }, {
          attributes: {
            class: `esgst-tags`
          },
          type: `span`
        }]
      }]).addEventListener(`click`, tags_openPopup.bind(null, obj));
    }
    if (item.saved && item.saved.tags) {
      tags_addTags(item, obj, item.saved.tags);
    }
  }  
}

async function tags_openMmPopup(mmObj, items, key) {
  key = {
    Games: `gt`,
    Groups: `gpt`,
    Users: `ut`
  }[key];
  const obj = {items: [], key};
  obj.items = sortArray(items.filter(item => item.mm && (item.outerWrap.offsetParent || item.outerWrap.closest(`.esgst-gv-container:not(.is-hidden):not(.esgst-hidden)`))), false, `code`);
  const savedGames = JSON.parse(await getValue(`games`));
  const savedGroups = JSON.parse(await getValue(`groups`));
  const savedUsers = JSON.parse(await getValue(`users`));
  for (const item of obj.items) {
    item.tags = [];
    item.uniqueTags = [];
    switch (key) {
      case `gpt`: {
        const group = savedGroups.filter(subGroup => subGroup.code === item.code)[0];
        if (group && group.tags && Array.isArray(group.tags)) {
          item.tags = group.tags;
        }
        break;
      }
      case `gt`: {
        const game = savedGames[item.type][item.code];
        if (game && game.tags && Array.isArray(game.tags)) {
          item.tags = game.tags;
        }
        break;
      }
      case `ut`: {
        const user = await getUser(savedUsers, {username: item.code});
        if (user && user.tags && Array.isArray(user.tags)) {
          item.tags = user.tags;
        }
        break;
      }
    }
  }
  obj.hasUnique = false;
  obj.sharedTags = new Set();
  for (const item of obj.items) {
    for (const tag of item.tags) {
      if (obj.items.length === obj.items.filter(subItem => subItem.tags.indexOf(tag) > -1).length) {
        obj.sharedTags.add(tag);
      } else {
        obj.hasUnique = true;
        item.uniqueTags.push(tag);
      }
    }
  }
  if (obj.hasUnique) {
    obj.sharedTags.add(`[*]`);
  }
  obj.sharedTags = Array.from(obj.sharedTags);
  tags_openPopup(obj);
}

async function tags_openPopup(obj, event) {
  if (event) {
    event.stopPropagation();
  }
  obj.popup = new Popup_v2({
    addScrollable: true,
    buttons: [{
      color1: `green`,
      color2: `grey`,
      icon1: `fa-check`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Save`,
      title2: `Saving...`,
      callback1: tags_saveTags.bind(null, obj)
    }],
    icon: `fa-tag`,
    isTemp: true,
    title: [{
      text: `Edit tags for `,
      type: `node`
    }, {
      text: (obj.items && `${obj.items.length} items`) || obj.item.name || obj.item.id,
      type: `span`
    }, {
      text: `:`,
      type: `node`
    }]
  });
  createElements(obj.popup.description, `beforeEnd`, [{
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
      text: `When editing a tag color, it will also alter the color for all items with that tag (you have to refresh the page for it to take effect).`,
      type: `p`
    }, ...(obj.hasUnique ? [{
      type: `br`
    }, {
      text: `[*] means that there are tags that are not shared between all items. If you delete the [*] tag, those unique tags will be deleted.`,
      type: `p`
    }] : [])]
  }]);
  obj.tags = createElements(obj.popup.description, `beforeEnd`, [{
    attributes: {
      class: `esgst-tags`
    },
    type: `div`
  }]);
  obj.input = createElements(obj.popup.description, `beforeEnd`, [{
    attributes: {
      type: `text`
    },
    events: {
      focus: tags_createTags.bind(null, obj),
      input: tags_createTags.bind(null, obj),
      keydown: triggerSetOnEnter.bind(null, obj.popup.buttons[0])
    },
    type: `input`
  }]);
  createElements(obj.popup.description, `beforeEnd`, [{
    attributes: {
      class: `esgst-tag-list-button esgst-clickable fa fa-list`,
      title: `Select from existing tags`
    },
    type: `i`
  }]).addEventListener(`click`, tags_showTagList.bind(null, obj));
  const children = [];  
  if (esgst[`${obj.key}_s`]) {
    obj.suggestions = createElements(obj.popup.description, `beforeEnd`, [{
      attributes: {
        class: `esgst-tag-suggestions esgst-hidden`
      },
      type: `div`
    }]);
    for (const tag of esgst[`${obj.key}Tags`]) {
      children.push({
        attributes: {
          class: `esgst-tag-suggestion esgst-hidden`
        },
        events: {
          click: tags_addSuggestion.bind(null, obj),
          mouseenter: tags_selectSuggestion,
          mouseleave: tags_unselectSuggestion
        },
        text: tag,
        type: `div`
      });
    }
    createElements(obj.suggestions, `inner`, children);
  }
  createElements(obj.popup.description, `beforeEnd`, [{
    attributes: {
      class: `esgst-description`
    },
    text: `Use commas to separate tags, for example: Tag1, Tag2, ...`,
    type: `div`
  }]);
  obj.popup.description.appendChild(obj.popup.buttons[0].set);
  obj.popup.open(tags_loadTags.bind(null, obj));
}

async function tags_saveTags(obj) {
  let tags = obj.input.value.replace(/(,\s*)+/g, formatTags).split(`, `);
  if (tags.length === 1 && !tags[0].trim()) {
    tags = ``;
  }
  switch (obj.key) {
    case `gpt`: {
      const groups = {};
      if (obj.items) {
        for (const item of obj.items) {
          item.multiTags = tags;
          if (tags) {
            const index = tags.indexOf(`[*]`);
            if (index > -1) {
              item.multiTags = [...tags];
              item.multiTags.splice(index, 1, ...item.uniqueTags);
            }
          }
          groups[item.code] = {
            code: item.code,
            name: item.name,
            tags: item.multiTags
          };
        }
      } else {
        groups[obj.item.id] = {
          code: obj.item.id,
          name: obj.item.name,
          tags
        };
      }
      await lockAndSaveGroups(groups);
      break;
    }
    case `gt`: {
      const games = {apps: {}, subs: {}};
      if (obj.items) {
        for (const item of obj.items) {
          item.multiTags = tags;
          if (tags) {
            const index = tags.indexOf(`[*]`);
            if (index > -1) {
              item.multiTags = [...tags];
              item.multiTags.splice(index, 1, ...item.uniqueTags);
            }
          }
          games[item.type][item.code] = {tags: item.multiTags};
        }
      } else {
        games[obj.item.type][obj.item.id] = {tags};
      }
      await lockAndSaveGames(games);
      break;
    }
    case `ut`: {
      if (obj.items) {
        const users = [];
        for (const item of obj.items) {
          item.multiTags = tags;
          if (tags) {
            const index = tags.indexOf(`[*]`);
            if (index > -1) {
              item.multiTags = [...tags];
              item.multiTags.splice(index, 1, ...item.uniqueTags);
            }
          }
          users.push({
            steamId: item.sg ? null : item.code,
            username: item.sg ? item.code : null,
            values: {
              tags: item.multiTags
            }
          });
        }
        await saveUsers(users);
      } else {
        const user = {
          steamId: obj.item.steamId,
          username: obj.item.username,
          values: {tags}
        };
        await saveUser(null, null, user);
      }
      break;
    }
  }
  await setSetting(`${obj.key}_colors`, esgst[`${obj.key}_colors`]);
  if (obj.items) {
    for (const item of obj.items) {
      tags_addTags(item, obj, item.multiTags);
    }
  } else {
    tags_addTags(obj.item, obj, tags);
  }
  obj.popup.close();
}

function tags_addTags(item, obj, tags) {
  let items = null;
  switch (obj.key) {
    case `gpt`:
      items = esgst.currentGroups[item.code || item.id].elements;
      break;
    case `gt`:
      items = games_get(document, true, esgst.games)[item.type][item.code || item.id];
      break;
    case `ut`:
      items = esgst.currentUsers[item.code || item.id].elements;
      break;
  }
  if (!items) {
    return;
  }
  const elements = tags.length && tags[0] ? tags.map(x => tags_template(x)) : [{
    text: ``,
    type: `node`
  }];
  for (const subItem of items) {
    let context = null;
    switch (obj.key) {
      case `gpt`:
        context = subItem.parentElement;
        break;
      case `gt`:
        context = subItem.container;
        break;
      case `ut`: {
        const container = subItem.parentElement;
        if (!container) {
          break;
        }
        context = container.classList.contains(`comment__username`) ? container : subItem;
        context = context.parentElement;
        break;
      }
    }
    if (!context) {
      continue;
    }
    const button = context.getElementsByClassName(`esgst-tag-button`)[0];
    if (!button) {
      continue;
    }
    button.classList[elements ? `remove` : `add`](`esgst-faded`);
    const tagsContainer = button.lastElementChild;
    createElements(tagsContainer, `inner`, elements);
    for (const tagsBox of tagsContainer.children) {
      const colors = esgst[`${obj.key}_colors`][tagsBox.textContent];
      if (!colors) {
        continue;
      }
      tagsBox.style.color = colors.color;
      tagsBox.style.backgroundColor = colors.bgColor;
    }
  }
}

function tags_template(text) {
  return {
    attributes: {
      class: `esgst-tag global__image-outer-wrap author_avatar is_icon`
    },
    text,
    type: `span`
  };
}

function tags_createTags(obj) {
  obj.tags.innerHTML = ``;
  const tags = obj.input.value.replace(/(,\s*)+/g, formatTags).split(`, `).filter(x => x);
  if (tags.length) {
    if (esgst[`${obj.key}_s`]) {
      const lastTag = tags[tags.length - 1].toLowerCase();
      let selected = document.querySelector(`.esgst-tag-suggestion.esgst-selected`);
      if (selected) {
        selected.classList.remove(`esgst-selected`);
      }
      selected = null;
      for (const child of obj.suggestions.children) {
        const value = child.textContent.toLowerCase();
        if (value !== lastTag && value.match(new RegExp(`^${lastTag}`))) {
          child.classList.remove(`esgst-hidden`);
          if (!selected) {
            selected = child;
          }
        } else {
          child.classList.add(`esgst-hidden`);
        }
      }
      if (selected) {
        obj.suggestions.classList.remove(`esgst-hidden`);
      } else {
        tags_hideSuggestions(obj.suggestions);
      }
    }
    for (const tag of tags) {
      tags_createTag(obj, tag);
    }
  } else if (esgst[`${obj.key}_s`]) {
    tags_hideSuggestions(obj.suggestions);
  }
}

function tags_createTag(obj, tag) {
  const container = createElements(obj.tags, `beforeEnd`, [{
    attributes: {
      class: `esgst-tag-preview`,
      draggable: true
    },
    type: `div`,
    children: [{
      attributes: {
        class: `esgst-tags`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-tag global__image-outer-wrap author_avatar is_icon`
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
  const tagContainer = container.firstElementChild;
  const tagBox = tagContainer.firstElementChild;
  const input = tagContainer.nextElementSibling;
  const colorInput = input.nextElementSibling;
  const bgColorInput = colorInput.nextElementSibling;
  const editButton = bgColorInput.nextElementSibling;
  const deleteButton = editButton.nextElementSibling;
  const resetButton = deleteButton.nextElementSibling;
  const colors = esgst[`${obj.key}_colors`][tag];
  if (colors) {
    colorInput.value = tagBox.style.color = colors.color;
    bgColorInput.value = tagBox.style.backgroundColor = colors.bgColor;
  }
  container.addEventListener(`dragstart`, tags_startDrag.bind(null, container, obj));
  container.addEventListener(`dragenter`, tags_continueDrag.bind(null, container, obj));
  container.addEventListener(`dragend`, tags_endDrag.bind(null, obj));
  input.addEventListener(`keydown`, tags_editTag.bind(null, bgColorInput, colorInput, input, obj, tagBox, tagContainer));
  colorInput.addEventListener(`change`, tags_saveColor.bind(null, colorInput, `color`, obj, `color`, tagBox));
  bgColorInput.addEventListener(`change`, tags_saveColor.bind(null, bgColorInput, `backgroundColor`, obj, `bgColor`, tagBox));
  editButton.addEventListener(`click`, tags_showEdit.bind(null, input, tagBox, tagContainer));
  deleteButton.addEventListener(`click`, tags_deleteTag.bind(null, container, obj));
  resetButton.addEventListener(`click`, tags_resetColor.bind(null, bgColorInput, colorInput, obj, tagBox));
}

function tags_startDrag(container, obj, event) {
  event.dataTransfer.setData(`text/plain`, ``);
  obj.dragged = container;
}

function tags_continueDrag(container, obj) {
  let current;
  current = obj.dragged;
  do {
    current = current.previousElementSibling;
    if (current && current === container) {
      obj.tags.insertBefore(obj.dragged, container);
      return;
    }
  } while (current);
  obj.tags.insertBefore(obj.dragged, container.nextElementSibling);
}

function tags_endDrag(obj) {
  const tags = [];
  for (const element of obj.tags.children) {
    tags.push(element.firstElementChild.firstElementChild.textContent);
  }
  obj.input.value = tags.join(`, `);
}

function tags_editTag(bgColorInput, colorInput, input, obj, tagBox, tagContainer, event) {
  if (event.key !== `Enter`) {
    return;
  }
  tagContainer.classList.remove(`esgst-hidden`);
  input.classList.add(`esgst-hidden`);
  const tag = input.value;
  tagBox.textContent = tag;
  const colors = esgst[`${obj.key}_colors`][tag];
  if (colors) {
    colorInput.value = tagBox.style.color = colors.color;
    bgColorInput.value = tagBox.style.backgroundColor = colors.bgColor;
  }
  tags_endDrag(obj);
}

function tags_saveColor(input, key, obj, saveKey, tagBox) {
  const tag = tagBox.textContent;
  if (!esgst[`${obj.key}_colors`][tag]) {
    esgst[`${obj.key}_colors`][tag] = {
      bgColor: ``,
      color: ``
    };
  }
  esgst[`${obj.key}_colors`][tag][saveKey] = tagBox.style[key] = input.value;
}

function tags_showEdit(input, tagBox, tagContainer) {
  tagContainer.classList.add(`esgst-hidden`);
  input.classList.remove(`esgst-hidden`);
  input.value = tagBox.textContent;
  input.focus();
}

function tags_deleteTag(container, obj) {
  container.remove();
  tags_endDrag(obj);
}

function tags_resetColor(bgColorInput, colorInput, obj, tagBox) {
  bgColorInput.value = ``;
  colorInput.value = ``;
  tagBox.style.backgroundColor = ``;
  tagBox.style.color = ``;
  delete esgst[`${obj.key}_colors`][tagBox.textContent];
}

async function tags_showTagList(obj) {
  obj.listPopup = new Popup_v2({
    addScrollable: true,
    buttons: [{
      color1: `green`,
      color2: ``,
      icon1: `fa-check`,
      icon2: ``,
      title1: `Add Tags`,
      title2: ``,
      callback1: tags_addTagsFromList.bind(null, obj)
    }],
    icon: `fa-list`,
    isTemp: true,
    title: `Select from existing tags:`
  });
  const list = createElements(obj.listPopup.scrollable, `beforeEnd`, [{
    attributes: {
      class: `esgst-tag-list popup__keys__list`
    },
    type: `div`
  }]);
  obj.selectedTags = [];
  for (const tag of esgst[`${obj.key}Tags`]) {
    const item = createElements(list, `beforeEnd`, [{
      type: `div`,
      children: [{
        type: `span`
      }, {
        text: ` ${tag}`,
        type: `node`
      }]
    }]);
    if (esgst[`${obj.key}_colors`][tag]) {
      item.style.color = esgst[`${obj.key}_colors`][tag].color;
      item.style.backgroundColor = esgst[`${obj.key}_colors`][tag].bgColor;
    }
    const checkbox = new Checkbox(item);
    checkbox.onEnabled = tags_selectTag.bind(null, obj, tag);
    checkbox.onDisabled = tag_unselectTag.bind(null, obj, tag);
  }
  obj.listPopup.open();
}

function tags_addTagsFromList(obj) {
  for (const tag of obj.selectedTags) {
    tags_createTag(obj, tag);
  }
  if (obj.input.value) {
    obj.selectedTags.unshift(obj.input.value);
  }
  obj.input.value = obj.selectedTags.join(`, `);
  obj.listPopup.close();
}

function tags_selectTag(obj, tag) {
  obj.selectedTags.push(tag);
}

function tag_unselectTag(obj, tag) {
  obj.selectedTags.splice(obj.selectedTags.indexOf(tag), 1);
}

function tags_addSuggestion(obj, event) {
  obj.tags.innerHTML = ``;
  const tags = obj.input.value.replace(/(,\s*)+/g, formatTags).split(`, `);
  const value = event.currentTarget.textContent;
  tags.pop();
  tags.push(value);
  obj.input.value = tags.join(`, `);
  tags_hideSuggestions(obj.suggestions);
  for (const tag of tags) {
    tags_createTag(obj, tag);
  }
  obj.input.focus();
}

function tags_selectSuggestion(event) {
  for (const item of event.currentTarget.parentElement.children) {
    item.classList.remove(`esgst-selected`);
  }
  event.currentTarget.classList.add(`esgst-selected`);
}

function tags_unselectSuggestion(event) {
  const parent = event.currentTarget.parentElement;
  if (event.relatedTarget !== parent && parent.contains(event.relatedTarget)) {
    event.currentTarget.classList.remove(`esgst-selected`);
  }
}

async function tags_loadTags(obj) {
  let item = null;
  if (obj.items) {
    item = {tags: obj.sharedTags};
  } else {
    switch (obj.key) {
      case `gpt`: {
        const savedGroups = JSON.parse(await getValue(`groups`));
        item = savedGroups.filter(group => group.code === obj.item.id)[0];
        break;
      }
      case `gt`: {
        const savedGames = JSON.parse(await getValue(`games`));
        item = savedGames[obj.item.type][obj.item.id];
        break;
      }
      case `ut`: {
        item = await getUser(null, {
          steamId: obj.item.steamId,
          username: obj.item.username
        });
        break;
      }
    }
  }
  obj.input.focus();
  if (!item || !item.tags) {
    return;
  }
  obj.tags.innerHTML = ``;
  for (const tag of item.tags) {
    tags_createTag(obj, tag);
  }
  obj.input.value = item.tags.join(`, `);
}