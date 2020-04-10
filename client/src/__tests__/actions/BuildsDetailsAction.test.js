import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getBuildDetails } from '../../actions/BuildsDetailsAction';
import apiMock from '../../utils/api';

jest.mock('../../utils/api.js');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const buildId = '30c10a6a-087e-4a6b-aed8-8a809169a305';
const initialState = {
  builds: {},
  buildsDetails: {
    [buildId]: {
      details: { isFetching: false, isLoaded: false },
      logs: { isFetching: false, isLoaded: false },
    },
  },
};
let store = null;

describe('builds details actions', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });
  afterEach(() => {
    store = null;
  });

  test('fetching builds details success', async () => {
    const details = {
      id: buildId,
      configurationId: 'e4a75284-3cbb-4676-8db6-4e3012958328',
      buildNumber: 1,
      commitMessage: 'Add option to work with async fn',
      commitHash: 'a63f2b3',
      branchName: 'master',
      authorName: 'Artem Loiko',
      status: 'Success',
      start: '2020-04-10T07:07:14.337',
      duration: 3254,
    };
    const logs = '\u001b[32mCompiled successfully.\u001b[39m\u001b[32m\u001b[39m';
    apiMock.getBuildDetails.mockImplementationOnce(() => Promise.resolve(details));
    apiMock.getBuildLog.mockImplementationOnce(() => Promise.resolve(logs));

    await store.dispatch(getBuildDetails(buildId));

    expect(store.getActions()).toMatchSnapshot();
  });

  test('fetching builds details fail', async () => {
    const error = {
      message: 'Request failed with status code 500',
    };
    apiMock.getBuildDetails.mockImplementationOnce(() => Promise.reject(error));
    apiMock.getBuildLog.mockImplementationOnce(() => Promise.reject(error));

    await store.dispatch(getBuildDetails(buildId));

    expect(store.getActions()).toMatchSnapshot();
  });
});
