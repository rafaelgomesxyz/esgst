import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { gSettings } from '../../class/Globals';
import { Table } from '../../class/Table';
import { shared } from '../../class/Shared';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { ButtonSet } from '../../class/ButtonSet';

class GeneralCakeDayReminder extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', `Shows a popup reminding you of your cake day on SteamGifts.`],
          ['li', `You can set it to remind you a specified number of days before your cake day.`]
        ]]
      ],
      features: {
        cdr_b: {
          inputItems: [
            {
              id: 'cdr_days',
              prefix: `Days: `
            }
          ],
          name: `Remind you a specified number of days before your cake day.`,
          sg: true
        },
        cdr_d: {
          name: `Remind you on your cake day.`,
          sg: true
        },
        cdr_a: {
          inputItems: [
            {
              id: 'cdr_aDays',
              prefix: `Days: `
            }
          ],
          name: `Remind you a specified number of days after your cake day.`,
          sg: true
        },
      },
      id: 'cdr',
      name: `Cake Day Reminder`,
      sg: true,
      type: 'general'
    };
  }

  async init() {
    shared.esgst.profileFeatures.push(this.addButton.bind(this));

    const cdrObj = {
      cache: JSON.parse(shared.common.getLocalValue('cdrCache', `{}`)),
      currentDate: new Date(),
      elements: [
        [{ size: 'fill', value: 'User' }, { size: 'fill', value: 'When' }]
      ]
    };
    cdrObj.currentYear = cdrObj.currentDate.getFullYear();
    cdrObj.currentTime = cdrObj.currentDate.getTime();

    this.checkUser(cdrObj, gSettings.steamId, {
      cdr: {
        a: gSettings.cdr_a,
        aDays: parseFloat(gSettings.cdr_aDays),
        b: gSettings.cdr_b,
        bDays: parseFloat(gSettings.cdr_days),
        d: gSettings.cdr_d
      },
      registrationDate: parseInt(gSettings.registrationDate)
    });

    for (const steamId in shared.esgst.users.users) {
      const user = shared.esgst.users.users[steamId];

      if (steamId === gSettings.steamId || (!user.cdr && !user.registrationDate)) {
        continue;
      }

      this.checkUser(cdrObj, steamId, user);
    }
    
    if (cdrObj.elements.length > 1) {
      shared.common.setLocalValue('cdrCache', JSON.stringify(cdrObj.cache));

      const popup = new Popup({
        addScrollable: true,
        icon: `fa-birthday-cake`,
        isTemp: true,
        title: `ESGST reminder about cake days:`
      });
      popup.scrollable.appendChild(new Table(cdrObj.elements).table);
      popup.open();
      await shared.common.endless_load(popup.scrollable);
    }
  }

  checkUser(cdrObj, steamId, user) {
    if (!user.cdr || !user.registrationDate) {
      return;
    }

    const className = steamId === gSettings.steamId ? `esgst-cdr-highlight` : ``;

    const registrationDate = new Date(user.registrationDate * 1e3);
    registrationDate.setFullYear(cdrObj.currentYear);
    const registrationTime = registrationDate.getTime();

    const bYear = parseInt((cdrObj.cache[steamId] && cdrObj.cache[steamId].bYear) || 0);
    const dYear = parseInt((cdrObj.cache[steamId] && cdrObj.cache[steamId].dYear) || 0);
    const aYear = parseInt((cdrObj.cache[steamId] && cdrObj.cache[steamId].aYear) || 0);

    if (user.cdr.b && bYear !== cdrObj.currentYear && cdrObj.currentTime < registrationTime && (registrationTime - cdrObj.currentTime) <= (user.cdr.bDays * 86400000)) {
      if (!cdrObj.cache[steamId]) {
        cdrObj.cache[steamId] = {};
      }
      cdrObj.cache[steamId].bYear = cdrObj.currentYear;

      cdrObj.elements.push([
        { size: 'fill', value: [
          className
            ? ['span', { class: className }, 'YOU']
            : ['a', { class: `table__column__secondary-link`, href: `/user/${user.username}` }, user.username]
        ]},
        { size: 'fill', value: [
          ['span', { class: className }, `In ${Math.floor((registrationTime - cdrObj.currentTime) / 86400000)} days`]
        ]}
      ]);
    } else if (user.cdr.d && dYear !== cdrObj.currentYear && cdrObj.currentTime >= registrationTime && cdrObj.currentTime < registrationTime + 86400000) {
      if (!cdrObj.cache[steamId]) {
        cdrObj.cache[steamId] = {};
      }
      cdrObj.cache[steamId].dYear = cdrObj.currentYear;

      cdrObj.elements.push([
        { size: 'fill', value: [
          className
            ? ['span', { class: className }, 'YOU']
            : ['a', { class: `table__column__secondary-link`, href: `/user/${user.username}` }, user.username]
        ]},
        { size: 'fill', value: [
          ['span', { class: className }, `Today! Happy cake day!`]
        ]}
      ]);
    } else if (user.cdr.a && aYear !== cdrObj.currentYear && cdrObj.currentTime >= registrationTime + 86400000 && (cdrObj.currentTime - registrationTime) <= (user.cdr.aDays * 86400000)) {
      if (!cdrObj.cache[steamId]) {
        cdrObj.cache[steamId] = {};
      }
      cdrObj.cache[steamId].aYear = cdrObj.currentYear;

      cdrObj.elements.push([
        { size: 'fill', value: [
          className
            ? ['span', { class: className }, 'YOU']
            : ['a', { class: `table__column__secondary-link`, href: `/user/${user.username}` }, user.username]
        ]},
        { size: 'fill', value: [
          ['span', { class: className }, `${Math.floor((cdrObj.currentTime - registrationTime) / 86400000)} days ago`]
        ]}
      ]);
    }
  }

  addButton(profile) {
    if (profile.steamId === gSettings.steamId) {
      return;
    }

    const button = shared.common.createElements_v2(profile.heading, 'beforeEnd', [
      ['a', { title: shared.common.getFeatureTooltip('cdr', `Get notified about ${profile.username}'s cake day`) }, [
        ['i', { class: `fa fa-gift` }]
      ]]
    ]);

    button.addEventListener('click', async () => {
      const popup = new Popup({
        addScrollable: true,
        icon: `fa-gift`,
        isTemp: true,
        title: `Get notified about ${profile.username}'s cake day:`
      });

      const user = {
        id: profile.id,
        steamId: profile.steamId,
        username: profile.username,
        values: {}
      };
      const savedUser = await shared.common.getUser(shared.esgst.users, user);
      if (savedUser && savedUser.cdr) {
        user.values.cdr = savedUser.cdr;        
      } else {
        user.values.cdr = {
          a: false,
          aDays: 0,
          b: false,
          bDays: 0,
          d: true
        };
      }

      const bSwitch = new ToggleSwitch(null, null, false, [
        `Notify `,
        ['input', { class: `esgst-switch-input`, onchange: event => user.values.cdr.bDays = parseFloat(event.currentTarget.value), type: 'number', value: user.values.cdr.bDays }],
        ` days before their cake day.`
      ], false, false, null, user.values.cdr.b);
      const dSwitch = new ToggleSwitch(null, null, false, `Notify on their cake day.`, false, false, null, user.values.cdr_d);
      const aSwitch = new ToggleSwitch(null, null, false, [
        `Notify `,
        ['input', { class: `esgst-switch-input`, onchange: event => user.values.cdr.aDays = parseFloat(event.currentTarget.value), type: 'number', value: user.values.cdr.aDays }],
        ` days after their cake day.`
      ], false, false, null, user.values.cdr.b);

      bSwitch.onChange = value => user.values.cdr.b = value;
      dSwitch.onChange = value => user.values.cdr.d = value;
      aSwitch.onChange = value => user.values.cdr.a = value;

      popup.scrollable.appendChild(bSwitch.container);
      popup.scrollable.appendChild(dSwitch.container);
      popup.scrollable.appendChild(aSwitch.container);

      popup.description.appendChild(new ButtonSet({
        color1: 'green',
        color2: 'grey',
        icon1: `fa-check`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: 'Save',
        title2: `Saving...`,
        callback1: async () => {
          if (user.values.cdr.b || user.values.cdr.d || user.values.cdr.a) {
            user.values.registrationDate = profile.registrationDate;
          } else {
            user.values.cdr = null;
          }
          await shared.common.saveUser(null, null, user);
          popup.close();
        }
      }).set);

      popup.open();
    });
  }
}

const generalCakeDayReminder = new GeneralCakeDayReminder();

export { generalCakeDayReminder };