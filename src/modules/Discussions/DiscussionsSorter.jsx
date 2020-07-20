import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popout } from '../../class/Popout';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { common } from '../Common';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

const createHeadingButton = common.createHeadingButton.bind(common),
	saveAndSortContent = common.saveAndSortContent.bind(common);
class DiscussionsDiscussionsSorter extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							[
								`Adds a button (`,
								['i', { class: 'fa fa-sort' }],
								` ) to the main page heading of any `,
								['a', { href: `https://www.steamgifts.com/discussions` }, 'discussions'],
								` page that allows you to sort the discussions in the page by title, category, created time, author and number of comments.`,
							],
						],
						[
							'li',
							'There is also an option to automatically sort the discussions so that every time you open the page the discussions are already sorted by whatever option you prefer.',
						],
					],
				],
			],
			id: 'ds',
			name: 'Discussions Sorter',
			sg: true,
			type: 'discussions',
		};
	}

	init() {
		if (!this.esgst.discussionsPath) return;

		let object = {
			button: createHeadingButton({ id: 'ds', icons: ['fa-sort'], title: 'Sort discussions' }),
		};
		object.button.addEventListener('click', this.ds_openPopout.bind(this, object));
	}

	ds_openPopout(obj) {
		if (obj.popout) return;
		obj.popout = new Popout('esgst-ds-popout', obj.button, 0, true);
		new ToggleSwitch(
			obj.popout.popout,
			'ds_auto',
			false,
			'Auto Sort',
			false,
			false,
			'Automatically sorts the discussions by the selected option when loading the page.',
			Settings.get('ds_auto')
		);
		let options = DOM.insert(
			obj.popout.popout,
			'beforeEnd',
			<select>
				<option value="sortIndex_asc">Default</option>
				<option value="title_asc">Title - Ascending</option>
				<option value="title_desc">Title - Descending</option>
				<option value="category_asc">Category - Ascending</option>
				<option value="category_desc">Category - Descending</option>
				<option value="createdTimestamp_asc">Created Time - Ascending</option>
				<option value="createdTimestamp_desc">Created Time - Descending</option>
				<option value="author_asc">Author - Ascending</option>
				<option value="author_desc">Author - Descending</option>
				<option value="comments_asc">Comments - Ascending</option>
				<option value="comments_desc">Comments - Descending</option>
			</select>
		);
		options.value = Settings.get('ds_option');
		let callback = saveAndSortContent.bind(
			common,
			this.esgst.scopes.main.discussions,
			'ds_option',
			options
		);
		options.addEventListener('change', callback);
		obj.popout.popout.appendChild(
			new ButtonSet({
				color1: 'green',
				color2: '',
				icon1: 'fa-arrow-circle-right',
				icon2: '',
				title1: 'Sort',
				title2: '',
				callback1: callback,
			}).set
		);
		obj.popout.open();
	}
}

const discussionsDiscussionsSorter = new DiscussionsDiscussionsSorter();

export { discussionsDiscussionsSorter };
