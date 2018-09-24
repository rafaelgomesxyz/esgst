const
  fs = require('fs'),
  path = require('path'),
  calfinated = require('calfinated')(),
  packageJson = require('./package.json'),
  webpack = require('webpack'),
  plugins = {
    clean: require('clean-webpack-plugin')
  },
  BUILD_PATHS = {
    EXTENSION: 'Extension/esgst',
    MONKEY: 'ESGST.user'
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
          {
            loader: 'style-loader',
            options: { singleton: true }
          },
          'css-loader'
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
