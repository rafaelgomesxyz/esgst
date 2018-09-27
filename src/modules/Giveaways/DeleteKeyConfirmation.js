import Module from '../../class/Module';
import {common} from '../Common';

const
  createConfirmation = common.createConfirmation.bind(common),
  createElements = common.createElements.bind(common),
  request = common.request.bind(common)
;

class GiveawaysDeleteKeyConfirmation extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Shows a confirmation popup if you try to delete a giveaway's key(s) (in any <a href="https://www.steamgifts.com/giveaway/aeqw7/dead-space/winners">winners</a> page).</li>
      </ul>
    `,
      id: `dkc`,
      load: this.dkc,
      name: `Delete Key Confirmation`,
      sg: true,
      type: `giveaways`
    };
  }

  dkc() {
    if (!this.esgst.giveawayPath) return;
    this.esgst.endlessFeatures.push(this.dkc_getLinks);
  }

  dkc_getLinks(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .form__key-btn-delete, .esgst-es-page-${endless}.form__key-btn-delete` : `.form__key-btn-delete`}`);
    for (let i = elements.length - 1; i > -1; --i) {
      const element = elements[i];
      const newElement = createElements(element, `afterEnd`, [{
        attributes: {
          class: `table__column__secondary-link esgst-clickable`
        },
        text: `Delete`,
        type: `span`
      }]);
      element.remove();
      newElement.addEventListener(`click`, createConfirmation.bind(null, `Are you sure you want to delete this key?`, this.dkc_deleteKey.bind(createConfirmation, newElement), null));
    }
  }

  async dkc_deleteKey(link) {
    let row = link.closest(`.table__row-inner-wrap`);
    row.getElementsByClassName(`form__key-read`)[0].classList.add(`is-hidden`);
    row.getElementsByClassName(`form__key-loading`)[0].classList.remove(`is-hidden`);
    row.querySelector(`[name="key_value"]`).value = ``;
    row.getElementsByClassName(`form__key-value`)[0].textContent = ``;
    await request({
      data: `xsrf_token=${this.esgst.xsrfToken}&do=set_gift_key&key_value=&winner_id=${row.querySelector(`[name="winner_id"]`).value}`,
      method: `POST`,
      url: `/ajax.php`
    });
    row.getElementsByClassName(`form__key-loading`)[0].classList.add(`is-hidden`);
    row.getElementsByClassName(`form__key-insert`)[0].classList.remove(`is-hidden`);
    row.getElementsByClassName(`js__sent-text`)[0].textContent = `Sent Gift`;
    row.getElementsByClassName(`js__sent-text`)[1].textContent = `Sent Gift`;
  }
}

export default GiveawaysDeleteKeyConfirmation;