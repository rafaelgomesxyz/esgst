import { DOM } from '../../class/DOM';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { Button } from '../../components/Button';

class CommentsReceivedReplyBoxPopup extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Pops up a reply box when you mark a giveaway as received (in your{' '}
						<a href="https://www.steamgifts.com/giveaways/won">won</a> page) so that you can add a
						comment thanking the creator.
					</li>
				</ul>
			),
			id: 'rrbp',
			name: 'Received Reply Box Popup',
			sg: true,
			type: 'comments',
		};
	}

	init() {
		if (!Shared.esgst.wonPath) return;
		Shared.esgst.giveawayFeatures.push(this.rrbp_addEvent.bind(this));
	}

	rrbp_addEvent(giveaways) {
		giveaways.forEach((giveaway) => {
			let feedback = giveaway.outerWrap.getElementsByClassName(
				'table__gift-feedback-awaiting-reply'
			)[0];
			if (feedback) {
				feedback.addEventListener('click', this.rrbp_openPopup.bind(this, giveaway));
			}
		});
	}

	rrbp_openPopup(giveaway) {
		let popup, textArea;
		popup = new Popup({
			addProgress: true,
			addScrollable: true,
			icon: 'fa-comment',
			title: `Add a comment:`,
		});
		DOM.insert(popup.scrollable, 'beforeend', <textarea ref={(ref) => (textArea = ref)} />);
		if (Settings.get('cfh')) {
			Shared.esgst.modules.commentsCommentFormattingHelper.cfh_addPanel(textArea);
		}
		Button.create([
			{
				template: 'success',
				name: 'Save',
				onClick: async () => {
					await Shared.common.saveComment(
						null,
						'',
						'',
						textArea.value,
						giveaway.url,
						popup.progressBar
					);
					popup.close();
				},
			},
			{
				template: 'loading',
				isDisabled: true,
				name: 'Saving...',
			},
		]).insert(popup.description, 'beforeend');
		popup.open(() => {
			textArea.focus();
		});
	}
}

const commentsReceivedReplyBoxPopup = new CommentsReceivedReplyBoxPopup();

export { commentsReceivedReplyBoxPopup };
