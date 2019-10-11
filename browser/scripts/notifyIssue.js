const fs = require('fs');
const Octokit = require('@octokit/rest');
const path = require('path');

const { getArguments } = require(path.resolve(__dirname, './common'));

const args = getArguments(process);

// @ts-ignore
const packageJson = require(path.resolve(__dirname, '../package.json'));
const payloadJson = require(args.payloadPath);

const octokit = new Octokit({
  auth: args.token,
  userAgent: 'ESGST'
});

const defaultParams = {
  owner: packageJson.author,
  repo: packageJson.name
};

async function notifyIssue() {
  console.log(payloadJson);
}

notifyIssue();