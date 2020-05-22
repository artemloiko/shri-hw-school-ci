import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../base/Button/Button';
import CardCiRun from '../CardCiRun/CardCiRun';

import './BuildHistory.css';
import { BuildModel } from 'typings';

type BuildHistoryProps = {
  builds: BuildModel[];
  isLoadedAll: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
};

const BuildHistory: React.FC<BuildHistoryProps> = (props) => {
  const { t } = useTranslation();

  const { builds = [], loadMore, isLoadedAll, isLoadingMore } = props;

  const buildsCards = builds.map((build) => (
    <CardCiRun className="build-history__card" buildInfo={build} key={build.id}></CardCiRun>
  ));
  return (
    <div className="build-history">
      {builds.length ? (
        <>
          {buildsCards}
          {!isLoadedAll && (
            <Button
              mods={{ 'mini-desktop': true, disabled: isLoadingMore }}
              className="build-history__pagination"
              onClick={loadMore}
            >
              {t('Show more')}
            </Button>
          )}
        </>
      ) : (
        <h3 className="typography__headline4">{t('No builds')}</h3>
      )}
    </div>
  );
};

export default BuildHistory;
