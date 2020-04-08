const path = require('path');

const rootPath = path.join(__dirname, '..', '..');

require('ignore-styles');
require('@babel/register')({
  root: rootPath,
  ignore: [/node_modules/],
});

const { clientSSR } = require('./server.js');

module.exports.clientSSR = clientSSR;
