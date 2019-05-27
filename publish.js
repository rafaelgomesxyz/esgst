const GitHub = require(`../ESGST/node_modules/@gsrafael01/github-api`);
const path = require(`path`);

const ROOT_PATH = path.join(__dirname, `../ESGST`);

const bextJson = require(`${ROOT_PATH}/bext.json`);

const args = getArguments();

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

const list = {
'v8.3.10': '03e7b4f407ebad1075eae2a72796372ff8e79562',
'v8.3.11': '6e9fc03115a97cbb69f8017a69f213a3b78e7c8f',
'v8.3.12': 'ae70927ffc73508625bf96349eb166f750bae3e5',/*
'v8.3.13': '869b3a4ce01e9e6368da58b7c3acd5e3fc0f6c3e',*/
};


pr();

async function pr() {
for (const key in list) {
console.log('***********************************************************');
console.log(await     publishRelease(key, list[key]));
}
}


function publishRelease(v, h) {
  return new Promise((resolve, reject) => {
    const github = new GitHub({
      token: bextJson.github.accessToken
    });
    const ghRepo = github.getRepo('gsrafael01', 'ESGST');
      const releaseDescription = {
        tag_name: v,
        target_commitish: h,
        name: v,
        body: ''
      };
      ghRepo.createRelease(releaseDescription).then(resolve);
  });
}
