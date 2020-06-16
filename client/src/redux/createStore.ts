import { createStore as createReduxStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import { rootReducer, rootEpic, RootState, RootAction } from './modules/root';
import api, { StorageAPI } from '../utils/api';

export type EpicDependencies = { api: StorageAPI };

const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, EpicDependencies>({
  dependencies: { api },
});

export const createStore = () => {
  const store = createReduxStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk, epicMiddleware)),
  );
  epicMiddleware.run(rootEpic);

  return store;
};
