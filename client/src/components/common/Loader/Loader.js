import React from 'react';
import PropTypes from 'prop-types';
import { cn } from 'utils/bem-cn';

import './Loader.css';

function Loader(props) {
  const { children, isLoading, showContent, ...loaderProps } = props;
  return (
    <>
      {isLoading && (
        <div {...loaderProps} className={cn('loader', props)}>
          <div className="cat">
            <div className="cat__body"></div>
            <div className="cat__body"></div>
            <div className="cat__tail"></div>
            <div className="cat__head"></div>
          </div>
        </div>
      )}
      {isLoading && !showContent ? null : children}
    </>
  );
}

Loader.propTypes = {
  children: PropTypes.any.isRequired,
  isLoading: PropTypes.bool.isRequired,
  showContent: PropTypes.bool,
  mods: PropTypes.shape({
    static: PropTypes.bool,
  }),
};

export default Loader;
