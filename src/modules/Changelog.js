import { Popup } from '../class/Popup';
import { shared } from '../class/Shared';

async function loadChangelog(version) {
  const changelog = JSON.parse((await shared.common.request({
    method: `GET`,
    url: `https://raw.githubusercontent.com/gsrafael01/ESGST/master/changelog.json`
  })).responseText);
  let index;
  if (version) {
    let i, n;
    for (i = 0, n = changelog.length; i < n && changelog[i].version !== version; i++) {
    }
    if (i < n) {
      index = i;
    } else {
      index = -1;
    }
  } else {
    index = changelog.length - 1;
  }
  const html = [];
  while (index > -1) {
    const items = [];
    for (const key in changelog[index].changelog) {
      if (changelog[index].changelog.hasOwnProperty(key)) {
        const item = {
          type: `li`,
          children: []
        };
        if (key === `0`) {
          item.children.push({
            text: changelog[index].changelog[key],
            type: `node`
          });
        } else {
          item.children.push({
            attributes: {
              href: `https://github.com/gsrafael01/ESGST/issues/${key}`
            },
            text: `#${key}`,
            type: `a`
          }, {
              text: ` ${changelog[index].changelog[key]}`,
              type: `node`
            });
        }
        items.push(item);
      }
    }
    html.unshift({
      attributes: {
        class: `esgst-bold`
      },
      text: `v${changelog[index].version} (${changelog[index].date})`,
      type: `p`
    }, {
        type: `ul`,
        children: items
      });
    index -= 1;
  }
  if (!html.length) {
    return;
  }
  const popup = new Popup({ addScrollable: true, icon: `fa-file-text-o`, isTemp: true, title: `Changelog` });
  shared.common.createElements(popup.scrollable, `afterBegin`, [{
    attributes: {
      class: `esgst-text-left markdown`
    },
    type: `div`,
    children: html
  }]);
  popup.open();
}

export { loadChangelog };

