import { Button } from '../components/Button';
import { PageHeading } from '../components/PageHeading';
import { Utils } from '../lib/jsUtils';
import { DOM } from './DOM';
import { FetchRequest } from './FetchRequest';
import { Popup } from './Popup';
import { Settings } from './Settings';
import { Shared } from './Shared';

export interface SettingsAnalyticsValues {
	enabled: boolean;
	uuid: string;
	lastSubmission: number;
}

class _SettingsAnalytics {
	check = () => {
		const analytics = JSON.parse(
			Shared.common.getValue('settingsAnalytics', '{"enabled":true}')
		) as SettingsAnalyticsValues;
		if (
			!analytics.enabled ||
			(analytics.lastSubmission && Date.now() - analytics.lastSubmission <= 2592000000)
		) {
			return;
		}
		if (analytics.uuid) {
			void this.send(analytics);
		} else {
			const popup = new Popup({ isTemp: true });
			PageHeading.create('sm', {
				breadcrumbs: ['Settings Analytics'],
			}).insert(popup.description, 'beforeend');
			const scrollableArea = popup.getScrollable();
			scrollableArea.classList.add('markdown');
			DOM.insert(
				scrollableArea,
				'atinner',
				<fragment>
					<h3>
						Hi there! ESGST would like to collect information about which features you have enabled,
						in order to recommend features to new users and identify which features should be
						prioritized when it comes to improvements. Are you ok with that?
					</h3>
					<p>
						This process is completely anonymous. A random UUID will be generated for you and stored
						on your storage. This UUID will be used to update your data in the server. If you choose
						"Yes", this will be done automatically every 30 days. If you choose "No", you will never
						be asked again.
					</p>
				</fragment>
			);
			const [buttonGroup] = DOM.insert(
				scrollableArea,
				'beforeend',
				<div className="esgst-button-group"></div>
			);
			Button.create({
				template: 'success',
				name: 'Yes',
				onClick: async () => {
					DOM.insert(
						scrollableArea,
						'atinner',
						<fragment>
							<h3>Perfect! Please wait a while until your data is submitted...</h3>
						</fragment>
					);
					analytics.uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
						/[xy]/g,
						Utils.createUuid
					);
					await this.send(analytics);
					popup.close();
				},
			}).insert(buttonGroup, 'beforeend');
			Button.create({
				template: 'error',
				name: 'No',
				onClick: async () => {
					analytics.enabled = false;
					await Shared.common.setValue('settingsAnalytics', JSON.stringify(analytics));
					popup.close();
				},
			}).insert(buttonGroup, 'beforeend');
			popup.open();
		}
	};

	send = async (analytics: SettingsAnalyticsValues): Promise<void> => {
		const settingsKeys = [];
		for (const id of Object.keys(Shared.esgst.featuresById)) {
			if (Settings.get(`${id}_sg`)) {
				settingsKeys.push(`${id}_sg`);
			}
			if (Settings.get(`${id}_st`)) {
				settingsKeys.push(`${id}_st`);
			}
		}
		await FetchRequest.post('https://rafaelgssa.com/esgst/settings/stats', {
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.stringify({
				uuid: analytics.uuid,
				settingsKeys,
			}),
		});
		analytics.lastSubmission = Date.now();
		await Shared.common.setValue('settingsAnalytics', JSON.stringify(analytics));
	};
}

export const SettingsAnalytics = new _SettingsAnalytics();
