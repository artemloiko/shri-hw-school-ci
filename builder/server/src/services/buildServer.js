const uuidv4 = require('uuid').v4;
const axios = require('axios');
const fse = require('fs-extra');
const logger = require('../utils/logger');

async function saveAgentsToFile(agents) {
  try {
    await fse.ensureFile('./temp/agents.json');
  } catch (err) {
    await fse.mkdir('./temp');
  }
  return fse.writeJSON('./temp/agents.json', agents);
}

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
    if (res.status === 201) this.currentBuild = buildDTO;

    return res;
  }

  async check() {
    return axios.get(`http://${this.host}:${this.port}/build`);
  }

  clear() {
    this.isBuilding = false;
    this.currentBuild = null;
  }
}

class BuildServer {
  constructor(agents = []) {
    this.agents = agents;
  }

  async addNewAgent(port, host) {
    const savedAgent = this.getAgentByPortHost(port, host);
    if (savedAgent) return savedAgent.id;
    const agentId = uuidv4();
    const newAgent = new BuildAgent(agentId, port, host);

    this.agents = this.agents.concat(newAgent);
    await saveAgentsToFile(this.agents);

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

  async deleteAgent(agentId) {
    this.agents = this.agents.filter((agent) => agent.id !== agentId);
    await saveAgentsToFile(this.agents);
  }
}

let savedAgents = [];
try {
  savedAgents = JSON.parse(fse.readFileSync('./temp/agents.json', 'utf-8'));
} catch (error) {
  fse.ensureDirSync('./temp');
  fse.writeJSONSync('./temp/agents.json', []);
}
const restoredAgents = savedAgents.map(({ id, port, host }) => new BuildAgent(id, port, host));
if (restoredAgents.length) {
  logger.info(
    '[RESTORED AGENTS]',
    restoredAgents.map((agent) => agent.port),
  );
}

const buildServer = new BuildServer(restoredAgents);

module.exports = {
  BuildServer,
  BuildAgent,
  buildServer,
};
