import React from 'react';
import PropTypes from 'prop-types';
import { cn } from 'utils/bem-cn';

import './Icon.css';

function Icon(props) {
  return <div className={cn('icon', props)}></div>;
}

Icon.propTypes = {
  className: PropTypes.string,
  mods: PropTypes.shape({
    size: PropTypes.oneOf(['small']),
    type: PropTypes.oneOf([
      'commit',
      'calendar',
      'stopwatch',
      'user',
      'rebuild',
      'play',
      'settings',
    ]).isRequired,
  }).isRequired,
  mix: PropTypes.arrayOf(PropTypes.string),
};

export default Icon;
