const BuildsService = require('../../services/buildsService');
const GitService = require('../../services/gitService');
const { buildQueue } = require('../../models/buildQueue');

const storageMock = {
  getBuildsList: jest.fn(),
  getBuildDetails: jest.fn(),
  getBuildLog: jest.fn(),
};
jest.mock('../../services/gitService');
jest.mock('../../models/buildQueue');

const buildId = '30c10a6a-087e-4a6b-aed8-8a809169a305';

describe('Builds Service', () => {
  let buildsService;

  beforeEach(() => {
    GitService.mockClear();
    storageMock.getBuildsList.mockClear();
    buildsService = new BuildsService(storageMock);
  });

  test('getBuildsList is proxied to storage with default params', async () => {
    await buildsService.getBuildsList();

    expect(storageMock.getBuildsList).toHaveBeenCalledWith(0, 25);
  });

  test('getBuildsList is proxied to storage with specified params offset 25, limit 55', async () => {
    await buildsService.getBuildsList(25, 50);

    expect(storageMock.getBuildsList).toHaveBeenCalledWith(25, 50);
  });

  test('getBuildDetails is proxied to storage', async () => {
    await buildsService.getBuildDetails(buildId);

    expect(storageMock.getBuildDetails).toHaveBeenCalledWith(buildId);
  });

  test('getBuildLog is proxied to storage', async () => {
    await buildsService.getBuildLog(buildId);

    expect(storageMock.getBuildLog).toHaveBeenCalledWith(buildId);
  });

  test('addToBuildQueue adds commit to queue and storage', async () => {
    const commitHash = '94dc970';
    storageMock.buildInit = jest.fn().mockResolvedValue({ data: { id: buildId } });
    GitService.mockImplementationOnce(() => ({
      getCommitDetails: () => {},
    }));

    await buildsService.addToBuildQueue(commitHash);

    expect(storageMock.buildInit).toHaveBeenCalled();
    expect(buildQueue.enqueue).toHaveBeenCalledWith({ commitHash, buildId });
  });
});
