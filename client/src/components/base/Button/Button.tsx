import React from 'react';
import { Link } from '@reach/router';
import { cn, CNProps } from '../../../utils/bem-cn';

import Icon, { IconTypes } from '../Icon/Icon';

import './Button.css';

type ButtonMods = {
  size?: 'small';
  icon?: boolean;
  action?: boolean;
  'mini-desktop'?: boolean;
  'icon-only'?: boolean;
  disabled?: boolean;
};

type ButtonCommonProps = {
  children: string;
  iconType?: IconTypes;
} & CNProps<ButtonMods>;

type ButtonDefaultProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonLinkProps = { to: string; replace?: boolean } & React.HTMLAttributes<HTMLAnchorElement>;
type ComponentProps = ButtonDefaultProps | ButtonLinkProps;

type ButtonProps = ButtonCommonProps & ComponentProps;

const Button: React.FC<ButtonProps> = (props) => {
  const { children, iconType, mods = {}, className, mix, ...restProps } = props;
  const componentProps = restProps as ComponentProps;
  if (iconType) mods.icon = true;

  const buttonClass = cn('button', { className, mods, mix });
  const buttonContent = (
    <>
      {iconType && <Icon mods={{ size: 'small', type: iconType }} mix={['button']} />}
      <div className="button__text">{children}</div>
    </>
  );

  // type guard to pass correct props to component
  return 'to' in componentProps ? (
    <Link {...componentProps} className={buttonClass} tabIndex={mods.disabled ? -1 : 0}>
      {buttonContent}
    </Link>
  ) : (
    <button {...componentProps} className={buttonClass} disabled={mods.disabled}>
      {buttonContent}
    </button>
  );
};

export default Button;
