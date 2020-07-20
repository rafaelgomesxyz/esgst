import { Module } from '../class/Module';
import { Settings } from '../class/Settings';

class Groups extends Module {
	constructor() {
		super();
		this.info = {
			endless: true,
			id: 'groups',
			featureMap: {
				endless: this.groups_load.bind(this),
			},
		};
	}

	async groups_load(context, main, source, endless) {
		const elements = context.querySelectorAll(
			`${
				endless
					? `.esgst-es-page-${endless} a[href*="/group/"], .esgst-es-page-${endless}a[href*="/group/"]`
					: `a[href*="/group/"]`
			}, .form_list_item_summary_name`
		);
		if (!elements.length) {
			return;
		}
		const groups = [];
		for (const element of elements) {
			if (!element.textContent || element.children.length || element.closest('.markdown')) {
				continue;
			}
			const group = {
				saved: null,
				url: element.getAttribute('href'),
			};
			if (group.url) {
				const match = group.url.match(/\/group\/(.+?)\//);
				if (match) {
					group.id = match[1];
					group.saved = this.esgst.groups.filter((x) => x.code === group.id)[0];
				}
			}
			if (!group.id) {
				const avatarImage = element.parentElement.previousElementSibling;
				const avatar = avatarImage.style.backgroundImage;
				group.saved = this.esgst.groups.filter((x) => avatar.match(x.avatar))[0];
				group.id = group.saved && group.saved.code;
			}
			if (!group.id) {
				continue;
			}
			group.code = group.id;
			if (!this.esgst.currentGroups[group.id]) {
				this.esgst.currentGroups[group.id] = {
					elements: [],
					savedGroup: group.saved,
				};
			}
			if (this.esgst.currentGroups[group.id].elements.indexOf(element) > -1) {
				continue;
			}
			group.name = element.textContent.trim();
			const container = element.parentElement;
			group.oldElement = element;
			if (this.esgst.groupPath && container.classList.contains('page__heading__breadcrumbs')) {
				group.element = document.getElementsByClassName('featured__heading__medium')[0];
				group.container = group.element.parentElement;
			} else {
				group.element = element;
				group.container = container;
			}
			group.context = group.element;
			this.esgst.currentGroups[group.id].elements.push(group.element);
			group.innerWrap = element.closest('.table__row-inner-wrap') || group.container;
			group.outerWrap = element.closest('.table__row-outer-wrap') || group.container;
			const isHeading = group.context.classList.contains('featured__heading__medium');
			if (isHeading) {
				group.tagContext = group.container;
				group.tagPosition = 'beforeEnd';
			} else {
				group.tagContext = group.context;
				group.tagPosition = 'afterEnd';
			}
			this.esgst.currentScope.groups.push(group);
			groups.push(group);
		}
		if (
			main &&
			this.esgst.gpf &&
			this.esgst.gpf.filteredCount &&
			Settings.get(`gpf_enable${this.esgst.gpf.type}`)
		) {
			this.esgst.modules.groupsGroupFilters.filters_filter(this.esgst.gpf, false, endless);
		}
		for (const feature of this.esgst.groupFeatures) {
			await feature(groups, main, source, endless);
		}
	}
}

const groupsModule = new Groups();

export { groupsModule };
