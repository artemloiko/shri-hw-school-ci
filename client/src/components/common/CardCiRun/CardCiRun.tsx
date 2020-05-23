import React from 'react';
import clsx from 'clsx';
import { Link } from '@reach/router';
import { useTranslation } from 'react-i18next';
import { cn, CNProps } from '../../../utils/bem-cn';
import { formatTime } from '../../../utils/formatTime';

import IconText from '../../base/IconText/IconText';

import './CardCiRun.css';
import { BuildModel } from 'typings';

type CardCiRunMods = {
  details?: boolean;
};

type Props = {
  buildInfo: BuildModel;
};
type CardCiRunProps = Props & CNProps<CardCiRunMods>;

const CardCiRun: React.FC<CardCiRunProps> = (props) => {
  const { i18n, t } = useTranslation();

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

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(i18n.language, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
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
            text={formatDate(new Date(start))}
          ></IconText>
          {typeof duration === 'number' && (
            <IconText
              className="card-ci-run__meta-elem"
              iconType="stopwatch"
              text={formatTime(duration, t)}
            ></IconText>
          )}
        </div>
      )}
    </Link>
  );
};

export default CardCiRun;
