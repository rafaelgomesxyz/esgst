/** @var {Object} webpack.BannerPlugin */
/** @var {Object} webpack.ProvidePlugin */
// noinspection NodeJsCodingAssistanceForCoreModules
/**
 * @typedef {Object} Environment
 * @property {boolean} development
 * @property {boolean} production
 * @property {boolean} withBabel
 * @property {boolean} withWatch
 */

const
  fs = require('fs'),
  path = require('path'),
  calfinated = require('calfinated')(),
  webpack = require('webpack'),
  plugins = {
    clean: require('clean-webpack-plugin'),
    circularDependency: require('circular-dependency-plugin'),
    sizeAnalyzer: require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    progressBar: require('progress-bar-webpack-plugin'),
    banner: webpack.BannerPlugin,
    provide: webpack.ProvidePlugin,
    shell: require('webpack-shell-plugin')
  },
  BUILD_PATHS = {
    EXTENSION: 'build/esgst',
    EXTENSION_SGTOOLS: 'build/esgst_sgtools',
    EXTENSION_EVENT_PAGE: 'build/eventPage',
    EXTENSION_EVENT_PAGE_SDK: 'build/index'
  },
  loaders = {
    style: {
      loader: 'style-loader',
      options: {
        singleton: true,
        insertInto: 'html'
      }
    },
    css: {
      loader: 'css-loader',
      options: { minimize: true }
    }
  }
;

module.exports = /** @param {Environment} env */ async env => {
  const entry = {
    [BUILD_PATHS.EXTENSION]: ['./index.js'],
    [BUILD_PATHS.EXTENSION_SGTOOLS]: ['./index_sgtools.js'],
    [BUILD_PATHS.EXTENSION_EVENT_PAGE]: ['./eventPage_index.js'],
    [BUILD_PATHS.EXTENSION_EVENT_PAGE_SDK]: ['./eventPage_sdk_index.js']
  };

  const cfg = {
    devtool: env.production ? false : `source-map`,
    mode: env.production ? 'production' : (env.development ? 'development' : 'none'),
    context: path.join(__dirname, './src/entry/'),
    entry,
    output: {
      path: __dirname,
      filename: "[name].js"
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          loaders: [
            loaders.style,
            loaders.css
          ]
        }
      ].concat(env.withBabel ? [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ]
            }
          }
        }
      ]: [])
    },
    plugins: [
      new plugins.clean([`build`]),
      new plugins.circularDependency({
        exclude: /node_modules/,
        failOnError: true,
        cwd: process.cwd()
      }),
      new plugins.banner({
        raw: true,
        entryOnly: true,
        test: /index\.js$/,
        banner: fs.readFileSync(path.join(__dirname, './src/entry/eventPage_sdk_banner.js'), 'utf8')
      }),
      new plugins.provide({
        '$': 'jquery',
        'jQuery': 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
      }),
      new plugins.progressBar,
      new plugins.shell({
        onBuildExit: [
          `node ./scripts/build.js${env.development ? ` dev` : ``}`
        ]
      })
    ]
    .concat(env.sizeAnalyzer ? [
      new plugins.sizeAnalyzer
    ] : []),
    watch: env.development && env.withWatch,
    watchOptions: {
      ignored: /node_modules/,
      poll: 1000,
      aggregateTimeout: 1000
    }
  };

  return cfg;
};
