import { mocked } from 'ts-jest/utils';

import SettingsService from '../../services/settingsService';
import GitService from '../../services/gitService';
import storage from '../../models/storage';

const GitServiceMock = mocked(GitService);

mocked(storage).getSettings.mockImplementation();
jest.mock('../../models/storage');
jest.mock('../../services/gitService');

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
    settingsService = new SettingsService(storage);
  });

  test('getSettings is proxied to storage', async () => {
    await settingsService.getSettings();

    expect(mocked(storage).getSettings).toHaveBeenCalled();
  });

  test('setSettings is proxied to storage', async () => {
    await settingsService.setSettings(settingsDTO);

    expect(mocked(storage).setSettings).toHaveBeenCalledWith(settingsDTO);
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
    mocked(storage).buildInit.mockResolvedValue({
      data: { id: buildId, buildNumber: 1, status: 'Waiting' },
    });

    beforeEach(() => {
      GitServiceMock.prototype.getLastCommitHash = jest.fn().mockResolvedValueOnce(commitHash);
      settingsService = new SettingsService(storage);
      settingsService.checkIfCommitIsBuilt = jest.fn();
      mocked(storage).buildInit.mockClear();
    });

    test("Add commit to queue if it's not built", async () => {
      mocked(settingsService.checkIfCommitIsBuilt).mockResolvedValueOnce(false);

      await settingsService.addLastCommitToQueue(settingsDTO);

      expect(mocked(storage).buildInit).toHaveBeenCalled();
    });

    test("Don't add commit to queue if it's built recently", async () => {
      mocked(settingsService.checkIfCommitIsBuilt).mockResolvedValueOnce(true);

      await settingsService.addLastCommitToQueue(settingsDTO);

      expect(mocked(storage).buildInit).not.toHaveBeenCalled();
    });
  });
});
