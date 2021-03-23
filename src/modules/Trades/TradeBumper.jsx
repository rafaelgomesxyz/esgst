import { DOM } from '../../class/DOM';
import { FetchRequest } from '../../class/FetchRequest';
import { Module } from '../../class/Module';
import { Session } from '../../class/Session';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { common } from '../Common';

const createElements = common.createElements.bind(common),
	createHeadingButton = common.createHeadingButton.bind(common),
	getValue = common.getValue.bind(common),
	setValue = common.setValue.bind(common);
class TradesTradeBumper extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a button (<i className="fa fa-chevron-circle-up"></i>) to the main page heading of
						your{' '}
						<a href="https://www.steamtrades.com/trades/search?user=your-steam-id">
							created trades
						</a>{' '}
						page that allows you to bump all of your open trades at once.
					</li>
				</ul>
			),
			features: {
				tb_a: {
					description: () => (
						<ul>
							<li>Automatically bumps all of your trades every hour.</li>
							<li>
								Requires either SteamGifts or SteamTrades to be open, depending on where you have
								this option enabled.
							</li>
						</ul>
					),
					name: 'Auto bump every hour.',
					sg: true,
					st: true,
				},
			},
			id: 'tb',
			name: 'Trade Bumper',
			sg: true,
			st: true,
			type: 'trades',
		};
	}

	init() {
		if (
			Shared.esgst.locationHref.match(
				new RegExp(`\\/trades\\/search\\?user=${Settings.get('steamId')}`)
			)
		) {
			const button = createHeadingButton({
				id: 'tb',
				icons: ['fa-chevron-circle-up'],
				title: 'Bump trades',
			});
			button.addEventListener('click', this.tb_getTrades.bind(this, button, document));
			if (Settings.get('tb_a')) {
				// noinspection JSIgnoredPromiseFromCall
				this.tb_setAutoBump(button);
			}
		} else if (Settings.get('tb_a')) {
			// noinspection JSIgnoredPromiseFromCall
			this.tb_setAutoBump();
		}
	}

	async tb_getTrades(button, context) {
		if (button) {
			createElements(button, 'atinner', [
				{
					attributes: {
						class: 'fa fa-circle-o-notch fa-spin',
					},
					type: 'i',
				},
			]);
		}
		const elements = context.querySelectorAll(`.row_inner_wrap:not(.is_faded)`);
		for (const element of elements) {
			await FetchRequest.post('https://www.steamtrades.com/ajax.php', {
				data: `xsrf_token=${Session.xsrfToken}&do=trade_bump&code=${
					element
						.querySelector(`[href*="/trade/"]`)
						.getAttribute('href')
						.match(/\/trade\/(.+?)\//)[1]
				}`,
			});
		}
		if (button) {
			window.location.reload();
		} else {
			window.setTimeout(this.tb_setAutoBump.bind(this), 3900000, button);
		}
	}

	async tb_setAutoBump(button) {
		const currentTime = Date.now();
		const diff = currentTime - getValue('lastBump', 0);
		if (diff > 3600000) {
			await setValue('lastBump', currentTime);
			// noinspection JSIgnoredPromiseFromCall
			this.tb_autoBumpTrades(button);
		} else {
			window.setTimeout(this.tb_setAutoBump.bind(this), 3600000 - diff, button);
		}
	}

	async tb_autoBumpTrades(button) {
		if (
			Shared.esgst.locationHref.match(
				new RegExp(`\\/trades\\/search\\?user=${Settings.get('steamId')}`)
			)
		) {
			// noinspection JSIgnoredPromiseFromCall
			this.tb_getTrades(button, document);
		} else {
			// noinspection JSIgnoredPromiseFromCall
			this.tb_getTrades(
				null,
				(
					await FetchRequest.get(
						`https://www.steamtrades.com/trades/search?user=${Settings.get('steamId')}`,
						{
							queue: true,
						}
					)
				).html
			);
		}
	}
}

const tradesTradeBumper = new TradesTradeBumper();

export { tradesTradeBumper };
