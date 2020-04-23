const fs = require('fs');
const path = require('path');

const Connection = require('../class/Connection');
const Request = require('../class/Request');
const Utils = require('../class/Utils');

const jobJson = require('./uh.json');

let connection = null;

doUhCronJob();

async function doUhCronJob() {
	try {
		await updateUh();
	} catch (err) {
		console.log(`UH histories update failed: ${err}`);
		if (connection && connection.inTransaction) {
			await connection.rollback();
		}
	}
}

async function updateUh() {
	const now = Math.trunc(Date.now() / 1e3);
	let index = jobJson.index;
	let ended = false;
	if (index == 0) {
		console.log('Initializing...');
	}
	do {
		connection = new Connection();
		await connection.connect();
		const rows = await connection.query(`
			SELECT steam_id, usernames, last_check, last_update
			FROM users__uh
			LIMIT ${index}, 100
		`);
		await connection.disconnect();
		ended = rows.length === 0;
		if (!ended) {
			const uh = [];
			console.log(`Updating UH histories (index ${index}...)`);
			for (const row of rows) {
				const steamId = row.steam_id;
				const usernames = row.usernames.split(', ');
				const lastCheck = parseInt(row.last_check);
				const differenceInSeconds = now - lastCheck;
				if (differenceInSeconds >= 60 * 60 * 24 * 7) {
					await Utils.timeout(1);
					const url = `https://www.steamgifts.com/go/user/${steamId}`;
					const response = await Request.head(url);
					const parts = response.url.split('/user/');
					const username = parts && parts.length === 2 ? parts[1] : '[DELETED]';
					const values = {
						steam_id: steamId,
						usernames: row.usernames,
						last_check: now,
						last_update: row.last_update,
					};
					if (usernames[0] !== username) {
						usernames.unshift(username);
						values.usernames = usernames.join(', ');
						values.last_update = now;
					}
					uh.push(values);
				}
			}
			if (uh.length > 0) {
				connection = new Connection();
				await connection.connect();
				await connection.beginTransaction();
				await connection.query(`
					INSERT INTO users__uh (steam_id, usernames, last_check, last_update)
					VALUES ${uh.map(values => `(${connection.escape(values.steam_id)}, ${connection.escape(values.usernames)}, ${connection.escape(values.last_check)}, ${connection.escape(values.last_update)})`).join(', ')}
					ON DUPLICATE KEY UPDATE usernames = VALUES(usernames), last_check = VALUES(last_check), last_update = VALUES(last_update)
				`);
				await connection.commit();
				await connection.disconnect();
			}
		}
		index += 100;
		fs.writeFileSync(path.resolve('./uh.json'), JSON.stringify({ index }));
	} while (!ended);
	fs.writeFileSync(path.resolve('./uh.json'), JSON.stringify({ index: 0 }));
	console.log('Done!');
}