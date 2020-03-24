import React from 'react';
import PropTypes from 'prop-types';
import { cn } from 'utils/bem-cn';

import './Form.css';

function Form(props) {
  const { children } = props;
  return (
    <form {...props} className={cn('form', props)}>
      {children}
    </form>
  );
}

Form.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
};

function FormInputGroup(props) {
  const { children } = props;
  return <div className="form__input-group">{children}</div>;
}

function FormSubmitGroup(props) {
  const { children } = props;
  return <div className="form__submit-group">{children}</div>;
}

export { FormInputGroup, FormSubmitGroup };
export default Form;
