import React from 'react';
import Page from 'components/base/Page/Page';

import './NotFound.css';

function NotFound() {
  return (
    <Page contentClass="container">
      <div className="not-found">
        <h2 className="not-found__heading">404</h2>
        <p className="not-found__text">Not found</p>
      </div>
    </Page>
  );
}

export default NotFound;
