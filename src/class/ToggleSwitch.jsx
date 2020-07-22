import { Shared } from './Shared';
import { Settings } from './Settings';
import { DOM } from './DOM';

class ToggleSwitch {
	/**
	 * @param context
	 * @param id
	 * @param inline
	 * @param name
	 * @param sg
	 * @param st
	 * @param tooltip
	 * @param value
	 * @property {HTMLElement} input
	 */
	constructor(context, id, inline, name, sg, st, tooltip, value) {
		this.onChange = undefined;
		this.onEnabled = null;
		this.onDisabled = null;
		this.dependencies = [];
		this.exclusions = [];
		this.id = id;
		this.sg = sg;
		this.st = st;
		this.value = value;
		DOM.insert(
			context,
			'beforeend',
			<div
				className={`esgst-toggle-switch-container ${inline ? 'inline' : ''}`}
				ref={(ref) => (this.container = ref)}
			>
				<label className="esgst-toggle-switch">
					<input type="checkbox" />
					<div className="esgst-toggle-switch-slider"></div>
				</label>
				<span>{name}</span>
				{tooltip ? <i className="fa fa-question-circle" title={tooltip}></i> : null}
			</div>
		);
		if (!context) {
			this.container = this.container.firstElementChild;
		}
		this.switch = this.container.firstElementChild;
		this.input = /** @type {HTMLElement} */ this.switch.firstElementChild;
		this.name = this.switch.nextElementSibling;
		this.input.checked = this.value;
		this.input.addEventListener('change', () => this.change());
	}

	async change(settings) {
		let setting;
		this.value = this.input.checked;
		if (this.id) {
			let key = this.id;
			if (this.sg) {
				key += '_sg';
			} else if (this.st) {
				key += '_st';
			}
			setting = Settings.get(key);
			if (typeof setting === 'undefined' || !setting.include) {
				setting = this.value;
			} else {
				setting.enabled = this.value ? 1 : 0;
			}
			if (!settings) {
				let message;
				DOM.insert(
					this.container,
					'beforeend',
					<div className="esgst-description esgst-bold" ref={(ref) => (message = ref)}>
						<i className="fa fa-circle-o-notch fa-spin" title="Saving..."></i>
					</div>
				);
				await Shared.common.setSetting(key, setting);
				message.classList.add('esgst-green');
				DOM.insert(message, 'atinner', <i className="fa fa-check" title="Saved!"></i>);
				window.setTimeout(() => message.remove(), 2500);
			}
		}
		if (this.value) {
			this.dependencies.forEach((dependency) => dependency.classList.remove('esgst-hidden'));
			this.exclusions.forEach((exclusion) => exclusion.classList.add('esgst-hidden'));
			if (!settings && this.onEnabled) {
				this.onEnabled();
			}
		} else {
			this.dependencies.forEach((dependency) => dependency.classList.add('esgst-hidden'));
			this.exclusions.forEach((exclusion) => exclusion.classList.remove('esgst-hidden'));
			if (!settings && this.onDisabled) {
				this.onDisabled();
			}
		}
		if (settings) {
			return setting;
		}
		if (this.onChange) {
			this.onChange(this.value);
		}
	}

	enable(settings) {
		this.input.checked = true;
		// noinspection JSIgnoredPromiseFromCall
		return this.change(settings);
	}

	disable(settings) {
		this.input.checked = false;
		// noinspection JSIgnoredPromiseFromCall
		return this.change(settings);
	}

	toggle(settings) {
		this.input.checked = !this.input.checked;
		// noinspection JSIgnoredPromiseFromCall
		return this.change(settings);
	}
}

export { ToggleSwitch };
