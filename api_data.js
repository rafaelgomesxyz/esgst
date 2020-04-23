define({ "api": [
  {
    "type": "GET",
    "url": "/game/:type/:id",
    "title": "GetGame",
    "group": "Games",
    "name": "GetGame",
    "description": "<p>Returns information about a game.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Path Parameters": [
          {
            "group": "Path Parameters",
            "type": "String",
            "allowedValues": [
              "app",
              "sub",
              "bundle"
            ],
            "optional": false,
            "field": "type",
            "description": "<p>The type of the game.</p>"
          },
          {
            "group": "Path Parameters",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>The Steam ID of the game.</p>"
          }
        ],
        "Query Parameters": [
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "filters",
            "description": "<p>A comma-separated list of filters to filter the information requested. The accepted values are all of the optional properties of the object associated with the type of the game (<a href=\"#api-Schemas-App\">App</a>, <a href=\"#api-Schemas-Sub\">Sub</a> or <a href=\"#api-Schemas-Bundle\">Bundle</a>), except for properties tagged with [NOT FILTERABLE].</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success Response (200)": [
          {
            "group": "Success Response (200)",
            "type": "Object",
            "optional": false,
            "field": "output",
            "description": ""
          },
          {
            "group": "Success Response (200)",
            "type": "NULL",
            "optional": false,
            "field": "output.error",
            "description": "<p>Always NULL in a success response.</p>"
          },
          {
            "group": "Success Response (200)",
            "type": "<a href=\"#api-Schemas-App\">App</a>/<a href=\"#api-Schemas-Sub\">Sub</a>/<a href=\"#api-Schemas-Bundle\">Bundle</a>/NULL",
            "optional": false,
            "field": "output.result",
            "description": "<p>The information requested, or NULL if it isn't available.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error Response (400, 500)": [
          {
            "group": "Error Response (400, 500)",
            "type": "Object",
            "optional": false,
            "field": "output",
            "description": ""
          },
          {
            "group": "Error Response (400, 500)",
            "type": "String",
            "optional": false,
            "field": "output.error",
            "description": "<p>The error message.</p>"
          },
          {
            "group": "Error Response (400, 500)",
            "type": "NULL",
            "optional": false,
            "field": "output.result",
            "description": "<p>Always NULL in an error response.</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/Game.js",
    "groupTitle": "Games",
    "sampleRequest": [
      {
        "url": "https://rafaelgssa.com/esgst/game/:type/:id"
      }
    ]
  },
  {
    "type": "GET",
    "url": "/games",
    "title": "GetGames",
    "group": "Games",
    "name": "GetGames",
    "description": "<p>Returns information about multiple games.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Query Parameters": [
          {
            "group": "Query Parameters",
            "type": "Boolean",
            "optional": true,
            "field": "join_all",
            "description": "<p>If true, the result is a <a href=\"#api-Schemas-GamesJoined\">GamesJoined</a> object. If false, the format of the result depends on the &quot;format_array&quot; parameter.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "Boolean",
            "optional": true,
            "field": "format_array",
            "description": "<p>If true, the result is a <a href=\"#api-Schemas-GamesSeparatedArray\">GamesSeparatedArray</a> object. If false, the result is a <a href=\"#api-Schemas-GamesSeparated\">GamesSeparated</a> object.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "Boolean",
            "optional": true,
            "field": "show_id",
            "description": "<p>If false, the <a href=\"#api-Schemas-App\">App</a>, <a href=\"#api-Schemas-Sub\">Sub</a> and <a href=\"#api-Schemas-Bundle\">Bundle</a> objects from the &quot;found&quot; object do not have the respective &quot;app_id&quot;, &quot;sub_id&quot; or &quot;bundle_id&quot; property.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "app_ids",
            "description": "<p>A comma-separated list of Steam IDs for the apps requested.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "sub_ids",
            "description": "<p>A comma-separated list of Steam IDs for the subs requested.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "bundle_ids",
            "description": "<p>A comma-separated list of Steam IDs for the bundles requested.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "app_filters",
            "description": "<p>A comma-separated list of filters to filter the apps requested. The accepted values are all of the optional properties of the <a href=\"#api-Schemas-App\">App</a> object, except for properties tagged with [NOT FILTERABLE].</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "sub_filters",
            "description": "<p>A comma-separated list of filters to filter the subs requested. The accepted values are all of the optional properties of the <a href=\"#api-Schemas-Sub\">Sub</a> object, except for properties tagged with [NOT FILTERABLE].</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "bundle_filters",
            "description": "<p>A comma-separated list of filters to filter the bundles requested. The accepted values are all of the optional properties of the <a href=\"#api-Schemas-Bundle\">Bundle</a> object, except for properties tagged with [NOT FILTERABLE].</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success Response (200)": [
          {
            "group": "Success Response (200)",
            "type": "Object",
            "optional": false,
            "field": "output",
            "description": ""
          },
          {
            "group": "Success Response (200)",
            "type": "NULL",
            "optional": false,
            "field": "output.error",
            "description": "<p>Always NULL in a success response.</p>"
          },
          {
            "group": "Success Response (200)",
            "type": "<a href=\"#api-Schemas-GamesSeparated\">GamesSeparated</a>/<a href=\"#api-Schemas-GamesSeparatedArray\">GamesSeparatedArray</a>/<a href=\"#api-Schemas-GamesJoined\">GamesJoined</a>",
            "optional": false,
            "field": "output.result",
            "description": "<p>The information requested.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error Response (400, 500)": [
          {
            "group": "Error Response (400, 500)",
            "type": "Object",
            "optional": false,
            "field": "output",
            "description": ""
          },
          {
            "group": "Error Response (400, 500)",
            "type": "String",
            "optional": false,
            "field": "output.error",
            "description": "<p>The error message.</p>"
          },
          {
            "group": "Error Response (400, 500)",
            "type": "NULL",
            "optional": false,
            "field": "output.result",
            "description": "<p>Always NULL in an error response.</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/Games.js",
    "groupTitle": "Games",
    "sampleRequest": [
      {
        "url": "https://rafaelgssa.com/esgst/games"
      }
    ]
  },
  {
    "type": "GET",
    "url": "/games/rcv",
    "title": "GetRcv",
    "group": "Games",
    "name": "GetRcv",
    "description": "<p>Returns information about reduced CV games.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Query Parameters": [
          {
            "group": "Query Parameters",
            "type": "Boolean",
            "optional": true,
            "field": "format_array",
            "description": "<p>If true, the result is a <a href=\"#api-Schemas-RcvArray\">RcvArray</a> object. If false, the result is a <a href=\"#api-Schemas-RcvObject\">RcvObject</a> object.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "Boolean",
            "optional": true,
            "field": "show_id",
            "description": "<p>If false, the <a href=\"#api-Schemas-RcvApp\">RcvApp</a> and <a href=\"#api-Schemas-RcvSub\">RcvSub</a> objects do not have the respective &quot;app_id&quot; or &quot;sub_id&quot; property.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "Boolean",
            "optional": true,
            "field": "show_name",
            "description": "<p>If false, the <a href=\"#api-Schemas-RcvApp\">RcvApp</a> and <a href=\"#api-Schemas-RcvSub\">RcvSub</a> objects do not have the &quot;name&quot; property.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "app_ids",
            "description": "<p>A comma-separated list of Steam IDs for the apps requested.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "sub_ids",
            "description": "<p>A comma-separated list of Steam IDs for the subs requested.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "date_after",
            "description": "<p>Returns only games that began giving reduced CV after the specified date. The date must be in the format YYYY-MM-DD.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "date_after_or_equal",
            "description": "<p>Returns only games that began giving reduced CV after or at the specified date. The date must be in the format YYYY-MM-DD.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "date_before",
            "description": "<p>Returns only games that began giving reduced CV before the specified date. The date must be in the format YYYY-MM-DD.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "date_before_or_equal",
            "description": "<p>Returns only games that began giving reduced CV before or at the specified date. The date must be in the format YYYY-MM-DD.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "date_equal",
            "description": "<p>Returns only games that began giving reduced CV at the specified date. The date must be in the format YYYY-MM-DD.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "Boolean",
            "optional": true,
            "field": "show_recent",
            "description": "<p>Returns only the last 100 apps and the last 50 subs that were added.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success Response (200)": [
          {
            "group": "Success Response (200)",
            "type": "Object",
            "optional": false,
            "field": "output",
            "description": ""
          },
          {
            "group": "Success Response (200)",
            "type": "NULL",
            "optional": false,
            "field": "output.error",
            "description": "<p>Always NULL in a success response.</p>"
          },
          {
            "group": "Success Response (200)",
            "type": "<a href=\"#api-Schemas-RcvObject\">RcvObject</a>/<a href=\"#api-Schemas-RcvArray\">RcvArray</a>",
            "optional": false,
            "field": "output.result",
            "description": "<p>The information requested.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error Response (400, 500)": [
          {
            "group": "Error Response (400, 500)",
            "type": "Object",
            "optional": false,
            "field": "output",
            "description": ""
          },
          {
            "group": "Error Response (400, 500)",
            "type": "String",
            "optional": false,
            "field": "output.error",
            "description": "<p>The error message.</p>"
          },
          {
            "group": "Error Response (400, 500)",
            "type": "NULL",
            "optional": false,
            "field": "output.result",
            "description": "<p>Always NULL in an error response.</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/Rcv.js",
    "groupTitle": "Games",
    "sampleRequest": [
      {
        "url": "https://rafaelgssa.com/esgst/games/rcv"
      }
    ]
  },
  {
    "type": "SCHEMA",
    "url": "App",
    "title": "App",
    "group": "Schemas",
    "name": "App",
    "description": "<p>The optional properties are included based on the &quot;filters&quot; parameter. If the parameter isn't used, all of the optional properties are included, except where noted.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "app",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "String",
            "allowedValues": [
              "app"
            ],
            "optional": true,
            "field": "app.type",
            "defaultValue": "app",
            "description": "<p>[NOT FILTERABLE] The type of the game. This property is only available for the <a href=\"#api-Games-GetGames\">GetGames</a> method when used with the parameter &quot;join_all&quot;.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer",
            "optional": true,
            "field": "app.app_id",
            "description": "<p>[NOT FILTERABLE] The Steam ID of the game. This property is not available for the <a href=\"#api-Games-GetGames\">GetGames</a> method when used without the &quot;join_all&quot;, &quot;format_array&quot; and &quot;show_id&quot; parameters.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": true,
            "field": "app.name",
            "description": "<p>The name of the game.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean",
            "optional": true,
            "field": "app.released",
            "description": "<p>Whether the game has been released to the Steam store or not.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean",
            "optional": true,
            "field": "app.removed",
            "description": "<p>Whether the game has been removed from the Steam store or not.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean",
            "optional": true,
            "field": "app.steam_cloud",
            "description": "<p>Whether the game has Steam cloud or not.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean",
            "optional": true,
            "field": "app.trading_cards",
            "description": "<p>Whether the game has trading cards or not.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean/NULL",
            "optional": true,
            "field": "app.learning",
            "description": "<p>A boolean indicating whether Steam is learning about the game or not, or NULL if the information is not accessible.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean",
            "optional": true,
            "field": "app.multiplayer",
            "description": "<p>Whether the game is multiplayer or not.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean",
            "optional": true,
            "field": "app.singleplayer",
            "description": "<p>Whether the game is singleplayer or not.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean",
            "optional": true,
            "field": "app.linux",
            "description": "<p>Whether the game runs on Linux or not.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean",
            "optional": true,
            "field": "app.mac",
            "description": "<p>Whether the game runs on Mac or not.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean",
            "optional": true,
            "field": "app.windows",
            "description": "<p>Whether the game runs on Windows or not.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer",
            "optional": true,
            "field": "app.achievements",
            "description": "<p>The number of achievements that the game has, or 0 if it doesn't have any.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer",
            "optional": true,
            "field": "app.price",
            "description": "<p>The price of the game in USD ($9.99 is represented as 999), or 0 if it's free.</p>"
          },
          {
            "group": "Schema",
            "type": "Object/NULL",
            "optional": true,
            "field": "app.metacritic",
            "description": "<p>Information about the Metacritic score of the game, or NULL if it doesn't have a Metacritic page.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer",
            "optional": false,
            "field": "app.metacritic.score",
            "description": "<p>The Metacritic score of the game.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "app.metacritic.id",
            "description": "<p>The Metacritic ID of the game, useful for building its Metacritic URL (https://www.metacritic.com/game/pc/{id}).</p>"
          },
          {
            "group": "Schema",
            "type": "Object/NULL",
            "optional": true,
            "field": "app.rating",
            "description": "<p>Information about the Steam rating of the game, or NULL if it doesn't have enough ratings.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer",
            "optional": false,
            "field": "app.rating.percentage",
            "description": "<p>The percentage of positive ratings that the game has.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer",
            "optional": false,
            "field": "app.rating.count",
            "description": "<p>The total number of ratings that the game has.</p>"
          },
          {
            "group": "Schema",
            "type": "String/NULL",
            "optional": true,
            "field": "app.release_date",
            "description": "<p>When the game was released or is going to be released in the format YYYY-MM-DD, or NULL if there's no release date.</p>"
          },
          {
            "group": "Schema",
            "type": "String[]",
            "optional": true,
            "field": "app.genres",
            "description": "<p>The genres of the game (according to the developers). Can be empty.</p>"
          },
          {
            "group": "Schema",
            "type": "String[]",
            "optional": true,
            "field": "app.tags",
            "description": "<p>The user-defined tags of the game (according to the players). Can be empty.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer/NULL",
            "optional": true,
            "field": "app.base",
            "description": "<p>The Steam ID of the base game, or NULL if the game isn't a DLC.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": true,
            "field": "app.dlcs",
            "description": "<p>The Steam IDs of the DLCs that the game has. Can be empty.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": true,
            "field": "app.subs",
            "description": "<p>The Steam IDs of the subs that include the game. Can be empty.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": true,
            "field": "app.bundles",
            "description": "<p>The Steam IDs of the bundles that include the game. Can be empty.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "app.last_update",
            "description": "<p>When the information was last updated in the format YYYY/MM/DD HH:mm:SS (UTC timezone).</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/App.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "SCHEMA",
    "url": "Bundle",
    "title": "Bundle",
    "group": "Schemas",
    "name": "Bundle",
    "description": "<p>The optional properties are included based on the &quot;filters&quot; parameter. If the parameter isn't used, all of the optional properties are included, except where noted.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "bundle",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "String",
            "allowedValues": [
              "bundle"
            ],
            "optional": true,
            "field": "bundle.type",
            "defaultValue": "bundle",
            "description": "<p>[NOT FILTERABLE] The type of the game. This property is only available for the <a href=\"#api-Games-GetGames\">GetGames</a> method when used with the parameter &quot;join_all&quot;.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer",
            "optional": true,
            "field": "bundle.bundle_id",
            "description": "<p>[NOT FILTERABLE] The Steam ID of the game. This property is not available for the <a href=\"#api-Games-GetGames\">GetGames</a> method when used without the &quot;join_all&quot;, &quot;format_array&quot; and &quot;show_id&quot; parameters.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": true,
            "field": "bundle.name",
            "description": "<p>The name of the game.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean",
            "optional": true,
            "field": "bundle.removed",
            "description": "<p>Whether the game has been removed from the Steam store or not.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": true,
            "field": "bundle.apps",
            "description": "<p>The Steam IDs of the apps that are included in the game.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "bundle.last_update",
            "description": "<p>When the information was last updated in the format YYYY/MM/DD HH:mm:SS (UTC timezone).</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/Bundle.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "SCHEMA",
    "url": "GamesJoined",
    "title": "GamesJoined",
    "group": "Schemas",
    "name": "GamesJoined",
    "description": "<p>The <a href=\"#api-Schemas-App\">App</a>, <a href=\"#api-Schemas-Sub\">Sub</a> and <a href=\"#api-Schemas-Bundle\">Bundle</a> objects from the &quot;found&quot; object have the additional &quot;type&quot; property, to help separate them. The <a href=\"#api-Schemas-App\">App</a>, <a href=\"#api-Schemas-Sub\">Sub</a> and <a href=\"#api-Schemas-Bundle\">Bundle</a> objects from the &quot;not_found&quot; object only have the &quot;type&quot; and the respective &quot;app_id&quot;, &quot;sub_id&quot; or &quot;bundle_id&quot; properties.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Array",
            "optional": false,
            "field": "result.found",
            "description": "<p>An array of <a href=\"#api-Schemas-App\">App</a>, <a href=\"#api-Schemas-Sub\">Sub</a> and <a href=\"#api-Schemas-Bundle\">Bundle</a> objects for the games that were found.</p>"
          },
          {
            "group": "Schema",
            "type": "Array",
            "optional": false,
            "field": "result.not_found",
            "description": "<p>An array of <a href=\"#api-Schemas-App\">App</a>, <a href=\"#api-Schemas-Sub\">Sub</a> and <a href=\"#api-Schemas-Bundle\">Bundle</a> objects for the games that were not found.</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/Games.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "SCHEMA",
    "url": "GamesSeparated",
    "title": "GamesSeparated",
    "group": "Schemas",
    "name": "GamesSeparated",
    "description": "<p>The <a href=\"#api-Schemas-App\">App</a>, <a href=\"#api-Schemas-Sub\">Sub</a> and <a href=\"#api-Schemas-Bundle\">Bundle</a> objects from the &quot;found&quot; object do not have the respective &quot;app_id&quot;, &quot;sub_id&quot; or &quot;bundle_id&quot; property if the parameter &quot;show_id&quot; isn't used, as the object keys already represent the Steam IDs of the games.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.found",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.found.apps",
            "description": "<p>An object of <a href=\"#api-Schemas-App\">App</a> objects for the apps that were found, with their Steam IDs as the keys.</p>"
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.found.subs",
            "description": "<p>An object of <a href=\"#api-Schemas-Sub\">Sub</a> objects for the subs that were found, with their Steam IDs as the keys.</p>"
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.found.bundles",
            "description": "<p>An object of <a href=\"#api-Schemas-Bundle\">Bundle</a> objects for the bundles that were found, with their Steam IDs as the keys.</p>"
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.not_found",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": false,
            "field": "result.not_found.apps",
            "description": "<p>The Steam IDs of the apps that were not found.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": false,
            "field": "result.not_found.subs",
            "description": "<p>The Steam IDs of the subs that were not found.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": false,
            "field": "result.not_found.bundles",
            "description": "<p>The Steam IDs of the bundles that were not found.</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/Games.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "SCHEMA",
    "url": "GamesSeparatedArray",
    "title": "GamesSeparatedArray",
    "group": "Schemas",
    "name": "GamesSeparatedArray",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.found",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "<a href=\"#api-Schemas-App\">App</a>[]",
            "optional": false,
            "field": "result.found.apps",
            "description": "<p>The apps that were found.</p>"
          },
          {
            "group": "Schema",
            "type": "<a href=\"#api-Schemas-Sub\">Sub</a>[]",
            "optional": false,
            "field": "result.found.subs",
            "description": "<p>The subs that were found.</p>"
          },
          {
            "group": "Schema",
            "type": "<a href=\"#api-Schemas-Bundle\">Bundle</a>[]",
            "optional": false,
            "field": "result.found.bundles",
            "description": "<p>The bundles that were found.</p>"
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.not_found",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": false,
            "field": "result.not_found.apps",
            "description": "<p>The Steam IDs of the apps that were not found.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": false,
            "field": "result.not_found.subs",
            "description": "<p>The Steam IDs of the subs that were not found.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": false,
            "field": "result.not_found.bundles",
            "description": "<p>The Steam IDs of the bundles that were not found.</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/Games.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "SCHEMA",
    "url": "RcvApp",
    "title": "RcvApp",
    "group": "Schemas",
    "name": "RcvApp",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "app",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Integer",
            "optional": true,
            "field": "app.app_id",
            "description": "<p>The Steam ID of the game. This property is not available without the &quot;format_array&quot; and &quot;show_id&quot; parameters.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": true,
            "field": "app.name",
            "description": "<p>The name of the game. This property is not available without the &quot;show_name&quot; parameter.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "app.effective_date",
            "description": "<p>When the game began giving reduced CV in the format YYYY-MM-DD.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "app.added_date",
            "description": "<p>When the game was added to the database in the format YYYY-MM-DD.</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/Rcv.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "SCHEMA",
    "url": "RcvArray",
    "title": "RcvArray",
    "group": "Schemas",
    "name": "RcvArray",
    "description": "<p>The <a href=\"#api-Schemas-RcvApp\">RcvApp</a> and <a href=\"#api-Schemas-RcvSub\">RcvSub</a> objects do not have the &quot;name&quot; property if the parameter &quot;show_name&quot; isn't used.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.found",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "<a href=\"#api-Schemas-RcvApp\">RcvApp</a>[]",
            "optional": false,
            "field": "result.found.apps",
            "description": "<p>The apps that were found.</p>"
          },
          {
            "group": "Schema",
            "type": "<a href=\"#api-Schemas-RcvSub\">RcvSub</a>[]",
            "optional": false,
            "field": "result.found.subs",
            "description": "<p>The subs that were found.</p>"
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.not_found",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": false,
            "field": "result.not_found.apps",
            "description": "<p>The Steam IDs of the apps that were not found.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": false,
            "field": "result.not_found.subs",
            "description": "<p>The Steam IDs of the subs that were not found.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "result.last_update_from_sg",
            "description": "<p>When the database was last fully updated from SteamGifts in the format YYYY/MM/DD HH:mm:SS (UTC timezone).</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "result.last_update_from_sgtools",
            "description": "<p>When the database was last partially updated from SGTools in the format YYYY/MM/DD HH:mm:SS (UTC timezone).</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/Rcv.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "SCHEMA",
    "url": "RcvObject",
    "title": "RcvObject",
    "group": "Schemas",
    "name": "RcvObject",
    "description": "<p>The <a href=\"#api-Schemas-RcvApp\">RcvApp</a> and <a href=\"#api-Schemas-RcvSub\">RcvSub</a> objects do not have the respective &quot;app_id&quot; or &quot;sub_id&quot; property if the parameter &quot;show_id&quot; isn't used, as the object keys already represent the Steam IDs of the games, and the &quot;name&quot; property if the parameter &quot;show_name&quot; isn't used.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.found",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.found.apps",
            "description": "<p>An object of <a href=\"#api-Schemas-RcvApp\">RcvApp</a> objects for the apps that were found, with their Steam IDs as the keys.</p>"
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.found.subs",
            "description": "<p>An object of <a href=\"#api-Schemas-RcvSub\">RcvSub</a> objects for the subs that were found, with their Steam IDs as the keys.</p>"
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.not_found",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": false,
            "field": "result.not_found.apps",
            "description": "<p>The Steam IDs of the apps that were not found.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": false,
            "field": "result.not_found.subs",
            "description": "<p>The Steam IDs of the subs that were not found.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "result.last_update_from_sg",
            "description": "<p>When the database was last fully updated from SteamGifts in the format YYYY/MM/DD HH:mm:SS (UTC timezone).</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "result.last_update_from_sgtools",
            "description": "<p>When the database was last partially updated from SGTools in the format YYYY/MM/DD HH:mm:SS (UTC timezone).</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/Rcv.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "SCHEMA",
    "url": "RcvSub",
    "title": "RcvSub",
    "group": "Schemas",
    "name": "RcvSub",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "sub",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Integer",
            "optional": true,
            "field": "sub.sub_id",
            "description": "<p>The Steam ID of the game. This property is not available without the &quot;format_array&quot; and &quot;show_id&quot; parameters.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": true,
            "field": "sub.name",
            "description": "<p>The name of the game. This property is not available without the &quot;show_name&quot; parameter.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "sub.effective_date",
            "description": "<p>When the game began giving reduced CV in the format YYYY-MM-DD.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "sub.added_date",
            "description": "<p>When the game was added to the database in the format YYYY-MM-DD.</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/Rcv.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "SCHEMA",
    "url": "Sub",
    "title": "Sub",
    "group": "Schemas",
    "name": "Sub",
    "description": "<p>The optional properties are included based on the &quot;filters&quot; parameter.  If the parameter isn't used, all of the optional properties are included, except where noted.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "sub",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "String",
            "allowedValues": [
              "sub"
            ],
            "optional": true,
            "field": "sub.type",
            "defaultValue": "sub",
            "description": "<p>[NOT FILTERABLE] The type of the game. This property is only available for the <a href=\"#api-Games-GetGames\">GetGames</a> method when used with the parameter &quot;join_all&quot;.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer",
            "optional": true,
            "field": "sub.sub_id",
            "description": "<p>[NOT FILTERABLE] The Steam ID of the game. This property is not available for the <a href=\"#api-Games-GetGames\">GetGames</a> method when used without the &quot;join_all&quot;, &quot;format_array&quot; and &quot;show_id&quot; parameters.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": true,
            "field": "sub.name",
            "description": "<p>The name of the game.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean",
            "optional": true,
            "field": "sub.released",
            "description": "<p>Whether the game has been released to the Steam store or not.</p>"
          },
          {
            "group": "Schema",
            "type": "Boolean",
            "optional": true,
            "field": "sub.removed",
            "description": "<p>Whether the game has been removed from the Steam store or not.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer",
            "optional": true,
            "field": "sub.price",
            "description": "<p>The price of the game in USD ($9.99 is represented as 999), or 0 if it's free.</p>"
          },
          {
            "group": "Schema",
            "type": "String/NULL",
            "optional": true,
            "field": "sub.release_date",
            "description": "<p>When the game was released or is going to be released in the format YYYY-MM-DD, or NULL if there's no release date.</p>"
          },
          {
            "group": "Schema",
            "type": "Integer[]",
            "optional": true,
            "field": "sub.apps",
            "description": "<p>The Steam IDs of the apps that are included in the game.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "sub.last_update",
            "description": "<p>When the information was last updated in the format YYYY/MM/DD HH:mm:SS (UTC timezone).</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/games/Sub.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "SCHEMA",
    "url": "Uh",
    "title": "Uh",
    "group": "Schemas",
    "name": "Uh",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": true,
            "field": "user.steam_id",
            "description": "<p>The Steam ID of the user. This property is not available for the <a href=\"#api-Users-GetAllUh\">GetAllUh</a> method when used without the &quot;format_array&quot; and &quot;show_steam_id&quot; parameters.</p>"
          },
          {
            "group": "Schema",
            "type": "String[]",
            "optional": false,
            "field": "user.usernames",
            "description": "<p>An array containing the username history for the user, from most recent to least recent.</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "user.last_check",
            "description": "<p>When the username history for the user was last checked in the format YYYY/MM/DD HH:mm:SS (UTC timezone).</p>"
          },
          {
            "group": "Schema",
            "type": "String",
            "optional": false,
            "field": "user.last_update",
            "description": "<p>When the username history for the user was last updated in the format YYYY/MM/DD HH:mm:SS (UTC timezone).</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/users/Uh.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "SCHEMA",
    "url": "UhArray",
    "title": "UhArray",
    "group": "Schemas",
    "name": "UhArray",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "<a href=\"#api-Schemas-Uh\">Uh</a>[]",
            "optional": false,
            "field": "result.found",
            "description": "<p>The users that were found.</p>"
          },
          {
            "group": "Schema",
            "type": "String[]",
            "optional": false,
            "field": "result.not_found",
            "description": "<p>The Steam IDs of the users that were not found.</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/users/Uh.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "SCHEMA",
    "url": "UhObject",
    "title": "UhObject",
    "group": "Schemas",
    "name": "UhObject",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Schema": [
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": ""
          },
          {
            "group": "Schema",
            "type": "Object",
            "optional": false,
            "field": "result.found",
            "description": "<p>An object of <a href=\"#api-Schemas-Uh\">Uh</a> objects for the users that were found, with their Steam IDs as the keys.</p>"
          },
          {
            "group": "Schema",
            "type": "String[]",
            "optional": false,
            "field": "result.not_found",
            "description": "<p>The Steam IDs of the users that were not found.</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/users/Uh.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "GET",
    "url": "/users/uh",
    "title": "GetAllUh",
    "group": "Users",
    "name": "GetAllUh",
    "description": "<p>Returns the username history for users.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Query Parameters": [
          {
            "group": "Query Parameters",
            "type": "Boolean",
            "optional": true,
            "field": "format_array",
            "description": "<p>If true, the result is a <a href=\"#api-Schemas-UhArray\">UhArray</a> object. If false, the result is a <a href=\"#api-Schemas-UhObject\">UhObject</a> object.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "Boolean",
            "optional": true,
            "field": "show_steam_id",
            "description": "<p>If false, the <a href=\"#api-Schemas-Uh\">Uh</a> object from the &quot;found&quot; object does not have the &quot;steam_id&quot; property.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "steam_ids",
            "description": "<p>A comma-separated list of Steam IDs for the users requested.</p>"
          },
          {
            "group": "Query Parameters",
            "type": "Boolean",
            "optional": true,
            "field": "show_recent",
            "description": "<p>If true, only the 100 most recently updated username histories are returned.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success Response (200)": [
          {
            "group": "Success Response (200)",
            "type": "Object",
            "optional": false,
            "field": "output",
            "description": ""
          },
          {
            "group": "Success Response (200)",
            "type": "NULL",
            "optional": false,
            "field": "output.error",
            "description": "<p>Always NULL in a success response.</p>"
          },
          {
            "group": "Success Response (200)",
            "type": "<a href=\"#api-Schemas-UhObject\">UhObject</a>/<a href=\"#api-Schemas-UhArray\">UhArray</a>",
            "optional": false,
            "field": "output.result",
            "description": "<p>The information requested.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error Response (400, 500)": [
          {
            "group": "Error Response (400, 500)",
            "type": "Object",
            "optional": false,
            "field": "output",
            "description": ""
          },
          {
            "group": "Error Response (400, 500)",
            "type": "String",
            "optional": false,
            "field": "output.error",
            "description": "<p>The error message.</p>"
          },
          {
            "group": "Error Response (400, 500)",
            "type": "NULL",
            "optional": false,
            "field": "output.result",
            "description": "<p>Always NULL in an error response.</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/users/Uh.js",
    "groupTitle": "Users",
    "sampleRequest": [
      {
        "url": "https://rafaelgssa.com/esgst/users/uh"
      }
    ]
  },
  {
    "type": "GET",
    "url": "/user/+:steamid/uh",
    "title": "GetUh",
    "group": "Users",
    "name": "GetUh",
    "description": "<p>Returns the username history for the user.</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Path Parameters": [
          {
            "group": "Path Parameters",
            "type": "String",
            "optional": false,
            "field": "steamid",
            "description": "<p>The Steam ID of the user.</p>"
          }
        ],
        "Query Parameters": [
          {
            "group": "Query Parameters",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>The current username of the user, for checking purposes.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success Response (200)": [
          {
            "group": "Success Response (200)",
            "type": "Object",
            "optional": false,
            "field": "output",
            "description": ""
          },
          {
            "group": "Success Response (200)",
            "type": "NULL",
            "optional": false,
            "field": "output.error",
            "description": "<p>Always NULL in a success response.</p>"
          },
          {
            "group": "Success Response (200)",
            "type": "<a href=\"#api-Schemas-Uh\">Uh</a>/NULL",
            "optional": false,
            "field": "output.result",
            "description": "<p>The information requested, or NULL if it isn't available.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error Response (400, 500)": [
          {
            "group": "Error Response (400, 500)",
            "type": "Object",
            "optional": false,
            "field": "output",
            "description": ""
          },
          {
            "group": "Error Response (400, 500)",
            "type": "String",
            "optional": false,
            "field": "output.error",
            "description": "<p>The error message.</p>"
          },
          {
            "group": "Error Response (400, 500)",
            "type": "NULL",
            "optional": false,
            "field": "output.result",
            "description": "<p>Always NULL in an error response.</p>"
          }
        ]
      }
    },
    "filename": "app/esgst/routes/users/Uh.js",
    "groupTitle": "Users",
    "sampleRequest": [
      {
        "url": "https://rafaelgssa.com/esgst/user/+:steamid/uh"
      }
    ]
  }
] });
