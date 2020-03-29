import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link } from '@reach/router';
import { cn } from 'utils/bem-cn';
import { format } from 'date-fns';

import Icon from 'components/base/Icon/Icon';
import IconText from 'components/base/IconText/IconText';

import './CardCiRun.css';

function CardCiRun(props) {
  const { buildInfo } = props;
  const {
    id,
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
    'card-ci-run_status_running': status === 'InProgress' || status === 'Waiting',
    'card-ci-run_status_fail': status === 'Fail' || status === 'Canceled',
  };

  const formatTime = (duration) => {
    const durationInMinutes = Math.round(duration / 60);
    const minutes = durationInMinutes % 60;
    const hours = (durationInMinutes - minutes) / 60;
    return hours ? `${hours} h ${minutes} min` : `${minutes} min`;
  };

  return (
    <Link
      to={`/details/${id}`}
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
      {start && (
        <div className="card-ci-run__meta">
          <IconText
            className="card-ci-run__meta-elem"
            icon={<Icon mods={{ type: 'calendar' }} mix={['icon-text']} />}
            text={format(new Date(start), 'dd LLL, kk:mm')} //21 янв, 03:06
          ></IconText>
          {duration && (
            <IconText
              className="card-ci-run__meta-elem"
              icon={<Icon mods={{ type: 'stopwatch' }} mix={['icon-text']} />}
              text={formatTime(duration)} // 1 ч 20 мин
            ></IconText>
          )}
        </div>
      )}
    </Link>
  );
}

CardCiRun.propTypes = {
  buildInfo: PropTypes.shape({
    id: PropTypes.string,
    buildNumber: PropTypes.number,
    commitMessage: PropTypes.string,
    commitHash: PropTypes.string,
    branchName: PropTypes.string,
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
