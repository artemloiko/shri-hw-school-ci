const fs = require('fs-extra');
const path = require('path');
const { exec: execCb } = require('child_process');
const { promisify } = require('util');
const { HttpError } = require('../utils/customErrors');
const config = require('../config');
const GitOutputParser = require('./GitOutputParser');

const exec = promisify(execCb);
const { repoPath } = config;

class GitService {
  async updateRepository(repoName, mainBranch) {
    const currentRepoName = await this.getCurrentRepositoryName();
    if (currentRepoName === repoName) {
      await this.updateBranch(mainBranch);
      return;
    }

    await this.cloneRepository(repoName);
    await this.updateBranch(mainBranch);
  }

  async updateBranch(branchName) {
    try {
      await exec(`cd ${repoPath} && git fetch && git checkout ${branchName} && git pull`);
    } catch (error) {
      console.error('GitService.updateRepository error\n', error.stderr);
      throw new HttpError(
        `Cannot find branch ${branchName} in repo`,
        400,
        'GIT_CANNOT_FIND_BRANCH',
      );
    }
  }

  async cloneRepository(repoName) {
    try {
      const repoUrl = `https://github.com/${repoName}.git`;
      if (!(await this.checkIfRepositoryExists(repoUrl))) {
        throw new Error('Repository does not exist');
      }
      await fs.remove(path.join('./', repoPath));
      await exec(`git clone ${repoUrl} ${repoPath}`);
    } catch (error) {
      console.error('GitService.updateRepository error\n', error.stderr);
      throw new HttpError(`Cannot find ${repoName} repository`, 400, 'GIT_CANNOT_FIND_REPO');
    }
  }

  async checkIfRepositoryExists(repoUrl) {
    try {
      await exec(`git ls-remote ${repoUrl}`);
      return true;
    } catch (err) {
      return false;
    }
  }

  async getCurrentRepositoryName() {
    try {
      const { stdout } = await exec(`cd ${repoPath} && git remote get-url origin`);
      return GitOutputParser.parseRepositoryName(stdout);
    } catch (error) {
      return '';
    }
  }

  async getLastCommitHash(branchName) {
    try {
      const { stdout: hash } = await exec(
        `cd ${repoPath} && git log --pretty=format:%h -1 ${branchName}`,
      );
      return hash;
    } catch (error) {
      console.error('GitService.getLastCommitHash error\n', error.stderr);
      throw new HttpError(
        `Cannot find branch ${branchName} in repo`,
        400,
        'GIT_CANNOT_FIND_BRANCH',
      );
    }
  }

  async getCommitDetails(commitHash) {
    try {
      const SPLITTER = '{SPLIT}';
      const { stdout: log } = await exec(
        `cd ${repoPath} && git log --pretty="%an${SPLITTER}%s${SPLITTER}%D" -1 ${commitHash}`,
      );
      const parsedData = GitOutputParser.parseLog(log, SPLITTER);
      let { branchName } = parsedData;

      if (!branchName) {
        const { stdout } = await exec(`cd ${repoPath} && git name-rev ${commitHash}`);
        branchName = GitOutputParser.parseBranch(stdout);
      }
      return { ...parsedData, commitHash, branchName };
    } catch (error) {
      console.error('GitService.getCommitDetails error\n', error.stderr);
      throw new HttpError(
        `Cannot get detils of commit ${commitHash}`,
        400,
        'GIT_CANNOT_FIND_COMMIT',
      );
    }
  }
}

module.exports = GitService;
