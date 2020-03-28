import api from '../utils/api';
import { createAction } from '../utils/createAction';
export const GET_BUILDS_LIST_REQUEST = 'GET_BUILDS_LIST_REQUEST';
export const GET_BUILDS_LIST_SUCCESS = 'GET_BUILDS_LIST_SUCCESS';
export const GET_BUILDS_LIST_FAIL = 'GET_BUILDS_LIST_FAIL';
export const GET_BUILDS_LIST_ASYNC = 'GET_BUILDS_LIST_ASYNC';

const getBuildsListRequest = () => {
  return createAction(GET_BUILDS_LIST_REQUEST);
};

const getBuildsListSuccess = (data) => {
  return createAction(GET_BUILDS_LIST_SUCCESS, data);
};

const getBuildsListFail = (error) => {
  return createAction(GET_BUILDS_LIST_FAIL, error, true);
};

function fetchBuildsList() {
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

function shouldFetchBuildsList(state) {
  const { builds } = state;
  if (builds.isFetching) {
    return false;
  }
  if (!builds.isLoaded) {
    return true;
  }
  return false;
}

export function fetchBuildsListIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchBuildsList(getState())) {
      dispatch(fetchBuildsList());
    }
  };
}
