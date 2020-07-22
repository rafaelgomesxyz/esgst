import { Popup } from './Popup';
import { Shared } from './Shared';
import { Settings } from './Settings';
import { FetchRequest } from './FetchRequest';
import { permissions } from './Permissions';
import { DOM } from './DOM';

class _MessageNotifier {
	async notify(notifiedMessages) {
		const hasPermission = await permissions.contains([['gitlab']]);
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
					'https://gitlab.com/api/v4/projects/rafaelgssa%2Fesgst/repository/files/messages.json/raw?ref=main'
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
