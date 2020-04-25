import React from 'react';
import { Link as RouterLink } from '@reach/router';
import { cn, CNProps } from '../../../utils/bem-cn';

import './Link.css';

export type LinkProps = { to?: string; children: any } & CNProps;

const Link: React.FC<LinkProps> = (props) => {
  const { to = '', children } = props;

  return (
    <RouterLink to={to} className={cn('link', props)}>
      {children}
    </RouterLink>
  );
};

export default Link;
