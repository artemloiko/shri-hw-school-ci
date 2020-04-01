import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettingsIfNeeded } from 'actions/SettingsAction';
import { fetchBuildsListIfNeeded, fetchMoreBuilds } from 'actions/BuildsAction';

import Button from 'components/base/Button/Button';
import Page from 'components/common/Page/Page';
import Loader from 'components/common/Loader/Loader';
import BuildHistory from 'components/common/BuildHistory/BuildHistory';
import GetStarted from 'pages/Home/components/GetStarted/GetStarted';
import BuildModal from 'pages/Home/components/BuildModal/BuildModal';

import './Home.css';

function Home(props) {
  const settings = useSelector((state) => state.settings);
  const builds = useSelector((state) => state.builds);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSettingsIfNeeded());
    dispatch(fetchBuildsListIfNeeded());
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    dispatch(fetchMoreBuilds());
  }, [dispatch]);

  // TODO: create custom hook for modal
  const [buildModalOpen, setBuildModalOpen] = useState(false);
  const handleBuildModalOpen = useCallback(
    (e) => {
      if (e.type === 'keydown' && e.key !== ' ' && e.key !== 'Enter') {
        return;
      }
      setBuildModalOpen(true);
    },
    [setBuildModalOpen],
  );
  const handleBuildModalClose = useCallback(() => {
    setBuildModalOpen(false);
  }, [setBuildModalOpen]);

  const settingsLoadedAndSpecified = Boolean(settings.isLoaded && settings.id);

  return (
    <Page
      contentClass="container"
      headerText={settings.repoName}
      headerControls={
        <>
          {settings.id && (
            <Button
              type="button"
              className="header__control"
              mods={{ size: 'small' }}
              iconType="play"
              onClick={handleBuildModalOpen}
            >
              Run build
            </Button>
          )}
          <Button
            to="/settings"
            className="header__control"
            mods={{ size: 'small', 'icon-only': !!settings.id }}
            iconType="settings"
          >
            Settings
          </Button>
        </>
      }
    >
      <Loader isLoading={!settings.isLoaded || (settingsLoadedAndSpecified && !builds.isLoaded)}>
        {!settings.id ? (
          <GetStarted />
        ) : (
          <BuildHistory
            builds={builds.buildsList}
            loadMore={handleLoadMore}
            isLoadedAll={builds.isFullListLoaded}
            isLoadingMore={builds.isFetchingMore}
          />
        )}
      </Loader>
      <BuildModal isOpen={buildModalOpen} closeModal={handleBuildModalClose}></BuildModal>
    </Page>
  );
}

export default Home;
