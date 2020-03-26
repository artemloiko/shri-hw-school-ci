const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const config = require('./src/config');
const routes = require('./src/routes');
const syncCommitsCron = require('./src/crones/sync-commits-cron');

async function bootstrap() {
  const server = express();
  const isProd = config.nodeEnv === 'production';

  server.use(bodyParser.json());
  server.use(morgan(isProd ? 'common' : 'dev'));
  routes.init(server);
  syncCommitsCron.init();

  server.listen(config.port, () => console.log(`Server listening on port ${config.port}!`));
}

bootstrap();
