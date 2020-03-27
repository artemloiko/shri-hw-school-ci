import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettingsIfNeeded } from '../../actions/SettingsAction';

import Page from 'components/common/Page/Page';
import SettingsForm from 'pages/Settings/components/SettingsForm/SettingsForm';
import Loader from 'components/common/Loader/Loader';

import './Settings.css';

function Settings(props) {
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSettingsIfNeeded());
  }, [dispatch]);

  return (
    <Page contentClass="container">
      <Loader isLoading={!settings.isLoaded} hideChildren>
        <div className="settings">
          <div className="settings__elem">
            <h4 className="typography__elem typography__headline4">Settings</h4>
            <p className="typography__elem typography__subtitle2">
              Configure repository connection and synchronization settings.
            </p>
          </div>
          <SettingsForm className="settings__elem" />
        </div>
      </Loader>
    </Page>
  );
}

export default Settings;
