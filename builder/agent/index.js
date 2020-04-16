const express = require('express');
const config = require('./src/config');
const logger = require('./src/utils/logger');
const { BuilderService } = require('./src/services/builderService');

async function bootstrap() {
  const server = express();
  server.use(express.json());

  const { serverHost, serverPort, port } = config;
  const serverUrl = `http://${serverHost}:${serverPort}`;

  const builderService = new BuilderService(serverUrl, port);
  await builderService.init();

  server.post('/build', (req, res) => {
    builderService.startBuild(req.body);
    res.end();
  });

  server.listen(config.port, () => console.log(`Server listening on port ${config.port}!`));
}

// bootstrap();
bootstrap().catch(logger.error);
