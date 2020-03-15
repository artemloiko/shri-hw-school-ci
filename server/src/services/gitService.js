const fs = require('fs-extra');
const { exec: execCb } = require('child_process');
const { promisify } = require('util');

const exec = promisify(execCb);

class GitService {
  async updateRepository(repoName) {
    const currentRepoName = await this.getCurrentRepositoryName();
    if (currentRepoName === repoName) {
      await exec('cd repo && git pull');
    } else {
      await fs.remove('./repo');
      return this.cloneRepository(repoName);
    }
  }

  async cloneRepository(repoName) {
    return exec(`git clone https://github.com/${repoName}.git repo`);
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
    // TODO: get last commit of ${branchName}
    return '0b0b0bf8';
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
