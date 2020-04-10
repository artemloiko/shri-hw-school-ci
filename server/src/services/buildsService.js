const GitService = require('./gitService');
const buildQueue = require('../models/buildQueue');

class BuildsService {
  constructor(storage) {
    this.storage = storage;
    this.gitService = new GitService();
  }

  async getBuildsList(offset = 0, limit = 25) {
    return this.storage.getBuildsList(offset, limit);
  }

  async addToBuildQueue(commitHash) {
    const commitDetails = await this.gitService.getCommitDetails(commitHash);
    const data = await this.storage.buildInit(commitDetails);
    const buildId = data.data.id;
    await buildQueue.enqueue({ commitHash, buildId });
    return buildId;
  }

  async getBuildDetails(buildId) {
    return this.storage.getBuildDetails(buildId);
  }

  async getBuildLog(buildId) {
    return this.storage.getBuildLog(buildId);
  }
}

module.exports = BuildsService;
