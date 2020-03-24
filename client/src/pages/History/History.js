import React from 'react';
import Page from 'components/base/Page/Page';
import Button from 'components/base/Button/Button';
import CardCiRun from 'components/common/CardCiRun/CardCiRun';

import './History.css';
import builds from './commits.json';

function History() {
  console.log('builds', builds);
  return (
    <Page contentClass="container history">
      {builds.map((build) => (
        <CardCiRun className="history__card" buildInfo={build}></CardCiRun>
      ))}
      <Button mods={{ 'mini-desktop': true }} className="history__pagination">
        Show more
      </Button>
    </Page>
  );
}

export default History;
