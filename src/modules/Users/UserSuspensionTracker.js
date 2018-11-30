import Module from '../../class/Module';
import Checkbox from '../../class/Checkbox';
import Popup from '../../class/Popup';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';

const
  parseHtml = utils.parseHtml.bind(utils),
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  getValue = common.getValue.bind(common),
  request = common.request.bind(common),
  setValue = common.setValue.bind(common)
  ;

class UsersUserSuspensionTracker extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `When checking a user with [id = namwc], that feature will also check if the user has already served suspensions for any infractions found so that you do not need to report them again.`],
          [`li`, [
            `It is impossible to retrieve that information automatically, so the database (which is kept globally in a Google Sheet) needs to be maintained by ESGST users. For that, this feature adds 2 identical buttons (`,
            [`i`, { class: `fa fa-paper-plane` }],
            `) to the main page heading of 2 different locations:`
          ]],
          [`ul`, [
            [`li`, [
              `Your `,
              [`a`, { href: `https://www.steamgifts.com/support/tickets` }, `tickets`],
              ` page, which allows you to send multiple tickets to the database at once. The feature adds a checkbox in front of each ticket that belongs to one of the accepted categories so that you can select the tickets that you want to send. There are shortcuts that can help you select them:`
              [`ul`, [
                [`li`, `Clicking on an unchecked checkbox with the Ctrl key pressed will select all of the tickets.`],
                [`li`, `Clicking on a checked checkbox with the Ctrl key pressed will unselect all of the tickets.`],
                [`li`, `Clicking on any checkbox with the Alt key pressed will toggle all of the tickets (any tickets that were unselected will be selected and any tickets that were selected will be unselected).`]
              ]]
            ]],
            [`li`, `A ticket you created, which allows you to send that single ticket to the database.`]
          ]],
          [`li`, `You can only send tickets that belong to one of the accepted categories to the database:`],
          [`ul`, [
            [`li`, `Request New Winner > Did Not Activate Previous Wins This Month`],
            [`li`, `Request New Winner > Other`],
            [`li`, `User Report > Multiple Wins for the Same Game`],
            [`li`, `User Report > Not Activating Won Gift`]
          ]],
          [`li`, `When you send a ticket, the HTML containing all of the ticket's information (including any comments) is sent to the database, and the ticket is requested before being sent, which prevents users from tampering with the HTML.`],
          [`li`, `After you send a ticket you will no longer have the option to send it again, to prevent duplicate entries.`]
        ]]
      ],
      id: `ust`,
      load: this.ust,
      name: `User Suspension Tracker`,
      sg: true,
      st: true,
      type: `users`
    };
  }

  ust() {
    if (this.esgst.ticketsPath) {
      this.esgst.ustButton = createHeadingButton({
        id: `ust`,
        icons: [`fa-paper-plane`],
        title: `Send selected tickets to the User Suspension Tracker database`
      });
      this.esgst.ustButton.addEventListener(`click`, this.ust_sendAll.bind(this));
    } else if (this.esgst.ticketPath && document.getElementsByClassName(`table__column--width-fill`)[1].textContent.trim().match(/Did\sNot\sActivate\sPrevious\sWins\sThis\sMonth|Other|Multiple\sWins\sfor\sthe\sSame\sGame|Not\sActivating\sWon\sGift/)) {
      let code, tickets;
      code = location.pathname.match(/\/ticket\/(.+?)\//)[1];
      tickets = JSON.parse(this.esgst.storage.tickets);
      if (!tickets[code] || !tickets[code].sent) {
        this.esgst.ustButton = createElements(document.getElementsByClassName(`page__heading`)[0].lastElementChild, `beforeBegin`, [{
          attributes: {
            class: `esgst-heading-button`,
            title: `${getFeatureTooltip(`ust`, `Send ticket to the User Suspension Tracker database`)}`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-paper-plane`
            },
            type: `i`
          }]
        }]);
        this.esgst.ustButton.addEventListener(`click`, this.ust_send.bind(this));
      }
    }
  }

  async ust_sendAll() {
    this.esgst.ustButton.removeEventListener(`click`, this.ust_sendAll);
    createElements(this.esgst.ustButton, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    let n = Object.keys(this.esgst.ustCheckboxes).length;
    let numError = 0;
    let promises = [];
    let obj = {
      data: ``
    };
    for (let code in this.esgst.ustCheckboxes) {
      if (this.esgst.ustCheckboxes.hasOwnProperty(code)) {
        promises.push(this.ust_check(code, obj));
      }
    }
    await Promise.all(promises);
    let error = JSON.parse((await request({
      data: obj.data.slice(0, -1),
      method: `POST`,
      url: `https://script.google.com/macros/s/AKfycbwdKNormCJs-hEKV0GVwawgWj1a26oVtPylgmxOOvNk1Gf17A/exec`
    })).responseText).error;
    let tickets = JSON.parse(await getValue(`tickets`));
    for (let code in this.esgst.ustCheckboxes) {
      if (this.esgst.ustCheckboxes.hasOwnProperty(code)) {
        if (error.indexOf(code) < 0) {
          if (!tickets[code]) {
            tickets[code] = {
              readComments: {}
            };
          }
          tickets[code].sent = 1;
          this.esgst.numUstTickets -= 1;
          this.esgst.ustCheckboxes[code].remove();
          delete this.esgst.ustCheckboxes[code];
        } else {
          numError += 1;
        }
      }
    }
    await setValue(`tickets`, JSON.stringify(tickets));
    if (n === this.esgst.numUstTickets) {
      this.esgst.ustButton.remove();
    } else {
      createElements(this.esgst.ustButton, `inner`, [{
        attributes: {
          class: `fa fa-paper-plane`
        },
        type: `i`
      }]);
      this.esgst.ustButton.addEventListener(`click`, this.ust_sendAll.bind(this));
    }
    this.esgst.ustCheckboxes = [];
    new Popup({
      addScrollable: true,
      icon: ``,
      isTemp: true,
      title: `${n - numError} out of ${n} tickets sent! They will be analyzed and, if accepted, added to the database in 48 hours at most.${numError > 0 ? ` Try sending the tickets that failed again later.` : ``}`
    }).open();
  }

  async ust_check(code, obj) {
    let responseHtml = parseHtml((await request({ method: `GET`, url: `/support/ticket/${code}/` })).responseText);
    if (responseHtml.getElementsByClassName(`table__column--width-fill`)[1].textContent.trim().match(/Did\sNot\sActivate\sPrevious\sWins\sThis\sMonth|Other|Multiple\sWins\sfor\sthe\sSame\sGame|Not\sActivating\sWon\sGift/)) {
      obj.data += `${code}=${encodeURIComponent(responseHtml.getElementsByClassName(`sidebar`)[0].nextElementSibling.innerHTML.replace(/\n|\r|\r\n|\s{2,}/g, ``).trim())}&`;
    }
  }

  async ust_send() {
    let code = location.href.match(/\/ticket\/(.+?)\//)[1];
    this.esgst.ustButton.removeEventListener(`click`, this.ust_send);
    createElements(this.esgst.ustButton, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    let error = JSON.parse(
      (await request({
        data: `${code}=${encodeURIComponent(parseHtml(
          (await request({ method: `GET`, url: location.href })).responseText
        ).getElementsByClassName(`sidebar`)[0].nextElementSibling.innerHTML.replace(/\n|\r|\r\n|\s{2,}/g, ``).trim())}`,
        method: `POST`,
        url: `https://script.google.com/macros/s/AKfycbwdKNormCJs-hEKV0GVwawgWj1a26oVtPylgmxOOvNk1Gf17A/exec`
      })
      ).responseText).error;
    if (error.length === 0) {
      let tickets = JSON.parse(await getValue(`tickets`));
      if (!tickets[code]) {
        tickets[code] = {
          readComments: {}
        };
      }
      tickets[code].sent = 1;
      await setValue(`tickets`, JSON.stringify(tickets));
      this.esgst.ustButton.remove();
      new Popup({
        addScrollable: true,
        icon: ``,
        isTemp: true,
        title: `Ticket sent! It will be analyzed and, if accepted, added to the database in 48 hours at most.`
      }).open();
    } else {
      createElements(this.esgst.ustButton, `inner`, [{
        attributes: {
          class: `fa fa-paper-plane`
        },
        type: `i`
      }]);
      this.esgst.ustButton.addEventListener(`click`, this.ust_send.bind(this));
      new Popup({
        addScrollable: true,
        icon: ``,
        isTemp: true,
        title: `An error occurred. Please try again later.`
      }).open();
    }
  }

  ust_addCheckbox(code, context) {
    if (!context.getElementsByClassName(`esgst-ust-checkbox`)[0]) {
      context.classList.add(`esgst-relative`);
      let checkbox = new Checkbox(context);
      checkbox.checkbox.classList.add(`esgst-ust-checkbox`);
      this.esgst.ustTickets[code] = checkbox;
      checkbox.onEnabled = event => {
        if (event) {
          if (event.ctrlKey) {
            for (let code in this.esgst.ustTickets) {
              if (this.esgst.ustTickets.hasOwnProperty(code)) {
                this.esgst.ustTickets[code].check();
              }
            }
          } else if (event.altKey) {
            checkbox.toggle();
            for (let code in this.esgst.ustTickets) {
              if (this.esgst.ustTickets.hasOwnProperty(code)) {
                this.esgst.ustTickets[code].toggle();
              }
            }
          }
        }
        this.esgst.ustCheckboxes[code] = checkbox.checkbox;
      };
      checkbox.onDisabled = event => {
        if (event) {
          if (event.ctrlKey) {
            for (let code in this.esgst.ustTickets) {
              if (this.esgst.ustTickets.hasOwnProperty(code)) {
                this.esgst.ustTickets[code].uncheck();
              }
            }
          } else if (event.altKey) {
            checkbox.toggle();
            for (let code in this.esgst.ustTickets) {
              if (this.esgst.ustTickets.hasOwnProperty(code)) {
                this.esgst.ustTickets[code].toggle();
              }
            }
          }
        }
        delete this.esgst.ustCheckboxes[code];
      };
      this.esgst.numUstTickets += 1;
    }
  }
}

export default UsersUserSuspensionTracker;