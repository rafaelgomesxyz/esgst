const Connection = require('../../class/Connection');
const CustomError = require('../../class/CustomError');
const Request = require('../../class/Request');
const Utils = require('../../class/Utils');

/**
 * @api {SCHEMA} Uh Uh
 * @apiGroup Schemas
 * @apiName Uh
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} user
 * @apiParam (Schema) {String} [user.steam_id] The Steam ID of the user. This property is not available for the [GetAllUh](#api-Users-GetAllUh) method when used without the "format_array" and "show_steam_id" parameters.
 * @apiParam (Schema) {String[]} user.usernames An array containing the username history for the user, from most recent to least recent.
 * @apiParam (Schema) {String} user.last_check When the username history for the user was last checked in the format YYYY/MM/DD HH:mm:SS (UTC timezone).
 * @apiParam (Schema) {String} user.last_update When the username history for the user was last updated in the format YYYY/MM/DD HH:mm:SS (UTC timezone).
 *
 * @apiSampleRequest off
 */

/**
 * @api {SCHEMA} UhObject UhObject
 * @apiGroup Schemas
 * @apiName UhObject
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} result
 * @apiParam (Schema) {Object} result.found An object of [Uh](#api-Schemas-Uh) objects for the users that were found, with their Steam IDs as the keys.
 * @apiParam (Schema) {String[]} result.not_found The Steam IDs of the users that were not found.
 *
 * @apiSampleRequest off
 */

/**
 * @api {SCHEMA} UhArray UhArray
 * @apiGroup Schemas
 * @apiName UhArray
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} result
 * @apiParam (Schema) {[Uh](#api-Schemas-Uh)[]} result.found The users that were found.
 * @apiParam (Schema) {String[]} result.not_found The Steam IDs of the users that were not found.
 *
 * @apiSampleRequest off
 */

/**
 * @api {GET} /user/+:steamid/uh GetUh
 * @apiGroup Users
 * @apiName GetUh
 * @apiDescription Returns the username history for the user.
 * @apiVersion 1.0.0
 *
 * @apiParam (Path Parameters) {String} steamid The Steam ID of the user.
 * @apiParam (Query Parameters) {String} [username] The current username of the user, for checking purposes.
 *
 * @apiSuccess (Success Response (200)) {Object} output
 * @apiSuccess (Success Response (200)) {NULL} output.error Always NULL in a success response.
 * @apiSuccess (Success Response (200)) {[Uh](#api-Schemas-Uh)/NULL} output.result The information requested, or NULL if it isn't available.
 *
 * @apiError (Error Response (400, 500)) {Object} output
 * @apiError (Error Response (400, 500)) {String} output.error The error message.
 * @apiError (Error Response (400, 500)) {NULL} output.result Always NULL in an error response.
 */

/**
 * @api {GET} /users/uh GetAllUh
 * @apiGroup Users
 * @apiName GetAllUh
 * @apiDescription Returns the username history for users.
 * @apiVersion 1.0.0
 *
 * @apiParam (Query Parameters) {Boolean} [format_array] If true, the result is a [UhArray](#api-Schemas-UhArray) object. If false, the result is a [UhObject](#api-Schemas-UhObject) object.
 * @apiParam (Query Parameters) {Boolean} [show_steam_id] If false, the [Uh](#api-Schemas-Uh) object from the "found" object does not have the "steam_id" property.
 * @apiParam (Query Parameters) {String} [steam_ids] A comma-separated list of Steam IDs for the users requested.
 * @apiParam (Query Parameters) {Boolean} [show_recent] If true, only the 100 most recently updated username histories are returned.
 *
 * @apiSuccess (Success Response (200)) {Object} output
 * @apiSuccess (Success Response (200)) {NULL} output.error Always NULL in a success response.
 * @apiSuccess (Success Response (200)) {[UhObject](#api-Schemas-UhObject)/[UhArray](#api-Schemas-UhArray)} output.result The information requested.
 *
 * @apiError (Error Response (400, 500)) {Object} output
 * @apiError (Error Response (400, 500)) {String} output.error The error message.
 * @apiError (Error Response (400, 500)) {NULL} output.result Always NULL in an error response.
 */

class Uh {
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	static async get(req, res) {
		const connection = new Connection();
		await connection.connect();
		try {
			const result = req.route.path.includes('/user/') ? await Uh._find(connection, req) : await Uh._findAll(connection, req);
			res.status(200)
				.json({
					error: null,
					result: result ? result : null,
				});
		} catch (err) {
			console.log(`GET ${req.route.path} failed with params ${JSON.stringify(req.params)} and query ${JSON.stringify(req.query)}: ${err.message} ${err.stack ? err.stack.replace(/\n/g, ' ') : ''}`);
			if (connection.inTransaction) {
				await connection.rollback();
			}
			if (!err.status) {
				err.status = 500;
				err.message = CustomError.COMMON_MESSAGES.internal;
			}
			res.status(err.status)
				.json({
					error: err.message,
					result: null,
				});
		}
		await connection.disconnect();
	}

	/**
	 * @param {import('../../class/Connection')} connection
	 * @param {import('express').Request} req
	 */
	static async _find(connection, req) {
		const pathParams = Object.assign({}, req.params);
		const queryParams = Object.assign({}, req.query);
		const pathValidator = {
			steamid: {
				message: 'Invalid {steamid}. Must be a string of digits e.g. 76561198020696458.',
				regex: /^\d+$/,
			},
		};
		Utils.validateParams(pathParams, pathValidator);
		const steamId = pathParams.steamid;
		const row = (await connection.query(`
			SELECT steam_id, usernames, last_check, last_update
			FROM users__uh
			WHERE steam_id = ${connection.escape(steamId)}
		`))[0];
		const now = Math.trunc(Date.now() / 1e3);
		if (row) {
			const usernames = row.usernames.split(', ');
			let lastCheck = parseInt(row.last_check);
			let lastUpdate = row.last_update ? parseInt(row.last_update) : null;
			const differenceInSeconds = now - lastCheck;
			if (differenceInSeconds >= 60 * 60 * 24 * 7 || (queryParams.username && usernames[0] !== queryParams.username)) {
				const url = `https://www.steamgifts.com/go/user/${steamId}`;
				const response = await Request.head(url);
				const parts = response.url.split('/user/');
				const username = parts && parts.length === 2 ? parts[1] : '[DELETED]';
				const values = {
					usernames: null,
					last_check: now,
					last_update: now,
				};
				if (usernames[0] !== username) {
					usernames.unshift(username);
					values.usernames = usernames.join(', ');
					lastUpdate = now;
				} else {
					delete values.usernames;
					delete values.last_update;
				}
				await connection.beginTransaction();
				await connection.query(`
					UPDATE users__uh
					SET ${Object.keys(values).map(key => `${key} = ${connection.escape(values[key])}`).join(', ')}
					WHERE steam_id = ${connection.escape(steamId)}
				`);
				await connection.commit();
				lastCheck = now;
			}
			const result = {
				steam_id: row.steam_id,
				usernames,
				last_check: Utils.formatDate(lastCheck * 1e3, true),
				last_update: lastUpdate ? Utils.formatDate(lastUpdate * 1e3, true) : null,
			};
			return result;
		}
		const url = `https://www.steamgifts.com/go/user/${steamId}`;
		const response = await Request.head(url);
		const parts = response.url.split('/user/');
		if (parts.length === 2) {
			const username = parts[1];
			await connection.beginTransaction();
			await connection.query(`
				INSERT IGNORE INTO users__uh (steam_id, usernames, last_check)
				VALUES (${connection.escape(steamId)}, ${connection.escape(username)}, ${connection.escape(now)})
			`);
			await connection.commit();
			const result = {
				steam_id: steamId,
				usernames: [username],
				last_check: Utils.formatDate(now * 1e3, true),
				last_update: null,
			};
			return result;
		}
		return null;
	}

	/**
	 * @param {import('../../class/Connection')} connection
	 * @param {import('express').Request} req
	 */
	static async _findAll(connection, req) {
		const booleanMessage = 'Must be true or false.';
		const booleanRegex = /^(true|false|1|0|)$/i;
		const trueBooleanRegex = /^(true|1|)$/i
		const params = Object.assign({}, req.query);
		const validator = {
			'format_array': {
				'message': booleanMessage,
				'regex': booleanRegex,
			},
			'show_steam_id': {
				'message': booleanMessage,
				'regex': booleanRegex,
			},
			'steam_ids': {
				'message': 'Must be a comma-separated list of Steam ids e.g. 76561198020696458,76561198174510278.',
				'regex': /^((\d+,)*\d+$|$)/,
				'conflicts': ['show_recent'],
			},
			'show_recent': {
				'message': booleanMessage,
				'regex': booleanRegex,
				'conflicts': ['steam_ids'],
			},
		};
		Utils.validateParams(params, validator);
		if (typeof params.format_array !== 'undefined' && params.format_array.match(trueBooleanRegex)) {
			params.format_array = true;
			params.show_steam_id = false;
		} else if (typeof params.show_steam_id !== 'undefined' && params.show_steam_id.match(trueBooleanRegex)) {
			params.show_steam_id = true;
			params.format_array = false;
		} else {
			params.format_array = false;
			params.show_steam_id = false;
		}
		if (typeof params.show_recent !== 'undefined' && params.show_recent.match(trueBooleanRegex)) {
			params.show_recent = true;
		} else {
			params.show_recent = false;
		}
		const result = {
			'found': params.format_array ? [] : {},
			'not_found': [],
		};
		const steamIds = params.steam_ids ? params.steam_ids.split(',') : [];
		let conditions = [];
		if (params.steam_ids) {
			conditions.push(`(${steamIds.map(steamId => `steam_id = ${connection.escape(steamId)}`).join(' OR ')})`);
		}
		const rows = await connection.query(`
			SELECT steam_id, usernames, last_check, last_update
			FROM users__uh
			${conditions.length > 0 ? `
				WHERE ${conditions.join(' AND ')}
			` : ''}
			${params.show_recent ? `
				WHERE last_update IS NOT NULL
				ORDER BY last_update DESC
				LIMIT 100
			` : ''}
		`);
		const steamIdsFound = [];
		for (const row of rows) {
			const steamId = row.steam_id;
			const user = {
				steam_id: steamId,
				usernames: row.usernames.split(', '),
				last_check: Utils.formatDate(parseInt(row.last_check) * 1e3, true),
				last_update: row.last_update ? Utils.formatDate(parseInt(row.last_update) * 1e3, true) : null,
			};
			if (params.format_array) {
				result.found.push(user);
			} else {
				if (!params.show_steam_id) {
					delete user.steam_id;
				}
				result.found[steamId] = user;
			}
			steamIdsFound.push(steamId);
		}
		const steamIdsNotFound = steamIds.filter(steamId => !steamIdsFound.includes(steamId));
		for (const steamId of steamIdsNotFound) {
			result.not_found.push(steamId);
		}
		return result;
	}
}

module.exports = Uh;