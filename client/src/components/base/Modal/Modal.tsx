import React from 'react';
import ReactModal from 'react-modal';
import { cn, CNProps } from 'utils/bem-cn';

import './Modal.css';

ReactModal.setAppElement('#root');

export type ModalProps = ReactModal.Props & CNProps;

const Modal: React.FC<ModalProps> = (props) => {
  const { children, ...modalProps } = props;
  return (
    <ReactModal
      {...modalProps}
      className={cn('modal', props)}
      overlayClassName="modal-overlay typography"
    >
      {children || 'Example Modal'}
    </ReactModal>
  );
};

export default Modal;
