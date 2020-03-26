import React from 'react';

import './Header.css';
import Button from 'components/base/Button/Button';
import Icon from 'components/base/Icon/Icon';

function Header() {
  return (
    <header className="header">
      <div className="container header__container">
        <h1 className="header__heading typography__headline1">School CI server</h1>
        <div className="header__control-group">
          {/* <Button
            type="button"
            className="header__control"
            mods={{ size: 'small', icon: true }}
            icon={<Icon mods={{ size: 'small', type: 'play' }} />}
          >
            Run build
          </Button> */}
          <Button
            to="/settings"
            className="header__control"
            mods={{ size: 'small', icon: true, 'icon-only': false }}
            icon={<Icon mods={{ size: 'small', type: 'settings' }} />}
          >
            Settings
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
