const express = require('express');
const config = require('./src/config');
const logger = require('./src/utils/logger');
const { buildServer } = require('./src/services/buildServer');
const { queueHandler } = require('./src/services/queueHandler');

async function bootstrap() {
  const server = express();
  server.use(express.json());

  server.post('/notify-agent', async (req, res) => {
    const { port } = req.body;
    const { hostname } = req;
    const agentId = await buildServer.addNewAgent(port, hostname);
    logger.info(
      '[ADD NEW AGENT]',
      `${agentId.slice(0, 8)} - ${hostname}:${port}`,
      buildServer.agents.length,
    );
    res.type('text/plain').send(agentId);
    queueHandler.runQueueProcessing();
  });

  server.post('/notify-build-result', async (req, res) => {
    const { agentId, data } = req.body;
    const agent = buildServer.getAgentById(agentId);

    if (!agent) {
      res.status(403).end();
      logger.warn('[FORBIDDEN AGENT]', agentId);
      return;
    }

    try {
      await queueHandler.saveBuildFinish(data);
      logger.success('[SAVED BUILD]', data.buildId);
    } catch (e) {
      logger.warn('[ENQUEUE BUILD AGAIN]', agent.currentBuild.buildId);
      queueHandler.enqueueBuild(agent.currentBuild);
    }
    agent.clear();
    res.end();
    queueHandler.runQueueProcessing();
  });

  server.listen(config.port, () => console.log(`Server listening on port ${config.port}!`));
  queueHandler.init();
}

bootstrap();
