import { DOM } from './class/DOM';
import { permissions } from './class/Permissions';
import { Utils } from './lib/jsUtils';

const grantedPermissions = new Set();
const deniedPermissions = new Set();
let messageNode: HTMLElement | undefined;

const loadPermissions = async (): Promise<void> => {
	const params = Utils.getQueryParams();
	const rows = [];
	const keys = params.keys ? params.keys.split(',') : Object.keys(permissions.permissions);
	for (const key of keys) {
		const permission = permissions.permissions[key];
		if (!permission) {
			continue;
		}
		const permissionCell = permission.values.map((value) => [value, <br />]).flat();
		const usageCell = Object.values(permission.messages)
			.map((value) => [value, <br />, <br />])
			.flat();
		let checkboxNode: HTMLInputElement | undefined;
		rows.push(
			<tr>
				{params.keys ? null : (
					<td>
						<input type="checkbox" ref={(ref) => (checkboxNode = ref)} />
					</td>
				)}
				<td>{permissionCell}</td>
				<td>{usageCell}</td>
			</tr>
		);
		if (!checkboxNode) {
			continue;
		}
		checkboxNode.checked = await permissions.contains([[key]]);
		checkboxNode.addEventListener('change', () => {
			if (checkboxNode?.checked) {
				grantedPermissions.add(key);
				deniedPermissions.delete(key);
			} else {
				grantedPermissions.delete(key);
				deniedPermissions.add(key);
			}
		});
	}
	DOM.insert(
		document.body,
		'beforeend',
		<fragment>
			<table>
				<tr>
					{params.keys ? null : <th>Granted</th>}
					<th>Permission</th>
					<th>Usage</th>
				</tr>
				{rows}
			</table>
			<button type="button" onclick={savePermissions}>
				{params.keys ? 'Grant' : 'Save'}
			</button>
			<div ref={(ref) => (messageNode = ref)}></div>
		</fragment>
	);
};

const savePermissions = () => {
	permissions.request(Array.from(grantedPermissions), (granted: boolean) => {
		permissions.remove(Array.from(deniedPermissions), (denied: boolean) => {
			if (!messageNode) {
				return;
			}
			if (granted && denied) {
				messageNode.textContent = 'Permissions saved!';
			} else {
				messageNode.textContent = 'Error saving permissions!';
			}
			window.setTimeout(() => {
				if (messageNode) {
					messageNode.textContent = '';
				}
			}, 2000);
		});
	});
};

loadPermissions();
