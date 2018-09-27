/** @var {Object} webpack.BannerPlugin */
/** @var {Object} webpack.ProvidePlugin */
/**
 * @typedef {Object} Environment
 * @property {boolean} development
 * @property {boolean} production
 * @property {boolean} withBabel
 */

const
  fs = require('fs'),
  path = require('path'),
  calfinated = require('calfinated')(),
  packageJson = require('./package.json'),
  webpack = require('webpack'),
  plugins = {
    clean: require('clean-webpack-plugin'),
    transfer: require('transfer-webpack-plugin'),
    sizeAnalyzer: require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    progressBar: require('progress-bar-webpack-plugin'),
    banner: webpack.BannerPlugin,
    provide: webpack.ProvidePlugin
  },
  BUILD_PATHS = {
    EXTENSION: 'Extension/esgst',
    EXTENSION_EVENT_PAGE: 'Extension/eventPage',
    MONKEY: 'ESGST.user'
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

module.exports = /** @param {Environment} env */ env => {
  if (env.production) {
    env.withBabel = true;
  }

  let cfg = {
    mode: env.production ? 'production' : (env.development ? 'development' : 'none'),
    context: path.join(__dirname, './src/entry/'),
    entry: {
      [BUILD_PATHS.EXTENSION]: ['./extension/index.js'],
      [BUILD_PATHS.EXTENSION_EVENT_PAGE]: ['./extension/eventPage_index.js'],
      [BUILD_PATHS.MONKEY]: ['./monkey/index.js']
    },
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
              presets: ['@babel/preset-env']
            }
          }
        }
      ]: [])
    },
    plugins: [
      new plugins.banner({
        raw: true,
        entryOnly: true,
        banner: context => {
          let bannerFile = path.join(cfg.context, path.dirname(context.chunk.name), 'banner.js');
          if (!fs.existsSync(bannerFile)) {
            return '';
          }

          return calfinated.process(fs.readFileSync(bannerFile, 'utf8'), {package: packageJson});
        }
      }),
      new plugins.provide({
        '$': 'jquery',
        'jQuery': 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
      }),
      new plugins.progressBar
    ].concat(env.sizeAnalyzer ? [
      new plugins.sizeAnalyzer
    ] : []),
      watch: env.development,
      watchOptions: {
      ignored: /node_modules/,
      poll: 1000,
      aggregateTimeout: 1000
    },
    devtool: env.development ? 'source-map' : null
  };

  return cfg;
};
