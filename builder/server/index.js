const express = require('express');
const config = require('./src/config');

async function bootstrap() {
  const server = express();

  server.listen(config.port, () => console.log(`Server listening on port ${config.port}!`));
}

bootstrap();
