import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mocked } from 'ts-jest/utils';
import { getBuildDetails } from '../../actions/BuildsDetailsAction';
import apiMock from '../../utils/api';
import { BuildModel } from 'typings';

jest.mock('../../utils/api');

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

describe('builds details actions', () => {
  test('fetching builds details success', async () => {
    const store = mockStore(initialState);
    const details: BuildModel = {
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
    mocked(apiMock.getBuildDetails).mockImplementationOnce(() => Promise.resolve(details));
    mocked(apiMock.getBuildLog).mockImplementationOnce(() => Promise.resolve(logs));

    await store.dispatch<any>(getBuildDetails(buildId));

    expect(store.getActions()).toMatchSnapshot();
  });

  test('fetching builds details fail', async () => {
    const store = mockStore(initialState);
    const error = {
      message: 'Request failed with status code 500',
    };
    mocked(apiMock.getBuildDetails).mockImplementationOnce(() => Promise.reject(error));
    mocked(apiMock.getBuildLog).mockImplementationOnce(() => Promise.reject(error));

    await store.dispatch<any>(getBuildDetails(buildId));

    expect(store.getActions()).toMatchSnapshot();
  });
});
