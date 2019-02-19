const fs = require(`fs`);
const path = require(`path`);

const ROOT_PATH = path.join(__dirname, `..`);
const BUILD_PATH = `${ROOT_PATH}/build`;
const SRC_PATH = `${ROOT_PATH}/src`;
const NODE_MODULES_PATH = `${ROOT_PATH}/node_modules`;

const bextJson = require(`${ROOT_PATH}/bext.json`);
const packageJson = require(`${ROOT_PATH}/package.json`);

const args = getArguments();

build();

function getArguments() {
  const _args = {};

  const argv = process.argv.slice(2);
  for (const arg of argv) {
    const parts = arg.split(/=/);
    const key = parts[0];
    const value = parts[1] || true;
    _args[key] = value;
  }

  return _args;
}

function build() {
  try {
    buildWebExtension(`chrome`);
    buildWebExtension(`firefox`);
    buildLegacyExtension(`palemoon`);
  } catch (error) {
    console.log(error);
  }
}

function buildWebExtension(browserName) {
  const extensionPath = `${BUILD_PATH}/${browserName}`;
  const libPath = `${extensionPath}/lib`;
  if (!fs.existsSync(extensionPath)) {
    fs.mkdirSync(extensionPath);
  }
  if (!fs.existsSync(libPath)) {
    fs.mkdirSync(libPath);
  }
  fs.writeFileSync(`${extensionPath}/manifest.json`, JSON.stringify(getWebExtensionManifest(browserName), null, 2));
  fs.copyFileSync(`${NODE_MODULES_PATH}/webextension-polyfill/dist/browser-polyfill.min.js`, `${libPath}/browser-polyfill.js`);
  fs.copyFileSync(`${BUILD_PATH}/eventPage.js`, `${extensionPath}/eventPage.js`);
  fs.copyFileSync(`${BUILD_PATH}/esgst.js`, `${extensionPath}/esgst.js`);
  fs.copyFileSync(`${BUILD_PATH}/esgst_sgtools.js`, `${extensionPath}/esgst_sgtools.js`);
  fs.copyFileSync(`${SRC_PATH}/assets/images/icon.png`, `${extensionPath}/icon.png`);
}

function buildLegacyExtension(browserName) {
  const extensionPath = `${BUILD_PATH}/${browserName}`;
  const dataPath = `${extensionPath}/data`;
  if (!fs.existsSync(extensionPath)) {
    fs.mkdirSync(extensionPath);
  }
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
  }
  fs.writeFileSync(`${extensionPath}/package.json`, JSON.stringify(getLegacyExtensionManifest(browserName), null, 2));
  fs.copyFileSync(`${BUILD_PATH}/esgst.js`, `${dataPath}/esgst.js`);
  fs.copyFileSync(`${BUILD_PATH}/esgst_sgtools.js`, `${dataPath}/esgst_sgtools.js`);
  fs.copyFileSync(`${SRC_PATH}/assets/images/icon-16.png`, `${dataPath}/icon-16.png`);
  fs.copyFileSync(`${SRC_PATH}/assets/images/icon-32.png`, `${dataPath}/icon-32.png`);
  fs.copyFileSync(`${SRC_PATH}/assets/images/icon-64.png`, `${dataPath}/icon-64.png`);
  fs.copyFileSync(`${BUILD_PATH}/index.js`, `${extensionPath}/index.js`);
  fs.copyFileSync(`${SRC_PATH}/assets/images/icon.png`, `${extensionPath}/icon.png`);
}

function getWebExtensionManifest(browserName) {
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
    permissions: [
      `cookies`,
      `storage`,
      `tabs`,
      `unlimitedStorage`,
      `*://*.gsrafael01.me/*`,
      `*://*.api.steampowered.com/*`,
      `*://*.store.steampowered.com/*`,
      `*://*.script.google.com/*`,
      `*://*.script.googleusercontent.com/*`,
      `*://*.sgtools.info/*`,
      `*://*.steamcommunity.com/*`,
      `*://*.steamgifts.com/*`,
      `*://*.steamtrades.com/*`,
      `*://*.isthereanydeal.com/*`,
      `*://*.api.dropboxapi.com/*`,
      `*://*.content.dropboxapi.com/*`,
      `*://*.api.imgur.com/*`,
      `*://*.googleapis.com/*`,
      `*://*.graph.microsoft.com/*`,
      `*://*.userstyles.org/*`,
      `*://*.royalgamer06.ga/*`,
      `*://*.steam-tracker.com/*`
    ],
    short_name: `ESGST`,
    web_accessible_resources: [
      `icon.png`
    ]
  };

  switch (browserName) {
    case `chrome`:
      manifest.background.persistent = true;
      manifest.key = bextJson.chrome.extensionKey;
      break;
    case `firefox`:
      manifest.browser_specific_settings = {
        gecko: {
          id: bextJson.firefox.extensionId
        }
      };
      break;
    default:
      break;
  }

  if (args.dev) {
    manifest.content_security_policy = `script-src 'self' 'unsafe-eval'; object-src 'self';`;
    manifest.version_name = packageJson.devVersion;
  }

  return manifest;
}

function getLegacyExtensionManifest(browserName) {
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

  if (args.dev) {
    manifest.version_name = packageJson.devVersion;
  }

  return manifest;
}