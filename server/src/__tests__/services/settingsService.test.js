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

describe('Settings Service', () => {
  let settingsService;

  beforeEach(() => {
    GitService.mockClear();
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
      settingsService = new SettingsService(storageMock);
      settingsService.__checkIfCommitIsBuilt = jest.fn();
    });

    test("Add commit to queue if it's not built nor in queue", async () => {
      buildQueue.has.mockImplementationOnce(() => false);
      settingsService.__checkIfCommitIsBuilt.mockResolvedValueOnce(false);

      await settingsService.addLastCommitToQueue(settingsDTO);

      expect(buildQueue.enqueue).toHaveBeenCalledWith({ commitHash, buildId });
    });

    test("Don't add commit to queue if it's built recently", async () => {
      settingsService.__checkIfCommitIsBuilt.mockResolvedValueOnce(true);

      await settingsService.addLastCommitToQueue(settingsDTO);

      expect(buildQueue.enqueue).toHaveBeenCalledWith({ commitHash, buildId });
    });

    test("Don't add commit to queue if it's already in queue", async () => {
      buildQueue.has.mockImplementationOnce(() => true);
      settingsService.__checkIfCommitIsBuilt.mockResolvedValueOnce(false);

      await settingsService.addLastCommitToQueue(settingsDTO);

      expect(buildQueue.enqueue).toHaveBeenCalledWith({ commitHash, buildId });
    });
  });
});
