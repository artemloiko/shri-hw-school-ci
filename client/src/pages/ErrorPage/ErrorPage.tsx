import React from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../../components/common/Page/Page';
import { RouteComponentProps } from '@reach/router';

import './ErrorPage.css';

export interface ErrorPageProps extends RouteComponentProps {
  errorHeading?: string;
  errorText?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = (props) => {
  const { t } = useTranslation();

  const { errorHeading = '404', errorText = t('Not found') } = props;

  return (
    <Page contentClass="container">
      <div className="error-page">
        <h2 className="error-page__heading">{errorHeading}</h2>
        <p className="error-page__text">{errorText}</p>
      </div>
    </Page>
  );
};

export default ErrorPage;
