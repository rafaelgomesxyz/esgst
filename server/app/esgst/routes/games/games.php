<?php

require_once __DIR__.'/../../class/CustomException.php';
require_once __DIR__.'/../../utils/timezones.php';       // set_timezones
require_once __DIR__.'/../../utils/connection.php';      // start_connection
require_once __DIR__.'/../../utils/filters.php';         // validate_filters
require_once __DIR__.'/app.php';                         // get_app, fetch_app
require_once __DIR__.'/sub.php';                         // get_sub, fetch_sub
require_once __DIR__.'/bundle.php';                      // get_bundle, fetch_bundle

$app->get('/games', function ($request, $response) {
  try {
    $filters = $request->getQueryParams();

    return $response->withJson([
      'error' => NULL,
      'result' => get_games_result($filters)
    ], 200);
  } catch (CustomException $exception) {
    return $response->withJson([
      'error' => $exception->getMessage(),
      'result' => NULL
    ], $exception->getCode());
  }
});

function get_games_result($filters) {
  try {
    $empty_message = 'Must be an empty parameter.';
    $empty_regex = '/^$/';
    $ids_message = 'Must be a comma-separated list of ids e.g. 400,500,600.';
    $ids_regex = '/^(\d+,)*\d+$/';

    $validation = [
      'join_all' => [
        'message' => $emtpy_message,
        'regex' => $empty_regex,
        'conflicts' => [
          'format_array',
          'show_id'
        ]
      ],
      'format_array' => [
        'message' => $empty_message,
        'regex' => $empty_regex,
        'conflicts' => [
          'join_all',
          'show_id'
        ]
      ],
      'show_id' => [
        'message' => $empty_message,
        'regex' => $empty_regex,
        'conflicts' => [
          'join_all',
          'format_array'
        ]
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
        'message' => '',
        'regex' => '/.*/'
      ],
      'sub_filters' => [
        'message' => '',
        'regex' => '/.*/'
      ],
      'bundle_filters' => [
        'message' => '',
        'regex' => '/.*/'
      ]
    ];

    if ($filters) {
      validate_filters($filters, $validation);
    }

    if (isset($filters['join_all'])) {
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
          'app_ids' => [],
          'sub_ids' => [],
          'bundle_ids' => []
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
      $ids = explode(',', $filters[$type.'_ids']);      
      $results = $get($ids, $sub_filters);

      foreach ($results as $current_result) {
        $id = $current_result[$type.'_id'];
        $ids_found []= $id;

        if (isset($filters['join_all'])) {
          $result['found'] []= [ 'type' => $type ] + $current_result;
        } else if (isset($filters['format_array'])) {
          $result['found'][$type.'s'] []= $current_result;
        } else {
          if (!isset($filters['show_id'])) {
            unset($current_result[$type.'_id']);
          }
          $result['found'][$type.'s'][$id] = $current_result;
        }
      }

      $ids_not_found = array_diff($ids, $ids_found);

      foreach ($ids_not_found as $id) {
        if (isset($filters['join_all'])) {
          $result['not_found'] []= [
            'type' => $type,
            $type.'_id' => intval($id)
          ];
        } else {
          $result['not_found'][$type.'_ids'] []= intval($id);
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