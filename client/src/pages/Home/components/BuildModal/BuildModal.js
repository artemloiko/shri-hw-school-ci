import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import { Formik } from 'formik';

import Modal from 'components/base/Modal/Modal';
import Input from 'components/base/Input/Input';
import Button from 'components/base/Button/Button';
import Loader from 'components/common/Loader/Loader';
import ErrorModal from 'components/common/ErrorModal/ErrorModal';

import { addBuild, updateBuildsList } from 'actions/BuildsAction';

import './BuildModal.css';

function BuildModal(props) {
  const { closeModal, isOpen } = props;

  const dispatch = useDispatch();
  const [error, setError] = useState({ isOpen: false });
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="New build"
      className="build-modal"
    >
      <h2 className="typography__headline3 build-modal__elem">New build</h2>
      <p className="typography__body2 build-modal__elem">
        Enter the commit hash which you want to build.
      </p>
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
              <form className="build-modal__form build-modal__elem" onSubmit={handleSubmit}>
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
                <div className="build-modal__form-submit-group build-modal__elem">
                  <Button
                    type="submit"
                    mods={{ action: true, disabled: isSubmitting }}
                    className="build-modal__form-submit-group-elem"
                  >
                    Run build
                  </Button>
                  <Button
                    className="build-modal__form-submit-group-elem"
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
    </Modal>
  );
}

BuildModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func,
};

export default BuildModal;
