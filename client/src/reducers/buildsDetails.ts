import {
  INIT_BUILD_DETAILS,
  GET_BUILD_DETAILS_REQUEST,
  GET_BUILD_DETAILS_SUCCESS,
  GET_BUILD_DETAILS_FAIL,
  GET_BUILD_LOGS_REQUEST,
  GET_BUILD_LOGS_SUCCESS,
  GET_BUILD_LOGS_FAIL,
  BuildDetailsActions,
} from '../actions/BuildsDetailsAction';
import { BuildModel } from 'typings';

interface Logs {
  isFetching: boolean;
  isLoaded: boolean;
  log?: string;
  error?: string;
}
interface Details extends Partial<BuildModel> {
  isFetching: boolean;
  isLoaded: boolean;
  error?: string;
}

export interface BuildDetailsState {
  [id: string]: {
    details: Details;
    logs: Logs;
  };
}
const initialState: BuildDetailsState = {};

export function buildsDetailsReducer(state = initialState, action: BuildDetailsActions) {
  const { id = 'default' } = action.payload || {};
  const updateStateWithDetails = (details: Details) => {
    return {
      ...state,
      [id]: {
        ...state[id],
        details,
      },
    };
  };
  const updateStateWithLogs = (logs: Logs) => {
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
        [id]: {
          details: { isFetching: false, isLoaded: false } as Details,
          logs: { isFetching: false, isLoaded: false } as Logs,
        },
      };
    case GET_BUILD_DETAILS_REQUEST:
      return updateStateWithDetails({ isFetching: false, isLoaded: false });
    case GET_BUILD_DETAILS_SUCCESS:
      return updateStateWithDetails({ ...action.payload.data, isFetching: false, isLoaded: true });
    case GET_BUILD_DETAILS_FAIL:
      return updateStateWithDetails({
        error: action.payload.error,
        isFetching: false,
        isLoaded: true,
      });
    case GET_BUILD_LOGS_REQUEST:
      return updateStateWithLogs({ isFetching: false, isLoaded: false });
    case GET_BUILD_LOGS_SUCCESS:
      return updateStateWithLogs({ log: action.payload.data, isFetching: false, isLoaded: true });
    case GET_BUILD_LOGS_FAIL:
      return updateStateWithLogs({
        error: action.payload.error,
        isFetching: false,
        isLoaded: true,
      });
    default:
      return { ...state };
  }
}
