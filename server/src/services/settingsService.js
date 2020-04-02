const buildQueue = require('../models/buildQueue');
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
    try {
      const { mainBranch } = settingsDTO;
      const lastCommitHash = await gitService.getLastCommitHash(mainBranch);

      const isAlredyBuilt = await this.checkIfCommitIsBuilt(lastCommitHash);
      const isAlreadyInQueue = buildQueue.has({ commitHash: lastCommitHash });

      if (!isAlreadyInQueue && !isAlredyBuilt) {
        const commitDetails = await gitService.getCommitDetails(lastCommitHash);
        const data = await this.storage.buildInit(commitDetails);
        const buildId = data.data.id;
        await buildQueue.enqueue({ commitHash: lastCommitHash, buildId });
      }
    } catch (error) {
      console.log('Cannot add last commit for repo', settingsDTO.mainBranch);
    }
  }

  async checkIfCommitIsBuilt(commitHash) {
    try {
      const { data: buildList } = await this.storage.getBuildsList();
      return buildList.some((build) => build.commitHash === commitHash);
    } catch (err) {
      return false;
    }
  }
}

module.exports = SettingsService;
