const axios = require('axios');
const logger = require('../utils/logger');
const { builder } = require('../../builder');

class BuilderService {
  constructor(serverUrl, port) {
    this.serverUrl = serverUrl;
    this.agentPort = port;
    this.agentId = null;
    this.isBuilding = false;
    this.buildResult = null;
  }

  async init() {
    return this.registerAgent();
  }

  async registerAgent(attemptToRegister = 1) {
    logger.info('[REGISTER AGENT]');

    try {
      const { data: agentId } = await axios.post(`${this.serverUrl}/notify-agent`, {
        port: this.agentPort,
      });
      this.agentId = agentId;
      logger.info('[REGISTERED]', agentId);
    } catch (e) {
      setTimeout(() => {
        if (attemptToRegister === 15) {
          const errMessage = `${e.message}.\nServer ${this.serverUrl} is down. Please check build server\n`;
          logger.error('[SERVER IS NOT RESPONDING]', errMessage);
          // eslint-disable-next-line no-process-exit
          process.exit(-1);
        }
        logger.warn('[SERVER IS NOT AVAILABLE]', `try again in ${attemptToRegister} seconds`);

        this.registerAgent(attemptToRegister * 4);
      }, attemptToRegister * 1000);
    }
  }

  async startBuild(buildDTO) {
    logger.info('[START BUILD]', buildDTO.buildId);
    this.isBuilding = true;

    const { buildId } = buildDTO;
    const { duration, success, buildLog } = await builder(buildDTO);

    this.buildResult = { buildId, duration, success, buildLog };
    this.saveBuild();
  }

  async saveBuild() {
    try {
      await axios.post(`${this.serverUrl}/notify-build-result`, {
        agentId: this.agentId,
        data: this.buildResult,
      });
      logger.info('[SAVED BUILD]', this.buildResult.buildId);
    } catch (e) {
      const { response } = e;

      logger.warn('[RECONNECT] Server is down. Recconect to server');
      if (response && response.status === 403) {
        this.buildResult = null;
        this.isBuilding = false;
      }

      await this.registerAgent();
      return;
    }

    this.buildResult = null;
    this.isBuilding = false;
  }
}

module.exports = {
  BuilderService,
};
