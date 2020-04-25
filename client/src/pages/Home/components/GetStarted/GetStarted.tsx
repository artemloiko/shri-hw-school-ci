import React from 'react';
import Button from 'components/base/Button/Button';

import introImage from 'images/intro.svg';
import './GetStarted.css';

const GetStarted: React.FC<{}> = () => {
  return (
    <div className="get-started">
      <img src={introImage} alt="Configure settings" className="get-started__image" />
      <div className="typography get-started__text">
        <p className="typography__body1">
          Configure repository connection and synchronization settings
        </p>
      </div>
      <Button to="/settings" mods={{ action: true }} className="get-started__button">
        Open settings
      </Button>
    </div>
  );
};

export default GetStarted;
