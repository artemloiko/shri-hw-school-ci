import { AxiosError } from 'axios';
import { ConfigurationModel, ConfigurationDTO } from 'typings';
import { EpicDependencies } from 'redux/createStore';
import { RootState } from './root';

import { Epic } from 'redux-observable';
import { isOfType } from 'typesafe-actions';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError, filter, take, switchMap, tap } from 'rxjs/operators';

// Actions
export const GET_SETTINGS = 'school-ci/settings/GET_SETTINGS';
export const GET_SETTINGS_SUCCESS = 'school-ci/settings/GET_SETTINGS_SUCCESS';
export const GET_SETTINGS_FAIL = 'school-ci/settings/GET_SETTINGS_FAIL';
export const SET_SETTINGS = 'school-ci/settings/SET_SETTINGS';
export const SET_SETTINGS_SUCCESS = 'school-ci/settings/SET_SETTINGS_SUCCESS';
export const SET_SETTINGS_FAIL = 'school-ci/settings/SET_SETTINGS_FAIL';
export const RESET_SETTINGS_ERROR = 'school-ci/settings/RESET_SETTINGS_ERROR';

export interface SettingsState extends Partial<ConfigurationModel> {
  isFetching: boolean;
  error?: string;
}

export const initialState: SettingsState = {
  isFetching: true,
};

// Reducer
export default function settingsReducer(
  state = initialState,
  action: SettingsActions,
): SettingsState {
  switch (action.type) {
    case GET_SETTINGS_SUCCESS:
      return { ...state, ...action.payload, isFetching: false };
    case GET_SETTINGS_FAIL:
      return { ...state, error: action.payload, isFetching: false };
    case SET_SETTINGS_SUCCESS:
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

export interface SetSettingsAction {
  type: typeof SET_SETTINGS;
  payload: ConfigurationDTO;
  meta: {
    callback: (success: boolean) => void;
  };
}
export function setSettings(
  settingsDTO: ConfigurationDTO,
  callback: (success: boolean) => void,
): SetSettingsAction {
  return { type: SET_SETTINGS, payload: settingsDTO, meta: { callback } };
}

export interface SetSettingsSuccessAction {
  type: typeof SET_SETTINGS_SUCCESS;
  payload: ConfigurationDTO;
}
export function setSettingsSuccess(settingsDTO: ConfigurationDTO): SetSettingsSuccessAction {
  return { type: SET_SETTINGS_SUCCESS, payload: settingsDTO };
}

export interface SetSettingsFailAction {
  type: typeof SET_SETTINGS_FAIL;
  payload: string;
  error: boolean;
}
export function setSettingsFail(errorMessage: string): SetSettingsFailAction {
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
  | SetSettingsAction
  | SetSettingsFailAction
  | SetSettingsSuccessAction
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

export const setSettingsEpic: Epic<
  SettingsActions,
  SettingsActions,
  RootState,
  EpicDependencies
> = (action$, state$, { api }) =>
  action$.pipe(
    filter(isOfType(SET_SETTINGS)),
    switchMap((action) =>
      from(api.setSettings(action.payload)).pipe(
        map((data) => {
          return setSettingsSuccess(data);
        }),
        catchError((error: AxiosError) => {
          const apiError = error?.response?.data?.error;
          const errorMessage: string = apiError?.errorCode || apiError?.message || error.message;
          return of(setSettingsFail(errorMessage));
        }),
        tap((resultingAction) => {
          action.meta.callback(resultingAction.type === SET_SETTINGS_SUCCESS);
        }),
      ),
    ),
  );
