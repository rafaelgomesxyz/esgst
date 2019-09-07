import { gSettings } from './Globals';
import { Popup } from './Popup';
import { shared } from './Shared';

const INFO = 'info';
const WARNING = 'warning';
const ERROR = 'error';
const PRIORITY = [ERROR, WARNING, INFO];

class Logger {
  constructor() {
    this.logs = [];
    this.button = null;
    this.currentMaxLevel = INFO;
  }

  info() {
    const message = this.getMessage(arguments);
    window.console.info(message);
    this.logs.push({ level: INFO, message });
    if (gSettings.notifyLogs) {
      this.addButton(INFO);
    }
  }

  warning() {
    const message = this.getMessage(arguments);
    window.console.warn(message);
    this.logs.push({ level: WARNING, message });
    if (gSettings.notifyLogs) {
      this.addButton(WARNING);
    }
  }

  error() {
    const message = this.getMessage(arguments);
    window.console.error(message);
    this.logs.push({ level: ERROR, message });
    if (gSettings.notifyLogs) {
      this.addButton(ERROR);
    }
  }

  getMessage(args) {
    return `[ESGST] ${Array.from(args).map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(` `)}`;
  }

  addButton(level) {
    if (this.button) {
      if (PRIORITY.indexOf(level) < PRIORITY.indexOf(this.currentMaxLevel)) {
        this.button.button.classList.remove(`esgst-logs-${this.currentMaxLevel}`);
        this.button.button.classList.add(`esgst-logs-${level}`);
        this.currentMaxLevel = level;
      }
      return;
    }

    this.button = shared.common.addHeaderButton(`fa-bug`, 'active', shared.common.getFeatureTooltip('notifyLogs', `View logs`));
    this.button.button.classList.add(`esgst-logs`, `esgst-logs-${level}`);
    this.button.button.addEventListener('click', this.showPopup.bind(this));
    this.currentMaxLevel = level;
  }

  showPopup() {
    const popup = new Popup({
      addScrollable: 'left',
      icon: `fa-bug`,
      isTemp: true,
      title: 'Logs'
    });
    shared.common.createElements_v2(popup.scrollable, 'beforeEnd', [
      ['div', { class: 'popup__keys__list' }, this.logs.map(x => ['div', { class: `esgst-log esgst-log-${x.level}` }, x.message])]
    ]);
    popup.open();
  }
}

const logger = new Logger();

export { logger };