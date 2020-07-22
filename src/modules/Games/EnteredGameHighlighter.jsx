import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

class GamesEnteredGameHighlighter extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds an icon (<i className="fa fa-star"></i>) next to a game's name (in any page) to
						indicate that you have entered giveaways for the game in the past. Clicking on the icon
						unhighlights the game.
					</li>
					<li>
						A game is only highlighted if you entered a giveaway for it after this feature was
						enabled.
					</li>
				</ul>
			),
			id: 'egh',
			name: 'Entered Game Highlighter',
			sg: true,
			type: 'games',
			featureMap: {
				game: this.egh_getGames.bind(this),
			},
			features: {
				egh_c: {
					name: 'Show a counter with the number of giveaways that have been entered for the game.',
					sg: true,
				},
			},
		};
	}

	egh_getGames(games) {
		for (const game of games.all) {
			if (Shared.esgst.giveawayPath) {
				const button = document.querySelector('.sidebar__entry-insert');
				if (button) {
					button.addEventListener('click', this.egh_saveGame.bind(this, game.id, game.type));
				}
			}
			const savedGame = Shared.esgst.games[game.type][game.id];
			if (savedGame && savedGame.entered && !game.container.querySelector('.esgst-egh-button')) {
				const count = Number(savedGame.entered);
				DOM.insert(
					(game.container.closest('.poll') &&
						game.container.querySelector('.table__column__heading')) ||
						game.headingName,
					'beforebegin',
					<a
						data-draggable-id="egh"
						className="esgst-egh-button esgst-clickable"
						title={Shared.common.getFeatureTooltip(
							'egh',
							`You have entered ${count} giveaways for this game before. Click to unhighlight it (will restart the counter to 0).`
						)}
						onclick={this.egh_unhighlightGame.bind(this, game.id, game.type)}
					>
						<i className="fa fa-star esgst-egh-icon"></i>
						{Settings.get('egh_c') ? ` ${count}` : null}
					</a>
				);
			}
		}
	}

	async egh_saveGame(id, type) {
		if (!id || !type) {
			return;
		}
		let game = Shared.esgst.games[type][id];
		if (!game) {
			game = {};
		}
		if (!game.entered) {
			game.entered = 0;
		}
		game.entered += 1;
		await Shared.common.lockAndSaveGames({ [type]: { [id]: game } });
	}

	async egh_unhighlightGame(id, type, event) {
		const icon = event.currentTarget;
		if (icon.classList.contains('fa-spin')) {
			return;
		}
		DOM.insert(icon, 'atinner', <i className="fa fa-circle-o-notch fa-spin"></i>);
		let game = Shared.esgst.games[type][id];
		if (game && game.entered) {
			game.entered = null;
			await Shared.common.lockAndSaveGames({ [type]: { [id]: game } });
		}
		icon.remove();
	}
}

const gamesEnteredGameHighlighter = new GamesEnteredGameHighlighter();

export { gamesEnteredGameHighlighter };
