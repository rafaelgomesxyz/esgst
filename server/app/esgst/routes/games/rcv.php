<?php

require_once __DIR__.'/../../utils/timezones.php';  // set_timezones
require_once __DIR__.'/../../utils/connection.php'; // start_connection
require_once __DIR__.'/../../utils/filters.php';    // validate_filters

$app->get('/games/rcv', function ($request, $response) {
  try {
    $filters = $request->getQueryParams();

    return $response->withJson([
      'error' => NULL,
      'result' => get_rcv_result($filters)
    ], 200);
  } catch (CustomException $exception) {
    return $response->withJson([
      'error' => $exception->getMessage(),
      'result' => NULL
    ], $exception->getCode());
  }
});

function get_rcv_result($filters) {
  try {
    $empty_message = 'Must be an empty parameter.';
    $empty_regex = '/^$/';
    $ids_message = 'Must be a comma-separated list of ids e.g. 400,500,600.';
    $ids_regex = '/^(\d+,)*\d+$/';
    $date_message = 'Must be a date in the format YYYY-MM-DD.';
    $date_regex = '/^\d{4}-\d{2}-\d{2}$/';

    $validation = [
      'format_array' => [
        'message' => $empty_message,
        'regex' => $empty_regex,
        'conflicts' => [
          'show_id'
        ]
      ],
      'show_id' => [
        'message' => $empty_message,
        'regex' => $empty_regex,
        'conflicts' => [
          'format_array'
        ]
      ],
      'show_name' => [
        'message' => $empty_message,
        'regex' => $empty_regex
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
    'apps' => [],
    'subs' => [],
    'last_update' => NULL
  ];

  set_timezones();
  start_connection();  

  foreach (['app', 'sub'] as $type) {
    if (isset($filters[$type.'_ids']) && !$filters[$type.'_ids']) {
      continue;
    }

    $query = implode(' ', [
      'SELECT '.implode(', ', array_filter([
        'g_tr.'.$type.'_id',
        $filters && isset($filters['show_name']) ? 'g_tn.name' : NULL,
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
        $ids = array_map(function ($element) { return intval($element); }, explode(',', $filters[$type.'_ids']));
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
    while ($row = $statement->fetch()) {
      $values = [];
      if (isset($filters['show_id']) || isset($filters['format_array'])) {
        $values[$type.'_id'] = intval($row[$type.'_id']);
      }
      if ($row['name']) {
        $values['name'] = $row['name'];
      }
      $values['effective_date'] = $row['effective_date'];
      $values['added_date'] = $row['added_date'];
      if (isset($filters['format_array'])) {
        $result[$type.'s'] []= $values;
      } else {
        $result[$type.'s'][$row[$type.'_id']] = $values;
      }
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