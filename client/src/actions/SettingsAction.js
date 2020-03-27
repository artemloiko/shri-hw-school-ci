import api from '../utils/api';
import { createAction } from '../utils/createAction';
export const GET_SETTINGS_REQUEST = 'GET_SETTINGS_REQUEST';
export const GET_SETTINGS_SUCCESS = 'GET_SETTINGS_SUCCESS';
export const GET_SETTINGS_FAIL = 'GET_SETTINGS_FAIL';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';

const getSettingsRequest = () => {
  return createAction(GET_SETTINGS_REQUEST);
};

const getSettingsSuccess = (data) => {
  return createAction(GET_SETTINGS_SUCCESS, data);
};

const getSettingsFail = (error) => {
  return createAction(GET_SETTINGS_FAIL, error, true);
};

function fetchSettings() {
  return async (dispatch) => {
    dispatch(getSettingsRequest());
    try {
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 2500);
      });
      const data = await api.getSettings();
      dispatch(getSettingsSuccess(data));
    } catch (error) {
      dispatch(getSettingsFail(error.message));
    }
  };
}

function shouldFetchSettings(state) {
  const { settings } = state;
  if (settings.isFetching) {
    return false;
  }
  if (!settings.isLoaded) {
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

export function updateSettings(settingsDTO) {
  return createAction(UPDATE_SETTINGS, settingsDTO);
}
