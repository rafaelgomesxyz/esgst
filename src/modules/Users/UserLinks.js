import { Module } from '../../class/Module';
import { common } from '../Common';
import { gSettings } from '../../class/Globals';

class UsersUserLinks extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Allows you to add custom links next to a user's username in their profile page.`],
          [`li`, `Can be used in other pages through [id=ap].`],
          [`li`, `Comes by default with 5 links to BLAEO, Playing Appreciated, Touhou Giveaways, AStats and SteamRep.`]
        ]]
      ],
      id: `ul`,
      name: `User Links`,
      sg: true,
      type: `users`,
      featureMap: {
        profile: this.ul_add.bind(this)
      }
    };
  }

  ul_add(profile) {
    const items = [];
    const iconRegex = /^fa-(.+?)($|\s)/;
    const imageRegex = /^(https?:\/\/.+?)($|\s)/;
    const textRegex = /^(.+?)($|\s(fa-|https?:\/\/))/;
    for (const link of gSettings.ul_links) {
      const children = [];
      let label = link.label;
      while (label) {
        const icon = label.match(iconRegex);
        if (icon) {
          label = label.replace(iconRegex, ``);
          children.push(
            [`i`, { class: `fa ${icon[1]}` }]
          );
          continue;
        }
        const image = label.match(imageRegex);
        if (image) {
          label = label.replace(imageRegex, ``);
          children.push(
            [`img`, { height: `16`, src: image[1], style: `vertical-align: middle;`, width: `16` }]
          );
          continue;
        }
        const text = label.match(textRegex);
        if (text) {
          label = label.replace(textRegex, `$3`);
          children.push(text[1]);
        }
      }
      items.push(
        [`a`, { href: link.url.replace(/%username%/g, profile.username).replace(/%steamid%/g, profile.steamId), target: `_blank` }, children]
      );
    }
    common.createElements_v2(profile.heading, `beforeEnd`, items);
  }
}

const usersUserLinks = new UsersUserLinks();

export { usersUserLinks };