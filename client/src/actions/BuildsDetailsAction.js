import api from '../utils/api';
import { createAction } from '../utils/createAction';

export const INIT_BUILD_DETAILS = 'INIT_BUILD_DETAILS';
export const GET_BUILD_DETAILS_REQUEST = 'GET_BUILD_DETAILS_REQUEST';
export const GET_BUILD_DETAILS_SUCCESS = 'GET_BUILD_DETAILS_SUCCESS';
export const GET_BUILD_DETAILS_FAIL = 'GET_BUILD_DETAILS_FAIL';

export const GET_BUILD_LOGS_REQUEST = 'GET_BUILD_LOGS_REQUEST';
export const GET_BUILD_LOGS_SUCCESS = 'GET_BUILD_LOGS_SUCCESS';
export const GET_BUILD_LOGS_FAIL = 'GET_BUILD_LOGS_FAIL';

const buildDetailsInit = (id) => {
  return createAction(INIT_BUILD_DETAILS, { id });
};

const getBuildDetailsRequest = (id) => {
  return createAction(GET_BUILD_DETAILS_REQUEST, { id });
};
const getBuildDetailsSuccess = (id, data) => {
  return createAction(GET_BUILD_DETAILS_SUCCESS, { id, data });
};
const getBuildDetailsFail = (id, error) => {
  return createAction(GET_BUILD_DETAILS_FAIL, { id, error }, true);
};

function fetchBuildDetailsIfNeeded(buildId) {
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
      dispatch(getBuildDetailsFail(buildId, error));
    }
  };
}

const getBuildLogsRequest = (id) => {
  return createAction(GET_BUILD_LOGS_REQUEST, { id });
};
const getBuildLogsSuccess = (id, data) => {
  return createAction(GET_BUILD_LOGS_SUCCESS, { id, data });
};
const getBuildLogsFail = (id, error) => {
  return createAction(GET_BUILD_LOGS_FAIL, { id, error }, true);
};

function fetchBuildLogsIfNeeded(buildId) {
  return async (dispatch, getState) => {
    const { buildsDetails } = getState();
    const { logs, details } = buildsDetails[buildId];
    if (logs?.isFetching || logs?.isLoaded) {
      return;
    }

    if (details.status === 'Waiting' || details.status === 'InProgress') {
      dispatch(getBuildLogsSuccess(buildId, ''));
      return;
    }

    dispatch(getBuildLogsRequest(buildId));
    try {
      const data = await api.getBuildLog(buildId);
      dispatch(getBuildLogsSuccess(buildId, data));
    } catch (error) {
      dispatch(getBuildLogsFail(buildId, error));
    }
  };
}

function findLocalBuildDetails(buildId, state) {
  const { builds } = state;
  const { buildsList = [] } = builds;
  return buildsList.find((build) => build.id === buildId);
}

export function getBuildDetails(buildId) {
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
