import React, { useCallback, useRef } from 'react';
import { cn, CNProps } from '../../../utils/bem-cn';

import './Input.css';

type InputMods = {
  fullwidth?: boolean;
  clear?: boolean;
  counter?: boolean;
};

type Props = {
  setFieldValue: (name: string, value: string | number) => void;
};

type InputProps = Props & CNProps<InputMods> & React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = (props) => {
  const { setFieldValue, mods = {}, className, mix, name, onBlur, ...inputProps } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(
    (e) => {
      if (e.type === 'keydown' && e.key !== ' ' && e.key !== 'Enter') {
        return;
      }
      e.preventDefault();
      if (name) {
        setFieldValue(name, '');
        inputRef?.current?.focus();
      }
    },
    [setFieldValue, name],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.currentTarget.value && name) {
        setFieldValue(name, e.currentTarget.value.trim());
      }
      if (onBlur) onBlur(e);
    },
    [onBlur, setFieldValue, name],
  );

  return (
    <div className={cn('input', { className, mods, mix })}>
      <input {...inputProps} className="input__text" ref={inputRef} onBlur={handleBlur} />
      {mods.clear && (
        <div
          className="input__clear-btn"
          tabIndex={0}
          onClick={handleClear}
          onKeyDown={handleClear}
          role="button"
          aria-label="Clear input"
        ></div>
      )}
    </div>
  );
};

export default Input;
