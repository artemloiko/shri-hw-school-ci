import { createAction } from '../utils/createAction';
export const GET_SETTINGS_REQUEST = 'GET_SETTINGS_REQUEST';
export const GET_SETTINGS_SUCCESS = 'GET_SETTINGS_SUCCESS';
export const GET_SETTINGS_FAIL = 'GET_SETTINGS_FAIL';

const getSettingsRequest = () => {
  return createAction(GET_SETTINGS_REQUEST);
};

const getSettingsSuccess = (data) => {
  return createAction(GET_SETTINGS_SUCCESS, data);
};

const getSettingsFail = (error) => {
  return createAction(GET_SETTINGS_FAIL, error, true);
};

async function mockApi() {
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 1500);
  });
  return {
    id: 'edba260c-e190-48b6-8ff5-1fac2778f022',
    repoName: 'artuom130/isItReal',
    buildCommand: 'npm run build',
    mainBranch: 'master',
    period: 0,
  };
}

function fetchSettings() {
  return async (dispatch) => {
    dispatch(getSettingsRequest());
    try {
      const data = await mockApi();
      dispatch(getSettingsSuccess(data));
    } catch (error) {
      dispatch(getSettingsFail(error));
    }
  };
}

function shouldFetchSettings(state) {
  const { settings } = state;
  if (!settings.id) {
    return true;
  }
  return false;
}

export function fetchSettingsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchSettings(getState())) {
      dispatch(fetchSettings());
    }
  };
}
