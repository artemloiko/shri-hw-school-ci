import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, FormikErrors } from 'formik';

import Input from 'components/base/Input/Input';
import Button from 'components/base/Button/Button';
import TextField from 'components/base/TextField/TextField';
import Loader from 'components/common/Loader/Loader';
import Form, { FormInputGroup, FormSubmitGroup } from 'components/common/Form/Form';

import { updateSettings, updateSettingsFail } from 'actions/SettingsAction';
import { fetchBuildsListIfNeeded } from 'actions/BuildsAction';
import { RootState } from 'reducers';
import api from 'utils/api';

type SettingsFormProps = React.ComponentProps<typeof Form>;

interface SettingsFormValues {
  repoName: string;
  buildCommand: string;
  mainBranch: string;
  period: string;
}

const SettingsForm: React.FC<SettingsFormProps> = (props) => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  const initialValues: SettingsFormValues = {
    repoName: settings.repoName || '',
    buildCommand: settings.buildCommand || '',
    mainBranch: settings.mainBranch || '',
    period: String(settings.period) || '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const errors: FormikErrors<SettingsFormValues> = {};
        const requiredFields: (keyof SettingsFormValues)[] = [
          'repoName',
          'buildCommand',
          'mainBranch',
        ];
        const requiredFieldsLabels = ['Repository name', 'Build Command', 'Main branch'];
        requiredFields.forEach((field, i) => {
          if (!values[field]) errors[field] = `${requiredFieldsLabels[i]} is required`;
        });

        if (values.period && !/^\d+$/.test(values.period)) {
          errors.period = 'Period should be a number';
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const settingsDTO = { ...values, period: Number(values.period) };
        try {
          await api.setSettings(settingsDTO);
          dispatch(updateSettings(settingsDTO));
          dispatch(fetchBuildsListIfNeeded());
        } catch (err) {
          const { response } = err;
          const error = response?.data?.error || err;
          dispatch(updateSettingsFail(error));
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
          <Loader isLoading={isSubmitting} showContent>
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
};

export default SettingsForm;
