import { FetchRequest } from './FetchRequest';
import { permissions } from './Permissions';
import { Popup } from './Popup';
import { Settings } from './Settings';
import { Shared } from './Shared';

class _MessageNotifier {
	async notify(notifiedMessages) {
		const hasPermission = await permissions.contains([['github']]);
		if (!hasPermission) {
			return;
		}
		const now = Date.now();
		if (now - notifiedMessages.lastCheck <= 86400000) {
			// It's been less than 24 hours since the last check.
			return;
		}
		try {
			const messages = (
				await FetchRequest.get(
					'https://raw.githubusercontent.com/rafaelgssa/esgst/main/messages.json'
				)
			).json;
			// Only get messages from the last 30 days.
			const recentMessages = messages.filter((message) => now - message.timestamp <= 2592000000);
			const unnotifiedMessages = recentMessages.filter(
				(message) => !notifiedMessages.ids.includes(message.id)
			);
			const messagesToShow = unnotifiedMessages.filter(
				(message) => !message.dependency || Settings.get(dependency)
			);
			for (const message of messagesToShow) {
				new Popup({
					icon: 'fa-warning',
					title: (
						<div className="markdown">
							{await Shared.common.parseMarkdown(null, message.message)}
						</div>
					),
				}).open();
				notifiedMessages.ids.push(message.id);
			}
			notifiedMessages.lastCheck = now;
			await Shared.common.setValue('notifiedMessages', JSON.stringify(notifiedMessages));
		} catch (err) {}
	}
}

const MessageNotifier = new _MessageNotifier();

export { MessageNotifier };
