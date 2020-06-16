import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mocked } from 'ts-jest/utils';
import {
  getSettingsRequest,
  updateSettings,
  updateSettingsFail,
  resetSettingsError,
} from '../../redux/modules/settings';
import apiMock from '../../utils/api';
import { RootState } from 'redux/modules/root';

jest.mock('../../utils/api');

const middlewares = [thunk];
const mockStore = configureMockStore<RootState>(middlewares);
const initialState: RootState = {
  settings: {
    isFetching: false,
    isLoaded: false,
  },
  builds: {
    isFetching: false,
    isLoaded: false,
    isFetchingMore: false,
    isFullListLoaded: false,
    buildsList: [],
  },
  buildsDetails: {},
};

describe('settings actions', () => {
  test('fetching settings success', async () => {
    const store = mockStore(initialState);
    const data = {
      id: 'c42db8b8-128a-4194-a19b-7974cabccf4f',
      repoName: 'artuom130/shri-hw-async',
      buildCommand: 'npm run build',
      mainBranch: 'master',
      period: 0,
    };
    mocked(apiMock.getSettings).mockImplementationOnce(() => Promise.resolve(data));

    await store.dispatch<any>(getSettingsRequest());

    expect(store.getActions()).toMatchSnapshot();
  });
  test('fetching settings fail', async () => {
    const store = mockStore(initialState);
    const error = { message: 'Internal server error' };
    mocked(apiMock.getSettings).mockImplementationOnce(() => Promise.reject(error));

    await store.dispatch<any>(getSettingsRequest());

    expect(store.getActions()).toMatchSnapshot();
  });
  test('update settings', () => {
    const store = mockStore(initialState);
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
    const store = mockStore(initialState);
    const error = {
      message: 'Cannot find artuom130/shri-hw-asyncs repository',
      errorCode: 'GIT_CANNOT_FIND_REPO',
    };

    store.dispatch(updateSettingsFail(error.message));

    expect(store.getActions()).toMatchSnapshot();
  });
  test('reset settings error', () => {
    const store = mockStore(initialState);
    store.dispatch(resetSettingsError());

    expect(store.getActions()).toMatchSnapshot();
  });
});
