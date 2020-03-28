import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/base/Modal/Modal';
import Button from 'components/base/Button/Button';

import './ErrorModal.css';

function ErrorModal(props) {
  const { errorMessage = 'Something get wrong!', closeModal } = props;

  return (
    <Modal
      {...props}
      className="error-modal"
      contentLabel="Something get wrong"
      onRequestClose={closeModal}
    >
      <div className="f-modal-icon f-modal-error animate error-modal__elem">
        <span className="f-modal-x-mark">
          <span className="f-modal-line f-modal-left animateXLeft"></span>
          <span className="f-modal-line f-modal-right animateXRight"></span>
        </span>
        <div className="f-modal-placeholder"></div>
        <div className="f-modal-fix"></div>
      </div>
      <h2 className="typography__headline3 error-modal__elem">Error</h2>
      <p className="typography__body2 error-modal__elem">{errorMessage}</p>
      <Button onClick={closeModal} className="error-modal__elem">
        Close
      </Button>
    </Modal>
  );
}

ErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  closeModal: PropTypes.func,
};

export default ErrorModal;
