/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { ActionsObservable, StateObservable } from 'redux-observable';
import { Subject, of } from 'rxjs';
import { toArray, delay, concatMap } from 'rxjs/operators';
import {
  getSettingsRequest,
  setSettings,
  settingsEpic,
  setSettingsEpic,
  GET_SETTINGS_SUCCESS,
  GET_SETTINGS_FAIL,
  SET_SETTINGS_SUCCESS,
  SET_SETTINGS_FAIL,
} from '../../redux/modules/settings';
import { RootState } from 'redux/modules/root';
import { createStore } from 'redux/createStore';

const initialState: RootState = createStore().getState();

const settingsToSave = {
  repoName: 'artuom130/itItReal',
  buildCommand: 'npm run build',
  mainBranch: 'master',
  period: 0,
};

const fetchedSettings = {
  id: 'c42db8b8-128a-4194-a19b-7974cabccf4f',
  repoName: 'artuom130/shri-hw-async',
  buildCommand: 'npm run build',
  mainBranch: 'master',
  period: 0,
};

describe('Fetch settings epic (settingsEpic)', () => {
  let state$ = new StateObservable<RootState>(new Subject(), initialState);
  const api = {
    getSettings: jest.fn(),
    setSettings: jest.fn(),
  };

  beforeEach(() => {
    state$ = new StateObservable<RootState>(new Subject(), initialState);
    api.getSettings.mockReset();
    api.setSettings.mockReset();
  });

  test('should dispatch data when fetch is succeed', async () => {
    api.getSettings.mockResolvedValueOnce(fetchedSettings);
    const action$ = ActionsObservable.of(getSettingsRequest());

    // @ts-ignore
    const epic$ = settingsEpic(action$, state$, { api });
    const result = await epic$.pipe(toArray()).toPromise();

    const expectedActions = [
      {
        type: GET_SETTINGS_SUCCESS,
        payload: fetchedSettings,
      },
    ];
    expect(result).toEqual(expectedActions);
  });

  test('should dispatch an error when cannot fetch settings', async () => {
    const errorMessage = 'Internal server error';
    api.getSettings.mockRejectedValueOnce(new Error(errorMessage));
    const action$ = ActionsObservable.of(getSettingsRequest());

    // @ts-ignore
    const epic$ = settingsEpic(action$, state$, { api });
    const result = await epic$.pipe(toArray()).toPromise();

    const expectedActions = [
      {
        type: GET_SETTINGS_FAIL,
        payload: errorMessage,
        error: true,
      },
    ];
    expect(result).toEqual(expectedActions);
  });

  test('should dispatch updated settings when settings saving is succeed', async () => {
    api.setSettings.mockResolvedValueOnce(settingsToSave);
    const action$ = ActionsObservable.of(setSettings(settingsToSave, () => {}));

    // @ts-ignore
    const epic$ = setSettingsEpic(action$, state$, { api });
    const result = await epic$.pipe(toArray()).toPromise();

    const expectedActions = [
      {
        type: SET_SETTINGS_SUCCESS,
        payload: settingsToSave,
      },
    ];
    expect(result).toEqual(expectedActions);
  });

  test('should dispatch an error with errorCode when settings saving is failed', async () => {
    const error: any = new Error('Update settings error');
    error.response = {
      data: {
        error: {
          errorCode: 'GIT_CANNOT_FIND_REPO',
          message: 'Cannot find specified repository',
        },
      },
    };
    api.setSettings.mockRejectedValueOnce(error);
    const action$ = ActionsObservable.of(setSettings(settingsToSave, () => {}));

    // @ts-ignore
    const epic$ = setSettingsEpic(action$, state$, { api });
    const result = await epic$.pipe(toArray()).toPromise();

    const expectedActions = [
      {
        type: SET_SETTINGS_FAIL,
        payload: 'GIT_CANNOT_FIND_REPO',
        error: true,
      },
    ];
    expect(result).toEqual(expectedActions);
  });

  test('should call callback passed in action meta with result of settings saving', async () => {
    api.setSettings.mockResolvedValueOnce(settingsToSave);
    api.setSettings.mockRejectedValueOnce(new Error('Cannot save errors'));

    const callback = jest.fn();
    const action$ = ActionsObservable.of(
      setSettings(settingsToSave, callback),
      setSettings(settingsToSave, callback),
    ).pipe(concatMap((action) => of(action).pipe(delay(1))));
    // concatMap with delay is used to get around switch map

    // @ts-ignore
    const epic$ = setSettingsEpic(action$, state$, { api });
    await epic$.pipe(toArray()).toPromise();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(1, true);
    expect(callback).toHaveBeenNthCalledWith(2, false);
  });
});
