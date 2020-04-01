import api from '../utils/api';
import { createAction } from '../utils/createAction';
export const GET_SETTINGS_REQUEST = 'GET_SETTINGS_REQUEST';
export const GET_SETTINGS_SUCCESS = 'GET_SETTINGS_SUCCESS';
export const GET_SETTINGS_FAIL = 'GET_SETTINGS_FAIL';
export const SET_SETTINGS = 'SET_SETTINGS';
export const SET_SETTINGS_FAIL = 'SET_SETTINGS_FAIL';
export const RESET_SETTINGS_ERROR = 'RESET_SETTINGS_ERROR';

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
      const data = await api.getSettings();
      dispatch(getSettingsSuccess(data));
    } catch (error) {
      dispatch(getSettingsFail(error.message));
    }
  };
}

function shouldFetchSettings(state) {
  const { settings } = state;

  if (settings?.isFetching || settings?.isLoaded) {
    return false;
  }

  return true;
}

export function fetchSettingsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchSettings(getState())) {
      dispatch(fetchSettings());
    }
  };
}

export function updateSettings(settingsDTO) {
  return createAction(SET_SETTINGS, settingsDTO);
}

export function updateSettingsFail(error) {
  return createAction(SET_SETTINGS_FAIL, error);
}

export function resetSettingsError() {
  return createAction(RESET_SETTINGS_ERROR);
}
