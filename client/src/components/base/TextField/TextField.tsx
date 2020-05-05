import React from 'react';
import { cn, CNProps } from '../../../utils/bem-cn';

import './TextField.css';

type TextFieldMods = {
  required?: boolean;
  row?: boolean;
};

type Props = {
  label: string;
  appendText?: string;
};

type TextFieldProps = Props & CNProps<TextFieldMods> & React.LabelHTMLAttributes<HTMLLabelElement>;

const TextField: React.FC<TextFieldProps> = (props) => {
  const { htmlFor, label, children, appendText, mods, className, mix, ...restProps } = props;

  return (
    <div className={cn('textfield', { mods, className, mix })}>
      <label {...restProps} className="textfield__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {appendText && <div className="textfield__append">{appendText}</div>}
    </div>
  );
};

export default TextField;
