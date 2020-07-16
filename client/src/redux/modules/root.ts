import { combineReducers } from 'redux';
import { combineEpics, ActionsObservable, StateObservable } from 'redux-observable';
import { buildsDetailsReducer } from '../../reducers/buildsDetails';
import { buildsReducer } from '../../reducers/builds';
import settingsReducer, { settingsEpic, SettingsActions, setSettingsEpic } from './settings';
import { EpicDependencies } from 'redux/createStore';
import { catchError } from 'rxjs/operators';

export const rootReducer = combineReducers({
  builds: buildsReducer,
  settings: settingsReducer,
  buildsDetails: buildsDetailsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type RootAction = SettingsActions;

export const rootEpic = (
  action$: ActionsObservable<RootAction>,
  state$: StateObservable<RootState>,
  dependencies: EpicDependencies,
) =>
  combineEpics(settingsEpic, setSettingsEpic)(action$, state$, dependencies).pipe(
    catchError((error, source) => {
      console.error('Epic error');
      console.dir(error);
      return source;
    }),
  );
