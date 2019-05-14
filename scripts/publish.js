const GitHub = require(`@gsrafael01/github-api`);
const chromePublisher = require(`@bext/chrome-publisher`);
const firefoxPublisher = require(`@bext/firefox-publisher`);
const JSZip = require(`jszip`);
const dateFns_format = require(`date-fns/format`);
const fs = require(`fs`);
const git = require(`simple-git`)();
const jpm = require(`jpm/lib/xpi`);
const path = require(`path`);

const ROOT_PATH = path.join(__dirname, `..`);
const BUILD_PATH = `${ROOT_PATH}/build`;
const CONFIG_PATH = `${ROOT_PATH}/bext.json`;

const bextJson = require(`${ROOT_PATH}/bext.json`);
const packageJson = require(`${ROOT_PATH}/package.json`);
const packageJsonBkp = JSON.stringify(packageJson, null, 2);

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
        packageWebExtension(`chrome`),
        packageWebExtension(`firefox`),
        packageLegacyExtension(`palemoon`)
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

function packageWebExtension(browserName) {
  return new Promise((resolve, reject) => {
    const extensionPath = `${BUILD_PATH}/${browserName}`;
    const libPath = `${extensionPath}/lib`;

    let manifest = JSON.parse(fs.readFileSync(`${extensionPath}/manifest.json`));
    manifest.version = packageJson.version;
    if (args.dev) {
      manifest.version_name = packageJson.devVersion;
    }
    manifest = JSON.stringify(manifest, null, 2);
    fs.writeFileSync(`${extensionPath}/manifest.json`, manifest);

    const zip = new JSZip();
    zip.file(`manifest.json`, manifest);
    zip.folder(`lib`)
    .file(`browser-polyfill.js`, fs.readFileSync(`${libPath}/browser-polyfill.js`));
    zip.file(`eventPage.js`, fs.readFileSync(`${extensionPath}/eventPage.js`));
    zip.file(`esgst.js`, fs.readFileSync(`${extensionPath}/esgst.js`));
    zip.file(`esgst_sgtools.js`, fs.readFileSync(`${extensionPath}/esgst_sgtools.js`));
    zip.file(`icon.png`, fs.readFileSync(`${extensionPath}/icon.png`));
    zip.file(`permissions.html`, fs.readFileSync(`${extensionPath}/permissions.html`));
    zip.file(`permissions.js`, fs.readFileSync(`${extensionPath}/permissions.js`));
    zip.generateNodeStream({
      compression: `DEFLATE`,
      compressionOptions: {
        level: 9
      },
      streamFiles: true,
      type: `nodebuffer`
    })
    .pipe(fs.createWriteStream(`${ROOT_PATH}/extension-${browserName}.zip`))
    .on(`finish`, () => resolve())
    .on(`error`, error => reject(error));
  });
}

function packageLegacyExtension(browserName) {
  return new Promise(async (resolve, reject) => {
    const extensionPath = `${BUILD_PATH}/${browserName}`;

    let manifest = JSON.parse(fs.readFileSync(`${extensionPath}/package.json`));
    manifest.version = packageJson.version;
    if (args.dev) {
      manifest.version_name = packageJson.devVersion;
    }
    fs.writeFileSync(`${extensionPath}/package.json`, JSON.stringify(manifest, null, 2));

    const options = {
      addonDir: extensionPath,
      xpiPath: ROOT_PATH
    };

    try {
      await jpm(manifest, options);
      resolve();
    } catch (error) {
      reject(error);
      return;
    }
  });
}

function publishDevVersion() {
  return new Promise(async (resolve, reject) => {
    updateDevVersion();

    await Promise.all([
      packageWebExtension(`chrome`),
      packageWebExtension(`firefox`),
      packageLegacyExtension(`palemoon`)
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

    fs.writeFileSync(`${ROOT_PATH}/package.json`, JSON.stringify(packageJson, null, 2));
    
    if (!args.doNotAdd) {
      git.add(`./*`);
    }
    git.commit(commitMessage)
    .push(async error => {
      if (error) {
        git.reset([`--soft`, `HEAD~1`]);

        fs.writeFileSync(`${ROOT_PATH}/package.json`, packageJsonBkp);

        reject(error);
      } else if (!args.doNotRelease) {
        try {
          await publishRelease();
          resolve();
        } catch (error) {
          reject(error);          
        }
      } else {
        resolve();
      }
    });
  });
}

function publishVersion() {
  return new Promise(async (resolve, reject) => {
    updateVersion();

    const milestone = await closeAndGetCurrentMilestone();
    const changelog = await getChangelog(milestone);

    await Promise.all([
      packageWebExtension(`chrome`),
      packageWebExtension(`firefox`),
      packageLegacyExtension(`palemoon`)
    ]);

    const commitMessage = `v${packageJson.version}`;

    fs.writeFileSync(`${ROOT_PATH}/package.json`, JSON.stringify(packageJson, null, 2));
    
    if (!args.doNotAdd) {
      git.add(`./*`);
    }
    git.commit(commitMessage);
    /*.push(async error => {
      if (error) {
        git.reset([`--soft`, `HEAD~1`]);

        fs.writeFileSync(`${ROOT_PATH}/package.json`, packageJsonBkp);

        reject(error);
      } else {*/
        try {
          await publishRelease(changelog);
          await chromePublisher.init(CONFIG_PATH);
          await chromePublisher.update(`${ROOT_PATH}/extension-chrome.zip`);
          await chromePublisher.publish();
          await firefoxPublisher.init(CONFIG_PATH);
          await firefoxPublisher.update(`${ROOT_PATH}/extension-firefox.zip`, {
            path: {
              version: packageJson.version
            }
          });
          resolve();
        } catch (error) {
          fs.writeFileSync(`${ROOT_PATH}/package.json`, packageJsonBkp);

          reject(error);          
        }
      /*}
    });*/
  });
}

function updateDevVersion() {
  const bumpedVersion = bumpVersion();
  const parts = packageJson.devVersion.split(`-`);
  if ((bumpedVersion !== packageJson.version && bumpedVersion !== parts[0]) || !parts[1]) {
    parts[0] = bumpedVersion;
    parts[1] = `dev.1`;
  } else {
    const subParts = parts[1].split(`.`);
    subParts[1] = parseInt(subParts[1]) + 1;
    parts[1] = subParts.join(`.`);
  }
  packageJson.devVersion = parts.join(`-`);
}

function updateVersion() {
  packageJson.version = args.bumpVersion ? bumpVersion() : packageJson.devVersion.split(`-`)[0];
  packageJson.devVersion = packageJson.version;
}

function bumpVersion() {
  let version = packageJson.version;

  if (args.bumpVersion) {
    const parts = packageJson.version.split(`.`);
    let i = parseInt(args.bumpVersion);
    parts[i] = parseInt(parts[i]) + 1;
    i += 1;
    while (i < 3) {
      parts[i] = 0;
      i += 1;
    }
    version = parts.join(`.`);
  }

  return version;
}

function closeAndGetCurrentMilestone() {
  return new Promise((resolve, reject) => {
    const github = new GitHub({
      token: bextJson.github.accessToken
    });
    const ghIssues = github.getIssues(packageJson.author, packageJson.name);
    ghIssues.listMilestones({ sort: `completeness`, direction: `desc` }, async (error, milestones) => {
      if (error) {
        reject(error);
        return;
      }

      const milestone = milestones[0].number;
      await ghIssues.editMilestone(milestone, { state: `closed` });
      resolve(milestone);
    });
  });
}

function getChangelog(milestone) {
  return new Promise((resolve, reject) => {
    const github = new GitHub();
    const ghIssues = github.getIssues(packageJson.author, packageJson.name);
    ghIssues.listIssues({ milestone, state: `closed` }, (error, issues) => {
      if (error) {
        reject(error);
        return;
      }

      let changelog = {
        date: dateFns_format(Date.now(), `MMMM d, yyyy`),
        version: packageJson.version,
        changelog: {}
      };
      let changelogMarkdown = [];
      for (const issue of issues) {
        changelog.changelog[issue.number] = issue.title;
        changelogMarkdown.push(`* #${issue.number} ${issue.title.replace(/&/g, `&amp;`).replace(/"/g, `&quot;`)}`);
      }
      const changelogJson = require(`${ROOT_PATH}/changelog.json`);
      changelogJson.unshift(changelog);
      fs.writeFileSync(`${ROOT_PATH}/changelog.json`, JSON.stringify(changelogJson, null, 2));
      resolve(changelogMarkdown.join(`\n`));
    });
  });
}

function publishRelease(body = ``) {
  return new Promise((resolve, reject) => {
    const github = new GitHub({
      token: bextJson.github.accessToken
    });
    const ghRepo = github.getRepo(packageJson.author, packageJson.name);
    ghRepo.listReleases(async (error, releases) => {
      if (error) {
        reject(error);
        return;
      }

      if (args.dev) {
        const preRelease = releases.filter(x => x.prerelease)[0];
        if (preRelease) {
          await ghRepo.deleteRelease(preRelease.id);
          await ghRepo.deleteRef(`tags/${preRelease.tag_name}`);
        }
      }

      const releaseDescription = {
        tag_name: packageJson.devVersion,
        name: packageJson.devVersion,
        body,
        prerelease: !!args.dev
      };
      ghRepo.createRelease(releaseDescription, async (error, release) => {
        if (error) {
          reject(error);
          return;
        }

        await Promise.all([
          ghRepo.uploadReleaseAsset(release.upload_url, fs.readFileSync(`${ROOT_PATH}/extension-chrome.zip`), { name: `extension-chrome.zip` }),
          ghRepo.uploadReleaseAsset(release.upload_url, fs.readFileSync(`${ROOT_PATH}/extension-firefox.zip`), { name: `extension-firefox.zip` }),
          ghRepo.uploadReleaseAsset(release.upload_url, fs.readFileSync(`${ROOT_PATH}/extension-palemoon.xpi`), { name: `extension-palemoon.xpi` })
        ]);

        resolve();
      });
    });
  });
}