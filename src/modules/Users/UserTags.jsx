import { Tags } from '../Tags';
import { Shared } from '../../class/Shared';
import { DOM } from '../../class/DOM';

class UsersUserTags extends Tags {
	constructor() {
		super('ut');
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a button (<i className="fa fa-tag"></i>) next a user's username (in any page) that
						allows you to save tags for the user (only visible to you).
					</li>
					<li>You can press Enter to save the tags.</li>
					<li>Each tag can be colored individually.</li>
					<li>
						There is a button (<i className="fa fa-list"></i>) in the tags popup that allows you to
						view a list with all of the tags that you have used ordered from most used to least
						used.
					</li>
					<li>
						Adds a button (<i className="fa fa-user"></i> <i className="fa fa-tags"></i>) to the
						page heading of this menu that allows you to manage all of the tags that have been
						saved.
					</li>
					<li>
						This feature is recommended for cases where you want to associate a short text with a
						user, since the tags are displayed next to their username.For a long text, check
						[id=un].
					</li>
				</ul>
			),
			features: {
				ut_s: {
					name: 'Show tag suggestions while typing.',
					sg: true,
					st: true,
				},
			},
			id: 'ut',
			name: 'User Tags',
			sg: true,
			st: true,
			type: 'users',
		};
	}

	init() {
		Shared.esgst.userFeatures.push(this.tags_addButtons.bind(this));
		// noinspection JSIgnoredPromiseFromCall
		this.tags_getTags();
	}
}

const usersUserTags = new UsersUserTags();

export { usersUserTags };
