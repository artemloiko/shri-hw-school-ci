import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getBuildDetails } from 'actions/BuildsDetailsAction';

import Page from 'components/common/Page/Page';
import CardCiRun from 'components/common/CardCiRun/CardCiRun';
import Log from 'components/common/Log/Log';
import Loader from 'components/common/Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';

import './Details.css';

function Details(props) {
  const { buildId } = props;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBuildDetails(buildId));
  }, [buildId, dispatch]);

  const currentBuild = useSelector((state) => state.buildsDetails[buildId]);

  const isDetailsLoading = !currentBuild || !currentBuild.details.isLoaded;

  return (
    <Page contentClass="details">
      <Loader isLoading={isDetailsLoading} mods={{ animate: true }}>
        <div className="container container_shrink">
          {currentBuild?.details && (
            <CardCiRun mods={{ details: true }} buildInfo={currentBuild.details}></CardCiRun>
          )}
        </div>
        <Log>
          <Loader isLoading={!currentBuild || !currentBuild.logs.isLoaded} mods={{ static: true }}>
            {currentBuild?.logs?.log}
          </Loader>
        </Log>
      </Loader>
    </Page>
  );
}

Details.propTypes = {
  buildId: PropTypes.string,
};

export default Details;
