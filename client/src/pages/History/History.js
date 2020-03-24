import React from 'react';
import Page from 'components/base/Page/Page';
import Button from 'components/base/Button/Button';

import './History.css';

function History() {
  return (
    <Page contentClass="container history">
      <a
        href="/details.html"
        class="card card-ci-run card-ci-run_status_success history__card"
        tabindex="0"
      >
        <span class="icon card-ci-run__status-icon"></span>
        <div class="card-ci-run__info">
          <div class="card-ci-run__heading card-ci-run__heading">
            <div class="card-ci-run__heading-number">#1368</div>
            <div class="card-ci-run__heading-message">add documentation for postgres scaler</div>
          </div>
          <div class="card-ci-run__commit-info">
            <div class="icon-text card-ci-run__commit-info-elem">
              <span class="icon icon_type_commit icon-text__icon"></span>
              <div class="icon-text__text">master</div>
              <div class="icon-text__text icon-text__secondary-text">9c9f0b9</div>
            </div>
            <div class="icon-text card-ci-run__commit-info-elem">
              <span class="icon icon_type_user icon-text__icon"></span>
              <div class="icon-text__text">Philip Kirkorov</div>
            </div>
          </div>
        </div>
        <div class="card-ci-run__meta">
          <div class="icon-text card-ci-run__meta-elem">
            <span class="icon icon_type_calendar icon-text__icon"></span>
            <div class="icon-text__text">21 янв, 03:06</div>
          </div>
          <div class="icon-text card-ci-run__meta-elem">
            <span class="icon icon_type_stopwatch icon-text__icon"></span>
            <div class="icon-text__text">1 ч 20 мин</div>
          </div>
        </div>
      </a>

      <Button mods={{ 'mini-desktop': true }} className="history__pagination">
        Show more
      </Button>
    </Page>
  );
}

export default History;
