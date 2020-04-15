const express = require('express');
const config = require('./server-conf.json');

const configError = !config.port || !config.apiToken || !config.apiBaseUrl;
if (configError) {
  throw new Error("⚠️  Couldn't find required fields (port, apiToken, apiBaseUrl)  ⚠️");
}

async function bootstrap() {
  const server = express();

  server.listen(config.port, () => console.log(`Server listening on port ${config.port}!`));
}

bootstrap();
