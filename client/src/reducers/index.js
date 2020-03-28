import { combineReducers } from 'redux';
import { buildsReducer } from './builds';
import { settingsReducer } from './settings';
export const rootReducer = combineReducers({
  builds: buildsReducer,
  settings: settingsReducer,
});
