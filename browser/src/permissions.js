import { browser } from './browser';

browser.runtime.sendMessage({
  action: 'permissions_request_firefox'
}).then(permissions => {
  permissions = JSON.parse(permissions);
  const button = document.createElement('button');
  document.body.appendChild(button);
  button.textContent = 'Proceed';
  button.addEventListener('click', () => {
    browser.permissions.request(permissions).then(granted => {
      browser.runtime.sendMessage({
        action: 'permissions_request_firefox_resolve',
        granted
      }).then(() => {});
    });
  });
});