<?php

require_once __DIR__.'/../../class/CustomException.php';
require_once __DIR__.'/../../class/Request.php';
require_once __DIR__.'/../../utils/filters.php';         // validate_filters

function get_bundle($bundle_id, $filters) {
  global $connection;
  global $global_timezone;

  $columns = [
    'name' => 'g_bn.name',
    'removed' => 'g_b.removed',
    'apps' => 'g_ba_j.apps'
  ];
  $column_keys = array_keys($columns);

  $validation = [
    'filters' => [
      'message' => 'Must be a comma-separated list containing the following values: '.implode(', ', $column_keys),
      'regex' => '/^((('.implode('|', $column_keys).'),?)+)?$/'
    ]
  ];

  validate_filters($filters, $validation);

  if ($filters) {
    $filter_keys = explode(',', $filters['filters']);
    foreach ($column_keys as $key) {
      if (!in_array($key, $filter_keys)) {
        unset($columns[$key]);
      }
    }
  }

  $bundle = NULL;

  $query = implode(' ', array_filter(
    array_merge(
      [
        'SELECT '.implode(', ', array_merge(
          [
            'g_b.bundle',
            'g_b.bundle_id',
            'g_b.last_update'
          ],
          array_values($columns)
        )),
        'FROM games__bundle AS g_b'
      ],
      isset($columns['name']) ? [
        'INNER JOIN games__bundle_name AS g_bn',
        'ON g_b.bundle_id = g_bn.bundle_id'
      ] : [
        NULL
      ],
      isset($columns['apps']) ? [
        'LEFT JOIN (',
          'SELECT g_ba.bundle_id, GROUP_CONCAT(DISTINCT g_ba.app_id) AS apps',
          'FROM games__bundle_app AS g_ba',
          'GROUP BY g_ba.bundle_id',
        ') AS g_ba_j',
        'ON g_b.bundle_id = g_ba_j.bundle_id'
      ]: [
        NULL
      ],
      [
        'WHERE g_b.bundle_id = ?',
        'GROUP BY g_b.bundle'
      ]
    )
  ));
  $parameters = [
    $bundle_id
  ];
  $statement = $connection->prepare($query);
  $statement->execute($parameters);
  $row = $statement->fetch();

  if ($row) {
    $now = (new DateTime('now', $global_timezone))->getTimestamp();
    $last_update = (new DateTime($row['last_update'], $global_timezone))->getTimestamp();
    $difference_in_seconds = $now - $last_update;

    if ($difference_in_seconds < 60 * 60 * 24 * 7) {        
      $bundle = [
        'bundle_id' => $row['bundle_id']
      ];
      if (isset($columns['name'])) {
        $bundle['name'] = $row['name'];
      }
      if (isset($columns['removed'])) {
        $bundle['removed'] = boolval($row['removed']);
      }
      if (isset($columns['apps'])) {
        $bundle['apps'] = $row['apps'] ? array_map(function ($element) { return intval($element); }, explode(',', $row['apps'])) : [];
      }
      $bundle['last_update'] = $row['last_update'];
    }
  }

  return $bundle;
}

function fetch_bundle($bundle_id) {
  global $connection;
  global $internal_errors;
  global $global_timezone;

  $url = 'https://store.steampowered.com/bundle/'.$bundle_id.'?cc=us&l=en';
  $options = [
    'cookie' => 'birthtime=0; mature_content=1;'
  ];
  $response = Request::fetch($url, $options);
  $final_url = $response['url'];
  $xpath = $response['xpath'];

  if (!isset($xpath)) {
    throw new CustomException($internal_errors['steam'], 500, $response['text']);
  }

  $removed = !preg_match('/store\.steampowered\.com\/bundle\/'.$bundle_id.'/', $final_url);
  $bundle_name = $removed ? NULL : $xpath->query('//h2[contains(@class, "pageheader")]')[0]->nodeValue;
  $values = [
    'bundle_id' => $bundle_id,
    'removed' => $removed,
    'last_update' => (new DateTime('now', $global_timezone))->format('Y-m-d H:i:s')
  ];
  $apps = [];
  if (!$removed) {
    $elements = $xpath->query('//div[@data-ds-appid]');
    foreach ($elements as $element) {
      $apps []= intval($element->getAttribute('data-ds-appid'));
    }
  }

  $connection->beginTransaction();

  $columns = array_keys($values);
  $query = implode(' ', [
    'INSERT INTO games__bundle ('.implode(', ', $columns).')',
    'VALUES ('.implode(', ', array_fill(0, count($values), '?')).')',
    'ON DUPLICATE KEY UPDATE '.implode(', ', array_map(function ($elements) { return $elements.' = VALUES('.$elements.')'; }, $columns))
  ]);
  $parameters = array_values($values);
  $statement = $connection->prepare($query);
  $statement->execute($parameters);

  if ($bundle_name) {
    $query = implode(' ', [
      'INSERT INTO games__bundle_name (bundle_id, name)',
      'VALUES (?, ?)',
      'ON DUPLICATE KEY UPDATE name = VALUES(name)'
    ]);
    $parameters = [
      $bundle_id,
      $bundle_name
    ];
    $statement = $connection->prepare($query);
    $statement->execute($parameters);
  }

  $parameters = [];
  if (count($apps) > 0) {
    foreach ($apps as $app_id) {
      $parameters []= $bundle_id;
      $parameters []= $app_id;
    }
  }
  $num_parameters = count($parameters);
  if ($num_parameters > 0) {
    $query = implode(' ', [
      'INSERT IGNORE INTO games__bundle_app (bundle_id, app_id)',
      'VALUES '.implode(', ', array_fill(0, $num_parameters / 2, '(?, ?)'))
    ]);
    $statement = $connection->prepare($query);
    $statement->execute($parameters);
  }

  $connection->commit();
}