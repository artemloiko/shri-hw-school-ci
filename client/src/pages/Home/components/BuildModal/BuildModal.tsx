import React from 'react';

import Modal from '../../../../components/base/Modal/Modal';
import BuildForm from '../BuildForm/BuildForm';

import './BuildModal.css';

type BuildModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const BuildModal: React.FC<BuildModalProps> = (props) => {
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
};

export default BuildModal;
