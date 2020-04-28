import GitService from './gitService';
import { ConfigurationDTO, BuildModel } from '@i/storage.interfaces';

import { Storage } from '../models/storage';

export default class SettingsService {
  gitService: GitService;
  constructor(private storage: Storage) {
    this.storage = storage;
    this.gitService = new GitService();
  }

  async getSettings() {
    return this.storage.getSettings();
  }

  async setSettings(settingsDTO: ConfigurationDTO) {
    return this.storage.setSettings(settingsDTO);
  }

  async updateRepository(settingsDTO: ConfigurationDTO) {
    const { repoName, mainBranch } = settingsDTO;
    await this.gitService.updateRepository(repoName, mainBranch);
  }

  async addLastCommitToQueue(settingsDTO: ConfigurationDTO) {
    try {
      const { mainBranch } = settingsDTO;
      const lastCommitHash = await this.gitService.getLastCommitHash(mainBranch);
      const isAlredyBuilt = await this.checkIfCommitIsBuilt(lastCommitHash);

      if (!isAlredyBuilt) {
        const commitDetails = await this.gitService.getCommitDetails(lastCommitHash);
        await this.storage.buildInit(commitDetails);
      }
    } catch (error) {
      console.log('Cannot add last commit for repo', settingsDTO.mainBranch);
    }
  }

  async checkIfCommitIsBuilt(commitHash: string) {
    try {
      const { data: buildList } = await this.storage.getBuildsList();
      return buildList.some((build: BuildModel) => build.commitHash === commitHash);
    } catch (err) {
      return false;
    }
  }
}
