class BuildsService {
  constructor(storage) {
    this.storage = storage;
  }
  async getBuildsList() {
    return this.storage.getBuildsList();
  }

  async addBuild(commitHash) {
    // TODO: Get required info about commit by hash
    await this.storage.buildInit();
  }

  async getBuildDetails(buildId) {
    return this.storage.getBuildDetails(buildId);
  }

  async getBuildLog(buildId) {
    return this.storage.getBuildLog(buildId);
  }
}

module.exports = BuildsService;
