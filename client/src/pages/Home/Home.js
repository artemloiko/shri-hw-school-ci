import React from 'react';
import Page from 'components/base/Page/Page';
import Button from 'components/base/Button/Button';

import introImage from 'images/intro.svg';
import './Home.css';

function Home() {
  return (
    <Page contentClass="container">
      <div className="get-started">
        <img src={introImage} alt="Configure settings" className="get-started__image" />
        <div className="typography get-started__text">
          <p className="typography__body1">
            Configure repository connection and synchronization settings
          </p>
        </div>
        <Button to="settings" mods={{ action: true }} className="get-started__button">
          Open settings
        </Button>
      </div>
    </Page>
  );
}

export default Home;
