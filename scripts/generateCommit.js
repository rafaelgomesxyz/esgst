const { Octokit } = require('@octokit/rest');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const { getArguments } = require(path.resolve(__dirname, './common'));
const args = getArguments(process);

const packageJson = require(path.resolve(__dirname, '../package.json'));

const octokit = new Octokit({
	auth: args.token,
	userAgent: 'ESGST',
});

const defaultParams = {
	owner: packageJson.author,
	repo: packageJson.name,
};

function bumpVersion(args) {
	let version;
	if (args.stable) {
		const versionParts = packageJson.version.split('.').map((part) => parseInt(part));
		if (args.major) {
			versionParts[0] += 1;
			versionParts[1] = 0;
			versionParts[2] = 0;
		} else if (args.minor) {
			versionParts[1] += 1;
			versionParts[2] = 0;
		} else {
			versionParts[2] += 1;
		}
		version = versionParts.map((part) => part.toString()).join('.');
	} else {
		const versionParts = packageJson.betaVersion.split('-');
		if (versionParts.length > 1) {
			const betaVersionParts = versionParts[1].split('.');
			betaVersionParts[1] = (parseInt(betaVersionParts[1]) + 1).toString();
			versionParts[1] = betaVersionParts.join('.');
			version = versionParts.join('-');
		} else {
			const nextVersion = args.nextVersion || bumpVersion({ stable: true });
			version = `${nextVersion}-beta.1`;
		}
	}
	return version;
}

async function generateCommit() {
	const version = bumpVersion(args);
	if (args.stable) {
		packageJson.version = version;
	}
	packageJson.betaVersion = version;
	fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(packageJson));

	let commitMessage = '';
	if (args.stable) {
		commitMessage = `Bump version to ${version}`;
	} else if (args.issue) {
		const issue = await octokit.issues.get({
			...defaultParams,
			issue_number: args.issue,
		});
		commitMessage = args.keepOpen
			? `#${args.issue} ${issue.data.title} (WIP)`
			: `${issue.data.title} (close #${args.issue}`;
	} else {
		commitMessage = args.msg;
	}

	exec(`npx prettier --write ${path.join(__dirname, '../package.json')}`, (err) => {
		if (err) {
			console.log(err);
		} else {
			exec(`git add ${path.join(__dirname, '../package.json')}`, (err) => {
				if (err) {
					console.log(err);
				} else {
					exec(`git commit -m "${commitMessage}"`, (err) => console.log(err));
				}
			});
		}
	});
}

generateCommit();
