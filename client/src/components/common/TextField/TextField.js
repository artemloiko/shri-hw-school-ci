import React from 'react';
import PropTypes from 'prop-types';
import { cn } from 'utils/bem-cn';

import './TextField.css';

function TextField(props) {
  const { htmlFor, label, children, appendText } = props;

  return (
    <div className={cn('textfield', props)}>
      <label className="textfield__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {appendText && <div className="textfield__append">{appendText}</div>}
    </div>
  );
}

TextField.propTypes = {
  label: PropTypes.string,
  htmlFor: PropTypes.string,
  childre: PropTypes.element,

  className: PropTypes.string,
  mods: PropTypes.shape({
    required: PropTypes.bool,
    row: PropTypes.bool,
  }),
  mix: PropTypes.arrayOf(PropTypes.string),
};

export default TextField;
