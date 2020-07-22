import { Module } from '../../class/Module';
import { common } from '../Common';
import { DOM } from '../../class/DOM';

const getFeatureTooltip = common.getFeatureTooltip.bind(common);
class GiveawaysGiveawayErrorSearchLinks extends Module {
	constructor() {
		super();
		this.info = {
			// by Royalgamer06
			description: () => (
				<ul>
					<li>
						If you cannot access a giveaway because of many different reasons, a "Search Links" row
						is added to the table of the{' '}
						<a href="https://www.steamgifts.com/giveaway/FN2PK/">error</a> page containing 4 links
						that allow you to search for the game elsewhere:
					</li>
					<ul>
						<li>
							A SteamGifts icon that allows you to search for open giveaways of the game on
							SteamGifts.
						</li>
						<li>
							<i className="fa fa-steam"></i> allows you to search for the game on Steam.
						</li>
						<li>
							<i className="fa">
								<img src="https://steamdb.info/static/logos/favicon-16x16.png"></img>
							</i>{' '}
							allows you to search for the game on SteamDB.
						</li>
						<li>
							<i className="fa">
								<img src="https://bartervg.com/imgs/ico/barter/favicon-16x16.png"></img>
							</i>{' '}
							allows you to search for the game on Barter.vg.
						</li>
					</ul>
				</ul>
			),
			id: 'gesl',
			name: 'Giveaway Error Search Links',
			sg: true,
			type: 'giveaways',
		};
	}

	init() {
		const table = document.getElementsByClassName('table--summary')[0];
		if (!this.esgst.giveawayPath || !table) return;
		let name = encodeURIComponent(
			table.getElementsByClassName('table__column__secondary-link')[0].textContent
		);
		DOM.insert(
			table.getElementsByClassName('table__row-outer-wrap')[0],
			'afterend',
			<div className="table__row-outer-wrap" title={getFeatureTooltip('gesl')}>
				<div className="table__row-inner-wrap">
					<div className="table__column--width-small">
						<span className="esgst-bold">Search Links</span>
					</div>
					<div className="table__column--width-fill esgst-gesl">
						<a
							href={`https://www.steamgifts.com/giveaways/search?q=${name}`}
							target="_blank"
							title="Search for active giveaways"
						>
							<i className="fa">
								<img src={this.esgst.sgIcon} />
							</i>
						</a>
						<a
							href={`http://store.steampowered.com/search/?term=${name}`}
							target="_blank"
							title="Search on Steam"
						>
							<i className="fa fa-steam"></i>
						</a>
						<a
							href={`https://steamdb.info/search/?a=app&q=${name}`}
							target="_blank"
							title="Search on SteamDB"
						>
							<i className="fa">
								<img src="https://steamdb.info/static/logos/favicon-16x16.png" />
							</i>
						</a>
						<a
							href={`https://barter.vg/search?q=${name}`}
							target="_blank"
							title="Search on Barter.vg"
						>
							<i className="fa">
								<img src="https://bartervg.com/imgs/ico/barter/favicon-16x16.png" />
							</i>
						</a>
					</div>
				</div>
			</div>
		);
	}
}

const giveawaysGiveawayErrorSearchLinks = new GiveawaysGiveawayErrorSearchLinks();

export { giveawaysGiveawayErrorSearchLinks };
