import {
  GET_SETTINGS_REQUEST,
  GET_SETTINGS_FAIL,
  GET_SETTINGS_SUCCESS,
  UPDATE_SETTINGS,
} from '../actions/SettingsAction';

const initialState = {
  isFetching: false,
  isLoaded: false,
};

export function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SETTINGS_REQUEST:
      return { ...state, isFetching: true };
    case GET_SETTINGS_SUCCESS:
      return { ...state, ...action.payload, isLoaded: true, isFetching: false };
    case GET_SETTINGS_FAIL:
      return { ...state, error: action.payload, isLoaded: true, isFetching: false };
    case UPDATE_SETTINGS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
