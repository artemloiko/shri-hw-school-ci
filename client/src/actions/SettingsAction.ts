import api from '../utils/api';
import { ConfigurationModel, ConfigurationDTO } from 'typings';
import { RootState } from 'reducers';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

export const GET_SETTINGS_REQUEST = 'GET_SETTINGS_REQUEST';
export const GET_SETTINGS_SUCCESS = 'GET_SETTINGS_SUCCESS';
export const GET_SETTINGS_FAIL = 'GET_SETTINGS_FAIL';
export const SET_SETTINGS = 'SET_SETTINGS';
export const SET_SETTINGS_FAIL = 'SET_SETTINGS_FAIL';
export const RESET_SETTINGS_ERROR = 'RESET_SETTINGS_ERROR';

export interface GetSettingsRequestAction {
  type: typeof GET_SETTINGS_REQUEST;
}
const getSettingsRequest = (): GetSettingsRequestAction => ({
  type: GET_SETTINGS_REQUEST,
});

export interface GetSettingsSuccessAction {
  type: typeof GET_SETTINGS_SUCCESS;
  payload: ConfigurationModel;
}
const getSettingsSuccess = (data: ConfigurationModel): GetSettingsSuccessAction => ({
  type: GET_SETTINGS_SUCCESS,
  payload: data,
});

export interface GetSettingsFailAction {
  type: typeof GET_SETTINGS_FAIL;
  payload: string;
  error: boolean;
}
const getSettingsFail = (errorMessage: string): GetSettingsFailAction => ({
  type: GET_SETTINGS_FAIL,
  payload: errorMessage,
  error: true,
});

function fetchSettings(): ThunkAction<void, RootState, unknown, Action<string>> {
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

function shouldFetchSettings(state: RootState) {
  const { settings } = state;

  if (settings?.isFetching || settings?.isLoaded) {
    return false;
  }

  return true;
}

export function fetchSettingsIfNeeded(): ThunkAction<void, RootState, unknown, Action<string>> {
  return (dispatch, getState) => {
    if (shouldFetchSettings(getState())) {
      dispatch(fetchSettings());
    }
  };
}
export interface UpdateSettingsAction {
  type: typeof SET_SETTINGS;
  payload: ConfigurationDTO;
}
export function updateSettings(settingsDTO: ConfigurationDTO): UpdateSettingsAction {
  return { type: SET_SETTINGS, payload: settingsDTO };
}

export interface UpdateSettingsFailAction {
  type: typeof SET_SETTINGS_FAIL;
  payload: string;
  error: boolean;
}
export function updateSettingsFail(errorMessage: string): UpdateSettingsFailAction {
  return { type: SET_SETTINGS_FAIL, payload: errorMessage, error: true };
}

export interface ResetSettingsErrorAction {
  type: typeof RESET_SETTINGS_ERROR;
}
export function resetSettingsError(): ResetSettingsErrorAction {
  return { type: RESET_SETTINGS_ERROR };
}

export type SettingsActions =
  | GetSettingsRequestAction
  | GetSettingsSuccessAction
  | GetSettingsFailAction
  | UpdateSettingsAction
  | UpdateSettingsFailAction
  | ResetSettingsErrorAction;
