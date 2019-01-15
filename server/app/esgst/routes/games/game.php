<?php

require_once __DIR__.'/../../class/CustomException.php';
require_once __DIR__.'/../../utils/timezones.php';       // set_timezones
require_once __DIR__.'/../../utils/connection.php';      // start_connection
require_once __DIR__.'/app.php';                         // get_apps, fetch_app
require_once __DIR__.'/sub.php';                         // get_subs, fetch_sub
require_once __DIR__.'/bundle.php';                      // get_bundles, fetch_bundle

/**
 * @api {GET} /game/{type}/{id}[?filters=...] GetGame
 * @apiGroup Games
 * @apiName GetGame
 * 
 * @apiVersion 1.0.0
 * 
 * @apiDescription Returns information about a game.
 * 
 * @apiParam (Path Parameters) {String=app,sub,bundle} type The type of the game.
 * @apiParam (Path Parameters) {Integer} id The Steam ID of the game.
 * 
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
$app->get('/game/{type}/{id}', function ($request, $response, $arguments) {
  global $connection;

  try {
    $filters = $request->getQueryParams();

    return $response    
      ->withHeader('Access-Control-Allow-Origin', '*')
      ->withJson([
        'error' => NULL,
        'result' => get_game_result($arguments, $filters)
      ], 200)
    ;
  } catch (CustomException $exception) {
    if (isset($connection) && $connection->inTransaction) {
      $connection->rollback();
    }

    return $response
      ->withHeader('Access-Control-Allow-Origin', '*')
      ->withJson([
        'error' => $exception->getMessage(),
        'result' => NULL
      ], $exception->getCode())
    ;
  }
});

function get_game_result($arguments, $filters) {
  try {
    $type = $arguments['type'];
    $get = 'get_'.$type.'s';
    $fetch = 'fetch_'.$type;

    if (!function_exists($get) || !function_exists($fetch)) {
      throw new CustomException('Invalid {type}. Must be one of the following strings: app, sub, bundle.', 400);
    }

    $id = $arguments['id'];

    if (!preg_match('/^\d+$/', $id)) {
      throw new CustomException('Invalid {id}. Must be an integer number e.g. 400.', 400);
    }

    $id = intval($id);

    set_timezones();
    start_connection();

    $ids = [
      $id
    ];
    $result = $get($ids, $filters)[0];
    if (!$result) {
      $fetch($id);
      $result = $get($ids, $filters)[0];
    }

    return $result;
  } catch (CustomException $exception) {
    throw $exception;
  } catch (Exception $exception) {
    throw CustomException::fromException($exception);
  }
}