import React from 'react';
import PropTypes from 'prop-types';
import { cn } from 'utils/bem-cn';

import './Link.css';

function Link(props) {
  const { href, children } = props;

  return (
    <a href={href} className={cn('link', props)}>
      {children}
    </a>
  );
}

Link.propTypes = {
  href: PropTypes.string,
  children: PropTypes.any.isRequired,
};

export default Link;
