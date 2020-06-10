import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../../../../components/base/Modal/Modal';
import BuildForm from '../BuildForm/BuildForm';

import './BuildModal.css';

type BuildModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const BuildModal: React.FC<BuildModalProps> = (props) => {
  const { t } = useTranslation();
  const { closeModal, isOpen } = props;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel={t('New build')}
      className="build-modal"
    >
      <h2 className="typography__headline3 build-modal__elem">{t('New build')}</h2>
      <p className="typography__body2 build-modal__elem">
        {t('Enter the commit hash which you want to build')}
      </p>
      <BuildForm closeModal={closeModal} />
    </Modal>
  );
};

export default BuildModal;
