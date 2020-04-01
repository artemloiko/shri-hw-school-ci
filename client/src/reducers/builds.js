import {
  GET_BUILDS_LIST_REQUEST,
  GET_BUILDS_LIST_SUCCESS,
  GET_BUILDS_LIST_FAIL,
  GET_BUILDS_LIST_UPDATE,
  LOAD_MORE_BUILDS_REQUEST,
  LOAD_MORE_BUILDS_SUCCESS,
  LOAD_MORE_BUILDS_FAIL,
} from '../actions/BuildsAction';
const initialState = {
  isFetching: false,
  isLoaded: false,
  isFetchingMore: false,
  isFullListLoaded: false,
};

export function buildsReducer(state = initialState, action) {
  const { payload } = action;
  switch (action.type) {
    case GET_BUILDS_LIST_REQUEST:
      return { ...state, isFetching: true };
    case GET_BUILDS_LIST_SUCCESS:
      return { ...state, buildsList: payload, isLoaded: true, isFetching: false };
    case GET_BUILDS_LIST_FAIL:
      return { ...state, error: payload, isLoaded: true, isFetching: false };
    case GET_BUILDS_LIST_UPDATE:
      return { ...state, buildsList: [payload, ...(state.buildsList || [])] };
    case LOAD_MORE_BUILDS_REQUEST:
      return { ...state, isFetchingMore: true };
    case LOAD_MORE_BUILDS_SUCCESS:
      return {
        ...state,
        buildsList: [...state.buildsList, ...payload],
        isFullListLoaded: !payload.length,
        isFetchingMore: false,
      };
    case LOAD_MORE_BUILDS_FAIL:
      return { ...state, error: payload, isFetchingMore: false, isFullListLoaded: true };
    default:
      return { ...state };
  }
}
