const express = require('express');
const path = require('path');
const apiRoutes = require('./api');

const init = server => {
  server.use(express.static(path.resolve(__dirname, '../../build')));

  server.use('/api', apiRoutes);

  server.get('/*', (req, res) => {
    const pathToFile = path.resolve(__dirname, '../../build/404.html');
    res.status(404);
    return res.sendFile(pathToFile);
  });
};

module.exports = {
  init: init,
};
