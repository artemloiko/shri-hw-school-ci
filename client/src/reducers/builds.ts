import {
  GET_BUILDS_LIST_REQUEST,
  GET_BUILDS_LIST_SUCCESS,
  GET_BUILDS_LIST_FAIL,
  GET_BUILDS_LIST_UPDATE,
  LOAD_MORE_BUILDS_REQUEST,
  LOAD_MORE_BUILDS_SUCCESS,
  LOAD_MORE_BUILDS_FAIL,
  BuildsActions,
} from '../actions/BuildsAction';
import { BuildModel } from 'typings';

export interface BuildsState {
  isFetching: boolean;
  isLoaded: boolean;
  isFetchingMore: boolean;
  isFullListLoaded: boolean;
  buildsList: BuildModel[];
  error?: string;
}

const initialState: BuildsState = {
  isFetching: false,
  isLoaded: false,
  isFetchingMore: false,
  isFullListLoaded: false,
  buildsList: [],
};

export function buildsReducer(state = initialState, action: BuildsActions) {
  switch (action.type) {
    case GET_BUILDS_LIST_REQUEST:
      return { ...state, isLoaded: false, isFetching: true, error: undefined };
    case GET_BUILDS_LIST_SUCCESS:
      return { ...state, buildsList: action.payload, isLoaded: true, isFetching: false };
    case GET_BUILDS_LIST_FAIL:
      return { ...state, error: action.payload, isLoaded: true, isFetching: false };
    case GET_BUILDS_LIST_UPDATE:
      return { ...state, buildsList: [action.payload, ...state.buildsList] };
    case LOAD_MORE_BUILDS_REQUEST:
      return { ...state, isFetchingMore: true };
    case LOAD_MORE_BUILDS_SUCCESS:
      return {
        ...state,
        buildsList: [...state.buildsList, ...action.payload],
        isFullListLoaded: !action.payload.length,
        isFetchingMore: false,
      };
    case LOAD_MORE_BUILDS_FAIL:
      return { ...state, error: action.payload, isFetchingMore: false, isFullListLoaded: true };
    default:
      return { ...state };
  }
}
