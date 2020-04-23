import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import config from './src/config';
import routes from './src/routes';
import syncCommitsCron from './src/tasks/sync-commits-cron';
import buildQueueCron from './src/tasks/process-queue';

async function bootstrap(): Promise<void> {
  const server = express();
  const isProd = config.nodeEnv === 'production';

  server.use(bodyParser.json());
  server.use(morgan(isProd ? 'common' : 'dev'));
  routes.init(server);

  syncCommitsCron.init();
  buildQueueCron.init();

  server.listen(config.port, () => console.log(`Server listening on port ${config.port}!`));
}

bootstrap();
