import React from 'react';
import { cn, CNProps } from 'utils/bem-cn';

import './Form.css';

export type FormProps = CNProps & React.PropsWithoutRef<JSX.IntrinsicElements['form']>;

const Form: React.FC<FormProps> = (props) => {
  const { children } = props;
  return (
    <form {...props} className={cn('form', props)}>
      {children}
    </form>
  );
};

const FormInputGroup: React.FC<CNProps> = (props) => {
  const { children } = props;
  return <div className="form__input-group">{children}</div>;
};

const FormSubmitGroup: React.FC<CNProps> = (props) => {
  const { children } = props;
  return <div className="form__submit-group">{children}</div>;
};

export { FormInputGroup, FormSubmitGroup };
export default Form;
