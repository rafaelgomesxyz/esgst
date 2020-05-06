const Connection = require('../../class/Connection');
const CustomError = require('../../class/CustomError');
const Utils = require('../../class/Utils');
const App = require('./App');
const Bundle = require('./Bundle');
const Game = require('./Game');
const Sub = require('./Sub');

/**
 * @api {SCHEMA} GamesSeparated GamesSeparated
 * @apiGroup Schemas
 * @apiName GamesSeparated
 * @apiDescription The [App](#api-Schemas-App), [Sub](#api-Schemas-Sub) and [Bundle](#api-Schemas-Bundle) objects from the "found" object do not have the respective "app_id", "sub_id" or "bundle_id" property if the parameter "show_id" isn't used, as the object keys already represent the Steam IDs of the games.
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} result
 * @apiParam (Schema) {Object} result.found
 * @apiParam (Schema) {Object} result.found.apps An object of [App](#api-Schemas-App) objects for the apps that were found, with their Steam IDs as the keys.
 * @apiParam (Schema) {Object} result.found.subs An object of [Sub](#api-Schemas-Sub) objects for the subs that were found, with their Steam IDs as the keys.
 * @apiParam (Schema) {Object} result.found.bundles An object of [Bundle](#api-Schemas-Bundle) objects for the bundles that were found, with their Steam IDs as the keys.
 * @apiParam (Schema) {Object} result.not_found
 * @apiParam (Schema) {Integer[]} result.not_found.apps The Steam IDs of the apps that were not found.
 * @apiParam (Schema) {Integer[]} result.not_found.subs The Steam IDs of the subs that were not found.
 * @apiParam (Schema) {Integer[]} result.not_found.bundles The Steam IDs of the bundles that were not found.
 *
 * @apiSampleRequest off
 */

/**
 * @api {SCHEMA} GamesSeparatedArray GamesSeparatedArray
 * @apiGroup Schemas
 * @apiName GamesSeparatedArray
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} result
 * @apiParam (Schema) {Object} result.found
 * @apiParam (Schema) {[App](#api-Schemas-App)[]} result.found.apps The apps that were found.
 * @apiParam (Schema) {[Sub](#api-Schemas-Sub)[]} result.found.subs The subs that were found.
 * @apiParam (Schema) {[Bundle](#api-Schemas-Bundle)[]} result.found.bundles The bundles that were found.
 * @apiParam (Schema) {Object} result.not_found
 * @apiParam (Schema) {Integer[]} result.not_found.apps The Steam IDs of the apps that were not found.
 * @apiParam (Schema) {Integer[]} result.not_found.subs The Steam IDs of the subs that were not found.
 * @apiParam (Schema) {Integer[]} result.not_found.bundles The Steam IDs of the bundles that were not found.
 *
 * @apiSampleRequest off
 */

/**
 * @api {SCHEMA} GamesJoined GamesJoined
 * @apiGroup Schemas
 * @apiName GamesJoined
 * @apiDescription The [App](#api-Schemas-App), [Sub](#api-Schemas-Sub) and [Bundle](#api-Schemas-Bundle) objects from the "found" object have the additional "type" property, to help separate them. The [App](#api-Schemas-App), [Sub](#api-Schemas-Sub) and [Bundle](#api-Schemas-Bundle) objects from the "not_found" object only have the "type" and the respective "app_id", "sub_id" or "bundle_id" properties.
 * @apiVersion 1.0.0
 *
 * @apiParam (Schema) {Object} result
 * @apiParam (Schema) {Array} result.found An array of [App](#api-Schemas-App), [Sub](#api-Schemas-Sub) and [Bundle](#api-Schemas-Bundle) objects for the games that were found.
 * @apiParam (Schema) {Array} result.not_found An array of [App](#api-Schemas-App), [Sub](#api-Schemas-Sub) and [Bundle](#api-Schemas-Bundle) objects for the games that were not found.
 *
 * @apiSampleRequest off
 */

/**
 * @api {GET} /games GetGames
 * @apiGroup Games
 * @apiName GetGames
 * @apiDescription Returns information about multiple games.
 * @apiVersion 1.0.0
 *
 * @apiParam (Query Parameters) {Boolean} [join_all] If true, the result is a [GamesJoined](#api-Schemas-GamesJoined) object. If false, the format of the result depends on the "format_array" parameter.
 * @apiParam (Query Parameters) {Boolean} [format_array] If true, the result is a [GamesSeparatedArray](#api-Schemas-GamesSeparatedArray) object. If false, the result is a [GamesSeparated](#api-Schemas-GamesSeparated) object.
 * @apiParam (Query Parameters) {Boolean} [show_id] If false, the [App](#api-Schemas-App), [Sub](#api-Schemas-Sub) and [Bundle](#api-Schemas-Bundle) objects from the "found" object do not have the respective "app_id", "sub_id" or "bundle_id" property.
 * @apiParam (Query Parameters) {String} [app_ids] A comma-separated list of Steam IDs for the apps requested.
 * @apiParam (Query Parameters) {String} [sub_ids] A comma-separated list of Steam IDs for the subs requested.
 * @apiParam (Query Parameters) {String} [bundle_ids] A comma-separated list of Steam IDs for the bundles requested.
 * @apiParam (Query Parameters) {String} [app_filters] A comma-separated list of filters to filter the apps requested. The accepted values are all of the optional properties of the [App](#api-Schemas-App) object, except for properties tagged with [NOT FILTERABLE].
 * @apiParam (Query Parameters) {String} [sub_filters] A comma-separated list of filters to filter the subs requested. The accepted values are all of the optional properties of the [Sub](#api-Schemas-Sub) object, except for properties tagged with [NOT FILTERABLE].
 * @apiParam (Query Parameters) {String} [bundle_filters] A comma-separated list of filters to filter the bundles requested. The accepted values are all of the optional properties of the [Bundle](#api-Schemas-Bundle) object, except for properties tagged with [NOT FILTERABLE].
 *
 * @apiSuccess (Success Response (200)) {Object} output
 * @apiSuccess (Success Response (200)) {NULL} output.error Always NULL in a success response.
 * @apiSuccess (Success Response (200)) {[GamesSeparated](#api-Schemas-GamesSeparated)/[GamesSeparatedArray](#api-Schemas-GamesSeparatedArray)/[GamesJoined](#api-Schemas-GamesJoined)} output.result The information requested.
 *
 * @apiError (Error Response (400, 500)) {Object} output
 * @apiError (Error Response (400, 500)) {String} output.error The error message.
 * @apiError (Error Response (400, 500)) {NULL} output.result Always NULL in an error response.
 */

class Games {
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	static async get(req, res) {
		const connection = new Connection();
		await connection.connect();
		try {
			const result = await Games._find(connection, req);
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
		const booleanMessage = 'Must be true or false.';
		const booleanRegex = /^(true|false|1|0|)$/i;
		const trueBooleanRegex = /^(true|1|)$/i
		const idsMessage = 'Must be a comma-separated list of ids e.g. 400,500,600.';
		const idsRegex = /^((\d+,)*\d+$|$)/;
		const filtersMessage = '';
		const filtersRegex = /.*/;
		const params = Object.assign({}, req.query);
		const validator = {
			'join_all': {
				'message': booleanMessage,
				'regex': booleanRegex,
			},
			'format_array': {
				'message': booleanMessage,
				'regex': booleanRegex,
			},
			'show_id': {
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
			'bundle_ids': {
				'message': idsMessage,
				'regex': idsRegex,
			},
			'app_filters': {
				'message': filtersMessage,
				'regex': filtersRegex,
			},
			'sub_filters': {
				'message': filtersMessage,
				'regex': filtersRegex,
			},
			'bundle_filters': {
				'message': filtersMessage,
				'regex': filtersRegex,
			},
		};
		Utils.validateParams(params, validator);
		if (typeof params.join_all !== 'undefined' && params.join_all.match(trueBooleanRegex)) {
			params.join_all = true;
			params.format_array = false;
			params.show_id = false;
		} else if (typeof params.format_array !== 'undefined' && params.format_array.match(trueBooleanRegex)) {
			params.format_array = true;
			params.join_all = false;
			params.show_id = false;
		} else if (typeof params.show_id !== 'undefined' && params.show_id.match(trueBooleanRegex)) {
			params.show_id = true;
			params.join_all = false;
			params.format_array = false;
		} else {
			params.join_all = false;
			params.format_array = false;
			params.show_id = false;
		}
		let result;
		if (params.join_all) {
			result = {
				'found': [],
				'not_found': [],
			};
		} else {
			result = {
				'found': {
					'apps': params.format_array ? [] : {},
					'subs': params.format_array ? [] : {},
					'bundles': params.format_array ? [] : {},
				},
				'not_found': {
					'apps': [],
					'subs': [],
					'bundles': [],
				}
			};
		}
		for (const type of Game.TYPES) {
			if (!params[`${type}_ids`]) {
				continue;
			}
			const ids = params[`${type}_ids`].split(',').map(id => parseInt(id));
			let items;
			switch (type) {
				case 'app': {
					items = await App.get(connection, req, ids);
					break;
				}
				case 'bundle': {
					items = await Bundle.get(connection, req, ids);
					break;
				}
				case 'sub': {
					items = await Sub.get(connection, req, ids);
					break;
				}
			}
			const idsFound = [];
			for (const item of items) {
				const id = item[`${type}_id`];
				if (params.join_all) {
					result.found.push({
						type,
						...item,
					});
				} else if (params.format_array) {
					result.found[`${type}s`].push(item);
				} else {
					if (!params.show_id) {
						delete item[`${type}_id`];
					}
					result.found[`${type}s`][id] = item;
				}
				idsFound.push(parseInt(id));
			}
			const idsNotFound = ids.filter(id => !idsFound.includes(id));
			for (const id of idsNotFound) {
				if (params.join_all) {
					result.not_found.push({
						type,
						[`${type}_id`]: id,
					});
				} else {
					result.not_found[`${type}s`].push(id);
				}
			}
		}
		return result;
	}
}

module.exports = Games;