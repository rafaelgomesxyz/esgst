import { Module } from '../../class/Module';
import { common } from '../Common';
import { Shared } from '../../class/Shared';
import { DOM } from '../../class/DOM';

class GiveawaysVisibleInviteOnlyGiveaways extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				['ul', [
					['li', 'Displays information for open invite-only giveaways in profile pages if the information is available in the storage.'],
					['li', `To add information about a giveaway from someone else to the storage, you must enter the giveaway and visit your entered page with [id=cewgd] enabled.`],
					['li', `To add information about your own giveaways to the storage, you must sync your giveaways in the sync menu or check your profile with [id=ugd].`]
				]]
			],
			id: 'viog',
			name: 'Visible Invite-Only Giveaways',
			sg: true,
			type: 'giveaways',
			featureMap: {
				giveaway: this.viog_display.bind(this)
			}
		};
	}

	viog_display(giveaways) {
		if (!Shared.esgst.userPath) {
			return;
		}
		for (const giveaway of giveaways) {
			if (!giveaway.inviteOnly || giveaway.id) {
				continue;
			}

			const foundGiveaway = Object.keys(this.esgst.giveaways)
				.map(x => this.esgst.giveaways[x])
				.filter(savedGiveaway =>
					savedGiveaway.gameSteamId
					&& savedGiveaway.gameType
					&& savedGiveaway.gameName
					&& savedGiveaway.points
					&& savedGiveaway.copies
					&& (
						(savedGiveaway.code && savedGiveaway.code === giveaway.code)
						|| (savedGiveaway.creator
							&& savedGiveaway.creator.toLowerCase() == giveaway.creator.toLowerCase()
							&& savedGiveaway.startTime && savedGiveaway.startTime === giveaway.startTime
							&& savedGiveaway.endTime && savedGiveaway.endTime === giveaway.endTime
						)
					)
				)[0];
			if (foundGiveaway) {
				giveaway.id = foundGiveaway.gameSteamId;
				giveaway.type = foundGiveaway.gameType;
				giveaway.name = foundGiveaway.gameName;
				giveaway.points = foundGiveaway.points;
				giveaway.copies = foundGiveaway.copies;
				giveaway.url = `/giveaway/${foundGiveaway.code}/`;
				giveaway.headingName.setAttribute('href', giveaway.url);
				giveaway.headingName.textContent = giveaway.name;
				giveaway.entriesLink.setAttribute('href', `${giveaway.url}_/entries`);
				giveaway.commentsLink.setAttribute('href', giveaway.url);
				giveaway.image.classList.remove('giveaway_image_thumbnail_missing');
				giveaway.image.classList.add('giveaway_image_thumbnail');
				giveaway.image.setAttribute('href', giveaway.url);
				giveaway.image.style.backgroundImage = `url("https://steamcdn-a.akamaihd.net/steam/${giveaway.type}/${giveaway.id}/capsule_184x69.jpg")`;
				giveaway.image.innerHTML = '';
				DOM.build(giveaway.heading, 'beforeEnd', [
					['span', { class: 'giveaway__heading__thin', 'data-draggable-id': 'points', ref: ref => giveaway.pointsContainer = ref }, `(${giveaway.points}P)`],
					giveaway.copies > 1
						? ['span', { class: 'giveaway__heading__thin', 'data-draggable-id': 'copies', ref: ref => giveaway.copiesContainer = ref }, `(${giveaway.copies} Copies)`]
						: null,
					['a', { class: 'giveaway__icon', 'data-draggable-id': 'steam', href: `https://store.steampowered.com/${giveaway.type.slice(0, -1)}/${giveaway.id}/`, rel: 'nofollow', target: '_blank' }, [
						['i', { class: 'fa fa-steam' }]
					]],
					['a', { class: 'giveaway__icon', 'data-draggable-id': 'search', href: `/giveaways/search?${giveaway.type.slice(0, -1)}/${giveaway.id}` }, [
						['i', { class: 'fa fa-search' }]
					]]
				]);
			}
		}
	}
}

const giveawaysVisibleInviteOnlyGiveaways = new GiveawaysVisibleInviteOnlyGiveaways();

export { giveawaysVisibleInviteOnlyGiveaways };