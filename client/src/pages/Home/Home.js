import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettingsIfNeeded } from '../../actions/SettingsAction';

import Page from 'components/common/Page/Page';
import Loader from 'components/common/Loader/Loader';
import GetStarted from 'components/common/GetStarted/GetStarted';
import BuildHistory from 'components/common/BuildHistory/BuildHistory';

import './Home.css';
import builds from './commits.json';

function Home(props) {
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSettingsIfNeeded());
  }, [dispatch]);

  // TODO: show erorr if network is fall
  return (
    <Page contentClass="container">
      <Loader isLoading={!settings.isLoaded}>
        {settings.id ? <BuildHistory builds={builds} /> : <GetStarted />}
        {settings.error}
      </Loader>
    </Page>
  );
}

export default Home;
