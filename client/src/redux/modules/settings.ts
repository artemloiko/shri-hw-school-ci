import { AxiosError } from 'axios';
import { ConfigurationModel, ConfigurationDTO } from 'typings';
import { EpicDependencies } from 'redux/createStore';
import { RootState } from './root';

import { Epic } from 'redux-observable';
import { isOfType } from 'typesafe-actions';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError, filter, take, tap } from 'rxjs/operators';

// Actions
const GET_SETTINGS = 'school-ci/settings/GET_SETTINGS';
const GET_SETTINGS_SUCCESS = 'school-ci/settings/GET_SETTINGS_SUCCESS';
const GET_SETTINGS_FAIL = 'school-ci/settings/GET_SETTINGS_FAIL';
const SET_SETTINGS = 'school-ci/settings/SET_SETTINGS';
const SET_SETTINGS_FAIL = 'school-ci/settings/SET_SETTINGS_FAIL';
const RESET_SETTINGS_ERROR = 'school-ci/settings/RESET_SETTINGS_ERROR';

export interface SettingsState extends Partial<ConfigurationModel> {
  isFetching: boolean;
  error?: string;
}

export const initialState: SettingsState = {
  isFetching: false,
};

// Reducer
export default function settingsReducer(
  state = initialState,
  action: SettingsActions,
): SettingsState {
  switch (action.type) {
    case GET_SETTINGS:
      return { ...state, isFetching: true };
    case GET_SETTINGS_SUCCESS:
      return { ...state, ...action.payload, isFetching: false };
    case GET_SETTINGS_FAIL:
      return { ...state, error: action.payload, isFetching: false };
    case SET_SETTINGS:
      return { ...state, ...action.payload };
    case SET_SETTINGS_FAIL:
      return { ...state, error: action.payload };
    case RESET_SETTINGS_ERROR:
      return { ...state, error: undefined };
    default:
      return state;
  }
}
// Action creators
export interface GetSettingsRequestAction {
  type: typeof GET_SETTINGS;
}
export const getSettingsRequest = (): GetSettingsRequestAction => ({
  type: GET_SETTINGS,
});

export interface GetSettingsSuccessAction {
  type: typeof GET_SETTINGS_SUCCESS;
  payload: ConfigurationModel;
}
export const getSettingsSuccess = (data: ConfigurationModel): GetSettingsSuccessAction => ({
  type: GET_SETTINGS_SUCCESS,
  payload: data,
});

export interface GetSettingsFailAction {
  type: typeof GET_SETTINGS_FAIL;
  payload: string;
  error: boolean;
}
export const getSettingsFail = (errorMessage: string): GetSettingsFailAction => ({
  type: GET_SETTINGS_FAIL,
  payload: errorMessage,
  error: true,
});

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

export const settingsEpic: Epic<SettingsActions, SettingsActions, RootState, EpicDependencies> = (
  action$,
  state$,
  { api },
) =>
  action$.pipe(
    filter(isOfType(GET_SETTINGS)),
    take(1),
    mergeMap(() =>
      from(api.getSettings()).pipe(
        map((data) => getSettingsSuccess(data)),
        catchError((error: AxiosError) => of(getSettingsFail(error.message))),
      ),
    ),
  );
