import { DOM } from '../../class/DOM';
import { Module } from '../../class/Module';
import { permissions } from '../../class/Permissions';
import { Popup } from '../../class/Popup';
import { Settings } from '../../class/Settings';
import { Button } from '../../components/Button';
import { NotificationBar } from '../../components/NotificationBar';
import { PageHeading } from '../../components/PageHeading';
import { common } from '../Common';

const endless_load = common.endless_load.bind(common),
	request = common.request.bind(common);
class GiveawaysArchiveSearcher extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>Allows you to search the archive by exact title or app id.</li>
					<li>To search by exact title, wrap the title in double quotes, for example: "Dream"</li>
					<li>To search by app id, use the "id:[id]" format, for example: id:229580</li>
				</ul>
			),
			features: {
				as_t: {
					name: 'Open results in a new tab.',
					sg: true,
				},
			},
			id: 'as',
			name: 'Archive Searcher',
			sg: true,
			type: 'giveaways',
		};
	}

	async init() {
		this.esgst.customPages.as = {
			check: this.esgst.archivePath,
			load: async () => await this.as_init({}),
		};

		if (!this.esgst.archivePath) return;

		let input = document.querySelector('.sidebar__search-input');
		const temp = input.parentElement;
		input.outerHTML = `${input.outerHTML}`;
		input = temp.firstElementChild;
		input.addEventListener(
			'keypress',
			(event) => {
				if (event.key === 'Enter') {
					event.stopImmediatePropagation();
					if (input.value.match(/"|id:/)) {
						this.as_openPage(input);
					} else {
						window.location.href = `${this.esgst.path}/search?q=${encodeURIComponent(input.value)}`;
					}
				}
			},
			true
		);
	}

	as_openPage(input) {
		const match = input.value.match(/"(.+?)"|id:(.+)/);
		let query = '';
		let isAppId = false;
		if (match[1]) {
			query = match[1];
		} else {
			query = match[2];
			isAppId = true;
		}
		if (Settings.get('as_t')) {
			window.location.href = `?esgst=as&query=${encodeURIComponent(query)}${
				isAppId ? `&isAppId=true` : ''
			}`;
		} else {
			this.as_init({ query, isAppId, isPopup: true });
		}
	}

	async as_init(obj) {
		if (!obj.isPopup) {
			obj.query = decodeURIComponent(this.esgst.parameters.query);
			obj.isAppId = !!this.esgst.parameters.isAppId;
		}
		if (!obj.query) {
			return;
		}

		if (!(await permissions.contains([['steamCommunity']]))) {
			return;
		}

		let container = null;
		let context = null;
		if (obj.isPopup) {
			const popup = new Popup({
				addScrollable: 'left',
				isTemp: true,
			});
			container = popup.description;
			context = popup.scrollable;
			popup.open();
		} else {
			container = context = this.esgst.sidebar.nextElementSibling;
			context.setAttribute('data-esgst-popup', 'true');
			context.innerHTML = '';
		}
		PageHeading.create('as', [
			{
				name: 'ESGST',
				url: this.esgst.settingsUrl,
			},
			{
				name: 'Archive Searcher',
				url: `?esgst=as`,
			},
		]).insert(container, 'afterbegin');
		obj.context = context;

		const progressBar = NotificationBar.create()
			.insert(container, 'beforeend')
			.setLoading('Retrieving game title...');

		// retrieve the game title from Steam
		if (obj.isAppId) {
			let title = DOM.parse(
				(
					await request({
						method: 'GET',
						url: `https://steamcommunity.com/app/${obj.query}`,
					})
				).responseText
			).getElementsByClassName('apphub_AppName')[0];
			if (title) {
				obj.query = title.textContent;
			} else {
				progressBar.setError(
					'Game title not found. Make sure you are entering a valid AppID. For example, 229580 is the AppID for Dream (http://steamcommunity.com/app/229580).'
				);
				return;
			}
		}

		progressBar.reset().hide();

		obj.query = (obj.query.length >= 50 ? obj.query.slice(0, 50) : obj.query).toLowerCase();
		obj.page = 1;
		obj.url = `${this.esgst.path}/search?q=${encodeURIComponent(obj.query)}&page=`;
		obj.leftovers = [];
		DOM.insert(obj.context, 'beforeend', <div ref={(ref) => (obj.container = ref)} />);
		const button = Button.create([
			{
				color: 'green',
				icons: [],
				name: 'Load More',
				onClick: async () => await this.as_request(obj),
			},
			{
				color: 'white',
				isDisabled: true,
				icons: [],
				name: 'Loading...',
			},
		]).insert(obj.context, 'beforeend');
		button.onClick();
	}

	async as_request(obj) {
		obj.count = 0;
		let context;
		DOM.insert(obj.container, 'beforeend', <div ref={(ref) => (context = ref)} />);
		while (obj.leftovers.length && obj.count < 25) {
			const leftover = obj.leftovers.splice(0, 1)[0];
			context.appendChild(leftover);
			obj.count += 1;
		}
		let pagination = null;
		do {
			const response = await request({
				method: 'GET',
				url: `${obj.url}${obj.page}`,
			});
			const responseHtml = DOM.parse(response.responseText);
			const elements = responseHtml.querySelectorAll('.table__row-outer-wrap');
			for (const element of elements) {
				if (
					element
						.querySelector('.table__column__heading')
						.textContent.match(/(.+?)( \(.+ Copies\))?$/)[1]
						.toLowerCase() === obj.query
				) {
					if (obj.count < 25) {
						context.appendChild(element.cloneNode(true));
						obj.count += 1;
					} else {
						obj.leftovers.push(element.cloneNode(true));
					}
				}
			}
			obj.page += 1;
			pagination = responseHtml.querySelector('.pagination__navigation');
		} while (
			obj.count < 25 &&
			pagination &&
			!pagination.lastElementChild.classList.contains(this.esgst.selectedClass)
		);
		await endless_load(context);
	}
}

const giveawaysArchiveSearcher = new GiveawaysArchiveSearcher();

export { giveawaysArchiveSearcher };
