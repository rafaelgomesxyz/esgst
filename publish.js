const CHROME_EXTENSION_ID = `ibedmjbicclcdfmghnkfldnplocgihna`;
const CHROME_EXTENSION_KEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAih1koCChvaohyeTSrBrUcANi8zBmZT+4JWjI92p4kEeaVvno8mdUnOLwA5nwZEYLfQ6CdCmStWLR3SUeoj/PhIHJkuBYYsyv2fcUh3kALAnqJMHJ61epNhrD93l2xf4BV9/2bKb3o3NTA/u9UosQqljhYkPwkIed+yzRMwYCoOn+vMpbOdaAwfycncG0/eXO5NIIqC+Ov8xR2vGX7rwXvnUIgG84TvZvOcCtmn6PsijDm6/xFgNwW0xvUhHIa50rTwMxedItEhxFslGlCGhYNG2HzvVJpcLEE9qq2OHL/3SyidU5xCyMW+BV8ieZ03EBwMYnhGxV68UKSa+tmJEoKQIDAQAB`;
const FIREFOX_EXTENSION_ID = `{71de700c-ca62-4e31-9de6-93e3c30633d6}`;

const AdmZip = require(`adm-zip`);
const GitHub = require(`github-api`);
const fs = require(`fs`);
const git = require(`simple-git`)();
const jpm = require(`jpm/lib/xpi`);
const os = require(`os`);
const path = require(`path`);

const packageJson = require(`./package.json`);

const args = getArguments();

publish();

function getArguments() {
  const _args = {};

  const argv = process.argv.slice(2);
  for (const arg of argv) {
    const parts = arg.split(/=/);
    const key = parts[0];
    const value = parts[1] || true;
    _args[key] = value;
  }

  validateArguments(_args);

  return _args;
}

function validateArguments(_args) {
  if (_args.issueNumber && _args.message) {
    throw `Conflict! Either pass the issue number or the message, but not both.`;
  }
}

async function publish() {
  try {
    if (args.dev) {
      await publishDevVersion();
    } else {
      await publishVersion();
    }
  } catch (error) {
    console.log(error);
  }
}

function publishDevVersion() {
  return new Promise(async (resolve, reject) => {
    updateDevVersion();

    await Promise.all([
      packExtensionChrome(),
      packExtensionFirefox(),
      packExtensionPaleMoon()
    ]);

    let message = ``;

    if (args.message) {
      message = args.message;
    } else if (args.issueNumber) {
      if (args.keepOpen) {
        message = `#${args.issueNumber}`;
      } else {
        const github = new GitHub();
        const response = await github.getIssues(packageJson.author, packageJson.name).getIssue(args.issueNumber);
        const issue = response.data;
        if (issue) {
          if (issue.state === `closed`) {
            message = `#${args.issueNumber}`;
          } else {
            message = `${issue.title} (close #${args.issueNumber})`;
          }
        } else {
          throw `Error! Issue not found.`;
        }
      }
    } else {
      throw `Error! Missing issue number / message.`;
    }

    const commitMessage = `v${packageJson.devVersion} ${message}`;
    
    git
      .add(`./*`)
      .commit(commitMessage)
      .push(error => {
        if (error) {
          reject(error);
        } else {
          fs.writeFileSync(`package.json`, JSON.stringify(packageJson, null, 2));

          resolve();
        }
      });
  });

  // TODO
  // delete previous pre-release + create new pre-release
}

function publishVersion() {
  // TODO
}

function updateDevVersion() {
  updateVersion();

  const parts = packageJson.devVersion.split(`-`);
  parts[0] = packageJson.version;
  if (!parts[1]) {
    parts[1] = `dev.1`;
  } else {
    const subParts = parts[1].split(`.`);
    subParts[1] = parseInt(subParts[1]) + 1;
    parts[1] = subParts.join(`.`);
  }
  packageJson.devVersion = parts.join(`-`);
}

function updateVersion() {
  if (!args.bumpVersion) {
    return;
  }

  const parts = packageJson.version.split(`.`);
  parts[args.bumpVersion] = parseInt(parts[args.bumpVersion]) + 1;  
  packageJson.version = parts.join(`.`);
}

async function packExtensionChrome() {
  const manifest = getManifestChrome();

  await packExtension(`chrome`, manifest);
}

async function packExtensionFirefox() {
  const manifest = getManifestFirefox();

  await packExtension(`firefox`, manifest);
}

async function packExtensionPaleMoon() {
  const manifest = getManifestPaleMoon();

  await packExtension(`palemoon`, manifest);
}

function getManifestChrome() {
  const manifest = getManifest();

  manifest.background.persistent = true;
  manifest.key = CHROME_EXTENSION_KEY;
  manifest.version_name = packageJson.devVersion;

  return manifest;
}

function getManifestFirefox() {
  const manifest = getManifest();

  manifest.browser_specific_settings = {
    gecko: {
      id: FIREFOX_EXTENSION_ID
    }
  };

  return manifest;
}

function getManifestPaleMoon() {
  const manifest = {
    name: `extension-palemoon`,
    version: packageJson.version,

    description: packageJson.description,

    author: packageJson.author,
    engines: {
      firefox: `>=52.0 <=52.*`,
      '{8de7fcbb-c55c-4fbe-bfc5-fc555c87dbc4}': `>=27.1.0b1 <=28.*`
    },
    id: `addon@esgst`,
    keywords: [
      `jetpack`
    ],
    license: `MIT`,
    main: `index.js`,
    title: packageJson.title,
    version_name: packageJson.devVersion
  };

  return manifest;
}

function getManifest() {
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
    web_accessible_resources: `icon.png`
  };

  return manifest;
}

function packExtension(browser, manifest) {
  return new Promise(async resolve => {
    const tmpDir = os.tmpdir();
    const tmpPath = fs.mkdtempSync(path.join(tmpDir, `esgst-`));

    if (browser === `palemoon`) {
      fs.mkdirSync(path.join(tmpPath, `data`));
      fs.copyFileSync(`build/esgst.js`, path.join(tmpPath, `data/esgst.js`));
      fs.copyFileSync(`build/esgst_sgtools.js`, path.join(tmpPath, `data/esgst_sgtools.js`));
      fs.copyFileSync(`src/assets/icons/icon-16.png`, path.join(tmpPath, `data/icon-16.png`));
      fs.copyFileSync(`src/assets/icons/icon-32.png`, path.join(tmpPath, `data/icon-32.png`));
      fs.copyFileSync(`src/assets/icons/icon-64.png`, path.join(tmpPath, `data/icon-64.png`));
      fs.writeFileSync(path.join(tmpPath, `package.json`), JSON.stringify(manifest, null, 2));
      fs.copyFileSync(`build/index.js`, path.join(tmpPath, `index.js`));
      fs.copyFileSync(`src/assets/icons/icon.png`, path.join(tmpPath, `icon.png`));

      const options = {
        addonDir: tmpPath,
        xpiPath: `./`
      };

      try {
        await jpm(manifest, options);
      } catch (error) {
        console.log(`Error while packing extension for ${browser}: ${error}`);
      }

      fs.unlinkSync(path.join(tmpPath, `data/esgst.js`));
      fs.unlinkSync(path.join(tmpPath, `data/esgst_sgtools.js`));
      fs.unlinkSync(path.join(tmpPath, `data/icon-16.png`));
      fs.unlinkSync(path.join(tmpPath, `data/icon-32.png`));
      fs.unlinkSync(path.join(tmpPath, `data/icon-64.png`));
      fs.unlinkSync(path.join(tmpPath, `package.json`));
      fs.unlinkSync(path.join(tmpPath, `index.js`));
      fs.unlinkSync(path.join(tmpPath, `icon.png`));
      fs.rmdirSync(path.join(tmpPath, `data`));
      fs.rmdirSync(tmpPath);

      resolve();
    } else {
      fs.mkdirSync(path.join(tmpPath, `lib`));
      fs.copyFileSync(`node_modules/webextension-polyfill/dist/browser-polyfill.min.js`, path.join(tmpPath, `lib/browser-polyfill.js`));
      fs.copyFileSync(`build/eventPage.js`, path.join(tmpPath, `eventPage.js`));
      fs.copyFileSync(`build/esgst.js`, path.join(tmpPath, `esgst.js`));
      fs.copyFileSync(`build/esgst_sgtools.js`, path.join(tmpPath, `esgst_sgtools.js`));
      fs.copyFileSync(`src/assets/icons/icon.png`, path.join(tmpPath, `icon.png`));

      const zip = new AdmZip();
      zip.addLocalFolder(tmpPath);
      zip.addFile(`manifest.json`, JSON.stringify(manifest, null, 2));
      zip.writeZip(`extension-${browser}.zip`, error => {
        if (error) {
          console.log(`Error while packing extension for ${browser}: ${error}`);
        }

        fs.unlinkSync(path.join(tmpPath, `lib/browser-polyfill.js`));
        fs.unlinkSync(path.join(tmpPath, `eventPage.js`));
        fs.unlinkSync(path.join(tmpPath, `esgst.js`));
        fs.unlinkSync(path.join(tmpPath, `esgst_sgtools.js`));
        fs.unlinkSync(path.join(tmpPath, `icon.png`));
        fs.rmdirSync(path.join(tmpPath, `lib`));
        fs.rmdirSync(tmpPath);

        resolve();
      });
    }
  });
}