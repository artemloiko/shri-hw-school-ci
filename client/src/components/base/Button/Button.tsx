import React from 'react';
import { Link } from '@reach/router';
import { cn, CNProps } from 'utils/bem-cn';

import Icon, { IconTypes } from 'components/base/Icon/Icon';

import './Button.css';

export type ButtonMods = {
  size?: 'small';
  icon?: boolean;
  action?: boolean;
  'mini-desktop'?: boolean;
  'icon-only'?: boolean;
  disabled?: boolean;
};

export interface ButtonProps {
  type?: 'submit' | 'reset' | 'button' | undefined;
  to?: string;
  children: string;
  iconType: IconTypes;
}

const Button: React.FC<ButtonProps & CNProps<ButtonMods>> = (props) => {
  const {
    type = 'button',
    to = '',
    children,
    iconType,
    mods = {},
    className,
    mix,
    ...buttonProps
  } = props;
  if (iconType) mods.icon = true;

  return to ? (
    <Link
      {...buttonProps}
      to={to}
      className={cn('button', { className, mods, mix })}
      tabIndex={mods.disabled ? -1 : 0}
    >
      {iconType && <Icon mods={{ size: 'small', type: iconType }} mix={['button']} />}
      <div className="button__text">{children}</div>
    </Link>
  ) : (
    <button
      {...buttonProps}
      type={type}
      className={cn('button', { className, mods, mix })}
      disabled={mods.disabled}
    >
      {iconType && <Icon mods={{ size: 'small', type: iconType }} mix={['button']} />}
      <div className="button__text">{children}</div>
    </button>
  );
};

export default Button;
