import { Module } from '../../class/Module';
import { common } from '../Common';
import { shared } from '../../class/Shared';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
  ;

class UsersSteamGiftsProfileButton extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            'Adds a button next to the "Visit Steam Profile" button of a user\'s ',
            ['a', { href: `https://www.steamtrades.com/user/76561198020696458` }, 'profile'],
            ' page that allows you to go to their SteamGifts profile page.'
          ]]
        ]]
      ],
      id: 'sgpb',
      name: 'SteamGifts Profile Button',
      st: true,
      type: 'users'
    };
  }

  init() {
    if (!shared.esgst.userPath) return;
    shared.esgst.profileFeatures.push(this.sgpb_add.bind(this));
  }

  sgpb_add(profile) {
    let button;
    button = createElements(profile.steamButtonContainer, 'beforeEnd', [{
      attributes: {
        class: 'esgst-sgpb-container',
        title: getFeatureTooltip('sgpb')
      },
      type: 'div',
      children: [{
        attributes: {
          class: 'esgst-sgpb-button',
          href: `https://www.steamgifts.com/go/user/${profile.steamId}`,
          rel: 'nofollow',
          target: '_blank'
        },
        type: 'a',
        children: [{
          attributes: {
            class: 'fa'
          },
          type: 'i',
          children: [{
            attributes: {
              src: shared.esgst.sgIcon
            },
            type: 'img'
          }]
        }, {
          text: 'Visit SteamGifts Profile',
          type: 'span'
        }]
      }]
    }]);
    button.insertBefore(profile.steamButton, button.firstElementChild);
  }
}

const usersSteamGiftsProfileButton = new UsersSteamGiftsProfileButton();

export { usersSteamGiftsProfileButton };