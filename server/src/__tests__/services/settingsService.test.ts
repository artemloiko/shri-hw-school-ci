import { mocked } from 'ts-jest/utils';

import SettingsService from '../../services/settingsService';
import GitService from '../../services/gitService';
import { buildQueue } from '../../models/buildQueue';

const GitServiceMock = mocked(GitService);

const storageMock = {
  getSettings: jest.fn(),
  setSettings: jest.fn(),
  getBuildsList: jest.fn(),
};
jest.mock('../../services/gitService');
jest.mock('../../models/buildQueue');

const settingsDTO = {
  repoName: 'artuom130/itItReal',
  buildCommand: 'npm run build',
  mainBranch: 'master',
  period: 0,
};

describe('Settings Service', () => {
  let settingsService: SettingsService;

  beforeEach(() => {
    GitServiceMock.mockClear();
    // @ts-ignore
    settingsService = new SettingsService(storageMock);
  });

  test('getSettings is proxied to storage', async () => {
    await settingsService.getSettings();

    expect(storageMock.getSettings).toHaveBeenCalled();
  });

  test('setSettings is proxied to storage', async () => {
    await settingsService.setSettings(settingsDTO);

    expect(storageMock.setSettings).toHaveBeenCalledWith(settingsDTO);
  });

  test('updateRepository calls gitService method', async () => {
    await settingsService.updateRepository(settingsDTO);

    expect(GitServiceMock.mock.instances[0].updateRepository).toHaveBeenCalledWith(
      settingsDTO.repoName,
      settingsDTO.mainBranch,
    );
  });

  describe('addLastCommitToQueue', () => {
    const commitHash = '94dc970';
    const buildId = '30c10a6a-087e-4a6b-aed8-8a809169a305';
    // @ts-ignore
    storageMock.buildInit = jest.fn().mockResolvedValue({ data: { id: buildId } });

    beforeEach(() => {
      GitServiceMock.mockImplementationOnce(() => ({
        // @ts-ignore
        getLastCommitHash: () => commitHash,
        // @ts-ignore
        getCommitDetails: () => {},
      }));
      // @ts-ignore
      settingsService = new SettingsService(storageMock);
      // @ts-ignore
      settingsService.checkIfCommitIsBuilt = jest.fn();
    });

    test("Add commit to queue if it's not built nor in queue", async () => {
      // @ts-ignore
      buildQueue.has.mockImplementationOnce(() => false);
      // @ts-ignore
      settingsService.checkIfCommitIsBuilt.mockResolvedValueOnce(false);

      await settingsService.addLastCommitToQueue(settingsDTO);

      expect(buildQueue.enqueue).toHaveBeenCalledWith({ commitHash, buildId });
    });

    test("Don't add commit to queue if it's built recently", async () => {
      // @ts-ignore
      settingsService.checkIfCommitIsBuilt.mockResolvedValueOnce(true);

      await settingsService.addLastCommitToQueue(settingsDTO);

      expect(buildQueue.enqueue).toHaveBeenCalledWith({ commitHash, buildId });
    });

    test("Don't add commit to queue if it's already in queue", async () => {
      // @ts-ignore
      buildQueue.has.mockImplementationOnce(() => true);
      // @ts-ignore
      settingsService.checkIfCommitIsBuilt.mockResolvedValueOnce(false);

      await settingsService.addLastCommitToQueue(settingsDTO);

      expect(buildQueue.enqueue).toHaveBeenCalledWith({ commitHash, buildId });
    });
  });
});
