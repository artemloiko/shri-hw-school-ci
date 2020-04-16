const uuidv4 = require('uuid').v4;
const axios = require('axios');

class BuildAgent {
  constructor(id, port, host = '127.0.0.1') {
    this.id = id;
    this.port = port;
    this.host = host;
    this.isBuilding = false;
    this.currentBuild = null;
  }

  async build(buildDTO) {
    const res = await axios.post(`http://${this.host}:${this.port}/build`, buildDTO);
    this.isBuilding = true;
    this.currentBuild = buildDTO;

    return res;
  }

  async check() {
    return axios.get(`${this.host}:${this.port}/build`);
  }

  clear() {
    this.isBuilding = false;
    this.currentBuild = null;
  }
}

class BuildServer {
  constructor() {
    this.agents = [];
  }

  addNewAgent(port, host) {
    const agentId = uuidv4();
    const newAgent = new BuildAgent(agentId, port, host);
    this.agents = this.agents.concat(newAgent);

    return agentId;
  }

  getFreeAgent() {
    return this.agents.find((agent) => !agent.isBuilding);
  }

  getAgent(agentId) {
    return this.agents.find((agent) => agent.id === agentId);
  }

  deleteAgent(agentId) {
    this.agents = this.agents.filter((agent) => agent.id !== agentId);
  }
}

const buildServer = new BuildServer();

module.exports = {
  BuildServer,
  BuildAgent,
  buildServer,
};
