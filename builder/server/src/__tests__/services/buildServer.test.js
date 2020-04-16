const axiosMock = require('axios');
const { BuildServer, BuildAgent } = require('../../services/buildServer');

jest.mock('axios');

describe('BuildAgent', () => {
  let buildAgent;
  const id = 'b5926e90-2319-4dbf-8c5d-64342b19a59a';
  const port = 4444;
  const host = '127.0.0.1';
  beforeEach(() => {
    buildAgent = new BuildAgent(id, port, host);
  });

  test('Should create agent with all required fields', () => {
    expect(buildAgent).toMatchObject({
      id,
      port,
      host,
      isBuilding: false,
      currentBuild: null,
    });
  });

  test('Build method should send data to endpoint POST host:port/build', async () => {
    const buildData = {
      buildId: '6f1a9539-e13b-43bd-bbc4-b2ce848fe315',
      commitHash: 'a63f2b3',
      repoName: 'artuom130/shri-hw-async',
      buildCommand: 'npm run build',
    };
    await buildAgent.build(buildData);

    expect(axiosMock.post).toHaveBeenCalledWith(`http://${host}:${port}/build`, buildData);
  });

  test('Build method should tie data to current agent', async () => {
    const buildData = {
      buildId: '6f1a9539-e13b-43bd-bbc4-b2ce848fe315',
      commitHash: 'a63f2b3',
      repoName: 'artuom130/shri-hw-async',
      buildCommand: 'npm run build',
    };
    await buildAgent.build(buildData);

    expect(buildAgent).toMatchObject({
      isBuilding: true,
      currentBuild: buildData,
    });
  });

  test('Clear method should untie data from current agent', async () => {
    const buildData = {
      buildId: '6f1a9539-e13b-43bd-bbc4-b2ce848fe315',
      commitHash: 'a63f2b3',
      repoName: 'artuom130/shri-hw-async',
      buildCommand: 'npm run build',
    };
    await buildAgent.build(buildData);
    buildAgent.clear();

    expect(buildAgent).toMatchObject({
      isBuilding: false,
      currentBuild: null,
    });
  });
});

describe('BuildServer', () => {
  let buildServer;
  beforeEach(async () => {
    buildServer = new BuildServer();
    await buildServer.addNewAgent(5050, '127.0.0.1');
    await buildServer.addNewAgent(5051, '127.0.0.1');
  });

  test('Method addNewAgent create and add agent to agents list', () => {
    expect(buildServer.agents[0]).toMatchObject({
      id: expect.anything(),
      port: 5050,
      host: '127.0.0.1',
    });
    expect(buildServer.agents).toHaveLength(2);
  });

  test('Method getFreeAgent returns agent which is not busy', () => {
    buildServer.agents[0].isBuilding = true;

    const freeAgent = buildServer.getFreeAgent();

    expect(freeAgent).toMatchObject({
      port: 5051,
      isBuilding: false,
      currentBuild: null,
    });
  });

  test('Method getAgentById returns agent by agentId', () => {
    const agent = buildServer.agents[0];

    const returnedAgent = buildServer.getAgentById(agent.id);

    expect(returnedAgent).toEqual(agent);
  });

  test('Method deleteAgent delete agent with agentId from agents list', () => {
    const agentToDelete = buildServer.agents[0].id;

    buildServer.deleteAgent(agentToDelete);

    expect(buildServer.agents).toHaveLength(1);
  });
});
