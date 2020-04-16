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

  async registerAgent(buildDTO) {
    logger.info('[REGISTER AGENT]');

    try {
      const { data: agentId } = await axios.post(`${this.serverUrl}/notify-agent`, {
        port: this.agentPort,
        buildDTO,
      });
      this.agentId = agentId;
      logger.info('[REGISTERED]', agentId);
    } catch (e) {
      const errMessage = `${e.message}.\nServer ${this.serverUrl} is down. Please check build server`;
      throw new Error(errMessage);
    }
  }

  async startBuild(buildDTO) {
    logger.info('[START BUILD]', buildDTO.buildId);
    this.isBuilding = true;
    this.buildDTO = buildDTO;

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
    } catch (e) {
      const { response } = e;

      if (response.status === 403) {
        logger.warn('Server was down. Recconect to server');
        await this.registerAgent(this.buildDTO);
        await this.saveBuild();
        return;
      }
    }

    logger.info('[SAVED BUILD]', this.buildResult.buildId);
    this.buildResult = null;
    this.buildDTO = null;
    this.isBuilding = false;
  }
}

module.exports = {
  BuilderService,
};
