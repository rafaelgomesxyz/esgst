import { Filters } from '../Filters';
import { shared } from '../../class/Shared';
import { gSettings } from '../../class/Globals';

class CommentsCommentFilters extends Filters {
  constructor() {
    super(`cf`);
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Allows you to filter comments.`]
        ]]
      ],
      features: {
        cf_m: {
          description: [
            [`ul`, [
              [`li`, `Allows you to hide multiple comments in a page using many different filters.`],
              [`li`, [
                `Adds a toggle switch with a button (`,
                [`i`, { class: `fa fa-sliders` }],
                `) to the main page heading of any comment page. The switch allows you to turn the filters on/off and the button allows you to manage your presets.`
              ]],
              [`li`, `Adds a collapsible panel below the same main page heading that allows you to change/save the rules of a preset. The filters are separated in 2 categories:`],
              [`ul`, [
                [`li`, `Basic filters are related to a numeric value (such as the length of a comment) and have a slider that you can use to set the range of the filter (any comments that do not apply to the range will be hidden).`],
                [`li`, `Type filters are related to a boolean value (such as whether or not a comment is a bump comment) and have a checkbox that changes states when you click on it. The checkbox has 3 states:`],
                [`ul`, [
                  [`li`, [
                    `"Show all" (`,
                    [`i`, { class: `fa fa-check-square` }],
                    `) does not hide any comments that apply to the filter (this is the default state).`
                  ]],
                  [`li`, [
                    `"Show only" (`,
                    [`i`, { class: `fa fa-square` }],
                    `) hides any comments that do not apply to the filter.`
                  ]],
                  [`li`, [
                    `"Hide all" (`,
                    [`i`, { class: `fa fa-square-o` }],
                    `) hides any comments that apply to the filter.`
                  ]]
                ]]
              ]],
              [`li`, `A preset contains all of your rules and can be saved to be reused later. You can save as many presets as you want.`],
              [`li`, `Adds a text in parenthesis to the pagination of the page showing how many comments in the page are being filtered by the filters.`]
            ]]
          ],
          features: {
            cf_m_b: {
              name: `Hide basic filters.`,
              sg: true,
              st: true
            },
            cf_m_a: {
              name: `Hide advanced filters.`,
              sg: true,
              st: true
            },
            cf_bump: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter bump comments.`]
                ]]
              ],
              name: `Bump`,
              sg: true,
              st: true
            },
            cf_length: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter comments by their length.`]
                ]]
              ],
              name: `Length`,
              sg: true,
              st: true
            },
            cf_words: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter comments containing certain words.`]
                ]]
              ],
              name: `Words`,
              sg: true,
              st: true
            }
          },
          name: `Multiple Filters`,
          sg: true,
          st: true
        }
      },
      id: `cf`,
      name: `Comment Filters`,
      sg: true,
      st: true,
      type: `comments`
    };
  }

  async init() {
    if (gSettings.cf_m && (shared.esgst.commentsPath || shared.common.isCurrentPath(`Messages`))) {
      shared.esgst.style.insertAdjacentText("beforeend", `
        .esgst-gf-container {
          top: ${shared.esgst.commentsTop - 5}px;
        }
      `);
      shared.common.createHeadingButton({
        element: this.filters_addContainer(shared.esgst.mainPageHeading),
        id: `cf`
      });
    }
  }

  getFilters() {
    return {
      bump: {
        check: true,
        name: `Bump`,
        type: `boolean`
      },
      length: {
        check: true,
        minValue: 0,
        name: `Length`,
        type: `number`
      },
      words: {
        check: true,
        list: true,
        name: `Words`,
        type: `string`
      }
    };
  }
}

const commentsCommentFilters = new CommentsCommentFilters();

export { commentsCommentFilters };