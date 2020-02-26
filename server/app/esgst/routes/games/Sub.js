const CustomError = require('../../class/CustomError');
const Request = require('../../class/Request');
const Utils = require('../../class/Utils');

/**
 * @api {SCHEMA} Sub Sub
 * @apiGroup Schemas
 * @apiName Sub
 * @apiDescription The optional properties are included based on the "filters" parameter.  If the parameter isn't used, all of the optional properties are included, except where noted.
 * @apiVersion 1.0.0
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

class Sub {
  /**
   * @param {import('../../class/Connection')} connection
   * @param {import('express').Request} req
   * @param {Array<number>} ids
   */
  static async get(connection, req, ids) {
    const columns = {
      name: 'g_sn.name',
      released: 'g_s.released',
      removed: 'g_s.removed',
      price: 'g_s.price',
      release_date: 'g_s.release_date',
      apps: 'g_sa_j.apps',
    };
    const columnKeys = Object.keys(columns);    
    const params = Object.assign({}, { filters: req.query.filters || req.query.sub_filters || '' });
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
        'g_s.sub_id',
        'g_s.last_update',
        ...Object.values(columns),
      ].join(', ')}
      FROM games__sub AS g_s
      ${Utils.isSet(columns.name) ? `
        INNER JOIN games__sub_name AS g_sn
        ON g_s.sub_id = g_sn.sub_id
      ` : ''}
      ${Utils.isSet(columns.apps) ? `
        LEFT JOIN (
          SELECT g_sa.sub_id, GROUP_CONCAT(DISTINCT g_sa.app_id) AS apps
          FROM games__sub_app AS g_sa
          GROUP BY g_sa.sub_id
        ) AS g_sa_j
        ON g_s.sub_id = g_sa_j.sub_id
      ` : ''}
      WHERE ${ids.map(id => `g_s.sub_id = ${connection.escape(id)}`).join(' OR ')}
      GROUP BY g_s.sub_id
    `);
    const subs = [];    
    const now = Math.trunc(Date.now() / 1e3);
    for (const row of rows) {
      const lastUpdate = Math.trunc((new Date(parseInt(row.last_update) * 1e3)).getTime() / 1e3);
      const differenceInSeconds = now - lastUpdate;
      if (differenceInSeconds < 60 * 60 * 24 * 7) {
        const sub = {
          sub_id: row.sub_id,
        };
        if (Utils.isSet(columns.name)) {
          sub.name = row.name;
        }
        if (Utils.isSet(columns.released)) {
          sub.released = !!row.released;
        }
        if (Utils.isSet(columns.removed)) {
          sub.removed = !!row.removed;
        }
        if (Utils.isSet(columns.price)) {
          sub.price = row.price;
        }
        if (Utils.isSet(columns.release_date)) {
          sub.release_date = Utils.isSet(row.release_date) ? Utils.formatDate(parseInt(row.release_date) * 1e3) : null;
        }
        if (Utils.isSet(columns.apps)) {
          sub.apps = row.apps ? row.apps.split(',').map(appId => parseInt(appId)) : [];
        }
        sub.last_update = Utils.formatDate(parseInt(row.last_update) * 1e3, true);
        subs.push(sub);
      }
    }
    return subs;
  }

  /**
   * @param {import('../../class/Connection')} connection
   * @param {number} subId
   */
  static async fetch(connection, subId) {
    const apiUrl = `https://store.steampowered.com/api/packagedetails?packageids=${subId}&filters=apps,basic,name,price,release_date&cc=us&l=en`;
    const apiResponse = await Request.get(apiUrl);
    if (!apiResponse || !apiResponse.json || !apiResponse.json[subId]) {
      throw new CustomError(CustomError.COMMON_MESSAGES.steam, 500);
    }
    const apiData = apiResponse.json[subId].success ? apiResponse.json[subId].data : null;
    if (!apiData) {
      return;
    }
    const storeUrl = `https://store.steampowered.com/sub/${subId}?cc=us&l=en`;
    const storeConfig = {
      headers: {
        'Cookie': 'birthtime=0; mature_content=1;',
      },
    };
    const storeResponse = await Request.get(storeUrl, storeConfig);
    if (!storeResponse.html) {
      throw new CustomError(CustomError.COMMON_MESSAGES.steam, 500);
    }
    const releaseDate = apiData.release_date;
    const sub = {
      sub_id: subId,
      released: !releaseDate.coming_soon,
      removed: !storeResponse.url.match(new RegExp(`store\.steampowered\.com.*?\/sub\/${subId}`)),
      price: parseInt((apiData.price && apiData.price.initial) || 0),
      release_date: releaseDate.date ? Math.trunc((new Date(`${releaseDate.date} UTC`)).getTime() / 1e3) : null,
      last_update: Math.trunc(Date.now() / 1e3),
    };
    const apps = apiData.apps ? apiData.apps.map(item => parseInt(item.id)) : [];
    await connection.beginTransaction();
    const columns = Object.keys(sub);
    const values = Object.values(sub);    
    await connection.query(`
      INSERT INTO games__sub (${columns.join(', ')})
      VALUES (${values.map(value => connection.escape(value)).join(', ')})
      ON DUPLICATE KEY UPDATE ${columns.map(column => `${column} = VALUES(${column})`).join(', ')}
    `);
    await connection.query(`
      INSERT IGNORE INTO games__sub_name (sub_id, name)
      VALUES (${connection.escape(subId)}, ${connection.escape(apiData.name)})
    `);
    if (apps.length > 0) {
      await connection.query(`
        INSERT IGNORE INTO games__sub_app (sub_id, app_id)
        VALUES ${apps.map(appId => `(${connection.escape(subId)}, ${connection.escape(appId)})`).join(', ')}
      `);
    }
    await connection.commit();
  }
}

module.exports = Sub;