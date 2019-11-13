const CustomError = require('../../class/CustomError');
const Request = require('../../class/Request');
const Utils = require('../../class/Utils');

/**
 * @api {SCHEMA} App App
 * @apiGroup Schemas
 * @apiName App
 * @apiDescription The optional properties are included based on the "filters" parameter. If the parameter isn't used, all of the optional properties are included, except where noted.
 * @apiVersion 1.0.0
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

class App {
  /**
   * @param {import('../../class/Connection')} connection
   * @param {import('express').Request} req
   * @param {Array<number>} ids
   */
  static async get(connection, req, ids) {
    const columns = {
      name: 'g_an.name',
      released: 'g_a.released',
      removed: 'g_a.removed',
      steam_cloud: 'g_a.steam_cloud',
      trading_cards: 'g_a.trading_cards',
      learning: 'g_a.learning',
      multiplayer: 'g_a.multiplayer',
      singleplayer: 'g_a.singleplayer',
      linux: 'g_a.linux',
      mac: 'g_a.mac',
      windows: 'g_a.windows',
      achievements: 'g_a.achievements',
      price: 'g_a.price',
      metacritic: 'g_a.metacritic_score, g_a.metacritic_id',
      rating: 'g_a.rating_percentage, g_a.rating_count',
      release_date: 'g_a.release_date',
      genres: 'g_ag_j.genres',
      tags: 'g_at_j.tags',
      base: 'g_d.app_id AS base',
      dlcs: 'g_d_j.dlcs',
      subs: 'g_sa_j.subs',
      bundles: 'g_ba_j.bundles',
    };
    const columnKeys = Object.keys(columns);    
    const params = Object.assign({}, { filters: req.query.filters || req.query.app_filters || '' });
    const validator = {
      filters: {
        message: `Must be a comma-separated list containing the following values: ${columnKeys.join(', ')}`,
        regex: new RegExp(`^(((${columnKeys.join('|')}),?)+)?$`),
      },
    };
    Utils.validateParams(params, validator);
    if (params.filters) {
      const filterKeys = params.filters.split(',');      
      for (const columnKey of columnKeys) {
        if (!filterKeys.includes(columnKey)) {
          delete columns[columnKey];
        }
      }
    }
    const rows = await connection.query(`
      SELECT ${[
        'g_a.app_id',
        'g_a.last_update',
        ...Object.values(columns),
      ].join(', ')}
      FROM games__app AS g_a
      ${Utils.isSet(columns.name) ? `
        INNER JOIN games__app_name AS g_an
        ON g_a.app_id = g_an.app_id
      ` : ''}
      ${Utils.isSet(columns.genres) ? `
        LEFT JOIN (
          SELECT g_ag.app_id, GROUP_CONCAT(DISTINCT g_g.name) AS genres
          FROM games__app_genre AS g_ag
          INNER JOIN games__genre AS g_g
          ON g_ag.genre_id = g_g.genre_id
          GROUP BY g_ag.app_id
        ) AS g_ag_j
        ON g_a.app_id = g_ag_j.app_id
      ` : ''}
      ${Utils.isSet(columns.tags) ? `
        LEFT JOIN (
          SELECT g_at.app_id, GROUP_CONCAT(DISTINCT g_t.name) AS tags
          FROM games__app_tag AS g_at
          INNER JOIN games__tag AS g_t
          ON g_at.tag_id = g_t.tag_id
          GROUP BY g_at.app_id
        ) AS g_at_j
        ON g_a.app_id = g_at_j.app_id
      ` : ''}
      ${Utils.isSet(columns.base) ? `
        LEFT JOIN games__dlc AS g_d
        ON g_a.app_id = g_d.dlc_id
      ` : ''}
      ${Utils.isSet(columns.dlcs) ? `
        LEFT JOIN (
          SELECT g_d_i.app_id, GROUP_CONCAT(DISTINCT g_d_i.dlc_id) AS dlcs
          FROM games__dlc AS g_d_i
          GROUP BY g_d_i.app_id
        ) AS g_d_j
        ON g_a.app_id = g_d_j.app_id
      ` : ''}
      ${Utils.isSet(columns.subs) ? `
        LEFT JOIN (
          SELECT g_sa.app_id, GROUP_CONCAT(DISTINCT g_sa.sub_id) AS subs
          FROM games__sub_app AS g_sa
          GROUP BY g_sa.app_id
        ) AS g_sa_j
        ON g_a.app_id = g_sa_j.app_id
      ` : ''}
      ${Utils.isSet(columns.bundles) ? `
        LEFT JOIN (
          SELECT g_ba.app_id, GROUP_CONCAT(DISTINCT g_ba.bundle_id) AS bundles
          FROM games__bundle_app AS g_ba
          GROUP BY g_ba.app_id
        ) AS g_ba_j
        ON g_a.app_id = g_ba_j.app_id
      ` : ''}
      WHERE ${ids.map(id => `g_a.app_id = ${connection.escape(id)}`).join(' OR ')}
      GROUP BY g_a.app_id
    `);
    const apps = [];
    const now = Math.trunc(Date.now() / 1e3);
    for (const row of rows) {
      const lastUpdate = Math.trunc((new Date(parseInt(row.last_update) * 1e3)).getTime() / 1e3);
      const differenceInSeconds = now - lastUpdate;
      if (differenceInSeconds < 60 * 60 * 24 * 7 && (Utils.isSet(row.rating) || row.removed || differenceInSeconds < 60 * 60 * 24)) {
        const app = {
          app_id: row.app_id,
        };
        if (Utils.isSet(columns.name)) {
          app.name = row.name;
        }
        if (Utils.isSet(columns.released)) {
          app.released = !!row.released;
        }
        if (Utils.isSet(columns.removed)) {
          app.removed = !!row.removed;
        }
        if (Utils.isSet(columns.steam_cloud)) {
          app.steam_cloud = !!row.steam_cloud;
        }
        if (Utils.isSet(columns.trading_cards)) {
          app.trading_cards = !!row.trading_cards;
        }
        if (Utils.isSet(columns.learning)) {
          app.learning = Utils.isSet(row.learning) ? !!row.learning : null;
        }
        if (Utils.isSet(columns.multiplayer)) {
          app.multiplayer = !!row.multiplayer;
        }
        if (Utils.isSet(columns.singleplayer)) {
          app.singleplayer = !!row.singleplayer;
        }
        if (Utils.isSet(columns.linux)) {
          app.linux = !!row.linux;
        }
        if (Utils.isSet(columns.mac)) {
          app.mac = !!row.mac;
        }
        if (Utils.isSet(columns.windows)) {
          app.windows = !!row.windows;
        }
        if (Utils.isSet(columns.achievements)) {
          app.achievements = row.achievements;
        }
        if (Utils.isSet(columns.price)) {
          app.price = row.price;
        }
        if (Utils.isSet(columns.metacritic)) {
          app.metacritic = Utils.isSet(row.metacritic_score) ? {
            score: row.metacritic_score,
            url: `https://www.metacritic.com/game/pc/${row.metacritic_id}`,
          } : null;
        }
        if (Utils.isSet(columns.rating)) {
          app.rating = Utils.isSet(row.rating_percentage) ? {
            percentage: row.rating_percentage,
            count: row.rating_count,
          } : null;
        }
        if (Utils.isSet(columns.release_date)) {
          app.release_date = Utils.isSet(row.release_date) ? Utils.formatDate(parseInt(row.release_date) * 1e3) : null;
        }
        if (Utils.isSet(columns.genres)) {
          app.genres = row.genres ? row.genres.split(',') : [];
        }
        if (Utils.isSet(columns.tags)) {
          app.tags = row.tags ? row.tags.split(',') : [];
        }
        if (Utils.isSet(columns.base)) {
          app.base = Utils.isSet(row.base) ? row.base : null;
        }
        if (Utils.isSet(columns.dlcs)) {
          app.dlcs = row.dlcs ? row.dlcs.split(',').map(dlcId => parseInt(dlcId)) : [];
        }
        if (Utils.isSet(columns.subs)) {
          app.subs = row.subs ? row.subs.split(',').map(subId => parseInt(subId)) : [];
        }
        if (Utils.isSet(columns.bundles)) {
          app.bundles = row.bundles ? row.bundles.split(',').map(bundleId => parseInt(bundleId)) : [];
        }
        app.last_update = Utils.formatDate(parseInt(row.last_update) * 1e3, true);
        apps.push(app);
      }
    }
    return apps;
  }

  /**
   * @param {import('../../class/Connection')} connection
   * @param {number} appId
   */
  static async fetch(connection, appId) {
    const apiUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&filters=achievements,basic,categories,genres,metacritic,name,packages,platforms,price_overview,release_date&cc=us&l=en`;
    const apiResponse = await Request.get(apiUrl);
    if (!apiResponse || !apiResponse.json || !apiResponse.json[appId]) {
      throw new CustomError(CustomError.COMMON_MESSAGES.steam, 500);
    }
    const apiData = apiResponse.json[appId].success ? apiResponse.json[appId].data : null;
    if (!apiData || (apiData.type !== 'game' && apiData.type !== 'dlc')) {
      return;
    }
    const storeUrl = `https://store.steampowered.com/app/${appId}?cc=us&l=en`;
    const storeConfig = {
      headers: {
        'Cookie': 'birthtime=0; mature_content=1;',
      },
    };
    const storeResponse = await Request.get(storeUrl, storeConfig);
    if (!storeResponse.html) {
      throw new CustomError(CustomError.COMMON_MESSAGES.steam, 500);
    }
    const isStoreResponseOk = !!storeResponse.html.querySelector('.apphub_AppName');
    const releaseDate = apiData.release_date;
    const removed = !storeResponse.url.match(new RegExp(`store\.steampowered\.com.*?\/app\/${appId}`));
    const categories = apiData.categories ? apiData.categories.map(category => category.description.toLowerCase()) : [];
    const platforms = apiData.platforms;
    const metacritic = apiData.metacritic;
    let rating = null;
    if (isStoreResponseOk && !removed) {
      const elements = storeResponse.html.querySelectorAll('.user_reviews_summary_row');
      const numElements = elements.length;
      if (numElements > 0) {
        const text = elements[numElements - 1].dataset.tooltipHtml.replace(/[,.]/, '');
        rating = text.match(/(\d+)%.+?(\d+)/);
      }
    }
    const app = {
      app_id: appId,
      released: !releaseDate.coming_soon,
      removed: removed,
      steam_cloud: categories.includes('steam cloud'),
      trading_cards: categories.includes('steam trading cards'),
      learning: isStoreResponseOk ? !!storeResponse.html.querySelector('.learning_about') : null,
      multiplayer: ['multi-player', 'online multi-player', 'co-op', 'local co-op', 'online co-op', 'shared/split screen'].filter(category => categories.includes(category)).length > 0,
      singleplayer: categories.includes('single-player'),
      linux: platforms.linux,
      mac: platforms.mac,
      windows: platforms.windows,
      achievements: parseInt((apiData.achievements && apiData.achievements.total) || 0),
      price: parseInt((apiData.price_overview && apiData.price_overview.initial) || 0),
      metacritic_score: metacritic ? parseInt(metacritic.score) : null,
      metacritic_id: metacritic ? metacritic.url.replace(/https:\/\/www\.metacritic\.com\/game\/pc\/|\?.+/, '') : null,
      rating_percentage: rating ? parseInt(rating[1]) : null,
      rating_count: rating ? parseInt(rating[2]) : null,
      release_date: releaseDate.date ? Math.trunc(((new Date(`${releaseDate.date} UTC`)).getTime() / 1e3)) : null,
      last_update: Math.trunc(Date.now() / 1e3),
    };
    const genres = [];
    if (apiData.genres) {
      for (const genre of apiData.genres) {
        genres.push({
          id: parseInt(genre.id),
          name: genre.description.trim(),
        });
      }
    }
    const tags = [];
    if (isStoreResponseOk && !removed) {
      const matches = storeResponse.text.match(/InitAppTagModal[\S\s]*?(\[[\S\s]*?]),/);
      if (matches) {
        const elements = JSON.parse(matches[1]);
        for (const element of elements) {
          tags.push({
            id: parseInt(element.tagid),
            name: element.name,
          });
        }
      }
    }
    const base = parseInt((apiData.type === 'dlc' && apiData.fullgame && apiData.fullgame.appid) || 0) || null;
    const dlcs = apiData.dlc ? apiData.dlc.map(item => parseInt(item)) : [];
    const subs = apiData.packages ? apiData.packages.map(item => parseInt(item)) : [];
    const bundles = [];
    if (isStoreResponseOk && !removed) {
      const elements = storeResponse.html.querySelectorAll('[data-ds-bundleid]');
      for (const element of elements) {
        bundles.push(parseInt(element.dataset.dsBundleid));
      }
    }
    await connection.beginTransaction();
    const columns = Object.keys(app);
    const values = Object.values(app);    
    await connection.query(`
      INSERT INTO games__app (${columns.join(', ')})
      VALUES (${values.map(value => connection.escape(value)).join(', ')})
      ON DUPLICATE KEY UPDATE ${columns.map(column => `${column} = VALUES(${column})`).join(', ')}
    `);
    await connection.query(`
      INSERT IGNORE INTO games__app_name (app_id, name)
      VALUES (${connection.escape(appId)}, ${connection.escape(apiData.name)})
    `);
    if (genres.length > 0) {
      await connection.query(`
        INSERT IGNORE INTO games__genre (genre_id, name)
        VALUES ${genres.map(genre => `(${connection.escape(genre.id)}, ${connection.escape(genre.name)})`).join(', ')}
      `);
      await connection.query(`
        INSERT IGNORE INTO games__app_genre (app_id, genre_id)
        VALUES ${genres.map(genre => `(${connection.escape(appId)}, ${connection.escape(genre.id)})`).join(', ')}
      `);
    }
    if (tags.length > 0) {
      await connection.query(`
        INSERT IGNORE INTO games__tag (tag_id, name)
        VALUES ${tags.map(tag => `(${connection.escape(tag.id)}, ${connection.escape(tag.name)})`).join(', ')}
      `);
      await connection.query(`
        INSERT IGNORE INTO games__app_tag (app_id, tag_id)
        VALUES ${tags.map(tag => `(${connection.escape(appId)}, ${connection.escape(tag.id)})`).join(', ')}
      `);
    }
    if (base || dlcs.length > 0) {
      await connection.query(`
        INSERT IGNORE INTO games__dlc (dlc_id, app_id)
        VALUES ${base ? `(${connection.escape(appId)}, ${connection.escape(base)})` : dlcs.map(dlcId => `(${connection.escape(dlcId)}, ${connection.escape(appId)})`).join(', ')}
      `);
    }
    if (subs.length > 0) {
      await connection.query(`
        INSERT IGNORE INTO games__sub_app (sub_id, app_id)
        VALUES ${subs.map(subId => `(${connection.escape(subId)}, ${connection.escape(appId)})`).join(', ')}
      `);
    }
    if (bundles.length > 0) {
      await connection.query(`
        INSERT IGNORE INTO games__bundle_app (bundle_id, app_id)
        VALUES ${bundles.map(bundleId => `(${connection.escape(bundleId)}, ${connection.escape(appId)})`).join(', ')}
      `);
    }
    await connection.commit();
  }
}

module.exports = App;