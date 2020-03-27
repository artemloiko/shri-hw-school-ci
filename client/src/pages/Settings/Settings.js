import React from 'react';
import Page from 'components/common/Page/Page';
import SettingsForm from 'pages/Settings/components/SettingsForm/SettingsForm';

import './Settings.css';

function Settings(props) {
  return (
    <Page contentClass="container">
      <div className="settings">
        <div className="settings__elem">
          <h4 className="typography__elem typography__headline4">Settings</h4>
          <p className="typography__elem typography__subtitle2">
            Configure repository connection and synchronization settings.
          </p>
        </div>
        <SettingsForm className="settings__elem" />
      </div>
    </Page>
  );
}

export default Settings;
