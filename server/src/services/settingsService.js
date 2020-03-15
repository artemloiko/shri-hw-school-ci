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
    if (!buildQueue.has(lastCommitHash)) {
      buildQueue.enqueue(lastCommitHash);
    }
  }
}

module.exports = SettingsService;
