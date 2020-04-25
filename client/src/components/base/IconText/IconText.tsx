import React from 'react';
import { cn, CNProps } from '../../../utils/bem-cn';

import Icon, { IconTypes } from '../Icon/Icon';

import './IconText.css';

export type IconTextProps = CNProps & {
  iconType: IconTypes;
  text: string;
  secondaryText?: string;
};

const IconText: React.FC<IconTextProps> = (props) => {
  const { iconType, text, secondaryText } = props;

  return (
    <div className={cn('icon-text', props)}>
      <Icon mods={{ type: iconType }} mix={['icon-text']} />
      <div className="icon-text__text">{text}</div>
      {secondaryText && (
        <div className="icon-text__text icon-text__secondary-text">{secondaryText}</div>
      )}
    </div>
  );
};

export default IconText;
