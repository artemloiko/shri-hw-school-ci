import React from 'react';
import PropTypes from 'prop-types';

import './IconText.css';

function IconText(props) {
  const { icon, secondaryText, children } = props;

  return (
    <div className="icon-text">
      {icon}
      <div className="icon-text__text">{children}</div>
      {secondaryText && (
        <div className="icon-text__text icon-text__secondary-text">{secondaryText}</div>
      )}
    </div>
  );
}

IconText.propTypes = {
  icon: PropTypes.element,
  secondaryText: PropTypes.string,
  children: PropTypes.string,
};

export default IconText;
