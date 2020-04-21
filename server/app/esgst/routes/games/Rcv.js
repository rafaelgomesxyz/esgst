const Connection = require('../../class/Connection');
const CustomError = require('../../class/CustomError');
const Utils = require('../../class/Utils');
const Game = require('./Game');

/**
 * @api {SCHEMA} RcvApp RcvApp
 * @apiGroup Schemas
 * @apiName RcvApp
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} app
 * @apiParam (Schema) {Integer} [app.app_id] The Steam ID of the game. This property is not available without the "format_array" and "show_id" parameters.
 * @apiParam (Schema) {String} [app.name] The name of the game. This property is not available without the "show_name" parameter.
 * @apiParam (Schema) {String} app.effective_date When the game began giving reduced CV in the format YYYY-MM-DD.
 * @apiParam (Schema) {String} app.added_date When the game was added to the database in the format YYYY-MM-DD.
 *
 * @apiSampleRequest off
 */

/**
 * @api {SCHEMA} RcvSub RcvSub
 * @apiGroup Schemas
 * @apiName RcvSub
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} sub
 * @apiParam (Schema) {Integer} [sub.sub_id] The Steam ID of the game. This property is not available without the "format_array" and "show_id" parameters.
 * @apiParam (Schema) {String} [sub.name] The name of the game. This property is not available without the "show_name" parameter.
 * @apiParam (Schema) {String} sub.effective_date When the game began giving reduced CV in the format YYYY-MM-DD.
 * @apiParam (Schema) {String} sub.added_date When the game was added to the database in the format YYYY-MM-DD.
 *
 * @apiSampleRequest off
 */

/**
 * @api {SCHEMA} RcvObject RcvObject
 * @apiGroup Schemas
 * @apiName RcvObject
 * @apiDescription The [RcvApp](#api-Schemas-RcvApp) and [RcvSub](#api-Schemas-RcvSub) objects do not have the respective "app_id" or "sub_id" property if the parameter "show_id" isn't used, as the object keys already represent the Steam IDs of the games, and the "name" property if the parameter "show_name" isn't used.
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} result
 * @apiParam (Schema) {Object} result.found
 * @apiParam (Schema) {Object} result.found.apps An object of [RcvApp](#api-Schemas-RcvApp) objects for the apps that were found, with their Steam IDs as the keys.
 * @apiParam (Schema) {Object} result.found.subs An object of [RcvSub](#api-Schemas-RcvSub) objects for the subs that were found, with their Steam IDs as the keys.
 * @apiParam (Schema) {Object} result.not_found
 * @apiParam (Schema) {Integer[]} result.not_found.apps The Steam IDs of the apps that were not found.
 * @apiParam (Schema) {Integer[]} result.not_found.subs The Steam IDs of the subs that were not found.
 * @apiParam (Schema) {String} result.last_update When the database was last updated in the format YYYY/MM/DD HH:mm:SS (UTC timezone).
 *
 * @apiSampleRequest off
 */

/**
 * @api {SCHEMA} RcvArray RcvArray
 * @apiGroup Schemas
 * @apiName RcvArray
 * @apiDescription The [RcvApp](#api-Schemas-RcvApp) and [RcvSub](#api-Schemas-RcvSub) objects do not have the "name" property if the parameter "show_name" isn't used.
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} result
 * @apiParam (Schema) {Object} result.found
 * @apiParam (Schema) {[RcvApp](#api-Schemas-RcvApp)[]} result.found.apps The apps that were found.
 * @apiParam (Schema) {[RcvSub](#api-Schemas-RcvSub)[]} result.found.subs The subs that were found.
 * @apiParam (Schema) {Object} result.not_found
 * @apiParam (Schema) {Integer[]} result.not_found.apps The Steam IDs of the apps that were not found.
 * @apiParam (Schema) {Integer[]} result.not_found.subs The Steam IDs of the subs that were not found.
 * @apiParam (Schema) {String} result.last_update When the database was last updated in the format YYYY/MM/DD HH:mm:SS (UTC timezone).
 *
 * @apiSampleRequest off
 */

/**
 * @api {GET} /games/rcv[?format_array=...&show_id=...&show_name=...&app_ids=...&sub_ids=...&date_after=...&date_after_or_equal=...&date_before=...&date_before_or_equal=...&date_equal=...] GetRcv
 * @apiGroup Games
 * @apiName GetRcv
 * @apiDescription Returns information about reduced CV games.
 * @apiVersion 1.0.0
 *
 * @apiParam (Query Parameters) {Boolean} [format_array] If true, the result is a [RcvArray](#api-Schemas-RcvArray) object. If false, the result is a [RcvObject](#api-Schemas-RcvObject) object.
 * @apiParam (Query Parameters) {Boolean} [show_id] If false, the [RcvApp](#api-Schemas-RcvApp) and [RcvSub](#api-Schemas-RcvSub) objects do not have the respective "app_id" or "sub_id" property.
 * @apiParam (Query Parameters) {Boolean} [show_name] If false, the [RcvApp](#api-Schemas-RcvApp) and [RcvSub](#api-Schemas-RcvSub) objects do not have the "name" property.
 * @apiParam (Query Parameters) {String} [app_ids] A comma-separated list of Steam IDs for the apps requested.
 * @apiParam (Query Parameters) {String} [sub_ids] A comma-separated list of Steam IDs for the subs requested.
 * @apiParam (Query Parameters) {String} [date_after] Returns only games that began giving reduced CV after the specified date. The date must be in the format YYYY-MM-DD.
 * @apiParam (Query Parameters) {String} [date_after_or_equal] Returns only games that began giving reduced CV after or at the specified date. The date must be in the format YYYY-MM-DD.
 * @apiParam (Query Parameters) {String} [date_before] Returns only games that began giving reduced CV before the specified date. The date must be in the format YYYY-MM-DD.
 * @apiParam (Query Parameters) {String} [date_before_or_equal] Returns only games that began giving reduced CV before or at the specified date. The date must be in the format YYYY-MM-DD.
 * @apiParam (Query Parameters) {String} [date_equal] Returns only games that began giving reduced CV at the specified date. The date must be in the format YYYY-MM-DD.
 *
 * @apiSuccess (Success Response (200)) {Object} output
 * @apiSuccess (Success Response (200)) {NULL} output.error Always NULL in a success response.
 * @apiSuccess (Success Response (200)) {[RcvObject](#api-Schemas-RcvObject)/[RcvArray](#api-Schemas-RcvArray)} output.result The information requested.
 *
 * @apiError (Error Response (400, 500)) {Object} output
 * @apiError (Error Response (400, 500)) {String} output.error The error message.
 * @apiError (Error Response (400, 500)) {NULL} output.result Always NULL in an error response.
 */

class Rcv {
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	static async get(req, res) {
		const connection = new Connection();
		await connection.connect();
		try {
			const result = await Rcv._find(connection, req);
			res.status(200)
				.json({
					error: null,
					result,
				});
		} catch (err) {
			console.log(`GET /games/rcv failed with params ${JSON.stringify(req.params)} and query ${JSON.stringify(req.query)}: ${err.message}`);
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
		const booleanRegex = /^(true|false)$/;
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
			},
			'sub_ids': {
				'message': idsMessage,
				'regex': idsRegex,
			},
			'date_after': {
				'message': dateMessage,
				'regex': dateRegex,
				'conflicts': ['date_equal', 'date_after_or_equal'],
			},
			'date_after_or_equal': {
				'message': dateMessage,
				'regex': dateRegex,
				'conflicts': ['date_equal', 'date_after'],
			},
			'date_before': {
				'message': dateMessage,
				'regex': dateRegex,
				'conflicts': ['date_equal', 'date_before_or_equal'],
			},
			'date_before_or_equal': {
				'message': dateMessage,
				'regex': dateRegex,
				'conflicts': ['date_equal', 'date_before'],
			},
			'date_equal': {
				'message': dateMessage,
				'regex': dateRegex,
				'conflicts': ['date_after', 'date_before'],
			},
		};
		Utils.validateParams(params, validator);
		if (params.format_array === 'true') {
			params.format_array = true;
			params.show_id = false;
		} else if (params.show_id === 'true') {
			params.show_id = true;
			params.format_array = false;
		} else {
			params.format_array = false;
			params.show_id = false;
		}
		params.show_name = params.show_name === 'true';
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
				conditions.push(`(${ids.map(id => `g_tr.${type}_id = ${connection.escape(id)}`).join(' OR ')})`);
			}
			if (params.date_equal) {
				conditions.push(`g_tr.effective_date = ${connection.escape(Math.trunc(new Date(`${params.date_equal}T00:00:00.000Z`).getTime() / 1e3))}`);
			}
			if (params.date_after) {
				conditions.push(`g_tr.effective_date > ${connection.escape(Math.trunc(new Date(`${params.date_after}T00:00:00.000Z`).getTime() / 1e3))}`);
			}
			if (params.date_after_or_equal) {
				conditions.push(`g_tr.effective_date >= ${connection.escape(Math.trunc(new Date(`${params.date_after_or_equal}T00:00:00.000Z`).getTime() / 1e3))}`);
			}
			if (params.date_before) {
				conditions.push(`g_tr.effective_date < ${connection.escape(Math.trunc(new Date(`${params.date_before}T00:00:00.000Z`).getTime() / 1e3))}`);
			}
			if (params.date_before_or_equal) {
				conditions.push(`g_tr.effective_date <= ${connection.escape(Math.trunc(new Date(`${params.date_before_or_equal}T00:00:00.000Z`).getTime() / 1e3))}`);
			}
			const rows = await connection.query(`
				SELECT ${[
					`g_tr.${type}_id`,
					...(params.show_name ? ['g_tn.name'] : []),
					'g_tr.effective_date',
					'g_tr.added_date',
				].join(', ')}
				FROM games__${type}_rcv AS g_tr
				INNER JOIN games__${type}_name AS g_tn
				ON g_tr.${type}_id = g_tn.${type}_id
				${conditions.length > 0 ? `
					WHERE ${conditions.join(' AND ')}
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
		const infoRows = await connection.query('SHOW TABLE STATUS WHERE Name = "games__app_rcv" OR Name = "games__sub_rcv"');
		for (const infoRow of infoRows) {
			if (infoRow.Update_time) {
				result.last_update = Utils.formatDate((new Date(infoRow.Update_time)).getTime(), true);
				break;
			}
		}
		return result;
	}
}

module.exports = Rcv;