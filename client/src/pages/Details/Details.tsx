import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navigate, RouteComponentProps } from '@reach/router';

import Button from '../../components/base/Button/Button';
import Log from '../../components/common/Log/Log';
import Page from '../../components/common/Page/Page';
import Loader from '../../components/common/Loader/Loader';
import CardCiRun from '../../components/common/CardCiRun/CardCiRun';
import ErrorModal from '../../components/common/ErrorModal/ErrorModal';

import { getBuildDetails } from '../../actions/BuildsDetailsAction';
import { updateBuildsList, addBuild } from '../../actions/BuildsAction';
import { RootState } from 'redux/modules/root';

import './Details.css';
import { useTranslation } from 'react-i18next';

export interface DetailsProps extends RouteComponentProps {
  buildId?: string;
}

const Details: React.FC<DetailsProps> = (props) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { buildId = '' } = props;

  useEffect(() => {
    dispatch(getBuildDetails(buildId));
  }, [buildId, dispatch]);

  const currentBuild = useSelector((state: RootState) => state.buildsDetails[buildId]);
  const settings = useSelector((state: RootState) => state.settings);

  const [isRebuildSubmitting, setIsRebuildSubmitting] = useState(false);
  const [rebuildError, setRebuildError] = useState<string>('');

  const handleRebuild = async () => {
    if (!currentBuild?.details?.data?.commitHash) return;
    try {
      setIsRebuildSubmitting(true);
      const data = await addBuild(currentBuild.details.data.commitHash);
      dispatch(updateBuildsList(data));
      navigate(`/details/${data.id}`);
    } catch (error) {
      const errorMessage = error?.response?.data?.error?.message;
      // TODO: ERROR_MESSAGE
      setRebuildError(errorMessage ? `${errorMessage}. Check your repo settings` : 'Network error');
    }
    setIsRebuildSubmitting(false);
  };

  const isDetailsLoading = !currentBuild || !currentBuild.details.isLoaded;
  const isLogsLoading = !currentBuild || !currentBuild.logs.isLoaded;

  return (
    <Page
      contentClass="details"
      headerText={settings.repoName}
      headerControls={
        <>
          <Button
            type="button"
            className="header__control"
            mods={{ size: 'small', disabled: isRebuildSubmitting }}
            iconType="rebuild"
            onClick={handleRebuild}
          >
            {t('Rebuild')}
          </Button>
          <Button
            to="/settings"
            className="header__control"
            mods={{ size: 'small', 'icon-only': true, disabled: isRebuildSubmitting }}
            iconType="settings"
            title={t('Settings')}
          >
            {t('Settings')}
          </Button>
        </>
      }
    >
      <Loader isLoading={isDetailsLoading} mods={{ animate: true }}>
        <div className="container container_shrink">
          {currentBuild?.details?.data && (
            <CardCiRun mods={{ details: true }} buildInfo={currentBuild.details.data}></CardCiRun>
          )}
        </div>
        <Loader isLoading={isLogsLoading} mods={{ static: true }}>
          <Log log={currentBuild?.logs?.log}></Log>
        </Loader>
      </Loader>

      <ErrorModal
        closeModal={() => setRebuildError('')}
        isOpen={Boolean(rebuildError)}
        errorMessage={rebuildError}
      ></ErrorModal>
    </Page>
  );
};

export default Details;
