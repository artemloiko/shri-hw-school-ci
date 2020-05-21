const express = require('express');
const cors = require('cors');
const config = require('./src/config');
const logger = require('./src/utils/logger');
const { buildServer } = require('./src/services/buildServer');
const { queueHandler } = require('./src/services/queueHandler');
const { SubscriptionService } = require('./src/services/subscriptionService');
// Type 3: Persistent datastore with automatic loading
const Datastore = require('nedb');
const db = new Datastore({ filename: 'temp/db', autoload: true });
const subscriptionService = new SubscriptionService(db);

async function bootstrap() {
  const server = express();
  server.use(express.json({ limit: '10MB' }));
  server.use(cors());

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
      const pushData = {
        title: `Build ${data.buildId.slice(0, 8)} is ${data.success ? 'built' : 'failed'}`,
        body: data.buildLog.slice(0, 100),
        code: data.success ? 'BUILD_SUCCESS' : 'BUILD_FAIL',
        data: {
          buildId: data.buildId,
        },
      };
      subscriptionService.sendPushes(pushData);
    } catch (e) {
      logger.warn('[ENQUEUE BUILD AGAIN]', agent.currentBuild.buildId);
      queueHandler.enqueueBuild(agent.currentBuild);
    }
    agent.clear();
    res.end();
    queueHandler.runQueueProcessing();
  });

  server.post('/subscribe', async (req, res) => {
    return subscriptionService.saveSubscription(req, res);
  });

  server.get('/send', async (req, res) => {
    subscriptionService
      .sendPushes(
        '{"title":"Build is successful","body":"Built in 10 minutes", "code": "BUILD_SUCCESS"}',
      )
      .catch((err) => {
        logger.error('[CANNOT SEND PUSHES]', err);
      });
    return res.end();
  });

  server.listen(config.port, () => console.log(`Server listening on port ${config.port}!`));
  queueHandler.init();
}

bootstrap();
