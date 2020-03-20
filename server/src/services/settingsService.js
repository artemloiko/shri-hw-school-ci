const buildQueue = require('../buildQueue');
const GitService = require('./gitService');

const gitService = new GitService();

class SettingsService {
  constructor(storage) {
    this.storage = storage;
  }

  async getSettings() {
    return this.storage.getSettings();
  }

  async setSettings(settingsDTO) {
    return this.storage.setSettings(settingsDTO);
  }

  async updateRepository(settingsDTO) {
    const { repoName, mainBranch } = settingsDTO;
    await gitService.updateRepository(repoName, mainBranch);
  }

  async addLastCommitToQueue(settingsDTO) {
    const { mainBranch } = settingsDTO;
    const lastCommitHash = await gitService.getLastCommitHash(mainBranch);

    const isAlredyBuilt = await this.checkIfCommitIsBuilt(lastCommitHash);
    const isAlreadyInQueue = buildQueue.has(lastCommitHash);

    if (!isAlreadyInQueue && !isAlredyBuilt) {
      buildQueue.enqueue(lastCommitHash);
    }
  }

  async checkIfCommitIsBuilt(commitHash) {
    const { data: buildList } = await this.storage.getBuildsList();
    return buildList.some((build) => build.commitHash === commitHash);
  }
}

module.exports = SettingsService;
