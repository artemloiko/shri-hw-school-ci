import React from 'react';
import PropTypes from 'prop-types';
import { cn } from 'utils/bem-cn';

import './Input.css';

function Input(props) {
  return (
    <div className={cn('input', props)}>
      <input {...props} className="input__text" />
      {props.mods.clear && <div className="input__clear-btn" tabIndex="0"></div>}
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  inputMode: PropTypes.string,

  className: PropTypes.string,
  mods: PropTypes.shape({
    fullwidth: PropTypes.bool,
    clear: PropTypes.bool,
    counter: PropTypes.bool,
  }),
  mix: PropTypes.arrayOf(PropTypes.string),
};

export default Input;
