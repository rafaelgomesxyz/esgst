import { Module } from '../../class/Module';
import { common } from '../Common';
import { DOM } from '../../class/DOM';

class GeneralSearchClearButton extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', 'Adds a clear button to each search input in the page.']
        ]]
      ],
      id: 'scb',
      name: 'Search Clear Button',
      sg: true,
      type: 'general'
    };
  }

  init() {
    this.getInputs(document);
  }

  getInputs(context) {
    const inputs = context.querySelectorAll('.sidebar__search-input');
    for (const input of inputs) {
      input.parentElement.classList.add('esgst-scb');
      DOM.build(input.parentElement, 'beforeEnd', [
        ['i', { class: 'fa fa-times', title: 'Clear search', onclick: () => { input.value = ''; input.dispatchEvent(new Event('change')); input.focus(); } }]
      ]);
    }
  }
}

const generalSearchClearButton = new GeneralSearchClearButton();

export { generalSearchClearButton };