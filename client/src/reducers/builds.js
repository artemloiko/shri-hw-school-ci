import {
  GET_BUILDS_LIST_REQUEST,
  GET_BUILDS_LIST_SUCCESS,
  GET_BUILDS_LIST_FAIL,
  GET_BUILDS_LIST_ASYNC,
} from '../actions/BuildsAction';
const initialState = {
  isFetching: false,
  isLoaded: false,
};

export function buildsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_BUILDS_LIST_REQUEST:
      return { ...state, isFetching: true };
    case GET_BUILDS_LIST_SUCCESS:
      return { ...state, buildsList: action.payload, isLoaded: true, isFetching: false };
    case GET_BUILDS_LIST_FAIL:
      return { ...state, error: action.payload, isLoaded: true, isFetching: false };
    case GET_BUILDS_LIST_ASYNC:
      return { ...state, buildsList: action.payload };
    default:
      return { ...state };
  }
}
