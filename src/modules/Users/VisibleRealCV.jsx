import { Module } from '../../class/Module';
import { DOM } from '../../class/DOM';

class UsersVisibleRealCV extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Displays the real sent/won CV next to the raw value in a user's{' '}
						<a href="https://www.steamgifts.com/user/cg">profile</a> page.
					</li>
					<li>
						This also extends to <span data-esgst-feature-id="swr"></span>, if you have that feature
						enabled.
					</li>
					<li>
						With this feature disabled, you can still view the real CV, as provided by SteamGifts,
						by hovering over the raw value.
					</li>
				</ul>
			),
			id: 'vrcv',
			name: 'Visible Real CV',
			sg: true,
			type: 'users',
			featureMap: {
				profile: this.vrcv_add.bind(this),
			},
		};
	}

	vrcv_add(profile) {
		/**
		 * @property realSentCV.toLocaleString
		 * @property realWonCV.toLocaleString
		 */
		profile.sentCvContainer.insertAdjacentText(
			'beforeend',
			` / $${profile.realSentCV.toLocaleString('en')}`
		);
		profile.wonCvContainer.insertAdjacentText(
			'beforeend',
			` / $${profile.realWonCV.toLocaleString('en')}`
		);
	}
}

const usersVisibleRealCV = new UsersVisibleRealCV();

export { usersVisibleRealCV };
