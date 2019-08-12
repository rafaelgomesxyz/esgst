/** @var {Object} webpack.BannerPlugin */
/** @var {Object} webpack.ProvidePlugin */
// noinspection NodeJsCodingAssistanceForCoreModules
/**
 * @typedef {Object} Environment
 * @property {boolean} development
 * @property {boolean} production
 * @property {boolean} withBabel
 * @property {boolean} withWatch
 * @property {boolean} sizeAnalyzer
 */

const calfinated = require(`calfinated`)();
const fs = require(`fs`);
const path = require(`path`);
const webpack = require(`webpack`);

// @ts-ignore
const bextJson = require(`./bext.json`);
// @ts-ignore
const packageJson = require(`./package.json`);

const loaders = {
  css: {
    loader: `css-loader`,
    options: {
      minimize: true
    }
  },
  style: {
    loader: `style-loader`,
    options: {
      insertInto: `html`,
      singleton: true
    }
  }
};
const plugins = {
  banner: webpack.BannerPlugin,
  circularDependency: require(`circular-dependency-plugin`),
  clean: require(`clean-webpack-plugin`),
  copy: require(`copy-webpack-plugin`),
  createFile: require(`create-file-webpack`),
  progressBar: require(`progress-bar-webpack-plugin`),
  provide: webpack.ProvidePlugin,
  sizeAnalyzer: require(`webpack-bundle-analyzer`).BundleAnalyzerPlugin
};

function getBuildEntries(env) {
  const buildEntries = {
    './build/chrome/eventPage': [`./src/entry/eventPage_index.js`],
    './build/chrome/esgst': [`./src/entry/index.js`],
    './build/chrome/esgst_sgtools': [`./src/entry/index_sgtools.js`],
    //'./build/chrome/options': [`./src/entry/options_index.js`],
    './build/chrome/permissions': [`./src/entry/permissions_index.js`],
    './build/firefox/eventPage': [`./src/entry/eventPage_index.js`],
    './build/firefox/esgst': [`./src/entry/index.js`],
    './build/firefox/esgst_sgtools': [`./src/entry/index_sgtools.js`],
    //'./build/firefox/options': [`./src/entry/options_index.js`],
    './build/firefox/permissions': [`./src/entry/permissions_index.js`],
    './build/palemoon/index': [`./src/entry/eventPage_sdk_index.js`],
    './build/palemoon/data/esgst': [`./src/entry/index.js`],
    './build/palemoon/data/esgst_sgtools': [`./src/entry/index_sgtools.js`]
  };
  if (env.production) {
    buildEntries[`./ESGST.user`] = [`./src/entry/index.js`];
  } else {
    buildEntries[`./build/userscript/ESGST.user`] = [`./src/entry/index.js`];
  }
  return buildEntries;
}

function getCreateFileOptions(env) {
  return [
    { content: JSON.stringify(getWebExtensionManifest(`chrome`, env), null, 2), fileName: `manifest.json`, path: `./build/chrome` },
    { content: JSON.stringify(getWebExtensionManifest(`firefox`, env), null, 2), fileName: `manifest.json`, path: `./build/firefox` },
    { content: JSON.stringify(getLegacyExtensionManifest(`palemoon`, env), null, 2), fileName: `package.json`, path: `./build/palemoon` }
  ];
}

function getCopyPatterns(env) {
  return [
    { from: `./src/assets/images/icon.png`, to: `./build/chrome/icon.png` },
    { from: `./node_modules/webextension-polyfill/dist/browser-polyfill.min.js`, to: `./build/chrome/lib/browser-polyfill.js` },
    //{ from: `./src/html/options.html`, to: `./build/chrome/options.html` },
    { from: `./src/html/permissions.html`, to: `./build/chrome/permissions.html` },
    { from: `./src/assets/images/icon.png`, to: `./build/firefox/icon.png` },
    { from: `./node_modules/webextension-polyfill/dist/browser-polyfill.min.js`, to: `./build/firefox/lib/browser-polyfill.js` },
    //{ from: `./src/html/options.html`, to: `./build/firefox/options.html` },
    { from: `./src/html/permissions.html`, to: `./build/firefox/permissions.html` },
    { from: `./src/assets/images/icon.png`, to: `./build/palemoon/icon.png` },
    { from: `./src/assets/images/icon-16.png`, to: `./build/palemoon/data/icon-16.png` },
    { from: `./src/assets/images/icon-32.png`, to: `./build/palemoon/data/icon-32.png` },
    { from: `./src/assets/images/icon-64.png`, to: `./build/palemoon/data/icon-64.png` }
  ];
}

function getWebExtensionManifest(browserName, env) {
  const manifest = {
    manifest_version: 2,
    name: packageJson.title,
    version: packageJson.version,

    description: packageJson.description,
    icons: {
      64: `icon.png`
    },

    author: packageJson.author,
    background: {
      scripts: [
        `lib/browser-polyfill.js`,
        `eventPage.js`
      ]
    },
    content_scripts: [
      {
        matches: [
          `*://*.steamgifts.com/*`,
          `*://*.steamtrades.com/*`
        ],
        js: [
          `lib/browser-polyfill.js`,
          `esgst.js`
        ],
        run_at: `document_start`
      },
      {
        matches: [
          `*://*.sgtools.info/*`
        ],
        js: [
          `lib/browser-polyfill.js`,
          `esgst_sgtools.js`
        ],
        run_at: `document_start`
      }
    ],
    //options_page: "options.html",
    permissions: [
      `storage`,
      `tabs`,
      `unlimitedStorage`,
      `*://*.steamgifts.com/*`,
      `*://*.steamtrades.com/*`,
      `*://*.sgtools.info/*`
    ],
    optional_permissions: [
      `cookies`,
      `*://*.api.dropboxapi.com/*`,
      `*://*.api.imgur.com/*`,
      `*://*.api.steampowered.com/*`,
      `*://*.content.dropboxapi.com/*`,
      `*://*.files.1drv.com/*`,
      `*://*.googleapis.com/*`,
      `*://*.graph.microsoft.com/*`,
      `*://*.gsrafael01.me/*`,
      `*://*.isthereanydeal.com/*`,
      `*://*.raw.githubusercontent.com/*`,
      `*://*.revadike.ga/*`,
      `*://*.script.google.com/*`,
      `*://*.script.googleusercontent.com/*`,
      `*://*.steam-tracker.com/*`,
      `*://*.steamcommunity.com/*`,
      `*://*.store.steampowered.com/*`,
      `*://*.userstyles.org/*`
    ],
    short_name: `ESGST`,
    web_accessible_resources: [
      `icon.png`
    ]
  };

  switch (browserName) {
    case `chrome`:
      manifest.background.persistent = true;
      if (!env.temporary) {
        manifest.key = bextJson.chrome.extensionKey;
      }
      break;
    case `firefox`:
      if (!env.temporary) {
        manifest.browser_specific_settings = {
          gecko: {
            id: bextJson.firefox.extensionId
          }
        };
      }
      break;
    default:
      break;
  }

  if (env.development) {
    manifest.content_security_policy = `script-src 'self' 'unsafe-eval'; object-src 'self';`;
    manifest.version_name = packageJson.devVersion;
  }

  return manifest;
}

function getLegacyExtensionManifest(browserName, env) {
  const manifest = {
    name: `extension-${browserName}`,
    version: packageJson.version,

    description: packageJson.description,

    author: packageJson.author,
    id: `addon@esgst`,
    keywords: [
      `jetpack`
    ],
    license: `MIT`,
    main: `index.js`,
    title: packageJson.title
  };

  switch (browserName) {
    case `palemoon`:
      manifest.engines = {
        firefox: `>=52.0 <=52.*`,
        '{8de7fcbb-c55c-4fbe-bfc5-fc555c87dbc4}': `>=27.1.0b1 <=28.*`
      };
      break;
    default:
      break;
  }

  if (env.development) {
    manifest.version_name = packageJson.devVersion;
  }

  return manifest;
}

module.exports = /** @param {Environment} env */ async env => {
  const cfg = {
    devtool: env.production ? false : `source-map`,
    entry: getBuildEntries(env),
    mode: env.production ? `production` : (env.development ? `development` : `none`),
    module: {
      rules: [
        {
          loaders: [
            loaders.style,
            loaders.css
          ],
          test: /\.css$/
        }
        // @ts-ignore
      ].concat(env.withBabel ? [
        {
          exclude: /node_modules|bower_components/,
          test: /\.js$/,
          use: {
            loader: `babel-loader`,
            options: {
              presets: [
                `@babel/preset-env`
              ]
            }
          }
        }
      ]: [])
    },
    output: {
      path: __dirname,
      filename: `[name].js`
    },
    plugins: [
      // @ts-ignore
      new plugins.progressBar,
      new plugins.clean([
        `./build`
      ]),
      // @ts-ignore
      new plugins.banner({
        raw: true,
        entryOnly: true,
        test: /user\.js$/,
        banner: () => {
          let bannerFile = path.join(__dirname, './src/entry/monkey_banner.js');
          if (!fs.existsSync(bannerFile)) {
            return '';
          }

          return calfinated.process(fs.readFileSync(bannerFile, 'utf8'), {package: packageJson});
        }
      }),
      new plugins.banner({
        banner: fs.readFileSync(path.join(__dirname, `./src/entry/eventPage_sdk_banner.js`), `utf8`),
        entryOnly: true,
        raw: true,
        test: /index\.js$/
      }),
      new plugins.provide({
        '$': `jquery`,
        'jQuery': `jquery`,
        'window.jQuery': `jquery`,
        'window.$': `jquery`
      }),
      new plugins.circularDependency({
        cwd: process.cwd(),
        exclude: /node_modules/,
        failOnError: true
      }),
      ...getCreateFileOptions(env).map(x => new plugins.createFile(x)),
      new plugins.copy(getCopyPatterns(env)),
    ].concat(env.sizeAnalyzer ? [
      new plugins.sizeAnalyzer
    ] : []),
    watch: env.development && env.withWatch,
    watchOptions: {
      aggregateTimeout: 1000,
      ignored: /node_modules/,
      poll: 1000
    }
  };

  return cfg;
};
