const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const routes = require('./routes');

async function bootstrap() {
  const server = express();

  server.use(bodyParser.json());
  routes.init(server);

  server.listen(config.port, () => console.log(`Server listening on port ${config.port}!`));
}

bootstrap();
