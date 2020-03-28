import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/base/Button/Button';
import CardCiRun from 'components/common/CardCiRun/CardCiRun';

import './BuildHistory.css';

function BuildHistory(props) {
  const { builds = [] } = props;
  const buildsCards = builds.map((build) => (
    <CardCiRun className="build-history__card" buildInfo={build} key={build.id}></CardCiRun>
  ));
  return (
    <div className="build-history">
      {builds.length ? (
        <>
          {buildsCards}
          <Button mods={{ 'mini-desktop': true }} className="build-history__pagination">
            Show more
          </Button>
        </>
      ) : (
        <h3 className="typography__headline4">No builds.</h3>
      )}
    </div>
  );
}

BuildHistory.propTypes = {
  builds: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      buildNumber: PropTypes.number.isRequired,
      commitMessage: PropTypes.string.isRequired,
      commitHash: PropTypes.string.isRequired,
      branchName: PropTypes.string.isRequired,
      authorName: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      start: PropTypes.string,
      duration: PropTypes.number,
    }),
  ),
};

export default BuildHistory;
