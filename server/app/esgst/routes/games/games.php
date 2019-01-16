<?php

require_once __DIR__.'/../../class/CustomException.php';
require_once __DIR__.'/../../utils/timezones.php';       // set_timezones
require_once __DIR__.'/../../utils/connection.php';      // start_connection
require_once __DIR__.'/../../utils/filters.php';         // validate_filters
require_once __DIR__.'/app.php';                         // get_apps, fetch_app
require_once __DIR__.'/sub.php';                         // get_subs, fetch_sub
require_once __DIR__.'/bundle.php';                      // get_bundles, fetch_bundle

/**
 * @api {SCHEMA} GamesSeparated GamesSeparated
 * @apiGroup Schemas
 * @apiName GamesSeparated
 * 
 * @apiVersion 1.0.0
 * 
 * @apiDescription The [App](#api-Schemas-App), [Sub](#api-Schemas-Sub) and [Bundle](#api-Schemas-Bundle) objects from the "found" object do not have the respective "app_id", "sub_id" or "bundle_id" property if the parameter "show_id" isn't used, as the object keys already represent the Steam IDs of the games.
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
 * 
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
 * 
 * @apiVersion 1.0.0
 * 
 * @apiDescription The [App](#api-Schemas-App), [Sub](#api-Schemas-Sub) and [Bundle](#api-Schemas-Bundle) objects from the "found" object have the additional "type" property, to help separate them. The [App](#api-Schemas-App), [Sub](#api-Schemas-Sub) and [Bundle](#api-Schemas-Bundle) objects from the "not_found" object only have the "type" and the respective "app_id", "sub_id" or "bundle_id" properties.
 * 
 * @apiParam (Schema) {Object} result
 * @apiParam (Schema) {Array} result.found An array of [App](#api-Schemas-App), [Sub](#api-Schemas-Sub) and [Bundle](#api-Schemas-Bundle) objects for the games that were found.
 * @apiParam (Schema) {Array} result.not_found An array of [App](#api-Schemas-App), [Sub](#api-Schemas-Sub) and [Bundle](#api-Schemas-Bundle) objects for the games that were not found.
 * 
 * @apiSampleRequest off
 */

/**
 * @api {GET} /games[?join_all=...&format_array=...&show_id=...&app_ids=...&sub_ids=...&bundle_ids=...&app_filters=...&sub_filters=...&bundle_filters=...] GetGames
 * @apiGroup Games
 * @apiName GetGames
 * 
 * @apiVersion 1.0.0
 * 
 * @apiDescription Returns information about multiple games.
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
$app->get('/games', function ($request, $response) {
  try {
    $filters = $request->getQueryParams();

    return $response
      ->withHeader('Access-Control-Allow-Origin', '*')
      ->withJson([
        'error' => NULL,
        'result' => get_games_result($filters)
      ], 200)
    ;
  } catch (CustomException $exception) {
    return $response      
      ->withHeader('Access-Control-Allow-Origin', '*')
      ->withJson([
        'error' => $exception->getMessage(),
        'result' => NULL
      ], $exception->getCode())
    ;
  }
});

function get_games_result($filters) {
  try {
    $boolean_message = 'Must be true or false.';
    $boolean_regex = '/^(true|false)$/';
    $ids_message = 'Must be a comma-separated list of ids e.g. 400,500,600.';
    $ids_regex = '/^((\d+,)*\d+$|$)/';
    $filters_message = '';
    $filters_regex = '/.*/';

    $validation = [
      'join_all' => [
        'message' => $boolean_message,
        'regex' => $boolean_regex
      ],
      'format_array' => [
        'message' => $boolean_message,
        'regex' => $boolean_regex
      ],
      'show_id' => [
        'message' => $boolean_message,
        'regex' => $boolean_regex
      ],
      'app_ids' => [
        'message' => $ids_message,
        'regex' => $ids_regex
      ],
      'sub_ids' => [
        'message' => $ids_message,
        'regex' => $ids_regex
      ],
      'bundle_ids' => [
        'message' => $ids_message,
        'regex' => $ids_regex
      ],
      'app_filters' => [
        'message' => $filters_message,
        'regex' => $filters_regex
      ],
      'sub_filters' => [
        'message' => $filters_message,
        'regex' => $filters_regex
      ],
      'bundle_filters' => [
        'message' => $filters_message,
        'regex' => $filters_regex
      ]
    ];

    if ($filters) {
      validate_filters($filters, $validation);

      if ($filters['join_all'] === 'true') {
        $filters['join_all'] = TRUE;
        $filters['format_array'] = FALSE;
        $filters['show_id'] = FALSE;
      } else if ($filters['format_array'] === 'true') {
        $filters['format_array'] = TRUE;
        $filters['join_all'] = FALSE;
        $filters['show_id'] = FALSE;
      } else if ($filters['show_id'] === 'true') {
        $filters['show_id'] = TRUE;
        $filters['join_all'] = FALSE;
        $filters['format_array'] = FALSE;
      } else {
        $filters['join_all'] = FALSE;
        $filters['format_array'] = FALSE;
        $filters['show_id'] = FALSE;
      }
    }

    if ($filters['join_all']) {
      $result = [
        'found' => [],
        'not_found' => []
      ];
    } else {
      $result = [
        'found' => [
          'apps' => [],
          'subs' => [],
          'bundles' => []
        ],
        'not_found' => [
          'apps' => [],
          'subs' => [],
          'bundles' => []
        ]
      ];
    }


    set_timezones();
    start_connection();

    foreach (['app', 'sub', 'bundle'] as $type) {
      if (!$filters[$type.'_ids']) {
        continue;
      }

      $ids_found = [];

      $sub_filters = isset($filters[$type.'_filters']) ? [
        $type.'_filters' => $filters[$type.'_filters']
      ] : NULL;

      $get = 'get_'.$type.'s';
      $ids = array_map(function ($element) { return intval($element); }, explode(',', $filters[$type.'_ids']));      
      $results = $get($ids, $sub_filters);

      foreach ($results as $current_result) {
        $id = $current_result[$type.'_id'];
        $ids_found []= $id;

        if ($filters['join_all']) {
          $result['found'] []= [ 'type' => $type ] + $current_result;
        } else if ($filters['format_array']) {
          $result['found'][$type.'s'] []= $current_result;
        } else {
          if (!$filters['show_id']) {
            unset($current_result[$type.'_id']);
          }
          $result['found'][$type.'s'][$id] = $current_result;
        }
      }

      $ids_not_found = array_diff($ids, $ids_found);

      foreach ($ids_not_found as $id) {
        if ($filters['join_all']) {
          $result['not_found'] []= [
            'type' => $type,
            $type.'_id' => $id
          ];
        } else {
          $result['not_found'][$type.'s'] []= $id;
        }
      }
    }

    return $result;
  } catch (CustomException $exception) {
    throw $exception;
  } catch (Exception $exception) {
    throw CustomException::fromException($exception);
  }
}