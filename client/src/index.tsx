import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';
import ErrorBoundary from 'components/common/ErrorBoundary/ErrorBoundary';
import { store } from './store/configureStore';
import * as serviceWorker from './serviceWorker';

import App from './App';

import './index.css';
import { subscribe } from 'notifications';
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const mount = isDev ? ReactDOM.render : ReactDOM.hydrate;

mount(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
if (isProd || process.env.REACT_APP_SW_DEVELOPMENT === 'true') {
  serviceWorker.register();
} else {
  serviceWorker.unregister();
}
// notifications
subscribe();
