const uuidv4 = require('uuid').v4;
const axios = require('axios');

class BuildAgent {
  constructor(id, port, host = '127.0.0.1', buildDTO) {
    this.id = id;
    this.port = port;
    this.host = host;
    this.isBuilding = !!buildDTO || false;
    this.currentBuild = buildDTO || null;
  }

  async build(buildDTO) {
    const res = await axios.post(`http://${this.host}:${this.port}/build`, buildDTO);
    this.isBuilding = true;
    if (res.status === 200) this.currentBuild = buildDTO;

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

  addNewAgent(port, host, buildDTO) {
    const savedAgent = this.getAgentByPortHost(port, host);
    if (savedAgent) return savedAgent.id;
    const agentId = uuidv4();
    const newAgent = new BuildAgent(agentId, port, host, buildDTO);

    this.agents = this.agents.concat(newAgent);

    return agentId;
  }

  getFreeAgent() {
    return this.agents.find((agent) => !agent.isBuilding);
  }

  getAgentByPortHost(port, host) {
    return this.agents.find((agent) => agent.port === port && agent.host === host);
  }

  getAgentById(agentId) {
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
