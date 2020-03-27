import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from 'utils/bem-cn';

import './Input.css';

function Input(props) {
  const { setFieldValue, ...inputProps } = props;
  const { name, onBlur } = inputProps;
  const inputRef = useRef();

  const handleClear = useCallback(
    (e) => {
      if (e.type === 'keydown' && e.key !== ' ' && e.key !== 'Enter') {
        return;
      }
      setFieldValue(name, '');
      inputRef.current.focus();
    },
    [setFieldValue, name],
  );

  const handleBlur = useCallback(
    (e) => {
      if (e.target.value) {
        setFieldValue(name, e.target.value.trim());
      }
      onBlur(e);
    },
    [onBlur, setFieldValue, name],
  );

  return (
    <div className={cn('input', props)}>
      <input {...inputProps} className="input__text" ref={inputRef} onBlur={handleBlur} />
      {props.mods.clear && (
        <div
          className="input__clear-btn"
          tabIndex="0"
          onClick={handleClear}
          onKeyDown={handleClear}
        ></div>
      )}
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
