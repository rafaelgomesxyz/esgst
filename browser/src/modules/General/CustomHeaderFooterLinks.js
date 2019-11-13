import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';
import { Logger } from '../../class/Logger';
import { IHeader } from '../../components/Header';

class GeneralCustomHeaderFooterLinks extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', 'Allows you to add custom links to the header dropdowns/footer of any page.'],
          ['li', 'Already comes with some predefined links:'],
          ['ul', [
            ['li', 'Giveaways: Hidden Games, Reduced CV Games, Browse Wishlist, Browse Recommended, Browse Group, Browse New'],
            ['li', 'Discussions: Categorize Discussions, Browse Announcements, Browse Bugs / Suggestions, Browse Deals, Browse General, Browse Group Recruitment, Browse Let\'s Play Together, Browse Off-Topic, Browse Puzzles, Browse Uncategorized'],
            ['li', 'Support: Real CV, Not Activated Wins, Multiple Wins'],
            ['li', 'Help: Change Log'],
            ['li', 'Account: Whitelist, Blacklist, Games, Groups, Wishlist'],
          ]],
          ['li', [
            'If you press the Ctrl key with a dropdown open, the feature adds two buttons ("',
            ['i', { class: 'fa fa-plus-circle' }],
            ' Add Custom Link" and "',
            ['i', { class: 'fa fa-undo' }],
            ' Reset Links") to the end of the dropdown that allow you to add/reset the custom links. It also adds two other buttons (',
            ['i', { class: 'fa fa-edit' }],
            ' to edit and ',
            ['i', { class: 'fa fa-trash' }],
            ' to remove) to each custom link in the dropdown that allow you to edit/remove the custom link.',
          ]],
          ['li', 'If you press the Ctrl key with no dropdown open, those same buttons will be added to the footer of the page.'],
          ['li', 'You can move the custom links by dragging and dropping them.'],
        ]],
      ],
      inputItems: 'chfl_key',
      id: 'chfl',
      name: 'Custom Header/Footer Links',
      sg: true,
      st: true,
      type: 'general',
    };

    this.newIds = {
      giveaways: {
        'new': 'createANewGiveaway',
        'wishlist': 'communityWishlist',
        'created': 'viewCreated',
        'entered': 'viewEntered',
        'won': 'viewWon',
      },
      discussions: {
        'new': 'createANewDiscussion',
        'created': 'viewCreated',
        'bookmarked': 'viewBookmarked',
      },
      support: {
        'new': 'createANewTicket',
      },
      help: {
        'comment-formatting': 'commentFormatting',
        'faq': 'faq',
        'guidelines': 'guidelines',
      },
      account: {
        'profile': 'syncWithSteam',
        'stats': 'myStats',
        'et': 'myEntryHistory',
        'ch': 'myCommentHistory',
        'user=[steamId]': 'reviews',
      },
      footer: {
        'archive': 'archive',
        'stats': 'stats',
        'roles': 'roles',
        'users': 'users',
        'steamgifts': 'steamGroup',
        '103582791432125620': 'chat',
        'privacy-policy': 'privacyPolicy',
        'cookie-policy': 'cookiePolicy',
        'terms-of-service': 'termsOfService',
        'advertising': 'advertise',
        'guidelines': 'guidelines',
        'comment-formatting': 'commentFormatting',
      },
      trades: {
        'new': 'newTrade',
        'user=[steamId]': 'myTrades',
      },
      myProfile: {
        'user=[steamId]': 'reviews',
      },
    };
  }

  init() {
    if (this.esgst.sg) {
      this.sources = {
        giveaways: 'giveaways',
        discussions: 'discussions',
        support: 'support',
        help: 'help',
        account: 'account',
        footer: 'footer',
      };
    } else {
      this.sources = {
        trades: 'trades',
        account: 'myProfile',
        footer: 'footer',
      };
    }

    for (const key of Object.keys(this.sources)) {
      const source = this.sources[key];

      const items = key === 'footer' ? Shared.footer.linkContainers : Shared.header.buttonContainers[source].dropdownItems;

      for (const itemKey of Object.keys(items)) {
        const item = items[itemKey];

        if (item.nodes.outer.dataset.linkId) {
          continue;
        }

        if (!item.data.url || item.data.url.match(/^javascript/) || (item.data.name === 'Steam' && key === 'footer')) {
          continue;
        }

        const id = IHeader.generateId(item.data.name);

        item.nodes.outer.dataset.linkId = id;
        item.nodes.outer.dataset.linkKey = key;
      }

      this.reorder(key, true);
    }

    this.esgst.documentEvents.keydown.add(this.checkKey.bind(this));
  }

  reorder(key, firstRun) {
    try {
      const ids = [];
      const source = this.sources[key];

      const objs = Settings.get(`chfl_${key}`);

      for (let i = objs.length - 1; i > -1; i--) {
        const objOrId = objs[i];

        if (objOrId.id) {
          let item = key === 'footer' ? Shared.footer.linkContainers[objOrId.id] : Shared.header.buttonContainers[source].dropdownItems[objOrId.id];

          if (!item || firstRun) {
            if (key === 'footer') {
              if (item && item.nodes.outer.dataset.linkId) {
                item.nodes.outer.remove();

                delete Shared.footer.linkContainers[objOrId.id];
              }

              item = Shared.footer.addLinkContainer({
                icon: `fa ${objOrId.icon}`,
                name: objOrId.name,
                side: 'right',
                url: objOrId.url,
              });

              item.nodes.outer.dataset.linkId = objOrId.id;
              item.nodes.outer.dataset.linkKey = key;
              item.nodes.outer.title = Shared.common.getFeatureTooltip('chfl');
            } else {
              if (item && item.nodes.outer.dataset.linkId) {
                item.nodes.outer.remove();

                delete Shared.header.buttonContainers[source].dropdownItems[objOrId.id];
              }

              item = Shared.header.addDropdownItem({
                buttonContainerId: source,
                description: objOrId.description,
                icon: `fa fa-fw ${objOrId.icon} ${objOrId.color} icon-${objOrId.color}`,
                name: objOrId.name,
                url: objOrId.url,
              });

              item.nodes.outer.dataset.linkId = objOrId.id;
              item.nodes.outer.dataset.linkKey = key;
              item.nodes.outer.title = Shared.common.getFeatureTooltip('chfl');

              if (!objOrId.description) {
                item.nodes.outer.classList.add('esgst-chfl-small');
              }

              if (objOrId.compact) {
                item.nodes.outer.classList.add('esgst-chfl-compact');
              }
            }
          }

          item.nodes.outer.parentElement.insertBefore(item.nodes.outer, item.nodes.outer.parentElement.firstElementChild);

          this.makeDraggable(item.nodes.outer);

          ids.push(objOrId.id);
        } else {
          const item = key === 'footer' ? Shared.footer.linkContainers[objOrId] : Shared.header.buttonContainers[source].dropdownItems[objOrId];

          if (item) {
            item.nodes.outer.parentElement.insertBefore(item.nodes.outer, item.nodes.outer.parentElement.firstElementChild);

            this.makeDraggable(item.nodes.outer);
          }

          ids.push(objOrId);
        }
      }

      const items = key === 'footer' ? Shared.footer.linkContainers : Shared.header.buttonContainers[source].dropdownItems;

      for (const itemKey of Object.keys(items)) {
        const item = items[itemKey];

        if (!item.nodes.outer.dataset.linkId || ids.indexOf(item.nodes.outer.dataset.linkId) > -1) {
          continue;
        }

        item.nodes.outer.remove();

        if (key === 'footer') {
          delete Shared.footer.linkContainers[itemKey];
        } else {
          delete Shared.header.buttonContainers[source].dropdownItems[itemKey];
        }
      }

      if (!firstRun) {
        this.removeButton(key);
        this.addButton(null, key);
      }
    } catch (error) {
      Logger.error(error.message);
    }
  }

  makeDraggable(element) {
    element.setAttribute('draggable', true);
    element.addEventListener('dragstart', this.startDrag.bind(this));
    element.addEventListener('dragenter', this.enterDrag.bind(this));
    element.addEventListener('dragend', this.saveOrder.bind(this));
  }

  startDrag(event) {
    event.dataTransfer.setData('text/plain', '');
    this.source = event.currentTarget;
  }

  enterDrag(event) {
    let current = this.source;
    let element = event.currentTarget;
    if (current.dataset.linkKey !== element.dataset.linkKey) return;
    do {
      current = current.previousElementSibling;
      if (current && current === element) {
        element.parentElement.insertBefore(this.source, element);
        return;
      }
    } while (current);
    element.parentElement.insertBefore(this.source, element.nextElementSibling);
  }

  saveOrder() {
    const settings = [];

    for (let key of Object.keys(this.sources)) {
      const elements = {};

      for (const item of Settings.get(`chfl_${key}`)) {
        if (item.id) {
          elements[item.id] = item;
        }
      }

      const setting = [];
      const source = this.sources[key];

      const container = key === 'footer' ? Shared.footer.nodes.rightNav : Shared.header.buttonContainers[source].nodes.absoluteDropdown;

      for (const child of container.children) {
        const id = child.dataset.linkId;

        if (!id) {
          continue;
        }

        setting.push(elements[id] || id);
      }

      settings.push({
        id: `chfl_${key}_${this.esgst.name}`,
        value: setting,
      });
    }

    Shared.common.setSetting(settings);
  }

  /**
   * @param {string} [forceKey]
   * @returns {*}
   */
  removeButton(forceKey) {
    for (const key of Object.keys(this.sources)) {
      const source = this.sources[key];

      const container = key === 'footer' ? Shared.footer.nodes.outer : Shared.header.buttonContainers[source].nodes.relativeDropdown;

      if (key !== forceKey && (container.classList.contains('is-hidden') || container.classList.contains('is_hidden'))) {
        continue;
      }

      let found = false;

      const panels = container.querySelectorAll('.esgst-chfl-panel');

      for (let i = panels.length - 1; i > -1; i--) {
        panels[i].remove();

        found = true;
      }

      if (key === 'footer') {
        if (Shared.footer.linkContainers['addCustomLink']) {
          Shared.footer.linkContainers['addCustomLink'].nodes.outer.remove();
          delete Shared.footer.linkContainers['addCustomLink'];

          Shared.footer.linkContainers['resetLinks'].nodes.outer.remove();
          delete Shared.footer.linkContainers['resetLinks'];
        }
      } else {
        if (Shared.header.buttonContainers[source].dropdownItems['addCustomLink']) {
          Shared.header.buttonContainers[source].dropdownItems['addCustomLink'].nodes.outer.remove();
          delete Shared.header.buttonContainers[source].dropdownItems['addCustomLink'];

          Shared.header.buttonContainers[source].dropdownItems['resetLinks'].nodes.outer.remove();
          delete Shared.header.buttonContainers[source].dropdownItems['resetLinks'];
        }
      }

      return (found ? key : null);
    }
  }

  addButton(removedKey, forceKey) {
    for (const key of Object.keys(this.sources)) {
      if (key === removedKey) {
        return;
      }

      const source = this.sources[key];

      const container = key === 'footer' ? Shared.footer.nodes.outer : Shared.header.buttonContainers[source].nodes.relativeDropdown;

      if (key !== forceKey && (container.classList.contains('is-hidden') || container.classList.contains('is_hidden'))) {
        continue;
      }

      const items = key === 'footer' ? Shared.footer.linkContainers : Shared.header.buttonContainers[source].dropdownItems;

      for (const itemKey of Object.keys(items)) {
        const item = items[itemKey];

        if (!item.nodes.outer.dataset.linkId) {
          continue;
        }

        const panel = DOM.build(item.nodes.outer, 'beforeEnd', [
          ['div', { class: 'esgst-chfl-panel' }, [
            ['i', { class: 'esgst-chfl-edit-button fa fa-edit grey icon-grey' }],
            ['i', { class: 'esgst-chfl-remove-button fa fa-trash grey icon-grey' }],
          ]],
        ]);

        panel.firstElementChild.addEventListener('click', this.openPopup.bind(this, item, key));
        panel.lastElementChild.addEventListener('click', this.removeLink.bind(this, item, key));
      }

      let button;

      if (key === 'footer') {
        button = Shared.footer.addLinkContainer({
          icon: 'fa fa-plus',
          name: 'Add Custom Link',
          position: 'beforeEnd',
          side: 'right',
          url: '#',
        });
      } else {
        button = Shared.header.addDropdownItem({
          buttonContainerId: source,
          description: 'Click here to add a custom link.',
          icon: 'fa fa-plus-circle grey icon-grey',
          name: 'Add Custom Link',
        });
      }

      button.nodes.outer.classList.add('esgst-chfl-button');

      button.nodes.outer.addEventListener('click', this.openPopup.bind(this, null, key));

      let resetButton;

      if (key === 'footer') {
        resetButton = Shared.footer.addLinkContainer({
          icon: 'fa fa-undo',
          name: 'Reset Links',
          position: 'beforeEnd',
          side: 'right',
          url: '#',
        });
      } else {
        resetButton = Shared.header.addDropdownItem({
          buttonContainerId: source,
          description: 'Click here to reset the custom links.',
          icon: 'fa fa-undo grey icon-grey',
          name: 'Reset Links',
        });
      }

      resetButton.nodes.outer.classList.add('esgst-chfl-button');

      resetButton.nodes.outer.addEventListener('click', Shared.common.createConfirmation.bind(Shared.common, 'Are you sure you want to reset the links? Any custom links you added will be deleted.', this.resetLinks.bind(this, key), null));

      return;
    }
  }

  openPopup(editItem, key, event) {
    try {
      event.preventDefault();
      let popup = new Popup({
        addScrollable: true,
        icon: editItem ? 'fa-edit' : 'fa-plus',
        isTemp: true,
        title: `${editItem ? 'Edit' : 'Add'} Custom Link`,
      });
      let description = Shared.common.createElements(popup.description, 'beforeEnd', [{
        type: 'div',
        children: [{
          text: 'URL:',
          type: 'span',
        }, {
          attributes: {
            class: 'fa fa-question-circle',
            title: 'Instead of entering "https://www.steamgifts.com/url", you can simply enter "/url".',
          },
          type: 'i',
        }, {
          attributes: {
            class: 'esgst-switch-input esgst-switch-input-large',
            type: 'text',
          },
          type: 'input',
        }],
      }, {
        type: 'div',
        children: [{
          text: 'Color:',
          type: 'span',
        }, {
          attributes: {
            class: 'esgst-switch-input esgst-switch-input-large',
          },
          type: 'select',
          children: [{
            attributes: {
              value: 'grey',
            },
            text: 'Grey (Default)',
            type: 'option',
          }, {
            attributes: {
              value: 'blue',
            },
            text: 'Blue',
            type: 'option',
          }, {
            attributes: {
              value: 'green',
            },
            text: 'Green',
            type: 'option',
          }, {
            attributes: {
              value: 'red',
            },
            text: 'Red',
            type: 'option',
          }, {
            attributes: {
              value: 'yellow',
            },
            text: 'Yellow',
            type: 'option',
          }],
        }],
      }, {
        type: 'div',
        children: [{
          text: 'Icon:',
          type: 'span',
        }, {
          attributes: {
            href: 'https://fontawesome.com/v4.7.0/icons/',
          },
          type: 'a',
          children: [{
            attributes: {
              class: 'fa fa-question-circle',
              title: 'You must use an icon from FontAwesome (click on this icon to go to the FontAwesome page). The icon must be in the format "fa-icon", without the quotes.',
            },
            type: 'i',
          }],
        }, {
          attributes: {
            class: 'esgst-switch-input esgst-switch-input-large',
            type: 'text',
          },
          type: 'input',
        }],
      }, {
        type: 'div',
        children: [{
          text: 'Name:',
          type: 'span',
        }, {
          attributes: {
            class: 'esgst-switch-input esgst-switch-input-large',
            type: 'text',
          },
          type: 'input',
        }],
      }, {
        type: 'div',
        children: [{
          text: 'Description:',
          type: 'span',
        }, {
          attributes: {
            class: 'esgst-switch-input esgst-switch-input-large',
            type: 'text',
          },
          type: 'input',
        }],
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
      if (editItem) {
        const editId = editItem.nodes.outer.dataset.linkId;

        for (let i = Settings.get(`chfl_${key}`).length - 1; i > -1; i--) {
          let item = Settings.get(`chfl_${key}`)[i];
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
            description.value = editItem.data.description || '';
            name.value = editItem.data.name;
            icon.value = editItem.data.icon ? editItem.data.icon.match(/.+(fa-[a-z-]+)$/)[1] : '';
            color.value = editItem.data.icon ? editItem.data.icon.match(/icon-(.+?)\s/)[1] : '';
            url.value = editItem.data.url;
          }

          break;
        }
      }
      popup.description.appendChild(new ButtonSet({
        color1: 'green',
        color2: 'grey',
        icon1: editItem ? 'fa-edit' : 'fa-plus-circle',
        icon2: 'fa-circle-o-notch fa-spin',
        title1: editItem ? 'Edit' : 'Add',
        title2: editItem ? 'Editing...' : 'Adding...',
        callback1: this.addLink.bind(this, color, compactSwitch, description, editItem, icon, key, name, popup, url),
      }).set);
      popup.open();
    } catch (error) {
      Logger.error(error.message);
    }
  }

  async addLink(color, compactSwitch, description, editItem, icon, key, name, popup, url) {
    try {
      const item = {
        color: color.value,
        compact: compactSwitch.value ? 1 : 0,
        description: description.value,
        icon: icon.value,
        id: IHeader.generateId(name.value),
        name: name.value,
        url: url.value,
      };

      const setting = Settings.get(`chfl_${key}`);
      const source = this.sources[key];

      if (editItem) {
        const newId = editItem.data.id;
        const editId = editItem.nodes.outer.dataset.linkId;

        editItem.nodes.outer.remove();

        if (key === 'footer') {
          delete Shared.footer.linkContainers[newId];
        } else {
          delete Shared.header.buttonContainers[source].dropdownItems[newId];
        }

        for (let i = setting.length - 1; i > -1; i--) {
          const subItem = setting[i];

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

      await Shared.common.setSetting(`chfl_${key}_${this.esgst.name}`, setting);

      let newItem;

      if (key === 'footer') {
        newItem = Shared.footer.addLinkContainer({
          icon: `fa ${item.icon}`,
          name: item.name,
          side: 'right',
          url: item.url,
        });

        newItem.nodes.outer.dataset.linkId = item.id;
        newItem.nodes.outer.dataset.linkKey = key;
        newItem.nodes.outer.title = Shared.common.getFeatureTooltip('chfl');
      } else {
        newItem = Shared.header.addDropdownItem({
          buttonContainerId: source,
          description: item.description,
          icon: `fa fa-fw ${item.icon} ${item.color} icon-${item.color}`,
          name: item.name,
          url: item.url,
        });

        newItem.nodes.outer.dataset.linkId = item.id;
        newItem.nodes.outer.dataset.linkKey = key;
        newItem.nodes.outer.title = Shared.common.getFeatureTooltip('chfl');

        if (!item.description) {
          newItem.nodes.outer.classList.add('esgst-chfl-small');
        }

        if (item.compact) {
          newItem.nodes.outer.classList.add('esgst-chfl-compact');
        }
      }

      this.makeDraggable(newItem.nodes.outer);

      this.reorder(key);

      popup.close();
    } catch (error) {
      Logger.error(error.message);
    }
  }

  async resetLinks(key, event) {
    try {
      event.preventDefault();
      event.stopPropagation();

      for (const obj of Settings.get(`chfl_${key}`)) {
        if (!obj.id) {
          continue;
        }

        const source = this.sources[key];

        const item = key === 'footer' ? Shared.footer.linkContainers[obj.id] : Shared.header.buttonContainers[source].dropdownItems[obj.id];

        if (!item || !item.nodes.outer.dataset.linkId) {
          continue;
        }

        item.nodes.outer.remove();

        if (key === 'footer') {
          delete Shared.footer.linkContainers[obj.id];
        } else {
          delete Shared.header.buttonContainers[source].dropdownItems[obj.id];
        }
      }

      await Shared.common.setSetting(`chfl_${key}_${this.esgst.name}`, Settings.defaultValues[`chfl_${key}_${this.esgst.name}`]);

      this.reorder(key);
    } catch (error) {
      Logger.error(error.message);
    }
  }

  removeLink(itemToRemove, key, event) {
    try {
      event.preventDefault();
      event.stopPropagation();

      const source = this.sources[key];

      const id = itemToRemove.nodes.outer.dataset.linkId;

      const item = key === 'footer' ? Shared.footer.linkContainers[id] : Shared.header.buttonContainers[source].dropdownItems[id];

      if (item && item.nodes.outer.dataset.linkId) {
        item.nodes.outer.remove();

        if (key === 'footer') {
          delete Shared.footer.linkContainers[id];
        } else {
          delete Shared.header.buttonContainers[source].dropdownItems[id];
        }
      }

      this.saveOrder();
    } catch (error) {
      Logger.error(error.message);
    }
  }

  checkKey(event) {
    try {
      let value = '';
      if (event.ctrlKey) {
        value += 'ctrlKey + ';
      } else if (event.shiftKey) {
        value += 'shiftKey + ';
      } else if (event.altKey) {
        value += 'altKey + ';
      }
      value += event.key.toLowerCase();

      if (value !== Settings.get('chfl_key')) {
        return;
      }
      event.stopPropagation();
      const removedKey = this.removeButton();
      this.addButton(removedKey);
    } catch (error) {
      Logger.logs(error.message);
    }
  }
}

const generalCustomHeaderFooterLinks = new GeneralCustomHeaderFooterLinks();

export { generalCustomHeaderFooterLinks };