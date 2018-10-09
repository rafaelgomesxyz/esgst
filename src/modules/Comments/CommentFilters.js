import Module from '../../class/Module';
import {common} from '../Common';

const
  createHeadingButton = common.createHeadingButton.bind(common)
;

class CommentsCommentFilters extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Allows you to filter comments.</li>
      </ul>
    `,
      features: {
        cf_m: {
          description: `
          <ul>
            <li>Allows you to hide multiple comments in a page using many different filters.</li>
            <li>Adds a toggle switch with a button (<i class="fa fa-sliders"></i>) to the main page heading of any comment page. The switch allows you to turn the filters on/off and the button allows you to manage your presets.</li>
            <li>Adds a collapsible panel below the same main page heading that allows you to change/save the rules of a preset. The filters are separated in 2 categories:</li>
            <li>
              <ul>
                <li>Basic filters are related to a numeric value (such as the length of a comment) and have a slider that you can use to set the range of the filter (any comments that do not apply to the range will be hidden).</li>
                <li>Type filters are related to a boolean value (such as whether or not a comment is a bump comment) and have a checkbox that changes states when you click on it. The checkbox has 3 states:</li>
                <li>
                  <ul>
                    <li>"Show all" (<i class="fa fa-check-square"></i>) does not hide any comments that apply to the filter (this is the default state).</li>
                    <li>"Show only" (<i class="fa fa-square"></i>) hides any comments that do not apply to the filter.</li>
                    <li>"Hide all" (<i class="fa fa-square-o"></i>) hides any comments that apply to the filter.</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>A preset contains all of your rules and can be saved to be reused later. You can save as many presets as you want.</li>
            <li>Adds a text in parenthesis to the pagination of the page showing how many comments in the page are being filtered by the filters.</li>
          </ul>
        `,
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
              description: `
              <ul>
                <li>Allows you to filter bump comments.</li>
              </ul>
            `,
              name: `Bump`,
              sg: true,
              st: true
            },
            cf_length: {
              description: `
              <ul>
                <li>Allows you to filter comments by their length.</li>
              </ul>
            `,
              name: `Length`,
              sg: true,
              st: true
            },
            cf_words: {
              description: `
              <ul>
                <li>Allows you to filter comments containing certain words.</li>
              </ul>
            `,
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
      load: this.cf,
      name: `Comment Filters`,
      sg: true,
      st: true,
      type: `comments`
    };
  }

  async cf() {
    if (this.esgst.cf_m && (this.esgst.commentsPath || this.esgst.inboxPath)) {
      this.esgst.style.insertAdjacentText("beforeend", `
        .esgst-gf-container {
          top: ${this.esgst.commentsTop - 5}px;
        }
      `);
      createHeadingButton({
        element: this.esgst.modules.filters.filters_addContainer(`cf`, this.esgst.mainPageHeading),
        id: `cf`
      });
    }
  }

  cf_getFilters() {
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

export default CommentsCommentFilters;