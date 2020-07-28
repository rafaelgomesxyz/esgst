import { DOM } from '../../class/DOM';
import { Module } from '../../class/Module';
import { Popout } from '../../class/Popout';
import { Settings } from '../../class/Settings';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { Button } from '../../components/Button';
import { common } from '../Common';

const createHeadingButton = common.createHeadingButton.bind(common),
	saveAndSortContent = common.saveAndSortContent.bind(common);
class DiscussionsDiscussionsSorter extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a button (<i className="fa fa-sort"></i> ) to the main page heading of any{' '}
						<a href="https://www.steamgifts.com/discussions">discussions</a> page that allows you to
						sort the discussions in the page by title, category, created time, author and number of
						comments.
					</li>
					<li>
						There is also an option to automatically sort the discussions so that every time you
						open the page the discussions are already sorted by whatever option you prefer.
					</li>
				</ul>
			),
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
		let options;
		DOM.insert(
			obj.popout.popout,
			'beforeend',
			<select ref={(ref) => (options = ref)}>
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
		Button.create({
			color: 'green',
			icons: ['fa-arrow-circle-right'],
			name: 'Sort',
			onClick: callback,
		}).insert(obj.popout.popout, 'beforeend');
		obj.popout.open();
	}
}

const discussionsDiscussionsSorter = new DiscussionsDiscussionsSorter();

export { discussionsDiscussionsSorter };
