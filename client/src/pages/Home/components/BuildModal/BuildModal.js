import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/base/Modal/Modal';
import BuildForm from 'pages/Home/components/BuildForm/BuildForm';

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
      <BuildForm closeModal={closeModal} />
    </Modal>
  );
}

BuildModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func,
};

export default BuildModal;
