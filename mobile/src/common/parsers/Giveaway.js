class IGiveaway {
  constructor() {
    this.data = {};
    this.nodes = {};
    this.game = {
      data: {},
      nodes: {},
    };
    this.creator = {
      data: {},
      nodes: {},
    };
  }
}

class Giveaway extends IGiveaway {
  constructor() {
    super();
  }

  parse(context, mainUrl = '') {
    const now = Date.now();

    this.nodes.outer = context;
    this.nodes.inner = this.nodes.outer.querySelector('.giveaway__row-inner-wrap');
    this.nodes.summary = this.nodes.inner.querySelector('.giveaway__summary');
    this.nodes.heading = this.nodes.summary.querySelector('.giveaway__heading');
    this.nodes.headingName = this.nodes.heading.querySelector('.giveaway__heading__name');
    this.data.url = this.nodes.headingName.getAttribute('href');
    this.data.code = this.data.url.match(/\/giveaway\/(.{5})/)[1];
    this.data.name = this.nodes.headingName.textContent.trim();
    const headingThins = Array.from(this.nodes.heading.querySelectorAll('.giveaway__heading__thin'));
    for (const headingThin of headingThins) {
      let match = headingThin.textContent.match(/\((\d+)P\)/);
      if (match) {
        this.nodes.points = headingThin;
        this.data.points = parseInt(match[1]);
        continue;
      }
      match = headingThin.textContent.replace(/,/g, '').match(/\((\d+)\sCopies\)/);
      if (match) {
        this.nodes.copies = headingThin;
        this.data.copies = parseInt(match[1]);
      }
    }
    const icons = Array.from(this.nodes.heading.querySelectorAll('.giveaway__icon'));
    for (const icon of icons) {
      const url = icon.getAttribute('href');
      if (!url) {
        continue;
      }
      let match = url.match(/store\.steampowered\.com\/(app|sub)\/(\d+)/);
      if (match) {
        this.nodes.steam = icon;
        this.data.steamType = match[1];
        this.data.steamId = parseInt(match[2]);
        continue;
      }
      match =  url.match(/giveaways\/search/);
      if (match) {
        this.nodes.search = icon;
      }
    }
    this.nodes.columns = this.nodes.summary.querySelector('div.giveaway__columns');
    for (const child of Array.from(this.nodes.columns.children)) {
      let match = child.textContent.match(/(begins|ends|remaining)/i);
      if (match) {
        this.nodes.endTime = child;
        this.nodes.endTimeTimestamp = this.nodes.endTime.querySelector(`span[data-timestamp]`);
        this.data.endTime = parseInt(this.nodes.endTimeTimestamp.getAttribute('data-timestamp')) * 1e3;
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
        this.nodes.startTime = child;
        this.nodes.startTimeTimestamp = this.nodes.startTime.querySelector(`span[data-timestamp]`);
        this.data.startTime = parseInt(this.nodes.startTimeTimestamp.getAttribute('data-timestamp')) * 1e3;
        this.nodes.creator = this.nodes.startTime.querySelector('a.giveaway__username');
        if (this.nodes.creator) {
          this.data.creator = this.nodes.creator.textContent.trim();
        } else {
          this.data.creator = mainUrl.match(/\/user\/(.+)/)[1];
        }
        continue;
      }
      if (child.matchesSelector('div.giveaway__column--contributor-level')) {
        this.nodes.level = child;
        this.data.level = parseInt(child.textContent.match(/Level\s(\d+)/)[1]);
        continue;
      }
      if (child.matchesSelector('div.giveaway__column--region-restricted')) {
        this.nodes.regionRestricted = child;
        this.data.regionRestricted = true;
      }
    }
    this.nodes.links = this.nodes.summary.querySelector('div.giveaway__links');
    for (const child of Array.from(this.nodes.links.children)) {
      let match = child.textContent.replace(/,/g, '').match(/(\d+)\sentr(y|ies)/);
      if (match) {
        this.nodes.entries = child;
        this.data.entries = parseInt(match[1]);
      }
      match = child.textContent.replace(/,/g, '').match(/(\d+)\scomments?/);
      if (match) {
        this.nodes.comments = child;
        this.data.comments = parseInt(match[1]);
      }
    }
    this.nodes.avatar = this.nodes.inner.querySelector('a.giveaway_image_avatar');
    this.data.avatar = this.nodes.avatar.getAttribute('style').match(/url\((.+?)\);/)[1];
    this.nodes.thumbnail = this.nodes.inner.querySelector('a.giveaway_image_thumbnail');
    if (this.nodes.thumbnail) {
      this.data.thumbnail = this.nodes.thumbnail.getAttribute('style').match(/url\((.+?)\);/)[1];
    } else {
      this.nodes.thumbnail = this.nodes.inner.querySelector('a.giveaway_image_thumbnail_missing');
      this.data.thumbnail = null;
    }
  }
}

export { Giveaway };