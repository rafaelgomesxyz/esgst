import { Button } from '../components/Button';
import { NotificationBar } from '../components/NotificationBar';
import { DOM } from './DOM';
import { Scope } from './Scope';
import { Settings } from './Settings';
import { Shared } from './Shared';

/**
 * @typedef {Object} PopupOptions
 * @property {string} icon
 * @property {string} title
 * @property {import('../components/Button').ButtonOptions[]} buttons
 * @property {boolean} isTemp
 */

class Popup {
	/**
	 * @param {Partial<PopupOptions>} [details]
	 */
	constructor(details = {}) {
		this.custom = {};
		this.results = undefined;
		this.Options = undefined;
		this.Results = undefined;
		this.textArea = undefined;
		this.temp = details.isTemp;
		DOM.insert(
			document.body,
			'beforeend',
			<div className="esgst-hidden esgst-popup-layer" ref={(ref) => (this.layer = ref)}>
				{details.popup || (
					<div className="esgst-popup">
						<div
							className={`esgst-popup-heading ${
								!details.icon && !details.title ? 'esgst-hidden' : ''
							}`}
						>
							<i
								className={`fa ${details.icon} esgst-popup-icon${
									details.icon ? '' : ' esgst-hidden'
								}`}
							></i>
							<div className={`esgst-popup-title${details.title ? '' : ' esgst-hidden'}`}>
								{details.title}
							</div>
						</div>
						<div className="esgst-popup-description"></div>
						<div
							className={`esgst-popup-scrollable ${
								details.addScrollable === 'left' ? 'esgst-text-left' : ''
							}`}
						>
							{details.scrollableContent}
						</div>
						<div className="esgst-popup-actions">
							<a className="esgst-hidden" href={Shared.esgst.settingsUrl}>
								Settings
							</a>
							<a className="esgst-popup-close">Close</a>
						</div>
					</div>
				)}
				<div className="esgst-popup-modal" title="Click to close the modal"></div>
			</div>
		);
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
				settings.addEventListener('click', (event) => {
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
			details.textInputs.forEach((textInput) => {
				let input;
				DOM.insert(
					this.description,
					'beforeend',
					<fragment>
						{textInput.title || null}
						<input
							placeholder={textInput.placeholder || ''}
							ref={(ref) => (input = ref)}
							type="text"
						/>
					</fragment>
				);
				input.addEventListener('keydown', (event) => {
					if (event.key !== 'Enter' || this.buttons[0]?.isBusy) return;
					this.buttons[0].onClick();
				});
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
			details.buttons.forEach((buttonOptions) => {
				const button = Button.create(buttonOptions).insert(this.description, 'beforeend');
				this.buttons.push(button);
			});
		}
		if (details.addProgress) {
			this.progressBar = NotificationBar.create().insert(this.description, 'beforeend').hide();
			this.overallProgressBar = NotificationBar.create()
				.insert(this.description, 'beforeend')
				.hide();
		}
		this.id = Scope.create(null, this.popup).id;
	}

	open(callback) {
		Scope.setCurrent(this.id);
		this.isOpen = true;
		let n =
			999 +
			document.querySelectorAll(
				`.esgst-popup-layer:not(.esgst-hidden), .esgst-popout:not(.esgst-hidden)`
			).length;
		if (Shared.esgst.openPopups > 0) {
			const highestN = parseInt(
				Shared.esgst.popups[Shared.esgst.openPopups - 1].popup.style.zIndex || 0
			);
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
		Scope.resetCurrent();
		if (this.temp) {
			Scope.remove(this.id);
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

	setScrollable(jsx) {
		DOM.insert(this.scrollable, 'beforeend', <div>{jsx}</div>);
	}

	/**
	 * @param {*} [jsx]
	 * @returns {HTMLElement}
	 */
	getScrollable(jsx) {
		let scrollableEl;
		DOM.insert(this.scrollable, 'beforeend', <div ref={(ref) => (scrollableEl = ref)}>{jsx}</div>);
		return scrollableEl;
	}

	clear() {
		this.progressBar.reset().hide();
		this.overallProgressBar.reset().hide();
		this.scrollable.innerHTML = '';
	}

	setIcon(icon) {
		this.icon.className = `fa ${icon}`;
	}

	setTitle(title) {
		DOM.insert(
			this.title,
			'atinner',
			typeof title === 'string' ? <fragment>{title}</fragment> : title
		);
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
