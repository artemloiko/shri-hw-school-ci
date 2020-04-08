const buildQueue = require('../models/buildQueue');
const storage = require('../models/storage');

/**
 * @param {object} buildFinishDTO Information about finished build process
 * @param {string} buildFinishDTO.buildId
 * @param {number} buildFinishDTO.duration duration in sec
 * @param {boolean} buildFinishDTO.success
 * @param {string} buildFinishDTO.buildLog
 */

async function fakeBuilder() {
  // eslint-disable-next-line operator-linebreak
  const successLog =
    '\n> school-ci-client@0.3.0 build C:\\Users\\artem\\code\\shri-homeworks\\shri-hw-school-ci\\client\n> react-scripts build\n\nCreating an optimized production build...\n\u001b[32mCompiled successfully.\u001b[39m\n\u001b[32m\u001b[39m\nFile sizes after gzip:\n\n  69.83 KB  \u001b[2mbuild\\static\\js\\\u001b[22m\u001b[36m2.bcd446fa.chunk.js\u001b[39m\n  5.71 KB   \u001b[2mbuild\\static\\js\\\u001b[22m\u001b[36mmain.7d8e8b80.chunk.js\u001b[39m\n  3.84 KB   \u001b[2mbuild\\static\\css\\\u001b[22m\u001b[36mmain.90137828.chunk.css\u001b[39m\n  783 B     \u001b[2mbuild\\static\\js\\\u001b[22m\u001b[36mruntime-main.d9a802f9.js\u001b[39m\n\nThe project was built assuming it is hosted at \u001b[32m/\u001b[39m.\nYou can control this with the \u001b[32mhomepage\u001b[39m field in your \u001b[36mpackage.json\u001b[39m.\n\nThe \u001b[36mbuild\u001b[39m folder is ready to be deployed.\nYou may serve it with a static server:\n\n  \u001b[36mnpm\u001b[39m install -g serve\n  \u001b[36mserve\u001b[39m -s build\n\nFind out more about deployment here:\n\n  \u001b[33mbit.ly/CRA-deploy\u001b[39m\n\n';
  // eslint-disable-next-line operator-linebreak
  const errorLog =
    "\n> school-ci-client@0.3.0 build C:\\Users\\artem\\code\\shri-homeworks\\shri-hw-school-ci\\client\n> react-scripts build\n\nCreating an optimized production build...\n\u001b[31mFailed to compile.\u001b[39m\n\u001b[31m\u001b[39m\n\u001b[7m./src/components/common/BuildHistory/BuildHistory.js\u001b[27m\n  \u001b[1mLine 16:8:\u001b[22m  'Buttons' is not defined  \u001b[31m\u001b[4mreact/jsx-no-undef\u001b[24m\u001b[39m\n\nSearch for the \u001b[4m\u001b[31mkeywords\u001b[39m\u001b[24m to learn more about each error.\n\n\nnpm ERR! code ELIFECYCLE\nnpm ERR! errno 1\nnpm ERR! school-ci-client@0.3.0 build: `react-scripts build`\nnpm ERR! Exit status 1\nnpm ERR! \nnpm ERR! Failed at the school-ci-client@0.3.0 build script.\nnpm ERR! This is probably not a problem with npm. There is likely additional logging output above.\n\nnpm ERR! A complete log of this run can be found in:\nnpm ERR!     C:\\Users\\artem\\AppData\\Roaming\\npm-cache\\_logs\\2020-03-28T11_37_41_101Z-debug.log\n";
  const isSuccess = Math.random() < 0.7;

  await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000));

  return {
    duration: Math.round(Math.random() * 6000),
    success: isSuccess,
    buildLog: isSuccess ? successLog : errorLog,
  };
}

async function buildQueueRunProcessing() {
  const setCheckInterval = () => {
    const intervalId = setInterval(() => {
      if (buildQueue.front()) {
        clearInterval(intervalId);

        buildQueueRunProcessing();
      }
    }, 10000);
  };
  if (!buildQueue.front()) {
    setCheckInterval();
    return;
  }
  const { commitHash, buildId } = buildQueue.front();
  const buildStartTime = new Date();

  console.log('[BUILD_START]', buildId, buildStartTime.toISOString());
  try {
    await storage.buildStart({ buildId, dateTime: buildStartTime.toISOString() });
  } catch (err) {
    console.log('[BUILD_START_ERR]', buildId, 'is already started');
  }

  const { duration, success, buildLog } = await fakeBuilder();

  console.log('[BUILD_FINISH]', buildId, commitHash, success, duration);

  await storage.buildFinish({ buildId, duration, success, buildLog });

  await buildQueue.dequeue();

  if (buildQueue.front()) {
    buildQueueRunProcessing();
  } else {
    setCheckInterval();
  }
}

module.exports = {
  init: () => {
    buildQueueRunProcessing();
  },
};
