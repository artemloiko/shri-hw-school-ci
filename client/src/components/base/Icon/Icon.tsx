import React from 'react';
import { cn, CNProps } from 'utils/bem-cn';

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

export type IconProps = CNProps<IconModsType>;

const Icon: React.FC<IconProps> = (props) => {
  return <div className={cn('icon', props)}></div>;
};

export default Icon;
