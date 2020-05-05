import React from 'react';
import { cn, CNProps } from '../../../utils/bem-cn';

import './Icon.css';

export type IconTypes =
  | 'commit'
  | 'calendar'
  | 'stopwatch'
  | 'user'
  | 'rebuild'
  | 'play'
  | 'settings';

type IconModsType = {
  size?: 'small';
  type: IconTypes;
};

type IconProps = CNProps<IconModsType> & React.HTMLAttributes<HTMLDivElement>;

const Icon: React.FC<IconProps> = (props) => {
  const { mods, className, mix, ...restProps } = props;

  return <div {...restProps} className={cn('icon', { mods, className, mix })}></div>;
};

export default Icon;
