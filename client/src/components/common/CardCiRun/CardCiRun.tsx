import React from 'react';
import clsx from 'clsx';
import { Link } from '@reach/router';
import { cn, CNProps } from 'utils/bem-cn';
import { formatTime } from 'utils/formatTime';
import { format } from 'date-fns';

import IconText from 'components/base/IconText/IconText';

import './CardCiRun.css';
import { BuildModel } from 'typings';

type CardCiRunMods = {
  details?: boolean;
};

export type CardCiRunProps = {
  buildInfo: BuildModel;
} & CNProps<CardCiRunMods>;

const CardCiRun: React.FC<CardCiRunProps> = (props) => {
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

  return (
    <Link
      to={`/details/${id}`}
      className={clsx(cn('card-ci-run', props), cardStatusClasses)}
      tabIndex={0}
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
            iconType="commit"
            text={branchName}
            secondaryText={commitHash}
          ></IconText>
          <IconText
            className="card-ci-run__commit-info-elem"
            iconType="user"
            text={authorName}
          ></IconText>
        </div>
      </div>
      {start && (
        <div className="card-ci-run__meta">
          <IconText
            className="card-ci-run__meta-elem"
            iconType="calendar"
            text={format(new Date(start), 'dd LLL, kk:mm')}
          ></IconText>
          {typeof duration === 'number' && (
            <IconText
              className="card-ci-run__meta-elem"
              iconType="stopwatch"
              text={formatTime(duration)}
            ></IconText>
          )}
        </div>
      )}
    </Link>
  );
};

export default CardCiRun;
