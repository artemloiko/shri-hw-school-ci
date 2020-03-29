import { combineReducers } from 'redux';
import { buildsDetailsReducer } from './buildsDetails';
import { buildsReducer } from './builds';
import { settingsReducer } from './settings';
export const rootReducer = combineReducers({
  builds: buildsReducer,
  settings: settingsReducer,
  buildsDetails: buildsDetailsReducer,
});
