const SettingsService = require('../../services/settingsService');
const GitService = require('../../services/gitService');
const buildQueue = require('../../models/buildQueue');

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

beforeEach(() => {
  GitService.mockClear();
});

describe('Settings Service', () => {
  test('getSettings is proxied to storage', async () => {
    const settingsService = new SettingsService(storageMock);
    await settingsService.getSettings();

    expect(storageMock.getSettings).toHaveBeenCalled();
  });
  test('setSettings is proxied to storage', async () => {
    const settingsService = new SettingsService(storageMock);
    await settingsService.setSettings(settingsDTO);

    expect(storageMock.setSettings).toHaveBeenCalled();
    expect(storageMock.setSettings).toHaveBeenCalledWith(settingsDTO);
  });
  test('updateRepository calls gitService method', async () => {
    const settingsService = new SettingsService(storageMock);
    await settingsService.updateRepository(settingsDTO);

    expect(GitService.mock.instances[0].updateRepository).toHaveBeenCalledWith(
      settingsDTO.repoName,
      settingsDTO.mainBranch,
    );
  });
  describe('addLastCommitToQueue', () => {
    const commitHash = '94dc970';
    const buildId = '30c10a6a-087e-4a6b-aed8-8a809169a305';
    storageMock.buildInit = jest.fn().mockResolvedValue({ data: { id: buildId } });

    beforeEach(() => {
      GitService.mockImplementationOnce(() => ({
        getLastCommitHash: () => commitHash,
        getCommitDetails: () => {},
      }));
    });
    test("Add commit to queue if it's not built nor in queue", async () => {
      buildQueue.has.mockImplementationOnce(() => false);

      const settingsService = new SettingsService(storageMock);
      settingsService.__checkIfCommitIsBuilt = jest.fn().mockResolvedValue(false);
      await settingsService.addLastCommitToQueue(settingsDTO);

      expect(buildQueue.enqueue).toHaveBeenCalled();
      expect(buildQueue.enqueue).toHaveBeenCalledWith({ commitHash, buildId });
    });
    test("Don't add commit to queue if it's built recently", async () => {
      const settingsService = new SettingsService(storageMock);
      settingsService.__checkIfCommitIsBuilt = jest.fn().mockResolvedValue(true);
      await settingsService.addLastCommitToQueue(settingsDTO);

      expect(buildQueue.enqueue).toHaveBeenCalled();
      expect(buildQueue.enqueue).toHaveBeenCalledWith({ commitHash, buildId });
    });
    test("Don't add commit to queue if it's already in queue", async () => {
      buildQueue.has.mockImplementationOnce(() => true);

      const settingsService = new SettingsService(storageMock);
      settingsService.__checkIfCommitIsBuilt = jest.fn().mockResolvedValue(false);
      await settingsService.addLastCommitToQueue(settingsDTO);

      expect(buildQueue.enqueue).toHaveBeenCalled();
      expect(buildQueue.enqueue).toHaveBeenCalledWith({ commitHash, buildId });
    });
  });
});
