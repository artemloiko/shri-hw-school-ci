import { initialState, settingsReducer } from '../../reducers/settings';
import {
  GET_SETTINGS_REQUEST,
  GET_SETTINGS_FAIL,
  GET_SETTINGS_SUCCESS,
  SET_SETTINGS,
  SET_SETTINGS_FAIL,
  RESET_SETTINGS_ERROR,
} from '../../actions/SettingsAction';

describe('settings reducer', () => {
  test('should return initial state', () => {
    expect(settingsReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle GET_SETTINGS_REQUEST', () => {
    const stateBefore = {
      isLoaded: false,
      isFetching: false,
    };
    const action = {
      type: GET_SETTINGS_REQUEST,
    };
    const expected = {
      isLoaded: false,
      isFetching: true,
    };

    expect(settingsReducer(stateBefore, action)).toEqual(expected);
  });

  test('should handle GET_SETTINGS_SUCCESS', () => {
    const data = {
      id: 'c42db8b8-128a-4194-a19b-7974cabccf4f',
      repoName: 'artuom130/shri-hw-async',
      buildCommand: 'npm run build',
      mainBranch: 'master',
      period: 0,
    };
    const stateBefore = {
      isLoaded: false,
      isFetching: true,
    };
    const action = {
      type: GET_SETTINGS_SUCCESS,
      payload: data,
    };
    const expected = {
      ...data,
      isLoaded: true,
      isFetching: false,
    };

    expect(settingsReducer(stateBefore, action)).toEqual(expected);
  });

  test('should handle GET_SETTINGS_FAIL', () => {
    const stateBefore = {
      isLoaded: false,
      isFetching: true,
    };
    const action = {
      type: GET_SETTINGS_FAIL,
      payload: 'Internal server error',
    };
    const expected = {
      isLoaded: true,
      isFetching: false,
      error: 'Internal server error',
    };

    expect(settingsReducer(stateBefore, action)).toEqual(expected);
  });

  test('should handle SET_SETTINGS', () => {
    const data = {
      repoName: 'artuom130/itItReal',
      buildCommand: 'npm run build',
      mainBranch: 'master',
      period: 0,
    };
    const stateBefore = {
      isLoaded: true,
      isFetching: false,
    };
    const action = {
      type: SET_SETTINGS,
      payload: data,
    };
    const expected = {
      ...data,
      isLoaded: true,
      isFetching: false,
    };

    expect(settingsReducer(stateBefore, action)).toEqual(expected);
  });

  test('should handle SET_SETTINGS_FAIL', () => {
    const error = {
      message: 'Cannot find artuom130/shri-hw-asyncs repository',
      errorCode: 'GIT_CANNOT_FIND_REPO',
    };
    const stateBefore = {
      isLoaded: true,
      isFetching: false,
    };
    const action = {
      type: SET_SETTINGS_FAIL,
      payload: error,
    };
    const expected = {
      isLoaded: true,
      isFetching: false,
      error,
    };

    expect(settingsReducer(stateBefore, action)).toEqual(expected);
  });

  test('should handle RESET_SETTINGS_ERROR', () => {
    const stateBefore = {
      isLoaded: true,
      isFetching: false,
      error: {
        message: 'Cannot find artuom130/shri-hw-asyncs repository',
        errorCode: 'GIT_CANNOT_FIND_REPO',
      },
    };
    const action = {
      type: RESET_SETTINGS_ERROR,
    };
    const expected = {
      isLoaded: true,
      isFetching: false,
      error: undefined,
    };

    expect(settingsReducer(stateBefore, action)).toEqual(expected);
  });
});
