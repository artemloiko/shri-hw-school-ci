import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../components/base/Button/Button';
import introImage from 'images/intro.svg';
import './GetStarted.css';

const GetStarted: React.FC<{}> = () => {
  const { t } = useTranslation();

  return (
    <div className="get-started">
      <img src={introImage} alt="Configure settings" className="get-started__image" />
      <div className="typography get-started__text">
        <p className="typography__body1">
          {t('Configure repository connection and synchronization settings')}
        </p>
      </div>
      <Button to="/settings" mods={{ action: true }} className="get-started__button">
        {t('Open settings')}
      </Button>
    </div>
  );
};

export default GetStarted;
