const storageSingletone = require('../models/storage');
const logger = require('../utils/logger');
const { buildServer } = require('./buildServer');

const CHECK_QUEUE_INTERVAL = 60000;
const CHECK_AGENT_INTERVAL = 60000;

class QueueHandler {
  constructor(storage) {
    this.storage = storage;
    this.buildServer = buildServer;
    this.waitingBuilds = [];
    this.timerID = null;
    this.isQueueProsessing = false;
  }

  init() {
    this.checkAgents();
    this.runQueueProcessing();
  }

  runQueueProcessing() {
    // isQueueProsessing is added to prevent parallel recursions,
    // because runQueueProcessing can be called any time
    if (this.isQueueProsessing) return;
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
    this.processBuildQueue();
    this.isQueueProsessing = true;
  }

  async processBuildQueue() {
    if (!this.waitingBuilds.length) await this.updateWaitingBuilds();

    while (this.waitingBuilds.length) {
      const currentBuild = this.waitingBuilds[0];
      // eslint-disable-next-line no-await-in-loop
      const sent = await this.sendBuildToAgent(currentBuild);
      if (!sent) {
        logger.info('[NO FREE AGENTS FOUND]');
        break;
      }

      this.waitingBuilds.shift();
    }

    this.startQueueProcessingTimeout();
  }

  async updateWaitingBuilds() {
    try {
      const settings = await this.storage.getSettings();
      const builds = await this.getWaitingBuilds();
      // reverse changes sort to oldest -> newest
      const waitingBuilds = builds.reverse().map((build) => {
        const { id, commitHash } = build;
        const { repoName, buildCommand } = settings;

        return { buildId: id, commitHash, repoName, buildCommand };
      });
      logger.info('[UPDATE WAITING BUILDS]', waitingBuilds.length);
      this.waitingBuilds = waitingBuilds;
    } catch (e) {
      logger.error('[STORAGE ERROR] Please check storage!', e.message);
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
      logger.error('[AGENT BROKEN]', agent.id, agent.port, e.message);
      await this.buildServer.deleteAgent(agent.id);
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
      logger.error('[STORAGE ERROR] Please check storage!', e.message);
      throw e;
    }
  }

  async getWaitingBuilds(offset = 0) {
    const LIMIT = 50;

    const allBuilds = await this.storage.getBuildsList(offset, LIMIT);

    const startedBuilds = allBuilds.filter((build) => build.status === 'InProgress');
    const isBuildNotSentToAgent = ({ id }) => {
      const agentBuildingCurrentBuild = this.buildServer.agents.find(
        ({ currentBuild }) => currentBuild && currentBuild.buildId === id,
      );
      return !agentBuildingCurrentBuild;
    };
    const startedBuildsMissedInAgents = startedBuilds.filter(isBuildNotSentToAgent);

    let waitingBuilds = allBuilds.filter((build) => build.status === 'Waiting');
    if (waitingBuilds.length === LIMIT) {
      const nextPageWaitingBuilds = await this.getWaitingBuilds(offset + allBuilds.length);
      waitingBuilds = [...waitingBuilds, ...nextPageWaitingBuilds];
    }

    return [...waitingBuilds, ...startedBuildsMissedInAgents];
  }

  startQueueProcessingTimeout(interval = CHECK_QUEUE_INTERVAL) {
    this.isQueueProsessing = false;
    this.timerID = setTimeout(() => this.processBuildQueue(), interval);
  }

  enqueueBuild(build) {
    this.waitingBuilds.unshift(build);
  }

  async checkAgents() {
    logger.info('[CHECKING AGENTS]');
    await Promise.all(
      this.buildServer.agents.map(async (agent) => {
        try {
          await agent.check();
        } catch (e) {
          logger.error('[AGENT BROKEN]', agent.id, agent.port, e.message);
          if (agent.currentBuild) this.enqueueBuild(agent.currentBuild);
          this.buildServer.deleteAgent(agent.id);
          this.runQueueProcessing();
        }
      }),
    );
    setTimeout(() => this.checkAgents(), CHECK_AGENT_INTERVAL);
  }
}

const queueHandler = new QueueHandler(storageSingletone);

module.exports = {
  QueueHandler,
  queueHandler,
};
