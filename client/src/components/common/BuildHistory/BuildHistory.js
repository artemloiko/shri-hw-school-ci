import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/base/Button/Button';
import CardCiRun from 'components/common/CardCiRun/CardCiRun';

import './BuildHistory.css';

function BuildHistory(props) {
  const { builds } = props;
  return (
    <div className="build-history">
      {builds.map((build) => (
        <CardCiRun className="build-history__card" buildInfo={build} key={build.id}></CardCiRun>
      ))}
      <Button mods={{ 'mini-desktop': true }} className="build-history__pagination">
        Show more
      </Button>
    </div>
  );
}

BuildHistory.propTypes = {
  builds: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string,
      buildNumber: PropTypes.number,
      commitMessage: PropTypes.string,
      branchName: PropTypes.string,
      commitHash: PropTypes.string,
      authorName: PropTypes.string,
      status: PropTypes.string,
      start: PropTypes.string,
      duration: PropTypes.number,
    }),
  ),
};

export default BuildHistory;
