import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';

class DiscussionsActiveDiscussionsOnTopSidebar extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', `Moves the active discussions (in the main page) to the top/sidebar of the page (you can decide where).`],
          ['li', `If you move it to the sidebar, some things will be changed to save some space:`],
          ['ul', [
            ['li', `The username and avatar of the user who last posted to the discussion will be removed (the button to go to the last comment will remain).`],
            ['li', `If you have[id=ags] enabled, it will be hidden and only visible when hovering hover the search field.`]
          ]],
          ['li', `If you have[id=at] enabled, it will not run inside of the active discussions.`],
          ['li', `If you have[id=ut] enabled, any user tags will be hidden inside of the active discussions(they will still be visible if you click on the tag button to edit them).`]
        ]]
      ],
      id: 'adots',
      name: 'Active Discussions On Top/Sidebar',
      options: {
        title: `Move to:`,
        values: ['Top', 'Sidebar']
      },
      sg: true,
      type: 'discussions'
    };
  }

  async init() {
    if (!this.esgst.giveawaysPath || !this.esgst.activeDiscussions || Settings.get('oadd')) return;
    await Shared.common.checkMissingDiscussions();
  }

  adots_load(refresh) {
    let parent, panel, size, tabHeading1, tabHeading2, activeDiscussions, discussions, deals, element, elements, i,
      icon, n, comments, rows;
    if (this.esgst.activeDiscussions) {
      if (!refresh) {
        this.esgst.activeDiscussions.classList.remove('widget-container--margin-top');
        this.esgst.activeDiscussions.classList.add('esgst-adots');
      }
      if (Settings.get('adots_index') === 0) {
        if (!refresh) {
          parent = this.esgst.activeDiscussions.parentElement;
          parent.insertBefore(this.esgst.activeDiscussions, parent.firstElementChild);
          if (Settings.get('radb')) {
            this.esgst.modules.discussionsRefreshActiveDiscussionsButton.radb_addButtons();
          }
        } else if (Settings.get('oadd') && Settings.get('radb')) {
          this.esgst.modules.discussionsRefreshActiveDiscussionsButton.radb_addButtons();
        }
      } else {
        if (!refresh) {
          if (Settings.get('ib')) {
            size = 45;
          } else {
            size = 35;
          }
          this.esgst.style.insertAdjacentText("beforeend", `
            .esgst-adots .table__row-inner-wrap >:first-child {
              float: left;
              width: ${size}px;
              height: ${size}px;
            }
            .esgst-adots .table__row-inner-wrap >:first-child >* {
              width: ${size}px;
              height: ${size}px;
            }
            .esgst-adots .table__row-inner-wrap >:last-child {
              margin-left: ${size + 5}px;
              text-align: left;
              width: auto;
            }
            .esgst-adots .table__column--width-fill {
              margin-left: 5px;
              vertical-align: top;
              width: calc(100% - ${size + 15}px);
            }
          `);
          panel = Shared.common.createElements(this.esgst.sidebar, 'beforeEnd', [{
            attributes: {
              class: 'sidebar__heading'
            },
            type: 'h3',
            children: [{
              attributes: {
                class: 'esgst-adots-tab-heading esgst-selected'
              },
              text: 'Discussions',
              type: 'span'
            }, {
              attributes: {
                class: 'esgst-adots-tab-heading'
              },
              text: 'Deals',
              type: 'span'
            }, {
              attributes: {
                class: 'esgst-float-right sidebar__navigation__item__name',
                href: '/discussions'
              },
              text: 'More',
              type: 'a'
            }]
          }]);
          tabHeading1 = panel.firstElementChild;
          tabHeading2 = tabHeading1.nextElementSibling;
          if (Settings.get('radb')) {
            Shared.common.createElements(tabHeading2.nextElementSibling, 'beforeBegin', [{
              attributes: {
                class: 'esgst-radb-button',
                title: `${Shared.common.getFeatureTooltip('radb', 'Refresh active discussions/deals')}`
              },
              type: 'div',
              children: [{
                attributes: {
                  class: 'fa fa-refresh'
                },
                type: 'i'
              }]
            }]).addEventListener('click', event => {
              let icon = event.currentTarget.firstElementChild;
              icon.classList.add('fa-spin');
              if (Settings.get('oadd')) {
                // noinspection JSIgnoredPromiseFromCall
                this.esgst.modules.discussionsOldActiveDiscussionsDesign.oadd_load(true, () => icon.classList.remove('fa-spin'));
              } else {
                Shared.common.checkMissingDiscussions(true, () => icon.classList.remove('fa-spin'));
              }
            });
          }
        }
        if (Settings.get('oadd')) {
          discussions = this.esgst.activeDiscussions.firstElementChild;
          deals = this.esgst.activeDiscussions.lastElementChild;
          discussions.firstElementChild.remove();
          discussions.firstElementChild.firstElementChild.remove();
          deals.firstElementChild.remove();
          deals.firstElementChild.firstElementChild.remove();
          elements = this.esgst.activeDiscussions.getElementsByClassName('table__column--last-comment');
          for (i = 0, n = elements.length; i < n; ++i) {
            icon = elements[0].getElementsByClassName('table__last-comment-icon')[0];
            if (icon) {
              icon.classList.add('esgst-float-right');
              elements[0].previousElementSibling.appendChild(icon);
            }
            elements[0].remove();
          }
          if (!refresh) {
            discussions = discussions.firstElementChild.firstElementChild;
            deals = deals.firstElementChild.firstElementChild;
          }
        } else {
          if (refresh) {
            rows = document.getElementsByClassName('table');
            discussions = rows[0];
            deals = rows[1];
          } else {
            discussions = this.esgst.activeDiscussions.firstElementChild.firstElementChild.lastElementChild;
            deals = this.esgst.activeDiscussions.lastElementChild.firstElementChild.lastElementChild;
          }
          elements = discussions.getElementsByClassName('table__row-outer-wrap');
          for (i = 0, n = elements.length; i < n; ++i) {
            element = elements[i];
            comments = element.getElementsByClassName('table__column__secondary-link')[0];
            parent = comments.parentElement;
            panel = Shared.common.createElements(parent, 'afterEnd', [{
              type: 'p'
            }, {
              attributes: {
                style: `clear: both;`
              },
              type: 'div'
            }]);
            panel.appendChild(comments);
            if (parent.lastElementChild.classList.contains('table__last-comment-icon')) {
              parent.lastElementChild.classList.add('esgst-float-right');
              panel.appendChild(parent.lastElementChild);
            }
            parent.remove();
          }
          elements = deals.getElementsByClassName('table__row-outer-wrap');
          for (i = 0, n = elements.length; i < n; ++i) {
            element = elements[i];
            comments = element.getElementsByClassName('table__column__secondary-link')[0];
            parent = comments.parentElement;
            panel = Shared.common.createElements(parent, 'afterEnd', [{
              type: 'p'
            }, {
              attributes: {
                style: `clear: both;`
              },
              type: 'div'
            }]);
            panel.appendChild(comments);
            if (parent.lastElementChild.classList.contains('table__last-comment-icon')) {
              parent.lastElementChild.classList.add('esgst-float-right');
              panel.appendChild(parent.lastElementChild);
            }
            parent.remove();
          }
        }
        if (!tabHeading1) {
          tabHeading1 = discussions.parentElement.previousElementSibling.firstElementChild;
          tabHeading2 = tabHeading1.nextElementSibling;
        }
        if (tabHeading1.classList.contains('esgst-selected')) {
          deals.classList.add('esgst-hidden', 'esgst-adots');
          discussions.classList.add('esgst-adots');
          discussions.classList.remove('esgst-hidden');
        } else {
          discussions.classList.add('esgst-hidden', 'esgst-adots');
          deals.classList.add('esgst-adots');
          deals.classList.remove('esgst-hidden');
        }
        if (!refresh) {
          activeDiscussions = Shared.common.createElements(this.esgst.sidebar, 'beforeEnd', [{
            type: 'div'
          }]);
          activeDiscussions.appendChild(discussions);
          activeDiscussions.appendChild(deals);
          tabHeading1.addEventListener('click', this.adots_changeTab.bind(this, tabHeading1, tabHeading2));
          tabHeading2.addEventListener('click', this.adots_changeTab.bind(this, tabHeading1, tabHeading2));
          this.esgst.activeDiscussions.remove();
          this.esgst.activeDiscussions = activeDiscussions;
        }
      }
    }
  }

  adots_changeTab(button1, button2, event) {
    if ((button1.classList.contains('esgst-selected') && event.currentTarget === button2) || (button2.classList.contains('esgst-selected') && event.currentTarget === button1)) {
      button1.classList.toggle('esgst-selected');
      button2.classList.toggle('esgst-selected');
      button1.parentElement.nextElementSibling.firstElementChild.classList.toggle('esgst-hidden');
      button1.parentElement.nextElementSibling.lastElementChild.classList.toggle('esgst-hidden');
    }
  }
}

const discussionsActiveDiscussionsOnTopSidebar = new DiscussionsActiveDiscussionsOnTopSidebar();

export { discussionsActiveDiscussionsOnTopSidebar };