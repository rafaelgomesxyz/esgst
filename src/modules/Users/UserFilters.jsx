import { DOM } from '../../class/DOM';
import { Popup } from '../../class/Popup';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { Button } from '../../components/Button';
import { Utils } from '../../lib/jsUtils';
import { common } from '../Common';
import { Filters } from '../Filters';

const createElements = common.createElements.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common),
	saveUser = common.saveUser.bind(common);
class UsersUserFilters extends Filters {
	constructor() {
		super('uf');
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a button (<i className="fa fa-eye-slash"></i> if the user is being filtered and{' '}
						<i className="fa fa-eye"></i> if they are not) next to a user's username (in their{' '}
						<a href="https://www.steamgifts.com/user/cg">profile</a> page) that allows you to hide
						their discussions, giveaways and posts (each one can be hidden separately).
					</li>
					<li>
						Adds a button (<i className="fa fa-user"></i> <i className="fa fa-eye-slash"></i>) to
						the page heading of this menu that allows you to view all of the users that have been
						filtered.
					</li>
				</ul>
			),
			features: {
				uf_d: {
					name: 'Automatically hide discussions from blacklisted users.',
					sg: true,
				},
				uf_g: {
					name: 'Automatically hide giveaways from blacklisted users.',
					sg: true,
				},
				uf_dp: {
					name: 'Automatically hide discussion posts from blacklisted users.',
					sg: true,
				},
				uf_gp: {
					name: 'Automatically hide giveaway posts from blacklisted users.',
					sg: true,
				},
				uf_s_s: {
					name: `Show switch to temporarily hide / unhide users filtered by the filters in the main page heading, along with a counter.`,
					sg: true,
				},
			},
			id: 'uf',
			name: 'User Filters',
			sg: true,
			type: 'users',
			featureMap: {
				profile: this.uf_add.bind(this),
				comment: this.filterComments.bind(this),
				discussion: this.filterDiscussions.bind(this),
				giveaway: this.filterGiveaways.bind(this),
			},
		};
	}

	init() {
		if (Settings.get('uf_s_s')) {
			this.addSingleButton('fa-user');
		}
	}

	uf_add(profile, savedUser) {
		if (profile.username !== Settings.get('username')) {
			profile.ufButton = createElements(profile.heading, 'beforeend', [
				{
					attributes: {
						class: 'esgst-uf-button',
						title: getFeatureTooltip('uf', 'Edit user filters'),
					},
					type: 'a',
					children: [
						{
							attributes: {
								class: 'fa',
							},
							type: 'i',
						},
					],
				},
			]);
			profile.ufIcon = profile.ufButton.firstElementChild;
			if (savedUser) {
				profile.ufValues = this.fixData(savedUser.uf);
				if (
					profile.ufValues &&
					(profile.ufValues.giveaways ||
						profile.ufValues.discussions ||
						profile.ufValues.discussionPosts ||
						profile.ufValues.giveawayPosts)
				) {
					profile.ufIcon.classList.add('fa-eye-slash');
				} else {
					profile.ufIcon.classList.add('fa-eye');
					profile.ufValues = {
						giveaways: false,
						discussions: false,
						giveawayPosts: false,
						discussionPosts: false,
					};
				}
			} else {
				profile.ufIcon.classList.add('fa-eye');
				profile.ufValues = {
					giveaways: false,
					discussions: false,
					giveawayPosts: false,
					discussionPosts: false,
				};
			}
			profile.ufButton.addEventListener('click', this.uf_open.bind(this, profile));
		}
	}

	uf_open(profile) {
		profile.ufPopup = new Popup({
			addScrollable: true,
			icon: 'fa-eye',
			isTemp: true,
			title: (
				<fragment>
					Apply user filters for <span>{profile.name}</span>:
				</fragment>
			),
		});
		profile.ufOptions = createElements(profile.ufPopup.description, 'beforeend', [
			{
				type: 'div',
			},
		]);
		profile.ufGiveawaysOption = new ToggleSwitch(
			profile.ufOptions,
			null,
			false,
			"Filter this user's giveaways.",
			false,
			false,
			"Hides the user's giveaways from the main pages.",
			profile.ufValues.giveaways
		);
		profile.ufDiscussionsOption = new ToggleSwitch(
			profile.ufOptions,
			null,
			false,
			"Filter this user's discussions.",
			false,
			false,
			"Hides the user's discussions from the main pages.",
			profile.ufValues.discussions
		);
		profile.ufGiveawayPostsOption = new ToggleSwitch(
			profile.ufOptions,
			null,
			false,
			"Filter this user's giveaway posts.",
			false,
			false,
			"Hides the user's posts made on giveaways.",
			profile.ufValues.giveawayPosts
		);
		profile.ufDiscussionPostsOption = new ToggleSwitch(
			profile.ufOptions,
			null,
			false,
			"Filter this user's discussion posts.",
			false,
			false,
			"Hides the user's posts made on discussions.",
			profile.ufValues.discussionPosts
		);
		const saveButton = Button.create([
			{
				template: 'success',
				name: 'Save Settings',
				onClick: this.uf_save.bind(this, profile, false),
			},
			{
				template: 'loading',
				isDisabled: true,
				name: 'Saving...',
			},
		]).insert(profile.ufPopup.description, 'beforeend');
		const resetButton = Button.create([
			{
				color: 'green',
				icons: ['fa-rotate-left'],
				name: 'Reset Settings',
				onClick: this.uf_save.bind(this, profile, true),
			},
			{
				template: 'loading',
				isDisabled: true,
				name: 'Resetting...',
			},
		]).insert(profile.ufPopup.description, 'beforeend');
		saveButton.addConflict(resetButton);
		resetButton.addConflict(saveButton);
		profile.ufPopup.open();
	}

	async uf_save(profile, reset) {
		let user;
		if (reset) {
			profile.ufGiveawaysOption.input.checked = false;
			profile.ufDiscussionsOption.input.checked = false;
			profile.ufGiveawayPostsOption.input.checked = false;
			profile.ufDiscussionPostsOption.input.checked = false;
			profile.ufValues = {
				giveaways: false,
				discussions: false,
				giveawayPosts: false,
				discussionPosts: false,
			};
		} else {
			profile.ufValues = {
				giveaways: profile.ufGiveawaysOption.input.checked,
				discussions: profile.ufDiscussionsOption.input.checked,
				giveawayPosts: profile.ufGiveawayPostsOption.input.checked,
				discussionPosts: profile.ufDiscussionPostsOption.input.checked,
			};
		}
		user = {
			steamId: profile.steamId,
			id: profile.id,
			username: profile.username,
			values: {
				uf: profile.ufValues,
			},
		};
		if (
			profile.ufValues &&
			(profile.ufValues.giveaways ||
				profile.ufValues.discussions ||
				profile.ufValues.giveawayPosts ||
				profile.ufValues.discussionPosts)
		) {
			profile.ufIcon.classList.remove('fa-eye');
			profile.ufIcon.classList.add('fa-eye-slash');
		} else {
			profile.ufIcon.classList.remove('fa-eye-slash');
			profile.ufIcon.classList.add('fa-eye');
		}
		await saveUser(null, null, user);
		profile.ufPopup.close();
	}

	fixData(data) {
		if (!data) {
			return;
		}
		if (Utils.isSet(data.posts)) {
			data.giveawayPosts = data.posts;
			data.discussionPosts = data.posts;
			delete data.posts;
		}
		return data;
	}

	async filterDiscussions(discussions) {
		for (const discussion of discussions) {
			const savedUser = await Shared.common.getUser(Shared.esgst.users, {
				username: discussion.author,
			});
			if (!savedUser) {
				continue;
			}
			const uf = this.fixData(savedUser.uf);
			if ((Settings.get('uf_d') && savedUser.blacklisted && !uf) || (uf && uf.discussions)) {
				discussion.outerWrap.classList.add('esgst-hidden');
				discussion.outerWrap.setAttribute('data-esgst-not-filterable', 'uf');
				if (Settings.get('uf_s_s')) {
					this.updateSingleCounter();
				}
			}
		}
	}

	async filterGiveaways(giveaways, main) {
		if (!Shared.esgst.giveawaysPath || !main) {
			return;
		}
		for (const giveaway of giveaways) {
			const savedUser = await Shared.common.getUser(Shared.esgst.users, {
				username: giveaway.creator,
			});
			if (!savedUser) {
				continue;
			}
			const uf = this.fixData(savedUser.uf);
			if ((Settings.get('uf_g') && savedUser.blacklisted && !uf) || (uf && uf.giveaways)) {
				giveaway.outerWrap.classList.add('esgst-hidden');
				giveaway.outerWrap.setAttribute('data-esgst-not-filterable', 'uf');
				if (Settings.get('uf_s_s')) {
					this.updateSingleCounter();
				}
			}
		}
	}

	async filterComments(comments, main) {
		for (const comment of comments) {
			const savedUser = await Shared.common.getUser(Shared.esgst.users, {
				username: comment.author,
			});
			if (!savedUser) {
				continue;
			}
			const uf = this.fixData(savedUser.uf);
			if (
				(((comment.type === 'giveaways' && Settings.get('uf_gp')) ||
					(comment.type !== 'giveaways' && Settings.get('uf_dp'))) &&
					savedUser.blacklisted &&
					!uf) ||
				(uf &&
					((comment.type === 'giveaways' && uf.giveawayPosts) ||
						(comment.type !== 'giveaways' && uf.discussionPosts)))
			) {
				let numDescendants;
				if (comment.comment.nextElementSibling) {
					numDescendants = comment.comment.nextElementSibling.querySelectorAll(
						`:not(.comment--submit) > .comment__parent, .comment__child, .comment_inner`
					).length;
				} else {
					numDescendants = 0;
				}
				comment.comment.parentElement.classList.add('esgst-hidden');
				comment.comment.parentElement.setAttribute('data-esgst-not-filterable', 'uf');
				if (Settings.get('uf_s_s')) {
					this.updateSingleCounter(numDescendants + 1);
				}
				if (!main || Shared.common.isCurrentPath('Messages')) {
					const commentsContainer = comment.comment.closest('.comments');
					if (
						!commentsContainer.querySelectorAll(`.comment:not([data-esgst-not-filterable])`).length
					) {
						commentsContainer.previousElementSibling.classList.add('esgst-hidden');
						commentsContainer.previousElementSibling.setAttribute(
							'data-esgst-not-filterable',
							'uf'
						);
						commentsContainer.classList.add('esgst-hidden');
						commentsContainer.setAttribute('data-esgst-not-filterable', 'uf');
					}
				}
			}
		}
	}
}

const usersUserFilters = new UsersUserFilters();

export { usersUserFilters };
