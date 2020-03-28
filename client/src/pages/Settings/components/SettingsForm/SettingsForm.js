import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/base/Input/Input';
import TextField from 'components/common/TextField/TextField';
import Button from 'components/base/Button/Button';
import Form, { FormInputGroup, FormSubmitGroup } from 'components/common/Form/Form';
import { Formik } from 'formik';

import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/common/Loader/Loader';
import { updateSettings } from 'actions/SettingsAction';
import api from 'utils/api';

function SettingsForm(props) {
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

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
        const requiredFieldsLabels = ['Repository name', 'Build Command', 'Main branch'];
        requiredFields.forEach((field, i) => {
          if (!values[field]) errors[field] = `${requiredFieldsLabels[i]} is required`;
        });
        if (values.period && !/^\d+$/.test(values.period)) {
          errors.period = 'Perios should be a number';
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const settingsDTO = { ...values, period: Number(values.period) };
        try {
          await api.setSettings(settingsDTO);
          dispatch(updateSettings(settingsDTO));
        } catch (err) {
          const { response } = err;
          const errorMessage = response?.data?.error?.message || err.message;
          const errorCode = response?.data?.error?.errorCode;
          console.log('Updating settings error', errorMessage, errorCode);
          alert(errorMessage);
        }
        setSubmitting(false);
      }}
    >
      {(formikBag) => {
        const {
          getFieldProps,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          errors,
          touched,
        } = formikBag;
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
                </TextField>

                <TextField
                  label="Build command"
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
                    pattern="\d+"
                    title="Only numbers"
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
              <FormInputGroup>
                {touched.repoName && errors.repoName && (
                  <p className="form__error typography__body1">{errors.repoName}</p>
                )}
                {touched.buildCommand && errors.buildCommand && (
                  <p className="form__error typography__body1">{errors.buildCommand}</p>
                )}
                {touched.mainBranch && errors.mainBranch && (
                  <p className="form__error typography__body1">{errors.mainBranch}</p>
                )}
                {touched.period && errors.period && (
                  <p className="form__error typography__body1">{errors.period}</p>
                )}
              </FormInputGroup>
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
