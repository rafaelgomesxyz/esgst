<?php

require_once __DIR__.'/../../class/CustomException.php';
require_once __DIR__.'/../../class/Request.php';

function get_app($app_id) {
  global $connection;
  global $global_timezone;

  $app = NULL;

  $query = implode(' ', [
    'SELECT '.implode(', ', [
      'g_a.app',
      'g_a.app_id',
      'g_an.name',
      'g_a.released',
      'g_a.removed',
      'g_a.steam_cloud',
      'g_a.trading_cards',
      'g_a.learning',
      'g_a.multiplayer',
      'g_a.singleplayer',
      'g_a.linux',
      'g_a.mac',
      'g_a.windows',
      'g_a.achievements',
      'g_a.price',
      'g_a.metacritic_score',
      'g_a.metacritic_id',
      'g_a.rating_percentage',
      'g_a.rating_count',
      'g_a.release_date',
      'g_ag_j.genres',
      'g_at_j.tags',
      'g_d.app_id AS base',
      'g_d_j.dlcs',
      'g_sa_j.subs',
      'g_ba_j.bundles',
      'g_a.last_update'
    ]),
    'FROM games__app AS g_a',
    'INNER JOIN games__app_name AS g_an',
    'ON g_a.app_id = g_an.app_id',
    'LEFT JOIN (',
      'SELECT g_ag.app_id, GROUP_CONCAT(DISTINCT g_g.name) AS genres',
      'FROM games__app_genre AS g_ag',
      'INNER JOIN games__genre AS g_g',
      'ON g_ag.genre = g_g.genre',
      'GROUP BY g_ag.app_id',
    ') AS g_ag_j',
    'ON g_a.app_id = g_ag_j.app_id',
    'LEFT JOIN (',
      'SELECT g_at.app_id, GROUP_CONCAT(DISTINCT g_t.name) AS tags',
      'FROM games__app_tag AS g_at',
      'INNER JOIN games__tag AS g_t',
      'ON g_at.tag = g_t.tag',
      'GROUP BY g_at.app_id',
    ') AS g_at_j',
    'ON g_a.app_id = g_at_j.app_id',
    'LEFT JOIN games__dlc AS g_d',
    'ON g_a.app_id = g_d.dlc_id',
    'LEFT JOIN (',
      'SELECT g_d_i.app_id, GROUP_CONCAT(DISTINCT g_d_i.dlc_id) AS dlcs',
      'FROM games__dlc AS g_d_i',
      'GROUP BY g_d_i.app_id',
    ') AS g_d_j',
    'ON g_a.app_id = g_d_j.app_id',
    'LEFT JOIN (',
      'SELECT g_sa.app_id, GROUP_CONCAT(DISTINCT g_sa.sub_id) AS subs',
      'FROM games__sub_app AS g_sa',
      'GROUP BY g_sa.app_id',
    ') AS g_sa_j',
    'ON g_a.app_id = g_sa_j.app_id',
    'LEFT JOIN (',
      'SELECT g_ba.app_id, GROUP_CONCAT(DISTINCT g_ba.bundle_id) AS bundles',
      'FROM games__bundle_app AS g_ba',
      'GROUP BY g_ba.app_id',
    ') AS g_ba_j',
    'ON g_a.app_id = g_ba_j.app_id',
    'WHERE g_a.app_id = ?',
    'GROUP BY g_a.app'
  ]);
  $parameters = [
    $app_id
  ];
  $statement = $connection->prepare($query);
  $statement->execute($parameters);
  $row = $statement->fetch();

  if ($row) {
    $now = (new DateTime('now', $global_timezone))->getTimestamp();
    $last_update = (new DateTime($row['last_update'], $global_timezone))->getTimestamp();
    $difference_in_seconds = $now - $last_update;

    if ($difference_in_seconds < 60 * 60 * 24 * 7) {    
      $app = [
        'app_id' => $row['app_id'],
        'name' => $row['name'],
        'released' => boolval($row['released']),
        'removed' => boolval($row['removed']),
        'steam_cloud' => boolval($row['steam_cloud']),
        'trading_cards' => boolval($row['trading_cards']),
        'learning' => isset($row['learning']) ? boolval($row['learning']) : NULL,
        'multiplayer' => boolval($row['multiplayer']),
        'singleplayer' => boolval($row['singleplayer']),
        'linux' => boolval($row['linux']),
        'mac' => boolval($row['mac']),
        'windows' => boolval($row['windows']),
        'achievements' => $row['achievements'],
        'price' => $row['price'],
        'metacritic' => isset($row['metacritic_score']) ? [
          'score' => $row['metacritic_score'],
          'url' => 'https://www.metacritic.com/game/pc/'.$row['metacritic_id']
        ] : NULL,
        'rating' => isset($row['rating_percentage']) ? [
          'percentage' => $row['rating_percentage'],
          'count' => $row['rating_count']
        ] : NULL,
        'release_date' => $row['release_date'],
        'genres' => $row['genres'] ? explode(',', $row['genres']) : [],
        'tags' => $row['tags'] ? explode(',', $row['tags']) : [],
        'base' => $row['base'],
        'dlcs' => $row['dlcs'] ? array_map(function ($element) { return intval($element); }, explode(',', $row['dlcs'])) : [],
        'subs' => $row['subs'] ? array_map(function ($element) { return intval($element); }, explode(',', $row['subs'])) : [],
        'bundles' => $row['bundles'] ? array_map(function ($element) { return intval($element); }, explode(',', $row['bundles'])) : [],
        'last_update' => $row['last_update']
      ];
    }
  }

  return $app;
}

function fetch_app($app_id) {
  global $connection;
  global $internal_errors;
  global $global_timezone;

  $url = 'https://store.steampowered.com/api/appdetails?appids='.$app_id.'&filters=achievements,basic,categories,genres,metacritic,name,packages,platforms,price_overview,release_date&cc=us&l=en';
  $response = Request::fetch($url);
  $json = $response['json'];

  if (!isset($json[$app_id]['data'])) {
    throw new CustomException($internal_errors['steam'], 500, $response['text']);
  }

  $data = $json[$app_id]['data'];

  if ($data['type'] !== 'game' && $data['type'] !== 'dlc') {
    throw new CustomException('Item requested is not a game.', 400);
  }

  $url = 'https://store.steampowered.com/app/'.$app_id.'?cc=us&l=en';
  $options = [
    'cookie' => 'birthtime=0; mature_content=1;'
  ];
  $response = Request::fetch($url, $options);
  $final_url = $response['url'];
  $xpath = $response['xpath'];

  if (!isset($xpath)) {
    throw new CustomException($internal_errors['steam'], 500, $response['text']);
  }

  $app_name = $data['name'];
  $release_date = $data['release_date'];
  $removed = !preg_match('/store\.steampowered\.com\/app\/'.$app_id.'/', $final_url);
  $categories = array_map(function ($element) { return strtolower($element['description']); }, $data['categories']);
  $platforms = $data['platforms'];
  $price = $data['price_overview'];
  $metacritic = $data['metacritic'];
  $rating = NULL;
  if (!$removed) {
    $elements = $xpath->query('//div[contains(@class, "user_reviews_summary_row")]');
    $num_elements = count($elements);
    if ($num_elements > 0) {
      $text = preg_replace('/[,.]/', '', $elements[$num_elements - 1]->getAttribute('data-tooltip-text'));
      preg_match('/(\d+)%.+?(\d+)/', $text, $rating);
    }
  }
  $values = [
    'app_id' => $app_id,
    'released' => !$release_date['coming_soon'],
    'removed' => $removed,
    'steam_cloud' => in_array('steam cloud', $categories),
    'trading_cards' => in_array('steam trading cards', $categories),
    'learning' => $removed ? NULL : count($xpath->query('//div[contains(@class, "learning_about")]')) > 0,
    'multiplayer' => !empty(array_intersect(['multi-player', 'online multi-player', 'co-op', 'local co-op', 'online co-op', 'shared/split screen'], $categories)),
    'singleplayer' => in_array('single-player', $categories),
    'linux' => $platforms['linux'],
    'mac' => $platforms['mac'],
    'windows'=> $platforms['windows'],
    'achievements' => isset($data['achievements']['total']) ? intval($data['achievements']['total']) : 0,
    'price' => $price ? intval($price['initial']) : 0,
    'metacritic_score' => $metacritic ? intval($metacritic['score']) : NULL,
    'metacritic_id' => $metacritic ? preg_replace('/https:\/\/www\.metacritic\.com\/game\/pc\/|\?.+/', '', $metacritic['url']) : NULL,
    'rating_percentage' => $rating ? intval($rating[1]) : NULL,
    'rating_count' => $rating ? intval($rating[2]) : NULL,
    'release_date' => $release_date['date'] ? (new DateTime($release_date['date']))->format('Y-m-d') : NULL,
    'last_update' => (new DateTime('now', $global_timezone))->format('Y-m-d H:i:s')
  ];
  $genres = [];
  if ($data['genres']) {
    foreach ($data['genres'] as $genre) {
      $genres []= trim($genre['description']);
    }
    sort($genres);
  }
  $tags = [];
  if (!$removed) {
    $elements = $xpath->query('//a[contains(@class, "app_tag")]');
    foreach ($elements as $element) {
      $tags []= trim($element->nodeValue);
    }
    sort($tags);
  }
  $base = $data['type'] === 'dlc' && isset($data['fullgame']['appid']) ? intval($data['fullgame']['appid']) : NULL;
  $dlcs = $data['dlc'] ? array_map(function ($element) { return intval($element); }, $data['dlc']) : [];
  $subs = $data['packages'] ? array_map(function ($element) { return intval($element); }, $data['packages']) : [];
  $bundles = [];
  if (!$removed) {
    $elements = $xpath->query('//div[@data-ds-bundleid]');
    foreach ($elements as $element) {
      $bundles []= intval($element->getAttribute('data-ds-bundleid'));
    }
  }

  $connection->beginTransaction();

  $columns = array_keys($values);
  $query = implode(' ', [
    'INSERT INTO games__app ('.implode(', ', $columns).')',
    'VALUES ('.implode(', ', array_fill(0, count($values), '?')).')',
    'ON DUPLICATE KEY UPDATE '.implode(', ', array_map(function ($element) { return $element.' = VALUES('.$element.')'; }, $columns))
  ]);
  $parameters = array_values($values);
  $statement = $connection->prepare($query);
  $statement->execute($parameters);

  $query = implode(' ', [
    'INSERT INTO games__app_name (app_id, name)',
    'VALUES (?, ?)',
    'ON DUPLICATE KEY UPDATE name = VALUES(name)'
  ]);
  $parameters = [
    $app_id,
    $app_name
  ];
  $statement = $connection->prepare($query);
  $statement->execute($parameters);

  if (count($genres) > 0) {
    $query_1 = implode(' ', [
      'INSERT INTO games__genre (name)',
      'VALUES (?)',
      'ON DUPLICATE KEY UPDATE genre = LAST_INSERT_ID(genre)'
    ]);
    $query_2 = implode(' ', [
      'INSERT IGNORE INTO games__app_genre (app_id, genre)',
      'VALUES (?, LAST_INSERT_ID())'
    ]);
    $statement_1 = $connection->prepare($query_1);
    $statement_2 = $connection->prepare($query_2);
    foreach ($genres as $genre_name) {
      $parameters_1 = [
        $genre_name
      ];
      $parameters_2 = [
        $app_id
      ];
      $statement_1->execute($parameters_1);
      $statement_2->execute($parameters_2);
    }
  }

  if (count($tags) > 0) {
    $query_1 = implode(' ', [
      'INSERT INTO games__tag (name)',
      'VALUES (?)',
      'ON DUPLICATE KEY UPDATE tag = LAST_INSERT_ID(tag)'
    ]);
    $query_2 = implode(' ', [
      'INSERT IGNORE INTO games__app_tag (app_id, tag)',
      'VALUES (?, LAST_INSERT_ID())'
    ]);
    $statement_1 = $connection->prepare($query_1);
    $statement_2 = $connection->prepare($query_2);
    foreach ($tags as $tag_name) {
      $parameters_1 = [
        $tag_name
      ];
      $parameters_2 = [
        $app_id
      ];
      $statement_1->execute($parameters_1);
      $statement_2->execute($parameters_2);
    }
  }

  $parameters = [];
  if ($base) {
    $parameters []= $app_id;
    $parameters []= $base;
  } else if (count($dlcs) > 0) {
    foreach ($dlcs as $dlc_id) {
      $parameters []= $dlc_id;
      $parameters []= $app_id;
    }
  }
  $num_parameters = count($parameters);
  if ($num_parameters > 0) {
    $query = implode(' ', [
      'INSERT IGNORE INTO games__dlc (dlc_id, app_id)',
      'VALUES '.implode(', ', array_fill(0, $num_parameters / 2, '(?, ?)'))
    ]);
    $statement = $connection->prepare($query);
    $statement->execute($parameters);
  }

  $parameters = [];
  if (count($subs) > 0) {
    foreach ($subs as $sub_id) {
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

  $parameters = [];
  if (count($bundles) > 0) {
    foreach ($bundles as $bundle_id) {
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