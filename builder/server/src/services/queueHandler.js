const storageSingletone = require('../models/storage');
const { buildServer } = require('./buildServer');

const CHECK_QUEUE_INTERVAL_MINUTES = 2;

class QueueHandler {
  constructor(storage) {
    this.storage = storage;
    this.buildServer = buildServer;
    this.waitingBuilds = [];
  }

  init() {
    this.processBuildQueue();
  }

  async processBuildQueue() {
    if (!this.waitingBuilds.length) await this.updateWaitingBuilds();

    while (this.waitingBuilds.length) {
      const currentBuild = this.waitingBuilds[0];
      // eslint-disable-next-line no-await-in-loop
      const sent = await this.sendBuildToAgent(currentBuild);
      if (!sent) break;

      this.waitingBuilds.shift();
    }

    this.startQueueProcessingTimeout();
  }

  async updateWaitingBuilds() {
    try {
      const settings = await this.getSettings();
      const waitingBuilds = await this.getWaitingBuilds();
      // reverse changes sort to oldest -> newest
      const waitingBuildDTOs = waitingBuilds.reverse().map((build) => {
        const { id, commitHash } = build;
        const { repoName, buildCommand } = settings;

        return { buildId: id, commitHash, repoName, buildCommand };
      });
      console.log('[UPDATE WAITING BUILDS]', waitingBuildDTOs.slice(0, 2));
      this.waitingBuilds = waitingBuildDTOs;
    } catch (e) {
      console.error('⚠️ Something wrong with storage, please check storage!');
    }
  }

  async sendBuildToAgent(buildDTO) {
    const agent = this.buildServer.getFreeAgent();

    if (!agent) {
      return false;
    }

    try {
      console.log(['AGENT START BUILD', agent, buildDTO]);
      await agent.build(buildDTO);
      await this.saveBuildStart(buildDTO.buildId);

      return true;
    } catch (e) {
      console.error('Agent is broken', agent.id);
      this.buildServer.deleteAgent(agent.id);
      return this.sendBuildToAgent(buildDTO);
    }
  }

  async saveBuildStart(buildId) {
    try {
      const dateTime = new Date().toISOString();

      await this.storage.buildStart({ buildId, dateTime });
    } catch (e) {
      console.log('Build is started', buildId);
    }
  }

  async getSettings() {
    console.log('[GET SETTINGS]');
    try {
      const settings = await this.storage.getSettings();
      return settings;
    } catch (e) {
      console.error('⚠️ Something wrong with storage, please check storage!');
    }
  }

  async getWaitingBuilds(offset = 0) {
    const LIMIT = 50;

    const allBuilds = await this.storage.getBuildsList(offset, LIMIT);
    let waitingBuilds = allBuilds.filter((build) => build.status === 'Waiting');

    if (waitingBuilds.length === LIMIT) {
      waitingBuilds = waitingBuilds.concat(await this.loadWaitingBuilds(offset + allBuilds.length));
    }

    return waitingBuilds;
  }

  startQueueProcessingTimeout(intervalMin = CHECK_QUEUE_INTERVAL_MINUTES) {
    console.log('[START PROCESSING TIMEOUT]');
    const intervalMs = intervalMin * 60 * 1000;
    setTimeout(() => this.processBuildQueue(), intervalMs);
  }
}

const queueHandler = new QueueHandler(storageSingletone);

module.exports = {
  QueueHandler,
  queueHandler,
};
