const express = require('express');
const path = require('path');
const apiRoutes = require('./api');

const init = (server) => {
  server.use(express.static(path.resolve(__dirname, '../../../client/build')));

  server.use('/api', apiRoutes);

  server.get('/*', (req, res) => {
    const pathToFile = path.resolve(__dirname, '../../../client/build/404.html');
    res.status(404);
    return res.sendFile(pathToFile);
  });

  // eslint-disable-next-line no-unused-vars
  server.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message,
        errorCode: err.errorCode ? err.errorCode : 'INTERNAL_SERVER_ERROR',
      },
    });
  });
};

module.exports = {
  init,
};
