import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from '../reducers';
import thunk from 'redux-thunk';

export const createAppStore = () =>
  createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export const store = createAppStore();
