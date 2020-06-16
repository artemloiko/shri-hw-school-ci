import api from '../utils/api';
import { RootState } from 'redux/modules/root';
import { BuildModel } from 'typings';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
export const GET_BUILDS_LIST_REQUEST = 'GET_BUILDS_LIST_REQUEST';
export const GET_BUILDS_LIST_SUCCESS = 'GET_BUILDS_LIST_SUCCESS';
export const GET_BUILDS_LIST_FAIL = 'GET_BUILDS_LIST_FAIL';
export const GET_BUILDS_LIST_UPDATE = 'GET_BUILDS_LIST_UPDATE';

export const LOAD_MORE_BUILDS_REQUEST = 'LOAD_MORE_BUILDS_REQUEST';
export const LOAD_MORE_BUILDS_SUCCESS = 'LOAD_MORE_BUILDS_SUCCESS';
export const LOAD_MORE_BUILDS_FAIL = 'LOAD_MORE_BUILDS_FAIL';

export interface GetBuildsListRequestAction {
  type: typeof GET_BUILDS_LIST_REQUEST;
}
const getBuildsListRequest = (): GetBuildsListRequestAction => ({
  type: GET_BUILDS_LIST_REQUEST,
});

export interface GetBuildsListSuccessAction {
  type: typeof GET_BUILDS_LIST_SUCCESS;
  payload: BuildModel[];
}
const getBuildsListSuccess = (payload: BuildModel[]): GetBuildsListSuccessAction => ({
  type: GET_BUILDS_LIST_SUCCESS,
  payload,
});

export interface GetBuildsListFailAction {
  type: typeof GET_BUILDS_LIST_FAIL;
  payload: string;
  error: boolean;
}
const getBuildsListFail = (errorMessage: string): GetBuildsListFailAction => ({
  type: GET_BUILDS_LIST_FAIL,
  payload: errorMessage,
  error: true,
});

function fetchBuildsList(): ThunkAction<void, RootState, unknown, Action<string>> {
  return async (dispatch) => {
    dispatch(getBuildsListRequest());
    try {
      const data = await api.getBuildsList();
      dispatch(getBuildsListSuccess(data));
    } catch (error) {
      dispatch(getBuildsListFail(error.message));
    }
  };
}

function shouldFetchBuildsList(state: RootState) {
  const { builds } = state;

  if (builds.error) {
    return true;
  }

  if (builds?.isFetching || builds?.isLoaded) {
    return false;
  }

  return true;
}

export function fetchBuildsListIfNeeded(): ThunkAction<void, RootState, unknown, Action<string>> {
  return (dispatch, getState) => {
    if (shouldFetchBuildsList(getState())) {
      dispatch(fetchBuildsList());
    }
  };
}

export interface UpdateBuildsListAction {
  type: typeof GET_BUILDS_LIST_UPDATE;
  payload: BuildModel;
}
export const updateBuildsList = (payload: BuildModel): UpdateBuildsListAction => ({
  type: GET_BUILDS_LIST_UPDATE,
  payload,
});

export interface LoadMoreBuildsRequestAction {
  type: typeof LOAD_MORE_BUILDS_REQUEST;
}
const loadMoreBuildsRequest = (): LoadMoreBuildsRequestAction => ({
  type: LOAD_MORE_BUILDS_REQUEST,
});

export interface LoadMoreBuildsSuccessAction {
  type: typeof LOAD_MORE_BUILDS_SUCCESS;
  payload: BuildModel[];
}
const loadMoreBuildsSuccess = (payload: BuildModel[]): LoadMoreBuildsSuccessAction => ({
  type: LOAD_MORE_BUILDS_SUCCESS,
  payload,
});

export interface LoadMoreBuildsFailAction {
  type: typeof LOAD_MORE_BUILDS_FAIL;
  payload: string;
  error: boolean;
}
const loadMoreBuildsFail = (errorMessage: string): LoadMoreBuildsFailAction => ({
  type: LOAD_MORE_BUILDS_FAIL,
  payload: errorMessage,
  error: true,
});

export function fetchMoreBuilds(): ThunkAction<void, RootState, unknown, Action<string>> {
  return async (dispatch, getState) => {
    dispatch(loadMoreBuildsRequest());
    try {
      const { buildsList } = getState().builds;
      const data = await api.getBuildsList(buildsList.length);
      dispatch(loadMoreBuildsSuccess(data));
    } catch (error) {
      dispatch(loadMoreBuildsFail(error.message));
    }
  };
}

export async function addBuild(commitHash: string) {
  return api.addBuild(commitHash);
}

export type BuildsActions =
  | GetBuildsListRequestAction
  | GetBuildsListSuccessAction
  | GetBuildsListFailAction
  | UpdateBuildsListAction
  | LoadMoreBuildsRequestAction
  | LoadMoreBuildsSuccessAction
  | LoadMoreBuildsFailAction;
