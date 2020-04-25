import React from 'react';
import { cn, CNProps } from '../../../utils/bem-cn';

import './TextField.css';

type TextFieldMods = {
  required?: boolean;
  row?: boolean;
};

type Props = {
  appendText?: string;
};

export type TextFieldProps = Props & React.HTMLProps<HTMLLabelElement> & CNProps<TextFieldMods>;

const TextField: React.FC<TextFieldProps> = (props) => {
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
};

export default TextField;
