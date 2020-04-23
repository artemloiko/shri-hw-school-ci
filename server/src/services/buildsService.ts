import GitService from './gitService';
import { buildQueue } from '../models/buildQueue';
import { Storage } from 'src/models/storage';

export default class BuildsService {
  gitService: GitService;
  constructor(private storage: Storage) {
    this.storage = storage;
    this.gitService = new GitService();
  }

  async getBuildsList(offset = 0, limit = 25) {
    return this.storage.getBuildsList(offset, limit);
  }

  async addToBuildQueue(commitHash: string) {
    const commitDetails = await this.gitService.getCommitDetails(commitHash);
    const data = await this.storage.buildInit(commitDetails);
    const buildId = data.data.id;
    await buildQueue.enqueue({ commitHash, buildId });
    return buildId;
  }

  async getBuildDetails(buildId: string) {
    return this.storage.getBuildDetails(buildId);
  }

  async getBuildLog(buildId: string) {
    return this.storage.getBuildLog(buildId);
  }
}
