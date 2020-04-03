import { Shared } from './Shared';
import { DOM } from './DOM';

class Checkbox {
	constructor(context, defaultValue, threeState, messages = {}) {
		this.onPreEnabled = null;
		this.onPreDisabled = null;
		this.onEnabled = null;
		this.onDisabled = null;
		this.onChange = null;
		this.isBlocked = false;
		this.value = defaultValue;
		this.isThreeState = threeState;
		const items = [
			['span', {class: 'esgst-checkbox'}, [
				['input', {class: 'esgst-hidden', type: 'checkbox'}],
				['i', {class: 'fa fa-square-o'}],
				['i', {class: 'fa fa-square', type: messages.select || ''}],
				['i', {class: 'fa fa-check-square', type: messages.unselect || ''}]
			]]
		];
		if (context) {
			this.checkbox = DOM.build(context, 'afterBegin', items);
		} else {
			this.checkbox = DOM.build(items).firstElementChild;
		}
		this.input = this.checkbox.firstElementChild;
		this.disabled = this.input.nextElementSibling;
		this.none = this.disabled.nextElementSibling;
		this.enabled = this.none.nextElementSibling;
		if (this.isThreeState) {
			if (this.value === 'disabled') {
				this.none.classList.add('esgst-hidden');
				this.enabled.classList.add('esgst-hidden');
			} else if (this.value === 'none') {
				this.disabled.classList.add('esgst-hidden');
				this.enabled.classList.add('esgst-hidden');
			} else {
				this.disabled.classList.add('esgst-hidden');
				this.none.classList.add('esgst-hidden');
			}
			this.checkbox.addEventListener('click', event => this.change(false, null, null, event));
		} else {
			this.input.checked = this.value;
			if (this.value) {
				this.disabled.classList.add('esgst-hidden');
				this.none.classList.add('esgst-hidden');
			} else {
				this.none.classList.add('esgst-hidden');
				this.disabled.classList.add('esgst-hidden');
			}
			this.checkbox.addEventListener('click', event => this.change(true, null, null, event));
			this.checkbox.addEventListener('mouseenter', () => this.showNone());
			this.checkbox.addEventListener('mouseleave', () => this.hideNone());
			this.change();
		}
	}

	change(toggle, value, callback, event) {
		if (event) {
			event.stopPropagation();
		}
		if (this.isThreeState) {
			if ((this.value === 'disabled' && !value) || (value === 'none')) {
				this.enabled.classList.add('esgst-hidden');
				this.disabled.classList.add('esgst-hidden');
				this.none.classList.remove('esgst-hidden');
				this.value = 'none';
			} else if ((this.value === 'none' && !value) || (value === 'enabled')) {
				this.none.classList.add('esgst-hidden');
				this.disabled.classList.add('esgst-hidden');
				this.enabled.classList.remove('esgst-hidden');
				this.value = 'enabled';
			} else if (!value || value === 'disabled') {
				this.enabled.classList.add('esgst-hidden');
				this.none.classList.add('esgst-hidden');
				this.disabled.classList.remove('esgst-hidden');
				this.value = 'disabled';
			}
		} else {
			if (toggle) {
				this.preValue = this.input.checked = !this.input.checked;
			} else {
				this.preValue = this.input.checked;
			}
			if (this.preValue) {
				if (this.onPreEnabled && !this.isBlocked) {
					this.onPreEnabled(event);
				}
				this.value = this.preValue;
				this.disabled.classList.add('esgst-hidden');
				this.none.classList.add('esgst-hidden');
				this.enabled.classList.remove('esgst-hidden');
				if (this.onEnabled && !this.isBlocked) {
					this.onEnabled(event);
				}
			} else {
				if (this.onPreDisabled && !this.isBlocked) {
					this.onPreDisabled(event);
				}
				this.value = this.preValue;
				this.enabled.classList.add('esgst-hidden');
				this.none.classList.add('esgst-hidden');
				this.disabled.classList.remove('esgst-hidden');
				if (this.onDisabled && !this.isBlocked) {
					this.onDisabled(event);
				}
			}
		}
		if (event && this.onChange) {
			this.onChange();
		}
	}

	showNone() {
		if (!this.value) {
			this.disabled.classList.add('esgst-hidden');
			this.none.classList.remove('esgst-hidden');
		}
	}

	hideNone() {
		if (!this.value) {
			this.disabled.classList.remove('esgst-hidden');
			this.none.classList.add('esgst-hidden');
		}
	}

	check(callback) {
		this.preValue = this.input.checked = true;
		this.change(false, null, callback);
		if (this.onChange) {
			this.onChange();
		}
	}

	uncheck(callback) {
		this.preValue = this.input.checked = false;
		this.change(false, null, callback);
		if (this.onChange) {
			this.onChange();
		}
	}

	toggle(callback) {
		this.change(true, null, callback);
		if (this.onChange) {
			this.onChange();
		}
	}
}

export { Checkbox };

