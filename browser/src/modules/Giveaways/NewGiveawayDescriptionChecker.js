import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';

class GiveawaysNewGiveawayDescriptionChecker extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				['ul', [
					['li', `When you click on "Review Giveaway" in the new giveaway page (also extends to the "Create Giveaway" button from [id=gts] and the "Add" button from [id=mgc]), this feature checks if there are possible Steam keys / Humble Bundle gift links in the description and warns you about it, in case you pasted them there by mistake.`],
					['li', `This feature replaces the native "Review Giveaway" button, so that ESGST can intercept the click.`]
				]]
			],
			id: 'ngdc',
			name: 'New Giveaway Description Checker',
			sg: true,
			type: 'giveaways'
		};
	}

	init() {
		if (!Shared.esgst.newGiveawayPath) {
			return;
		}

		const reviewButton = document.querySelector('.js__submit-form');
		const textArea = document.querySelector(`[name=description]`);

		if (!reviewButton || !textArea) {
			return;
		}

		reviewButton.classList.remove('js__submit-form');

		const newReviewButton = reviewButton.cloneNode(true);
		reviewButton.parentElement.insertBefore(newReviewButton, reviewButton);
		reviewButton.remove();
		newReviewButton.setAttribute('data-esgst', 'reviewButton');

		newReviewButton.addEventListener('click', async () => {
			if (await this.check(textArea.value)) {
				return;
			}

			const form = newReviewButton.closest('form');
			if (newReviewButton.classList.contains('js__edit-giveaway')) {
				form.querySelector(`[name=next_step]`).value = 1;
			}
			form.submit();
		});
	}

	check(value) {
		return new Promise(async resolve => {
			let message;

			if (value.match(/[\d\w]{5}(-[\d\w]{5}){2,}/)) {
				message = 'There appears to be a Steam key in the description of the giveaway.';
			} else if (value.match(/https?:\/\/(www\.)?humblebundle\.com\/gift/)) {
				message = 'There appears to be a Humble Bundle gift link in the description of the giveaway.';
			}

			if (message) {
				message = `${message} Are you sure you want to continue?`;
				await Shared.common.createConfirmation(message, () => resolve(false), () => resolve(true));
			} else {
				resolve(false);
			}
		});
	}
}

const giveawaysNewGiveawayDescriptionChecker = new GiveawaysNewGiveawayDescriptionChecker();

export { giveawaysNewGiveawayDescriptionChecker };