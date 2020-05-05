import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ErrorBoundary from 'components/common/ErrorBoundary/ErrorBoundary';
import { store } from './store/configureStore';
import * as serviceWorker from './serviceWorker';

import App from './App';

import './index.css';

const mount = process.env.NODE_ENV === 'development' ? ReactDOM.render : ReactDOM.hydrate;

mount(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
