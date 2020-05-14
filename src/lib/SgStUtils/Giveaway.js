class Giveaway {
	constructor(code) {
		this.plugins = [];
		this.data = {};
		this.elements = {};
	}

	registerPlugin(plugin) {
		this.plugins.push(plugin);
	}

	build() {

	}

	parse(context, mainUrl) {
		const now = Date.now();
		this.elements.outerWrap = context;
		this.elements.innerWrap = this.elements.outerWrap.querySelector('div.giveaway__row-inner-wrap');
		this.elements.summary = this.elements.innerWrap.querySelector('div.giveaway__summary');
		this.elements.heading = this.elements.summary.querySelector('h2.giveaway__heading');
		this.elements.headingName = this.elements.heading.querySelector('a.giveaway__heading__name');
		this.data.url = this.elements.headingName.getAttribute('href');
		this.data.code = this.data.url.match(/\/giveaway\/(.{5})/)[1];
		this.data.name = this.elements.headingName.textContent.trim();
		const headingThins = this.elements.heading.querySelectorAll('.giveaway__heading__thin');
		for (const headingThin of headingThins) {
			let match = headingThin.textContent.match(/\((\d+)P\)/);
			if (match) {
				this.elements.points = headingThin;
				this.data.points = parseInt(match[1]);
				continue;
			}
			match = headingThin.textContent.replace(/,/g, '').match(/\((\d+)\sCopies\)/);
			if (match) {
				this.elements.copies = headingThin;
				this.data.copies = parseInt(match[1]);
			}
		}
		const icons = this.elements.heading.querySelectorAll('.giveaway__icon');
		for (const icon of icons) {
			const url = icon.getAttribute('href');
			if (!url) {
				continue;
			}
			let match = url.match(/store\.steampowered\.com\/(app|sub)\/(\d+)/);
			if (match) {
				this.elements.steam = icon;
				this.data.steamType = match[1];
				this.data.steamId = parseInt(match[2]);
				continue;
			}
			match =  url.match(/giveaways\/search/);
			if (match) {
				this.elements.search = icon;
			}
		}
		this.elements.columns = this.elements.summary.querySelector('div.giveaway__columns');
		for (const child of this.elements.columns.children) {
			let match = child.textContent.match(/(begins|ends|remaining)/i);
			if (match) {
				this.elements.endTime = child;
				this.elements.endTimeTimestamp = this.elements.endTime.querySelector(`span[data-timestamp]`);
				this.data.endTime = parseInt(this.elements.endTimeTimestamp.getAttribute('data-timestamp')) * 1e3;
				if (match[1] === 'begins') {
					this.data.started = false;
					this.data.ended = false;
				} else {
					this.data.started = true;
					this.data.ended = now > this.data.endTime;
				}
				continue;
			}
			match = child.textContent.match(/ago/);
			if (match) {
				this.elements.startTime = child;
				this.elements.startTimeTimestamp = this.elements.startTime.querySelector(`span[data-timestamp]`);
				this.data.startTime = parseInt(this.elements.startTimeTimestamp.getAttribute('data-timestamp')) * 1e3;
				this.elements.creator = this.elements.startTime.querySelector('a.giveaway__username');
				if (this.elements.creator) {
					this.data.creator = this.elements.creator.textContent.trim();
				} else {
					this.data.creator = mainUrl.match(/\/user\/(.+)/)[1];
				}
				continue;
			}
			if (child.matches('div.giveaway__column--contributor-level')) {
				this.elements.level = child;
				this.data.level = parseInt(child.textContent.match(/Level\s(\d+)/)[1]);
				continue;
			}
			if (child.matches('div.giveaway__column--region-restricted')) {
				this.elements.regionRestricted = child;
				this.data.regionRestricted = true;
			}
		}
		this.elements.links = this.elements.summary.querySelector('div.giveaway__links');
		for (const child of this.elements.links.children) {
			let match = child.textContent.replace(/,/g, '').match(/(\d+)\sentr(y|ies)/);
			if (match) {
				this.elements.entries = child;
				this.data.entries = parseInt(match[1]);
			}
			match = child.textContent.replace(/,/g, '').match(/(\d+)\scomments?/);
			if (match) {
				this.elements.comments = child;
				this.data.comments = parseInt(match[1]);
			}
		}
		this.elements.avatar = this.elements.innerWrap.querySelector('a.giveaway_image_avatar');
		this.data.avatar = this.elements.avatar.getAttribute('style').match(/url\((.+?)\);/)[1];
		this.elements.thumbnail = this.elements.innerWrap.querySelector('a.giveaway_image_thumbnail');
		if (this.elements.thumbnail) {
			this.data.thumbnail = this.elements.thumbnail.getAttribute('style').match(/url\((.+?)\);/)[1];
		} else {
			this.elements.thumbnail = this.elements.innerWrap.querySelector('a.giveaway_image_thumbnail_missing');
			this.data.thumbnail = null;
		}
		for (const plugin of this.plugins) {
			plugin(this);
		}
	}

	async getComments() {

	}

	async getCountries() {

	}

	async getEntries() {

	}

	async getGroups() {

	}

	async getWinners() {

	}
}

export { Giveaway };