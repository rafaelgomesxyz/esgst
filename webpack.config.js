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
  fetch = require('node-fetch'),
  jsdom = require('jsdom'),
  { JSDOM } = jsdom,
  fs = require('fs'),
  path = require('path'),
  calfinated = require('calfinated')(),
  packageJson = require('./package.json'),
  webpack = require('webpack'),
  plugins = {
    sizeAnalyzer: require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    progressBar: require('progress-bar-webpack-plugin'),
    banner: webpack.BannerPlugin,
    provide: webpack.ProvidePlugin
  },
  BUILD_PATHS = {
    EXTENSION: 'Extension/esgst',
    EXTENSION_SGTOOLS: 'Extension/esgst_sgtools',
    EXTENSION_EVENT_PAGE: 'Extension/eventPage',
    EXTENSION_EVENT_PAGE_SDK: 'Extension/index',
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

module.exports = /** @param {Environment} env */ async env => {
  if (env.production) {
    // Get version issues.
    const response = await fetch(`https://github.com/gsrafael01/ESGST/issues?q=is%3Aclosed+milestone%3A${packageJson.version}`);
    const responseText = await response.text();
    const dom = new JSDOM(responseText);
    const issues = dom.window.document.getElementsByClassName(`link-gray-dark v-align-middle no-underline h4 js-navigation-open`);
    let changeLog = ``;
    let markdown = ``;
    let steamLog = `[list]\n`;
    for (const issue of issues) {
      const match = issue.getAttribute(`href`).match(/\/(issues|pull)\/(\d+)/);
      const type = match[1];
      const number = match[2];
      const url = `https://github.com/gsrafael01/ESGST/${type}/${number}`;
      const title = issue.textContent.trim();
      changeLog += `          ${number}: \`${title}\`,\n`;
      markdown += `* [#${number}](${url}) ${title}\n`;
      steamLog += `  [*] [url=${url}]#${number}[/url] ${title}\n`;
    }
    changeLog = changeLog.slice(0, -2);
    markdown = markdown.slice(0, -1);
    steamLog += `[/list]`;

    fs.writeFileSync(path.join(__dirname, './changelog.txt'), changeLog);
    fs.writeFileSync(path.join(__dirname, './changelog_markdown.txt'), markdown);
    fs.writeFileSync(path.join(__dirname, './changelog_steam.txt'), steamLog);

    let file;

    // Update Esgst.js
    file = fs.readFileSync(path.join(__dirname, './src/class/Esgst.js'), 'utf8');
    file = file
      .replace(/currentVersion\s=\s`(.+?)`;/, `currentVersion = \`${packageJson.version}\`;`)
      .replace(/devVersion\s=\s`(.+?)`;/, `devVersion = \`${packageJson.version}\`;`);
    fs.writeFileSync(path.join(__dirname, './src/class/Esgst.js'), file);

    // Get date.
    let currentDate = new Date();
    const months = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
    currentDate = `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

    // Update Changelog.js
    file = fs.readFileSync(path.join(__dirname, './src/modules/Changelog.js'), 'utf8');
    file = file
      .replace(/changelog\s=\s\[/, `changelog = [\n      {\n        date: \`${currentDate}\`,\n        version: \`${packageJson.version}\`,\n        changelog: {\n${changeLog}\n        }\n      },\n`);
    fs.writeFileSync(path.join(__dirname, './src/modules/Changelog.js'), file);

    // Update manifest.json
    file = fs.readFileSync(path.join(__dirname, './Extension/manifest.json'), 'utf8');
    file = file
      .replace(/"version":\s".+?"/, `"version": "${packageJson.version}"`);
    fs.writeFileSync(path.join(__dirname, './Extension/manifest.json'), file);

    // Update ESGST.meta.js
    file = fs.readFileSync(path.join(__dirname, './ESGST.meta.js'), 'utf8');
    file = file
      .replace(/@version.+/, `@version ${packageJson.version}`);
    fs.writeFileSync(path.join(__dirname, './ESGST.meta.js'), file);

    // Update README.md
    file = fs.readFileSync(path.join(__dirname, './README.md'), 'utf8');
    file = file
      .replace(/##\sChangelog/, `## Changelog\n\n**${packageJson.version} (${currentDate})**\n\n${markdown}`);
    fs.writeFileSync(path.join(__dirname, './README.md'), file);

    env.withBabel = true;
  }

  const entry = {
    [BUILD_PATHS.EXTENSION]: ['./extension/index.js'],
    [BUILD_PATHS.EXTENSION_SGTOOLS]: ['./extension/index_sgtools.js'],
    [BUILD_PATHS.EXTENSION_EVENT_PAGE]: ['./extension/eventPage_index.js'],
    [BUILD_PATHS.EXTENSION_EVENT_PAGE_SDK]: ['./extension/eventPage_sdk_index.js']
  };
  if (env.production) {
    entry[BUILD_PATHS.MONKEY] = ['./monkey/index.js'];
  }

  let cfg = {
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
      new plugins.banner({
        raw: true,
        entryOnly: true,
        test: /user\.js$/,
        banner: () => {
          let bannerFile = path.join(__dirname, './src/entry/monkey/banner.js');
          if (!fs.existsSync(bannerFile)) {
            return '';
          }

          return calfinated.process(fs.readFileSync(bannerFile, 'utf8'), {package: packageJson});
        }
      }),
      new plugins.banner({
        raw: true,
        entryOnly: true,
        test: /index\.js$/,
        banner: fs.readFileSync(path.join(__dirname, './src/entry/extension/eventPage_sdk_banner.js'), 'utf8')
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
      watch: env.development && env.withWatch,
      watchOptions: {
      ignored: /node_modules/,
      poll: 1000,
      aggregateTimeout: 1000
    }
  };

  return cfg;
};
