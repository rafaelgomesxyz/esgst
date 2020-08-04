import { DOM } from '../../class/DOM';
import { EventDispatcher } from '../../class/EventDispatcher';
import { Module } from '../../class/Module';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { Events } from '../../constants/Events';

class CommentsCommentVariables extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>Replaces certain variables with values when submitting a comment.</li>
				</ul>
			),
			id: 'cv',
			name: 'Comment Variables',
			sg: true,
			st: true,
			type: 'comments',
			features: {
				cv_e: {
					description: () => (
						<ul>
							<li>
								Allows you to enter keywords that are replaced by emojis. To see the keywords, open
								the emojis popup with <span data-esgst-feature-id="cfh_e"></span> and hover over the
								emojis.
							</li>
							<li>
								Since the keyword format is <code>:short_name:</code>, if you want to use that
								format without replacing it with an emoji, simply escape it with a backslash e.g.{' '}
								<code>\:short_name:</code>.
							</li>
						</ul>
					),
					name: 'Enable emojis.',
					dependencies: ['cfh', 'cfh_e'],
					sg: true,
					st: true,
				},
			},
			inputItems: [
				{
					id: 'cv_username',
					prefix: `Your username: `,
				},
				{
					id: 'cv_steamId',
					prefix: `Your Steam id: `,
				},
				{
					id: 'cv_creator',
					prefix: `The creator of the giveaway/thread: `,
				},
				{
					id: 'cv_replyUser',
					prefix: `The user you are replying to: `,
				},
				{
					id: 'cv_esgstFeature',
					prefix: `Link a ESGST feature (must have a (.+?) field to represent where you will type either the ID of the feature or a term to search for the feature): `,
				},
			],
		};
	}

	init() {
		if (Shared.esgst.replyBox) {
			Shared.common.addReplyButton(Shared.esgst.replyBox);
		}

		EventDispatcher.subscribe(Events.BEFORE_COMMENT_SUBMIT, this.replaceVariables.bind(this));

		this.usernameRegex = this.getRegExp('username');
		this.steamIdRegex = this.getRegExp('steamId');
		this.creatorRegex = this.getRegExp('creator');
		this.replyUserRegex = this.getRegExp('replyUser');
		this.featureRegex = this.getRegExp('esgstFeature');
		this.localFeatureRegex = this.getRegExp('esgstFeature', true);
		this.emojiRegex = /(^|[^\\])(:\w+?:)/g;
		this.escapedEmojiRegex = /\\(:\w+?:)/g;
	}

	replaceVariables(obj) {
		obj.comment = obj.comment
			.replace(this.usernameRegex, Settings.get('username'))
			.replace(this.steamIdRegex, Settings.get('steamId'));
		const creatorElement = document.querySelector(
			`.featured__column--width-fill.text-right a, .comment__username, .author_name`
		);
		if (creatorElement) {
			const creator = creatorElement.textContent;
			obj.comment = obj.comment.replace(this.creatorRegex, creator);
		}
		if (obj.context) {
			let replyUser = obj.context.closest(`.comment__children, .comment_children`);
			replyUser =
				(replyUser &&
					replyUser
						.closest(`.comment, .comment_outer`)
						.querySelector(`.comment__username, .author_name`)) ||
				document.querySelector(
					`.featured__column--width-fill.text-right a, .comment__username, .author_name`
				);
			if (replyUser) {
				replyUser = replyUser.textContent;
				obj.comment = obj.comment.replace(this.replyUserRegex, replyUser);
			}
		}
		const featureMatches = obj.comment.match(this.featureRegex);
		if (featureMatches) {
			for (const featureMatch of featureMatches) {
				const subMatches = featureMatch.match(this.localFeatureRegex);
				if (subMatches) {
					const idOrTerm = subMatches[1];
					let feature = Shared.esgst.featuresById[idOrTerm];
					if (!feature) {
						feature = Shared.common.findFeature(idOrTerm);
					}
					if (feature) {
						let featurePath = `[${feature.name}](https://www.steamgifts.com/account/settings/profile?esgst=settings&id=${feature.id})`;
						let ancestorId = Shared.esgst.featuresAncestors[feature.id];
						while (ancestorId) {
							const ancestor = Shared.esgst.featuresById[ancestorId];
							featurePath = `[${ancestor.name}](https://www.steamgifts.com/account/settings/profile?esgst=settings&id=${ancestor.id}) > ${featurePath}`;
							ancestorId = Shared.esgst.featuresAncestors[ancestorId];
						}
						obj.comment = obj.comment.replace(featureMatch, featurePath);
					}
				}
			}
		}
		if (Settings.get('cv_e')) {
			obj.comment = obj.comment
				.replace(this.emojiRegex, (...matches) => {
					const emoji = emojisUtils.getEmoji(matches[2].slice(1, -1));
					if (emoji) {
						return `${matches[1]}${emoji}`;
					}
					return `${matches[1]}\\${matches[2]}`;
				})
				.replace(this.escapedEmojiRegex, '$1');
		}
	}

	getRegExp(key, isLocal) {
		return new RegExp(Settings.get(`cv_${key}`), isLocal ? 'i' : 'gi');
	}
}

const commentsCommentVariables = new CommentsCommentVariables();

export { commentsCommentVariables };
