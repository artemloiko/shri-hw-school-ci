import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '@reach/router';

import Button from 'components/base/Button/Button';
import Log from 'components/common/Log/Log';
import Page from 'components/common/Page/Page';
import Loader from 'components/common/Loader/Loader';
import CardCiRun from 'components/common/CardCiRun/CardCiRun';
import ErrorModal from 'components/common/ErrorModal/ErrorModal';

import { getBuildDetails } from 'actions/BuildsDetailsAction';
import { updateBuildsList, addBuild } from 'actions/BuildsAction';

import './Details.css';

function Details(props) {
  const dispatch = useDispatch();
  const { buildId } = props;

  useEffect(() => {
    dispatch(getBuildDetails(buildId));
  }, [buildId, dispatch]);

  const currentBuild = useSelector((state) => state.buildsDetails[buildId]);
  const settings = useSelector((state) => state.settings);

  const [isRebuildSubmitting, setIsRebuildSubmitting] = useState(false);
  const [rebuildError, setRebuildError] = useState();

  const handleRebuild = async () => {
    const commitHash = currentBuild?.details?.commitHash;
    if (!commitHash) return;
    try {
      setIsRebuildSubmitting(true);
      const data = await addBuild(currentBuild.details.commitHash);
      dispatch(updateBuildsList(data));
      navigate(`/details/${data.id}`);
    } catch (error) {
      const errorMessage = error?.response?.data?.error?.message;
      setRebuildError(errorMessage ? `${errorMessage}. Check your repo settings` : 'Network error');
    }
    setIsRebuildSubmitting(false);
  };

  const isDetailsLoading = !currentBuild || !currentBuild.details.isLoaded;
  const isLogsLoading = !currentBuild || !currentBuild.logs.isLoaded;

  return (
    <Page
      contentClass="details"
      headerText={settings.repoName}
      headerControls={
        <>
          <Button
            type="button"
            className="header__control"
            mods={{ size: 'small', disabled: isRebuildSubmitting }}
            iconType="rebuild"
            onClick={handleRebuild}
          >
            Rebuild
          </Button>
          <Button
            to="/settings"
            className="header__control"
            mods={{ size: 'small', 'icon-only': true, disabled: isRebuildSubmitting }}
            iconType="settings"
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
        <Loader isLoading={isLogsLoading} mods={{ static: true }}>
          <Log log={currentBuild?.logs?.log}></Log>
        </Loader>
      </Loader>

      <ErrorModal
        closeModal={() => setRebuildError()}
        isOpen={Boolean(rebuildError)}
        errorMessage={rebuildError}
      ></ErrorModal>
    </Page>
  );
}

Details.propTypes = {
  buildId: PropTypes.string,
};

export default Details;
