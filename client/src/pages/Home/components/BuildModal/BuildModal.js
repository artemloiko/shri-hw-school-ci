import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/base/Modal/Modal';
import Input from 'components/base/Input/Input';
import Button from 'components/base/Button/Button';
import Loader from 'components/common/Loader/Loader';
import { Formik } from 'formik';

import './BuildModal.css';

function BuildModal(props) {
  const { closeModal, isOpen } = props;
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
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setTimeout(() => {
            alert('submit', values);
            setSubmitting(false);
            resetForm();
          }, 2000);
        }}
      >
        {(formikBag) => {
          const { getFieldProps, handleSubmit, isSubmitting, setFieldValue } = formikBag;
          return (
            <Loader isLoading={isSubmitting} showContent>
              <form className="build-modal__form build-modal__elem" onSubmit={handleSubmit}>
                <Input
                  mods={{ clear: true, fullwidth: true }}
                  placeholder="Commit hash"
                  id="commitHash"
                  required
                  setFieldValue={setFieldValue}
                  {...getFieldProps('commitHash')}
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
    </Modal>
  );
}

BuildModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func,
};

export default BuildModal;
