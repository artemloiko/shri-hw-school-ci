const uuidv4 = require('uuid').v4;
const axios = require('axios');

class BuildAgent {
  constructor(port, host = 'http://127.0.0.1') {
    this.id = uuidv4();
    this.port = port;
    this.host = host;
    this.isBuilding = false;
    this.currentBuild = null;
  }

  async build(buildDTO) {
    const res = await axios.post(`${this.host}:${this.port}/build`, buildDTO);
    this.isBuilding = true;
    this.currentBuildId = buildDTO;

    return res;
  }

  async check() {
    return axios.get(`${this.host}:${this.port}/build`);
  }
}

class BuildServer {
  constructor() {
    this.agents = [];
    this.brokenBuilds = [];
  }

  addNewAgent(port, host) {
    this.agents = this.agents.concat(new BuildAgent(port, host));
  }

  getFreeAgent() {
    return this.agents.find((agent) => !agent.isBuilding);
  }

  deleteAgent(agentId) {
    this.agents = this.agents.filter((agent) => agent.id === agentId);
  }
}

const buildServer = new BuildServer();

module.exports = {
  BuildServer,
  BuildAgent,
  buildServer,
};
