import React from 'react';
import { cn, CNProps } from '../../../utils/bem-cn';

import Icon, { IconTypes } from '../Icon/Icon';

import './IconText.css';

type IconTextProps = {
  iconType: IconTypes;
  text: string;
  secondaryText?: string;
} & CNProps &
  React.HTMLAttributes<HTMLDivElement>;

const IconText: React.FC<IconTextProps> = (props) => {
  const { iconType, text, secondaryText, mods, className, mix, ...restProps } = props;

  return (
    <div {...restProps} className={cn('icon-text', { mods, className, mix })}>
      <Icon mods={{ type: iconType }} mix={['icon-text']} />
      <div className="icon-text__text">{text}</div>
      {secondaryText && (
        <div className="icon-text__text icon-text__secondary-text">{secondaryText}</div>
      )}
    </div>
  );
};

export default IconText;
