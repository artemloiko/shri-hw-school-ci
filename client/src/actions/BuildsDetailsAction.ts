import api from '../utils/api';
import { RootState } from 'reducers';
import { BuildModel } from 'typings';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

export const INIT_BUILD_DETAILS = 'INIT_BUILD_DETAILS';
export const GET_BUILD_DETAILS_REQUEST = 'GET_BUILD_DETAILS_REQUEST';
export const GET_BUILD_DETAILS_SUCCESS = 'GET_BUILD_DETAILS_SUCCESS';
export const GET_BUILD_DETAILS_FAIL = 'GET_BUILD_DETAILS_FAIL';

export const GET_BUILD_LOGS_REQUEST = 'GET_BUILD_LOGS_REQUEST';
export const GET_BUILD_LOGS_SUCCESS = 'GET_BUILD_LOGS_SUCCESS';
export const GET_BUILD_LOGS_FAIL = 'GET_BUILD_LOGS_FAIL';

interface BuildDetailsPayload {
  id: string;
}

export interface BuildDetailsInitAction {
  type: typeof INIT_BUILD_DETAILS;
  payload: BuildDetailsPayload;
}
const buildDetailsInit = (id: string): BuildDetailsInitAction => ({
  type: INIT_BUILD_DETAILS,
  payload: { id },
});

export interface GetBuildDetailsRequestAction {
  type: typeof GET_BUILD_DETAILS_REQUEST;
  payload: BuildDetailsPayload;
}
const getBuildDetailsRequest = (id: string): GetBuildDetailsRequestAction => ({
  type: GET_BUILD_DETAILS_REQUEST,
  payload: { id },
});

export interface GetBuildDetailsSuccessAction {
  type: typeof GET_BUILD_DETAILS_SUCCESS;
  payload: BuildDetailsPayload & { data: BuildModel };
}
const getBuildDetailsSuccess = (id: string, data: BuildModel): GetBuildDetailsSuccessAction => ({
  type: GET_BUILD_DETAILS_SUCCESS,
  payload: { id, data },
});

export interface GetBuildDetailsFailAction {
  type: typeof GET_BUILD_DETAILS_FAIL;
  payload: BuildDetailsPayload & { error: string };
  error: boolean;
}
const getBuildDetailsFail = (id: string, error: string): GetBuildDetailsFailAction => ({
  type: GET_BUILD_DETAILS_FAIL,
  payload: { id, error },
  error: true,
});

function fetchBuildDetailsIfNeeded(
  buildId: string,
): ThunkAction<void, RootState, unknown, Action<string>> {
  return async (dispatch, getState) => {
    const { buildsDetails } = getState();
    const { details } = buildsDetails[buildId];
    if (details?.isFetching || details?.isLoaded) {
      return;
    }

    dispatch(getBuildDetailsRequest(buildId));
    try {
      const data = await api.getBuildDetails(buildId);
      dispatch(getBuildDetailsSuccess(buildId, data));
    } catch (error) {
      dispatch(getBuildDetailsFail(buildId, error.message));
    }
  };
}

export interface GetBuildLogsRequestAction {
  type: typeof GET_BUILD_LOGS_REQUEST;
  payload: BuildDetailsPayload;
}
const getBuildLogsRequest = (id: string): GetBuildLogsRequestAction => ({
  type: GET_BUILD_LOGS_REQUEST,
  payload: { id },
});

export interface GetBuildLogsSuccessAction {
  type: typeof GET_BUILD_LOGS_SUCCESS;
  payload: BuildDetailsPayload & { data: string };
}
const getBuildLogsSuccess = (id: string, data: string): GetBuildLogsSuccessAction => ({
  type: GET_BUILD_LOGS_SUCCESS,
  payload: { id, data },
});

export interface GetBuildLogsFailAction {
  type: typeof GET_BUILD_LOGS_FAIL;
  payload: BuildDetailsPayload & { error: string };
  error: boolean;
}
const getBuildLogsFail = (id: string, error: string): GetBuildLogsFailAction => ({
  type: GET_BUILD_LOGS_FAIL,
  payload: { id, error },
  error: true,
});

function fetchBuildLogsIfNeeded(
  buildId: string,
): ThunkAction<void, RootState, unknown, Action<string>> {
  return async (dispatch, getState) => {
    const { buildsDetails } = getState();
    const { logs, details } = buildsDetails[buildId];
    if (logs?.isFetching || logs?.isLoaded) {
      return;
    }

    if (details?.data?.status === 'Waiting' || details?.data?.status === 'InProgress') {
      dispatch(getBuildLogsSuccess(buildId, ''));
      return;
    }

    dispatch(getBuildLogsRequest(buildId));
    try {
      const data = await api.getBuildLog(buildId);
      dispatch(getBuildLogsSuccess(buildId, data));
    } catch (error) {
      dispatch(getBuildLogsFail(buildId, error.message));
    }
  };
}

function findLocalBuildDetails(buildId: string, state: RootState): BuildModel | undefined {
  const { builds } = state;
  const { buildsList = [] } = builds;
  return buildsList.find((build) => build.id === buildId);
}

export function getBuildDetails(
  buildId: string,
): ThunkAction<void, RootState, unknown, Action<string>> {
  return async (dispatch, getState) => {
    const state = getState();

    const { buildsDetails } = state;
    if (!buildsDetails[buildId]) {
      dispatch(buildDetailsInit(buildId));
    }

    const currentBuild = findLocalBuildDetails(buildId, state);
    if (currentBuild) {
      dispatch(getBuildDetailsSuccess(buildId, currentBuild));
    }

    return Promise.all([
      dispatch(fetchBuildDetailsIfNeeded(buildId)),
      dispatch(fetchBuildLogsIfNeeded(buildId)),
    ]);
  };
}

export type BuildDetailsActions =
  | BuildDetailsInitAction
  | GetBuildDetailsRequestAction
  | GetBuildDetailsSuccessAction
  | GetBuildDetailsFailAction
  | GetBuildLogsRequestAction
  | GetBuildLogsSuccessAction
  | GetBuildLogsFailAction;
