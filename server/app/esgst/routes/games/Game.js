const Connection = require('../../class/Connection');
const CustomError = require('../../class/CustomError');
const Utils = require('../../class/Utils');
const App = require('./App');
const Bundle = require('./Bundle');
const Sub = require('./Sub');

/**
 * @api {GET} /game/{type}/{id}[?filters=...] GetGame
 * @apiGroup Games
 * @apiName GetGame
 * @apiDescription Returns information about a game.
 * @apiVersion 1.0.0
 * 
 * @apiParam (Path Parameters) {String=app,sub,bundle} type The type of the game.
 * @apiParam (Path Parameters) {Integer} id The Steam ID of the game.
 * @apiParam (Query Parameters) {String} [filters] A comma-separated list of filters to filter the information requested. The accepted values are all of the optional properties of the object associated with the type of the game ([App](#api-Schemas-App), [Sub](#api-Schemas-Sub) or [Bundle](#api-Schemas-Bundle)), except for properties tagged with [NOT FILTERABLE].
 *
 * @apiSuccess (Success Response (200)) {Object} output
 * @apiSuccess (Success Response (200)) {NULL} output.error Always NULL in a success response.
 * @apiSuccess (Success Response (200)) {[App](#api-Schemas-App)/[Sub](#api-Schemas-Sub)/[Bundle](#api-Schemas-Bundle)/NULL} output.result The information requested, or NULL if it isn't available.
 * 
 * @apiError (Error Response (400, 500)) {Object} output
 * @apiError (Error Response (400, 500)) {String} output.error The error message.
 * @apiError (Error Response (400, 500)) {NULL} output.result Always NULL in an error response.
 */

class Game {
  /**
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   */
  static async get(req, res) {
    const connection = new Connection();
    await connection.connect();
    try {
      const result = await Game._find(connection, req);
      res.status(200)
        .json({
          error: null,
          result,
        });
    } catch (err) {
      console.log(err);
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
    const params = Object.assign({}, req.params);
    const validator = {
      type: {
        message: 'Invalid {type}. Must be one of the following strings: app, sub, bundle.',
        check: type => Game.TYPES.includes(type),
      },
      id: {
        message: 'Invalid {id}. Must be an integer number e.g. 400.',
        regex: /^\d+$/,
        transform: id => parseInt(id),
      },
    };
    Utils.validateParams(params, validator);    
    const ids = [params.id];
    switch (params.type) {
      case 'app': {
        const result = (await App.get(connection, req, ids))[0];
        if (result) {
          return result;
        }
        await App.fetch(connection, params.id);
        return (await App.get(connection, req, ids))[0];
      }
      case 'bundle': {
        const result = (await Bundle.get(connection, req, ids))[0];
        if (result) {
          return result;
        }
        await Bundle.fetch(connection, params.id);
        return (await Bundle.get(connection, req, ids))[0];
      }
      case 'sub': {
        const result = (await Sub.get(connection, req, ids))[0];
        if (result) {
          return result;
        }
        await Sub.fetch(connection, params.id);
        return (await Sub.get(connection, req, ids))[0];
      }
    }
  }
}

Game.TYPES = Object.freeze(['app', 'sub', 'bundle']);

module.exports = Game;