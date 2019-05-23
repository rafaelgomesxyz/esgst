import { common } from '../Common';
import { shared } from '../../class/Shared';
import { Filters } from '../Filters';
import { gSettings } from '../../class/Globals';

class GroupsGroupFilters extends Filters {
  constructor() {
    super(`gpf`);
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Allows you to filter groups.`
          ]],
          [`li`, [
            `Adds a toggle switch with a button (`,
            [`i`, { class: `fa fa-sliders` }],
            `) to the main page heading of the `,
            [`a`, { href: `https://www.steamgifts.com/account/steam/groups` }, `groups`],
            ` page. The switch allows you to turn the filters on/off and the button allows you to manage your presets.`
          ]],
          [`li`, `Adds a collapsible panel below the same main page heading that allows you to change/save the rules of a preset. The filters are separated in 2 categories:`],
          [`ul`, [
            [`li`, `Basic filters are related to a numeric value (such as the number of comments of a group) and have a slider that you can use to set the range of the filter (any groups that do not apply to the range will be hidden).`],
            [`li`, `Type filters are related to a boolean value (such as whether or not a group was created by yourself) and have a checkbox that changes states when you click on it. The checkbox has 3 states:`],
            [`ul`, [
              [`li`, [
                `"Show all" (`,
                [`i`, { class: `fa fa-check-square` }],
                `) does not hide any groups that apply to the filter (this is the default state).`
              ]],
              [`li`, [
                `"Show only" (`,
                [`i`, { class: `fa fa-square` }],
                `) hides any groups that do not apply to the filter.`
              ]],
              [`li`, [
                `"Hide all" (`,
                [`i`, { class: `fa fa-square-o` }],
                `) hides any groups that apply to the filter.`
              ]]
            ]]
          ]],
          [`li`, `A preset contains all of your rules and can be saved to be reused later. You can save as many presets as you want. Each preset contains 3 types of rules:`],
          [`ul`, [
            [`li`, `Basic rules are the ones that you can change directly in the filter panel, using the sliders/checkboxes as explained in the previous item.`],
            [`li`, `Exception rules are the ones that you can change by clicking on the icon `],
            [`i`, { class: `fa fa-gear` }],
            ` in the filter panel. They are exceptions to the basic rules. For example, if you set the basic rule of the "Created" filter to "hide all" and you add an exception rule for the "Comments" filter to the 0-50 range, none of your created groups that have 0-50 comments will be hidden, because they apply to the exception.`
          ]],
          [`li`, [
            `Override rules are the ones that you can change by clicking on the icon (`,
            [`i`, { class: `fa fa-exclamation esgst-faded` }],
            ` if set to overridable and `,
            [`i`, { class: `fa fa-exclamation` }],
            ` if set to non-overridable) next to each filter. They are enforcements of the basic rules. Continuing the previous example, if you set the override rule of the "Created" filter to "non-overridable", then all of your created groups will be hidden, because even if they apply to the exception, the basic rule is being enforced by the override rule, so the exception cannot override it.`
          ]],
          [`li`, `Adds a text in parenthesis to the pagination of the page showing how many groups in the page are being filtered by the filters.`]
        ]]
      ],
      features: {
        gpf_m_b: {
          name: `Hide basic filters.`,
          sg: true
        },
        gpf_m_a: {
          name: `Hide advanced filters.`,
          sg: true
        },
        gpf_users: {
          dependencies: [`gs`],
          description: [
            [`ul`, [
              [`li`, `Allows you to filter groups by the number of users that are members.`]
            ]]
          ],
          name: `Users`,
          sg: true
        },
        gpf_lastGiveaway: {
          dependencies: [`gs`],
          description: [
            [`ul`, [
              [`li`, `Allows you to filter groups by the date of the last giveaway made.`]
            ]]
          ],
          name: `Last Giveaway`,
          sg: true
        },
        gpf_officialGameGroup: {
          dependencies: [`gs`, `gs_t`],
          description: [
            [`ul`, [
              [`li`, `Allows you to filter groups that are official game groups.`]
            ]]
          ],
          name: `Official Game Group`,
          sg: true
        },
        gpf_open: {
          dependencies: [`gs`, `gs_t`],
          description: [
            [`ul`, [
              [`li`, `Allows you to filter groups that are open to join.`]
            ]]
          ],
          name: `Open`,
          sg: true
        },
        gpf_restricted: {
          dependencies: [`gs`, `gs_t`],
          description: [
            [`ul`, [
              [`li`, `Allows you to filter groups that are restricted to join.`]
            ]]
          ],
          name: `Restricted`,
          sg: true
        },
        gpf_closed: {
          dependencies: [`gs`, `gs_t`],
          description: [
            [`ul`, [
              [`li`, `Allows you to filter groups that are closed to join.`]
            ]]
          ],
          name: `Closed`,
          sg: true
        }
      },
      id: `gpf`,
      name: `Group Filters`,
      sg: true,
      type: `groups`
    };
  }

  async init() {
    if (!shared.common.isCurrentPath(`Steam - Groups`)) {
      return;
    }
    shared.esgst.style.insertAdjacentText("beforeend", `
      .esgst-gf-container {
        top: ${shared.esgst.commentsTop - 5}px;
      }
    `);
    common.createHeadingButton({
      element: this.filters_addContainer(shared.esgst.mainPageHeading),
      id: `gpf`
    });
  }

  getFilters() {
    return {
      users: {
        check: gSettings.gs,
        name: `Users`,
        type: `number`
      },
      lastGiveaway: {
        check: gSettings.gs,
        date: true,
        name: `Last Giveaway`,
        type: `number`
      },
      officialGameGroup: {
        check: gSettings.gs && gSettings.gs_t,
        name: `Official Game Group`,
        type: `boolean`
      },
      open: {
        check: gSettings.gs && gSettings.gs_t,
        name: `Open`,
        type: `boolean`
      },
      restricted: {
        check: gSettings.gs && gSettings.gs_t,
        name: `Restricted`,
        type: `boolean`
      },
      closed: {
        check: gSettings.gs && gSettings.gs_t,
        name: `Closed`,
        type: `boolean`
      }
    };
  }
}

const groupsGroupFilters = new GroupsGroupFilters();

export { groupsGroupFilters };