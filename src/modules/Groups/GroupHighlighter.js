import Module from '../../class/Module';
import { common } from '../Common';

const
  getValue = common.getValue.bind(common)
  ;

class GroupsGroupHighlighter extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Adds a green background to a group that you are a member of (in any page).`]
        ]]
      ],
      id: `gh`,
      load: this.gh,
      name: `Group Highlighter`,
      sg: true,
      sync: `Steam Groups`,
      syncKeys: [`Groups`],
      type: `groups`
    };
  }

  gh() {
    if (this.esgst.groupsPath) return;
    this.esgst.endlessFeatures.push(this.gh_highlightGroups.bind(this));
  }

  async gh_highlightGroups(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .table__column__heading[href*="/group/"], .esgst-es-page-${endless}.table__column__heading[href*="/group/"]` : `.table__column__heading[href*="/group/"]`}`);
    if (!elements.length) return;
    const savedGroups = JSON.parse(await getValue(`groups`, `[]`));
    for (let i = 0, n = elements.length; i < n; ++i) {
      const element = elements[i],
        code = element.getAttribute(`href`).match(/\/group\/(.+?)\//)[1];
      let j;
      for (j = savedGroups.length - 1; j >= 0 && savedGroups[j].code !== code; --j) {
      }
      if (j >= 0 && savedGroups[j].member) {
        element.closest(`.table__row-outer-wrap`).classList.add(`esgst-gh-highlight`);
      }
    }
  }
}

export default GroupsGroupHighlighter;