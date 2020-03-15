const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const config = require('./src/config');
const routes = require('./src/routes');

async function bootstrap() {
  const server = express();

  server.use(bodyParser.json());
  server.use(morgan('dev'));
  routes.init(server);

  server.listen(config.port, () => console.log(`Server listening on port ${config.port}!`));
}

bootstrap();
