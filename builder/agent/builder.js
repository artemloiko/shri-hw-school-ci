const fse = require('fs-extra');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const logger = require('./src/utils/logger');

const REPO_PATH = './repo';

async function cloneRepository(repoName) {
  try {
    const repoUrl = `https://github.com/${repoName}.git`;

    await fse.remove(path.join('./', REPO_PATH));
    await exec(`git clone ${repoUrl} ${REPO_PATH}`);
  } catch (err) {
    throw new Error(`Cannot clone repository ${repoName}.\nMessage: ${err.message}`);
  }
}

async function checkoutCommit(commitHash) {
  try {
    await exec(
      `cd ${REPO_PATH} && git checkout ${commitHash} -b builder-working-branch-${commitHash}`,
    );
  } catch (err) {
    throw new Error(`Cannot find commit ${commitHash}.\nMessage: ${err.message}`);
  }
}

async function runCommand(buildCommand) {
  const buildStart = +new Date();
  const getDuration = () => {
    const diff = +new Date() - buildStart;
    return Math.round(diff / 1000);
  };
  try {
    const res = await exec(`cd ${REPO_PATH} && ${buildCommand}`);
    const { stdout, stderr } = res;
    const out = stdout + stderr;
    return {
      success: true,
      buildLog: `${out}\nProcess exited with code 0`,
      duration: getDuration(),
    };
  } catch (err) {
    const { stdout, stderr } = err;
    const out = stdout + stderr;
    return {
      success: false,
      buildLog: `${out}\nProcess exited with code ${err.code}`,
      duration: getDuration(),
    };
  }
}

async function builder(buildDTO) {
  const { buildId, commitHash, repoName, buildCommand } = buildDTO;

  try {
    logger.info('[CLONE REPO]', repoName);
    await cloneRepository(repoName);
    logger.info('[CHECKOUT COMMIT]', commitHash);
    await checkoutCommit(commitHash);
    logger.info('[EXECUTE COMMAND]', buildCommand);
    const { buildLog, success, duration } = await runCommand(buildCommand);
    return { buildId, buildLog, success, duration };
  } catch (e) {
    logger.error(e.message);
  }
}

module.exports.builder = builder;
