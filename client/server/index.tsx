import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { ServerLocation } from '@reach/router';
import { store } from '../src/store/configureStore';
import App from '../src/App';

function renderClientToString(url: string) {
  return ReactDOMServer.renderToString(
    <Provider store={store}>
      <ServerLocation url={url}>
        <App />
      </ServerLocation>
    </Provider>,
  );
}

export { renderClientToString };
