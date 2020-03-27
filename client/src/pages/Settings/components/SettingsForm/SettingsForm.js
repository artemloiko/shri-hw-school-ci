import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/base/Input/Input';
import TextField from 'components/common/TextField/TextField';
import Button from 'components/base/Button/Button';
import Form, { FormInputGroup, FormSubmitGroup } from 'components/common/Form/Form';
import { Formik } from 'formik';

import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/common/Loader/Loader';

function SettingsForm(props) {
  const settings = useSelector((state) => state.settings);

  return (
    <Formik
      initialValues={{
        repoName: settings.repoName || '',
        buildCommand: settings.buildCommand || '',
        mainBranch: settings.mainBranch || '',
        period: settings.period || '',
      }}
      validate={(values) => {
        const errors = {};
        const requiredFields = ['repoName', 'buildCommand', 'mainBranch'];
        requiredFields.forEach((field) => {
          if (!values[field]) errors[field] = 'Required';
        });
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        const settingsDTO = { ...values, period: Number(values.period) };

        setTimeout(() => {
          alert(JSON.stringify(settingsDTO, null, 2));
          setSubmitting(false);
        }, 1000);
      }}
    >
      {(formikBag) => {
        const { getFieldProps, handleSubmit, isSubmitting, setFieldValue, errors } = formikBag;
        return (
          <Loader isLoading={isSubmitting}>
            <Form {...props} onSubmit={handleSubmit}>
              <FormInputGroup>
                <TextField
                  label="GitHub repository"
                  htmlFor="repoName"
                  mods={{ required: true }}
                  mix={['form']}
                >
                  <Input
                    mods={{ clear: true, fullwidth: true }}
                    mix={['textfield']}
                    placeholder="user-name/repo-name"
                    id="repoName"
                    required
                    setFieldValue={setFieldValue}
                    {...getFieldProps('repoName')}
                  ></Input>
                  {errors.repoName}
                </TextField>

                <TextField
                  label=" Build command"
                  htmlFor="buildCommand"
                  mods={{ required: true }}
                  mix={['form']}
                >
                  <Input
                    mods={{ clear: true, fullwidth: true }}
                    mix={['textfield']}
                    placeholder="npm run build"
                    id="buildCommand"
                    required
                    setFieldValue={setFieldValue}
                    {...getFieldProps('buildCommand')}
                  ></Input>
                </TextField>

                <TextField
                  label="Main branch"
                  htmlFor="mainBranch"
                  mods={{ required: true }}
                  mix={['form']}
                >
                  <Input
                    mods={{ clear: true, fullwidth: true }}
                    mix={['textfield']}
                    placeholder="master"
                    id="mainBranch"
                    required
                    setFieldValue={setFieldValue}
                    {...getFieldProps('mainBranch')}
                  ></Input>
                </TextField>
              </FormInputGroup>
              <FormInputGroup>
                <TextField
                  label="Synchronize every"
                  htmlFor="period"
                  mods={{ row: true }}
                  mix={['form']}
                  appendText="minutes"
                >
                  <Input
                    mods={{ counter: true }}
                    mix={['textfield']}
                    inputMode="numeric"
                    placeholder="10"
                    id="period"
                    setFieldValue={setFieldValue}
                    {...getFieldProps('period')}
                  ></Input>
                </TextField>
              </FormInputGroup>
              <FormSubmitGroup>
                <Button
                  type="submit"
                  mods={{ action: true, disabled: isSubmitting }}
                  className="form__submit-group-elem"
                >
                  Save
                </Button>
                <Button
                  to="/"
                  className="form__submit-group-elem"
                  mods={{ disabled: isSubmitting }}
                >
                  Cancel
                </Button>
              </FormSubmitGroup>
            </Form>
          </Loader>
        );
      }}
    </Formik>
  );
}

SettingsForm.propTypes = {
  className: PropTypes.string,
  settings: PropTypes.object,
};

export default SettingsForm;
