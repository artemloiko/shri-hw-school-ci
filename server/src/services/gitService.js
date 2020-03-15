const fs = require('fs-extra');
const { exec: execCb } = require('child_process');
const { promisify } = require('util');
const { HttpError } = require('../utils/customErrors');

const exec = promisify(execCb);

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
      await exec(`cd repo && git fetch && git checkout ${branchName} && git pull`);
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
      await fs.remove('./repo');
      await exec(`git clone https://github.com/${repoName}.git repo`);
    } catch (error) {
      console.error('GitService.updateRepository error', error);
      throw new HttpError(`Cannot find ${repoName} repository`, 400, 'GIT_CANNOT_FIND_REPO');
    }
  }

  async getCurrentRepositoryName() {
    try {
      const result = await exec('cd repo && git remote get-url origin');
      // /(?<=\/\/.+\..+\/).+\/.+(?=\.git\n?$)/ matches from url https://example.com/user-name/repo-name.git
      // /(?<=git@.+:).+\/.+(?=\.git\n?$)/ matches from ssh git@example.com:user-name/repo-name.git
      const matchRepoNameRegex = /(?<=\/\/.+\..+\/).+\/.+(?=\.git\n?$)|(?<=git@.+:).+\/.+(?=\.git\n?$)/;
      const repoOriginLink = result.stdout;
      const matchedName = repoOriginLink.match(matchRepoNameRegex);
      return matchedName ? matchedName[0] : '';
    } catch (error) {
      return '';
    }
  }

  async getLastCommitHash(branchName) {
    try {
      const { stdout: hash } = await exec(`cd repo && git log --pretty=format:%h -1 ${branchName}`);
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
    // TODO: add implementation
    const commitDetails = {
      commitMessage: 'string',
      commitHash: 'string',
      branchName: 'string',
      authorName: 'string',
    };
    // throw new Error(`Cannot find commit ${commitHash} in current repository`);
    return commitDetails;
  }
}

module.exports = GitService;
