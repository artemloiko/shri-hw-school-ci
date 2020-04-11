const { buildQueue } = require('../../models/buildQueue');
const storage = require('../../models/storage');
const { builder } = require('./builder');

async function buildQueueRunProcessing() {
  const setCheckInterval = () => {
    const intervalId = setInterval(() => {
      if (buildQueue.front()) {
        clearInterval(intervalId);

        buildQueueRunProcessing();
      }
    }, 10000);
  };

  const frontElem = buildQueue.front();
  if (!frontElem) {
    setCheckInterval();
    return;
  }
  const { commitHash, buildId } = frontElem;
  const buildStartTime = new Date();

  console.log('[BUILD_START]', buildId, buildStartTime.toISOString());
  try {
    await storage.buildStart({ buildId, dateTime: buildStartTime.toISOString() });
  } catch (err) {
    console.log('[BUILD_START_ERR]', buildId, 'is already started');
  }

  const { duration, success, buildLog } = await builder();

  console.log('[BUILD_FINISH]', buildId, commitHash, success, duration);

  await storage.buildFinish({ buildId, duration, success, buildLog });

  await buildQueue.dequeue();

  if (buildQueue.front()) {
    return buildQueueRunProcessing();
  }

  setCheckInterval();
}

module.exports = {
  init: buildQueueRunProcessing,
  buildQueueRunProcessing,
};
