import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from '@reach/router';

import Page from 'components/common/Page/Page';
import Loader from 'components/common/Loader/Loader';
import ErrorModal from 'components/common/ErrorModal/ErrorModal';
import SettingsForm from 'pages/Settings/components/SettingsForm/SettingsForm';

import { fetchSettingsIfNeeded, resetSettingsError } from 'actions/SettingsAction';
import { RootState } from 'reducers';

import './Settings.css';

const Settings: React.FC<RouteComponentProps> = () => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSettingsIfNeeded());
  }, [dispatch]);

  return (
    <Page contentClass="container">
      <Loader isLoading={!settings.isLoaded}>
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
      <ErrorModal
        isOpen={Boolean(settings.error)}
        errorMessage={settings.error}
        closeModal={() => dispatch(resetSettingsError())}
      ></ErrorModal>
    </Page>
  );
};

export default Settings;
