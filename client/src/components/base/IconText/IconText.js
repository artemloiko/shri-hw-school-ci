import React from 'react';
import PropTypes from 'prop-types';
import { cn } from 'utils/bem-cn';

import './IconText.css';

function IconText(props) {
  const { icon, text, secondaryText } = props;

  return (
    <div className={cn('icon-text', props)}>
      {icon}
      <div className="icon-text__text">{text}</div>
      {secondaryText && (
        <div className="icon-text__text icon-text__secondary-text">{secondaryText}</div>
      )}
    </div>
  );
}

IconText.propTypes = {
  icon: PropTypes.element,
  text: PropTypes.string,
  secondaryText: PropTypes.string,
  children: PropTypes.string,
};

export default IconText;
