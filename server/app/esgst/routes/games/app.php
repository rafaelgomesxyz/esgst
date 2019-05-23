<?php

require_once __DIR__.'/../../class/CustomException.php';
require_once __DIR__.'/../../class/Request.php';
require_once __DIR__.'/../../utils/filters.php';         // validate_filters

/**
 * @api {SCHEMA} App App
 * @apiGroup Schemas
 * @apiName App
 * 
 * @apiVersion 1.0.0
 * 
 * @apiDescription The optional properties are included based on the "filters" parameter. If the parameter isn't used, all of the optional properties are included, except where noted.
 * 
 * @apiParam (Schema) {Object} app
 * @apiParam (Schema) {String=app} [app.type=app] [NOT FILTERABLE] The type of the game.
 * This property is only available for the [GetGames](#api-Games-GetGames) method when used with the parameter "join_all".
 * @apiParam (Schema) {Integer} [app.app_id] [NOT FILTERABLE] The Steam ID of the game. This property is not available for the [GetGames](#api-Games-GetGames) method when used without the "join_all", "format_array" and "show_id" parameters.
 * @apiParam (Schema) {String} [app.name] The name of the game.
 * @apiParam (Schema) {Boolean} [app.released] Whether the game has been released to the Steam store or not.
 * @apiParam (Schema) {Boolean} [app.removed] Whether the game has been removed from the Steam store or not.
 * @apiParam (Schema) {Boolean} [app.steam_cloud] Whether the game has Steam cloud or not.
 * @apiParam (Schema) {Boolean} [app.trading_cards] Whether the game has trading cards or not.
 * @apiParam (Schema) {Boolean/NULL} [app.learning] A boolean indicating whether Steam is learning about the game or not, or NULL if the information is not accessible.
 * @apiParam (Schema) {Boolean} [app.multiplayer] Whether the game is multiplayer or not.
 * @apiParam (Schema) {Boolean} [app.singleplayer] Whether the game is singleplayer or not.
 * @apiParam (Schema) {Boolean} [app.linux] Whether the game runs on Linux or not.
 * @apiParam (Schema) {Boolean} [app.mac] Whether the game runs on Mac or not.
 * @apiParam (Schema) {Boolean} [app.windows] Whether the game runs on Windows or not.
 * @apiParam (Schema) {Integer} [app.achievements] The number of achievements that the game has, or 0 if it doesn't have any.
 * @apiParam (Schema) {Integer} [app.price] The price of the game in USD ($9.99 is represented as 999), or 0 if it's free.
 * @apiParam (Schema) {Object/NULL} [app.metacritic] Information about the Metacritic score of the game, or NULL if it doesn't have a Metacritic page.
 * @apiParam (Schema) {Integer} app.metacritic.score The Metacritic score of the game.
 * @apiParam (Schema) {String} app.metacritic.id The Metacritic ID of the game, useful for building its Metacritic URL (https://www.metacritic.com/game/pc/{id}).
 * @apiParam (Schema) {Object/NULL} [app.rating] Information about the Steam rating of the game, or NULL if it doesn't have enough ratings.
 * @apiParam (Schema) {Integer} app.rating.percentage The percentage of positive ratings that the game has.
 * @apiParam (Schema) {Integer} app.rating.count The total number of ratings that the game has.
 * @apiParam (Schema) {String/NULL} [app.release_date] When the game was released or is going to be released in the format YYYY-MM-DD, or NULL if there's no release date.
 * @apiParam (Schema) {String[]} [app.genres] The genres of the game (according to the developers). Can be empty.
 * @apiParam (Schema) {String[]} [app.tags] The user-defined tags of the game (according to the players). Can be empty.
 * @apiParam (Schema) {Integer/NULL} [app.base] The Steam ID of the base game, or NULL if the game isn't a DLC.
 * @apiParam (Schema) {Integer[]} [app.dlcs] The Steam IDs of the DLCs that the game has. Can be empty.
 * @apiParam (Schema) {Integer[]} [app.subs] The Steam IDs of the subs that include the game. Can be empty.
 * @apiParam (Schema) {Integer[]} [app.bundles] The Steam IDs of the bundles that include the game. Can be empty.
 * @apiParam (Schema) {String} app.last_update When the information was last updated in the format YYYY/MM/DD HH:mm:SS (UTC timezone).
 * 
 * @apiSampleRequest off
 */

function get_apps($parameters, $filters) {
  global $connection;
  global $global_timezone;

  $columns = [
    'name' => 'g_an.name',
    'released' => 'g_a.released',
    'removed' => 'g_a.removed',
    'steam_cloud' => 'g_a.steam_cloud',
    'trading_cards' => 'g_a.trading_cards',
    'learning' => 'g_a.learning',
    'multiplayer' => 'g_a.multiplayer',
    'singleplayer' => 'g_a.singleplayer',
    'linux' => 'g_a.linux',
    'mac' => 'g_a.mac',
    'windows' => 'g_a.windows',
    'achievements' => 'g_a.achievements',
    'price' => 'g_a.price',
    'metacritic' => 'g_a.metacritic_score, g_a.metacritic_id',
    'rating' => 'g_a.rating_percentage, g_a.rating_count',
    'release_date' => 'g_a.release_date',
    'genres' => 'g_ag_j.genres',
    'tags' => 'g_at_j.tags',
    'base' => 'g_d.app_id AS base',
    'dlcs' => 'g_d_j.dlcs',
    'subs' => 'g_sa_j.subs',
    'bundles' => 'g_ba_j.bundles'
  ];
  $column_keys = array_keys($columns);

  $filter_name = isset($filters['filters']) ? 'filters' : 'app_filters';
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

  $apps = [];

  $query = implode(' ', array_filter(
    array_merge(
      [
        'SELECT '.implode(', ', array_merge(
          [
            'g_a.app_id',
            'g_a.last_update'
          ],
          array_values($columns)
        )),
        'FROM games__app AS g_a'
      ],
      isset($columns['name']) ? [
        'INNER JOIN games__app_name AS g_an',
        'ON g_a.app_id = g_an.app_id'
      ] : [
        NULL
      ],
      isset($columns['genres']) ? [
        'LEFT JOIN (',
          'SELECT g_ag.app_id, GROUP_CONCAT(DISTINCT g_g.name) AS genres',
          'FROM games__app_genre AS g_ag',
          'INNER JOIN games__genre AS g_g',
          'ON g_ag.genre_id = g_g.genre_id',
          'GROUP BY g_ag.app_id',
        ') AS g_ag_j',
        'ON g_a.app_id = g_ag_j.app_id'
      ] : [
        NULL
      ],
      isset($columns['tags']) ? [
        'LEFT JOIN (',
          'SELECT g_at.app_id, GROUP_CONCAT(DISTINCT g_t.name) AS tags',
          'FROM games__app_tag AS g_at',
          'INNER JOIN games__tag AS g_t',
          'ON g_at.tag_id = g_t.tag_id',
          'GROUP BY g_at.app_id',
        ') AS g_at_j',
        'ON g_a.app_id = g_at_j.app_id'
      ] : [
        NULL
      ],
      isset($columns['base']) ? [
        'LEFT JOIN games__dlc AS g_d',
        'ON g_a.app_id = g_d.dlc_id'
      ] : [
        NULL
      ],
      isset($columns['dlcs']) ? [
        'LEFT JOIN (',
          'SELECT g_d_i.app_id, GROUP_CONCAT(DISTINCT g_d_i.dlc_id) AS dlcs',
          'FROM games__dlc AS g_d_i',
          'GROUP BY g_d_i.app_id',
        ') AS g_d_j',
        'ON g_a.app_id = g_d_j.app_id'
      ] : [
        NULL
      ],
      isset($columns['subs']) ? [
        'LEFT JOIN (',
          'SELECT g_sa.app_id, GROUP_CONCAT(DISTINCT g_sa.sub_id) AS subs',
          'FROM games__sub_app AS g_sa',
          'GROUP BY g_sa.app_id',
        ') AS g_sa_j',
        'ON g_a.app_id = g_sa_j.app_id'
      ] : [
        NULL
      ],
      isset($columns['bundles']) ? [
        'LEFT JOIN (',
          'SELECT g_ba.app_id, GROUP_CONCAT(DISTINCT g_ba.bundle_id) AS bundles',
          'FROM games__bundle_app AS g_ba',
          'GROUP BY g_ba.app_id',
        ') AS g_ba_j',
        'ON g_a.app_id = g_ba_j.app_id'
      ] : [
        NULL
      ],
      [
        'WHERE '.implode(' OR ', array_fill(0, count($parameters), 'g_a.app_id = ?')),
        'GROUP BY g_a.app_id'
      ]
    )
  ));
  $statement = $connection->prepare($query);
  $statement->execute($parameters);

  $now = (new DateTime('now', $global_timezone))->getTimestamp();
  while ($row = $statement->fetch()) {
    $last_update = (new DateTime($row['last_update'], $global_timezone))->getTimestamp();
    $difference_in_seconds = $now - $last_update;

    if ($difference_in_seconds < 60 * 60 * 24 * 7 && (isset($row['rating']) || $row['removed'] || $difference_in_seconds < 60 * 60 * 24)) {
      $app = [
        'app_id' => $row['app_id']
      ];
      if (isset($columns['name'])) {
        $app['name'] = $row['name'];
      }
      if (isset($columns['released'])) {
        $app['released'] = boolval($row['released']);
      }
      if (isset($columns['removed'])) {
        $app['removed'] = boolval($row['removed']);
      }
      if (isset($columns['steam_cloud'])) {
        $app['steam_cloud'] = boolval($row['steam_cloud']);
      }
      if (isset($columns['trading_cards'])) {
        $app['trading_cards'] = boolval($row['trading_cards']);
      }
      if (isset($columns['learning'])) {
        $app['learning'] = isset($row['learning']) ? boolval($row['learning']) : NULL;
      }
      if (isset($columns['multiplayer'])) {
        $app['multiplayer'] = boolval($row['multiplayer']);
      }
      if (isset($columns['singleplayer'])) {
        $app['singleplayer'] = boolval($row['singleplayer']);
      }
      if (isset($columns['linux'])) {
        $app['linux'] = boolval($row['linux']);
      }
      if (isset($columns['mac'])) {
        $app['mac'] = boolval($row['mac']);
      }
      if (isset($columns['windows'])) {
        $app['windows'] = boolval($row['windows']);
      }
      if (isset($columns['achievements'])) {
        $app['achievements'] = $row['achievements'];
      }
      if (isset($columns['price'])) {
        $app['price'] = $row['price'];
      }
      if (isset($columns['metacritic'])) {
        $app['metacritic'] = isset($row['metacritic_score']) ? [
          'score' => $row['metacritic_score'],
          'url' => 'https://www.metacritic.com/game/pc/'.$row['metacritic_id']
        ] : NULL;
      }
      if (isset($columns['rating'])) {
        $app['rating'] = isset($row['rating_percentage']) ? [
          'percentage' => $row['rating_percentage'],
          'count' => $row['rating_count']
        ] : NULL;
      }
      if (isset($columns['release_date'])) {
        $app['release_date'] = $row['release_date'];
      }
      if (isset($columns['genres'])) {
        $app['genres'] = $row['genres'] ? explode(',', $row['genres']) : [];
      }
      if (isset($columns['tags'])) {
        $app['tags'] = $row['tags'] ? explode(',', $row['tags']) : [];
      }
      if (isset($columns['base'])) {
        $app['base'] = $row['base'];
      }
      if (isset($columns['dlcs'])) {
        $app['dlcs'] = $row['dlcs'] ? array_map(function ($element) { return intval($element); }, explode(',', $row['dlcs'])) : [];
      }
      if (isset($columns['subs'])) {
        $app['subs'] = $row['subs'] ? array_map(function ($element) { return intval($element); }, explode(',', $row['subs'])) : [];
      }
      if (isset($columns['bundles'])) {
        $app['bundles'] = $row['bundles'] ? array_map(function ($element) { return intval($element); }, explode(',', $row['bundles'])) : [];
      }
      $app['last_update'] = $row['last_update'];
      $apps []= $app;
    }
  }

  return $apps;
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
  $ok_response = count($xpath->query('//div[contains(@class, "apphub_AppName")]')) > 0;
  $removed = !preg_match('/store\.steampowered\.com.*?\/app\/'.$app_id.'/', $final_url);
  $categories = array_map(function ($element) { return strtolower($element['description']); }, $data['categories']);
  $platforms = $data['platforms'];
  $price = $data['price_overview'];
  $metacritic = $data['metacritic'];
  $rating = NULL;
  if ($ok_response && !$removed) {
    $elements = $xpath->query('//div[contains(@class, "user_reviews_summary_row")]');
    $num_elements = count($elements);
    if ($num_elements > 0) {
      $text = preg_replace('/[,.]/', '', $elements[$num_elements - 1]->getAttribute('data-tooltip-html'));
      preg_match('/(\d+)%.+?(\d+)/', $text, $rating);
    }
  }
  $values = [
    'app_id' => $app_id,
    'released' => !$release_date['coming_soon'],
    'removed' => $removed,
    'steam_cloud' => in_array('steam cloud', $categories),
    'trading_cards' => in_array('steam trading cards', $categories),
    'learning' => $ok_response ? count($xpath->query('//div[contains(@class, "learning_about")]')) > 0 : NULL,
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
      $genres []= [
        'id' => intval($genre['id']),
        'name' => trim($genre['description'])
      ];
    }
  }
  $tags = [];
  if ($ok_response && !$removed) {
    preg_match('/InitAppTagModal.*?(\[.*?]),/s', $response['text'], $matches);
    if ($matches) {
      $elements = json_decode($matches[1], TRUE);
      foreach ($elements as $element) {
        $tags []= [
          'id' => intval($element['tagid']),
          'name' => $element['name']
        ];
      }
    }
  }
  $base = $data['type'] === 'dlc' && isset($data['fullgame']['appid']) ? intval($data['fullgame']['appid']) : NULL;
  $dlcs = $data['dlc'] ? array_map(function ($element) { return intval($element); }, $data['dlc']) : [];
  $subs = $data['packages'] ? array_map(function ($element) { return intval($element); }, $data['packages']) : [];
  $bundles = [];
  if ($ok_response && !$removed) {
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
    'INSERT IGNORE INTO games__app_name (app_id, name)',
    'VALUES (?, ?)'
  ]);
  $parameters = [
    $app_id,
    $app_name
  ];
  $statement = $connection->prepare($query);
  $statement->execute($parameters);

  $parameters_1 = [];
  $parameters_2 = [];
  if (count($genres) > 0) {
    foreach ($genres as $genre) {
      $parameters_1 []= $genre['id'];
      $parameters_1 []= $genre['name'];
      $parameters_2 []= $app_id;
      $parameters_2 []= $genre['id'];
    }
  }
  $num_parameters = count($parameters_1);
  if ($num_parameters > 0) {
    $query = implode(' ', [
      'INSERT IGNORE INTO games__genre (genre_id, name)',
      'VALUES '.implode(', ', array_fill(0, $num_parameters / 2, '(?, ?)'))
    ]);
    $statement = $connection->prepare($query);
    $statement->execute($parameters_1);
  }
  $num_parameters = count($parameters_2);
  if ($num_parameters > 0) {
    $query = implode(' ', [
      'INSERT IGNORE INTO games__app_genre (app_id, genre_id)',
      'VALUES '.implode(', ', array_fill(0, $num_parameters / 2, '(?, ?)'))
    ]);
    $statement = $connection->prepare($query);
    $statement->execute($parameters_2);
  }

  $parameters_1 = [];
  $parameters_2 = [];
  if (count($tags) > 0) {
    foreach ($tags as $tag) {
      $parameters_1 []= $tag['id'];
      $parameters_1 []= $tag['name'];
      $parameters_2 []= $app_id;
      $parameters_2 []= $tag['id'];
    }
  }
  $num_parameters = count($parameters_1);
  if ($num_parameters > 0) {
    $query = implode(' ', [
      'INSERT IGNORE INTO games__tag (tag_id, name)',
      'VALUES '.implode(', ', array_fill(0, $num_parameters / 2, '(?, ?)'))
    ]);
    $statement = $connection->prepare($query);
    $statement->execute($parameters_1);
  }
  $num_parameters = count($parameters_2);
  if ($num_parameters > 0) {
    $query = implode(' ', [
      'INSERT IGNORE INTO games__app_tag (app_id, tag_id)',
      'VALUES '.implode(', ', array_fill(0, $num_parameters / 2, '(?, ?)'))
    ]);
    $statement = $connection->prepare($query);
    $statement->execute($parameters_2);
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