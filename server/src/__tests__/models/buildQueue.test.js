const { BuildQueue } = require('../../models/buildQueue');

describe('BuildQueue', () => {
  const queueElements = [
    {
      commitHash: '94dc970',
      buildId: '30c10a6a-087e-4a6b-aed8-8a809169a305',
    },
    {
      commitHash: '914f07e',
      buildId: 'b6eef618-014a-45da-a3a6-3c05851f65bc',
    },
  ];

  describe('Constructor', () => {
    test('Contains empty queue by default', () => {
      const queue = new BuildQueue();

      expect(queue.buildQueue).toHaveLength(0);
    });
    test('Contains passes items', () => {
      const queue = new BuildQueue(queueElements);

      expect(queue.buildQueue).toHaveLength(queueElements.length);
    });
  });

  describe('Methods syncing with file', () => {
    const queueElem = {
      commitHash: '0520796',
      buildId: 'e59f7715-8da8-4e46-9312-bcba770d2c0f',
    };
    let queue;
    beforeEach(() => {
      queue = new BuildQueue(queueElements);
      queue.saveQueueToFile = jest.fn().mockResolvedValue();
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });
    test('enqueue() syncs queue to file', async () => {
      await queue.enqueue(queueElem);
      expect(queue.saveQueueToFile).toHaveBeenCalled();
    });
    test('dequeue() syncs queue to file', async () => {
      await queue.dequeue();
      expect(queue.saveQueueToFile).toHaveBeenCalled();
    });
    test('remove() syncs queue to file', async () => {
      await queue.remove(queueElements[0]);
      expect(queue.saveQueueToFile).toHaveBeenCalled();
    });
    test('enqueue() adds element to queue', async () => {
      await queue.enqueue(queueElem);

      expect(queue.buildQueue).toHaveLength(queueElements.length + 1);
      expect(queue.buildQueue[queue.buildQueue.length - 1]).toEqual(queueElem);
    });
    test('dequeue() extracts first queue elem', async () => {
      const elem = await queue.dequeue();

      expect(queue.buildQueue).toHaveLength(queueElements.length - 1);
      expect(elem).toEqual(queueElements[0]);
    });
    test('remove() delete specified queue elem', async () => {
      await queue.remove(queueElements[1]);

      expect(queue.buildQueue).toHaveLength(queueElements.length - 1);
      expect(queue.buildQueue).not.toContainEqual(queueElements[1]);
    });
  });

  describe('Get methods', () => {
    const queue = new BuildQueue(queueElements);
    queue.saveQueueToFile = jest.fn().mockResolvedValue();

    const queueElem = {
      commitHash: '0520796',
      buildId: 'e59f7715-8da8-4e46-9312-bcba770d2c0f',
    };

    test('has() returns true if queue contains specified elem', () => {
      expect(queue.has(queueElements[0])).toBe(true);
    });
    test("has() returns false if queue doesn't contain specified elem", () => {
      expect(queue.has(queueElem)).toBe(false);
    });
    test('size() returns size of the queue', () => {
      expect(queue.size()).toBe(queue.buildQueue.length);
    });
    test('empty() returns true if queue is empty', () => {
      expect(new BuildQueue().empty()).toBe(true);
    });
    test("empty() returns false if queue isn't empty", () => {
      expect(queue.empty()).toBe(false);
    });
    test('front() returns first queue elem', () => {
      expect(queue.front()).toEqual(queueElements[0]);
    });
    test('back() returns last queue elem', () => {
      expect(queue.back()).toEqual(queueElements[queueElements.length - 1]);
    });
  });
});
