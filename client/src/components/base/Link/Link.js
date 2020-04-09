import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from '@reach/router';
import { cn } from 'utils/bem-cn';

import './Link.css';

function Link(props) {
  const { to = '', children } = props;

  return (
    <RouterLink to={to} className={cn('link', props)}>
      {children}
    </RouterLink>
  );
}

Link.propTypes = {
  to: PropTypes.string,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  mix: PropTypes.arrayOf(PropTypes.string),
};

export default Link;
