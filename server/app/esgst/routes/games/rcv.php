<?php

require_once __DIR__.'/../../utils/timezones.php';  // set_timezones
require_once __DIR__.'/../../utils/connection.php'; // start_connection

$app->get('/games/rcv', function ($request, $response) {
  try {
    return $response->withJson([
      'error' => NULL,
      'result' => get_rcv_result()
    ], 200);
  } catch (CustomException $exception) {
    return $response->withJson([
      'error' => $exception->getMessage(),
      'result' => NULL
    ], $exception->getCode());
  }
});

function get_rcv_result() {
  global $connection;
  global $server_timezone;
  global $global_timezone;

  $result = [
    'app' => [],
    'sub' => [],
    'last_update' => NULL
  ];

  set_timezones();
  start_connection();  

  foreach (['app', 'sub'] as $type) {
    $query = implode(' ', [
      'SELECT '.implode(', ', [
        'g_tr.'.$type.'_id',
        'g_tn.name',
        'g_tr.date'
      ]),
      'FROM games__'.$type.'_rcv AS g_tr',
      'INNER JOIN games__'.$type.'_name AS g_tn',
      'ON g_tr.'.$type.'_id = g_tn.'.$type.'_id'
    ]);
    $statement = $connection->query($query);
    while ($row = $statement->fetch()) {
      $result[$type][$row[$type.'_id']] = [
        'name' => $row['name'],
        'date' => $row['date'],
      ];
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