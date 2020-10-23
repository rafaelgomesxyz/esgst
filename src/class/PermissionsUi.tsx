import { browser } from '../browser';
import { PageHeading } from '../components/PageHeading';
import { DOM } from './DOM';
import { permissions } from './Permissions';
import { Popup } from './Popup';

class _PermissionsUi {
	check = async (keys: string[]): Promise<boolean> => {
		if (!browser.runtime.getURL) {
			return true;
		}
		if (await permissions.contains([keys])) {
			return true;
		}
		return new Promise((resolve) => {
			const popup = new Popup({ isTemp: true });
			PageHeading.create('sm', {
				breadcrumbs: ['Required Permissions'],
			}).insert(popup.description, 'beforeend');
			const scrollableArea = popup.getScrollable();
			scrollableArea.classList.add('markdown');
			DOM.insert(
				scrollableArea,
				'atinner',
				<fragment>
					<h3>
						In order to perform this action, you need to grant some permissions to the extension. Go{' '}
						<a
							href={`${browser.runtime.getURL('permissions.html')}?keys=${keys.join(',')}`}
							target="_blank"
						>
							here
						</a>{' '}
						and click the "Grant" button to grant them.
					</h3>
					<p>When you are done, close this popup to continue.</p>
				</fragment>
			);
			popup.onClose = async () => resolve(await permissions.contains([keys]));
			popup.open();
		});
	};
}

export const PermissionsUi = new _PermissionsUi();
