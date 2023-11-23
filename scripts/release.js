/**
 * How to do a release:
 *
 * 1. checkout to master branch, and make sure there is no uncommitted code on the branch.
 * 2. Run `yarn release`, follow prompts
 *   - If you want to release directly instead of following prompts, you can just command --major/minor/patch to release.
 *   - e.g.: `yarn release --minor`
 * 3. Wait for the CI to run (about 30 seconds) and the Pull Request will be created automatically.
 * 4. Merge the pull request, and the release branch will be deleted automatically.
 */

const chalk = require('chalk');
const execa = require('execa');
const fs = require('fs');
const inquirer = require('inquirer');
const minimist = require('minimist');
const path = require('path');
const semver = require('semver');

const cliOptions = minimist(process.argv);

const TARGET_BRANCH = 'master';

const acquireInputBump = () => {
  let result = false;
  const options = { ...cliOptions };
  delete options._;
  Object.keys(options).some((option) => {
    if (option === 'major' || option === 'minor' || option === 'patch') {
      result = option;
      return true;
    }
  });
  return result;
};

const release = async () => {
  const curBranch = execa.commandSync('git rev-parse --abbrev-ref HEAD').stdout;
  if (curBranch !== TARGET_BRANCH) {
    console.log(
      chalk.red(
        `[Error - Release failed] Please check if the current branch is ${TARGET_BRANCH}`,
      ),
    );
    return;
  }

  try {
    // make sure no diff
    const diff = await execa('git', ['diff']);
    if (diff.stdout) {
      console.log(
        chalk.red(
          '[Error - Release failed] Please check if the current branch has uncommitted code, keep the branch clean and try again.',
        ),
      );
      return;
    }
    await execa('git', ['pull', 'origin', TARGET_BRANCH]);
  } catch (e) {
    console.log(e);
    return;
  }

  const curVersion = require('../package.json').version;

  console.log(`Current version: ${curVersion}`);

  const bumps = ['major', 'minor', 'patch'];
  const versions = {};
  bumps.forEach((b) => {
    versions[b] = semver.inc(curVersion, b);
  });
  const bumpChoices = bumps.map((b) => ({
    name: `${b} (${versions[b]})`,
    value: b,
  }));

  const inputBump = acquireInputBump();
  const { bump, customVersion } = inputBump
    ? { bump: inputBump }
    : await inquirer.prompt([
        {
          name: 'bump',
          message: 'Select release type:',
          type: 'list',
          choices: [...bumpChoices, { name: 'custom', value: 'custom' }],
        },
        {
          name: 'customVersion',
          message: 'Input version:',
          type: 'input',
          when: (answers) => answers.bump === 'custom',
        },
      ]);

  const version = customVersion || versions[bump];

  const { yes } = inputBump
    ? { yes: true }
    : await inquirer.prompt([
        {
          name: 'yes',
          message: `Confirm releasing ${version}?`,
          type: 'confirm',
        },
      ]);

  if (yes) {
    const releaseBranch = `v/${version}`;
    try {
      await execa('git', ['branch', '-D', releaseBranch]);
      await execa('git', ['checkout', '-b', releaseBranch]);
    } catch (e) {
      await execa('git', ['checkout', '-b', releaseBranch]);
    }

    try {
      // modify version file
      fs.writeFileSync(path.join(__dirname, '..', 'VERSION'), version);

      // modify package.json
      const packageJson = fs
        .readFileSync(path.join(__dirname, '..', 'package.json'))
        .toString();
      const data = JSON.parse(packageJson);
      data.version = version;
      fs.writeFileSync(
        path.join(__dirname, '..', 'package.json'),
        JSON.stringify(data, null, '\t'),
      );
      // push commit
      await execa('git', ['add', '-A']);
      await execa('git', ['commit', '-m', `release: v${version}`]);
      await execa('git', ['push', 'origin', releaseBranch, '-f']);
      await execa('git', ['checkout', TARGET_BRANCH]);

      console.log(`v${version} has been released successfully`);
    } catch (e) {
      console.log(e);
    }
  }
};

release().catch((err) => {
  console.error(err);
  process.exit(1);
});
