import path from 'path';
import fs from 'fs';
import express from 'express';
// import { renderClientToString } from '../../../client/server';

const clientSSR = express.Router();
const pathToBuild = path.resolve(__dirname, '../../../client/build');

clientSSR.use('/static', express.static(pathToBuild));

clientSSR.get('/*', (req, res) => {
  // const appCode = renderClientToString(req.url);
  const appCode = '';

  const indexFile = path.resolve(pathToBuild, 'index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }

    return res.send(data.replace('<div id="root"></div>', `<div id="root">${appCode}</div>`));
  });
});

export default clientSSR;
