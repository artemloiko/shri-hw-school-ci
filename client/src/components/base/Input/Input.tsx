import React, { useCallback, useRef } from 'react';
import { cn, CNProps } from 'utils/bem-cn';

import './Input.css';

export type InputMods = {
  fullwidth?: boolean;
  clear?: boolean;
  counter?: boolean;
};

type Props = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  setFieldValue: (name: string, value: any) => void;
};

export type InputProps = React.HTMLProps<HTMLInputElement> & CNProps<InputMods> & Props;

const Input: React.FC<InputProps> = (props) => {
  const { setFieldValue, mods = {}, className, mix, ...inputProps } = props;
  const { name, onBlur } = inputProps;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(
    (e) => {
      if (e.type === 'keydown' && e.key !== ' ' && e.key !== 'Enter') {
        return;
      }
      e.preventDefault();
      name && setFieldValue(name, '');
      inputRef?.current?.focus();
    },
    [setFieldValue, name],
  );

  const handleBlur = useCallback(
    (e) => {
      if (e.target.value && name) {
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
