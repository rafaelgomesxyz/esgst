_MODULES.push({
    description: `
      <ul>
        <li>Allows you to add custom links to the header dropdowns/footer of any page.</li>
        <li>Already comes with some predefined links:</li>
        <ul>
          <li>Giveaways: Hidden Games, Reduced CV Games, Browse Wishlist, Browse Recommended, Browse Group, Browse New</li>
          <li>Discussions: Categorize Discussions, Browse Announcements, Browse Bugs / Suggestions, Browse Deals, Browse General, Browse Group Recruitment, Browse Let's Play Together, Browse Off-Topic, Browse Puzzles, Browse Uncategorized</li>
          <li>Support: Real CV, Not Activated Wins, Multiple Wins</li>
          <li>Help: Change Log</li>
          <li>Account: Whitelist, Blacklist, Games, Groups, Wishlist</li>
        </ul>
        <li>If you press the Ctrl key with a dropdown open, the feature adds two buttons ("<i class="fa fa-plus-circle"></i> Add Custom Link" and "<i class="fa fa-undo"></i> Reset Links") to the end of the dropdown that allow you to add/reset the custom links. It also adds two other buttons (<i class="fa fa-edit"></i> to edit and <i class="fa fa-trash"></i> to remove) to each custom link in the dropdown that allow you to edit/remove the custom link.</li>
        <li>If you press the Ctrl key with no dropdown open, those same buttons will be added to the footer of the page.</li>
        <li>You can move the custom links by dragging and dropping them.</li>
      </ul>
    `,
    inputItems: `chfl_key`,
    id: `chfl`,
    load: chfl,
    name: `Custom Header/Footer Links`,
    sg: true,
    st: true,
    type: `general`
  });

  function chfl() {
    let chfl = null;
    if (esgst.sg) {
      let elements = document.getElementsByClassName(`nav__relative-dropdown`);
      chfl = {
        sources: {
          giveaways: {
            container: elements[0],
            context: elements[0].firstElementChild,
            elements: {}
          },
          discussions: {
            container: elements[1],
            context: elements[1].firstElementChild,
            elements: {}
          },
          support: {
            container: elements[2],
            context: elements[2].firstElementChild,
            elements: {}
          },
          help: {
            container: elements[3],
            context: elements[3].firstElementChild,
            elements: {}
          },
          account: {
            container: elements[4],
            context: elements[4].firstElementChild,
            elements: {}
          },
          footer: {
            container: esgst.footer,
            context: esgst.footer.firstElementChild.lastElementChild,
            elements: {}
          }
        }
      };
    } else {
      let elements = document.getElementsByClassName(`dropdown`);
      chfl = {
        sources: {
          trades: {
            container: elements[0],
            context: elements[0].firstElementChild,
            elements: {}
          },
          account: {
            container: elements[1],
            context: elements[1].firstElementChild,
            elements: {}
          },
          footer: {
            container: esgst.footer,
            context: esgst.footer.firstElementChild.lastElementChild,
            elements: {}
          }
        }
      };
    }
    for (let key in chfl.sources) {
      let source = chfl.sources[key];
      for (let i = source.context.children.length - 1; i > -1; i--) {
        let element = source.context.children[i];
        let id = element.getAttribute(`data-link-id`);
        if (id) {
          if (!source.elements[id]) {
            source.elements[id] = element;
          }
          continue;
        }
        if ((!element.getAttribute(`href`) || element.getAttribute(`href`).match(/^javascript/)) && (key !== `footer` || !element.lastElementChild.getAttribute(`href`))) continue;
        id = (key === `footer` ? element.lastElementChild : element).getAttribute(`href`).match(/.*(\/|\?)(.+)$/)[2];
        id = id.replace(/\[steamId\]/, esgst.steamId);
        element.setAttribute(`data-link-id`, id);
        element.setAttribute(`data-link-key`, key);
        source.elements[id] = element;
      }
      chfl_reorder(chfl, key, true);
    }
    document.addEventListener(`keydown`, chfl_checkKey.bind(null, chfl));
  }

  function chfl_checkKey(chfl, event) {
    event.stopPropagation();
    let value = ``;
    if (event.ctrlKey) {
      value += `ctrlKey + `;
    } else if (event.shiftKey) {
      value += `shiftKey + `;
    } else if (event.altKey) {
      value += `altKey + `;
    }
    value += event.key.toLowerCase();

    if (value !== esgst.chfl_key) return;

    const removedKey = chfl_removeButton(chfl);
    chfl_addButton(chfl, removedKey);
  }

  function chfl_reorder(chfl, key, firstRun) {
    let source = chfl.sources[key];
    let ids = [];
    for (let i = esgst[`chfl_${key}`].length - 1; i > -1; i--) {
      let item = esgst[`chfl_${key}`][i];
      if (item.id) {
        let element = source.elements[item.id];
        if (element && !firstRun) {
          source.context.insertBefore(element, source.context.firstElementChild);
        } else {
          if (element) {
            element.remove();
          }
          if (key === `footer`) {
            source.elements[item.id] = createElements(source.context, `afterBegin`, [{
              attributes: {
                [`data-link-id`]: item.id,
                [`data-link-key`]: `footer`,
                title: getFeatureTooltip(`chfl`)
              },
              type: esgst.sg ? `div` : `li`,
              children: [{
                attributes: {
                  class: `fa ${item.icon}`
                },
                type: `i`
              }, {
                attributes: {
                  href: item.url
                },
                text: item.name,
                type: `a`
              }]
            }]);
          } else {
            source.elements[item.id] = createElements(source.context, `afterBegin`, generateHeaderMenuItem(item, key));
            source.elements[item.id].title = getFeatureTooltip(`chfl`);
            if (!item.description) {
              source.elements[item.id].classList.add(`esgst-chfl-small`);
            }
            if (item.compact) {
              source.elements[item.id].classList.add(`esgst-chfl-compact`);
            }
          }
        }
        chfl_makeDraggable(chfl, source.elements[item.id]);
        ids.push(item.id);
      } else {
        let element = source.elements[item];
        if (element) {
          source.context.insertBefore(element, source.context.firstElementChild);
          chfl_makeDraggable(chfl, element);
        }
        ids.push(item);
      }
    }
    for (let key in source.elements) {
      if (ids.indexOf(key) > -1) continue;
      source.elements[key].remove();
      delete source.elements[key];
    }
    if (!firstRun) {
      chfl_removeButton(chfl, key);
      chfl_addButton(chfl, null, key);
    }
  }

  function chfl_makeDraggable(chfl, element) {
    element.setAttribute(`draggable`, true);
    element.addEventListener(`dragstart`, chfl_startDrag.bind(null, chfl));
    element.addEventListener(`dragenter`, chfl_enterDrag.bind(null, chfl));
    element.addEventListener(`dragend`, chfl_saveOrder.bind(null, chfl));
  }

  function chfl_startDrag(chfl, event) {
    event.dataTransfer.setData(`text/plain`, ``);
    chfl.source = event.currentTarget;
  }

  function chfl_enterDrag(chfl, event) {
    let current = chfl.source;
    let element = event.currentTarget;
    if (current.getAttribute(`data-link-key`) !== element.getAttribute(`data-link-key`)) return;
    do {
      current = current.previousElementSibling;
      if (current && current === element) {
        element.parentElement.insertBefore(chfl.source, element);
        return;
      }
    } while (current);
    element.parentElement.insertBefore(chfl.source, element.nextElementSibling);
  }

  function chfl_saveOrder(chfl) {
    for (let key in chfl.sources) {
      let elements = {};
      for (const item of esgst.settings[`chfl_${key}_${esgst.name}`]) {
        if (item.id) {
          elements[item.id] = item;
        }
      }
      esgst.settings[`chfl_${key}_${esgst.name}`] = [];
      let source = chfl.sources[key];
      for (let i = 0, n = source.context.children.length; i < n; i++) {
        let element = source.context.children[i];
        let id = element.getAttribute(`data-link-id`);
        if (!id) continue;
        esgst.settings[`chfl_${key}_${esgst.name}`].push(elements[id] || id);
      }
      esgst[`chfl_${key}`] = esgst.settings[`chfl_${key}_${esgst.name}`];
    }
    setValue(`settings`, JSON.stringify(esgst.settings));
  }

  function chfl_addButton(chfl, removedKey, forceKey) {
    for (const key in chfl.sources) {
      if (key === removedKey) return;

      const source = chfl.sources[key];
      if (key !== forceKey && (source.container.classList.contains(`is-hidden`) || source.container.classList.contains(`is_hidden`))) continue;

      const button = createElements(source.context, `beforeEnd`, key === `footer` ? [{
        attributes: {
          class: `esgst-chfl-button`
        },
        type: esgst.sg ? `div` : `li`,
        children: [{
          attributes: {
            class: `fa fa-plus`
          },
          type: `i`
        }, {
          attributes: {
            href: `#`
          },
          text: `Add Custom Link`,
          type: `a`
        }]
      }] : generateHeaderMenuItem({className: ` esgst-chfl-button`, color: `grey`, icon: `fa-plus-circle`, name: `Add Custom Link`, description: `Click here to add a custom link.`}));
      button.addEventListener(`click`, chfl_openPopup.bind(null, chfl, null, key));
      const resetButton = createElements(source.context, `beforeEnd`, key === `footer` ? [{
        attributes: {
          class: `esgst-chfl-button`
        },
        type: esgst.sg ? `div` : `li`,
        children: [{
          attributes: {
            class: `fa fa-undo`
          },
          type: `i`
        }, {
          attributes: {
            href: `#`
          },
          text: `Reset Links`,
          type: `a`
        }]
      }] : generateHeaderMenuItem({className: ` esgst-chfl-button`, color: `grey`, icon: `fa-undo`, name: `Reset Links`, description: `Click here to reset the custom links.`}));
      resetButton.addEventListener(`click`, createConfirmation.bind(null, `Are you sure you want to reset the links? Any custom links you added will be deleted.`, chfl_resetLinks.bind(null, chfl, key), null));
      for (const subKey in source.elements) {
        const element = source.elements[subKey],
            panel = createElements(element, `beforeEnd`, [{
              attributes: {
                class: `esgst-chfl-panel`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `esgst-chfl-edit-button fa fa-edit icon-grey`,
                },
                type: `i`
              }, {
                attributes: {
                  class: `esgst-chfl-remove-button fa fa-trash icon-grey`,
                },
                type: `i`
              }]
            }]);
        panel.firstElementChild.addEventListener(`click`, chfl_openPopup.bind(null, chfl, subKey, key));
        panel.lastElementChild.addEventListener(`click`, chfl_removeLink.bind(null, chfl, subKey, key));
      }
      return;
    }
  }

  function chfl_openPopup(chfl, editId, key, event) {
    event.preventDefault();
    let popup = new Popup(editId ? `fa-edit` : `fa-plus`, `${editId ? `Edit` : `Add`} Custom Link`, true);
    let description = createElements(popup.description, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `URL:`,
        type: `span`
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `Instead of entering 'https://www.steamgifts.com/url', you can simply enter '/url'.`
        },
        type: `i`
      }, {
        attributes: {
          class: `esgst-switch-input esgst-switch-input-large`,
          type: `text`
        },
        type: `input`
      }]
    }, {
      type: `div`,
      children: [{
        text: `Color:`,
        type: `span`
      }, {
        attributes: {
          class: `esgst-switch-input esgst-switch-input-large`
        },
        type: `select`,
        children: [{
          attributes: {
            value: `grey`
          },
          text: `Grey (Default)`,
          type: `option`
        }, {
          attributes: {
            value: `blue`
          },
          text: `Blue`,
          type: `option`
        }, {
          attributes: {
            value: `green`
          },
          text: `Green`,
          type: `option`
        }, {
          attributes: {
            value: `red`
          },
          text: `Red`,
          type: `option`
        }, {
          attributes: {
            value: `yellow`
          },
          text: `Yellow`,
          type: `option`
        }]
      }]
    }, {
      type: `div`,
      children: [{
        text: `Icon:`,
        type: `span`
      }, {
        attributes: {
          href: `https://fontawesome.com/v4.7.0/icons/`
        },
        type: `a`,
        children: [{
          attributes: {
            class: `fa fa-question-circle`,
            title: `You must use an icon from FontAwesome (click on this icon to go to the FontAwesome page). The icon must be in the format 'fa-icon', without the quotes.`
          },
          type: `i`
        }]
      }, {
        attributes: {
          class: `esgst-switch-input esgst-switch-input-large`,
          type: `text`
        },
        type: `input`
      }]
    }, {
      type: `div`,
      children: [{
        text: `Name:`,
        type: `span`
      }, {
        attributes: {
          class: `esgst-switch-input esgst-switch-input-large`,
          type: `text`
        },
        type: `input`
      }]
    }, {
      type: `div`,
      children: [{
        text: `Description:`,
        type: `span`
      }, {
        attributes: {
          class: `esgst-switch-input esgst-switch-input-large`,
          type: `text`
        },
        type: `input`
      }]
    }]);
    let name = description.previousElementSibling;
    let icon = name.previousElementSibling;
    let color = icon.previousElementSibling;
    let url = color.previousElementSibling.lastElementChild;
    let compactSwitch = new ToggleSwitch(popup.description, null, null, `Use compact size.`, false, false, `The bottom/top padding of the link will be reduced to 8px.`);
    description = description.lastElementChild;
    name = name.lastElementChild;
    icon = icon.lastElementChild;
    color = color.lastElementChild;
    if (key === `footer`) {
      color.parentElement.classList.add(`esgst-hidden`);
      description.parentElement.classList.add(`esgst-hidden`);
      compactSwitch.container.classList.add(`esgst-hidden`);
    }
    if (esgst.st) {
      description.parentElement.classList.add(`esgst-hidden`);
    }
    if (editId) {
      for (let i = esgst[`chfl_${key}`].length - 1; i > -1; i--) {
        let item = esgst[`chfl_${key}`][i];
        if (item !== editId && (!item.id || item.id !== editId)) continue;
        if (item.id) {
          description.value = item.description || ``;
          name.value = item.name || ``;
          icon.value = item.icon || ``;
          color.value = item.color || ``;
          url.value = item.url || ``;
          if (item.compact) {
            compactSwitch.enable();
          }
        } else {
          let element = chfl.sources[key].elements[item];
          let context = element.firstElementChild;
          if (esgst.sg) {
            if (key === `footer`) {
              name.value = context.nextElementSibling.textContent.trim();
              icon.value = context.className.match(/.+(fa-.+)$/)[1];
              url.value = context.nextElementSibling.getAttribute(`href`);
            } else {
              description.value = context.nextElementSibling.lastElementChild.textContent.trim();
              name.value = context.nextElementSibling.firstElementChild.textContent.trim();
              icon.value = context.className.match(/.+(fa-.+)$/)[1];
              color.value = context.className.match(/icon-(.+?)\s/)[1];
              url.value = element.getAttribute(`href`);
            }
          } else {
            if (key === `footer`) {
              name.value = context.nextElementSibling.textContent.trim();
              icon.value = context.className.match(/.+(fa-.+)$/)[1];
              url.value = context.nextElementSibling.getAttribute(`href`);
            } else {
              name.value = context.nextElementSibling.textContent.trim();
              icon.value = context.className.match(/.+(fa-.+)$/)[1];
              color.value = context.className.match(/^(.+?)\s/)[1];
              url.value = element.getAttribute(`href`);
            }
          }
        }
        break;
      }
    }
    popup.description.appendChild(new ButtonSet_v2({color1: `green`, color2: `grey`, icon1: editId ? `fa-edit` : `fa-plus-circle`, icon2: `fa-circle-o-notch fa-spin`, title1: editId ? `Edit` : `Add`, title2: editId ? `Editing...` : `Adding...`, callback1: chfl_addLink.bind(null, chfl, color, compactSwitch, description, editId, icon, key, name, popup, url)}).set);
    popup.open();
  }

  async function chfl_addLink(chfl, color, compactSwitch, description, editId, icon, key, name, popup, url) {
    let match = url.value.match(/\/(giveaway|discussion|support\/ticket|trade)\/(.+?)\//) || url.value.match(/.*(\/|\?)(.+)$/);
    let item = {
      color: color.value,
      compact: compactSwitch.value ? 1 : 0,
      description: description.value,
      icon: icon.value,
      id: match[2],
      name: name.value,
      url: url.value
    };
    if (editId) {
      chfl.sources[key].elements[editId].remove();
      delete chfl.sources[key].elements[editId];
      for (let i = esgst.settings[`chfl_${key}_${esgst.name}`].length - 1; i > -1; i--) {
        let subItem = esgst.settings[`chfl_${key}_${esgst.name}`][i];
        if (subItem.id) {
          if (subItem.id !== editId) continue;
          esgst.settings[`chfl_${key}_${esgst.name}`][i] = item;
          break;
        } else {
          if (subItem !== editId) continue;
          esgst.settings[`chfl_${key}_${esgst.name}`][i] = item;
          break;
        }
      }
    } else {
      esgst.settings[`chfl_${key}_${esgst.name}`].push(item);
    }
    esgst[`chfl_${key}`] = esgst.settings[`chfl_${key}_${esgst.name}`];
    await setValue(`settings`, JSON.stringify(esgst.settings));
    chfl.sources[key].elements[item.id] = createElements(chfl.sources[key].context, `beforeEnd`, key === `footer` ? [{
      attributes: {
        [`data-link-id`]: item.id,
        [`data-link-key`]: `footer`
      },
      type: esgst.sg ? `div` : `li`,
      children: [{
        attributes: {
          class: `fa ${item.icon}`
        },
        type: `i`
      }, {
        attributes: {
          href: item.url
        },
        text: item.name,
        type: `a`
      }]
    }] : generateHeaderMenuItem(item, key));
    if (!item.description) {
      chfl.sources[key].elements[item.id].classList.add(`esgst-chfl-small`);
    }
    if (item.compact) {
      chfl.sources[key].elements[item.id].classList.add(`esgst-chfl-compact`);
    }
    chfl_makeDraggable(chfl, chfl.sources[key].elements[item.id]);
    chfl_reorder(chfl, key);
    popup.close();
  }

  function chfl_resetLinks(chfl, key, event) {
    event.preventDefault();
    event.stopPropagation();
    for (const item of esgst.settings[`chfl_${key}_${esgst.name}`]) {
      if (!item.id) continue;
      let element = chfl.sources[key].elements[item.id];
      if (!element) continue;
      element.remove();
      delete chfl.sources[key].elements[item.id];
    }
    esgst.settings[`chfl_${key}_${esgst.name}`] = esgst.defaultValues[`chfl_${key}_${esgst.name}`];
    esgst[`chfl_${key}`] = esgst.settings[`chfl_${key}_${esgst.name}`];
    chfl_reorder(chfl, key);
    setValue(`settings`, JSON.stringify(esgst.settings));
  }

  function chfl_removeLink(chfl, id, key, event) {
    event.preventDefault();
    event.stopPropagation();
    chfl.sources[key].elements[id].remove();
    delete chfl.sources[key].elements[id];
    chfl_saveOrder(chfl);
  }

  function chfl_removeButton(chfl, forceKey) {
    for (const key in chfl.sources) {
      const source = chfl.sources[key];
      if (key !== forceKey && (source.container.classList.contains(`is-hidden`) || source.container.classList.contains(`is_hidden`))) continue;

      const buttons = source.context.getElementsByClassName(`esgst-chfl-button`);
      let found = false;
      for (let i = buttons.length - 1; i > -1; i--) {
        found = true;
        buttons[i].remove();
      }
      for (const subKey in source.elements) {
        const element = source.elements[subKey],
            elements = element.getElementsByClassName(`esgst-chfl-panel`);
        for (let i = elements.length - 1; i > -1; i--) {
          elements[i].remove();
        }
      }
      return (found ? key : null);
    }
  }

