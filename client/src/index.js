import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ErrorBoundary from 'components/common/ErrorBoundary/ErrorBoundary';
import { store } from './store/configureStore';

import App from './App';

import './index.css';

ReactDOM.hydrate(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
);
