const
  fs = require('fs'),
  path = require('path'),
  calfinated = require('calfinated')(),
  packageJson = require('./package.json'),
  webpack = require('webpack'),
  plugins = {
    clean: require('clean-webpack-plugin'),
    transfer: require('transfer-webpack-plugin')
  },
  BUILD_PATHS = {
    EXTENSION: 'Extension/esgst',
    MONKEY: 'ESGST.user'
  },
  styleLoader = {
    loader: 'style-loader',
    options: {
      singleton: true,
      insertInto: 'html'
    }
  }
;

// noinspection JSUnresolvedVariable -- don't know why
plugins.banner = webpack.BannerPlugin;
// noinspection JSUnresolvedVariable
plugins.provide = webpack.ProvidePlugin;

let cfg = {
  mode: 'none',
  context: path.join(__dirname, './src/entry/'),
  entry: {
    [BUILD_PATHS.EXTENSION]: ['./extension/index.js'],
    [BUILD_PATHS.MONKEY]: ['./monkey/index.js']
  },
  output: {
    path: __dirname,
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        loaders: [
          styleLoader,
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        loaders: [
          styleLoader,
          'css-loader',
          'lesbooasdadsdfsdfsdfdsfds-loader'
        ]
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=Extension/images/[name].[ext]',
          'image-webpack-loader?bypassOnDebug'
        ]
      }
    ]
  },
  plugins: [
    new plugins.clean(['build'], {exclude: '.gitignore'}),
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
  ]
};

module.exports = cfg;
