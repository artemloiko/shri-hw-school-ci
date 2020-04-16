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
    logger.info('[ADD NEW AGENT]', `${hostname}:${port}`);
    const agentId = buildServer.addNewAgent(port, hostname);
    res.type('text/plain').send(agentId);
  });

  server.post('/notify-build-result', async (req, res) => {
    const { agentId, data } = req.body;
    const agent = buildServer.getAgent(agentId);

    if (!agent) {
      res.status(403).end();
      logger.warn('[FORBIDDEN AGENT]', agentId);
      return;
    }

    try {
      await queueHandler.saveBuildFinish(data);
    } catch (e) {
      logger.warn('[ENQUEUE BUILD AGAIN]', agentId);
      queueHandler.enqueueBuild(agent.currentBuild);
    }
    agent.clear();
  });

  queueHandler.init();
  server.listen(config.port, () => console.log(`Server listening on port ${config.port}!`));
}

bootstrap();
