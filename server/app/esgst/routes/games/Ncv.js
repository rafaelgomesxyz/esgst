const Connection = require('../../class/Connection');
const CustomError = require('../../class/CustomError');
const Request = require('../../class/Request');
const Utils = require('../../class/Utils');
const Game = require('./Game');
const { JSDOM } = require('jsdom');
const secrets = require('../../config').secrets;

/**
 * @api {SCHEMA} NcvApp NcvApp
 * @apiGroup Schemas
 * @apiName NcvApp
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} app
 * @apiParam (Schema) {Integer} [app.app_id] The Steam ID of the game. This property is not available without the "format_array" and "show_id" parameters.
 * @apiParam (Schema) {String} [app.name] The name of the game. This property is not available without the "show_name" parameter.
 * @apiParam (Schema) {String} app.effective_date When the game began giving no CV in the format YYYY-MM-DD.
 * @apiParam (Schema) {String} app.added_date When the game was added to the database in the format YYYY-MM-DD.
 *
 * @apiSampleRequest off
 */

/**
 * @api {SCHEMA} NcvSub NcvSub
 * @apiGroup Schemas
 * @apiName NcvSub
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} sub
 * @apiParam (Schema) {Integer} [sub.sub_id] The Steam ID of the game. This property is not available without the "format_array" and "show_id" parameters.
 * @apiParam (Schema) {String} [sub.name] The name of the game. This property is not available without the "show_name" parameter.
 * @apiParam (Schema) {String} sub.effective_date When the game began giving no CV in the format YYYY-MM-DD.
 * @apiParam (Schema) {String} sub.added_date When the game was added to the database in the format YYYY-MM-DD.
 *
 * @apiSampleRequest off
 */

/**
 * @api {SCHEMA} NcvObject NcvObject
 * @apiGroup Schemas
 * @apiName NcvObject
 * @apiDescription The [NcvApp](#api-Schemas-NcvApp) and [NcvSub](#api-Schemas-NcvSub) objects do not have the respective "app_id" or "sub_id" property if the parameter "show_id" isn't used, as the object keys already represent the Steam IDs of the games, and the "name" property if the parameter "show_name" isn't used.
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} result
 * @apiParam (Schema) {Object} result.found
 * @apiParam (Schema) {Object} result.found.apps An object of [NcvApp](#api-Schemas-NcvApp) objects for the apps that were found, with their Steam IDs as the keys.
 * @apiParam (Schema) {Object} result.found.subs An object of [NcvSub](#api-Schemas-NcvSub) objects for the subs that were found, with their Steam IDs as the keys.
 * @apiParam (Schema) {Object} result.not_found
 * @apiParam (Schema) {Integer[]} result.not_found.apps The Steam IDs of the apps that were not found.
 * @apiParam (Schema) {Integer[]} result.not_found.subs The Steam IDs of the subs that were not found.
 * @apiParam (Schema) {String} result.last_update When the database was last updated in the format YYYY/MM/DD HH:mm:SS (UTC timezone).
 *
 * @apiSampleRequest off
 */

/**
 * @api {SCHEMA} NcvArray NcvArray
 * @apiGroup Schemas
 * @apiName NcvArray
 * @apiDescription The [NcvApp](#api-Schemas-NcvApp) and [NcvSub](#api-Schemas-NcvSub) objects do not have the "name" property if the parameter "show_name" isn't used.
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} result
 * @apiParam (Schema) {Object} result.found
 * @apiParam (Schema) {[NcvApp](#api-Schemas-NcvApp)[]} result.found.apps The apps that were found.
 * @apiParam (Schema) {[NcvSub](#api-Schemas-NcvSub)[]} result.found.subs The subs that were found.
 * @apiParam (Schema) {Object} result.not_found
 * @apiParam (Schema) {Integer[]} result.not_found.apps The Steam IDs of the apps that were not found.
 * @apiParam (Schema) {Integer[]} result.not_found.subs The Steam IDs of the subs that were not found.
 * @apiParam (Schema) {String} result.last_update When the database was last updated in the format YYYY/MM/DD HH:mm:SS (UTC timezone).
 *
 * @apiSampleRequest off
 */


/**
 * @api {SCHEMA} NcvStatusObject NcvStatusObject
 * @apiGroup Schemas
 * @apiName NcvStatusObject
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} result
 * @apiParam (Schema) {Object} result.apps An object where the key is the Steam ID of the app and the value is the status of the app from the request ("added", "removed", "already_added", "already_removed", "not_found").
 * @apiParam (Schema) {Object} result.subs An object where the key is the Steam ID of the sub and the value is the status of the sub from the request ("added", "removed", "already_added", "already_removed", "not_found").
 *
 * @apiSampleRequest off
 */

/**
 * @api {GET} /games/ncv GetNcv
 * @apiGroup Games
 * @apiName GetNcv
 * @apiDescription Returns information about no CV games.
 * @apiVersion 1.0.0
 *
 * @apiParam (Query Parameters) {Boolean} [format_array] If true, the result is a [NcvArray](#api-Schemas-NcvArray) object. If false, the result is a [NcvObject](#api-Schemas-NcvObject) object.
 * @apiParam (Query Parameters) {Boolean} [show_id] If false, the [NcvApp](#api-Schemas-NcvApp) and [NcvSub](#api-Schemas-NcvSub) objects do not have the respective "app_id" or "sub_id" property.
 * @apiParam (Query Parameters) {Boolean} [show_name] If false, the [NcvApp](#api-Schemas-NcvApp) and [NcvSub](#api-Schemas-NcvSub) objects do not have the "name" property.
 * @apiParam (Query Parameters) {String} [app_ids] A comma-separated list of Steam IDs for the apps requested.
 * @apiParam (Query Parameters) {String} [sub_ids] A comma-separated list of Steam IDs for the subs requested.
 * @apiParam (Query Parameters) {String} [date_after] Returns only games that began giving no CV after the specified date. The date must be in the format YYYY-MM-DD.
 * @apiParam (Query Parameters) {String} [date_after_or_equal] Returns only games that began giving no CV after or at the specified date. The date must be in the format YYYY-MM-DD.
 * @apiParam (Query Parameters) {String} [date_before] Returns only games that began giving no CV before the specified date. The date must be in the format YYYY-MM-DD.
 * @apiParam (Query Parameters) {String} [date_before_or_equal] Returns only games that began giving no CV before or at the specified date. The date must be in the format YYYY-MM-DD.
 * @apiParam (Query Parameters) {String} [date_equal] Returns only games that began giving no CV at the specified date. The date must be in the format YYYY-MM-DD.
 * @apiParam (Query Parameters) {Boolean} [show_recent] Returns only the last 100 apps and the last 50 subs that were added.
 *
 * @apiSuccess (Success Response (200)) {Object} output
 * @apiSuccess (Success Response (200)) {NULL} output.error Always NULL in a success response.
 * @apiSuccess (Success Response (200)) {[NcvObject](#api-Schemas-NcvObject)/[NcvArray](#api-Schemas-NcvArray)} output.result The information requested.
 *
 * @apiError (Error Response (400, 500)) {Object} output
 * @apiError (Error Response (400, 500)) {String} output.error The error message.
 * @apiError (Error Response (400, 500)) {NULL} output.result Always NULL in an error response.
 */

/**
 * @api {POST} /games/ncv PostNcv
 * @apiGroup Games
 * @apiName PostNcv
 * @apiDescription Adds new information to the no CV games database.
 * @apiVersion 1.0.0
 *
 * @apiParam (Body Parameters) {Object} [apps] An object where the key is the Steam ID of the app and the value is either a date in the YYYY-MM-DD format corresponding to when it started giving no CV or NULL. If the date is provided, the app will be added to the database. Otherwise, it will be removed.
 * @apiParam (Body Parameters) {Object} [subs] An object where the key is the Steam ID of the sub and the value is either a date in the YYYY-MM-DD format corresponding to when it started giving no CV or NULL. If the date is provided, the sub will be added to the database. Otherwise, it will be removed.
 *
 * @apiSuccess (Success Response (200)) {Object} output
 * @apiSuccess (Success Response (200)) {NULL} output.error Always NULL in a success response.
 * @apiSuccess (Success Response (200)) {[NcvStatusObject](#api-Schemas-NcvStatusObject)} output.result The information requested.
 *
 * @apiError (Error Response (400, 500)) {Object} output
 * @apiError (Error Response (400, 500)) {String} output.error The error message.
 * @apiError (Error Response (400, 500)) {NULL} output.result Always NULL in an error response.
 */

class Ncv {
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	static async get(req, res) {
		const connection = new Connection();
		await connection.connect();
		try {
			const result = await Ncv._find(connection, req);
			res.status(200)
				.json({
					error: null,
					result,
				});
		} catch (err) {
			console.log(`GET ${req.route.path} failed with params ${JSON.stringify(req.params)} and query ${JSON.stringify(req.query)}: ${err.message} ${err.stack ? err.stack.replace(/\n/g, ' ') : ''}`);
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
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	static async post(req, res) {
		const connection = new Connection();
		await connection.connect();
		try {
			const result = await Ncv._insert(connection, req);
			res.status(200)
				.json({
					error: null,
					result,
				});
		} catch (err) {
			console.log(`POST ${req.route.path} failed with params ${JSON.stringify(req.params)} and query ${JSON.stringify(req.query)}: ${err.message} ${err.stack ? err.stack.replace(/\n/g, ' ') : ''}`);
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
		const booleanMessage = 'Must be true or false.';
		const booleanRegex = /^(true|false|1|0|)$/i;
		const trueBooleanRegex = /^(true|1|)$/i
		const idsMessage = 'Must be a comma-separated list of ids e.g. 400,500,600.';
		const idsRegex = /^((\d+,)*\d+$|$)/;
		const dateMessage = 'Must be a date in the format YYYY-MM-DD.';
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		const params = Object.assign({}, req.query);
		const validator = {
			'format_array': {
				'message': booleanMessage,
				'regex': booleanRegex,
			},
			'show_id': {
				'message': booleanMessage,
				'regex': booleanRegex,
			},
			'show_name': {
				'message': booleanMessage,
				'regex': booleanRegex,
			},
			'app_ids': {
				'message': idsMessage,
				'regex': idsRegex,
				'conflicts': ['show_recent'],
			},
			'sub_ids': {
				'message': idsMessage,
				'regex': idsRegex,
				'conflicts': ['show_recent'],
			},
			'date_after': {
				'message': dateMessage,
				'regex': dateRegex,
				'conflicts': ['date_equal', 'date_after_or_equal', 'show_recent'],
			},
			'date_after_or_equal': {
				'message': dateMessage,
				'regex': dateRegex,
				'conflicts': ['date_equal', 'date_after', 'show_recent'],
			},
			'date_before': {
				'message': dateMessage,
				'regex': dateRegex,
				'conflicts': ['date_equal', 'date_before_or_equal', 'show_recent'],
			},
			'date_before_or_equal': {
				'message': dateMessage,
				'regex': dateRegex,
				'conflicts': ['date_equal', 'date_before', 'show_recent'],
			},
			'date_equal': {
				'message': dateMessage,
				'regex': dateRegex,
				'conflicts': ['date_after', 'date_before', 'show_recent'],
			},
			'show_recent': {
				'message': booleanMessage,
				'regex': booleanRegex,
				'conflicts': ['app_ids', 'sub_ids', 'date_after', 'date_after_or_equal', 'date_before', 'date_before_or_equal', 'date-equal'],
			},
		};
		Utils.validateParams(params, validator);
		if (params.format_array.match(trueBooleanRegex)) {
			params.format_array = true;
			params.show_id = false;
		} else if (params.show_id.match(trueBooleanRegex)) {
			params.show_id = true;
			params.format_array = false;
		} else {
			params.format_array = false;
			params.show_id = false;
		}
		if (params.show_recent.match(trueBooleanRegex)) {
			params.show_recent = true;
		} else {
			params.show_recent = false;
		}
		params.show_name = !!params.show_name.match(trueBooleanRegex);
		const result = {
			'found': {
				'apps': params.format_array ? [] : {},
				'subs': params.format_array ? [] : {},
			},
			'not_found': {
				'apps': [],
				'subs': [],
			},
			'last_update': null,
		};
		for (const type of Game.TYPES) {
			if (type === 'bundle') {
				continue;
			}
			if (Utils.isSet(params[`${type}_ids`]) && !params[`${type}_ids`]) {
				continue;
			}
			const ids = params[`${type}_ids`] ? params[`${type}_ids`].split(',').map(id => parseInt(id)) : [];
			let conditions = [];
			if (params[`${type}_ids`]) {
				conditions.push(`(${ids.map(id => `g_tncv.${type}_id = ${connection.escape(id)}`).join(' OR ')})`);
			}
			if (params.date_equal) {
				conditions.push(`g_tncv.effective_date = ${connection.escape(Math.trunc(new Date(`${params.date_equal}T00:00:00.000Z`).getTime() / 1e3))}`);
			}
			if (params.date_after) {
				conditions.push(`g_tncv.effective_date > ${connection.escape(Math.trunc(new Date(`${params.date_after}T00:00:00.000Z`).getTime() / 1e3))}`);
			}
			if (params.date_after_or_equal) {
				conditions.push(`g_tncv.effective_date >= ${connection.escape(Math.trunc(new Date(`${params.date_after_or_equal}T00:00:00.000Z`).getTime() / 1e3))}`);
			}
			if (params.date_before) {
				conditions.push(`g_tncv.effective_date < ${connection.escape(Math.trunc(new Date(`${params.date_before}T00:00:00.000Z`).getTime() / 1e3))}`);
			}
			if (params.date_before_or_equal) {
				conditions.push(`g_tncv.effective_date <= ${connection.escape(Math.trunc(new Date(`${params.date_before_or_equal}T00:00:00.000Z`).getTime() / 1e3))}`);
			}
			const rows = await connection.query(`
				SELECT ${[
					`g_tncv.${type}_id`,
					...(params.show_name ? ['g_tn.name'] : []),
					'g_tncv.effective_date',
					'g_tncv.added_date',
				].join(', ')}
				FROM games__${type}_ncv AS g_tncv
				INNER JOIN games__${type}_name AS g_tn
				ON g_tncv.${type}_id = g_tn.${type}_id
				${conditions.length > 0 ? `
					WHERE ${conditions.join(' AND ')}
				` : ''}
				${params.show_recent ? `
					ORDER BY g_tncv.added_date DESC
					LIMIT ${type === 'app' ? '100' : '50'}
				` : ''}
			`);
			const idsFound = [];
			for (const row of rows) {
				const id = parseInt(row[`${type}_id`]);
				const game = {};
				if (params.show_id || params.format_array) {
					game[`${type}_id`] = id;
				}
				if (row.name) {
					game.name = row.name;
				}
				game.effective_date = Utils.formatDate(parseInt(row.effective_date) * 1e3);
				game.added_date = Utils.formatDate(parseInt(row.added_date) * 1e3);
				if (params.format_array) {
					result.found[`${type}s`].push(game);
				} else {
					result.found[`${type}s`][id] = game;
				}
				idsFound.push(id);
			}
			const idsNotFound = ids.filter(id => !idsFound.includes(id));
			for (const id of idsNotFound) {
				result.not_found[`${type}s`].push(id);
			}
		}
		const timestampRow = await connection.query('SELECT name, date FROM timestamps WHERE name = "ncv_last_update"')[0];
		if (timestampRow) {
			result.last_update = Utils.formatDate(parseInt(timestampRow.date) * 1e3, true);
		}
		return result;
	}

	/**
	 * @param {import('../../class/Connection')} connection
	 * @param {import('express').Request} req
	 */
	static async _insert(connection, req) {
		// Check if PHPSESSID is valid. Otherwise, cannot add games reliably.
		const url = 'https://www.steamgifts.com/ajax.php';
		const testResponse = await Request.post(url, {
			headers: {
				'Cookie': `PHPSESSID=${secrets.sgPhpSessId};`,
			},
			body: 'do=autocomplete_giveaway_game&page_number=1&search_query=test',
		});
		if (!testResponse || !testResponse.json) {
			throw new CustomError(CustomError.COMMON_MESSAGES.internal, 500);
		}

		const addedDate = Math.trunc(Date.now() / 1e3);
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		const message = 'Must be a valid { "id": "YYYY-MM-DD" } or { "id": null } object with at most 5 entries.';
		const check = games => {
			if (typeof games !== 'object' || Array.isArray(games)) {
				return false;
			}
			const ids = Object.keys(games);
			if (ids.length > 5) {
				return false;
			}
			for (const id of ids) {
				if (games[id] === null) {
					continue;
				}
				if (!games[id].match(dateRegex)) {
					return false;
				}
				games[id] = Math.trunc((new Date(`${games[id]}T00:00:00.000Z`)).getTime() / 1e3);
			}
			return true;
		};
		const params = Object.assign({}, req.body);
		const validator = {
			'apps': {
				'message': message,
				'check': check,
			},
			'subs': {
				'message': message,
				'check': check,
			},
		};
		Utils.validateParams(params, validator);
		const result = {
			apps: {},
			subs: {},
		};
		const ncv = {
			toAdd: {
				app: [],
				sub: [],
			},
			toRemove: {
				app: [],
				sub: [],
			},
		};
		for (const type of Game.TYPES) {
			if (type === 'bundle') {
				continue;
			}
			const games = params[`${type}s`];
			if (!Utils.isSet(games) || !games) {
				continue;
			}
			const ids = Object.keys(games).map(id => parseInt(id));
			if (ids.length < 1) {
				continue;
			}
			const rows = await connection.query(`
				SELECT ${type}_id, effective_date
				FROM games__${type}_ncv
				WHERE ${ids.map(id => `${type}_id = ${connection.escape(id)}`).join(' OR ')}
			`);
			const rowsObj = {};
			rows.forEach(row => {
				const id = parseInt(row[`${type}_id`]);
				rowsObj[id] = row;
			});
			const idsFound = [];
			for (const id of ids) {
				const row = rowsObj[id];
				if (row) {
					const effective_date = parseInt(row.effective_date);
					if (games[id] && games[id] === effective_date) {
						result[`${type}s`][id] = 'already_added';
						idsFound.push(id);
						continue;
					}
				} else if (!games[id]) {
					result[`${type}s`][id] = 'already_removed';
					idsFound.push(id);
					continue;
				}
				const response = await Request.post(url, {
					headers: {
						'Cookie': `PHPSESSID=${secrets.sgPhpSessId};`,
					},
					body: `do=autocomplete_giveaway_game&page_number=1&search_query=${id}`,
				});
				if (!response || !response.json) {
					continue;
				}
				const html = new JSDOM(response.json.html).window.document;
				const element = html.querySelector(`.table__column__secondary-link[href*="${type}/${id}/"`);
				if (!element) {
					continue;
				}
				const container = element.parentElement.parentElement;
				const dateElement = container.querySelector('[data-ui-tooltip*="Zero contributor value since..."]');
				if (dateElement) {
					const dateRows = JSON.parse(dateElement.getAttribute('data-ui-tooltip')).rows;
					const date = Math.trunc((new Date(`${dateRows[dateRows.length - 1].columns[1].name} UTC`)).getTime() / 1e3);
					if (row) {
						const effective_date = parseInt(row.effective_date);
						if (date === effective_date) {
							result[`${type}s`][id] = 'already_added';
							idsFound.push(id);
							continue;
						}
					}
					ncv.toAdd[type].push({
						id,
						date,
						name: container.querySelector('.table__column__heading').firstChild.textContent.trim(),
					});
					result[`${type}s`][id] = 'added';
				} else if (row) {
					ncv.toRemove[type].push(id);
					result[`${type}s`][id] = 'removed';
				} else {
					result[`${type}s`][id] = 'not_found';
				}
				idsFound.push(id);
			}
			const idsNotFound = ids.filter(id => !idsFound.includes(id));
			for (const id of idsNotFound) {
				result[`${type}s`][id] = 'not_found';
			}
		}
		await connection.beginTransaction();
		for (const type of Game.TYPES) {
			if (type === 'bundle') {
				continue;
			}
			if (ncv.toAdd[type].length > 0) {
				await connection.query(`
					INSERT IGNORE INTO games__${type}_name (${type}_id, name)
					VALUES ${ncv.toAdd[type].map(game => `(${connection.escape(game.id)}, ${connection.escape(game.name)})`).join(', ')}
				`);
				await connection.query(`
					INSERT INTO games__${type}_ncv (${type}_id, effective_date, added_date, found)
					VALUES ${ncv.toAdd[type].map(game => `(${connection.escape(game.id)}, ${connection.escape(game.date)}, ${connection.escape(addedDate)}, TRUE)`).join(', ')}
					ON DUPLICATE KEY UPDATE effective_date = VALUES(effective_date), found = VALUES(found)
				`);
			}
			if (ncv.toRemove[type].length > 0) {
				await connection.query(`
					DELETE FROM games__${type}_ncv
					WHERE ${ncv.toRemove[type].map(id => `${type}_id = ${connection.escape(id)}`).join(' OR ')}
				`);
			}
		}
		await connection.commit();
		return result;
	}
}

module.exports = Ncv;