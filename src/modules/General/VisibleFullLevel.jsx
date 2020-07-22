import { Module } from '../../class/Module';
import { EventDispatcher } from '../../class/EventDispatcher';
import { Events } from '../../constants/Events';
import { Session } from '../../class/Session';
import { Shared } from '../../class/Shared';
import { DOM } from '../../class/DOM';

class GeneralVisibleFullLevel extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Displays the full level at the header, instead of only showing it when hovering over the
						level. For example, "Level 5" becomes "Lvl 5.25".
					</li>
				</ul>
			),
			id: 'vfl',
			name: 'Visible Full Level',
			sg: true,
			type: 'general',
		};
	}

	init() {
		EventDispatcher.subscribe(Events.LEVEL_UPDATED, this.update.bind(this));

		this.update(null, Session.counters.level);
	}

	async update(oldLevel, newLevel) {
		const levelNode = Shared.header.buttonContainers['account'].nodes.level;
		levelNode.textContent = `Lvl ${newLevel.full}`;
	}
}

const generalVisibleFullLevel = new GeneralVisibleFullLevel();

export { generalVisibleFullLevel };
