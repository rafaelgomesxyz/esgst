import { permissions } from './class/Permissions';

const grantedPermissions = new Set();
const deniedPermissions = new Set();

const table = document.querySelector('#permissions');
const saveButton = document.querySelector('#save');

saveButton.addEventListener('click', savePermissions);
loadPermissions();

async function loadPermissions() {
	for (const key of Object.keys(permissions.permissions)) {
		const permission = permissions.permissions[key];

		const permissionArray = [];
		for (const value of permission.values) {
			permissionArray.push(value.replace(/</g, '&lt;').replace(/>/g, '&gt;'), '<br/>');
		}

		const usageArray = [];
		for (const messageKey of Object.keys(permission.messages)) {
			usageArray.push(permission.messages[messageKey], '<br/>', '<br/>');
		}

		table.insertAdjacentHTML('beforeend', `
			<tr>
				<td>
					<input name="${key}" type="checkbox"/>
				</td>
				<td>${permissionArray.join('')}</td>
				<td>${usageArray.join('')}</td>
			</tr>
		`);

		const checkbox = table.querySelector(`[name="${key}"]`);
		checkbox.checked = await permissions.contains([[key]]);
		checkbox.addEventListener('change', () => {
			if (checkbox.checked) {
				grantedPermissions.add(key);
				deniedPermissions.delete(key);
			} else {
				grantedPermissions.delete(key);
				deniedPermissions.add(key);
			}
		});
	}
}

function savePermissions() {
	permissions.request(Array.from(grantedPermissions), granted => {
		permissions.remove(Array.from(deniedPermissions), denied => {
			if (granted && denied) {			
				window.alert('Permissions saved!');
			} else {
				window.alert('Error saving permissions!');
			}
		});
	});
}