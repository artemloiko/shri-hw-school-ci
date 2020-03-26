import {
  GET_SETTINGS_REQUEST,
  GET_SETTINGS_FAIL,
  GET_SETTINGS_SUCCESS,
} from '../actions/SettingsAction';

const initialState = {};

export function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SETTINGS_REQUEST:
      return { ...state, isFetching: true };
    case GET_SETTINGS_SUCCESS:
      return { ...state, ...action.payload, isFetching: false };
    case GET_SETTINGS_FAIL:
      return { ...state, error: action.payload, isFetching: false };
    default:
      return state;
  }
}
