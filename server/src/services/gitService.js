const fs = require('fs-extra');
const { exec: execCb } = require('child_process');
const { promisify } = require('util');
const { HttpError } = require('../utils/customErrors');

const exec = promisify(execCb);

class GitService {
  async updateRepository(repoName, mainBranch) {
    const currentRepoName = await this.getCurrentRepositoryName();
    if (currentRepoName === repoName) {
      try {
        await exec(`cd repo && git fetch && git checkout ${mainBranch} && git pull`);
      } catch (error) {
        console.error('GitService.updateRepository error\n', error.stderr);
        throw new HttpError(
          `Cannot find branch ${mainBranch} in repo ${repoName}`,
          400,
          'GIT_CANNOT_FIND_BRANCH',
        );
      }
      return;
    }

    try {
      await fs.remove('./repo');
      await this.cloneRepository(repoName);
    } catch (error) {
      console.error('GitService.updateRepository error', error);
      throw new HttpError(`Cannot find ${repoName} repository`, 400, 'GIT_CANNOT_FIND_REPO');
    }
  }

  async cloneRepository(repoName, mainBranch) {
    return exec(`git clone -b ${mainBranch} https://github.com/${repoName}.git repo`);
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
