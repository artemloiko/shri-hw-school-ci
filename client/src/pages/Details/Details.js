import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '@reach/router';

import Page from 'components/common/Page/Page';
import CardCiRun from 'components/common/CardCiRun/CardCiRun';
import Log from 'components/common/Log/Log';
import Loader from 'components/common/Loader/Loader';
import Button from 'components/base/Button/Button';
import Icon from 'components/base/Icon/Icon';

import { getBuildDetails } from 'actions/BuildsDetailsAction';
import { updateBuildsList, addBuild } from 'actions/BuildsAction';

import './Details.css';

function Details(props) {
  const { buildId } = props;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBuildDetails(buildId));
  }, [buildId, dispatch]);

  const currentBuild = useSelector((state) => state.buildsDetails[buildId]);

  const isDetailsLoading = !currentBuild || !currentBuild.details.isLoaded;
  const handleRebuild = async () => {
    const commitHash = currentBuild?.details?.commitHash;
    if (!commitHash) return;
    try {
      const data = await addBuild(currentBuild.details.commitHash);
      dispatch(updateBuildsList(data));
      navigate(`/details/${data.id}`);
    } catch (error) {
      console.log('Cannot find commit', commitHash);
    }
  };

  return (
    <Page
      contentClass="details"
      headerControls={
        <>
          <Button
            type="button"
            className="header__control"
            mods={{ size: 'small', icon: true }}
            icon={<Icon mods={{ size: 'small', type: 'rebuild' }} />}
            onClick={handleRebuild}
          >
            Rebuild
          </Button>
          <Button
            to="/settings"
            className="header__control"
            mods={{ size: 'small', icon: true, 'icon-only': true }}
            icon={<Icon mods={{ size: 'small', type: 'settings' }} />}
          >
            Settings
          </Button>
        </>
      }
    >
      <Loader isLoading={isDetailsLoading} mods={{ animate: true }}>
        <div className="container container_shrink">
          {currentBuild?.details && (
            <CardCiRun mods={{ details: true }} buildInfo={currentBuild.details}></CardCiRun>
          )}
        </div>
        <Log log={currentBuild?.logs?.log}>
          <Loader
            isLoading={!currentBuild || !currentBuild.logs.isLoaded}
            mods={{ static: true }}
          ></Loader>
        </Log>
      </Loader>
    </Page>
  );
}

Details.propTypes = {
  buildId: PropTypes.string,
};

export default Details;
