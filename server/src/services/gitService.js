const fs = require('fs-extra');
const { exec: execCb } = require('child_process');
const { promisify } = require('util');

const exec = promisify(execCb);

class GitService {
  async updateRepository(repoName) {
    await fs.remove('./repo');
    const result = await exec(`git clone https://github.com/${repoName}.git repo`);
    return result;
  }

  async cloneRepository(repoName) {
    return exec(`git clone https://github.com/${repoName}.git repo`);
  }

  async getCurrentRepositoryName() {
    const result = await exec('cd repo && git remote get-url origin');
    console.log('result', result);
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
