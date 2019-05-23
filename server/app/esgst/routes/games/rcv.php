<?php

require_once __DIR__.'/../../utils/timezones.php';  // set_timezones
require_once __DIR__.'/../../utils/connection.php'; // start_connection
require_once __DIR__.'/../../utils/filters.php';    // validate_filters

/**
 * @api {SCHEMA} RcvApp RcvApp
 * @apiGroup Schemas
 * @apiName RcvApp
 * 
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
 * 
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
 * 
 * @apiVersion 1.0.0
 * 
 * @apiDescription The [RcvApp](#api-Schemas-RcvApp) and [RcvSub](#api-Schemas-RcvSub) objects do not have the respective "app_id" or "sub_id" property if the parameter "show_id" isn't used, as the object keys already represent the Steam IDs of the games, and the "name" property if the parameter "show_name" isn't used.
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
 * 
 * @apiVersion 1.0.0
 * 
 * @apiDescription The [RcvApp](#api-Schemas-RcvApp) and [RcvSub](#api-Schemas-RcvSub) objects do not have the "name" property if the parameter "show_name" isn't used.
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
 * 
 * @apiVersion 1.0.0
 * 
 * @apiDescription Returns information about reduced CV games.
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
$app->get('/games/rcv', function ($request, $response) {
  try {
    $filters = $request->getQueryParams();

    return $response    
      ->withJson([
        'error' => NULL,
        'result' => get_rcv_result($filters)
      ], 200)
    ;
  } catch (CustomException $exception) {
    return $response
      ->withJson([
        'error' => $exception->getMessage(),
        'result' => NULL
      ], $exception->getCode())
    ;
  }
});

function get_rcv_result($filters) {
  try {
    $boolean_message = 'Must be true or false.';
    $boolean_regex = '/^(true|false)$/';
    $ids_message = 'Must be a comma-separated list of ids e.g. 400,500,600.';
    $ids_regex = '/^(\d+,)*\d+$/';
    $date_message = 'Must be a date in the format YYYY-MM-DD.';
    $date_regex = '/^\d{4}-\d{2}-\d{2}$/';

    $validation = [
      'format_array' => [
        'message' => $boolean_message,
        'regex' => $boolean_regex
      ],
      'show_id' => [
        'message' => $boolean_message,
        'regex' => $boolean_regex
      ],
      'show_name' => [
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
      'date_after' => [
        'message' => $date_message,
        'regex' => $date_regex,
        'conflicts' => [
          'date_equal',
          'date_after_or_equal'
        ]
      ],
      'date_after_or_equal' => [
        'message' => $date_message,
        'regex' => $date_regex,
        'conflicts' => [
          'date_equal',
          'date_after'
        ]
      ],
      'date_before' => [
        'message' => $date_message,
        'regex' => $date_regex,
        'conflicts' => [
          'date_equal',
          'date_before_or_equal'
        ]
      ],
      'date_before_or_equal' => [
        'message' => $date_message,
        'regex' => $date_regex,
        'conflicts' => [
          'date_equal',
          'date_before'
        ]
      ],
      'date_equal' => [
        'message' => $date_message,
        'regex' => $date_regex,
        'conflicts' => [
          'date_after',
          'date_before'
        ]
      ]
    ];
    
    if ($filters) {
      validate_filters($filters, $validation);

      if ($filters['format_array'] === 'true') {
        $filters['format_array'] = TRUE;
        $filters['show_id'] = FALSE;
      } else if ($filters['show_id'] === 'true') {
        $filters['show_id'] = TRUE;
        $filters['format_array'] = FALSE;
      } else {
        $filters['format_array'] = FALSE;
        $filters['show_id'] = FALSE;
      }
      if ($filters['show_name'] === 'true') {
        $filters['show_name'] = TRUE;
      } else {
        $filters['show_name'] = FALSE;
      }
    }

    return get_rcv($filters);
  } catch (CustomException $exception) {
    throw $exception;
  } catch (Exception $exception) {
    throw CustomException::fromException($exception);
  }
}

function get_rcv($filters) {
  global $connection;
  global $server_timezone;
  global $global_timezone;

  $result = [
    'found' => [
      'apps' => [],
      'subs' => []
    ],
    'not_found' => [
      'apps' => [],
      'subs' => []
    ],
    'last_update' => NULL
  ];

  set_timezones();
  start_connection();  

  foreach (['app', 'sub'] as $type) {
    if (isset($filters[$type.'_ids']) && !$filters[$type.'_ids']) {
      continue;
    }

    $ids = array_map(function ($element) { return intval($element); }, explode(',', $filters[$type.'_ids']));

    $query = implode(' ', [
      'SELECT '.implode(', ', array_filter([
        'g_tr.'.$type.'_id',
        $filters['show_name'] ? 'g_tn.name' : NULL,
        'g_tr.effective_date',
        'g_tr.added_date'
      ])),
      'FROM games__'.$type.'_rcv AS g_tr',
      'INNER JOIN games__'.$type.'_name AS g_tn',
      'ON g_tr.'.$type.'_id = g_tn.'.$type.'_id'
    ]);
    if ($filters) {
      $conditions = [];
      $parameters = [];
      if ($filters[$type.'_ids']) {
        $conditions []= '('.implode(' OR ', array_fill(0, count($ids), 'g_tr.'.$type.'_id = ?')).')';
        $parameters = array_merge($parameters, $ids);
      }
      if ($filters['date_equal']) {
        $conditions []= 'g_tr.effective_date = ?';
        $parameters []= $filters['date_equal'];
      }
      if ($filters['date_after']) {
        $conditions []= 'g_tr.effective_date > ?';
        $parameters []= $filters['date_after'];
      }
      if ($filters['date_after_or_equal']) {
        $conditions []= 'g_tr.effective_date >= ?';
        $parameters []= $filters['date_after_or_equal'];
      }
      if ($filters['date_before']) {
        $conditions []= 'g_tr.effective_date < ?';
        $parameters []= $filters['date_before'];
      }
      if ($filters['date_before_or_equal']) {
        $conditions []= 'g_tr.effective_date <= ?';
        $parameters []= $filters['date_before_or_equal'];
      }
      if ($conditions) {
        $query .= ' WHERE '.implode(' AND ', $conditions);
      }
      $statement = $connection->prepare($query);
      $statement->execute($parameters);
    } else {
      $statement = $connection->query($query);
    }

    $ids_found = [];

    while ($row = $statement->fetch()) {
      $id = intval($row[$type.'_id']);
      $ids_found []= $id;

      $values = [];
      if ($filters['show_id'] || $filters['format_array']) {
        $values[$type.'_id'] = $id;
      }
      if ($row['name']) {
        $values['name'] = $row['name'];
      }
      $values['effective_date'] = $row['effective_date'];
      $values['added_date'] = $row['added_date'];
      if ($filters['format_array']) {
        $result['found'][$type.'s'] []= $values;
      } else {
        $result['found'][$type.'s'][$row[$type.'_id']] = $values;
      }
    }

    $ids_not_found = array_diff($ids, $ids_found);

    foreach ($ids_not_found as $id) {
      $result['not_found'][$type.'s'] []= $id;
    }
  }

  $query = 'SHOW TABLE STATUS WHERE Name = "games__app_rcv" OR Name = "games__sub_rcv"';
  $statement = $connection->query($query);
  while ($row = $statement->fetch()) {
    if ($row['Update_time']) {
      $date = new DateTime($row['Update_time'], $server_timezone);
      $date->setTimeZone($global_timezone);
      $result['last_update'] = $date->format('Y-m-d H:i:s');
      break;
    }
  }

  return $result;  
}