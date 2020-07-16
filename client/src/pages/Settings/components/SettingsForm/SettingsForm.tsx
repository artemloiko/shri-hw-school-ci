import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';

import Input from '../../../../components/base/Input/Input';
import Button from '../../../../components/base/Button/Button';
import TextField from '../../../../components/base/TextField/TextField';
import Loader from '../../../../components/common/Loader/Loader';
import Form, { FormInputGroup, FormSubmitGroup } from '../../../../components/common/Form/Form';

import { RootState } from 'redux/modules/root';
import { setSettings } from 'redux/modules/settings';
import { fetchBuildsListIfNeeded } from 'actions/BuildsAction';

type SettingsFormProps = React.ComponentProps<typeof Form>;

interface SettingsFormValues {
  repoName: string;
  buildCommand: string;
  mainBranch: string;
  period: string;
}

const SettingsForm: React.FC<SettingsFormProps> = (props) => {
  const { t } = useTranslation();

  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  const initialValues: SettingsFormValues = {
    repoName: settings.repoName || '',
    buildCommand: settings.buildCommand || '',
    mainBranch: settings.mainBranch || '',
    period: settings.period ? String(settings.period) : '',
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
        const requiredFieldsLabels = [t('Repository name'), t('Build Command'), t('Main branch')];
        requiredFields.forEach((field, i) => {
          if (!values[field])
            errors[field] = t('{{fieldName}} is required', { fieldName: requiredFieldsLabels[i] });
        });

        if (values.period && !/^\d+$/.test(values.period)) {
          errors.period = t('Period should be a number');
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        const settingsDTO = { ...values, period: Number(values.period) };
        dispatch(
          setSettings(settingsDTO, (success) => {
            if (success) dispatch(fetchBuildsListIfNeeded());
            setSubmitting(false);
          }),
        );
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
          values,
        } = formikBag;

        const getSynchronizationTranslates = (count = '0') => {
          const period = Number(count) || 10;
          const synchronizationPhrase = t('Synchronize every {{count}} minutes', {
            count: period,
          });
          return {
            label: synchronizationPhrase.split(period.toString())[0],
            appendText: synchronizationPhrase.split(period.toString())[1],
          };
        };

        return (
          <Loader isLoading={isSubmitting} showContent>
            <Form {...props} onSubmit={handleSubmit}>
              <FormInputGroup>
                <TextField
                  label={t('GitHub repository')}
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
                  label={t('Build command')}
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
                  label={t('Main branch')}
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
                  label={getSynchronizationTranslates(values.period).label}
                  htmlFor="period"
                  mods={{ row: true }}
                  mix={['form']}
                  appendText={getSynchronizationTranslates(values.period).appendText}
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
                  {t('Save')}
                </Button>
                <Button
                  to="/"
                  className="form__submit-group-elem"
                  mods={{ disabled: isSubmitting }}
                >
                  {t('Cancel')}
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
