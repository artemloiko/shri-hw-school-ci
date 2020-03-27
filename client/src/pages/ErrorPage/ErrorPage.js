import React from 'react';
import Page from 'components/common/Page/Page';

import './ErrorPage.css';

function ErrorPage(props) {
  const { errorHeading = '404', errorText = 'Not found' } = props;

  return (
    <Page contentClass="container">
      <div className="error-page">
        <h2 className="error-page__heading">{errorHeading}</h2>
        <p className="error-page__text">{errorText}</p>
      </div>
    </Page>
  );
}

export default ErrorPage;
