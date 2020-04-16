const storageSingletone = require('../models/storage');
const logger = require('../utils/logger');
const { buildServer } = require('./buildServer');

const CHECK_QUEUE_INTERVAL_MINUTES = 2;

class QueueHandler {
  constructor(storage) {
    this.storage = storage;
    this.buildServer = buildServer;
    this.waitingBuilds = [];
    this.timerID = null;
  }

  runQueueProcessing() {
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
    this.processBuildQueue();
  }

  async processBuildQueue() {
    if (!this.waitingBuilds.length) await this.updateWaitingBuilds();

    while (this.waitingBuilds.length) {
      const currentBuild = this.waitingBuilds[0];
      // eslint-disable-next-line no-await-in-loop
      const sent = await this.sendBuildToAgent(currentBuild);
      if (!sent) {
        logger.info('[NO MORE FREE AGENTS FOUND]');
        break;
      }

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
      logger.info('[UPDATE WAITING BUILDS]', waitingBuildDTOs.length);
      this.waitingBuilds = waitingBuildDTOs;
    } catch (e) {
      logger.error('[STORAGE ERROR] Something wrong with storage, please check storage!');
    }
  }

  async sendBuildToAgent(buildDTO) {
    const agent = this.buildServer.getFreeAgent();

    if (!agent) {
      return false;
    }

    try {
      logger.info('[AGENT START BUILD]', `agent:${agent.port}`, buildDTO.buildId);
      await agent.build(buildDTO);
      await this.saveBuildStart(buildDTO.buildId);

      return true;
    } catch (e) {
      logger.error('[AGENT BROKEN]', agent.id, agent.port);
      this.buildServer.deleteAgent(agent.id);
      return this.sendBuildToAgent(buildDTO);
    }
  }

  async saveBuildStart(buildId) {
    try {
      const dateTime = new Date().toISOString();

      await this.storage.buildStart({ buildId, dateTime });
    } catch (e) {
      logger.warn('[BUILD ALREADY STARTED]', buildId);
    }
  }

  async saveBuildFinish(buildFinishDTO) {
    try {
      const res = await this.storage.buildFinish(buildFinishDTO);
      return res;
    } catch (e) {
      logger.error('[STORAGE ERROR] Something wrong with storage, please check storage!');
      throw e;
    }
  }

  async getSettings() {
    try {
      const settings = await this.storage.getSettings();
      return settings;
    } catch (e) {
      logger.error('[STORAGE ERROR] Something wrong with storage, please check storage!');
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
    const intervalMs = intervalMin * 60 * 1000;
    this.timerID = setTimeout(() => this.processBuildQueue(), intervalMs);
  }

  enqueueBuild(build) {
    this.waitingBuilds.unshift(build);
  }
}

const queueHandler = new QueueHandler(storageSingletone);

module.exports = {
  QueueHandler,
  queueHandler,
};
