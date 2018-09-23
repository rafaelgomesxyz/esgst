// noinspection ES6ConvertRequireIntoImport
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
    MONKEY: 'monkey/ESGST.user'
  }
;

// noinspection JSUnresolvedVariable -- don't know why
plugins.banner = webpack.BannerPlugin;

let cfg = {
  mode: 'none',
  context: path.join(__dirname, './src/entry/'),
  entry: {
    [BUILD_PATHS.MONKEY]: ['./monkey/index.js']
  },
  output: {
    path: path.join(__dirname, 'build'),
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
    })
  ]
};

// noinspection ES6ConvertModuleExportToExport
module.exports = cfg;
