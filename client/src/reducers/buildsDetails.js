import {
  INIT_BUILD_DETAILS,
  GET_BUILD_DETAILS_REQUEST,
  GET_BUILD_DETAILS_SUCCESS,
  GET_BUILD_DETAILS_FAIL,
  GET_BUILD_LOGS_REQUEST,
  GET_BUILD_LOGS_SUCCESS,
  GET_BUILD_LOGS_FAIL,
} from '../actions/BuildsDetailsAction';
const initialState = {};

export function buildsDetailsReducer(state = initialState, action) {
  const { id = 'default', data, error } = action.payload || {};
  const updateStateWithDetails = (details) => {
    return {
      ...state,
      [id]: {
        ...state[id],
        details,
      },
    };
  };
  const updateStateWithLogs = (logs) => {
    return {
      ...state,
      [id]: {
        ...state[id],
        logs,
      },
    };
  };
  switch (action.type) {
    case INIT_BUILD_DETAILS:
      return {
        ...state,
        [id]: {
          details: { isFetching: false, isLoaded: false },
          logs: { isFetching: false, isLoaded: false },
        },
      };
    case GET_BUILD_DETAILS_REQUEST:
      return updateStateWithDetails({ isFetching: false, isLoaded: false });
    case GET_BUILD_DETAILS_SUCCESS:
      return updateStateWithDetails({ ...data, isFetching: false, isLoaded: true });
    case GET_BUILD_DETAILS_FAIL:
      return updateStateWithDetails({ error, isFetching: false, isLoaded: true });
    case GET_BUILD_LOGS_REQUEST:
      return updateStateWithLogs({ isFetching: false, isLoaded: false });
    case GET_BUILD_LOGS_SUCCESS:
      return updateStateWithLogs({ log: data, isFetching: false, isLoaded: true });
    case GET_BUILD_LOGS_FAIL:
      return updateStateWithLogs({ error, isFetching: false, isLoaded: true });
    default:
      return { ...state };
  }
}
