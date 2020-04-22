const Connection = require('../class/Connection');
const CustomError = require('../class/CustomError');
const Request = require('../class/Request');
const Game = require('../routes/games/Game');
const secrets = require('../config').secrets;

doRcvSgToolsCronJob();

async function doRcvSgToolsCronJob() {
	const connection = new Connection();
	await connection.connect();
	try {
		await updateRcvSgTools(connection);
	} catch (err) {
		console.log(`RCV games update from SGTools failed: ${err}`);
		if (connection.inTransaction) {
			await connection.rollback();
		}
	}
	await connection.disconnect();
}

/**
 * @param {Connection} connection
 */
async function updateRcvSgTools(connection) {
	console.log(`Updating RCV games from SGTools...`);
	const url = `http://www.sgtools.info/api/lastBundled?apiKey=${secrets.sgToolsApiKey}`;
	const response = await Request.get(url);
	if (!response.json) {
		throw new CustomError(CustomError.COMMON_MESSAGES.sg, 500);
	}
	const names = {
		app: [],
		sub: [],
	};
	const rcv = {
		app: [],
		sub: [],
	};
	const games = response.json[0];
	for (const game of games) {
		const type = game.type;
		const id = game.app_id;
		const name = game.name;
		const effectiveDate = Math.trunc((new Date(`${game.bundled_date.replace(/\//g, '-').replace(/\s/, 'T')}.000Z`)).getTime() / 1e3);
		const addedDate = Math.trunc((new Date(`${game.creation_date.replace(/\//g, '-').replace(/\s/, 'T')}.000Z`)).getTime() / 1e3);
		names[type].push({ id, name });
		rcv[type].push({ id, effectiveDate, addedDate });
	}
	await connection.beginTransaction();
	for (const type of Game.TYPES) {
		if (type === 'bundle') {
			continue;
		}
		if (names[type].length > 0) {
			await connection.query(`
				INSERT IGNORE INTO games__${type}_name (${type}_id, name)
				VALUES ${names[type].map(name => `(${connection.escape(name.id)}, ${connection.escape(name.name)})`).join(', ')}
			`);
		}
		if (rcv[type].length > 0) {
			await connection.query(`
				INSERT INTO games__${type}_rcv (${type}_id, effective_date, added_date, found)
				VALUES ${rcv[type].map(rcv => `(${connection.escape(rcv.id)}, ${connection.escape(rcv.effectiveDate)}, ${connection.escape(rcv.addedDate)}, TRUE)`).join(', ')}
				ON DUPLICATE KEY UPDATE effective_date = VALUES(effective_date)
			`);
		}
	}
	await connection.query(`
		INSERT INTO timestamps (name, date)
		VALUES ('rcv_last_update_from_sgtools', ${connection.escape(Math.trunc(Date.now() / 1e3))})
		ON DUPLICATE KEY UPDATE date = VALUES(date)
	`);
	await connection.commit();
	console.log('Done!');
}