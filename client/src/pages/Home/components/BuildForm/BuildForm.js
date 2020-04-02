import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import { Formik } from 'formik';

import Input from 'components/base/Input/Input';
import Button from 'components/base/Button/Button';
import Loader from 'components/common/Loader/Loader';
import ErrorModal from 'components/common/ErrorModal/ErrorModal';

import { addBuild, updateBuildsList } from 'actions/BuildsAction';

import './BuildForm.css';

function BuildForm(props) {
  const { closeModal, className } = props;

  const dispatch = useDispatch();
  const [error, setError] = useState({ isOpen: false });

  return (
    <>
      <Formik
        initialValues={{
          commitHash: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.commitHash) {
            errors.period = 'Commit hash is required';
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const data = await addBuild(values.commitHash);
            dispatch(updateBuildsList(data));
            navigate(`/details/${data.id}`);
          } catch (error) {
            setError({ isOpen: true, message: error?.response?.data?.error.message });
          }
          resetForm();
          setSubmitting(false);
        }}
      >
        {(formikBag) => {
          const { getFieldProps, handleSubmit, isSubmitting, setFieldValue } = formikBag;
          return (
            <Loader isLoading={isSubmitting} showContent style={{ width: '30%' }}>
              <form className={`build-form ${className}`} onSubmit={handleSubmit}>
                <Input
                  mods={{ clear: true, fullwidth: true }}
                  placeholder="Commit hash"
                  id="commitHash"
                  setFieldValue={setFieldValue}
                  {...getFieldProps('commitHash')}
                  required
                  pattern="\w{6,}"
                  title="Hash 6 letters/numbers"
                ></Input>
                <div className="build-form__submit-group build-modal__elem">
                  <Button
                    type="submit"
                    mods={{ action: true, disabled: isSubmitting }}
                    className="build-form__submit-group-elem"
                  >
                    Run build
                  </Button>
                  <Button
                    className="build-form__submit-group-elem"
                    mods={{ disabled: isSubmitting }}
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Loader>
          );
        }}
      </Formik>
      <ErrorModal
        isOpen={error.isOpen}
        errorMessage={error.message}
        closeModal={() => {
          setError({ isOpen: false });
        }}
      ></ErrorModal>
    </>
  );
}

BuildForm.propTypes = {
  closeModal: PropTypes.func,
  className: PropTypes.string,
};

export default BuildForm;
