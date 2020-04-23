import { Express, NextFunction, Request, Response } from 'express';
import apiRoutes from './api';
import { HttpError } from 'src/utils/customErrors';
// eslint-disable-next-line node/no-unpublished-require
const { clientSSR } = require('../../../client/server/index.js');

const init = (server: Express): void => {
  server.use('/api', apiRoutes);

  if (process.env.NODE_ENV === 'production') {
    server.use(clientSSR);
  }

  // eslint-disable-next-line no-unused-vars
  server.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message,
        errorCode: err.errorCode ? err.errorCode : 'INTERNAL_SERVER_ERROR',
      },
    });
  });
};

const routes = {
  init,
};

export default routes;
