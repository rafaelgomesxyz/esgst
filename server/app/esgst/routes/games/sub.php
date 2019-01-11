<?php

require_once __DIR__.'/../../class/CustomException.php';
require_once __DIR__.'/../../class/Request.php';

function get_sub($sub_id) {
  global $connection;
  global $global_timezone;

  $sub = NULL;

  $query = implode(' ', [
    'SELECT '.implode(', ', [
      'g_s.sub',
      'g_s.sub_id',
      'g_sn.name',
      'g_s.released',
      'g_s.removed',
      'g_s.price',
      'g_s.release_date',
      'g_sa_j.apps',
      'g_s.last_update'
    ]),
    'FROM games__sub AS g_s',
    'INNER JOIN games__sub_name AS g_sn',
    'ON g_s.sub_id = g_sn.sub_id',
    'LEFT JOIN (',
      'SELECT g_sa.sub_id, GROUP_CONCAT(DISTINCT g_sa.app_id) AS apps',
      'FROM games__sub_app AS g_sa',
      'GROUP BY g_sa.sub_id',
    ') AS g_sa_j',
    'ON g_s.sub_id = g_sa_j.sub_id',
    'WHERE g_s.sub_id = ?',
    'GROUP BY g_s.sub'
  ]);
  $parameters = [
    $sub_id
  ];
  $statement = $connection->prepare($query);
  $statement->execute($parameters);
  $row = $statement->fetch();

  if ($row) {
    $now = (new DateTime('now', $global_timezone))->getTimestamp();
    $last_update = (new DateTime($row['last_update'], $global_timezone))->getTimestamp();
    $difference_in_seconds = $now - $last_update;

    if ($difference_in_seconds < 60 * 60 * 24 * 7) {    
      $sub = [
        'sub_id' => $row['sub_id'],
        'name' => $row['name'],
        'released' => boolval($row['released']),
        'removed' => boolval($row['removed']),
        'price' => $row['price'],
        'release_date' => $row['release_date'],
        'apps' => $row['apps'] ? array_map(function ($element) { return intval($element); }, explode(',', $row['apps'])) : [],
        'last_update' => $row['last_update']
      ];
    }
  }

  return $sub;
}

function fetch_sub($sub_id) {
  global $connection;
  global $internal_errors;
  global $global_timezone;

  $url = 'https://store.steampowered.com/api/packagedetails?packageids='.$sub_id.'&filters=apps,basic,name,price,release_date&cc=us&l=en';
  $response = Request::fetch($url);
  $json = $response['json'];

  if (!isset($json[$sub_id]['data'])) {
    throw new CustomException($internal_errors['steam'], 500, $response['text']);
  }

  $data = $json[$sub_id]['data'];

  $url = 'https://store.steampowered.com/sub/'.$sub_id.'?cc=us&l=en';
  $options = [
    'cookie' => 'birthtime=0; mature_content=1;'
  ];
  $response = Request::fetch($url, $options);
  $final_url = $response['url'];
  $xpath = $response['xpath'];

  if (!isset($xpath)) {
    throw new CustomException($internal_errors['steam'], 500, $response['text']);
  }

  $sub_name = $data['name'];
  $release_date = $data['release_date'];
  $removed = !preg_match('/store\.steampowered\.com\/sub\/'.$sub_id.'/', $final_url);
  $price = $data['price'];
  $values = [
    'sub_id' => $sub_id,
    'released' => !$release_date['coming_soon'],
    'removed' => $removed,
    'price' => $price ? intval($price['initial']) : 0,
    'release_date' => $release_date['date'] ? (new DateTime($release_date['date']))->format('Y-m-d') : NULL,
    'last_update' => (new DateTime('now', $global_timezone))->format('Y-m-d H:i:s')
  ];
  $apps = $data['apps'] ? array_map(function ($element) { return intval($element['id']); }, $data['apps']) : [];

  $connection->beginTransaction();

  $columns = array_keys($values);
  $query = implode(' ', [
    'INSERT INTO games__sub ('.implode(', ', $columns).')',
    'VALUES ('.implode(', ', array_fill(0, count($values), '?')).')',
    'ON DUPLICATE KEY UPDATE '.implode(', ', array_map(function ($element) { return $element.' = VALUES('.$element.')'; }, $columns))
  ]);
  $parameters = array_values($values);
  $statement = $connection->prepare($query);
  $statement->execute($parameters);

  $query = implode(' ', [
    'INSERT INTO games__sub_name (sub_id, name)',
    'VALUES (?, ?)',
    'ON DUPLICATE KEY UPDATE name = VALUES(name)'
  ]);
  $parameters = [
    $sub_id,
    $sub_name
  ];
  $statement = $connection->prepare($query);
  $statement->execute($parameters);

  $parameters = [];
  if (count($apps) > 0) {
    foreach ($apps as $app_id) {
      $parameters []= $sub_id;
      $parameters []= $app_id;
    }
  }
  $num_parameters = count($parameters);
  if ($num_parameters > 0) {
    $query = implode(' ', [
      'INSERT IGNORE INTO games__sub_app (sub_id, app_id)',
      'VALUES '.implode(', ', array_fill(0, $num_parameters / 2, '(?, ?)'))
    ]);
    $statement = $connection->prepare($query);
    $statement->execute($parameters);
  }

  $connection->commit();
}