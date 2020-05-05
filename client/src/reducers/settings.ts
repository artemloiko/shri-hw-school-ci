import {
  GET_SETTINGS_REQUEST,
  GET_SETTINGS_FAIL,
  GET_SETTINGS_SUCCESS,
  SET_SETTINGS,
  SET_SETTINGS_FAIL,
  RESET_SETTINGS_ERROR,
  SettingsActions,
} from '../actions/SettingsAction';
import { ConfigurationModel } from 'typings';

export interface SettingsState extends Partial<ConfigurationModel> {
  isFetching: boolean;
  isLoaded: boolean;
  error?: string;
}

export const initialState: SettingsState = {
  isFetching: false,
  isLoaded: false,
};

export function settingsReducer(state = initialState, action: SettingsActions) {
  switch (action.type) {
    case GET_SETTINGS_REQUEST:
      return { ...state, isFetching: true };
    case GET_SETTINGS_SUCCESS:
      return { ...state, ...action.payload, isLoaded: true, isFetching: false };
    case GET_SETTINGS_FAIL:
      return { ...state, error: action.payload, isLoaded: true, isFetching: false };
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
