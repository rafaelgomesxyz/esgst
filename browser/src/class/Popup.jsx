import { ButtonSet } from './ButtonSet';
import { Shared } from './Shared';
import { Settings } from './Settings';
import { DOM } from './DOM';

class Popup {
	constructor(details) {
		this.custom = {};
		this.results = undefined;
		this.Options = undefined;
		this.Results = undefined;
		this.textArea = undefined;
		this.temp = details.isTemp;
		this.layer = DOM.build(document.body, 'beforeEnd', [
			['div', { class: 'esgst-hidden esgst-popup-layer' }, [
				...(details.popup ? [
					details.popup
				] : [
					['div', { class: 'esgst-popup' }, [
						['div', { class: 'esgst-popup-heading' }, [
							['i', { class: `fa ${details.icon} esgst-popup-icon${details.icon ? '' : ' esgst-hidden'}` }],
							['div', { class: `esgst-popup-title${details.title ? '' : ' esgst-hidden'}` }, details.title]
						]],
						['div', { class: 'esgst-popup-description' }],
						['div', { class: `esgst-popup-scrollable ${details.addScrollable === 'left' ? 'esgst-text-left' : ''}` }, details.scrollableContent],
						['div', { class: 'esgst-popup-actions' }, [
							['a', { class: 'esgst-hidden', href: Shared.esgst.settingsUrl }, 'Settings'],
							['a', { class: 'esgst-popup-close' }, 'Close']
						]]
					]]
				]),
				['div', { class: 'esgst-popup-modal', title: 'Click to close the modal' }]
			]]
		]);
		this.onCloseByUser = details.onCloseByUser;
		this.onClose = details.onClose;
		this.popup = this.layer.firstElementChild;
		this.modal = this.layer.lastElementChild;
		if (details.popup) {
			this.popup.classList.add('esgst-popup');
			this.popup.style.display = 'block';
			this.popup.style.maxHeight = `calc(100% - 150px)`;
			this.popup.style.maxWidth = `calc(100% - 150px)`;
		} else {
			this.popup.style.maxHeight = `calc(100% - 50px)`;
			this.popup.style.maxWidth = `calc(100% - 50px)`;
			this.icon = this.popup.firstElementChild.firstElementChild;
			this.title = this.icon.nextElementSibling;
			this.description = this.popup.firstElementChild.nextElementSibling;
			this.scrollable = this.description.nextElementSibling;
			this.actions = this.scrollable.nextElementSibling;
			let settings = this.actions.firstElementChild;
			if (!details.settings) {
				settings.classList.remove('esgst-hidden');
				settings.addEventListener('click', event => {
					if (!Settings.get('openSettingsInTab')) {
						event.preventDefault();
						Shared.esgst.modules.settingsModule.loadMenu(true);
					}
				});
			}
		}
		let closeButton = this.popup.querySelector(`.esgst-popup-close, .b-close`);
		if (closeButton) {
			closeButton.addEventListener('click', () => this.close(true));
		}
		this.modal.addEventListener('click', () => this.close(true));
		if (details.textInputs) {
			this.textInputs = [];
			details.textInputs.forEach(textInput => {
				let input = DOM.insert(this.description, 'beforeEnd', (
					<>
						{textInput.title || null}
						<input placeholder={textInput.placeholder || ''} type="text"/>
					</>
				));
				input.addEventListener('keydown', this.triggerButton.bind(this, 0));
				this.textInputs.push(input);
			});
		}
		if (details.options) {
			this.description.appendChild(Shared.common.createOptions(details.options));
			let inputs = this.description.lastElementChild.getElementsByTagName('input');
			for (let input of inputs) {
				switch (input.getAttribute('type')) {
					case 'number':
						Shared.common.observeNumChange(input, input.getAttribute('name'), true);
						break;
					case 'text':
						Shared.common.observeChange(input, input.getAttribute('name'), true);
						break;
					default:
						break;
				}
			}
		}
		if (details.buttons) {
			this.buttons = [];
			details.buttons.forEach(button => {
				let set = new ButtonSet(button);
				this.buttons.push(set);
				this.description.appendChild(set.set);
			});
		}
		if (details.addProgress) {
			this.progress = DOM.insert(this.description, 'beforeEnd', <div/>);
			this.overallProgress = DOM.insert(this.description, 'beforeEnd', <div/>);
		}
		this.id = Shared.common.addScope(details.name, this.popup);
	}

	open(callback) {
		Shared.common.setCurrentScope(this.id);
		this.isOpen = true;
		let n = 9999 + document.querySelectorAll(`.esgst-popup-layer:not(.esgst-hidden), .esgst-popout:not(.esgst-hidden)`).length;
		if (Shared.esgst.openPopups > 0) {
			const highestN = parseInt(Shared.esgst.popups[Shared.esgst.openPopups - 1].popup.style.zIndex || 0);
			if (n <= highestN) {
				n = highestN + 1;
			}
		}
		Shared.esgst.openPopups += 1;
		Shared.esgst.popups.push(this);
		this.layer.classList.remove('esgst-hidden');
		this.layer.style.zIndex = n;
		if (this.textInputs) {
			this.textInputs[0].focus();
		}
		if (callback) {
			callback();
		}
	}

	close(byUser) {
		Shared.common.resetCurrentScope();
		if (this.temp) {
			Shared.common.removeScope(this.id);
			this.layer.remove();
		} else {
			this.layer.classList.add('esgst-hidden');
			if (Settings.get('minimizePanel')) {
				Shared.common.minimizePanel_addItem(this);
			}
		}
		if (byUser && this.onCloseByUser) {
			this.onCloseByUser();
		}
		if (this.onClose) {
			this.onClose();
		}
		Shared.esgst.openPopups -= 1;
		Shared.esgst.popups.pop();
		this.isOpen = false;
	}

	getTextInputValue(index) {
		return this.textInputs[index].value;
	}

	triggerButton(index, event) {
		if (event && (event.key !== 'Enter' || this.buttons[index].busy)) return;
		this.buttons[index].trigger();
	}

	isButtonBusy(index) {
		return (!this.buttons[index] || this.buttons[index].busy);
	}

	removeButton(index) {
		let button = this.buttons.splice(index, 1)[0];
		button.set.remove();
	}

	setScrollable(fragments) {
		DOM.insert(this.scrollable, 'beforeEnd', (
			<div>{fragments}</div>
		));
	}

	getScrollable(html) {
		return DOM.build(this.scrollable, 'beforeEnd', [
			['div', html]
		]);
	}

	setError(message) {
		DOM.insert(this.progress, 'inner', (
			<>
				<i class="fa fa-times-circle"></i>
				<span>{message}</span>
			</>
		));
	}

	setProgress(message) {
		if (this.progressMessage) {
			this.progressMessage.textContent = message;
		} else {
			DOM.insert(this.progress, 'inner', (
				<>
					<i class="fa fa-circle-o-notch fa-spin"></i>
					<span>{message}</span>
				</>
			));
			this.progressMessage = this.progress.lastElementChild;
		}
	}

	clearProgress() {
		this.progress.innerHTML = '';
		this.progressMessage = null;
	}

	setOverallProgress(message) {
		this.overallProgress.textContent = message;
	}

	clear() {
		this.progress.innerHTML = '';
		this.progressMessage = null;
		this.overallProgress.textContent = '';
		this.scrollable.innerHTML = '';
	}

	setIcon(icon) {
		this.icon.className = `fa ${icon}`;
	}

	setTitle(title) {
		this.title.textContent = title;
	}

	/**
	 *
	 * @param [temp]
	 */
	setDone(temp) {
		this.temp = temp;
		if (Settings.get('minimizePanel') && !this.isOpen) {
			Shared.common.minimizePanel_alert(this);
		}
	}

	reposition() {}
}

export { Popup };

