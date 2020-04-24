import { buildQueueRunProcessing } from '../../tasks/process-queue';
import { buildQueue } from '../../models/buildQueue';
import storage from '../../models/storage';

jest.mock('../../tasks/process-queue/builder', () => ({
  builder: jest.fn().mockResolvedValue({
    duration: 6000,
    success: true,
    buildLog: 'Compiled successfully!',
  }),
}));
jest.mock('../../models/buildQueue', () => ({
  buildQueue: {
    front: jest.fn().mockName('front'),
    dequeue: jest.fn().mockName('dequeue'),
  },
}));
jest.mock('../../models/storage', () => ({
  buildStart: jest.fn().mockName('buildStart'),
  buildFinish: jest.fn().mockName('buildFinish'),
}));

const queueElem = {
  commitHash: '0520796',
  buildId: 'e59f7715-8da8-4e46-9312-bcba770d2c0f',
};

describe('Build Queue Processing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllTimers();
    // @ts-ignore
    buildQueue.front.mockReset();
    // @ts-ignore
    buildQueue.dequeue.mockReset();
    // @ts-ignore
    storage.buildStart.mockClear();
    // @ts-ignore
    storage.buildFinish.mockClear();
  });

  test('Creates setInterval for checking queue if no elements in queue are present', () => {
    buildQueueRunProcessing();

    expect(setInterval).toHaveBeenCalled();
  });

  test('Checks the buildQueue on every interval', () => {
    buildQueueRunProcessing();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(buildQueue.front).toHaveBeenCalledTimes(3);
  });

  test('Clears interval on queue element adding', () => {
    buildQueueRunProcessing();
    // @ts-ignore
    buildQueue.front.mockImplementationOnce(() => queueElem);
    jest.runOnlyPendingTimers();

    expect(clearInterval).toHaveBeenCalled();
  });

  test('Runs processing on queue element adding', () => {
    buildQueueRunProcessing();
    // @ts-ignore
    buildQueue.front.mockImplementation(() => queueElem);
    jest.runOnlyPendingTimers();

    expect(storage.buildStart).toHaveBeenCalled();
  });

  test('Add waiting interval after processing all items in queue', async () => {
    // @ts-ignore
    buildQueue.front.mockImplementationOnce(() => queueElem);

    await buildQueueRunProcessing();

    expect(setInterval).toHaveBeenCalled();
  });

  test('Saves build info to storage (buildStart, buildFinish)', async () => {
    expect(buildQueue.front()).toBeUndefined();
    // @ts-ignore
    buildQueue.front.mockImplementationOnce(() => queueElem);

    await buildQueueRunProcessing();

    expect(storage.buildStart).toHaveBeenCalled();
    expect(storage.buildFinish).toHaveBeenCalled();
  });

  test('Dequeues element in the end of the build', async () => {
    // @ts-ignore
    buildQueue.front.mockImplementationOnce(() => queueElem);

    await buildQueueRunProcessing();

    expect(buildQueue.dequeue).toHaveBeenCalled();
  });

  test('Process all elements in queue', async () => {
    buildQueue.front
      // @ts-ignore
      .mockImplementationOnce(() => queueElem)
      .mockImplementationOnce(() => queueElem)
      .mockImplementationOnce(() => queueElem)
      .mockImplementationOnce(() => queueElem)
      .mockImplementationOnce(() => queueElem);

    await buildQueueRunProcessing();

    expect(buildQueue.dequeue).toHaveBeenCalledTimes(3);
  });
});
