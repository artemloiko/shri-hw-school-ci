import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { cn } from 'utils/bem-cn';

import Icon from 'components/base/Icon/Icon';

import './Button.css';

function Button(props) {
  const { type = 'button', to = '', children, iconType, mods = {}, ...buttonProps } = props;
  if (iconType) mods.icon = true;

  return to ? (
    <Link
      {...buttonProps}
      to={to}
      className={cn('button', { ...props, mods })}
      tabIndex={mods.disabled ? -1 : 0}
    >
      {iconType && <Icon mods={{ size: 'small', type: iconType }} />}
      <div className="button__text">{children}</div>
    </Link>
  ) : (
    <button
      {...buttonProps}
      type={type}
      className={cn('button', { ...props, mods })}
      disabled={mods.disabled}
    >
      {iconType && <Icon mods={{ size: 'small', type: iconType }} />}
      <div className="button__text">{children}</div>
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.string,
  to: PropTypes.string,
  children: PropTypes.string,
  iconType: PropTypes.oneOf([
    'commit',
    'calendar',
    'stopwatch',
    'user',
    'rebuild',
    'play',
    'settings',
  ]),

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
