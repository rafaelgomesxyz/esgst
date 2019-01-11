<?php

require_once __DIR__.'/../../class/CustomException.php';
require_once __DIR__.'/../../utils/timezones.php';       // set_timezones
require_once __DIR__.'/../../utils/connection.php';      // start_connection
require_once __DIR__.'/app.php';                         // get_app, fetch_app
require_once __DIR__.'/sub.php';                         // get_sub, fetch_sub
require_once __DIR__.'/bundle.php';                      // get_bundle, fetch_bundle

$app->get('/games/{type}/{id}', function ($request, $response, $arguments) {
  global $connection;

  try {
    $filters = $request->getQueryParams();

    return $response->withJson([
      'error' => NULL,
      'result' => get_game_result($arguments, $filters)
    ], 200);
  } catch (CustomException $exception) {
    if (isset($connection) && $connection->inTransaction) {
      $connection->rollback();
    }

    return $response->withJson([
      'error' => $exception->getMessage(),
      'result' => NULL
    ], $exception->getCode());
  }
});

function get_game_result($arguments, $filters) {
  try {
    $type = $arguments['type'];
    $get = 'get_'.$type;
    $fetch = 'fetch_'.$type;

    if (!function_exists($get) || !function_exists($fetch)) {
      throw new CustomException('Invalid {type}. Must be one of the following strings: app, sub, bundle.', 400);
    }

    $id = $arguments['id'];

    if (!preg_match('/^\d+$/', $id)) {
      throw new CustomException('Invalid {id}. Must be an integer number e.g. 400.', 400);
    }

    set_timezones();
    start_connection();

    $result = $get($id, $filters);
    if (!$result) {
      $fetch($id);
      $result = $get($id, $filters);
    }

    return $result;
  } catch (CustomException $exception) {
    throw $exception;
  } catch (Exception $exception) {
    throw CustomException::fromException($exception);
  }
}