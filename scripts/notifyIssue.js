const { getArguments } = require('./common');
const fetch = require('node-fetch');

const args = getArguments(process);

const payloadJson = require(args.payloadPath);

notify();

async function notify() {
	switch (payloadJson.action) {
		case 'opened':
		case 'created': {
			const issueNumber = payloadJson.issue.number;

			const payload = payloadJson.comment || payloadJson.issue;

			if (payload.user.login !== 'rafaelgssa') {
				console.log('Not triggered by repo owner.');

				break;
			}

			const permalinkMatch = payload.body.match(
				/(https:\/\/www\.steamgifts\.com\/go\/comment\/([A-Za-z0-9]+))/
			);

			if (!permalinkMatch) {
				console.log('Permalink not found.');

				break;
			}

			const permalink = permalinkMatch[1];
			const id = permalinkMatch[2];

			const permalinkResponse = await fetch(permalink, {
				headers: {
					Cookie: `PHPSESSID=${args.steamgiftsToken}`,
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:71.0) Gecko/20100101 Firefox/71.0',
				},
			});
			const permalinkText = await permalinkResponse.text();

			const url = permalinkResponse.url;
			const xsrfTokenMatch = permalinkText.match(/xsrf_token=([A-Za-z0-9]+)/);

			if (!xsrfTokenMatch) {
				console.log('XSRF token not found.');

				break;
			}

			const xsrfToken = xsrfTokenMatch[1];

			const commentIdMatch = permalinkText.match(
				new RegExp(`data-comment-id="([A-Za-z0-9]+?)"(?:(?!data-comment-id)[\\S\\s])*?id="${id}"`)
			);

			if (!commentIdMatch) {
				console.log('Comment ID not found.');

				break;
			}

			const commentId = commentIdMatch[1];

			console.log(permalink, commentId, issueNumber);

			const message = `Beep bop! ESGST bot here to let you know that your report / suggestion is being looked into. For reference, visit the GitLab issue: [#${issueNumber}](https://gitlab.com/rafaelgssa/esgst/-/issues/${issueNumber})`;

			await fetch(url, {
				body: `xsrf_token=${xsrfToken}&do=comment_new&parent_id=${commentId}&description=${encodeURIComponent(
					message
				)}`,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Cookie: `PHPSESSID=${args.steamgiftsToken}`,
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:71.0) Gecko/20100101 Firefox/71.0',
				},
				method: 'POST',
			});

			break;
		}

		case 'closed': {
			const issueNumber = payloadJson.issue.number;

			const payload = payloadJson.comment || payloadJson.issue;

			if (payload.user.login !== 'rafaelgssa') {
				console.log('Not triggered by repo owner.');

				break;
			}

			const permalinkMatch = payload.body.match(
				/(https:\/\/www\.steamgifts\.com\/go\/comment\/([A-Za-z0-9]+))/
			);

			if (!permalinkMatch) {
				console.log('Permalink not found.');

				break;
			}

			const permalink = permalinkMatch[1];
			const id = permalinkMatch[2];

			const permalinkResponse = await fetch(permalink, {
				headers: {
					Cookie: `PHPSESSID=${args.steamgiftsToken}`,
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:71.0) Gecko/20100101 Firefox/71.0',
				},
			});
			const permalinkText = await permalinkResponse.text();

			const url = permalinkResponse.url;
			const xsrfTokenMatch = permalinkText.match(/xsrf_token=([A-Za-z0-9]+)/);

			if (!xsrfTokenMatch) {
				console.log('XSRF token not found.');

				break;
			}

			const xsrfToken = xsrfTokenMatch[1];

			const commentIdMatch = permalinkText.match(
				new RegExp(`data-comment-id="([A-Za-z0-9]+?)"(?:(?!data-comment-id)[\\S\\s])*?id="${id}"`)
			);

			if (!commentIdMatch) {
				console.log('Comment ID not found.');

				break;
			}

			const commentId = commentIdMatch[1];

			console.log(permalink, commentId, issueNumber);

			const message = `Beep bop! ESGST bot here to let you know that a new version is being deployed which should fix your issue. If you're on Chrome, it may take a while until the update is available. For reference, visit the GitLab issue: [#${issueNumber}](https://gitlab.com/rafaelgssa/esgst/-/issues/${issueNumber})`;

			await fetch(url, {
				body: `xsrf_token=${xsrfToken}&do=comment_new&parent_id=${commentId}&description=${encodeURIComponent(
					message
				)}`,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Cookie: `PHPSESSID=${args.steamgiftsToken}`,
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:71.0) Gecko/20100101 Firefox/71.0',
				},
				method: 'POST',
			});

			break;
		}
	}
}
