const path = require('path');
const fs = require('fs');

const React = require('react');
const express = require('express');
const ReactDOMServer = require('react-dom/server');
const { Provider } = require('react-redux');
const { ServerLocation } = require('@reach/router');
const { store } = require('../src/store/configureStore');
const App = require('../src/App.js').default;

const clientSSR = express.Router();
const pathToBuild = path.resolve(__dirname, '../build');

clientSSR.use('/static', express.static(pathToBuild));

clientSSR.get('/*', (req, res) => {
  const appCode = ReactDOMServer.renderToString(
    <Provider store={store}>
      <ServerLocation url={req.url}>
        <App />
      </ServerLocation>
    </Provider>,
  );

  const indexFile = path.resolve(pathToBuild, 'index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }

    return res.send(data.replace('<div id="root"></div>', `<div id="root">${appCode}</div>`));
  });
});

module.exports.clientSSR = clientSSR;
