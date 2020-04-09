import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  fetchSettingsIfNeeded,
  updateSettings,
  updateSettingsFail,
  resetSettingsError,
} from '../../actions/SettingsAction';
import apiMock from '../../utils/api';

jest.mock('../../utils/api.js');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const initialState = {
  isFetching: false,
  isLoaded: false,
};
let store = null;

describe('settings actions', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });
  afterEach(() => {
    store = null;
  });

  test('fetching settings success', async () => {
    const data = {
      id: 'c42db8b8-128a-4194-a19b-7974cabccf4f',
      repoName: 'artuom130/shri-hw-async',
      buildCommand: 'npm run build',
      mainBranch: 'master',
      period: 0,
    };
    apiMock.getSettings.mockImplementationOnce(() => Promise.resolve(data));

    await store.dispatch(fetchSettingsIfNeeded());

    expect(store.getActions()).toMatchSnapshot();
  });
  test('fetching settings fail', async () => {
    const error = { message: 'Internal server error' };
    apiMock.getSettings.mockImplementationOnce(() => Promise.reject(error));

    await store.dispatch(fetchSettingsIfNeeded());

    expect(store.getActions()).toMatchSnapshot();
  });
  test('update settings', () => {
    const data = {
      repoName: 'artuom130/itItReal',
      buildCommand: 'npm run build',
      mainBranch: 'master',
      period: 0,
    };

    store.dispatch(updateSettings(data));

    expect(store.getActions()).toMatchSnapshot();
  });
  test('update settings error', () => {
    const error = {
      message: 'Cannot find artuom130/shri-hw-asyncs repository',
      errorCode: 'GIT_CANNOT_FIND_REPO',
    };

    store.dispatch(updateSettingsFail(error));

    expect(store.getActions()).toMatchSnapshot();
  });
  test('reset settings error', () => {
    store.dispatch(resetSettingsError());

    expect(store.getActions()).toMatchSnapshot();
  });
});
