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
    const { repoName } = settingsDTO;
    await gitService.cloneRepository(repoName);
    return this.storage.setSettings(settingsDTO);
  }
}

module.exports = SettingsService;
