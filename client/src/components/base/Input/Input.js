import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from 'utils/bem-cn';

import './Input.css';

function Input(props) {
  const { setFieldValue, mods = {}, className, mix, ...inputProps } = props;
  const { name, onBlur } = inputProps;
  const inputRef = useRef();

  const handleClear = useCallback(
    (e) => {
      if (e.type === 'keydown' && e.key !== ' ' && e.key !== 'Enter') {
        return;
      }
      e.preventDefault();
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
    <div className={cn('input', { className, mods, mix })}>
      <input {...inputProps} className="input__text" ref={inputRef} onBlur={handleBlur} />
      {mods.clear && (
        <div
          className="input__clear-btn"
          tabIndex="0"
          onClick={handleClear}
          onKeyDown={handleClear}
          role="button"
          aria-label="Clear input"
        ></div>
      )}
    </div>
  );
}

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  inputMode: PropTypes.string,
  required: PropTypes.bool,
  pattern: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,

  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,

  className: PropTypes.string,
  mods: PropTypes.shape({
    fullwidth: PropTypes.bool,
    clear: PropTypes.bool,
    counter: PropTypes.bool,
  }),
  mix: PropTypes.arrayOf(PropTypes.string),
};

export default Input;
