import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { cn } from 'utils/bem-cn';

import Icon from 'components/base/Icon/Icon';
import IconText from 'components/base/IconText/IconText';

import './CardCiRun.css';

function CardCiRun(props) {
  const { buildInfo } = props;
  const {
    buildNumber,
    commitMessage,
    branchName,
    commitHash,
    authorName,
    status,
    start,
    duration,
  } = buildInfo;

  const cardStatusClasses = {
    'card-ci-run_status_success': status === 'Success',
    'card-ci-run_status_running': status === 'InProgress',
    'card-ci-run_status_fail': status === 'Fail',
  };

  return (
    <Link
      to={`/details/${buildNumber}`}
      className={clsx(cn('card-ci-run', props), cardStatusClasses)}
      tabIndex="0"
    >
      <span className="icon card-ci-run__status-icon"></span>
      <div className="card-ci-run__info">
        <div className="card-ci-run__heading card-ci-run__heading">
          <div className="card-ci-run__heading-number">#{buildNumber}</div>
          <div className="card-ci-run__heading-message">{commitMessage}</div>
        </div>
        <div className="card-ci-run__commit-info">
          <IconText
            className="card-ci-run__commit-info-elem"
            icon={<Icon mods={{ type: 'commit' }} mix={['icon-text']} />}
            text={branchName}
            secondaryText={commitHash}
          ></IconText>
          <IconText
            className="card-ci-run__commit-info-elem"
            icon={<Icon mods={{ type: 'user' }} mix={['icon-text']} />}
            text={authorName}
          ></IconText>
        </div>
      </div>
      <div className="card-ci-run__meta">
        <IconText
          className="card-ci-run__meta-elem"
          icon={<Icon mods={{ type: 'calendar' }} mix={['icon-text']} />}
          text={new Date(start).toLocaleDateString()} //21 янв, 03:06
        ></IconText>
        <IconText
          className="card-ci-run__meta-elem"
          icon={<Icon mods={{ type: 'stopwatch' }} mix={['icon-text']} />}
          text={duration.toString()} // 1 ч 20 мин
        ></IconText>
      </div>
    </Link>
  );
}

CardCiRun.propTypes = {
  buildInfo: PropTypes.exact({
    buildNumber: PropTypes.number,
    commitMessage: PropTypes.string,
    branchName: PropTypes.string,
    commitHash: PropTypes.string,
    authorName: PropTypes.string,
    status: PropTypes.string,
    start: PropTypes.string,
    duration: PropTypes.number,
  }).isRequired,
  mods: PropTypes.shape({
    details: PropTypes.bool,
  }),
  mix: PropTypes.arrayOf(PropTypes.string),
};

export default CardCiRun;
