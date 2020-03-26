import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettingsIfNeeded } from '../../actions/SettingsAction';
import Page from 'components/base/Page/Page';
import Loader from 'components/common/Loader/Loader';
import GetStarted from 'components/common/GetStarted/GetStarted';
import BuildHistory from 'components/common/BuildHistory/BuildHistory';

import './Home.css';
import builds from './commits.json';

function Home() {
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  console.log('[HOME RENDER]', settings);

  useEffect(() => {
    dispatch(fetchSettingsIfNeeded());
  }, [dispatch]);

  return (
    <Page contentClass="container">
      <Loader isLoading={settings.isFetching}>
        {settings.repoName ? <BuildHistory builds={builds} /> : <GetStarted />}
      </Loader>
    </Page>
  );
}

export default Home;
