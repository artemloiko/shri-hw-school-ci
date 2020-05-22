import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal, { ModalProps } from '../../base/Modal/Modal';
import Button from '../../base/Button/Button';

import './ErrorModal.css';

type ErrorModalProps = ModalProps & {
  closeModal: () => void;
  errorMessage?: string;
};

const ErrorModal: React.FC<ErrorModalProps> = (props) => {
  const { t } = useTranslation();

  const { closeModal, errorMessage } = props;

  const errorMessageTranslated = t([
    `error.${errorMessage}`,
    errorMessage ? errorMessage : 'error.UNSPECIFIED',
  ]);

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
      <h2 className="typography__headline3 error-modal__elem">{t('Error')}</h2>
      <p className="typography__body2 error-modal__elem">{errorMessageTranslated}</p>
      <Button onClick={closeModal} className="error-modal__elem">
        {t('Close')}
      </Button>
    </Modal>
  );
};

export default ErrorModal;
