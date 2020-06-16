import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mocked } from 'ts-jest/utils';
import {
  fetchBuildsListIfNeeded,
  updateBuildsList,
  fetchMoreBuilds,
} from '../../actions/BuildsAction';
import apiMock from '../../utils/api';
import { RootState } from 'redux/modules/root';
import { BuildModel } from 'typings';

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

describe('builds actions', () => {
  test('fetching builds list success', async () => {
    const store = mockStore(initialState);
    const data: BuildModel[] = [
      {
        id: '7e6a4f9b-fb65-489d-ad96-566f177f3479',
        configurationId: '2906e339-bc49-4e86-9e44-eda86bf0a971',
        buildNumber: 3,
        commitMessage: 'Add option to work with async fn',
        commitHash: 'a63f2b3',
        branchName: 'master',
        authorName: 'Artem Loiko',
        status: 'Success',
        start: '2020-04-10T06:58:06.766',
        duration: 4549,
      },
      {
        id: 'ba77d958-3ae8-4087-84be-8b1af5451e00',
        configurationId: '2906e339-bc49-4e86-9e44-eda86bf0a971',
        buildNumber: 2,
        commitMessage: 'Add option to work with async fn',
        commitHash: 'a63f2b3',
        branchName: 'master',
        authorName: 'Artem Loiko',
        status: 'Success',
        start: '2020-04-09T15:51:08.548',
        duration: 518,
      },
    ];
    mocked(apiMock.getBuildsList).mockImplementationOnce(() => Promise.resolve(data));

    await store.dispatch<any>(fetchBuildsListIfNeeded());

    expect(store.getActions()).toMatchSnapshot();
  });

  test('fetching builds list fail', async () => {
    const store = mockStore(initialState);
    const error = { message: 'Internal server error' };
    mocked(apiMock.getBuildsList).mockImplementationOnce(() => Promise.reject(error));

    await store.dispatch<any>(fetchBuildsListIfNeeded());

    expect(store.getActions()).toMatchSnapshot();
  });

  test('fetching more builds success', async () => {
    const store = mockStore({
      ...initialState,
      ...{
        builds: {
          isLoaded: true,
          isFetching: false,
          isFetchingMore: false,
          isFullListLoaded: false,
          buildsList: new Array(25), // empty array to simulate some loaded data
        },
      },
    });
    const data: BuildModel[] = [
      {
        id: 'e59f7715-8da8-4e46-9312-bcba770d2c0f',
        configurationId: '2906e339-bc49-4e86-9e44-eda86bf0a971',
        buildNumber: 1,
        commitMessage: 'Add option to work with async fn',
        commitHash: 'a63f2b3',
        branchName: 'master',
        authorName: 'Artem Loiko',
        status: 'Success',
        start: '2020-04-09T15:45:58.471',
        duration: 4934,
      },
    ];
    mocked(apiMock.getBuildsList).mockImplementationOnce(() => Promise.resolve(data));

    await store.dispatch<any>(fetchMoreBuilds());

    expect(store.getActions()).toMatchSnapshot();
  });

  test('update builds list', () => {
    const store = mockStore(initialState);
    const data: BuildModel = {
      id: 'b6eef618-014a-45da-a3a6-3c05851f65bc',
      configurationId: '2906e339-bc49-4e86-9e44-eda86bf0a971',
      buildNumber: 4,
      commitMessage: 'Add option to work with async fn',
      commitHash: 'a63f2b3',
      branchName: 'master',
      authorName: 'Artem Loiko',
      status: 'Waiting',
    };

    store.dispatch<any>(updateBuildsList(data));

    expect(store.getActions()).toMatchSnapshot();
  });
});
