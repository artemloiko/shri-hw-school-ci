const GitService = require('./gitService');
const buildQueue = require('../models/buildQueue');

const gitService = new GitService();

class BuildsService {
  constructor(storage) {
    this.storage = storage;
  }

  async getBuildsList() {
    return this.storage.getBuildsList();
  }

  async addToBuildQueue(commitHash) {
    const commitDetails = await gitService.getCommitDetails(commitHash);
    buildQueue.enqueue(commitHash);
    await this.storage.buildInit(commitDetails);
  }

  async getBuildDetails(buildId) {
    return this.storage.getBuildDetails(buildId);
  }

  async getBuildLog(buildId) {
    return this.storage.getBuildLog(buildId);
  }
}

module.exports = BuildsService;
