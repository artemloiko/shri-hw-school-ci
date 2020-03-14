const fs = require('fs-extra');
const { exec: execCb } = require('child_process');
const { promisify } = require('util');

const exec = promisify(execCb);

class GitService {
  async cloneRepository(repoName) {
    await fs.remove('./repo');
    const result = await exec(`git clone https://github.com/${repoName}.git repo`);
    return result;
  }
}

module.exports = GitService;
