const Connection = require('../../class/Connection');
const CustomError = require('../../class/CustomError');
const Utils = require('../../class/Utils');
const Game = require('./Game');

/**
 * @api {SCHEMA} SgGame SgGame
 * @apiGroup Schemas
 * @apiName SgGame
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} game An object where the key is the Steam ID of the game and the value is a string representing the SteamGifts ID of the game.
 *
 * @apiSampleRequest off
 */

/**
 * @api {SCHEMA} SgObject SgObject
 * @apiGroup Schemas
 * @apiName SgObject
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} result
 * @apiParam (Schema) {Object} result.found
 * @apiParam (Schema) {Object} result.found.apps An object of [SgGame](#api-Schemas-SgGame) objects for the apps that were found.
 * @apiParam (Schema) {Object} result.found.subs An object of [SgGame](#api-Schemas-SgGame) objects for the subs that were found.
 * @apiParam (Schema) {Object} result.not_found
 * @apiParam (Schema) {Integer[]} result.not_found.apps The Steam IDs of the apps that were not found.
 * @apiParam (Schema) {Integer[]} result.not_found.subs The Steam IDs of the subs that were not found.
 * @apiParam (Schema) {String} result.last_update When the database was last updated in the format YYYY/MM/DD HH:mm:SS (UTC timezone).
 *
 * @apiSampleRequest off
 */

/**
 * @api {GET} /games/sg GetSg
 * @apiGroup Games
 * @apiName GetSg
 * @apiDescription Returns Steam IDs of games mapped to their SteamGifts IDs.
 * @apiVersion 1.0.0
 *
 * @apiParam (Query Parameters) {String} [app_ids] A comma-separated list of Steam IDs for the apps requested.
 * @apiParam (Query Parameters) {String} [sub_ids] A comma-separated list of Steam IDs for the subs requested.
 *
 * @apiSuccess (Success Response (200)) {Object} output
 * @apiSuccess (Success Response (200)) {NULL} output.error Always NULL in a success response.
 * @apiSuccess (Success Response (200)) {[SgObject](#api-Schemas-SgObject)} output.result The information requested.
 *
 * @apiError (Error Response (400, 500)) {Object} output
 * @apiError (Error Response (400, 500)) {String} output.error The error message.
 * @apiError (Error Response (400, 500)) {NULL} output.result Always NULL in an error response.
 */

class Sg {
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	static async get(req, res) {
		const connection = new Connection();
		await connection.connect();
		try {
			const result = await Sg._find(connection, req);
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
	 * @param {import('../../class/Connection')} connection
	 * @param {import('express').Request} req
	 */
	static async _find(connection, req) {
		const idsMessage = 'Must be a comma-separated list of ids e.g. 400,500,600.';
		const idsRegex = /^((\d+,)*\d+$|$)/;
		const params = Object.assign({}, req.query);
		const validator = {
			'app_ids': {
				'message': idsMessage,
				'regex': idsRegex,
			},
			'sub_ids': {
				'message': idsMessage,
				'regex': idsRegex,
			},
		};
		Utils.validateParams(params, validator);
		const result = {
			'found': {
				'apps': {},
				'subs': {},
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
				conditions.push(`(${ids.map(id => `g_ts.${type}_id = ${connection.escape(id)}`).join(' OR ')})`);
			}
			const rows = await connection.query(`
				SELECT ${[
					`g_ts.${type}_id`,
					'g_ts.sg_id',
				].join(', ')}
				FROM games__${type}_sg AS g_ts
				${conditions.length > 0 ? `
					WHERE ${conditions.join(' AND ')}
				` : ''}
			`);
			const idsFound = [];
			for (const row of rows) {
				const id = parseInt(row[`${type}_id`]);
				result.found[`${type}s`][id] = row.sg_id;
				idsFound.push(id);
			}
			const idsNotFound = ids.filter(id => !idsFound.includes(id));
			for (const id of idsNotFound) {
				result.not_found[`${type}s`].push(id);
			}
		}
		return result;
	}
}

module.exports = Sg;