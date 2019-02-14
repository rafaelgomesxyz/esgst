const configJson = require(`./publish.config.json`)
const packageJson = require(`./package.json`);
const packageJsonBkp = JSON.stringify(packageJson, null, 2);

const CHROME_EXTENSION_ID = `ibedmjbicclcdfmghnkfldnplocgihna`;
const CHROME_EXTENSION_KEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAih1koCChvaohyeTSrBrUcANi8zBmZT+4JWjI92p4kEeaVvno8mdUnOLwA5nwZEYLfQ6CdCmStWLR3SUeoj/PhIHJkuBYYsyv2fcUh3kALAnqJMHJ61epNhrD93l2xf4BV9/2bKb3o3NTA/u9UosQqljhYkPwkIed+yzRMwYCoOn+vMpbOdaAwfycncG0/eXO5NIIqC+Ov8xR2vGX7rwXvnUIgG84TvZvOcCtmn6PsijDm6/xFgNwW0xvUhHIa50rTwMxedItEhxFslGlCGhYNG2HzvVJpcLEE9qq2OHL/3SyidU5xCyMW+BV8ieZ03EBwMYnhGxV68UKSa+tmJEoKQIDAQAB`;
const FIREFOX_EXTENSION_ID = `{71de700c-ca62-4e31-9de6-93e3c30633d6}`;
const GITHUB_TOKEN = configJson.githubToken;

const GitHub = require(`@gsrafael01/github-api`);
const JSZip = require(`jszip`);
const fs = require(`fs`);
const git = require(`simple-git`)();
const jpm = require(`jpm/lib/xpi`);
const os = require(`os`);
const path = require(`path`);

const args = getArguments();

if (args.help) {
  printHelp();
} else {
  publish();
}

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

function printHelp() {
  console.log(`
    Arguments:
      bumpVersion - Bumps the version at the specified position. Example usage: npm run publish bumpVersion=1 (will bump 8.1.5 to 8.2.0)
      dev - If present, runs in development environment. If omitted, runs in production environment. Example usage: npm run publish dev
      issueNumber - If present, the commit message is the title of the issue and the issue is closed. Must be used with 'dev'. Example usage: npm run publish dev issueNumber=1000
      keepOpen - If present, the issue is not closed when used with 'issueNumber'. Example usage: npm run publish dev issueNumber=1000 keepOpen
      message - A custom commit message. Must be used with 'dev'. Must not be used with 'issueNumber'. Example usage: npm run publish dev message="This is a commit"
      package - Only packages the extension. Example usage: npm run publish package
  `);
}

async function publish() {
  try {
    if (args.package) {
      await Promise.all([
        packExtensionChrome(),
        packExtensionFirefox(),
        packExtensionPaleMoon()
      ]);
    } else if (args.dev) {
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
          reject(`Error! Issue not found.`);
          return;
        }
      }
    } else {
      reject(`Error! Missing issue number / message.`);
      return;
    }

    const commitMessage = `v${packageJson.devVersion} ${message}`;

    fs.writeFileSync(`./package.json`, JSON.stringify(packageJson, null, 2));
    
    git.add(`./*`)
    .commit(commitMessage)
    .push(async error => {
      if (error) {
        git.reset([`--soft`, `HEAD~1`]);

        fs.writeFileSync(`./package.json`, packageJsonBkp);

        reject(error);
      } else {
        try {
          await publishRelease();
          resolve();
        } catch (error) {
          reject(error);          
        }
      }
    });
  });
}

function publishVersion() {
  // TODO
}

function updateDevVersion() {
  const parts = packageJson.devVersion.split(`-`);
  if (parts[1]) {
    const subParts = parts[1].split(`.`);
    subParts[1] = parseInt(subParts[1]) + 1;
    parts[1] = subParts.join(`.`);
  } else {
    parts[0] = bumpVersion();
    parts[1] = `dev.1`;
  }
  packageJson.devVersion = parts.join(`-`);
}

function updateVersion() {
  // TO DO
}

function bumpVersion() {
  let version = packageJson.version;

  if (args.bumpVersion) {
    const parts = packageJson.version.split(`.`);
    parts[args.bumpVersion] = parseInt(parts[args.bumpVersion]) + 1;
    version = parts.join(`.`);
  }

  return version;
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
    title: packageJson.title
  };

  if (args.dev) {
    manifest.version_name = packageJson.devVersion;
  }

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
    web_accessible_resources: [
      `icon.png`
    ]
  };

  if (args.dev) {
    manifest.content_security_policy = `script-src 'self' 'unsafe-eval'; object-src 'self';`;
    manifest.version_name = packageJson.devVersion;
  }

  return manifest;
}

function packExtension(browser, manifest) {
  return new Promise(async (resolve, reject) => {
    if (browser === `palemoon`) {
      const tmpDir = os.tmpdir();
      const tmpPath = fs.mkdtempSync(path.join(tmpDir, `esgst-`));

      fs.mkdirSync(path.join(tmpPath, `data`));
      fs.copyFileSync(`./build/esgst.js`, path.join(tmpPath, `data/esgst.js`));
      fs.copyFileSync(`./build/esgst_sgtools.js`, path.join(tmpPath, `data/esgst_sgtools.js`));
      fs.copyFileSync(`./src/assets/icons/icon-16.png`, path.join(tmpPath, `data/icon-16.png`));
      fs.copyFileSync(`./src/assets/icons/icon-32.png`, path.join(tmpPath, `data/icon-32.png`));
      fs.copyFileSync(`./src/assets/icons/icon-64.png`, path.join(tmpPath, `data/icon-64.png`));
      fs.writeFileSync(path.join(tmpPath, `package.json`), JSON.stringify(manifest, null, 2));
      fs.copyFileSync(`./build/index.js`, path.join(tmpPath, `index.js`));
      fs.copyFileSync(`./src/assets/icons/icon.png`, path.join(tmpPath, `icon.png`));

      const options = {
        addonDir: tmpPath,
        xpiPath: `./`
      };

      try {
        await jpm(manifest, options);
      } catch (error) {
        reject(error);
        return;
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
      const zip = new JSZip();
      zip.folder(`lib`)
      .file(`browser-polyfill.js`, fs.readFileSync(`./node_modules/webextension-polyfill/dist/browser-polyfill.min.js`));
      zip.file(`manifest.json`, JSON.stringify(manifest, null, 2));
      zip.file(`eventPage.js`, fs.readFileSync(`./build/eventPage.js`));
      zip.file(`esgst.js`, fs.readFileSync(`./build/esgst.js`));
      zip.file(`esgst_sgtools.js`, fs.readFileSync(`./build/esgst_sgtools.js`));
      zip.file(`icon.png`, fs.readFileSync(`./src/assets/icons/icon.png`));
      zip.generateNodeStream({
        compression: `DEFLATE`,
        compressionOptions: {
          level: 9
        },
        streamFiles: true,
        type: `nodebuffer`
      })
      .pipe(fs.createWriteStream(`extension-${browser}.zip`))
      .on(`finish`, () => resolve())
      .on(`error`, error => reject(error));
    }
  });
}

function publishRelease() {
  return new Promise((resolve, reject) => {
    const github = new GitHub({
      token: GITHUB_TOKEN
    });
    const repo = github.getRepo(packageJson.author, packageJson.name);
    repo.listReleases(async (error, releases) => {
      if (error) {
        reject(error);
        return;
      }

      if (args.dev) {
        const preRelease = releases.filter(x => x.prerelease)[0];
        if (preRelease) {
          await repo.deleteRelease(preRelease.id);
        }
      }

      const releaseDescription = {
        tag_name: packageJson.devVersion,
        name: packageJson.devVersion,
        prerelease: !!args.dev
      };
      repo.createRelease(releaseDescription, async (error, release) => {
        if (error) {
          reject(error);
          return;
        }

        await Promise.all([
          repo.uploadReleaseAsset(release.upload_url, fs.readFileSync(`./extension-chrome.zip`), { name: `extension-chrome.zip` }),
          repo.uploadReleaseAsset(release.upload_url, fs.readFileSync(`./extension-firefox.zip`), { name: `extension-firefox.zip` }),
          repo.uploadReleaseAsset(release.upload_url, fs.readFileSync(`./extension-palemoon.xpi`), { name: `extension-palemoon.xpi` })
        ]);

        resolve();
      });
    });
  });
}