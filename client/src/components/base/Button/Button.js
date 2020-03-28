import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { cn } from 'utils/bem-cn';

import './Button.css';

function Button(props) {
  const { type = 'button', to = '', children, icon, mods = {}, ...buttonProps } = props;

  return to ? (
    <Link
      {...buttonProps}
      to={to}
      className={cn('button', props)}
      tabIndex={mods.disabled ? -1 : 0}
    >
      {icon}
      <div className="button__text">{children}</div>
    </Link>
  ) : (
    <button {...buttonProps} type={type} className={cn('button', props)} disabled={mods.disabled}>
      {icon}
      <div className="button__text">{children}</div>
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.string,
  to: PropTypes.string,
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
