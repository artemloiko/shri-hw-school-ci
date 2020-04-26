import React, { ReactNode } from 'react';
import { Link as RouterLink } from '@reach/router';
import { cn, CNProps } from '../../../utils/bem-cn';

import './Link.css';

type LinkProps = {
  to: string;
  replace?: boolean;
  children: ReactNode;
} & CNProps &
  React.HTMLAttributes<HTMLAnchorElement>;

const Link: React.FC<LinkProps> = (props) => {
  const { children, to, mods, className, mix, ...restProps } = props;

  return (
    <RouterLink {...restProps} to={to} className={cn('link', { mods, className, mix })}>
      {children}
    </RouterLink>
  );
};

export default Link;
