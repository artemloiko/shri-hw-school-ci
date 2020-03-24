import React from 'react';
import Page from 'components/base/Page/Page';
import CardCiRun from 'components/common/CardCiRun/CardCiRun';
import Log from 'components/common/Log/Log';

import builds from '../History/commits.json';
import data from './log.json';
import './Details.css';

function Details() {
  return (
    <Page contentClass="details">
      <div className="container">
        <CardCiRun mods={{ details: true }} buildInfo={builds[0]}></CardCiRun>
      </div>
      <Log>{data.log}</Log>
    </Page>
  );
}

export default Details;
