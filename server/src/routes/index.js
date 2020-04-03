const apiRoutes = require('./api');
// eslint-disable-next-line node/no-unpublished-require
const { clientSSR } = require('../../../client/server/index.js');

const init = (server) => {
  server.use('/api', apiRoutes);

  if (process.env.NODE_ENV === 'production') {
    server.use(clientSSR);
  }

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
