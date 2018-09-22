import Module from '../../class/Module';
import ButtonSet_v2 from '../../class/ButtonSet_v2';
import Popout from '../../class/Popout';
import ToggleSwitch from '../../class/ToggleSwitch';
import {common} from '../Common';

const
  {
    createHeadingButton,
    createElements,
    saveAndSortContent
  } = common
;

class DiscussionsDiscussionsSorter extends Module {
  info = ({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-sort"></i>) to the main page heading of any <a href="https://www.steamgifts.com/discussions">discussions</a> page that allows you to sort the discussions in the page by title, category, created time, author and number of comments.</li>
        <li>There is also an option to automatically sort the discussions so that every time you open the page the discussions are already sorted by whatever option you prefer.</li>
      </ul>
    `,
    id: `ds`,
    load: this.ds,
    name: `Discussions Sorter`,
    sg: true,
    type: `discussions`
  });

  ds() {
    if (!this.esgst.discussionsPath) return;

    let object = {
      button: createHeadingButton({id: `ds`, icons: [`fa-sort`], title: `Sort discussions`})
    };
    object.button.addEventListener(`click`, this.ds_openPopout.bind(null, object));
  }

  ds_openPopout(obj) {
    if (obj.popout) return;
    obj.popout = new Popout(`esgst-ds-popout`, obj.button, 0, true);
    new ToggleSwitch(obj.popout.popout, `ds_auto`, false, `Auto Sort`, false, false, `Automatically sorts the discussions by the selected option when loading the page.`, this.esgst.ds_auto);
    let options = createElements(obj.popout.popout, `beforeEnd`, [{
      type: `select`,
      children: [{
        attributes: {
          value: `sortIndex_asc`
        },
        text: `Default`,
        type: `option`
      }, {
        attributes: {
          value: `title_asc`
        },
        text: `Title - Ascending`,
        type: `option`
      }, {
        attributes: {
          value: `title_desc`
        },
        text: `Title - Descending`,
        type: `option`
      }, {
        attributes: {
          value: `category_asc`
        },
        text: `Category - Ascending`,
        type: `option`
      }, {
        attributes: {
          value: `category_desc`
        },
        text: `Category - Descending`,
        type: `option`
      }, {
        attributes: {
          value: `createdTimestamp_asc`
        },
        text: `Created Time - Ascending`,
        type: `option`
      }, {
        attributes: {
          value: `createdTimestamp_desc`
        },
        text: `Created Time - Descending`,
        type: `option`
      }, {
        attributes: {
          value: `author_asc`
        },
        text: `Author - Ascending`,
        type: `option`
      }, {
        attributes: {
          value: `author_desc`
        },
        text: `Author - Descending`,
        type: `option`
      }, {
        attributes: {
          value: `comments_asc`
        },
        text: `Comments - Ascending`,
        type: `option`
      }, {
        attributes: {
          value: `comments_desc`
        },
        text: `Comments - Descending`,
        type: `option`
      }]
    }]);
    options.value = this.esgst.ds_option;
    let callback = saveAndSortContent.bind(null, `ds_option`, `mainDiscussions`, options, null);
    options.addEventListener(`change`, callback);
    obj.popout.popout.appendChild(new ButtonSet_v2({color1: `green`, color2: ``, icon1: `fa-arrow-circle-right`, icon2: ``, title1: `Sort`, title2: ``, callback1: callback}).set);
    obj.popout.open();
  }
}

export default DiscussionsDiscussionsSorter;