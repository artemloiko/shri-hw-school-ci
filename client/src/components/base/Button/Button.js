import React from 'react';
import PropTypes from 'prop-types';
import { cn } from 'utils/bem-cn';

import './Button.css';

function Button(props) {
  const { type, href, children, icon } = props;

  return type ? (
    <button type={type} className={cn('button', props)}>
      {icon}
      <div className="button__text">{children}</div>
    </button>
  ) : (
    <a href={href} className={cn('button', props)}>
      {icon}
      <div className="button__text">{children}</div>
    </a>
  );
}

Button.propTypes = {
  type: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.string,
  icon: PropTypes.element,
  className: PropTypes.string,
  mods: PropTypes.shape({
    size: PropTypes.oneOf(['small']),
    icon: PropTypes.bool,
    action: PropTypes.bool,
    'mini-desktop': PropTypes.bool,
  }),
  mix: PropTypes.arrayOf(PropTypes.string),
};

export default Button;
