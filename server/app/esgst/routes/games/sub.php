<?php

require_once __DIR__.'/../../class/CustomException.php';
require_once __DIR__.'/../../class/Request.php';
require_once __DIR__.'/../../utils/filters.php';         // validate_filters

/**
 * @api {SCHEMA} Sub Sub
 * @apiGroup Schemas
 * @apiName Sub
 * 
 * @apiVersion 1.0.0
 * 
 * @apiDescription The optional properties are included based on the "filters" parameter.  If the parameter isn't used, all of the optional properties are included, except where noted.
 * 
 * @apiParam (Schema) {Object} sub
 * @apiParam (Schema) {String=sub} [sub.type=sub] [NOT FILTERABLE] The type of the game. This property is only available for the [GetGames](#api-Games-GetGames) method when used with the parameter "join_all".
 * @apiParam (Schema) {Integer} [sub.sub_id] [NOT FILTERABLE] The Steam ID of the game. This property is not available for the [GetGames](#api-Games-GetGames) method when used without the "join_all", "format_array" and "show_id" parameters.
 * @apiParam (Schema) {String} [sub.name] The name of the game.
 * @apiParam (Schema) {Boolean} [sub.released] Whether the game has been released to the Steam store or not.
 * @apiParam (Schema) {Boolean} [sub.removed] Whether the game has been removed from the Steam store or not.
 * @apiParam (Schema) {Integer} [sub.price] The price of the game in USD ($9.99 is represented as 999), or 0 if it's free.
 * @apiParam (Schema) {String/NULL} [sub.release_date] When the game was released or is going to be released in the format YYYY-MM-DD, or NULL if there's no release date.
 * @apiParam (Schema) {Integer[]} [sub.apps] The Steam IDs of the apps that are included in the game.
 * @apiParam (Schema) {String} sub.last_update When the information was last updated in the format YYYY/MM/DD HH:mm:SS (UTC timezone).
 * 
 * @apiSampleRequest off
 */

function get_subs($parameters, $filters) {
  global $connection;
  global $global_timezone;

  $columns = [
    'name' => 'g_sn.name',
    'released' => 'g_s.released',
    'removed' => 'g_s.removed',
    'price' => 'g_s.price',
    'release_date' => 'g_s.release_date',
    'apps' => 'g_sa_j.apps'
  ];
  $column_keys = array_keys($columns);

  $filter_name = isset($filters['filters']) ? 'filters' : 'sub_filters';
  $validation = [
    $filter_name => [
      'message' => 'Must be a comma-separated list containing the following values: '.implode(', ', $column_keys),
      'regex' => '/^((('.implode('|', $column_keys).'),?)+)?$/'
    ]
  ];

  if ($filters) {
    validate_filters($filters, $validation);
    
    $filter_keys = explode(',', $filters[$filter_name]);
    foreach ($column_keys as $key) {
      if (!in_array($key, $filter_keys)) {
        unset($columns[$key]);
      }
    }
  }

  $subs = [];

  $query = implode(' ', array_filter(
    array_merge(
      [
        'SELECT '.implode(', ', array_merge(
          [
            'g_s.sub_id',
            'g_s.last_update'
          ],
          array_values($columns)
        )),
        'FROM games__sub AS g_s'
      ],
      isset($columns['name']) ? [
        'INNER JOIN games__sub_name AS g_sn',
        'ON g_s.sub_id = g_sn.sub_id'
      ] : [
        NULL
      ],
      isset($columns['apps']) ? [
        'LEFT JOIN (',
          'SELECT g_sa.sub_id, GROUP_CONCAT(DISTINCT g_sa.app_id) AS apps',
          'FROM games__sub_app AS g_sa',
          'GROUP BY g_sa.sub_id',
        ') AS g_sa_j',
        'ON g_s.sub_id = g_sa_j.sub_id'
      ] : [
        NULL
      ],
      [
        'WHERE '.implode(' OR ', array_fill(0, count($parameters), 'g_s.sub_id = ?')),
        'GROUP BY g_s.sub_id'
      ]
    )
  ));
  $statement = $connection->prepare($query);
  $statement->execute($parameters);

  $now = (new DateTime('now', $global_timezone))->getTimestamp();
  while ($row = $statement->fetch()) {
    $last_update = (new DateTime($row['last_update'], $global_timezone))->getTimestamp();
    $difference_in_seconds = $now - $last_update;

    if ($difference_in_seconds < 60 * 60 * 24 * 7) {    
      $sub = [
        'sub_id' => $row['sub_id']
      ];
      if (isset($columns['name'])) {
        $sub['name'] = $row['name'];
      }
      if (isset($columns['released'])) {
        $sub['released'] = boolval($row['released']);
      }
      if (isset($columns['removed'])) {
        $sub['removed'] = boolval($row['removed']);
      }
      if (isset($columns['price'])) {
        $sub['price'] = $row['price'];
      }
      if (isset($columns['release_date'])) {
        $sub['release_date'] = $row['release_date'];
      }
      if (isset($columns['apps'])) {
        $sub['apps'] = $row['apps'] ? array_map(function ($element) { return intval($element); }, explode(',', $row['apps'])) : [];
      }
      $sub['last_update'] = $row['last_update'];
      $subs []= $sub;
    }
  }

  return $subs;
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
    'INSERT IGNORE INTO games__sub_name (sub_id, name)',
    'VALUES (?, ?)'
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