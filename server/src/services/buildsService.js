const GitService = require('./gitService');
const buildQueue = require('../models/buildQueue');

const gitService = new GitService();

class BuildsService {
  constructor(storage) {
    this.storage = storage;
  }

  async getBuildsList(offset = 0, limit = 25) {
    return this.storage.getBuildsList(offset, limit);
  }

  async addToBuildQueue(commitHash) {
    const commitDetails = await gitService.getCommitDetails(commitHash);
    buildQueue.enqueue(commitHash);
    return this.storage.buildInit(commitDetails);
  }

  async getBuildDetails(buildId) {
    return this.storage.getBuildDetails(buildId);
  }

  async getBuildLog(buildId) {
    return this.storage.getBuildLog(buildId);
  }
}

module.exports = BuildsService;
