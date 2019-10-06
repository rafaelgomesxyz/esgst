import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { common } from '../Common';
import { shared, Shared } from '../../class/Shared';
import { gSettings } from '../../class/Globals';

const
  createConfirmation = common.createConfirmation.bind(common),
  createElements = common.createElements.bind(common),
  generateHeaderMenuItem = common.generateHeaderMenuItem.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
  ;

class GeneralCustomHeaderFooterLinks extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', 'Allows you to add custom links to the header dropdowns/footer of any page.'],
          ['li', `Already comes with some predefined links:`],
          ['ul', [
            ['li', `Giveaways: Hidden Games, Reduced CV Games, Browse Wishlist, Browse Recommended, Browse Group, Browse New`],
            ['li', `Discussions: Categorize Discussions, Browse Announcements, Browse Bugs / Suggestions, Browse Deals, Browse General, Browse Group Recruitment, Browse Let's Play Together, Browse Off-Topic, Browse Puzzles, Browse Uncategorized`],
            ['li', `Support: Real CV, Not Activated Wins, Multiple Wins`],
            ['li', `Help: Change Log`],
            ['li', `Account: Whitelist, Blacklist, Games, Groups, Wishlist`]
          ]],
          ['li', [
            `If you press the Ctrl key with a dropdown open, the feature adds two buttons ("`,
            ['i', { class: 'fa fa-plus-circle' }],
            ' Add Custom Link" and "',
            ['i', { class: 'fa fa-undo' }],
            ` Reset Links") to the end of the dropdown that allow you to add/reset the custom links. It also adds two other buttons (`,
            ['i', { class: 'fa fa-edit' }],
            ' to edit and ',
            ['i', { class: 'fa fa-trash' }],
            ` to remove) to each custom link in the dropdown that allow you to edit/remove the custom link.`
          ]],
          ['li', `If you press the Ctrl key with no dropdown open, those same buttons will be added to the footer of the page.`],
          ['li', 'You can move the custom links by dragging and dropping them.']
        ]]
      ],
      inputItems: 'chfl_key',
      id: 'chfl',
      name: 'Custom Header/Footer Links',
      sg: true,
      st: true,
      type: 'general'
    };
  }

  init() {
    let chfl = null;
    if (this.esgst.sg) {
      chfl = {
        sources: {
          giveaways: {
            container: this.esgst.giveawaysDropdown,
            context: this.esgst.giveawaysDropdown.firstElementChild,
            elements: {}
          },
          discussions: {
            container: this.esgst.discussionsDropdown,
            context: this.esgst.discussionsDropdown.firstElementChild,
            elements: {}
          },
          support: {
            container: this.esgst.supportDropdown,
            context: this.esgst.supportDropdown.firstElementChild,
            elements: {}
          },
          help: {
            container: this.esgst.helpDropdown,
            context: this.esgst.helpDropdown.firstElementChild,
            elements: {}
          },
          account: {
            container: this.esgst.accountDropdown,
            context: this.esgst.accountDropdown.firstElementChild,
            elements: {}
          },
          footer: {
            container: Shared.footer.nodes.outer,
            context: Shared.footer.nodes.rightNav,
            elements: {}
          }
        }
      };
    } else {
      let elements = document.getElementsByClassName('dropdown');
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
            container: Shared.footer.nodes.outer,
            context: Shared.footer.nodes.rightNav,
            elements: {}
          }
        }
      };
    }
    for (let key in chfl.sources) {
      if (chfl.sources.hasOwnProperty(key)) {
        let source = chfl.sources[key];
        for (let i = source.context.children.length - 1; i > -1; i--) {
          let element = source.context.children[i];
          let id = element.getAttribute('data-link-id');
          if (id) {
            if (!source.elements[id]) {
              source.elements[id] = element;
            }
            continue;
          }
          if ((!element.getAttribute('href') || element.getAttribute('href').match(/^javascript/)) && (key !== 'footer' || !element.lastElementChild.getAttribute('href'))) continue;
          id = (key === 'footer' ? element.lastElementChild : element).getAttribute('href').match(/.*([/?:])(.+?)(@|$)/)[2];
          id = id.replace(/\[steamId]/, gSettings.steamId);
          element.setAttribute('data-link-id', id);
          element.setAttribute('data-link-key', key);
          source.elements[id] = element;
        }
        this.chfl_reorder(chfl, key, true);
      }
    }
    this.esgst.documentEvents.keydown.add(this.chfl_checkKey.bind(this, chfl));
  }

  chfl_checkKey(chfl, event) {
    let value = '';
    if (event.ctrlKey) {
      value += 'ctrlKey + ';
    } else if (event.shiftKey) {
      value += 'shiftKey + ';
    } else if (event.altKey) {
      value += 'altKey + ';
    }
    value += event.key.toLowerCase();

    if (value !== gSettings.chfl_key) {
      return;
    }
    event.stopPropagation();

    const removedKey = this.chfl_removeButton(chfl);
    this.chfl_addButton(chfl, removedKey);
  }

  chfl_reorder(chfl, key, firstRun) {
    let source = chfl.sources[key];
    let ids = [];
    for (let i = gSettings[`chfl_${key}`].length - 1; i > -1; i--) {
      let item = gSettings[`chfl_${key}`][i];
      if (item.id) {
        let element = source.elements[item.id];
        if (element && !firstRun) {
          source.context.insertBefore(element, source.context.firstElementChild);
        } else {
          if (element) {
            element.remove();
          }
          if (key === 'footer') {
            source.elements[item.id] = createElements(source.context, 'afterBegin', [{
              attributes: {
                ['data-link-id']: item.id,
                ['data-link-key']: 'footer',
                title: getFeatureTooltip('chfl')
              },
              type: this.esgst.sg ? 'div' : 'li',
              children: [{
                attributes: {
                  class: `fa ${item.icon}`
                },
                type: 'i'
              }, {
                attributes: {
                  href: item.url
                },
                text: item.name,
                type: 'a'
              }]
            }]);
          } else {
            source.elements[item.id] = createElements(source.context, 'afterBegin', generateHeaderMenuItem(item, key));
            source.elements[item.id].title = getFeatureTooltip('chfl');
            if (!item.description) {
              source.elements[item.id].classList.add('esgst-chfl-small');
            }
            if (item.compact) {
              source.elements[item.id].classList.add('esgst-chfl-compact');
            }
          }
        }
        this.chfl_makeDraggable(chfl, source.elements[item.id]);
        ids.push(item.id);
      } else {
        let element = source.elements[item];
        if (element) {
          source.context.insertBefore(element, source.context.firstElementChild);
          this.chfl_makeDraggable(chfl, element);
        }
        ids.push(item);
      }
    }
    for (let key in source.elements) {
      if (source.elements.hasOwnProperty(key)) {
        if (ids.indexOf(key) > -1) continue;
        source.elements[key].remove();
        delete source.elements[key];
      }
    }
    if (!firstRun) {
      this.chfl_removeButton(chfl, key);
      this.chfl_addButton(chfl, null, key);
    }
  }

  chfl_makeDraggable(chfl, element) {
    element.setAttribute('draggable', true);
    element.addEventListener('dragstart', this.chfl_startDrag.bind(this, chfl));
    element.addEventListener('dragenter', this.chfl_enterDrag.bind(this, chfl));
    element.addEventListener('dragend', this.chfl_saveOrder.bind(this, chfl));
  }

  chfl_startDrag(chfl, event) {
    event.dataTransfer.setData('text/plain', '');
    chfl.source = event.currentTarget;
  }

  chfl_enterDrag(chfl, event) {
    let current = chfl.source;
    let element = event.currentTarget;
    if (current.getAttribute('data-link-key') !== element.getAttribute('data-link-key')) return;
    do {
      current = current.previousElementSibling;
      if (current && current === element) {
        element.parentElement.insertBefore(chfl.source, element);
        return;
      }
    } while (current);
    element.parentElement.insertBefore(chfl.source, element.nextElementSibling);
  }

  chfl_saveOrder(chfl) {
    const settings = [];
    for (let key in chfl.sources) {
      if (chfl.sources.hasOwnProperty(key)) {
        let elements = {};
        for (const item of gSettings[`chfl_${key}_${this.esgst.name}`]) {
          if (item.id) {
            elements[item.id] = item;
          }
        }
        const setting = [];
        let source = chfl.sources[key];
        for (let i = 0, n = source.context.children.length; i < n; i++) {
          let element = source.context.children[i];
          let id = element.getAttribute('data-link-id');
          if (!id) continue;
          setting.push(elements[id] || id);
        }
        settings.push({
          id: `chfl_${key}_${this.esgst.name}`,
          value: setting
        });
      }
    }
    shared.common.setSetting(settings);
  }

  chfl_addButton(chfl, removedKey, forceKey) {
    for (const key in chfl.sources) {
      if (chfl.sources.hasOwnProperty(key)) {
        if (key === removedKey) return;

        const source = chfl.sources[key];
        if (key !== forceKey && (source.container.classList.contains('is-hidden') || source.container.classList.contains('is_hidden'))) continue;

        const button = createElements(source.context, 'beforeEnd', key === 'footer' ? [{
          attributes: {
            class: 'esgst-chfl-button'
          },
          type: this.esgst.sg ? 'div' : 'li',
          children: [{
            attributes: {
              class: 'fa fa-plus'
            },
            type: 'i'
          }, {
            attributes: {
              href: '#'
            },
            text: 'Add Custom Link',
            type: 'a'
          }]
        }] : generateHeaderMenuItem({
          className: ' esgst-chfl-button',
          color: 'grey',
          icon: 'fa-plus-circle',
          name: 'Add Custom Link',
          description: 'Click here to add a custom link.'
        }));
        button.addEventListener('click', this.chfl_openPopup.bind(this, chfl, null, key));
        const resetButton = createElements(source.context, 'beforeEnd', key === 'footer' ? [{
          attributes: {
            class: 'esgst-chfl-button'
          },
          type: this.esgst.sg ? 'div' : 'li',
          children: [{
            attributes: {
              class: 'fa fa-undo'
            },
            type: 'i'
          }, {
            attributes: {
              href: '#'
            },
            text: 'Reset Links',
            type: 'a'
          }]
        }] : generateHeaderMenuItem({
          className: ' esgst-chfl-button',
          color: 'grey',
          icon: 'fa-undo',
          name: 'Reset Links',
          description: 'Click here to reset the custom links.'
        }));
        resetButton.addEventListener('click', createConfirmation.bind(common, 'Are you sure you want to reset the links? Any custom links you added will be deleted.', this.chfl_resetLinks.bind(this,  chfl, key), null));
        for (const subKey in source.elements) {
          if (source.elements.hasOwnProperty(subKey)) {
            const element = source.elements[subKey],
              panel = createElements(element, 'beforeEnd', [{
                attributes: {
                  class: 'esgst-chfl-panel'
                },
                type: 'div',
                children: [{
                  attributes: {
                    class: 'esgst-chfl-edit-button fa fa-edit icon-grey',
                  },
                  type: 'i'
                }, {
                  attributes: {
                    class: 'esgst-chfl-remove-button fa fa-trash icon-grey',
                  },
                  type: 'i'
                }]
              }]);
            panel.firstElementChild.addEventListener('click', this.chfl_openPopup.bind(this, chfl, subKey, key));
            panel.lastElementChild.addEventListener('click', this.chfl_removeLink.bind(this, chfl, subKey, key));
          }
        }
        return;
      }
    }
  }

  chfl_openPopup(chfl, editId, key, event) {
    event.preventDefault();
    let popup = new Popup({
      addScrollable: true,
      icon: editId ? 'fa-edit' : 'fa-plus',
      isTemp: true,
      title: `${editId ? 'Edit' : 'Add'} Custom Link`
    });
    let description = createElements(popup.description, 'beforeEnd', [{
      type: 'div',
      children: [{
        text: `URL:`,
        type: 'span'
      }, {
        attributes: {
          class: 'fa fa-question-circle',
          title: `Instead of entering 'https://www.steamgifts.com/url', you can simply enter '/url'.`
        },
        type: 'i'
      }, {
        attributes: {
          class: 'esgst-switch-input esgst-switch-input-large',
          type: 'text'
        },
        type: 'input'
      }]
    }, {
      type: 'div',
      children: [{
        text: `Color:`,
        type: 'span'
      }, {
        attributes: {
          class: 'esgst-switch-input esgst-switch-input-large'
        },
        type: 'select',
        children: [{
          attributes: {
            value: 'grey'
          },
          text: `Grey (Default)`,
          type: 'option'
        }, {
          attributes: {
            value: 'blue'
          },
          text: 'Blue',
          type: 'option'
        }, {
          attributes: {
            value: 'green'
          },
          text: 'Green',
          type: 'option'
        }, {
          attributes: {
            value: 'red'
          },
          text: 'Red',
          type: 'option'
        }, {
          attributes: {
            value: 'yellow'
          },
          text: 'Yellow',
          type: 'option'
        }]
      }]
    }, {
      type: 'div',
      children: [{
        text: `Icon:`,
        type: 'span'
      }, {
        attributes: {
          href: `https://fontawesome.com/v4.7.0/icons/`
        },
        type: 'a',
        children: [{
          attributes: {
            class: 'fa fa-question-circle',
            title: `You must use an icon from FontAwesome (click on this icon to go to the FontAwesome page). The icon must be in the format 'fa-icon', without the quotes.`
          },
          type: 'i'
        }]
      }, {
        attributes: {
          class: 'esgst-switch-input esgst-switch-input-large',
          type: 'text'
        },
        type: 'input'
      }]
    }, {
      type: 'div',
      children: [{
        text: `Name:`,
        type: 'span'
      }, {
        attributes: {
          class: 'esgst-switch-input esgst-switch-input-large',
          type: 'text'
        },
        type: 'input'
      }]
    }, {
      type: 'div',
      children: [{
        text: `Description:`,
        type: 'span'
      }, {
        attributes: {
          class: 'esgst-switch-input esgst-switch-input-large',
          type: 'text'
        },
        type: 'input'
      }]
    }]);
    let name = description.previousElementSibling;
    let icon = name.previousElementSibling;
    let color = icon.previousElementSibling;
    let url = color.previousElementSibling.lastElementChild;
    let compactSwitch = new ToggleSwitch(popup.description, null, null, 'Use compact size.', false, false, 'The bottom/top padding of the link will be reduced to 8px.', false);
    description = description.lastElementChild;
    name = name.lastElementChild;
    icon = icon.lastElementChild;
    color = color.lastElementChild;
    if (key === 'footer') {
      color.parentElement.classList.add('esgst-hidden');
      description.parentElement.classList.add('esgst-hidden');
      compactSwitch.container.classList.add('esgst-hidden');
    }
    if (this.esgst.st) {
      description.parentElement.classList.add('esgst-hidden');
    }
    if (editId) {
      for (let i = gSettings[`chfl_${key}`].length - 1; i > -1; i--) {
        let item = gSettings[`chfl_${key}`][i];
        if (item !== editId && (!item.id || item.id !== editId)) continue;
        if (item.id) {
          description.value = item.description || '';
          name.value = item.name || '';
          icon.value = item.icon || '';
          color.value = item.color || '';
          url.value = item.url || '';
          if (item.compact) {
            compactSwitch.enable();
          }
        } else {
          let element = chfl.sources[key].elements[item];
          let context = element.firstElementChild;
          if (this.esgst.sg) {
            if (key === 'footer') {
              name.value = context.nextElementSibling.textContent.trim();
              icon.value = context.className.match(/.+(fa-.+)$/)[1];
              url.value = context.nextElementSibling.getAttribute('href');
            } else {
              description.value = context.nextElementSibling.lastElementChild.textContent.trim();
              name.value = context.nextElementSibling.firstElementChild.textContent.trim();
              icon.value = context.className.match(/.+(fa-.+)$/)[1];
              color.value = context.className.match(/icon-(.+?)\s/)[1];
              url.value = element.getAttribute('href');
            }
          } else {
            if (key === 'footer') {
              name.value = context.nextElementSibling.textContent.trim();
              icon.value = context.className.match(/.+(fa-.+)$/)[1];
              url.value = context.nextElementSibling.getAttribute('href');
            } else {
              name.value = context.nextElementSibling.textContent.trim();
              icon.value = context.className.match(/.+(fa-.+)$/)[1];
              color.value = context.className.match(/^(.+?)\s/)[1];
              url.value = element.getAttribute('href');
            }
          }
        }
        break;
      }
    }
    popup.description.appendChild(new ButtonSet({
      color1: 'green',
      color2: 'grey',
      icon1: editId ? 'fa-edit' : 'fa-plus-circle',
      icon2: 'fa-circle-o-notch fa-spin',
      title1: editId ? 'Edit' : 'Add',
      title2: editId ? 'Editing...' : 'Adding...',
      callback1: this.chfl_addLink.bind(this, chfl, color, compactSwitch, description, editId, icon, key, name, popup, url)
    }).set);
    popup.open();
  }

  async chfl_addLink(chfl, color, compactSwitch, description, editId, icon, key, name, popup, url) {
    let match = url.value.match(/\/(giveaway|discussion|support\/ticket|trade)\/(.+?)\//) || url.value.match(/.*([/?])(.+)$/);
    let item = {
      color: color.value,
      compact: compactSwitch.value ? 1 : 0,
      description: description.value,
      icon: icon.value,
      id: match[2],
      name: name.value,
      url: url.value
    };
    const setting = gSettings[`chfl_${key}_${this.esgst.name}`];
    if (editId) {
      chfl.sources[key].elements[editId].remove();
      delete chfl.sources[key].elements[editId];
      for (let i = setting.length - 1; i > -1; i--) {
        let subItem = setting[i];
        if (subItem.id) {
          if (subItem.id !== editId) continue;
          setting[i] = item;
          break;
        } else {
          if (subItem !== editId) continue;
          setting[i] = item;
          break;
        }
      }
    } else {
      setting.push(item);
    }
    await shared.common.setSetting(`chfl_${key}_${this.esgst.name}`, setting);
    chfl.sources[key].elements[item.id] = createElements(chfl.sources[key].context, 'beforeEnd', key === 'footer' ? [{
      attributes: {
        ['data-link-id']: item.id,
        ['data-link-key']: 'footer'
      },
      type: this.esgst.sg ? 'div' : 'li',
      children: [{
        attributes: {
          class: `fa ${item.icon}`
        },
        type: 'i'
      }, {
        attributes: {
          href: item.url
        },
        text: item.name,
        type: 'a'
      }]
    }] : generateHeaderMenuItem(item, key));
    if (!item.description) {
      chfl.sources[key].elements[item.id].classList.add('esgst-chfl-small');
    }
    if (item.compact) {
      chfl.sources[key].elements[item.id].classList.add('esgst-chfl-compact');
    }
    this.chfl_makeDraggable(chfl, chfl.sources[key].elements[item.id]);
    this.chfl_reorder(chfl, key);
    popup.close();
  }

  async chfl_resetLinks(chfl, key, event) {
    event.preventDefault();
    event.stopPropagation();
    for (const item of gSettings[`chfl_${key}_${this.esgst.name}`]) {
      if (!item.id) continue;
      let element = chfl.sources[key].elements[item.id];
      if (!element) continue;
      element.remove();
      delete chfl.sources[key].elements[item.id];
    }
    await shared.common.setSetting(`chfl_${key}_${this.esgst.name}`, this.esgst.defaultValues[`chfl_${key}_${this.esgst.name}`]);
    this.chfl_reorder(chfl, key);
  }

  chfl_removeLink(chfl, id, key, event) {
    event.preventDefault();
    event.stopPropagation();
    chfl.sources[key].elements[id].remove();
    delete chfl.sources[key].elements[id];
    this.chfl_saveOrder(chfl);
  }

  /**
   * @param chfl
   * @param [forceKey]
   * @returns {*}
   */
  chfl_removeButton(chfl, forceKey) {
    for (const key in chfl.sources) {
      if (chfl.sources.hasOwnProperty(key)) {
        const source = chfl.sources[key];
        if (key !== forceKey && (source.container.classList.contains('is-hidden') || source.container.classList.contains('is_hidden'))) continue;

        const buttons = source.context.getElementsByClassName('esgst-chfl-button');
        let found = false;
        for (let i = buttons.length - 1; i > -1; i--) {
          found = true;
          buttons[i].remove();
        }
        for (const subKey in source.elements) {
          if (source.elements.hasOwnProperty(subKey)) {
            const element = source.elements[subKey],
              elements = element.getElementsByClassName('esgst-chfl-panel');
            for (let i = elements.length - 1; i > -1; i--) {
              elements[i].remove();
            }
          }
        }
        return (found ? key : null);
      }
    }
  }
}

const generalCustomHeaderFooterLinks = new GeneralCustomHeaderFooterLinks();

export { generalCustomHeaderFooterLinks };