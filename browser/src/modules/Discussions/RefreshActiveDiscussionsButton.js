import { Module } from '../../class/Module';
import { common } from '../Common';
import { gSettings } from '../../class/Globals';

const
  checkMissingDiscussions = common.checkMissingDiscussions.bind(common),
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
  ;

class DiscussionsRefreshActiveDiscussionsButton extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            `Adds a button (`,
            ['i', { class: 'fa fa-refresh' }],
            `) to the page heading of the active discussions (in the main page) that allows you to refresh the active discussions without having to refresh the entire page.`
          ]]
        ]]
      ],
      id: 'radb',
      name: 'Refresh Active Discussions Button',
      sg: true,
      type: 'discussions'
    };
  }

  radb_addButtons() {
    let elements, i;
    elements = this.esgst.activeDiscussions.querySelectorAll(`.homepage_heading, .esgst-heading-button`);
    for (i = elements.length - 1; i > -1; --i) {
      createElements(elements[i], 'beforeBegin', [{
        attributes: {
          class: `esgst-radb-button${gSettings.oadd ? '' : ' homepage_heading'}`,
          title: getFeatureTooltip('radb', 'Refresh active discussions/deals')
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
        if (gSettings.oadd) {
          // noinspection JSIgnoredPromiseFromCall
          this.esgst.modules.discussionsOldActiveDiscussionsDesign.oadd_load(true, () => {
            icon.classList.remove('fa-spin');
          });
        } else {
          checkMissingDiscussions(true, () => {
            icon.classList.remove('fa-spin');
          });
        }
      });
    }
  }
}

const discussionsRefreshActiveDiscussionsButton = new DiscussionsRefreshActiveDiscussionsButton();

export { discussionsRefreshActiveDiscussionsButton };